// ALCHM Identity Pathway System Schema
// Cultural competency, identity exploration, bias awareness, and inclusive growth

import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CoachProfile, PersonalizationSignal } from '@/types/ai-personalization-schema';
import { CulturalContext, IdentityJourney } from '@/types/identity-schema';

// Core Identity Exploration Framework
export interface IdentityExplorationProfile {
  profileId: string;
  userId: string;
  
  // Multi-Dimensional Identity Mapping
  personalIdentity: PersonalIdentityMap;
  collectiveIdentity: CollectiveIdentityMap;
  culturalIdentity: CulturalIdentityMap;
  intersectionalIdentity: IntersectionalIdentityMap;
  
  // Identity Development Journey
  identityDevelopmentStage: IdentityDevelopmentStage;
  explorationProgress: ExplorationProgress;
  identityEvolution: IdentityEvolution[];
  
  // Cultural Competency Assessment
  culturalCompetencyLevel: CulturalCompetencyLevel;
  biasAwarenessLevel: BiasAwarenessLevel;
  inclusionPracticeLevel: InclusionPracticeLevel;
  
  // Safe Space Configuration
  safetyPreferences: SafetyPreferences;
  communicationBoundaries: CommunicationBoundary[];
  triggerAwareness: TriggerAwareness[];
  
  // Growth Tracking
  growthMetrics: IdentityGrowthMetrics;
  competencyTracking: CulturalCompetencyTracking;
  biasInterruptionHistory: BiasInterruptionEvent[];
  
  // Community Integration
  communityParticipation: CommunityParticipation;
  mentorshipConnections: MentorshipConnection[];
  identityBasedDiscussions: IdentityDiscussion[];
  
  createdAt: Date;
  lastUpdated: Date;
  privacyLevel: 'private' | 'semi_anonymous' | 'community_visible';
}

export interface PersonalIdentityMap {
  mapId: string;
  
  // Core Personal Elements
  coreValues: IdentityValue[];
  personalBeliefs: PersonalBelief[];
  lifeExperiences: FormativeExperience[];
  personalNarrative: PersonalNarrative;
  
  // Identity Facets
  identityFacets: IdentityFacet[];
  identityPriorities: IdentityPriority[];
  identityTensions: IdentityTension[];
  identityEvolution: PersonalIdentityEvolution[];
  
  // Self-Perception
  selfConcept: SelfConcept;
  identityConfidence: IdentityConfidence[];
  identityQuestions: IdentityQuestion[];
  explorationAreas: ExplorationArea[];
  
  // Personal Growth
  growthGoals: PersonalGrowthGoal[];
  developmentAreas: PersonalDevelopmentArea[];
  strengthAreas: PersonalStrengthArea[];
  
  lastReflection: Date;
  completeness: number; // 0-1
  explorationDepth: number; // 0-1
}

export interface CollectiveIdentityMap {
  mapId: string;
  
  // Group Memberships
  groupMemberships: GroupMembership[];
  communityConnections: CommunityConnection[];
  familialConnections: FamilialConnection[];
  professionalIdentities: ProfessionalIdentity[];
  
  // Collective Experiences
  sharedExperiences: SharedExperience[];
  collectiveMemory: CollectiveMemory[];
  groupNarratives: GroupNarrative[];
  
  // Social Positioning
  socialPositioning: SocialPositioning[];
  privilegeAssessment: PrivilegeAssessment[];
  marginalizationExperiences: MarginalizationExperience[];
  
  // Collective Responsibilities
  communityRoles: CommunityRole[];
  socialResponsibilities: SocialResponsibility[];
  collectiveAction: CollectiveAction[];
  
  // Group Dynamics
  belongingSense: BelongingSense[];
  groupConflicts: GroupConflict[];
  identityNegotiation: IdentityNegotiation[];
  
  lastAssessment: Date;
  groupsAnalyzed: number;
  conflictResolution: ConflictResolution[];
}

export interface CulturalIdentityMap {
  mapId: string;
  
