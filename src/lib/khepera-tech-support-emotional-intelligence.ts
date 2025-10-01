/**
 * ALCHM Technical Support Emotional Intelligence System
 * Advanced pattern recognition for user emotional states during technical difficulties
 * Integrates trauma-informed responses with practical technical support
 */

export interface EmotionalPattern {
  patternId: string;
  emotionalState: string;
  triggers: string[];
  indicators: EmotionalIndicator[];
  responseStrategy: ResponseStrategy;
  escalationThreshold: number;
}

export interface EmotionalIndicator {
  type: 'language' | 'timing' | 'behavioral' | 'contextual';
  signal: string;
  weight: number;
  description: string;
}

export interface ResponseStrategy {
  approachType: 'validation' | 'simplification' | 'empowerment' | 'crisis_intervention';
  languageAdjustments: string[];
  pacingChanges: string[];
  supportActions: string[];
  warningFlags: string[];
}

export interface UserEmotionalProfile {
  currentSession: SessionEmotionalData;
  historicalPatterns: HistoricalEmotionalData[];
  vulnerabilityIndicators: VulnerabilityIndicator[];
  resilienceFactors: ResilienceIndicator[];
}

export interface SessionEmotionalData {
  emotionalTrajectory: string[];
  stressLevel: number;
  frustrationThreshold: number;
  successfulCopingStrategies: string[];
  triggeredPatterns: string[];
}

export interface HistoricalEmotionalData {
  date: string;
  scenarioType: string;
  emotionalJourney: string[];
  resolutionSuccessful: boolean;
  timeToResolution: number;
}

export interface VulnerabilityIndicator {
  type: 'technical_anxiety' | 'perfectionism' | 'learned_helplessness' | 'crisis_state';
  strength: number;
  context: string;
  supportNeeds: string[];
}

export interface ResilienceIndicator {
  type: 'persistence' | 'help_seeking' | 'self_advocacy' | 'growth_mindset';
  strength: number;
  evidence: string[];
  leverage_opportunities: string[];
}

/**
 * Comprehensive emotional pattern recognition for technical support scenarios
 */
