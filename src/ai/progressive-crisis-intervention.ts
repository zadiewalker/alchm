/**
 * Progressive Crisis Intervention System
 * 
 * Graduated response framework that escalates support from:
 * 1. Self-care and grounding techniques
 * 2. Peer and community support activation
 * 3. Professional crisis counseling
 * 4. Emergency intervention services
 * 
 * Maintains user agency while ensuring safety through trauma-informed escalation
 */

import { CrisisPattern } from './advanced-crisis-pattern-recognition';
import { ContextualAssessment, UserContext } from './contextual-crisis-assessment';
import { KheperaCrisisResponse } from './khepera-crisis-response-system';

interface InterventionLevel {
  level: 1 | 2 | 3 | 4;
  name: 'self_care' | 'peer_support' | 'professional_support' | 'emergency_intervention';
  description: string;
  interventions: Intervention[];
  escalationTriggers: string[];
  timeframe: string;
  userChoice: boolean;
}

interface Intervention {
  type: 'technique' | 'resource' | 'contact' | 'action';
  name: string;
  description: string;
  instructions?: string;
  culturalAdaptation?: string[];
  traumaConsiderations?: string[];
  effectivenessRating: number; // 0-1
  timeToImplement: 'immediate' | 'short' | 'ongoing';
  accessibilityRequirements?: string[];
}

interface InterventionProgress {
  level: number;
  interventionsTried: string[];
  effectiveness: Map<string, number>;
  userFeedback: Map<string, 'helpful' | 'not_helpful' | 'harmful'>;
  escalationReasons: string[];
  timeSpent: number; // minutes
  safetyStatus: 'stable' | 'improving' | 'declining' | 'critical';
}

interface EscalationDecision {
  shouldEscalate: boolean;
  reason: string;
  recommendedLevel: number;
  urgency: 'low' | 'moderate' | 'high' | 'immediate';
  userConsent: 'required' | 'recommended' | 'override_needed';
  additionalSupport: string[];
}

class ProgressiveCrisisIntervention {
  private interventionLevels: Map<number, InterventionLevel> = new Map();
  private culturalAdaptations: Map<string, string[]> = new Map();
  private traumaAdaptations: Map<string, string[]> = new Map();

  constructor() {
    this.initializeInterventionLevels();
    this.initializeCulturalAdaptations();
    this.initializeTraumaAdaptations();
  }

