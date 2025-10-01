/**
 * MUTUAL SUPPORT COMMUNITY SYSTEM
 * "Healing happens in relationship. Competition kills connection."
 * 
 * Revolutionary Community Features:
 * 🤝 Collective Progress (never individual ranking)
 * 💫 Wisdom Circles (anonymous insight sharing)  
 * 🌊 Seasonal Healing Themes (group intentions)
 * 🕊️ Pause-Friendly Challenges (supporting struggle)
 * 🌱 Encouragement Gardens (peer support)
 */

import { Timestamp } from 'firebase/firestore';
import type { Challenge, Season } from '@/types/gamification';

export interface MutualSupportChallenge {
  id: string;
  name: string;
  description: string;
  healingIntention: string; // Why we're doing this together
  
  // Revolutionary Anti-Competition Design
  collectiveGoal: number; // Group target, not individual
  currentProgress: number; // Total progress by all participants
  progressVisualization: 'river' | 'garden' | 'constellation' | 'breathing_circle';
  
  // Trauma-Informed Elements
  pauseButtonVisible: boolean; // Always available escape
  noIndividualRanking: boolean; // No competition, only collective progress
  anonymousParticipation: boolean; // Safe identity protection
  encouragementWallEnabled: boolean; // Peer support messages
  
  // Healing-Centered Structure
  wisdomCircle: WisdomCircle;
  encouragementGarden: EncouragementGarden;
  gentleAccountability: GentleAccountability;
  
  // Celebration Design
  milestoneStyle: 'gentle' | 'warm' | 'joyful' | 'profound';
  collectiveCelebrations: CollectiveCelebration[];
  everyoneWinsRewards: CommunityReward[];
  
  // Timing & Duration
  startDate: string;
  endDate: string;
  flexibleTiming: boolean; // Participants can join/pause mid-challenge
  
  // Sage Green Aesthetic Integration
  visualTheme: {
    primaryColor: string; // Sage green variations
    metaphor: 'growing_garden' | 'flowing_river' | 'healing_circle' | 'wisdom_tree';
    animation: 'breathing' | 'growing' | 'flowing' | 'pulsing';
    lightEffect: 'gentle_glow' | 'warm_embrace' | 'inner_radiance';
  };
}

export interface WisdomCircle {
  anonymousInsights: AnonymousInsight[];
  supportPatterns: SupportPattern[];
  healingBreakthroughs: HealingBreakthrough[];
  gentleReminders: GentleReminder[];
  
  // Sharing Guidelines
  vulnerabilityHonored: boolean;
  noAdviceGiving: boolean; // Only witnessing and reflecting
  patternRecognitionEnabled: boolean;
  wisdomDistillation: boolean; // Extract collective learning
}

export interface AnonymousInsight {
  id: string;
  insight: string;
  theme: 'presence' | 'boundaries' | 'self_compassion' | 'authenticity' | 'courage' | 'pattern_recognition';
  resonanceScore: number; // How many people this resonated with
  healingDepth: 'surface' | 'medium' | 'profound';
  sharedAt: Timestamp;
  sageWisdomLevel: 1 | 2 | 3; // Depth of insight
}

export interface SupportPattern {
  pattern: string; // What helps people show up
  examples: string[]; // Anonymous examples
  effectiveness: number; // How often this helps (1-100)
  applicability: string[]; // What situations this works for
}

export interface HealingBreakthrough {
  breakthrough: string; // Anonymous breakthrough moment
  catalysts: string[]; // What helped this happen
  rippleEffects: string[]; // How this impacted other areas
  sharedForInspiration: boolean;
}

export interface GentleReminder {
  reminder: string;
  tone: 'gentle' | 'encouraging' | 'wisdom-based' | 'compassionate';
  useFrequency: 'when_struggling' | 'weekly' | 'milestone_moments';
  createdByParticipants: boolean;
}

