// ALCHM Emotional Alchemy & Mental Wellness Schema
// Comprehensive types for emotional transformation, breathwork, and mental wellness

import { IdentityJourney, CulturalContext } from '@/types/identity-schema';

// Core emotional entry structure
export interface EmotionalEntry {
  entryId: string;
  userId: string;
  timestamp: Date;
  
  // Mood tracking (as specified in prompt)
  moodBefore: number; // 1-10 scale
  moodAfter: number; // 1-10 scale
  activity: 'breath' | 'writing' | 'movement' | 'ritual' | 'meditation' | 'creative_expression' | 'somatic_practice';
  reflectionText: string;
  aiInsight: string;
  
  // Extended emotional data
  emotionalState: EmotionalState;
  triggers: EmotionalTrigger[];
  physicalSensations: PhysicalSensation[];
  thoughtPatterns: ThoughtPattern[];
  breathworkSession: BreathworkSession | null;
  movementSession: MovementSession | null;
  ritualSession: RitualSession | null;
  creativePractice: CreativePractice | null;
  somaticPractice: SomaticPractice | null;
  
  // Transformation tracking
  alchemyProcess: AlchemyProcess;
  breakthrough: EmotionalBreakthrough | null;
  integration: IntegrationPractice | null;
  
  // Cultural and identity integration
  culturalHealing: CulturalHealingElement[];
  identityWork: IdentityEmotionalWork[];
  ancestralWisdom: AncestralWisdomElement[];
  
  // Wellness metrics
  stressLevel: number; // 1-10
  energyLevel: number; // 1-10
  clarityLevel: number; // 1-10
  connectionLevel: number; // 1-10 (to self/others/purpose)
  resilienceGrowth: number; // 0-1
  
  // Support and community
  sharingLevel: 'private' | 'trusted_circle' | 'community' | 'anonymous_learning';
  supportReceived: SupportReceived[];
  wisdomShared: WisdomShared[];
  
  // Follow-up and continuation
  followUpNeeded: boolean;
  continuationPlan: ContinuationPlan | null;
  nextPracticeRecommendation: PracticeRecommendation[];
  
  // Metadata
  location: EmotionalLocation;
  environment: EnvironmentContext;
  lifeContext: LifeContext;
  seasonalInfluence: SeasonalInfluence;
  
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

// Comprehensive emotional state tracking
export interface EmotionalState {
  primaryEmotion: PrimaryEmotion;
  secondaryEmotions: SecondaryEmotion[];
  emotionIntensity: number; // 1-10
  emotionClarity: number; // 1-10 how clearly they understand what they're feeling
  emotionAcceptance: number; // 1-10 how much they accept their current state
  
  // Emotional complexity
  conflictingEmotions: ConflictingEmotion[];
  emotionalNuance: EmotionalNuance[];
  culturalEmotionalExpression: CulturalEmotionalExpression[];
  
  // Somatic awareness
  bodyAwareness: BodyAwareness;
  breathAwareness: BreathAwareness;
  tensionAreas: TensionArea[];
  energeticState: EnergeticState;
  
  // Mental state
  mentalClarity: number; // 1-10
  cognitiveLoad: number; // 1-10
  mindfulnessLevel: number; // 1-10
  presentMomentAwareness: number; // 1-10
  
  // Relational state
  connectionToSelf: number; // 1-10
  connectionToOthers: number; // 1-10
  connectionToNature: number; // 1-10
  connectionToPurpose: number; // 1-10
  connectionToAncestors: number; // 1-10
}

// Breathwork session comprehensive tracking
export interface BreathworkSession {
  sessionId: string;
  technique: BreathworkTechnique;
  duration: number; // minutes
  guidanceType: 'self_guided' | 'ai_guided' | 'audio_guided' | 'live_guided';
  
  // Session progression
  phases: BreathworkPhase[];
  breathPattern: BreathPattern;
  heartRateVariability: HeartRateVariability | null;
  
