/**
 * ALCHM Cultural Trauma Recognition System
 * Validates AI detection of cultural trauma patterns including intergenerational,
 * religious, immigration, and systemic trauma across diverse communities
 */

import { TraumaPattern, TraumaValidationResult, CulturalTraumaContext } from '@/types/cultural-trauma';

interface TraumaType {
  name: string;
  category: 'intergenerational' | 'religious' | 'immigration' | 'systemic' | 'identity-based';
  affectedCommunities: string[];
  manifestations: TraumaManifestation[];
  triggerPatterns: string[];
  healingApproaches: HealingApproach[];
  validationCriteria: ValidationCriteria;
}

interface TraumaManifestation {
  type: 'somatic' | 'emotional' | 'behavioral' | 'relational' | 'spiritual';
  description: string;
  culturalExpression: string;
  severity: 'mild' | 'moderate' | 'severe';
  communitySpecific: boolean;
}

interface HealingApproach {
  name: string;
  culturalOrigin: string;
  description: string;
  accessibility: 'high' | 'medium' | 'low';
  evidenceBased: boolean;
  communityEndorsed: boolean;
}

interface ValidationCriteria {
  requiresCommunityValidation: boolean;
  culturalCompetencyRequired: boolean;
  sensitiveTopic: boolean;
  potentialForRetraumatization: 'high' | 'medium' | 'low';
}

export class CulturalTraumaDetector {
  private traumaTypes: Map<string, TraumaType> = new Map();
  private validationResults: Map<string, TraumaValidationResult[]> = new Map();

  constructor() {
    this.initializeTraumaTypes();
  }

