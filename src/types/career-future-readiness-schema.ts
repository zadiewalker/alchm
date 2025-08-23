// ALCHM Career & Future Readiness Pathway Schema
// Comprehensive career exploration, skills development, and future planning framework

import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CoachProfile, PersonalizationSignal } from '@/types/ai-personalization-schema';
import { CulturalContext, IdentityJourney } from '@/types/identity-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';

// Core Career Exploration Framework
export interface CareerExplorationProfile {
  profileId: string;
  userId: string;
  
  // Career Assessment & Discovery
  careerAssessment: CareerAssessment;
  strengthsProfile: StrengthsProfile;
  valuesProfile: ValuesProfile;
  talentsInventory: TalentsInventory;
  interestsAnalysis: InterestsAnalysis;
  
  // Career Matching & Pathways
  careerMatches: CareerMatch[];
  exploredCareers: ExploredCareer[];
  careerPathways: CareerPathway[];
  alternativePathways: AlternativeCareerPath[];
  
  // Real-World Connections
  networkingConnections: NetworkingConnection[];
  mentorConnections: CareerMentorConnection[];
  industryContacts: IndustryContact[];
  informationalInterviews: InformationalInterview[];
  
  // Future Readiness
  futureReadinessScore: FutureReadinessScore;
  emergingTrendsAwareness: EmergingTrendsAwareness[];
  adaptabilityMetrics: AdaptabilityMetric[];
  
  createdAt: Date;
  lastUpdated: Date;
  completenessScore: number; // 0-1
}

export interface CareerAssessment {
  assessmentId: string;
  assessmentType: 'comprehensive' | 'focused' | 'quick_check' | 'journal_analysis';
  
  // Assessment Components
  workstylePreferences: WorkstylePreference[];
  environmentPreferences: EnvironmentPreference[];
  workValuesRanking: WorkValue[];
  skillsAssessment: SkillAssessment[];
  personalityFactors: PersonalityFactor[];
  
  // AI Analysis from Journals
  journalInsights: JournalCareerInsight[];
  patternAnalysis: CareerPatternAnalysis;
  motivationAnalysis: MotivationAnalysis;
  
  // Cultural & Identity Integration
  culturalCareerFactors: CulturalCareerFactor[];
  identityAlignment: IdentityCareerAlignment;
  familyInfluences: FamilyCareerInfluence[];
  
  // Assessment Results
  careerSuggestions: CareerSuggestion[];
  strengthsHighlights: StrengthHighlight[];
  developmentAreas: CareerDevelopmentArea[];
  
  completedAt: Date;
  validityScore: number; // 0-1, assessment reliability
  culturallyAdapted: boolean;
}

export interface CareerMatch {
  matchId: string;
  career: CareerOption;
  matchScore: number; // 0-1
  matchingFactors: MatchingFactor[];
  
  // Alignment Analysis
  strengthsAlignment: number; // 0-1
  valuesAlignment: number; // 0-1
  interestsAlignment: number; // 0-1
  personalityFit: number; // 0-1
  culturalFit: number; // 0-1
  
  // Practical Considerations
  educationRequirements: EducationRequirement[];
  skillGaps: SkillGap[];
  experienceNeeds: ExperienceNeed[];
  timelineToEntry: TimelineToEntry;
  
  // Market Reality
  jobMarketData: JobMarketData;
  salaryExpectations: SalaryExpectation[];
  geographicConsiderations: GeographicConsideration[];
  industryTrends: IndustryTrend[];
  
  // Growth Potential
  careerGrowthPotential: CareerGrowthPotential;
  skillTransferability: SkillTransferability[];
  futureProofScore: number; // 0-1
  
  explorationStatus: 'not_explored' | 'researching' | 'actively_exploring' | 'pursuing';
  lastUpdated: Date;
}

