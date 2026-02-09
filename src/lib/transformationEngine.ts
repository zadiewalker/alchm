// Daily Transformation Engine - AI-powered personalized growth challenges

export interface Challenge {
  id: string;
  type: 'mindfulness' | 'gratitude' | 'shadow_work' | 'connection' | 'creativity' | 'reflection' | 'action';
  title: string;
  description: string;
  prompt: string;
  instructions: string[];
  estimatedTime: number; // minutes
  difficulty: 'gentle' | 'moderate' | 'deep' | 'intensive';
  category: string;
  tags: string[];
  adaptiveContext?: {
    moodRange: [number, number]; // 1-10 range this challenge is appropriate for
    crisisAdapted: boolean; // Safe for users in crisis
    shadowWorkLevel: number; // 1-5, how deep the shadow work goes
    connectionRequired: boolean; // Requires interaction with others
  };
}

export interface DailyPrompt {
  id: string;
  date: string;
  challenge: Challenge;
  personalizedMessage: string;
  adaptationReason: string;
  completionIncentive: string;
  followUpPrompts: string[];
}

export interface UserProgress {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalChallengesCompleted: number;
  categoriesExplored: string[];
  preferredDifficulty: Challenge['difficulty'];
  averageCompletionTime: number;
  lastCompletedDate: Date | null;
  achievements: Achievement[];
  personalGrowthGoals: string[];
  challengeHistory: CompletedChallenge[];
}

export interface CompletedChallenge {
  challengeId: string;
  completedAt: Date;
  duration: number; // minutes spent
  rating: number; // 1-5 how helpful it was
  reflection: string;
  insights: string[];
  wouldRecommend: boolean;
  emotionalStateBefore: number; // 1-10
  emotionalStateAfter: number; // 1-10
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: string;
  milestone: number;
}

export class TransformationEngine {
  private challenges: Challenge[] = [];

  constructor() {
    this.initializeChallenges();
  }

