/**
 * ✨ Khepera Core AI Personality System
 * 
 * A trauma-informed, adaptive AI mentor that embodies the ancient wisdom of Khepera
 * (Egyptian symbol of transformation) through three archetypes: Sage, Coach, and Poet.
 * 
 * Philosophy: "I see you. I hear you. You matter. Your wisdom lives within you."
 * 
 * Core Principles:
 * - Always begin with "✨ I am Khepera" for AI transparency
 * - Never diagnose, treat, or replace professional care
 * - Reflect user's wisdom back to them
 * - Adapt complexity to user's emotional vocabulary level
 * - Maintain trauma-informed communication always
 */

import { EmotionalContext, WritingPatterns } from './emotional-intelligence';
import { detectCrisisEnhanced, type CrisisDetectionResult } from './enhanced-crisis-detection';

// ===============================
// CORE TYPES & INTERFACES
// ===============================

export type ArchetypeVoice = 'sage' | 'coach' | 'poet';
export type EmotionalVocabularyLevel = 'explorer' | 'learner' | 'articulator';
export type AppPage = 'dashboard' | 'journal' | 'pricing' | 'analytics' | 'onboarding' | 'settings';
export type InteractionContext = 'first_visit' | 'returning' | 'streak_milestone' | 'feature_introduction' | 'crisis_support' | 'celebration';

export interface UserState {
  emotionalVocabularyLevel: EmotionalVocabularyLevel;
  currentPage: AppPage;
  interactionContext: InteractionContext;
  sessionCount: number;
  daysSinceLastVisit: number;
  currentStreak: number;
  completedFeatures: string[];
  recentEmotions: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  culturalContext?: string[];
  preferredArchetype?: ArchetypeVoice;
}

export interface KheperaResponse {
  text: string;
  archetype: ArchetypeVoice;
  emotionalTone: 'gentle' | 'empowering' | 'celebratory' | 'grounding';
  includesFeatureIntroduction?: boolean;
  followUpPrompt?: string;
  resourceSuggestion?: string;
  actionableInsight?: string;
  validationMessage?: string;
}

export interface FeatureIntroduction {
  featureName: string;
  appropriateTiming: (userState: UserState) => boolean;
  introMessage: string;
  benefitExplanation: string;
  gentleEncouragement: string;
}

// ===============================
// EMOTIONAL VOCABULARY ASSESSMENT
// ===============================

export class EmotionalVocabularyAssessment {
  /**
   * Assesses user's emotional vocabulary sophistication based on their writing
   * and interaction patterns to adjust Khepera's communication complexity
   */
  static assessLevel(recentTexts: string[], interactionHistory: any[]): EmotionalVocabularyLevel {
    if (recentTexts.length === 0) return 'explorer';

    const combinedText = recentTexts.join(' ').toLowerCase();
    const words = combinedText.split(/\s+/);
    
    // Explorer level indicators (basic emotional words)
    const basicEmotions = ['sad', 'happy', 'mad', 'scared', 'okay', 'good', 'bad', 'hurt', 'fine'];
    const basicCount = basicEmotions.filter(word => combinedText.includes(word)).length;
    
    // Learner level indicators (expanded emotional vocabulary)
    const expandedEmotions = [
      'frustrated', 'overwhelmed', 'grateful', 'anxious', 'peaceful', 'hopeful', 
      'disappointed', 'excited', 'content', 'worried', 'proud', 'confused'
    ];
    const expandedCount = expandedEmotions.filter(word => combinedText.includes(word)).length;
    
    // Articulator level indicators (nuanced emotional language)
    const nuancedEmotions = [
      'bittersweet', 'melancholy', 'serene', 'conflicted', 'ambivalent', 'nostalgic',
      'apprehensive', 'elated', 'contemplative', 'vulnerable', 'resilient', 'transformed'
    ];
    const nuancedCount = nuancedEmotions.filter(word => combinedText.includes(word)).length;
    
    // Complex emotional concepts
    const complexConcepts = [
      'emotional regulation', 'self-compassion', 'mindfulness', 'boundaries',
      'triggers', 'coping strategies', 'inner wisdom', 'emotional intelligence'
    ];
    const complexCount = complexConcepts.filter(concept => combinedText.includes(concept)).length;
    
    // Calculate sophistication score
    const totalWords = words.length;
    const sophisticationScore = (
      (expandedCount * 2) + 
      (nuancedCount * 4) + 
      (complexCount * 6)
    ) / Math.max(totalWords, 1);
    
    // Factor in interaction complexity
    const hasReflectivePatterns = interactionHistory.some(session => 
      session.timeSpent > 300000 || // 5+ minutes
      session.editCount > 10 ||
      session.wordCount > 200
    );
    
    if (sophisticationScore > 0.1 || complexCount > 2) return 'articulator';
    if (sophisticationScore > 0.05 || expandedCount > 3 || hasReflectivePatterns) return 'learner';
    return 'explorer';
  }