  // Experience tracking
  physicalSensations: BreathworkSensation[];
  emotionalShifts: EmotionalShift[];
  visualizations: Visualization[];
  insights: BreathworkInsight[];
  
  // Effectiveness measures
  relaxationAchieved: number; // 1-10
  clarityGained: number; // 1-10
  emotionalRelease: number; // 1-10
  energyShift: EnergyShift;
  
  // Cultural integration
  culturalBreathPractice: CulturalBreathPractice | null;
  ancestralConnection: AncestralBreathConnection | null;
  
  // Safety and trauma-informed care
  traumaInformedModifications: TraumaInformedModification[];
  safetyChecks: SafetyCheck[];
  groundingTechniques: GroundingTechnique[];
  
  // Follow-up
  immediateAftereffects: Aftereffect[];
  integrationPractice: BreathworkIntegration[];
  homewardBound: HomewardBoundPractice[];
  
  startTime: Date;
  endTime: Date;
  effectiveness: number; // 0-1
  wouldRepeat: boolean;
  recommendedFrequency: string;
}

// Movement session for emotional processing
export interface MovementSession {
  sessionId: string;
  movementType: MovementType;
  duration: number; // minutes
  intensity: MovementIntensity;
  
  // Movement categories
  category: 'somatic' | 'dance' | 'yoga' | 'tai_chi' | 'qigong' | 'expressive_movement' | 'walking_meditation' | 'martial_arts' | 'therapeutic_movement';
  style: MovementStyle;
  guidance: MovementGuidance;
  
  // Emotional processing
  emotionsMoved: EmotionMovement[];
  physicalReleases: PhysicalRelease[];
  energyCirculation: EnergyCirculation[];
  blockageClearing: BlockageClearing[];
  
  // Somatic awareness
  bodyDialogue: BodyDialogue[];
  muscularTension: MuscularTension[];
  fasicalRelease: FascialRelease[];
  nervousSystemRegulation: NervousSystemRegulation;
  
  // Cultural movement practices
  culturalMovement: CulturalMovementPractice | null;
  traditionalForms: TraditionalForm[];
  ancestralMovement: AncestralMovementConnection[];
  
  // Integration and insights
  movementInsights: MovementInsight[];
  bodyWisdom: BodyWisdom[];
  integrationActions: IntegrationAction[];
  
  // Safety and adaptations
  physicalLimitations: PhysicalLimitation[];
  traumaInformedAdaptations: MovementTraumaAdaptation[];
  accessibilityModifications: AccessibilityModification[];
  
  // Outcomes
  physicalOutcomes: PhysicalOutcome[];
  emotionalOutcomes: EmotionalOutcome[];
  spiritualOutcomes: SpiritualOutcome[];
  
  environment: MovementEnvironment;
  equipment: MovementEquipment[];
  companionship: MovementCompanionship;
  
  effectiveness: number; // 0-1
  enjoyment: number; // 1-10
  willingness_to_repeat: number; // 1-10
}

// Ritual session for emotional transformation
export interface RitualSession {
  sessionId: string;
  ritualType: RitualType;
  duration: number; // minutes
  
  // Ritual structure
  intention: RitualIntention;
  preparation: RitualPreparation;
  opening: RitualOpening;
  mainPractice: RitualMainPractice;
  integration: RitualIntegration;
  closing: RitualClosing;
  
  // Elements and tools
  elements: RitualElement[];
  tools: RitualTool[];
  offerings: RitualOffering[];
  symbols: RitualSymbol[];
  
  // Cultural and spiritual dimensions
  culturalTradition: CulturalRitualTradition | null;
  spiritualFramework: SpiritualFramework | null;
  ancestralHonoring: AncestralHonoring[];
  
  // Emotional transformation
  emotionToTransform: string;
  transformationProcess: TransformationProcess[];
  alchemicalElements: AlchemicalElement[];
  symbolicActions: SymbolicAction[];
  