  // Cultural Heritage
  culturalHeritage: CulturalHeritage[];
  ancestralConnections: AncestralConnection[];
  traditionalPractices: TraditionalPractice[];
  culturalWisdom: CulturalWisdom[];
  
  // Cultural Expression
  culturalExpression: CulturalExpression[];
  languageConnections: LanguageConnection[];
  ritualPractices: RitualPractice[];
  culturalArtForms: CulturalArtForm[];
  
  // Cultural Navigation
  culturalAdaptation: CulturalAdaptation[];
  biculturalExperience: BiculturalExperience[];
  culturalConflicts: CulturalConflict[];
  acculturationLevel: AcculturationLevel;
  
  // Cultural Transmission
  culturalTransmission: CulturalTransmission[];
  intergenerationalWisdom: IntergenerationalWisdom[];
  culturalPreservation: CulturalPreservation[];
  
  // Cultural Competency
  culturalAwareness: CulturalAwareness[];
  crossCulturalSkills: CrossCulturalSkill[];
  culturalSensitivity: CulturalSensitivity[];
  
  lastExploration: Date;
  explorationDepth: number; // 0-1
  culturalPrideLevel: number; // 0-1
}

export interface IntersectionalIdentityMap {
  mapId: string;
  
  // Intersectional Analysis
  identityIntersections: IdentityIntersection[];
  intersectionalExperiences: IntersectionalExperience[];
  compoundPrivilege: CompoundPrivilege[];
  compoundMarginalization: CompoundMarginalization[];
  
  // Intersection Navigation
  navigationStrategies: IntersectionNavigationStrategy[];
  contextualIdentityShifts: ContextualIdentityShift[];
  identityCompartmentalization: IdentityCompartmentalization[];
  
  // Intersectional Awareness
  intersectionalConsciousness: IntersectionalConsciousness;
  systemicAwareness: SystemicAwareness[];
  structuralUnderstanding: StructuralUnderstanding[];
  
  // Intersectional Action
  intersectionalAdvocacy: IntersectionalAdvocacy[];
  coalitionBuilding: CoalitionBuilding[];
  solidarityPractices: SolidarityPractice[];
  
  lastAnalysis: Date;
  complexityLevel: number; // 0-1
  intersectionalAwareness: number; // 0-1
}

// Bias Awareness and Interruption System
export interface BiasAwarenessSystem {
  systemId: string;
  userId: string;
  
  // Bias Assessment
  biasInventory: BiasInventory;
  implicitBiasAssessment: ImplicitBiasAssessment[];
  explicitBiasAwareness: ExplicitBiasAwareness[];
  
  // Bias Types and Categories
  cognititiveBiases: CognitiveBias[];
  socialBiases: SocialBias[];
  culturalBiases: CulturalBias[];
  institutionalBiases: InstitutionalBias[];
  
  // Bias Interruption Tools
  biasChecks: BiasCheck[];
  interruptionStrategies: BiasInterruptionStrategy[];
  reflectionPrompts: BiasReflectionPrompt[];
  accountabilityMeasures: AccountabilityMeasure[];
  
  // Growth and Learning
  biasEducation: BiasEducation[];
  perspectiveTaking: PerspectiveTaking[];
  empathyBuilding: EmpathyBuilding[];
  
  // Tracking and Measurement
  biasReductionProgress: BiasReductionProgress[];
  behaviorChange: BiasRelatedBehaviorChange[];
  attitudeShifts: AttitudeShift[];
  
  // Community Integration
  biasDiscussions: BiasDiscussion[];
  peerAccountability: PeerAccountability[];
  communityLearning: CommunityLearning[];
  
  createdAt: Date;
  lastAssessment: Date;
  nextAssessment: Date;
  overallProgress: number; // 0-1
}

export interface BiasCheck {
  checkId: string;
  userId: string;
  
  // Trigger Context
  triggerSituation: TriggerSituation;
  emotionalState: EmotionalState;
  environmentalContext: EnvironmentalContext;
  
  // Bias Detection
  detectedBiases: DetectedBias[];
  biasConfidence: number; // 0-1
  impactAssessment: BiasImpactAssessment;
  
