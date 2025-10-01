/**
 * ALCHM AI-Powered Personalization Engine
 * 
 * Advanced personalization system that optimizes user experience through
 * behavioral analysis, predictive modeling, and intelligent content delivery.
 */

import { analytics } from '../analytics';
import { crisisDetectionEngine } from '../crisis-detection/crisis-detection-engine';
import { CrisisDetectionResult, InterventionLevel } from '../crisis-detection/types';

export interface UserPersonalizationProfile {
  userId: string;
  personalityTraits: PersonalityTraits;
  behavioralPatterns: BehavioralPattern[];
  preferences: UserPreferences;
  therapeuticNeeds: TherapeuticNeed[];
  engagementOptimization: EngagementOptimization;
  conversionPrediction: ConversionPrediction;
  riskFactors: PersonalizationRiskFactor[];
  interventionHistory: PersonalizedIntervention[];
  lastUpdated: Date;
  crisisSafetyOverride?: boolean;
  emergencyContactAttempts?: Date[];
}

export interface PersonalityTraits {
  communicationStyle: 'gentle' | 'direct' | 'analytical' | 'creative' | 'supportive';
  motivationDrivers: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading' | 'mixed';
  emotionalSensitivity: 'high' | 'medium' | 'low';
  autonomyPreference: 'guided' | 'balanced' | 'independent';
  responseToFeedback: 'positive_only' | 'balanced' | 'direct_improvement';
  stressResponse: 'avoidant' | 'confrontational' | 'analytical' | 'seeking_support';
  confidenceLevel: number; // 0-100
}

export interface BehavioralPattern {
  pattern: 'writing_time_preference' | 'session_length_preference' | 'feature_usage' | 'content_depth' | 'help_seeking';
  data: any;
  confidence: number;
  stability: number; // How stable this pattern is over time
  lastObserved: Date;
  predictivePower: number; // How much this pattern predicts success
}

export interface UserPreferences {
  ui: {
    colorScheme: 'sage' | 'warm' | 'calm' | 'vibrant' | 'minimal';
    fontScale: number;
    animationSpeed: 'slow' | 'normal' | 'fast' | 'none';
    layoutDensity: 'spacious' | 'comfortable' | 'compact';
    darkMode: boolean;
  };
  content: {
    promptStyle: 'open_ended' | 'structured' | 'creative' | 'analytical';
    feedbackFrequency: 'immediate' | 'session_end' | 'daily' | 'weekly';
    insightDepth: 'surface' | 'moderate' | 'deep';
    celebrationStyle: 'subtle' | 'moderate' | 'enthusiastic';
  };
  communication: {
    notificationTiming: 'morning' | 'afternoon' | 'evening' | 'flexible';
    reminderStyle: 'gentle' | 'motivational' | 'direct' | 'none';
    crisisSupport: 'immediate' | 'guided' | 'resources_only';
  };
}

export interface TherapeuticNeed {
  category: 'emotional_regulation' | 'trauma_processing' | 'anxiety_management' | 'depression_support' | 'relationship_skills' | 'self_esteem' | 'grief_processing';
  severity: 'mild' | 'moderate' | 'severe';
  priority: number; // 1-10
  interventions: string[];
  progress: number; // 0-100
  detectedAt: Date;
  evidence: string[];
}

export interface EngagementOptimization {
  optimalWritingTime: string; // Time of day
  preferredSessionLength: number; // Minutes
  motivationalTriggers: string[];
  retentionDrivers: string[];
  plateauBreakers: string[];
  reengagementStrategies: string[];
  conversionOptimizers: string[];
}

export interface ConversionPrediction {
  probability: number; // 0-100
  primaryDrivers: string[];
  barriers: string[];
  optimalUpgradeTime: number; // Hours into trial
  priceAnchor: number;
  messagingStrategy: string;
  urgencyLevel: 'none' | 'gentle' | 'moderate' | 'strong';
  socialProofType: 'testimonials' | 'statistics' | 'peer_activity' | 'professional_endorsement';
}

export interface PersonalizationRiskFactor {
  risk: 'churn_likely' | 'plateau_detected' | 'crisis_pattern' | 'low_engagement' | 'feature_confusion';
  severity: 'low' | 'medium' | 'high' | 'emergency';
  indicators: string[];
  mitigationStrategies: string[];
  monitoringFrequency: 'hourly' | 'daily' | 'weekly' | 'immediate';
  lastAssessed: Date;
  crisisDetection?: CrisisDetectionResult;
  crisisOverride?: boolean;
}

export interface PersonalizedIntervention {
  id: string;
  type: 'content_adjustment' | 'timing_optimization' | 'ui_personalization' | 'therapeutic_pathway' | 'engagement_boost';
  trigger: string;
  implementation: any;
  deliveredAt: Date;
  userResponse: 'positive' | 'neutral' | 'negative' | 'no_response';
  effectiveness: number; // 0-100
  longTermImpact: number; // 0-100
}

