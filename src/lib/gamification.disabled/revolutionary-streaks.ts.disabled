/**
 * ALCHM Revolutionary Streak System
 * The most psychologically engaging, anti-shame streak mechanics ever created
 * 
 * This system makes consistency addictive by celebrating presence over performance,
 * turning breaks into bonuses, and creating genuine excitement around self-care.
 */

import { GraceStreakManager, StreakData, GraceToken } from './grace-streaks';

export interface RevolutionaryStreakData extends StreakData {
  // Enhanced engagement mechanics
  luminosityLevel: number; // 0-100, shows brightness of their practice
  healingMomentum: number; // 0-1000, compounds with consistency
  wisdomAccumulated: number; // Points from deep reflections
  
  // Recovery and return mechanics
  recoveryMultiplierActive: boolean;
  recoveryEndsAt?: Date;
  returnCelebrationLevel: 'gentle' | 'warm' | 'joyful' | 'triumphant';
  
  // Flow state tracking
  flowStateEntries: number; // Entries where user was deeply engaged
  lastFlowStateDate?: Date;
  consecutiveFlowDays: number;
  
  // Psychological engagement metrics
  anticipationLevel: 'low' | 'building' | 'excited' | 'can\'t_wait';
  lastEngagementBoost?: Date;
  personalBestCelebrated: boolean;
  
  // Adaptive difficulty
  challengeLevel: 'gentle' | 'steady' | 'growing' | 'flowing';
  nextMilestoneDistance: number; // Days to next meaningful milestone
  customMilestones: CustomMilestone[];
  
  // Social proof (anonymous)
  contributesToCommunity: boolean;
  receivedEncouragement: number;
  anonymousImpactPoints: number;
}

export interface CustomMilestone {
  id: string;
  name: string;
  description: string;
  targetDays: number;
  isPersonal: boolean; // User-created vs system-suggested
  celebrationStyle: 'private' | 'gentle_share' | 'full_celebration';
  reachedAt?: Date;
  emotionalSignificance: number; // 1-10, affects celebration intensity
}

export interface EngagementMoment {
  type: 'streak_protection' | 'return_bonus' | 'flow_state' | 'milestone_approaching' | 'wisdom_accumulation';
  title: string;
  message: string;
  emotionalTone: 'supportive' | 'celebratory' | 'inspiring' | 'profound';
  actionInvitation?: string;
  bonusReward?: {
    type: 'grace_token' | 'luminosity_boost' | 'momentum_multiplier' | 'wisdom_points';
    amount: number;
    reason: string;
  };
}

export interface FlowStateDetection {
  entryWordCount: number;
  timeSpentWriting: number; // minutes
  emotionalDepth: number; // 1-10
  selfReflectionMarkers: number;
  vulnerabilityMarkers: number;
  breakthroughIndicators: number;
  overallFlowScore: number; // 0-1
}

export class RevolutionaryStreakEngine {
  
  /**
   * Calculate the most engaging possible streak display
   * Never shows shame-inducing numbers, always focuses on growth and momentum
   */
  static calculateEngagementDisplay(streakData: RevolutionaryStreakData): {
    primaryMessage: string;
    secondaryMessage: string;
    visualMetaphor: string;
    momentumIndicator: string;
    nextInvitation: string;
    celebrationLevel: 'subtle' | 'warm' | 'excited' | 'radiant';
    psychologicalReward: string;
  } {
    const luminosityPhase = this.getLuminosityPhase(streakData.luminosityLevel);
    const momentumPhase = this.getMomentumPhase(streakData.healingMomentum);
    
    return {
      primaryMessage: this.generatePrimaryMessage(streakData, luminosityPhase),
      secondaryMessage: this.generateSecondaryMessage(streakData, momentumPhase),
      visualMetaphor: this.selectVisualMetaphor(luminosityPhase, momentumPhase),
      momentumIndicator: this.createMomentumIndicator(streakData.healingMomentum),
      nextInvitation: this.craftNextInvitation(streakData),
      celebrationLevel: this.determineCelebrationLevel(streakData),
      psychologicalReward: this.generatePsychologicalReward(streakData)
    };
  }
  