  private initializeChallenges() {
    this.challenges = [
      // MINDFULNESS CHALLENGES
      {
        id: 'breathing_anchor',
        type: 'mindfulness',
        title: 'Breathing Anchor',
        description: 'Ground yourself in the present moment through conscious breathing',
        prompt: 'Find a comfortable position and focus on your breath as your anchor to the present moment.',
        instructions: [
          'Sit or lie down comfortably',
          'Close your eyes or soften your gaze',
          'Breathe naturally and count your breaths from 1 to 10',
          'When you reach 10, start over at 1',
          'If your mind wanders, gently return to counting'
        ],
        estimatedTime: 5,
        difficulty: 'gentle',
        category: 'Mindfulness',
        tags: ['breathing', 'grounding', 'anxiety-relief'],
        adaptiveContext: {
          moodRange: [1, 10],
          crisisAdapted: true,
          shadowWorkLevel: 1,
          connectionRequired: false
        }
      },
      {
        id: 'body_scan_awareness',
        type: 'mindfulness',
        title: 'Body Wisdom Check-In',
        description: 'Listen to the wisdom your body holds about your emotional state',
        prompt: 'Your body carries emotional information. Let\'s explore what it\'s telling you today.',
        instructions: [
          'Lie down or sit comfortably',
          'Start at the top of your head and slowly scan down',
          'Notice any tension, warmth, coolness, or other sensations',
          'Ask each area: "What are you holding for me?"',
          'Thank your body for its messages'
        ],
        estimatedTime: 15,
        difficulty: 'moderate',
        category: 'Mindfulness',
        tags: ['body-awareness', 'emotional-intelligence', 'self-care'],
        adaptiveContext: {
          moodRange: [3, 8],
          crisisAdapted: true,
          shadowWorkLevel: 2,
          connectionRequired: false
        }
      },

      // GRATITUDE CHALLENGES
      {
        id: 'micro_gratitude',
        type: 'gratitude',
        title: 'Micro-Moment Appreciation',
        description: 'Find three tiny moments from today that sparked even the smallest sense of appreciation',
        prompt: 'Sometimes the smallest moments carry the greatest gifts. What tiny treasures did today offer you?',
        instructions: [
          'Think about the last few hours',
          'Identify 3 very small positive moments (a smile, warm coffee, sunlight)',
          'For each moment, write why it mattered',
          'Notice how focusing on small joys affects your mood'
        ],
        estimatedTime: 10,
        difficulty: 'gentle',
        category: 'Gratitude',
        tags: ['appreciation', 'mindfulness', 'mood-boost'],
        adaptiveContext: {
          moodRange: [2, 10],
          crisisAdapted: true,
          shadowWorkLevel: 1,
          connectionRequired: false
        }
      },
      {
        id: 'difficult_gratitude',
        type: 'gratitude',
        title: 'Finding Gold in the Darkness',
        description: 'Explore what a challenging experience might be teaching you',
        prompt: 'Even our most difficult experiences can become our greatest teachers. What is a current challenge trying to teach you?',
        instructions: [
          'Think of a current challenge or struggle',
          'Ask: "What strength is this building in me?"',
          'Consider: "What would I tell someone else in this situation?"',
          'Find one small way this difficulty is helping you grow',
          'Honor both the pain and the potential growth'
        ],
        estimatedTime: 20,
        difficulty: 'deep',
        category: 'Gratitude',
        tags: ['resilience', 'growth-mindset', 'reframing'],
        adaptiveContext: {
          moodRange: [3, 7],
          crisisAdapted: false,
          shadowWorkLevel: 3,
          connectionRequired: false
        }
      },

      // SHADOW WORK CHALLENGES
      {
        id: 'inner_critic_dialogue',
        type: 'shadow_work',
        title: 'Compassionate Inner Dialogue',
        description: 'Transform your inner critic into a wise, compassionate inner guide',
        prompt: 'Your inner critic often carries important information, but delivers it harshly. Let\'s help it speak with kindness.',
        instructions: [
          'Notice a critical thought you\'ve had about yourself recently',
          'Ask your inner critic: "What are you trying to protect me from?"',
          'Rewrite the criticism as caring guidance',
          'Thank your inner critic for its concern',
          'Practice speaking to yourself as you would a dear friend'
        ],
        estimatedTime: 15,
        difficulty: 'moderate',
        category: 'Shadow Work',
        tags: ['self-compassion', 'inner-dialogue', 'healing'],
        adaptiveContext: {
          moodRange: [4, 9],
          crisisAdapted: false,
          shadowWorkLevel: 2,
          connectionRequired: false
        }
      },
      {
        id: 'disowned_quality',
        type: 'shadow_work',
        title: 'Reclaiming Your Disowned Gifts',
        description: 'Explore a quality you judge in others that might be a disowned part of yourself',
        prompt: 'What we judge in others often reflects what we\'ve rejected in ourselves. Let\'s reclaim a hidden gift.',
        instructions: [
          'Think of a quality in others that really bothers you',
          'Ask: "How might this quality, in healthy form, be a gift?"',
          'Consider: "When might I need to express this quality?"',
          'Find one way to healthily integrate this quality into your life',
          'Thank this aspect for wanting to serve you'
        ],
        estimatedTime: 25,
        difficulty: 'deep',
        category: 'Shadow Work',
        tags: ['integration', 'projection', 'wholeness'],
        adaptiveContext: {
          moodRange: [5, 8],
          crisisAdapted: false,
          shadowWorkLevel: 4,
          connectionRequired: false
        }
      },

      // CONNECTION CHALLENGES
      {
        id: 'appreciation_message',
        type: 'connection',
        title: 'Appreciation Outreach',
        description: 'Send a genuine appreciation message to someone who has impacted your life',
        prompt: 'Connection deepens when we express genuine appreciation. Who deserves to know how they\'ve touched your life?',
        instructions: [
          'Think of someone who has positively impacted you',
          'Write them a specific message about how they\'ve helped you',
          'Include a specific memory or quality you appreciate',
          'Send the message (text, email, or in person)',
          'Notice how expressing gratitude affects your own mood'
        ],
        estimatedTime: 15,
        difficulty: 'moderate',
        category: 'Connection',
        tags: ['appreciation', 'relationships', 'vulnerability'],
        adaptiveContext: {
          moodRange: [4, 10],
          crisisAdapted: false,
          shadowWorkLevel: 1,
          connectionRequired: true
        }
      },
      {
        id: 'vulnerable_sharing',
        type: 'connection',
        title: 'Gentle Vulnerability Practice',
        description: 'Share something real with someone you trust',
        prompt: 'Vulnerability is the birthplace of connection. What small truth could you share with someone you trust?',
        instructions: [
          'Choose someone you feel safe with',
          'Think of something real you\'re experiencing (doesn\'t have to be deep)',
          'Share it authentically without trying to fix or solve',
          'Practice just being witnessed',
          'Notice how it feels to be seen in your authenticity'
        ],
        estimatedTime: 20,
        difficulty: 'moderate',
        category: 'Connection',
        tags: ['vulnerability', 'authenticity', 'trust'],
        adaptiveContext: {
          moodRange: [3, 8],
          crisisAdapted: false,
          shadowWorkLevel: 2,
          connectionRequired: true
        }
      },

      // CREATIVITY CHALLENGES
      {
        id: 'emotion_art',
        type: 'creativity',
        title: 'Feeling-State Art',
        description: 'Express your current emotional landscape through colors, shapes, or movement',
        prompt: 'Your emotions have colors, textures, and shapes. Let them express themselves creatively.',
        instructions: [
          'Gather art supplies (even just paper and pencil work)',
          'Close your eyes and feel into your current emotional state',
          'Let your hand move without planning or thinking',
          'Use colors, shapes, or lines that feel like your emotions',
          'Don\'t worry about it looking like anything - it\'s pure expression'
        ],
        estimatedTime: 20,
        difficulty: 'gentle',
        category: 'Creativity',
        tags: ['emotional-expression', 'art-therapy', 'non-verbal'],
        adaptiveContext: {
          moodRange: [1, 10],
          crisisAdapted: true,
          shadowWorkLevel: 1,
          connectionRequired: false
        }
      },
      {
        id: 'future_self_letter',
        type: 'creativity',
        title: 'Letter from Your Future Self',
        description: 'Write yourself a letter from the person you\'re becoming',
        prompt: 'Your future self - wise, healed, and whole - wants to send you a message. What would they say?',
        instructions: [
          'Imagine yourself 5 years from now, having grown through current challenges',
          'What wisdom would this future you want to share?',
          'Write a letter from this wise future self to present you',
          'Include encouragement, insights, and reminders of your strength',
          'Keep this letter to read during difficult times'
        ],
        estimatedTime: 25,
        difficulty: 'deep',
        category: 'Creativity',
        tags: ['self-wisdom', 'hope', 'perspective'],
        adaptiveContext: {
          moodRange: [3, 8],
          crisisAdapted: false,
          shadowWorkLevel: 3,
          connectionRequired: false
        }
      },

      // REFLECTION CHALLENGES
      {
        id: 'growth_edge',
        type: 'reflection',
        title: 'Exploring Your Growth Edge',
        description: 'Identify where you\'re being invited to grow and expand',
        prompt: 'Growth often happens at the edge of our comfort zone. Where is life inviting you to expand?',
        instructions: [
          'Think about where you feel resistance or discomfort in your life',
          'Ask: "What might this resistance be protecting?"',
          'Consider: "What would become possible if I moved through this?"',
          'Identify one small step toward your growth edge',
          'Acknowledge the courage it takes to grow'
        ],
        estimatedTime: 20,
        difficulty: 'moderate',
        category: 'Reflection',
        tags: ['growth', 'courage', 'expansion'],
        adaptiveContext: {
          moodRange: [4, 9],
          crisisAdapted: false,
          shadowWorkLevel: 3,
          connectionRequired: false
        }
      },

      // ACTION CHALLENGES
      {
        id: 'micro_self_care',
        type: 'action',
        title: 'Micro Self-Care Action',
        description: 'Take one small, concrete action to care for yourself today',
        prompt: 'Self-care isn\'t selfish - it\'s essential. What small action would show yourself love today?',
        instructions: [
          'Ask yourself: "What do I need right now?"',
          'Choose something small and doable (5-15 minutes)',
          'It could be physical, emotional, mental, or spiritual care',
          'Take the action mindfully, with full presence',
          'Notice how caring for yourself affects your energy'
        ],
        estimatedTime: 10,
        difficulty: 'gentle',
        category: 'Action',
        tags: ['self-care', 'nurturing', 'energy'],
        adaptiveContext: {
          moodRange: [1, 10],
          crisisAdapted: true,
          shadowWorkLevel: 1,
          connectionRequired: false
        }
      }
    ];
  }