  private initializeTraumaTypes(): void {
    // Intergenerational Trauma Types
    this.traumaTypes.set('slavery-intergenerational', {
      name: 'Slavery and Post-Slavery Intergenerational Trauma',
      category: 'intergenerational',
      affectedCommunities: ['african-american', 'afro-caribbean', 'african-diaspora'],
      manifestations: [
        {
          type: 'somatic',
          description: 'Chronic hypervigilance and stress responses',
          culturalExpression: 'Body holding trauma from ancestral survival strategies',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'emotional',
          description: 'Deep-seated fear of separation and abandonment',
          culturalExpression: 'Fear of family separation echoing historical trauma',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'relational',
          description: 'Complex relationship with authority and institutions',
          culturalExpression: 'Mistrust of systems stemming from historical oppression',
          severity: 'moderate',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'feeling like my ancestors pain lives in my body',
        'generational patterns of struggle keep repeating',
        'carrying weight of my family\'s history',
        'trauma that goes back generations',
        'ancestral wounds that won\'t heal',
        'inherited pain from slavery'
      ],
      healingApproaches: [
        {
          name: 'Ancestral Healing Practices',
          culturalOrigin: 'African Traditional',
          description: 'Connecting with ancestral wisdom and strength',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        },
        {
          name: 'Community Healing Circles',
          culturalOrigin: 'Pan-African',
          description: 'Collective processing of historical trauma',
          accessibility: 'high',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    this.traumaTypes.set('holocaust-intergenerational', {
      name: 'Holocaust Intergenerational Trauma',
      category: 'intergenerational',
      affectedCommunities: ['jewish', 'ashkenazi', 'holocaust-survivors'],
      manifestations: [
        {
          type: 'emotional',
          description: 'Chronic anxiety and hypervigilance',
          culturalExpression: 'Constant fear of persecution and loss',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'behavioral',
          description: 'Hoarding behaviors and food anxiety',
          culturalExpression: 'Scarcity mindset from survival trauma',
          severity: 'moderate',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'inherited fear from the holocaust',
        'generational trauma from persecution',
        'survivor guilt passed down',
        'family silence about the past',
        'anxiety about being targeted'
      ],
      healingApproaches: [
        {
          name: 'Narrative Therapy',
          culturalOrigin: 'Jewish Therapeutic Tradition',
          description: 'Reclaiming family stories and resilience',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    this.traumaTypes.set('boarding-school-intergenerational', {
      name: 'Indigenous Boarding School Intergenerational Trauma',
      category: 'intergenerational',
      affectedCommunities: ['indigenous', 'native-american', 'first-nations'],
      manifestations: [
        {
          type: 'spiritual',
          description: 'Disconnection from traditional spiritual practices',
          culturalExpression: 'Loss of sacred connection and ceremony',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'relational',
          description: 'Difficulty with emotional expression and attachment',
          culturalExpression: 'Learned emotional suppression from forced assimilation',
          severity: 'severe',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'cultural practices taken from my family',
        'language lost through boarding schools',
        'trauma from forced assimilation',
        'disconnected from my tribal identity',
        'ancestral ways were forbidden'
      ],
      healingApproaches: [
        {
          name: 'Traditional Ceremony and Ritual',
          culturalOrigin: 'Indigenous Traditional',
          description: 'Reconnecting with ancestral healing practices',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        },
        {
          name: 'Land-Based Healing',
          culturalOrigin: 'Indigenous Traditional',
          description: 'Healing through connection to ancestral lands',
          accessibility: 'low',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    // Religious Trauma Types
    this.traumaTypes.set('religious-conversion-therapy', {
      name: 'Religious Conversion Therapy Trauma',
      category: 'religious',
      affectedCommunities: ['lgbtq', 'ex-religious', 'religious-minorities'],
      manifestations: [
        {
          type: 'emotional',
          description: 'Internalized shame about identity',
          culturalExpression: 'Belief that core identity is sinful or wrong',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'spiritual',
          description: 'Complex relationship with spirituality and faith',
          culturalExpression: 'Spiritual homelessness and religious confusion',
          severity: 'moderate',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'told my identity was sinful',
        'forced into conversion therapy',
        'religious trauma from being LGBTQ',
        'church rejected me for who I am',
        'faith used as weapon against me'
      ],
      healingApproaches: [
        {
          name: 'LGBTQ-Affirming Spiritual Counseling',
          culturalOrigin: 'Progressive Religious Communities',
          description: 'Integrating faith and identity affirmation',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    this.traumaTypes.set('religious-abuse', {
      name: 'Religious Institution Abuse Trauma',
      category: 'religious',
      affectedCommunities: ['catholic', 'evangelical', 'orthodox', 'cult-survivors'],
      manifestations: [
        {
          type: 'emotional',
          description: 'Complex religious trauma and spiritual betrayal',
          culturalExpression: 'Trust issues with religious authority and God',
          severity: 'severe',
          communitySpecific: false
        }
      ],
      triggerPatterns: [
        'abused by religious leader',
        'betrayed by church community',
        'spiritual abuse and manipulation',
        'religious authority exploited me'
      ],
      healingApproaches: [
        {
          name: 'Religious Trauma Therapy',
          culturalOrigin: 'Secular Therapeutic',
          description: 'Specialized therapy for religious trauma recovery',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: false,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    // Immigration Trauma Types
    this.traumaTypes.set('forced-migration-trauma', {
      name: 'Forced Migration and Refugee Trauma',
      category: 'immigration',
      affectedCommunities: ['refugees', 'asylum-seekers', 'displaced-persons'],
      manifestations: [
        {
          type: 'somatic',
          description: 'Chronic stress from displacement and uncertainty',
          culturalExpression: 'Body holding fear from persecution and flight',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'relational',
          description: 'Loss of cultural identity and community connections',
          culturalExpression: 'Grief for lost homeland and cultural practices',
          severity: 'moderate',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'fled persecution in my homeland',
        'lost everything when we escaped',
        'trauma from war and displacement',
        'family separated during migration',
        'typeof window !== 'undefined' && documentation fears and deportation anxiety'
      ],
      healingApproaches: [
        {
          name: 'Culturally Responsive Trauma Therapy',
          culturalOrigin: 'Multicultural Therapeutic',
          description: 'Trauma therapy that honors cultural background',
          accessibility: 'low',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });

    // Systemic Trauma Types
    this.traumaTypes.set('medical-racism-trauma', {
      name: 'Medical Racism and Healthcare Trauma',
      category: 'systemic',
      affectedCommunities: ['african-american', 'indigenous', 'latino', 'asian-american'],
      manifestations: [
        {
          type: 'behavioral',
          description: 'Avoidance of healthcare systems',
          culturalExpression: 'Mistrust of medical professionals and institutions',
          severity: 'moderate',
          communitySpecific: true
        },
        {
          type: 'emotional',
          description: 'Anxiety and fear around medical care',
          culturalExpression: 'Fear of discrimination and inadequate care',
          severity: 'moderate',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'doctors don\'t believe my pain',
        'medical racism in healthcare',
        'dismissed because of my race',
        'afraid to go to hospital',
        'medical system failed my family'
      ],
      healingApproaches: [
        {
          name: 'Cultural Health Advocacy',
          culturalOrigin: 'Community Health',
          description: 'Advocacy and support for culturally competent care',
          accessibility: 'medium',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'medium'
      }
    });

    // Identity-Based Trauma Types
    this.traumaTypes.set('gender-identity-trauma', {
      name: 'Gender Identity and Transition Trauma',
      category: 'identity-based',
      affectedCommunities: ['transgender', 'non-binary', 'gender-questioning'],
      manifestations: [
        {
          type: 'emotional',
          description: 'Gender dysphoria and identity distress',
          culturalExpression: 'Pain from misalignment between identity and assigned gender',
          severity: 'severe',
          communitySpecific: true
        },
        {
          type: 'relational',
          description: 'Social rejection and family estrangement',
          culturalExpression: 'Loss of relationships due to gender identity',
          severity: 'severe',
          communitySpecific: true
        }
      ],
      triggerPatterns: [
        'family rejected my gender identity',
        'transition process trauma',
        'medical gatekeeping for trans care',
        'workplace discrimination for being trans',
        'violence for not conforming to gender norms'
      ],
      healingApproaches: [
        {
          name: 'Gender-Affirming Therapy',
          culturalOrigin: 'LGBTQ+ Therapeutic',
          description: 'Therapy that affirms and supports gender identity',
          accessibility: 'low',
          evidenceBased: true,
          communityEndorsed: true
        }
      ],
      validationCriteria: {
        requiresCommunityValidation: true,
        culturalCompetencyRequired: true,
        sensitiveTopic: true,
        potentialForRetraumatization: 'high'
      }
    });
  }

  async validateTraumaDetection(
    text: string,
    userCulturalContext: string[],
    language: string = 'en'
  ): Promise<TraumaValidationResult> {
    const detectedTraumas = await this.detectCulturalTraumas(text, userCulturalContext, language);
    
    return {
      hasTraumaIndicators: detectedTraumas.length > 0,
      detectedTraumas: detectedTraumas,
      culturalContext: userCulturalContext,
      confidence: this.calculateTraumaConfidence(detectedTraumas),
      validationRequired: this.requiresValidation(detectedTraumas),
      culturallyInformedResponse: this.generateCulturallyInformedResponse(detectedTraumas, userCulturalContext),
      healingRecommendations: this.getHealingRecommendations(detectedTraumas, userCulturalContext),
      safeguards: this.implementSafeguards(detectedTraumas),
      communityResources: this.getCommunitySpecificResources(detectedTraumas, userCulturalContext)
    };
  }

  private async detectCulturalTraumas(
    text: string,
    culturalContext: string[],
    language: string
  ): Promise<DetectedTrauma[]> {
    const detectedTraumas: DetectedTrauma[] = [];
    const textLower = text.toLowerCase();

    for (const [traumaId, traumaType] of this.traumaTypes) {
      // Check if user's cultural context aligns with affected communities
      const isRelevantCommunity = traumaType.affectedCommunities.some(community =>
        culturalContext.includes(community)
      );

      if (!isRelevantCommunity) continue;

      // Check for trigger patterns
      const matchedPatterns = traumaType.triggerPatterns.filter(pattern =>
        this.semanticMatch(textLower, pattern.toLowerCase(), language)
      );

      if (matchedPatterns.length > 0) {
        detectedTraumas.push({
          traumaType: traumaType,
          matchedPatterns: matchedPatterns,
          confidence: this.calculatePatternConfidence(matchedPatterns, traumaType.triggerPatterns),
          severity: this.assessSeverity(matchedPatterns, traumaType),
          culturalRelevance: this.assessCulturalRelevance(traumaType, culturalContext),
          requiresSpecializedCare: traumaType.validationCriteria.potentialForRetraumatization === 'high'
        });
      }
    }

    return detectedTraumas;
  }

  private semanticMatch(text: string, pattern: string, language: string): boolean {
    // Enhanced semantic matching for cultural trauma patterns
    const textWords = text.split(' ');
    const patternWords = pattern.split(' ');
    
    // Check for exact phrase match first
    if (text.includes(pattern)) return true;
    
    // Check for word overlap with cultural sensitivity
    const overlap = patternWords.filter(word => 
      textWords.some(textWord => {
        // Handle cultural terminology and variations
        if (this.areCulturallyEquivalent(word, textWord, language)) return true;
        return textWord.includes(word) || word.includes(textWord);
      })
    ).length;
    
    return overlap >= Math.ceil(patternWords.length * 0.7);
  }

  private areCulturallyEquivalent(word1: string, word2: string, language: string): boolean {
    // Cultural term equivalencies for trauma detection
    const equivalencies: Record<string, string[][]> = {
      'en': [
        ['trauma', 'pain', 'wound', 'hurt'],
        ['ancestral', 'generational', 'inherited', 'family'],
        ['persecution', 'oppression', 'discrimination', 'targeting'],
        ['healing', 'recovery', 'restoration', 'renewal']
      ],
      'es': [
        ['trauma', 'dolor', 'herida', 'sufrimiento'],
        ['ancestral', 'generacional', 'hereditario', 'familiar'],
        ['persecución', 'opresión', 'discriminación']
      ]
    };

    const langEquivalencies = equivalencies[language] || [];
    
    return langEquivalencies.some(group =>
      group.includes(word1) && group.includes(word2)
    );
  }

  private calculatePatternConfidence(
    matchedPatterns: string[],
    allPatterns: string[]
  ): number {
    const baseConfidence = matchedPatterns.length / allPatterns.length;
    const specificityBonus = matchedPatterns.length > 1 ? 0.2 : 0;
    
    return Math.min(baseConfidence + specificityBonus, 1.0);
  }

  private assessSeverity(matchedPatterns: string[], traumaType: TraumaType): 'mild' | 'moderate' | 'severe' {
    // Assess severity based on pattern intensity and trauma type
    const highSeverityPatterns = traumaType.triggerPatterns.filter(pattern =>
      pattern.includes('forced') || pattern.includes('abuse') || pattern.includes('violence')
    );

    const hasHighSeverityMatch = matchedPatterns.some(pattern =>
      highSeverityPatterns.includes(pattern)
    );

    if (hasHighSeverityMatch) return 'severe';
    if (matchedPatterns.length > 1) return 'moderate';
    return 'mild';
  }

  private assessCulturalRelevance(traumaType: TraumaType, culturalContext: string[]): number {
    const relevantCommunities = traumaType.affectedCommunities.filter(community =>
      culturalContext.includes(community)
    );

    return relevantCommunities.length / traumaType.affectedCommunities.length;
  }

  private calculateTraumaConfidence(detectedTraumas: DetectedTrauma[]): number {
    if (detectedTraumas.length === 0) return 0;

    const averageConfidence = detectedTraumas.reduce((sum, trauma) => 
      sum + trauma.confidence, 0) / detectedTraumas.length;

    const severityBonus = detectedTraumas.some(t => t.severity === 'severe') ? 0.2 : 0;
    const multipleTraumasBonus = detectedTraumas.length > 1 ? 0.1 : 0;

    return Math.min(averageConfidence + severityBonus + multipleTraumasBonus, 1.0);
  }

  private requiresValidation(detectedTraumas: DetectedTrauma[]): boolean {
    return detectedTraumas.some(trauma => 
      trauma.traumaType.validationCriteria.requiresCommunityValidation ||
      trauma.severity === 'severe'
    );
  }

  private generateCulturallyInformedResponse(
    detectedTraumas: DetectedTrauma[],
    culturalContext: string[]
  ): string {
    if (detectedTraumas.length === 0) {
      return "Thank you for sharing. I'm here to support you.";
    }

    const traumaCategories = [...new Set(detectedTraumas.map(t => t.traumaType.category))];
    
    let response = "I recognize that you may be experiencing trauma that connects to your cultural background. ";

    if (traumaCategories.includes('intergenerational')) {
      response += "Intergenerational trauma can feel like carrying the weight of your ancestors' experiences. ";
    }

    if (traumaCategories.includes('religious')) {
      response += "Religious trauma can create complex feelings about faith and spirituality. ";
    }

    if (traumaCategories.includes('systemic')) {
      response += "Systemic trauma from discrimination and oppression is real and valid. ";
    }

    response += "Your experiences are valid, and healing is possible through culturally responsive approaches.";

    return response;
  }

  private getHealingRecommendations(
    detectedTraumas: DetectedTrauma[],
    culturalContext: string[]
  ): HealingRecommendation[] {
    const recommendations: HealingRecommendation[] = [];

    for (const trauma of detectedTraumas) {
      for (const approach of trauma.traumaType.healingApproaches) {
        if (approach.communityEndorsed && approach.accessibility !== 'low') {
          recommendations.push({
            approach: approach.name,
            description: approach.description,
            culturalOrigin: approach.culturalOrigin,
            accessibility: approach.accessibility,
            traumaRelevance: trauma.traumaType.name,
            evidenceBased: approach.evidenceBased
          });
        }
      }
    }

    return recommendations;
  }

  private implementSafeguards(detectedTraumas: DetectedTrauma[]): SafeguardMeasure[] {
    const safeguards: SafeguardMeasure[] = [];

    const hasHighRiskTrauma = detectedTraumas.some(trauma =>
      trauma.traumaType.validationCriteria.potentialForRetraumatization === 'high'
    );

    if (hasHighRiskTrauma) {
      safeguards.push({
        type: 'retraumatization-prevention',
        description: 'Gentle, trauma-informed communication required',
        implementation: 'Use validating language and avoid triggering questions'
      });

      safeguards.push({
        type: 'professional-referral',
        description: 'Recommend specialized trauma therapy',
        implementation: 'Provide culturally competent trauma therapy resources'
      });
    }

    if (detectedTraumas.some(t => t.traumaType.validationCriteria.sensitiveTopic)) {
      safeguards.push({
        type: 'cultural-sensitivity',
        description: 'Approach with cultural humility and respect',
        implementation: 'Acknowledge cultural context and avoid assumptions'
      });
    }

    return safeguards;
  }

  private getCommunitySpecificResources(
    detectedTraumas: DetectedTrauma[],
    culturalContext: string[]
  ): CommunityResource[] {
    const resources: CommunityResource[] = [];

    // Map community-specific trauma resources
    const resourceMap: Record<string, CommunityResource[]> = {
      'african-american': [
        {
          name: 'National Queer and Trans Therapists of Color Network',
          type: 'professional-network',
          specialization: 'intersectional-trauma',
          culturalFocus: 'Black LGBTQ+'
        },
        {
          name: 'Black Mental Health Alliance',
          type: 'community-organization',
          specialization: 'racial-trauma',
          culturalFocus: 'African American'
        }
      ],
      'indigenous': [
        {
          name: 'National Board for Certified Counselors Indigenous Healing',
          type: 'professional-network',
          specialization: 'traditional-healing',
          culturalFocus: 'Indigenous/Native American'
        }
      ],
      'lgbtq': [
        {
          name: 'LGBT National Hotline',
          type: 'crisis-support',
          specialization: 'identity-affirming',
          culturalFocus: 'LGBTQ+'
        }
      ]
    };

    for (const context of culturalContext) {
      const contextResources = resourceMap[context] || [];
      resources.push(...contextResources);
    }

    return resources;
  }

  async runTraumaValidationSuite(): Promise<Map<string, TraumaValidationResult[]>> {
    const testCases = this.generateTraumaTestCases();
    const results = new Map<string, TraumaValidationResult[]>();

    for (const [traumaType, cases] of testCases) {
      const traumaResults: TraumaValidationResult[] = [];

      for (const testCase of cases) {
        const result = await this.validateTraumaDetection(
          testCase.text,
          testCase.culturalContext,
          testCase.language
        );

        traumaResults.push({
          ...result,
          testCase: testCase,
          accuracy: this.assessAccuracy(result, testCase)
        });
      }

      results.set(traumaType, traumaResults);
    }

    return results;
  }

  private generateTraumaTestCases(): Map<string, TraumaTestCase[]> {
    // Generate comprehensive test cases for trauma detection validation
    return new Map([
      ['intergenerational-trauma', [
        {
          text: "I feel like I'm carrying my ancestors' pain in my body",
          culturalContext: ['african-american'],
          language: 'en',
          expectedTrauma: true,
          traumaType: 'slavery-intergenerational'
        },
        {
          text: "My family never talks about what happened during the Holocaust",
          culturalContext: ['jewish'],
          language: 'en',
          expectedTrauma: true,
          traumaType: 'holocaust-intergenerational'
        }
      ]],
      ['religious-trauma', [
        {
          text: "The church told me being gay was a sin and tried to change me",
          culturalContext: ['lgbtq', 'christian'],
          language: 'en',
          expectedTrauma: true,
          traumaType: 'religious-conversion-therapy'
        }
      ]]
    ]);
  }

  private assessAccuracy(result: TraumaValidationResult, testCase: TraumaTestCase): boolean {
    return result.hasTraumaIndicators === testCase.expectedTrauma;
  }

  generateTraumaValidationReport(): TraumaValidationReport {
    const report: TraumaValidationReport = {
      overallAccuracy: 0,
      traumaTypeAccuracy: new Map(),
      culturalSensitivityScore: 0,
      safeguardImplementation: new Map(),
      communityValidationNeeded: [],
      recommendations: []
    };

    // Implementation would analyze validation results and generate comprehensive report
    
    return report;
  }
}

// Type definitions
interface DetectedTrauma {
  traumaType: TraumaType;
  matchedPatterns: string[];
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  culturalRelevance: number;
  requiresSpecializedCare: boolean;
}

interface HealingRecommendation {
  approach: string;
  description: string;
  culturalOrigin: string;
  accessibility: 'high' | 'medium' | 'low';
  traumaRelevance: string;
  evidenceBased: boolean;
}

interface SafeguardMeasure {
  type: string;
  description: string;
  implementation: string;
}

interface CommunityResource {
  name: string;
  type: string;
  specialization: string;
  culturalFocus: string;
}

interface TraumaTestCase {
  text: string;
  culturalContext: string[];
  language: string;
  expectedTrauma: boolean;
  traumaType: string;
}

interface TraumaValidationReport {
  overallAccuracy: number;
  traumaTypeAccuracy: Map<string, number>;
  culturalSensitivityScore: number;
  safeguardImplementation: Map<string, number>;
  communityValidationNeeded: string[];
  recommendations: string[];
}

export default CulturalTraumaDetector;