  private initializeInterventionLevels(): void {
    // Level 1: Self-Care and Grounding
    this.interventionLevels.set(1, {
      level: 1,
      name: 'self_care',
      description: 'Self-guided techniques for immediate stabilization',
      timeframe: 'Immediate to 30 minutes',
      userChoice: true,
      escalationTriggers: [
        'Techniques not providing relief after 30 minutes',
        'Symptoms worsening',
        'Unable to implement techniques',
        'Expressing immediate danger'
      ],
      interventions: [
        {
          type: 'technique',
          name: '5-4-3-2-1 Grounding',
          description: 'Sensory grounding technique to connect with present moment',
          instructions: '5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste',
          effectivenessRating: 0.8,
          timeToImplement: 'immediate',
          traumaConsiderations: ['May trigger hypervigilance', 'Start with external senses only']
        },
        {
          type: 'technique',
          name: 'Box Breathing',
          description: 'Regulated breathing for nervous system calming',
          instructions: 'Breathe in 4, hold 4, out 4, hold 4. Repeat 5-10 cycles',
          effectivenessRating: 0.7,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Avoid if breathing triggers trauma memories']
        },
        {
          type: 'technique',
          name: 'Safe Place Visualization',
          description: 'Mental imagery of safe, comforting environment',
          instructions: 'Imagine a place where you feel completely safe and peaceful',
          effectivenessRating: 0.6,
          timeToImplement: 'short',
          traumaConsiderations: ['Some may not have safe place memories', 'Can create imaginary space']
        },
        {
          type: 'action',
          name: 'Physical Movement',
          description: 'Gentle movement to discharge stress energy',
          instructions: 'Walking, stretching, dancing - whatever feels good',
          effectivenessRating: 0.7,
          timeToImplement: 'immediate',
          accessibilityRequirements: ['Adapted for mobility limitations']
        },
        {
          type: 'technique',
          name: 'Temperature Regulation',
          description: 'Using temperature to activate calming response',
          instructions: 'Cold water on face/wrists, warm shower, ice cubes',
          effectivenessRating: 0.6,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Check for water-related trauma first']
        }
      ]
    });

    // Level 2: Peer and Community Support
    this.interventionLevels.set(2, {
      level: 2,
      name: 'peer_support',
      description: 'Activating social support network and peer resources',
      timeframe: '30 minutes to 2 hours',
      userChoice: true,
      escalationTriggers: [
        'Support persons unavailable',
        'Support not sufficient for current crisis level',
        'Isolation increasing despite outreach',
        'Safety concerns arising'
      ],
      interventions: [
        {
          type: 'contact',
          name: 'Trusted Friend/Family',
          description: 'Reach out to predetermined support person',
          instructions: 'Call, text, or visit someone who makes you feel safe',
          effectivenessRating: 0.8,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Ensure person is trauma-informed', 'Have backup contacts']
        },
        {
          type: 'resource',
          name: 'Crisis Text Line',
          description: 'Peer support through trained crisis counselors',
          instructions: 'Text HOME to 741741 for immediate support',
          effectivenessRating: 0.9,
          timeToImplement: 'immediate'
        },
        {
          type: 'resource',
          name: 'Online Support Community',
          description: 'Connect with others who understand your experience',
          instructions: 'Access moderated crisis support forums or chat rooms',
          effectivenessRating: 0.6,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Ensure moderated spaces only', 'Avoid triggering content']
        },
        {
          type: 'action',
          name: 'Community Space Visit',
          description: 'Go to safe public space with supportive energy',
          instructions: 'Library, coffee shop, spiritual center, park',
          effectivenessRating: 0.5,
          timeToImplement: 'short',
          accessibilityRequirements: ['Transportation needed', 'Safe mobility considerations']
        },
        {
          type: 'contact',
          name: 'Spiritual/Religious Leader',
          description: 'Connect with faith community support',
          instructions: 'Call pastor, rabbi, imam, spiritual advisor',
          effectivenessRating: 0.7,
          timeToImplement: 'immediate',
          culturalAdaptation: ['Varies by faith tradition', 'May need cultural mediator']
        }
      ]
    });

    // Level 3: Professional Crisis Support
    this.interventionLevels.set(3, {
      level: 3,
      name: 'professional_support',
      description: 'Professional crisis counseling and mental health intervention',
      timeframe: 'Immediate to 24 hours',
      userChoice: true,
      escalationTriggers: [
        'Professional unavailable',
        'Crisis intensifying despite professional support',
        'Immediate safety risk identified',
        'Means of harm accessible and intent expressed'
      ],
      interventions: [
        {
          type: 'contact',
          name: '988 Suicide & Crisis Lifeline',
          description: 'National crisis hotline with trained counselors',
          instructions: 'Call or text 988 for immediate professional support',
          effectivenessRating: 0.9,
          timeToImplement: 'immediate',
          culturalAdaptation: ['Available in Spanish', 'LGBTQ+ specific training available']
        },
        {
          type: 'contact',
          name: 'Crisis Mobile Response',
          description: 'Mental health professionals come to your location',
          instructions: 'Available in many areas - call local mental health department',
          effectivenessRating: 0.8,
          timeToImplement: 'short',
          traumaConsiderations: ['Less threatening than police', 'Can de-escalate in familiar environment']
        },
        {
          type: 'contact',
          name: 'Emergency Therapy Session',
          description: 'Same-day appointment with mental health professional',
          instructions: 'Call existing therapist emergency line or crisis clinic',
          effectivenessRating: 0.8,
          timeToImplement: 'short',
          accessibilityRequirements: ['Insurance/payment considerations', 'Transportation needed']
        },
        {
          type: 'resource',
          name: 'Crisis Stabilization Unit',
          description: 'Short-term residential crisis support (voluntary)',
          instructions: 'Alternative to hospital with peer support model',
          effectivenessRating: 0.7,
          timeToImplement: 'short',
          traumaConsiderations: ['Less institutional than hospital', 'Maintains more autonomy']
        },
        {
          type: 'action',
          name: 'Safety Planning Session',
          description: 'Work with professional to create detailed safety plan',
          instructions: 'Collaborative planning for future crisis prevention',
          effectivenessRating: 0.8,
          timeToImplement: 'ongoing',
          traumaConsiderations: ['User maintains control', 'Builds on existing strengths']
        }
      ]
    });

    // Level 4: Emergency Intervention
    this.interventionLevels.set(4, {
      level: 4,
      name: 'emergency_intervention',
      description: 'Immediate safety intervention when life is in imminent danger',
      timeframe: 'Immediate',
      userChoice: false,
      escalationTriggers: [],
      interventions: [
        {
          type: 'contact',
          name: 'Emergency Services (911)',
          description: 'Immediate emergency response for life-threatening situations',
          instructions: 'Call 911 - specify mental health crisis for better response',
          effectivenessRating: 0.9,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Can be traumatic', 'Request CIT-trained officers if available']
        },
        {
          type: 'action',
          name: 'Emergency Room',
          description: 'Hospital emergency department for crisis stabilization',
          instructions: 'Go to ER or call ambulance for immediate medical evaluation',
          effectivenessRating: 0.8,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Can be retraumatizing', 'Advocate for trauma-informed care']
        },
        {
          type: 'action',
          name: 'Involuntary Hold Assessment',
          description: 'Evaluation for temporary psychiatric hold for safety',
          instructions: 'Professional assessment for need for involuntary treatment',
          effectivenessRating: 0.6,
          timeToImplement: 'immediate',
          traumaConsiderations: ['Loss of autonomy traumatic', 'Last resort only']
        }
      ]
    });
  }

