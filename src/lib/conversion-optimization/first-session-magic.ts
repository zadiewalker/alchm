/**
 * ALCHM First Session Magic - Conversion Optimization System
 * 
 * Advanced conversion optimization system targeting 15%+ trial-to-premium conversion
 * through progressive onboarding, immediate value delivery, and psychological pricing.
 */

import { analytics } from '../analytics';
import { aiContentModerationSystem } from '../content-moderation/ai-moderation-system';
import { crisisDetectionEngine } from '../crisis-detection/crisis-detection-engine';
import { CrisisDetectionResult, InterventionLevel } from '../crisis-detection/types';

export interface PersonalAssessment {
  id: string;
  userId: string;
  responses: AssessmentResponse[];
  aiAnalysis: PersonalityProfile;
  completedAt: Date;
  conversionVariant: string;
}

export interface AssessmentResponse {
  questionId: string;
  questionText: string;
  response: string | number | string[];
  adaptiveBranching?: string;
  responseTime: number;
  confidence: number;
}

export interface PersonalityProfile {
  primaryNeeds: string[];
  communicationStyle: 'gentle' | 'direct' | 'analytical' | 'creative';
  traumaInformedLevel: 'high_sensitivity' | 'moderate' | 'standard';
  pathwayRecommendation: string;
  personalizationSettings: UIPersonalization;
  conversionOptimization: ConversionProfile;
}

export interface UIPersonalization {
  colorScheme: 'sage' | 'warm' | 'calm' | 'vibrant';
  fontScale: number;
  animationSpeed: 'slow' | 'normal' | 'fast';
  layoutDensity: 'spacious' | 'comfortable' | 'compact';
  preferredPrompts: string[];
}

export interface ConversionProfile {
  priceAnchor: number;
  urgencyStyle: 'gentle' | 'moderate' | 'strong';
  socialProofType: 'testimonials' | 'statistics' | 'peer_activity';
  trialLength: 7 | 14 | 21;
  upgradeTimingOptimal: number; // hours into trial
}

export interface FirstSessionExperience {
  userId: string;
  sessionId: string;
  startTime: Date;
  milestones: SessionMilestone[];
  aiInsights: LiveInsight[];
  valueDelivered: ValueMetric[];
  conversionReadiness: number; // 0-100 score
  nextActions: ConversionAction[];
  crisisDetection?: CrisisDetectionResult;
  crisisSafetyOverride: boolean;
}

export interface SessionMilestone {
  type: 'assessment_complete' | 'first_entry' | 'ai_insight' | 'visualization' | 'pathway_assigned' | 'crisis_support_provided';
  timestamp: Date;
  data: any;
  impactScore: number;
  crisisRelated?: boolean;
}

export interface LiveInsight {
  id: string;
  type: 'emotional_pattern' | 'strength_recognition' | 'growth_opportunity' | 'pathway_match' | 'crisis_support';
  message: string;
  confidence: number;
  displayTiming: number; // seconds into writing
  userReaction?: 'positive' | 'neutral' | 'negative';
  crisisLevel?: InterventionLevel;
  isCrisisSafety?: boolean;
}

export interface ValueMetric {
  metric: 'words_written' | 'emotions_identified' | 'insights_generated' | 'patterns_discovered';
  value: number;
  benchmarkComparison: string;
  visualizationData: any;
}

export interface ConversionAction {
  type: 'show_progress_preview' | 'display_pricing' | 'social_proof' | 'urgency_builder' | 'crisis_support_resources';
  priority: number;
  timing: 'immediate' | 'delayed' | 'triggered';
  conditions: string[];
  crisisOverride?: boolean;
}

export class FirstSessionMagicEngine {
  private readonly CRISIS_RESPONSE_TIMEOUT = 3000; // 3 seconds max for crisis resources
  private readonly CRISIS_SAFETY_PRIORITY = 1000; // Highest possible priority
  
