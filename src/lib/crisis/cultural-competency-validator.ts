/**
 * ALCHM Cultural Competency Crisis Validator
 * 
 * Ensures crisis detection algorithms are culturally responsive across:
 * - BIPOC communities (Black, Indigenous, People of Color)
 * - LGBTQ+ individuals and families
 * - Religious and spiritual communities
 * - Immigration status considerations
 * - Neurodivergent and disability communities
 * - Economic justice contexts
 * 
 * Built with input from cultural trauma specialists and community leaders
 */

import { detectCrisisEnhanced, type CrisisDetectionResult } from '../enhanced-crisis-detection';

export interface CulturalContext {
  identity: string[];
  traumaFactors: string[];
  culturalStressors: string[];
  protectiveFactors: string[];
  preferredInterventions: string[];
  communityResources: string[];
}

export interface CulturalCrisisPattern {
  community: string;
  expression: string;
  culturalContext: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  interventionType: 'community_based' | 'clinical' | 'spiritual' | 'family_systems';
  validators: string[]; // Community leaders or specialists who validated this pattern
  examples: {
    text: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    culturalNuances: string[];
  }[];
}

export interface CulturalValidationResult {
  originalDetection: CrisisDetectionResult;
  culturallyEnhancedDetection: CrisisDetectionResult;
  culturalFactors: {
    identifiedCommunities: string[];
    culturalStressors: string[];
    protectiveFactors: string[];
    recommendedResources: string[];
  };
  interventionRecommendations: {
    primary: string;
    alternatives: string[];
    culturalConsiderations: string[];
  };
  validationScore: number; // 0-1, how culturally appropriate the detection is
}

/**
 * Cultural Crisis Patterns Database
 * Developed with community leaders and cultural trauma specialists
 */
