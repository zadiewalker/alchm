/**
 * ALCHM Freemium "Sanctuary" Tier - Healing-Centered Features for Free Users
 * 
 * This tier provides complete emotional safety and basic growth tools while 
 * maintaining dignity for free users. Never feels like a "limited trial" but 
 * a complete, dignified sanctuary experience.
 * 
 * CORE PHILOSOPHY:
 * - Grace over performance
 * - Presence over productivity  
 * - Healing-centered engagement
 * - Trauma-informed design
 * - Anti-shame mechanics
 */

import { Timestamp } from 'firebase/firestore';

// Sanctuary Tier Feature Configuration
export interface SanctuaryTierConfig {
  // Core Features Always Available
  coreFeatures: {
    // Essential journaling with basic prompts
    basicJournaling: boolean;
    graceBasedStreaks: boolean;
    essentialBadges: boolean;
    basicProgressCelebration: boolean;
    crisisSupport: boolean;
    
    // Essential emotional support
    basicReflectionPrompts: boolean;
    gentleEncouragement: boolean;
    boundaryReminders: boolean;
    pauseButtons: boolean;
    
    // Core privacy and safety
    privacyControls: boolean;
    kindnessBreaks: boolean;
    timezoneGrace: boolean;
    offlineMode: boolean;
  };
  
  // Limited but meaningful features
  limitedFeatures: {
    questRunsPerWeek: number; // 2 reflection quests per week
    badgeTreesAccess: string[]; // "Presence" tree only
    seasonalChallengeParticipation: boolean; // Basic participation
    exportOptions: string[]; // Simple text export monthly
    storageLimit: number; // 3 months of entries
  };
  
  // Gentle upgrade invitations (never pressure)
  upgradeInvitations: {
    // Show upgrade benefits only on milestone achievements
    showOnBadgeEarn: boolean;
    showOnStreakMilestone: number[]; // [7, 30] day streaks
    showOnQuestCompletion: boolean;
    // Never show during crisis or difficult days
    respectEmotionalState: boolean;
  };
}

// Sanctuary-specific badge system (subset of full badge tree)
export interface SanctuaryBadge {
  key: 'first_presence' | 'still_here_sanctuary' | 'gentle_warrior' | 'pause_wisdom' | 'return_courage';
  name: string;
  description: string;
  celebrationMessage: string;
  // Sanctuary badges focus on emotional milestones, not productivity
  emotionalMilestone: 'showing_up' | 'self_compassion' | 'boundary_setting' | 'pause_courage' | 'return_strength';
  visualTheme: 'sage_green' | 'soft_blue' | 'warm_gold' | 'gentle_purple';
  
  // Anti-shame design
  neverExpires: boolean;
  canEarnMultipleTimes: boolean; // "Still Here" can be earned after each return
  celebratesProcess: boolean; // vs. outcomes
}

// Essential Emotional Support Features
export interface SanctuaryEmotionalSupport {
  // Basic prompts that don't require AI sophistication
  reflectionPrompts: {
    dailyCheckins: string[];
    processingPrompts: string[];
    boundaryPrompts: string[];
    selfCompassionPrompts: string[];
    pausePrompts: string[]; // When user needs a break
  };
  
  // Gentle encouragement system
  encouragement: {
    showingUpMessages: string[];
    difficultDaySupport: string[];
    pauseValidation: string[];
    returnCelebration: string[];
    // Never generic - always contextual and caring
    responseToMood: Record<string, string[]>;
  };
  
  // Essential boundary support
  boundarySupport: {
    sessionIntensityCheck: boolean; // "This feels heavy. Need a pause?"
    timeReminders: boolean; // Gentle time awareness
    overwritingWarning: boolean; // "This is deep work. Take care."
    gentleTransitions: boolean; // Soft session endings
  };
}

// Grace-based progress that celebrates healing presence
export interface SanctuaryProgressTracking {
  // Anti-shame streak system
  graceStreaks: {
    graceTokensPerWeek: number; // 2 tokens, renewed Mondays
    maxGraceDays: number; // 3 days before reset
    recoveryMultiplier: number; // 1.5x XP for 2 days after return
    neverShowStreakBroken: boolean;
    celebrateReturns: boolean;
  };
  
  // Presence-focused metrics (not productivity)
  presenceMetrics: {
    showingUpCelebration: boolean; // "You're here. That's enough."
    authenticityCelebration: boolean; // Honoring honest entries
    vulnerabilityCelebration: boolean; // Celebrating brave sharing
    pauseCelebration: boolean; // Honoring rest and breaks
    processingCelebration: boolean; // Recognizing emotional work
  };
  
  // Visual progress that feels supportive
  visualProgress: {
    gentleAnimations: boolean; // Soft, calming transitions
    natureInspiredIcons: boolean; // Growth metaphors, not achievement
    progressGarden: boolean; // Visual metaphor for inner growth
    moonPhases: boolean; // Cycles of growth and rest
  };
}

