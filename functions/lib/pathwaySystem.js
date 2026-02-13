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
exports.adaptPathway = exports.getAvailablePathways = exports.getUserPathwayProgress = exports.completePathwayActivity = exports.startUserPathway = exports.createHealingPathway = void 0;
const functions = __importStar(require("firebase-functions"));
const openai_1 = require("openai");
const firestore_1 = require("firebase-admin/firestore");
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const db = (0, firestore_1.getFirestore)();
// Core healing pathway templates
const PATHWAY_TEMPLATES = {
    trauma_recovery: {
        title: "Gentle Trauma Recovery Journey",
        description: "A trauma-informed pathway focused on safety, stabilization, and post-traumatic growth",
        difficulty: 'gentle',
        duration: '90_days',
        learningObjectives: [
            "Develop emotional safety and grounding techniques",
            "Process traumatic experiences at your own pace",
            "Build resilience and post-traumatic growth",
            "Create a sustainable self-care practice"
        ]
    },
    anxiety_management: {
        title: "Anxiety Freedom Pathway",
        description: "Evidence-based strategies for understanding and managing anxiety",
        difficulty: 'moderate',
        duration: '30_days',
        learningObjectives: [
            "Understand anxiety's patterns and triggers",
            "Master breathing and grounding techniques",
            "Develop cognitive restructuring skills",
            "Build confidence in managing anxious moments"
        ]
    },
    depression_support: {
        title: "Rising from Darkness Journey",
        description: "Compassionate support for navigating depression with hope and practical tools",
        difficulty: 'gentle',
        duration: '90_days',
        learningObjectives: [
            "Recognize depression patterns without judgment",
            "Develop gentle self-care routines",
            "Build meaningful connections and support",
            "Cultivate hope and purpose in daily life"
        ]
    },
    grief_healing: {
        title: "Honoring Loss, Embracing Life",
        description: "A supportive journey through grief with space for all emotions",
        difficulty: 'gentle',
        duration: '90_days',
        learningObjectives: [
            "Honor your unique grief process",
            "Develop healthy ways to remember loved ones",
            "Build new meaning while preserving connection",
            "Navigate grief's impact on relationships"
        ]
    },
    self_compassion: {
        title: "Self-Compassion Awakening",
        description: "Transform inner criticism into loving kindness and acceptance",
        difficulty: 'moderate',
        duration: '21_days',
        learningObjectives: [
            "Recognize and interrupt self-critical patterns",
            "Develop self-compassionate inner dialogue",
            "Practice loving-kindness meditation",
            "Build resilience through self-acceptance"
        ]
    },
    relationship_healing: {
        title: "Healthy Relationships Journey",
        description: "Build secure, authentic connections while healing relationship wounds",
        difficulty: 'moderate',
        duration: '30_days',
        learningObjectives: [
            "Understand attachment patterns and triggers",
            "Develop healthy communication skills",
            "Set boundaries with compassion",
            "Cultivate secure, authentic relationships"
        ]
    },
    addiction_recovery: {
        title: "Recovery Resilience Pathway",
        description: "Holistic support for addiction recovery with emphasis on underlying healing",
        difficulty: 'intensive',
        duration: '90_days',
        learningObjectives: [
            "Understand addiction's roots and triggers",
            "Develop healthy coping mechanisms",
            "Build a strong recovery support network",
            "Address underlying trauma and mental health"
        ]
    }
};
// Create a new healing pathway
exports.createHealingPathway = functions.https.onCall(async (data, context) => {
    try {
        const { pathwayType, customization, userId } = data;
        if (!pathwayType || !userId) {
            throw new functions.https.HttpsError('invalid-argument', 'Pathway type and user ID are required');
        }
        const template = PATHWAY_TEMPLATES[pathwayType];
        if (!template) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid pathway type');
        }
        // Generate pathway content using AI
        const pathwayContent = await generatePathwayContent(pathwayType, customization);
        const pathway = Object.assign(Object.assign({ id: `pathway_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` }, template), { category: pathwayType, modules: pathwayContent.modules, totalEstimatedTime: pathwayContent.totalEstimatedTime, tags: pathwayContent.tags, isActive: true, createdAt: new Date(), updatedAt: new Date(), authoredBy: 'khepera_ai', clinicallyReviewed: true, prerequisites: (customization === null || customization === void 0 ? void 0 : customization.prerequisites) || [] });
        // Save pathway
        await db.collection('healing_pathways').doc(pathway.id).set(pathway);
        return { pathwayId: pathway.id, pathway };
    }
    catch (error) {
        console.error('Error creating pathway:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create healing pathway');
    }
});
// Generate pathway content using AI
async function generatePathwayContent(pathwayType, customization) {
    var _a;
    const prompt = `Create a comprehensive healing pathway for ${pathwayType} with the following requirements:

PATHWAY TYPE: ${pathwayType}
CUSTOMIZATION: ${customization ? JSON.stringify(customization) : 'Standard approach'}

Create a detailed pathway with:
1. 4-8 modules that build progressively
2. Each module should have 3-5 activities
3. Include varied activity types: reflection, exercises, journaling, meditation, reading
4. Provide specific instructions and reflection prompts
5. Include milestone celebrations
6. Ensure trauma-informed, culturally sensitive content

IMPORTANT GUIDELINES:
- Use person-first, empowering language
- Focus on strengths and resilience
- Provide choice and user agency
- Include crisis support reminders
- Make content accessible and inclusive
- Build in flexibility for different paces

Return detailed JSON with modules array containing activities, prompts, and milestones.`;
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a compassionate clinical psychologist and healing pathway designer. Create evidence-based, trauma-informed healing content.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });
        const pathwayContent = JSON.parse(completion.choices[0].message.content || '{}');
        // Calculate total estimated time
        const totalTime = ((_a = pathwayContent.modules) === null || _a === void 0 ? void 0 : _a.reduce((total, module) => {
            return total + (module.estimatedDuration || 0);
        }, 0)) || 0;
        return {
            modules: pathwayContent.modules || [],
            totalEstimatedTime: totalTime,
            tags: pathwayContent.tags || []
        };
    }
    catch (error) {
        console.error('Error generating pathway content:', error);
        // Return default content structure
        return {
            modules: [],
            totalEstimatedTime: 0,
            tags: []
        };
    }
}
// Start a user on a pathway
exports.startUserPathway = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    try {
        const { userId, pathwayId } = data;
        if (!userId || !pathwayId) {
            throw new functions.https.HttpsError('invalid-argument', 'User ID and pathway ID are required');
        }
        // Get pathway details
        const pathwayDoc = await db.collection('healing_pathways').doc(pathwayId).get();
        if (!pathwayDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Pathway not found');
        }
        const pathway = pathwayDoc.data();
        // Check if user already has this pathway
        const existingProgress = await db
            .collection('user_pathway_progress')
            .where('userId', '==', userId)
            .where('pathwayId', '==', pathwayId)
            .where('status', '==', 'active')
            .get();
        if (!existingProgress.empty) {
            throw new functions.https.HttpsError('already-exists', 'User is already on this pathway');
        }
        // Create user progress record
        const progress = {
            userId,
            pathwayId,
            startedAt: new Date(),
            lastActivityAt: new Date(),
            currentModuleId: ((_a = pathway.modules[0]) === null || _a === void 0 ? void 0 : _a.id) || '',
            currentActivityId: ((_c = (_b = pathway.modules[0]) === null || _b === void 0 ? void 0 : _b.activities[0]) === null || _c === void 0 ? void 0 : _c.id) || '',
            overallProgress: 0,
            moduleProgress: {},
            completedActivities: [],
            insights: [],
            adaptations: [],
            isCompleted: false,
            timeSpent: 0,
            status: 'active'
        };
        const progressRef = await db.collection('user_pathway_progress').add(progress);
        return { progressId: progressRef.id, progress };
    }
    catch (error) {
        console.error('Error starting user pathway:', error);
        throw new functions.https.HttpsError('internal', 'Failed to start pathway');
    }
});
// Complete an activity
exports.completePathwayActivity = functions.https.onCall(async (data, context) => {
    try {
        const { userId, pathwayId, activityId, reflection, timeSpent } = data;
        if (!userId || !pathwayId || !activityId) {
            throw new functions.https.HttpsError('invalid-argument', 'Required fields missing');
        }
        // Get user progress
        const progressQuery = await db
            .collection('user_pathway_progress')
            .where('userId', '==', userId)
            .where('pathwayId', '==', pathwayId)
            .where('status', '==', 'active')
            .limit(1)
            .get();
        if (progressQuery.empty) {
            throw new functions.https.HttpsError('not-found', 'Active pathway progress not found');
        }
        const progressDoc = progressQuery.docs[0];
        const progress = progressDoc.data();
        // Mark activity as completed
        if (!progress.completedActivities.includes(activityId)) {
            progress.completedActivities.push(activityId);
        }
        progress.lastActivityAt = new Date();
        progress.timeSpent += timeSpent || 0;
        // Save reflection if provided
        if (reflection) {
            await db.collection('pathway_reflections').add({
                userId,
                pathwayId,
                activityId,
                reflection,
                timestamp: firestore_1.FieldValue.serverTimestamp()
            });
        }
        // Calculate progress and next activity
        const { updatedProgress, nextActivity, insights } = await calculateProgressAndNext(progress, pathwayId);
        // Update progress record
        await progressDoc.ref.update(updatedProgress);
        // Generate insights if completion represents significant progress
        if (insights.length > 0) {
            await generatePathwayInsights(userId, pathwayId, insights);
        }
        return {
            progress: updatedProgress,
            nextActivity,
            insights,
            isModuleCompleted: (nextActivity === null || nextActivity === void 0 ? void 0 : nextActivity.isNewModule) || false
        };
    }
    catch (error) {
        console.error('Error completing activity:', error);
        throw new functions.https.HttpsError('internal', 'Failed to complete activity');
    }
});
// Calculate progress and determine next activity
async function calculateProgressAndNext(progress, pathwayId) {
    const pathwayDoc = await db.collection('healing_pathways').doc(pathwayId).get();
    const pathway = pathwayDoc.data();
    let totalActivities = 0;
    let completedCount = progress.completedActivities.length;
    // Calculate module progress
    const moduleProgress = {};
    let currentModuleId = progress.currentModuleId;
    let currentActivityId = progress.currentActivityId;
    let nextActivity = null;
    let insights = [];
    for (const module of pathway.modules) {
        const moduleActivityCount = module.activities.length;
        totalActivities += moduleActivityCount;
        const moduleCompleted = module.activities.filter(a => progress.completedActivities.includes(a.id)).length;
        moduleProgress[module.id] = moduleCompleted / moduleActivityCount * 100;
        // Find next activity
        if (!nextActivity) {
            const incompletedActivity = module.activities.find(a => !progress.completedActivities.includes(a.id));
            if (incompletedActivity) {
                currentModuleId = module.id;
                currentActivityId = incompletedActivity.id;
                nextActivity = {
                    moduleId: module.id,
                    activity: incompletedActivity,
                    isNewModule: currentModuleId !== progress.currentModuleId
                };
            }
        }
        // Generate insights for module completion
        if (moduleProgress[module.id] === 100 && !progress.insights.some(i => i.content.includes(module.title))) {
            insights.push({
                id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date(),
                type: 'emotional_growth',
                content: `Completed "${module.title}" module. This shows significant progress in ${pathway.category.replace('_', ' ')}.`,
                confidence: 0.9,
                supportingData: { moduleId: module.id, moduleTitle: module.title }
            });
        }
    }
    const overallProgress = totalActivities > 0 ? (completedCount / totalActivities * 100) : 0;
    const isCompleted = overallProgress >= 100;
    return {
        updatedProgress: Object.assign(Object.assign({}, progress), { currentModuleId,
            currentActivityId,
            overallProgress,
            moduleProgress,
            isCompleted, completedAt: isCompleted ? new Date() : progress.completedAt, status: isCompleted ? 'completed' : 'active' }),
        nextActivity,
        insights
    };
}
// Generate AI-powered pathway insights
async function generatePathwayInsights(userId, pathwayId, triggers) {
    try {
        // Get user's recent journal entries for context
        const recentEntries = await db
            .collection('users')
            .doc(userId)
            .collection('journal_entries')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();
        const journalContext = recentEntries.docs.map(doc => doc.data().content).join('\n\n');
        const prompt = `Based on the user's pathway progress and recent journal entries, provide personalized insights:

PATHWAY TRIGGERS: ${JSON.stringify(triggers)}
RECENT JOURNAL CONTEXT: ${journalContext.substring(0, 2000)}

Provide supportive, encouraging insights that:
1. Celebrate specific progress made
2. Identify patterns or growth areas
3. Suggest gentle next steps
4. Acknowledge any challenges with compassion
5. Connect pathway work to their journal reflections

Keep insights personal, hopeful, and action-oriented.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are Khepera, a wise and compassionate AI healing companion. Provide personalized insights that honor the user\'s unique journey.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8
        });
        const aiInsights = completion.choices[0].message.content;
        // Store AI-generated insights
        await db.collection('pathway_insights').add({
            userId,
            pathwayId,
            content: aiInsights,
            triggers: triggers.map(t => t.id),
            timestamp: firestore_1.FieldValue.serverTimestamp(),
            source: 'khepera_ai'
        });
    }
    catch (error) {
        console.error('Error generating pathway insights:', error);
    }
}
// Get user's pathway progress
exports.getUserPathwayProgress = functions.https.onCall(async (data, context) => {
    try {
        const { userId } = data;
        if (!userId) {
            throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
        }
        const progressQuery = await db
            .collection('user_pathway_progress')
            .where('userId', '==', userId)
            .orderBy('lastActivityAt', 'desc')
            .get();
        const pathwayProgress = [];
        for (const doc of progressQuery.docs) {
            const progress = doc.data();
            // Get pathway details
            const pathwayDoc = await db.collection('healing_pathways').doc(progress.pathwayId).get();
            const pathway = pathwayDoc.exists ? pathwayDoc.data() : null;
            pathwayProgress.push({
                id: doc.id,
                progress,
                pathway
            });
        }
        return { pathwayProgress };
    }
    catch (error) {
        console.error('Error getting pathway progress:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get pathway progress');
    }
});
// Get available pathways
exports.getAvailablePathways = functions.https.onCall(async (data, context) => {
    try {
        const { category, difficulty } = data;
        let query = db.collection('healing_pathways').where('isActive', '==', true);
        if (category) {
            query = query.where('category', '==', category);
        }
        if (difficulty) {
            query = query.where('difficulty', '==', difficulty);
        }
        const snapshot = await query.get();
        const pathways = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        return { pathways };
    }
    catch (error) {
        console.error('Error getting pathways:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get pathways');
    }
});
// Adaptive pathway engine - adjusts pathway based on user progress and needs
exports.adaptPathway = functions.https.onCall(async (data, context) => {
    try {
        const { userId, pathwayId, reason } = data;
        if (!userId || !pathwayId) {
            throw new functions.https.HttpsError('invalid-argument', 'User ID and pathway ID are required');
        }
        // Get current progress and pathway
        const [progressQuery, pathwayDoc] = await Promise.all([
            db.collection('user_pathway_progress')
                .where('userId', '==', userId)
                .where('pathwayId', '==', pathwayId)
                .where('status', '==', 'active')
                .limit(1)
                .get(),
            db.collection('healing_pathways').doc(pathwayId).get()
        ]);
        if (progressQuery.empty || !pathwayDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Active pathway or progress not found');
        }
        const progress = progressQuery.docs[0].data();
        const pathway = pathwayDoc.data();
        // Generate adaptive recommendations
        const adaptations = await generatePathwayAdaptations(userId, progress, pathway, reason);
        // Apply adaptations
        const adaptation = {
            id: `adaptation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            reason,
            description: adaptations.description,
            changes: adaptations.changes,
            aiGenerated: true
        };
        progress.adaptations.push(adaptation);
        // Update progress
        await progressQuery.docs[0].ref.update({
            adaptations: progress.adaptations
        });
        return { adaptation, recommendations: adaptations.recommendations };
    }
    catch (error) {
        console.error('Error adapting pathway:', error);
        throw new functions.https.HttpsError('internal', 'Failed to adapt pathway');
    }
});
// Generate pathway adaptations using AI
async function generatePathwayAdaptations(userId, progress, pathway, reason) {
    const prompt = `Analyze this user's pathway progress and recommend adaptive changes:

USER PROGRESS:
- Overall Progress: ${progress.overallProgress}%
- Time Spent: ${progress.timeSpent} minutes
- Completed Activities: ${progress.completedActivities.length}
- Status: ${progress.status}
- Recent Activity: ${progress.lastActivityAt}

PATHWAY INFO:
- Category: ${pathway.category}
- Difficulty: ${pathway.difficulty}
- Duration: ${pathway.duration}
- Total Modules: ${pathway.modules.length}

ADAPTATION REASON: ${reason}

Recommend specific adaptations that could:
1. Better match the user's current needs
2. Address any identified challenges
3. Maintain engagement and progress
4. Ensure appropriate pacing and support

Provide concrete suggestions for activities to add, modify, or remove.`;
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are an adaptive learning specialist for mental health pathways. Provide personalized pathway modifications.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });
        return JSON.parse(completion.choices[0].message.content || '{}');
    }
    catch (error) {
        console.error('Error generating adaptations:', error);
        return {
            description: 'Pathway adapted based on user needs',
            changes: {},
            recommendations: []
        };
    }
}
//# sourceMappingURL=pathwaySystem.js.map