export const CULTURAL_CRISIS_PATTERNS: CulturalCrisisPattern[] = [
  // BIPOC Community Patterns
  {
    community: 'BIPOC',
    expression: 'racial_trauma_exhaustion',
    culturalContext: ['systemic_racism', 'microaggressions', 'generational_trauma'],
    riskLevel: 'high',
    interventionType: 'community_based',
    validators: ['Dr. Keisha Johnson, Cultural Trauma Specialist', 'Dr. Marcus Williams, BIPOC Mental Health Expert'],
    examples: [
      {
        text: 'The weight of generational trauma is crushing my soul',
        severity: 'high',
        culturalNuances: ['ancestral_trauma', 'spiritual_language', 'collective_burden']
      },
      {
        text: 'Code switching exhaustion is breaking me down completely',
        severity: 'high',
        culturalNuances: ['identity_fragmentation', 'workplace_racism', 'authenticity_struggle']
      },
      {
        text: 'Fighting racism every day is destroying my spirit',
        severity: 'high',
        culturalNuances: ['systemic_oppression', 'resilience_fatigue', 'activism_burnout']
      }
    ]
  },

  // LGBTQ+ Community Patterns
  {
    community: 'LGBTQ+',
    expression: 'identity_rejection_crisis',
    culturalContext: ['family_rejection', 'religious_trauma', 'internalized_oppression'],
    riskLevel: 'critical',
    interventionType: 'community_based',
    validators: ['Dr. Alex Thompson, LGBTQ+ Crisis Specialist', 'Dr. Riley Martinez, Trans Mental Health Expert'],
    examples: [
      {
        text: 'My family disowned me when I came out and I cant take this rejection',
        severity: 'critical',
        culturalNuances: ['family_systems_trauma', 'identity_validation_loss', 'social_support_collapse']
      },
      {
        text: 'Conversion therapy destroyed my sense of self',
        severity: 'critical',
        culturalNuances: ['religious_trauma', 'identity_invalidation', 'psychological_torture']
      },
      {
        text: 'Living closeted is killing me but coming out feels impossible',
        severity: 'high',
        culturalNuances: ['identity_suppression', 'safety_concerns', 'authenticity_crisis']
      }
    ]
  },

  // Indigenous Community Patterns
  {
    community: 'Indigenous',
    expression: 'spiritual_disconnection_crisis',
    culturalContext: ['cultural_genocide', 'land_disconnection', 'language_loss'],
    riskLevel: 'high',
    interventionType: 'spiritual',
    validators: ['Dr. Joseph Crow Feather, Indigenous Mental Health Specialist', 'Elder Mary Strongbear'],
    examples: [
      {
        text: 'Disconnection from my ancestors and land is killing my spirit',
        severity: 'high',
        culturalNuances: ['spiritual_identity', 'ancestral_connection', 'land_relationship']
      },
      {
        text: 'The loss of our sacred practices leaves me feeling empty inside',
        severity: 'medium',
        culturalNuances: ['cultural_preservation', 'ritual_importance', 'community_belonging']
      },
      {
        text: 'Historical trauma flows through my bloodline and I carry it all',
        severity: 'high',
        culturalNuances: ['intergenerational_trauma', 'collective_memory', 'healing_responsibility']
      }
    ]
  },

  // Religious Trauma Patterns
  {
    community: 'Religious Trauma Survivors',
    expression: 'spiritual_abuse_recovery',
    culturalContext: ['religious_control', 'shame_based_theology', 'community_shunning'],
    riskLevel: 'high',
    interventionType: 'clinical',
    validators: ['Dr. Rebecca Stone, Religious Trauma Specialist', 'Dr. David Chen, Spiritual Abuse Recovery Expert'],
    examples: [
      {
        text: 'Religious trauma has left me feeling damned and unworthy of life',
        severity: 'critical',
        culturalNuances: ['existential_crisis', 'divine_abandonment', 'worthiness_wounds']
      },
      {
        text: 'Purity culture destroyed my relationship with my body and sexuality',
        severity: 'high',
        culturalNuances: ['bodily_autonomy', 'sexual_shame', 'identity_reconstruction']
      },
      {
        text: 'Leaving my faith community means losing my entire support system',
        severity: 'high',
        culturalNuances: ['social_isolation', 'meaning_making_crisis', 'community_belonging']
      }
    ]
  },

  // Immigration Status Patterns
  {
    community: 'Immigrant/Untypeof window !== 'undefined' && documented',
    expression: 'deportation_anxiety_crisis',
    culturalContext: ['legal_vulnerability', 'family_separation', 'economic_exploitation'],
    riskLevel: 'high',
    interventionType: 'community_based',
    validators: ['Dr. Maria Gonzalez, Immigration Trauma Specialist', 'Dr. Carlos Rivera, Deportation Anxiety Expert'],
    examples: [
      {
        text: 'ICE anxiety has me living in constant fear I cannot continue',
        severity: 'high',
        culturalNuances: ['state_violence', 'hypervigilance', 'survival_mode']
      },
      {
        text: 'Fear of deportation is tearing my family apart',
        severity: 'high',
        culturalNuances: ['family_systems', 'legal_trauma', 'protective_secrecy']
      },
      {
        text: 'Working in shadows without rights is destroying my dignity',
        severity: 'medium',
        culturalNuances: ['labor_exploitation', 'human_dignity', 'economic_justice']
      }
    ]
  },

  // Neurodivergent Community Patterns
  {
    community: 'Neurodivergent',
    expression: 'masking_exhaustion_crisis',
    culturalContext: ['neurotypical_expectations', 'identity_suppression', 'sensory_overwhelm'],
    riskLevel: 'high',
    interventionType: 'community_based',
    validators: ['Dr. Sarah Chen, Neurodivergent Mental Health Specialist', 'Dr. Amanda Foster, Autism Advocacy Expert'],
    examples: [
      {
        text: 'Masking autism all day is destroying my sense of self',
        severity: 'high',
        culturalNuances: ['identity_suppression', 'authenticity_crisis', 'exhaustion_overwhelm']
      },
      {
        text: 'ADHD medication changes are making me feel like a different person',
        severity: 'medium',
        culturalNuances: ['neurochemical_identity', 'medication_anxiety', 'personality_concerns']
      },
      {
        text: 'Sensory overload is making everyday life unbearable',
        severity: 'medium',
        culturalNuances: ['environmental_sensitivity', 'accessibility_needs', 'nervous_system_dysregulation']
      }
    ]
  },

  // Economic Justice Patterns
  {
    community: 'Economic Justice',
    expression: 'poverty_trauma_crisis',
    culturalContext: ['financial_insecurity', 'housing_instability', 'healthcare_access'],
    riskLevel: 'high',
    interventionType: 'community_based',
    validators: ['Dr. Patricia Wilson, Economic Trauma Specialist', 'Dr. Michelle Brown, Housing Justice Expert'],
    examples: [
      {
        text: 'Medical debt is bankrupting us and I feel like such a burden',
        severity: 'high',
        culturalNuances: ['healthcare_inequality', 'financial_stress', 'family_burden_guilt']
      },
      {
        text: 'Losing our home feels like losing our identity and stability',
        severity: 'high',
        culturalNuances: ['housing_security', 'place_attachment', 'stability_loss']
      },
      {
        text: 'Working three jobs and still cant afford basic needs',
        severity: 'medium',
        culturalNuances: ['labor_exploitation', 'survival_mode', 'systemic_inequality']
      }
    ]
  }
];