// Basic onboarding that introduces safety without overwhelm
export interface SanctuaryOnboarding {
  essentialIntroduction: {
    privacyFirst: boolean; // Privacy explanation comes first
    crisisResourcesIntro: boolean; // Always available support
    pauseButtonTour: boolean; // "You can always pause"
    gracePolicyExplanation: boolean; // Grace tokens and anti-shame design
  };
  
  // Simple navigation guidance
  navigationGuidance: {
    journalingBasics: boolean; // How to start writing
    moodSelectorIntro: boolean; // Optional emotional check-ins
    basicPromptExplanation: boolean; // When you're stuck
    progressCelebrationIntro: boolean; // What badges mean
  };
  
  // Essential feature introductions
  featureIntroduction: {
    gentleFeatureReveal: boolean; // Features revealed gradually
    noFeaturePressure: boolean; // Everything is optional
    personalizeExperience: boolean; // Choose your pace
    safetyFirst: boolean; // Crisis support always visible
  };
}

// Community features that maintain anonymity and safety
export interface SanctuaryCommunityFeatures {
  // Anonymous community participation
  anonymousParticipation: {
    seasonalChallengeBasic: boolean; // See collective progress only
    wisdomSharingOptional: boolean; // Anonymous insight sharing
    encouragementWall: boolean; // Send/receive anonymous support
    communityMilestones: boolean; // Collective achievements
  };
  
  // Privacy-preserving community
  privacyPreserving: {
    noPersonalExposure: boolean; // Never expose individual struggle
    optInOnly: boolean; // All community features opt-in
    instantOptOut: boolean; // Can leave community features anytime
    anonymousAliases: boolean; // "Gentle Soul #1234" style names
  };
  
  // Mutual support without comparison
  mutualSupport: {
    noRankings: boolean; // Never show individual rankings
    collectiveProgressOnly: boolean; // "Together we've written 10k words"
    sharedWisdom: boolean; // Anonymous insights and patterns
    kindnessCircle: boolean; // Send encouragement to random users
  };
}

// Default Sanctuary Tier Configuration
export const SANCTUARY_TIER_CONFIG: SanctuaryTierConfig = {
  coreFeatures: {
    basicJournaling: true,
    graceBasedStreaks: true,
    essentialBadges: true,
    basicProgressCelebration: true,
    crisisSupport: true,
    basicReflectionPrompts: true,
    gentleEncouragement: true,
    boundaryReminders: true,
    pauseButtons: true,
    privacyControls: true,
    kindnessBreaks: true,
    timezoneGrace: true,
    offlineMode: true
  },
  
  limitedFeatures: {
    questRunsPerWeek: 2,
    badgeTreesAccess: ['presence'],
    seasonalChallengeParticipation: true,
    exportOptions: ['simple_text'],
    storageLimit: 90 // 3 months in days
  },
  
  upgradeInvitations: {
    showOnBadgeEarn: true,
    showOnStreakMilestone: [7, 30],
    showOnQuestCompletion: true,
    respectEmotionalState: true
  }
};

// Sanctuary-specific reflection prompts that don't require AI
export const SANCTUARY_PROMPTS = {
  dailyCheckins: [
    "How are you showing up for yourself today?",
    "What's one small thing you can appreciate about yourself right now?",
    "If your body could speak, what would it say?",
    "What boundary do you need to honor today?",
    "What are you ready to release?",
    "How can you be gentle with yourself today?"
  ],
  
  processingPrompts: [
    "What's true for you right now, without needing to fix anything?",
    "If this feeling had a voice, what would it say?",
    "What do you need to hear today?",
    "Where do you feel this in your body?",
    "What would change if you accepted this feeling completely?",
    "What wisdom is hiding in this experience?"
  ],
  
  boundaryPrompts: [
    "What's a boundary you've honored recently?",
    "Where do you give away your energy?",
    "What would you do if you trusted yourself completely?",
    "What's no longer serving you?",
    "How can you protect your peace today?",
    "What deserves less of your energy?"
  ],
  
  pausePrompts: [
    "This feels heavy. What do you need right now?",
    "Taking a pause is self-care. What feels supportive?",
    "Your body is wise. What is it telling you?",
    "Rest is resistance. How can you honor that?",
    "What would being kind to yourself look like right now?",
    "Processing takes energy. How can you replenish?"
  ]
};