  // Reflection Process
  reflectionQuestions: ReflectionQuestion[];
  selfAssessment: BiasCheckSelfAssessment;
  alternativePerspectives: AlternativePerspective[];
  
  // Interruption Action
  interruptionAction: InterruptionAction;
  correctedBehavior: CorrectedBehavior;
  learningExtracted: LearningExtracted[];
  
  // Follow-up
  followUpPlan: BiasCheckFollowUp;
  accountabilityPartner: AccountabilityPartner;
  progressTracking: BiasCheckProgress;
  
  timestamp: Date;
  effectiveness: number; // 0-1
  userEngagement: number; // 0-1
}

// Empathy Building and Inclusive Communication
export interface EmpathyBuildingSystem {
  systemId: string;
  userId: string;
  
  // Empathy Assessment
  empathyBaseline: EmpathyBaseline;
  empathyTypes: EmpathyType[];
  empathyBarriers: EmpathyBarrier[];
  empathyStrengths: EmpathyStrength[];
  
  // Empathy Building Activities
  perspectiveTakingExercises: PerspectiveTakingExercise[];
  narrativeEngagement: NarrativeEngagement[];
  experientialLearning: ExperientialLearning[];
  culturalImmersion: CulturalImmersion[];
  
  // Communication Skills
  inclusiveCommunication: InclusiveCommunication;
  activeListening: ActiveListening;
  culturallyResponsiveCommunication: CulturallyResponsiveCommunication;
  conflictResolution: EmpathyBasedConflictResolution;
  
  // Practice and Application
  empathyPractice: EmpathyPractice[];
  realWorldApplication: RealWorldApplication[];
  communityEngagement: EmpathyCommunityEngagement[];
  
  // Growth Tracking
  empathyGrowth: EmpathyGrowth[];
  communicationImprovement: CommunicationImprovement[];
  relationshipEnhancement: RelationshipEnhancement[];
  
  lastAssessment: Date;
  overallEmpathyLevel: number; // 0-1
  inclusionSkillLevel: number; // 0-1
}

// Adaptive Cultural Content System
export interface AdaptiveCulturalContent {
  contentId: string;
  
  // Content Adaptation Framework
  culturalAdaptationRules: CulturalAdaptationRule[];
  linguisticAdaptation: LinguisticAdaptation[];
  contextualAdaptation: ContextualAdaptation[];
  
  // Multi-Language Support
  languageVersions: LanguageVersion[];
  culturalTranslation: CulturalTranslation[];
  idiomaticExpression: IdiomaticExpression[];
  culturalEquivalents: CulturalEquivalent[];
  
  // Cultural Sensitivity Features
  culturalTriggerWarnings: CulturalTriggerWarning[];
  respectfulFraming: RespectfulFraming[];
  inclusiveLanguage: InclusiveLanguage[];
  culturalValidation: CulturalValidation[];
  
  // Personalization Engine
  culturalPersonalization: CulturalPersonalization[];
  identityResponsiveContent: IdentityResponsiveContent[];
  experienceBasedCustomization: ExperienceBasedCustomization[];
  
  // Quality Assurance
  culturalReview: CulturalReview[];
  communityValidation: CommunityValidation[];
  expertVerification: ExpertVerification[];
  
  createdAt: Date;
  lastUpdated: Date;
  qualityScore: number; // 0-1
  culturalAppropriateness: number; // 0-1
}

// Community Features for Identity Discussions
export interface IdentityDiscussionCommunity {
  communityId: string;
  
  // Community Structure
  discussionSpaces: DiscussionSpace[];
  affinityGroups: AffinityGroup[];
  supportCircles: SupportCircle[];
  learningCohorts: LearningCohort[];
  
  // Safety and Moderation
  communityGuidelines: CommunityGuideline[];
  moderationSystem: ModerationSystem;
  reportingMechanisms: ReportingMechanism[];
  conflictResolution: CommunityConflictResolution;
  
  // Anonymous Features
  anonymousPosting: AnonymousPosting;
  identityProtection: IdentityProtection[];
  privacyControls: PrivacyControl[];
  safeDisclosure: SafeDisclosure[];
  