  // Community and witness
  witnesses: RitualWitness[];
  communitySupport: RitualCommunitySupport[];
  sharingCircle: SharingCircle | null;
  
  // Nature connection
  naturalElements: NaturalElement[];
  seasonalAlignment: SeasonalAlignment;
  lunarPhase: LunarPhase;
  locationEnergy: LocationEnergy;
  
  // Outcomes and integration
  transformationAchieved: number; // 0-1
  spiritualConnection: number; // 1-10
  communityConnection: number; // 1-10
  healingOccurred: HealingOccurrence[];
  wisdomReceived: WisdomReceived[];
  
  // Follow-up practices
  dailyPractices: DailyRitualPractice[];
  weeklyPractices: WeeklyRitualPractice[];
  seasonalPractices: SeasonalRitualPractice[];
  
  effectiveness: number; // 0-1
  meaningfulness: number; // 1-10
  culturalResonance: number; // 1-10
  accessibilityAdaptations: RitualAccessibilityAdaptation[];
}

// Creative expression for emotional processing
export interface CreativePractice {
  practiceId: string;
  creativeType: CreativeType;
  medium: CreativeMedium[];
  duration: number; // minutes
  
  // Creative process
  initialEmotion: string;
  creativeFlow: CreativeFlow[];
  expressiveElements: ExpressiveElement[];
  symbolicContent: SymbolicContent[];
  
  // Therapeutic aspects
  therapeuticGoals: TherapeuticGoal[];
  emotionalProcessing: CreativeEmotionalProcessing[];
  traumaProcessing: CreativeTraumaProcessing[];
  healingThroughArt: HealingThroughArt[];
  
  // Cultural expression
  culturalInfluences: CulturalCreativeInfluence[];
  traditionalArtForms: TraditionalArtForm[];
  ancestralCreativity: AncestralCreativity[];
  communityArtPractices: CommunityArtPractice[];
  
  // Outcomes and artifacts
  creativeArtifacts: CreativeArtifact[];
  emotionalBreakthroughs: CreativeBreakthrough[];
  insights: CreativeInsight[];
  sharingIntention: SharingIntention;
  
  // Integration
  dailyCreativePractice: DailyCreativePractice[];
  creativeRituals: CreativeRitual[];
  artisticGrowth: ArtisticGrowth[];
  
  effectiveness: number; // 0-1
  satisfaction: number; // 1-10
  therapeuticValue: number; // 1-10
}

// Comprehensive alchemy process for transformation
export interface AlchemyProcess {
  processId: string;
  alchemicalStage: AlchemicalStage;
  
  // Classical alchemy stages
  nigredo: NigredoProcess | null; // Blackening/decomposition/shadow work
  albedo: AlbedoProcess | null; // Whitening/purification/clarity
  citrinitas: CitrinitasProcess | null; // Yellowing/illumination/wisdom
  rubedo: RubedoProcess | null; // Reddening/integration/wholeness
  
  // Emotional alchemy
  emotionalMatter: EmotionalMatter; // Raw emotional material
  transformativeElements: TransformativeElement[];
  catalysts: AlchemicalCatalyst[];
  vessels: AlchemicalVessel[]; // Safe containers for transformation
  
  // Process dynamics
  dissolutionPhase: DissolutionPhase | null;
  coagulationPhase: CoagulationPhase | null;
  sublimationPhase: SublimationPhase | null;
  projectionPhase: ProjectionPhase | null;
  
  // Integration and embodiment
  embodimentPractices: EmbodimentPractice[];
  integrationRituals: IntegrationRitual[];
  wisdomDistillation: WisdomDistillation[];
  
  // Cultural alchemy
  culturalTransformation: CulturalTransformation[];
  ancestralAlchemy: AncestralAlchemy[];
  communityAlchemy: CommunityAlchemy[];
  
  // Measurement and tracking
  transformationDepth: number; // 0-1
  integrationLevel: number; // 0-1
  wisdomGained: number; // 0-1
  healingAchieved: number; // 0-1
  