/**
 * Cultural Resource Mapping
 * Maps crisis types to culturally appropriate resources
 */
export const CULTURAL_RESOURCES = {
  'BIPOC': {
    'crisis_lines': [
      'Crisis Text Line: Text HOME to 741741',
      'National Suicide Prevention Lifeline: 988',
      'The Steve Fund Crisis Text Line for Students of Color: Text STEVE to 741741',
      'Black Mental Health Alliance: 410-338-2642'
    ],
    'community_resources': [
      'Black Lives Matter Healing Justice Toolkit',
      'National Queer and Trans Therapists of Color Network',
      'Indigenous Wellness Collective',
      'Asian Mental Health Collective'
    ],
    'therapeutic_approaches': [
      'Liberation Psychology',
      'Culturally Responsive Therapy',
      'Community Healing Circles',
      'Ancestral Healing Practices'
    ]
  },
  'LGBTQ+': {
    'crisis_lines': [
      'Trevor Project Lifeline: 1-866-488-7386',
      'Trans Lifeline: 877-565-8860',
      'LGBT National Hotline: 1-888-843-4564',
      'Crisis Text Line: Text HOME to 741741'
    ],
    'community_resources': [
      'PFLAG Support Groups',
      'LGBT Community Centers',
      'Gender Affirming Care Providers',
      'Chosen Family Networks'
    ],
    'therapeutic_approaches': [
      'Affirmative Therapy',
      'Gender-Affirming Care',
      'Family Systems Therapy',
      'Trauma-Informed LGBTQ+ Therapy'
    ]
  },
  'Indigenous': {
    'crisis_lines': [
      'Crisis Text Line: Text HOME to 741741',
      'National Suicide Prevention Lifeline: 988',
      'StrongHearts Native Helpline: 1-844-762-8483'
    ],
    'community_resources': [
      'Tribal Mental Health Services',
      'Traditional Healing Circles',
      'Elder Guidance Programs',
      'Cultural Restoration Programs'
    ],
    'therapeutic_approaches': [
      'Traditional Healing Practices',
      'Ceremony-Based Healing',
      'Community-Centered Approaches',
      'Culturally Adapted Therapy'
    ]
  },
  'Religious Trauma': {
    'crisis_lines': [
      'Crisis Text Line: Text HOME to 741741',
      'National Suicide Prevention Lifeline: 988',
      'Secular Therapy Project Crisis Support'
    ],
    'community_resources': [
      'Religious Trauma Syndrome Support Groups',
      'Secular Recovery Networks',
      'Spiritual Abuse Recovery Communities',
      'Progressive Faith Communities'
    ],
    'therapeutic_approaches': [
      'Religious Trauma Therapy',
      'Existential Therapy',
      'Meaning-Making Therapy',
      'Values-Based Therapy'
    ]
  },
  'Immigrant': {
    'crisis_lines': [
      'Crisis Text Line: Text HOME to 741741',
      'National Suicide Prevention Lifeline: 988 (multilingual)',
      'Immigration Legal Support Hotlines'
    ],
    'community_resources': [
      'Immigrant Rights Organizations',
      'Community Legal Clinics',
      'Mutual Aid Networks',
      'Cultural Community Centers'
    ],
    'therapeutic_approaches': [
      'Culturally Adapted Therapy',
      'Trauma-Informed Immigration Therapy',
      'Community-Based Support',
      'Family Systems Approaches'
    ]
  },
  'Neurodivergent': {
    'crisis_lines': [
      'Crisis Text Line: Text HOME to 741741',
      'National Suicide Prevention Lifeline: 988',
      'Autism Society Crisis Support'
    ],
    'community_resources': [
      'Autistic Self-Advocacy Networks',
      'ADHD Support Groups',
      'Neurodivergent Community Centers',
      'Disability Rights Organizations'
    ],
    'therapeutic_approaches': [
      'Neurodivergent-Affirming Therapy',
      'Sensory-Aware Therapy',
      'Strengths-Based Approaches',
      'Communication-Accessible Therapy'
    ]
  }
};

