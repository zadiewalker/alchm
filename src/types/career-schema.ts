// ALCHM Career & Future Readiness Schema
// Comprehensive types for career exploration, goal mapping, and future vision planning

import { IdentityJourney, CulturalContext } from '@/types/identity-schema';

// Core career journey structure
export interface CareerJourney {
  userId: string;
  journeyId: string;
  interests: CareerInterest[];
  strengths: CareerStrength[];
  values: CareerValue[];
  workStyle: WorkStylePreference;
  careerPersonality: CareerPersonalityProfile;
  matchedRoles: CareerRoleMatch[];
  careerVisionBoard: CareerVisionBoard;
  smartGoals: SMARTGoal[];
  learningPaths: CareerLearningPath[];
  projectPortfolio: ProjectPortfolio;
  mentorGuidance: MentorPersonaGuidance[];
  realWorldConnections: RealWorldOpportunity[];
  progressTracking: CareerProgressTracker;
  culturalContext: CulturalContext;
  identityAlignment: IdentityCareerAlignment;
  futureScenarios: FutureScenario[];
  skillGaps: SkillGap[];
  networkBuilding: NetworkBuildingPlan;
  experiencePoints: ExperiencePoint[];
  achievements: CareerAchievement[];
  reflections: CareerReflection[];
  adaptabilityMetrics: AdaptabilityMetrics;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  isActive: boolean;
}

// Career interests with depth analysis
export interface CareerInterest {
  id: string;
  category: 'artistic' | 'scientific' | 'social' | 'enterprising' | 'conventional' | 'realistic';
  subcategory: string;
  interestName: string;
  intensityLevel: number; // 1-10
  discoverySource: 'journaling' | 'assessment' | 'experience' | 'exploration' | 'reflection';
  evidencePoints: string[];
  culturalRelevance: number; // 0-1
  identityConnection: string[];
  futureGrowthPotential: number; // 0-1
  skillRequirements: string[];
  valueAlignment: number; // 0-1
  marketDemand: MarketDemandInfo;
  learningResources: LearningResource[];
  experienceOpportunities: ExperienceOpportunity[];
  mentorSuggestions: MentorSuggestion[];
  relatedCareers: string[];
  developmentActivities: DevelopmentActivity[];
  firstIdentified: Date;
  lastUpdated: Date;
  confidence: number; // 0-1 confidence in this interest
  persistence: number; // 0-1 how consistently this interest appears
}

// Comprehensive strengths analysis
export interface CareerStrength {
  id: string;
  category: 'cognitive' | 'interpersonal' | 'leadership' | 'creative' | 'technical' | 'adaptive' | 'emotional';
  strengthName: string;
  proficiencyLevel: number; // 1-10
  evidenceType: 'demonstrated' | 'potential' | 'feedback_based' | 'assessment_based';
  evidencePoints: StrengthEvidence[];
  developmentStage: 'emerging' | 'developing' | 'proficient' | 'advanced' | 'expert';
  transferability: number; // 0-1 how well this transfers across careers
  marketValue: number; // 0-1 market demand for this strength
  culturalExpression: CulturalStrengthExpression;
  identityFoundation: string[]; // Which identity elements this strength comes from
  growthTrajectory: GrowthTrajectory;
  applicationAreas: string[];
  complementaryStrengths: string[];
  developmentNeeds: string[];
  showcaseOpportunities: ShowcaseOpportunity[];
  validationMethods: ValidationMethod[];
  firstIdentified: Date;
  lastDemonstrated: Date;
  confidence: number; // 0-1
}

// Career values system
export interface CareerValue {
  id: string;
  category: 'purpose' | 'autonomy' | 'mastery' | 'security' | 'social_impact' | 'creativity' | 'balance' | 'recognition' | 'growth' | 'stability';
  valueName: string;
  importance: number; // 1-10
  currentSatisfaction: number; // 1-10
  culturalOrigin: string[];
  identityConnection: string[];
  lifeExperienceRoot: string[];
  tradeoffWillingness: TradeoffWillingness[];
  manifestationPreferences: string[];
  dealBreakers: string[];
  flexibilityLevel: number; // 0-1
  evolutionOverTime: ValueEvolution[];
  careersAligned: string[];
  workEnvironmentImplications: string[];
  decisionMakingWeight: number; // 0-1
  firstIdentified: Date;
  lastReflectedOn: Date;
}

