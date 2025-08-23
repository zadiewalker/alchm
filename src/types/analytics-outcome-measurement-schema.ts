// ALCHM Data Analytics & Outcome Measurement Schema
// Comprehensive analytics framework for measuring impact and guiding improvements

import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal, LearningPathway } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';
import { GamificationProfile } from '@/types/gamification-engagement-schema';

// Core Analytics Framework
export interface AnalyticsProfile {
  profileId: string;
  userId: string;
  
  // User Growth Analytics
  growthAnalytics: UserGrowthAnalytics;
  pathwayProgression: PathwayProgressionAnalytics;
  engagementPatterns: EngagementPatternAnalytics;
  predictiveModels: PredictiveModelResults;
  
  // Impact Measurement
  impactMeasurement: ImpactMeasurementSuite;
  outcomeTracking: OutcomeTrackingSystem;
  assessmentResults: AssessmentResultCollection;
  correlationAnalysis: CorrelationAnalysisResults;
  
  // Continuous Improvement
  optimizationMetrics: OptimizationMetrics;
  abTestParticipation: ABTestParticipation[];
  feedbackLoops: FeedbackLoopData;
  mlOptimization: MachineLearningOptimization;
  
  // Privacy & Consent
  privacySettings: AnalyticsPrivacySettings;
  consentLevel: ConsentLevel;
  dataRetentionPolicy: DataRetentionPolicy;
  anonymizationLevel: AnonymizationLevel;
  
  // Research & Academic
  researchParticipation: ResearchParticipation;
  academicDataSharing: AcademicDataSharing;
  longitudinalStudyData: LongitudinalStudyData;
  
  createdAt: Date;
  lastUpdated: Date;
  analyticsVersion: string;
}

// User Growth Analytics
export interface UserGrowthAnalytics {
  analyticsId: string;
  userId: string;
  
  // Progression Tracking
  pathwayStageProgression: PathwayStageProgression[];
  milestoneAnalysis: MilestoneAnalysisData;
  skillDevelopmentTracking: SkillDevelopmentTracking;
  goalAchievementPatterns: GoalAchievementPatterns;
  
  // Timeline Analysis
  growthTimeline: GrowthTimelineAnalytics;
  progressionVelocity: ProgressionVelocity;
  plateauDetection: PlateauDetection[];
  breakthroughIdentification: BreakthroughIdentification[];
  
  // Behavioral Patterns
  engagementFrequency: EngagementFrequency;
  sessionDuration: SessionDurationAnalytics;
  contentInteraction: ContentInteractionAnalytics;
  featureUtilization: FeatureUtilizationAnalytics;
  
  // Predictive Insights
  completionProbability: CompletionProbability;
  riskFactors: RiskFactor[];
  successIndicators: SuccessIndicator[];
  recommendedInterventions: RecommendedIntervention[];
  
  // Cohort Analysis
  cohortClassification: CohortClassification;
  peerComparison: PeerComparisonMetrics;
  benchmarkPerformance: BenchmarkPerformance;
  
  lastAnalyzed: Date;
  confidenceLevel: number; // 0-1
}

export interface PathwayProgressionAnalytics {
  progressionId: string;
  userId: string;
  pathwayType: 'identity' | 'emotional' | 'career' | 'integrated';
  
  // Stage-by-Stage Analysis
  stageProgressions: StageProgressionData[];
  stageCompletionTimes: StageCompletionTime[];
  stageEngagementLevels: StageEngagementLevel[];
  stageDifficultyRatings: StageDifficultyRating[];
  
  // Sequence Optimization
  optimalSequenceAnalysis: OptimalSequenceAnalysis;
  pathwayCustomization: PathwayCustomizationData;
  adaptivePathwayRecommendations: AdaptivePathwayRecommendation[];
  
  // Completion Prediction
  completionPredictiveModel: CompletionPredictiveModel;
  successFactorAnalysis: SuccessFactorAnalysis;
  dropoffRiskAssessment: DropoffRiskAssessment;
  
  // Cultural Adaptation Analysis
  culturalEffectivenessMetrics: CulturalEffectivenessMetrics;
  culturalProgressionPatterns: CulturalProgressionPattern[];
  culturalAdaptationSuccess: CulturalAdaptationSuccess;
  
  // Longitudinal Tracking
  longitudinalProgressData: LongitudinalProgressData;
  retentionAnalysis: RetentionAnalysis;
  reengagementPatterns: ReengagementPattern[];
  
  lastUpdated: Date;
  dataQualityScore: number; // 0-1
}

export interface EngagementPatternAnalytics {
  engagementId: string;
  userId: string;
  