// Sanctuary encouragement that feels authentic, never manipulative
export const SANCTUARY_ENCOURAGEMENT = {
  showingUpMessages: [
    "You're here. That's enough.",
    "Showing up is an act of self-love.",
    "Your presence is a gift to yourself.",
    "You chose yourself today. That matters.",
    "Being here takes courage. You have that.",
    "You're exactly where you need to be."
  ],
  
  difficultDaySupport: [
    "Difficult days are part of the human experience.",
    "Your feelings are valid, all of them.",
    "Surviving is enough today.",
    "You don't have to have it all figured out.",
    "This feeling will pass. You've survived before.",
    "Being gentle with yourself is an act of revolution."
  ],
  
  pauseValidation: [
    "Taking a pause is wisdom, not weakness.",
    "Rest is a form of resistance.",
    "Your needs matter. Full stop.",
    "Pausing is how we prevent breaking.",
    "You know yourself best. Trust that.",
    "Boundaries are acts of self-respect."
  ],
  
  returnCelebration: [
    "Welcome back. You were missed.",
    "Returning takes courage. You have that.",
    "You survived. That's not small.",
    "Every return is a new beginning.",
    "You didn't give up. That's powerful.",
    "Coming back is an act of hope."
  ]
};

// Functions for Sanctuary tier feature checking
export function hasAccessToSanctuaryFeature(feature: keyof SanctuaryTierConfig['coreFeatures']): boolean {
  return SANCTUARY_TIER_CONFIG.coreFeatures[feature];
}

export function getSanctuaryLimits(feature: keyof SanctuaryTierConfig['limitedFeatures']): number | string[] | boolean {
  return SANCTUARY_TIER_CONFIG.limitedFeatures[feature];
}

export function shouldShowUpgradeInvitation(
  context: 'badge_earn' | 'streak_milestone' | 'quest_completion',
  data?: { streakDays?: number; emotionalState?: 'crisis' | 'difficult' | 'neutral' | 'good' }
): boolean {
  const config = SANCTUARY_TIER_CONFIG.upgradeInvitations;
  
  // Never show during crisis or difficult emotional states
  if (config.respectEmotionalState && data?.emotionalState && 
      ['crisis', 'difficult'].includes(data.emotionalState)) {
    return false;
  }
  
  switch (context) {
    case 'badge_earn':
      return config.showOnBadgeEarn;
    case 'streak_milestone':
      return data?.streakDays ? config.showOnStreakMilestone.includes(data.streakDays) : false;
    case 'quest_completion':
      return config.showOnQuestCompletion;
    default:
      return false;
  }
}

// Sanctuary-specific badge definitions
export const SANCTUARY_BADGES: Record<string, SanctuaryBadge> = {
  first_presence: {
    key: 'first_presence',
    name: 'First Presence',
    description: 'You showed up for yourself. That\'s the beginning of everything.',
    celebrationMessage: 'You took the first step. Your voice matters.',
    emotionalMilestone: 'showing_up',
    visualTheme: 'sage_green',
    neverExpires: true,
    canEarnMultipleTimes: false,
    celebratesProcess: true
  },
  
  still_here_sanctuary: {
    key: 'still_here_sanctuary',
    name: 'Still Here',
    description: 'Three days of showing up. You\'re building something real.',
    celebrationMessage: 'You\'re creating a practice of self-care. Notice how that feels.',
    emotionalMilestone: 'self_compassion',
    visualTheme: 'warm_gold',
    neverExpires: true,
    canEarnMultipleTimes: true, // Can earn after each return
    celebratesProcess: true
  },
  
  gentle_warrior: {
    key: 'gentle_warrior',
    name: 'Gentle Warrior',
    description: 'A week of presence. Consistency is your quiet superpower.',
    celebrationMessage: 'Seven days of showing up for yourself. You\'re building resilience.',
    emotionalMilestone: 'boundary_setting',
    visualTheme: 'soft_blue',
    neverExpires: true,
    canEarnMultipleTimes: false,
    celebratesProcess: true
  },
  
  pause_wisdom: {
    key: 'pause_wisdom',
    name: 'Pause Wisdom',
    description: 'You recognized when you needed rest. That\'s profound self-awareness.',
    celebrationMessage: 'Taking a pause is wisdom, not weakness. You honored your needs.',
    emotionalMilestone: 'pause_courage',
    visualTheme: 'gentle_purple',
    neverExpires: true,
    canEarnMultipleTimes: true, // Can earn for multiple pauses
    celebratesProcess: true
  },
  
  return_courage: {
    key: 'return_courage',
    name: 'Return Courage',
    description: 'You came back. Returning after a pause takes real courage.',
    celebrationMessage: 'Welcome back. Survival counts. You didn\'t give up.',
    emotionalMilestone: 'return_strength',
    visualTheme: 'sage_green',
    neverExpires: true,
    canEarnMultipleTimes: true, // Every return is celebrated
    celebratesProcess: true
  }
};

// Export types for external use
export type {
  SanctuaryTierConfig,
  SanctuaryBadge,
  SanctuaryEmotionalSupport,
  SanctuaryProgressTracking,
  SanctuaryOnboarding,
  SanctuaryCommunityFeatures
};