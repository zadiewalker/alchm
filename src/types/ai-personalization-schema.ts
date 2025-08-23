// ALCHM AI Personalization Engine Schema
// Journal embeddings, adaptive coaching, and personalized pathway suggestions

import { IdentityJourney, CulturalContext } from '@/types/identity-schema';
import { CareerJourney, SMARTGoal } from '@/types/career-schema';
import { EmotionalEntry, AIEmotionalInsight } from '@/types/emotional-wellness-schema';

// Core Coach Profile Types
export interface CoachProfile {
  coachId: string;
  name: string;
  role: string;
  
  // Personality Configuration
  tone: 'mirror' | 'mentor' | 'visionary';
  pacing: 'gentle' | 'challenging';
  preferredLanguage: 'en' | 'es' | 'sw' | 'pt' | 'ko' | 'hi' | 'de';
  
  // Coaching Style
  communicationStyle: CoachCommunicationStyle;
  questioningApproach: QuestioningApproach;
  feedbackStyle: FeedbackStyle;
  motivationalStyle: MotivationalStyle;
  
  // Adaptive Behavior
  adaptationRules: AdaptationRule[];
  contextualAdjustments: ContextualAdjustment[];
  culturalCompetencies: CulturalCompetency[];
  
  // Specializations
  expertise: CoachExpertise[];
  coachingMethods: CoachingMethod[];
  interventionPreferences: InterventionPreference[];
  
  // Learning and Evolution
  learningModel: CoachLearningModel;
  adaptationHistory: AdaptationHistory[];
  effectivenessMetrics: CoachEffectivenessMetrics;
  
  // Multilingual Capabilities
  languageProfiles: LanguageProfile[];
  culturalFrameworks: CulturalFramework[];
  localizationRules: LocalizationRule[];
  
  createdAt: Date;
  lastUpdated: Date;
  version: string;
}

// Journal Embeddings and Analysis
export interface JournalEmbedding {
  embeddingId: string;
  userId: string;
  entryId: string;
  
  // Vector Representations
  contentEmbedding: number[]; // 1536-dimensional vector from Gemini
  emotionalEmbedding: number[]; // Emotional state vector
  themeEmbedding: number[]; // Life themes and topics
  progressEmbedding: number[]; // Personal growth indicators
  
  // Extracted Features
  extractedThemes: ExtractedTheme[];
  emotionalSignature: EmotionalSignature;
  lifeStageIndicators: LifeStageIndicator[];
  growthPatterns: GrowthPattern[];
  challengeAreas: ChallengeArea[];
  strengthAreas: StrengthArea[];
  
  // Semantic Analysis
  semanticTags: SemanticTag[];
  intentAnalysis: IntentAnalysis;
  valueAlignment: ValueAlignment[];
  goalRelevance: GoalRelevance[];
  
  // Personalization Signals
  personalizationSignals: PersonalizationSignal[];
  coachingNeeds: CoachingNeed[];
  interventionReadiness: InterventionReadiness[];
  
  // Metadata
  extractionTimestamp: Date;
  modelVersion: string;
  confidence: number; // 0-1
  qualityScore: number; // 0-1
}

// Pathway Suggestions System
export interface PersonalizedPathway {
  pathwayId: string;
  userId: string;
  
  // Pathway Definition
  title: string;
  description: string;
  category: PathwayCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string;
  
  // Personalization Basis
  basedOnEmbeddings: string[]; // JournalEmbedding IDs
  relevanceScore: number; // 0-1
  personalizationFactors: PersonalizationFactor[];
  
  // Pathway Structure
  phases: PathwayPhase[];
  milestones: PathwayMilestone[];
  checkpoints: PathwayCheckpoint[];
  adaptationPoints: PathwayAdaptationPoint[];
  
  // Content and Activities
  recommendedActivities: RecommendedActivity[];
  suggestedResources: SuggestedResource[];
  practiceRecommendations: PracticeRecommendation[];
  
  // Coaching Integration
  coachingSupport: CoachingSupport[];
  adaptivePrompts: AdaptivePrompt[];
  progressTracking: ProgressTracking;
  