  // Temporal Patterns
  dailyEngagementPatterns: DailyEngagementPattern[];
  weeklyEngagementRhythms: WeeklyEngagementRhythm[];
  seasonalEngagementTrends: SeasonalEngagementTrend[];
  optimalEngagementTimes: OptimalEngagementTime[];
  
  // Interaction Patterns
  contentEngagementDepth: ContentEngagementDepth;
  featureAdoptionSequence: FeatureAdoptionSequence[];
  navigationPatterns: NavigationPattern[];
  interactionQuality: InteractionQuality;
  
  // Motivation & Persistence
  motivationFluctuations: MotivationFluctuation[];
  persistenceFactors: PersistenceFactor[];
  dropoffPoints: DropoffPoint[];
  reengagementTriggers: ReengagementTrigger[];
  
  // Social Engagement
  communityParticipationLevel: CommunityParticipationLevel;
  peerInteractionPatterns: PeerInteractionPattern[];
  mentorshipEngagement: MentorshipEngagement;
  collaborativeActivityLevel: CollaborativeActivityLevel;
  
  // Content Preferences
  contentTypePreferences: ContentTypePreference[];
  difficultyLevelPreferences: DifficultyLevelPreference[];
  culturalContentAlignment: CulturalContentAlignment;
  personalizedContentEffectiveness: PersonalizedContentEffectiveness;
  
  // Engagement Quality
  meaningfulEngagementScore: number; // 0-1
  surfaceLevelEngagementWarnings: SurfaceLevelEngagementWarning[];
  deepEngagementIndicators: DeepEngagementIndicator[];
  
  lastAnalyzed: Date;
  trendDirection: 'increasing' | 'stable' | 'declining' | 'fluctuating';
}

// Impact Measurement
export interface ImpactMeasurementSuite {
  measurementId: string;
  userId: string;
  
  // Validated Assessment Tools
  personalDevelopmentAssessments: PersonalDevelopmentAssessment[];
  wellBeingMeasures: WellBeingMeasure[];
  lifeSkillsAssessments: LifeSkillsAssessment[];
  culturalCompetencyMeasures: CulturalCompetencyMeasure[];
  
  // Pre/Post Comparisons
  baselineMeasurements: BaselineMeasurement[];
  progressMeasurements: ProgressMeasurement[];
  outcomeMeasurements: OutcomeMeasurement[];
  changeCalculations: ChangeCalculation[];
  
  // Multi-Dimensional Impact
  personalImpactMetrics: PersonalImpactMetrics;
  professionalImpactMetrics: ProfessionalImpactMetrics;
  socialImpactMetrics: SocialImpactMetrics;
  culturalImpactMetrics: CulturalImpactMetrics;
  
  // Longitudinal Impact Studies
  longitudinalImpactData: LongitudinalImpactData;
  impactDurabilityAnalysis: ImpactDurabilityAnalysis;
  sustainedChangeIndicators: SustainedChangeIndicator[];
  
  // Quality of Life Metrics
  qualityOfLifeAssessment: QualityOfLifeAssessment;
  lifeStatisfactionMeasures: LifeSatisfactionMeasure[];
  meaningfulnessMeasures: MeaningfulnessMeasure[];
  purposeMeasures: PurposeMeasure[];
  
  // Research Grade Data
  researchGradeDatasets: ResearchGradeDataset[];
  validatedInstruments: ValidatedInstrument[];
  statisticalSignificance: StatisticalSignificance[];
  effectSizeCalculations: EffectSizeCalculation[];
  
  lastAssessed: Date;
  measurementReliability: number; // 0-1
  measurementValidity: number; // 0-1
}

export interface OutcomeTrackingSystem {
  trackingId: string;
  userId: string;
  
  // Real-World Outcomes
  careerOutcomes: CareerOutcome[];
  relationshipOutcomes: RelationshipOutcome[];
  healthOutcomes: HealthOutcome[];
  educationOutcomes: EducationOutcome[];
  financialOutcomes: FinancialOutcome[];
  
  // Personal Development Outcomes
  selfAwarenessGrowth: SelfAwarenessGrowth;
  emotionalIntelligenceGrowth: EmotionalIntelligenceGrowth;
  resilenceBuilding: ResilienceBuilding;
  confidenceGrowth: ConfidenceGrowth;
  purposeClarification: PurposeClarification;
  
  // Behavioral Change Outcomes
  habitFormation: HabitFormation[];
  skillAcquisition: SkillAcquisition[];
  mindsetShifts: MindsetShift[];
  behavioralPatternChanges: BehavioralPatternChange[];
  
  // Social & Cultural Outcomes
  communityContribution: CommunityContribution;
  culturalBridging: CulturalBridging;
  leadershipDevelopment: LeadershipDevelopment;
  mentorshipCapacity: MentorshipCapacity;
  
