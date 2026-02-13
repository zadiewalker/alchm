"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrisisResources = exports.analyzeBatchContent = exports.triggerCrisisIntervention = exports.analyzeCrisisRisk = void 0;
const functions = __importStar(require("firebase-functions"));
const openai_1 = require("openai");
const firestore_1 = require("firebase-admin/firestore");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const db = (0, firestore_1.getFirestore)();
// Crisis detection AI prompt
const CRISIS_DETECTION_PROMPT = `You are a trained mental health crisis detection AI. Your role is to analyze text content and assess for crisis indicators that require immediate attention.

CRITICAL CRISIS INDICATORS:
- Direct suicidal ideation ("I want to die", "I'm going to kill myself")
- Specific suicide plans or methods mentioned
- Self-harm intentions or active self-injury
- Complete hopelessness with no future vision
- Psychotic breaks or severe disconnection from reality
- Emergency language ("help me", "I can't take this anymore")
- Substance abuse as escape mechanism
- Extreme isolation with no support system

RISK LEVELS:
- CRITICAL: Immediate danger to self or others, requires emergency intervention
- HIGH: Significant risk indicators, requires immediate professional check-in
- MEDIUM: Concerning patterns, requires supportive intervention
- LOW: Normal processing of difficult emotions

IMPORTANT GUIDELINES:
- Distinguish between processing trauma/grief vs. active crisis
- Consider context: journaling vs. reaching out for help
- Look for escalation patterns and urgency indicators
- Be sensitive to cultural and individual expression differences
- NEVER minimize genuine crisis indicators
- ALWAYS err on the side of caution for safety

Analyze the following content and provide a detailed crisis assessment:`;
exports.analyzeCrisisRisk = functions.https.onCall(async (data, context) => {
    try {
        const { content, userId, contentType } = data;
        if (!content || !userId) {
            throw new functions.https.HttpsError('invalid-argument', 'Content and userId are required');
        }
        // AI Analysis
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: CRISIS_DETECTION_PROMPT
                },
                {
                    role: 'user',
                    content: `Content Type: ${contentType || 'journal_entry'}
Content: "${content}"`
                }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });
        const analysis = JSON.parse(completion.choices[0].message.content || '{}');
        // Structure the assessment
        const assessment = {
            riskLevel: analysis.riskLevel || 'low',
            confidence: Math.min(Math.max(analysis.confidence || 0, 0), 1),
            indicators: analysis.indicators || [],
            recommendedAction: analysis.recommendedAction || 'monitor',
            reasoning: analysis.reasoning || '',
            suggestedResources: analysis.suggestedResources || []
        };
        // Save assessment to database
        const assessmentRef = await db.collection('crisis_assessments').add({
            userId,
            contentType: contentType || 'journal_entry',
            content: content.substring(0, 500), // Truncate for storage
            assessment,
            timestamp: firestore_1.FieldValue.serverTimestamp(),
            reviewed: false,
            interventionTriggered: false
        });
        // Trigger intervention if needed
        if (assessment.riskLevel === 'critical' || assessment.riskLevel === 'high') {
            await (0, exports.triggerCrisisIntervention)(userId, assessment, assessmentRef.id);
        }
        return {
            assessmentId: assessmentRef.id,
            riskLevel: assessment.riskLevel,
            recommendedAction: assessment.recommendedAction,
            suggestedResources: assessment.suggestedResources
        };
    }
    catch (error) {
        console.error('Crisis analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to analyze crisis risk');
    }
});
const triggerCrisisIntervention = async (userId, assessment, assessmentId) => {
    try {
        const interventionRef = await db.collection('crisis_interventions').add({
            userId,
            assessmentId,
            riskLevel: assessment.riskLevel,
            status: 'triggered',
            timestamp: firestore_1.FieldValue.serverTimestamp(),
            interventionType: getInterventionType(assessment.recommendedAction),
            completed: false,
            escalated: false
        });
        // Send immediate notification to user
        await sendCrisisNotification(userId, assessment);
        // Alert monitoring team for high/critical cases
        if (assessment.riskLevel === 'critical') {
            await alertCrisisTeam(userId, assessment, interventionRef.id);
        }
        return interventionRef.id;
    }
    catch (error) {
        console.error('Crisis intervention error:', error);
        throw error;
    }
};
exports.triggerCrisisIntervention = triggerCrisisIntervention;
const getInterventionType = (recommendedAction) => {
    switch (recommendedAction) {
        case 'emergency_response': return 'emergency';
        case 'immediate_intervention': return 'immediate';
        case 'check_in': return 'supportive';
        default: return 'monitoring';
    }
};
const sendCrisisNotification = async (userId, assessment) => {
    // Store notification in user's notifications collection
    await db.collection('users').doc(userId).collection('notifications').add({
        type: 'crisis_support',
        riskLevel: assessment.riskLevel,
        message: getCrisisMessage(assessment.riskLevel),
        resources: assessment.suggestedResources,
        timestamp: firestore_1.FieldValue.serverTimestamp(),
        read: false,
        urgent: assessment.riskLevel === 'critical'
    });
};
const getCrisisMessage = (riskLevel) => {
    switch (riskLevel) {
        case 'critical':
            return "We're concerned about your wellbeing. Please reach out to emergency services (988) or connect with a crisis counselor immediately.";
        case 'high':
            return "We notice you might be going through a difficult time. Would you like to connect with support resources or talk to someone?";
        case 'medium':
            return "Your wellbeing matters to us. Here are some resources that might help during this challenging time.";
        default:
            return "We're here to support your healing journey. Check out these resources for additional support.";
    }
};
const alertCrisisTeam = async (userId, assessment, interventionId) => {
    // In a production environment, this would:
    // 1. Send alerts to crisis response team
    // 2. Integrate with professional mental health services
    // 3. Log to crisis monitoring dashboard
    await db.collection('crisis_alerts').add({
        userId,
        interventionId,
        riskLevel: assessment.riskLevel,
        indicators: assessment.indicators,
        timestamp: firestore_1.FieldValue.serverTimestamp(),
        status: 'active',
        assignedTo: null,
        resolved: false
    });
    console.log(`CRISIS ALERT: User ${userId} requires immediate attention - Risk Level: ${assessment.riskLevel}`);
};
// Batch analysis for existing content
exports.analyzeBatchContent = functions.https.onCall(async (data, context) => {
    try {
        const { userId } = data;
        if (!userId) {
            throw new functions.https.HttpsError('invalid-argument', 'UserId is required');
        }
        // Get recent journal entries
        const journalSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('journal_entries')
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();
        const assessments = [];
        for (const doc of journalSnapshot.docs) {
            const entry = doc.data();
            if (entry.content) {
                try {
                    const result = await (0, exports.analyzeCrisisRisk)({
                        content: entry.content,
                        userId,
                        contentType: 'journal_entry'
                    }, context);
                    assessments.push(Object.assign({ entryId: doc.id }, result));
                }
                catch (error) {
                    console.error(`Error analyzing entry ${doc.id}:`, error);
                }
            }
        }
        return { assessments };
    }
    catch (error) {
        console.error('Batch analysis error:', error);
        throw new functions.https.HttpsError('internal', 'Failed to analyze batch content');
    }
});
// Get crisis resources based on assessment
exports.getCrisisResources = functions.https.onCall(async (data, context) => {
    const { riskLevel, location } = data;
    const resources = {
        emergency: [
            {
                name: "National Suicide Prevention Lifeline",
                phone: "988",
                description: "24/7 crisis support",
                urgent: true
            },
            {
                name: "Crisis Text Line",
                text: "Text HOME to 741741",
                description: "Text-based crisis support",
                urgent: true
            }
        ],
        immediate: [
            {
                name: "SAMHSA National Helpline",
                phone: "1-800-662-4357",
                description: "Mental health and substance abuse support",
                urgent: false
            },
            {
                name: "Crisis Text Line",
                text: "Text HOME to 741741",
                description: "Text-based crisis support",
                urgent: false
            }
        ],
        supportive: [
            {
                name: "National Alliance on Mental Illness",
                phone: "1-800-950-6264",
                description: "Mental health education and support",
                urgent: false
            },
            {
                name: "Mental Health America",
                website: "https://mhanational.org/finding-help",
                description: "Mental health resources and screening tools",
                urgent: false
            }
        ],
        monitoring: [
            {
                name: "Mindfulness Apps",
                description: "Calm, Headspace, Insight Timer for daily wellbeing",
                urgent: false
            },
            {
                name: "Mental Health America Screening",
                website: "https://screening.mhanational.org/",
                description: "Anonymous mental health screening tools",
                urgent: false
            }
        ]
    };
    const riskLevelMap = {
        critical: 'emergency',
        high: 'immediate',
        medium: 'supportive',
        low: 'monitoring'
    };
    return {
        resources: resources[riskLevelMap[riskLevel]] || resources.monitoring
    };
});
//# sourceMappingURL=crisisDetection.js.map