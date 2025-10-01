/**
 * Cultural Crisis Competency System
 * 
 * Recognizes and responds to crisis expressions across diverse cultural contexts,
 * languages, and trauma types with deep cultural humility and responsiveness.
 * 
 * Key Features:
 * - Cultural-specific crisis expressions and metaphors
 * - Historical and systemic trauma recognition
 * - Language-specific distress patterns
 * - Community and spiritual healing approaches
 * - Intersectional identity considerations
 * - Culturally adapted intervention strategies
 */

import { CrisisPattern } from './advanced-crisis-pattern-recognition';
import { UserContext } from './contextual-crisis-assessment';
import { Intervention } from './progressive-crisis-intervention';

interface CulturalCrisisProfile {
  culture: string;
  commonExpressions: CulturalExpression[];
  historicalTrauma: HistoricalTrauma[];
  healingTraditions: HealingTradition[];
  familyDynamics: FamilyDynamic[];
  spiritualConsiderations: SpiritualConsideration[];
  stigmaFactors: StigmaFactor[];
  resourceAdaptations: ResourceAdaptation[];
}

interface CulturalExpression {
  type: 'metaphor' | 'phrase' | 'concept' | 'somatic';
  expression: string;
  meaning: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  context: string;
  alternativeExpressions: string[];
}

interface HistoricalTrauma {
  type: string;
  description: string;
  modernManifestations: string[];
  healingApproaches: string[];
  triggerEvents: string[];
  communityResilience: string[];
}

interface HealingTradition {
  name: string;
  description: string;
  practitioners: string[];
  methods: string[];
  appropriateness: 'crisis' | 'ongoing' | 'prevention';
  modernIntegration: string[];
}

interface FamilyDynamic {
  concept: string;
  description: string;
  crisisImpact: string;
  interventionConsiderations: string[];
  boundaries: string[];
}

interface SpiritualConsideration {
  aspect: string;
  description: string;
  crisisRelevance: string;
  respectfulApproach: string[];
  resourceConnections: string[];
}

interface StigmaFactor {
  source: string;
  description: string;
  crisisImpact: string;
  mitigationStrategies: string[];
  communityEducation: string[];
}

interface ResourceAdaptation {
  originalResource: string;
  culturalAdaptation: string;
  languageConsiderations: string[];
  accessBarriers: string[];
  communityAlternatives: string[];
}

interface IntersectionalIdentity {
  identities: string[];
  uniqueChallenges: string[];
  compoundedStressors: string[];
  resilienenceFactors: string[];
  supportResources: string[];
}

class CulturalCrisisCompetency {
  private culturalProfiles: Map<string, CulturalCrisisProfile> = new Map();
  private intersectionalProfiles: Map<string, IntersectionalIdentity> = new Map();
  private languagePatterns: Map<string, CulturalExpression[]> = new Map();
  private systemicFactors: Map<string, string[]> = new Map();

  constructor() {
    this.initializeCulturalProfiles();
    this.initializeIntersectionalProfiles();
    this.initializeLanguagePatterns();
    this.initializeSystemicFactors();
  }

