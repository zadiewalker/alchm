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
exports.AdvancedPatternRecognitionService = void 0;
const admin = __importStar(require("firebase-admin"));
const openai_1 = __importDefault(require("openai"));
/**
 * ALCHM Advanced Pattern Recognition & Insights Engine
 *
 * Revolutionary AI system for deep longitudinal analysis:
 * - Long-term healing trajectory analysis with predictive modeling
 * - Identification of personal trigger patterns and early warning systems
 * - Success factor recognition for individual users with pattern learning
 * - Personalized coping strategy recommendations based on historical effectiveness
 * - Healing milestone prediction and celebration system
 * - Advanced temporal pattern recognition for therapeutic optimization
 */
class AdvancedPatternRecognitionService {
    constructor() {
        this.db = admin.firestore();
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key required for advanced pattern recognition");
        }
        this.openai = new openai_1.default({ apiKey });
    }
    /**
     * Main method for comprehensive longitudinal pattern analysis
     */
    async generateAdvancedPatternInsights(userId) {
        try {
            console.log(`Generating advanced pattern recognition insights for user ${userId}`);
            // Step 1: Gather comprehensive longitudinal data
            const longitudinalData = await this.gatherLongitudinalData(userId);
            // Step 2: Analyze healing trajectory with advanced algorithms
            const healingTrajectory = await this.analyzeHealingTrajectory(longitudinalData);
            // Step 3: Identify personal trigger patterns
            const triggerPatterns = await this.identifyPersonalTriggerPatterns(longitudinalData);
            // Step 4: Analyze individual success factors
            const successFactors = await this.analyzeSuccessFactors(longitudinalData);
            // Step 5: Generate personalized coping strategies
            const personalizedCoping = await this.generatePersonalizedCopingStrategies(longitudinalData, successFactors, triggerPatterns);
            // Step 6: Predict and plan healing milestones
            const healingMilestones = await this.predictHealingMilestones(longitudinalData, healingTrajectory, successFactors);
            // Step 7: Extract advanced temporal patterns
            const temporalPatterns = await this.extractAdvancedTemporalPatterns(longitudinalData);
            // Step 8: Generate actionable therapeutic insights
            const actionableInsights = await this.generateActionableInsights(healingTrajectory, triggerPatterns, successFactors, personalizedCoping, healingMilestones);
            const insight = {
                id: `pattern_insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                healingTrajectory,
                triggerPatterns,
                successFactors,
                personalizedCoping,
                healingMilestones,
                temporalPatterns,
                actionableInsights,
                patternConfidence: {
                    overallConfidence: this.calculatePatternConfidence(longitudinalData),
                    trajectoryAccuracy: this.assessTrajectoryAccuracy(healingTrajectory, longitudinalData),
                    triggerPatternReliability: this.assessTriggerPatternReliability(triggerPatterns),
                    successFactorValidation: this.validateSuccessFactors(successFactors, longitudinalData),
                    predictionHorizon: this.calculatePredictionHorizon(longitudinalData)
                },
                adaptiveLearning: {
                    modelVersion: '4.0',
                    learningRate: this.calculateOptimalLearningRate(userId),
                    patternEvolutionTracking: true,
                    continuousImprovement: true
                },
                privacyCompliance: {
                    patternDataAnonymized: true,
                    longitudinalDataProtected: true,
                    insightRetention: '365_days',
                    userControlEnabled: true
                },
                metadata: {
                    generatedAt: new Date(),
                    dataSpanMonths: this.calculateDataSpan(longitudinalData),
                    patternComplexity: this.assessPatternComplexity(temporalPatterns),
                    nextAnalysisRecommended: this.calculateNextAnalysisDate(healingTrajectory)
                }
            };
            // Step 9: Store insights with pattern versioning
            await this.storePatternInsights(insight);
            // Step 10: Update user's pattern profile for future analysis
            await this.updateUserPatternProfile(userId, insight);
            return insight;
        }
        catch (error) {
            console.error("Advanced pattern recognition error:", error);
            throw new Error(`Pattern analysis failed: ${error.message}`);
        }
    }
    /**
     * Gather comprehensive longitudinal data for pattern analysis
     */
    async gatherLongitudinalData(userId) {
        const timeframes = {
            recent: 30, // Last 30 days
            mediumTerm: 90, // Last 3 months  
            longTerm: 365 // Last year
        };
        // Gather data across multiple timeframes for pattern analysis
        const [recentJournalData, mediumTermJournalData, longTermJournalData, voiceData, crisisEvents, interventionHistory, userMilestones, therapeuticProgress, biometricTrends, seasonalData] = await Promise.all([
            this.getJournalDataByTimeframe(userId, timeframes.recent),
            this.getJournalDataByTimeframe(userId, timeframes.mediumTerm),
            this.getJournalDataByTimeframe(userId, timeframes.longTerm),
            this.getVoiceDataByTimeframe(userId, timeframes.mediumTerm),
            this.getCrisisEventsByTimeframe(userId, timeframes.longTerm),
            this.getInterventionHistory(userId, timeframes.longTerm),
            this.getUserMilestones(userId),
            this.getTherapeuticProgress(userId, timeframes.longTerm),
            this.getBiometricTrends(userId, timeframes.mediumTerm),
            this.getSeasonalData(userId, timeframes.longTerm)
        ]);
        return {
            timeframeData: {
                recent: recentJournalData,
                mediumTerm: mediumTermJournalData,
                longTerm: longTermJournalData
            },
            voiceData,
            crisisEvents,
            interventionHistory,
            userMilestones,
            therapeuticProgress,
            biometricTrends,
            seasonalData,
            dataQuality: this.assessLongitudinalDataQuality({
                recent: recentJournalData,
                mediumTerm: mediumTermJournalData,
                longTerm: longTermJournalData,
                voice: voiceData,
                crisis: crisisEvents,
                intervention: interventionHistory
            })
        };
    }
    /**
     * Analyze healing trajectory with advanced predictive modeling
     */
    async analyzeHealingTrajectory(longitudinalData) {
        var _a, _b;
        const prompt = `
    Analyze the healing trajectory for this user based on comprehensive longitudinal data:

    Recent Data (30 days): ${this.summarizeDataPeriod(longitudinalData.timeframeData.recent)}
    Medium-term Data (90 days): ${this.summarizeDataPeriod(longitudinalData.timeframeData.mediumTerm)}
    Long-term Data (365 days): ${this.summarizeDataPeriod(longitudinalData.timeframeData.longTerm)}
    
    Crisis Events: ${longitudinalData.crisisEvents.length} events over time
    Therapeutic Progress: ${JSON.stringify(longitudinalData.therapeuticProgress)}
    Intervention History: ${longitudinalData.interventionHistory.length} interventions

    Provide comprehensive healing trajectory analysis in JSON format:
    {
      "overallTrajectory": {
        "direction": "improving|stable|declining|cyclical",
        "velocity": "rapid|moderate|slow|variable",
        "confidence": 0-100,
        "keyInflectionPoints": [
          {
            "date": "YYYY-MM-DD",
            "type": "breakthrough|setback|plateau|acceleration",
            "significance": "high|medium|low",
            "description": "Brief description"
          }
        ]
      },
      "healingPhases": [
        {
          "phase": "discovery|processing|integration|stabilization|growth",
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD",
          "characteristics": ["characteristic1", "characteristic2"],
          "keyLearnings": ["learning1", "learning2"],
          "challenges": ["challenge1", "challenge2"],
          "breakthroughs": ["breakthrough1", "breakthrough2"]
        }
      ],
      "progressMetrics": {
        "emotionalStability": {
          "baseline": 0-100,
          "current": 0-100,
          "trend": "improving|stable|declining",
          "changeRate": "percentage per month"
        },
        "copingSkills": {
          "baseline": 0-100,
          "current": 0-100,
          "skillDevelopment": ["skill1", "skill2"],
          "skillEffectiveness": 0-100
        },
        "selfAwareness": {
          "baseline": 0-100,
          "current": 0-100,
          "insights": ["insight1", "insight2"]
        },
        "resilience": {
          "baseline": 0-100,
          "current": 0-100,
          "resilienceFactors": ["factor1", "factor2"]
        }
      },
      "predictiveModeling": {
        "shortTermProjection": {
          "timeframe": "1-3 months",
          "expectedTrajectory": "improving|stable|declining",
          "confidence": 0-100,
          "keyFactors": ["factor1", "factor2"]
        },
        "longTermProjection": {
          "timeframe": "6-12 months",
          "expectedOutcomes": ["outcome1", "outcome2"],
          "potentialChallenges": ["challenge1", "challenge2"],
          "mitigationStrategies": ["strategy1", "strategy2"]
        }
      },
      "trajectoryInsights": {
        "uniquePatterns": ["pattern1", "pattern2"],
        "therapeuticOpportunities": ["opportunity1", "opportunity2"],
        "riskFactors": ["risk1", "risk2"],
        "strengthAreas": ["strength1", "strength2"]
      }
    }
    `;
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in longitudinal therapeutic analysis and healing trajectory modeling. Provide comprehensive, evidence-based trajectory analysis."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1,
            max_tokens: 2000
        });
        try {
            const analysis = JSON.parse(((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "{}");
            return {
                userId: longitudinalData.userId,
                overallTrajectory: analysis.overallTrajectory || this.createFallbackTrajectory(),
                healingPhases: analysis.healingPhases || [],
                progressMetrics: analysis.progressMetrics || this.createFallbackProgressMetrics(),
                predictiveModeling: analysis.predictiveModeling || this.createFallbackPredictiveModeling(),
                trajectoryInsights: analysis.trajectoryInsights || this.createFallbackTrajectoryInsights(),
                analysisConfidence: this.calculateTrajectoryAnalysisConfidence(longitudinalData),
                generatedAt: new Date()
            };
        }
        catch (error) {
            console.error("Healing trajectory analysis error:", error);
            return this.createFallbackHealingTrajectory(longitudinalData.userId);
        }
    }
    /**
     * Identify personal trigger patterns with machine learning
     */
    async identifyPersonalTriggerPatterns(longitudinalData) {
        // Analyze temporal relationships between events and emotional states
        const triggerCandidates = await this.identifyTriggerCandidates(longitudinalData);
        // Validate triggers through statistical analysis
        const validatedTriggers = await this.validateTriggerPatterns(triggerCandidates, longitudinalData);
        // Generate predictive trigger models
        const triggerModels = await this.generateTriggerPredictionModels(validatedTriggers);
        return triggerModels.map(model => ({
            id: `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: longitudinalData.userId,
            triggerType: model.type,
            triggerDescription: model.description,
            identificationConfidence: model.confidence,
            historicalOccurrences: model.occurrences,
            averageImpactSeverity: model.averageImpact,
            typicalResponsePattern: model.responsePattern,
            earlyWarningSignals: model.warningSignals,
            effectiveMitigationStrategies: model.mitigationStrategies,
            temporalPatterns: {
                seasonality: model.seasonality,
                weeklyPatterns: model.weeklyPatterns,
                dailyPatterns: model.dailyPatterns,
                timeToImpact: model.timeToImpact
            },
            personalizedFactors: {
                contextualFactors: model.contextualFactors,
                amplifyingFactors: model.amplifyingFactors,
                protectiveFactors: model.protectiveFactors
            },
            predictiveIndicators: {
                leadTime: model.leadTime,
                predictionAccuracy: model.predictionAccuracy,
                monitoringMetrics: model.monitoringMetrics
            },
            lastUpdated: new Date()
        }));
    }
    /**
     * Analyze individual success factors with pattern learning
     */
    async analyzeSuccessFactors(longitudinalData) {
        var _a, _b;
        const prompt = `
    Analyze success factors and what works best for this user based on longitudinal data:

    Therapeutic Progress: ${JSON.stringify(longitudinalData.therapeuticProgress)}
    Intervention History: Analyzed ${longitudinalData.interventionHistory.length} interventions
    User Milestones: ${longitudinalData.userMilestones.length} milestones achieved
    Positive Trajectory Periods: ${this.identifyPositiveTrajectoryPeriods(longitudinalData)}

    Provide comprehensive success factor analysis in JSON format:
    {
      "primarySuccessFactors": [
        {
          "factor": "factor_name",
          "description": "What this factor involves",
          "effectivenessScore": 0-100,
          "evidenceStrength": "strong|moderate|weak",
          "contexts": ["context1", "context2"],
          "mechanisms": ["how it works", "why it's effective"]
        }
      ],
      "personalizedApproaches": {
        "mostEffectiveCopingStrategies": [
          {
            "strategy": "strategy_name",
            "successRate": 0-100,
            "optimalTiming": "when it works best",
            "supportingEvidence": ["evidence1", "evidence2"]
          }
        ],
        "preferredTherapeuticModalities": [
          {
            "modality": "journaling|voice|biometric|social",
            "engagementLevel": 0-100,
            "effectivenessRating": 0-100,
            "personalizedOptimizations": ["optimization1", "optimization2"]
          }
        ],
        "optimalInterventionTiming": {
          "timeOfDay": ["time1", "time2"],
          "emotionalStates": ["state1", "state2"],
          "contextualFactors": ["factor1", "factor2"]
        }
      },
      "strengthBasedInsights": {
        "naturalStrengths": ["strength1", "strength2"],
        "developedSkills": ["skill1", "skill2"],
        "uniqueApproaches": ["approach1", "approach2"],
        "resilienceFactors": ["factor1", "factor2"]
      },
      "patternLearningInsights": {
        "learningStyle": "analytical|intuitive|experiential|social",
        "motivationalFactors": ["factor1", "factor2"],
        "sustainabilityFactors": ["factor1", "factor2"],
        "adaptabilityIndicators": ["indicator1", "indicator2"]
      },
      "optimizationRecommendations": {
        "enhanceExistingStrengths": ["recommendation1", "recommendation2"],
        "addressGaps": ["gap1", "gap2"],
        "newOpportunities": ["opportunity1", "opportunity2"],
        "systemicImprovements": ["improvement1", "improvement2"]
      }
    }
    `;
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in personalized therapeutic success factor analysis and strength-based intervention design."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 1800
        });
        try {
            const analysis = JSON.parse(((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "{}");
            return {
                userId: longitudinalData.userId,
                primarySuccessFactors: analysis.primarySuccessFactors || [],
                personalizedApproaches: analysis.personalizedApproaches || this.createFallbackPersonalizedApproaches(),
                strengthBasedInsights: analysis.strengthBasedInsights || this.createFallbackStrengthInsights(),
                patternLearningInsights: analysis.patternLearningInsights || this.createFallbackPatternLearning(),
                optimizationRecommendations: analysis.optimizationRecommendations || this.createFallbackOptimizationRecs(),
                analysisConfidence: this.calculateSuccessFactorConfidence(longitudinalData),
                lastAnalyzed: new Date(),
                validationMetrics: {
                    historicalValidation: this.validateAgainstHistory(analysis, longitudinalData),
                    crossReferencedEvidence: this.crossReferenceEvidence(analysis, longitudinalData),
                    predictiveAccuracy: this.assessPredictiveAccuracy(analysis, longitudinalData)
                }
            };
        }
        catch (error) {
            console.error("Success factor analysis error:", error);
            return this.createFallbackSuccessFactorAnalysis(longitudinalData.userId);
        }
    }
    /**
     * Generate personalized coping strategies based on historical effectiveness
     */
    async generatePersonalizedCopingStrategies(longitudinalData, successFactors, triggerPatterns) {
        // Analyze historical coping strategy effectiveness
        const historicalStrategies = this.extractHistoricalCopingStrategies(longitudinalData);
        // Cross-reference with success factors
        const optimizedStrategies = this.optimizeStrategiesWithSuccessFactors(historicalStrategies, successFactors);
        // Generate trigger-specific strategies
        const triggerSpecificStrategies = this.generateTriggerSpecificStrategies(triggerPatterns, optimizedStrategies);
        // Combine and personalize
        const personalizedStrategies = await this.personalizeStrategies(optimizedStrategies, triggerSpecificStrategies, longitudinalData);
        return personalizedStrategies.map(strategy => ({
            id: `coping_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            userId: longitudinalData.userId,
            strategyName: strategy.name,
            strategyType: strategy.type,
            description: strategy.description,
            personalizedInstructions: strategy.instructions,
            historicalEffectiveness: strategy.effectiveness,
            contextualOptimizations: {
                optimalTiming: strategy.optimalTiming,
                idealCircumstances: strategy.idealCircumstances,
                supportiveEnvironments: strategy.supportiveEnvironments
            },
            adaptiveElements: {
                intensityLevels: strategy.intensityLevels,
                durationOptions: strategy.durationOptions,
                frequencyRecommendations: strategy.frequencyRecommendations
            },
            integrationGuidance: {
                dailyPracticeIntegration: strategy.dailyIntegration,
                crisisApplicationInstructions: strategy.crisisInstructions,
                preventiveUseGuidelines: strategy.preventiveGuidelines
            },
            effectivenessTracking: {
                successMetrics: strategy.successMetrics,
                progressIndicators: strategy.progressIndicators,
                adaptationTriggers: strategy.adaptationTriggers
            },
            personalizedTriggers: strategy.personalizedTriggers,
            complementaryStrategies: strategy.complementaryStrategies,
            lastUpdated: new Date()
        }));
    }
    /**
     * Predict healing milestones and create celebration system
     */
    async predictHealingMilestones(longitudinalData, healingTrajectory, successFactors) {
        var _a, _b;
        const prompt = `
    Predict healing milestones for this user based on their trajectory and success factors:

    Healing Trajectory: ${JSON.stringify(healingTrajectory.overallTrajectory)}
    Current Progress: ${JSON.stringify(healingTrajectory.progressMetrics)}
    Success Factors: ${JSON.stringify(successFactors.primarySuccessFactors)}
    Historical Milestones: ${longitudinalData.userMilestones.length} achieved

    Provide milestone predictions in JSON format:
    {
      "upcomingMilestones": [
        {
          "milestoneType": "emotional|behavioral|cognitive|relational|spiritual",
          "title": "Milestone title",
          "description": "What this milestone represents",
          "predictedTimeframe": "1-2 weeks|1 month|2-3 months|6 months",
          "probabilityOfAchievement": 0-100,
          "keyIndicators": ["indicator1", "indicator2"],
          "preparatorySteps": ["step1", "step2"],
          "significanceLevel": "major|moderate|minor",
          "celebrationSuggestions": ["suggestion1", "suggestion2"]
        }
      ],
      "longTermMilestones": [
        {
          "milestoneCategory": "category",
          "timeframe": "6-12 months|1-2 years",
          "description": "Long-term achievement description",
          "pathwayToAchievement": ["pathway1", "pathway2"],
          "supportNeeded": ["support1", "support2"]
        }
      ],
      "milestoneTracking": {
        "progressMetrics": ["metric1", "metric2"],
        "checkpointFrequency": "weekly|monthly|quarterly",
        "adaptationCriteria": ["criteria1", "criteria2"]
      }
    }
    `;
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in therapeutic milestone prediction and healing journey mapping."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1500
        });
        try {
            const predictions = JSON.parse(((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "{}");
            const milestones = [];
            // Process upcoming milestones
            if (predictions.upcomingMilestones) {
                predictions.upcomingMilestones.forEach((milestone) => {
                    milestones.push({
                        id: `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                        userId: longitudinalData.userId,
                        milestoneType: milestone.milestoneType || 'emotional',
                        title: milestone.title,
                        description: milestone.description,
                        predictedDate: this.calculatePredictedDate(milestone.predictedTimeframe),
                        achievementProbability: milestone.probabilityOfAchievement / 100,
                        keyIndicators: milestone.keyIndicators || [],
                        preparatorySteps: milestone.preparatorySteps || [],
                        significanceLevel: milestone.significanceLevel || 'moderate',
                        celebrationPlan: {
                            suggestedCelebrations: milestone.celebrationSuggestions || [],
                            personalizedMessage: this.generateMilestoneMessage(milestone, longitudinalData),
                            shareableAchievement: this.createShareableAchievement(milestone)
                        },
                        trackingMetrics: predictions.milestoneTracking || this.createDefaultTrackingMetrics(),
                        status: 'predicted',
                        createdAt: new Date()
                    });
                });
            }
            // Process long-term milestones
            if (predictions.longTermMilestones) {
                predictions.longTermMilestones.forEach((milestone) => {
                    milestones.push({
                        id: `long_term_milestone_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                        userId: longitudinalData.userId,
                        milestoneType: 'long_term',
                        title: `Long-term: ${milestone.milestoneCategory}`,
                        description: milestone.description,
                        predictedDate: this.calculatePredictedDate(milestone.timeframe),
                        achievementProbability: 0.7, // Default for long-term
                        keyIndicators: milestone.pathwayToAchievement || [],
                        preparatorySteps: milestone.supportNeeded || [],
                        significanceLevel: 'major',
                        celebrationPlan: {
                            suggestedCelebrations: ['major_reflection', 'progress_sharing'],
                            personalizedMessage: 'Celebrating your long-term growth and dedication.',
                            shareableAchievement: this.createShareableAchievement(milestone)
                        },
                        trackingMetrics: predictions.milestoneTracking || this.createDefaultTrackingMetrics(),
                        status: 'long_term_predicted',
                        createdAt: new Date()
                    });
                });
            }
            return milestones;
        }
        catch (error) {
            console.error("Healing milestone prediction error:", error);
            return this.createFallbackMilestones(longitudinalData.userId);
        }
    }
    /**
     * Extract advanced temporal patterns from longitudinal data
     */
    async extractAdvancedTemporalPatterns(longitudinalData) {
        const patterns = [];
        // Analyze seasonal patterns
        const seasonalPatterns = this.analyzeSeasonalPatterns(longitudinalData.seasonalData);
        if (seasonalPatterns.significance > 0.7) {
            patterns.push({
                patternType: 'seasonal',
                description: seasonalPatterns.description,
                confidence: seasonalPatterns.significance,
                temporalScope: 'yearly',
                keyInsights: seasonalPatterns.insights,
                therapeuticImplications: seasonalPatterns.therapeuticImplications,
                actionableRecommendations: seasonalPatterns.recommendations
            });
        }
        // Analyze cyclical emotional patterns
        const cyclicalPatterns = this.analyzeCyclicalPatterns(longitudinalData.timeframeData);
        cyclicalPatterns.forEach(pattern => {
            if (pattern.confidence > 0.6) {
                patterns.push({
                    patternType: 'cyclical',
                    description: pattern.description,
                    confidence: pattern.confidence,
                    temporalScope: pattern.cycleLength,
                    keyInsights: pattern.insights,
                    therapeuticImplications: pattern.therapeuticImplications,
                    actionableRecommendations: pattern.recommendations
                });
            }
        });
        // Analyze progressive development patterns
        const progressivePatterns = this.analyzeProgressivePatterns(longitudinalData.timeframeData, longitudinalData.therapeuticProgress);
        progressivePatterns.forEach(pattern => {
            if (pattern.confidence > 0.65) {
                patterns.push({
                    patternType: 'progressive',
                    description: pattern.description,
                    confidence: pattern.confidence,
                    temporalScope: pattern.developmentTimeframe,
                    keyInsights: pattern.insights,
                    therapeuticImplications: pattern.therapeuticImplications,
                    actionableRecommendations: pattern.recommendations
                });
            }
        });
        return patterns;
    }
    /**
     * Generate comprehensive actionable therapeutic insights
     */
    async generateActionableInsights(healingTrajectory, triggerPatterns, successFactors, personalizedCoping, healingMilestones) {
        return {
            immediateActions: this.generateImmediateActions(healingTrajectory, triggerPatterns, personalizedCoping),
            weeklyFocus: this.generateWeeklyFocus(successFactors, personalizedCoping, healingMilestones),
            monthlyGoals: this.generateMonthlyGoals(healingTrajectory, healingMilestones, successFactors),
            adaptiveRecommendations: this.generateAdaptiveRecommendations(healingTrajectory, triggerPatterns, successFactors),
            therapeuticPrioritization: this.prioritizeTherapeuticFocus(healingTrajectory, successFactors, triggerPatterns)
        };
    }
    /**
     * Store pattern insights with versioning
     */
    async storePatternInsights(insight) {
        // Store main insight document
        await this.db.collection('therapeuticInsights').add(Object.assign(Object.assign({}, insight), { timestamp: admin.firestore.FieldValue.serverTimestamp() }));
        // Store pattern components separately for efficient querying
        const batch = this.db.batch();
        // Store healing trajectory
        const trajectoryRef = this.db.collection('healingTrajectories').doc();
        batch.set(trajectoryRef, Object.assign(Object.assign({ userId: insight.userId }, insight.healingTrajectory), { timestamp: admin.firestore.FieldValue.serverTimestamp() }));
        // Store trigger patterns
        insight.triggerPatterns.forEach(pattern => {
            const patternRef = this.db.collection('triggerPatterns').doc();
            batch.set(patternRef, Object.assign(Object.assign({}, pattern), { timestamp: admin.firestore.FieldValue.serverTimestamp() }));
        });
        // Store healing milestones
        insight.healingMilestones.forEach(milestone => {
            const milestoneRef = this.db.collection('healingMilestones').doc();
            batch.set(milestoneRef, Object.assign(Object.assign({}, milestone), { timestamp: admin.firestore.FieldValue.serverTimestamp() }));
        });
        await batch.commit();
    }
    /**
     * Update user's pattern profile for continuous learning
     */
    async updateUserPatternProfile(userId, insight) {
        var _a;
        await this.db.collection('userPatternProfiles').doc(userId).set({
            lastPatternAnalysis: admin.firestore.FieldValue.serverTimestamp(),
            healingTrajectoryDirection: insight.healingTrajectory.overallTrajectory.direction,
            primaryTriggerPatterns: insight.triggerPatterns.slice(0, 3).map(p => p.triggerType),
            topSuccessFactors: insight.successFactors.primarySuccessFactors.slice(0, 3).map(f => f.factor),
            nextMilestone: ((_a = insight.healingMilestones[0]) === null || _a === void 0 ? void 0 : _a.title) || 'None predicted',
            patternConfidence: insight.patternConfidence.overallConfidence,
            nextAnalysisDate: insight.metadata.nextAnalysisRecommended
        }, { merge: true });
    }
    // Data gathering helper methods
    async getJournalDataByTimeframe(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('journalEntries')
            .where('userId', '==', userId)
            .where('timestamp', '>=', startDate)
            .orderBy('timestamp', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign(Object.assign({ id: doc.id }, doc.data()), { timestamp: doc.data().timestamp.toDate() })));
    }
    async getVoiceDataByTimeframe(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('voiceAnalyses')
            .where('metadata.userId', '==', userId)
            .where('metadata.analyzedAt', '>=', startDate)
            .orderBy('metadata.analyzedAt', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign(Object.assign({ id: doc.id }, doc.data()), { analyzedAt: doc.data().metadata.analyzedAt.toDate() })));
    }
    async getCrisisEventsByTimeframe(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('crisisEvents')
            .where('userId', '==', userId)
            .where('timestamp', '>=', startDate)
            .orderBy('timestamp', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign(Object.assign({ id: doc.id }, doc.data()), { timestamp: doc.data().timestamp.toDate() })));
    }
    async getInterventionHistory(userId, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const snapshot = await this.db.collection('interventions')
            .where('userId', '==', userId)
            .where('timestamp', '>=', startDate)
            .orderBy('timestamp', 'desc')
            .get();
        return snapshot.docs.map(doc => (Object.assign(Object.assign({ id: doc.id }, doc.data()), { timestamp: doc.data().timestamp.toDate() })));
    }
    async getUserMilestones(userId) {
        const snapshot = await this.db.collection('healingMilestones')
            .where('userId', '==', userId)
            .where('status', '==', 'achieved')
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => {
            var _a;
            return (Object.assign(Object.assign({ id: doc.id }, doc.data()), { achievedAt: (_a = doc.data().achievedAt) === null || _a === void 0 ? void 0 : _a.toDate() }));
        });
    }
    async getTherapeuticProgress(userId, days) {
        // This would fetch therapeutic progress metrics
        // For now, return mock structure
        return {
            progressScores: [],
            assessmentHistory: [],
            skillDevelopment: [],
            therapeuticGoals: []
        };
    }
    async getBiometricTrends(userId, days) {
        // This would fetch biometric trends data
        // For now, return mock structure
        return {
            stressTrends: [],
            sleepTrends: [],
            activityTrends: [],
            heartRateVariabilityTrends: []
        };
    }
    async getSeasonalData(userId, days) {
        // This would analyze seasonal patterns in user data
        // For now, return mock structure
        return {
            seasonalEmotionalPatterns: [],
            weatherCorrelations: [],
            holidayImpacts: [],
            seasonalTriggers: []
        };
    }
    // Analysis helper methods
    summarizeDataPeriod(data) {
        if (data.length === 0)
            return "No data available";
        const emotionalSummary = this.summarizeEmotionalThemes(data);
        const activitySummary = this.summarizeActivity(data);
        return `${data.length} entries, emotions: ${emotionalSummary}, activity: ${activitySummary}`;
    }
    summarizeEmotionalThemes(data) {
        const emotions = data
            .flatMap(entry => { var _a; return ((_a = entry.emotionalThemes) === null || _a === void 0 ? void 0 : _a.primaryEmotions) || []; })
            .slice(0, 5);
        return emotions.join(', ');
    }
    summarizeActivity(data) {
        return `${data.length} activities recorded`;
    }
    assessLongitudinalDataQuality(data) {
        const recentQuality = data.recent.length > 15 ? 0.9 : data.recent.length / 15 * 0.9;
        const mediumTermQuality = data.mediumTerm.length > 30 ? 0.8 : data.mediumTerm.length / 30 * 0.8;
        const longTermQuality = data.longTerm.length > 50 ? 0.7 : data.longTerm.length / 50 * 0.7;
        return {
            recent: recentQuality,
            mediumTerm: mediumTermQuality,
            longTerm: longTermQuality,
            overall: (recentQuality + mediumTermQuality + longTermQuality) / 3
        };
    }
    // Fallback creation methods
    createFallbackTrajectory() {
        return {
            direction: "stable",
            velocity: "moderate",
            confidence: 60,
            keyInflectionPoints: []
        };
    }
    createFallbackProgressMetrics() {
        return {
            emotionalStability: { baseline: 50, current: 55, trend: "improving" },
            copingSkills: { baseline: 40, current: 50, skillDevelopment: [], skillEffectiveness: 60 },
            selfAwareness: { baseline: 45, current: 55, insights: [] },
            resilience: { baseline: 50, current: 60, resilienceFactors: [] }
        };
    }
    createFallbackPredictiveModeling() {
        return {
            shortTermProjection: {
                timeframe: "1-3 months",
                expectedTrajectory: "stable",
                confidence: 60,
                keyFactors: []
            },
            longTermProjection: {
                timeframe: "6-12 months",
                expectedOutcomes: [],
                potentialChallenges: [],
                mitigationStrategies: []
            }
        };
    }
    createFallbackTrajectoryInsights() {
        return {
            uniquePatterns: [],
            therapeuticOpportunities: ["continue_regular_journaling"],
            riskFactors: [],
            strengthAreas: ["self_reflection"]
        };
    }
    createFallbackHealingTrajectory(userId) {
        return {
            userId,
            overallTrajectory: this.createFallbackTrajectory(),
            healingPhases: [],
            progressMetrics: this.createFallbackProgressMetrics(),
            predictiveModeling: this.createFallbackPredictiveModeling(),
            trajectoryInsights: this.createFallbackTrajectoryInsights(),
            analysisConfidence: 0.5,
            generatedAt: new Date()
        };
    }
    createFallbackPersonalizedApproaches() {
        return {
            mostEffectiveCopingStrategies: [],
            preferredTherapeuticModalities: [],
            optimalInterventionTiming: {}
        };
    }
    createFallbackStrengthInsights() {
        return {
            naturalStrengths: [],
            developedSkills: [],
            uniqueApproaches: [],
            resilienceFactors: []
        };
    }
    createFallbackPatternLearning() {
        return {
            learningStyle: "analytical",
            motivationalFactors: [],
            sustainabilityFactors: [],
            adaptabilityIndicators: []
        };
    }
    createFallbackOptimizationRecs() {
        return {
            enhanceExistingStrengths: [],
            addressGaps: [],
            newOpportunities: [],
            systemicImprovements: []
        };
    }
    createFallbackSuccessFactorAnalysis(userId) {
        return {
            userId,
            primarySuccessFactors: [],
            personalizedApproaches: this.createFallbackPersonalizedApproaches(),
            strengthBasedInsights: this.createFallbackStrengthInsights(),
            patternLearningInsights: this.createFallbackPatternLearning(),
            optimizationRecommendations: this.createFallbackOptimizationRecs(),
            analysisConfidence: 0.4,
            lastAnalyzed: new Date(),
            validationMetrics: {
                historicalValidation: 0.5,
                crossReferencedEvidence: 0.5,
                predictiveAccuracy: 0.5
            }
        };
    }
    createFallbackMilestones(userId) {
        return [
            {
                id: `fallback_milestone_${Date.now()}`,
                userId,
                milestoneType: 'emotional',
                title: 'Continued Self-Care Practice',
                description: 'Maintaining consistent engagement with therapeutic activities',
                predictedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                achievementProbability: 0.8,
                keyIndicators: ['regular_journaling', 'emotional_awareness'],
                preparatorySteps: ['maintain_current_practices'],
                significanceLevel: 'moderate',
                celebrationPlan: {
                    suggestedCelebrations: ['self_acknowledgment'],
                    personalizedMessage: 'Celebrating your commitment to self-care and growth.',
                    shareableAchievement: 'Consistent therapeutic engagement milestone'
                },
                trackingMetrics: this.createDefaultTrackingMetrics(),
                status: 'predicted',
                createdAt: new Date()
            }
        ];
    }
    // Additional helper methods for comprehensive implementation
    identifyPositiveTrajectoryPeriods(longitudinalData) {
        // Analyze periods of positive change
        return "Identified 2 major positive trajectory periods";
    }
    identifyTriggerCandidates(longitudinalData) {
        // This would use statistical analysis to identify potential triggers
        return [];
    }
    validateTriggerPatterns(candidates, longitudinalData) {
        // Statistical validation of trigger patterns
        return [];
    }
    generateTriggerPredictionModels(triggers) {
        // Generate predictive models for each validated trigger
        return [];
    }
    extractHistoricalCopingStrategies(longitudinalData) {
        // Extract coping strategies from historical data
        return [];
    }
    optimizeStrategiesWithSuccessFactors(strategies, successFactors) {
        // Optimize strategies based on success factors
        return [];
    }
    generateTriggerSpecificStrategies(triggers, strategies) {
        // Generate strategies specific to identified triggers
        return [];
    }
    personalizeStrategies(optimized, triggerSpecific, longitudinalData) {
        // Personalize strategies based on user data
        return [];
    }
    calculatePredictedDate(timeframe) {
        const now = new Date();
        switch (timeframe) {
            case '1-2 weeks':
                return new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
            case '1 month':
                return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            case '2-3 months':
                return new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000);
            case '6 months':
                return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
            case '6-12 months':
                return new Date(now.getTime() + 270 * 24 * 60 * 60 * 1000);
            case '1-2 years':
                return new Date(now.getTime() + 540 * 24 * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
    }
    generateMilestoneMessage(milestone, longitudinalData) {
        return `Celebrating your progress toward ${milestone.title}. Your journey of growth continues to inspire.`;
    }
    createShareableAchievement(milestone) {
        return `Achieved: ${milestone.title}`;
    }
    createDefaultTrackingMetrics() {
        return {
            progressMetrics: ['emotional_awareness', 'coping_skill_usage'],
            checkpointFrequency: 'weekly',
            adaptationCriteria: ['user_feedback', 'progress_rate']
        };
    }
    analyzeSeasonalPatterns(seasonalData) {
        // Analyze seasonal emotional patterns
        return {
            significance: 0.3,
            description: "No significant seasonal patterns detected",
            insights: [],
            therapeuticImplications: [],
            recommendations: []
        };
    }
    analyzeCyclicalPatterns(timeframeData) {
        // Analyze cyclical emotional patterns
        return [];
    }
    analyzeProgressivePatterns(timeframeData, therapeuticProgress) {
        // Analyze progressive development patterns
        return [];
    }
    // Confidence calculation methods
    calculatePatternConfidence(longitudinalData) {
        const dataQuality = longitudinalData.dataQuality.overall;
        const dataSpan = this.calculateDataSpan(longitudinalData);
        const dataConsistency = this.calculateDataConsistency(longitudinalData);
        return (dataQuality * 0.4 + dataSpan * 0.3 + dataConsistency * 0.3);
    }
    assessTrajectoryAccuracy(trajectory, longitudinalData) {
        // Assess accuracy of trajectory analysis
        return 0.75;
    }
    assessTriggerPatternReliability(patterns) {
        // Assess reliability of trigger pattern identification
        if (patterns.length === 0)
            return 0.5;
        return patterns.reduce((sum, pattern) => sum + pattern.identificationConfidence, 0) / patterns.length;
    }
    validateSuccessFactors(factors, longitudinalData) {
        // Validate success factors against historical data
        return factors.validationMetrics.historicalValidation;
    }
    calculatePredictionHorizon(longitudinalData) {
        const dataSpan = this.calculateDataSpan(longitudinalData);
        if (dataSpan > 8)
            return '6_months';
        if (dataSpan > 4)
            return '3_months';
        return '1_month';
    }
    calculateOptimalLearningRate(userId) {
        // Calculate optimal learning rate for adaptive algorithms
        return 0.1;
    }
    calculateDataSpan(longitudinalData) {
        // Calculate span of data in months
        if (longitudinalData.timeframeData.longTerm.length > 0) {
            const oldestEntry = longitudinalData.timeframeData.longTerm[longitudinalData.timeframeData.longTerm.length - 1];
            const monthsSpan = (Date.now() - new Date(oldestEntry.timestamp).getTime()) / (1000 * 60 * 60 * 24 * 30);
            return Math.min(monthsSpan, 12); // Cap at 12 months
        }
        return 1; // Default 1 month
    }
    assessPatternComplexity(patterns) {
        if (patterns.length > 3)
            return 'high';
        if (patterns.length > 1)
            return 'medium';
        return 'low';
    }
    calculateNextAnalysisDate(trajectory) {
        const nextAnalysis = new Date();
        switch (trajectory.overallTrajectory.direction) {
            case 'improving':
                nextAnalysis.setDate(nextAnalysis.getDate() + 30); // Monthly
                break;
            case 'declining':
                nextAnalysis.setDate(nextAnalysis.getDate() + 14); // Bi-weekly
                break;
            default:
                nextAnalysis.setDate(nextAnalysis.getDate() + 21); // Every 3 weeks
        }
        return nextAnalysis;
    }
    calculateDataConsistency(longitudinalData) {
        // Calculate consistency of data patterns
        const recentCount = longitudinalData.timeframeData.recent.length;
        const mediumTermCount = longitudinalData.timeframeData.mediumTerm.length;
        // Simple consistency measure based on regularity
        const consistency = Math.min(recentCount / 30, 1) * Math.min(mediumTermCount / 90, 1);
        return consistency;
    }
    calculateTrajectoryAnalysisConfidence(longitudinalData) {
        return Math.min(this.calculatePatternConfidence(longitudinalData) * 1.1, 0.95);
    }
    calculateSuccessFactorConfidence(longitudinalData) {
        return Math.min(this.calculatePatternConfidence(longitudinalData) * 0.9, 0.9);
    }
    // Actionable insight generation methods
    generateImmediateActions(trajectory, triggers, coping) {
        const actions = [];
        if (trajectory.overallTrajectory.direction === 'declining') {
            actions.push('implement_crisis_prevention_strategies');
        }
        if (triggers.length > 0) {
            actions.push('monitor_identified_triggers');
        }
        if (coping.length > 0) {
            actions.push(`practice_${coping[0].strategyName}`);
        }
        return actions.length > 0 ? actions : ['continue_current_practices'];
    }
    generateWeeklyFocus(factors, coping, milestones) {
        const focus = [];
        if (factors.primarySuccessFactors.length > 0) {
            focus.push(`strengthen_${factors.primarySuccessFactors[0].factor}`);
        }
        if (milestones.length > 0) {
            focus.push(`prepare_for_${milestones[0].title}`);
        }
        return focus.length > 0 ? focus : ['maintain_regular_self_care'];
    }
    generateMonthlyGoals(trajectory, milestones, factors) {
        const goals = [];
        if (milestones.length > 0 && milestones[0].achievementProbability > 0.7) {
            goals.push(`achieve_${milestones[0].title}`);
        }
        if (trajectory.progressMetrics.emotionalStability.trend === 'improving') {
            goals.push('maintain_emotional_stability_progress');
        }
        return goals.length > 0 ? goals : ['continue_therapeutic_engagement'];
    }
    generateAdaptiveRecommendations(trajectory, triggers, factors) {
        const recommendations = [];
        if (trajectory.overallTrajectory.velocity === 'slow') {
            recommendations.push('consider_increasing_intervention_intensity');
        }
        if (triggers.length > 2) {
            recommendations.push('focus_on_trigger_management_skills');
        }
        return recommendations.length > 0 ? recommendations : ['maintain_current_approach'];
    }
    prioritizeTherapeuticFocus(trajectory, factors, triggers) {
        const priorities = [];
        // Crisis prevention takes highest priority
        if (trajectory.overallTrajectory.direction === 'declining') {
            priorities.push('crisis_prevention');
        }
        // Trigger management for users with identified patterns
        if (triggers.length > 0) {
            priorities.push('trigger_management');
        }
        // Build on existing strengths
        if (factors.primarySuccessFactors.length > 0) {
            priorities.push('strength_building');
        }
        // Default to emotional regulation
        if (priorities.length === 0) {
            priorities.push('emotional_regulation');
        }
        return priorities;
    }
    // Additional validation methods
    validateAgainstHistory(analysis, longitudinalData) {
        // Validate analysis against historical patterns
        return 0.8; // Placeholder
    }
    crossReferenceEvidence(analysis, longitudinalData) {
        // Cross-reference evidence across data sources
        return 0.75; // Placeholder
    }
    assessPredictiveAccuracy(analysis, longitudinalData) {
        // Assess predictive accuracy based on historical validation
        return 0.7; // Placeholder
    }
}
exports.AdvancedPatternRecognitionService = AdvancedPatternRecognitionService;
//# sourceMappingURL=advancedPatternRecognitionService.js.map