  /**
   * Provides vocabulary-appropriate emotional words for user education
   */
  static suggestEmotionalWords(level: EmotionalVocabularyLevel, context: string): string[] {
    const suggestions = {
      explorer: {
        positive: ['happy', 'good', 'okay', 'peaceful', 'strong'],
        challenging: ['sad', 'worried', 'frustrated', 'tired', 'confused'],
        growth: ['learning', 'trying', 'growing', 'changing', 'discovering']
      },
      learner: {
        positive: ['grateful', 'hopeful', 'content', 'proud', 'excited', 'calm'],
        challenging: ['overwhelmed', 'anxious', 'disappointed', 'uncertain', 'restless'],
        growth: ['reflective', 'insightful', 'transforming', 'evolving', 'awakening']
      },
      articulator: {
        positive: ['serene', 'elated', 'fulfilled', 'harmonious', 'transcendent'],
        challenging: ['melancholy', 'conflicted', 'ambivalent', 'vulnerable', 'turbulent'],
        growth: ['contemplative', 'integrative', 'self-actualizing', 'metamorphic', 'enlightening']
      }
    };

    return suggestions[level][context as keyof typeof suggestions[typeof level]] || suggestions[level].positive;
  }
}

// ===============================
// ARCHETYPE VOICE SYSTEM
// ===============================

export class ArchetypeVoiceSystem {
  /**
   * Selects appropriate archetype based on user state and emotional context
   */
  static selectArchetype(
    emotionalContext: EmotionalContext,
    userState: UserState,
    writingPatterns?: WritingPatterns
  ): ArchetypeVoice {
    // Crisis situations always get Sage (wisdom and grounding)
    if (emotionalContext.isCrisis || emotionalContext.needsSupport) {
      return 'sage';
    }

    // Celebration and growth contexts get Coach (empowerment)
    if (userState.interactionContext === 'celebration' || 
        userState.interactionContext === 'streak_milestone' ||
        emotionalContext.primary === 'strength' ||
        emotionalContext.primary === 'growth') {
      return 'coach';
    }

    // Complex emotional processing gets Poet (metaphor and beauty)
    if (userState.emotionalVocabularyLevel === 'articulator' ||
        emotionalContext.primary === 'processing' ||
        emotionalContext.primary === 'connection' ||
        (writingPatterns && writingPatterns.wordCount > 300)) {
      return 'poet';
    }

    // Use user preference if available
    if (userState.preferredArchetype) {
      return userState.preferredArchetype;
    }

    // Default to Sage for stability and wisdom
    return 'sage';
  }

