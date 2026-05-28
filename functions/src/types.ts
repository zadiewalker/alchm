// Types for ALCHM AI Analysis system
export interface JournalAnalysis {
  id: string;
  analysis: {
    emotionalRecognition: string;
    strengthIdentification: string;
    gentleInsight: string;
    nurturingSuggestion: string;
  };
  emotionalThemes: {
    primaryEmotions: string[];
    emotionalJourney: string;
    copingStrategies: string[] | null;
    growthIndicators: string[] | null;
    supportiveNote: string;
  };
  wisdomReflection: string;
  crisisAssessment: {
    isCrisis: boolean;
    confidenceLevel: "low" | "medium" | "high";
    reasoning: string;
    suggestedResources: string[] | null;
  };
  metadata: {
    analyzedAt: Date;
    userId: string;
    journalEntryId: string;
  };
}

export interface AnalysisRequest {
  journalEntry: string;
  userId: string;
  journalEntryId: string;
  sessionToken?: string;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  confidenceLevel: "low" | "medium" | "high";
  reasoning: string;
  suggestedResources: string[] | null;
}

export interface EmotionalThemes {
  primaryEmotions: string[];
  emotionalJourney: string;
  copingStrategies: string[] | null;
  growthIndicators: string[] | null;
  supportiveNote: string;
}

export interface KheperaOnboardingResponse {
  witness: string;
  perspective: string;
  seed: string;
  source?: "fallback";
}

// Crisis Monitoring Dashboard Types
export interface CrisisEvent {
  id: string;
  anonymizedId: string; // Hashed user ID for privacy
  analysisId: string;
  journalEntryId: string;
  confidenceLevel: "low" | "medium" | "high";
  reasoning: string;
  timestamp: Date;
  escalated: boolean;
  resolved?: boolean;
  resolvedAt?: Date;
  location?: {
    country: string;
    region?: string;
  };
  demographics?: {
    ageRange?: string;
    language?: string;
  };
}

export interface AdminUser {
  uid: string;
  email: string;
  role: "crisis_monitor" | "crisis_supervisor" | "system_admin";
  permissions: string[];
  verified: boolean;
  lastAccess?: Date;
}