  // Discussion Facilitation
  facilitatedDiscussions: FacilitatedDiscussion[];
  topicCuration: TopicCuration[];
  conversationStarters: ConversationStarter[];
  reflectionPrompts: CommunityReflectionPrompt[];
  
  // Growth and Learning
  communityLearning: CommunityLearning[];
  peerEducation: PeerEducation[];
  sharedResources: SharedResource[];
  collectiveWisdom: CollectiveWisdom[];
  
  createdAt: Date;
  memberCount: number;
  activityLevel: 'low' | 'moderate' | 'high' | 'very_high';
  safetyRating: number; // 0-1
}

// Mentorship Matching System
export interface IdentityMentorshipSystem {
  systemId: string;
  
  // Mentor Profiles
  mentorProfiles: MentorProfile[];
  menteeProfiles: MenteeProfile[];
  matchingCriteria: MatchingCriteria[];
  
  // Identity-Based Matching
  sharedIdentityMatching: SharedIdentityMatching;
  experienceBasedMatching: ExperienceBasedMatching;
  goalAlignmentMatching: GoalAlignmentMatching;
  culturalCompatibilityMatching: CulturalCompatibilityMatching;
  
  // Mentorship Programs
  mentorshipPrograms: MentorshipProgram[];
  peerMentorship: PeerMentorship[];
  groupMentorship: GroupMentorship[];
  reverseMentorship: ReverseMentorship[];
  
  // Support and Training
  mentorTraining: MentorTraining[];
  menteePreparation: MenteePreparation[];
  relationshipSupport: RelationshipSupport[];
  culturalCompetencyTraining: CulturalCompetencyTraining[];
  
  // Relationship Management
  mentorshipRelationships: MentorshipRelationship[];
  progressTracking: MentorshipProgress[];
  outcomeAssessment: MentorshipOutcome[];
  relationshipEvolution: RelationshipEvolution[];
  
  createdAt: Date;
  activeRelationships: number;
  successRate: number; // 0-1
  satisfactionScore: number; // 0-1
}

// Progress Visualization and Growth Tracking
export interface CulturalCompetencyGrowthVisualization {
  visualizationId: string;
  userId: string;
  
  // Growth Metrics Dashboard
  competencyDashboard: CompetencyDashboard;
  progressCharts: ProgressChart[];
  growthTrajectories: GrowthTrajectory[];
  milestoneTracking: MilestoneTracking[];
  
  // Skill Development Visualization
  skillRadarChart: SkillRadarChart;
  competencyHeatmap: CompetencyHeatmap;
  developmentTimeline: DevelopmentTimeline;
  strengthsAssessment: StrengthsVisualization;
  
  // Bias Reduction Tracking
  biasReductionChart: BiasReductionChart;
  biasInterruptionFrequency: BiasInterruptionFrequency;
  awarenessTrendLine: AwarenessTrendLine;
  behaviorChangeIndicators: BehaviorChangeIndicator[];
  
  // Identity Evolution Mapping
  identityEvolutionMap: IdentityEvolutionMap;
  explorationProgress: ExplorationProgressChart;
  intersectionalAwareness: IntersectionalAwarenessChart;
  culturalConnectionStrength: CulturalConnectionChart;
  
  // Community Impact Visualization
  communityContribution: CommunityContributionChart;
  mentorshipImpact: MentorshipImpactVisualization;
  discussionEngagement: DiscussionEngagementChart;
  collectiveLearning: CollectiveLearningVisualization;
  
  // Personalized Insights
  personalizedInsights: PersonalizedGrowthInsight[];
  nextStepsRecommendations: NextStepsRecommendation[];
  celebrationMoments: CelebrationMoment[];
  reflectionPrompts: GrowthReflectionPrompt[];
  
  lastUpdated: Date;
  dataRange: DateRange;
  visualizationQuality: number; // 0-1
}

// Supporting Types

export type IdentityDevelopmentStage =
  | 'exploration'
  | 'moratorium' 
  | 'achievement'
  | 'foreclosure'
  | 'diffusion'
  | 'active_exploration'
  | 'integration'
  | 'transcendence';