  // Cultural and Personal Adaptation
  culturalAdaptations: CulturalAdaptation[];
  personalizations: PersonalPathwayPersonalization[];
  accessibilityFeatures: AccessibilityFeature[];
  
  // Success Metrics
  successCriteria: SuccessCriteria[];
  progressIndicators: ProgressIndicator[];
  completionRewards: CompletionReward[];
  
  // Dynamic Adjustment
  adaptationRules: PathwayAdaptationRule[];
  feedbackLoops: FeedbackLoop[];
  evolutionHistory: PathwayEvolution[];
  
  createdAt: Date;
  lastUpdated: Date;
  isActive: boolean;
  userEngagement: UserEngagement;
}

// AI Coaching Session with Adaptive Behavior
export interface AICoachingSession {
  sessionId: string;
  userId: string;
  coachProfile: CoachProfile;
  
  // Session Context
  sessionType: 'check_in' | 'goal_setting' | 'problem_solving' | 'reflection' | 'celebration' | 'pathway_guidance';
  triggerContext: TriggerContext;
  userState: UserState;
  environmentalContext: EnvironmentalContext;
  
  // Adaptive Coaching
  initialApproach: CoachingApproach;
  adaptations: SessionAdaptation[];
  toneAdjustments: ToneAdjustment[];
  pacingAdjustments: PacingAdjustment[];
  
  // Conversation Flow
  conversationPhases: ConversationPhase[];
  coachingInterventions: CoachingIntervention[];
  userResponses: UserResponse[];
  adaptiveQuestions: AdaptiveQuestion[];
  
  // Personalization Elements
  personalizedContent: PersonalizedContent[];
  culturalReferences: CulturalReference[];
  languageAdaptations: LanguageAdaptation[];
  
  // Embeddings Integration
  relevantEmbeddings: string[]; // JournalEmbedding IDs
  embeddingInsights: EmbeddingInsight[];
  contextualConnections: ContextualConnection[];
  
  // Outcome and Evolution
  sessionOutcomes: SessionOutcome[];
  coachLearning: CoachLearning[];
  userFeedback: UserSessionFeedback;
  effectivenessMetrics: SessionEffectivenessMetrics;
  
  // Next Steps
  followUpActions: FollowUpAction[];
  pathwayAdjustments: PathwayAdjustment[];
  coachingEvolution: CoachingEvolution[];
  
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
}

// Personalization Engine Core
export interface PersonalizationEngine {
  engineId: string;
  userId: string;
  
  // User Model
  userPersonalizationProfile: UserPersonalizationProfile;
  learningPreferences: LearningPreference[];
  engagementPatterns: EngagementPattern[];
  responseHistory: ResponseHistory[];
  
  // Embedding Analysis
  embeddingClusters: EmbeddingCluster[];
  themeEvolution: ThemeEvolution[];
  emotionalJourney: EmotionalJourney[];
  growthTrajectory: GrowthTrajectory[];
  
  // Coach Matching
  coachCompatibility: CoachCompatibility[];
  coachPreferences: CoachPreference[];
  coachingHistory: CoachingHistory[];
  
  // Pathway Generation
  pathwayRecommendations: PathwayRecommendation[];
  adaptivePathways: AdaptivePathway[];
  progressTracking: PersonalizationProgressTracking;
  
  // Continuous Learning
  modelUpdates: ModelUpdate[];
  performanceMetrics: PersonalizationPerformanceMetrics;
  feedbackIntegration: FeedbackIntegration[];
  
  lastAnalysis: Date;
  nextUpdate: Date;
  version: string;
}

// Supporting Types

export interface CoachCommunicationStyle {
  formality: 'casual' | 'professional' | 'warm' | 'academic';
  directness: 'direct' | 'gentle' | 'suggestive' | 'exploratory';
  supportiveness: 'empathetic' | 'encouraging' | 'challenging' | 'reflective';
  culturalSensitivity: 'high' | 'moderate' | 'adaptive';
}