export interface EncouragementGarden {
  encouragementSeeds: EncouragementSeed[];
  bloomingMoments: BloomingMoment[];
  rootedSupport: RootedSupport[];
  
  // Garden Metaphor Elements
  plantingEnabled: boolean; // Can add encouragement
  tenderingEnabled: boolean; // Can nurture others' growth
  harvestingEnabled: boolean; // Can receive collective wisdom
}

export interface EncouragementSeed {
  message: string;
  plantedBy: 'anonymous'; // Always anonymous
  forSituation: string; // When someone might need this
  growthStage: 'planted' | 'sprouting' | 'blooming' | 'fruiting';
  nurturedBy: number; // How many people watered this
}

export interface BloomingMoment {
  moment: string; // Celebration of someone's growth
  witnessed: boolean; // Someone saw and celebrated growth
  anonymous: boolean; // Identity protection
  rippleEffect: string; // How this inspired others
}

export interface RootedSupport {
  supportType: 'witnessing' | 'pattern_sharing' | 'gentle_nudge' | 'celebration';
  message: string;
  deepRoots: boolean; // Fundamental support vs surface encouragement
  communityResonance: number; // How much this resonated
}

export interface GentleAccountability {
  style: 'witness' | 'encourage' | 'celebrate' | 'hold_space';
  frequency: 'daily' | 'weekly' | 'milestone_based' | 'as_needed';
  
  // Revolutionary Accountability Elements
  noPressure: boolean; // Never creates shame
  pauseFriendly: boolean; // Accommodates breaks
  celebratesReturns: boolean; // Honors coming back
  recognizesEffort: boolean; // Values attempt over outcome
  
  accountabilityCircles: AccountabilityCircle[];
}

export interface AccountabilityCircle {
  size: number; // Small circles (3-5 people max)
  anonymousIds: string[]; // Protected identities
  supportStyle: 'gentle_check_ins' | 'wisdom_sharing' | 'pattern_witnessing';
  meetingFrequency: 'weekly' | 'bi_weekly' | 'monthly';
  
  // Circle Guidelines
  noAdviceUnlessAsked: boolean;
  celebrateSmallWins: boolean;
  honorPauses: boolean;
  shareWisdomNot: boolean; // Share wisdom, not judgment
}

export interface CollectiveCelebration {
  milestone: number; // Group progress percentage
  celebrationType: 'quiet_acknowledgment' | 'warm_celebration' | 'joyful_party' | 'profound_recognition';
  
  // Celebration Elements
  sharedWisdom: string; // What we've learned together
  collectiveGrowth: string; // How we've all grown
  communityImpact: string; // Ripple effect of our healing
  
  // Visual Celebration
  animation: 'gentle_glow' | 'flowing_energy' | 'blooming_garden' | 'expanding_light';
  duration: number; // milliseconds
  sageGreenIntensity: 'subtle' | 'warm' | 'radiant';
  
  // Personalized Messages
  everyoneGetsMessage: boolean;
  messageType: 'progress_acknowledgment' | 'courage_recognition' | 'wisdom_celebration';
}

export interface CommunityReward {
  rewardType: 'collective_badge' | 'wisdom_scroll' | 'healing_momentum' | 'community_frame';
  name: string;
  description: string;
  
  // Everyone Gets Same Reward
  individualReceival: boolean; // Everyone gets it individually
  communityBenefit: boolean; // Unlocks something for whole community
  
  // Meaning Over Materialism
  symbolism: string; // What this represents
  wisdomEmbodied: string; // What wisdom this celebrates
  healingSignificance: string; // Why this matters for healing
}

/**
 * Revolutionary Seasonal Healing Themes
 */
export interface HealingSeason {
  id: string;
  name: string; // "Boundaries SZN", "Soft Power SZN", "Authenticity SZN"
  duration: number; // weeks
  
