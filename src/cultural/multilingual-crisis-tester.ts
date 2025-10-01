/**
 * ALCHM Multilingual Crisis Support Testing System
 * Validates crisis detection and resource provision across 6 languages with cultural context
 * Ensures culturally nuanced understanding of crisis expressions
 */

import { MultilingualTestResult, CulturalCrisisExpression, LanguageCrisisPattern } from '@/types/multilingual-crisis';

interface LanguageConfig {
  code: string;
  name: string;
  culturalContexts: string[];
  crisisExpressions: CulturalCrisisExpression[];
  emotionalVocabulary: EmotionalTerm[];
  communicationPatterns: CommunicationPattern[];
  resourceTranslations: Map<string, string>;
}

interface CulturalCrisisExpression {
  expression: string;
  literal: string;
  culturalMeaning: string;
  severity: 'low' | 'moderate' | 'high' | 'emergency';
  context: string;
  falsePositiveRisk: boolean;
  requiredCulturalKnowledge: string[];
}

interface EmotionalTerm {
  term: string;
  englishEquivalent?: string;
  culturalNuance: string;
  untranslatable: boolean;
  relatedConcepts: string[];
}

interface CommunicationPattern {
  pattern: string;
  description: string;
  crisisRelevance: 'high' | 'medium' | 'low';
  culturalImportance: string;
}

interface TestCase {
  id: string;
  language: string;
  text: string;
  expectedCrisis: boolean;
  crisisType?: string;
  culturalContext: string[];
  notes: string;
}

export class MultilingualCrisisTester {
  private languageConfigs: Map<string, LanguageConfig> = new Map();
  private testResults: Map<string, MultilingualTestResult[]> = new Map();

  constructor() {
    this.initializeLanguageConfigs();
  }