  generateDailyPrompt(
    userJournalEntries: any[],
    userProgress: UserProgress,
    currentMood?: number,
    recentCrisisLevel?: string
  ): DailyPrompt {
    // Analyze user context
    const context = this.analyzeUserContext(userJournalEntries, userProgress, currentMood, recentCrisisLevel);
    
    // Select appropriate challenge
    const challenge = this.selectOptimalChallenge(context, userProgress);
    
    // Generate personalized message
    const personalizedMessage = this.generatePersonalizedMessage(context, challenge);
    
    // Create adaptation explanation
    const adaptationReason = this.getAdaptationReason(context, challenge);
    
    // Generate completion incentive
    const completionIncentive = this.generateCompletionIncentive(userProgress, challenge);
    
    // Create follow-up prompts
    const followUpPrompts = this.generateFollowUpPrompts(challenge, context);

    return {
      id: `prompt_${new Date().toISOString().split('T')[0]}_${challenge.id}`,
      date: new Date().toISOString().split('T')[0],
      challenge,
      personalizedMessage,
      adaptationReason,
      completionIncentive,
      followUpPrompts
    };
  }

  private analyzeUserContext(
    journalEntries: any[],
    userProgress: UserProgress,
    currentMood?: number,
    recentCrisisLevel?: string
  ) {
    const recentEntries = journalEntries.slice(0, 7); // Last 7 entries
    
    // Analyze emotional patterns
    const moodTrend = this.analyzeMoodTrend(recentEntries);
    const stressLevel = this.analyzeStressLevel(recentEntries);
    const socialEngagement = this.analyzeSocialEngagement(recentEntries);
    const challengeAreas = this.identifyChallengeAreas(recentEntries);
    
    // Determine user state
    const isInCrisis = recentCrisisLevel === 'high' || recentCrisisLevel === 'critical';
    const needsGentle = currentMood !== undefined && currentMood < 4;
    const readyForGrowth = currentMood !== undefined && currentMood > 6 && !isInCrisis;
    
    return {
      moodTrend,
      stressLevel,
      socialEngagement,
      challengeAreas,
      currentMood: currentMood || 5,
      isInCrisis,
      needsGentle,
      readyForGrowth,
      preferredDifficulty: userProgress.preferredDifficulty,
      recentCategories: userProgress.challengeHistory.slice(-5).map(c => c.challengeId),
      streak: userProgress.currentStreak
    };
  }

