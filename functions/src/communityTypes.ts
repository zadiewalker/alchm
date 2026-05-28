// Community Healing Types for ALCHM
import { Timestamp } from "firebase-admin/firestore";

// === ANONYMOUS STORY SHARING ===
export interface CommunityStory {
  id: string;
  anonymousId: string; // Generated unique ID for this story, not tied to user
  content: string;
  title?: string;
  healingStage: "beginning" | "processing" | "integrating" | "thriving" | "wisdom_sharing";
  wisdomTags: string[]; // e.g., 'grief', 'trauma', 'anxiety', 'self_compassion'
  contentModerationStatus: "pending" | "approved" | "flagged" | "rejected";
  moderationScore: number; // 0-1 safety score from AI moderation
  createdAt: Timestamp;
  updatedAt: Timestamp;
  reactions: {
    resonance: number; // "This resonates with me"
    gratitude: number; // "Thank you for sharing"
    strength: number; // "You inspire me"
    solidarity: number; // "You're not alone"
  };
  isHighlighted?: boolean; // Featured by community moderators
  reportCount: number;
  location?: {
    country: string;
    region?: string;
  };
}

export interface StoryReaction {
  storyId: string;
  anonymousUserId: string; // Hashed user ID for this reaction
  reactionType: "resonance" | "gratitude" | "strength" | "solidarity";
  createdAt: Timestamp;
}

export interface StoryReport {
  id: string;
  storyId: string;
  reporterAnonymousId: string;
  reason: "triggering_content" | "inappropriate" | "crisis_concern" | "spam" | "other";
  description?: string;
  createdAt: Timestamp;
  status: "pending" | "reviewed" | "action_taken" | "dismissed";
}

// === HEALING CIRCLES & GROUP SUPPORT ===
export interface HealingCircle {
  id: string;
  name: string;
  description: string;
  topic: string; // 'grief', 'trauma', 'anxiety', 'depression', 'self_compassion'
  type: "guided" | "peer_led" | "open_sharing" | "meditation" | "journaling";
  facilitatorId?: string; // Optional trained facilitator
  isActive: boolean;
  currentCapacity: number;
  maxCapacity: number;
  meetingSchedule: {
    frequency: "weekly" | "biweekly" | "monthly" | "one_time";
    dayOfWeek?: number; // 0-6, Sunday-Saturday
    timeUTC: string; // ISO time format
    duration: number; // minutes
  };
  participants: AnonymousParticipant[];
  sessions: HealingSession[];
  guidelines: string[];
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
  isPublic: boolean; // Open to all vs. invite-only
  requiredHealingStage?: "beginning" | "processing" | "integrating" | "thriving";
}

export interface AnonymousParticipant {
  anonymousId: string; // Generated for this circle
  joinedAt: Timestamp;
  role: "participant" | "facilitator" | "mentor";
  isActive: boolean;
  lastActiveAt?: Timestamp;
}

export interface HealingSession {
  id: string;
  circleId: string;
  scheduledAt: Timestamp;
  actualStartAt?: Timestamp;
  actualEndAt?: Timestamp;
  prompt?: string; // Guided question or theme
  participantCount: number;
  sessionType: "check_in" | "guided_sharing" | "meditation" | "group_journaling";
  status: "scheduled" | "active" | "completed" | "cancelled";
  anonymousContributions: AnonymousContribution[];
}

export interface AnonymousContribution {
  participantAnonymousId: string;
  content: string;
  timestamp: Timestamp;
  type: "sharing" | "support" | "reflection";
  moderationStatus: "approved" | "pending" | "flagged";
}

// === COMMUNITY WISDOM LIBRARY ===
export interface WisdomEntry {
  id: string;
  contributorAnonymousId: string;
  type: "coping_strategy" | "healing_insight" | "resource_recommendation" | "practice" | "affirmation";
  title: string;
  content: string;
  category: string; // 'anxiety', 'grief', 'trauma', 'self_care', 'mindfulness'
  tags: string[];
  isVerified: boolean; // Reviewed by mental health professionals
  verificationSource?: string;
  effectiveness_votes: {
    helpful: number;
    somewhat_helpful: number;
    not_helpful: number;
  };
  createdAt: Timestamp;
  lastUpdatedAt: Timestamp;
  reportCount: number;
  sourceType: "personal_experience" | "professional_guidance" | "research_based" | "traditional_wisdom";
}

export interface WisdomVote {
  entryId: string;
  voterAnonymousId: string;
  vote: "helpful" | "somewhat_helpful" | "not_helpful";
  createdAt: Timestamp;
}

