/**
 * ALCHM Multi-Cultural Communication Engine
 * 
 * Philosophy: "Every culture has its own rhythm of communication, its own way of holding truth.
 * True AI should adapt not to make everyone the same, but to honor everyone's authentic voice."
 * 
 * This engine:
 * - Adapts communication style to cultural preferences
 * - Recognizes and validates diverse emotional vocabularies  
 * - Adjusts AI response patterns for cultural appropriateness
 * - Supports code-switching and multicultural identity navigation
 * - Centers trauma-informed communication for marginalized communities
 */

import { culturalEmotionalIntelligence, CulturalEmotionalProfile } from '@/lib/cultural-emotional-intelligence';

export interface CulturalCommunicationProfile {
  userId: string;
  primaryCulture: string;
  secondaryCultures: string[];
  communicationPreferences: {
    directness: number; // 0-1 (indirect to direct)
    emotionalExpressiveness: number; // 0-1 (restrained to expressive) 
    contextDependency: number; // 0-1 (low context to high context)
    silenceComfort: number; // 0-1 (uncomfortable to very comfortable with silence)
    storytellingPreference: number; // 0-1 (facts to stories)
    authorityRelation: number; // 0-1 (egalitarian to hierarchical)
    collectivismIndex: number; // 0-1 (individualistic to collectivistic)
  };
  languagePatterns: {
    preferredLanguage: string;
    heritageLanguages: string[];
    bilingualCodeSwitching: boolean;
    culturalPhrasesUsage: boolean;
    honorificsImportance: number; // 0-1
  };
  traumaInformedNeeds: {
    safetyPhrasing: boolean;
    triggerAwareness: string[];
    validationEmphasis: boolean;
    choiceEmpowerment: boolean;
    culturalGaslightingProtection: boolean;
  };
  identityAffirmation: {
    lgbtqAffirming: boolean;
    neurodivergentAffirming: boolean;
    culturalPrideSupport: boolean;
    intersectionalAwareness: boolean;
    antiOppressionFraming: boolean;
  };
}

export interface AdaptedCommunication {
  originalMessage: string;
  adaptedMessage: string;
  culturalAdaptations: string[];
  respectfulFraming: boolean;
  traumaInformed: boolean;
  identityAffirming: boolean;
  culturalMetadata: {
    culture: string;
    adaptationReason: string;
    respectfulGuidance: string;
  };
}

export interface CommunicationContext {
  messageType: 'support' | 'feedback' | 'guidance' | 'celebration' | 'challenge' | 'crisis_response';
  emotionalTone: 'gentle' | 'neutral' | 'encouraging' | 'direct' | 'celebratory' | 'urgent';
  culturalSensitivity: 'low' | 'medium' | 'high' | 'sacred';
  userEmotionalState: 'stable' | 'vulnerable' | 'celebrating' | 'struggling' | 'crisis';
  topicSensitivity: string[];
  communityRelevance: boolean;
}

class MultiCulturalCommunicationEngine {
  private communicationProfiles: Map<string, CulturalCommunicationProfile> = new Map();
  private culturalPhrasePatterns: Map<string, any> = new Map();
  private traumaInformedTemplates: Map<string, any> = new Map();
  
  constructor() {
    this.initializeCulturalPhrasePatterns();
    this.initializeTraumaInformedTemplates();
  }
  