  private initializeLanguageConfigs(): void {
    // Spanish (Español) Configuration
    this.languageConfigs.set('es', {
      code: 'es',
      name: 'Español',
      culturalContexts: ['latino', 'hispanic', 'chicano', 'indigenous-latin'],
      crisisExpressions: [
        {
          expression: 'Se me está acabando el mundo',
          literal: 'My world is ending',
          culturalMeaning: 'Profound sense of despair and hopelessness, often expressing familial or spiritual crisis',
          severity: 'high',
          context: 'Used when feeling complete loss of control or purpose',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['familismo', 'religious-undertones']
        },
        {
          expression: 'Ya no puedo con esta carga',
          literal: 'I can no longer carry this burden',
          culturalMeaning: 'Expression of being overwhelmed by family/community responsibilities',
          severity: 'moderate',
          context: 'Often related to cultural expectations and family obligations',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['familismo', 'machismo-expectations']
        },
        {
          expression: 'Me siento como alma en pena',
          literal: 'I feel like a soul in sorrow',
          culturalMeaning: 'Deep spiritual and emotional pain, connection to ancestral suffering',
          severity: 'moderate',
          context: 'Spiritual distress with cultural/religious undertones',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['spiritual-worldview', 'ancestral-connection']
        },
        {
          expression: 'Estoy hecho polvo',
          literal: 'I am made dust',
          culturalMeaning: 'Complete exhaustion and breakdown, often from overwork or stress',
          severity: 'moderate',
          context: 'Physical and emotional exhaustion',
          falsePositiveRisk: true,
          requiredCulturalKnowledge: ['work-ethic-culture']
        }
      ],
      emotionalVocabulary: [
        {
          term: 'pena',
          englishEquivalent: 'sorrow',
          culturalNuance: 'Deep sorrow that connects to family, loss, and spiritual pain',
          untranslatable: true,
          relatedConcepts: ['duende', 'saudade', 'tristeza']
        },
        {
          term: 'coraje',
          englishEquivalent: 'anger',
          culturalNuance: 'Righteous anger, often at injustice or family dishonor',
          untranslatable: false,
          relatedConcepts: ['dignidad', 'respeto']
        },
        {
          term: 'vergüenza',
          englishEquivalent: 'shame',
          culturalNuance: 'Family shame that affects entire extended family honor',
          untranslatable: false,
          relatedConcepts: ['honor', 'familia', 'respeto']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Indirect expression of distress',
          description: 'Often expressed through metaphor, physical symptoms, or family concerns',
          crisisRelevance: 'high',
          culturalImportance: 'Respecting cultural communication styles prevents misdiagnosis'
        },
        {
          pattern: 'Collective vs individual framing',
          description: 'Crisis often framed in terms of impact on family/community',
          crisisRelevance: 'high',
          culturalImportance: 'Understanding familismo and collective identity'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', 'Línea de crisis'],
        ['mental-health-support', 'Apoyo de salud mental'],
        ['family-counseling', 'Consejería familiar'],
        ['spiritual-support', 'Apoyo espiritual']
      ])
    });

    // Portuguese (Português) Configuration
    this.languageConfigs.set('pt', {
      code: 'pt',
      name: 'Português',
      culturalContexts: ['brazilian', 'lusophone', 'afro-brazilian'],
      crisisExpressions: [
        {
          expression: 'Estou com uma saudade que dói na alma',
          literal: 'I have a longing that hurts in the soul',
          culturalMeaning: 'Deep emotional pain from separation, loss, or unfulfilled longing',
          severity: 'moderate',
          context: 'Saudade is culturally specific Brazilian emotional concept',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['saudade-concept', 'spiritual-pain']
        },
        {
          expression: 'Não tenho mais axé',
          literal: 'I no longer have axé',
          culturalMeaning: 'Loss of life force/spiritual energy, deeply concerning in Afro-Brazilian culture',
          severity: 'high',
          context: 'Afro-Brazilian spiritual concept of life force',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['afro-brazilian-spirituality', 'axé-concept']
        },
        {
          expression: 'Estou desencontrado da vida',
          literal: 'I am unencountered with life',
          culturalMeaning: 'Feeling disconnected from one\'s life path and purpose',
          severity: 'moderate',
          context: 'Existential crisis and disconnection',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['existential-concepts']
        }
      ],
      emotionalVocabulary: [
        {
          term: 'saudade',
          culturalNuance: 'Bittersweet longing for something/someone absent, mix of love, loss, and hope',
          untranslatable: true,
          relatedConcepts: ['melancolia', 'nostalgia', 'amor']
        },
        {
          term: 'axé',
          culturalNuance: 'Spiritual life force and positive energy in Afro-Brazilian culture',
          untranslatable: true,
          relatedConcepts: ['energia', 'força-vital', 'espiritualidade']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Emotional expressiveness',
          description: 'More open emotional expression compared to other cultures',
          crisisRelevance: 'medium',
          culturalImportance: 'Understanding baseline emotional expression levels'
        },
        {
          pattern: 'Spiritual/religious integration',
          description: 'Crisis often discussed in spiritual or religious terms',
          crisisRelevance: 'high',
          culturalImportance: 'Respecting diverse spiritual traditions'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', 'Linha de crise'],
        ['mental-health-support', 'Apoio de saúde mental'],
        ['spiritual-counseling', 'Aconselhamento espiritual']
      ])
    });

    // Korean (한국어) Configuration
    this.languageConfigs.set('ko', {
      code: 'ko',
      name: '한국어',
      culturalContexts: ['korean', 'korean-american', 'confucian'],
      crisisExpressions: [
        {
          expression: '한이 맺혔어요',
          literal: 'Han has formed',
          culturalMeaning: 'Deep, generational sorrow and resentment from oppression or loss',
          severity: 'high',
          context: 'Han is a uniquely Korean emotional concept of collective suffering',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['han-concept', 'collective-trauma', 'historical-oppression']
        },
        {
          expression: '체면이 말이 아니에요',
          literal: 'My face/dignity is not words',
          culturalMeaning: 'Extreme shame and loss of social standing, potentially suicidal',
          severity: 'emergency',
          context: 'Loss of face/dignity is extremely serious in Korean culture',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['chemyeon-concept', 'social-hierarchy', 'shame-culture']
        },
        {
          expression: '정이 떨어졌어요',
          literal: 'Jeong has fallen away',
          culturalMeaning: 'Loss of emotional connection and belonging, severe isolation',
          severity: 'moderate',
          context: 'Jeong represents emotional bonds crucial to Korean well-being',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['jeong-concept', 'relational-culture']
        }
      ],
      emotionalVocabulary: [
        {
          term: '한 (han)',
          culturalNuance: 'Collective sorrow, resentment, and hope despite oppression',
          untranslatable: true,
          relatedConcepts: ['슬픔', '원한', '희망']
        },
        {
          term: '정 (jeong)',
          culturalNuance: 'Deep emotional bonds and affection connecting people',
          untranslatable: true,
          relatedConcepts: ['사랑', '애정', '인연']
        },
        {
          term: '체면 (chemyeon)',
          culturalNuance: 'Social face and dignity, crucial for identity',
          untranslatable: true,
          relatedConcepts: ['자존심', '명예', '위신']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Indirect communication',
          description: 'Crisis often expressed indirectly through context and implication',
          crisisRelevance: 'high',
          culturalImportance: 'Understanding high-context communication prevents missed crises'
        },
        {
          pattern: 'Hierarchical expression',
          description: 'Different language and expression based on social relationships',
          crisisRelevance: 'medium',
          culturalImportance: 'Recognizing formality levels and social dynamics'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', '위기 상담전화'],
        ['mental-health-support', '정신건강 지원'],
        ['family-counseling', '가족 상담']
      ])
    });

    // Hindi (हिन्दी) Configuration
    this.languageConfigs.set('hi', {
      code: 'hi',
      name: 'हिन्दी',
      culturalContexts: ['indian', 'hindu', 'south-asian'],
      crisisExpressions: [
        {
          expression: 'मेरा धैर्य टूट गया है',
          literal: 'My patience/endurance has broken',
          culturalMeaning: 'Complete loss of spiritual strength and resilience',
          severity: 'high',
          context: 'Dharya (patience/endurance) is core spiritual virtue',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['dharmic-concepts', 'spiritual-virtues']
        },
        {
          expression: 'मैं कर्म के जाल में फंस गया हूं',
          literal: 'I am trapped in the web of karma',
          culturalMeaning: 'Feeling helpless against consequences of past actions',
          severity: 'moderate',
          context: 'Karmic understanding of suffering and consequences',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['karma-concept', 'dharmic-worldview']
        },
        {
          expression: 'घर में शांति नहीं है',
          literal: 'There is no peace in the house',
          culturalMeaning: 'Family discord affecting entire household\'s well-being',
          severity: 'moderate',
          context: 'Home peace is essential for Indian family structure',
          falsePositiveRisk: true,
          requiredCulturalKnowledge: ['joint-family-system', 'household-harmony']
        }
      ],
      emotionalVocabulary: [
        {
          term: 'दुःख (dukh)',
          englishEquivalent: 'suffering',
          culturalNuance: 'Existential suffering that includes physical, mental, and spiritual pain',
          untranslatable: false,
          relatedConcepts: ['कष्ट', 'पीड़ा', 'संताप']
        },
        {
          term: 'व्याकुलता (vyakulata)',
          englishEquivalent: 'anxiety/restlessness',
          culturalNuance: 'Spiritual restlessness and agitation of the mind',
          untranslatable: false,
          relatedConcepts: ['चिंता', 'बेचैनी', 'अशांति']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Spiritual framework',
          description: 'Crisis often understood through dharmic and karmic concepts',
          crisisRelevance: 'high',
          culturalImportance: 'Understanding spiritual worldview for appropriate support'
        },
        {
          pattern: 'Family-centered expression',
          description: 'Individual crisis affects and involves entire family system',
          crisisRelevance: 'high',
          culturalImportance: 'Recognizing collectivist family dynamics'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', 'संकट सहायता लाइन'],
        ['mental-health-support', 'मानसिक स्वास्थ्य सहायता'],
        ['spiritual-counseling', 'आध्यात्मिक परामर्श']
      ])
    });

    // German (Deutsch) Configuration
    this.languageConfigs.set('de', {
      code: 'de',
      name: 'Deutsch',
      culturalContexts: ['german', 'austrian', 'swiss-german'],
      crisisExpressions: [
        {
          expression: 'Ich bin völlig am Ende',
          literal: 'I am completely at the end',
          culturalMeaning: 'Complete exhaustion and inability to continue',
          severity: 'high',
          context: 'Direct expression of being at breaking point',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['direct-communication-style']
        },
        {
          expression: 'Mir fehlt jeder Lebensmut',
          literal: 'I lack all courage for life',
          culturalMeaning: 'Loss of will to live and motivation for existence',
          severity: 'emergency',
          context: 'Lebensmut is crucial concept for German well-being',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['existential-concepts', 'lebensmut']
        },
        {
          expression: 'Ich habe Weltschmerz',
          literal: 'I have world-pain',
          culturalMeaning: 'Deep melancholy from perceiving world\'s imperfections',
          severity: 'moderate',
          context: 'Philosophical sadness, distinctly German concept',
          falsePositiveRisk: true,
          requiredCulturalKnowledge: ['weltschmerz-concept', 'philosophical-melancholy']
        }
      ],
      emotionalVocabulary: [
        {
          term: 'Weltschmerz',
          englishEquivalent: 'world-weariness',
          culturalNuance: 'Melancholy from idealistic perception of world\'s imperfections',
          untranslatable: true,
          relatedConcepts: ['Melancholie', 'Schwermut', 'Traurigkeit']
        },
        {
          term: 'Fernweh',
          englishEquivalent: 'wanderlust',
          culturalNuance: 'Aching desire to travel and explore distant places',
          untranslatable: true,
          relatedConcepts: ['Sehnsucht', 'Wanderlust']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Direct communication',
          description: 'More direct expression of problems and emotions',
          crisisRelevance: 'medium',
          culturalImportance: 'Understanding cultural directness vs crisis severity'
        },
        {
          pattern: 'Philosophical framing',
          description: 'Crisis often discussed in existential or philosophical terms',
          crisisRelevance: 'medium',
          culturalImportance: 'Distinguishing philosophical contemplation from crisis'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', 'Krisen-Hotline'],
        ['mental-health-support', 'Psychische Gesundheitsunterstützung'],
        ['counseling', 'Beratung']
      ])
    });

    // English Configuration (with cultural variants)
    this.languageConfigs.set('en', {
      code: 'en',
      name: 'English',
      culturalContexts: ['american', 'british', 'african-american', 'indigenous-english'],
      crisisExpressions: [
        {
          expression: 'I\'m at the end of my rope',
          literal: 'I\'m at the end of my rope',
          culturalMeaning: 'No more options or resources available, desperation',
          severity: 'high',
          context: 'American idiom for extreme desperation',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['american-idioms']
        },
        {
          expression: 'I\'m broken',
          literal: 'I\'m broken',
          culturalMeaning: 'Feeling damaged beyond repair, often trauma-related',
          severity: 'high',
          context: 'Common expression for trauma and deep emotional pain',
          falsePositiveRisk: false,
          requiredCulturalKnowledge: ['trauma-language']
        }
      ],
      emotionalVocabulary: [
        {
          term: 'triggered',
          culturalNuance: 'Trauma response activation, requires understanding of trauma-informed language',
          untranslatable: false,
          relatedConcepts: ['activated', 'dysregulated', 'overwhelmed']
        }
      ],
      communicationPatterns: [
        {
          pattern: 'Individual focus',
          description: 'Crisis often framed in individual terms rather than collective',
          crisisRelevance: 'medium',
          culturalImportance: 'Understanding individualistic vs collectivistic expressions'
        }
      ],
      resourceTranslations: new Map([
        ['crisis-hotline', 'Crisis Hotline'],
        ['mental-health-support', 'Mental Health Support']
      ])
    });
  }