  private selectOptimalChallenge(context: any, userProgress: UserProgress): Challenge {
    let availableChallenges = [...this.challenges];
    
    // Filter by crisis adaptation
    if (context.isInCrisis) {
      availableChallenges = availableChallenges.filter(c => 
        c.adaptiveContext?.crisisAdapted === true
      );
    }
    
    // Filter by mood appropriateness
    if (context.currentMood) {
      availableChallenges = availableChallenges.filter(c => {
        const moodRange = c.adaptiveContext?.moodRange;
        return !moodRange || (context.currentMood >= moodRange[0] && context.currentMood <= moodRange[1]);
      });
    }
    
    // Filter by difficulty preference
    if (context.needsGentle) {
      availableChallenges = availableChallenges.filter(c => 
        c.difficulty === 'gentle' || c.difficulty === 'moderate'
      );
    }
    
    // Avoid recently completed challenges
    const recentChallengeIds = context.recentCategories;
    availableChallenges = availableChallenges.filter(c => 
      !recentChallengeIds.includes(c.id)
    );
    
    // Prefer challenges that address identified challenge areas
    const priorityChallenges = availableChallenges.filter(c => 
      context.challengeAreas.some((area: string) => c.tags.includes(area))
    );
    
    if (priorityChallenges.length > 0) {
      availableChallenges = priorityChallenges;
    }
    
    // If no suitable challenges found, fall back to gentle mindfulness
    if (availableChallenges.length === 0) {
      return this.challenges.find(c => c.id === 'breathing_anchor')!;
    }
    
    // Select randomly from suitable challenges
    return availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
  }