export interface CareerPathway {
  pathwayId: string;
  targetCareer: CareerOption;
  pathwayType: 'traditional' | 'alternative' | 'entrepreneurial' | 'portfolio' | 'transition';
  
  // Pathway Structure
  milestones: CareerMilestone[];
  phases: CareerPhase[];
  decisionPoints: CareerDecisionPoint[];
  contingencyPlans: ContingencyPlan[];
  
  // Requirements & Preparation
  educationPath: EducationPath;
  skillDevelopmentPlan: SkillDevelopmentPlan;
  experienceBuilding: ExperienceBuilding[];
  networkingStrategy: NetworkingStrategy;
  
  // Timeline & Resources
  estimatedTimeline: PathwayTimeline;
  resourceRequirements: ResourceRequirement[];
  investmentAnalysis: InvestmentAnalysis;
  riskAssessment: RiskAssessment[];
  
  // Support & Guidance
  mentorshipNeeds: MentorshipNeed[];
  learningResources: LearningResource[];
  communitySupport: CommunitySupport[];
  
  // Progress Tracking
  currentPhase: string;
  completedMilestones: string[];
  progressMetrics: ProgressMetric[];
  adaptationHistory: PathwayAdaptation[];
  
  createdAt: Date;
  lastReviewed: Date;
  isActive: boolean;
}

// Skills Development & Tracking System
export interface SkillsInventoryProfile {
  profileId: string;
  userId: string;
  
  // Current Skills Assessment
  technicalSkills: TechnicalSkill[];
  softSkills: SoftSkill[];
  digitalLiteracySkills: DigitalLiteracySkill[];
  industrySpecificSkills: IndustrySpecificSkill[];
  emergingSkills: EmergingSkill[];
  
  // Skills Analysis
  skillsMatrix: SkillsMatrix;
  strengthAreas: SkillStrengthArea[];
  developmentPriorities: SkillDevelopmentPriority[];
  skillGaps: SkillGap[];
  transferableSkills: TransferableSkill[];
  
  // Learning & Development
  learningPathways: LearningPathway[];
  completedProjects: CompletedProject[];
  skillCertifications: SkillCertification[];
  practiceOpportunities: PracticeOpportunity[];
  
  // Portfolio & Showcase
  skillsPortfolio: SkillsPortfolio;
  projectShowcase: ProjectShowcase[];
  achievementGallery: AchievementGallery;
  skillDemonstrations: SkillDemonstration[];
  
  // Growth Tracking
  skillsEvolution: SkillsEvolution[];
  learningVelocity: LearningVelocity;
  masteryProgression: MasteryProgression[];
  futureSkillsPreparation: FutureSkillsPreparation;
  
  lastAssessment: Date;
  nextAssessment: Date;
  overallSkillsScore: number; // 0-1
}

export interface LearningPathway {
  pathwayId: string;
  skillTarget: string;
  currentLevel: SkillLevel;
  targetLevel: SkillLevel;
  
  // Pathway Design
  learningModules: LearningModule[];
  practiceProjects: PracticeProject[];
  realWorldApplications: RealWorldApplication[];
  assessmentMilestones: AssessmentMilestone[];
  
  // Personalization
  learningStyle: LearningStyle;
  culturalAdaptations: CulturalLearningAdaptation[];
  accessibilityFeatures: AccessibilityFeature[];
  pacePreferences: PacePreference;
  
  // Resources & Support
  learningResources: LearningResource[];
  mentorSupport: MentorSupport[];
  peerCollaboration: PeerCollaboration[];
  expertGuidance: ExpertGuidance[];
  
  // Progress & Outcomes
  completionPercentage: number; // 0-1
  skillMastery: SkillMastery[];
  portfolioContributions: PortfolioContribution[];
  careerRelevance: CareerRelevance;
  
  estimatedDuration: number; // weeks
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisitesMet: boolean;
  isActive: boolean;
}

// Future Vision & Goal Setting System
export interface FutureVisionProfile {
  profileId: string;
  userId: string;
  