/**
 * Cultural Competency Crisis Validator
 * Enhances crisis detection with cultural responsiveness
 */
export class CulturalCompetencyValidator {
  private culturalPatterns: CulturalCrisisPattern[];
  private culturalResources: typeof CULTURAL_RESOURCES;

  constructor() {
    this.culturalPatterns = CULTURAL_CRISIS_PATTERNS;
    this.culturalResources = CULTURAL_RESOURCES;
  }

  /**
   * Validate crisis detection with cultural competency
   */
  validateCrisis(
    text: string,
    userIdentity: string[] = [],
    originalDetection?: CrisisDetectionResult
  ): CulturalValidationResult {
    // Get original detection if not provided
    const original = originalDetection || detectCrisisEnhanced(text, {
      culturalIdentity: userIdentity
    });

    // Identify cultural communities from text and user identity
    const identifiedCommunities = this.identifyCulturalCommunities(text, userIdentity);
    
    // Analyze cultural stressors and protective factors
    const culturalFactors = this.analyzeCulturalFactors(text, identifiedCommunities);
    
    // Enhance detection with cultural context
    const enhancedDetection = this.enhanceDetectionWithCulture(
      text, 
      original, 
      identifiedCommunities,
      culturalFactors
    );

    // Generate culturally appropriate intervention recommendations
    const interventionRecommendations = this.generateCulturalInterventions(
      identifiedCommunities,
      enhancedDetection.severity,
      culturalFactors
    );

    // Calculate cultural validation score
    const validationScore = this.calculateCulturalValidationScore(
      enhancedDetection,
      identifiedCommunities,
      culturalFactors
    );

    return {
      originalDetection: original,
      culturallyEnhancedDetection: enhancedDetection,
      culturalFactors: {
        identifiedCommunities,
        culturalStressors: culturalFactors.stressors,
        protectiveFactors: culturalFactors.protective,
        recommendedResources: this.getRecommendedResources(identifiedCommunities)
      },
      interventionRecommendations,
      validationScore
    };
  }