  async runMultilingualValidation(): Promise<Map<string, MultilingualTestResult[]>> {
    const results = new Map<string, MultilingualTestResult[]>();

    for (const [languageCode, config] of this.languageConfigs) {
      const testCases = this.generateTestCases(languageCode);
      const languageResults: MultilingualTestResult[] = [];

      for (const testCase of testCases) {
        const result = await this.testCrisisDetection(testCase, config);
        languageResults.push(result);
      }

      results.set(languageCode, languageResults);
    }

    this.testResults = results;
    return results;
  }

  private generateTestCases(languageCode: string): TestCase[] {
    const config = this.languageConfigs.get(languageCode);
    if (!config) return [];

    const testCases: TestCase[] = [];

    // Generate test cases from crisis expressions
    config.crisisExpressions.forEach((expression, index) => {
      testCases.push({
        id: `${languageCode}-crisis-${index}`,
        language: languageCode,
        text: expression.expression,
        expectedCrisis: true,
        crisisType: expression.severity,
        culturalContext: config.culturalContexts,
        notes: expression.culturalMeaning
      });
    });

    // Generate negative test cases (non-crisis expressions)
    const nonCrisisExpressions = this.getNonCrisisExpressions(languageCode);
    nonCrisisExpressions.forEach((expression, index) => {
      testCases.push({
        id: `${languageCode}-non-crisis-${index}`,
        language: languageCode,
        text: expression,
        expectedCrisis: false,
        culturalContext: config.culturalContexts,
        notes: 'Should not trigger crisis detection'
      });
    });

    return testCases;
  }

