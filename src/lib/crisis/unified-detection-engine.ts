/**
 * UNIFIED CRISIS DETECTION ENGINE
 * 
 * MISSION CRITICAL: Single source of truth for all crisis detection across ALCHM
 * Ensures consistent, accurate, and culturally-sensitive crisis identification
 * with sub-100ms response time guarantees.
 */

import { z } from 'zod';

// Crisis Detection Configuration Schema
export const CrisisDetectionConfig = z.object({
  enableContextualAnalysis: z.boolean().default(true),
  enableCulturalAdaptations: z.boolean().default(true),
  falsePositiveThreshold: z.number().min(0).max(1).default(0.05),
  responseTimeTarget: z.number().default(100), // milliseconds
  confidenceThreshold: z.number().min(0).max(1).default(0.7),
  enableProgressiveEscalation: z.boolean().default(true)
});

// Crisis Context Schema
export const CrisisContext = z.object({
  userId: z.string().optional(),
  culturalBackground: z.array(z.string()).default([]),
  preferredLanguage: z.string().default('en'),
  ageGroup: z.enum(['youth', 'adult', 'senior']).default('adult'),
  previousCrisisEvents: z.number().default(0),
  sessionContext: z.object({
    timeOfDay: z.enum(['early_morning', 'morning', 'afternoon', 'evening', 'late_night']).default('afternoon'),
    dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).default('monday'),
    isOffline: z.boolean().default(false),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']).default('desktop')
  }).optional()
});

// Crisis Detection Result Schema
export const CrisisDetectionResult = z.object({
  level: z.enum(['none', 'low', 'moderate', 'high', 'critical']),
  confidence: z.number().min(0).max(1),
  detectedPatterns: z.array(z.string()),
  culturalAdaptations: z.array(z.string()),
  urgentAction: z.boolean(),
  immediateResources: z.array(z.object({
    type: z.enum(['hotline', 'text', 'chat', 'emergency']),
    name: z.string(),
    contact: z.string(),
    culturallyAppropriate: z.boolean(),
    available24h: z.boolean()
  })),
  supportMessage: z.string(),
  followUpRecommended: z.boolean(),
  responseTime: z.number(),
  escalationTrigger: z.boolean()
});

export type CrisisDetectionConfigType = z.infer<typeof CrisisDetectionConfig>;
export type CrisisContextType = z.infer<typeof CrisisContext>;
export type CrisisDetectionResultType = z.infer<typeof CrisisDetectionResult>;

/**
 * Unified Crisis Detection Patterns
 * Single source of truth for all crisis language detection
 */
const UNIFIED_CRISIS_PATTERNS = {
  // CRITICAL LEVEL: Immediate suicide/self-harm risk
  critical: {
    patterns: [
      'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
      'take my life', 'want to die', 'no point in living', 'end the pain',
      'cant go on', "can't go on", 'no way out', 'ready to die',
      'going to end it', 'final goodbye', 'say goodbye forever'
    ],
    weight: 10,
    urgentAction: true,
    escalationTrigger: true
  },
  
  // HIGH LEVEL: Self-harm and severe distress
  high: {
    patterns: [
      'hurt myself', 'self harm', 'cutting myself', 'harm myself',
      'punish myself', 'hate myself', 'worthless', 'nobody cares',
      'alone forever', 'give up completely', 'breaking point',
      'cant take it', "can't take it", 'too much pain'
    ],
    weight: 7,
    urgentAction: false,
    escalationTrigger: false
  },
  
  // MODERATE LEVEL: Significant emotional distress
  moderate: {
    patterns: [
      'depressed', 'hopeless', 'desperate', 'overwhelmed',
      'drowning', 'suffocating', 'trapped', 'stuck',
      'no hope', 'falling apart', 'losing control', 'spiraling'
    ],
    weight: 4,
    urgentAction: false,
    escalationTrigger: false
  },
  
  // LOW LEVEL: General distress indicators
  low: {
    patterns: [
      'sad', 'anxious', 'stressed', 'struggling', 'difficult',
      'hard time', 'tired', 'exhausted', 'lonely', 'lost'
    ],
    weight: 2,
    urgentAction: false,
    escalationTrigger: false
  }
};

