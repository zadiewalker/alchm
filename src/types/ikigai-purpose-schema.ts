// ALCHM IKIGAI Integration & Purpose Discovery Engine Schema
// Digital IKIGAI bootcamp, purpose-driven life architecture, and SEL foundation

import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CoachProfile, PersonalizationSignal } from '@/types/ai-personalization-schema';
import { IdentityJourney, CulturalContext } from '@/types/identity-schema';
import { CareerJourney, SMARTGoal } from '@/types/career-schema';

// Core IKIGAI Framework Types
export interface IKIGAIDiscovery {
  discoveryId: string;
  userId: string;
  
  // IKIGAI Core Elements
  whatYouLove: IKIGAIElement; // Passion
  whatYoureGoodAt: IKIGAIElement; // Mission
  whatTheWorldNeeds: IKIGAIElement; // Vocation
  whatYouCanBePaidFor: IKIGAIElement; // Profession
  
  // IKIGAI Intersections
  passion: IKIGAIIntersection; // Love + Good At
  mission: IKIGAIIntersection; // Love + World Needs
  vocation: IKIGAIIntersection; // World Needs + Paid For
  profession: IKIGAIIntersection; // Good At + Paid For
  
  // Central IKIGAI
  coreIKIGAI: CoreIKIGAI;
  purposeClarity: PurposeClarity;
  alignmentScore: number; // 0-1
  
  // Discovery Process
  discoveryJourney: IKIGAIDiscoverySession[];
  currentPhase: IKIGAIPhase;
  progressTracking: IKIGAIProgress;
  
  // AI Analysis
  aiInsights: IKIGAIAIInsight[];
  personalizationSignals: PersonalizationSignal[];
  culturalAdaptations: IKIGAICulturalAdaptation[];
  
  // Life Integration
  lifeArchitecture: PurposeDrivenLifeArchitecture;
  dailyPractices: IKIGAIDailyPractice[];
  pathwayRecommendations: IKIGAIPathwayRecommendation[];
  
  // SEL Integration
  selFoundation: SELFoundationIntegration;
  emotionalIntelligenceGrowth: EIGrowthTracking;
  
  createdAt: Date;
  lastUpdated: Date;
  completionStatus: IKIGAICompletionStatus;
}

export interface IKIGAIElement {
  elementId: string;
  type: 'love' | 'good_at' | 'world_needs' | 'paid_for';
  
  // Discovered Items
  items: IKIGAIItem[];
  topItems: IKIGAIItem[]; // Top 5-7 most significant
  emergingItems: IKIGAIItem[]; // Recently discovered
  
  // Analysis
  themes: IKIGAITheme[];
  patterns: IKIGAIPattern[];
  evolution: IKIGAIEvolution[];
  
  // Cultural Context
  culturalInfluences: CulturalInfluence[];
  culturalExpression: CulturalExpression[];
  
  // AI Enhancement
  aiSuggestions: IKIGAIAISuggestion[];
  explorationPrompts: ExplorationPrompt[];
  deepeningQuestions: DeepenigQuestion[];
  
  confidence: number; // 0-1
  completeness: number; // 0-1
  lastExplored: Date;
}

export interface IKIGAIItem {
  itemId: string;
  title: string;
  description: string;
  category: string;
  
  // Significance
  personalSignificance: number; // 0-1
  emotionalResonance: number; // 0-1
  energyLevel: number; // 0-1 (how energizing it is)
  fulfillmentLevel: number; // 0-1
  
  // Discovery Context
  discoveredThrough: DiscoveryMethod;
  discoverySession: string;
  insights: string[];
  
  // Connections
  relatedItems: string[]; // Other IKIGAIItem IDs
  crossElementConnections: CrossElementConnection[];
  
  // Cultural Resonance
  culturalAlignment: CulturalAlignment;
  ancestralConnection: AncestralConnection;
  communityRelevance: CommunityRelevance;
  
  // Development
  currentLevel: 'emerging' | 'developing' | 'established' | 'mastery';
  developmentPath: DevelopmentPath[];
  barriers: Barrier[];
  enablers: Enabler[];
  
