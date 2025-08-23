// ALCHM Identity Pathway & Cultural Context Schema
// Interactive, culturally responsive identity journey system

export interface IdentityJourney {
  id: string;
  userId: string;
  journeyType: 'personal_narrative' | 'cultural_exploration' | 'bias_awareness' | 'empathy_building' | 'integration';
  identityMap: IdentityMap;
  biasReflections: BiasReflection[];
  empathyGrowthScore: number;
  communityThreads: string[]; // Document references
  narrativeEvolution: NarrativeEvolution;
  culturalFluencyLevel: CulturalFluencyLevel;
  socialAwarenessMetrics: SocialAwarenessMetrics;
  privacySettings: IdentityPrivacySettings;
  mentorshipConnections: MentorshipConnection[];
  createdAt: Date;
  updatedAt: Date;
  completedSections: string[];
  traumaInformedNotes: TraumaInformedNote[];
  isActive: boolean;
}

export interface IdentityMap {
  personal: PersonalIdentityElement[];
  cultural: CulturalIdentityElement[];
  aspirational: AspirationalIdentityElement[];
  intersections: IdentityIntersection[];
  hiddenElements: HiddenIdentityElement[]; // Elements user isn't ready to explore publicly
  evolutionTimeline: IdentityEvolution[];
}

export interface PersonalIdentityElement {
  id: string;
  category: 'core_values' | 'personality_traits' | 'life_experiences' | 'relationships' | 'achievements' | 'challenges';
  description: string;
  significance: number; // 1-10 how important this is to identity
  visibility: 'public' | 'community' | 'mentors_only' | 'private';
  emotionalResonance: number; // 1-10 how emotionally significant
  stabilityLevel: 'unchanging_core' | 'evolving' | 'situational' | 'emerging';
  narrativeRole: 'defining_moment' | 'ongoing_theme' | 'growth_area' | 'strength' | 'complexity';
  culturalInfluence: CulturalInfluence;
  biasCheckRequired: boolean;
  reflectionPrompts: string[];
  supportingEvidence: string[];
  challengingQuestions: string[];
  growthOpportunities: string[];
  connectedElements: string[]; // IDs of related elements
  aiInsights: AIInsight[];
  userNotes: string;
  lastReflectedOn: Date;
}

export interface CulturalIdentityElement {
  id: string;
  culturalDimension: 'ethnicity' | 'nationality' | 'religion' | 'language' | 'socioeconomic' | 'family_structure' | 'gender' | 'orientation' | 'ability' | 'generation' | 'geography' | 'profession' | 'other';
  identification: string; // How user identifies within this dimension
  significance: number; // 1-10 importance to overall identity
  visibility: 'public' | 'community' | 'mentors_only' | 'private';
  prideLevels: {
    heritage: number; // 1-10 pride in heritage
    current_expression: number; // 1-10 pride in current expression
    community_connection: number; // 1-10 connection to community
  };
  challenges: CulturalChallenge[];
  strengths: CulturalStrength[];
  intersectionalComplexity: IntersectionalComplexity;
  traditionIntegration: TraditionIntegration;
  modernAdaptation: ModernAdaptation;
  communityConnections: CommunityConnection[];
  biasExperiences: BiasExperience[];
  allyshipOpportunities: AllyshipOpportunity[];
  culturalWisdom: CulturalWisdom[];
  intergenerationalNarrative: IntergenerationalNarrative;
  aiCulturalInsights: AICulturalInsight[];
  mentorshipNeeds: MentorshipNeed[];
  safetyConsiderations: SafetyConsideration[];
}

export interface AspirationalIdentityElement {
  id: string;
  aspiration: string;
  category: 'personal_growth' | 'cultural_integration' | 'social_impact' | 'relationship_building' | 'skill_development' | 'leadership' | 'advocacy' | 'healing' | 'creativity';
  motivation: string;
  currentGap: string;
  developmentPlan: DevelopmentPlan;
  culturalAlignment: number; // 1-10 how well this aligns with cultural values
  socialImpactPotential: number; // 1-10 potential for positive social impact
  empathyGrowthConnection: EmpathyGrowthConnection;
  biasDeconstruction: BiasDeconstructionArea;
  mentorshipOpportunities: MentorshipOpportunity[];
  communitySupport: CommunitySupport[];
  timeline: AspirationTimeline;
  successMetrics: AspirationMetric[];
  obstacles: AspirationObstacle[];
  strengthsToLeverage: string[];
  supportNeeded: SupportNeed[];
  aiGuidance: AIGuidance[];
  isPublicGoal: boolean;
}

