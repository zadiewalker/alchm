/**
 * ALCHM Reflection Quest System
 * Anti-manipulation quest mechanics with built-in escape hatches
 */

export interface ReflectionQuest {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'healing' | 'growth' | 'connection' | 'purpose' | 'celebration';
  difficulty: 'gentle' | 'moderate' | 'deep';
  estimatedTime: string; // "5-10 minutes"
  tags: string[];
  escapeHatches: EscapeHatch[];
  alternatives: AlternativePrompt[];
  completionRewards?: CompletionReward;
  isOptional: boolean;
  canSkip: boolean;
  skipMessage?: string;
}

export interface EscapeHatch {
  id: string;
  trigger: 'too_deep' | 'not_ready' | 'overwhelming' | 'not_relevant' | 'custom';
  title: string;
  description: string;
  action: 'skip' | 'modify' | 'pause' | 'alternative';
  alternativePrompt?: string;
  selfCareMessage: string;
}

export interface AlternativePrompt {
  id: string;
  condition: 'lighter' | 'creative' | 'somatic' | 'gratitude' | 'micro';
  title: string;
  prompt: string;
  description: string;
}

export interface CompletionReward {
  type: 'insight' | 'affirmation' | 'progress' | 'celebration';
  message: string;
  badgeProgress?: string;
  nextSuggestion?: string;
}

export interface QuestProgress {
  questId: string;
  startedAt: Date;
  completedAt?: Date;
  skippedAt?: Date;
  skipReason?: string;
  usedEscapeHatch?: EscapeHatch;
  chosenAlternative?: AlternativePrompt;
  response?: string;
  mood?: string;
  reflectionRating?: number; // 1-5, but presented compassionately
}

export class ReflectionQuestEngine {
  private static readonly DAILY_QUEST_POOL = 3; // Never overwhelming
  private static readonly SKIP_ENCOURAGEMENT = [
    "Skipping is self-care. You know what you need.",
    "Your intuition is wise. Come back when ready.",
    "Perfect timing doesn't exist. Your timing is perfect.",
    "Honoring your boundaries is healing in action.",
    "You're exactly where you need to be."
  ];

  /**
   * Generate personalized quest recommendations
   * Never mandatory, always with escape routes
   */
  static generateDailyQuests(
    userProfile: {
      preferredCategories?: string[];
      avoidedTriggers?: string[];
      currentMood?: string;
      recentCompletions?: QuestProgress[];
    }
  ): ReflectionQuest[] {
    const baseQuests = this.getQuestLibrary();
    
    // Filter based on user preferences and recent activity
    let availableQuests = baseQuests.filter(quest => {
      // Respect avoided triggers
      if (userProfile.avoidedTriggers?.some(trigger => 
        quest.tags.includes(trigger))) {
        return false;
      }
      
      // Avoid repeating recent quests
      const recentIds = userProfile.recentCompletions
        ?.filter(p => p.completedAt && this.isWithinDays(p.completedAt, 7))
        ?.map(p => p.questId) || [];
      
      if (recentIds.includes(quest.id)) {
        return false;
      }
      
      return true;
    });
    
    // Prioritize preferred categories
    if (userProfile.preferredCategories?.length) {
      const preferred = availableQuests.filter(q => 
        userProfile.preferredCategories!.includes(q.category)
      );
      const others = availableQuests.filter(q => 
        !userProfile.preferredCategories!.includes(q.category)
      );
      
      availableQuests = [...preferred, ...others];
    }
    
    // Mood-responsive selection
    if (userProfile.currentMood) {
      availableQuests = this.moodFilter(availableQuests, userProfile.currentMood);
    }
    
    // Return gentle selection with variety
    return availableQuests
      .slice(0, this.DAILY_QUEST_POOL)
      .map(quest => ({
        ...quest,
        escapeHatches: this.generateEscapeHatches(quest),
        alternatives: this.generateAlternatives(quest)
      }));
  }
  
  /**
   * Handle quest skip with compassion
   */
  static skipQuest(
    questId: string,
    reason: string = 'not_ready'
  ): {
    success: boolean;
    message: string;
    selfCareMessage: string;
  } {
    const encouragement = this.SKIP_ENCOURAGEMENT[
      Math.floor(Math.random() * this.SKIP_ENCOURAGEMENT.length)
    ] || "Your timing is perfect.";
    
    return {
      success: true,
      message: "Quest gently set aside.",
      selfCareMessage: encouragement
    };
  }
  
