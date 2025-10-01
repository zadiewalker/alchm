/**
 * GRACE TOKEN REVOLUTIONARY SYSTEM
 * "The most radical thing you can do is be gentle with yourself"
 * 
 * This system completely reimagines engagement mechanics:
 * - Grace over pressure
 * - Healing over performance
 * - Presence over productivity
 * - Wisdom over achievement
 * - Authenticity over optimization
 */

import { Timestamp } from 'firebase/firestore';
import type { Streak, GamificationEvent } from '@/types/gamification';

export interface GraceTokenState {
  tokens: number; // Current grace tokens (0-2)
  renewalDate: string; // Next Monday ISO
  weeklyUsage: {
    week: string; // ISO week
    tokensUsed: number;
    tokensEarned: number; // can earn extras through vulnerability
    healingMoments: string[]; // when tokens were used wisely
  };
  lifetimeGraceUsed: number; // total self-compassion practiced
  wisestGraceUse: string; // user's most insightful use of grace
}

export interface PresenceMetrics {
  qualityOverQuantity: boolean; // user preference
  currentPresenceStreak: number; // based on depth, not days
  wisdomMoments: number; // insights gained
  authenticityScore: number; // genuine engagement measure
  gentlePowerLevel: number; // soft strength development
  healingMomentum: number; // organic growth measure
}

export interface AntiShameSystem {
  streakType: 'frequency' | 'wisdom' | 'presence'; // user choice
  celebrationStyle: 'subtle' | 'warm' | 'joyful'; // personalized
  returningBonusActive: boolean;
  lastShameInterruption: Timestamp | null; // when we prevented shame
  gentleRemindersEnabled: boolean;
  pauseButtonAlwaysVisible: boolean;
  courageRecognitionActive: boolean; // celebrate showing up imperfectly
}

/**
 * Revolutionary Grace Token Logic
 * - 2 tokens per week, renewed every Monday
 * - Can be earned through vulnerability and mutual support
 * - Using a token is celebrated, not penalized
 * - Grace usage becomes data for self-compassion insights
 */
export class GraceTokenSystem {
  
  /**
   * Check if grace tokens should be renewed (every Monday)
   */
  static shouldRenewTokens(lastRenewal: string): boolean {
    const lastRenewalDate = new Date(lastRenewal);
    const now = new Date();
    
    // Get this Monday
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - now.getDay() + 1);
    thisMonday.setHours(0, 0, 0, 0);
    
    // Get last Monday from renewal date
    const lastMonday = new Date(lastRenewalDate);
    lastMonday.setDate(lastRenewalDate.getDate() - lastRenewalDate.getDay() + 1);
    lastMonday.setHours(0, 0, 0, 0);
    