export interface IdentityIntersection {
  id: string;
  elements: string[]; // IDs of intersecting elements
  intersectionType: 'reinforcing' | 'challenging' | 'complex' | 'evolving' | 'hidden';
  description: string;
  strength: number; // 1-10 how strong the intersection is
  visibility: 'public' | 'community' | 'private';
  narrativeSignificance: string;
  growthOpportunity: string;
  biasRisk: BiasRisk;
  empathyOpportunity: EmpathyOpportunity;
  culturalNegotiation: CulturalNegotiation;
  supportResources: SupportResource[];
  aiAnalysis: AIIntersectionAnalysis;
  communityRelevance: CommunityRelevance;
  mentorshipValue: MentorshipValue;
}

export interface BiasReflection {
  id: string;
  promptId: string;
  userResponse: string;
  biasType: 'implicit' | 'explicit' | 'confirmation' | 'cultural' | 'intersectional' | 'systemic';
  biasCategory: 'racial' | 'gender' | 'cultural' | 'socioeconomic' | 'ability' | 'age' | 'orientation' | 'religion' | 'appearance' | 'other';
  detectionMethod: 'ai_analysis' | 'self_reflection' | 'community_feedback' | 'mentor_guidance';
  resolved: boolean;
  resolutionPath: ResolutionPath;
  culturalContext: CulturalContext;
  emotionalResponse: EmotionalResponse;
  learningOutcome: LearningOutcome;
  actionCommitments: ActionCommitment[];
  empathyConnection: EmpathyConnection;
  communityImpact: CommunityImpact;
  followUpScheduled: Date | null;
  supportResourcesUsed: string[];
  aiInsights: AIBiasInsight[];
  mentorFeedback: MentorFeedback[];
  privacyLevel: 'private' | 'mentor_shared' | 'community_anonymous' | 'public_learning';
  triggerWarnings: string[];
  healingProgress: HealingProgress;
  date: Date;
  lastReflectedOn: Date;
}

export interface NarrativeEvolution {
  coreNarrative: string;
  evolutionStages: NarrativeStage[];
  currentThemes: NarrativeTheme[];
  emergingThemes: NarrativeTheme[];
  narrativeCoherence: number; // 1-10 how coherent the narrative is
  narrativeComplexity: number; // 1-10 how complex/nuanced
  culturalNarrativeIntegration: CulturalNarrativeIntegration;
  biasNarrativeWork: BiasNarrativeWork;
  empathyNarrativeGrowth: EmpathyNarrativeGrowth;
  socialImpactNarrative: SocialImpactNarrative;
  healingNarratives: HealingNarrative[];
  strengthNarratives: StrengthNarrative[];
  futureNarratives: FutureNarrative[];
  narrativeWisdom: NarrativeWisdom[];
  communityNarrativeContributions: CommunityNarrativeContribution[];
  aiNarrativeInsights: AINarrativeInsight[];
}

export interface CulturalFluencyLevel {
  overallLevel: number; // 1-10
  dimensions: CulturalFluencyDimension[];
  crossCulturalCompetency: number; // 1-10
  culturalHumility: number; // 1-10
  biasAwareness: number; // 1-10
  empathicPerspectiveTaking: number; // 1-10
  inclusiveAction: number; // 1-10
  culturalBridgeBuilding: number; // 1-10
  marginalizationUnderstanding: number; // 1-10
  privilegeAwareness: number; // 1-10
  allyshipSkills: number; // 1-10
  intersectionalThinking: number; // 1-10
  developmentAreas: string[];
  strengthAreas: string[];
  learningGoals: CulturalLearningGoal[];
  practiceOpportunities: PracticeOpportunity[];
  mentorshipNeeds: CulturalMentorshipNeed[];
  communityEngagement: CulturalCommunityEngagement[];
}

export interface SocialAwarenessMetrics {
  empathyGrowthScore: number; // 1-10
  biasReductionScore: number; // 1-10
  inclusionActionsCount: number;
  communityEngagementLevel: number; // 1-10
  mentorshipParticipation: MentorshipParticipationMetrics;
  narrativeSharingImpact: NarrativeSharingImpact;
  culturalBridgeBuildingInstances: number;
  allyshipActivations: AllyshipActivation[];
  socialJusticeContributions: SocialJusticeContribution[];
  intersectionalAwarenessGrowth: IntersectionalAwarenessGrowth;
  marginalizedVoicesAmplified: number;
  biasInterventionInstances: BiasInterventionInstance[];
  empathyExpansionMoments: EmpathyExpansionMoment[];
  inclusiveCommunityBuilding: InclusiveCommunityBuilding;
  restorationAndHealingContributions: RestorationContribution[];
}