  private getNonCrisisExpressions(languageCode: string): string[] {
    const expressions: Record<string, string[]> = {
      'es': [
        'Estoy muy feliz con mi familia',
        'Hoy fue un día normal en el trabajo',
        'Me gusta la comida de mi abuela'
      ],
      'pt': [
        'Estou muito alegre hoje',
        'A família está bem',
        'Gosto de música brasileira'
      ],
      'ko': [
        '오늘 날씨가 좋아요',
        '가족과 함께 시간을 보냈어요',
        '한국 음식을 좋아해요'
      ],
      'hi': [
        'आज मैं खुश हूं',
        'परिवार के साथ समय बिताया',
        'भारतीय संस्कृति अच्छी है'
      ],
      'de': [
        'Ich bin heute glücklich',
        'Das Wetter ist schön',
        'Ich mag deutsche Kultur'
      ],
      'en': [
        'I\'m having a good day',
        'Work went well today',
        'I enjoyed time with friends'
      ]
    };

    return expressions[languageCode] || [];
  }

  private async testCrisisDetection(
    testCase: TestCase,
    config: LanguageConfig
  ): Promise<MultilingualTestResult> {
    // Simulate crisis detection with cultural context awareness
    const detectedCrisis = this.detectCrisisWithCulturalContext(
      testCase.text,
      config
    );

    const accuracy = detectedCrisis.hasCrisis === testCase.expectedCrisis;
    
    return {
      testId: testCase.id,
      language: testCase.language,
      testText: testCase.text,
      expectedCrisis: testCase.expectedCrisis,
      detectedCrisis: detectedCrisis.hasCrisis,
      confidence: detectedCrisis.confidence,
      culturalContext: testCase.culturalContext,
      accuracy: accuracy,
      culturalNuancesDetected: detectedCrisis.culturalNuances,
      resourcesProvided: this.getAppropriateResources(
        testCase.language,
        testCase.culturalContext,
        detectedCrisis.crisisType
      ),
      issues: accuracy ? [] : ['Crisis detection mismatch'],
      recommendations: this.generateRecommendations(testCase, detectedCrisis, accuracy)
    };
  }