export const EMOTIONAL_PATTERNS: Record<string, EmotionalPattern> = {
  TECHNICAL_ANXIETY: {
    patternId: 'technical_anxiety',
    emotionalState: 'anxious',
    triggers: [
      'fear of breaking something',
      'uncertainty about consequences',
      'previous negative tech experiences',
      'feeling incompetent with technology'
    ],
    indicators: [
      {
        type: 'language',
        signal: 'what if I break',
        weight: 0.8,
        description: 'Fear of causing damage through action'
      },
      {
        type: 'language',
        signal: 'am I doing this wrong',
        weight: 0.7,
        description: 'Self-doubt about competency'
      },
      {
        type: 'language',
        signal: 'I don\'t want to mess up',
        weight: 0.9,
        description: 'High stakes anxiety about mistakes'
      },
      {
        type: 'behavioral',
        signal: 'repeated questions for reassurance',
        weight: 0.6,
        description: 'Seeking validation before each step'
      },
      {
        type: 'timing',
        signal: 'long pauses before responding',
        weight: 0.5,
        description: 'Hesitation indicating internal anxiety'
      }
    ],
    responseStrategy: {
      approachType: 'validation',
      languageAdjustments: [
        'Emphasize safety and reversibility',
        'Use reassuring, confident tone',
        'Explain backup measures',
        'Normalize learning process'
      ],
      pacingChanges: [
        'Slow down instruction delivery',
        'Allow extra processing time',
        'Offer breaks between steps',
        'Provide preview of upcoming actions'
      ],
      supportActions: [
        'Explain safety measures first',
        'Offer step-by-step previews',
        'Celebrate courage in trying',
        'Provide immediate reassurance'
      ],
      warningFlags: [
        'Escalating paralysis',
        'Complete refusal to proceed',
        'Panic language patterns'
      ]
    },
    escalationThreshold: 0.7
  },

  LEARNED_TECHNICAL_HELPLESSNESS: {
    patternId: 'learned_helplessness',
    emotionalState: 'defeated',
    triggers: [
      'repeated past failures',
      'being told they\'re "not tech-savvy"',
      'complex systems without guidance',
      'lack of technical confidence'
    ],
    indicators: [
      {
        type: 'language',
        signal: 'I\'m not good with computers',
        weight: 0.8,
        description: 'Self-limiting identity about technical capability'
      },
      {
        type: 'language',
        signal: 'I always mess these things up',
        weight: 0.9,
        description: 'Pattern of expecting failure'
      },
      {
        type: 'language',
        signal: 'can you just do it for me',
        weight: 0.7,
        description: 'Abdication of agency and learning'
      },
      {
        type: 'behavioral',
        signal: 'passive waiting for solutions',
        weight: 0.6,
        description: 'Not engaging with problem-solving process'
      },
      {
        type: 'contextual',
        signal: 'quick surrender after minimal effort',
        weight: 0.8,
        description: 'Giving up before exploring options'
      }
    ],
    responseStrategy: {
      approachType: 'empowerment',
      languageAdjustments: [
        'Emphasize user agency and capability',
        'Reframe challenges as learning opportunities',
        'Use collaborative "we" language',
        'Celebrate incremental progress'
      ],
      pacingChanges: [
        'Start with very small wins',
        'Build complexity gradually',
        'Acknowledge each successful step',
        'Connect actions to outcomes clearly'
      ],
      supportActions: [
        'Highlight user contributions to solutions',
        'Provide evidence of growing competency',
        'Connect current success to future capability',
        'Challenge limiting self-narratives gently'
      ],
      warningFlags: [
        'Complete disengagement',
        'Self-deprecating language escalation',
        'Refusal to participate in solutions'
      ]
    },
    escalationThreshold: 0.8
  },

  TECHNICAL_PERFECTIONISM_STRESS: {
    patternId: 'perfectionism_stress',
    emotionalState: 'perfectionistic_anxiety',
    triggers: [
      'fear of making mistakes',
      'need for complete understanding',
      'anxiety about "doing it right"',
      'desire for optimal solutions'
    ],
    indicators: [
      {
        type: 'language',
        signal: 'what\'s the best way',
        weight: 0.6,
        description: 'Seeking optimal rather than functional solutions'
      },
      {
        type: 'language',
        signal: 'I want to understand everything',
        weight: 0.7,
        description: 'Need for comprehensive knowledge before action'
      },
      {
        type: 'language',
        signal: 'am I doing this the right way',
        weight: 0.8,
        description: 'Anxiety about method correctness'
      },
      {
        type: 'behavioral',
        signal: 'extensive research before simple actions',
        weight: 0.7,
        description: 'Over-preparation as anxiety management'
      },
      {
        type: 'behavioral',
        signal: 'repeated requests for confirmation',
        weight: 0.6,
        description: 'Seeking validation for perfectionist standards'
      }
    ],
    responseStrategy: {
      approachType: 'validation',
      languageAdjustments: [
        'Normalize "good enough" solutions',
        'Emphasize iterative improvement',
        'Celebrate functional outcomes',
        'Reframe mistakes as learning data'
      ],
      pacingChanges: [
        'Provide clear "good enough" criteria',
        'Set boundaries on research depth',
        'Encourage action over analysis',
        'Time-box decision making'
      ],
      supportActions: [
        'Explicitly define success criteria',
        'Provide permission to be imperfect',
        'Highlight benefits of rapid iteration',
        'Model confident decision-making'
      ],
      warningFlags: [
        'Analysis paralysis preventing action',
        'Increasing anxiety about imperfection',
        'Excessive research blocking progress'
      ]
    },
    escalationThreshold: 0.6
  },

  CRISIS_TECH_OVERWHELM: {
    patternId: 'crisis_overwhelm',
    emotionalState: 'crisis',
    triggers: [
      'technical issues during emotional crisis',
      'loss of access to support systems',
      'feeling trapped by technology',
      'cascading technical failures'
    ],
    indicators: [
      {
        type: 'language',
        signal: 'I can\'t handle this right now',
        weight: 0.9,
        description: 'Direct expression of overwhelm'
      },
      {
        type: 'language',
        signal: 'everything is falling apart',
        weight: 0.95,
        description: 'Catastrophic thinking patterns'
      },
      {
        type: 'language',
        signal: 'I just need this to work',
        weight: 0.8,
        description: 'Desperation and high stakes context'
      },
      {
        type: 'contextual',
        signal: 'urgent late-night support requests',
        weight: 0.7,
        description: 'Timing suggesting crisis context'
      },
      {
        type: 'behavioral',
        signal: 'rapid escalation to human support',
        weight: 0.8,
        description: 'Inability to engage with technical solutions'
      }
    ],
    responseStrategy: {
      approachType: 'crisis_intervention',
      languageAdjustments: [
        'Immediate emotional validation',
        'Clear crisis resource offering',
        'Gentle technical support continuation',
        'Trauma-informed language patterns'
      ],
      pacingChanges: [
        'Immediate human connection offer',
        'Simplified solution pathways',
        'Crisis resource prioritization',
        'Technical solution deferral if needed'
      ],
      supportActions: [
        'Provide immediate crisis resources',
        'Escalate to crisis-trained staff',
        'Ensure technical continuity with human support',
        'Follow up on both technical and emotional needs'
      ],
      warningFlags: [
        'Any mention of self-harm',
        'Complete breakdown of coping',
        'Isolation language patterns'
      ]
    },
    escalationThreshold: 0.3
  }
};