  // Long-term Tracking
  sixMonthOutcomes: SixMonthOutcome[];
  oneYearOutcomes: OneYearOutcome[];
  multiYearOutcomes: MultiYearOutcome[];
  lifeTransformationIndicators: LifeTransformationIndicator[];
  
  // Outcome Attribution
  pathwayAttributionAnalysis: PathwayAttributionAnalysis[];
  featureAttributionAnalysis: FeatureAttributionAnalysis[];
  interventionEffectivenessAnalysis: InterventionEffectivenessAnalysis[];
  
  // External Validation
  externalValidationSources: ExternalValidationSource[];
  thirdPartyVerification: ThirdPartyVerification[];
  objectiveMetrics: ObjectiveMetric[];
  
  lastTracked: Date;
  outcomeReliability: number; // 0-1
}

// Continuous Improvement
export interface OptimizationMetrics {
  optimizationId: string;
  
  // A/B Testing Results
  activeABTests: ActiveABTest[];
  completedABTests: CompletedABTest[];
  abTestResults: ABTestResult[];
  statisticalSignificance: ABTestStatisticalSignificance[];
  
  // Pathway Optimization
  pathwayEffectivenessMetrics: PathwayEffectivenessMetric[];
  contentOptimizationResults: ContentOptimizationResult[];
  sequenceOptimizationResults: SequenceOptimizationResult[];
  personalizedPathwayResults: PersonalizedPathwayResult[];
  
  // User Experience Optimization
  userJourneyOptimization: UserJourneyOptimization;
  frictionPointIdentification: FrictionPointIdentification[];
  conversionOptimization: ConversionOptimization[];
  retentionOptimization: RetentionOptimization[];
  
  // Feature Optimization
  featureUsageOptimization: FeatureUsageOptimization[];
  interfaceOptimization: InterfaceOptimization[];
  contentDeliveryOptimization: ContentDeliveryOptimization[];
  gamificationOptimization: GamificationOptimization[];
  
  // Machine Learning Insights
  mlRecommendations: MLRecommendation[];
  predictiveOptimizations: PredictiveOptimization[];
  automatedImprovements: AutomatedImprovement[];
  
  lastOptimized: Date;
  optimizationConfidence: number; // 0-1
}

export interface MachineLearningOptimization {
  mlOptimizationId: string;
  
  // Recommendation Systems
  pathwayRecommendationEngine: PathwayRecommendationEngine;
  contentRecommendationEngine: ContentRecommendationEngine;
  interventionRecommendationEngine: InterventionRecommendationEngine;
  personalizedExperienceEngine: PersonalizedExperienceEngine;
  
  // Predictive Models
  completionPredictionModel: CompletionPredictionModel;
  dropoffPredictionModel: DropoffPredictionModel;
  successPredictionModel: SuccessPredictionModel;
  engagementPredictionModel: EngagementPredictionModel;
  
  // Optimization Algorithms
  pathwaySequenceOptimization: PathwaySequenceOptimization;
  contentOptimizationAlgorithm: ContentOptimizationAlgorithm;
  timingOptimizationAlgorithm: TimingOptimizationAlgorithm;
  difficultyOptimizationAlgorithm: DifficultyOptimizationAlgorithm;
  
  // Natural Language Processing
  sentimentAnalysisResults: SentimentAnalysisResult[];
  contentAnalysisResults: ContentAnalysisResult[];
  feedbackAnalysisResults: FeedbackAnalysisResult[];
  conversationAnalysisResults: ConversationAnalysisResult[];
  
  // Cultural AI Models
  culturalAdaptationModels: CulturalAdaptationModel[];
  crossCulturalEffectivenessModels: CrossCulturalEffectivenessModel[];
  culturalSensitivityModels: CulturalSensitivityModel[];
  
  // Model Performance
  modelAccuracyMetrics: ModelAccuracyMetric[];
  modelValidationResults: ModelValidationResult[];
  modelBiasAssessment: ModelBiasAssessment[];
  modelExplainability: ModelExplainability[];
  
  lastTrainedAt: Date;
  modelVersion: string;
  performanceScore: number; // 0-1
}

// Research & Academic Integration
export interface ResearchParticipation {
  participationId: string;
  userId: string;
  
  // Study Participation
  activeStudies: ActiveStudy[];
  completedStudies: CompletedStudy[];
  eligibleStudies: EligibleStudy[];
  studyPreferences: StudyPreference[];
  
  // Longitudinal Studies
  longitudinalStudyParticipation: LongitudinalStudyParticipation[];
  cohortStudyParticipation: CohortStudyParticipation[];
  crossSectionalStudyParticipation: CrossSectionalStudyParticipation[];
  
  // Data Contribution
  anonymizedDataContribution: AnonymizedDataContribution[];
  aggregatedDataContribution: AggregatedDataContribution[];
  researchDatasetContribution: ResearchDatasetContribution[];
  