  createdAt: Date;
  lastReflected: Date;
  isActive: boolean;
}

export interface IKIGAIIntersection {
  intersectionId: string;
  type: 'passion' | 'mission' | 'vocation' | 'profession';
  element1: 'love' | 'good_at' | 'world_needs' | 'paid_for';
  element2: 'love' | 'good_at' | 'world_needs' | 'paid_for';
  
  // Intersection Analysis
  convergenceItems: ConvergenceItem[];
  synergies: IKIGAISynergy[];
  tensions: IKIGAITension[];
  opportunities: IKIGAIOpportunity[];
  
  // Strength Assessment
  strengthLevel: number; // 0-1
  clarity: number; // 0-1
  actionability: number; // 0-1
  sustainability: number; // 0-1
  
  // Development
  currentFocus: IntersectionFocus[];
  developmentPriorities: DevelopmentPriority[];
  experimentation: IntersectionExperiment[];
  
  // AI Guidance
  aiRecommendations: IKIGAIAIRecommendation[];
  explorationSuggestions: ExplorationSuggestion[];
  integrationStrategies: IntegrationStrategy[];
  
  lastAnalyzed: Date;
  nextReviewDate: Date;
}

export interface CoreIKIGAI {
  coreId: string;
  
  // Core Purpose Statement
  purposeStatement: string;
  purposeEvolution: PurposeEvolution[];
  clarityLevel: number; // 0-1
  
  // Integration Assessment
  elementIntegration: ElementIntegration;
  balanceAssessment: BalanceAssessment;
  harmonizationLevel: number; // 0-1
  
  // Life Manifestation
  currentManifestation: LifeManifestation[];
  idealManifestation: LifeManifestation[];
  manifestationGap: ManifestationGap[];
  
  // Purpose Alignment
  dailyAlignment: DailyAlignment;
  lifeChoiceAlignment: LifeChoiceAlignment[];
  purposeAlignmentScore: number; // 0-1
  
  // Cultural Integration
  culturalPurposeExpression: CulturalPurposeExpression;
  communityContribution: CommunityContribution;
  legacyVision: LegacyVision;
  
  // Dynamic Evolution
  purposeJourney: PurposeJourneyPoint[];
  adaptations: PurposeAdaptation[];
  deepeningOpportunities: DeepeningOpportunity[];
  
  lastRefined: Date;
  nextDeepening: Date;
  versionHistory: CoreIKIGAIVersion[];
}

// Digital IKIGAI Bootcamp Structure
export interface IKIGAIBootcampExperience {
  bootcampId: string;
  userId: string;
  
  // Bootcamp Configuration
  format: 'intensive_6hour' | 'progressive_sessions' | 'self_paced' | 'guided_cohort';
  totalDuration: number; // minutes
  sessionStructure: BootcampSession[];
  
  // AI Facilitator
  aiFacilitator: IKIGAIAIFacilitator;
  facilitationStyle: FacilitationStyle;
  adaptiveAdjustments: FacilitationAdjustment[];
  
  // Progressive Discovery
  discoveryPhases: IKIGAIDiscoveryPhase[];
  currentPhase: string;
  phaseProgress: PhaseProgress[];
  
  // Interactive Elements
  reflectionExercises: ReflectionExercise[];
  guidedMeditations: GuidedMeditation[];
  partnerExercises: PartnerExercise[];
  groupActivities: GroupActivity[];
  
  // Personalization
  personalizedPrompts: PersonalizedPrompt[];
  culturalAdaptations: CulturalBootcampAdaptation[];
  accessibilityFeatures: AccessibilityFeature[];
  
  // Progress Tracking
  completionTracking: BootcampCompletionTracking;
  engagementMetrics: BootcampEngagementMetrics;
  breakthroughMoments: BreakthroughMoment[];
  
  // Output Generation
  personalizedIKIGAIMap: PersonalizedIKIGAIMap;
  actionPlan: IKIGAIActionPlan;
  followUpPlan: IKIGAIFollowUpPlan;
  