  private generatePersonalizedMessage(context: any, challenge: Challenge): string {
    const messages = {
      mindfulness: [
        "Your mind deserves moments of peace. This practice can help you find calm amidst the storm.",
        "You've been carrying a lot lately. Let's create some space for stillness.",
        "Your nervous system is asking for grounding. This practice is a gift to yourself."
      ],
      gratitude: [
        "Even in difficult times, there are small lights waiting to be noticed.",
        "Gratitude isn't about forcing positivity - it's about finding what's genuinely good.",
        "Your heart knows how to appreciate. Let's help it remember."
      ],
      shadow_work: [
        "You're ready to explore deeper waters. This work takes courage, and you have it.",
        "The parts of yourself you've been avoiding may hold gifts for you.",
        "Integration work is profound healing. You're brave for showing up to this."
      ],
      connection: [
        "You don't have to heal alone. Connection is medicine.",
        "Your authentic self deserves to be witnessed and loved.",
        "Vulnerability is a superpower. You're ready to use yours."
      ],
      creativity: [
        "Your creative spirit wants to express what words can't capture.",
        "Art doesn't have to be perfect to be healing. Let yourself play.",
        "Your inner wisdom speaks through creativity. Let's listen."
      ],
      reflection: [
        "You have inner wisdom that can guide you. Let's access it together.",
        "Taking time to reflect is how we grow. Your insights matter.",
        "Your experience has taught you valuable lessons. Let's uncover them."
      ],
      action: [
        "Small actions with love can transform your day.",
        "You deserve care and attention, especially from yourself.",
        "Taking action on your own behalf is an act of self-love."
      ]
    };

    const categoryMessages = messages[challenge.type] || messages.mindfulness;
    let selectedMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];

    // Personalize based on context
    if (context.isInCrisis) {
      selectedMessage = "You're going through a difficult time. This gentle practice is designed to support you exactly where you are.";
    } else if (context.needsGentle) {
      selectedMessage = "Today calls for gentleness with yourself. " + selectedMessage;
    } else if (context.readyForGrowth) {
      selectedMessage = "You're in a good space for growth work. " + selectedMessage;
    }