  startDate: Date;
  currentPhase: string;
  completionDate?: Date;
  cyclic: boolean; // Whether this is part of a recurring cycle
}

// Pattern recognition and trajectory analysis
export interface EmotionalPattern {
  patternId: string;
  userId: string;
  patternType: PatternType;
  
  // Pattern characteristics
  triggers: PatternTrigger[];
  emotionalSequence: EmotionalSequence[];
  behavioralResponses: BehavioralResponse[];
  physicalManifestations: PhysicalManifestation[];
  
  // Temporal patterns
  timeOfDayPatterns: TimeOfDayPattern[];
  weeklyPatterns: WeeklyPattern[];
  monthlyPatterns: MonthlyPattern[];
  seasonalPatterns: SeasonalPattern[];
  lunarPatterns: LunarPattern[];
  
  // Environmental patterns
  locationPatterns: LocationPattern[];
  weatherPatterns: WeatherPattern[];
  socialPatterns: SocialPattern[];
  workPatterns: WorkPattern[];
  
  // Stress and wellness patterns
  stressPatterns: StressPattern[];
  recoveryPatterns: RecoveryPattern[];
  resilience: ResiliencePattern[];
  vulnerabilities: VulnerabilityPattern[];
  
  // Cultural and identity patterns
  culturalPatterns: CulturalPattern[];
  identityPatterns: IdentityPattern[];
  intergenerationalPatterns: IntergenerationalPattern[];
  
  // Growth and transformation patterns
  growthPatterns: GrowthPattern[];
  learningPatterns: LearningPattern[];
  breakthroughPatterns: BreakthroughPattern[];
  integrationPatterns: IntegrationPattern[];
  
  // AI analysis
  confidence: number; // 0-1 AI confidence in pattern
  severity: PatternSeverity;
  actionability: PatternActionability;
  interventionRecommendations: InterventionRecommendation[];
  
  // Pattern evolution
  patternEvolution: PatternEvolution[];
  patternInterruption: PatternInterruption[];
  patternTransformation: PatternTransformation[];
  
  firstDetected: Date;
  lastOccurrence: Date;
  frequency: PatternFrequency;
  isActive: boolean;
}

// AI insights and recommendations
export interface AIEmotionalInsight {
  insightId: string;
  entryId: string;
  userId: string;
  insightType: InsightType;
  
  // Core insight
  insight: string;
  confidence: number; // 0-1
  evidence: Evidence[];
  correlations: Correlation[];
  
  // Recommendations
  immediateRecommendations: ImmediateRecommendation[];
  longTermRecommendations: LongTermRecommendation[];
  practiceRecommendations: PracticeRecommendation[];
  
  // Emotional trajectory analysis
  trajectoryAnalysis: TrajectoryAnalysis;
  trendPrediction: TrendPrediction[];
  riskAssessment: RiskAssessment[];
  
  // Cultural sensitivity
  culturalContext: AIculturalContext;
  culturalAdaptations: AIculturalAdaptation[];
  culturalWisdomIntegration: CulturalWisdomIntegration[];
  
  // Trauma-informed considerations
  traumaInformedInsights: TraumaInformedInsight[];
  safetyConsiderations: SafetyConsideration[];
  gentleApproaches: GentleApproach[];
  
  // Community and support insights
  communitySupport: CommunitySupportInsight[];
  mentorshipNeeds: MentorshipNeed[];
  sharingOpportunities: SharingOpportunity[];
  
  // Integration and action
  actionSteps: ActionStep[];
  integrationPractices: IntegrationPractice[];
  followUpNeeded: boolean;
  followUpTimeline: string;
  
  generatedAt: Date;
  updatedAt: Date;
  userFeedback: AIInsightFeedback | null;
}

// Wellness metrics and tracking
export interface WellnessMetrics {
  metricsId: string;
  userId: string;
  assessmentDate: Date;
  