  /**
   * Process a new journal entry and create maximum psychological engagement
   */
  static processNewEntry(
    streakData: RevolutionaryStreakData,
    entryData: {
      wordCount: number;
      timeSpent: number;
      emotionalMarkers: string[];
      depthScore: number;
      vulnerabilityLevel: number;
    }
  ): {
    updatedStreak: RevolutionaryStreakData;
    engagementMoments: EngagementMoment[];
    xpAwarded: number;
    multiplierApplied: number;
    flowStateDetected: boolean;
  } {
    
    const flowState = this.detectFlowState(entryData);
    const baseXP = this.calculateBaseXP(entryData);
    const multiplier = this.calculateMultiplier(streakData, flowState);
    const finalXP = Math.floor(baseXP * multiplier);
    
    // Update streak data with engagement mechanics
    const updatedStreak: RevolutionaryStreakData = {
      ...streakData,
      currentStreak: streakData.currentStreak + 1,
      luminosityLevel: Math.min(100, streakData.luminosityLevel + this.calculateLuminosityGain(entryData, flowState)),
      healingMomentum: Math.min(1000, streakData.healingMomentum + this.calculateMomentumGain(entryData, flowState)),
      wisdomAccumulated: streakData.wisdomAccumulated + (entryData.depthScore * 10),
      lastEntryDate: new Date(),
      flowStateEntries: flowState.overallFlowScore > 0.7 ? streakData.flowStateEntries + 1 : streakData.flowStateEntries,
      lastFlowStateDate: flowState.overallFlowScore > 0.7 ? new Date() : streakData.lastFlowStateDate,
      consecutiveFlowDays: this.calculateConsecutiveFlowDays(streakData, flowState),
      anticipationLevel: this.calculateAnticipationLevel(streakData)
    };
    
    // Generate engagement moments
    const engagementMoments = this.generateEngagementMoments(updatedStreak, flowState, finalXP);
    
    return {
      updatedStreak,
      engagementMoments,
      xpAwarded: finalXP,
      multiplierApplied: multiplier,
      flowStateDetected: flowState.overallFlowScore > 0.7
    };
  }
  
  /**
   * Handle streak breaks with maximum grace and bonus mechanics
   */
  static handleStreakBreak(
    streakData: RevolutionaryStreakData,
    daysMissed: number
  ): {
    updatedStreak: RevolutionaryStreakData;
    recoveryBonus: RecoveryBonus;
    encouragementMoment: EngagementMoment;
  } {
    
    const recoveryBonus = this.calculateRecoveryBonus(streakData, daysMissed);
    
    const updatedStreak: RevolutionaryStreakData = {
      ...streakData,
      currentStreak: 0,
      recoveryMultiplierActive: true,
      recoveryEndsAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days
      returnCelebrationLevel: this.determineReturnCelebrationLevel(daysMissed),
      // Preserve accumulated wisdom and momentum (with slight decay)
      healingMomentum: Math.floor(streakData.healingMomentum * 0.85), // 15% gentle decay
      luminosityLevel: Math.floor(streakData.luminosityLevel * 0.9), // 10% gentle decay
      wisdomAccumulated: streakData.wisdomAccumulated, // Wisdom never lost
      lastEngagementBoost: new Date()
    };
    
    const encouragementMoment = this.generateBreakEncouragement(daysMissed, recoveryBonus);
    
    return {
      updatedStreak,
      recoveryBonus,
      encouragementMoment
    };
  }
  
  /**
   * Create anticipation for the next entry (the secret sauce of addiction)
   */
  static generateAnticipation(streakData: RevolutionaryStreakData): {
    anticipationMessage: string;
    timeUntilNextBonus?: string;
    nextMilestonePreview: string;
    motivationalHook: string;
    personalizedInvitation: string;
  } {
    
    const nextMilestone = this.getNextMilestone(streakData);
    const timeUntilBonus = this.getTimeUntilNextBonus(streakData);
    
    return {
      anticipationMessage: this.craftAnticipationMessage(streakData),
      timeUntilNextBonus,
      nextMilestonePreview: this.previewNextMilestone(nextMilestone),
      motivationalHook: this.generateMotivationalHook(streakData),
      personalizedInvitation: this.createPersonalizedInvitation(streakData)
    };
  }
  
