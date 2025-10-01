/**
 * ALCHM Grace-Based Streak System
 * Revolutionary anti-shame streak mechanics that prioritize healing over metrics
 */

export interface GraceToken {
  id: string;
  type: 'weekly' | 'bonus' | 'community';
  grantedAt: Date;
  usedAt?: Date;
  reason?: string; // Why the grace was needed
  isActive: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  graceTokens: GraceToken[];
  lastEntryDate?: Date;
  streakStartDate?: Date;
  pausedUntil?: Date; // Universal pause functionality
  kindnessBreaks: KindnessBreak[];
}

export interface KindnessBreak {
  id: string;
  startDate: Date;
  endDate?: Date;
  reason: 'mental_health' | 'life_event' | 'burnout' | 'celebration' | 'other';
  selfCompassionNote?: string;
  isActive: boolean;
}

export class GraceStreakManager {
  private static readonly WEEKLY_GRACE_TOKENS = 2;
  private static readonly GRACE_RESET_DAY = 1; // Monday
  private static readonly RECOVERY_MULTIPLIER = 1.5;
  private static readonly RECOVERY_DURATION_DAYS = 7;
  private static readonly GRACE_DECAY_DAYS = 3; // Days before streak resets
  
  /**
   * Calculate grace tokens available this week
   * Everyone gets 2 tokens every Monday, no questions asked
   */
  static calculateWeeklyGraceTokens(streakData: StreakData): number {
    const now = new Date();
    const weekStart = this.getWeekStart(now);
    
    const tokensUsedThisWeek = streakData.graceTokens.filter(token => 
      token.type === 'weekly' && 
      token.usedAt && 
      token.usedAt >= weekStart
    ).length;
    
    return Math.max(0, this.WEEKLY_GRACE_TOKENS - tokensUsedThisWeek);
  }
  
  /**
   * Use a grace token to maintain streak
   * Returns updated streak data with grace applied
   */
  static useGraceToken(
    streakData: StreakData, 
    reason?: string
  ): { success: boolean; updatedData: StreakData; message: string } {
    const availableTokens = this.calculateWeeklyGraceTokens(streakData);
    
    if (availableTokens <= 0) {
      return {
        success: false,
        updatedData: streakData,
        message: "No grace tokens available this week. That's okay - your journey continues."
      };
    }
    
    const graceToken: GraceToken = {
      id: `grace_${Date.now()}`,
      type: 'weekly',
      grantedAt: this.getWeekStart(new Date()),
      usedAt: new Date(),
      reason: reason || 'Needed grace today',
      isActive: true
    };
    
    const updatedData: StreakData = {
      ...streakData,
      graceTokens: [...streakData.graceTokens, graceToken],
      lastEntryDate: new Date() // Grace counts as maintaining the streak
    };
    
    return {
      success: true,
      updatedData,
      message: this.generateGraceMessage()
    };
  }
  
  /**
   * Start a kindness break - pauses all streak pressure
   */
  static startKindnessBreak(
    streakData: StreakData,
    reason: KindnessBreak['reason'],
    selfCompassionNote?: string
  ): StreakData {
    const kindnessBreak: KindnessBreak = {
      id: `break_${Date.now()}`,
      startDate: new Date(),
      reason,
      selfCompassionNote,
      isActive: true
    };
    
    return {
      ...streakData,
      pausedUntil: undefined, // Will be set when break ends
      kindnessBreaks: [...streakData.kindnessBreaks, kindnessBreak]
    };
  }
  
  /**
   * End a kindness break and resume gentle streak tracking
   */
  static endKindnessBreak(
    streakData: StreakData,
    breakId: string
  ): StreakData {
    const updatedBreaks = streakData.kindnessBreaks.map(breakItem => 
      breakItem.id === breakId 
        ? { ...breakItem, endDate: new Date(), isActive: false }
        : breakItem
    );
    
    return {
      ...streakData,
      kindnessBreaks: updatedBreaks,
      pausedUntil: undefined
    };
  }
  
  /**
   * Calculate current streak with grace mechanics
   */
  static calculateCurrentStreak(streakData: StreakData): {
    streak: number;
    isGraceProtected: boolean;
    message: string;
  } {
    // If on kindness break, maintain streak without pressure
    const activeBreak = streakData.kindnessBreaks.find(b => b.isActive);
    if (activeBreak) {
      return {
        streak: streakData.currentStreak,
        isGraceProtected: true,
        message: "Taking a kindness break. Your progress is safe. 🌿"
      };
    }
    
    if (!streakData.lastEntryDate) {
      return {
        streak: 0,
        isGraceProtected: false,
        message: "Ready to begin your journey? No pressure, just presence."
      };
    }
    
    const daysSinceLastEntry = this.getDaysSince(streakData.lastEntryDate);
    
    // Same day or yesterday = streak continues
    if (daysSinceLastEntry <= 1) {
      return {
        streak: streakData.currentStreak,
        isGraceProtected: false,
        message: "Your rhythm flows beautifully."
      };
    }
    
    // Grace period - offer token usage
    if (daysSinceLastEntry === 2) {
      const availableGrace = this.calculateWeeklyGraceTokens(streakData);
      return {
        streak: streakData.currentStreak,
        isGraceProtected: availableGrace > 0,
        message: availableGrace > 0 
          ? "Grace available if you need it. No shame, only choice." 
          : "Life happens. Your journey continues."
      };
    }
    
    // Beyond grace period - gentle reset
    return {
      streak: 0,
      isGraceProtected: false,
      message: "Every ending is a new beginning. Welcome back when you're ready."
    };
  }
  