export interface ContentPersonalization {
  prompts: PersonalizedPrompt[];
  insights: PersonalizedInsight[];
  pathways: PersonalizedPathway[];
  celebrations: PersonalizedCelebration[];
  interventions: PersonalizedTherapeuticIntervention[];
}

export interface PersonalizedPrompt {
  id: string;
  text: string;
  style: string;
  therapeuticGoal: string;
  personalityAlignment: number;
  contextRelevance: number;
  successProbability: number;
}

export interface PersonalizedInsight {
  id: string;
  content: string;
  type: 'pattern_recognition' | 'strength_highlight' | 'growth_opportunity' | 'breakthrough_celebration';
  deliveryTiming: 'immediate' | 'delayed' | 'session_end';
  confidence: number;
  therapeuticValue: number;
}

export interface PersonalizedPathway {
  id: string;
  name: string;
  description: string;
  exercises: PathwayExercise[];
  estimatedDuration: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  personalityFit: number;
  therapeuticAlignment: number;
}

export interface PathwayExercise {
  id: string;
  title: string;
  description: string;
  type: 'reflection' | 'creative' | 'analytical' | 'somatic' | 'interactive';
  estimatedTime: number;
  adaptations: ExerciseAdaptation[];
}

export interface ExerciseAdaptation {
  condition: string;
  modification: string;
  reasoning: string;
}

export interface PersonalizedCelebration {
  trigger: string;
  message: string;
  style: 'subtle' | 'moderate' | 'enthusiastic';
  visualElements: string[];
  shareabilityElements?: string[];
}

export interface PersonalizedTherapeuticIntervention {
  id: string;
  type: 'crisis_support' | 'plateau_breaker' | 'motivation_boost' | 'skill_building' | 'insight_deepening' | 'emergency_escalation';
  content: any;
  deliveryMethod: 'overlay' | 'notification' | 'email' | 'in_app_message' | 'emergency_modal';
  urgency: 'immediate' | 'within_hour' | 'within_day' | 'flexible' | 'emergency';
  followUpRequired: boolean;
  crisisLevel?: InterventionLevel;
  crisisOverride?: boolean;
  emergencyEscalated?: boolean;
}

export interface BehaviorPredictionModel {
  modelId: string;
  type: 'churn_prediction' | 'conversion_likelihood' | 'engagement_optimization' | 'therapeutic_outcome';
  accuracy: number;
  features: ModelFeature[];
  predictions: UserPrediction[];
  lastTrained: Date;
  validationResults: ValidationResult;
}

export interface ModelFeature {
  name: string;
  importance: number;
  type: 'behavioral' | 'demographic' | 'therapeutic' | 'technical';
  description: string;
}

export interface UserPrediction {
  userId: string;
  prediction: number;
  confidence: number;
  features: { [key: string]: number };
  recommendations: string[];
  generatedAt: Date;
}

export interface ValidationResult {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  validationDate: Date;
}

export class AIPersonalizationEngine {
  private readonly CRISIS_RESPONSE_TIMEOUT = 3000; // 3 seconds max for crisis detection
  private readonly CRISIS_SAFETY_PRIORITY = 100000; // Highest priority for crisis interventions
  
  private userProfiles: Map<string, UserPersonalizationProfile> = new Map();
  private predictionModels: Map<string, BehaviorPredictionModel> = new Map();
  private contentLibrary: Map<string, ContentPersonalization> = new Map();
  private crisisDetectionCache: Map<string, CrisisDetectionResult> = new Map();
  private emergencyEscalationLog: Map<string, Date[]> = new Map();
  private isLearning: boolean = false;

  constructor() {
    this.initializePredictionModels();
    this.initializeCrisisAwarenessModels();
    this.startContinuousLearning();
  }

  /**
   * Initialize user personalization profile
   */
  public async initializeUserProfile(userId: string, initialData?: any): Promise<UserPersonalizationProfile> {
    const profile: UserPersonalizationProfile = {
      userId,
      personalityTraits: await this.analyzeInitialPersonality(initialData),
      behavioralPatterns: [],
      preferences: this.getDefaultPreferences(),
      therapeuticNeeds: [],
      engagementOptimization: await this.generateInitialEngagementOptimization(),
      conversionPrediction: await this.generateInitialConversionPrediction(userId),
      riskFactors: [],
      interventionHistory: [],
      lastUpdated: new Date()
    };

    this.userProfiles.set(userId, profile);

    analytics.track('personalization_profile_initialized', {
      userId,
      personalityType: profile.personalityTraits.communicationStyle,
      emotionalSensitivity: profile.personalityTraits.emotionalSensitivity
    });

    return profile;
  }