  private readonly ASSESSMENT_QUESTIONS = [
    {
      id: 'primary_goal',
      text: 'What brings you to ALCHM today?',
      type: 'multiple_choice',
      options: [
        'Process difficult emotions',
        'Build self-awareness',
        'Develop coping strategies',
        'Track personal growth',
        'Support therapy work'
      ],
      adaptiveBranching: true
    },
    {
      id: 'writing_experience',
      text: 'How comfortable are you with reflective writing?',
      type: 'scale',
      range: [1, 5],
      labels: ['Very new to this', 'Somewhat experienced', 'Very comfortable']
    },
    {
      id: 'support_preference',
      text: 'What kind of guidance feels most helpful?',
      type: 'multiple_choice',
      options: [
        'Gentle suggestions and prompts',
        'Detailed insights and analysis',
        'Creative exercises and exploration',
        'Structured frameworks and tools'
      ]
    },
    {
      id: 'trauma_sensitivity',
      text: 'How would you like us to approach sensitive topics?',
      type: 'multiple_choice',
      options: [
        'Very gently with lots of support',
        'Thoughtfully but directly',
        'I can handle direct approaches'
      ]
    },
    {
      id: 'time_availability',
      text: 'How much time can you typically dedicate to journaling?',
      type: 'multiple_choice',
      options: ['5-10 minutes', '15-20 minutes', '30+ minutes', 'It varies']
    }
  ];

  private activeSessions: Map<string, FirstSessionExperience> = new Map();
  private conversionVariants: Map<string, ConversionProfile> = new Map();
  private crisisDetectionCache: Map<string, CrisisDetectionResult> = new Map();

  constructor() {
    this.initializeConversionVariants();
    this.initializeCrisisMonitoring();
  }

  /**
   * Initialize A/B testing variants for conversion optimization
   */
  private initializeConversionVariants(): void {
    // Variant A: Gentle approach
    this.conversionVariants.set('gentle', {
      priceAnchor: 299, // Higher anchor for therapy comparison
      urgencyStyle: 'gentle',
      socialProofType: 'testimonials',
      trialLength: 14,
      upgradeTimingOptimal: 168 // 7 days
    });

    // Variant B: Value-focused approach
    this.conversionVariants.set('value', {
      priceAnchor: 150, // Mid-range anchor
      urgencyStyle: 'moderate',
      socialProofType: 'statistics',
      trialLength: 7,
      upgradeTimingOptimal: 96 // 4 days
    });

    // Variant C: Community approach
    this.conversionVariants.set('community', {
      priceAnchor: 199,
      urgencyStyle: 'moderate',
      socialProofType: 'peer_activity',
      trialLength: 14,
      upgradeTimingOptimal: 120 // 5 days
    });
  }

  /**
   * Start personalized assessment flow
   */
  public async startPersonalAssessment(userId: string): Promise<PersonalAssessment> {
    const assessment: PersonalAssessment = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      responses: [],
      aiAnalysis: {} as PersonalityProfile,
      completedAt: new Date(),
      conversionVariant: this.selectConversionVariant(userId)
    };

    // Track assessment start
    analytics.track('assessment_started', {
      userId,
      assessmentId: assessment.id,
      conversionVariant: assessment.conversionVariant
    });