  private initializeCulturalAdaptations(): void {
    this.culturalAdaptations.set('indigenous', [
      'Include traditional healing practices',
      'Connect with tribal elders or cultural healers',
      'Consider land-based healing activities',
      'Respect for traditional crisis intervention methods'
    ]);

    this.culturalAdaptations.set('latino', [
      'Include family in support when appropriate',
      'Consider religious/spiritual elements (santos, prayer)',
      'Respect for familismo and community support',
      'Language considerations (Spanish-speaking providers)'
    ]);

    this.culturalAdaptations.set('asian', [
      'Respect for saving face and family honor',
      'Consider meditation or mindfulness practices',
      'Address shame and stigma concerns',
      'Include family patriarch/matriarch if appropriate'
    ]);

    this.culturalAdaptations.set('black', [
      'Address historical medical trauma',
      'Connect with Black mental health professionals when available',
      'Include church or community support',
      'Acknowledge systemic stressors and racism impact'
    ]);

    this.culturalAdaptations.set('middle_eastern', [
      'Consider religious practices (prayer, Quran reading)',
      'Respect for family involvement in decisions',
      'Address potential immigration or discrimination stressors',
      'Gender considerations for provider matching'
    ]);
  }

  private initializeTraumaAdaptations(): void {
    this.traumaAdaptations.set('childhood_trauma', [
      'Ensure user maintains control and choice',
      'Use non-parental language and approaches',
      'Be aware of authority figure triggers',
      'Focus on current adult strengths and resources'
    ]);

    this.traumaAdaptations.set('sexual_trauma', [
      'Respect personal space and boundaries',
      'Avoid touch without explicit permission',
      'Be sensitive to gender of support providers',
      'Address safety and control issues'
    ]);

    this.traumaAdaptations.set('domestic_violence', [
      'Assess for ongoing safety concerns',
      'Understand trauma bonding and conflicted feelings',
      'Avoid pressuring to leave relationship',
      'Connect with DV-specific resources'
    ]);

    this.traumaAdaptations.set('war_trauma', [
      'Be aware of hypervigilance and startle responses',
      'Avoid sudden movements or loud noises',
      'Understand survivor guilt and moral injury',
      'Connect with veteran-specific resources if applicable'
    ]);

    this.traumaAdaptations.set('medical_trauma', [
      'Be sensitive to medical language and settings',
      'Respect medical anxiety and avoidance',
      'Acknowledge medical system failures',
      'Focus on non-medical support options when possible'
    ]);
  }