  // Healing Focus
  coreIntention: string; // What we're collectively working on
  healingCapacity: string; // What we're building together
  wisdomTheme: string; // Central learning focus
  
  // Community Elements
  collectiveJourney: CollectiveJourney;
  wisdomHarvest: WisdomHarvest;
  mutualWitnessing: MutualWitnessing;
  
  // Trauma-Informed Design
  gentleIntroduction: boolean; // Ease into the theme
  pauseAccommodation: boolean; // Support for taking breaks
  variableParticipation: boolean; // Different levels of engagement
  safeExit: boolean; // Can leave without consequence
}

export interface CollectiveJourney {
  weeklyThemes: WeeklyTheme[];
  sharedPrompts: SharedPrompt[];
  collectiveMilestones: CollectiveMilestone[];
  communityWisdom: CommunityWisdom[];
}

export interface WeeklyTheme {
  week: number;
  theme: string;
  healingFocus: string;
  gentleInvitation: string; // Not pressure, invitation
  wisdomPrompt: string;
  supportFocus: string; // How to support each other this week
}

export interface SharedPrompt {
  prompt: string;
  healingPurpose: string; // Why this prompt serves healing
  adaptations: string[]; // Different ways to engage with this
  supportingQuestions: string[]; // Deeper exploration options
}

export interface CollectiveMilestone {
  milestone: string;
  communityAchievement: string; // What we accomplished together
  wisdomGenerated: string; // Insights we created collectively
  healingDepth: string; // How this advanced our healing
  celebrationStyle: 'gentle' | 'warm' | 'joyful' | 'profound';
}

export interface CommunityWisdom {
  wisdom: string;
  source: 'collective_insight' | 'pattern_recognition' | 'breakthrough_sharing';
  applicability: string; // When/how this wisdom helps
  deepening: string; // How this wisdom can go deeper
}

/**
 * Revolutionary Community System Implementation
 */
export class MutualSupportCommunitySystem {
  
  /**
   * Create a healing-centered challenge with zero competition
   */
  static createMutualSupportChallenge(
    theme: 'boundaries' | 'presence' | 'authenticity' | 'self_compassion' | 'gentle_power',
    duration: number, // days
    participantCap: number = 50 // Optimal healing community size
  ): MutualSupportChallenge {
    const challengeTemplates = this.getChallengeTemplates();
    const template = challengeTemplates[theme];
    
    const challenge: MutualSupportChallenge = {
      id: `healing_${theme}_${Date.now()}`,
      name: template.name,
      description: template.description,
      healingIntention: template.healingIntention,
      
      // Collective focus
      collectiveGoal: template.collectiveGoal,
      currentProgress: 0,
      progressVisualization: template.visualization,
      
      // Trauma-informed design
      pauseButtonVisible: true,
      noIndividualRanking: true,
      anonymousParticipation: true,
      encouragementWallEnabled: true,
      
      // Community structures
      wisdomCircle: this.createWisdomCircle(theme),
      encouragementGarden: this.createEncouragementGarden(theme),
      gentleAccountability: this.createGentleAccountability(),
      
      // Celebration design
      milestoneStyle: template.celebrationStyle,
      collectiveCelebrations: this.createCollectiveCelebrations(theme),
      everyoneWinsRewards: this.createCommunityRewards(theme),
      
      // Timing
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      flexibleTiming: true,
      
      // Sage green aesthetic
      visualTheme: {
        primaryColor: this.getSageGreenVariation(theme),
        metaphor: template.metaphor,
        animation: template.animation,
        lightEffect: 'gentle_glow'
      }
    };
    
    return challenge;
  }