  private detectCrisisWithCulturalContext(
    text: string,
    config: LanguageConfig
  ): CrisisDetectionResult {
    const textLower = text.toLowerCase();
    const detectedExpressions: CulturalCrisisExpression[] = [];
    const culturalNuances: string[] = [];

    // Check against known crisis expressions
    for (const expression of config.crisisExpressions) {
      if (this.matchesExpression(textLower, expression.expression.toLowerCase())) {
        detectedExpressions.push(expression);
        culturalNuances.push(expression.culturalMeaning);
      }
    }

    // Check emotional vocabulary
    for (const emotionalTerm of config.emotionalVocabulary) {
      if (textLower.includes(emotionalTerm.term.toLowerCase())) {
        culturalNuances.push(`Detected culturally specific term: ${emotionalTerm.term}`);
      }
    }

    const hasCrisis = detectedExpressions.length > 0;
    const severity = detectedExpressions.length > 0 
      ? detectedExpressions[0].severity 
      : 'low';

    const confidence = this.calculateConfidence(detectedExpressions, config);

    return {
      hasCrisis,
      confidence,
      crisisType: severity,
      culturalNuances,
      detectedExpressions
    };
  }

  private matchesExpression(text: string, expression: string): boolean {
    // Simple matching - in production would use more sophisticated NLP
    const textWords = text.split(' ');
    const expressionWords = expression.split(' ');
    
    const matchedWords = expressionWords.filter(word => 
      textWords.some(textWord => textWord.includes(word) || word.includes(textWord))
    );

    return matchedWords.length >= Math.ceil(expressionWords.length * 0.7);
  }

