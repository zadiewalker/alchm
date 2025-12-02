/**
 * Pathway Integration with ALCHM's Trauma-Informed Gamification System
 * Connects the Transformative Pathways with grace-based progression, identity evolution, and anti-shame mechanics
 */

import { GraceTokenSystem, PresenceMetricSystem, AntiShameSystem } from './grace-token-revolution';

export interface PathwayCompletionData {
  pathwayId: string;
  lessonId: string;
  lessonOrder: number;
  timeSpentMinutes: number;
  practicesCompleted: string[];
  journalEntryId?: string;
  notes?: string;
}

export interface PathwayGamificationResult {
  xpAwarded: number;
  presenceMetrics: {
    consistency: number;
    depth: number;
    authenticity: number;
    selfCompassion: number;
    growthMoments: number;
  };
  archetypeEvolution: {
    archetypeId: string;
    growthAmount: number;
    newInsights: string[];
  }[];
  badgeUnlocked?: {
    id: string;
    title: string;
    description: string;
    category: 'pathway' | 'practice' | 'wisdom' | 'courage';
  };
  graceTokensEarned?: number;
  wisdomMoment?: string;
  celebrationMessage: string;
  nextRecommendation: string;
}

export interface PathwayMissedSession {
  pathwayId: string;
  scheduledDate: Date;
  reason?: string;
}

export interface PathwayPresenceMetrics {
  pathwayConsistency: number;
  practiceDepth: number;
  journalAuthenticity: number;
  selfCompassionGrowth: number;
  transformationalMoments: number;
}

/**
 * Pathway Gamification Integration Service
 * Bridges pathway completions with the existing grace-based gamification system
 */
export class PathwayGamificationService {
  
  /**
   * Process pathway lesson completion through the trauma-informed gamification system
   */
  static processLessonCompletion(
    completionData: PathwayCompletionData,
    userPreferences: any,
    currentGraceState: any
  ): PathwayGamificationResult {
    
    // Calculate presence metrics for this lesson
    const presenceMetrics = this.calculateLessonPresenceMetrics(completionData);
    
    // Determine archetype evolution based on pathway theme and practices
    const archetypeEvolution = this.calculateArchetypeGrowth(completionData);
    
    // Calculate XP using trauma-informed principles (presence over performance)
    const baseXP = this.calculateTraumaInformedXP(completionData, presenceMetrics);
    
    // Check for badge unlocks
    const badgeUnlocked = this.checkForBadgeUnlocks(completionData, presenceMetrics);
    
    // Check if grace tokens should be earned for consistent practice
    const graceTokensEarned = this.calculateGraceTokenReward(completionData, presenceMetrics);
    
    // Generate wisdom moment based on lesson themes
    const wisdomMoment = this.generatePathwayWisdom(completionData);
    
    // Create celebration message using anti-shame system
    const celebrationMessage = AntiShameSystem.generateCelebration(
      `completed ${completionData.lessonId} with presence and courage`,
      userPreferences
    );
    
    // Generate next recommendation
    const nextRecommendation = this.generateNextStepRecommendation(completionData, presenceMetrics);
    
    return {
      xpAwarded: baseXP,
      presenceMetrics,
      archetypeEvolution,
      badgeUnlocked,
      graceTokensEarned,
      wisdomMoment,
      celebrationMessage,
      nextRecommendation
    };
  }
  