  /**
   * Join challenge with complete anonymity and pause protection
   */
  static async joinChallenge(
    userId: string,
    challengeId: string,
    participationLevel: 'gentle' | 'moderate' | 'engaged' = 'moderate'
  ): Promise<{
    success: boolean;
    anonymousId: string;
    welcomeMessage: string;
    supportResources: string[];
    pauseInstructions: string;
  }> {
    // Generate anonymous, nature-based ID
    const anonymousId = this.generateAnonymousId();
    
    // Personalized welcome based on participation level
    const welcomeMessage = this.generateWelcomeMessage(participationLevel);
    
    // Support resources for different needs
    const supportResources = this.generateSupportResources(participationLevel);
    
    // Clear pause instructions
    const pauseInstructions = "You can pause anytime by clicking the gentle pause button. Your spot will be held with love, and you can return whenever you're ready. No questions asked, no judgment given.";
    
    return {
      success: true,
      anonymousId,
      welcomeMessage,
      supportResources,
      pauseInstructions
    };
  }

  /**
   * Add to wisdom circle (anonymous sharing)
   */
  static async shareWisdom(
    challengeId: string,
    anonymousId: string,
    wisdom: {
      insight?: string;
      supportPattern?: string;
      gentleReminder?: string;
      healingBreakthrough?: string;
    }
  ): Promise<{
    success: boolean;
    wisdomId: string;
    communityResponse: string;
    resonanceTracking: boolean;
  }> {
    const wisdomId = `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Gentle community response
    const responses = [
      "Your wisdom has been woven into our collective understanding. Thank you for sharing.",
      "This insight becomes part of our community's healing wisdom. Your courage to share matters.",
      "Your experience becomes medicine for others. This is how healing spreads.",
      "Thank you for adding to our wisdom circle. Your perspective enriches us all."
    ];
    
    const communityResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      success: true,
      wisdomId,
      communityResponse,
      resonanceTracking: true // Others can indicate this resonated without identifying themselves
    };
  }

  /**
   * Plant encouragement in the garden
   */
  static async plantEncouragement(
    challengeId: string,
    anonymousId: string,
    encouragement: {
      message: string;
      forSituation: string;
      tone: 'gentle' | 'hopeful' | 'celebrating' | 'witnessing';
    }
  ): Promise<{
    success: boolean;
    seedId: string;
    plantingMessage: string;
    growthPotential: string;
  }> {
    const seedId = `seed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const plantingMessage = "Your encouragement has been planted in our community garden. It will grow and provide comfort for those who need it.";
    
    const growthPotential = "As others nurture this encouragement, it will bloom into something even more beautiful and supportive.";
    
    return {
      success: true,
      seedId,
      plantingMessage,
      growthPotential
    };
  }

  /**
   * Request gentle pause (with full support)
   */
  static async requestPause(
    challengeId: string,
    anonymousId: string,
    reason?: string,
    plannedReturn?: string
  ): Promise<{
    success: boolean;
    pauseMessage: string;
    supportOffered: string[];
    returnInstructions: string;
    spotHeld: boolean;
  }> {
    const pauseMessage = "Your pause request has been received with complete understanding. Taking care of yourself is wisdom, not weakness.";
    
    const supportOffered = [
      "Your progress is safely saved and will be here when you return",
      "You can check in with the community anytime, even while paused",
      "Gentle reminders can be sent if you want them (completely optional)",
      "The encouragement garden remains open to you for comfort"
    ];
    
    const returnInstructions = "Return whenever you're ready - whether that's tomorrow or in months. Your return will be celebrated, and you'll receive a gentle reintegration bonus to ease back in.";
    
    return {
      success: true,
      pauseMessage,
      supportOffered,
      returnInstructions,
      spotHeld: true
    };
  }