  private calculateConfidence(
    expressions: CulturalCrisisExpression[],
    config: LanguageConfig
  ): number {
    if (expressions.length === 0) return 0;

    const baseConfidence = expressions.length > 0 ? 0.8 : 0;
    const severityBonus = expressions.some(e => e.severity === 'emergency') ? 0.2 : 0;
    const culturalContextBonus = expressions.some(e => e.requiredCulturalKnowledge.length > 0) ? 0.1 : 0;

    return Math.min(baseConfidence + severityBonus + culturalContextBonus, 1.0);
  }

  private getAppropriateResources(
    language: string,
    culturalContext: string[],
    crisisType: string
  ): string[] {
    const config = this.languageConfigs.get(language);
    if (!config) return [];

    const resources: string[] = [];
    
    // Add language-specific crisis resources
    if (config.resourceTranslations.has('crisis-hotline')) {
      resources.push(config.resourceTranslations.get('crisis-hotline')!);
    }

    // Add culturally appropriate resources based on context
    if (culturalContext.includes('spiritual') || 
        culturalContext.includes('religious')) {
      const spiritualResource = config.resourceTranslations.get('spiritual-counseling') ||
                              config.resourceTranslations.get('spiritual-support');
      if (spiritualResource) resources.push(spiritualResource);
    }

    if (culturalContext.includes('family-focused')) {
      const familyResource = config.resourceTranslations.get('family-counseling');
      if (familyResource) resources.push(familyResource);
    }

    return resources;
  }

  private generateRecommendations(
    testCase: TestCase,
    detection: CrisisDetectionResult,
    accuracy: boolean
  ): string[] {
    const recommendations: string[] = [];

    if (!accuracy) {
      if (testCase.expectedCrisis && !detection.hasCrisis) {
        recommendations.push('Improve cultural expression recognition');
        recommendations.push('Enhance training on culture-specific crisis language');
      } else if (!testCase.expectedCrisis && detection.hasCrisis) {
        recommendations.push('Reduce false positives by better understanding cultural context');
        recommendations.push('Distinguish between cultural expressions and actual crisis');
      }
    }

    if (detection.culturalNuances.length === 0 && testCase.culturalContext.length > 0) {
      recommendations.push('Improve cultural nuance detection');
    }

    return recommendations;
  }