export interface IdentityPrivacySettings {
  defaultVisibility: 'public' | 'community' | 'mentors_only' | 'private';
  elementSpecificSettings: Map<string, 'public' | 'community' | 'mentors_only' | 'private'>;
  biasReflectionSharing: 'never' | 'anonymous_learning' | 'mentor_guidance' | 'community_support';
  narrativeSharing: 'private' | 'selective' | 'community' | 'public_advocacy';
  culturalElementSharing: 'protected' | 'selective' | 'community' | 'public_education';
  mentorshipVisibility: boolean;
  communityDiscourseParticipation: 'anonymous' | 'pseudonym' | 'verified_identity';
  aiDataUsage: 'minimal' | 'learning_enhancement' | 'community_benefit' | 'research_contribution';
  traumaInformedProtections: TraumaInformedProtection[];
  culturalSafetyMeasures: CulturalSafetyMeasure[];
  rightToBeForgettenActivated: boolean;
  dataPortabilityRequests: DataPortabilityRequest[];
}

export interface MentorshipConnection {
  id: string;
  mentorId: string | null; // null if seeking mentor
  menteeId: string | null; // null if offering mentorship
  connectionType: 'identity_mentor' | 'cultural_guide' | 'bias_accountability_partner' | 'empathy_coach' | 'narrative_witness' | 'intersectional_support';
  matchingScore: number; // 1-10 compatibility score
  matchingCriteria: MatchingCriteria;
  connectionStatus: 'requested' | 'matched' | 'active' | 'paused' | 'completed' | 'ended';
  focusAreas: string[];
  culturalConsiderations: CulturalConsideration[];
  safetyProtocols: SafetyProtocol[];
  communicationPreferences: CommunicationPreference[];
  boundariesAndExpectations: BoundaryExpectation[];
  progressTracking: MentorshipProgress[];
  feedbackHistory: MentorshipFeedback[];
  impactMeasures: MentorshipImpactMeasure[];
  culturalExchangeBenefits: CulturalExchangeBenefit[];
  conflictResolution: ConflictResolution[];
  terminationConditions: TerminationCondition[];
  celebrationMilestones: CelebrationMilestone[];
  startDate: Date;
  expectedDuration: string;
  lastInteraction: Date;
  isAnonymous: boolean;
}

// Community Layer Types
export interface IdentityHubGroup {
  id: string;
  groupType: 'cultural_affinity' | 'intersectional_support' | 'bias_accountability' | 'empathy_building' | 'narrative_sharing' | 'allyship_action' | 'healing_circles' | 'identity_exploration';
  name: string;
  description: string;
  culturalFocusAreas: string[];
  identityDimensions: string[];
  participantCriteria: ParticipantCriteria;
  privacyLevel: 'anonymous' | 'pseudonymous' | 'verified' | 'invitation_only';
  moderationLevel: 'self_moderated' | 'peer_moderated' | 'professionally_moderated' | 'ai_assisted';
  safetyProtocols: CommunityGroupSafetyProtocol[];
  culturalGuidelines: CulturalGuideline[];
  traumaInformedPractices: TraumaInformedPractice[];
  participantCount: number;
  activeDiscussions: number;
  engagementLevel: number; // 1-10
  impactMetrics: CommunityImpactMetric[];
  mentorshipOpportunities: CommunityMentorshipOpportunity[];
  learningResources: CommunityLearningResource[];
  advocacyActions: CommunityAdvocacyAction[];
  healingSupport: CommunityHealingSupport[];
  celebrationSpaces: CommunityCelebrationSpace[];
  createdAt: Date;
  lastActive: Date;
  isActive: boolean;
}

export interface CommunityDiscussion {
  id: string;
  groupId: string;
  authorId: string; // Can be anonymous
  title: string;
  content: string;
  discussionType: 'narrative_sharing' | 'bias_processing' | 'cultural_exploration' | 'empathy_building' | 'intersectional_dialogue' | 'healing_support' | 'advocacy_planning' | 'celebration' | 'learning_together';
  culturalContext: string[];
  identityDimensions: string[];
  contentWarnings: string[];
  aiModeration: AIModerationResult;
  responses: CommunityResponse[];
  empathyMetrics: CommunityEmpathyMetric[];
  learningOutcomes: CommunityLearningOutcome[];
  culturalBridges: CommunityBridge[];
  biasCallouts: BiasCommunityCallout[];
  supportOffered: CommunitySupport[];
  healingWitness: HealingWitness[];
  advocacyMoments: AdvocacyMoment[];
  wisdomShared: WisdomShared[];
  connectionsMade: CommunityConnectionMade[];
  visibility: 'group_only' | 'cross_group' | 'platform_wide';
  anonymityLevel: 'fully_anonymous' | 'consistent_pseudonym' | 'verified_member';
  engagementLevel: number; // 1-10
  impactScore: number; // 1-10
  culturalSensitivityScore: number; // 1-10
  traumaInformedScore: number; // 1-10
  createdAt: Date;
  lastUpdated: Date;
  isActive: boolean;
  isArchived: boolean;
}