  // Core wellness dimensions
  emotionalWellness: EmotionalWellness;
  physicalWellness: PhysicalWellness;
  mentalWellness: MentalWellness;
  spiritualWellness: SpiritualWellness;
  socialWellness: SocialWellness;
  culturalWellness: CulturalWellness;
  
  // Resilience and adaptation
  resilience: ResilienceMetrics;
  adaptability: AdaptabilityMetrics;
  postTraumaticGrowth: PostTraumaticGrowthMetrics;
  stressManagement: StressManagementMetrics;
  
  // Practice integration
  practiceConsistency: PracticeConsistency;
  practiceEffectiveness: PracticeEffectiveness[];
  practiceEvolution: PracticeEvolution[];
  practicePersonalization: PracticePersonalization[];
  
  // Growth and development
  emotionalIntelligence: EmotionalIntelligenceMetrics;
  selfAwareness: SelfAwarenessMetrics;
  selfRegulation: SelfRegulationMetrics;
  empathy: EmpathyMetrics;
  
  // Community and relationship wellness
  relationshipQuality: RelationshipQualityMetrics;
  socialSupport: SocialSupportMetrics;
  communityConnection: CommunityConnectionMetrics;
  culturalBelonging: CulturalBelongingMetrics;
  
  // Long-term trends
  wellnessTrends: WellnessTrend[];
  improvementAreas: ImprovementArea[];
  strengthAreas: StrengthArea[];
  