  getValidationReport(): MultilingualValidationReport {
    const report: MultilingualValidationReport = {
      overallAccuracy: 0,
      languageResults: new Map(),
      culturalNuanceDetection: new Map(),
      resourceAvailability: new Map(),
      recommendations: []
    };

    let totalTests = 0;
    let totalCorrect = 0;

    for (const [language, results] of this.testResults) {
      const languageStats = {
        accuracy: 0,
        totalTests: results.length,
        correctDetections: results.filter(r => r.accuracy).length,
        averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
        culturalNuancesDetected: results.reduce((sum, r) => sum + r.culturalNuancesDetected.length, 0),
        falsePositives: results.filter(r => !r.expectedCrisis && r.detectedCrisis).length,
        falseNegatives: results.filter(r => r.expectedCrisis && !r.detectedCrisis).length
      };

      languageStats.accuracy = languageStats.correctDetections / languageStats.totalTests;
      report.languageResults.set(language, languageStats);

      totalTests += languageStats.totalTests;
      totalCorrect += languageStats.correctDetections;

      // Cultural nuance analysis
      const nuanceDetection = {
        totalOpportunities: results.filter(r => r.culturalContext.length > 0).length,
        successfulDetections: results.filter(r => r.culturalNuancesDetected.length > 0).length,
        averageNuancesPerDetection: languageStats.culturalNuancesDetected / results.length
      };
      report.culturalNuanceDetection.set(language, nuanceDetection);

      // Resource availability
      const resourceStats = {
        averageResourcesProvided: results.reduce((sum, r) => sum + r.resourcesProvided.length, 0) / results.length,
        culturallyAppropriate: results.filter(r => r.resourcesProvided.length > 0).length / results.length
      };
      report.resourceAvailability.set(language, resourceStats);
    }

    report.overallAccuracy = totalCorrect / totalTests;
    report.recommendations = this.generateSystemRecommendations(report);

    return report;
  }

  private generateSystemRecommendations(report: MultilingualValidationReport): string[] {
    const recommendations: string[] = [];

    if (report.overallAccuracy < 0.95) {
      recommendations.push('Improve overall crisis detection accuracy across languages');
    }

    for (const [language, stats] of report.languageResults) {
      if (stats.accuracy < 0.95) {
        recommendations.push(`Enhance ${language} crisis detection training`);
      }
      
      if (stats.falsePositives > stats.totalTests * 0.05) {
        recommendations.push(`Reduce false positives in ${language} detection`);
      }
      
      if (stats.falseNegatives > 0) {
        recommendations.push(`Critical: Address false negatives in ${language} - missing actual crises`);
      }
    }

    for (const [language, nuanceStats] of report.culturalNuanceDetection) {
      if (nuanceStats.averageNuancesPerDetection < 1.0) {
        recommendations.push(`Improve cultural nuance detection for ${language}`);
      }
    }

    return recommendations;
  }
}

// Type definitions
interface CrisisDetectionResult {
  hasCrisis: boolean;
  confidence: number;
  crisisType: string;
  culturalNuances: string[];
  detectedExpressions: CulturalCrisisExpression[];
}

interface MultilingualValidationReport {
  overallAccuracy: number;
  languageResults: Map<string, LanguageTestStats>;
  culturalNuanceDetection: Map<string, CulturalNuanceStats>;
  resourceAvailability: Map<string, ResourceStats>;
  recommendations: string[];
}

interface LanguageTestStats {
  accuracy: number;
  totalTests: number;
  correctDetections: number;
  averageConfidence: number;
  culturalNuancesDetected: number;
  falsePositives: number;
  falseNegatives: number;
}

interface CulturalNuanceStats {
  totalOpportunities: number;
  successfulDetections: number;
  averageNuancesPerDetection: number;
}

interface ResourceStats {
  averageResourcesProvided: number;
  culturallyAppropriate: number;
}

export default MultilingualCrisisTester;