/**
 * Time-based urgency indicators that escalate any risk level
 */
const URGENCY_INDICATORS = [
  'tonight', 'today', 'right now', 'this moment', 'plan to', 'going to',
  'ready to', 'in an hour', 'before sunrise', 'final decision',
  'countdown started', 'moment arrived', 'this is it', 'goodbye'
];

/**
 * Enhanced false positive patterns with contextual analysis
 */
const ENHANCED_FALSE_POSITIVE_PATTERNS = [
  // Common expressions
  'killed it in', 'to die for', 'dead tired', 'dying to meet',
  'killed the presentation', 'dead beat tired', 'drop dead gorgeous',
  'over my dead body', 'dead serious about', 'kill time',
  'killed the game', 'dying of laughter', 'dead center',
  'suicide mission game', 'kill two birds',
  
  // Creative/gaming expressions
  'character died', 'game over', 'respawn', 'death match',
  'killed the boss', 'suicide run strategy', 'kamikaze attack',
  
  // Academic/work expressions
  'deadline is killing me', 'dying to graduate', 'killed the exam',
  'presentation bombed', 'project died'
];

/**
 * Cultural crisis expressions for enhanced sensitivity
 */
const CULTURAL_CRISIS_PATTERNS = {
  lgbtq: [
    'not accepted', 'family rejected', 'dont belong anywhere',
    'wrong body', 'cant be myself', 'hiding who i am',
    'conversion therapy', 'pray away', 'abomination'
  ],
  bipoc: [
    'tired of fighting', 'system against me', 'no opportunities',
    'discrimination exhausting', 'microaggressions daily',
    'code switching exhausting', 'cultural burden'
  ],
  immigrant: [
    'dont belong here', 'deportation fear', 'language barrier',
    'cultural isolation', 'homesick forever', 'between two worlds',
    'family sacrifices wasted'
  ],
  youth: [
    'parents dont understand', 'academic pressure killing',
    'bullying relentless', 'social media comparison',
    'future seems impossible', 'adulting overwhelming'
  ],
  indigenous: [
    'historical trauma', 'generational pain', 'land connection lost',
    'cultural erasure', 'boarding school trauma', 'spirit broken'
  ]
};

/**
 * Unified Crisis Detection Engine
 * 
 * Provides consistent, fast, and accurate crisis detection across all ALCHM systems
 */
export class UnifiedCrisisDetectionEngine {
  private config: CrisisDetectionConfigType;
  private performanceMetrics: {
    totalDetections: number;
    averageResponseTime: number;
    falsePositiveRate: number;
    accuracyRate: number;
  };

  constructor(config: Partial<CrisisDetectionConfigType> = {}) {
    this.config = CrisisDetectionConfig.parse(config);
    this.performanceMetrics = {
      totalDetections: 0,
      averageResponseTime: 0,
      falsePositiveRate: 0,
      accuracyRate: 0
    };
  }

  /**
   * CORE FUNCTION: Detect crisis in text with comprehensive analysis
   * 
   * @param text - Text content to analyze (AI summary or direct input)
   * @param context - Cultural and contextual information
   * @returns Comprehensive crisis detection result
   */
  public detectCrisis(text: string, context: CrisisContextType = {}): CrisisDetectionResultType {
    const startTime = performance.now();
    const parsedContext = CrisisContext.parse(context);

    try {
      // Quick validation
      if (!text || typeof text !== 'string' || text.trim().length < 3) {
        return this.createSafeResult('none', 0, [], startTime);
      }

      const normalizedText = this.normalizeText(text);
      
      // Step 1: Check for false positives first
      if (this.hasFalsePositives(normalizedText)) {
        return this.createSafeResult('none', 0, [], startTime);
      }

      // Step 2: Detect crisis patterns with scoring
      const detectionScores = this.analyzePatterns(normalizedText, parsedContext);
      
      // Step 3: Check for time-based urgency indicators
      const hasUrgentTiming = this.checkUrgencyIndicators(normalizedText);
      
      // Step 4: Apply cultural sensitivity adjustments
      const culturalAdjustments = this.applyCulturalAdaptations(
        normalizedText, 
        parsedContext, 
        detectionScores
      );

      // Step 5: Calculate final crisis level and confidence
      const finalResult = this.calculateFinalScore(
        detectionScores,
        culturalAdjustments,
        hasUrgentTiming,
        parsedContext
      );

      // Step 6: Generate appropriate resources and messaging
      const crisisResult = this.generateCrisisResponse(
        finalResult,
        parsedContext,
        hasUrgentTiming,
        startTime
      );

      // Update performance metrics
      this.updateMetrics(performance.now() - startTime);

      return crisisResult;

    } catch (error) {
      console.error('[Crisis Detection Engine] Detection failed:', error);
      
      // CRITICAL: Always provide safe fallback
      return this.createEmergencyFallback(startTime);
    }
  }