/**
 * Advanced emotional intelligence system for technical support
 */
export class TechSupportEmotionalIntelligence {
  private currentUserProfile: UserEmotionalProfile;
  private patternHistory: string[] = [];
  private alertThresholds: Record<string, number>;

  constructor() {
    this.currentUserProfile = this.initializeEmptyProfile();
    this.alertThresholds = {
      crisis: 0.3,
      escalation: 0.7,
      intervention: 0.8,
      emergency: 0.95
    };
  }

  private initializeEmptyProfile(): UserEmotionalProfile {
    return {
      currentSession: {
        emotionalTrajectory: [],
        stressLevel: 0,
        frustrationThreshold: 0.5,
        successfulCopingStrategies: [],
        triggeredPatterns: []
      },
      historicalPatterns: [],
      vulnerabilityIndicators: [],
      resilienceFactors: []
    };
  }

  /**
   * Comprehensive emotional assessment of user input
   */
  assessEmotionalState(userInput: string, context: {
    scenarioType: string;
    sessionDuration: number;
    previousAttempts: number;
    timeOfDay: number;
  }): EmotionalAssessment {
    const input = userInput.toLowerCase();
    const patterns = this.analyzeEmotionalPatterns(input, context);
    const vulnerabilities = this.assessVulnerabilities(input, patterns);
    const resilience = this.assessResilience(input, patterns);
    const crisisRisk = this.assessCrisisRisk(patterns, vulnerabilities);
    
    // Update user profile
    this.updateUserProfile(patterns, vulnerabilities, resilience);
    
    return {
      primaryEmotion: patterns[0]?.emotionalState || 'neutral',
      emotionalIntensity: this.calculateEmotionalIntensity(patterns),
      triggeredPatterns: patterns.map(p => p.patternId),
      vulnerabilityFlags: vulnerabilities,
      resilienceIndicators: resilience,
      crisisRisk: crisisRisk,
      recommendedApproach: this.determineOptimalApproach(patterns, vulnerabilities, resilience),
      interventionNeeded: crisisRisk >= this.alertThresholds.intervention,
      escalationRecommended: this.shouldEscalate(patterns, crisisRisk)
    };
  }

  private analyzeEmotionalPatterns(
    input: string, 
    context: any
  ): EmotionalPattern[] {
    const triggeredPatterns: Array<{pattern: EmotionalPattern, score: number}> = [];

    Object.values(EMOTIONAL_PATTERNS).forEach(pattern => {
      let score = 0;
      
      pattern.indicators.forEach(indicator => {
        if (indicator.type === 'language' && input.includes(indicator.signal)) {
          score += indicator.weight;
        } else if (indicator.type === 'contextual') {
          // Context-based scoring logic
          if (indicator.signal.includes('urgent') && context.timeOfDay > 22) {
            score += indicator.weight * 0.8;
          }
          if (indicator.signal.includes('repeated') && context.previousAttempts > 2) {
            score += indicator.weight * 0.9;
          }
        } else if (indicator.type === 'timing') {
          // Would need more sophisticated timing analysis in real implementation
          if (context.sessionDuration > 10 && indicator.signal.includes('long pause')) {
            score += indicator.weight * 0.6;
          }
        }
      });

      if (score > 0.3) {
        triggeredPatterns.push({pattern, score});
      }
    });

    return triggeredPatterns
      .sort((a, b) => b.score - a.score)
      .map(tp => tp.pattern);
  }