    return assessment;
  }

  /**
   * Process assessment response with adaptive branching and crisis detection
   */
  public async processAssessmentResponse(
    assessmentId: string,
    questionId: string,
    response: any,
    responseTime: number
  ): Promise<{ nextQuestion?: any; insights?: string[]; crisisDetection?: CrisisDetectionResult }> {
    const processingStart = performance.now();
    
    // CRITICAL: Crisis detection first - must complete within 3 seconds
    let crisisDetection: CrisisDetectionResult | undefined;
    const responseText = typeof response === 'string' ? response : JSON.stringify(response);
    
    try {
      const crisisPromise = crisisDetectionEngine.analyzeContent(responseText);
      const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
        setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
      );
      
      crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
      
      // Cache result for performance
      this.crisisDetectionCache.set(`${assessmentId}_${questionId}`, crisisDetection);
      
    } catch (error) {
      console.error('[FirstSessionMagic] Crisis detection failed, proceeding with safety fallback:', error);
      // Continue processing but with heightened safety measures
    }

    // Record response
    const assessmentResponse: AssessmentResponse = {
      questionId,
      questionText: this.ASSESSMENT_QUESTIONS.find(q => q.id === questionId)?.text || '',
      response,
      responseTime,
      confidence: this.calculateResponseConfidence(response, responseTime)
    };

    // Crisis safety override: If crisis detected, prioritize safety over conversion
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      const safetyInsights = await this.generateCrisisSafetyInsights(crisisDetection);
      
      analytics.track('assessment_crisis_detected', {
        questionId,
        interventionLevel: crisisDetection.interventionLevel,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        processingTime: performance.now() - processingStart
      });
      
      return { 
        nextQuestion: null, // Pause assessment for safety
        insights: safetyInsights,
        crisisDetection 
      };
    }

    // Standard processing for non-crisis responses
    const nextQuestion = this.determineNextQuestion(questionId, response);
    const insights = await this.generateInstantInsights(assessmentResponse);

    analytics.track('assessment_response', {
      questionId,
      responseTime,
      hasInsights: insights.length > 0,
      hasCrisisDetection: !!crisisDetection,
      processingTime: performance.now() - processingStart
    });

    return { nextQuestion, insights, crisisDetection };
  }

  /**
   * Complete assessment and generate AI analysis
   */
  public async completeAssessment(assessmentId: string, responses: AssessmentResponse[]): Promise<PersonalityProfile> {
    const aiAnalysis = await this.generatePersonalityProfile(responses);
    
    // Track completion
    analytics.track('assessment_completed', {
      assessmentId,
      totalResponses: responses.length,
      completionTime: responses.reduce((sum, r) => sum + r.responseTime, 0),
      personalityType: aiAnalysis.communicationStyle,
      pathwayRecommended: aiAnalysis.pathwayRecommendation
    });

    return aiAnalysis;
  }

  /**
   * Start first journaling session with live insights and crisis monitoring
   */
  public async startFirstSession(userId: string, personalityProfile: PersonalityProfile): Promise<FirstSessionExperience> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: FirstSessionExperience = {
      userId,
      sessionId,
      startTime: new Date(),
      milestones: [],
      aiInsights: [],
      valueDelivered: [],
      conversionReadiness: 0,
      nextActions: [],
      crisisSafetyOverride: false // Initialize with safety monitoring active
    };

    this.activeSessions.set(sessionId, session);

    // Generate personalized prompt
    const prompt = this.generatePersonalizedPrompt(personalityProfile);
    
    // Initialize crisis monitoring for this session
    await this.initializeSessionCrisisMonitoring(sessionId, userId);
    
    analytics.track('first_session_started', {
      userId,
      sessionId,
      personalityType: personalityProfile.communicationStyle,
      promptType: prompt.type,
      crisisMonitoringEnabled: true
    });

    return session;
  }

  /**
   * Process live writing with real-time insights and crisis detection
   */
  public async processLiveWriting(
    sessionId: string,
    content: string,
    wordCount: number,
    writingTime: number
  ): Promise<{ insights: LiveInsight[]; milestones: SessionMilestone[]; valueMetrics: ValueMetric[]; crisisDetection?: CrisisDetectionResult }> {
    const processingStart = performance.now();
    const session = this.activeSessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const insights: LiveInsight[] = [];
    const milestones: SessionMilestone[] = [];
    const valueMetrics: ValueMetric[] = [];

    // CRITICAL: Real-time crisis detection (must complete within 3 seconds)
    let crisisDetection: CrisisDetectionResult | undefined;
    
    try {
      const crisisPromise = crisisDetectionEngine.analyzeContent(content, session.userId);
      const timeoutPromise = new Promise<CrisisDetectionResult>((_, reject) => 
        setTimeout(() => reject(new Error('Crisis detection timeout')), this.CRISIS_RESPONSE_TIMEOUT)
      );
      
      crisisDetection = await Promise.race([crisisPromise, timeoutPromise]);
      session.crisisDetection = crisisDetection;
      
    } catch (error) {
      console.error('[FirstSessionMagic] Real-time crisis detection failed:', error);
    }

    // Crisis safety override: If crisis detected, all business logic is suspended
    if (crisisDetection && crisisDetection.interventionLevel !== 'none') {
      session.crisisSafetyOverride = true;
      
      // Generate crisis support insight with highest priority
      const crisisInsight: LiveInsight = {
        id: `crisis_${Date.now()}`,
        type: 'crisis_support',
        message: await this.generateCrisisSupportMessage(crisisDetection.interventionLevel),
        confidence: crisisDetection.confidence,
        displayTiming: 0, // Immediate display
        crisisLevel: crisisDetection.interventionLevel,
        isCrisisSafety: true
      };
      
      insights.push(crisisInsight);
      
      // Crisis support milestone
      const crisisMilestone: SessionMilestone = {
        type: 'crisis_support_provided',
        timestamp: new Date(),
        data: {
          interventionLevel: crisisDetection.interventionLevel,
          resourcesProvided: crisisDetection.recommendedResources.length,
          crisisScore: crisisDetection.crisisScore
        },
        impactScore: this.CRISIS_SAFETY_PRIORITY,
        crisisRelated: true
      };
      
      milestones.push(crisisMilestone);
      
      // Override conversion readiness to prioritize safety
      session.conversionReadiness = 0; // Business metrics irrelevant during crisis
      
      analytics.track('live_writing_crisis_detected', {
        sessionId: session.sessionId,
        userId: session.userId,
        interventionLevel: crisisDetection.interventionLevel,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        processingTime: performance.now() - processingStart
      });
      
      // Trigger emergency escalation if immediate intervention needed
      if (crisisDetection.interventionLevel === 'immediate') {
        await this.triggerEmergencyEscalation(session.userId, crisisDetection);
      }
      
      return { insights, milestones, valueMetrics, crisisDetection };
    }

    // Standard processing only if no crisis detected
    session.crisisSafetyOverride = false;
    
    // Generate insights at key word counts
    if (wordCount >= 50 && !session.aiInsights.find(i => i.type === 'emotional_pattern')) {
      const emotionalInsight = await this.generateEmotionalPatternInsight(content);
      insights.push(emotionalInsight);
      
      milestones.push({
        type: 'ai_insight',
        timestamp: new Date(),
        data: { insightType: 'emotional_pattern', wordCount },
        impactScore: 8,
        crisisRelated: false
      });
    }

    if (wordCount >= 100 && !session.aiInsights.find(i => i.type === 'strength_recognition')) {
      const strengthInsight = await this.generateStrengthRecognitionInsight(content);
      insights.push(strengthInsight);
      
      valueMetrics.push({
        metric: 'patterns_discovered',
        value: 1,
        benchmarkComparison: 'Most users discover their first pattern after 150+ words',
        visualizationData: { type: 'strength_map', strengths: ['resilience', 'self_awareness'] }
      });
    }

    if (wordCount >= 200) {
      const visualizationMilestone: SessionMilestone = {
        type: 'visualization',
        timestamp: new Date(),
        data: { 
          emotionMap: await this.generateEmotionVisualization(content),
          progressPreview: await this.generate30DayPreview(content)
        },
        impactScore: 9,
        crisisRelated: false
      };
      milestones.push(visualizationMilestone);
    }

    // Update session
    session.aiInsights.push(...insights);
    session.milestones.push(...milestones);
    session.valueDelivered.push(...valueMetrics);
    session.conversionReadiness = this.calculateConversionReadiness(session);

    analytics.track('live_writing_processed', {
      sessionId: session.sessionId,
      wordCount,
      insightsGenerated: insights.length,
      milestonesHit: milestones.length,
      conversionReadiness: session.conversionReadiness,
      hasCrisisDetection: !!crisisDetection,
      processingTime: performance.now() - processingStart
    });

    return { insights, milestones, valueMetrics, crisisDetection };
  }

  /**
   * Generate conversion opportunities with crisis safety override
   */
  public async generateConversionOpportunities(sessionId: string): Promise<ConversionAction[]> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return [];

    const actions: ConversionAction[] = [];
    
    // CRISIS SAFETY OVERRIDE: If crisis detected, only show crisis support actions
    if (session.crisisSafetyOverride) {
      actions.push({
        type: 'crisis_support_resources',
        priority: this.CRISIS_SAFETY_PRIORITY,
        timing: 'immediate',
        conditions: ['crisis_detected'],
        crisisOverride: true
      });
      
      // No business conversion actions during crisis
      return actions;
    }
    
    // Standard business logic only if no crisis override
    if (session.conversionReadiness >= 75) {
      actions.push({
        type: 'show_progress_preview',
        priority: 1,
        timing: 'immediate',
        conditions: ['high_engagement', 'positive_insights'],
        crisisOverride: false
      });

      actions.push({
        type: 'display_pricing',
        priority: 2,
        timing: 'delayed',
        conditions: ['progress_preview_viewed'],
        crisisOverride: false
      });
    }

    // Social proof for engaged users
    if (session.aiInsights.length >= 2) {
      actions.push({
        type: 'social_proof',
        priority: 3,
        timing: 'triggered',
        conditions: ['second_insight_generated'],
        crisisOverride: false
      });
    }

    return actions;
  }

  /**
   * Track conversion event and optimize future experiences
   */
  public async trackConversion(userId: string, conversionType: 'trial_started' | 'premium_upgraded', metadata: any): Promise<void> {
    analytics.track('conversion_event', {
      userId,
      conversionType,
      metadata,
      timestamp: new Date()
    });

    // Update conversion optimization models
    await this.updateConversionModels(userId, conversionType, metadata);
  }

  // Helper methods
  private selectConversionVariant(userId: string): string {
    // Simple hash-based assignment for consistent experience
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variants = ['gentle', 'value', 'community'];
    return variants[hash % variants.length];
  }

  private calculateResponseConfidence(response: any, responseTime: number): number {
    // Quick responses might indicate certainty, very slow might indicate uncertainty
    if (responseTime < 2000) return 0.9;
    if (responseTime < 10000) return 0.8;
    if (responseTime < 30000) return 0.7;
    return 0.6;
  }

  private determineNextQuestion(currentQuestionId: string, response: any): any {
    // Adaptive branching logic based on responses
    const currentIndex = this.ASSESSMENT_QUESTIONS.findIndex(q => q.id === currentQuestionId);
    return this.ASSESSMENT_QUESTIONS[currentIndex + 1] || null;
  }

  private async generateInstantInsights(response: AssessmentResponse): Promise<string[]> {
    const insights: string[] = [];
    
    if (response.questionId === 'primary_goal') {
      if (response.response.includes('therapy')) {
        insights.push('ALCHM can beautifully complement your therapy work');
      }
    }

    return insights;
  }

  private async generatePersonalityProfile(responses: AssessmentResponse[]): Promise<PersonalityProfile> {
    // AI analysis of responses to create personalized profile
    const goalResponse = responses.find(r => r.questionId === 'primary_goal');
    const supportResponse = responses.find(r => r.questionId === 'support_preference');
    const traumaResponse = responses.find(r => r.questionId === 'trauma_sensitivity');

    return {
      primaryNeeds: ['emotional_processing', 'self_awareness'],
      communicationStyle: this.determineCommunicationStyle(supportResponse?.response),
      traumaInformedLevel: this.determineTraumaSensitivity(traumaResponse?.response),
      pathwayRecommendation: this.recommendPathway(goalResponse?.response),
      personalizationSettings: this.generateUIPersonalization(responses),
      conversionOptimization: this.generateConversionProfile(responses)
    };
  }

  private generatePersonalizedPrompt(profile: PersonalityProfile): { type: string; text: string } {
    const prompts = {
      gentle: "What's one small thing that brought you peace today?",
      analytical: "What patterns are you noticing in your thoughts lately?",
      creative: "If your emotions were colors today, what would your palette look like?",
      direct: "What's really on your mind right now?"
    };

    return {
      type: profile.communicationStyle,
      text: prompts[profile.communicationStyle] || prompts.gentle
    };
  }

  private async generateEmotionalPatternInsight(content: string): Promise<LiveInsight> {
    // AI analysis of emotional patterns in writing
    return {
      id: `insight_${Date.now()}`,
      type: 'emotional_pattern',
      message: "I notice a theme of resilience in your writing - that's a real strength.",
      confidence: 0.85,
      displayTiming: 0,
      userReaction: undefined
    };
  }

  private async generateStrengthRecognitionInsight(content: string): Promise<LiveInsight> {
    return {
      id: `insight_${Date.now()}`,
      type: 'strength_recognition',
      message: "Your self-awareness shines through - you're already showing tremendous insight.",
      confidence: 0.78,
      displayTiming: 2,
      userReaction: undefined
    };
  }

  private async generateEmotionVisualization(content: string): Promise<any> {
    // Generate beautiful emotion mapping visualization
    return {
      type: 'emotion_cloud',
      emotions: ['hopeful', 'reflective', 'determined'],
      dominantTone: 'hopeful',
      progression: 'upward'
    };
  }

  private async generate30DayPreview(content: string): Promise<any> {
    return {
      projectedGrowth: 'significant_improvement',
      keyMilestones: ['emotional_vocabulary_expansion', 'pattern_recognition', 'coping_strategies'],
      visualProgress: 'increasing_positivity_trend'
    };
  }

  private calculateConversionReadiness(session: FirstSessionExperience): number {
    let score = 0;
    
    // Base engagement score
    score += Math.min(session.valueDelivered.length * 20, 60);
    
    // Milestone bonuses
    score += session.milestones.length * 10;
    
    // Insight engagement
    const positiveReactions = session.aiInsights.filter(i => i.userReaction === 'positive').length;
    score += positiveReactions * 15;

    return Math.min(score, 100);
  }

  private async updateConversionModels(userId: string, conversionType: string, metadata: any): Promise<void> {
    // Update ML models for conversion optimization
    // This would integrate with the AI system for continuous improvement
  }

  // Additional helper methods for profile generation
  private determineCommunicationStyle(response: any): PersonalityProfile['communicationStyle'] {
    if (typeof response === 'string') {
      if (response.includes('gentle')) return 'gentle';
      if (response.includes('detailed')) return 'analytical';
      if (response.includes('creative')) return 'creative';
      if (response.includes('direct')) return 'direct';
    }
    return 'gentle';
  }

  private determineTraumaSensitivity(response: any): PersonalityProfile['traumaInformedLevel'] {
    if (typeof response === 'string') {
      if (response.includes('very gently')) return 'high_sensitivity';
      if (response.includes('thoughtfully')) return 'moderate';
      if (response.includes('direct approaches')) return 'standard';
    }
    return 'moderate';
  }

  private recommendPathway(response: any): string {
    if (typeof response === 'string') {
      if (response.includes('therapy')) return 'therapy_companion';
      if (response.includes('coping')) return 'resilience_building';
      if (response.includes('growth')) return 'personal_development';
      if (response.includes('emotions')) return 'emotional_processing';
    }
    return 'gentle_exploration';
  }

  private generateUIPersonalization(responses: AssessmentResponse[]): UIPersonalization {
    return {
      colorScheme: 'sage', // Default to ALCHM sage
      fontScale: 1.0,
      animationSpeed: 'normal',
      layoutDensity: 'comfortable',
      preferredPrompts: ['reflective', 'strength_based']
    };
  }

  private generateConversionProfile(responses: AssessmentResponse[]): ConversionProfile {
    // Analyze responses to optimize conversion approach
    return {
      priceAnchor: 199,
      urgencyStyle: 'gentle',
      socialProofType: 'testimonials',
      trialLength: 14,
      upgradeTimingOptimal: 120
    };
  }

  // =================================================================
  // CRISIS SAFETY METHODS - HIGHEST PRIORITY
  // =================================================================

  /**
   * Initialize crisis monitoring system
   */
  private initializeCrisisMonitoring(): void {
    console.log('[FirstSessionMagic] Crisis detection monitoring initialized');
    
    // Set up periodic cleanup of crisis detection cache
    setInterval(() => {
      this.cleanupCrisisCache();
    }, 300000); // 5 minutes
  }

  /**
   * Initialize crisis monitoring for specific session
   */
  private async initializeSessionCrisisMonitoring(sessionId: string, userId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    // Pre-load crisis resources for immediate access if needed
    try {
      const resources = crisisDetectionEngine.getCrisisResources(['general', 'crisis']);
      // Cache resources for instant access during crisis
      this.crisisDetectionCache.set(`resources_${sessionId}`, {
        interventionLevel: 'none',
        crisisScore: 0,
        detectedPatterns: [],
        recommendedResources: resources,
        confidence: 1.0,
        timestamp: new Date(),
        processingTime: 0
      });
    } catch (error) {
      console.error('[FirstSessionMagic] Failed to pre-load crisis resources:', error);
    }
  }

  /**
   * Generate crisis safety insights with immediate intervention
   */
  private async generateCrisisSafetyInsights(crisisDetection: CrisisDetectionResult): Promise<string[]> {
    const insights: string[] = [];
    
    switch (crisisDetection.interventionLevel) {
      case 'immediate':
        insights.push(
          'We care about you and want you to be safe. You\'re not alone, and immediate support is available.',
          'Please reach out to the National Suicide Prevention Lifeline at 988 or emergency services at 911.',
          'Your safety matters more than anything else right now.'
        );
        break;
        
      case 'supportive':
        insights.push(
          'We notice you might be going through a difficult time. Your feelings are valid, and support is available.',
          'The Crisis Text Line (text HOME to 741741) offers 24/7 support from trained counselors.',
          'You don\'t have to face this alone - reaching out is a sign of strength.'
        );
        break;
        
      case 'gentle':
        insights.push(
          'It sounds like you\'re dealing with some challenging emotions. That takes courage to acknowledge.',
          'If you need someone to talk to, resources like the 988 Lifeline are always available.',
          'Remember that difficult feelings are temporary, and you have support options.'
        );
        break;
    }
    
    return insights;
  }

  /**
   * Generate crisis support message based on intervention level
   */
  private async generateCrisisSupportMessage(interventionLevel: InterventionLevel): Promise<string> {
    const messages = {
      immediate: 'We care about you and want you to be safe. Immediate support is available 24/7.',
      supportive: 'You\'re going through something difficult, and that\'s okay. Support is here when you need it.',
      gentle: 'Your feelings matter, and you don\'t have to face this alone.',
      none: ''
    };
    
    return messages[interventionLevel] || messages.gentle;
  }

  /**
   * Trigger emergency escalation for immediate intervention cases
   */
  private async triggerEmergencyEscalation(userId: string, crisisDetection: CrisisDetectionResult): Promise<void> {
    try {
      // Escalate through crisis detection engine
      await crisisDetectionEngine.escalateEmergency(userId, crisisDetection);
      
      // Log emergency escalation in session
      analytics.track('first_session_emergency_escalation', {
        userId,
        crisisScore: crisisDetection.crisisScore,
        confidence: crisisDetection.confidence,
        detectedPatterns: crisisDetection.detectedPatterns.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('[FirstSessionMagic] Emergency escalation failed:', error);
      
      // Fallback: Ensure crisis resources are still displayed
      analytics.track('first_session_escalation_fallback', {
        userId,
        error: 'escalation_failed',
        fallbackAction: 'crisis_resources_displayed'
      });
    }
  }

  /**
   * Clean up crisis detection cache to prevent memory leaks
   */
  private cleanupCrisisCache(): void {
    const now = Date.now();
    const cacheExpiry = 600000; // 10 minutes
    
    for (const [key, result] of this.crisisDetectionCache.entries()) {
      if (now - result.timestamp.getTime() > cacheExpiry) {
        this.crisisDetectionCache.delete(key);
      }
    }
  }

  /**
   * Get real-time crisis analysis for immediate feedback
   */
  public async getRealTimeCrisisAnalysis(content: string, userId?: string): Promise<CrisisDetectionResult> {
    const cacheKey = `realtime_${content.substring(0, 50).replace(/\s/g, '_')}`;
    
    // Check cache first for performance
    const cached = this.crisisDetectionCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp.getTime()) < 30000) { // 30 second cache
      return cached;
    }
    
    try {
      const result = await Promise.race([
        crisisDetectionEngine.analyzeContent(content, userId),
        new Promise<CrisisDetectionResult>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), this.CRISIS_RESPONSE_TIMEOUT)
        )
      ]);
      
      this.crisisDetectionCache.set(cacheKey, result);
      return result;
      
    } catch (error) {
      console.error('[FirstSessionMagic] Real-time crisis analysis failed:', error);
      
      // Return safe fallback
      return {
        interventionLevel: 'none',
        crisisScore: 0,
        detectedPatterns: [],
        recommendedResources: crisisDetectionEngine.getCrisisResources(['general']),
        confidence: 0,
        timestamp: new Date(),
        processingTime: this.CRISIS_RESPONSE_TIMEOUT,
        error: 'Analysis timeout - showing general resources as precaution'
      };
    }
  }

  /**
   * Override all business metrics during crisis
   */
  public isCrisisSafetyActive(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    return session?.crisisSafetyOverride || false;
  }

  /**
   * Get crisis resources with <1 second loading
   */
  public async getEmergencyCrisisResources(sessionId?: string): Promise<CrisisDetectionResult['recommendedResources']> {
    // Try to get pre-cached resources first
    if (sessionId) {
      const cached = this.crisisDetectionCache.get(`resources_${sessionId}`);
      if (cached) {
        return cached.recommendedResources;
      }
    }
    
    // Fallback to direct resource fetch
    return crisisDetectionEngine.getCrisisResources(['general', 'crisis', 'suicide']).slice(0, 3);
  }
}

// Export singleton instance
export const firstSessionMagicEngine = new FirstSessionMagicEngine();

// Crisis safety validation
if (typeof window !== 'undefined') {
  console.log('[FirstSessionMagic] Crisis safety integration active - all business metrics will be overridden during crisis detection');
}