export interface CrisisAnalytics {
  period: string;
  totalCrises: number;
  highConfidenceCrises: number;
  averageResponseTime: number;
  trends: {
    daily: { date: string; count: number }[];
    byConfidence: { level: string; count: number }[];
    byDemographics: { category: string; value: string; count: number }[];
  };
  systemHealth: {
    aiUptime: number;
    averageProcessingTime: number;
    falsePositiveRate?: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  condition: "high_confidence_spike" | "system_failure" | "response_time_threshold";
  threshold: number;
  enabled: boolean;
  recipients: string[];
  lastTriggered?: Date;
}

// ========================================
// NEXT-GENERATION AI SYSTEM TYPES
// ========================================

// Voice Analysis Types
export interface VoiceAnalysisRequest {
  audioBuffer: Buffer;
  userId: string;
  language?: string;
  sessionId?: string;
  timestamp: number;
}

export interface VoiceAnalysisResult {
  id: string;
  transcription: {
    text: string;
    language: string;
    duration: number;
    segments: any[];
    words?: any[];
  };
  emotionalAnalysis: VoiceEmotionalMetrics;
  voiceBiomarkers: VoicalBiomarkers;
  crisisAssessment: CrisisVoiceIndicators;
  linguisticPatterns: any;
  emotionalTimeline: Array<{
    timestamp: number;
    duration: number;
    text: string;
    emotionalState: string;
    intensity: number;
  }>;
  personalizedInsights: any;
  privacy: {
    audioProcessedLocally: boolean;
    biomarkersAnonymized: boolean;
    retentionPolicy: string;
  };
  metadata: {
    analyzedAt: Date;
    userId: string;
    sessionId?: string;
    language: string;
    processingTimeMs: number;
  };
}

export interface VoiceEmotionalMetrics {
  primaryEmotions: string[];
  emotionalIntensity: {
    valence: number; // 0-100
    arousal: number; // 0-100
    dominance: number; // 0-100
  };
  emotionalEvolution: {
    startingState: string;
    endingState: string;
    keyTransitions: string[];
  };
  traumaIndicators: {
    present: boolean;
    severity: "low" | "medium" | "high";
    triggers: string[];
  };
  copingMechanisms: string[];
  resilienceFactors: string[];
  therapeuticOpportunities: string[];
}

export interface VoicalBiomarkers {
  speechRate: {
    wordsPerMinute: number;
    variability: number;
    deviationFromBaseline: number;
  };
  pausePatterns: {
    averagePauseLength: number;
    pauseFrequency: number;
    emotionalPauses: number;
  };
  vocalizationQuality: {
    clarity: number;
    confidence: number;
    emotionalStability: number;
  };
  prosodyFeatures: {
    intonationVariability: number;
    rhythmRegularity: number;
    emotionalProsody: string;
  };
}

export interface CrisisVoiceIndicators {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  textualIndicators: string[];
  voiceIndicators: string[];
  immediateIntervention: boolean;
  recommendedActions: string[];
  confidenceLevel: number;
}

// Predictive Crisis Prevention Types
export interface CrisisPredictionModel {
  userId: string;
  overallRisk: "low" | "medium" | "high";
  overallRiskScore: number;
  confidence: number;
  keyFactors: string[];
  predictionModel: string;
  dataQuality: "low" | "medium" | "high";
  riskFactorBreakdown: {
    temporalRisk: number;
    historicalRisk: number;
    currentStateRisk: number;
    protectiveFactorScore: number;
  };
}

export interface UserRiskProfile {
  userId: string;
  baseline: {
    emotionalBaseline: {
      averageValence: number;
      averageArousal: number;
      averageStability: number;
    };
    behavioralBaseline: {
      averageEntryLength: number;
      typicalJournalingTime: string;
      journalingFrequency: number;
    };
    voiceBaseline?: {
      averageSpeechRate: number;
      emotionalStability: number;
    };
  };
  historicalEntries: any[];
  voiceData: any[];
  crisisHistory: any[];
  riskFactors: string[];
  protectiveFactors: string[];
  crisisPatterns: {
    frequency: number;
    averageIntensity: number;
    commonTriggers: string[];
    seasonality: string;
    recoveryTime: number;
  };
  engagementMetrics: any;
  modelAccuracy?: number;
  lastAnalyzed: Date;
}

export interface PredictiveInsights {
  id: string;
  userId: string;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  predictionHorizon: string;
  keyRiskFactors: string[];
  earlyWarningSignals: EarlyWarningSignal[];
  recommendedInterventions: InterventionRecommendation[];
  crisisTrajectory: CrisisTrajectory;
  personalizedBaseline: any;
  modelMetadata: {
    analysisVersion: string;
    dataPointsAnalyzed: number;
    predictionAccuracy: number;
    lastUpdated: Date;
  };
  nextAnalysisDate: Date;
}

export interface EarlyWarningSignal {
  type: "behavioral" | "emotional" | "linguistic" | "crisis_pattern";
  signal: string;
  severity: "low" | "medium" | "high";
  description: string;
  threshold: string;
  actionRequired: boolean;
  timeframe: string;
}

export interface InterventionRecommendation {
  type: "immediate" | "therapeutic" | "supportive" | "preventive";
  intervention: string;
  priority: "urgent" | "high" | "medium" | "low";
  description: string;
  timing: string;
  method: string;
  customMessage: string;
  followUpRequired: boolean;
}

export interface CrisisTrajectory {
  currentPhase: string;
  predictedPhases: Array<{
    phase: string;
    timeframe: string;
    probability: number;
  }>;
  interventionWindows: Array<{
    window: string;
    effectiveness: number;
    urgency: string;
  }>;
  timeToIntervention: string;
  confidenceInterval: number;
}

// Personalized Intervention Timing Types
export interface UserCircadianProfile {
  userId: string;
  circadianRhythm: {
    peakAlertness: number[];
    lowEnergyPeriods: number[];
    naturalWakeTime: number;
    naturalSleepTime: number;
    midDayDip: number;
  };
  energyCycles: {
    highEnergyWindows: string[];
    lowEnergyWindows: string[];
    transitionPeriods: string[];
    weekdayVsWeekend: any;
  };
  interventionWindows: {
    optimal: string[];
    acceptable: string[];
    avoid: string[];
  };
  emotionalReceptivity: {
    highReceptivityTimes: number[];
    lowReceptivityTimes: number[];
    emotionalStatePatterns: any;
  };
  personalPreferences: {
    timezone: string;
    preferredContactTimes: string[];
    doNotDisturbHours: string[];
    interventionFrequency: string;
  };
  profileAccuracy: number;
  lastUpdated: Date;
}

export interface InterventionSchedule {
  id: string;
  userId: string;
  circadianProfile: UserCircadianProfile;
  receptivityModel: ReceptivityPredictor;
  timingModel: OptimalTimingModel;
  interventionConfig: AdaptiveInterventionConfig;
  scheduledInterventions: PersonalizedIntervention[];
  effectivenessTracking: {
    enabled: boolean;
    metrics: string[];
    feedbackLoop: boolean;
  };
  adaptiveSettings: {
    learningEnabled: boolean;
    adjustmentFrequency: string;
    personalizedFactors: string[];
  };
  metadata: {
    generatedAt: Date;
    version: string;
    nextUpdate: Date;
  };
}

export interface PersonalizedIntervention {
  id: string;
  userId: string;
  type: string;
  scheduledTime: Date;
  content: string;
  deliveryMethod: string;
  intensity: string;
  adaptiveSettings: {
    canReschedule: boolean;
    reschedulingWindow: string;
    contextualAdjustments: boolean;
  };
  metadata: {
    generatedAt: Date;
    timingConfidence: number;
    expectedEngagement: number;
  };
}

export interface OptimalTimingModel {
  userId: string;
  interventionTypeTimings: {
    [key: string]: {
      optimal: string[];
      effectiveness: number;
      frequency: string;
    };
  };
  personalizedAdjustments: {
    stressStateModifications: any;
    emotionalStateModifications: any;
    contextualModifications: any;
  };
  adaptiveRules: {
    successFeedbackBoost: number;
    failureFeedbackReduction: number;
    contextualLearning: boolean;
    temporalDriftAdjustment: boolean;
  };
  confidenceMetrics: {
    overallConfidence: number;
    interventionSpecificConfidence: { [key: string]: number };
    predictionHorizon: string;
  };
}

export interface ReceptivityPredictor {
  userId: string;
  hourlyReceptivityScores: { [key: string]: number };
  weekdayFactors: { [key: string]: number };
  contextualFactors: {
    afterJournaling: number;
    morningPerson: boolean;
    eveningPerson: boolean;
    stressResponseTiming: string;
  };
  personalizedTriggers: {
    positiveState: string[];
    neutralState: string[];
    challengingState: string[];
  };
  avoidancePatterns: {
    timeBasedAvoidance: string[];
    contextBasedAvoidance: string[];
  };
  modelAccuracy: number;
  lastTraining: Date;
  adaptationRate: number;
}

export interface AdaptiveInterventionConfig {
  userId: string;
  intensitySettings: {
    baseline: string;
    adaptationRules: {
      [key: string]: {
        modifier: number;
        rationale: string;
      };
    };
  };
  frequencySettings: {
    baseline: string;
    adaptationRules: {
      [key: string]: {
        modifier: number;
        rationale: string;
      };
    };
  };
  contentPersonalization: {
    languageStyle: string;
    emotionalTone: string;
    contentLength: string;
    personalizedElements: string[];
  };
  deliveryMethodOptimization: {
    preferredMethods: string[];
    fallbackMethods: string[];
    contextualMethodSelection: any;
  };
  feedbackLoopSettings: {
    implicitFeedbackTracking: boolean;
    explicitFeedbackRequests: string;
    adaptationSpeed: string;
    rollbackCapability: boolean;
  };
}

// Multi-Modal Therapeutic AI Types
export interface MultiModalProfile {
  userId: string;
  textualProfile: {
    data: any[];
    emotionalPatterns: any;
    linguisticFeatures: any;
    completenessScore: number;
  };
  voiceProfile: {
    data: any[];
    vocalizationPatterns: any;
    emotionalProsody: any;
    completenessScore: number;
  };
  biometricProfile: {
    data: any[];
    physiologicalPatterns: any;
    stressIndicators: any;
    completenessScore: number;
  };
  sleepProfile: {
    data: any[];
    sleepQualityTrends: any;
    circadianMarkers: any;
    completenessScore: number;
  };
  activityProfile: {
    data: any[];
    movementPatterns: any;
    energyLevelIndicators: any;
    completenessScore: number;
  };
  heartRateProfile: {
    data: any[];
    heartRateVariability: any;
    stressMarkers: any;
    completenessScore: number;
  };
  environmentalProfile: {
    data: any[];
    environmentalFactors: any;
    contextualInfluences: any;
    completenessScore: number;
  };
  socialProfile: {
    data: any[];
    interactionPatterns: any;
    supportNetworkIndicators: any;
    completenessScore: number;
  };
  profileCompleteness: number;
  lastUpdated: Date;
}

export interface BiometricIntegration {
  deviceType: string;
  dataStreams: string[];
  integrationStatus: "active" | "inactive" | "error";
  lastSync: Date;
  privacyLevel: "anonymous" | "pseudonymous" | "identified";
}

export interface WearableDeviceData {
  deviceId: string;
  dataType: string;
  timestamp: Date;
  value: number;
  unit: string;
  accuracy: number;
}

export interface HolisticAssessment {
  id: string;
  userId: string;
  multiModalProfile: MultiModalProfile;
  crossModalPatterns: CrossModalPatterns;
  integratedInsights: any;
  therapeuticPlan: IntegratedTherapeuticPlan;
  confidenceMetrics: {
    overallConfidence: number;
    dataQualityScore: number;
    crossModalConsistency: number;
    predictionReliability: number;
  };
  privacyCompliance: {
    biometricDataAnonymized: boolean;
    deviceDataEncrypted: boolean;
    retentionPolicyApplied: boolean;
    consentVerified: boolean;
  };
  metadata: {
    generatedAt: Date;
    dataStreamsUsed: string[];
    analysisVersion: string;
    nextRecommendedAnalysis: Date;
  };
}

export interface CrossModalPatterns {
  userId: string;
  consistencyPatterns: {
    textVoiceAlignment: {
      consistency: number;
      keyDiscrepancies: string[];
      therapeuticSignificance: string;
    };
    emotionalPhysiologicalAlignment: {
      consistency: number;
      patterns: string[];
      insights: string[];
    };
    behavioralBiometricAlignment: {
      consistency: number;
      correlations: string[];
    };
  };
  predictiveIndicators: {
    wellnessTrajectory: {
      direction: string;
      confidence: number;
      keyFactors: string[];
      timeframe: string;
    };
    riskFactors: {
      physiological: string[];
      psychological: string[];
      behavioral: string[];
    };
    protectiveFactors: {
      identified: string[];
      strength: string;
    };
  };
  therapeuticOpportunities: {
    primaryTargets: string[];
    interventionPoints: string[];
    modalityRecommendations: {
      textBased: string[];
      voiceBased: string[];
      biometricGuided: string[];
      behavioralChange: string[];
    };
  };
  holisticInsights: {
    integratedWellnessScore: number;
    keyStrengths: string[];
    growthAreas: string[];
    personalizedFocus: string;
  };
  analysisConfidence: number;
  generatedAt: Date;
}

export interface IntegratedTherapeuticPlan {
  userId: string;
  primaryTherapeuticFocus: string;
  integratedInterventions: {
    textualInterventions: any[];
    voiceBasedInterventions: any[];
    biometricGuidedInterventions: any[];
    behavioralInterventions: any[];
    environmentalModifications: any[];
  };
  personalizedScheduling: {
    optimalInterventionTimes: string[];
    modalityRotation: any;
    intensityAdaptation: any;
  };
  monitoringPlan: {
    keyMetrics: string[];
    alertThresholds: any;
    adaptationTriggers: any;
  };
  expectedOutcomes: {
    shortTermGoals: string[];
    longTermGoals: string[];
    successMetrics: string[];
    timelineExpectations: any;
  };
  planValidity: {
    evidenceBase: number;
    adaptabilityScore: number;
    personalizationLevel: number;
  };
  createdAt: Date;
  nextReviewDate: Date;
}

// Advanced Pattern Recognition Types
export interface HealingTrajectoryAnalysis {
  userId: string;
  overallTrajectory: {
    direction: "improving" | "stable" | "declining" | "cyclical";
    velocity: "rapid" | "moderate" | "slow" | "variable";
    confidence: number;
    keyInflectionPoints: Array<{
      date: string;
      type: "breakthrough" | "setback" | "plateau" | "acceleration";
      significance: "high" | "medium" | "low";
      description: string;
    }>;
  };
  healingPhases: Array<{
    phase: "discovery" | "processing" | "integration" | "stabilization" | "growth";
    startDate: string;
    endDate: string;
    characteristics: string[];
    keyLearnings: string[];
    challenges: string[];
    breakthroughs: string[];
  }>;
  progressMetrics: {
    emotionalStability: {
      baseline: number;
      current: number;
      trend: "improving" | "stable" | "declining";
      changeRate: string;
    };
    copingSkills: {
      baseline: number;
      current: number;
      skillDevelopment: string[];
      skillEffectiveness: number;
    };
    selfAwareness: {
      baseline: number;
      current: number;
      insights: string[];
    };
    resilience: {
      baseline: number;
      current: number;
      resilienceFactors: string[];
    };
  };
  predictiveModeling: {
    shortTermProjection: {
      timeframe: string;
      expectedTrajectory: "improving" | "stable" | "declining";
      confidence: number;
      keyFactors: string[];
    };
    longTermProjection: {
      timeframe: string;
      expectedOutcomes: string[];
      potentialChallenges: string[];
      mitigationStrategies: string[];
    };
  };
  trajectoryInsights: {
    uniquePatterns: string[];
    therapeuticOpportunities: string[];
    riskFactors: string[];
    strengthAreas: string[];
  };
  analysisConfidence: number;
  generatedAt: Date;
}

export interface PersonalTriggerPattern {
  id: string;
  userId: string;
  triggerType: string;
  triggerDescription: string;
  identificationConfidence: number;
  historicalOccurrences: number;
  averageImpactSeverity: number;
  typicalResponsePattern: string;
  earlyWarningSignals: string[];
  effectiveMitigationStrategies: string[];
  temporalPatterns: {
    seasonality: any;
    weeklyPatterns: any;
    dailyPatterns: any;
    timeToImpact: string;
  };
  personalizedFactors: {
    contextualFactors: string[];
    amplifyingFactors: string[];
    protectiveFactors: string[];
  };
  predictiveIndicators: {
    leadTime: string;
    predictionAccuracy: number;
    monitoringMetrics: string[];
  };
  lastUpdated: Date;
}

export interface SuccessFactorAnalysis {
  userId: string;
  primarySuccessFactors: Array<{
    factor: string;
    description: string;
    effectivenessScore: number;
    evidenceStrength: "strong" | "moderate" | "weak";
    contexts: string[];
    mechanisms: string[];
  }>;
  personalizedApproaches: {
    mostEffectiveCopingStrategies: Array<{
      strategy: string;
      successRate: number;
      optimalTiming: string;
      supportingEvidence: string[];
    }>;
    preferredTherapeuticModalities: Array<{
      modality: string;
      engagementLevel: number;
      effectivenessRating: number;
      personalizedOptimizations: string[];
    }>;
    optimalInterventionTiming: {
      timeOfDay: string[];
      emotionalStates: string[];
      contextualFactors: string[];
    };
  };
  strengthBasedInsights: {
    naturalStrengths: string[];
    developedSkills: string[];
    uniqueApproaches: string[];
    resilienceFactors: string[];
  };
  patternLearningInsights: {
    learningStyle: "analytical" | "intuitive" | "experiential" | "social";
    motivationalFactors: string[];
    sustainabilityFactors: string[];
    adaptabilityIndicators: string[];
  };
  optimizationRecommendations: {
    enhanceExistingStrengths: string[];
    addressGaps: string[];
    newOpportunities: string[];
    systemicImprovements: string[];
  };
  analysisConfidence: number;
  lastAnalyzed: Date;
  validationMetrics: {
    historicalValidation: number;
    crossReferencedEvidence: number;
    predictiveAccuracy: number;
  };
}

export interface PersonalizedCopingStrategy {
  id: string;
  userId: string;
  strategyName: string;
  strategyType: string;
  description: string;
  personalizedInstructions: string;
  historicalEffectiveness: number;
  contextualOptimizations: {
    optimalTiming: string;
    idealCircumstances: string[];
    supportiveEnvironments: string[];
  };
  adaptiveElements: {
    intensityLevels: string[];
    durationOptions: string[];
    frequencyRecommendations: string;
  };
  integrationGuidance: {
    dailyPracticeIntegration: string;
    crisisApplicationInstructions: string;
    preventiveUseGuidelines: string;
  };
  effectivenessTracking: {
    successMetrics: string[];
    progressIndicators: string[];
    adaptationTriggers: string[];
  };
  personalizedTriggers: string[];
  complementaryStrategies: string[];
  lastUpdated: Date;
}

export interface HealingMilestone {
  id: string;
  userId: string;
  milestoneType: "emotional" | "behavioral" | "cognitive" | "relational" | "spiritual" | "long_term";
  title: string;
  description: string;
  predictedDate: Date;
  achievementProbability: number;
  keyIndicators: string[];
  preparatorySteps: string[];
  significanceLevel: "major" | "moderate" | "minor";
  celebrationPlan: {
    suggestedCelebrations: string[];
    personalizedMessage: string;
    shareableAchievement: string;
  };
  trackingMetrics: {
    progressMetrics: string[];
    checkpointFrequency: string;
    adaptationCriteria: string[];
  };
  status: "predicted" | "in_progress" | "achieved" | "long_term_predicted";
  createdAt: Date;
}

export interface LongTermPattern {
  patternType: "seasonal" | "cyclical" | "progressive";
  description: string;
  confidence: number;
  temporalScope: string;
  keyInsights: string[];
  therapeuticImplications: string[];
  actionableRecommendations: string[];
}

export interface TherapeuticInsight {
  id: string;
  userId: string;
  healingTrajectory: HealingTrajectoryAnalysis;
  triggerPatterns: PersonalTriggerPattern[];
  successFactors: SuccessFactorAnalysis;
  personalizedCoping: PersonalizedCopingStrategy[];
  healingMilestones: HealingMilestone[];
  temporalPatterns: LongTermPattern[];
  actionableInsights: {
    immediateActions: string[];
    weeklyFocus: string[];
    monthlyGoals: string[];
    adaptiveRecommendations: string[];
    therapeuticPrioritization: string[];
  };
  patternConfidence: {
    overallConfidence: number;
    trajectoryAccuracy: number;
    triggerPatternReliability: number;
    successFactorValidation: number;
    predictionHorizon: string;
  };
  adaptiveLearning: {
    modelVersion: string;
    learningRate: number;
    patternEvolutionTracking: boolean;
    continuousImprovement: boolean;
  };
  privacyCompliance: {
    patternDataAnonymized: boolean;
    longitudinalDataProtected: boolean;
    insightRetention: string;
    userControlEnabled: boolean;
  };
  metadata: {
    generatedAt: Date;
    dataSpanMonths: number;
    patternComplexity: string;
    nextAnalysisRecommended: Date;
  };
}