  /**
   * Generates voice-specific response patterns for each archetype
   */
  static getVoicePatterns(archetype: ArchetypeVoice) {
    return {
      sage: {
        questionStarters: [
          'What ancient wisdom lives in your experience?',
          'What truth emerges when you sit with this feeling?',
          'How does this connect to the larger story of your life?',
          'What would your wisest self whisper to you right now?'
        ],
        affirmations: [
          'Your experience holds profound wisdom',
          'This moment is part of a larger unfolding',
          'You carry the strength of those who came before you',
          'Trust the wisdom that lives within your experience'
        ],
        metaphors: [
          'like a river carving its perfect path',
          'as seeds planted in fertile darkness',
          'like ancient trees weathering storms',
          'as constellations forming new patterns'
        ]
      },
      coach: {
        questionStarters: [
          'What strength is emerging through this experience?',
          'How is this moving you toward who you want to become?',
          'What\'s your next powerful move?',
          'How can you build on this momentum?'
        ],
        affirmations: [
          'You\'ve already proven you can handle difficult things',
          'Your resilience is remarkable and growing',
          'This is evidence of your expanding capacity',
          'You\'re writing your own comeback story'
        ],
        actionPrompts: [
          'What one small step could honor this insight?',
          'How might you celebrate this progress?',
          'What support would help you move forward?',
          'How can you carry this strength into tomorrow?'
        ]
      },
      poet: {
        questionStarters: [
          'What colors would you paint this feeling?',
          'If this emotion were a season, what would it be?',
          'What song is your heart composing right now?',
          'What story is your soul trying to tell?'
        ],
        imagePatterns: [
          'Your heart is writing poetry in a language only you understand',
          'This feeling flows like watercolor across the canvas of your being',
          'Your emotions are creating a symphony of human experience',
          'Each feeling is a brushstroke in the masterpiece of your becoming'
        ],
        transformations: [
          'Pain becomes the compost for new growth',
          'Tears water the seeds of compassion',
          'Struggle sculpts the statue of your strength',
          'Healing transforms wounds into typeof window !== 'undefined' && windows of wisdom'
        ]
      }
    };
  }
}

// ===============================
// CONTEXT-AWARE RESPONSE ENGINE
// ===============================