  private initializeCulturalProfiles(): void {
    // Indigenous/Native American Profile
    this.culturalProfiles.set('indigenous', {
      culture: 'Indigenous/Native American',
      commonExpressions: [
        {
          type: 'concept',
          expression: 'soul wound',
          meaning: 'Deep spiritual and psychological injury affecting the soul',
          severity: 'high',
          context: 'Historical and personal trauma affecting spiritual connection',
          alternativeExpressions: ['spirit sickness', 'broken connection', 'lost way']
        },
        {
          type: 'metaphor',
          expression: 'walking in two worlds',
          meaning: 'Struggling to balance traditional and modern cultures',
          severity: 'moderate',
          context: 'Identity conflict and cultural disconnection',
          alternativeExpressions: ['caught between worlds', 'cultural confusion']
        },
        {
          type: 'concept',
          expression: 'seven generations pain',
          meaning: 'Trauma carried across generations affecting descendants',
          severity: 'high',
          context: 'Historical trauma manifesting in current generation',
          alternativeExpressions: ['ancestor pain', 'generational burden']
        }
      ],
      historicalTrauma: [
        {
          type: 'Boarding School Trauma',
          description: 'Forced separation from families and cultural suppression',
          modernManifestations: ['attachment issues', 'cultural shame', 'educational mistrust'],
          healingApproaches: ['cultural reconnection', 'land-based healing', 'ceremony'],
          triggerEvents: ['school experiences', 'authority figures', 'cultural celebrations'],
          communityResilience: ['elder wisdom', 'cultural revival', 'land connection']
        },
        {
          type: 'Land Loss and Displacement',
          description: 'Forced removal from ancestral lands and sacred sites',
          modernManifestations: ['spiritual disconnection', 'environmental grief', 'rootlessness'],
          healingApproaches: ['land visits', 'environmental restoration', 'place-based identity'],
          triggerEvents: ['environmental destruction', 'displacement', 'loss of access'],
          communityResilience: ['land stewardship', 'environmental activism', 'sacred site protection']
        }
      ],
      healingTraditions: [
        {
          name: 'Smudging and Purification',
          description: 'Use of sacred plants for spiritual cleansing',
          practitioners: ['medicine people', 'elders', 'trained community members'],
          methods: ['sage burning', 'cedar ceremonies', 'sweetgrass blessings'],
          appropriateness: 'crisis',
          modernIntegration: ['therapy integration', 'hospital chaplaincy', 'crisis centers']
        },
        {
          name: 'Talking Circles',
          description: 'Community sharing in sacred circle format',
          practitioners: ['elders', 'trained facilitators', 'community leaders'],
          methods: ['sacred talking stick', 'non-judgmental listening', 'shared wisdom'],
          appropriateness: 'ongoing',
          modernIntegration: ['group therapy', 'peer support', 'community healing']
        }
      ],
      familyDynamics: [
        {
          concept: 'Extended Family Networks',
          description: 'Broad kinship networks including chosen family',
          crisisImpact: 'Multiple sources of support but also multiple impacts',
          interventionConsiderations: ['include extended family', 'respect kinship roles'],
          boundaries: ['collective vs individual focus', 'community responsibility']
        }
      ],
      spiritualConsiderations: [
        {
          aspect: 'Connection to Land',
          description: 'Spiritual relationship with specific geographic places',
          crisisRelevance: 'Disconnection from land can worsen mental health',
          respectfulApproach: ['ask about land connection', 'support land-based healing'],
          resourceConnections: ['cultural centers', 'tribal lands', 'sacred sites']
        }
      ],
      stigmaFactors: [
        {
          source: 'Medical System Mistrust',
          description: 'Historical medical abuse and experimentation',
          crisisImpact: 'Reluctance to seek professional mental health care',
          mitigationStrategies: ['Indigenous providers', 'traditional integration', 'community advocates'],
          communityEducation: ['provider cultural training', 'community health workers']
        }
      ],
      resourceAdaptations: [
        {
          originalResource: '988 Suicide Prevention Lifeline',
          culturalAdaptation: 'Native Suicide Prevention Lifeline (1-855-827-3200)',
          languageConsiderations: ['tribal languages', 'cultural concepts'],
          accessBarriers: ['rural location', 'technology access'],
          communityAlternatives: ['tribal wellness programs', 'traditional healers']
        }
      ]
    });

    // Latino/Hispanic Profile
    this.culturalProfiles.set('latino', {
      culture: 'Latino/Hispanic',
      commonExpressions: [
        {
          type: 'concept',
          expression: 'han',
          meaning: 'Deep emotional pain and suffering',
          severity: 'high',
          context: 'Collective and individual suffering',
          alternativeExpressions: ['dolor del alma', 'pena profunda']
        },
        {
          type: 'phrase',
          expression: 'se me está acabando el mundo',
          meaning: 'My world is ending',
          severity: 'critical',
          context: 'Expressing hopelessness and despair',
          alternativeExpressions: ['no puedo más', 'ya no hay salida']
        },
        {
          type: 'concept',
          expression: 'susto',
          meaning: 'Soul loss from traumatic experience',
          severity: 'moderate',
          context: 'Traditional understanding of trauma impact',
          alternativeExpressions: ['alma perdida', 'espíritu asustado']
        }
      ],
      historicalTrauma: [
        {
          type: 'Immigration and Displacement',
          description: 'Forced migration and family separation',
          modernManifestations: ['family separation anxiety', 'typeof window !== 'undefined' && documentation fears', 'cultural loss'],
          healingApproaches: ['community support', 'cultural preservation', 'family reunification'],
          triggerEvents: ['ICE raids', 'deportation news', 'family separation'],
          communityResilience: ['mutual aid networks', 'church support', 'cultural celebrations']
        }
      ],
      healingTraditions: [
        {
          name: 'Sobadoras/Curanderas',
          description: 'Traditional healers using spiritual and herbal methods',
          practitioners: ['curanderas', 'sobadoras', 'parteras'],
          methods: ['limpias', 'herbal remedies', 'spiritual counseling'],
          appropriateness: 'ongoing',
          modernIntegration: ['complementary to therapy', 'cultural centers', 'health clinics']
        }
      ],
      familyDynamics: [
        {
          concept: 'Familismo',
          description: 'Strong family loyalty and interdependence',
          crisisImpact: 'Family involvement crucial but may create pressure',
          interventionConsiderations: ['include family in treatment', 'respect family hierarchy'],
          boundaries: ['individual vs family needs', 'role expectations']
        }
      ],
      spiritualConsiderations: [
        {
          aspect: 'Catholic/Indigenous Spirituality',
          description: 'Blend of Catholic and indigenous spiritual practices',
          crisisRelevance: 'Spiritual crisis often accompanies mental health crisis',
          respectfulApproach: ['ask about spiritual beliefs', 'include religious support'],
          resourceConnections: ['parish priests', 'spiritual directors', 'indigenous healers']
        }
      ],
      stigmaFactors: [
        {
          source: 'Mental Health Stigma',
          description: 'Cultural stigma around mental illness',
          crisisImpact: 'Reluctance to seek help, family shame',
          mitigationStrategies: ['normalize mental health', 'use spiritual language', 'family education'],
          communityEducation: ['church partnerships', 'community health workers']
        }
      ],
      resourceAdaptations: [
        {
          originalResource: 'Crisis Text Line',
          culturalAdaptation: 'Spanish crisis text and phone support',
          languageConsiderations: ['regional Spanish dialects', 'cultural expressions'],
          accessBarriers: ['typeof window !== 'undefined' && documentation status', 'economic barriers'],
          communityAlternatives: ['church counseling', 'community centers', 'mutual aid']
        }
      ]
    });

    // East Asian Profile
    this.culturalProfiles.set('east_asian', {
      culture: 'East Asian',
      commonExpressions: [
        {
          type: 'concept',
          expression: 'han',
          meaning: 'Deep, generational sorrow and resentment',
          severity: 'high',
          context: 'Collective suffering and historical pain',
          alternativeExpressions: ['deep sadness', 'ancestral pain']
        },
        {
          type: 'phrase',
          expression: 'face lost',
          meaning: 'Social shame and honor lost',
          severity: 'high',
          context: 'Social embarrassment affecting family honor',
          alternativeExpressions: ['family shame', 'honor destroyed']
        },
        {
          type: 'somatic',
          expression: 'heart fire',
          meaning: 'Anxiety manifesting as chest burning',
          severity: 'moderate',
          context: 'Physical manifestation of emotional distress',
          alternativeExpressions: ['chest burning', 'heart pressure']
        }
      ],
      historicalTrauma: [
        {
          type: 'War and Displacement',
          description: 'Multiple wars, colonization, and forced migration',
          modernManifestations: ['survivor guilt', 'perfectionism pressure', 'emotional suppression'],
          healingApproaches: ['mindfulness practices', 'family therapy', 'cultural reconnection'],
          triggerEvents: ['conflict news', 'achievement pressure', 'family expectations'],
          communityResilience: ['education emphasis', 'community networks', 'cultural preservation']
        }
      ],
      healingTraditions: [
        {
          name: 'Traditional Medicine',
          description: 'Holistic healing including herbs and acupuncture',
          practitioners: ['TCM doctors', 'acupuncturists', 'herbalists'],
          methods: ['acupuncture', 'herbal medicine', 'qi gong'],
          appropriateness: 'ongoing',
          modernIntegration: ['integrative medicine', 'wellness centers', 'hospital programs']
        }
      ],
      familyDynamics: [
        {
          concept: 'Filial Piety',
          description: 'Respect and care for parents and elders',
          crisisImpact: 'Individual needs may conflict with family duty',
          interventionConsiderations: ['respect family hierarchy', 'consider intergenerational impact'],
          boundaries: ['individual vs collective responsibility', 'authority respect']
        }
      ],
      spiritualConsiderations: [
        {
          aspect: 'Ancestor Veneration',
          description: 'Spiritual connection to deceased family members',
          crisisRelevance: 'Disconnection from ancestors can worsen distress',
          respectfulApproach: ['ask about ancestor beliefs', 'include spiritual practices'],
          resourceConnections: ['temples', 'spiritual leaders', 'cultural centers']
        }
      ],
      stigmaFactors: [
        {
          source: 'Mental Health Stigma',
          description: 'Strong stigma against mental illness',
          crisisImpact: 'Severe reluctance to seek help, family shame',
          mitigationStrategies: ['education focus', 'somatic approach', 'family involvement'],
          communityEducation: ['community leaders', 'religious organizations', 'professional associations']
        }
      ],
      resourceAdaptations: [
        {
          originalResource: 'Therapy Services',
          culturalAdaptation: 'Asian culturally responsive therapy',
          languageConsiderations: ['language-specific therapy', 'cultural concepts'],
          accessBarriers: ['cultural stigma', 'language barriers', 'provider shortage'],
          communityAlternatives: ['community centers', 'religious counseling', 'peer support']
        }
      ]
    });

    // African American Profile
    this.culturalProfiles.set('african_american', {
      culture: 'African American',
      commonExpressions: [
        {
          type: 'phrase',
          expression: 'soul tired',
          meaning: 'Deep exhaustion affecting spirit and core being',
          severity: 'high',
          context: 'Chronic stress and discrimination fatigue',
          alternativeExpressions: ['bone deep tired', 'spirit worn down']
        },
        {
          type: 'concept',
          expression: 'carrying ancestors',
          meaning: 'Bearing the weight of generational trauma and strength',
          severity: 'moderate',
          context: 'Historical trauma combined with resilience',
          alternativeExpressions: ['generational burden', 'ancestor weight']
        }
      ],
      historicalTrauma: [
        {
          type: 'Slavery and Systemic Racism',
          description: 'Centuries of enslavement and ongoing discrimination',
          modernManifestations: ['hypervigilance', 'medical mistrust', 'systemic stress'],
          healingApproaches: ['community healing', 'cultural affirmation', 'social justice action'],
          triggerEvents: ['police encounters', 'discrimination incidents', 'historical anniversaries'],
          communityResilience: ['church community', 'cultural pride', 'mutual aid traditions']
        }
      ],
      healingTraditions: [
        {
          name: 'Church and Spiritual Community',
          description: 'Faith-based healing and community support',
          practitioners: ['pastors', 'church mothers', 'spiritual advisors'],
          methods: ['prayer', 'laying on hands', 'community testimony'],
          appropriateness: 'crisis',
          modernIntegration: ['faith-based counseling', 'church mental health ministries']
        }
      ],
      familyDynamics: [
        {
          concept: 'Strong Black Woman/Man',
          description: 'Cultural expectation of strength and resilience',
          crisisImpact: 'May prevent help-seeking and emotional expression',
          interventionConsiderations: ['validate strength while allowing vulnerability'],
          boundaries: ['strength vs support needs', 'independence vs community']
        }
      ],
      spiritualConsiderations: [
        {
          aspect: 'Liberation Theology',
          description: 'Faith tied to social justice and collective liberation',
          crisisRelevance: 'Spiritual crisis often linked to social injustice',
          respectfulApproach: ['acknowledge systemic factors', 'include justice themes'],
          resourceConnections: ['Black churches', 'faith leaders', 'social justice organizations']
        }
      ],
      stigmaFactors: [
        {
          source: 'Historical Medical Trauma',
          description: 'History of medical experimentation and abuse',
          crisisImpact: 'Deep mistrust of mental health system',
          mitigationStrategies: ['Black providers', 'community advocates', 'transparent care'],
          communityEducation: ['community health workers', 'church partnerships']
        }
      ],
      resourceAdaptations: [
        {
          originalResource: 'Crisis Counseling',
          culturalAdaptation: 'Black culturally responsive crisis support',
          languageConsiderations: ['AAVE recognition', 'cultural expressions'],
          accessBarriers: ['provider diversity', 'economic barriers', 'system mistrust'],
          communityAlternatives: ['Black mental health organizations', 'church counseling']
        }
      ]
    });
  }