export interface QuestioningApproach {
  questionTypes: ('open_ended' | 'clarifying' | 'probing' | 'scaling' | 'hypothetical')[];
  questionDepth: 'surface' | 'moderate' | 'deep' | 'transformational';
  questionTiming: 'immediate' | 'reflective' | 'strategic';
  culturalAdaptation: boolean;
}

export interface FeedbackStyle {
  timing: 'immediate' | 'delayed' | 'milestone_based';
  specificity: 'general' | 'specific' | 'detailed';
  emotionalTone: 'celebratory' | 'constructive' | 'motivational' | 'reflective';
  culturalFraming: boolean;
}

export interface MotivationalStyle {
  approach: 'intrinsic' | 'extrinsic' | 'mixed' | 'values_based';
  intensity: 'gentle' | 'moderate' | 'high_energy' | 'adaptive';
  focusAreas: ('achievement' | 'growth' | 'connection' | 'meaning' | 'mastery')[];
  culturalMotivators: CulturalMotivator[];
}

export interface AdaptationRule {
  ruleId: string;
  trigger: AdaptationTrigger;
  conditions: AdaptationCondition[];
  adjustments: AdaptationAdjustment[];
  priority: number;
  isActive: boolean;
}

export interface ContextualAdjustment {
  context: 'emotional_state' | 'time_of_day' | 'life_event' | 'stress_level' | 'energy_level';
  adjustment: ContextualAdjustmentAction;
  magnitude: number; // 0-1
  duration: string;
}

export interface CulturalCompetency {
  culture: string;
  competencyLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  adaptations: CulturalAdaptation[];
  communicationNorms: CommunicationNorm[];
  valueConsiderations: ValueConsideration[];
}

export interface CoachExpertise {
  area: 'career_development' | 'emotional_wellness' | 'life_transitions' | 'goal_achievement' | 'relationship_building' | 'creativity' | 'leadership' | 'cultural_navigation';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  methodologies: string[];
  certifications: string[];
}

export interface CoachingMethod {
  methodId: string;
  name: string;
  description: string;
  effectiveness: number; // 0-1
  applicability: MethodApplicability[];
  culturalAdaptations: CulturalMethodAdaptation[];
}

export interface InterventionPreference {
  interventionType: 'reflection' | 'action_planning' | 'skill_building' | 'mindset_shift' | 'resource_connection' | 'accountability';
  preference: number; // 0-1
  contextualFactors: ContextualFactor[];
}

export interface CoachLearningModel {
  learningRate: number; // 0-1
  adaptationSpeed: 'slow' | 'moderate' | 'fast' | 'real_time';
  feedbackSensitivity: number; // 0-1
  memoryRetention: number; // 0-1
  transferLearning: boolean;
}

export interface AdaptationHistory {
  historyId: string;
  adaptationType: string;
  trigger: string;
  adjustment: string;
  effectiveness: number; // 0-1
  timestamp: Date;
  userFeedback: number; // 1-10
}

export interface CoachEffectivenessMetrics {
  overallRating: number; // 0-1
  userSatisfaction: number; // 0-1
  goalAchievementRate: number; // 0-1
  engagementRate: number; // 0-1
  culturalCompetencyScore: number; // 0-1
  adaptationEffectiveness: number; // 0-1
  lastUpdated: Date;
}

export interface LanguageProfile {
  language: 'en' | 'es' | 'sw' | 'pt' | 'ko' | 'hi' | 'de';
  proficiencyLevel: 'basic' | 'intermediate' | 'advanced' | 'native';
  dialectVariations: string[];
  culturalNuances: CulturalNuance[];
  communicationPatterns: CommunicationPattern[];
  idioms: Idiom[];
  formalityLevels: FormalityLevel[];
}

export interface CulturalFramework {
  framework: string;
  principles: string[];
  adaptations: CulturalFrameworkAdaptation[];
  communication: CulturalCommunication[];
  values: CulturalValue[];
}

export interface LocalizationRule {
  ruleId: string;
  language: string;
  culture: string;
  adaptationType: string;
  rule: string;
  examples: LocalizationExample[];
}