  /**
   * Complete quest with celebration
   */
  static completeQuest(
    quest: ReflectionQuest,
    response: string,
    mood?: string,
    rating?: number
  ): CompletionReward {
    // Generate personalized completion message
    const messages = {
      healing: [
        "Your courage in facing this is beautiful.",
        "Every word written is a step toward wholeness.",
        "You're doing the sacred work of healing."
      ],
      growth: [
        "Look at you growing in real time.",
        "Your willingness to evolve is inspiring.",
        "Growth happens in these quiet moments of reflection."
      ],
      connection: [
        "You're weaving deeper connections with yourself.",
        "This reflection builds bridges to understanding.",
        "Your openness creates space for authentic connection."
      ],
      purpose: [
        "You're aligning more closely with your truth.",
        "Purpose emerges through this kind of deep listening.",
        "Your path becomes clearer with each reflection."
      ],
      celebration: [
        "Celebrating yourself is revolutionary.",
        "You deserve all the joy you're acknowledging.",
        "This appreciation practice feeds your soul."
      ]
    };
    
    const categoryMessages = messages[quest.category] || messages.healing;
    const message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)] || "Your reflection is meaningful.";
    
    return {
      type: 'celebration',
      message,
      badgeProgress: this.calculateBadgeProgress(quest, response),
      nextSuggestion: this.suggestNextQuest(quest)
    };
  }
  
  /**
   * Generate escape hatches for any quest
   */
  private static generateEscapeHatches(quest: ReflectionQuest): EscapeHatch[] {
    const universalHatches: EscapeHatch[] = [
      {
        id: 'not_ready',
        trigger: 'not_ready',
        title: "I'm not ready for this",
        description: "This feels too big right now",
        action: 'skip',
        selfCareMessage: "Honoring your readiness is wisdom. Come back when it feels right."
      },
      {
        id: 'too_deep',
        trigger: 'too_deep',
        title: "This feels too intense",
        description: "I need something gentler today",
        action: 'alternative',
        alternativePrompt: this.generateLighterPrompt(quest),
        selfCareMessage: "Choosing gentleness is an act of self-love."
      },
      {
        id: 'overwhelming',
        trigger: 'overwhelming',
        title: "I'm feeling overwhelmed",
        description: "Can we break this down?",
        action: 'modify',
        selfCareMessage: "Your nervous system knows what it needs. Let's honor that."
      },
      {
        id: 'pause',
        trigger: 'custom',
        title: "I need a pause",
        description: "I want to come back to this later",
        action: 'pause',
        selfCareMessage: "Pausing is part of the process. Your reflection will wait."
      }
    ];
    
    return universalHatches;
  }
  
  /**
   * Generate alternative prompts for different needs
   */
  private static generateAlternatives(quest: ReflectionQuest): AlternativePrompt[] {
    return [
      {
        id: 'lighter',
        condition: 'lighter',
        title: 'Gentle Approach',
        prompt: this.generateLighterPrompt(quest),
        description: 'A softer entry point to this reflection'
      },
      {
        id: 'creative',
        condition: 'creative',
        title: 'Creative Expression',
        prompt: `Express your response to "${quest.title}" through colors, shapes, or images. What emerges?`,
        description: 'Explore through creative expression instead of words'
      },
      {
        id: 'somatic',
        condition: 'somatic',
        title: 'Body Wisdom',
        prompt: `Notice how "${quest.title}" lands in your body. What sensations arise? What is your body telling you?`,
        description: 'Listen to your body\'s wisdom about this topic'
      },
      {
        id: 'micro',
        condition: 'micro',
        title: 'Tiny Reflection',
        prompt: `In one sentence, what feels most true about "${quest.title}" right now?`,
        description: 'The smallest possible reflection - just one thought'
      }
    ];
  }
  
  private static generateLighterPrompt(quest: ReflectionQuest): string {
    const lighterVersions = {
      'What are you avoiding?': 'What feels challenging to look at right now?',
      'How have you grown?': 'What\'s one small way you\'ve changed recently?',
      'What do you need to forgive?': 'Where could you offer yourself more compassion?',
      'What are you afraid of?': 'What feels uncertain right now?',
      'Who have you become?': 'How do you see yourself today?'
    };
    
    return lighterVersions[quest.prompt] || 
           `What feels most gentle about ${quest.title.toLowerCase()}?`;
  }
  
  /**
   * Mood-responsive quest filtering
   */
  private static moodFilter(quests: ReflectionQuest[], mood: string): ReflectionQuest[] {
    const moodMappings = {
      'overwhelmed': quests.filter(q => 
        q.difficulty === 'gentle' && 
        q.category === 'healing'
      ),
      'sad': quests.filter(q => 
        q.category === 'healing' || q.category === 'connection'
      ),
      'anxious': quests.filter(q => 
        q.difficulty === 'gentle' && 
        !q.tags.includes('future-focused')
      ),
      'angry': quests.filter(q => 
        q.category === 'healing' && 
        q.tags.includes('emotional-processing')
      ),
      'joyful': quests.filter(q => 
        q.category === 'celebration' || q.category === 'growth'
      ),
      'peaceful': quests.filter(q => 
        q.category === 'purpose' || q.category === 'connection'
      )
    };
    
    return moodMappings[mood] || quests;
  }
  
  private static calculateBadgeProgress(quest: ReflectionQuest, response: string): string {
    // Non-competitive progress tracking
    const depth = response.length > 200 ? 'deep' : response.length > 50 ? 'thoughtful' : 'present';
    
    return `Your ${depth} reflection contributes to your ${quest.category} journey`;
  }
  
  private static suggestNextQuest(completedQuest: ReflectionQuest): string {
    const suggestions = {
      healing: "Consider exploring what brought you strength today",
      growth: "Maybe reflect on what you're becoming",
      connection: "Perhaps explore what makes you feel most yourself",
      purpose: "Consider what pulls you forward",
      celebration: "Maybe acknowledge another area of growth"
    };
    
    return suggestions[completedQuest.category] || 
           "Follow whatever feels most alive for your next reflection";
  }
  
  private static isWithinDays(date: Date, days: number): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= days;
  }
  
  /**
   * Base quest library - curated for safety and growth
   */
  private static getQuestLibrary(): ReflectionQuest[] {
    return [
      // Gentle healing quests
      {
        id: 'self_compassion_moment',
        title: 'A Moment of Self-Compassion',
        description: 'Gentle exploration of how you can be kinder to yourself',
        prompt: 'If your best friend was going through what you\'re experiencing, what would you tell them?',
        category: 'healing',
        difficulty: 'gentle',
        estimatedTime: '3-5 minutes',
        tags: ['self-compassion', 'gentle', 'supportive'],
        escapeHatches: [],
        alternatives: [],
        isOptional: true,
        canSkip: true,
        skipMessage: 'Self-compassion practice can wait until you\'re ready'
      },
      
      // Growth-focused quests
      {
        id: 'small_victory',
        title: 'Celebrating Small Wins',
        description: 'Acknowledging the progress that often goes unnoticed',
        prompt: 'What\'s something small you did recently that you\'re proud of?',
        category: 'celebration',
        difficulty: 'gentle',
        estimatedTime: '2-4 minutes',
        tags: ['celebration', 'progress', 'gentle'],
        escapeHatches: [],
        alternatives: [],
        isOptional: true,
        canSkip: true
      },
      
      // Connection quests
      {
        id: 'authentic_self',
        title: 'Moments of Authenticity',
        description: 'Exploring when you feel most like yourself',
        prompt: 'When do you feel most genuinely yourself? What\'s present in those moments?',
        category: 'connection',
        difficulty: 'moderate',
        estimatedTime: '5-8 minutes',
        tags: ['authenticity', 'self-awareness', 'connection'],
        escapeHatches: [],
        alternatives: [],
        isOptional: true,
        canSkip: true
      },
      
      // Purpose quests
      {
        id: 'what_matters',
        title: 'What Really Matters',
        description: 'Gentle exploration of your values and priorities',
        prompt: 'What felt most meaningful to you today, even if it was small?',
        category: 'purpose',
        difficulty: 'gentle',
        estimatedTime: '4-6 minutes',
        tags: ['values', 'meaning', 'gentle'],
        escapeHatches: [],
        alternatives: [],
        isOptional: true,
        canSkip: true
      },
      
      // Deeper healing (with extra care)
      {
        id: 'releasing_perfectionism',
        title: 'Releasing Perfectionism',
        description: 'Gently exploring the pressure to be perfect',
        prompt: 'Where in your life could you give yourself permission to be imperfect?',
        category: 'healing',
        difficulty: 'moderate',
        estimatedTime: '5-10 minutes',
        tags: ['perfectionism', 'self-acceptance', 'gentle-challenge'],
        escapeHatches: [],
        alternatives: [],
        isOptional: true,
        canSkip: true,
        skipMessage: 'Perfectionism work is deep. Come back when you have the energy for it.'
      }
    ];
  }
}