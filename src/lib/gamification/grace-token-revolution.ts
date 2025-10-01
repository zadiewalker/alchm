/**
 * Revolutionary Grace Token System
 * A trauma-informed gamification approach that prioritizes self-compassion over performance
 */

export interface GraceTokenState {
  tokens: number;
  renewalDate: string;
  weeklyUsage: {
    week: string;
    tokensUsed: number;
    tokensEarned: number;
    healingMoments: string[];
  };
  lifetimeGraceUsed: number;
  wisestGraceUse: string;
}

export interface PresenceMetrics {
  consistency: number;
  depth: number;
  authenticity: number;
  selfCompassion: number;
  growthMoments: number;
}

export interface AntiShameSystem {
  shameInterceptions: number;
  celebrationsMoments: string[];
  wisdomGained: string[];
  supportOffered: string[];
}

export interface GraceTokenUsageResult {
  success: boolean;
  newTokenCount: number;
  wisdomMoment: string;
  celebrationMessage: string;
  renewalInfo: string;
}

export interface ShameInterceptionResult {
  intercepted: boolean;
  redirectMessage: string;
  alternativeFraming: string;
  nurturingAction: string;
}

/**
 * Grace Token System - Revolutionary approach to "missed days"
 * Transforms perfectionism into self-compassion
 */
export class GraceTokenSystem {
  static getNextRenewalDate(): string {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday.toISOString();
  }

  static shouldRenewTokens(renewalDate: string): boolean {
    return new Date().toISOString() >= renewalDate;
  }

  static useGraceToken(
    currentState: GraceTokenState,
    reason: string,
    daysMissed: number = 1
  ): GraceTokenUsageResult {
    if (currentState.tokens <= 0) {
      throw new Error('No grace tokens available');
    }

    const wisdomMoments = [
      "You chose self-awareness over self-punishment. This is the path of healing.",
      "Acknowledging your humanity is an act of courage. You're practicing radical self-acceptance.",
      "You used grace instead of shame. This rewires your neural pathways toward compassion.",
      "This pause doesn't diminish your progress. It deepens your relationship with gentleness.",
      "You honored your limits. This is how sustainable healing happens."
    ];

    const celebrationMessages = [
      "🌱 Your grace token became wisdom. This is how you heal perfectionism.",
      "✨ You chose kindness over criticism. Your nervous system is learning safety.",
      "🕊️ This gentle choice creates space for authentic growth.",
      "💎 Grace used wisely becomes inner strength. You're embodying trauma-informed healing.",
      "🌙 You practiced self-compassion in a moment of difficulty. This is revolutionary."
    ];

    const randomWisdom = wisdomMoments[Math.floor(Math.random() * wisdomMoments.length)];
    const randomCelebration = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

    return {
      success: true,
      newTokenCount: currentState.tokens - 1,
      wisdomMoment: randomWisdom,
      celebrationMessage: randomCelebration,
      renewalInfo: `Grace tokens renew every Monday. Next renewal: ${new Date(currentState.renewalDate).toLocaleDateString()}`
    };
  }

  static renewWeeklyTokens(currentState: GraceTokenState): GraceTokenState {
    return {
      ...currentState,
      tokens: 2,
      renewalDate: this.getNextRenewalDate(),
      weeklyUsage: {
        week: new Date().toISOString().slice(0, 7), // YYYY-MM format
        tokensUsed: 0,
        tokensEarned: 0,
        healingMoments: []
      }
    };
  }
}

/**
 * Presence Metrics System - Quality over quantity
 * Measures meaningful engagement rather than performance metrics
 */
export class PresenceMetricSystem {
  static calculatePresence(journalData: any): PresenceMetrics {
    return {
      consistency: this.calculateConsistency(journalData),
      depth: this.calculateDepth(journalData),
      authenticity: this.calculateAuthenticity(journalData),
      selfCompassion: this.calculateSelfCompassion(journalData),
      growthMoments: this.calculateGrowthMoments(journalData)
    };
  }

  private static calculateConsistency(data: any): number {
    // Focus on sustainable patterns rather than perfect streaks
    // Values gentle regularity over intense bursts
    return Math.min(100, (data.gentleRegularity || 0) * 20);
  }

