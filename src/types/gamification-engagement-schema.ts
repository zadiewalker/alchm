// ALCHM Gamification & Engagement Architecture Schema
// Comprehensive gamification framework that balances engagement with authentic personal development

import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CareerExplorationProfile, LearningPathway, SMARTGoal } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

// Core Gamification Framework
export interface GamificationProfile {
  profileId: string;
  userId: string;
  
  // Growth Journey
  growthJourney: GrowthJourney;
  progressVisualization: ProgressVisualization;
  transformationTimeline: TransformationTimeline;
  growthStreaks: GrowthStreak[];
  
  // Achievement Systems
  achievements: Achievement[];
  milestones: Milestone[];
  badges: Badge[];
  levels: LevelProgression[];
  
  // Challenge & Quest Systems
  activeQuests: Quest[];
  completedChallenges: Challenge[];
  skillBuildingGames: SkillBuildingGame[];
  communityQuests: CommunityQuest[];
  
  // Recognition & Sharing
  recognitionReceived: Recognition[];
  recognitionGiven: Recognition[];
  sharedStories: SharedStory[];
  mentorRecognitions: MentorRecognition[];
  
  // Engagement Metrics
  engagementMetrics: EngagementMetrics;
  motivationFactors: MotivationFactor[];
  personalGamificationPreferences: GamificationPreferences;
  
  createdAt: Date;
  lastActive: Date;
  totalEngagementScore: number; // 0-1000
}

// Growth Journey Visualization
export interface GrowthJourney {
  journeyId: string;
  journeyType: 'identity' | 'emotional' | 'career' | 'comprehensive';
  startDate: Date;
  currentPhase: JourneyPhase;
  
  // Visual Representation
  journeyMap: JourneyMap;
  progressNodes: ProgressNode[];
  pathConnections: PathConnection[];
  visualTheme: VisualTheme;
  
  // Progress Tracking
  overallProgress: number; // 0-1
  phaseProgress: PhaseProgress[];
  growthMetrics: GrowthMetric[];
  transformationMarkers: TransformationMarker[];
  
  // Personalization
  personalNarrative: PersonalNarrative;
  culturalAdaptations: CulturalAdaptation[];
  motivationalElements: MotivationalElement[];
  
  isActive: boolean;
  lastUpdated: Date;
}

export interface ProgressVisualization {
  visualizationId: string;
  visualType: 'timeline' | 'tree' | 'mountain' | 'garden' | 'constellation' | 'custom';
  
  // Visual Elements
  primaryElements: VisualElement[];
  interactiveFeatures: InteractiveFeature[];
  animationEffects: AnimationEffect[];
  colorScheme: ColorScheme;
  
  // Data Representation
  dataPoints: DataPoint[];
  trendLines: TrendLine[];
  comparisonViews: ComparisonView[];
  projectionElements: ProjectionElement[];
  
  // Customization
  userCustomizations: UserCustomization[];
  culturalTheming: CulturalTheming;
  personalizedMetrics: PersonalizedMetric[];
  
  lastUpdated: Date;
}

export interface TransformationTimeline {
  timelineId: string;
  timeRange: TimeRange;
  
  // Timeline Elements
  keyMoments: KeyMoment[];
  growthPeriods: GrowthPeriod[];
  breakthroughPoints: BreakthroughPoint[];
  reflectionMarkers: ReflectionMarker[];
  
  // Visual Representation
  timelineVisualization: TimelineVisualization;
  narrativeFlow: NarrativeFlow;
  emotionalJourney: EmotionalJourney;
  
  // Insights
  patternRecognition: PatternRecognition[];
  growthInsights: GrowthInsight[];
  futureProjections: FutureProjection[];
  
  isShared: boolean;
  privacyLevel: 'private' | 'anonymous' | 'community' | 'public';
}

// Achievement & Milestone Systems
export interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  category: 'identity' | 'emotional' | 'career' | 'learning' | 'community' | 'mastery' | 'transformation';
  
  // Achievement Properties
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  rarity: number; // 0-1, how rare this achievement is
  significance: 'milestone' | 'breakthrough' | 'mastery' | 'transformation' | 'contribution';
  
  // Requirements
  requirements: AchievementRequirement[];
  prerequisites: string[]; // Other achievement IDs
  timeframe: AchievementTimeframe;
  
  // Rewards & Recognition
  experiencePoints: number;
  badgesAwarded: string[];
  unlockedFeatures: string[];
  celebrationRitual: CelebrationRitual;
  
  // Tracking
  progress: number; // 0-1
  unlockedAt?: Date;
  isHidden: boolean; // Surprise achievements
  culturalVariations: CulturalVariation[];
  
  // Sharing & Recognition
  isShareable: boolean;
  communityImpact: CommunityImpact;
  mentorNotification: boolean;
}