  // Academic Partnerships
  universityPartnerships: UniversityPartnership[];
  researchInstitutionPartnerships: ResearchInstitutionPartnership[];
  academicCollaborations: AcademicCollaboration[];
  
  // Publication Contributions
  publicationContributions: PublicationContribution[];
  researchCitations: ResearchCitation[];
  academicRecognition: AcademicRecognition[];
  
  // Ethics & Consent
  informedConsentDocuments: InformedConsentDocument[];
  ethicsApprovals: EthicsApproval[];
  dataUsageConsents: DataUsageConsent[];
  
  participationStartDate: Date;
  lastParticipationDate: Date;
  participationStatus: 'active' | 'paused' | 'completed' | 'withdrawn';
}

// Privacy & Ethics
export interface AnalyticsPrivacySettings {
  privacyId: string;
  userId: string;
  
  // Data Collection Consent
  basicAnalyticsConsent: boolean;
  advancedAnalyticsConsent: boolean;
  researchParticipationConsent: boolean;
  longitudinalStudyConsent: boolean;
  
  // Data Sharing Preferences
  anonymizedDataSharing: boolean;
  aggregatedDataSharing: boolean;
  academicDataSharing: boolean;
  commercialDataSharing: boolean;
  
  // Retention Preferences
  dataRetentionPeriod: number; // months
  automaticDeletion: boolean;
  rightToBeForgotten: boolean;
  dataPortability: boolean;
  
  // Anonymization Levels
  basicAnonymization: boolean;
  advancedAnonymization: boolean;
  differentialPrivacy: boolean;
  homomorphicEncryption: boolean;
  
  // Granular Controls
  granularDataControls: GranularDataControl[];
  purposeLimitationControls: PurposeLimitationControl[];
  dataMinimizationPreferences: DataMinimizationPreference[];
  
  lastUpdated: Date;
  consentVersion: string;
  privacyPolicyVersion: string;
}

// Assessment & Measurement Tools
export interface ValidatedAssessmentTool {
  toolId: string;
  toolName: string;
  toolType: 'pre_validated' | 'alchm_developed' | 'adapted_validated' | 'research_grade';
  
  // Validation Metrics
  reliability: ReliabilityMetrics;
  validity: ValidityMetrics;
  culturalAdaptation: CulturalAdaptationMetrics;
  normativeData: NormativeData[];
  
  // Assessment Structure
  assessmentDomains: AssessmentDomain[];
  assessmentItems: AssessmentItem[];
  scoringMethods: ScoringMethod[];
  interpretationGuidelines: InterpretationGuideline[];
  
  // Administration
  administrationProtocol: AdministrationProtocol;
  timeRequirements: TimeRequirement;
  prerequisiteAssessments: PrerequisiteAssessment[];
  followUpAssessments: FollowUpAssessment[];
  
  // Research Integration
  researchApplications: ResearchApplication[];
  academicValidation: AcademicValidation[];
  peerReviewStatus: PeerReviewStatus;
  publicationStatus: PublicationStatus[];
  
  // Accessibility & Inclusion
  accessibilityFeatures: AccessibilityFeature[];
  culturalInclusivity: CulturalInclusivity[];
  languageAdaptations: LanguageAdaptation[];
  disabilityAccommodations: DisabilityAccommodation[];
  
  developedAt: Date;
  lastValidated: Date;
  validationStatus: 'developing' | 'pilot_tested' | 'validated' | 'research_grade' | 'deprecated';
}

// Supporting Types
export type ConsentLevel = 'minimal' | 'standard' | 'comprehensive' | 'research_grade';
export type AnonymizationLevel = 'basic' | 'advanced' | 'differential_privacy' | 'homomorphic';
export type DataRetentionPolicy = 'standard' | 'extended' | 'research_extended' | 'custom';

export interface TimeframeCoverage {
  startDate: Date;
  endDate: Date;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  dataPoints: number;
}

export interface StatisticalMetrics {
  sampleSize: number;
  confidenceInterval: number;
  significanceLevel: number;
  effectSize: number;
  powerAnalysis: number;
}

export interface CulturalAdaptationMetrics {
  culturalRelevance: number; // 0-1
  culturalSensitivity: number; // 0-1
  crossCulturalValidity: number; // 0-1
  culturalBiasAssessment: number; // 0-1
}

// Export all types
export type {
  AnalyticsProfile,
  UserGrowthAnalytics,
  PathwayProgressionAnalytics,
  EngagementPatternAnalytics,
  ImpactMeasurementSuite,
  OutcomeTrackingSystem,
  OptimizationMetrics,
  MachineLearningOptimization,
  ResearchParticipation,
  AnalyticsPrivacySettings,
  ValidatedAssessmentTool
};