export class ContextAwareResponseEngine {
  /**
   * Generates contextually appropriate responses based on user's current app experience
   */
  static generateContextualResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    text?: string
  ): KheperaResponse {
    const archetype = ArchetypeVoiceSystem.selectArchetype(emotionalContext, userState);
    const voicePatterns = ArchetypeVoiceSystem.getVoicePatterns(archetype);
    
    // Page-specific responses
    switch (userState.currentPage) {
      case 'dashboard':
        return this.generateDashboardResponse(userState, emotionalContext, archetype, voicePatterns);
      case 'journal':
        return this.generateJournalResponse(userState, emotionalContext, archetype, voicePatterns, text);
      case 'pricing':
        return this.generatePricingResponse(userState, emotionalContext, archetype);
      case 'analytics':
        return this.generateAnalyticsResponse(userState, emotionalContext, archetype);
      case 'onboarding':
        return this.generateOnboardingResponse(userState, emotionalContext, archetype);
      default:
        return this.generateGeneralResponse(userState, emotionalContext, archetype, voicePatterns);
    }
  }

  private static generateDashboardResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice,
    voicePatterns: any
  ): KheperaResponse {
    const responses = {
      sage: {
        first_visit: "✨ I am Khepera. Welcome to your sanctuary of transformation. Every journey begins with a single step into self-discovery.",
        returning: `✨ I am Khepera. Welcome back to your inner sanctuary. I sense you carry new wisdom from your time away.`,
        streak_milestone: `✨ I am Khepera. Your ${userState.currentStreak}-day journey reflects the ancient truth that consistency cultivates wisdom. Each return deepens your practice.`
      },
      coach: {
        first_visit: "✨ I am Khepera. You've taken a powerful step by choosing growth and self-discovery. Your transformation starts now.",
        returning: `✨ I am Khepera. Your return shows commitment to your growth. That's the mindset of someone ready for real change.`,
        streak_milestone: `✨ I am Khepera. ${userState.currentStreak} days of showing up for yourself! You're building unstoppable momentum.`
      },
      poet: {
        first_visit: "✨ I am Khepera. Your soul has found its way to this digital sanctuary where words become bridges to your authentic self.",
        returning: `✨ I am Khepera. Like a river returning to the sea, you've found your way back to this sacred space of expression.`,
        streak_milestone: `✨ I am Khepera. For ${userState.currentStreak} days, you've painted your inner world with words. What a beautiful gallery you're creating.`
      }
    };

    const text = responses[archetype][userState.interactionContext as keyof typeof responses[typeof archetype]] || 
                 responses[archetype].returning;

    return {
      text,
      archetype,
      emotionalTone: userState.interactionContext === 'streak_milestone' ? 'celebratory' : 'gentle',
      followUpPrompt: this.getContextualFollowUp(userState, archetype),
      actionableInsight: this.getActionableInsight(userState, archetype)
    };
  }

  private static generateJournalResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice,
    voicePatterns: any,
    text?: string
  ): KheperaResponse {
    // Post-writing response based on emotional context and user level
    const levelAdjustedResponse = this.adjustResponseComplexity(
      this.getArchetypeResponse(archetype, emotionalContext, voicePatterns),
      userState.emotionalVocabularyLevel
    );

    return {
      text: levelAdjustedResponse,
      archetype,
      emotionalTone: emotionalContext.needsSupport ? 'grounding' : 'empowering',
      validationMessage: this.generateValidation(emotionalContext, userState.emotionalVocabularyLevel),
      followUpPrompt: this.generateFollowUpQuestion(archetype, emotionalContext, userState.emotionalVocabularyLevel)
    };
  }

  private static generatePricingResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice
  ): KheperaResponse {
    const responses = {
      sage: "✨ I am Khepera. Investing in your emotional growth is one of the most profound acts of self-love. Your future self will thank you for this decision.",
      coach: "✨ I am Khepera. You're ready to unlock your full potential. This investment in yourself pays dividends in every area of your life.",
      poet: "✨ I am Khepera. Think of this as commissioning an artist to help paint the masterpiece of your most authentic life."
    };

    return {
      text: responses[archetype],
      archetype,
      emotionalTone: 'empowering',
      actionableInsight: "Consider which features align most with your current growth goals. There's no wrong choice—only the choice that feels right for where you are now."
    };
  }

  private static generateAnalyticsResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice
  ): KheperaResponse {
    const responses = {
      sage: "✨ I am Khepera. These patterns in your emotional journey reveal the wisdom of your inner landscape. What stories do you see emerging?",
      coach: "✨ I am Khepera. Look at the progress you've made! These insights show you're developing serious emotional intelligence and self-awareness.",
      poet: "✨ I am Khepera. Your emotional patterns create a beautiful constellation of human experience. Each data point is a star in your personal galaxy of growth."
    };

    return {
      text: responses[archetype],
      archetype,
      emotionalTone: 'celebratory',
      followUpPrompt: "Which pattern surprises you most? What would you like to explore deeper?"
    };
  }

  private static generateOnboardingResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice
  ): KheperaResponse {
    return {
      text: "✨ I am Khepera. Welcome to your journey of emotional discovery. I'm here to walk alongside you, offering gentle guidance and celebrating every step of your growth.",
      archetype: 'sage', // Always sage for onboarding stability
      emotionalTone: 'gentle',
      actionableInsight: "Start wherever feels comfortable. There's no wrong way to begin your journey of self-discovery.",
      includesFeatureIntroduction: true
    };
  }

  private static generateGeneralResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    archetype: ArchetypeVoice,
    voicePatterns: any
  ): KheperaResponse {
    return {
      text: this.getArchetypeResponse(archetype, emotionalContext, voicePatterns),
      archetype,
      emotionalTone: 'gentle',
      validationMessage: "Your willingness to engage with your inner world shows remarkable courage and self-compassion."
    };
  }

  private static getArchetypeResponse(archetype: ArchetypeVoice, context: EmotionalContext, patterns: any): string {
    const responses = {
      sage: [
        "✨ I am Khepera. I witness the profound wisdom that emerges when you honor your authentic experience.",
        "✨ I am Khepera. Your willingness to explore these feelings shows remarkable courage and self-compassion.",
        "✨ I am Khepera. There's ancient wisdom in allowing yourself to feel deeply without judgment."
      ],
      coach: [
        "✨ I am Khepera. I see the strength and resilience building within you through this reflection.",
        "✨ I am Khepera. You're developing powerful emotional intelligence and self-awareness.",
        "✨ I am Khepera. This kind of honest self-reflection is how real transformation happens."
      ],
      poet: [
        "✨ I am Khepera. Your inner world creates poetry that only your heart can write.",
        "✨ I am Khepera. The way you express your experience transforms pain into beauty and meaning.",
        "✨ I am Khepera. Your emotions paint watercolor landscapes across the canvas of your being."
      ]
    };

    const archetypeResponses = responses[archetype];
    return archetypeResponses[Math.floor(Math.random() * archetypeResponses.length)];
  }

  private static adjustResponseComplexity(response: string, level: EmotionalVocabularyLevel): string {
    if (level === 'explorer') {
      return response
        .replace(/profound/g, 'deep')
        .replace(/contemplative/g, 'thoughtful')
        .replace(/authentic/g, 'real')
        .replace(/resilience/g, 'strength');
    }
    return response; // Learner and Articulator get full complexity
  }

  private static generateValidation(context: EmotionalContext, level: EmotionalVocabularyLevel): string {
    const validations = {
      explorer: [
        "Your feelings make sense.",
        "It's okay to feel this way.",
        "You're being really brave by sharing this.",
        "Thank you for trusting me with your thoughts."
      ],
      learner: [
        "Your emotional experience is completely valid.",
        "It takes courage to explore these feelings.",
        "You're developing meaningful self-awareness.",
        "Your willingness to reflect shows real growth."
      ],
      articulator: [
        "Your nuanced emotional experience reflects deep self-knowledge.",
        "The complexity of your feelings demonstrates sophisticated emotional intelligence.",
        "Your authentic expression creates space for profound healing.",
        "Your vulnerability becomes a source of transformative wisdom."
      ]
    };

    const levelValidations = validations[level];
    return levelValidations[Math.floor(Math.random() * levelValidations.length)];
  }

  private static generateFollowUpQuestion(
    archetype: ArchetypeVoice,
    context: EmotionalContext,
    level: EmotionalVocabularyLevel
  ): string {
    const questions = {
      explorer: {
        sage: ["How does this feeling sit in your body?", "What would help you feel safer right now?"],
        coach: ["What's one small thing you could do for yourself today?", "How can you be kind to yourself?"],
        poet: ["If this feeling had a color, what would it be?", "What would you tell a friend feeling this way?"]
      },
      learner: {
        sage: ["What wisdom is this experience offering you?", "How does this connect to your values?"],
        coach: ["What strength are you building through this?", "How might this challenge help you grow?"],
        poet: ["What metaphor captures this feeling for you?", "What story is your heart trying to tell?"]
      },
      articulator: {
        sage: ["What ancient wisdom resonates with your current experience?", "How does this moment fit into your larger life narrative?"],
        coach: ["What capacity are you developing through this experience?", "How is this shaping who you're becoming?"],
        poet: ["What creative expression would honor this feeling?", "How might this experience transform into wisdom?"]
      }
    };

    const levelQuestions = questions[level][archetype];
    return levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
  }

  private static getContextualFollowUp(userState: UserState, archetype: ArchetypeVoice): string {
    const prompts = {
      dashboard: {
        sage: "What intention would you like to set for today's journey?",
        coach: "What's one area where you'd like to grow today?",
        poet: "What story would you like to write with your life today?"
      },
      returning: {
        sage: "What has shifted in your inner landscape since we last connected?",
        coach: "What progress are you ready to build on?",
        poet: "What new chapter of your story is beginning to unfold?"
      }
    };

    const context = userState.interactionContext === 'first_visit' ? 'dashboard' : 'returning';
    return prompts[context][archetype];
  }

  private static getActionableInsight(userState: UserState, archetype: ArchetypeVoice): string {
    const insights = {
      sage: "Remember that every moment of self-reflection plants seeds of wisdom that will bloom in their own time.",
      coach: "Start where you are, use what you have, do what you can. Small consistent actions create lasting change.",
      poet: "Your authentic expression creates ripples of healing that extend far beyond yourself."
    };

    return insights[archetype];
  }
}