  private initializeIntersectionalProfiles(): void {
    // LGBTQ+ People of Color
    this.intersectionalProfiles.set('lgbtq_poc', {
      identities: ['lgbtq', 'person_of_color'],
      uniqueChallenges: [
        'Rejection from both communities',
        'Double minority stress',
        'Limited culturally competent resources',
        'Family rejection compounded by cultural factors'
      ],
      compoundedStressors: [
        'Cultural homophobia/transphobia',
        'Religious conflict',
        'Immigration and identity fears',
        'Economic vulnerability'
      ],
      resilienenceFactors: [
        'Chosen family networks',
        'LGBTQ+ community support',
        'Cultural pride integration',
        'Intersectional activism'
      ],
      supportResources: [
        'LGBTQ+ organizations with cultural focus',
        'Affirming religious communities',
        'Intersectional support groups',
        'Identity-specific crisis lines'
      ]
    });

    // Indigenous LGBTQ+ (Two-Spirit)
    this.intersectionalProfiles.set('two_spirit', {
      identities: ['indigenous', 'lgbtq', 'two_spirit'],
      uniqueChallenges: [
        'Traditional acceptance vs colonized views',
        'Spiritual role confusion',
        'Urban vs reservation identity',
        'Limited two-spirit specific resources'
      ],
      compoundedStressors: [
        'Historical trauma impact',
        'Spiritual disconnection',
        'Community size limitations',
        'Cultural appropriation concerns'
      ],
      resilienenceFactors: [
        'Traditional two-spirit roles',
        'Spiritual gifts recognition',
        'Cultural bridge-building capacity',
        'Elder wisdom access'
      ],
      supportResources: [
        'Two-spirit organizations',
        'Native LGBTQ+ groups',
        'Traditional knowledge keepers',
        'Cultural centers with inclusion'
      ]
    });
  }