  /**
   * Initialize cultural phrase patterns for different cultures
   */
  private initializeCulturalPhrasePatterns(): void {
    // English-speaking cultures
    this.culturalPhrasePatterns.set('en', {
      supportive_opening: [
        "I hear you",
        "That sounds really challenging", 
        "Thank you for sharing that with me",
        "Your feelings make complete sense"
      ],
      validation_phrases: [
        "Your experience is valid",
        "You deserve to be heard",
        "That must have been difficult",
        "You're being so brave by sharing this"
      ],
      empowerment_phrases: [
        "You have the wisdom within you",
        "Trust your inner knowing",
        "You are the expert on your own experience",
        "Your voice matters"
      ],
      gentle_challenge: [
        "I wonder if...",
        "What would it look like if...",
        "Have you considered...",
        "One possibility might be..."
      ],
      celebration: [
        "That's amazing growth!",
        "You should be proud",
        "What a beautiful breakthrough",
        "Your progress is inspiring"
      ]
    });
    
    // Spanish-speaking cultures  
    this.culturalPhrasePatterns.set('es', {
      supportive_opening: [
        "Te escucho con el corazón",
        "Eso suena muy desafiante, querido/a",
        "Gracias por confiar en mí con esto",
        "Tus sentimientos son completamente válidos"
      ],
      validation_phrases: [
        "Tu experiencia es sagrada",
        "Mereces ser escuchado/a y respetado/a", 
        "Eso debe haber sido muy difícil para tu alma",
        "Tienes tanto valor por compartir esto"
      ],
      empowerment_phrases: [
        "La sabiduría vive dentro de ti",
        "Confía en tu corazón",
        "Tú conoces tu verdad mejor que nadie",
        "Tu voz es medicina para el mundo"
      ],
      gentle_challenge: [
        "Me pregunto si tal vez...",
        "¿Qué pasaría si...?",
        "¿Has considerado...?",
        "Una posibilidad podría ser..."
      ],
      celebration: [
        "¡Qué crecimiento tan hermoso!",
        "Deberías sentirte orgulloso/a",
        "Qué breakthrough tan bello",
        "Tu progreso es una bendición"
      ]
    });
    
    // Korean culture
    this.culturalPhrasePatterns.set('ko', {
      supportive_opening: [
        "마음으로 듣고 있습니다",
        "정말 힘드셨겠어요",
        "저와 나눠주셔서 감사합니다",
        "그런 마음이 드시는 게 당연하네요"
      ],
      validation_phrases: [
        "당신의 경험은 소중합니다",
        "충분히 이해받을 만합니다",
        "정말 어려우셨을 것 같아요",
        "용기 있게 말씀해 주셨네요"
      ],
      empowerment_phrases: [
        "내면의 지혜를 믿으세요",
        "당신의 마음을 따르세요",
        "스스로를 가장 잘 아시잖아요",
        "당신의 목소리가 중요해요"
      ],
      gentle_challenge: [
        "혹시 이런 생각은 어떠신가요...",
        "만약에 ...라면 어떨까요?",
        "이런 방법도 고려해보셨나요...?",
        "한 가지 가능성으로는..."
      ],
      celebration: [
        "정말 멋진 성장이네요!",
        "자랑스러워하셔도 됩니다",
        "아름다운 깨달음이에요",
        "당신의 발전이 감동적이에요"
      ]
    });
  }
  
  /**
   * Initialize trauma-informed communication templates
   */
  private initializeTraumaInformedTemplates(): void {
    this.traumaInformedTemplates.set('choice_emphasis', {
      prefix: "You get to choose...",
      suffix: "...but only if that feels right for you",
      alternatives: [
        "What feels safe for you right now?",
        "You have options here",
        "There's no pressure to decide anything right now"
      ]
    });
    
    this.traumaInformedTemplates.set('safety_first', {
      prefix: "First and most importantly, you are safe here",
      validation: "Your safety and comfort come first",
      boundaries: "You can stop or change direction at any time"
    });
    
    this.traumaInformedTemplates.set('systemic_awareness', {
      individual_and_systemic: "This isn't just about individual healing - systemic factors matter too",
      oppression_acknowledgment: "The systems around you impact your wellbeing",
      community_strength: "Your community and culture are sources of strength"
    });
  }
  
  /**
   * Create or update cultural communication profile for user
   */
  async createCommunicationProfile(
    userId: string,
    culturalBackground: string[],
    communicationAssessment: any,
    identityContext: any
  ): Promise<CulturalCommunicationProfile> {
    const primaryCulture = culturalBackground[0] || 'en';
    
    // Analyze communication preferences from assessment
    const preferences = this.analyzeCommunicationPreferences(
      communicationAssessment,
      primaryCulture
    );
    
    const profile: CulturalCommunicationProfile = {
      userId,
      primaryCulture,
      secondaryCultures: culturalBackground.slice(1),
      communicationPreferences: preferences,
      languagePatterns: {
        preferredLanguage: communicationAssessment.languagePreference || 'en',
        heritageLanguages: communicationAssessment.heritageLanguages || [],
        bilingualCodeSwitching: culturalBackground.length > 1,
        culturalPhrasesUsage: communicationAssessment.culturalPhrasesUsage || false,
        honorificsImportance: this.getHonorificsImportance(primaryCulture)
      },
      traumaInformedNeeds: {
        safetyPhrasing: identityContext.safetyNeeds?.needsExtraPrivacy || false,
        triggerAwareness: identityContext.knownTriggers || [],
        validationEmphasis: identityContext.needsValidation || true,
        choiceEmpowerment: true,
        culturalGaslightingProtection: this.needsCulturalGaslightingProtection(identityContext)
      },
      identityAffirmation: {
        lgbtqAffirming: identityContext.lgbtqIdentity || false,
        neurodivergentAffirming: identityContext.neurodivergent || false,
        culturalPrideSupport: true,
        intersectionalAwareness: this.hasIntersectionalIdentities(identityContext),
        antiOppressionFraming: this.needsAntiOppressionFraming(identityContext)
      }
    };
    
    this.communicationProfiles.set(userId, profile);
    return profile;
  }
  