  /**
   * Detect flow state from writing patterns (advanced engagement detection)
   */
  private static detectFlowState(entryData: {
    wordCount: number;
    timeSpent: number;
    emotionalMarkers: string[];
    depthScore: number;
    vulnerabilityLevel: number;
  }): FlowStateDetection {
    
    const wordsPerMinute = entryData.wordCount / Math.max(1, entryData.timeSpent);
    const optimalWPM = wordsPerMinute > 20 && wordsPerMinute < 60; // Sweet spot for reflection
    
    let flowScore = 0;
    
    // Time engagement (sustained writing indicates flow)
    if (entryData.timeSpent >= 10) flowScore += 0.3;
    if (entryData.timeSpent >= 20) flowScore += 0.2;
    
    // Word count indicates depth of engagement
    if (entryData.wordCount >= 150) flowScore += 0.2;
    if (entryData.wordCount >= 300) flowScore += 0.15;
    
    // Emotional markers show authentic engagement
    const emotionalVariety = new Set(entryData.emotionalMarkers).size;
    flowScore += Math.min(0.2, emotionalVariety * 0.05);
    
    // Depth and vulnerability indicate true flow state
    flowScore += entryData.depthScore * 0.1;
    flowScore += entryData.vulnerabilityLevel * 0.05;
    
    return {
      entryWordCount: entryData.wordCount,
      timeSpentWriting: entryData.timeSpent,
      emotionalDepth: entryData.depthScore,
      selfReflectionMarkers: this.countReflectionMarkers(entryData),
      vulnerabilityMarkers: Math.floor(entryData.vulnerabilityLevel * 10),
      breakthroughIndicators: this.detectBreakthroughIndicators(entryData),
      overallFlowScore: Math.min(1, flowScore)
    };
  }
  
  /**
   * Generate multiple engagement moments to create psychological rewards
   */
  private static generateEngagementMoments(
    streakData: RevolutionaryStreakData,
    flowState: FlowStateDetection,
    xpAwarded: number
  ): EngagementMoment[] {
    const moments: EngagementMoment[] = [];
    
    // Flow state celebration
    if (flowState.overallFlowScore > 0.7) {
      moments.push({
        type: 'flow_state',
        title: 'You Found Your Flow',
        message: `You just wrote with beautiful presence and depth. Flow states like this are where real transformation happens.`,
        emotionalTone: 'celebratory',
        actionInvitation: 'How does it feel to write from this deep place?',
        bonusReward: {
          type: 'luminosity_boost',
          amount: 5,
          reason: 'Flow state achievement'
        }
      });
    }
    
    // Wisdom accumulation
    if (streakData.wisdomAccumulated > 0 && streakData.wisdomAccumulated % 100 === 0) {
      moments.push({
        type: 'wisdom_accumulation',
        title: 'Your Wisdom Grows',
        message: `You've accumulated ${streakData.wisdomAccumulated} wisdom points through deep reflection. You're building something profound.`,
        emotionalTone: 'inspiring',
        actionInvitation: 'What wisdom have you gained that surprises you?'
      });
    }
    
    // Milestone approaching
    const daysToMilestone = this.getDaysToNextMilestone(streakData);
    if (daysToMilestone <= 3 && daysToMilestone > 0) {
      moments.push({
        type: 'milestone_approaching',
        title: 'Something Beautiful Approaches',
        message: `You're ${daysToMilestone} day${daysToMilestone === 1 ? '' : 's'} away from a meaningful milestone. Feel the momentum building.`,
        emotionalTone: 'inspiring',
        actionInvitation: 'What do you want to focus on as you approach this milestone?'
      });
    }
    
    return moments;
  }
  
  // Private helper methods
  private static getLuminosityPhase(level: number): string {
    if (level >= 80) return 'radiant';
    if (level >= 60) return 'bright';
    if (level >= 40) return 'glowing';
    if (level >= 20) return 'warming';
    return 'kindling';
  }
  
  private static getMomentumPhase(momentum: number): string {
    if (momentum >= 800) return 'unstoppable';
    if (momentum >= 600) return 'flowing';
    if (momentum >= 400) return 'building';
    if (momentum >= 200) return 'gathering';
    return 'beginning';
  }
  
  private static generatePrimaryMessage(streakData: RevolutionaryStreakData, luminosityPhase: string): string {
    const messages = {
      radiant: "Your practice radiates with transformative power",
      bright: "Your consistency shines bright with wisdom",
      glowing: "Your dedication creates a warm, healing glow",
      warming: "Your commitment is kindling something beautiful",
      kindling: "You're building the sacred fire of self-discovery"
    };
    
    return messages[luminosityPhase as keyof typeof messages] || "Your journey unfolds beautifully";
  }
  