  /**
   * Main intervention orchestration method
   */
  async orchestrateIntervention(
    assessment: ContextualAssessment,
    userContext: UserContext,
    patterns: CrisisPattern[]
  ): Promise<{
    currentLevel: InterventionLevel;
    recommendedInterventions: Intervention[];
    escalationPlan: EscalationDecision;
    culturalAdaptations: string[];
    traumaConsiderations: string[];
  }> {
    
    const startingLevel = this.determineStartingLevel(assessment, patterns);
    const currentLevel = this.interventionLevels.get(startingLevel)!;
    
    const recommendedInterventions = this.selectInterventions(
      currentLevel,
      userContext,
      assessment
    );
    
    const escalationPlan = this.createEscalationPlan(
      assessment,
      userContext,
      startingLevel
    );
    
    const culturalAdaptations = this.getCulturalAdaptations(userContext);
    const traumaConsiderations = this.getTraumaConsiderations(userContext);
    
    return {
      currentLevel,
      recommendedInterventions,
      escalationPlan,
      culturalAdaptations,
      traumaConsiderations
    };
  }

  private determineStartingLevel(
    assessment: ContextualAssessment,
    patterns: CrisisPattern[]
  ): number {
    // Immediate emergency level triggers
    if (assessment.immediateSafetyNeeds) {
      return 4;
    }
    
    // Critical/high risk starts at professional level
    if (assessment.overallRiskLevel === 'critical') {
      return 3;
    }
    
    // High risk patterns
    const hasDirectSuicidalPatterns = patterns.some(p => 
      p.type === 'direct' && p.severity === 'critical'
    );
    
    if (hasDirectSuicidalPatterns || assessment.overallRiskLevel === 'high') {
      return 3;
    }
    
    // Moderate risk can often start with peer support
    if (assessment.overallRiskLevel === 'moderate') {
      return 2;
    }
    
    // Low risk starts with self-care
    return 1;
  }

  private selectInterventions(
    level: InterventionLevel,
    userContext: UserContext,
    assessment: ContextualAssessment
  ): Intervention[] {
    let selectedInterventions = [...level.interventions];
    
    // Filter based on accessibility
    selectedInterventions = selectedInterventions.filter(intervention => {
      if (intervention.accessibilityRequirements) {
        // Check if user can access this intervention
        return this.checkAccessibility(intervention, userContext);
      }
      return true;
    });
    
    // Prioritize by effectiveness and user context
    selectedInterventions.sort((a, b) => {
      let scoreA = a.effectivenessRating;
      let scoreB = b.effectivenessRating;
      
      // Boost score for interventions matching user's coping strategies
      if (userContext.copingStrategies.healthy.includes(a.name)) {
        scoreA += 0.2;
      }
      if (userContext.copingStrategies.healthy.includes(b.name)) {
        scoreB += 0.2;
      }
      
      return scoreB - scoreA;
    });
    
    // Return top 3-5 interventions to avoid overwhelming
    return selectedInterventions.slice(0, Math.min(5, selectedInterventions.length));
  }

  private checkAccessibility(intervention: Intervention, userContext: UserContext): boolean {
    if (!intervention.accessibilityRequirements) return true;
    
    // Basic accessibility checks
    for (const requirement of intervention.accessibilityRequirements) {
      switch (requirement) {
        case 'Transportation needed':
          // Could check if user has transportation access
          // For now, assume accessible
          break;
        case 'Insurance/payment considerations':
          // Could check user's insurance status
          // For now, include with note
          break;
        default:
          break;
      }
    }
    
    return true; // Default to accessible
  }