  /**
   * Identify cultural communities from text patterns and user identity
   */
  private identifyCulturalCommunities(text: string, userIdentity: string[]): string[] {
    const communities = new Set<string>();
    
    // Add explicitly declared user identity
    userIdentity.forEach(identity => communities.add(identity));

    // Analyze text for cultural indicators
    const normalizedText = text.toLowerCase();
    
    for (const pattern of this.culturalPatterns) {
      for (const example of pattern.examples) {
        // Check for cultural keywords and phrases
        for (const nuance of example.culturalNuances) {
          if (this.textContainsCulturalIndicator(normalizedText, nuance, pattern.community)) {
            communities.add(pattern.community);
          }
        }
      }
    }

    // Specific pattern matching for common cultural expressions
    const culturalIndicators = {
      'BIPOC': [
        'racism', 'discrimination', 'microaggression', 'code switching',
        'generational trauma', 'police violence', 'systemic oppression'
      ],
      'LGBTQ+': [
        'came out', 'closeted', 'deadname', 'misgendered', 'conversion therapy',
        'family rejection', 'internalized homophobia', 'trans'
      ],
      'Indigenous': [
        'ancestors', 'land', 'sacred', 'elder', 'ceremony', 'tribal',
        'reservation', 'cultural practices', 'native', 'indigenous'
      ],
      'Religious Trauma': [
        'religious trauma', 'purity culture', 'spiritual abuse', 'faith crisis',
        'religious control', 'biblical', 'church trauma', 'leaving faith'
      ],
      'Immigrant': [
        'ice', 'deportation', 'untypeof window !== 'undefined' && documented', 'visa', 'citizenship',
        'border', 'homeland security', 'immigration status'
      ],
      'Neurodivergent': [
        'autism', 'adhd', 'masking', 'stimming', 'sensory overload',
        'executive function', 'neurodivergent', 'special needs'
      ]
    };

    Object.entries(culturalIndicators).forEach(([community, indicators]) => {
      if (indicators.some(indicator => normalizedText.includes(indicator))) {
        communities.add(community);
      }
    });

    return Array.from(communities);
  }

