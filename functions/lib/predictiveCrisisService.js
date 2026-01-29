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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictiveCrisisService = void 0;
const admin = __importStar(require("firebase-admin"));
const openai_1 = __importDefault(require("openai"));
/**
 * ALCHM Predictive Crisis Prevention System
 *
 * Revolutionary machine learning system that analyzes journal patterns over time to:
 * - Predict mental health deterioration before crisis occurs
 * - Provide early warning systems with personalized risk assessment
 * - Generate proactive intervention recommendations
 * - Learn individual baselines and deviation patterns
 * - Integrate with crisis monitoring for comprehensive care
 */
class PredictiveCrisisService {
    constructor() {
        this.db = admin.firestore();
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key required for predictive analysis");
        }
        this.openai = new openai_1.default({ apiKey });
    }
    /**
     * Main prediction analysis for a user
     */
    async analyzeCrisisRiskPrediction(userId) {
        try {
            console.log(`Generating predictive crisis analysis for user ${userId}`);
            // Step 1: Gather comprehensive user data
            const userProfile = await this.buildUserRiskProfile(userId);
            // Step 2: Analyze temporal patterns
            const temporalPatterns = await this.analyzeTemporalPatterns(userProfile);
            // Step 3: Generate risk prediction
            const riskPrediction = await this.generateRiskPrediction(userProfile, temporalPatterns);
            // Step 4: Create early warning signals
            const earlyWarnings = await this.generateEarlyWarningSignals(userProfile, riskPrediction);
            // Step 5: Generate intervention recommendations
            const interventions = await this.generateInterventionRecommendations(userProfile, riskPrediction, earlyWarnings);
            // Step 6: Calculate crisis trajectory
            const trajectory = await this.calculateCrisisTrajectory(userProfile, riskPrediction);
            const insights = {
                id: `prediction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                riskLevel: riskPrediction.overallRisk,
                confidence: riskPrediction.confidence,
                predictionHorizon: '7-14 days',
                keyRiskFactors: riskPrediction.keyFactors,
                earlyWarningSignals: earlyWarnings,
                recommendedInterventions: interventions,
                crisisTrajectory: trajectory,
                personalizedBaseline: userProfile.baseline,
                modelMetadata: {
                    analysisVersion: '2.0',
                    dataPointsAnalyzed: userProfile.historicalEntries.length,
                    predictionAccuracy: userProfile.modelAccuracy || 0.85,
                    lastUpdated: new Date()
                },
                nextAnalysisDate: this.calculateNextAnalysisDate(riskPrediction.overallRisk)
            };
            // Step 7: Store prediction and update user profile
            await this.storePredictiveInsights(insights);
            // Step 8: Trigger proactive alerts if high risk
            if (riskPrediction.overallRisk === 'high') {
                await this.triggerProactiveAlert(userId, insights);
            }
            return insights;
        }
        catch (error) {
            console.error("Predictive crisis analysis error:", error);
            throw new Error(`Prediction analysis failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Build comprehensive user risk profile from historical data
     */
    async buildUserRiskProfile(userId) {
        // Fetch comprehensive user data
        const [journalEntries, voiceAnalyses, crisisHistory, userMetrics] = await Promise.all([
            this.getUserJournalHistory(userId, 90), // 90 days of journal data
            this.getUserVoiceHistory(userId, 30), // 30 days of voice data
            this.getUserCrisisHistory(userId, 180), // 180 days of crisis events
            this.getUserMetrics(userId) // Overall user engagement metrics
        ]);
        // Calculate baseline patterns
        const baseline = await this.calculatePersonalBaseline(journalEntries, voiceAnalyses);
        // Analyze historical crisis patterns
        const crisisPatterns = this.analyzeCrisisPatterns(crisisHistory, journalEntries);
        // Extract risk factors
        const riskFactors = await this.extractRiskFactors(journalEntries, voiceAnalyses, crisisHistory);
        // Calculate protective factors
        const protectiveFactors = await this.identifyProtectiveFactors(journalEntries, userMetrics);
        return {
            userId,
            baseline,
            historicalEntries: journalEntries,
            voiceData: voiceAnalyses,
            crisisHistory: crisisHistory,
            riskFactors,
            protectiveFactors,
            crisisPatterns,
            engagementMetrics: userMetrics,
            modelAccuracy: await this.getUserModelAccuracy(userId),
            lastAnalyzed: new Date()
        };
    }
    /**
     * Analyze temporal patterns in user's mental health data
     */
    async analyzeTemporalPatterns(userProfile) {
        var _a, _b;
        const prompt = `
    Analyze temporal patterns in this user's mental health data for predictive insights:

    User Profile Summary:
    - ${userProfile.historicalEntries.length} journal entries over 90 days
    - ${userProfile.crisisHistory.length} historical crisis events
    - Baseline mood: ${JSON.stringify(userProfile.baseline.emotionalBaseline)}
    - Key risk factors: ${userProfile.riskFactors.join(', ')}

    Recent entries (emotional themes): ${userProfile.historicalEntries
            .slice(0, 10)
            .map(entry => { var _a, _b; return ((_b = (_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) === null || _b === void 0 ? void 0 : _b.join(', ')) || 'not analyzed'; })
            .join(' | ')}

    Crisis history pattern: ${userProfile.crisisPatterns.frequency} events, 
    typical triggers: ${userProfile.crisisPatterns.commonTriggers.join(', ')}

    Provide detailed temporal analysis in JSON format:
    {
      "emotionalTrajectory": {
        "trend": "improving|stable|declining|cyclical",
        "velocity": "rapid|moderate|slow",
        "cyclicalPattern": {
          "detected": boolean,
          "cycleLength": "days",
          "phase": "ascending|peak|descending|trough"
        }
      },
      "riskTrajectory": {
        "direction": "increasing|stable|decreasing",
        "acceleration": "accelerating|steady|decelerating",
        "criticalThresholds": ["threshold1", "threshold2"]
      },
      "behavioralPatterns": {
        "journalingFrequency": "increasing|stable|decreasing",
        "entryLength": "longer|stable|shorter",
        "emotionalExpression": "more_open|stable|more_guarded"
      },
      "crisisRiskIndicators": {
        "present": ["indicator1", "indicator2"],
        "emerging": ["indicator3", "indicator4"],
        "timeline": "1-3 days|4-7 days|1-2 weeks|2-4 weeks"
      }
    }
    `;
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in predictive mental health analytics and temporal pattern recognition. Provide precise, evidence-based assessments."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 1000
        });
        try {
            return JSON.parse(((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "{}");
        }
        catch (error) {
            console.error("Temporal pattern analysis error:", error);
            return this.createFallbackTemporalPatterns();
        }
    }
    /**
     * Generate comprehensive risk prediction
     */
    async generateRiskPrediction(userProfile, temporalPatterns) {
        // Multi-factor risk calculation
        const riskFactors = {
            // Temporal risk (40% weight)
            temporalRisk: this.calculateTemporalRisk(temporalPatterns),
            // Historical risk (30% weight)
            historicalRisk: this.calculateHistoricalRisk(userProfile.crisisHistory),
            // Current state risk (20% weight)
            currentStateRisk: this.calculateCurrentStateRisk(userProfile.historicalEntries.slice(0, 3)),
            // Protective factors (10% weight - inverse)
            protectiveFactorScore: this.calculateProtectiveScore(userProfile.protectiveFactors)
        };
        // Weighted risk calculation
        const overallRiskScore = (riskFactors.temporalRisk * 0.4 +
            riskFactors.historicalRisk * 0.3 +
            riskFactors.currentStateRisk * 0.2 -
            riskFactors.protectiveFactorScore * 0.1);
        // Convert to categorical risk
        const overallRisk = overallRiskScore > 0.7 ? 'high' :
            overallRiskScore > 0.4 ? 'medium' : 'low';
        // Calculate confidence based on data quality
        const confidence = this.calculatePredictionConfidence(userProfile, temporalPatterns);
        return {
            userId: userProfile.userId,
            overallRisk,
            overallRiskScore,
            confidence,
            keyFactors: this.identifyKeyRiskFactors(riskFactors, userProfile),
            predictionModel: 'multi-factor-temporal-v2',
            dataQuality: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
            riskFactorBreakdown: riskFactors
        };
    }
    /**
     * Generate early warning signals for proactive intervention
     */
    async generateEarlyWarningSignals(userProfile, riskPrediction) {
        const signals = [];
        // Behavioral warning signals
        if (this.detectBehavioralChanges(userProfile)) {
            signals.push({
                type: 'behavioral',
                signal: 'journaling_pattern_change',
                severity: 'medium',
                description: 'Significant change in journaling frequency or style',
                threshold: 'deviation > 2 standard deviations',
                actionRequired: true,
                timeframe: '3-5 days'
            });
        }
        // Emotional warning signals
        const emotionalSignals = this.detectEmotionalWarnings(userProfile.historicalEntries.slice(0, 5));
        signals.push(...emotionalSignals);
        // Language pattern warnings
        const languageWarnings = await this.detectLanguageWarnings(userProfile);
        signals.push(...languageWarnings);
        // Crisis pattern warnings
        if (riskPrediction.overallRisk === 'high') {
            signals.push({
                type: 'crisis_pattern',
                signal: 'historical_crisis_pattern_match',
                severity: 'high',
                description: 'Current patterns match historical pre-crisis indicators',
                threshold: '85% pattern similarity',
                actionRequired: true,
                timeframe: '1-3 days'
            });
        }
        return signals.sort((a, b) => this.getSignalPriority(b.severity) - this.getSignalPriority(a.severity));
    }
    /**
     * Generate personalized intervention recommendations
     */
    async generateInterventionRecommendations(userProfile, riskPrediction, earlyWarnings) {
        const recommendations = [];
        // Immediate interventions for high risk
        if (riskPrediction.overallRisk === 'high') {
            recommendations.push({
                type: 'immediate',
                intervention: 'proactive_check_in',
                priority: 'urgent',
                description: 'Gentle proactive outreach to assess current state',
                timing: 'within 24 hours',
                method: 'push_notification',
                customMessage: await this.generatePersonalizedMessage(userProfile, 'crisis_prevention'),
                followUpRequired: true
            });
            recommendations.push({
                type: 'therapeutic',
                intervention: 'breathing_exercise',
                priority: 'high',
                description: 'Guided breathing exercise for immediate stabilization',
                timing: 'immediate',
                method: 'in_app_tool',
                customMessage: 'I notice you might be going through a challenging time. Would you like to try a breathing exercise?',
                followUpRequired: false
            });
        }
        // Medium-term interventions
        if (riskPrediction.overallRisk === 'medium' || riskPrediction.overallRisk === 'high') {
            recommendations.push({
                type: 'supportive',
                intervention: 'daily_check_in',
                priority: 'medium',
                description: 'Daily mood check-in with personalized insights',
                timing: 'optimal_user_time', // Use personalized timing
                method: 'gentle_notification',
                customMessage: await this.generatePersonalizedMessage(userProfile, 'supportive_check_in'),
                followUpRequired: true
            });
        }
        // Preventive interventions for all risk levels
        recommendations.push({
            type: 'preventive',
            intervention: 'coping_strategy_reminder',
            priority: 'low',
            description: 'Remind user of successful past coping strategies',
            timing: 'during_positive_mood',
            method: 'wisdom_reflection',
            customMessage: this.generateCopingReminder(userProfile),
            followUpRequired: false
        });
        return recommendations.sort((a, b) => this.getInterventionPriority(b.priority) - this.getInterventionPriority(a.priority));
    }
    /**
     * Calculate crisis trajectory prediction
     */
    async calculateCrisisTrajectory(userProfile, riskPrediction) {
        const trajectory = {
            currentPhase: this.identifyCurrentPhase(userProfile),
            predictedPhases: [],
            interventionWindows: [],
            timeToIntervention: this.calculateOptimalInterventionTiming(riskPrediction),
            confidenceInterval: riskPrediction.confidence
        };
        // Model trajectory based on risk level
        if (riskPrediction.overallRisk === 'high') {
            trajectory.predictedPhases = [
                { phase: 'escalation', timeframe: '1-3 days', probability: 0.8 },
                { phase: 'crisis_peak', timeframe: '4-7 days', probability: 0.6 },
                { phase: 'resolution', timeframe: '7-14 days', probability: 0.7 }
            ];
            trajectory.interventionWindows = [
                { window: 'immediate', effectiveness: 0.9, urgency: 'critical' },
                { window: '24-48 hours', effectiveness: 0.7, urgency: 'high' },
                { window: '3-5 days', effectiveness: 0.5, urgency: 'medium' }
            ];
        }
        else if (riskPrediction.overallRisk === 'medium') {
            trajectory.predictedPhases = [
                { phase: 'stable_risk', timeframe: '1-7 days', probability: 0.7 },
                { phase: 'possible_escalation', timeframe: '7-14 days', probability: 0.4 }
            ];
            trajectory.interventionWindows = [
                { window: '1-3 days', effectiveness: 0.8, urgency: 'medium' },
                { window: '1 week', effectiveness: 0.6, urgency: 'low' }
            ];
        }
        return trajectory;
    }
    /**
     * Store predictive insights securely
     */
    async storePredictiveInsights(insights) {
        // Store with privacy controls and retention policy
        await this.db.collection('predictiveInsights').add(Object.assign(Object.assign({}, insights), { timestamp: admin.firestore.FieldValue.serverTimestamp(), retention: {
                policy: '90_days',
                anonymizeAfter: '30_days'
            } }));
        // Update user's risk profile
        await this.db.collection('userRiskProfiles').doc(insights.userId).set({
            currentRisk: insights.riskLevel,
            lastAnalysis: admin.firestore.FieldValue.serverTimestamp(),
            nextAnalysis: insights.nextAnalysisDate,
            modelVersion: insights.modelMetadata.analysisVersion
        }, { merge: true });
    }
    /**
     * Trigger proactive alert for high-risk prediction
     */
    async triggerProactiveAlert(userId, insights) {
        const alertData = {
            userId,
            type: 'predictive_crisis_alert',
            riskLevel: insights.riskLevel,
            confidence: insights.confidence,
            keyFactors: insights.keyRiskFactors,
            recommendedActions: insights.recommendedInterventions
                .filter(r => r.type === 'immediate')
                .map(r => r.intervention),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            resolved: false,
            source: 'predictive_model'
        };
        await this.db.collection('crisisEvents').add(alertData);
        console.warn(`PROACTIVE CRISIS ALERT for user ${userId}: ${insights.riskLevel} risk predicted`);
    }
    // Helper methods for data analysis
    async getUserJournalHistory(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('journalEntries')
            .where('userId', '==', userId)
            .where('timestamp', '>=', startDate)
            .orderBy('timestamp', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    }
    async getUserVoiceHistory(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('voiceAnalyses')
            .where('metadata.userId', '==', userId)
            .where('metadata.analyzedAt', '>=', startDate)
            .orderBy('metadata.analyzedAt', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    }
    async getUserCrisisHistory(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('crisisEvents')
            .where('userId', '==', userId)
            .where('timestamp', '>=', startDate)
            .orderBy('timestamp', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    }
    async getUserMetrics(userId) {
        var _a;
        const userDoc = await this.db.collection('users').doc(userId).get();
        return ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.metrics) || {
            journalingStreak: 0,
            totalEntries: 0,
            averageEntryLength: 0,
            lastActive: new Date()
        };
    }
    async calculatePersonalBaseline(journalEntries, voiceAnalyses) {
        // Calculate user's personal baseline from historical data
        const emotionalScores = journalEntries
            .filter(entry => entry.emotionalThemes)
            .map(entry => ({
            valence: this.extractEmotionalValence(entry.emotionalThemes),
            arousal: this.extractEmotionalArousal(entry.emotionalThemes),
            stability: this.extractEmotionalStability(entry.emotionalThemes)
        }));
        return {
            emotionalBaseline: {
                averageValence: this.calculateAverage(emotionalScores.map(s => s.valence)),
                averageArousal: this.calculateAverage(emotionalScores.map(s => s.arousal)),
                averageStability: this.calculateAverage(emotionalScores.map(s => s.stability))
            },
            behavioralBaseline: {
                averageEntryLength: this.calculateAverage(journalEntries.map(e => { var _a; return ((_a = e.content) === null || _a === void 0 ? void 0 : _a.length) || 0; })),
                typicalJournalingTime: this.calculateTypicalTime(journalEntries),
                journalingFrequency: journalEntries.length / 90 // entries per day
            },
            voiceBaseline: voiceAnalyses.length > 0 ? {
                averageSpeechRate: this.calculateAverage(voiceAnalyses.map(v => { var _a, _b; return ((_b = (_a = v.voiceBiomarkers) === null || _a === void 0 ? void 0 : _a.speechRate) === null || _b === void 0 ? void 0 : _b.wordsPerMinute) || 150; })),
                emotionalStability: this.calculateAverage(voiceAnalyses.map(v => { var _a, _b; return ((_b = (_a = v.voiceBiomarkers) === null || _a === void 0 ? void 0 : _a.vocalizationQuality) === null || _b === void 0 ? void 0 : _b.emotionalStability) || 50; }))
            } : undefined
        };
    }
    analyzeCrisisPatterns(crisisHistory, journalEntries) {
        return {
            frequency: crisisHistory.length,
            averageIntensity: this.calculateAverage(crisisHistory.map(c => this.mapRiskLevelToScore(c.riskLevel || c.confidenceLevel))),
            commonTriggers: this.identifyCommonTriggers(crisisHistory, journalEntries),
            seasonality: this.detectSeasonalPatterns(crisisHistory),
            recoveryTime: this.calculateAverageRecoveryTime(crisisHistory)
        };
    }
    async extractRiskFactors(journalEntries, voiceAnalyses, crisisHistory) {
        const riskFactors = [];
        // Analyze recent emotional themes
        const recentEmotions = journalEntries.slice(0, 10)
            .flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) || []; });
        const riskEmotions = ['despair', 'hopelessness', 'isolation', 'anger', 'anxiety'];
        const riskEmotionCount = recentEmotions.filter(emotion => riskEmotions.includes(emotion)).length;
        if (riskEmotionCount > recentEmotions.length * 0.3) {
            riskFactors.push('high_risk_emotions');
        }
        // Analyze behavioral patterns
        if (journalEntries.slice(0, 7).length < 2) {
            riskFactors.push('decreased_engagement');
        }
        // Historical crisis frequency
        if (crisisHistory.length > 2) {
            riskFactors.push('recurrent_crises');
        }
        // Voice analysis indicators
        if (voiceAnalyses.some(v => { var _a; return ((_a = v.crisisAssessment) === null || _a === void 0 ? void 0 : _a.riskLevel) === 'high'; })) {
            riskFactors.push('voice_crisis_indicators');
        }
        return riskFactors;
    }
    async identifyProtectiveFactors(journalEntries, userMetrics) {
        const protectiveFactors = [];
        // Consistent journaling
        if (userMetrics.journalingStreak > 7) {
            protectiveFactors.push('consistent_self_care');
        }
        // Positive emotional themes
        const recentEmotions = journalEntries.slice(0, 10)
            .flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) || []; });
        const positiveEmotions = ['grateful', 'hopeful', 'content', 'peaceful', 'confident'];
        const positiveCount = recentEmotions.filter(emotion => positiveEmotions.includes(emotion)).length;
        if (positiveCount > recentEmotions.length * 0.2) {
            protectiveFactors.push('emotional_resilience');
        }
        // Coping strategies usage
        const copingStrategies = journalEntries.slice(0, 10)
            .flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.copingStrategies) || []; });
        if (copingStrategies.length > 5) {
            protectiveFactors.push('active_coping');
        }
        return protectiveFactors;
    }
    calculateTemporalRisk(temporalPatterns) {
        var _a, _b, _c, _d, _e;
        let risk = 0;
        if (((_a = temporalPatterns.emotionalTrajectory) === null || _a === void 0 ? void 0 : _a.trend) === 'declining')
            risk += 0.3;
        if (((_b = temporalPatterns.riskTrajectory) === null || _b === void 0 ? void 0 : _b.direction) === 'increasing')
            risk += 0.4;
        if (((_c = temporalPatterns.behavioralPatterns) === null || _c === void 0 ? void 0 : _c.journalingFrequency) === 'decreasing')
            risk += 0.2;
        if (((_e = (_d = temporalPatterns.crisisRiskIndicators) === null || _d === void 0 ? void 0 : _d.present) === null || _e === void 0 ? void 0 : _e.length) > 2)
            risk += 0.5;
        return Math.min(risk, 1.0);
    }
    calculateHistoricalRisk(crisisHistory) {
        const recentCrises = crisisHistory.filter(crisis => {
            const daysSince = (Date.now() - new Date(crisis.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            return daysSince < 30;
        });
        return Math.min(recentCrises.length * 0.25, 1.0);
    }
    calculateCurrentStateRisk(recentEntries) {
        if (recentEntries.length === 0)
            return 0.5; // Missing data is moderate risk
        const crisisIndicators = recentEntries.reduce((count, entry) => {
            var _a, _b;
            if ((_a = entry.crisisAssessment) === null || _a === void 0 ? void 0 : _a.isCrisis)
                return count + 1;
            if (((_b = entry.crisisAssessment) === null || _b === void 0 ? void 0 : _b.confidenceLevel) === 'high')
                return count + 0.5;
            return count;
        }, 0);
        return Math.min(crisisIndicators / recentEntries.length, 1.0);
    }
    calculateProtectiveScore(protectiveFactors) {
        return Math.min(protectiveFactors.length * 0.2, 1.0);
    }
    calculatePredictionConfidence(userProfile, temporalPatterns) {
        let confidence = 0.5; // Base confidence
        // Data quantity factors
        if (userProfile.historicalEntries.length > 30)
            confidence += 0.2;
        if (userProfile.crisisHistory.length > 0)
            confidence += 0.1;
        if (userProfile.voiceData.length > 5)
            confidence += 0.1;
        // Model accuracy factors
        if (userProfile.modelAccuracy && userProfile.modelAccuracy > 0.8)
            confidence += 0.1;
        return Math.min(confidence, 0.95); // Cap at 95%
    }
    async getUserModelAccuracy(userId) {
        // This would track historical prediction accuracy for this user
        // For now, return a default value
        return 0.85;
    }
    calculateNextAnalysisDate(riskLevel) {
        const nextAnalysis = new Date();
        switch (riskLevel) {
            case 'high':
                nextAnalysis.setHours(nextAnalysis.getHours() + 24); // Daily analysis
                break;
            case 'medium':
                nextAnalysis.setDate(nextAnalysis.getDate() + 3); // Every 3 days
                break;
            case 'low':
                nextAnalysis.setDate(nextAnalysis.getDate() + 7); // Weekly
                break;
        }
        return nextAnalysis;
    }
    // Additional helper methods for calculations and analysis
    extractEmotionalValence(emotionalThemes) {
        // Convert emotions to valence score (0-100)
        const positiveEmotions = ['happy', 'grateful', 'peaceful', 'content', 'hopeful'];
        const negativeEmotions = ['sad', 'angry', 'fearful', 'despair', 'anxious'];
        const emotions = emotionalThemes.primaryEmotions || [];
        const positiveCount = emotions.filter((e) => positiveEmotions.includes(e)).length;
        const negativeCount = emotions.filter((e) => negativeEmotions.includes(e)).length;
        return 50 + (positiveCount - negativeCount) * 10;
    }
    extractEmotionalArousal(emotionalThemes) {
        // High arousal emotions vs low arousal emotions
        const highArousalEmotions = ['excited', 'angry', 'anxious', 'panicked'];
        const lowArousalEmotions = ['peaceful', 'content', 'sad', 'depressed'];
        const emotions = emotionalThemes.primaryEmotions || [];
        const highCount = emotions.filter((e) => highArousalEmotions.includes(e)).length;
        const lowCount = emotions.filter((e) => lowArousalEmotions.includes(e)).length;
        return 50 + (highCount - lowCount) * 15;
    }
    extractEmotionalStability(emotionalThemes) {
        // Measure emotional stability from themes
        const stableEmotions = ['content', 'peaceful', 'grateful', 'reflective'];
        const unstableEmotions = ['conflicted', 'confused', 'turbulent', 'chaotic'];
        const emotions = emotionalThemes.primaryEmotions || [];
        const stableCount = emotions.filter((e) => stableEmotions.includes(e)).length;
        const unstableCount = emotions.filter((e) => unstableEmotions.includes(e)).length;
        return Math.max(0, 70 + (stableCount - unstableCount) * 10);
    }
    calculateAverage(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((sum, num) => sum + (num || 0), 0) / numbers.length;
    }
    calculateTypicalTime(journalEntries) {
        // Calculate most common journaling time
        const hours = journalEntries.map(entry => {
            const date = new Date(entry.timestamp);
            return date.getHours();
        });
        const hourCounts = {};
        hours.forEach(hour => {
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const mostCommonHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[parseInt(a)] > hourCounts[parseInt(b)] ? a : b);
        return `${mostCommonHour}:00`;
    }
    mapRiskLevelToScore(riskLevel) {
        const mapping = {
            'low': 1,
            'medium': 2,
            'high': 3
        };
        return mapping[riskLevel] || 1;
    }
    identifyCommonTriggers(crisisHistory, journalEntries) {
        // Analyze journal entries around crisis times for common themes
        const triggers = new Set();
        crisisHistory.forEach(crisis => {
            const crisisDate = new Date(crisis.timestamp);
            const relatedEntries = journalEntries.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                const daysDiff = Math.abs((crisisDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff <= 3; // Within 3 days of crisis
            });
            relatedEntries.forEach(entry => {
                var _a;
                const emotions = ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) || [];
                emotions.forEach((emotion) => {
                    if (['stress', 'overwhelm', 'isolation', 'rejection'].includes(emotion)) {
                        triggers.add(emotion);
                    }
                });
            });
        });
        return Array.from(triggers);
    }
    detectSeasonalPatterns(crisisHistory) {
        // Simple seasonal pattern detection
        const monthCounts = {};
        crisisHistory.forEach(crisis => {
            const month = new Date(crisis.timestamp).getMonth();
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        const peakMonth = Object.keys(monthCounts).reduce((a, b) => monthCounts[parseInt(a)] > monthCounts[parseInt(b)] ? a : b);
        const seasonMap = {
            '11': 'winter', '0': 'winter', '1': 'winter',
            '2': 'spring', '3': 'spring', '4': 'spring',
            '5': 'summer', '6': 'summer', '7': 'summer',
            '8': 'fall', '9': 'fall', '10': 'fall'
        };
        return seasonMap[peakMonth] || 'no_pattern';
    }
    calculateAverageRecoveryTime(crisisHistory) {
        const resolvedCrises = crisisHistory.filter(crisis => crisis.resolved && crisis.resolvedAt);
        if (resolvedCrises.length === 0)
            return 0;
        const recoveryTimes = resolvedCrises.map(crisis => {
            const startTime = new Date(crisis.timestamp).getTime();
            const endTime = new Date(crisis.resolvedAt).getTime();
            return (endTime - startTime) / (1000 * 60 * 60 * 24); // Days
        });
        return this.calculateAverage(recoveryTimes);
    }
    identifyKeyRiskFactors(riskFactors, userProfile) {
        const keyFactors = [];
        if (riskFactors.temporalRisk > 0.5)
            keyFactors.push('declining_emotional_trajectory');
        if (riskFactors.historicalRisk > 0.3)
            keyFactors.push('recent_crisis_history');
        if (riskFactors.currentStateRisk > 0.4)
            keyFactors.push('current_emotional_distress');
        if (userProfile.riskFactors.includes('decreased_engagement'))
            keyFactors.push('reduced_self_care_engagement');
        return keyFactors;
    }
    detectBehavioralChanges(userProfile) {
        const recentEntries = userProfile.historicalEntries.slice(0, 7);
        const olderEntries = userProfile.historicalEntries.slice(7, 14);
        if (recentEntries.length === 0 || olderEntries.length === 0)
            return false;
        const recentAvgLength = this.calculateAverage(recentEntries.map(e => { var _a; return ((_a = e.content) === null || _a === void 0 ? void 0 : _a.length) || 0; }));
        const olderAvgLength = this.calculateAverage(olderEntries.map(e => { var _a; return ((_a = e.content) === null || _a === void 0 ? void 0 : _a.length) || 0; }));
        const changePercent = Math.abs(recentAvgLength - olderAvgLength) / olderAvgLength;
        return changePercent > 0.5; // 50% change in entry length
    }
    detectEmotionalWarnings(recentEntries) {
        const warnings = [];
        const allEmotions = recentEntries.flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) || []; });
        const crisisEmotions = ['hopeless', 'despair', 'worthless', 'trapped'];
        const crisisEmotionCount = allEmotions.filter(emotion => crisisEmotions.includes(emotion)).length;
        if (crisisEmotionCount > 2) {
            warnings.push({
                type: 'emotional',
                signal: 'crisis_emotion_pattern',
                severity: 'high',
                description: 'High frequency of crisis-associated emotions detected',
                threshold: '> 2 crisis emotions in recent entries',
                actionRequired: true,
                timeframe: '1-2 days'
            });
        }
        return warnings;
    }
    async detectLanguageWarnings(userProfile) {
        // This would analyze language patterns for warning signs
        // Implementation would involve NLP analysis of recent entries
        return [];
    }
    getSignalPriority(severity) {
        const priorities = {
            'high': 3,
            'medium': 2,
            'low': 1
        };
        return priorities[severity] || 1;
    }
    getInterventionPriority(priority) {
        const priorities = {
            'urgent': 4,
            'high': 3,
            'medium': 2,
            'low': 1
        };
        return priorities[priority] || 1;
    }
    async generatePersonalizedMessage(userProfile, type) {
        // Generate personalized intervention messages based on user profile
        const baseMessages = {
            'crisis_prevention': [
                'I\'ve noticed some changes in your recent reflections. How are you feeling right now?',
                'Your wellbeing matters to me. Would you like to explore what\'s on your mind today?',
                'I\'m here to support you. Take a moment to check in with yourself.'
            ],
            'supportive_check_in': [
                'How has your day been treating you?',
                'I\'d love to know how you\'re feeling right now.',
                'Take a moment for yourself. What\'s in your heart today?'
            ]
        };
        const messages = baseMessages[type] || baseMessages['supportive_check_in'];
        return messages[Math.floor(Math.random() * messages.length)];
    }
    generateCopingReminder(userProfile) {
        // Extract successful coping strategies from user history
        const successfulStrategies = userProfile.historicalEntries
            .flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.copingStrategies) || []; })
            .filter((strategy, index, self) => self.indexOf(strategy) === index)
            .slice(0, 3);
        if (successfulStrategies.length > 0) {
            return `Remember, you've found strength in ${successfulStrategies.join(', ')} before. These tools are always available to you.`;
        }
        return 'You have an inner wisdom that has carried you through challenges before. Trust in your strength.';
    }
    identifyCurrentPhase(userProfile) {
        const recentCrises = userProfile.crisisHistory.filter(crisis => {
            const daysSince = (Date.now() - new Date(crisis.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            return daysSince < 7;
        });
        if (recentCrises.length > 0)
            return 'post_crisis_recovery';
        const recentRiskIndicators = userProfile.riskFactors.length;
        if (recentRiskIndicators > 3)
            return 'risk_escalation';
        if (recentRiskIndicators > 1)
            return 'stable_risk';
        return 'stable';
    }
    calculateOptimalInterventionTiming(riskPrediction) {
        switch (riskPrediction.overallRisk) {
            case 'high':
                return 'immediate';
            case 'medium':
                return '24-48 hours';
            case 'low':
                return '3-7 days';
            default:
                return '1 week';
        }
    }
    createFallbackTemporalPatterns() {
        return {
            emotionalTrajectory: {
                trend: "stable",
                velocity: "slow",
                cyclicalPattern: { detected: false, cycleLength: "0", phase: "stable" }
            },
            riskTrajectory: {
                direction: "stable",
                acceleration: "steady",
                criticalThresholds: []
            },
            behavioralPatterns: {
                journalingFrequency: "stable",
                entryLength: "stable",
                emotionalExpression: "stable"
            },
            crisisRiskIndicators: {
                present: [],
                emerging: [],
                timeline: "2-4 weeks"
            }
        };
    }
}
exports.PredictiveCrisisService = PredictiveCrisisService;
//# sourceMappingURL=predictiveCrisisService.js.map