  private createEscalationPlan(
    assessment: ContextualAssessment,
    userContext: UserContext,
    currentLevel: number
  ): EscalationDecision {
    
    if (currentLevel >= 4) {
      return {
        shouldEscalate: false,
        reason: 'Already at highest intervention level',
        recommendedLevel: 4,
        urgency: 'immediate',
        userConsent: 'override_needed',
        additionalSupport: []
      };
    }
    
    // Determine escalation triggers for current situation
    const escalationReasons: string[] = [];
    let urgency: 'low' | 'moderate' | 'high' | 'immediate' = 'low';
    let userConsent: 'required' | 'recommended' | 'override_needed' = 'required';
    
    if (assessment.overallRiskLevel === 'critical') {
      escalationReasons.push('Critical risk level assessment');
      urgency = 'high';
      userConsent = 'recommended';
    }
    
    if (assessment.immediateSafetyNeeds) {
      escalationReasons.push('Immediate safety concerns identified');
      urgency = 'immediate';
      userConsent = 'override_needed';
    }
    
    if (userContext.socialContext.supportSystemStrength === 'isolated' && currentLevel === 2) {
      escalationReasons.push('Limited social support available');
      urgency = 'moderate';
    }
    
    const shouldEscalate = escalationReasons.length > 0;
    const recommendedLevel = shouldEscalate ? Math.min(currentLevel + 1, 4) : currentLevel;
    
    return {
      shouldEscalate,
      reason: escalationReasons.join('; '),
      recommendedLevel,
      urgency,
      userConsent,
      additionalSupport: this.getAdditionalSupport(assessment, userContext)
    };
  }

  private getAdditionalSupport(assessment: ContextualAssessment, userContext: UserContext): string[] {
    const support: string[] = [];
    
    // Cultural support
    if (userContext.demographics.culturalBackground.length > 0) {
      support.push('Culturally responsive crisis counselor');
    }
    
    // Identity-specific support
    if (userContext.demographics.identityFactors.includes('lgbtq')) {
      support.push('LGBTQ+ affirming crisis support');
    }
    
    // Trauma-specific support
    if (userContext.mentalHealthHistory.traumaHistory) {
      support.push('Trauma-informed crisis intervention');
    }
    
    // Language support
    const needsTranslation = !userContext.demographics.languagePreferences.includes('english');
    if (needsTranslation) {
      support.push('Interpreter or native language counselor');
    }
    
    return support;
  }

  private getCulturalAdaptations(userContext: UserContext): string[] {
    const adaptations: string[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      const cultureAdaptations = this.culturalAdaptations.get(culture.toLowerCase());
      if (cultureAdaptations) {
        adaptations.push(...cultureAdaptations);
      }
    });
    