// Work style and environment preferences
export interface WorkStylePreference {
  collaborationStyle: 'highly_collaborative' | 'team_oriented' | 'independent_contributor' | 'leadership_focused' | 'flexible';
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'creative' | 'empathetic';
  decisionMakingStyle: 'analytical' | 'intuitive' | 'consultative' | 'decisive' | 'collaborative';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing' | 'multimodal';
  stressManagementStyle: 'proactive' | 'adaptive' | 'supportive' | 'analytical' | 'creative';
  workEnvironmentPreference: WorkEnvironmentPreference;
  schedulePreference: SchedulePreference;
  feedbackPreference: FeedbackPreference;
  growthOrientation: GrowthOrientation;
  riskTolerance: RiskTolerance;
  changeAdaptability: ChangeAdaptability;
  culturalWorkValues: CulturalWorkValues;
}

// Career role matching with O*NET integration
export interface CareerRoleMatch {
  id: string;
  roleId: string; // O*NET SOC code
  roleName: string;
  matchScore: number; // 0-1 overall compatibility
  matchComponents: MatchComponent[];
  onetData: ONetRoleData;
  requiredSkills: RequiredSkill[];
  skillGaps: SkillGap[];
  strengthAlignments: StrengthAlignment[];
  valueAlignment: number; // 0-1
  interestAlignment: number; // 0-1
  workStyleCompatibility: number; // 0-1
  culturalFit: CulturalCareerFit;
  identityResonance: IdentityResonance;
  careerPathways: CareerPathway[];
  educationRequirements: EducationRequirement[];
  experienceRequirements: ExperienceRequirement[];
  salaryExpectations: SalaryExpectation;
  jobOutlook: JobOutlook;
  workEnvironmentFit: WorkEnvironmentFit;
  geoAvailability: GeoAvailability[];
  entryStrategies: EntryStrategy[];
  mentorshipOpportunities: MentorshipOpportunity[];
  projectOpportunities: ProjectOpportunity[];
  networkingStrategies: NetworkingStrategy[];
  immediateNextSteps: ActionStep[];
  longTermDevelopment: DevelopmentPlan;
  riskFactors: CareerRiskFactor[];
  successPredictors: SuccessPredictor[];
  alternativeRoles: AlternativeRole[];
  industryInsights: IndustryInsight[];
  firstMatched: Date;
  lastUpdated: Date;
  userInteraction: UserInteractionData;
}

// SMART Goals comprehensive structure
export interface SMARTGoal {
  goalId: string;
  userId: string;
  category: 'skill_development' | 'experience_gain' | 'network_building' | 'education' | 'project_completion' | 'career_transition' | 'leadership_growth' | 'creative_pursuit' | 'impact_creation' | 'personal_brand';
  goalTitle: string;
  goalDescription: string;
  
  // SMART Framework
  specific: SpecificGoalDetails;
  measurable: MeasurableMetrics[];
  achievable: AchievabilityAssessment;
  relevant: RelevanceAlignment;
  timeBound: TimelineStructure;
  
  // Additional Framework Extensions
  culturallyAligned: CulturalGoalAlignment;
  identityIntegrated: IdentityGoalIntegration;
  valuesDriven: ValuesGoalAlignment;
  
  // Supporting Systems
  actionPlan: ActionPlan;
  resourceRequirements: ResourceRequirement[];
  skillDevelopmentNeeds: SkillDevelopmentNeed[];
  mentorshipNeeds: MentorshipNeed[];
  accountabilitySystem: AccountabilitySystem;
  progressTracking: GoalProgressTracking;
  riskMitigation: RiskMitigationPlan;
  adaptationMechanisms: AdaptationMechanism[];
  
  // Milestone and Timeline Management
  milestones: GoalMilestone[];
  deadlines: GoalDeadline[];
  checkpoints: ProgressCheckpoint[];
  celebrations: CelebrationPlan[];
  
  // Connection to Broader Journey
  careerRoleAlignment: string[]; // IDs of aligned career roles
  visionBoardConnection: string[]; // IDs of vision board elements
  projectPortfolioIntegration: string[]; // IDs of related projects
  learningPathAlignment: string[]; // IDs of aligned learning paths
  networkingGoals: NetworkingGoal[];
  