  startDate: Date;
  completionDate?: Date;
  isActive: boolean;
}

export interface IKIGAIDiscoverySession {
  sessionId: string;
  bootcampId: string;
  
  // Session Design
  sessionType: IKIGAISessionType;
  focus: IKIGAIElement['type'][];
  duration: number; // minutes
  sequence: number;
  
  // AI Facilitation
  facilitatorProfile: CoachProfile;
  sessionPrompts: SessionPrompt[];
  guidedQuestions: GuidedQuestion[];
  reflectionActivities: ReflectionActivity[];
  
  // Interactive Content
  exercises: IKIGAIExercise[];
  meditations: SessionMeditation[];
  visualizations: SessionVisualization[];
  journaling: SessionJournaling[];
  
  // Real-time Adaptation
  userResponses: SessionUserResponse[];
  aiAdjustments: SessionAIAdjustment[];
  paceAdaptations: PaceAdaptation[];
  depthAdjustments: DepthAdjustment[];
  
  // Discovery Outcomes
  discoveries: SessionDiscovery[];
  insights: SessionInsight[];
  breakthroughs: SessionBreakthrough[];
  integrations: SessionIntegration[];
  
  // Cultural Integration
  culturalElements: SessionCulturalElement[];
  culturalWisdom: CulturalWisdom[];
  ancestralConnections: AncestralConnection[];
  
  // Session Completion
  completionStatus: SessionCompletionStatus;
  userFeedback: SessionUserFeedback;
  effectivenessRating: number; // 0-1
  nextSessionRecommendations: NextSessionRecommendation[];
  
  startTime: Date;
  endTime?: Date;
  pausePoints: PausePoint[];
}

// Purpose-Driven Life Architecture
export interface PurposeDrivenLifeArchitecture {
  architectureId: string;
  userId: string;
  
  // Foundation
  coreIKIGAI: CoreIKIGAI;
  purposeAlignment: PurposeAlignment;
  lifeVision: LifeVision;
  
  // Life Domains
  lifeDomains: LifeDomain[];
  domainAlignment: DomainAlignment[];
  crossDomainSynergies: CrossDomainSynergy[];
  
  // Pathway Generation
  purposePathways: PurposePathway[];
  currentPathways: string[]; // Active pathway IDs
  completedPathways: string[];
  futurePathways: FuturePathway[];
  
  // Decision Architecture
  decisionFramework: PurposeDecisionFramework;
  decisionHistory: PurposeDecision[];
  decisionPatterns: DecisionPattern[];
  
  // Progress Tracking
  alignmentTracking: AlignmentTracking;
  purposeMetrics: PurposeMetrics;
  fulfillmentMeasurement: FulfillmentMeasurement;
  
  // AI Coaching Integration
  purposeCoaching: PurposeCoaching;
  dailyGuidance: DailyPurposeGuidance[];
  weeklyReflections: WeeklyPurposeReflection[];
  monthlyAlignment: MonthlyAlignmentReview[];
  
  // Cultural Integration
  culturalPurposeFramework: CulturalPurposeFramework;
  communityPurpose: CommunityPurpose;
  legacyBuilding: LegacyBuilding;
  
  // Evolution and Adaptation
  architectureEvolution: ArchitectureEvolution[];
  adaptationTriggers: AdaptationTrigger[];
  refinementOpportunities: RefinementOpportunity[];
  
  createdAt: Date;
  lastArchitectureReview: Date;
  nextArchitectureReview: Date;
  version: string;
}

export interface PurposeAlignmentScore {
  scoreId: string;
  userId: string;
  
  // Overall Alignment
  overallScore: number; // 0-1
  trendDirection: 'improving' | 'stable' | 'declining';
  confidenceLevel: number; // 0-1
  
  // Domain Scores
  domainScores: DomainAlignmentScore[];
  
  // Component Scores
  elementAlignmentScores: ElementAlignmentScore[];
  intersectionAlignmentScores: IntersectionAlignmentScore[];
  
