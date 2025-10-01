import { Timestamp } from 'firebase/firestore';

// Core Gamification Types - REVOLUTIONARY HEALING-CENTERED SYSTEM
export interface UserProfile {
  handle: string;
  createdAt: Timestamp;
  premium: boolean;
  archetype?: 'sage' | 'coach' | 'poet';
  totalXP: number;
  level: number;
  joinedChallenges: string[];
  completedSeasons: string[];
  // Grace & Presence Metrics
  presenceQuality: number; // 0-100, based on depth not quantity
  wisdomAccumulation: number; // tracks insight quality
  selfCompassionScore: number; // internal kindness tracking
  healingMomentum: number; // organic growth measure
  gentlePowerLevel: number; // soft strength development
}

// Grace-Based Streaks - REVOLUTIONARY ANTI-SHAME SYSTEM
export interface Streak {
  current: number;
  longest: number;
  lastJournalISO: string;
  graceTokens: number; // 2 per week, renewed Mondays
  graceTokenRenewalDate: string; // next Monday ISO
  recoveryMultiplierUntil?: string; // ISO date
  recoveryMultiplier: number; // 1.5x XP for returning
  streakFrozen?: boolean; // during pause
  // Revolutionary Anti-Shame Mechanics
  returningBonusActive: boolean; // celebrating returns
  gentleReminders: boolean; // user preference for soft nudges
  lastCelebration: Timestamp; // prevent celebration fatigue
  wisdomStreak: number; // depth-based streak separate from frequency
  presenceOverPerformance: boolean; // user's tracking preference
  timezoneGracePeriod: number; // hours of grace for timezone changes
  healingPauseReason?: string; // why user paused (for personalization)
}

// Badge System
export type BadgeKey = 
  | 'still_here' | 'chaos_to_clarity' | 'soft_but_strong' 
  | 'deep_dive' | 'pattern_finder' | 'truth_teller'
  | 'boundary_keeper' | 'storm_weathered' | 'growth_seeker'
  | 'voice_found' | 'courage_builder' | 'healing_heart';

export interface Badge {
  key: BadgeKey;
  level: 1 | 2 | 3;
  earnedAt: Timestamp;
  name: string;
  description: string;
  tree: string; // badge family
  xpAwarded: number;
  seasonEarned?: string;
  // Revolutionary Healing-Centered Design
  healingMessage: string; // therapeutic celebration message
  identityAffirmation: string; // "You are someone who..."
  gentleAnimation: 'organic' | 'flowing' | 'crystallizing' | 'blooming';
  emotionalResonance: 'validating' | 'empowering' | 'transformative' | 'grounding';
  wisdomGained: string; // insight this badge represents
  innerWorkAcknowledged: string; // the courage this required
}

// Reflection Quests (5-minute runs)
export interface QuestRun {
  id: string;
  theme: 'name-feel-reframe' | 'past-present-future' | 'fear-courage-action';
  stepsDone: number;
  totalSteps: 3;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  responses: {
    step1?: string;
    step2?: string;
    step3?: string;
  };
  xpAwarded?: number;
  badgeUnlocked?: BadgeKey;
  pausedAt?: Timestamp;
}

// Seasons & Badge Trees - REVOLUTIONARY COMMUNITY-HEALING FOCUS
export interface Season {
  id: string;
  name: string;
  theme: string; // "Boundaries SZN", "Inner Voice SZN", "Soft Power SZN"
  startDate: string; // ISO
  endDate: string; // ISO
  description: string;
  isActive: boolean;
  focusBadges: BadgeKey[];
  totalParticipants: number;
  premiumPerks: string[];
  // Revolutionary Community Healing Elements
  collectiveIntention: string; // shared healing focus
  mutualSupportLevel: number; // community care measure
  anonymousEncouragement: boolean; // collective celebration without exposure
  healingCircleSize: number; // optimal support group size
  pauseButtonVisible: boolean; // always available escape
  gentleAccountability: boolean; // soft check-ins vs pressure
  wisdomSharing: boolean; // insights shared anonymously
}

export interface BadgeTree {
  name: string;
  description: string;
  badges: {
    level1: Badge;
    level2?: Badge;
    level3?: Badge;
  };
  totalEarners: number;
}