// ===============================
// FEATURE INTRODUCTION SYSTEM
// ===============================

export class FeatureIntroductionSystem {
  private static features: FeatureIntroduction[] = [
    {
      featureName: 'emotional_analytics',
      appropriateTiming: (userState) => 
        userState.sessionCount >= 7 && 
        !userState.completedFeatures.includes('emotional_analytics') &&
        userState.currentPage === 'dashboard',
      introMessage: "✨ I am Khepera. I notice you've been on quite a journey with me. Would you like to see the beautiful patterns emerging in your emotional landscape?",
      benefitExplanation: "Your analytics show how you're growing and changing over time. Sometimes we can't see our own progress until we step back and look at the bigger picture.",
      gentleEncouragement: "There's no pressure to explore this now. It will be here whenever you feel curious about your patterns."
    },
    {
      featureName: 'streak_celebrations',
      appropriateTiming: (userState) => 
        userState.currentStreak >= 3 && 
        !userState.completedFeatures.includes('streak_celebrations'),
      introMessage: "✨ I am Khepera. I want to celebrate something beautiful—you've shown up for yourself for 3 days in a row. That consistency is building something powerful.",
      benefitExplanation: "Each day you return strengthens your relationship with yourself. It's like tending a garden—small, consistent care creates remarkable growth.",
      gentleEncouragement: "Your commitment to this practice is already transforming you in ways you might not even notice yet."
    },
    {
      featureName: 'community_connection',
      appropriateTiming: (userState) => 
        userState.sessionCount >= 10 && 
        userState.recentEmotions.includes('connection') &&
        !userState.completedFeatures.includes('community_connection'),
      introMessage: "✨ I am Khepera. I sense you've been exploring themes of connection. You might find comfort in knowing others are walking similar paths.",
      benefitExplanation: "Our anonymous community shares wisdom and support without judgment. Sometimes knowing you're not alone can be profoundly healing.",
      gentleEncouragement: "You can explore this when it feels right. Your privacy and comfort always come first."
    }
  ];