export interface ExtractedTheme {
  theme: string;
  confidence: number; // 0-1
  frequency: number;
  evolution: ThemeEvolution[];
  culturalContext: string[];
  emotionalResonance: number; // 0-1
}

export interface EmotionalSignature {
  dominantEmotions: string[];
  emotionalRange: number; // 0-1
  emotionalStability: number; // 0-1
  emotionalGrowth: number; // 0-1
  culturalExpression: CulturalEmotionalExpression[];
}

export interface LifeStageIndicator {
  stage: 'exploration' | 'establishment' | 'transition' | 'mastery' | 'legacy';
  confidence: number; // 0-1
  characteristics: string[];
  transitions: LifeStageTransition[];
}

export interface GrowthPattern {
  patternType: 'linear' | 'cyclical' | 'breakthrough' | 'plateau' | 'spiral';
  areas: string[];
  velocity: number; // 0-1
  sustainability: number; // 0-1
  culturalInfluences: string[];
}

export interface ChallengeArea {
  area: string;
  severity: 'low' | 'moderate' | 'high';
  persistence: number; // 0-1
  coachingOpportunity: CoachingOpportunity;
  culturalFactors: CulturalFactor[];
}

export interface StrengthArea {
  strength: string;
  confidence: number; // 0-1
  application: StrengthApplication[];
  development: StrengthDevelopment[];
  culturalResonance: number; // 0-1
}

export interface SemanticTag {
  tag: string;
  relevance: number; // 0-1
  context: string[];
  relationships: SemanticRelationship[];
}

export interface IntentAnalysis {
  primaryIntent: 'exploration' | 'resolution' | 'growth' | 'expression' | 'connection' | 'achievement';
  confidence: number; // 0-1
  secondaryIntents: string[];
  motivations: string[];
}

export interface ValueAlignment {
  value: string;
  alignment: number; // 0-1
  expression: ValueExpression[];
  conflicts: ValueConflict[];
  culturalInfluence: number; // 0-1
}

export interface GoalRelevance {
  goalId: string;
  relevance: number; // 0-1
  contribution: string;
  alignment: number; // 0-1
  priority: number; // 0-1
}

export interface PersonalizationSignal {
  signal: string;
  strength: number; // 0-1
  context: string[];
  implications: PersonalizationImplication[];
  actionability: number; // 0-1
}

export interface CoachingNeed {
  need: string;
  urgency: 'low' | 'moderate' | 'high' | 'immediate';
  coachingApproach: string[];
  culturalConsiderations: string[];
  estimated_duration: string;
}

export interface InterventionReadiness {
  intervention: string;
  readiness: number; // 0-1
  barriers: string[];
  facilitators: string[];
  optimal_timing: string;
}

// Pathway Types
export type PathwayCategory = 
  | 'career_development' 
  | 'emotional_wellness' 
  | 'relationship_building' 
  | 'creative_expression' 
  | 'spiritual_growth' 
  | 'life_transitions' 
  | 'skill_development' 
  | 'cultural_exploration'
  | 'leadership_development'
  | 'entrepreneurship'
  | 'health_wellness'
  | 'learning_growth';

export interface PersonalizationFactor {
  factor: string;
  weight: number; // 0-1
  evidence: string[];
  culturalRelevance: number; // 0-1
}

export interface PathwayPhase {
  phaseId: string;
  title: string;
  description: string;
  duration: string;
  objectives: PhaseObjective[];
  activities: PhaseActivity[];
  assessments: PhaseAssessment[];
  support: PhaseSupport[];
  culturalAdaptations: PhaseCulturalAdaptation[];
}

export interface PathwayMilestone {
  milestoneId: string;
  title: string;
  description: string;
  criteria: MilestoneCriteria[];
  celebration: MilestoneCelebration;
  reflection: MilestoneReflection[];
  shareability: MilestoneShareability;
}