  // Vision Development
  lifeVision: LifeVision;
  careerVision: CareerVision;
  personalVision: PersonalVision;
  impactVision: ImpactVision;
  
  // Goal Framework
  smartGoals: SMARTGoal[];
  shortTermGoals: ShortTermGoal[];
  mediumTermGoals: MediumTermGoal[];
  longTermGoals: LongTermGoal[];
  stretchGoals: StretchGoal[];
  
  // Vision Board & Visualization
  visionBoard: VisionBoard;
  visualizations: VisionVisualization[];
  inspirationSources: InspirationSource[];
  roleModels: RoleModel[];
  
  // Accountability & Support
  accountabilityPartners: AccountabilityPartner[];
  progressTracking: GoalProgressTracking[];
  milestonesCelebrations: MilestoneCelebration[];
  setbackRecovery: SetbackRecovery[];
  
  // AI Insights & Guidance
  aiInsights: FutureVisionAIInsight[];
  adaptiveRecommendations: AdaptiveRecommendation[];
  opportunityIdentification: OpportunityIdentification[];
  riskMitigation: RiskMitigation[];
  
  createdAt: Date;
  lastReviewed: Date;
  visionClarityScore: number; // 0-1
  goalsAlignmentScore: number; // 0-1
}

export interface SMARTGoal {
  goalId: string;
  title: string;
  description: string;
  
  // SMART Criteria
  specific: GoalSpecific;
  measurable: GoalMeasurable;
  achievable: GoalAchievable;
  relevant: GoalRelevant;
  timeBound: GoalTimeBound;
  
  // Goal Context
  category: 'career' | 'skill_development' | 'education' | 'networking' | 'personal_brand' | 'leadership' | 'entrepreneurship';
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficultyLevel: 'easy' | 'moderate' | 'challenging' | 'stretch';
  
  // Progress Tracking
  currentProgress: number; // 0-1
  milestones: GoalMilestone[];
  actionSteps: ActionStep[];
  deadlines: GoalDeadline[];
  
  // Support & Resources
  requiredResources: RequiredResource[];
  supportNetwork: SupportNetworkMember[];
  obstacles: GoalObstacle[];
  contingencyPlans: GoalContingencyPlan[];
  
  // Accountability
  accountabilityCheck: AccountabilityCheck[];
  progressReviews: ProgressReview[];
  adjustmentHistory: GoalAdjustment[];
  
  // Motivation & Inspiration
  motivationFactors: MotivationFactor[];
  rewardSystem: RewardSystem;
  visualReminders: VisualReminder[];
  
  createdAt: Date;
  targetDate: Date;
  lastUpdated: Date;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled' | 'modified';
}

// Networking & Professional Connections
export interface NetworkingProfile {
  profileId: string;
  userId: string;
  
  // Network Analysis
  networkMap: NetworkMap;
  connectionStrength: ConnectionStrength[];
  networkDiversity: NetworkDiversity;
  influenceAnalysis: InfluenceAnalysis;
  
  // Professional Relationships
  mentors: ProfessionalMentor[];
  mentees: ProfessionalMentee[];
  peers: ProfessionalPeer[];
  industryContacts: IndustryContact[];
  collaborators: Collaborator[];
  
  // Networking Activities
  networkingEvents: NetworkingEvent[];
  professionalMeetings: ProfessionalMeeting[];
  informationalInterviews: InformationalInterview[];
  industryEngagement: IndustryEngagement[];
  
  // Online Presence
  professionalBranding: ProfessionalBranding;
  socialMediaPresence: SocialMediaPresence[];
  contentContributions: ContentContribution[];
  thoughtLeadership: ThoughtLeadership[];
  
  // Networking Strategy
  networkingGoals: NetworkingGoal[];
  targetConnections: TargetConnection[];
  relationshipBuilding: RelationshipBuilding[];
  valueCreation: ValueCreation[];
  