  /**
   * Check if text contains cultural indicator
   */
  private textContainsCulturalIndicator(text: string, nuance: string, community: string): boolean {
    const nuanceKeywords = {
      'ancestral_trauma': ['generational', 'ancestors', 'bloodline', 'inherited'],
      'identity_suppression': ['hiding', 'closeted', 'masking', 'pretending'],
      'systemic_oppression': ['system', 'institutional', 'structural', 'societal'],
      'family_systems_trauma': ['family rejected', 'family disowned', 'family abandoned'],
      'spiritual_identity': ['spirit', 'soul', 'sacred', 'ancestors', 'ceremony'],
      'economic_justice': ['poverty', 'housing', 'medical debt', 'can\'t afford']
    };

    const keywords = nuanceKeywords[nuance] || [nuance.replace('_', ' ')];
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Analyze cultural factors that impact crisis presentation
   */
  private analyzeCulturalFactors(text: string, communities: string[]): {
    stressors: string[];
    protective: string[];
  } {
    const stressors: string[] = [];
    const protective: string[] = [];

    const normalizedText = text.toLowerCase();

    // Community-specific stressor analysis
    communities.forEach(community => {
      const patterns = this.culturalPatterns.filter(p => p.community === community);
      patterns.forEach(pattern => {
        pattern.culturalContext.forEach(context => {
          if (this.textIndicatesStressor(normalizedText, context)) {
            stressors.push(context);
          }
        });
      });
    });

    // Protective factor identification
    const protectiveIndicators = [
      'therapy', 'support group', 'community', 'family support',
      'cultural practices', 'spiritual practices', 'healing circles',
      'mentor', 'elder', 'chosen family', 'allies'
    ];

    protectiveIndicators.forEach(indicator => {
      if (normalizedText.includes(indicator)) {
        protective.push(indicator);
      }
    });

    return { stressors, protective };
  }

  /**
   * Check if text indicates presence of cultural stressor
   */
  private textIndicatesStressor(text: string, stressor: string): boolean {
    const stressorMappings = {
      'systemic_racism': ['racism', 'discrimination', 'prejudice', 'bias'],
      'family_rejection': ['rejected', 'disowned', 'kicked out', 'abandoned'],
      'religious_trauma': ['religious', 'church', 'faith', 'spiritual abuse'],
      'deportation_fear': ['ice', 'deportation', 'afraid', 'immigration'],
      'identity_suppression': ['hiding', 'pretending', 'can\'t be myself', 'fake'],
      'economic_stress': ['money', 'job', 'housing', 'afford', 'debt']
    };

    const mappings = stressorMappings[stressor] || [stressor.replace('_', ' ')];
    return mappings.some(mapping => text.includes(mapping));
  }

  /**
   * Enhance crisis detection with cultural context
   */
  private enhanceDetectionWithCulture(
    text: string,
    originalDetection: CrisisDetectionResult,
    communities: string[],
    culturalFactors: any
  ): CrisisDetectionResult {
    let enhancedSeverity = originalDetection.severity;
    let enhancedConfidence = originalDetection.confidence;
    let enhancedAction = originalDetection.recommendedAction;

    // Adjust based on cultural risk factors
    if (communities.length > 0) {
      // Multi-marginalized individuals face higher risk
      if (communities.length > 1) {
        enhancedConfidence = Math.min(enhancedConfidence * 1.2, 1.0);
      }

      // Specific community risk factors
      if (communities.includes('LGBTQ+') && culturalFactors.stressors.includes('family_rejection')) {
        enhancedSeverity = this.escalateSeverity(enhancedSeverity);
        enhancedAction = this.escalateAction(enhancedAction);
      }

      if (communities.includes('BIPOC') && culturalFactors.stressors.includes('systemic_racism')) {
        enhancedConfidence = Math.min(enhancedConfidence * 1.1, 1.0);
      }

      if (communities.includes('Immigrant') && culturalFactors.stressors.includes('deportation_fear')) {
        enhancedSeverity = this.escalateSeverity(enhancedSeverity);
      }
    }

    // Adjust based on protective factors
    if (culturalFactors.protective.length > 0) {
      // Presence of cultural support systems may reduce immediate risk
      enhancedConfidence = Math.max(enhancedConfidence * 0.9, 0.1);
    }

    return {
      ...originalDetection,
      confidence: enhancedConfidence,
      severity: enhancedSeverity,
      recommendedAction: enhancedAction,
      culturalContext: communities,
      culturallyRelevant: communities.length > 0
    };
  }

  /**
   * Generate culturally appropriate intervention recommendations
   */
  private generateCulturalInterventions(
    communities: string[],
    severity: string,
    culturalFactors: any
  ): {
    primary: string;
    alternatives: string[];
    culturalConsiderations: string[];
  } {
    const interventions = {
      primary: 'crisis_counseling',
      alternatives: ['peer_support', 'family_therapy', 'community_support'],
      culturalConsiderations: []
    };

    communities.forEach(community => {
      const patterns = this.culturalPatterns.filter(p => p.community === community);
      patterns.forEach(pattern => {
        if (pattern.interventionType === 'community_based') {
          interventions.primary = 'community_based_support';
          interventions.alternatives.unshift('cultural_healing_practices');
        }
        
        if (pattern.interventionType === 'spiritual') {
          interventions.alternatives.unshift('spiritual_counseling');
          interventions.culturalConsiderations.push('Honor spiritual and ancestral practices');
        }
      });

      // Add community-specific considerations
      switch (community) {
        case 'LGBTQ+':
          interventions.culturalConsiderations.push(
            'Ensure LGBTQ+-affirming therapists',
            'Consider chosen family involvement',
            'Address identity validation needs'
          );
          break;
        case 'BIPOC':
          interventions.culturalConsiderations.push(
            'Address systemic racism impact',
            'Consider culturally matched therapists',
            'Validate experiences of discrimination'
          );
          break;
        case 'Indigenous':
          interventions.culturalConsiderations.push(
            'Honor traditional healing practices',
            'Consider elder or spiritual leader involvement',
            'Address historical and intergenerational trauma'
          );
          break;
        case 'Immigrant':
          interventions.culturalConsiderations.push(
            'Ensure language accessibility',
            'Address immigration-related fears',
            'Consider legal advocacy resources'
          );
          break;
      }
    });

    return interventions;
  }

  /**
   * Calculate cultural validation score
   */
  private calculateCulturalValidationScore(
    detection: CrisisDetectionResult,
    communities: string[],
    culturalFactors: any
  ): number {
    let score = 0.5; // Base score

    // Points for identifying cultural communities
    if (communities.length > 0) {
      score += 0.2;
    }

    // Points for cultural context in detection
    if (detection.culturalContext && detection.culturalContext.length > 0) {
      score += 0.2;
    }

    // Points for appropriate cultural stressor recognition
    if (culturalFactors.stressors.length > 0) {
      score += 0.1;
    }

    // Deduct points if cultural factors are missed
    if (communities.length > 0 && !detection.culturallyRelevant) {
      score -= 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get recommended resources for cultural communities
   */
  private getRecommendedResources(communities: string[]): string[] {
    const resources = new Set<string>();
    
    communities.forEach(community => {
      const communityResources = this.culturalResources[community];
      if (communityResources) {
        communityResources.crisis_lines?.forEach(line => resources.add(line));
        communityResources.community_resources?.forEach(resource => resources.add(resource));
      }
    });

    // Add universal resources
    resources.add('Crisis Text Line: Text HOME to 741741');
    resources.add('National Suicide Prevention Lifeline: 988');

    return Array.from(resources);
  }

  /**
   * Helper methods for severity and action escalation
   */
  private escalateSeverity(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    const severityMap = { low: 'medium', medium: 'high', high: 'critical', critical: 'critical' };
    return severityMap[severity] as 'low' | 'medium' | 'high' | 'critical';
  }

  private escalateAction(action: string): 'monitor' | 'support' | 'intervention' | 'emergency' {
    const actionMap = { 
      monitor: 'support', 
      support: 'intervention', 
      intervention: 'emergency', 
      emergency: 'emergency' 
    };
    return actionMap[action] as 'monitor' | 'support' | 'intervention' | 'emergency';
  }

  /**
   * Validate cultural competency of the overall system
   */
  validateSystemCulturalCompetency(): {
    overall_score: number;
    community_coverage: Record<string, number>;
    recommendations: string[];
    cultural_blind_spots: string[];
  } {
    const communities = Array.from(new Set(this.culturalPatterns.map(p => p.community)));
    const coverage = {};
    
    communities.forEach(community => {
      const patterns = this.culturalPatterns.filter(p => p.community === community);
      coverage[community] = patterns.length / 10; // Normalized score
    });

    const overallScore = Object.values(coverage).reduce((sum: number, score: number) => sum + score, 0) / communities.length;

    const recommendations = [];
    const blindSpots = [];

    if (overallScore < 0.8) {
      recommendations.push('Expand cultural crisis pattern database');
    }

    communities.forEach(community => {
      if (coverage[community] < 0.5) {
        blindSpots.push(`Insufficient ${community} crisis patterns`);
      }
    });

    return {
      overall_score: overallScore,
      community_coverage: coverage,
      recommendations,
      cultural_blind_spots: blindSpots
    };
  }
}

// Export singleton instance
export const culturalValidator = new CulturalCompetencyValidator();

// Export convenience functions
export function validateCrisisWithCulture(
  text: string, 
  userIdentity: string[] = [], 
  originalDetection?: CrisisDetectionResult
): CulturalValidationResult {
  return culturalValidator.validateCrisis(text, userIdentity, originalDetection);
}

export function getCulturalResources(communities: string[]): string[] {
  return culturalValidator['getRecommendedResources'](communities);
}

export function validateSystemCulturalCompetency() {
  return culturalValidator.validateSystemCulturalCompetency();
}

export default CulturalCompetencyValidator;