  private assessVulnerabilities(
    input: string, 
    patterns: EmotionalPattern[]
  ): VulnerabilityIndicator[] {
    const vulnerabilities: VulnerabilityIndicator[] = [];

    // Technical anxiety vulnerability
    if (patterns.some(p => p.patternId === 'technical_anxiety')) {
      vulnerabilities.push({
        type: 'technical_anxiety',
        strength: 0.8,
        context: 'High anxiety about technical actions and consequences',
        supportNeeds: ['extra reassurance', 'safety explanations', 'reversibility emphasis']
      });
    }

    // Learned helplessness vulnerability
    if (patterns.some(p => p.patternId === 'learned_helplessness')) {
      vulnerabilities.push({
        type: 'learned_helplessness',
        strength: 0.7,
        context: 'Pattern of expecting technical failure and avoiding agency',
        supportNeeds: ['empowerment language', 'capability building', 'success celebration']
      });
    }

    // Crisis state vulnerability
    if (patterns.some(p => p.patternId === 'crisis_overwhelm')) {
      vulnerabilities.push({
        type: 'crisis_state',
        strength: 0.9,
        context: 'Technical issues occurring during emotional crisis',
        supportNeeds: ['immediate human support', 'crisis resources', 'simplified solutions']
      });
    }

    return vulnerabilities;
  }

  private assessResilience(
    input: string, 
    patterns: EmotionalPattern[]
  ): ResilienceIndicator[] {
    const resilience: ResilienceIndicator[] = [];

    // Help-seeking resilience
    if (input.includes('help') || input.includes('support')) {
      resilience.push({
        type: 'help_seeking',
        strength: 0.8,
        evidence: ['actively seeking support', 'reaching out proactively'],
        leverage_opportunities: ['channel help-seeking into skill building', 'celebrate support-seeking behavior']
      });
    }

    // Persistence resilience
    if (input.includes('tried') || input.includes('attempt')) {
      resilience.push({
        type: 'persistence',
        strength: 0.7,
        evidence: ['continuing efforts despite challenges', 'multiple solution attempts'],
        leverage_opportunities: ['acknowledge persistence', 'build on existing effort', 'celebrate resilience']
      });
    }

    return resilience;
  }

  private assessCrisisRisk(
    patterns: EmotionalPattern[], 
    vulnerabilities: VulnerabilityIndicator[]
  ): number {
    let riskScore = 0;

    // High risk from crisis patterns
    if (patterns.some(p => p.patternId === 'crisis_overwhelm')) {
      riskScore += 0.8;
    }

    // Medium risk from vulnerability accumulation
    const vulnerabilityScore = vulnerabilities.reduce((sum, v) => sum + v.strength, 0);
    riskScore += Math.min(vulnerabilityScore / 3, 0.6);

    // Historical pattern influence
    const recentCrisisPatterns = this.patternHistory.slice(-5).filter(p => p.includes('crisis'));
    riskScore += recentCrisisPatterns.length * 0.1;

    return Math.min(riskScore, 1.0);
  }

  private calculateEmotionalIntensity(patterns: EmotionalPattern[]): number {
    if (patterns.length === 0) return 0;
    
    const intensityMap = {
      'anxious': 0.7,
      'frustrated': 0.6,
      'overwhelmed': 0.8,
      'defeated': 0.9,
      'crisis': 1.0,
      'neutral': 0.1
    };

    const primaryIntensity = intensityMap[patterns[0].emotionalState] || 0.5;
    const secondaryBoost = patterns.length > 1 ? 0.2 : 0;
    
    return Math.min(primaryIntensity + secondaryBoost, 1.0);
  }