// === COLLECTIVE HEALING EXPERIENCES ===
export interface CollectiveExperience {
  id: string;
  name: string;
  description: string;
  type: "meditation" | "intention_setting" | "gratitude_circle" | "healing_challenge" | "milestone_celebration";
  startDate: Timestamp;
  endDate?: Timestamp; // For challenges/time-bound experiences
  isActive: boolean;
  participantCount: number;
  anonymousParticipants: string[]; // Array of anonymous participant IDs
  prompts: CollectivePrompt[];
  createdAt: Timestamp;
  facilitatorId?: string;
}

export interface CollectivePrompt {
  id: string;
  experienceId: string;
  dayNumber?: number; // For daily challenges
  prompt: string;
  type: "reflection" | "action" | "meditation_focus" | "gratitude" | "intention";
  responses: AnonymousResponse[];
  scheduledFor?: Timestamp;
}

export interface AnonymousResponse {
  participantAnonymousId: string;
  response: string;
  submittedAt: Timestamp;
  isPublic: boolean; // Whether participant wants to share with community
}

// === SAFETY & MODERATION ===
export interface CommunityModerationLog {
  id: string;
  contentType: "story" | "contribution" | "wisdom_entry" | "response";
  contentId: string;
  moderatorId?: string; // Human moderator ID, if applicable
  action: "approved" | "flagged" | "removed" | "escalated" | "crisis_alert";
  reason?: string;
  aiModerationScore: number;
  humanReviewRequired: boolean;
  timestamp: Timestamp;
  escalationLevel?: "low" | "medium" | "high" | "crisis";
}

export interface CommunityGuidelines {
  version: string;
  guidelines: {
    category: string;
    rules: string[];
    examples: string[];
  }[];
  lastUpdated: Timestamp;
  activeFrom: Timestamp;
}

export interface TraumaInformedModeration {
  triggers: {
    keyword: string;
    severity: "low" | "medium" | "high";
    category: string;
  }[];
  safeguards: {
    type: string;
    action: string;
    description: string;
  }[];
  escalationRules: {
    condition: string;
    action: string;
    notifyRoles: string[];
  }[];
}

// === PEER MATCHING & SUPPORT ===
export interface PeerMatchProfile {
  anonymousId: string;
  healingTopics: string[];
  healingStage: "beginning" | "processing" | "integrating" | "thriving" | "wisdom_sharing";
  supportType: "seeking_support" | "offering_support" | "mutual_support";
  communicationStyle: "direct" | "gentle" | "structured" | "creative";
  timeZone: string;
  availability: {
    daysOfWeek: number[];
    timeRanges: string[];
  };
  experienceWith: string[]; // Types of healing modalities familiar with
  isActive: boolean;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
}

export interface PeerMatch {
  id: string;
  participant1Id: string;
  participant2Id: string;
  matchScore: number; // Algorithm-generated compatibility score
  sharedTopics: string[];
  matchType: "mentor_mentee" | "peer_support" | "healing_buddy";
  status: "proposed" | "accepted" | "declined" | "active" | "paused" | "completed";
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  checkIns: PeerCheckIn[];
}

export interface PeerCheckIn {
  matchId: string;
  checkInDate: Timestamp;
  participant1Status: "positive" | "neutral" | "concern";
  participant2Status: "positive" | "neutral" | "concern";
  notes?: string;
  escalationNeeded: boolean;
}

// === COMMUNITY ANALYTICS & INSIGHTS ===
export interface CommunityHealthMetrics {
  date: string;
  activeStories: number;
  activeCircles: number;
  activePeerMatches: number;
  engagementScore: number; // Calculated engagement metric
  safetyScore: number; // Based on moderation actions and reports
  communityGrowth: {
    newParticipants: number;
    returningParticipants: number;
    churnRate: number;
  };
  topHealingTopics: {
    topic: string;
    mentions: number;
  }[];
  wisdomContributions: number;
  moderationStats: {
    totalReviews: number;
    autoApproved: number;
    humanReviewed: number;
    flagged: number;
  };
}

// === REQUEST/RESPONSE TYPES ===
export interface CreateStoryRequest {
  content: string;
  title?: string;
  healingStage: string;
  wisdomTags: string[];
  location?: {
    country: string;
    region?: string;
  };
}

export interface CreateWisdomEntryRequest {
  type: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  sourceType: string;
}

export interface JoinCircleRequest {
  circleId: string;
  healingTopics: string[];
  supportGoals: string;
}

export interface CreateCollectiveExperienceRequest {
  name: string;
  description: string;
  type: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  prompts: {
    prompt: string;
    type: string;
    dayNumber?: number;
  }[];
}