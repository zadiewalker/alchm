// Enhanced Firestore Schema for ALCHM Hypergrowth Architecture
// Supports 10M+ users with intelligent sharding and tier-based features

import { Timestamp } from 'firebase/firestore';

// ===== CORE USER MANAGEMENT =====

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;
  
  // Tier management
  tier: 'free' | 'deep-cut' | 'oracle';
  tierStartDate: Timestamp;
  tierExpiryDate?: Timestamp;
  
  // Personalization preferences
  preferences: UserPreferences;
  communicationStyle: 'gentle' | 'direct' | 'encouraging';
  traumaConsiderations: string[];
  effectiveStrategies: string[];
  
  // Engagement tracking
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  lastEntryDate?: Timestamp;
  
  // Crisis prevention
  riskLevel: 'low' | 'moderate' | 'high';
  lastRiskAssessment?: Timestamp;
  crisisPreventionEnabled: boolean;
  emergencyContacts: EmergencyContact[];
  
  // Analytics (anonymized)
  cohort: string; // Week-based cohort for analytics
  acquisitionSource: string;
  deviceInfo: DeviceInfo;
}

export interface PremiumUserProfile extends UserProfile {
  // Oracle tier specific features
  aiMentorSessionCount: number;
  lastMentorSession?: Timestamp;
  growthPathwayActive?: string;
  innerCircleMembers: string[]; // User IDs
  
  // Advanced analytics
  personalityInsights: PersonalityProfile;
  goalTracking: GoalProgress[];
  ritualBuilder: PersonalizedRitual[];
  
  // Executive coaching (Oracle tier)
  leadershipAssessment?: LeadershipProfile;
  careerGoals: CareerObjective[];
  executiveCoachingEnabled: boolean;
}

export interface UserPreferences {
  timezone: string;
  language: string;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  aiPersonalization: boolean;
  dataExportRequests: DataExportRequest[];
}

export interface NotificationSettings {
  dailyReflectionReminder: boolean;
  dailyReminderTime: string; // HH:MM format
  moodCheckInReminder: boolean;
  crisisAlerts: boolean;
  achievementCelebrations: boolean;
  weeklyInsights: boolean;
  innerCircleUpdates: boolean; // Oracle tier only
}

export interface PrivacySettings {
  dataRetentionPeriod: number; // Days
  shareAnonymizedInsights: boolean;
  allowResearchParticipation: boolean;
  innerCircleVisibility: 'none' | 'milestones' | 'insights'; // Oracle tier
}

// ===== JOURNAL ENTRIES WITH TTL MANAGEMENT =====

export interface JournalEntry {
  id: string;
  userId: string;
  text: string;
  wordCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Mood tracking
  moodBefore: number; // 1-10 scale
  moodAfter?: number; // Post-AI reflection
  moodDelta?: number; // Calculated improvement
  
  // AI processing
  aiProcessed: boolean;
  aiProcessingStarted?: Timestamp;
  aiProcessingCompleted?: Timestamp;
  
  // Content analysis
  emotionalTags: EmotionalTag[];
  keyTopics: string[];
  riskIndicators: RiskIndicator[];
  
  // Tier-based features
  hasAdvancedAnalytics: boolean; // Deep Cut & Oracle
  includeInPatternAnalysis: boolean; // Deep Cut & Oracle
  
  // Archive management (Free tier has 30-day TTL)
  expiresAt?: Timestamp; // Only set for free tier
  archived: boolean;
  archiveReason?: 'ttl' | 'user_request' | 'privacy_cleanup';
}

export interface ArchiveEntry {
  originalEntryId: string;
  userId: string;
  createdAt: Timestamp;
  archivedAt: Timestamp;
  
  // Minimal preserved data for analytics
  wordCount: number;
  moodDelta?: number;
  emotionalTags: string[]; // Simplified tags only
  keyTopics: string[];
  
  // Archive metadata
  archiveReason: string;
  userTierAtTime: string;
}

// ===== AI INSIGHTS WITH CACHING =====

export interface AIInsight {
  id: string;
  userId: string;
  entryId: string;
  createdAt: Timestamp;
  
  // AI-generated content
  reflection: string;
  moodPrediction: number;
  suggestedActions: string[];
  riskAssessment: 'low' | 'moderate' | 'high';
  celebrationMoment: boolean;
  
  // Quality metrics
  traumaInformed: boolean;
  personalizedScore: number; // 0-1 scale
  engagementLikelihood: number; // 0-1 scale
  
  // User feedback
  userRating?: number; // 1-5 scale
  userFeedback?: string;
  actionsTaken: string[];
  
  // Processing metadata
  modelVersion: string;
  processingTimeMs: number;
  tier: string; // User tier when generated
  
  // Cache optimization
  patternHash?: string; // For caching similar patterns
  cacheHit: boolean;
}

export interface CachedInsight {
  patternHash: string;
  reflection: string;
  suggestedActions: string[];
  createdAt: Timestamp;
  usageCount: number;
  lastUsed: Timestamp;
  
  // Cache validation
  validFor: string[]; // User tiers this cache is valid for
  expiresAt: Timestamp;
}