  /**
   * Handle missed pathway sessions with grace and trauma-informed support
   */
  static processMissedSession(
    missedData: PathwayMissedSession,
    userGraceState: any,
    userPreferences: any
  ): {
    graceOffered: boolean;
    supportMessage: string;
    alternativeActions: string[];
    wisdomMoment: string;
  } {
    
    // Check for shame spiral indicators
    const shameIntervention = AntiShameSystem.interceptShameSpiral({
      missedDays: 1,
      selfCriticalLanguage: false, // Would be detected from journal analysis
      perfectionismSpike: false,
      comparisonThoughts: false
    });
    
    const supportMessages = [
      "Your pathway is waiting patiently for your return. There's no rush in healing.",
      "Missing a session doesn't diminish your progress. Your commitment to growth remains unchanged.",
      "This pause might be exactly what your nervous system needs. Honor this wisdom.",
      "Pathways of transformation include rest and integration. You're exactly where you need to be."
    ];
    
    const alternativeActions = [
      "Try a 5-minute grounding practice instead",
      "Journal about what you're feeling right now",
      "Take three conscious breaths and honor this moment",
      "Send yourself a message of encouragement",
      "Remember why you started this pathway"
    ];
    
    const wisdomMoments = [
      "Healing is not linear. Your pathway honors your natural rhythm.",
      "Sometimes the most healing thing is to not force healing.",
      "Your worth is not measured by perfect attendance to growth practices.",
      "Trust that your healing unfolds in perfect timing, even when it doesn't feel perfect."
    ];
    
    return {
      graceOffered: true,
      supportMessage: supportMessages[Math.floor(Math.random() * supportMessages.length)],
      alternativeActions: alternativeActions.slice(0, 3),
      wisdomMoment: wisdomMoments[Math.floor(Math.random() * wisdomMoments.length)]
    };
  }
  
  /**
   * Calculate pathway-specific presence metrics
   */
  private static calculateLessonPresenceMetrics(
    completionData: PathwayCompletionData
  ): PathwayPresenceMetrics {
    
    // Time presence: Quality time spent vs minimum requirements
    const timePresence = Math.min(100, (completionData.timeSpentMinutes / 10) * 25);
    
    // Practice presence: Engagement with practices
    const practicePresence = Math.min(100, completionData.practicesCompleted.length * 25);
    
    // Journal presence: Authentic expression (would be enhanced with AI analysis)
    const journalPresence = completionData.journalEntryId ? 75 : 0;
    
    // Self-compassion indicators (would be enhanced with content analysis)
    const selfCompassionPresence = 60; // Default baseline
    
    // Transformational moments (detected through specific keywords/themes)
    const transformationalMoments = completionData.notes?.toLowerCase().includes('breakthrough') ? 1 : 0;
    
    return {
      pathwayConsistency: timePresence,
      practiceDepth: practicePresence,
      journalAuthenticity: journalPresence,
      selfCompassionGrowth: selfCompassionPresence,
      transformationalMoments
    };
  }
  
  /**
   * Calculate archetype evolution based on pathway themes
   */
  private static calculateArchetypeGrowth(
    completionData: PathwayCompletionData
  ): Array<{
    archetypeId: string;
    growthAmount: number;
    newInsights: string[];
  }> {
    
    const pathwayArchetypeMap = {
      'emotional-awareness': [
        { archetypeId: 'healer', growthAmount: 15, insights: ['Emotions are messengers', 'Feeling is healing'] },
        { archetypeId: 'sage', growthAmount: 10, insights: ['Wisdom comes through experiencing'] }
      ],
      'shadow-integration': [
        { archetypeId: 'warrior', growthAmount: 20, insights: ['Courage means facing what we avoid'] },
        { archetypeId: 'healer', growthAmount: 15, insights: ['Integration transforms what was once painful'] }
      ],
      'inner-child-healing': [
        { archetypeId: 'innocent', growthAmount: 25, insights: ['Play is medicine', 'Your inner child deserves love'] },
        { archetypeId: 'healer', growthAmount: 10, insights: ['Nurturing your inner child heals generational wounds'] }
      ],
      'somatic-wisdom': [
        { archetypeId: 'sage', growthAmount: 15, insights: ['The body holds infinite wisdom'] },
        { archetypeId: 'healer', growthAmount: 20, insights: ['Somatic awareness is the foundation of healing'] }
      ]
    };
    
    const pathwayGrowth = pathwayArchetypeMap[completionData.pathwayId as keyof typeof pathwayArchetypeMap];
    
    if (!pathwayGrowth) {
      // Default archetype growth for unknown pathways
      return [
        { 
          archetypeId: 'seeker', 
          growthAmount: 10, 
          newInsights: ['Every step on the path teaches something new'] 
        }
      ];
    }
    
    return pathwayGrowth.map(growth => ({
      ...growth,
      newInsights: growth.insights
    }));
  }
  