  private static generateSecondaryMessage(streakData: RevolutionaryStreakData, momentumPhase: string): string {
    const messages = {
      unstoppable: "Nothing can slow your healing momentum now",
      flowing: "Your growth flows naturally and powerfully",
      building: "Each entry builds unstoppable momentum",
      gathering: "You're gathering the energy for transformation",
      beginning: "Every great journey starts with gentle momentum"
    };
    
    return messages[momentumPhase as keyof typeof messages] || "Your dedication creates beautiful momentum";
  }
  
  private static selectVisualMetaphor(luminosityPhase: string, momentumPhase: string): string {
    if (luminosityPhase === 'radiant' && momentumPhase === 'unstoppable') return "🌟 A guiding star";
    if (luminosityPhase === 'bright') return "💫 Constellation forming";
    if (luminosityPhase === 'glowing') return "✨ Inner light growing";
    if (momentumPhase === 'flowing') return "🌊 River of growth";
    if (momentumPhase === 'building') return "🏔️ Mountain of strength";
    return "🌱 Seeds of transformation";
  }
  
  private static calculateBaseXP(entryData: any): number {
    let xp = 10; // Base for showing up
    xp += Math.min(20, Math.floor(entryData.wordCount / 10)); // Word bonus
    xp += entryData.depthScore * 5; // Depth bonus
    xp += entryData.vulnerabilityLevel * 3; // Vulnerability bonus
    return xp;
  }
  
  private static calculateMultiplier(streakData: RevolutionaryStreakData, flowState: FlowStateDetection): number {
    let multiplier = 1;
    
    if (streakData.recoveryMultiplierActive) multiplier += 0.5; // Recovery bonus
    if (flowState.overallFlowScore > 0.7) multiplier += 0.3; // Flow state bonus
    if (streakData.consecutiveFlowDays >= 3) multiplier += 0.2; // Consecutive flow bonus
    
    return multiplier;
  }
  
  // Additional helper methods would be implemented here...
  private static calculateLuminosityGain(entryData: any, flowState: FlowStateDetection): number {
    return Math.floor(2 + (flowState.overallFlowScore * 3));
  }
  
  private static calculateMomentumGain(entryData: any, flowState: FlowStateDetection): number {
    return Math.floor(10 + (flowState.overallFlowScore * 15));
  }
  
  private static calculateConsecutiveFlowDays(streakData: RevolutionaryStreakData, flowState: FlowStateDetection): number {
    if (flowState.overallFlowScore > 0.7) {
      return streakData.consecutiveFlowDays + 1;
    }
    return 0;
  }
  
  private static calculateAnticipationLevel(streakData: RevolutionaryStreakData): RevolutionaryStreakData['anticipationLevel'] {
    if (streakData.healingMomentum > 600) return 'can\'t_wait';
    if (streakData.healingMomentum > 400) return 'excited';
    if (streakData.healingMomentum > 200) return 'building';
    return 'low';
  }
  
  private static calculateRecoveryBonus(streakData: RevolutionaryStreakData, daysMissed: number): RecoveryBonus {
    return {
      multiplier: 1.5,
      durationDays: 7,
      bonusXPPerEntry: Math.min(50, daysMissed * 5),
      encouragementMessage: "Your return is a victory. You get bonus XP for choosing to come back."
    };
  }
  
  private static determineReturnCelebrationLevel(daysMissed: number): RevolutionaryStreakData['returnCelebrationLevel'] {
    if (daysMissed >= 30) return 'triumphant';
    if (daysMissed >= 14) return 'joyful';
    if (daysMissed >= 7) return 'warm';
    return 'gentle';
  }
  
  private static generateBreakEncouragement(daysMissed: number, bonus: RecoveryBonus): EngagementMoment {
    return {
      type: 'return_bonus',
      title: 'Welcome Back, Warrior',
      message: `Life happened, and that's okay. Your return is what matters. You'll get ${bonus.multiplier}x XP for the next ${bonus.durationDays} days.`,
      emotionalTone: 'supportive',
      actionInvitation: 'What brought you back to yourself today?',
      bonusReward: {
        type: 'momentum_multiplier',
        amount: bonus.multiplier,
        reason: 'Return after break'
      }
    };
  }
  
  private static getNextMilestone(streakData: RevolutionaryStreakData): CustomMilestone | null {
    const upcomingMilestones = streakData.customMilestones
      .filter(m => !m.reachedAt && m.targetDays > streakData.currentStreak)
      .sort((a, b) => a.targetDays - b.targetDays);
    
    return upcomingMilestones[0] || null;
  }
  