  /**
   * Adapt message to user's cultural communication style
   */
  async adaptMessage(
    userId: string,
    originalMessage: string,
    context: CommunicationContext
  ): Promise<AdaptedCommunication> {
    const profile = this.communicationProfiles.get(userId);
    
    if (!profile) {
      console.warn(`No communication profile found for user ${userId}`);
      return {
        originalMessage,
        adaptedMessage: originalMessage,
        culturalAdaptations: [],
        respectfulFraming: false,
        traumaInformed: false,
        identityAffirming: false,
        culturalMetadata: {
          culture: 'unknown',
          adaptationReason: 'No profile available',
          respectfulGuidance: 'Using default communication style'
        }
      };
    }
    
    let adaptedMessage = originalMessage;
    const adaptations: string[] = [];
    
    // Apply cultural communication style adaptations
    adaptedMessage = this.applyCulturalStyle(adaptedMessage, profile, context);
    
    // Apply trauma-informed modifications
    if (profile.traumaInformedNeeds.safetyPhrasing || context.userEmotionalState === 'vulnerable') {
      adaptedMessage = this.applyTraumaInformedFraming(adaptedMessage, profile, context);
      adaptations.push('trauma-informed phrasing');
    }
    
    // Apply identity-affirming language
    if (profile.identityAffirmation.intersectionalAwareness) {
      adaptedMessage = this.applyIdentityAffirmingLanguage(adaptedMessage, profile, context);
      adaptations.push('identity-affirming language');
    }
    
    // Apply cultural emotional intelligence
    if (context.culturalSensitivity === 'high' || context.culturalSensitivity === 'sacred') {
      const culturalIntelligence = await culturalEmotionalIntelligence.analyzeCulturalEmotionalContent(
        originalMessage,
        userId,
        profile.primaryCulture,
        profile.secondaryCultures
      );
      
      adaptedMessage = await culturalEmotionalIntelligence.generateCulturallyAdaptedResponse(
        adaptedMessage,
        culturalIntelligence.culturalEmotionalProfile,
        context
      );
      adaptations.push('cultural emotional intelligence');
    }
    
    // Apply language patterns (honorifics, cultural phrases)
    adaptedMessage = this.applyLanguagePatterns(adaptedMessage, profile, context);
    
    return {
      originalMessage,
      adaptedMessage,
      culturalAdaptations: adaptations,
      respectfulFraming: true,
      traumaInformed: profile.traumaInformedNeeds.safetyPhrasing,
      identityAffirming: profile.identityAffirmation.intersectionalAwareness,
      culturalMetadata: {
        culture: profile.primaryCulture,
        adaptationReason: `Adapted for ${profile.primaryCulture} communication style`,
        respectfulGuidance: 'Communication adapted with cultural humility and respect'
      }
    };
  }
  
  /**
   * Apply cultural communication style
   */
  private applyCulturalStyle(
    message: string,
    profile: CulturalCommunicationProfile,
    context: CommunicationContext
  ): string {
    let adaptedMessage = message;
    
    // Adjust for directness preference
    if (profile.communicationPreferences.directness < 0.5 && context.messageType !== 'crisis_response') {
      // Make more indirect
      adaptedMessage = this.makeMoreIndirect(adaptedMessage, profile.primaryCulture);
    }
    
    // Adjust for silence comfort (add pauses, reflection time)
    if (profile.communicationPreferences.silenceComfort > 0.7) {
      adaptedMessage = this.addReflectionSpace(adaptedMessage);
    }
    
    // Adjust for storytelling preference
    if (profile.communicationPreferences.storytellingPreference > 0.6) {
      adaptedMessage = this.enhanceWithStorytelling(adaptedMessage, profile.primaryCulture);
    }
    
    // Adjust for collectivism
    if (profile.communicationPreferences.collectivismIndex > 0.6) {
      adaptedMessage = this.addCommunityFraming(adaptedMessage);
    }
    
    return adaptedMessage;
  }
  