    return selectedMessage;
  }

  private getAdaptationReason(context: any, challenge: Challenge): string {
    const reasons = [];
    
    if (context.isInCrisis) {
      reasons.push("Adapted for crisis support");
    } else if (context.needsGentle) {
      reasons.push("Gentle approach based on current mood");
    } else if (context.readyForGrowth) {
      reasons.push("Growth-oriented based on positive mood");
    }
    
    if (context.challengeAreas.length > 0) {
      reasons.push(`Addresses your current focus areas: ${context.challengeAreas.slice(0, 2).join(', ')}`);
    }
    
    return reasons.length > 0 ? reasons.join(' • ') : 'Chosen to support your continued growth';
  }

  private generateCompletionIncentive(userProgress: UserProgress, challenge: Challenge): string {
    const incentives = [
      `Complete this to continue your ${userProgress.currentStreak}-day growth streak!`,
      "Each practice builds your resilience and wisdom.",
      "You're investing in your future self with each challenge completed.",
      "This practice is a gift to yourself and everyone you'll touch today.",
      `You've already completed ${userProgress.totalChallengesCompleted} challenges - you're building something beautiful!`
    ];
    
    if (userProgress.currentStreak === 0) {
      return "Starting a new growth journey today - every expert was once a beginner.";
    } else if (userProgress.currentStreak >= 7) {
      return `Amazing! You're on a ${userProgress.currentStreak}-day streak. Your commitment to growth is inspiring.`;
    }
    
    return incentives[Math.floor(Math.random() * incentives.length)];
  }

  private generateFollowUpPrompts(challenge: Challenge, context: any): string[] {
    const prompts = [
      "How did this practice affect your mood or energy?",
      "What insight surprised you most during this challenge?",
      "If you were to share one thing from this experience, what would it be?",
      "What would you like to explore more deeply based on this practice?"
    ];
    
    // Add challenge-specific follow-ups
    if (challenge.type === 'mindfulness') {
      prompts.push("What did you notice about your mind during this practice?");
    } else if (challenge.type === 'gratitude') {
      prompts.push("How did focusing on appreciation shift your perspective?");
    } else if (challenge.type === 'shadow_work') {
      prompts.push("What aspect of yourself feels more integrated after this work?");
    } else if (challenge.type === 'connection') {
      prompts.push("How did this interaction affect your sense of belonging?");
    } else if (challenge.type === 'creativity') {
      prompts.push("What did your creative expression reveal to you?");
    }
    
    return prompts.slice(0, 3); // Return top 3 most relevant
  }

  private analyzeMoodTrend(entries: any[]): 'improving' | 'stable' | 'declining' {
    if (entries.length < 3) return 'stable';
    
    const moods = entries.filter(e => e.mood !== undefined).map(e => e.mood);
    if (moods.length < 3) return 'stable';
    
    const recent = moods.slice(0, 3);
    const older = moods.slice(-3);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  }

  private analyzeStressLevel(entries: any[]): 'low' | 'moderate' | 'high' {
    const stressWords = ['stress', 'anxious', 'overwhelmed', 'pressure', 'panic', 'worried'];
    const totalStress = entries.reduce((count, entry) => {
      const content = entry.content?.toLowerCase() || '';
      return count + stressWords.filter(word => content.includes(word)).length;
    }, 0);
    
    const safeEntriesLength = Math.max(1, entries.length || 1);
    const avgStress = totalStress / safeEntriesLength;
    const safeAvgStress = isNaN(avgStress) ? 0 : avgStress;
    
    if (safeAvgStress > 2) return 'high';
    if (safeAvgStress > 0.5) return 'moderate';
    return 'low';
  }

  private analyzeSocialEngagement(entries: any[]): 'low' | 'moderate' | 'high' {
    const socialWords = ['friend', 'family', 'people', 'together', 'social'];
    const isolationWords = ['alone', 'lonely', 'isolated'];
    
    let socialScore = 0;
    entries.forEach(entry => {
      const content = entry.content?.toLowerCase() || '';
      socialScore += socialWords.filter(word => content.includes(word)).length;
      socialScore -= isolationWords.filter(word => content.includes(word)).length * 0.5;
    });
    
    const safeEntriesLength = Math.max(1, entries.length || 1);
    const avgSocial = socialScore / safeEntriesLength;
    const safeAvgSocial = isNaN(avgSocial) ? 0 : avgSocial;
    
    if (safeAvgSocial > 1) return 'high';
    if (safeAvgSocial > -0.5) return 'moderate';
    return 'low';
  }

  private identifyChallengeAreas(entries: any[]): string[] {
    const areas = [];
    const content = entries.map(e => e.content?.toLowerCase() || '').join(' ');
    
    if (content.includes('anxious') || content.includes('anxiety') || content.includes('panic')) {
      areas.push('anxiety-relief');
    }
    if (content.includes('alone') || content.includes('lonely') || content.includes('isolated')) {
      areas.push('relationships');
    }
    if (content.includes('tired') || content.includes('exhausted') || content.includes('sleep')) {
      areas.push('self-care');
    }
    if (content.includes('angry') || content.includes('frustrated') || content.includes('annoyed')) {
      areas.push('emotional-regulation');
    }
    if (content.includes('stuck') || content.includes('trapped') || content.includes('hopeless')) {
      areas.push('growth');
    }
    
    return areas;
  }

  getChallengeById(id: string): Challenge | undefined {
    return this.challenges.find(c => c.id === id);
  }

  getAllChallenges(): Challenge[] {
    return [...this.challenges];
  }

  getChallengesByType(type: Challenge['type']): Challenge[] {
    return this.challenges.filter(c => c.type === type);
  }

  getChallengesByDifficulty(difficulty: Challenge['difficulty']): Challenge[] {
    return this.challenges.filter(c => c.difficulty === difficulty);
  }
}

export const transformationEngine = new TransformationEngine();