  lastNetworkingActivity: Date;
  networkingEffectiveness: number; // 0-1
  relationshipQuality: number; // 0-1
}

// Supporting Types
export type SkillLevel = 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
export type CareerStage = 'exploration' | 'entry_level' | 'mid_career' | 'senior_level' | 'executive' | 'transition' | 'portfolio';
export type IndustryType = 'technology' | 'healthcare' | 'education' | 'finance' | 'creative' | 'nonprofit' | 'government' | 'entrepreneurship';
export type WorkEnvironment = 'office' | 'remote' | 'hybrid' | 'field' | 'laboratory' | 'studio' | 'outdoors' | 'travel';
export type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | 'government' | 'nonprofit';

// Career Options & Information
export interface CareerOption {
  careerId: string;
  title: string;
  alternativeTitles: string[];
  description: string;
  
  // Career Details
  industry: IndustryType[];
  workEnvironment: WorkEnvironment[];
  careerStage: CareerStage[];
  companySize: CompanySize[];
  
  // Requirements & Qualifications
  educationRequirements: EducationRequirement[];
  skillRequirements: SkillRequirement[];
  experienceRequirements: ExperienceRequirement[];
  certificationRequirements: CertificationRequirement[];
  
  // Day-to-Day & Responsibilities
  typicalResponsibilities: string[];
  dailyActivities: string[];
  keyPerformanceAreas: string[];
  challengesAndRewards: ChallengeReward[];
  
  // Growth & Advancement
  careerProgression: CareerProgression[];
  advancementOpportunities: AdvancementOpportunity[];
  skillDevelopmentAreas: SkillDevelopmentArea[];
  transferableSkills: TransferableSkill[];
  
  // Market Information
  jobMarketOutlook: JobMarketOutlook;
  salaryInformation: SalaryInformation;
  geographicDemand: GeographicDemand[];
  industryGrowth: IndustryGrowth;
  
  // Cultural & Diversity Considerations
  diversityStats: DiversityStats;
  inclusionFactors: InclusionFactor[];
  culturalFit: CulturalFit[];
  biasConsiderations: BiasConsideration[];
  
  lastUpdated: Date;
  dataSource: string[];
  reliabilityScore: number; // 0-1
}

// Project-Based Learning
export interface ProjectBasedLearning {
  projectId: string;
  title: string;
  description: string;
  category: 'skill_building' | 'portfolio_piece' | 'real_world_application' | 'collaboration' | 'innovation';
  
  // Project Design
  learningObjectives: LearningObjective[];
  skillTargets: SkillTarget[];
  challengeLevel: 'starter' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number; // hours
  
  // Real-World Application
  industryRelevance: IndustryRelevance[];
  practicalApplication: PracticalApplication[];
  stakeholderInvolvement: StakeholderInvolvement[];
  businessImpact: BusinessImpact;
  
  // Collaboration & Mentorship
  teamComposition: TeamComposition;
  mentorInvolvement: MentorInvolvement[];
  peerCollaboration: PeerCollaboration[];
  industryGuidance: IndustryGuidance[];
  
  // Assessment & Outcomes
  evaluationCriteria: EvaluationCriteria[];
  deliverables: ProjectDeliverable[];
  successMetrics: SuccessMetric[];
  portfolioContribution: PortfolioContribution;
  
  // Resources & Support
  resourcesNeeded: ProjectResource[];
  toolsAndTechnology: ToolTechnology[];
  supportStructure: SupportStructure[];
  
  status: 'planning' | 'active' | 'review' | 'completed' | 'archived';
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
}

// Export all types
export type {
  CareerExplorationProfile,
  CareerAssessment,
  CareerMatch,
  CareerPathway,
  SkillsInventoryProfile,
  LearningPathway,
  FutureVisionProfile,
  SMARTGoal,
  NetworkingProfile,
  CareerOption,
  ProjectBasedLearning
};