  // Behavioral Alignment
  dailyChoiceAlignment: number; // 0-1
  decisionAlignment: number; // 0-1
  actionAlignment: number; // 0-1
  timeAllocationAlignment: number; // 0-1
  
  // Progress Indicators
  alignmentTrajectory: AlignmentTrajectory;
  improvementAreas: AlignmentImprovementArea[];
  strengthAreas: AlignmentStrengthArea[];
  
  // AI Analysis
  aiInsights: AlignmentAIInsight[];
  recommendations: AlignmentRecommendation[];
  interventionSuggestions: AlignmentInterventionSuggestion[];
  
  calculatedAt: Date;
  dataRange: DateRange;
  nextCalculation: Date;
}

// SEL Foundation Integration
export interface SELFoundationIntegration {
  integrationId: string;
  userId: string;
  
  // Core SEL Competencies
  selfAwareness: SELSelfAwareness;
  selfManagement: SELSelfManagement;
  responsibleDecisionMaking: SELResponsibleDecisionMaking;
  socialAwareness: SELSocialAwareness;
  relationshipSkills: SELRelationshipSkills;
  
  // IKIGAI-SEL Integration
  purposeSelfAwareness: PurposeSelfAwareness;
  purposeBasedDecisionMaking: PurposeBasedDecisionMaking;
  purposeDrivenRelationships: PurposeDrivenRelationships;
  
  // Workshop Integration
  workshopReflectionPrompts: WorkshopReflectionPrompt[];
  ongoingJournalingIntegration: JournalingIntegration[];
  reflectionEvolution: ReflectionEvolution[];
  
  // Progress Tracking
  selGrowthTracking: SELGrowthTracking;
  emotionalIntelligenceMetrics: EIMetrics;
  behavioralChangeTracking: BehavioralChangeTracking;
  
  // Cultural Adaptation
  culturalSELExpression: CulturalSELExpression;
  collectivistSELApproaches: CollectivistSELApproach[];
  culturalEmotionalNorms: CulturalEmotionalNorm[];
  
  // AI Enhancement
  selAICoaching: SELAICoaching;
  emotionalStateRecognition: EmotionalStateRecognition;
  selSkillDevelopment: SELSkillDevelopment[];
  
  lastAssessment: Date;
  nextAssessment: Date;
  developmentPlan: SELDevelopmentPlan;
}

export interface SELSelfAwareness {
  // Emotional Self-Awareness
  emotionalVocabulary: EmotionalVocabulary;
  emotionalTriggerAwareness: EmotionalTriggerAwareness;
  emotionalPatternRecognition: EmotionalPatternRecognition;
  
  // Accurate Self-Perception
  strengthsAwareness: StrengthsAwareness;
  growthAreasAwareness: GrowthAreasAwareness;
  biasRecognition: BiasRecognition;
  
  // Self-Confidence
  selfEfficacyBeliefs: SelfEfficacyBelief[];
  confidenceTracking: ConfidenceTracking;
  capabilityAwareness: CapabilityAwareness;
  
  // Purpose-Aligned Self-Awareness
  purposeClarity: PurposeClarity;
  valueAlignment: ValueAlignment[];
  meaningfulnessAssessment: MeaningfulnessAssessment;
  
  currentLevel: SELCompetencyLevel;
  developmentGoals: SELDevelopmentGoal[];
  practiceActivities: SELPracticeActivity[];
}

export interface SELSelfManagement {
  // Emotional Self-Control
  emotionalRegulation: EmotionalRegulation;
  impulseControl: ImpulseControl;
  stressManagement: StressManagement;
  
  // Adaptability
  flexibilitySkills: FlexibilitySkill[];
  changeAdaptation: ChangeAdaptation;
  resilienceBuilding: ResilienceBuilding;
  
  // Achievement Orientation
  goalSettingSkills: GoalSettingSkill[];
  selfMotivation: SelfMotivation;
  persistenceTracking: PersistenceTracking;
  