    return thisMonday.getTime() > lastMonday.getTime();
  }

  /**
   * Get next Monday for renewal
   */
  static getNextRenewalDate(): string {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() - now.getDay() + 8); // Next Monday
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday.toISOString();
  }

  /**
   * Renew grace tokens (every Monday celebration)
   */
  static renewGraceTokens(userId: string, currentState: GraceTokenState): {
    newState: GraceTokenState;
    celebrationMessage: string;
    healingInsight: string;
  } {
    const weekKey = this.getISOWeek(new Date());
    
    // Gentle celebration of last week's self-compassion
    const lastWeekUsage = currentState.weeklyUsage?.tokensUsed || 0;
    const celebrationMessage = this.getCelebrationMessage(lastWeekUsage);
    const healingInsight = this.getWeeklyHealingInsight(lastWeekUsage, currentState.weeklyUsage?.healingMoments || []);

    const newState: GraceTokenState = {
      tokens: 2, // Fresh start every Monday
      renewalDate: this.getNextRenewalDate(),
      weeklyUsage: {
        week: weekKey,
        tokensUsed: 0,
        tokensEarned: 0,
        healingMoments: []
      },
      lifetimeGraceUsed: currentState.lifetimeGraceUsed,
      wisestGraceUse: currentState.wisestGraceUse
    };

    return { newState, celebrationMessage, healingInsight };
  }

  /**
   * Use a grace token with celebration and wisdom tracking
   */
  static useGraceToken(
    currentState: GraceTokenState, 
    reason: string, 
    daysMissed: number
  ): {
    newState: GraceTokenState;
    celebrationMessage: string;
    wisdomMoment: string;
    shouldCelebrateVulnerability: boolean;
  } {
    if (currentState.tokens <= 0) {
      throw new Error('No grace tokens available');
    }

    const wisdomMoment = this.generateWisdomMoment(reason, daysMissed);
    const celebrationMessage = this.getGraceUsageCelebration(reason);
    
    const healingMoment = `${new Date().toISOString()}: Used grace for ${reason}. ${wisdomMoment}`;
    
    const newState: GraceTokenState = {
      ...currentState,
      tokens: currentState.tokens - 1,
      weeklyUsage: {
        ...currentState.weeklyUsage,
        tokensUsed: (currentState.weeklyUsage?.tokensUsed || 0) + 1,
        healingMoments: [...(currentState.weeklyUsage?.healingMoments || []), healingMoment]
      },
      lifetimeGraceUsed: currentState.lifetimeGraceUsed + 1,
      wisestGraceUse: this.isWiserGraceUse(wisdomMoment, currentState.wisestGraceUse) 
        ? wisdomMoment 
        : currentState.wisestGraceUse
    };

    return {
      newState,
      celebrationMessage,
      wisdomMoment,
      shouldCelebrateVulnerability: this.shouldCelebrateVulnerability(reason, daysMissed)
    };
  }

  /**
   * Earn extra grace tokens through vulnerability and mutual support
   */
  static earnGraceToken(
    currentState: GraceTokenState,
    reason: 'vulnerability' | 'mutual_support' | 'courage_return' | 'wisdom_sharing'
  ): {
    newState: GraceTokenState;
    earnedMessage: string;
    healingGrowth: string;
  } {
    const maxTokens = 3; // Can earn up to 1 extra per week
    if (currentState.tokens >= maxTokens) {
      return {
        newState: currentState,
        earnedMessage: "Your grace cup is already full. That's beautiful.",
        healingGrowth: "You're learning to receive the grace you already have."
      };
    }

    const earnedMessage = this.getTokenEarnedMessage(reason);
    const healingGrowth = this.getHealingGrowthInsight(reason);
    
    const newState: GraceTokenState = {
      ...currentState,
      tokens: Math.min(currentState.tokens + 1, maxTokens),
      weeklyUsage: {
        ...currentState.weeklyUsage,
        tokensEarned: (currentState.weeklyUsage?.tokensEarned || 0) + 1,
        healingMoments: [
          ...(currentState.weeklyUsage?.healingMoments || []),
          `${new Date().toISOString()}: Earned grace through ${reason}. ${healingGrowth}`
        ]
      }
    };

    return { newState, earnedMessage, healingGrowth };
  }

  /**
   * Recovery multiplier system - celebrating returns
   */
  static calculateRecoveryBonus(
    daysAway: number, 
    pauseReason?: string
  ): {
    multiplier: number;
    duration: number; // days
    celebrationMessage: string;
    courageRecognition: string;
  } {
    // Longer absences get more celebration, not punishment
    let multiplier = 1.5;
    let duration = 3;
    
    if (daysAway > 7) {
      multiplier = 2.0; // Extra celebration for coming back after a week
      duration = 5;
    }
    
    if (daysAway > 30) {
      multiplier = 2.5; // Maximum celebration for returning after a month
      duration = 7;
    }

    const celebrationMessage = this.getReturnCelebration(daysAway, pauseReason);
    const courageRecognition = this.getCourageRecognition(daysAway);

    return { multiplier, duration, celebrationMessage, courageRecognition };
  }

  // Private helper methods
  private static getISOWeek(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
  }

  private static getCelebrationMessage(tokensUsed: number): string {
    if (tokensUsed === 0) {
      return "You flowed with grace this week. Your rhythm is finding its way.";
    } else if (tokensUsed === 1) {
      return "You used grace wisely this week. Self-compassion is a strength.";
    } else {
      return "You honored your humanity this week. Grace upon grace.";
    }
  }

  private static getWeeklyHealingInsight(tokensUsed: number, healingMoments: string[]): string {
    if (tokensUsed === 0) {
      return "Your consistency came from inner alignment this week.";
    } else {
      return `You practiced self-compassion ${tokensUsed} time${tokensUsed > 1 ? 's' : ''}. That's wisdom.`;
    }
  }

  private static generateWisdomMoment(reason: string, daysMissed: number): string {
    const wisdomMap: Record<string, string[]> = {
      overwhelmed: [
        "Overwhelm is information. You're learning to honor your capacity.",
        "Stepping back when overwhelmed is emotional intelligence.",
        "Your system knew it needed space. That's inner wisdom."
      ],
      processing: [
        "Deep processing takes time. You're honoring your healing rhythm.",
        "Some insights need space to emerge. You created that space.",
        "Processing is active healing work, even when it looks like rest."
      ],
      life_changes: [
        "Life transitions require extra grace. You're adapting with wisdom.",
        "Change disrupts routines, not commitment. You understand the difference.",
        "Flexibility during change is a form of self-compassion."
      ],
      crisis: [
        "Crisis calls for all your resources. You prioritized survival.",
        "Coming back after crisis takes immense courage.",
        "You protected your energy when you needed it most."
      ]
    };

    const options = wisdomMap[reason] || [
      "You knew what you needed and you honored it.",
      "Self-awareness led you to choose grace over pressure.",
      "You practiced the radical act of being gentle with yourself."
    ];

    return options[Math.floor(Math.random() * options.length)];
  }

  private static getGraceUsageCelebration(reason: string): string {
    const celebrations: Record<string, string> = {
      overwhelmed: "You chose self-care over self-criticism. That's growth.",
      processing: "You honored your need for processing time. That's wisdom.",
      life_changes: "You adapted to life's changes with grace. That's resilience.",
      crisis: "You prioritized your wellbeing. That's survival wisdom.",
      grief: "You gave yourself space to grieve. That's love.",
      healing: "You honored your healing process. That's courage."
    };

    return celebrations[reason] || "You practiced radical self-compassion. That's revolutionary.";
  }

  private static shouldCelebrateVulnerability(reason: string, daysMissed: number): boolean {
    // Always celebrate vulnerability - using grace tokens IS vulnerability
    return true;
  }

  private static isWiserGraceUse(newUse: string, currentWisest: string): boolean {
    // Simple heuristic: longer, more thoughtful descriptions are "wiser"
    return newUse.length > (currentWisest?.length || 0);
  }

  private static getTokenEarnedMessage(reason: string): string {
    const messages: Record<string, string> = {
      vulnerability: "Your vulnerability just earned you grace. That's how healing compounds.",
      mutual_support: "Supporting others filled your own grace cup. That's sacred reciprocity.", 
      courage_return: "Your courage to return earned you extra grace. That's wisdom.",
      wisdom_sharing: "Sharing your wisdom earned you grace. That's how healing spreads."
    };

    return messages[reason] || "Your authentic presence earned you grace.";
  }

  private static getHealingGrowthInsight(reason: string): string {
    const insights: Record<string, string> = {
      vulnerability: "You're learning that vulnerability multiplies grace.",
      mutual_support: "You're discovering that giving and receiving heal together.",
      courage_return: "You're understanding that returning takes courage.",
      wisdom_sharing: "You're seeing how your wisdom helps others heal."
    };

    return insights[reason] || "You're growing in ways that create more grace.";
  }

  private static getReturnCelebration(daysAway: number, pauseReason?: string): string {
    if (daysAway <= 3) {
      return "You took the space you needed and you're back. That's self-awareness.";
    } else if (daysAway <= 7) {
      return "A week away, and you returned. That takes courage.";
    } else if (daysAway <= 30) {
      return "You weathered a longer pause and chose to return. That's resilience.";
    } else {
      return "After a month away, you're here again. That's profound courage.";
    }
  }

  private static getCourageRecognition(daysAway: number): string {
    if (daysAway <= 3) {
      return "You are someone who honors their needs and returns to their practice.";
    } else if (daysAway <= 7) {
      return "You are someone who takes the time they need and has the courage to begin again.";
    } else if (daysAway <= 30) {
      return "You are someone who can step away when needed and step back in when ready.";
    } else {
      return "You are someone who returns to healing even after long absences. That's wisdom.";
    }
  }
}