export interface Milestone {
  milestoneId: string;
  title: string;
  description: string;
  type: 'personal' | 'skill' | 'career' | 'community' | 'wellness' | 'transformation';
  
  // Milestone Properties
  significance: 'minor' | 'major' | 'epic' | 'legendary';
  pathwayRelevance: PathwayRelevance[];
  realWorldImpact: RealWorldImpact;
  
  // Visual Representation
  iconStyle: IconStyle;
  celebrationStyle: CelebrationStyle;
  visualEffects: VisualEffect[];
  
  // Requirements & Validation
  completionCriteria: CompletionCriteria[];
  validationMethod: 'self_reported' | 'peer_validated' | 'mentor_confirmed' | 'ai_verified' | 'evidence_based';
  evidenceRequired: EvidenceRequirement[];
  
  // Rewards & Unlocks
  rewards: MilestoneReward[];
  nextMilestones: string[]; // Unlocked milestone IDs
  bonusOpportunities: BonusOpportunity[];
  
  // Progress & Completion
  currentProgress: number; // 0-1
  completedAt?: Date;
  celebrationCompleted: boolean;
  sharingEnabled: boolean;
  
  // Community Aspects
  communityRecognition: CommunityRecognition;
  mentorPride: MentorPride;
  inspirationPotential: number; // 0-1
}

// Challenge & Quest Systems
export interface Quest {
  questId: string;
  title: string;
  description: string;
  questType: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'epic' | 'legendary';
  
  // Quest Properties
  theme: QuestTheme;
  difficulty: 'gentle' | 'moderate' | 'challenging' | 'intense' | 'transformational';
  duration: QuestDuration;
  
  // Structure
  phases: QuestPhase[];
  objectives: QuestObjective[];
  optionalChallenges: OptionalChallenge[];
  bonusQuests: BonusQuest[];
  
  // Requirements
  eligibilityRequirements: EligibilityRequirement[];
  resourceRequirements: ResourceRequirement[];
  commitmentLevel: CommitmentLevel;
  
  // Collaboration
  isCollaborative: boolean;
  teamSize?: { min: number; max: number };
  roleAssignments: RoleAssignment[];
  collaborationBenefits: CollaborationBenefit[];
  
  // Rewards & Growth
  questRewards: QuestReward[];
  skillDevelopment: SkillDevelopment[];
  characterGrowth: CharacterGrowth[];
  unlockRequirements: UnlockRequirement[];
  
  // Progress & Completion
  currentPhase: number;
  overallProgress: number; // 0-1
  participants: QuestParticipant[];
  startedAt?: Date;
  completedAt?: Date;
  
  // Cultural & Personal Adaptation
  culturalAdaptations: QuestCulturalAdaptation[];
  personalizations: QuestPersonalization[];
  motivationalElements: QuestMotivationalElement[];
}

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  challengeType: 'skill_building' | 'habit_formation' | 'breakthrough' | 'creativity' | 'connection' | 'contribution';
  
  // Challenge Properties
  focusArea: FocusArea;
  timeframe: ChallengeTimeframe;
  intensity: 'light' | 'moderate' | 'intense' | 'extreme';
  
  // Structure & Requirements
  tasks: ChallengeTask[];
  checkInRequirements: CheckInRequirement[];
  progressMilestones: ProgressMilestone[];
  
  // Skill Development
  targetSkills: TargetSkill[];
  skillApplications: SkillApplication[];
  realWorldPractice: RealWorldPractice[];
  
  // Community Aspects
  isCommunityChallenge: boolean;
  communityGoals: CommunityGoal[];
  peerSupport: PeerSupport[];
  leaderboards: Leaderboard[];
  
  // Adaptation & Personalization
  difficultyScaling: DifficultyScaling;
  personalAdaptations: PersonalAdaptation[];
  culturalConsiderations: CulturalConsideration[];
  
  // Rewards & Recognition
  completionRewards: CompletionReward[];
  progressRewards: ProgressReward[];
  communityRecognition: ChallengeRecognition[];
  
  // Status & Progress
  status: 'upcoming' | 'active' | 'completed' | 'failed' | 'paused';
  progress: ChallengeProgress;
  participants: ChallengeParticipant[];
}

// Skill-Building Games & Interactive Exercises
export interface SkillBuildingGame {
  gameId: string;
  title: string;
  description: string;
  gameType: 'reflection' | 'decision_making' | 'creativity' | 'communication' | 'problem_solving' | 'emotional_intelligence';
  
  // Game Mechanics
  mechanicsType: 'story_based' | 'puzzle' | 'simulation' | 'creative_expression' | 'social_interaction' | 'mindfulness';
  interactionLevel: 'individual' | 'paired' | 'small_group' | 'community';
  sessionDuration: number; // minutes
  