  // Optimism
  positiveThinking: PositiveThinking;
  hopefulness: Hopefulness;
  futureOrientation: FutureOrientation;
  
  // Purpose-Driven Self-Management
  purposeBasedGoalSetting: PurposeBasedGoalSetting;
  purposeBasedDecisionMaking: PurposeBasedDecisionMaking;
  purposeBasedTimeManagement: PurposeBasedTimeManagement;
  
  currentLevel: SELCompetencyLevel;
  developmentGoals: SELDevelopmentGoal[];
  practiceActivities: SELPracticeActivity[];
}

export interface SELResponsibleDecisionMaking {
  // Identifying Problems
  problemIdentification: ProblemIdentification;
  situationAnalysis: SituationAnalysis;
  contextualAwareness: ContextualAwareness;
  
  // Analyzing Situations
  optionGeneration: OptionGeneration;
  consequenceAnalysis: ConsequenceAnalysis;
  stakeholderConsideration: StakeholderConsideration;
  
  // Solving Problems
  solutionImplementation: SolutionImplementation;
  decisionEvaluation: DecisionEvaluation;
  learningFromOutcomes: LearningFromOutcomes;
  
  // Ethical Responsibility
  ethicalConsideration: EthicalConsideration;
  valueBasedDecisionMaking: ValueBasedDecisionMaking;
  culturalSensitivity: CulturalSensitivity;
  
  // Purpose-Aligned Decision Making
  purposeDecisionAlignment: PurposeDecisionAlignment;
  ikigaiDecisionFilter: IKIGAIDecisionFilter;
  purposeBasedEvaluation: PurposeBasedEvaluation;
  
  currentLevel: SELCompetencyLevel;
  developmentGoals: SELDevelopmentGoal[];
  practiceActivities: SELPracticeActivity[];
}

// Supporting Types

export type IKIGAIPhase = 
  | 'preparation'
  | 'love_exploration'
  | 'good_at_discovery'
  | 'world_needs_analysis'
  | 'paid_for_assessment'
  | 'intersection_analysis'
  | 'core_ikigai_synthesis'
  | 'life_integration'
  | 'action_planning';

export type IKIGAISessionType =
  | 'introduction'
  | 'element_exploration'
  | 'intersection_discovery'
  | 'synthesis'
  | 'integration'
  | 'action_planning'
  | 'reflection'
  | 'community_sharing';

export type SELCompetencyLevel =
  | 'developing'
  | 'approaching'
  | 'meeting'
  | 'exceeding';

export type IKIGAICompletionStatus =
  | 'not_started'
  | 'in_progress'
  | 'core_complete'
  | 'integration_phase'
  | 'living_ikigai';

// Purpose Alignment Tracking
export interface PurposeAlignment {
  alignmentId: string;
  userId: string;
  
  // Current Alignment State
  overallAlignment: number; // 0-1
  elementSpecificAlignment: ElementSpecificAlignment[];
  lifechoiceAlignment: LifeChoiceAlignment[];
  
  // Alignment Factors
  alignmentFactors: AlignmentFactor[];
  misalignmentFactors: MisalignmentFactor[];
  alignmentBarriers: AlignmentBarrier[];
  alignmentEnablers: AlignmentEnabler[];
  
  // Tracking History
  alignmentHistory: AlignmentHistoryPoint[];
  alignmentTrends: AlignmentTrend[];
  significantChanges: SignificantAlignmentChange[];
  
  // AI Analysis
  alignmentInsights: AlignmentInsight[];
  improvementRecommendations: AlignmentImprovementRecommendation[];
  alignmentCoaching: AlignmentCoaching[];
  
  lastUpdated: Date;
  nextReview: Date;
}

// Export all types
export type {
  IKIGAIDiscovery,
  IKIGAIElement,
  IKIGAIItem,
  IKIGAIIntersection,
  CoreIKIGAI,
  IKIGAIBootcampExperience,
  PurposeDrivenLifeArchitecture,
  PurposeAlignmentScore,
  SELFoundationIntegration,
  PurposeAlignment
};