// AI Analysis and Insight Types
export interface AIBiasDetection {
  detectedBiases: DetectedBias[];
  confidenceScore: number; // 0-1
  analysisMethod: 'nlp_pattern' | 'semantic_analysis' | 'context_comparison' | 'cultural_framework' | 'intersectional_analysis';
  culturalContextConsidered: boolean;
  recommendedReflections: RecommendedReflection[];
  empathyBuildingOpportunities: EmpathyBuildingOpportunity[];
  educationalResources: EducationalResource[];
  communityDialoguePrompts: CommunityDialoguePrompt[];
  mentorshipRecommendations: MentorshipRecommendation[];
  healingConsiderations: HealingConsideration[];
  growthOpportunities: BiasGrowthOpportunity[];
  systemicConnections: SystemicConnection[];
  intersectionalComplexities: IntersectionalComplexity[];
  culturalNuances: CulturalNuance[];
}

export interface AICulturalFluency {
  promptType: 'exploration' | 'challenge' | 'bridge_building' | 'empathy_expansion' | 'bias_awareness' | 'intersectional_thinking' | 'allyship_activation' | 'healing_support';
  culturalContext: string[];
  userTonePreference: 'gentle' | 'direct' | 'socratic' | 'storytelling' | 'academic' | 'conversational' | 'healing_centered';
  languagePreference: string;
  culturalFramework: string; // Framework being used for prompting
  promptContent: string;
  followUpQuestions: string[];
  reflectionScaffolds: ReflectionScaffold[];
  culturalWisdomIntegration: CulturalWisdomIntegration[];
  biasCheckpoints: BiasCheckpoint[];
  empathyExpansionPoints: EmpathyExpansionPoint[];
  healingOpportunities: HealingOpportunity[];
  communityConnectionPoints: CommunityConnectionPoint[];
  mentorshipMoments: MentorshipMoment[];
  advocacyPotential: AdvocacyPotential[];
  intersectionalConsiderations: IntersectionalConsideration[];
  traumaInformedAdaptations: TraumaInformedAdaptation[];
}

// SEL Integration Types (extending from existing SEL schema)
export interface IdentitySELIntegration {
  selCompetencyAlignment: SELCompetencyAlignment[];
  socialAwarenessGrowth: SocialAwarenessGrowthTracking;
  relationshipSkillsDevelopment: RelationshipSkillsDevelopmentTracking;
  responsibleDecisionMaking: ResponsibleDecisionMakingTracking;
  selfAwarenessExpansion: SelfAwarenessExpansionTracking;
  selfManagementWithIdentity: SelfManagementWithIdentityTracking;
  empathySkillBuilding: EmpathySkillBuildingTracking;
  inclusionPractices: InclusionPracticesTracking;
  biasDeconstructionSkills: BiasDeconstructionSkillsTracking;
  narrativeBuildingCompetency: NarrativeBuildingCompetencyTracking;
  culturalHumilityDevelopment: CulturalHumilityDevelopmentTracking;
  intersectionalThinkingSkills: IntersectionalThinkingSkillsTracking;
  allyshipSkillBuilding: AllyshipSkillBuildingTracking;
  healingAndRestorationSkills: HealingAndRestorationSkillsTracking;
  advocacyAndActionSkills: AdvocacyAndActionSkillsTracking;
}

// Supporting Types (abbreviated for space - full implementations would be extensive)
export interface CulturalInfluence {
  influenceType: string;
  description: string;
  strength: number;
  awareness: number;
}

export interface BiasRisk {
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: string[];
  mitigationStrategies: string[];
}

export interface EmpathyOpportunity {
  opportunity: string;
  targetPopulation: string;
  engagementLevel: 'awareness' | 'understanding' | 'action' | 'advocacy';
  culturalConsiderations: string[];
}

export interface ResolutionPath {
  steps: ResolutionStep[];
  timeframe: string;
  supportNeeded: string[];
  successIndicators: string[];
}

export interface TraumaInformedNote {
  type: 'safety_check' | 'trigger_warning' | 'choice_emphasis' | 'strength_focus' | 'cultural_safety' | 'healing_support';
  content: string;
  severity: 'info' | 'caution' | 'important' | 'critical';
  actionRequired: boolean;
  culturalConsiderations: string[];
  supportResources: string[];
  followUpRequired: boolean;
}

// Export main types for easy importing
export type {
  IdentityJourney,
  IdentityMap,
  BiasReflection,
  CulturalFluencyLevel,
  SocialAwarenessMetrics,
  MentorshipConnection,
  IdentityHubGroup,
  CommunityDiscussion,
  AIBiasDetection,
  AICulturalFluency,
  IdentitySELIntegration
};