  // Learning Objectives
  primarySkills: PrimarySkill[];
  secondarySkills: SecondarySkill[];
  learningOutcomes: LearningOutcome[];
  realWorldApplications: GameRealWorldApplication[];
  
  // Game Content
  scenarios: GameScenario[];
  challenges: GameChallenge[];
  progressionLevels: ProgressionLevel[];
  adaptiveDifficulty: AdaptiveDifficulty;
  
  // Personalization
  culturalScenarios: CulturalScenario[];
  personalRelevance: PersonalRelevance[];
  motivationalTheming: MotivationalTheming;
  
  // Progress & Mastery
  masteryLevels: MasteryLevel[];
  achievementMarkers: AchievementMarker[];
  skillTransfer: SkillTransfer[];
  
  // Community Features
  sharedExperiences: SharedExperience[];
  collaborativeElements: CollaborativeElement[];
  mentorIntegration: MentorIntegration[];
  
  // Analytics & Insights
  performanceMetrics: PerformanceMetric[];
  learningInsights: LearningInsight[];
  improvementSuggestions: ImprovementSuggestion[];
  
  isActive: boolean;
  lastPlayed?: Date;
  totalPlayTime: number; // minutes
}

// Recognition & Sharing Systems
export interface Recognition {
  recognitionId: string;
  type: 'peer_appreciation' | 'mentor_pride' | 'community_impact' | 'breakthrough_moment' | 'consistent_growth' | 'inspiring_others';
  
  // Recognition Details
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  message: string;
  specificAchievements: string[];
  
  // Context
  contextType: 'milestone_completion' | 'helpful_support' | 'inspiring_story' | 'skill_demonstration' | 'community_contribution';
  relatedContent: string[]; // IDs of related achievements, goals, etc.
  
  // Visibility & Sharing
  visibilityLevel: 'private' | 'circle' | 'community' | 'public';
  isAnonymous: boolean;
  culturalSensitivity: CulturalSensitivity;
  
  // Impact
  inspirationImpact: number; // 0-1
  motivationBoost: number; // 0-1
  communityResonance: number; // 0-1
  
  // Interaction
  reactions: RecognitionReaction[];
  responses: RecognitionResponse[];
  sharingChain: SharingChain[];
  
  createdAt: Date;
  celebrationStyle: RecognitionCelebrationStyle;
}

export interface SharedStory {
  storyId: string;
  storyType: 'breakthrough' | 'transformation' | 'overcoming_challenge' | 'unexpected_discovery' | 'community_impact' | 'gratitude';
  
  // Story Content
  title: string;
  narrative: string;
  keyInsights: string[];
  lessonsLearned: string[];
  
  // Context & Journey
  journeyContext: JourneyContext;
  timeframe: StoryTimeframe;
  challengesOvercome: ChallengeOvercome[];
  supportReceived: SupportReceived[];
  
  // Anonymity & Privacy
  isAnonymous: boolean;
  privacyLevel: 'community_only' | 'public_inspiration' | 'research_contribution';
  demographicSharing: DemographicSharing;
  
  // Impact & Inspiration
  inspirationCategories: InspirationCategory[];
  relatabilityFactors: RelatabilityFactor[];
  hopefulnessScore: number; // 0-1
  authenticity: number; // 0-1
  
  // Community Interaction
  inspirationReactions: InspirationReaction[];
  similarJourneyConnections: SimilarJourneyConnection[];
  supportOffered: SupportOffered[];
  
  // Moderation & Quality
  moderationStatus: 'pending' | 'approved' | 'featured' | 'archived';
  qualityScore: number; // 0-1
  culturalSensitivityCheck: boolean;
  
  sharedAt: Date;
  featuredUntil?: Date;
  totalInspiration: number;
}

// Growth Streaks & Consistency
export interface GrowthStreak {
  streakId: string;
  streakType: 'daily_reflection' | 'goal_progress' | 'skill_practice' | 'community_engagement' | 'mindfulness' | 'learning';
  
  // Streak Properties
  currentStreak: number; // days
  longestStreak: number; // days
  totalActiveDays: number;
  streakStartDate: Date;
  lastActivityDate: Date;
  
  // Streak Mechanics
  streakRequirements: StreakRequirement[];
  flexibilityRules: FlexibilityRule[];
  recoveryMechanics: RecoveryMechanic[];
  
  // Rewards & Milestones
  streakMilestones: StreakMilestone[];
  consistencyRewards: ConsistencyReward[];
  motivationalBoosts: MotivationalBoost[];
  
  // Customization
  personalizedMotivation: PersonalizedMotivation[];
  culturalAdaptations: StreakCulturalAdaptation[];
  difficultyAdjustments: DifficultyAdjustment[];
  