  overallWellnessScore: number; // 0-1
  wellnessGrowthTrajectory: GrowthTrajectory;
  nextAssessmentDate: Date;
}

// Supporting interfaces for breathwork
export interface BreathworkTechnique {
  techniqueId: string;
  name: string;
  category: 'calming' | 'energizing' | 'balancing' | 'therapeutic' | 'spiritual' | 'cultural_traditional';
  description: string;
  instructions: BreathworkInstruction[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contraindications: string[];
  benefits: string[];
  culturalOrigin: string | null;
  scientificBasis: ScientificBasis[];
}

export interface BreathPattern {
  patternName: string;
  inhaleCount: number;
  holdAfterInhaleCount: number;
  exhaleCount: number;
  holdAfterExhaleCount: number;
  cycles: number;
  rhythm: 'steady' | 'accelerating' | 'decelerating' | 'variable';
}

export interface MovementType {
  typeId: string;
  name: string;
  category: 'therapeutic' | 'expressive' | 'cultural' | 'spiritual' | 'somatic' | 'creative';
  description: string;
  techniques: MovementTechnique[];
  culturalBackground: string | null;
  therapeuticApplications: string[];
  contraindications: string[];
}

export interface RitualType {
  typeId: string;
  name: string;
  tradition: 'personal' | 'cultural' | 'spiritual' | 'therapeutic' | 'nature_based' | 'ancestor_honoring';
  description: string;
  components: RitualComponent[];
  culturalConsiderations: string[];
  adaptations: RitualAdaptation[];
}

// Core emotion classifications
export type PrimaryEmotion = 
  | 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'disgust'
  | 'love' | 'shame' | 'guilt' | 'pride' | 'envy' | 'gratitude'
  | 'hope' | 'despair' | 'peace' | 'anxiety' | 'excitement' | 'boredom';

export type EmotionalIntensity = 'subtle' | 'moderate' | 'strong' | 'overwhelming';

export type AlchemicalStage = 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo' | 'integration';

export type PatternType = 
  | 'trigger_response' | 'daily_cycle' | 'weekly_cycle' | 'seasonal' 
  | 'stress_response' | 'recovery' | 'growth' | 'regression'
  | 'cultural' | 'relational' | 'environmental' | 'somatic';

export type InsightType = 
  | 'pattern_recognition' | 'emotional_trajectory' | 'practice_recommendation'
  | 'cultural_wisdom' | 'trauma_informed' | 'growth_opportunity'
  | 'risk_mitigation' | 'community_support' | 'integration_guidance';

// More supporting types would be defined here...

export interface EmotionalTrigger {
  triggerId: string;
  triggerType: 'external' | 'internal' | 'sensory' | 'cognitive' | 'somatic' | 'interpersonal';
  description: string;
  intensity: number; // 1-10
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  manageability: number; // 1-10
  culturalContext: string[];
  copingStrategies: CopingStrategy[];
}

export interface PhysicalSensation {
  sensationId: string;
  location: BodyLocation;
  sensationType: SensationType;
  intensity: number; // 1-10
  quality: SensationQuality[];
  duration: string;
  movement: SensationMovement;
  temperature: SensationTemperature;
  associatedEmotions: string[];
}

export interface ThoughtPattern {
  patternId: string;
  patternType: 'rumination' | 'catastrophizing' | 'black_white_thinking' | 'future_focused' | 'past_focused' | 'self_critical' | 'empowering' | 'grateful';
  content: string;
  frequency: number; // 1-10
  believability: number; // 1-10
  helpfulness: number; // 1-10
  culturalInfluences: string[];
  challengingThoughts: string[];
  alternativeThoughts: string[];
}

export interface EmotionalBreakthrough {
  breakthroughId: string;
  breakthroughType: 'insight' | 'release' | 'integration' | 'transformation' | 'healing' | 'connection' | 'empowerment';
  description: string;
  significanceLevel: number; // 1-10
  transformationDepth: number; // 0-1
  integrationNeeded: IntegrationNeed[];
  sharingDesire: SharingDesire;
  communityValue: number; // 0-1
  culturalSignificance: CulturalSignificance | null;
  ongoingImpact: OngoingImpact[];
}

export interface SupportReceived {
  supportId: string;
  supportType: 'peer' | 'community' | 'mentor' | 'professional' | 'ai' | 'cultural_elder' | 'spiritual_guide';
  supportProvider: string;
  supportContent: string;
  helpfulness: number; // 1-10
  culturalResonance: number; // 1-10
  timingAppropriate: boolean;
  followUpNeeded: boolean;
}

export interface WisdomShared {
  wisdomId: string;
  wisdomType: 'experiential' | 'cultural' | 'therapeutic' | 'spiritual' | 'practical' | 'intuitive';
  content: string;
  culturalContext: string[];
  applicability: string[];
  sharingLevel: 'private' | 'trusted_circle' | 'community' | 'anonymous';
  resonanceWithOthers: number; // 0-1
  healingPotential: number; // 0-1
}

// Additional supporting types would continue...

export type BodyLocation = 
  | 'head' | 'neck' | 'shoulders' | 'chest' | 'heart' | 'lungs' | 'stomach' 
  | 'abdomen' | 'back' | 'arms' | 'hands' | 'legs' | 'feet' | 'whole_body';

export type SensationType = 
  | 'pressure' | 'tension' | 'pain' | 'warmth' | 'cold' | 'tingling' 
  | 'numbness' | 'vibration' | 'lightness' | 'heaviness' | 'emptiness' | 'fullness';

export type SensationQuality = 
  | 'sharp' | 'dull' | 'throbbing' | 'pulsing' | 'burning' | 'aching' 
  | 'gentle' | 'intense' | 'flowing' | 'stuck' | 'expanding' | 'contracting';

export type MovementIntensity = 'gentle' | 'moderate' | 'vigorous' | 'adaptive';

export type CreativeType = 
  | 'visual_art' | 'music' | 'dance' | 'writing' | 'poetry' | 'sculpture' 
  | 'photography' | 'digital_art' | 'craft' | 'performance' | 'storytelling' | 'mixed_media';

export type CreativeMedium = string[]; // Specific materials or tools used

// Export all main types
export type {
  EmotionalEntry,
  EmotionalState,
  BreathworkSession,
  MovementSession,
  RitualSession,
  CreativePractice,
  AlchemyProcess,
  EmotionalPattern,
  AIEmotionalInsight,
  WellnessMetrics,
  BreathworkTechnique,
  MovementType,
  RitualType
};