// ===== ANALYTICS & ENGAGEMENT =====

export interface EngagementMetrics {
  userId: string;
  date: string; // YYYY-MM-DD format
  
  // Daily engagement
  entriesCreated: number;
  wordsWritten: number;
  timeSpentMinutes: number;
  aiInsightsViewed: number;
  
  // Mood tracking
  averageMoodBefore: number;
  averageMoodAfter: number;
  moodImprovementTotal: number;
  
  // Feature usage
  featuresUsed: string[];
  notificationsOpened: number;
  sharingActions: number;
  
  // Tier-specific metrics
  deepCutFeaturesUsed?: string[]; // Pattern analysis, exports, etc.
  oracleFeaturesUsed?: string[]; // AI mentor, inner circle, etc.
  
  // Streak tracking
  currentStreak: number;
  streakMaintained: boolean;
}

export interface MilestoneTracking {
  userId: string;
  
  // Achievement progress
  achievements: Achievement[];
  currentGoals: PersonalGoal[];
  completedGoals: PersonalGoal[];
  
  // Celebration triggers
  celebrationsPending: CelebrationMoment[];
  celebrationsCompleted: CelebrationMoment[];
  
  // Growth metrics
  overallGrowthScore: number; // 0-100
  domainScores: {
    emotional: number;
    mental: number;
    spiritual: number;
    relational: number;
  };
}

// ===== PREMIUM FEATURES =====

export interface ChatSession {
  id: string;
  userId: string;
  startedAt: Timestamp;
  lastActivity: Timestamp;
  
  // Conversation context
  goalFocus: string;
  emotionalState: string;
  sessionType: 'coaching' | 'crisis' | 'reflection' | 'planning';
  
  // AI mentor personality
  mentorPersonality: string;
  conversationStyle: string;
  
  // Session metadata
  messageCount: number;
  sessionDurationMinutes: number;
  satisfactionRating?: number;
  
  // Memory context for continuity
  contextMemory: ConversationContext;
  followUpScheduled?: Timestamp;
}

export interface ConversationContext {
  keyTopics: string[];
  emotionalPatterns: string[];
  ongoingChallenges: string[];
  progressAreas: string[];
  personalPreferences: Record<string, any>;
  
  // Context freshness
  lastUpdated: Timestamp;
  relevanceScore: number; // 0-1, decreases over time
}

export interface TrustedConnections {
  userId: string;
  innerCircle: InnerCircleMember[];
  
  // Sharing preferences
  sharingLevel: 'milestones' | 'insights' | 'moments';
  autoShareMilestones: boolean;
  requireApproval: boolean;
  
  // Privacy controls
  blockedUsers: string[];
  sharingHistory: SharingEvent[];
}

export interface InnerCircleMember {
  userId: string;
  displayName: string;
  relationshipType: string; // 'family', 'friend', 'partner', 'therapist'
  addedAt: Timestamp;
  permissionLevel: 'view' | 'support' | 'full';
  
  // Interaction tracking
  lastInteraction?: Timestamp;
  supportGiven: number; // Count of supportive interactions
  milestonesCelebrated: number;
}

export interface PersonalizedJourney {
  userId: string;
  currentPathway: string;
  startedAt: Timestamp;
  
  // Journey customization
  focusAreas: string[];
  pacePreference: 'gentle' | 'steady' | 'intensive';
  timeCommitment: number; // Minutes per day
  
  // Progress tracking
  currentPhase: string;
  currentStep: number;
  totalSteps: number;
  completionPercentage: number;
  
  // Adaptive adjustments
  difficultyAdjustments: DifficultyAdjustment[];
  personalizations: PathwayPersonalization[];
  
  // Success metrics
  phaseCompletions: PhaseCompletion[];
  skillsLearned: string[];
  breakthroughMoments: BreakthroughMoment[];
}

// ===== BUSINESS INTELLIGENCE =====

export interface AnonymizedTrends {
  cohort: string; // Week-based or demo-based cohort
  timeperiod: string; // YYYY-MM-DD
  
  // Engagement trends
  averageEntriesPerUser: number;
  averageMoodImprovement: number;
  retentionRates: {
    day7: number;
    day14: number;
    day30: number;
  };
  
  // Feature adoption
  featureUsageRates: Record<string, number>;
  tierConversionRates: {
    freeToDeepCut: number;
    deepCutToOracle: number;
  };
  
  // Wellness outcomes
  crisisPreventionRate: number;
  userSatisfactionScore: number;
  breakthroughMomentFrequency: number;
  
  // Privacy-safe insights
  topEmotionalTags: string[];
  commonGrowthAreas: string[];
  effectiveInterventions: string[];
}

export interface ConversionFunnels {
  feature: string;
  tier: string;
  date: string;
  
  // Funnel metrics
  impressions: number;
  clicks: number;
  trials: number;
  conversions: number;
  
  // Conversion rates
  clickThroughRate: number;
  trialConversionRate: number;
  paidConversionRate: number;
  