  /**
   * Calculate XP using trauma-informed principles (presence over performance)
   */
  private static calculateTraumaInformedXP(
    completionData: PathwayCompletionData,
    presenceMetrics: PathwayPresenceMetrics
  ): number {
    // Base XP for showing up (presence is rewarded)
    let baseXP = 20;
    
    // Time presence bonus (capped to avoid encouraging unhealthy long sessions)
    const timeBonus = Math.min(10, Math.floor(completionData.timeSpentMinutes / 5));
    
    // Practice engagement bonus
    const practiceBonus = completionData.practicesCompleted.length * 5;
    
    // Authentic expression bonus (journaling)
    const expressionBonus = completionData.journalEntryId ? 15 : 0;
    
    // Transformational moment bonus
    const transformationBonus = presenceMetrics.transformationalMoments * 25;
    
    // Self-compassion bonus (detected from language analysis - simplified for now)
    const compassionBonus = presenceMetrics.selfCompassionGrowth > 70 ? 10 : 0;
    
    return baseXP + timeBonus + practiceBonus + expressionBonus + transformationBonus + compassionBonus;
  }
  
  /**
   * Check for badge unlocks based on pathway progress and presence
   */
  private static checkForBadgeUnlocks(
    completionData: PathwayCompletionData,
    presenceMetrics: PathwayPresenceMetrics
  ): { id: string; title: string; description: string; category: string } | undefined {
    
    // First lesson completion badge
    if (completionData.lessonOrder === 1) {
      return {
        id: `first-lesson-${completionData.pathwayId}`,
        title: 'Sacred Beginning',
        description: `You began your ${completionData.pathwayId} pathway with courage`,
        category: 'pathway'
      };
    }
    
    // Deep practice engagement badge
    if (completionData.practicesCompleted.length >= 3) {
      return {
        id: 'deep-practice-engagement',
        title: 'Practice Devotee',
        description: 'You engaged deeply with multiple healing practices',
        category: 'practice'
      };
    }
    
    // Transformational moment badge
    if (presenceMetrics.transformationalMoments > 0) {
      return {
        id: 'breakthrough-moment',
        title: 'Breakthrough Explorer',
        description: 'You recognized and honored a moment of transformation',
        category: 'wisdom'
      };
    }
    
    // Authentic expression badge
    if (presenceMetrics.journalAuthenticity > 80) {
      return {
        id: 'authentic-expression',
        title: 'Voice of Truth',
        description: 'You expressed yourself with authenticity and courage',
        category: 'courage'
      };
    }
    
    return undefined;
  }
  
  /**
   * Calculate grace token rewards for consistent pathway practice
   */
  private static calculateGraceTokenReward(
    completionData: PathwayCompletionData,
    presenceMetrics: PathwayPresenceMetrics
  ): number {
    // Special grace token for completing challenging lessons
    const challengingLessons = [3, 5, 7]; // Typically deeper/harder lessons
    
    if (challengingLessons.includes(completionData.lessonOrder) && 
        presenceMetrics.practiceDepth > 75) {
      return 1;
    }
    
    // Bonus grace token for breakthrough moments
    if (presenceMetrics.transformationalMoments > 0) {
      return 1;
    }
    
    return 0;
  }
  
  /**
   * Generate pathway-specific wisdom moments
   */
  private static generatePathwayWisdom(completionData: PathwayCompletionData): string {
    const pathwayWisdom = {
      'emotional-awareness': [
        "Every emotion is a teacher. You are becoming fluent in your inner language.",
        "Feeling your feelings fully is the first step in transforming them.",
        "Your emotional awareness is a superpower. You're learning to navigate your inner world."
      ],
      'shadow-integration': [
        "What you resist persists. What you embrace transforms.",
        "Your shadow holds gifts that can only be unlocked through compassionate witnessing.",
        "Integration doesn't mean fixing yourself. It means loving all parts of yourself."
      ],
      'inner-child-healing': [
        "Your inner child has been waiting patiently for this love. You're giving them what they've always needed.",
        "Healing your inner child heals generations. Your courage ripples forward and backward in time.",
        "Play is not frivolous. It's medicine for a soul that forgot how to be free."
      ]
    };
    
    const pathwaySpecificWisdom = pathwayWisdom[completionData.pathwayId as keyof typeof pathwayWisdom];
    
    if (pathwaySpecificWisdom) {
      return pathwaySpecificWisdom[Math.floor(Math.random() * pathwaySpecificWisdom.length)];
    }
    
    // Default wisdom for unknown pathways
    const defaultWisdom = [
      "Every step on this pathway is sacred. You are exactly where you need to be.",
      "Your commitment to growth is an act of radical self-love.",
      "Transformation happens in the space between who you were and who you're becoming."
    ];
    
    return defaultWisdom[Math.floor(Math.random() * defaultWisdom.length)];
  }
  