export interface PathwayCheckpoint {
  checkpointId: string;
  timing: string;
  purpose: 'progress_review' | 'adjustment' | 'support_check' | 'motivation_boost';
  questions: CheckpointQuestion[];
  assessments: CheckpointAssessment[];
  adaptations: CheckpointAdaptation[];
}

export interface PathwayAdaptationPoint {
  adaptationId: string;
  trigger: AdaptationTrigger;
  options: AdaptationOption[];
  decision_criteria: DecisionCriteria[];
  implementation: AdaptationImplementation;
}

export interface RecommendedActivity {
  activityId: string;
  title: string;
  description: string;
  type: ActivityType;
  duration: string;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'advanced';
  personalizations: ActivityPersonalization[];
  culturalAdaptations: ActivityCulturalAdaptation[];
  outcomes: ActivityOutcome[];
}

export interface SuggestedResource {
  resourceId: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'course' | 'tool' | 'community' | 'mentor';
  description: string;
  relevance: number; // 0-1
  accessibility: ResourceAccessibility;
  cultural_appropriateness: number; // 0-1
  language_availability: string[];
}

export interface CoachingSupport {
  supportType: 'guidance' | 'motivation' | 'accountability' | 'skill_building' | 'reflection';
  frequency: string;
  format: 'chat' | 'voice' | 'structured_session' | 'check_in';
  personalization: SupportPersonalization;
  cultural_adaptation: SupportCulturalAdaptation;
}

export interface AdaptivePrompt {
  promptId: string;
  context: string[];
  content: string;
  adaptations: PromptAdaptation[];
  cultural_variations: PromptCulturalVariation[];
  effectiveness: number; // 0-1
}

// User State and Context
export interface UserState {
  currentMood: number; // 1-10
  energyLevel: number; // 1-10
  stressLevel: number; // 1-10
  motivationLevel: number; // 1-10
  availableTime: number; // minutes
  cognitiveLoad: number; // 1-10
  emotionalCapacity: number; // 1-10
  recentEvents: RecentEvent[];
  currentChallenges: CurrentChallenge[];
  recentSuccesses: RecentSuccess[];
}

export interface TriggerContext {
  trigger: 'scheduled' | 'user_initiated' | 'pattern_detected' | 'milestone_reached' | 'support_needed' | 'celebration';
  specific_trigger: string;
  urgency: 'low' | 'moderate' | 'high' | 'immediate';
  context_data: ContextData[];
}

export interface EnvironmentalContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: string;
  location: 'home' | 'work' | 'commute' | 'social' | 'nature' | 'other';
  privacy: 'private' | 'semi_private' | 'public';
  distractions: 'none' | 'minimal' | 'moderate' | 'high';
  cultural_context: EnvironmentalCulturalContext;
}

// More supporting types continue...

export interface UserPersonalizationProfile {
  profileId: string;
  userId: string;
  
  // Core Preferences
  coachingPreferences: CoachingPreference[];
  communicationPreferences: CommunicationPreference[];
  learningStyle: LearningStyle;
  culturalProfile: CulturalProfile;
  
  // Behavioral Patterns
  engagementPatterns: EngagementPattern[];
  responsePatterns: ResponsePattern[];
  adaptationPatterns: AdaptationPattern[];
  
  // Goals and Values
  coreValues: CoreValue[];
  currentGoals: PersonalizationGoal[];
  lifeVision: LifeVision;
  
  // Growth and Development
  growthAreas: GrowthArea[];
  strengthAreas: StrengthArea[];
  learningObjectives: LearningObjective[];
  
  // Contextual Factors
  lifeCircumstances: LifeCircumstance[];
  culturalInfluences: CulturalInfluence[];
  environmentalFactors: EnvironmentalFactor[];
  
  // Personalization Effectiveness
  personalizationHistory: PersonalizationHistory[];
  effectivenessMetrics: PersonalizationEffectivenessMetrics;
  
  lastUpdated: Date;
  version: string;
}

// Export all types
export type {
  CoachProfile,
  JournalEmbedding,
  PersonalizedPathway,
  AICoachingSession,
  PersonalizationEngine,
  UserPersonalizationProfile
};