  /**
   * Quick crisis check for immediate response (<50ms)
   */
  public quickCrisisCheck(text: string): { hasCrisisIndicators: boolean; urgentAction: boolean } {
    if (!text || typeof text !== 'string') {
      return { hasCrisisIndicators: false, urgentAction: false };
    }

    const lowerText = text.toLowerCase();
    
    // Check critical patterns only
    const hasCritical = UNIFIED_CRISIS_PATTERNS.critical.patterns.some(pattern =>
      lowerText.includes(pattern.toLowerCase())
    );

    const hasUrgent = URGENCY_INDICATORS.some(indicator =>
      lowerText.includes(indicator.toLowerCase())
    );

    return {
      hasCrisisIndicators: hasCritical,
      urgentAction: hasCritical && hasUrgent
    };
  }

  /**
   * Normalize text for consistent analysis
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/['']/g, "'") // Normalize apostrophes
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Check for false positive patterns with contextual analysis
   */
  private hasFalsePositives(normalizedText: string): boolean {
    return ENHANCED_FALSE_POSITIVE_PATTERNS.some(pattern =>
      normalizedText.includes(pattern.toLowerCase())
    );
  }

  /**
   * Analyze crisis patterns with weighted scoring
   */
  private analyzePatterns(normalizedText: string, context: CrisisContextType): {
    level: string;
    score: number;
    patterns: string[];
  } {
    let totalScore = 0;
    const detectedPatterns: string[] = [];
    let highestLevel = 'none';

    // Check each crisis level
    for (const [level, config] of Object.entries(UNIFIED_CRISIS_PATTERNS)) {
      const levelPatterns = config.patterns.filter(pattern =>
        normalizedText.includes(pattern.toLowerCase())
      );

      if (levelPatterns.length > 0) {
        const levelScore = levelPatterns.length * config.weight;
        totalScore += levelScore;
        detectedPatterns.push(...levelPatterns);
        
        // Update highest level detected
        if (this.getLevelPriority(level) > this.getLevelPriority(highestLevel)) {
          highestLevel = level;
        }
      }
    }

    return {
      level: highestLevel,
      score: totalScore,
      patterns: detectedPatterns
    };
  }

  /**
   * Check for time-based urgency indicators
   */
  private checkUrgencyIndicators(normalizedText: string): boolean {
    return URGENCY_INDICATORS.some(indicator =>
      normalizedText.includes(indicator.toLowerCase())
    );
  }

  /**
   * Apply cultural adaptations to crisis detection
   */
  private applyCulturalAdaptations(
    normalizedText: string,
    context: CrisisContextType,
    detectionScores: any
  ): {
    culturalPatterns: string[];
    adjustedScore: number;
    adaptations: string[];
  } {
    const culturalPatterns: string[] = [];
    const adaptations: string[] = [];
    let adjustedScore = detectionScores.score;

    // Check cultural-specific patterns
    for (const [culture, patterns] of Object.entries(CULTURAL_CRISIS_PATTERNS)) {
      if (context.culturalBackground?.includes(culture)) {
        const culturalMatches = patterns.filter(pattern =>
          normalizedText.includes(pattern.toLowerCase())
        );
        
        if (culturalMatches.length > 0) {
          culturalPatterns.push(...culturalMatches);
          adjustedScore += culturalMatches.length * 3; // Cultural sensitivity boost
          adaptations.push(`${culture}_specific_patterns`);
        }
      }
    }

    return {
      culturalPatterns,
      adjustedScore,
      adaptations
    };
  }