  private initializeLanguagePatterns(): void {
    // Spanish Crisis Expressions
    this.languagePatterns.set('spanish', [
      {
        type: 'phrase',
        expression: 'no aguanto más',
        meaning: 'I can\'t take it anymore',
        severity: 'high',
        context: 'Expressing being at breaking point',
        alternativeExpressions: ['ya no puedo', 'estoy al límite']
      },
      {
        type: 'phrase',
        expression: 'me quiero morir',
        meaning: 'I want to die',
        severity: 'critical',
        context: 'Direct suicidal expression',
        alternativeExpressions: ['prefiero estar muerto', 'no quiero vivir']
      }
    ]);

    // Korean Crisis Expressions
    this.languagePatterns.set('korean', [
      {
        type: 'concept',
        expression: '한 (han)',
        meaning: 'Deep, collective sorrow',
        severity: 'high',
        context: 'Cultural expression of deep suffering',
        alternativeExpressions: ['깊은 슬픔', '마음의 고통']
      }
    ]);
  }

  private initializeSystemicFactors(): void {
    this.systemicFactors.set('immigration', [
      'Deportation fears',
      'Family separation',
      'Documentation status stress',
      'Language barriers',
      'Cultural displacement',
      'Economic vulnerability',
      'Legal system navigation'
    ]);

    this.systemicFactors.set('racism', [
      'Daily microaggressions',
      'Institutional discrimination',
      'Economic disadvantage',
      'Educational barriers',
      'Healthcare disparities',
      'Criminal justice bias',
      'Housing discrimination'
    ]);

    this.systemicFactors.set('homophobia_transphobia', [
      'Family rejection',
      'Religious condemnation',
      'Employment discrimination',
      'Healthcare barriers',
      'Legal vulnerability',
      'Social isolation',
      'Violence threats'
    ]);
  }