/**
 * Presence-Over-Performance Metrics
 * Revolutionary system that measures depth instead of frequency
 */
export class PresenceMetricSystem {
  
  /**
   * Calculate presence quality based on engagement depth, not quantity
   */
  static calculatePresenceQuality(
    journalEntry: {
      wordCount: number;
      emotionalDepth: number; // 1-10 scale
      insightMoments: number; // breakthrough realizations
      vulnerabilityLevel: number; // how open the entry was
      selfCompassionPracticed: boolean;
    }
  ): {
    presenceScore: number; // 0-100
    qualityMarkers: string[];
    wisdomGained: string;
    healingMomentum: number; // growth measure
  } {
    let score = 0;
    const markers: string[] = [];
    let healingMomentum = 0;

    // Depth over length
    if (journalEntry.emotionalDepth >= 7) {
      score += 30;
      markers.push("Emotional depth explored");
      healingMomentum += 2;
    } else if (journalEntry.emotionalDepth >= 5) {
      score += 20;
      markers.push("Emotions acknowledged");
      healingMomentum += 1;
    }

    // Insight moments (breakthrough understanding)
    score += journalEntry.insightMoments * 15;
    if (journalEntry.insightMoments > 0) {
      markers.push(`${journalEntry.insightMoments} insight moment${journalEntry.insightMoments > 1 ? 's' : ''} recognized`);
      healingMomentum += journalEntry.insightMoments;
    }

    // Vulnerability (courage to be real)
    if (journalEntry.vulnerabilityLevel >= 7) {
      score += 25;
      markers.push("High vulnerability - courage shown");
      healingMomentum += 3;
    } else if (journalEntry.vulnerabilityLevel >= 5) {
      score += 15;
      markers.push("Authentic sharing");
      healingMomentum += 1;
    }

    // Self-compassion practice
    if (journalEntry.selfCompassionPracticed) {
      score += 20;
      markers.push("Self-compassion practiced");
      healingMomentum += 2;
    }

    // Word count matters less, but some writing is needed
    if (journalEntry.wordCount >= 100) {
      score += 10;
    }

    const wisdomGained = this.generateWisdomInsight(markers, score);

    return {
      presenceScore: Math.min(score, 100),
      qualityMarkers: markers,
      wisdomGained,
      healingMomentum: Math.min(healingMomentum, 10)
    };
  }