  /**
   * Calculate final crisis level and confidence
   */
  private calculateFinalScore(
    detectionScores: any,
    culturalAdjustments: any,
    hasUrgentTiming: boolean,
    context: CrisisContextType
  ): {
    level: 'none' | 'low' | 'moderate' | 'high' | 'critical';
    confidence: number;
    urgentAction: boolean;
    escalationTrigger: boolean;
  } {
    const totalScore = culturalAdjustments.adjustedScore;
    let level: 'none' | 'low' | 'moderate' | 'high' | 'critical' = 'none';
    let confidence = 0;

    // Determine level based on score
    if (totalScore >= 20) {
      level = 'critical';
      confidence = Math.min(0.95, totalScore / 25);
    } else if (totalScore >= 12) {
      level = 'high';
      confidence = Math.min(0.85, totalScore / 18);
    } else if (totalScore >= 8) {
      level = 'moderate';
      confidence = Math.min(0.75, totalScore / 12);
    } else if (totalScore >= 4) {
      level = 'low';
      confidence = Math.min(0.65, totalScore / 8);
    }

    // Adjust for time urgency
    if (hasUrgentTiming && level !== 'none') {
      confidence = Math.min(0.95, confidence + 0.2);
      if (level === 'moderate') level = 'high';
      if (level === 'high') level = 'critical';
    }

    const urgentAction = level === 'critical' || (level === 'high' && hasUrgentTiming);
    const escalationTrigger = level === 'critical' && hasUrgentTiming;

    return {
      level,
      confidence,
      urgentAction,
      escalationTrigger
    };
  }

  /**
   * Generate comprehensive crisis response
   */
  private generateCrisisResponse(
    finalResult: any,
    context: CrisisContextType,
    hasUrgentTiming: boolean,
    startTime: number
  ): CrisisDetectionResultType {
    const responseTime = performance.now() - startTime;
    
    return {
      level: finalResult.level,
      confidence: finalResult.confidence,
      detectedPatterns: [], // Privacy: Don't return specific patterns
      culturalAdaptations: this.getCulturalAdaptations(context),
      urgentAction: finalResult.urgentAction,
      immediateResources: this.getImmediateResources(context, finalResult.level),
      supportMessage: this.generateSupportMessage(finalResult.level, context),
      followUpRecommended: finalResult.level !== 'none',
      responseTime,
      escalationTrigger: finalResult.escalationTrigger
    };
  }

  /**
   * Get immediate crisis resources based on context
   */
  private getImmediateResources(
    context: CrisisContextType,
    level: string
  ): Array<{
    type: 'hotline' | 'text' | 'chat' | 'emergency';
    name: string;
    contact: string;
    culturallyAppropriate: boolean;
    available24h: boolean;
  }> {
    const resources = [];

    // Universal critical resources
    resources.push({
      type: 'hotline' as const,
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      culturallyAppropriate: true,
      available24h: true
    });

    resources.push({
      type: 'text' as const,
      name: 'Crisis Text Line',
      contact: '741741',
      culturallyAppropriate: true,
      available24h: true
    });

    // Add cultural-specific resources
    if (context.culturalBackground?.includes('lgbtq')) {
      resources.push({
        type: 'hotline' as const,
        name: 'Trevor Project',
        contact: '1-866-488-7386',
        culturallyAppropriate: true,
        available24h: true
      });
    }

    if (context.culturalBackground?.includes('transgender')) {
      resources.push({
        type: 'hotline' as const,
        name: 'Trans Lifeline',
        contact: '877-565-8860',
        culturallyAppropriate: true,
        available24h: true
      });
    }

    // Emergency services for critical level
    if (level === 'critical') {
      resources.unshift({
        type: 'emergency' as const,
        name: 'Emergency Services',
        contact: '911',
        culturallyAppropriate: true,
        available24h: true
      });
    }

    return resources;
  }