  /**
   * Generate personalized next step recommendations
   */
  private static generateNextStepRecommendation(
    completionData: PathwayCompletionData,
    presenceMetrics: PathwayPresenceMetrics
  ): string {
    
    // If transformational moment occurred, recommend integration time
    if (presenceMetrics.transformationalMoments > 0) {
      return "Take time to integrate this breakthrough before moving to the next lesson. Journal about what shifted for you.";
    }
    
    // If deep practice engagement, recommend continuing momentum
    if (presenceMetrics.practiceDepth > 75) {
      return "Your practice engagement is beautiful. Consider continuing with the next lesson while this energy is alive.";
    }
    
    // If low journal presence, gently encourage expression
    if (presenceMetrics.journalAuthenticity < 50) {
      return "Consider spending a few minutes with your journal before the next lesson. Your thoughts and feelings matter.";
    }
    
    // Default recommendation
    return "Rest and let this lesson settle into your being. When you feel ready, the next lesson awaits.";
  }
}

/**
 * Pathway Badge System Integration
 * Defines pathway-specific badges that integrate with the existing badge tree system
 */
export interface PathwayBadge {
  id: string;
  pathwayId: string;
  title: string;
  description: string;
  category: 'pathway' | 'practice' | 'wisdom' | 'courage' | 'presence' | 'transformation';
  icon: string;
  criteria: {
    lessonOrder?: number;
    practicesCompleted?: number;
    timeSpent?: number;
    presenceMetrics?: Partial<PathwayPresenceMetrics>;
    specialConditions?: string[];
  };
  wisdomMessage: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'sacred';
}

export const PATHWAY_BADGES: PathwayBadge[] = [
  {
    id: 'emotional-awareness-beginner',
    pathwayId: 'emotional-awareness',
    title: 'Emotion Explorer',
    description: 'You began the sacred journey of emotional awareness',
    category: 'pathway',
    icon: '🌊',
    criteria: { lessonOrder: 1 },
    wisdomMessage: 'Every master was once a beginner. You have begun.',
    rarity: 'common'
  },
  {
    id: 'emotional-awareness-graduate',
    pathwayId: 'emotional-awareness',
    title: 'Emotional Alchemist',
    description: 'You completed the foundational pathway of emotional awareness',
    category: 'transformation',
    icon: '🔮',
    criteria: { specialConditions: ['pathway_completed'] },
    wisdomMessage: 'You have learned to transform emotional lead into gold. This is ancient magic.',
    rarity: 'sacred'
  },
  {
    id: 'practice-devotee',
    pathwayId: 'any',
    title: 'Practice Devotee',
    description: 'You engaged with all practices in a single lesson',
    category: 'practice',
    icon: '🧘‍♀️',
    criteria: { practicesCompleted: 3 },
    wisdomMessage: 'Devotion to practice is devotion to your own transformation.',
    rarity: 'uncommon'
  },
  {
    id: 'breakthrough-witness',
    pathwayId: 'any',
    title: 'Breakthrough Witness',
    description: 'You recognized and honored a moment of transformation',
    category: 'wisdom',
    icon: '⚡',
    criteria: { presenceMetrics: { transformationalMoments: 1 } },
    wisdomMessage: 'You witnessed your own becoming. This is the gift of consciousness.',
    rarity: 'rare'
  },
  {
    id: 'deep-presence',
    pathwayId: 'any',
    title: 'Presence Master',
    description: 'You brought deep presence to your pathway practice',
    category: 'presence',
    icon: '🕯️',
    criteria: { 
      timeSpent: 20,
      presenceMetrics: { practiceDepth: 80, journalAuthenticity: 70 }
    },
    wisdomMessage: 'Presence is the greatest gift you can give to your own healing.',
    rarity: 'rare'
  }
];

// Export types for external use
export type {
  PathwayCompletionData,
  PathwayGamificationResult,
  PathwayMissedSession,
  PathwayPresenceMetrics,
  PathwayBadge
};