  /**
   * Generate collective celebration when milestones are reached
   */
  static generateCollectiveCelebration(
    challenge: MutualSupportChallenge,
    milestone: number
  ): {
    celebrationMessage: string;
    sharedWisdom: string;
    collectiveGrowth: string;
    everyoneGetsReward: CommunityReward;
    visualCelebration: {
      animation: string;
      duration: number;
      colors: string[];
      effect: string;
    };
  } {
    const celebrationMessage = `🌟 Together, we've reached ${milestone}% of our collective goal! Every single contribution has created this beautiful progress. You are part of something healing.`;
    
    const sharedWisdom = "We've learned that healing happens in community, that small steps create big changes, and that supporting each other multiplies our individual courage.";
    
    const collectiveGrowth = "As a community, we've grown in our capacity for self-compassion, our ability to show up authentically, and our understanding that we don't have to heal alone.";
    
    const everyoneGetsReward: CommunityReward = {
      rewardType: 'collective_badge',
      name: 'Community Healer',
      description: 'You contributed to collective healing',
      individualReceival: true,
      communityBenefit: true,
      symbolism: 'A circle of light representing our interconnected healing',
      wisdomEmbodied: 'Individual healing contributes to collective healing',
      healingSignificance: 'Your growth matters not just to you, but to all of us'
    };
    
    const visualCelebration = {
      animation: 'expanding_gentle_light',
      duration: 3000,
      colors: ['#a4b792', '#b8c5a6', '#96a584'],
      effect: 'warm_embracing_glow'
    };
    
    return {
      celebrationMessage,
      sharedWisdom,
      collectiveGrowth,
      everyoneGetsReward,
      visualCelebration
    };
  }

  // Private helper methods
  private static getChallengeTemplates() {
    return {
      boundaries: {
        name: "Boundaries SZN: Sacred Self-Advocacy",
        description: "Learning to love ourselves through healthy boundaries",
        healingIntention: "To develop the gentle art of saying no with love and yes with intention",
        collectiveGoal: 1000, // collective boundary moments
        visualization: 'breathing_circle',
        celebrationStyle: 'profound' as const,
        metaphor: 'healing_circle' as const,
        animation: 'breathing' as const
      },
      presence: {
        name: "Presence Practice: Sacred Showing Up",
        description: "The revolutionary art of being with ourselves",
        healingIntention: "To cultivate the capacity for authentic presence with our inner world",
        collectiveGoal: 2000, // collective presence moments
        visualization: 'breathing_circle',
        celebrationStyle: 'gentle' as const,
        metaphor: 'growing_garden' as const,
        animation: 'growing' as const
      },
      authenticity: {
        name: "Authenticity Arc: Truth Telling Season",
        description: "Finding and using our authentic voice",
        healingIntention: "To practice the courage of being real in a world that rewards performance",
        collectiveGoal: 1500, // collective authentic moments
        visualization: 'constellation',
        celebrationStyle: 'joyful' as const,
        metaphor: 'wisdom_tree' as const,
        animation: 'flowing' as const
      },
      self_compassion: {
        name: "Self-Compassion Circle: Grace Practice",
        description: "Learning to be gentle with our own humanity",
        healingIntention: "To replace self-criticism with self-compassion as our default response",
        collectiveGoal: 1200, // collective self-compassion moments
        visualization: 'garden',
        celebrationStyle: 'warm' as const,
        metaphor: 'healing_circle' as const,
        animation: 'pulsing' as const
      },
      gentle_power: {
        name: "Gentle Power: Soft But Strong Season",
        description: "Discovering strength that includes tenderness",
        healingIntention: "To embody the revolutionary combination of power and gentleness",
        collectiveGoal: 800, // collective gentle power moments  
        visualization: 'flowing_river',
        celebrationStyle: 'profound' as const,
        metaphor: 'flowing_river' as const,
        animation: 'flowing' as const
      }
    };
  }

  private static createWisdomCircle(theme: string): WisdomCircle {
    return {
      anonymousInsights: [],
      supportPatterns: [],
      healingBreakthroughs: [],
      gentleReminders: [],
      vulnerabilityHonored: true,
      noAdviceGiving: true,
      patternRecognitionEnabled: true,
      wisdomDistillation: true
    };
  }