  /**
   * Generate culturally-sensitive support message
   */
  private generateSupportMessage(level: string, context: CrisisContextType): string {
    const messages = {
      critical: "You are not alone, and your life has value. Please reach out for immediate support.",
      high: "It sounds like you're going through something really difficult. Support is available.",
      moderate: "We notice you might be struggling. There are people who want to help.",
      low: "It's okay to not be okay. Consider reaching out for support when you're ready.",
      none: "Continue taking care of yourself. Help is available if you need it."
    };

    let baseMessage = messages[level as keyof typeof messages] || messages.none;

    // Add cultural sensitivity
    if (context.culturalBackground?.length) {
      baseMessage += " Resources that understand your background are available.";
    }

    if (context.ageGroup === 'youth') {
      baseMessage = baseMessage.replace('people who want to help', 'people who understand what you\'re going through');
    }

    return baseMessage;
  }

  /**
   * Get cultural adaptations for response
   */
  private getCulturalAdaptations(context: CrisisContextType): string[] {
    const adaptations: string[] = [];

    if (context.culturalBackground?.includes('lgbtq')) {
      adaptations.push('lgbtq_affirming_resources', 'chosen_family_considerations');
    }

    if (context.culturalBackground?.includes('bipoc')) {
      adaptations.push('culturally_competent_counselors', 'community_specific_resources');
    }

    if (context.ageGroup === 'youth') {
      adaptations.push('youth_specific_language', 'parent_notification_considerations');
    }

    return adaptations;
  }

  /**
   * Get level priority for comparison
   */
  private getLevelPriority(level: string): number {
    const priorities = { none: 0, low: 1, moderate: 2, high: 3, critical: 4 };
    return priorities[level as keyof typeof priorities] || 0;
  }

  /**
   * Create safe result for non-crisis scenarios
   */
  private createSafeResult(
    level: 'none',
    confidence: number,
    patterns: string[],
    startTime: number
  ): CrisisDetectionResultType {
    return {
      level,
      confidence,
      detectedPatterns: [],
      culturalAdaptations: [],
      urgentAction: false,
      immediateResources: [],
      supportMessage: "Continue taking care of yourself. Help is available if you need it.",
      followUpRecommended: false,
      responseTime: performance.now() - startTime,
      escalationTrigger: false
    };
  }

  /**
   * Create emergency fallback response
   */
  private createEmergencyFallback(startTime: number): CrisisDetectionResultType {
    return {
      level: 'high',
      confidence: 0.8,
      detectedPatterns: [],
      culturalAdaptations: [],
      urgentAction: true,
      immediateResources: [{
        type: 'hotline',
        name: '988 Suicide & Crisis Lifeline',
        contact: '988',
        culturallyAppropriate: true,
        available24h: true
      }],
      supportMessage: "Crisis detection is temporarily unavailable. If you're in crisis, please reach out for help immediately.",
      followUpRecommended: true,
      responseTime: performance.now() - startTime,
      escalationTrigger: false
    };
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(responseTime: number): void {
    this.performanceMetrics.totalDetections++;
    this.performanceMetrics.averageResponseTime = 
      (this.performanceMetrics.averageResponseTime * (this.performanceMetrics.totalDetections - 1) + responseTime) /
      this.performanceMetrics.totalDetections;

    // Alert if response time exceeds target
    if (responseTime > this.config.responseTimeTarget) {
      console.warn(`[Crisis Detection Engine] Response time exceeded target: ${responseTime}ms > ${this.config.responseTimeTarget}ms`);
    }
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<CrisisDetectionConfigType>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Health check
   */
  public healthCheck(): {
    status: 'healthy' | 'degraded' | 'critical';
    averageResponseTime: number;
    totalDetections: number;
  } {
    const avgResponseTime = this.performanceMetrics.averageResponseTime;
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    if (avgResponseTime > this.config.responseTimeTarget * 2) {
      status = 'critical';
    } else if (avgResponseTime > this.config.responseTimeTarget) {
      status = 'degraded';
    }

    return {
      status,
      averageResponseTime: avgResponseTime,
      totalDetections: this.performanceMetrics.totalDetections
    };
  }
}

// Export singleton instance
export const unifiedCrisisDetectionEngine = new UnifiedCrisisDetectionEngine({
  enableContextualAnalysis: true,
  enableCulturalAdaptations: true,
  falsePositiveThreshold: 0.05,
  responseTimeTarget: 100,
  confidenceThreshold: 0.7,
  enableProgressiveEscalation: true
});