    return adaptations;
  }

  private getTraumaConsiderations(userContext: UserContext): string[] {
    const considerations: string[] = [];
    
    if (userContext.mentalHealthHistory.traumaHistory) {
      userContext.mentalHealthHistory.traumaHistory.types.forEach(traumaType => {
        const traumaConsiderations = this.traumaAdaptations.get(traumaType);
        if (traumaConsiderations) {
          considerations.push(...traumaConsiderations);
        }
      });
    }
    
    // General trauma-informed principles
    considerations.push('Prioritize safety and trustworthiness');
    considerations.push('Ensure user choice and control');
    considerations.push('Build collaboration and mutuality');
    considerations.push('Focus on empowerment and user voice');
    considerations.push('Address cultural, historical, and gender issues');
    
    return [...new Set(considerations)]; // Remove duplicates
  }

  /**
   * Monitors intervention progress and determines if escalation is needed
   */
  monitorInterventionProgress(
    progress: InterventionProgress,
    timeElapsed: number
  ): EscalationDecision {
    
    let shouldEscalate = false;
    let reason = '';
    let urgency: 'low' | 'moderate' | 'high' | 'immediate' = 'low';
    
    // Safety status deteriorating
    if (progress.safetyStatus === 'declining' || progress.safetyStatus === 'critical') {
      shouldEscalate = true;
      reason = 'Safety status deteriorating';
      urgency = progress.safetyStatus === 'critical' ? 'immediate' : 'high';
    }
    
    // Interventions not effective
    const ineffectiveInterventions = Array.from(progress.effectiveness.entries())
      .filter(([_, effectiveness]) => effectiveness < 0.3).length;
    
    if (ineffectiveInterventions >= 2 && timeElapsed > 30) {
      shouldEscalate = true;
      reason = 'Multiple interventions ineffective';
      urgency = 'moderate';
    }
    
    // Time-based escalation
    const currentLevel = progress.level;
    const maxTimeAtLevel = this.getMaxTimeAtLevel(currentLevel);
    
    if (timeElapsed > maxTimeAtLevel && progress.safetyStatus !== 'improving') {
      shouldEscalate = true;
      reason = 'Time limit reached without improvement';
      urgency = 'moderate';
    }
    
    // User feedback indicating harm
    const harmfulFeedback = Array.from(progress.userFeedback.values())
      .filter(feedback => feedback === 'harmful').length;
    
    if (harmfulFeedback > 0) {
      shouldEscalate = true;
      reason = 'User indicating interventions are harmful';
      urgency = 'high';
    }
    
    return {
      shouldEscalate,
      reason,
      recommendedLevel: shouldEscalate ? Math.min(currentLevel + 1, 4) : currentLevel,
      urgency,
      userConsent: urgency === 'immediate' ? 'override_needed' : 'recommended',
      additionalSupport: []
    };
  }

  private getMaxTimeAtLevel(level: number): number {
    switch (level) {
      case 1: return 30; // 30 minutes for self-care
      case 2: return 120; // 2 hours for peer support
      case 3: return 1440; // 24 hours for professional support
      case 4: return 0; // No time limit for emergency
      default: return 60;
    }
  }

  /**
   * Generates user-friendly intervention guidance
   */
  generateInterventionGuidance(
    level: InterventionLevel,
    interventions: Intervention[],
    culturalAdaptations: string[],
    traumaConsiderations: string[]
  ): {
    title: string;
    description: string;
    steps: string[];
    adaptations: string[];
    warnings: string[];
    nextSteps: string[];
  } {
    
    const title = this.getLevelTitle(level.name);
    const description = level.description;
    
    const steps = interventions.map((intervention, index) => 
      `${index + 1}. ${intervention.name}: ${intervention.description}${
        intervention.instructions ? ` - ${intervention.instructions}` : ''
      }`
    );
    
    const adaptations = culturalAdaptations.length > 0 
      ? [`Cultural considerations: ${culturalAdaptations.join(', ')}`]
      : [];
    
    const warnings = traumaConsiderations.length > 0
      ? [`Trauma considerations: ${traumaConsiderations.join(', ')}`]
      : [];
    
    const nextSteps = [
      `Try these techniques for ${level.timeframe.toLowerCase()}`,
      'If you don\'t feel better or feel worse, we can explore additional support',
      'You maintain control of your support choices',
      'Professional help is available whenever you\'re ready'
    ];
    
    return {
      title,
      description,
      steps,
      adaptations,
      warnings,
      nextSteps
    };
  }

  private getLevelTitle(levelName: string): string {
    switch (levelName) {
      case 'self_care': return 'Self-Care and Grounding Techniques';
      case 'peer_support': return 'Peer and Community Support';
      case 'professional_support': return 'Professional Crisis Support';
      case 'emergency_intervention': return 'Emergency Intervention';
      default: return 'Crisis Support';
    }
  }

  /**
   * Tracks intervention outcomes for system learning
   */
  recordInterventionOutcome(
    intervention: Intervention,
    userFeedback: 'helpful' | 'not_helpful' | 'harmful',
    effectiveness: number,
    userContext: UserContext
  ): void {
    // In a real system, this would update ML models and effectiveness ratings
    // For now, we'll just log the learning
    console.log(`Intervention outcome recorded: ${intervention.name} - ${userFeedback} (${effectiveness})`);
    
    // Could implement adaptive learning here:
    // - Update intervention effectiveness ratings
    // - Learn cultural and trauma-specific adaptations
    // - Adjust escalation triggers based on outcomes
  }
}

export default ProgressiveCrisisIntervention;
export type { 
  InterventionLevel, 
  Intervention, 
  InterventionProgress, 
  EscalationDecision 
};