  private static createEncouragementGarden(theme: string): EncouragementGarden {
    return {
      encouragementSeeds: [],
      bloomingMoments: [],
      rootedSupport: [],
      plantingEnabled: true,
      tenderingEnabled: true,
      harvestingEnabled: true
    };
  }

  private static createGentleAccountability(): GentleAccountability {
    return {
      style: 'witness',
      frequency: 'weekly',
      noPressure: true,
      pauseFriendly: true,
      celebratesReturns: true,
      recognizesEffort: true,
      accountabilityCircles: []
    };
  }

  private static createCollectiveCelebrations(theme: string): CollectiveCelebration[] {
    return [
      {
        milestone: 25,
        celebrationType: 'warm_celebration',
        sharedWisdom: "We're learning that small steps create big changes",
        collectiveGrowth: "Our capacity for showing up is growing",
        communityImpact: "Our healing work is creating ripples of possibility",
        animation: 'gentle_glow',
        duration: 2000,
        sageGreenIntensity: 'warm',
        everyoneGetsMessage: true,
        messageType: 'progress_acknowledgment'
      },
      {
        milestone: 50,
        celebrationType: 'joyful_party',
        sharedWisdom: "Healing happens in community, and we are proof",
        collectiveGrowth: "We're becoming people who support each other's growth",
        communityImpact: "Together we're modeling what healing community looks like",
        animation: 'blooming_garden',
        duration: 3000,
        sageGreenIntensity: 'radiant',
        everyoneGetsMessage: true,
        messageType: 'courage_recognition'
      }
    ];
  }

  private static createCommunityRewards(theme: string): CommunityReward[] {
    return [
      {
        rewardType: 'collective_badge',
        name: `${theme} Community Healer`,
        description: 'You contributed to collective healing',
        individualReceival: true,
        communityBenefit: false,
        symbolism: 'Connection in healing',
        wisdomEmbodied: 'Individual growth serves collective healing',
        healingSignificance: 'Your healing matters to all of us'
      }
    ];
  }

  private static generateAnonymousId(): string {
    const natureWords = ['Sage', 'River', 'Mountain', 'Forest', 'Ocean', 'Star', 'Moon', 'Tree', 'Flower', 'Light'];
    const qualities = ['Gentle', 'Wise', 'Strong', 'Kind', 'Brave', 'Soft', 'Deep', 'Bright', 'Calm', 'True'];
    
    const nature = natureWords[Math.floor(Math.random() * natureWords.length)];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    
    return `${quality}${nature}${number}`;
  }

  private static generateWelcomeMessage(level: string): string {
    const messages = {
      gentle: "Welcome to our healing community. Your presence here is honored. Participate at whatever level feels right for you, and know that you can pause or adjust anytime.",
      moderate: "Welcome, fellow traveler. You're joining a community that values growth over performance and connection over competition. Your authentic participation is a gift to us all.",
      engaged: "Welcome to our healing circle. Your readiness to engage deeply is beautiful, and we're honored to witness your journey. Remember that rest and pausing are also part of engaged participation."
    };
    
    return messages[level as keyof typeof messages];
  }

  private static generateSupportResources(level: string): string[] {
    return [
      "24/7 pause button - no explanation needed",
      "Anonymous wisdom circle for sharing insights",
      "Encouragement garden for giving and receiving support", 
      "Gentle accountability circles (optional)",
      "Crisis support resources",
      "Community celebration participation",
      "Flexible re-entry after pauses"
    ];
  }

  private static getSageGreenVariation(theme: string): string {
    const variations = {
      boundaries: '#8ea876', // Slightly deeper for strength
      presence: '#a4b792', // Classic sage for groundedness
      authenticity: '#96a584', // Vibrant for truth-telling
      self_compassion: '#b8c5a6', // Softer for gentleness
      gentle_power: '#7a9b69' // Richer for empowerment
    };
    
    return variations[theme as keyof typeof variations] || '#a4b792';
  }
}