  // Community & Support
  streakBuddies: StreakBuddy[];
  encouragementSystem: EncouragementSystem;
  celebrationRituals: StreakCelebrationRitual[];
  
  // Analytics
  consistencyPattern: ConsistencyPattern;
  motivationTrends: MotivationTrend[];
  improvementSuggestions: StreakImprovementSuggestion[];
  
  isActive: boolean;
  isPaused: boolean;
  pauseReason?: string;
}

// Engagement & Motivation
export interface EngagementMetrics {
  metricsId: string;
  userId: string;
  
  // Core Engagement
  dailyEngagement: DailyEngagement[];
  weeklyPatterns: WeeklyPattern[];
  sessionQuality: SessionQuality[];
  featureUsage: FeatureUsage[];
  
  // Motivation Tracking
  motivationLevels: MotivationLevel[];
  engagementTriggers: EngagementTrigger[];
  dropOffPatterns: DropOffPattern[];
  reEngagementFactors: ReEngagementFactor[];
  
  // Content Preferences
  contentEngagement: ContentEngagement[];
  gamificationPreferences: GamificationPreference[];
  socialInteractionLevel: SocialInteractionLevel;
  
  // Growth & Progress
  progressSatisfaction: ProgressSatisfaction[];
  achievementResonance: AchievementResonance[];
  challengeEngagement: ChallengeEngagement[];
  
  // Insights & Optimization
  engagementInsights: EngagementInsight[];
  personalizationOpportunities: PersonalizationOpportunity[];
  motivationOptimization: MotivationOptimization[];
  
  lastUpdated: Date;
  engagementTrend: 'increasing' | 'stable' | 'declining' | 'variable';
  overallEngagementScore: number; // 0-1
}

export interface GamificationPreferences {
  preferencesId: string;
  userId: string;
  
  // Core Preferences
  gamificationIntensity: 'minimal' | 'moderate' | 'high' | 'maximum';
  preferredMechanics: PreferredMechanic[];
  avoidedMechanics: AvoidedMechanic[];
  
  // Motivation Drivers
  primaryMotivators: PrimaryMotivator[];
  recognitionPreferences: RecognitionPreference[];
  competitionComfort: CompetitionComfort;
  collaborationPreference: CollaborationPreference;
  
  // Cultural & Personal
  culturalGamificationStyle: CulturalGamificationStyle;
  personalityAlignment: PersonalityAlignment;
  communicationStyle: GamificationCommunicationStyle;
  
  // Customization
  visualPreferences: VisualPreference[];
  narrativeStyle: NarrativeStyle;
  challengeDifficulty: PreferredDifficulty;
  
  // Privacy & Sharing
  sharingComfort: SharingComfort;
  anonymityPreferences: AnonymityPreference[];
  communityParticipation: CommunityParticipationLevel;
  
  lastUpdated: Date;
  isActive: boolean;
}

// Supporting Types & Enums
export type JourneyPhase = 'discovery' | 'exploration' | 'development' | 'growth' | 'mastery' | 'transformation' | 'contribution';
export type QuestTheme = 'self_discovery' | 'skill_mastery' | 'emotional_growth' | 'career_advancement' | 'community_building' | 'creativity' | 'wellness';
export type FocusArea = 'identity' | 'emotional_wellness' | 'career_development' | 'skill_building' | 'relationships' | 'creativity' | 'contribution';
export type CelebrationStyle = 'quiet_reflection' | 'community_sharing' | 'personal_ritual' | 'mentor_recognition' | 'public_celebration';

// Additional Supporting Interfaces
export interface VisualElement {
  elementId: string;
  type: 'node' | 'path' | 'milestone' | 'badge' | 'progress_bar' | 'animation';
  position: { x: number; y: number; z?: number };
  style: ElementStyle;
  interactivity: ElementInteractivity;
  culturalTheming: ElementCulturalTheming;
}

export interface ElementStyle {
  colors: string[];
  size: { width: number; height: number };
  shape: string;
  animation: AnimationType;
  accessibility: AccessibilityFeature[];
}

export interface QuestReward {
  rewardType: 'experience_points' | 'skill_unlock' | 'feature_access' | 'recognition' | 'community_status' | 'mentorship_opportunity';
  value: number;
  description: string;
  unlockConditions: UnlockCondition[];
  culturalAdaptation: RewardCulturalAdaptation;
}

// Export all types
export type {
  GamificationProfile,
  GrowthJourney,
  ProgressVisualization,
  TransformationTimeline,
  Achievement,
  Milestone,
  Quest,
  Challenge,
  SkillBuildingGame,
  Recognition,
  SharedStory,
  GrowthStreak,
  EngagementMetrics,
  GamificationPreferences
};