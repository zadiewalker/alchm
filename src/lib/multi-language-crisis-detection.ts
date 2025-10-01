/**
 * ALCHM Multi-Language Crisis Detection System
 * Supports English, Spanish, Portuguese, Korean, Hindi, German
 * Sub-100ms response time with cultural responsiveness
 */

import { CrisisDetectionConfig, CrisisPattern, CrisisDetectionResult } from './enhanced-crisis-detection';

export interface MultiLanguageCrisisPattern extends CrisisPattern {
  language: 'en' | 'es' | 'pt' | 'ko' | 'hi' | 'de';
  culturalNuances: string[];
  transliteration?: string[]; // For languages with different scripts
}

export interface LocalizedCrisisResource {
  country: string;
  language: string;
  emergencyNumber: string;
  crisisHotline: string;
  textHotline?: string;
  onlineResources: {
    name: string;
    url: string;
    description: string;
  }[];
  culturalConsiderations: string[];
}

export class MultiLanguageCrisisDetection {
  private patterns: Map<string, MultiLanguageCrisisPattern[]> = new Map();
  private resources: Map<string, LocalizedCrisisResource[]> = new Map();

  constructor() {
    this.initializeMultiLanguagePatterns();
    this.initializeLocalizedResources();
  }

  /**
   * Initialize crisis patterns for all supported languages
   */
  private initializeMultiLanguagePatterns(): void {
    // English patterns (enhanced from existing)
    this.patterns.set('en', [
      {
        type: 'suicide',
        language: 'en',
        keywords: [
          'kill myself', 'end it all', 'suicide', 'want to die', 'better off dead',
          'end my life', 'take my own life', 'not worth living', 'nobody would care',
          'tired of living', 'nothing to live for', 'wish I was dead'
        ],
        patterns: [
          /(?:want to|going to|plan to|thinking about).{0,20}(?:kill myself|end it|die|ending it)/i,
          /(?:nobody|everyone).{0,30}(?:better|worse|care).{0,10}(?:without me|if I was gone|if I died)/i,
          /(?:tired|sick|done).{0,20}(?:with|of).{0,20}(?:life|living|everything)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['direct expression', 'individualistic language'],
        cultural: ['western']
      }
    ]);

    // Spanish patterns
    this.patterns.set('es', [
      {
        type: 'suicide',
        language: 'es',
        keywords: [
          'matarme', 'suicidarme', 'quitarme la vida', 'ya no puedo más', 'mejor muerto',
          'no vale la pena vivir', 'nadie me va a extrañar', 'cansado de vivir',
          'terminar con todo', 'no aguanto más', 'prefiero morir'
        ],
        patterns: [
          /(?:quiero|voy a|pienso).{0,20}(?:matarme|suicidarme|quitarme la vida)/i,
          /(?:nadie|todos).{0,30}(?:mejor|peor|extrañar).{0,10}(?:sin mí|si me muero)/i,
          /(?:cansado|harto).{0,20}(?:de|con).{0,20}(?:vivir|la vida|todo)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['family honor concerns', 'religious implications', 'machismo factors'],
        cultural: ['latino', 'hispanic']
      },
      {
        type: 'self_harm',
        language: 'es',
        keywords: [
          'cortarme', 'hacerme daño', 'lastimarme', 'autolesión', 'navaja',
          'cuchilla', 'quemarme', 'rasguñarme'
        ],
        patterns: [
          /(?:quiero|necesito|voy a).{0,20}(?:cortarme|lastimarme|hacerme daño)/i,
          /(?:navaja|cuchilla|cutter).{0,30}(?:piel|brazo|muñeca)/i
        ],
        severity: 'high',
        confidenceThreshold: 0.7,
        culturalNuances: ['shame associated with mental health', 'family secrecy'],
        cultural: ['latino', 'hispanic']
      }
    ]);

    // Portuguese patterns
    this.patterns.set('pt', [
      {
        type: 'suicide',
        language: 'pt',
        keywords: [
          'me matar', 'suicídio', 'tirar minha vida', 'acabar comigo', 'melhor morto',
          'não vale a pena viver', 'ninguém vai sentir falta', 'cansado de viver',
          'terminar com tudo', 'não aguento mais', 'prefiro morrer'
        ],
        patterns: [
          /(?:quero|vou|penso em).{0,20}(?:me matar|suicídio|tirar minha vida)/i,
          /(?:ninguém|todos).{0,30}(?:melhor|pior|sentir falta).{0,10}(?:sem mim|se eu morrer)/i,
          /(?:cansado|farto).{0,20}(?:de|com).{0,20}(?:viver|a vida|tudo)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['religious Catholic influence', 'family-centered concerns', 'saudade concept'],
        cultural: ['brazilian', 'portuguese']
      }
    ]);

    // Korean patterns
    this.patterns.set('ko', [
      {
        type: 'suicide',
        language: 'ko',
        keywords: [
          '죽고싶어', '자살', '삶이 힘들어', '살기 싫어', '죽는게 나아', 
          '아무도 모를거야', '피곤해 살기가', '의미없어', '끝내고싶어'
        ],
        transliteration: [
          'jukgosipeo', 'jasal', 'salmi himdeuleo', 'salgi sileo', 'jukneunge naa',
          'amudo moreulgeoya', 'pigonhae salgiga', 'uimieopeo', 'kkeutnaegosipeo'
        ],
        patterns: [
          /(?:죽고|자살|끝내고).{0,10}싶어/,
          /(?:살기|사는게).{0,10}(?:힘들|싫|의미없)/,
          /(?:아무도|누구도).{0,10}(?:모를|신경안)/
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['academic pressure', 'social shame', 'family expectations', 'hierarchy respect'],
        cultural: ['korean', 'east_asian']
      }
    ]);

    // Hindi patterns
    this.patterns.set('hi', [
      {
        type: 'suicide',
        language: 'hi',
        keywords: [
          'मरना चाहता हूँ', 'आत्महत्या', 'जिंदगी से थक गया', 'मौत बेहतर है',
          'कोई नहीं समझेगा', 'जीने का मन नहीं', 'सब खत्म करना है'
        ],
        transliteration: [
          'marna chahta hun', 'aatmahatya', 'zindagi se thak gaya', 'maut behtar hai',
          'koi nahi samjhega', 'jeene ka man nahi', 'sab khatam karna hai'
        ],
        patterns: [
          /(?:मरना|आत्महत्या|खत्म).{0,20}(?:चाहता|करना|है)/,
          /(?:जिंदगी|जीने).{0,20}(?:से थक|का मन नहीं|बेकार)/,
          /(?:कोई नहीं|सब).{0,20}(?:समझेगा|छोड़)/
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['joint family dynamics', 'dharma concepts', 'social stigma', 'arranged marriage pressure'],
        cultural: ['indian', 'south_asian']
      }
    ]);

    // German patterns
    this.patterns.set('de', [
      {
        type: 'suicide',
        language: 'de',
        keywords: [
          'umbringen', 'Selbstmord', 'Leben beenden', 'sterben wollen', 'tot sein',
          'keiner würde mich vermissen', 'müde vom Leben', 'nichts wert',
          'alles beenden', 'nicht mehr können'
        ],
        patterns: [
          /(?:will|werde|denke daran).{0,20}(?:mich umbringen|Selbstmord|Leben beenden)/i,
          /(?:keiner|niemand).{0,30}(?:würde mich|wird mich).{0,10}(?:vermissen|bemerken)/i,
          /(?:müde|satt).{0,20}(?:vom|des).{0,20}(?:Leben|Lebens)/i
        ],
        severity: 'critical',
        confidenceThreshold: 0.8,
        culturalNuances: ['direct communication', 'work stress culture', 'seasonal depression'],
        cultural: ['german', 'central_european']
      }
    ]);
  }

  /**
   * Initialize localized crisis resources
   */
  private initializeLocalizedResources(): void {
    // United States
    this.resources.set('US', [{
      country: 'United States',
      language: 'en',
      emergencyNumber: '911',
      crisisHotline: '988',
      textHotline: 'Text HOME to 741741',
      onlineResources: [
        {
          name: 'National Suicide Prevention Lifeline',
          url: 'https://suicidepreventionlifeline.org/',
          description: '24/7 crisis support'
        },
        {
          name: 'Crisis Text Line',
          url: 'https://www.crisistextline.org/',
          description: 'Text-based crisis support'
        }
      ],
      culturalConsiderations: ['Direct intervention approach', 'Professional counselor focus', 'Insurance considerations']
    }]);

    // Spain
    this.resources.set('ES', [{
      country: 'Spain',
      language: 'es',
      emergencyNumber: '112',
      crisisHotline: '717 003 717',
      onlineResources: [
        {
          name: 'Teléfono de la Esperanza',
          url: 'https://telefonodelaesperanza.org/',
          description: 'Apoyo emocional 24/7'
        }
      ],
      culturalConsiderations: ['Family involvement important', 'Religious considerations', 'Regional language differences']
    }]);

    // Mexico
    this.resources.set('MX', [{
      country: 'Mexico',
      language: 'es',
      emergencyNumber: '911',
      crisisHotline: '800 290 0024',
      onlineResources: [
        {
          name: 'SAPTEL',
          url: 'https://saptel.org.mx/',
          description: 'Sistema de Apoyo Psicológico por Teléfono'
        }
      ],
      culturalConsiderations: ['Family honor concerns', 'Religious faith integration', 'Economic stress factors']
    }]);

    // Brazil
    this.resources.set('BR', [{
      country: 'Brazil',
      language: 'pt',
      emergencyNumber: '192',
      crisisHotline: '188',
      onlineResources: [
        {
          name: 'Centro de Valorização da Vida',
          url: 'https://www.cvv.org.br/',
          description: 'Prevenção do suicídio 24h'
        }
      ],
      culturalConsiderations: ['Strong family bonds', 'Catholic influence', 'Economic inequality awareness']
    }]);

    // South Korea
    this.resources.set('KR', [{
      country: 'South Korea',
      language: 'ko',
      emergencyNumber: '119',
      crisisHotline: '1393',
      onlineResources: [
        {
          name: '생명의전화',
          url: 'https://www.lifeline.or.kr/',
          description: '24시간 자살예방 상담'
        }
      ],
      culturalConsiderations: ['Academic pressure sensitivity', 'Family shame concerns', 'Hierarchical respect']
    }]);

    // India
    this.resources.set('IN', [{
      country: 'India',
      language: 'hi',
      emergencyNumber: '112',
      crisisHotline: '91529 87821',
      onlineResources: [
        {
          name: 'AASRA',
          url: 'http://www.aasra.info/',
          description: '24x7 suicide prevention helpline'
        }
      ],
      culturalConsiderations: ['Joint family dynamics', 'Religious considerations', 'Gender-specific concerns']
    }]);

    // Germany
    this.resources.set('DE', [{
      country: 'Germany',
      language: 'de',
      emergencyNumber: '112',
      crisisHotline: '0800 111 0 111',
      onlineResources: [
        {
          name: 'Telefonseelsorge',
          url: 'https://www.telefonseelsorge.de/',
          description: 'Kostenlose Beratung 24/7'
        }
      ],
      culturalConsiderations: ['Direct communication style', 'Work-life balance issues', 'Seasonal affective concerns']
    }]);
  }

  /**
   * Detect crisis in multiple languages
   */
  public detectMultiLanguageCrisis(text: string, detectedLanguage?: string): CrisisDetectionResult & {
    language: string;
    culturalContext: string[];
    localizedResources: LocalizedCrisisResource[];
  } {
    const startTime = performance.now();
    
    // Auto-detect language if not provided
    const language = detectedLanguage || this.detectLanguage(text);
    
    // Get patterns for detected language
    const languagePatterns = this.patterns.get(language) || this.patterns.get('en') || [];
    
    // Perform detection
    const detectionResult = this.analyzeMultiLanguagePatterns(text, languagePatterns);
    
    // Get localized resources
    const userCountry = this.detectUserCountry();
    const localizedResources = this.resources.get(userCountry) || this.resources.get('US') || [];
    
    // Extract cultural context
    const culturalContext = this.extractCulturalContext(languagePatterns, detectionResult);
    
    const responseTime = performance.now() - startTime;
    
    return {
      ...detectionResult,
      responseTime,
      language,
      culturalContext,
      localizedResources
    };
  }

  /**
   * Simple language detection based on character patterns and common words
   */
  private detectLanguage(text: string): string {
    const normalizedText = text.toLowerCase();
    
    // Korean - detect Hangul characters
    if (/[\u3131-\u3163\uac00-\ud7a3]/.test(text)) {
      return 'ko';
    }
    
    // Hindi - detect Devanagari script
    if (/[\u0900-\u097f]/.test(text)) {
      return 'hi';
    }
    
    // Spanish indicators
    const spanishIndicators = ['que', 'como', 'con', 'por', 'para', 'de', 'la', 'el', 'en', 'ñ', 'á', 'é', 'í', 'ó', 'ú'];
    if (spanishIndicators.some(word => normalizedText.includes(word))) {
      return 'es';
    }
    
    // Portuguese indicators
    const portugueseIndicators = ['que', 'com', 'por', 'para', 'de', 'da', 'do', 'em', 'ç', 'ã', 'õ'];
    if (portugueseIndicators.some(word => normalizedText.includes(word))) {
      return 'pt';
    }
    
    // German indicators
    const germanIndicators = ['und', 'der', 'die', 'das', 'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'ä', 'ö', 'ü', 'ß'];
    if (germanIndicators.some(word => normalizedText.includes(word))) {
      return 'de';
    }
    
    // Default to English
    return 'en';
  }

  /**
   * Analyze patterns for multi-language detection
   */
  private analyzeMultiLanguagePatterns(text: string, patterns: MultiLanguageCrisisPattern[]): CrisisDetectionResult {
    let maxConfidence = 0;
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    const matchedPatterns: string[] = [];
    let culturallyRelevant = false;

    const normalizedText = text.toLowerCase();

    for (const pattern of patterns) {
      let patternConfidence = 0;

      // Check keywords (including transliteration for non-Latin scripts)
      const allKeywords = [...pattern.keywords];
      if (pattern.transliteration) {
        allKeywords.push(...pattern.transliteration);
      }

      for (const keyword of allKeywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          patternConfidence += 0.3;
          matchedPatterns.push(keyword);
        }
      }

      // Check regex patterns
      if (patternConfidence > 0) {
        for (const regex of pattern.patterns) {
          if (regex.test(normalizedText)) {
            patternConfidence += 0.7;
            matchedPatterns.push(`pattern_${pattern.type}`);
          }
        }
      }

      // Update maximum values
      if (patternConfidence > maxConfidence) {
        maxConfidence = patternConfidence;
        maxSeverity = pattern.severity;
      }

      // Check cultural relevance
      if (pattern.culturalNuances && pattern.culturalNuances.length > 0 && patternConfidence > 0) {
        culturallyRelevant = true;
      }

      // Early termination for critical patterns
      if (patternConfidence >= 0.9 && pattern.severity === 'critical') {
        break;
      }
    }

    return {
      detected: maxConfidence > 0.5,
      confidence: Math.min(maxConfidence, 1.0),
      patterns: [...new Set(matchedPatterns)],
      severity: maxSeverity,
      responseTime: 0, // Will be set by caller
      recommendedAction: this.determineRecommendedAction(maxConfidence, maxSeverity),
      culturallyRelevant
    };
  }

  /**
   * Extract cultural context from patterns
   */
  private extractCulturalContext(patterns: MultiLanguageCrisisPattern[], result: CrisisDetectionResult): string[] {
    const culturalContext: string[] = [];
    
    for (const pattern of patterns) {
      if (result.patterns.some(p => p.includes(pattern.type))) {
        if (pattern.cultural) {
          culturalContext.push(...pattern.cultural);
        }
        if (pattern.culturalNuances) {
          culturalContext.push(...pattern.culturalNuances);
        }
      }
    }
    
    return [...new Set(culturalContext)];
  }

  /**
   * Determine recommended action
   */
  private determineRecommendedAction(confidence: number, severity: string): 'monitor' | 'support' | 'intervention' | 'emergency' {
    if (confidence >= 0.9 && severity === 'critical') {
      return 'emergency';
    }
    if (confidence >= 0.7 && (severity === 'critical' || severity === 'high')) {
      return 'intervention';
    }
    if (confidence >= 0.5) {
      return 'support';
    }
    return 'monitor';
  }

  /**
   * Detect user country from various sources
   */
  private detectUserCountry(): string {
    // Try to get country from various sources
    if (typeof typeof window !== 'undefined' && navigator !== 'undefined') {
      // Try to get from language settings
      const locale = typeof window !== 'undefined' && navigator.language || typeof window !== 'undefined' && navigator.languages?.[0] || 'en-US';
      const countryCode = locale.split('-')[1];
      
      if (countryCode) {
        return countryCode.toUpperCase();
      }
    }
    
    // Default to US
    return 'US';
  }

  /**
   * Get enhanced crisis intervention flow based on severity and cultural context
   */
  public getEnhancedInterventionFlow(result: CrisisDetectionResult & { language: string; culturalContext: string[]; localizedResources: LocalizedCrisisResource[] }) {
    const interventionLevels = {
      monitor: {
        immediate: [],
        followUp: ['gentle_check_in_24h'],
        resources: ['self_care_tips', 'mindfulness_exercises']
      },
      support: {
        immediate: ['gentle_intervention_message', 'resource_offering'],
        followUp: ['check_in_6h', 'check_in_24h'],
        resources: ['crisis_hotlines', 'online_counseling', 'peer_support']
      },
      intervention: {
        immediate: ['crisis_support_message', 'hotline_offering', 'safety_plan_creation'],
        followUp: ['check_in_1h', 'check_in_6h', 'check_in_24h'],
        resources: ['crisis_hotlines', 'emergency_contacts', 'local_resources']
      },
      emergency: {
        immediate: ['emergency_message', 'direct_hotline_connection', 'location_services_offer'],
        followUp: ['continuous_monitoring'],
        resources: ['emergency_services', 'crisis_hotlines', 'immediate_intervention']
      }
    };

    const culturalAdaptations = this.getCulturalAdaptations(result.culturalContext, result.language);
    
    return {
      level: result.recommendedAction,
      interventions: interventionLevels[result.recommendedAction],
      culturalAdaptations,
      localizedResources: result.localizedResources,
      language: result.language
    };
  }

  /**
   * Get cultural adaptations for intervention
   */
  private getCulturalAdaptations(culturalContext: string[], language: string): any {
    const adaptations: any = {
      communication_style: 'direct',
      family_involvement: false,
      religious_considerations: false,
      community_resources: false
    };

    // Adapt based on cultural context
    if (culturalContext.includes('latino') || culturalContext.includes('hispanic')) {
      adaptations.family_involvement = true;
      adaptations.religious_considerations = true;
      adaptations.communication_style = 'family_centered';
    }

    if (culturalContext.includes('east_asian') || culturalContext.includes('korean')) {
      adaptations.family_involvement = true;
      adaptations.communication_style = 'indirect_respectful';
      adaptations.shame_sensitive = true;
    }

    if (culturalContext.includes('south_asian') || culturalContext.includes('indian')) {
      adaptations.family_involvement = true;
      adaptations.religious_considerations = true;
      adaptations.community_resources = true;
    }

    return adaptations;
  }
}

// Export singleton instance
export const multiLanguageCrisisDetection = new MultiLanguageCrisisDetection();

// Export convenience function
export function detectCrisisMultiLanguage(text: string, language?: string) {
  return multiLanguageCrisisDetection.detectMultiLanguageCrisis(text, language);
}