  private determineOptimalApproach(
    patterns: EmotionalPattern[],
    vulnerabilities: VulnerabilityIndicator[],
    resilience: ResilienceIndicator[]
  ): ResponseStrategy {
    // Crisis intervention takes precedence
    if (patterns.some(p => p.patternId === 'crisis_overwhelm')) {
      return EMOTIONAL_PATTERNS.crisis_overwhelm.responseStrategy;
    }

    // High anxiety requires validation approach
    if (patterns.some(p => p.patternId === 'technical_anxiety')) {
      return EMOTIONAL_PATTERNS.technical_anxiety.responseStrategy;
    }

    // Learned helplessness needs empowerment
    if (patterns.some(p => p.patternId === 'learned_helplessness')) {
      return EMOTIONAL_PATTERNS.learned_helplessness.responseStrategy;
    }

    // Default to validation for any detected emotional pattern
    if (patterns.length > 0) {
      return patterns[0].responseStrategy;
    }

    // Neutral/empowerment approach for resilient users
    return {
      approachType: 'empowerment',
      languageAdjustments: ['collaborative language', 'capability focus'],
      pacingChanges: ['standard pacing', 'efficiency focus'],
      supportActions: ['skill building', 'independence encouragement'],
      warningFlags: ['unexpected emotional shift']
    };
  }

  private shouldEscalate(patterns: EmotionalPattern[], crisisRisk: number): boolean {
    // Immediate escalation for crisis
    if (crisisRisk >= this.alertThresholds.crisis) {
      return true;
    }

    // Escalate if multiple high-intensity patterns
    if (patterns.length > 2 && this.calculateEmotionalIntensity(patterns) > 0.7) {
      return true;
    }

    // Escalate if user explicitly requests human help
    return false; // Would need user input analysis for this
  }

  private updateUserProfile(
    patterns: EmotionalPattern[],
    vulnerabilities: VulnerabilityIndicator[],
    resilience: ResilienceIndicator[]
  ): void {
    this.currentUserProfile.currentSession.triggeredPatterns = patterns.map(p => p.patternId);
    this.currentUserProfile.vulnerabilityIndicators = vulnerabilities;
    this.currentUserProfile.resilienceFactors = resilience;
    
    // Update pattern history
    this.patternHistory.push(...patterns.map(p => p.patternId));
    if (this.patternHistory.length > 20) {
      this.patternHistory = this.patternHistory.slice(-20);
    }
  }

  /**
   * Generate emotional intelligence insights for support staff
   */
  generateSupportInsights(): TechSupportInsights {
    return {
      userEmotionalProfile: this.currentUserProfile,
      riskAssessment: this.generateRiskAssessment(),
      recommendedInterventions: this.generateInterventionRecommendations(),
      escalationGuidance: this.generateEscalationGuidance(),
      successStrategies: this.identifySuccessStrategies()
    };
  }

  private generateRiskAssessment(): RiskAssessment {
    const recentPatterns = this.patternHistory.slice(-5);
    const crisisPatterns = recentPatterns.filter(p => p.includes('crisis')).length;
    const vulnerabilityCount = this.currentUserProfile.vulnerabilityIndicators.length;
    
    return {
      overallRiskLevel: this.calculateOverallRisk(crisisPatterns, vulnerabilityCount),
      specificRisks: this.currentUserProfile.vulnerabilityIndicators.map(v => v.type),
      protectiveFactors: this.currentUserProfile.resilienceFactors.map(r => r.type),
      monitoring_recommendations: this.generateMonitoringRecommendations()
    };
  }

  private calculateOverallRisk(crisisPatterns: number, vulnerabilityCount: number): string {
    const riskScore = (crisisPatterns * 0.4) + (vulnerabilityCount * 0.2);
    
    if (riskScore >= 0.8) return 'high';
    if (riskScore >= 0.5) return 'moderate';
    if (riskScore >= 0.2) return 'low';
    return 'minimal';
  }