  /**
   * Main cultural assessment method
   */
  async assessCulturalContext(
    patterns: CrisisPattern[],
    userContext: UserContext,
    language?: string
  ): Promise<{
    culturalFactors: string[];
    adaptedInterventions: Intervention[];
    culturalResources: string[];
    systemicConsiderations: string[];
    languageAdaptations: string[];
    intersectionalFactors: string[];
  }> {
    
    const culturalFactors = this.identifyCulturalFactors(userContext);
    const adaptedInterventions = this.adaptInterventions(userContext, patterns);
    const culturalResources = this.getCulturalResources(userContext);
    const systemicConsiderations = this.getSystemicConsiderations(userContext);
    const languageAdaptations = this.getLanguageAdaptations(language, patterns);
    const intersectionalFactors = this.getIntersectionalFactors(userContext);
    
    return {
      culturalFactors,
      adaptedInterventions,
      culturalResources,
      systemicConsiderations,
      languageAdaptations,
      intersectionalFactors
    };
  }

  private identifyCulturalFactors(userContext: UserContext): string[] {
    const factors: string[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      const profile = this.culturalProfiles.get(culture.toLowerCase());
      if (profile) {
        factors.push(`${profile.culture} cultural considerations apply`);
        
        // Add specific cultural factors
        profile.stigmaFactors.forEach(stigma => {
          factors.push(`${stigma.source}: ${stigma.description}`);
        });
        
        profile.familyDynamics.forEach(dynamic => {
          factors.push(`${dynamic.concept}: ${dynamic.description}`);
        });
      }
    });
    