  // Revenue impact
  revenueGenerated: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

// ===== SUPPORTING INTERFACES =====

export interface EmotionalTag {
  tag: string;
  confidence: number; // 0-1 scale
  source: 'ai' | 'user' | 'pattern';
}

export interface RiskIndicator {
  type: 'language' | 'pattern' | 'behavioral';
  severity: 'low' | 'moderate' | 'high';
  indicator: string;
  confidence: number;
  interventionNeeded: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  preferredContact: 'phone' | 'email';
  active: boolean;
}

export interface DeviceInfo {
  platform: string;
  browser?: string;
  version?: string;
  screenSize?: string;
  timezone: string;
  language: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  
  // Progress tracking
  progress: number; // 0-100
  completed: boolean;
  completedAt?: Timestamp;
  
  // Reward information
  rewardType: 'badge' | 'feature_unlock' | 'celebration';
  rewardData: any;
}

export interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  
  // Goal specifics
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: Timestamp;
  
  // Tracking
  createdAt: Timestamp;
  lastUpdated: Timestamp;
  completed: boolean;
  completedAt?: Timestamp;
  
  // Support
  milestones: GoalMilestone[];
  supportingActions: string[];
}

export interface CelebrationMoment {
  id: string;
  type: 'milestone' | 'breakthrough' | 'streak' | 'achievement';
  title: string;
  description: string;
  
  // Timing
  triggeredAt: Timestamp;
  presentedAt?: Timestamp;
  acknowledgedAt?: Timestamp;
  
  // Celebration data
  celebrationStyle: 'gentle' | 'enthusiastic' | 'profound';
  shareWithInnerCircle: boolean;
  shareable: boolean;
}

export interface DataExportRequest {
  id: string;
  requestedAt: Timestamp;
  completedAt?: Timestamp;
  downloadUrl?: string;
  expiresAt?: Timestamp;
  
  // Export scope
  includeEntries: boolean;
  includeInsights: boolean;
  includeAnalytics: boolean;
  dateRange: {
    start: Timestamp;
    end: Timestamp;
  };
  
  // Processing
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

// ===== SHARDING CONFIGURATION =====

export interface ShardConfig {
  // Shard distribution strategy
  standardUserShards: string[]; // users_standard_1, users_standard_2, etc.
  premiumUserShards: string[]; // users_premium_1, users_premium_2, etc.
  
  // Sharding rules
  maxUsersPerShard: number; // 50,000 for standard, 20,000 for premium
  shardingStrategy: 'user_tier' | 'geographic' | 'hybrid';
  
  // Performance thresholds
  autoScaleThreshold: number; // 0.8 (80% capacity)
  migrationEnabled: boolean;
  rebalancingSchedule: string; // Cron expression
}

// ===== TYPE GUARDS & UTILITIES =====

export function isUserProfile(obj: any): obj is UserProfile {
  return obj && typeof obj.id === 'string' && typeof obj.email === 'string';
}

export function isPremiumUser(user: UserProfile): user is PremiumUserProfile {
  return user.tier === 'oracle';
}

export function hasDeepCutAccess(user: UserProfile): boolean {
  return user.tier === 'deep-cut' || user.tier === 'oracle';
}

export function hasOracleAccess(user: UserProfile): boolean {
  return user.tier === 'oracle';
}

export function isEntryExpired(entry: JournalEntry): boolean {
  return entry.expiresAt ? entry.expiresAt.toDate() < new Date() : false;
}

export function shouldArchiveEntry(entry: JournalEntry, user: UserProfile): boolean {
  if (user.tier !== 'free') return false;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return entry.createdAt.toDate() < thirtyDaysAgo;
}

// ===== FIRESTORE COLLECTION PATHS =====

export const COLLECTIONS = {
  // User management
  USERS_STANDARD: 'users_standard',
  USERS_PREMIUM: 'users_premium',
  
  // Journal entries with subcollections
  ENTRIES_ACTIVE: (userId: string) => `entries/${userId}/active`,
  ENTRIES_ARCHIVED: (userId: string) => `entries/${userId}/archived`,
  
  // AI insights
  INSIGHTS: (userId: string) => `insights/${userId}`,
  INSIGHTS_CACHE: 'insights_cache',
  
  // Analytics
  USER_ANALYTICS: (userId: string) => `user_analytics/${userId}`,
  MILESTONE_TRACKING: (userId: string) => `milestone_tracking/${userId}`,
  
  // Premium features
  AI_CONVERSATIONS: (userId: string) => `ai_conversations/${userId}`,
  INNER_CIRCLE: (userId: string) => `inner_circle/${userId}`,
  GROWTH_PATHWAYS: (userId: string) => `growth_pathways/${userId}`,
  
  // Business intelligence (anonymized)
  POPULATION_INSIGHTS: 'population_insights',
  PRODUCT_ANALYTICS: 'product_analytics',
  CONVERSION_FUNNELS: 'conversion_funnels',
  
  // System management
  SHARD_CONFIG: 'shard_config',
  SYSTEM_HEALTH: 'system_health'
} as const;

export default {
  UserProfile,
  PremiumUserProfile,
  JournalEntry,
  AIInsight,
  EngagementMetrics,
  COLLECTIONS
};