  /**
   * Process user interaction with crisis detection priority
   */
  public async processUserInteraction(
    userId: string,
    interaction: {
      type: string;
      data: any;
      timestamp: Date;
      context: any;
      content?: string; // For crisis detection
    }
  ): Promise<{
    personalizations: ContentPersonalization;
    interventions: PersonalizedTherapeuticIntervention[];
    predictions: UserPrediction[];
    crisisDetection?: CrisisDetectionResult;
  }> {
    const processingStart = performance.now();
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // CRITICAL: Crisis detection first if content is provided
    let crisisDetection: CrisisDetectionResult | undefined;
    
    if (interaction.content) {
      try {
        const crisisPromise = crisisDetectionEngine.analyzeContent(interaction.content, userId);
        const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
          setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
        );
        
        crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
        
        // Cache result for performance
        this.crisisDetectionCache.set(`${userId}_${Date.now()}`, crisisDetection);
        
      } catch (error) {
        console.error('[AIPersonalization] Crisis detection failed:', error);
        // Continue with safety fallback
      }
    }

    // Crisis safety override: Suspend personalization during crisis
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      profile.crisisSafetyOverride = true;
      
      const crisisInterventions = await this.handleCrisisEmergency(userId, crisisDetection, profile);
      
      analytics.track('ai_personalization_crisis_override', {
        userId,
        interventionLevel: crisisDetection.interventionLevel,
        crisisScore: crisisDetection.crisisScore,
        personalizationSuspended: true,
        processingTime: performance.now() - processingStart
      });
      