// Community Challenges - REVOLUTIONARY MUTUAL SUPPORT SYSTEM
export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: number; // collective target, not individual
  startDate: string; // ISO
  endDate: string; // ISO
  isActive: boolean;
  theme: string;
  totalParticipants: number;
  participants: Array<{
    uid: string; // private
    alias: string; // public (User✶1234)
    entries: number;
    joinedAt: Timestamp;
  }>;
  rewards: {
    completion: string; // badge/title
    collective: string; // everyone gets same reward
  };
  // Revolutionary Anti-Competition Elements
  mutualSupportMode: boolean; // no individual ranking
  collectiveProgressOnly: boolean; // only show group progress
  encouragementWall: string[]; // anonymous support messages
  pauseFriendly: boolean; // pauses don't affect group
  wisdomCircle: {
    anonymousInsights: string[]; // shared learnings
    supportPatterns: string[]; // what helps people show up
    gentleReminders: string[]; // community-generated encouragement
  };
  healingIntention: string; // why we're doing this together
  celebrationStyle: 'gentle' | 'joyful' | 'profound' | 'quiet';
}

// Purpose Résumé
export interface GrowthPortfolio {
  userId: string;
  lastUpdated: Timestamp;
  totalBadges: number;
  streakRecord: number;
  questsCompleted: number;
  milestones: Array<{
    date: string; // ISO
    achievement: string;
    description: string;
    type: 'badge' | 'streak' | 'quest' | 'season';
  }>;
  strengthsIdentified: string[];
  skillsPracticed: string[];
  exportableResume: string; // formatted text
}

// Ritual Packs
export interface RitualPack {
  id: string;
  name: string; // "IKIGAI Explorer", "Future Vision", "Alchemy of Depression"
  description: string;
  prompts: Array<{
    id: string;
    title: string;
    prompt: string;
    estimatedTime: string;
  }>;
  collectibleFrame?: string;
  isLimitedDrop: boolean;
  availableUntil?: string; // ISO
  completionRate: number;
  totalCompletions: number;
  premiumOnly: boolean;
}

export interface UserRitualProgress {
  packId: string;
  startedAt: Timestamp;
  completedPrompts: string[];
  completedAt?: Timestamp;
  frameUnlocked?: boolean;
}

// Referrals & Beta
export interface ReferralData {
  invited: string[]; // email addresses
  successful: string[]; // UIDs who signed up
  trialAwarded: boolean;
  trialExpiresAt?: Timestamp;
  bonusXP: number;
}

export interface BetaConfig {
  totalSlots: number;
  filledSlots: number;
  waitlist: string[]; // email addresses
  isCapEnabled: boolean;
  lastUpdated: Timestamp;
}

// Khepera Archetypes
export interface ArchetypeConfig {
  key: 'sage' | 'coach' | 'poet';
  name: string;
  description: string;
  voiceSample: string;
  reflectionStyle: {
    tone: string;
    questionStyle: string;
    encouragementStyle: string;
  };
}

// Revolutionary Celebration Receipts - AUTHENTIC HEALING SHARES
export interface ReflectionReceipt {
  id: string;
  userId: string;
  createdAt: Timestamp;
  badgeEarned?: string;
  streakDay?: number;
  vibeLine: string; // "Soft but Strong ✺ day 3"
  visualStyle: 'minimal' | 'botanical' | 'cosmic' | 'sacred_geometry' | 'organic_flow';
  isShared: boolean;
  shareSettings: {
    allowStories: boolean;
    allowFriends: boolean;
    watermarkEnabled: boolean;
  };
  // Revolutionary Authentic Celebration Elements
  healingMilestone: {
    type: 'presence' | 'insight' | 'courage' | 'boundary' | 'self_compassion';
    description: string;
    wisdomGained: string;
  };
  gentleAnimation: {
    style: 'breathing' | 'growing' | 'flowing' | 'crystallizing';
    sageGreenAccent: boolean;
    duration: 'subtle' | 'medium' | 'celebratory';
  };
  authenticity: {
    noInflationPromises: boolean; // no "transform your life" language
    realProgress: boolean; // acknowledges small steps
    vulnerabilityHonored: boolean; // celebrates showing up imperfectly
  };
}