  private generateMonitoringRecommendations(): string[] {
    const recommendations = [];
    
    if (this.currentUserProfile.vulnerabilityIndicators.some(v => v.type === 'crisis_state')) {
      recommendations.push('Monitor for escalating crisis language');
      recommendations.push('Prepare crisis resources and escalation protocols');
    }
    
    if (this.currentUserProfile.vulnerabilityIndicators.some(v => v.type === 'technical_anxiety')) {
      recommendations.push('Watch for increasing hesitation or paralysis');
      recommendations.push('Provide extra reassurance and safety messaging');
    }
    
    return recommendations;
  }

  private generateInterventionRecommendations(): string[] {
    const interventions = [];
    
    this.currentUserProfile.vulnerabilityIndicators.forEach(vulnerability => {
      interventions.push(...vulnerability.supportNeeds);
    });
    
    return [...new Set(interventions)]; // Remove duplicates
  }

  private generateEscalationGuidance(): EscalationGuidance {
    const crisisRisk = this.assessCrisisRisk(
      Object.values(EMOTIONAL_PATTERNS).filter(p => 
        this.currentUserProfile.currentSession.triggeredPatterns.includes(p.patternId)
      ),
      this.currentUserProfile.vulnerabilityIndicators
    );

    return {
      immediateEscalation: crisisRisk >= this.alertThresholds.emergency,
      escalationRecommended: crisisRisk >= this.alertThresholds.escalation,
      escalationReasons: this.identifyEscalationReasons(),
      handoffNotes: this.generateHandoffNotes(),
      continuityInstructions: this.generateContinuityInstructions()
    };
  }

  private identifyEscalationReasons(): string[] {
    const reasons = [];
    
    if (this.currentUserProfile.vulnerabilityIndicators.some(v => v.type === 'crisis_state')) {
      reasons.push('Crisis state detected - user experiencing emotional overwhelm beyond technical issues');
    }
    
    if (this.patternHistory.filter(p => p.includes('crisis')).length > 2) {
      reasons.push('Pattern of crisis responses - indicates systemic emotional distress');
    }
    
    return reasons;
  }

  private generateHandoffNotes(): string {
    const patterns = this.currentUserProfile.currentSession.triggeredPatterns;
    const vulnerabilities = this.currentUserProfile.vulnerabilityIndicators.map(v => v.type);
    const resilience = this.currentUserProfile.resilienceFactors.map(r => r.type);
    
    return `User emotional profile: Patterns: ${patterns.join(', ')}. Vulnerabilities: ${vulnerabilities.join(', ')}. Strengths: ${resilience.join(', ')}. Requires trauma-informed approach with emphasis on safety and validation.`;
  }

  private generateContinuityInstructions(): string[] {
    return [
      'Maintain trauma-informed language patterns established in chat',
      'Continue emphasizing user agency and capability',
      'Reference specific resilience factors identified in session',
      'Monitor for escalation of identified vulnerability patterns',
      'Celebrate progress and acknowledge emotional courage shown'
    ];
  }

  private identifySuccessStrategies(): string[] {
    const strategies = [];
    
    this.currentUserProfile.resilienceFactors.forEach(factor => {
      strategies.push(...factor.leverage_opportunities);
    });
    
    return [...new Set(strategies)]; // Remove duplicates
  }
}

/**
 * Supporting interfaces for emotional intelligence system
 */
export interface EmotionalAssessment {
  primaryEmotion: string;
  emotionalIntensity: number;
  triggeredPatterns: string[];
  vulnerabilityFlags: VulnerabilityIndicator[];
  resilienceIndicators: ResilienceIndicator[];
  crisisRisk: number;
  recommendedApproach: ResponseStrategy;
  interventionNeeded: boolean;
  escalationRecommended: boolean;
}

export interface TechSupportInsights {
  userEmotionalProfile: UserEmotionalProfile;
  riskAssessment: RiskAssessment;
  recommendedInterventions: string[];
  escalationGuidance: EscalationGuidance;
  successStrategies: string[];
}

export interface RiskAssessment {
  overallRiskLevel: string;
  specificRisks: string[];
  protectiveFactors: string[];
  monitoring_recommendations: string[];
}

export interface EscalationGuidance {
  immediateEscalation: boolean;
  escalationRecommended: boolean;
  escalationReasons: string[];
  handoffNotes: string;
  continuityInstructions: string[];
}

export default TechSupportEmotionalIntelligence;