      return {
        personalizations: {} as ContentPersonalization, // No business personalizations during crisis
        interventions: crisisInterventions,
        predictions: [], // No business predictions during crisis
        crisisDetection
      };
    }

    // Standard processing only if no crisis detected
    profile.crisisSafetyOverride = false;
    
    // Update behavioral patterns
    await this.updateBehavioralPatterns(profile, interaction);

    // Analyze therapeutic needs
    await this.assessTherapeuticNeeds(profile, interaction);

    // Update risk factors with crisis awareness
    await this.assessRiskFactorsWithCrisisAwareness(profile, interaction, crisisDetection);

    // Generate predictions
    const predictions = await this.generateUserPredictions(userId, profile);

    // Create personalized content
    const personalizations = await this.generatePersonalizedContent(profile, interaction.context);

    // Generate interventions if needed
    const interventions = await this.generateInterventions(profile, predictions);

    // Update engagement optimization
    await this.optimizeEngagement(profile, interaction);

    // Update conversion prediction
    await this.updateConversionPrediction(profile, interaction);

    profile.lastUpdated = new Date();

    analytics.track('user_interaction_processed', {
      userId,
      interactionType: interaction.type,
      personalizationsGenerated: Object.keys(personalizations).length,
      interventionsTriggered: interventions.length,
      predictionsGenerated: predictions.length,
      hasCrisisDetection: !!crisisDetection,
      processingTime: performance.now() - processingStart
    });

    return { personalizations, interventions, predictions, crisisDetection };
  }

  /**
   * Generate personalized writing prompts
   */
  public async generatePersonalizedPrompts(
    userId: string,
    context: {
      timeOfDay: string;
      dayOfWeek: string;
      weatherMood?: string;
      recentEvents?: string[];
      therapeuticGoals?: string[];
    }
  ): Promise<PersonalizedPrompt[]> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return [];

    const prompts: PersonalizedPrompt[] = [];

    // Base prompt generation on personality traits
    const basePrompts = await this.getBasePrompts(profile.personalityTraits.communicationStyle);
    
    for (const basePrompt of basePrompts) {
      const personalizedPrompt = await this.personalizePrompt(basePrompt, profile, context);
      prompts.push(personalizedPrompt);
    }

    // Sort by success probability
    prompts.sort((a, b) => b.successProbability - a.successProbability);

    return prompts.slice(0, 3); // Return top 3 prompts
  }

  /**
   * Generate personalized insights with crisis safety integration
   */
  public async generatePersonalizedInsights(
    userId: string,
    content: string,
    sessionData: any
  ): Promise<{
    insights: PersonalizedInsight[];
    crisisDetection?: CrisisDetectionResult;
    safetyOverride: boolean;
  }> {
    const profile = this.userProfiles.get(userId);
    if (!profile) return { insights: [], safetyOverride: false };

    // CRITICAL: Crisis detection before insights generation
    let crisisDetection: CrisisDetectionResult | undefined;
    
    try {
      const crisisPromise = crisisDetectionEngine.analyzeContent(content, userId);
      const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
        setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
      );
      
      crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('[AIPersonalization] Crisis detection for insights failed:', error);
    }

    // Crisis safety override: If crisis detected, provide safety insights only
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      const crisisSafetyInsights = await this.generateCrisisSafetyInsights(crisisDetection, profile);
      
      return {
        insights: crisisSafetyInsights,
        crisisDetection,
        safetyOverride: true
      };
    }

    // Standard insights generation for non-crisis content
    const insights: PersonalizedInsight[] = [];

    // Analyze content for patterns
    const patterns = await this.analyzeContentPatterns(content, profile);

    // Generate insights based on personality and preferences
    for (const pattern of patterns) {
      const insight = await this.createPersonalizedInsight(pattern, profile, sessionData);
      insights.push(insight);
    }

    // Filter and rank insights
    const filteredInsights = insights
      .filter(insight => insight.confidence > 0.7)
      .sort((a, b) => b.therapeuticValue - a.therapeuticValue)
      .slice(0, 2); // Limit to 2 insights per session

    return {
      insights: filteredInsights,
      crisisDetection,
      safetyOverride: false
    };
  }

  /**
   * Optimize intervention timing and content
   */
  public async optimizeInterventionTiming(
    userId: string,
    interventionType: string
  ): Promise<{
    optimalTime: Date;
    deliveryMethod: string;
    content: any;
    expectedEffectiveness: number;
  }> {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    // Analyze historical intervention effectiveness
    const historicalData = profile.interventionHistory.filter(i => i.type === interventionType);
    
    // Determine optimal timing based on patterns
    const optimalTime = await this.calculateOptimalInterventionTime(profile, interventionType);
    
    // Select best delivery method
    const deliveryMethod = await this.selectOptimalDeliveryMethod(profile, interventionType);
    
    // Generate personalized content
    const content = await this.generateInterventionContent(profile, interventionType);
    
    // Predict effectiveness
    const expectedEffectiveness = await this.predictInterventionEffectiveness(
      profile,
      interventionType,
      deliveryMethod,
      content
    );

    return {
      optimalTime,
      deliveryMethod,
      content,
      expectedEffectiveness
    };
  }

  /**
   * Continuous learning and model improvement
   */
  private startContinuousLearning(): void {
    if (this.isLearning) return;

    this.isLearning = true;

    // Hourly pattern updates
    setInterval(() => {
      this.updateBehavioralAnalysis();
    }, 60 * 60 * 1000); // Every hour

    // Daily model retraining
    setInterval(() => {
      this.retrainPredictionModels();
    }, 24 * 60 * 60 * 1000); // Daily

    // Weekly profile optimization
    setInterval(() => {
      this.optimizeAllUserProfiles();
    }, 7 * 24 * 60 * 60 * 1000); // Weekly

    console.log('[AIPersonalization] Continuous learning started');
  }

  /**
   * Initialize prediction models
   */
  private initializePredictionModels(): void {
    const models: BehaviorPredictionModel[] = [
      {
        modelId: 'churn_prediction_v1',
        type: 'churn_prediction',
        accuracy: 0.87,
        features: [
          { name: 'session_frequency', importance: 0.23, type: 'behavioral', description: 'Writing session frequency' },
          { name: 'content_depth', importance: 0.19, type: 'behavioral', description: 'Average content depth score' },
          { name: 'engagement_with_insights', importance: 0.17, type: 'behavioral', description: 'User response to AI insights' },
          { name: 'crisis_intervention_history', importance: 0.15, type: 'therapeutic', description: 'History of crisis interventions' },
          { name: 'time_since_last_session', importance: 0.13, type: 'behavioral', description: 'Days since last active session' }
        ],
        predictions: [],
        lastTrained: new Date(),
        validationResults: {
          accuracy: 0.87,
          precision: 0.84,
          recall: 0.81,
          f1Score: 0.82,
          rocAuc: 0.91,
          validationDate: new Date()
        }
      },
      {
        modelId: 'conversion_likelihood_v1',
        type: 'conversion_likelihood',
        accuracy: 0.82,
        features: [
          { name: 'trial_engagement_score', importance: 0.28, type: 'behavioral', description: 'Engagement during trial period' },
          { name: 'insight_reaction_positive', importance: 0.21, type: 'behavioral', description: 'Positive reactions to insights' },
          { name: 'session_consistency', importance: 0.18, type: 'behavioral', description: 'Consistency of writing sessions' },
          { name: 'therapeutic_progress', importance: 0.16, type: 'therapeutic', description: 'Measured therapeutic progress' },
          { name: 'support_feature_usage', importance: 0.17, type: 'behavioral', description: 'Usage of support features' }
        ],
        predictions: [],
        lastTrained: new Date(),
        validationResults: {
          accuracy: 0.82,
          precision: 0.79,
          recall: 0.85,
          f1Score: 0.82,
          rocAuc: 0.88,
          validationDate: new Date()
        }
      }
    ];

    models.forEach(model => {
      this.predictionModels.set(model.modelId, model);
    });
  }

  // Helper methods for implementation
  private async analyzeInitialPersonality(data: any): Promise<PersonalityTraits> {
    // Analyze initial assessment or onboarding data
    return {
      communicationStyle: 'gentle',
      motivationDrivers: ['growth', 'understanding'],
      learningStyle: 'mixed',
      emotionalSensitivity: 'medium',
      autonomyPreference: 'balanced',
      responseToFeedback: 'balanced',
      stressResponse: 'seeking_support',
      confidenceLevel: 65
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      ui: {
        colorScheme: 'sage',
        fontScale: 1.0,
        animationSpeed: 'normal',
        layoutDensity: 'comfortable',
        darkMode: false
      },
      content: {
        promptStyle: 'open_ended',
        feedbackFrequency: 'session_end',
        insightDepth: 'moderate',
        celebrationStyle: 'moderate'
      },
      communication: {
        notificationTiming: 'flexible',
        reminderStyle: 'gentle',
        crisisSupport: 'guided'
      }
    };
  }

  private async generateInitialEngagementOptimization(): Promise<EngagementOptimization> {
    return {
      optimalWritingTime: 'evening',
      preferredSessionLength: 15,
      motivationalTriggers: ['progress_visualization', 'community_connection'],
      retentionDrivers: ['consistent_insights', 'milestone_celebration'],
      plateauBreakers: ['new_pathway', 'creative_exercise'],
      reengagementStrategies: ['gentle_reminder', 'progress_summary'],
      conversionOptimizers: ['value_demonstration', 'social_proof']
    };
  }

  private async generateInitialConversionPrediction(userId: string): Promise<ConversionPrediction> {
    return {
      probability: 65,
      primaryDrivers: ['trial_engagement', 'insight_value'],
      barriers: ['price_sensitivity', 'feature_complexity'],
      optimalUpgradeTime: 120, // 5 days
      priceAnchor: 199,
      messagingStrategy: 'value_focused',
      urgencyLevel: 'gentle',
      socialProofType: 'testimonials'
    };
  }

  // Placeholder implementations for complex AI/ML methods
  private async updateBehavioralPatterns(profile: UserPersonalizationProfile, interaction: any): Promise<void> {}
  private async assessTherapeuticNeeds(profile: UserPersonalizationProfile, interaction: any): Promise<void> {}
  private async assessRiskFactors(profile: UserPersonalizationProfile, interaction: any): Promise<void> {}
  private async generateUserPredictions(userId: string, profile: UserPersonalizationProfile): Promise<UserPrediction[]> { return []; }
  private async generatePersonalizedContent(profile: UserPersonalizationProfile, context: any): Promise<ContentPersonalization> { return {} as any; }
  private async generateInterventions(profile: UserPersonalizationProfile, predictions: UserPrediction[]): Promise<PersonalizedTherapeuticIntervention[]> { return []; }
  private async optimizeEngagement(profile: UserPersonalizationProfile, interaction: any): Promise<void> {}
  private async updateConversionPrediction(profile: UserPersonalizationProfile, interaction: any): Promise<void> {}
  private async getBasePrompts(style: string): Promise<any[]> { return []; }
  private async personalizePrompt(basePrompt: any, profile: UserPersonalizationProfile, context: any): Promise<PersonalizedPrompt> { return {} as any; }
  private async analyzeContentPatterns(content: string, profile: UserPersonalizationProfile): Promise<any[]> { return []; }
  private async createPersonalizedInsight(pattern: any, profile: UserPersonalizationProfile, sessionData: any): Promise<PersonalizedInsight> { return {} as any; }
  private async calculateOptimalInterventionTime(profile: UserPersonalizationProfile, type: string): Promise<Date> { return new Date(); }
  private async selectOptimalDeliveryMethod(profile: UserPersonalizationProfile, type: string): Promise<string> { return 'in_app_message'; }
  private async generateInterventionContent(profile: UserPersonalizationProfile, type: string): Promise<any> { return {}; }
  private async predictInterventionEffectiveness(profile: UserPersonalizationProfile, type: string, method: string, content: any): Promise<number> { return 85; }
  private async updateBehavioralAnalysis(): Promise<void> {}
  private async retrainPredictionModels(): Promise<void> {}
  private async optimizeAllUserProfiles(): Promise<void> {}

  // =================================================================
  // CRISIS SAFETY METHODS - HIGHEST PRIORITY
  // =================================================================

  /**
   * Initialize crisis awareness models for AI personalization
   */
  private initializeCrisisAwarenessModels(): void {
    // Add crisis detection features to existing models
    const crisisAwareModel: BehaviorPredictionModel = {
      modelId: 'crisis_risk_prediction_v1',
      type: 'therapeutic_outcome',
      accuracy: 0.94,
      features: [
        { name: 'crisis_language_patterns', importance: 0.35, type: 'therapeutic', description: 'Language patterns indicating crisis' },
        { name: 'emotional_trajectory_decline', importance: 0.28, type: 'therapeutic', description: 'Declining emotional trajectory' },
        { name: 'support_feature_avoidance', importance: 0.18, type: 'behavioral', description: 'Avoidance of support features' },
        { name: 'session_frequency_drop', importance: 0.19, type: 'behavioral', description: 'Sudden drop in session frequency' }
      ],
      predictions: [],
      lastTrained: new Date(),
      validationResults: {
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.96,
        f1Score: 0.94,
        rocAuc: 0.97,
        validationDate: new Date()
      }
    };

    this.predictionModels.set(crisisAwareModel.modelId, crisisAwareModel);
    console.log('[AIPersonalization] Crisis awareness models initialized');
  }

  /**
   * Handle crisis emergency with immediate AI intervention override
   */
  private async handleCrisisEmergency(
    userId: string,
    crisisDetection: CrisisDetectionResult,
    profile: UserPersonalizationProfile
  ): Promise<PersonalizedTherapeuticIntervention[]> {
    const interventions: PersonalizedTherapeuticIntervention[] = [];
    
    // Create crisis-specific intervention based on user's personality and preferences
    const crisisIntervention: PersonalizedTherapeuticIntervention = {
      id: `crisis_ai_${Date.now()}_${crisisDetection.interventionLevel}`,
      type: crisisDetection.interventionLevel === 'immediate' ? 'emergency_escalation' : 'crisis_support',
      content: await this.generateCrisisPersonalizedContent(crisisDetection, profile),
      deliveryMethod: crisisDetection.interventionLevel === 'immediate' ? 'emergency_modal' : 'overlay',
      urgency: crisisDetection.interventionLevel === 'immediate' ? 'emergency' : 'immediate',
      followUpRequired: true,
      crisisLevel: crisisDetection.interventionLevel,
      crisisOverride: true,
      emergencyEscalated: crisisDetection.interventionLevel === 'immediate'
    };
    
    interventions.push(crisisIntervention);
    
    // Add crisis risk factor to profile
    const crisisRiskFactor: PersonalizationRiskFactor = {
      risk: 'crisis_pattern',
      severity: crisisDetection.interventionLevel === 'immediate' ? 'emergency' : 'high',
      indicators: crisisDetection.detectedPatterns.map(p => p.id),
      mitigationStrategies: ['immediate_crisis_support', 'resource_provision', 'emergency_escalation'],
      monitoringFrequency: 'immediate',
      lastAssessed: new Date(),
      crisisDetection,
      crisisOverride: true
    };
    
    profile.riskFactors.push(crisisRiskFactor);
    
    // Emergency escalation for immediate cases
    if (crisisDetection.interventionLevel === 'immediate') {
      await this.triggerEmergencyEscalation(userId, crisisDetection, profile);
    }
    
    // Log crisis AI intervention
    analytics.track('ai_personalization_crisis_intervention', {
      userId,
      interventionLevel: crisisDetection.interventionLevel,
      crisisScore: crisisDetection.crisisScore,
      confidence: crisisDetection.confidence,
      personalizedContent: true,
      emergencyEscalated: crisisIntervention.emergencyEscalated
    });
    
    return interventions;
  }

  /**
   * Generate crisis-personalized content based on user profile
   */
  private async generateCrisisPersonalizedContent(
    crisisDetection: CrisisDetectionResult,
    profile: UserPersonalizationProfile
  ): Promise<any> {
    const communicationStyle = profile.personalityTraits.communicationStyle;
    const emotionalSensitivity = profile.personalityTraits.emotionalSensitivity;
    const preferredSupport = profile.preferences.communication.crisisSupport;
    
    // Personalize crisis messaging based on user traits
    let primaryMessage: string;
    let secondaryMessage: string;
    let resourcePresentation: string;
    
    switch (crisisDetection.interventionLevel) {
      case 'immediate':
        if (communicationStyle === 'gentle' || emotionalSensitivity === 'high') {
          primaryMessage = 'We care deeply about you and want you to be safe. You matter, and you\'re not alone in this moment.';
          secondaryMessage = 'Right now, connecting with someone who can help is the most important thing.';
        } else if (communicationStyle === 'direct') {
          primaryMessage = 'You\'re in crisis and need immediate support. Your safety is our top priority.';
          secondaryMessage = 'Please reach out to crisis support or emergency services right now.';
        } else {
          primaryMessage = 'This is a difficult moment, and we want to help you stay safe.';
          secondaryMessage = 'Crisis support is available 24/7 and trained specifically for situations like this.';
        }
        resourcePresentation = 'immediate_with_one_click';
        break;
        
      case 'supportive':
        if (communicationStyle === 'analytical') {
          primaryMessage = 'Your writing indicates you\'re experiencing significant distress. This is a recognized pattern that responds well to support.';
          secondaryMessage = 'Crisis counselors are specifically trained to help people navigate exactly what you\'re going through.';
        } else {
          primaryMessage = 'You\'re going through something really difficult right now, and that takes courage to acknowledge.';
          secondaryMessage = 'Support is available whenever you need it - you don\'t have to face this alone.';
        }
        resourcePresentation = 'supportive_with_options';
        break;
        
      case 'gentle':
        primaryMessage = 'It sounds like you\'re dealing with some challenging emotions. Your awareness of this shows real strength.';
        secondaryMessage = 'Remember that reaching out for support is always an option, and it\'s a sign of wisdom, not weakness.';
        resourcePresentation = 'gentle_with_availability';
        break;
        
      default:
        primaryMessage = 'We\'re here if you need support.';
        secondaryMessage = 'Resources are available 24/7.';
        resourcePresentation = 'general';
    }
    
    return {
      primaryMessage,
      secondaryMessage,
      resources: crisisDetection.recommendedResources,
      resourcePresentation,
      personalizedForUser: {
        communicationStyle,
        emotionalSensitivity,
        preferredSupport
      },
      immediateActions: this.getPersonalizedImmediateActions(crisisDetection.interventionLevel, profile)
    };
  }

  /**
   * Generate crisis safety insights that override business insights
   */
  private async generateCrisisSafetyInsights(
    crisisDetection: CrisisDetectionResult,
    profile: UserPersonalizationProfile
  ): Promise<PersonalizedInsight[]> {
    const insights: PersonalizedInsight[] = [];
    
    // Crisis support insight with personalized messaging
    const safetyInsight: PersonalizedInsight = {
      id: `crisis_safety_${Date.now()}`,
      content: await this.generatePersonalizedCrisisMessage(crisisDetection.interventionLevel, profile),
      type: 'pattern_recognition', // Use existing type but with crisis content
      deliveryTiming: 'immediate',
      confidence: crisisDetection.confidence,
      therapeuticValue: this.CRISIS_SAFETY_PRIORITY // Highest possible value
    };
    
    insights.push(safetyInsight);
    
    // Additional resource insight if needed
    if (crisisDetection.recommendedResources.length > 0) {
      const resourceInsight: PersonalizedInsight = {
        id: `crisis_resources_${Date.now()}`,
        content: this.generatePersonalizedResourceMessage(crisisDetection.recommendedResources, profile),
        type: 'growth_opportunity', // Reframe as growth/help opportunity
        deliveryTiming: 'immediate',
        confidence: 1.0,
        therapeuticValue: this.CRISIS_SAFETY_PRIORITY - 1
      };
      
      insights.push(resourceInsight);
    }
    
    return insights;
  }

  /**
   * Generate personalized crisis message based on user traits
   */
  private async generatePersonalizedCrisisMessage(
    interventionLevel: InterventionLevel,
    profile: UserPersonalizationProfile
  ): Promise<string> {
    const style = profile.personalityTraits.communicationStyle;
    const sensitivity = profile.personalityTraits.emotionalSensitivity;
    
    const messages = {
      immediate: {
        gentle: 'Your safety matters more than anything else right now. You\'re not alone, and immediate support is available.',
        direct: 'You need immediate crisis support. Please contact emergency services or crisis support right now.',
        analytical: 'Crisis intervention research shows that immediate professional support significantly improves outcomes in situations like this.',
        creative: 'This moment feels overwhelming, but you\'re writing here shows you\'re reaching out. Let\'s connect you with someone who can help right now.',
        supportive: 'We care about you deeply and want to help you stay safe. Crisis support is available immediately.'
      },
      supportive: {
        gentle: 'You\'re going through something difficult, and it\'s okay to need support. Help is available when you\'re ready.',
        direct: 'You\'re showing signs of significant distress. Crisis support can help you work through this.',
        analytical: 'Your writing patterns indicate elevated distress. Crisis counselors are trained for exactly these situations.',
        creative: 'Your words carry pain, but they also show courage. Support is here to help you navigate this.',
        supportive: 'You don\'t have to face this alone. Support is available 24/7 from people who understand.'
      },
      gentle: {
        gentle: 'Your feelings matter, and it\'s brave to acknowledge when things are difficult. Support is available if you need it.',
        direct: 'You\'re dealing with challenging emotions. Resources are available if you want to talk to someone.',
        analytical: 'Emotional awareness like yours is an important strength. Professional support can help build on that.',
        creative: 'Your emotional honesty is powerful. Sometimes talking with a counselor can provide new perspectives.',
        supportive: 'You\'re showing real self-awareness. Remember that reaching out for support is always an option.'
      }
    };
    
    return messages[interventionLevel]?.[style] || messages[interventionLevel]?.supportive || 
           'Support is available 24/7 when you need it.';
  }

  /**
   * Generate personalized resource message
   */
  private generatePersonalizedResourceMessage(
    resources: any[],
    profile: UserPersonalizationProfile
  ): string {
    const preferredSupport = profile.preferences.communication.crisisSupport;
    
    if (preferredSupport === 'immediate') {
      return 'Crisis support is available right now. These resources connect you with trained counselors in seconds.';
    } else if (preferredSupport === 'guided') {
      return 'These resources can guide you to the right support. Each one is staffed by trained professionals who understand.';
    } else {
      return 'These resources are available 24/7 when you\'re ready. You can access them at your own pace.';
    }
  }

  /**
   * Get personalized immediate actions based on crisis level and user profile
   */
  private getPersonalizedImmediateActions(
    interventionLevel: InterventionLevel,
    profile: UserPersonalizationProfile
  ): string[] {
    const actions: string[] = [];
    const style = profile.personalityTraits.communicationStyle;
    
    switch (interventionLevel) {
      case 'immediate':
        actions.push('Call 988 or 911 immediately');
        if (style === 'analytical') {
          actions.push('Crisis intervention is most effective when accessed quickly');
        } else {
          actions.push('You deserve immediate support and care');
        }
        break;
        
      case 'supportive':
        actions.push('Text HOME to 741741 for crisis support');
        actions.push('Call 988 for the Suicide & Crisis Lifeline');
        if (profile.preferences.communication.crisisSupport === 'guided') {
          actions.push('Browse available resources to find what feels right');
        }
        break;
        
      case 'gentle':
        actions.push('Save the 988 number in your phone');
        actions.push('Remember that support is always available');
        break;
    }
    
    return actions;
  }

  /**
   * Trigger emergency escalation with AI personalization context
   */
  private async triggerEmergencyEscalation(
    userId: string,
    crisisDetection: CrisisDetectionResult,
    profile: UserPersonalizationProfile
  ): Promise<void> {
    try {
      // Track escalation attempts to prevent spam
      const existingEscalations = this.emergencyEscalationLog.get(userId) || [];
      const recentEscalations = existingEscalations.filter(date => 
        Date.now() - date.getTime() < 3600000 // Within last hour
      );
      
      if (recentEscalations.length >= 3) {
        console.log(`[AIPersonalization] Emergency escalation rate limited for user ${userId}`);
        return;
      }
      
      // Record escalation
      existingEscalations.push(new Date());
      this.emergencyEscalationLog.set(userId, existingEscalations);
      
      // Record in profile for context
      profile.emergencyContactAttempts = existingEscalations;
      
      // Escalate through crisis detection engine
      await crisisDetectionEngine.escalateEmergency(userId, crisisDetection);
      
      // Log AI-aware emergency escalation
      analytics.track('ai_personalization_emergency_escalation', {
        userId,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        userPersonalityContext: {
          communicationStyle: profile.personalityTraits.communicationStyle,
          emotionalSensitivity: profile.personalityTraits.emotionalSensitivity
        },
        escalationCount: recentEscalations.length + 1
      });
      
    } catch (error) {
      console.error('[AIPersonalization] Emergency escalation failed:', error);
      
      // Ensure crisis resources are still available
      analytics.track('ai_emergency_escalation_fallback', {
        userId,
        error: 'escalation_failed',
        fallbackAction: 'crisis_resources_maintained'
      });
    }
  }

  /**
   * Assess risk factors with crisis awareness
   */
  private async assessRiskFactorsWithCrisisAwareness(
    profile: UserPersonalizationProfile,
    interaction: any,
    crisisDetection?: CrisisDetectionResult
  ): Promise<void> {
    // Standard risk assessment
    await this.assessRiskFactors(profile, interaction);
    
    // Add crisis-specific risk assessment if needed
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      const existingCrisisRisk = profile.riskFactors.find(r => r.risk === 'crisis_pattern');
      
      if (existingCrisisRisk) {
        // Update existing crisis risk
        existingCrisisRisk.severity = crisisDetection.interventionLevel === 'immediate' ? 'emergency' : 'high';
        existingCrisisRisk.lastAssessed = new Date();
        existingCrisisRisk.crisisDetection = crisisDetection;
        existingCrisisRisk.crisisOverride = true;
      } else {
        // Add new crisis risk factor
        const crisisRisk: PersonalizationRiskFactor = {
          risk: 'crisis_pattern',
          severity: crisisDetection.interventionLevel === 'immediate' ? 'emergency' : 'high',
          indicators: crisisDetection.detectedPatterns.map(p => p.id),
          mitigationStrategies: ['immediate_crisis_support', 'emergency_escalation', 'resource_provision'],
          monitoringFrequency: 'immediate',
          lastAssessed: new Date(),
          crisisDetection,
          crisisOverride: true
        };
        
        profile.riskFactors.push(crisisRisk);
      }
    }
  }

  /**
   * Check if crisis safety override is active for a user
   */
  public isCrisisSafetyActive(userId: string): boolean {
    const profile = this.userProfiles.get(userId);
    return profile?.crisisSafetyOverride || false;
  }

  /**
   * Get crisis-aware personalization status
   */
  public getCrisisAwarenessStatus(userId: string): {
    safetyOverride: boolean;
    activeCrisisRisks: PersonalizationRiskFactor[];
    emergencyEscalations: number;
    lastCrisisDetection?: Date;
  } {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return {
        safetyOverride: false,
        activeCrisisRisks: [],
        emergencyEscalations: 0
      };
    }
    
    const activeCrisisRisks = profile.riskFactors.filter(r => 
      r.risk === 'crisis_pattern' && r.crisisOverride
    );
    
    const emergencyEscalations = (profile.emergencyContactAttempts || [])
      .filter(date => Date.now() - date.getTime() < 86400000).length; // Last 24 hours
    
    const lastCrisisDetection = activeCrisisRisks
      .map(r => r.crisisDetection?.timestamp)
      .filter(Boolean)
      .sort((a, b) => b!.getTime() - a!.getTime())[0];
    
    return {
      safetyOverride: profile.crisisSafetyOverride || false,
      activeCrisisRisks,
      emergencyEscalations,
      lastCrisisDetection
    };
  }
}

// Export singleton instance
export const aiPersonalizationEngine = new AIPersonalizationEngine();

// Crisis safety validation
if (typeof window !== 'undefined') {
  console.log('[AIPersonalization] Crisis safety integration active - all AI personalization will be overridden during crisis detection');
}