// Revolutionary Kindness Break System - TRAUMA-INFORMED PAUSING
export interface KindnessBreak {
  userId: string;
  startedAt: Timestamp;
  reason?: 'overwhelmed' | 'busy' | 'processing' | 'grief' | 'crisis' | 'healing' | 'life_transition' | 'energy_protection' | 'other';
  plannedReturnDate?: string; // ISO
  actualReturnDate?: string; // ISO
  checkInReminders: boolean;
  gracePeriodDays: number;
  returnMessage?: string;
  // Revolutionary Trauma-Informed Elements
  pauseType: 'gentle' | 'complete' | 'partial'; // level of disengagement
  safeguardChecks: boolean; // gentle wellness checks
  returnBonusEarned: boolean; // celebration of return
  healingSupport: {
    resourcesOffered: string[];
    peerSupport: boolean;
    professionalReferral?: string;
  };
  adaptiveReturnPlan: {
    gentleReentry: boolean;
    modifiedGoals: boolean;
    extraGraceTokens: number;
  };
  wisdomFromPause: string; // what user learned about themselves
  courageToReturn: number; // measure of healing bravery
}

// Revolutionary Healing-Centered Analytics Events
export type GamificationEvent = 
  | 'journal_completed'
  | 'streak_incremented'
  | 'grace_used'
  | 'grace_tokens_renewed' // Monday renewal celebration
  | 'recovery_multiplier_applied'
  | 'quest_started'
  | 'quest_completed'
  | 'quest_paused'
  | 'badge_earned'
  | 'challenge_joined'
  | 'challenge_completed'
  | 'season_joined'
  | 'sharecard_created'
  | 'sharecard_shared'
  | 'referral_sent'
  | 'referral_converted'
  | 'subscription_activated'
  | 'pause_requested'
  | 'pause_ended'
  | 'archetype_selected'
  // Revolutionary Healing Metrics
  | 'presence_quality_increased'
  | 'wisdom_moment_recognized'
  | 'self_compassion_practiced'
  | 'gentle_power_demonstrated'
  | 'healing_momentum_gained'
  | 'vulnerability_celebrated'
  | 'boundary_honored'
  | 'authenticity_moment'
  | 'courage_to_return'
  | 'pattern_recognized'
  | 'inner_work_acknowledged'
  | 'healing_supported_others'
  | 'gentleness_chosen';

export interface AnalyticsEventData {
  userId: string;
  event: GamificationEvent;
  timestamp: Timestamp;
  metadata: Record<string, any>;
  sessionId?: string;
}

// XP & Leveling
export interface XPEvent {
  userId: string;
  amount: number;
  source: 'journal' | 'quest' | 'badge' | 'streak' | 'challenge' | 'referral';
  multiplier: number; // recovery multiplier or season bonus
  timestamp: Timestamp;
  description: string;
}

export interface UserLevel {
  level: number;
  totalXP: number;
  xpToNextLevel: number;
  title: string; // "Seeker", "Explorer", "Alchemist"
  perks: string[];
}

// Revolutionary Trauma-Informed Privacy & Healing Preferences
export interface PrivacySettings {
  userId: string;
  profileVisibility: 'private' | 'friends' | 'public';
  allowChallengeParticipation: boolean;
  allowReflectionSharing: boolean;
  allowStorySharing: boolean;
  dataExportEnabled: boolean;
  marketingOptIn: boolean;
  reminderOptIn: boolean;
  lastUpdated: Timestamp;
  // Revolutionary Healing-Centered Preferences
  engagementStyle: {
    prefersGentleReminders: boolean;
    celebrationIntensity: 'subtle' | 'warm' | 'joyful';
    pauseButtonAlwaysVisible: boolean;
    graceTokenVisibility: 'prominent' | 'discrete' | 'hidden';
    focusOnPresence: boolean; // vs performance metrics
    wisdomOverAchievement: boolean;
  };
  traumaInformedOptions: {
    triggeredByStreaks: boolean;
    needsExtraGrace: boolean;
    prefersCollectiveProgress: boolean;
    anxietyAroundGamification: boolean;
    perfectionismTriggers: boolean;
  };
  healingJourney: {
    identityEvolution: boolean; // "You are becoming someone who..."
    courageRecognition: boolean; // acknowledge the bravery of showing up
    gentlePowerTracking: boolean; // soft strength development
    authenticityOverOptimization: boolean;
  };
}