  /**
   * Wisdom streak - based on insight quality, not daily frequency
   */
  static updateWisdomStreak(
    currentStreak: number,
    presenceScore: number,
    daysSinceLastEntry: number
  ): {
    newWisdomStreak: number;
    streakMessage: string;
    wisdomEvolution: string;
  } {
    // Wisdom streaks are more forgiving - based on quality when you do show up
    let newStreak = currentStreak;
    let message = "";
    let evolution = "";

    if (presenceScore >= 70) {
      // High-quality presence always advances wisdom streak
      newStreak = currentStreak + 1;
      message = "Deep presence maintained your wisdom streak";
      evolution = "Your capacity for insight is growing";
    } else if (presenceScore >= 40) {
      // Medium presence maintains streak even with gaps
      if (daysSinceLastEntry <= 7) {
        newStreak = currentStreak + 1;
        message = "Authentic presence continued your wisdom streak";
      } else {
        // Maintain streak but don't advance
        message = "Your return maintains your wisdom streak";
      }
      evolution = "You're learning to show up authentically";
    } else {
      // Lower presence still maintains if recent
      if (daysSinceLastEntry <= 3) {
        // No advancement, but no loss
        message = "You showed up. That maintains your wisdom streak.";
        evolution = "Showing up is the foundation of wisdom";
      } else {
        // Gentle reset with celebration of return
        newStreak = 1;
        message = "Your wisdom streak gently resets, but your growth continues";
        evolution = "Every return is a new beginning for wisdom";
      }
    }

    return { newWisdomStreak: newStreak, streakMessage: message, wisdomEvolution: evolution };
  }

  private static generateWisdomInsight(markers: string[], score: number): string {
    if (score >= 80) {
      return "This entry shows profound self-awareness and courage.";
    } else if (score >= 60) {
      return "You're developing deeper emotional intelligence.";
    } else if (score >= 40) {
      return "You're learning to be present with your experience.";
    } else {
      return "You showed up. That's the beginning of all wisdom.";
    }
  }
}