export type CulturalCompetencyLevel =
  | 'cultural_destructiveness'
  | 'cultural_incapacity'
  | 'cultural_blindness'
  | 'cultural_pre_competence'
  | 'cultural_competence'
  | 'cultural_proficiency';

export type BiasAwarenessLevel =
  | 'unaware'
  | 'developing_awareness'
  | 'conscious_awareness'
  | 'active_interruption'
  | 'bias_advocacy'
  | 'systemic_change';

export type InclusionPracticeLevel =
  | 'beginning'
  | 'developing'
  | 'practicing'
  | 'leading'
  | 'transforming'
  | 'innovating';

// Identity Facets and Values
export interface IdentityFacet {
  facetId: string;
  name: string;
  description: string;
  importance: number; // 0-1
  visibility: 'private' | 'selective' | 'public';
  stability: number; // 0-1 (how stable this facet is)
  contextualVariation: ContextualVariation[];
  developmentHistory: FacetDevelopmentHistory[];
  intersections: FacetIntersection[];
  culturalInfluence: number; // 0-1
  personalChoice: number; // 0-1
}

export interface IdentityValue {
  valueId: string;
  name: string;
  description: string;
  importance: number; // 0-1
  origin: ValueOrigin;
  culturalConnection: CulturalConnection;
  behavioralManifestation: BehavioralManifestation[];
  valueConflicts: ValueConflict[];
  valueEvolution: ValueEvolution[];
  communityAlignment: number; // 0-1
  personalAlignment: number; // 0-1
}

// Bias and Interruption Types
export interface DetectedBias {
  biasType: BiasType;
  confidence: number; // 0-1
  severity: 'low' | 'moderate' | 'high' | 'severe';
  context: BiasContext;
  impact: BiasImpact;
  manifestation: BiasManifes tation[];
  rootCauses: BiasRootCause[];
  interruptionOpportunity: InterruptionOpportunity;
}

export type BiasType =
  | 'confirmation_bias'
  | 'implicit_association'
  | 'availability_heuristic'
  | 'anchoring_bias'
  | 'attribution_bias'
  | 'in_group_bias'
  | 'out_group_bias'
  | 'stereotyping'
  | 'cultural_bias'
  | 'unconscious_bias'
  | 'systemic_bias'
  | 'intersectional_bias';

// Growth and Progress Tracking
export interface CulturalCompetencyTracking {
  trackingId: string;
  userId: string;
  
  // Assessment History
  assessmentHistory: CompetencyAssessment[];
  growthMilestones: GrowthMilestone[];
  skillDevelopment: SkillDevelopment[];
  knowledgeAcquisition: KnowledgeAcquisition[];
  
  // Behavioral Changes
  behaviorTracking: BehaviorTracking[];
  communicationImprovement: CommunicationImprovement[];
  relationshipEnhancement: RelationshipEnhancement[];
  conflictResolution: ConflictResolutionImprovement[];
  
  // Impact Measurement
  communityImpact: CommunityImpact[];
  leadershipDevelopment: LeadershipDevelopment[];
  advocacyActions: AdvocacyAction[];
  systemicChange: SystemicChangeContribution[];
  
  // Future Planning
  developmentGoals: CulturalDevelopmentGoal[];
  learningPlan: CulturalLearningPlan[];
  skillGaps: SkillGap[];
  growthOpportunities: CulturalGrowthOpportunity[];
  
  lastUpdate: Date;
  nextAssessment: Date;
  overallTrajectory: 'improving' | 'stable' | 'declining';
  confidenceLevel: number; // 0-1
}

// Export all types
export type {
  IdentityExplorationProfile,
  PersonalIdentityMap,
  CollectiveIdentityMap,
  CulturalIdentityMap,
  IntersectionalIdentityMap,
  BiasAwarenessSystem,
  BiasCheck,
  EmpathyBuildingSystem,
  AdaptiveCulturalContent,
  IdentityDiscussionCommunity,
  IdentityMentorshipSystem,
  CulturalCompetencyGrowthVisualization,
  CulturalCompetencyTracking
};