    return factors;
  }

  private adaptInterventions(userContext: UserContext, patterns: CrisisPattern[]): Intervention[] {
    const adaptedInterventions: Intervention[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      const profile = this.culturalProfiles.get(culture.toLowerCase());
      if (profile) {
        profile.healingTraditions.forEach(tradition => {
          if (tradition.appropriateness === 'crisis' || tradition.appropriateness === 'ongoing') {
            adaptedInterventions.push({
              type: 'resource',
              name: tradition.name,
              description: tradition.description,
              instructions: tradition.methods.join(', '),
              culturalAdaptation: [culture],
              effectivenessRating: 0.7,
              timeToImplement: 'short'
            });
          }
        });
      }
    });
    
    return adaptedInterventions;
  }

  private getCulturalResources(userContext: UserContext): string[] {
    const resources: string[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      const profile = this.culturalProfiles.get(culture.toLowerCase());
      if (profile) {
        profile.resourceAdaptations.forEach(adaptation => {
          resources.push(`${adaptation.culturalAdaptation} (adapted from ${adaptation.originalResource})`);
        });
        
        profile.healingTraditions.forEach(tradition => {
          resources.push(`${tradition.name} practitioners: ${tradition.practitioners.join(', ')}`);
        });
      }
    });
    
    // Add intersectional resources
    userContext.demographics.identityFactors.forEach(identity => {
      const intersectionalKey = this.findIntersectionalKey(userContext.demographics.identityFactors, userContext.demographics.culturalBackground);
      if (intersectionalKey) {
        const intersectionalProfile = this.intersectionalProfiles.get(intersectionalKey);
        if (intersectionalProfile) {
          resources.push(...intersectionalProfile.supportResources);
        }
      }
    });
    
    return [...new Set(resources)]; // Remove duplicates
  }

  private getSystemicConsiderations(userContext: UserContext): string[] {
    const considerations: string[] = [];
    
    // Check for systemic factors based on demographics
    if (userContext.demographics.culturalBackground.includes('immigrant')) {
      const immigrationFactors = this.systemicFactors.get('immigration') || [];
      considerations.push(...immigrationFactors.map(factor => `Immigration factor: ${factor}`));
    }
    
    if (userContext.demographics.identityFactors.some(factor => 
      ['lgbtq', 'transgender', 'gay', 'lesbian', 'bisexual', 'queer'].includes(factor.toLowerCase()))) {
      const lgbtqFactors = this.systemicFactors.get('homophobia_transphobia') || [];
      considerations.push(...lgbtqFactors.map(factor => `LGBTQ+ factor: ${factor}`));
    }
    
    // Add racism considerations for people of color
    const peopleOfColor = ['african_american', 'latino', 'indigenous', 'asian', 'middle_eastern'];
    if (userContext.demographics.culturalBackground.some(culture => 
      peopleOfColor.includes(culture.toLowerCase()))) {
      const racismFactors = this.systemicFactors.get('racism') || [];
      considerations.push(...racismFactors.map(factor => `Racism factor: ${factor}`));
    }
    
    return considerations;
  }

  private getLanguageAdaptations(language: string | undefined, patterns: CrisisPattern[]): string[] {
    const adaptations: string[] = [];
    
    if (!language || language === 'english') {
      return adaptations;
    }
    
    const languageExpressions = this.languagePatterns.get(language.toLowerCase());
    if (languageExpressions) {
      adaptations.push(`Language-specific crisis expressions recognized`);
      adaptations.push(`Cultural concepts may not translate directly`);
      adaptations.push(`Native language resources recommended`);
      
      // Check if any patterns match language-specific expressions
      languageExpressions.forEach(expression => {
        if (patterns.some(pattern => 
          pattern.indicators.some(indicator => 
            indicator.includes(expression.expression) || 
            expression.alternativeExpressions.some(alt => indicator.includes(alt))
          )
        )) {
          adaptations.push(`Cultural expression detected: ${expression.expression} (${expression.meaning})`);
        }
      });
    }
    
    return adaptations;
  }

  private getIntersectionalFactors(userContext: UserContext): string[] {
    const factors: string[] = [];
    
    const intersectionalKey = this.findIntersectionalKey(
      userContext.demographics.identityFactors, 
      userContext.demographics.culturalBackground
    );
    
    if (intersectionalKey) {
      const intersectionalProfile = this.intersectionalProfiles.get(intersectionalKey);
      if (intersectionalProfile) {
        factors.push('Intersectional identity considerations:');
        factors.push(...intersectionalProfile.uniqueChallenges.map(challenge => `- ${challenge}`));
        factors.push('Compounded stressors:');
        factors.push(...intersectionalProfile.compoundedStressors.map(stressor => `- ${stressor}`));
        factors.push('Resilience factors:');
        factors.push(...intersectionalProfile.resilienenceFactors.map(resilience => `- ${resilience}`));
      }
    }
    
    return factors;
  }

  private findIntersectionalKey(identityFactors: string[], culturalBackground: string[]): string | null {
    // Check for LGBTQ+ people of color
    const hasLGBTQ = identityFactors.some(factor => 
      ['lgbtq', 'gay', 'lesbian', 'bisexual', 'transgender', 'queer'].includes(factor.toLowerCase())
    );
    const hasPOC = culturalBackground.some(culture => 
      ['african_american', 'latino', 'asian', 'indigenous', 'middle_eastern'].includes(culture.toLowerCase())
    );
    
    if (hasLGBTQ && hasPOC) {
      return 'lgbtq_poc';
    }
    
    // Check for Two-Spirit identity
    if (identityFactors.includes('two_spirit') || 
        (hasLGBTQ && culturalBackground.includes('indigenous'))) {
      return 'two_spirit';
    }
    
    return null;
  }

  /**
   * Provides cultural crisis interpretation
   */
  interpretCulturalExpression(
    expression: string,
    culturalContext: string[]
  ): {
    interpretation: string;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    culturalMeaning: string;
    appropriateResponse: string[];
  } | null {
    
    for (const culture of culturalContext) {
      const profile = this.culturalProfiles.get(culture.toLowerCase());
      if (profile) {
        for (const culturalExpr of profile.commonExpressions) {
          if (expression.toLowerCase().includes(culturalExpr.expression.toLowerCase()) ||
              culturalExpr.alternativeExpressions.some(alt => 
                expression.toLowerCase().includes(alt.toLowerCase())
              )) {
            
            return {
              interpretation: culturalExpr.meaning,
              severity: culturalExpr.severity,
              culturalMeaning: culturalExpr.context,
              appropriateResponse: this.getAppropriateResponse(culturalExpr, culture)
            };
          }
        }
      }
    }
    
    return null;
  }

  private getAppropriateResponse(expression: CulturalExpression, culture: string): string[] {
    const responses: string[] = [];
    
    // Get cultural profile for response guidance
    const profile = this.culturalProfiles.get(culture.toLowerCase());
    if (profile) {
      // Add healing tradition options
      profile.healingTraditions.forEach(tradition => {
        if (tradition.appropriateness === 'crisis') {
          responses.push(`Consider ${tradition.name}: ${tradition.description}`);
        }
      });
      
      // Add spiritual considerations
      profile.spiritualConsiderations.forEach(spiritual => {
        responses.push(`Spiritual approach: ${spiritual.respectfulApproach.join(', ')}`);
      });
      
      // Add family dynamic considerations
      profile.familyDynamics.forEach(dynamic => {
        responses.push(`Family consideration: ${dynamic.interventionConsiderations.join(', ')}`);
      });
    }
    
    return responses;
  }

  /**
   * Generates culturally responsive safety plan
   */
  generateCulturalSafetyPlan(userContext: UserContext): {
    culturalWarningSigns: string[];
    culturalCopingStrategies: string[];
    culturalSupports: string[];
    spiritualResources: string[];
    communityConnections: string[];
  } {
    
    const culturalWarningSigns: string[] = [];
    const culturalCopingStrategies: string[] = [];
    const culturalSupports: string[] = [];
    const spiritualResources: string[] = [];
    const communityConnections: string[] = [];
    
    userContext.demographics.culturalBackground.forEach(culture => {
      const profile = this.culturalProfiles.get(culture.toLowerCase());
      if (profile) {
        // Add cultural expressions as warning signs
        profile.commonExpressions.forEach(expression => {
          if (expression.severity === 'high' || expression.severity === 'critical') {
            culturalWarningSigns.push(`When expressing: "${expression.expression}"`);
          }
        });
        
        // Add healing traditions as coping strategies
        profile.healingTraditions.forEach(tradition => {
          culturalCopingStrategies.push(`${tradition.name}: ${tradition.methods.join(', ')}`);
          tradition.practitioners.forEach(practitioner => {
            spiritualResources.push(practitioner);
          });
        });
        
        // Add family and community supports
        profile.familyDynamics.forEach(dynamic => {
          culturalSupports.push(dynamic.concept);
        });
        
        // Add spiritual resources
        profile.spiritualConsiderations.forEach(spiritual => {
          spiritual.resourceConnections.forEach(resource => {
            spiritualResources.push(resource);
          });
        });
        
        // Add adapted resources as community connections
        profile.resourceAdaptations.forEach(adaptation => {
          adaptation.communityAlternatives.forEach(alternative => {
            communityConnections.push(alternative);
          });
        });
      }
    });
    
    return {
      culturalWarningSigns: [...new Set(culturalWarningSigns)],
      culturalCopingStrategies: [...new Set(culturalCopingStrategies)],
      culturalSupports: [...new Set(culturalSupports)],
      spiritualResources: [...new Set(spiritualResources)],
      communityConnections: [...new Set(communityConnections)]
    };
  }
}

export default CulturalCrisisCompetency;
export type { 
  CulturalCrisisProfile, 
  CulturalExpression, 
  HistoricalTrauma, 
  HealingTradition,
  IntersectionalIdentity 
};