  // Status and Lifecycle
  status: 'draft' | 'active' | 'on_track' | 'behind_schedule' | 'completed' | 'paused' | 'cancelled' | 'evolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number; // 0-1 confidence in achieving this goal
  motivation: number; // 1-10 current motivation level
  energy: number; // 1-10 energy available for this goal
  
  // Reflection and Learning
  reflections: GoalReflection[];
  lessonsLearned: LessonLearned[];
  unexpectedOutcomes: UnexpectedOutcome[];
  pivotPoints: PivotPoint[];
  
  // Community and Support
  isSharedPublicly: boolean;
  communitySupport: CommunityGoalSupport;
  mentorInvolvement: MentorGoalInvolvement;
  collaborationOpportunities: CollaborationOpportunity[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  lastReviewedAt: Date;
  totalTimeInvested: number; // hours
}

// Career Vision Board
export interface CareerVisionBoard {
  boardId: string;
  userId: string;
  title: string;
  description: string;
  visionElements: VisionElement[];
  futureScenarios: FutureScenario[];
  aspirationalRoles: AspirationalRole[];
  lifestyleGoals: LifestyleGoal[];
  impactVision: ImpactVision[];
  timeframes: VisionTimeframe[];
  culturalVisionIntegration: CulturalVisionIntegration;
  identityVisionAlignment: IdentityVisionAlignment;
  valuesExpression: ValuesVisionExpression[];
  visualAssets: VisionVisualAsset[];
  inspirationSources: InspirationSource[];
  manifestationStrategy: ManifestationStrategy;
  progressVisualization: ProgressVisualization;
  adaptabilityPlan: VisionAdaptabilityPlan;
  sharingPreferences: VisionSharingPreferences;
  communityFeedback: CommunityVisionFeedback[];
  mentorGuidance: VisionMentorGuidance[];
  realityChecks: VisionRealityCheck[];
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt: Date;
  isActive: boolean;
}

// Project-based learning structure
export interface ProjectPortfolio {
  portfolioId: string;
  userId: string;
  projects: CareerProject[];
  portfolioThemes: PortfolioTheme[];
  skillsDemonstrated: SkillDemonstration[];
  impactMetrics: ImpactMetric[];
  collaborations: ProjectCollaboration[];
  mentorshipProjects: MentorshipProject[];
  realWorldApplications: RealWorldApplication[];
  culturalProjectIntegration: CulturalProjectIntegration[];
  identityExpressionProjects: IdentityExpressionProject[];
  communityContributionProjects: CommunityContributionProject[];
  learningReflections: ProjectLearningReflection[];
  portfolioPresentation: PortfolioPresentation;
  networkingOpportunities: ProjectNetworkingOpportunity[];
  futureProjectPipeline: FutureProject[];
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

// Real-world opportunity connectors
export interface RealWorldOpportunity {
  opportunityId: string;
  type: 'internship' | 'volunteer' | 'shadow' | 'project' | 'competition' | 'conference' | 'workshop' | 'mentorship' | 'networking_event' | 'job' | 'freelance' | 'startup_opportunity';
  title: string;
  description: string;
  organization: OpportunityOrganization;
  location: OpportunityLocation;
  timeCommitment: TimeCommitment;
  compensation: OpportunityCompensation;
  requirements: OpportunityRequirement[];
  skills: OpportunitySkill[];
  benefits: OpportunityBenefit[];
  applicationProcess: ApplicationProcess;
  deadline: Date;
  startDate: Date;
  duration: string;
  matchScore: number; // 0-1 fit with user's profile
  matchReasons: string[];
  culturalFit: number; // 0-1
  identityAlignment: number; // 0-1
  careerRelevance: number; // 0-1
  learningPotential: number; // 0-1
  networkingValue: number; // 0-1
  impactPotential: number; // 0-1
  accessibilityScore: number; // 0-1
  source: OpportunitySource;
  applicationStatus: 'not_applied' | 'considering' | 'applied' | 'interviewed' | 'offered' | 'accepted' | 'declined' | 'completed';
  userNotes: string;
  mentorRecommendations: MentorOpportunityRecommendation[];
  similiarOpportunities: string[]; // IDs of similar opportunities
  preparationNeeds: PreparationNeed[];
  followUpActions: FollowUpAction[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

// Supporting interfaces

export interface MatchComponent {
  component: 'interests' | 'strengths' | 'values' | 'work_style' | 'skills' | 'personality';
  score: number; // 0-1
  confidence: number; // 0-1
  explanation: string;
  improvementSuggestions: string[];
}

export interface ONetRoleData {
  socCode: string;
  title: string;
  description: string;
  tasks: string[];
  knowledge: KnowledgeArea[];
  skills: SkillArea[];
  abilities: AbilityArea[];
  workActivities: WorkActivity[];
  workContext: WorkContext[];
  interests: InterestArea[];
  workStyles: WorkStyle[];
  workValues: WorkValue[];
  relatedOccupations: RelatedOccupation[];
  industryData: IndustryData[];
  educationData: EducationData;
  wageData: WageData;
  employmentData: EmploymentData;
  lastUpdated: Date;
}

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  category: 'technical' | 'soft' | 'cognitive' | 'creative' | 'leadership' | 'analytical' | 'communication' | 'interpersonal';
  importance: number; // 1-10
  currentLevel: number; // 0-10
  requiredLevel: number; // 1-10
  gap: number; // Difference between required and current
  developmentPriority: 'critical' | 'high' | 'medium' | 'low';
  acquisitionTimeEstimate: number; // months
  learningResources: SkillLearningResource[];
  practiceOpportunities: SkillPracticeOpportunity[];
  assessmentMethods: SkillAssessmentMethod[];
  mentorshipNeeds: SkillMentorshipNeed[];
  transferableFrom: string[]; // Skills that can help develop this
  transferableTo: string[]; // Skills this can help develop
}

export interface SkillGap {
  gapId: string;
  skillArea: string;
  currentLevel: number; // 0-10
  targetLevel: number; // 1-10
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  impact: 'critical' | 'high' | 'medium' | 'low';
  developmentPlan: SkillDevelopmentPlan;
  resources: SkillDevelopmentResource[];
  timeline: SkillDevelopmentTimeline;
  progressTracking: SkillProgressTracking;
  mentorshipNeeds: SkillMentorshipRequirement[];
}

export interface CareerLearningPath {
  pathId: string;
  pathName: string;
  description: string;
  targetCareer: string[];
  skillFocus: string[];
  timeframe: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: LearningModule[];
  prerequisites: string[];
  outcomes: LearningOutcome[];
  assessments: LearningAssessment[];
  certifications: CertificationOpportunity[];
  projectIntegration: ProjectIntegration[];
  mentorshipSupport: PathMentorshipSupport[];
  communitySupport: PathCommunitySupport[];
  realWorldApplication: PathRealWorldApplication[];
  progressTracking: PathProgressTracking;
  adaptationMechanisms: PathAdaptationMechanism[];
  culturalRelevance: PathCulturalRelevance;
  identityIntegration: PathIdentityIntegration;
  personalizedRecommendations: PathPersonalizedRecommendation[];
}

export interface MentorPersonaGuidance {
  guidanceId: string;
  mentorPersona: MentorPersona;
  guidanceType: 'goal_setting' | 'skill_development' | 'career_navigation' | 'network_building' | 'decision_making' | 'confidence_building' | 'cultural_navigation' | 'identity_integration';
  context: string;
  advice: string[];
  actionItems: ActionItem[];
  resources: GuidanceResource[];
  followUpQuestions: string[];
  encouragement: string;
  culturalWisdom: string;
  identityAffirmation: string;
  nextSteps: string[];
  checkInSchedule: string;
  progressMilestones: string[];
  adaptationSignals: string[];
  createdAt: Date;
  relevanceScore: number; // 0-1
  userFeedback: UserGuidanceFeedback;
}

export interface MentorPersona {
  personaId: string;
  name: string;
  role: string;
  background: string;
  expertise: string[];
  communicationStyle: 'encouraging' | 'direct' | 'analytical' | 'creative' | 'empathetic' | 'strategic';
  culturalBackground: string[];
  identityResonance: string[];
  careerJourney: string;
  specializations: string[];
  approach: string;
  values: string[];
  strengths: string[];
  mentorshipStyle: 'coaching' | 'teaching' | 'sponsoring' | 'connecting' | 'inspiring';
}

// Additional supporting types would include:

export interface WorkEnvironmentPreference {
  physicalEnvironment: 'office' | 'remote' | 'hybrid' | 'field' | 'lab' | 'creative_space';
  teamSize: 'individual' | 'small_team' | 'large_team' | 'varies';
  organizationSize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string[];
  culture: string[];
  diversity: number; // 0-1 importance of diverse environment
  innovation: number; // 0-1 importance of innovation focus
  structure: 'highly_structured' | 'moderately_structured' | 'flexible' | 'autonomous';
  pace: 'slow_steady' | 'moderate' | 'fast_paced' | 'variable';
}

export interface SpecificGoalDetails {
  whatSpecifically: string;
  whyImportant: string;
  whoInvolved: string[];
  whereOccurs: string;
  whichResources: string[];
  constraints: string[];
  requirements: string[];
  scope: string;
  boundaries: string[];
}

export interface MeasurableMetrics {
  metricName: string;
  metricType: 'quantitative' | 'qualitative' | 'binary' | 'milestone';
  currentValue: string | number;
  targetValue: string | number;
  unit: string;
  measurementMethod: string;
  frequency: string;
  dataSource: string[];
  trackingTools: string[];
  validationCriteria: string[];
}

export interface AchievabilityAssessment {
  feasibilityScore: number; // 0-1
  resourceAvailability: ResourceAvailability;
  skillRequirements: SkillRequirementAssessment[];
  timeRequirements: TimeRequirementAssessment;
  supportSystemNeeds: SupportSystemNeed[];
  riskFactors: GoalRiskFactor[];
  contingencyPlans: ContingencyPlan[];
  successPredictors: GoalSuccessPredictor[];
  challengesPredicted: PredictedChallenge[];
  mitigationStrategies: MitigationStrategy[];
}

export interface RelevanceAlignment {
  careerGoalsAlignment: number; // 0-1
  personalValuesAlignment: number; // 0-1
  lifeCircumstancesAlignment: number; // 0-1
  culturalAlignment: number; // 0-1
  identityAlignment: number; // 0-1
  marketRelevance: number; // 0-1
  timingAppropriate: boolean;
  priorityLevel: 'critical' | 'high' | 'medium' | 'low';
  impactOnOtherGoals: ImpactAssessment[];
  opportunityCost: OpportunityCostAssessment;
  synergies: GoalSynergy[];
}

export interface TimelineStructure {
  startDate: Date;
  targetEndDate: Date;
  timeframeType: 'fixed' | 'flexible' | 'milestone_driven';
  totalDuration: string;
  phaseBreakdown: TimelinePhase[];
  criticalPath: CriticalPathItem[];
  dependencies: GoalDependency[];
  bufferTime: number; // percentage
  checkpointSchedule: CheckpointSchedule[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  deadlineFlexibility: 'none' | 'limited' | 'moderate' | 'high';
}

// More supporting types would continue...

export interface CareerProject {
  projectId: string;
  title: string;
  description: string;
  category: 'skill_building' | 'portfolio_piece' | 'real_world_application' | 'community_impact' | 'creative_expression' | 'research' | 'collaboration' | 'entrepreneurial';
  status: 'ideation' | 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  timeline: ProjectTimeline;
  objectives: ProjectObjective[];
  skillsApplied: string[];
  skillsDeveloped: string[];
  stakeholders: ProjectStakeholder[];
  resources: ProjectResource[];
  deliverables: ProjectDeliverable[];
  outcomes: ProjectOutcome[];
  learningReflections: ProjectLearningReflection[];
  culturalIntegration: ProjectCulturalIntegration;
  identityExpression: ProjectIdentityExpression;
  communityImpact: ProjectCommunityImpact;
  networkingOutcomes: ProjectNetworkingOutcome[];
  mentorInvolvement: ProjectMentorInvolvement[];
  realWorldApplication: ProjectRealWorldApplication;
  futureOpportunities: ProjectFutureOpportunity[];
  documentation: ProjectDocumentation[];
  presentation: ProjectPresentation;
  feedback: ProjectFeedback[];
  recognition: ProjectRecognition[];
  portfolioIntegration: ProjectPortfolioIntegration;
}

// Export main types
export type {
  CareerJourney,
  CareerInterest,
  CareerStrength,
  CareerValue,
  WorkStylePreference,
  CareerRoleMatch,
  SMARTGoal,
  CareerVisionBoard,
  ProjectPortfolio,
  RealWorldOpportunity,
  MentorPersonaGuidance,
  CareerLearningPath
};