/**
 * Anti-Shame Celebration System
 * Every interaction designed to build self-compassion, never shame
 */
export class AntiShameSystem {
  
  /**
   * Generate celebration that never creates pressure
   */
  static generateCelebration(
    achievement: string,
    userPreferences: {
      celebrationStyle: 'subtle' | 'warm' | 'joyful';
      anxietyTriggers: boolean;
      perfectionismTriggers: boolean;
    }
  ): {
    message: string;
    animation: 'gentle' | 'flowing' | 'blooming';
    duration: number; // milliseconds
    sageGreenAccent: boolean;
  } {
    const { celebrationStyle, anxietyTriggers, perfectionismTriggers } = userPreferences;
    
    // Ultra-gentle for anxiety-prone users
    if (anxietyTriggers) {
      return {
        message: this.getGentleMessage(achievement),
        animation: 'gentle',
        duration: 1500,
        sageGreenAccent: true
      };
    }

    // Avoid achievement language for perfectionism triggers
    if (perfectionismTriggers) {
      return {
        message: this.getProgressMessage(achievement),
        animation: 'flowing',
        duration: 2000,
        sageGreenAccent: true
      };
    }

    // Celebrate according to user preference
    switch (celebrationStyle) {
      case 'subtle':
        return {
          message: this.getSubtleMessage(achievement),
          animation: 'gentle',
          duration: 1000,
          sageGreenAccent: true
        };
      case 'warm':
        return {
          message: this.getWarmMessage(achievement),
          animation: 'flowing',
          duration: 2500,
          sageGreenAccent: true
        };
      case 'joyful':
        return {
          message: this.getJoyfulMessage(achievement),
          animation: 'blooming',
          duration: 3000,
          sageGreenAccent: true
        };
      default:
        return {
          message: this.getWarmMessage(achievement),
          animation: 'flowing',
          duration: 2000,
          sageGreenAccent: true
        };
    }
  }

  /**
   * Interrupt shame spirals with compassionate reframes
   */
  static interceptShameSpiral(
    shameIndicators: {
      missedDays: number;
      selfCriticalLanguage: boolean;
      perfectionismSpike: boolean;
      comparisonThoughts: boolean;
    }
  ): {
    reframe: string;
    compassionPractice: string;
    graceReminder: string;
    wisdomInsertion: string;
  } {
    const reframes = [
      "Your worth isn't measured by your consistency.",
      "Healing happens in spirals, not straight lines.",
      "Rest is part of the rhythm, not a break from it.",
      "You're exactly where you need to be in your journey."
    ];

    const practices = [
      "Take three deep breaths and place your hand on your heart.",
      "Notice what you would say to a friend in this situation.",
      "Remember: you're learning, not performing.",
      "Gentle reminder: grace is always available to you."
    ];

    const graceReminders = [
      "You have grace tokens for a reason - use them without guilt.",
      "Self-compassion is revolutionary. You're being radical.",
      "Your grace tokens are gifts to your future self.",
      "Using grace is wisdom, not weakness."
    ];

    const wisdomInsertions = [
      "This feeling means you care. That's beautiful.",
      "Perfectionism is fear wearing a crown.",
      "Your healing journey is unique - comparisons distort truth.",
      "Showing up imperfectly is still showing up."
    ];

    return {
      reframe: reframes[Math.floor(Math.random() * reframes.length)],
      compassionPractice: practices[Math.floor(Math.random() * practices.length)],
      graceReminder: graceReminders[Math.floor(Math.random() * graceReminders.length)],
      wisdomInsertion: wisdomInsertions[Math.floor(Math.random() * wisdomInsertions.length)]
    };
  }

  // Private message generators
  private static getGentleMessage(achievement: string): string {
    return `You ${achievement.toLowerCase()}. That's meaningful.`;
  }

  private static getProgressMessage(achievement: string): string {
    return `Your journey continues with ${achievement.toLowerCase()}.`;
  }

  private static getSubtleMessage(achievement: string): string {
    return `${achievement} 🌱`;
  }

  private static getWarmMessage(achievement: string): string {
    return `${achievement}. Your courage is growing.`;
  }

  private static getJoyfulMessage(achievement: string): string {
    return `🌟 ${achievement}! You're becoming who you're meant to be.`;
  }
}