  private static getTimeUntilNextBonus(streakData: RevolutionaryStreakData): string | undefined {
    if (streakData.recoveryMultiplierActive && streakData.recoveryEndsAt) {
      const hoursLeft = Math.ceil((streakData.recoveryEndsAt.getTime() - Date.now()) / (1000 * 60 * 60));
      return `${hoursLeft} hours of bonus XP remaining`;
    }
    return undefined;
  }
  
  private static getDaysToNextMilestone(streakData: RevolutionaryStreakData): number {
    const nextMilestone = this.getNextMilestone(streakData);
    return nextMilestone ? nextMilestone.targetDays - streakData.currentStreak : 999;
  }
  
  private static countReflectionMarkers(entryData: any): number {
    // TODO: Implement reflection marker counting
    return Math.floor(entryData.depthScore * 2);
  }
  
  private static detectBreakthroughIndicators(entryData: any): number {
    // TODO: Implement breakthrough detection
    return entryData.vulnerabilityLevel > 7 ? 1 : 0;
  }
  
  private static craftAnticipationMessage(streakData: RevolutionaryStreakData): string {
    const messages = {
      can't_wait: "Your energy is building toward something profound. What wants to emerge in your next reflection?",
      excited: "You're in a powerful flow of growth. The next entry could be transformative.",
      building: "Something beautiful is building in your practice. Feel that momentum?",
      low: "A new day brings new possibilities for growth. What's calling your attention?"
    };
    
    return messages[streakData.anticipationLevel];
  }
  
  private static previewNextMilestone(milestone: CustomMilestone | null): string {
    if (!milestone) return "Your next milestone is being written by your courage.";
    return `${milestone.name}: ${milestone.description}`;
  }
  
  private static generateMotivationalHook(streakData: RevolutionaryStreakData): string {
    const hooks = [
      "Your transformation is accelerating. Feel that momentum building?",
      "Each reflection adds to your luminosity. You're getting brighter.",
      "Your wisdom points are accumulating beautifully. What insight will emerge next?",
      "Something is shifting in you. Your next entry could unlock it."
    ];
    
    return hooks[Math.floor(Math.random() * hooks.length)];
  }
  
  private static createPersonalizedInvitation(streakData: RevolutionaryStreakData): string {
    if (streakData.flowStateEntries >= 3) {
      return "You've found your flow state multiple times. What deeper truth wants to surface today?";
    }
    
    if (streakData.luminosityLevel >= 50) {
      return "Your inner light is bright. What would you like to illuminate in your reflection?";
    }
    
    return "Your healing journey continues. What's present in your heart right now?";
  }
  
  private static createMomentumIndicator(momentum: number): string {
    const percentage = Math.min(100, Math.floor(momentum / 10));
    const bars = Math.floor(percentage / 10);
    const filled = '▓'.repeat(bars);
    const empty = '░'.repeat(10 - bars);
    return `${filled}${empty} ${percentage}% momentum`;
  }
  
  private static craftNextInvitation(streakData: RevolutionaryStreakData): string {
    const time = new Date().getHours();
    
    if (time < 12) {
      return "What's emerging in your morning awareness?";
    } else if (time < 17) {
      return "How is your heart feeling in this moment?";
    } else {
      return "What wisdom has today offered you?";
    }
  }
  
  private static determineCelebrationLevel(streakData: RevolutionaryStreakData): 'subtle' | 'warm' | 'excited' | 'radiant' {
    if (streakData.luminosityLevel >= 80) return 'radiant';
    if (streakData.healingMomentum >= 600) return 'excited';
    if (streakData.currentStreak >= 7) return 'warm';
    return 'subtle';
  }
  
  private static generatePsychologicalReward(streakData: RevolutionaryStreakData): string {
    const rewards = [
      "Your dedication is rewiring your brain for healing.",
      "Each entry strengthens your neural pathways of self-compassion.",
      "You're literally growing new connections in your mind.",
      "Your consistency is creating lasting changes in your brain.",
      "This practice is reshaping how you relate to yourself."
    ];
    
    return rewards[Math.floor(Math.random() * rewards.length)];
  }
}

// Supporting interfaces
export interface RecoveryBonus {
  multiplier: number;
  durationDays: number;
  bonusXPPerEntry: number;
  encouragementMessage: string;
}