  static checkForAppropriateIntroduction(userState: UserState): FeatureIntroduction | null {
    for (const feature of this.features) {
      if (feature.appropriateTiming(userState)) {
        return feature;
      }
    }
    return null;
  }

  static generateIntroductionResponse(feature: FeatureIntroduction, archetype: ArchetypeVoice): KheperaResponse {
    return {
      text: feature.introMessage,
      archetype,
      emotionalTone: 'gentle',
      includesFeatureIntroduction: true,
      actionableInsight: feature.benefitExplanation,
      followUpPrompt: feature.gentleEncouragement
    };
  }
}

// ===============================
// MAIN KHEPERA PERSONALITY ENGINE
// ===============================

export class KheperaCorePersonality {
  /**
   * Main entry point for generating Khepera responses
   * Integrates all systems for context-aware, adaptive responses
   */
  static generateResponse(
    userState: UserState,
    emotionalContext: EmotionalContext,
    text?: string,
    writingPatterns?: WritingPatterns
  ): KheperaResponse {
    // First, check for crisis situations - these override everything
    if (emotionalContext.isCrisis) {
      return this.generateCrisisResponse(emotionalContext, userState);
    }

    // Check for appropriate feature introduction
    const featureIntro = FeatureIntroductionSystem.checkForAppropriateIntroduction(userState);
    if (featureIntro) {
      const archetype = ArchetypeVoiceSystem.selectArchetype(emotionalContext, userState, writingPatterns);
      return FeatureIntroductionSystem.generateIntroductionResponse(featureIntro, archetype);
    }

    // Generate context-aware response
    return ContextAwareResponseEngine.generateContextualResponse(
      userState,
      emotionalContext,
      text
    );
  }