  /**
   * Award bonus grace tokens for exceptional self-care moments
   */
  static awardBonusGraceToken(
    streakData: StreakData,
    reason: 'vulnerability' | 'breakthrough' | 'compassion' | 'courage' | 'community_support'
  ): StreakData {
    const bonusToken: GraceToken = {
      id: `bonus_${Date.now()}`,
      type: 'bonus',
      grantedAt: new Date(),
      reason: this.getBonusTokenReason(reason),
      isActive: true
    };
    
    return {
      ...streakData,
      graceTokens: [...streakData.graceTokens, bonusToken]
    };
  }
  
  /**
   * Generate dynamic grace messages that adapt to user's journey phase
   */
  static generateGraceMessage(journeyPhase?: 'beginning' | 'building' | 'flowing' | 'mastery'): string {
    const messagesByPhase = {
      beginning: [
        "Grace received. You're learning to be gentle with yourself.",
        "Kindness applied. Every beginning deserves compassion.",
        "You're planting seeds of self-compassion. Beautiful.",
        "Grace flows here. You're safe to be imperfect."
      ],
      building: [
        "Grace token used. You're building something sustainable.",
        "Gentleness granted. Your rhythm is forming beautifully.",
        "You're exactly where you need to be in this moment.",
        "Grace flows freely. You're learning your own needs."
      ],
      flowing: [
        "Grace applied with wisdom. You know yourself well.",
        "Your self-awareness is a gift. This pause serves you.",
        "You honor your limits. That's true strength.",
        "Grace received. You're mastering the art of self-care."
      ],
      mastery: [
        "Grace flows through you like a river. You embody wisdom.",
        "You use grace with deep knowing. A teacher of self-compassion.",
        "Your relationship with grace is sacred. You inspire others.",
        "Grace token used with mastery. You are healing incarnate."
      ]
    };
    
    const messages = messagesByPhase[journeyPhase || 'beginning'];
    return messages[Math.floor(Math.random() * messages.length)] || "Grace flows here.";
  }
  
  /**
   * Calculate recovery multiplier status
   */
  static calculateRecoveryStatus(streakData: StreakData): {
    isActive: boolean;
    daysRemaining: number;
    multiplier: number;
    activatedAt?: Date;
  } {
    const lastBreak = streakData.kindnessBreaks.find(b => b.endDate);
    if (!lastBreak?.endDate) {
      return { isActive: false, daysRemaining: 0, multiplier: 1 };
    }
    
    const daysSinceReturn = this.getDaysSince(lastBreak.endDate);
    const isActive = daysSinceReturn <= this.RECOVERY_DURATION_DAYS;
    
    return {
      isActive,
      daysRemaining: Math.max(0, this.RECOVERY_DURATION_DAYS - daysSinceReturn),
      multiplier: isActive ? this.RECOVERY_MULTIPLIER : 1,
      activatedAt: lastBreak.endDate
    };
  }
  
  private static getBonusTokenReason(reason: string): string {
    const reasons = {
      vulnerability: 'Showed beautiful vulnerability in sharing',
      breakthrough: 'Achieved a meaningful breakthrough moment',
      compassion: 'Extended deep compassion to yourself or others',
      courage: 'Acted with courage in a difficult situation',
      community_support: 'Received strength from community connection'
    };
    return reasons[reason as keyof typeof reasons] || 'Demonstrated exceptional self-care';
  }
  
  /**
   * Generate celebration without pressure or comparison
   */
  static generateCelebrationMessage(streak: number): string {
    // Avoid numbers that create pressure or comparison
    const messages = [
      "Look at you showing up. That's everything.",
      "Your consistency speaks to your strength.",
      "Each entry is a gift you give yourself.",
      "You're building something beautiful, one word at a time.",
      "Your commitment to yourself is sacred.",
      "This rhythm you're creating - it's healing incarnate.",
      "Every day you choose yourself is a victory.",
      "Your words are weaving your transformation."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)] || "Grace flows here.";
  }
  
  // Utility methods
  private static getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(d.setDate(diff));
  }
  
  private static getDaysSince(date: Date): number {
    const now = new Date();
    const timeDiff = now.getTime() - date.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }
}

/**
 * Anti-manipulation streak display utilities
 */
export class CompassionateDisplay {
  /**
   * Display streak without triggering shame or anxiety
   */
  static formatStreakDisplay(streakData: StreakData): {
    primaryText: string;
    secondaryText: string;
    showGraceTokens: boolean;
    graceCount: number;
  } {
    const { streak, isGraceProtected, message } = GraceStreakManager.calculateCurrentStreak(streakData);
    const availableGrace = GraceStreakManager.calculateWeeklyGraceTokens(streakData);
    
    // Never show "0 days" - it's shame-inducing
    if (streak === 0) {
      return {
        primaryText: "Ready to write?",
        secondaryText: message,
        showGraceTokens: availableGrace > 0,
        graceCount: availableGrace
      };
    }
    
    // Show rhythm, not numbers
    if (streak < 7) {
      return {
        primaryText: "Building your rhythm",
        secondaryText: message,
        showGraceTokens: availableGrace > 0,
        graceCount: availableGrace
      };
    }
    
    if (streak < 30) {
      return {
        primaryText: "Your rhythm is flowing",
        secondaryText: message,
        showGraceTokens: availableGrace > 0,
        graceCount: availableGrace
      };
    }
    
    return {
      primaryText: "Your ritual is sacred",
      secondaryText: message,
      showGraceTokens: availableGrace > 0,
      graceCount: availableGrace
    };
  }
  
  /**
   * Generate universal pause button text
   */
  static getPauseButtonText(): string {
    return "I need a kindness break";
  }
  
  /**
   * Generate grace token explanation
   */
  static getGraceTokenExplanation(): string {
    return "Grace tokens protect your progress when life gets complex. Two refresh every Monday, no questions asked.";
  }
}