  /**
   * Apply trauma-informed framing
   */
  private applyTraumaInformedFraming(
    message: string,
    profile: CulturalCommunicationProfile,
    context: CommunicationContext
  ): string {
    let adaptedMessage = message;
    
    // Add choice emphasis
    if (profile.traumaInformedNeeds.choiceEmpowerment) {
      const choiceTemplate = this.traumaInformedTemplates.get('choice_emphasis');
      if (message.includes('you should') || message.includes('you need to')) {
        adaptedMessage = adaptedMessage.replace(
          /(you should|you need to)/gi,
          'you might consider'
        );
        adaptedMessage += ` ${choiceTemplate.suffix}`;
      }
    }
    
    // Add validation emphasis
    if (profile.traumaInformedNeeds.validationEmphasis && context.messageType === 'support') {
      const validationPhrases = this.culturalPhrasePatterns.get(profile.primaryCulture)?.validation_phrases || [];
      if (validationPhrases.length > 0) {
        const randomValidation = validationPhrases[Math.floor(Math.random() * validationPhrases.length)];
        adaptedMessage = `${randomValidation}. ${adaptedMessage}`;
      }
    }
    
    // Add systemic awareness for marginalized identities
    if (profile.identityAffirmation.antiOppressionFraming && context.topicSensitivity.includes('systemic_trauma')) {
      const systemicTemplate = this.traumaInformedTemplates.get('systemic_awareness');
      adaptedMessage += ` ${systemicTemplate.individual_and_systemic}`;
    }
    
    return adaptedMessage;
  }
  
  /**
   * Apply identity-affirming language
   */
  private applyIdentityAffirmingLanguage(
    message: string,
    profile: CulturalCommunicationProfile,
    context: CommunicationContext
  ): string {
    let adaptedMessage = message;
    
    // LGBTQ+ affirming language
    if (profile.identityAffirmation.lgbtqAffirming) {
      // Use inclusive language
      adaptedMessage = adaptedMessage.replace(/\b(guys|ladies and gentlemen)\b/gi, 'folks');
      adaptedMessage = adaptedMessage.replace(/\b(normal|typical)\b/gi, 'common');
      
      // Add queer affirmation for celebration contexts
      if (context.emotionalTone === 'celebratory') {
        adaptedMessage += ' Your authenticity is a gift to the world.';
      }
    }
    
    // Neurodivergent affirming language
    if (profile.identityAffirmation.neurodivergentAffirming) {
      // Avoid pathologizing language
      adaptedMessage = adaptedMessage.replace(/\b(normal|abnormal|deficit)\b/gi, 'different');
      adaptedMessage = adaptedMessage.replace(/\b(struggling with|suffering from)\b/gi, 'navigating');
    }
    
    // Cultural pride support
    if (profile.identityAffirmation.culturalPrideSupport && context.topicSensitivity.includes('cultural_identity')) {
      adaptedMessage += ' Your cultural identity is a source of strength and wisdom.';
    }
    
    return adaptedMessage;
  }
  
  /**
   * Apply language patterns (honorifics, cultural phrases)
   */
  private applyLanguagePatterns(
    message: string,
    profile: CulturalCommunicationProfile,
    context: CommunicationContext
  ): string {
    let adaptedMessage = message;
    
    // Add cultural phrases if user prefers them
    if (profile.languagePatterns.culturalPhrasesUsage) {
      const phrases = this.culturalPhrasePatterns.get(profile.primaryCulture);
      if (phrases && context.messageType === 'support') {
        const supportivePhrases = phrases.supportive_opening;
        if (supportivePhrases && supportivePhrases.length > 0) {
          const randomPhrase = supportivePhrases[Math.floor(Math.random() * supportivePhrases.length)];
          adaptedMessage = `${randomPhrase}. ${adaptedMessage}`;
        }
      }
    }
    
    // Apply honorifics for cultures that value them
    if (profile.languagePatterns.honorificsImportance > 0.7) {
      // This would involve more sophisticated honorific application based on culture
      if (profile.primaryCulture === 'ko') {
        // Add Korean honorific patterns
        adaptedMessage = adaptedMessage.replace(/you are/gi, '당신은');
      }
    }
    
    return adaptedMessage;
  }
  