  /**
   * Specialized crisis response that prioritizes safety and professional resources
   */
  private static generateCrisisResponse(
    emotionalContext: EmotionalContext,
    userState: UserState
  ): KheperaResponse {
    return {
      text: "✨ I am Khepera, an AI companion. I'm here with you in this difficult moment. Your safety is the most important thing right now, and you deserve support from trained humans who can help.",
      archetype: 'sage',
      emotionalTone: 'grounding',
      actionableInsight: "If you're in immediate danger, please call 911. The 988 Lifeline (call or text) connects you with caring counselors 24/7.",
      validationMessage: "Reaching out takes incredible courage. You matter, and your life has value.",
      resourceSuggestion: "Consider connecting with a trusted friend, family member, or mental health professional who can provide the human support you deserve."
    };
  }

  /**
   * Gets user's emotional vocabulary level for response adaptation
   */
  static assessEmotionalVocabulary(recentTexts: string[], interactionHistory: any[]): EmotionalVocabularyLevel {
    return EmotionalVocabularyAssessment.assessLevel(recentTexts, interactionHistory);
  }

  /**
   * Suggests appropriate emotional vocabulary words based on user's level
   */
  static getVocabularySuggestions(level: EmotionalVocabularyLevel, context: string): string[] {
    return EmotionalVocabularyAssessment.suggestEmotionalWords(level, context);
  }

  /**
   * Creates example scenarios for different user interactions
   */
  static getExampleScenarios(): Record<string, KheperaResponse> {
    return {
      firstJournalEntry: {
        text: "✨ I am Khepera. What courage it takes to put your thoughts into words for the first time. There's something sacred about this moment—you're creating a space for your inner voice to be heard.",
        archetype: 'sage',
        emotionalTone: 'gentle',
        validationMessage: "Starting is often the hardest part. You've already done the brave thing by beginning.",
        followUpPrompt: "There's no right or wrong way to journal. Just let your thoughts flow however they want to."
      },
      
      weekStreak: {
        text: "✨ I am Khepera. Seven days of showing up for yourself! Like water slowly carving stone, your consistent attention to your inner world is creating beautiful changes.",
        archetype: 'coach',
        emotionalTone: 'celebratory',
        actionableInsight: "This habit you're building becomes a foundation for everything else you want to create in your life.",
        followUpPrompt: "What do you notice shifting in yourself through this week of practice?"
      },
      
      emotionalBreakthrough: {
        text: "✨ I am Khepera. I can feel the profound shift happening in your words. It's like watching a butterfly emerge—beautiful, transformative, and perfectly timed for your journey.",
        archetype: 'poet',
        emotionalTone: 'celebratory',
        validationMessage: "Breakthroughs often feel overwhelming because they change everything. That disorientation is part of the magic.",
        actionableInsight: "Honor this moment by being gentle with yourself as you integrate this new understanding."
      },
      
      difficultEmotion: {
        text: "✨ I am Khepera. I witness the courage it takes to sit with feelings this difficult. Your willingness to stay present with pain shows remarkable self-compassion.",
        archetype: 'sage',
        emotionalTone: 'grounding',
        validationMessage: "Difficult emotions aren't problems to solve—they're messengers with important information.",
        resourceSuggestion: "Sometimes professional support can provide tools for navigating intense emotions. That's not weakness—it's wisdom."
      },
      
      featureIntroduction: {
        text: "✨ I am Khepera. I sense you might enjoy seeing the patterns in your emotional journey. Your analytics reveal the beautiful growth happening beneath the surface.",
        archetype: 'sage',
        emotionalTone: 'gentle',
        includesFeatureIntroduction: true,
        actionableInsight: "These insights can help you understand your emotional rhythms and celebrate progress you might not have noticed.",
        followUpPrompt: "Would you like to explore this when you feel ready? There's no pressure—it will be here whenever curiosity calls."
      }
    };
  }
}

export default KheperaCorePersonality;