  private static calculateDepth(data: any): number {
    // Measures emotional honesty and self-reflection depth
    return Math.min(100, (data.emotionalHonesty || 0) * 25);
  }

  private static calculateAuthenticity(data: any): number {
    // Celebrates genuine expression over "positive" content
    return Math.min(100, (data.authenticExpression || 0) * 25);
  }

  private static calculateSelfCompassion(data: any): number {
    // Tracks instances of self-kindness and gentle language
    return Math.min(100, (data.selfKindness || 0) * 30);
  }

  private static calculateGrowthMoments(data: any): number {
    // Recognizes insights, breakthroughs, and healing moments
    return data.insightCount || 0;
  }
}

/**
 * Anti-Shame System - Trauma-informed shame interruption
 * Prevents shame spirals and redirects toward healing
 */
export class AntiShameSystem {
  static interceptShameSpiral(indicators: {
    missedDays: number;
    selfCriticalLanguage: boolean;
    perfectionismSpike: boolean;
    comparisonThoughts: boolean;
  }): ShameInterceptionResult {
    const shameLevel = this.calculateShameRisk(indicators);
    
    if (shameLevel < 3) {
      return {
        intercepted: false,
        redirectMessage: "You're practicing healthy self-awareness.",
        alternativeFraming: "Your consistency is building sustainable healing.",
        nurturingAction: "Continue with gentle presence."
      };
    }

    const interventions = [
      {
        redirectMessage: "Notice: You're being harder on yourself than you'd be on a dear friend.",
        alternativeFraming: "What if this 'failure' is actually information about what you need right now?",
        nurturingAction: "Try speaking to yourself with the same kindness you'd offer someone you love."
      },
      {
        redirectMessage: "Pause: Your worth isn't determined by perfect consistency.",
        alternativeFraming: "Healing happens in cycles, not straight lines. This pause might be exactly what your nervous system needs.",
        nurturingAction: "Take three deep breaths and remind yourself: 'I am worthy of compassion, especially from myself.'"
      },
      {
        redirectMessage: "Redirect: You're human, not a productivity machine.",
        alternativeFraming: "Missing days doesn't erase your progress. It makes you beautifully, perfectly human.",
        nurturingAction: "List three things you're proud of from your healing journey, no matter how small."
      }
    ];

    const selectedIntervention = interventions[Math.floor(Math.random() * interventions.length)];

    return {
      intercepted: true,
      ...selectedIntervention
    };
  }

  static generateCelebration(achievement: string, preferences: any): string {
    const celebrationStyles = {
      gentle: [
        `You ${achievement}. That's enough. That's beautiful.`,
        `${achievement} - this is how healing happens, one gentle moment at a time.`,
        `Notice how you ${achievement}. Your nervous system is learning safety.`
      ],
      enthusiastic: [
        `🌟 You ${achievement}! This is the energy of authentic growth!`,
        `✨ ${achievement} - you're literally rewiring your brain for healing!`,
        `🚀 Look at you ${achievement}! This is what sustainable transformation looks like!`
      ],
      wise: [
        `In ${achievement}, you practiced the ancient art of self-compassion.`,
        `${achievement} - you're embodying the wisdom that healing is not a race.`,
        `Through ${achievement}, you're teaching your inner child that they are safe to grow.`
      ]
    };

    const style = preferences?.celebrationStyle || 'gentle';
    const messages = celebrationStyles[style as keyof typeof celebrationStyles] || celebrationStyles.gentle;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private static calculateShameRisk(indicators: {
    missedDays: number;
    selfCriticalLanguage: boolean;
    perfectionismSpike: boolean;
    comparisonThoughts: boolean;
  }): number {
    let risk = 0;
    
    if (indicators.missedDays > 2) risk += 2;
    if (indicators.selfCriticalLanguage) risk += 2;
    if (indicators.perfectionismSpike) risk += 1;
    if (indicators.comparisonThoughts) risk += 1;
    
    return risk;
  }
}

// Export types for external use
export type {
  GraceTokenState,
  PresenceMetrics,
  AntiShameSystem as AntiShameSystemType,
  GraceTokenUsageResult,
  ShameInterceptionResult
};