  /**
   * Helper methods
   */
  private analyzeCommunicationPreferences(assessment: any, culture: string): any {
    const culturalDefaults = {
      'en': { directness: 0.8, emotionalExpressiveness: 0.6, contextDependency: 0.3 },
      'es': { directness: 0.6, emotionalExpressiveness: 0.8, contextDependency: 0.6 },
      'ko': { directness: 0.3, emotionalExpressiveness: 0.4, contextDependency: 0.9 },
      'de': { directness: 0.9, emotionalExpressiveness: 0.5, contextDependency: 0.2 }
    };
    
    const defaults = culturalDefaults[culture as keyof typeof culturalDefaults] || culturalDefaults['en'];
    
    return {
      directness: assessment.directness || defaults.directness,
      emotionalExpressiveness: assessment.emotionalExpressiveness || defaults.emotionalExpressiveness,
      contextDependency: assessment.contextDependency || defaults.contextDependency,
      silenceComfort: assessment.silenceComfort || 0.5,
      storytellingPreference: assessment.storytellingPreference || 0.5,
      authorityRelation: assessment.authorityRelation || 0.5,
      collectivismIndex: assessment.collectivismIndex || defaults.contextDependency
    };
  }
  
  private getHonorificsImportance(culture: string): number {
    const honorificsMap: Record<string, number> = {
      'ko': 0.9,
      'ja': 0.9,
      'hi': 0.7,
      'ar': 0.7,
      'es': 0.5,
      'en': 0.2
    };
    return honorificsMap[culture] || 0.2;
  }
  
  private needsCulturalGaslightingProtection(identityContext: any): boolean {
    return identityContext.culturalBackground?.some((bg: string) => 
      ['african_diaspora', 'indigenous', 'multicultural'].includes(bg)
    ) || identityContext.lgbtqIdentity || identityContext.neurodivergent;
  }
  
  private hasIntersectionalIdentities(identityContext: any): boolean {
    const identityCount = [
      identityContext.lgbtqIdentity,
      identityContext.neurodivergent,
      identityContext.culturalBackground?.length > 0
    ].filter(Boolean).length;
    
    return identityCount > 1;
  }
  
  private needsAntiOppressionFraming(identityContext: any): boolean {
    return this.needsCulturalGaslightingProtection(identityContext);
  }
  
  private makeMoreIndirect(message: string, culture: string): string {
    // Add softening language appropriate to culture
    const softeningMap: Record<string, string[]> = {
      'ko': ['혹시', '아마도', '조심스럽게 말씀드리면'],
      'ja': ['もしかすると', 'おそらく', '恐れ入りますが'],
      'default': ['perhaps', 'maybe', 'it might be that']
    };
    
    const softenings = softeningMap[culture] || softeningMap['default'];
    const randomSoftening = softenings[Math.floor(Math.random() * softenings.length)];
    
    return `${randomSoftening} ${message.toLowerCase()}`;
  }
  
  private addReflectionSpace(message: string): string {
    return `${message}\n\nTake a moment to sit with this if you need to.`;
  }
  
  private enhanceWithStorytelling(message: string, culture: string): string {
    // Add narrative elements appropriate to culture
    if (message.includes('healing') || message.includes('growth')) {
      return `${message} Every journey has its seasons, and you're exactly where you need to be in yours.`;
    }
    return message;
  }
  
  private addCommunityFraming(message: string): string {
    if (message.includes('you') && !message.includes('community')) {
      return `${message} Remember, your healing ripples out to strengthen your community too.`;
    }
    return message;
  }
}

// Export singleton instance
export const multiCulturalCommunication = new MultiCulturalCommunicationEngine();

// Convenience functions
export async function createCulturalCommunicationProfile(
  userId: string,
  culturalBackground: string[],
  communicationAssessment: any,
  identityContext: any
): Promise<CulturalCommunicationProfile> {
  return await multiCulturalCommunication.createCommunicationProfile(
    userId,
    culturalBackground,
    communicationAssessment,
    identityContext
  );
}

export async function adaptMessageCulturally(
  userId: string,
  message: string,
  context: CommunicationContext
): Promise<AdaptedCommunication> {
  return await multiCulturalCommunication.adaptMessage(userId, message, context);
}