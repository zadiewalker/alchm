// ALCHM IKIGAI Digital Bootcamp - Schema & Types
// AI-powered Life Purpose Mapping with TT6 trauma-informed design

export interface IKIGAISession {
  id: string;
  userId: string;
  sessionNumber: number;
  sessionType: 'discovery' | 'deep_dive' | 'synthesis' | 'action_planning' | 'reflection_review';
  responses: IKIGAIResponses;
  AIMap: IKIGAIAIMap;
  alignmentScore: number;
  reflectionsLinked: string[]; // Document references
  culturalContext: CulturalAdaptation;
  traumaInformedNotes: TraumaInformedNote[];
  progressMetrics: IKIGAIProgressMetrics;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  isActive: boolean;
  nextSessionSuggested?: Date;
}

export interface IKIGAIResponses {
  passions: PassionResponse[];
  skills: SkillResponse[];
  values: ValueResponse[];
  opportunities: OpportunityResponse[];
  intersections: IntersectionMapping;
  confidenceScores: ConfidenceScores;
  emotionalResonance: EmotionalResonanceData;
}

export interface PassionResponse {
  id: string;
  text: string;
  intensity: number;          // 1-10 scale
  frequency: number;          // How often they engage (1-10)
  timeOrigin: string;        // When this passion emerged
  culturalInfluence: string; // Cultural context influence
  emotionalState: string;    // How they feel when doing this
  growthPotential: number;   // 1-10 perceived growth potential
  barriers: string[];        // What prevents deeper engagement
  supportNetwork: string[];  // Who supports this passion
  aiInsights: string[];      // AI-generated insights about this passion
  clusterAssignment?: string; // Which AI cluster this belongs to
}

export interface SkillResponse {
  id: string;
  text: string;
  proficiencyLevel: number;   // 1-10 current skill level
  acquisitionSource: string;  // How they learned this skill
  applicationContext: string[]; // Where they use this skill
  improvementDesire: number;  // 1-10 desire to improve
  teachingAbility: number;    // 1-10 ability to teach others
  marketValue: number;        // 1-10 perceived market value
  personalSatisfaction: number; // 1-10 satisfaction when using
  developmentPath: string[];  // How they could develop further
  culturalRecognition: string; // How their culture values this skill
  aiInsights: string[];       // AI-generated insights
  clusterAssignment?: string;
}

export interface ValueResponse {
  id: string;
  text: string;
  importance: number;         // 1-10 personal importance
  livingAlignment: number;    // 1-10 how well they live this value
  culturalAlignment: number;  // 1-10 alignment with cultural values
  familyAlignment: number;    // 1-10 alignment with family values
  conflicts: string[];        // Where this value conflicts with others
  expressions: string[];      // How they express this value
  challenges: string[];       // Challenges in living this value
  support: string[];          // What supports living this value
  evolution: string;          // How this value has evolved
  aiInsights: string[];       // AI-generated insights
  clusterAssignment?: string;
}

export interface OpportunityResponse {
  id: string;
  text: string;
  feasibility: number;        // 1-10 perceived feasibility
  impact: number;            // 1-10 potential positive impact
  timeframe: string;         // Short, medium, long-term
  requiredResources: string[]; // What resources are needed
  barriers: string[];        // What prevents pursuing this
  supporters: string[];      // Who would support this
  culturalReceptivity: number; // 1-10 cultural acceptance
  personalReadiness: number;  // 1-10 personal readiness
  learningRequired: string[]; // What they'd need to learn
  riskFactors: string[];     // Potential risks
  aiInsights: string[];      // AI-generated insights
  clusterAssignment?: string;
}

export interface IntersectionMapping {
  passionSkill: IntersectionPoint[];
  passionValue: IntersectionPoint[];
  passionOpportunity: IntersectionPoint[];
  skillValue: IntersectionPoint[];
  skillOpportunity: IntersectionPoint[];
  valueOpportunity: IntersectionPoint[];
  centralIntersection: CentralIntersection[];
}

export interface IntersectionPoint {
  element1Id: string;
  element2Id: string;
  connectionStrength: number; // 0-1 AI-calculated strength
  connectionType: 'natural' | 'developed' | 'potential' | 'conflicting';
  insights: string[];
  actionSuggestions: string[];
  culturalConsiderations: string[];
  developmentOpportunities: string[];
}

export interface CentralIntersection {
  id: string;
  passionId: string;
  skillId: string;
  valueId: string;
  opportunityId: string;
  synergy: number;           // 0-1 AI-calculated synergy score
  description: string;       // AI-generated description
  actionPlan: ActionPlan;
  risks: string[];
  supports: string[];
  timeHorizon: string;
  culturalFit: number;       // 0-1 cultural alignment
  personalReadiness: number; // 0-1 readiness assessment
}

export interface ActionPlan {
  immediateSteps: ActionStep[];
  shortTermGoals: ActionStep[];
  longTermVision: string;
  milestones: Milestone[];
  resources: ResourceNeed[];
  support: SupportNeed[];
  metrics: SuccessMetric[];
}

export interface ActionStep {
  id: string;
  description: string;
  timeframe: string;
  difficulty: number;        // 1-10
  importance: number;        // 1-10
  dependencies: string[];    // Other steps this depends on
  resources: string[];       // Required resources
  culturalConsiderations: string[];
  traumaInformedNotes: string[];
  successCriteria: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  successMetrics: string[];
  celebrationPlan: string;
  culturalSignificance: string;
}

export interface ResourceNeed {
  type: 'financial' | 'educational' | 'social' | 'cultural' | 'emotional' | 'technological';
  description: string;
  priority: 'high' | 'medium' | 'low';
  availability: number;      // 0-1 current availability
  acquisitionPlan: string;
  culturalAccess: string;
}

export interface SupportNeed {
  type: 'mentorship' | 'peer' | 'family' | 'community' | 'professional' | 'cultural';
  description: string;
  currentLevel: number;      // 0-1 current support level
  idealLevel: number;        // 0-1 ideal support level
  acquisitionStrategy: string;
  culturalConsiderations: string[];
}

export interface SuccessMetric {
  id: string;
  description: string;
  measurementMethod: string;
  frequency: string;         // How often to measure
  target: string;           // Target outcome
  baseline: string;         // Current baseline
  culturallyRelevant: boolean;
}

export interface ConfidenceScores {
  passionsConfidence: number;     // 0-1
  skillsConfidence: number;       // 0-1
  valuesConfidence: number;       // 0-1
  opportunitiesConfidence: number; // 0-1
  overallConfidence: number;      // 0-1
  readinessForAction: number;     // 0-1
}

export interface EmotionalResonanceData {
  dominantEmotions: string[];
  emotionalIntensity: number;     // 0-1
  emotionalClarity: number;       // 0-1
  emotionalConflicts: string[];
  emotionalSupports: string[];
  emotionalGrowthAreas: string[];
  culturalEmotionalContext: string[];
}

export interface IKIGAIAIMap {
  clusters: IKIGAICluster[];
  synthesisText: string;
  recommendedActions: RecommendedAction[];
  visualElements: VisualElement[];
  connectionStrengths: ConnectionStrength[];
  insights: AIInsight[];
  personalityAlignment: PersonalityAlignment;
  culturalAlignment: CulturalAlignment;
  developmentTrajectory: DevelopmentTrajectory;
}

export interface IKIGAICluster {
  id: string;
  name: string;
  type: 'passion' | 'skill' | 'value' | 'opportunity' | 'intersection';
  elements: string[];           // IDs of elements in this cluster
  centroid: ClusterCentroid;
  coherenceScore: number;       // 0-1 how coherent the cluster is
  culturalResonance: number;    // 0-1 cultural alignment
  developmentPotential: number; // 0-1 potential for growth
  actionability: number;        // 0-1 how actionable this cluster is
  description: string;
  insights: string[];
  recommendations: string[];
}

export interface ClusterCentroid {
  passionWeight: number;
  skillWeight: number;
  valueWeight: number;
  opportunityWeight: number;
  emotionalResonance: number;
  culturalFit: number;
  feasibility: number;
  impact: number;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  category: 'exploration' | 'skill_development' | 'value_alignment' | 'opportunity_pursuit';
  difficulty: number;           // 1-10
  impact: number;              // 1-10
  culturalFit: number;         // 0-1
  traumaInformed: boolean;
  prerequisites: string[];
  steps: ActionStep[];
  resources: ResourceNeed[];
  support: SupportNeed[];
  successMetrics: SuccessMetric[];
  risks: string[];
  mitigations: string[];
}

export interface VisualElement {
  id: string;
  type: 'node' | 'edge' | 'cluster' | 'annotation';
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: VisualStyle;
  data: any;
  metadata: VisualMetadata;
}

export interface VisualStyle {
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  fontWeight: string;
  opacity: number;
  culturalTheme?: string;
}

export interface VisualMetadata {
  elementId: string;
  elementType: string;
  importance: number;
  connectionCount: number;
  culturalSignificance: number;
  animationTriggers: string[];
}

export interface ConnectionStrength {
  fromId: string;
  toId: string;
  strength: number;             // 0-1
  type: 'synergistic' | 'complementary' | 'conflicting' | 'neutral';
  confidence: number;           // 0-1 AI confidence in this connection
  evidence: string[];           // Evidence for this connection
  developmentOpportunity: boolean;
  culturalRelevance: number;    // 0-1
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'gap' | 'opportunity' | 'strength' | 'challenge' | 'cultural' | 'development';
  title: string;
  description: string;
  confidence: number;           // 0-1
  impact: number;              // 0-1
  actionability: number;        // 0-1
  evidence: string[];
  recommendations: string[];
  culturalConsiderations: string[];
  traumaInformedNotes: string[];
  timeHorizon: string;
}

export interface PersonalityAlignment {
  traits: PersonalityTrait[];
  alignmentScore: number;       // 0-1
  strengths: string[];
  growthAreas: string[];
  workingStyles: string[];
  communicationPreferences: string[];
  culturalPersonalityFactors: string[];
}

export interface PersonalityTrait {
  name: string;
  score: number;               // 0-1
  description: string;
  culturalExpression: string;
  developmentOpportunities: string[];
}

export interface CulturalAlignment {
  overallAlignment: number;     // 0-1
  valueAlignment: number;       // 0-1
  opportunityAlignment: number; // 0-1
  expressionAlignment: number;  // 0-1
  familyAlignment: number;      // 0-1
  communityAlignment: number;   // 0-1
  gaps: CulturalGap[];
  bridges: CulturalBridge[];
  adaptations: CulturalAdaptation[];
}

export interface CulturalGap {
  area: string;
  description: string;
  impact: number;              // 0-1
  bridging_strategies: string[];
  timeline: string;
}

export interface CulturalBridge {
  description: string;
  strength: number;            // 0-1
  leverageOpportunities: string[];
  amplificationStrategies: string[];
}

export interface CulturalAdaptation {
  area: string;
  originalElement: string;
  adaptedElement: string;
  rationale: string;
  culturalResonance: number;   // 0-1
  effectiveness: number;       // 0-1
}

export interface DevelopmentTrajectory {
  currentPhase: string;
  nextPhase: string;
  trajectoryPath: TrajectoryPhase[];
  timeHorizon: string;
  keyTransitions: Transition[];
  milestones: Milestone[];
  potentialChallenges: Challenge[];
  successFactors: SuccessFactor[];
}

export interface TrajectoryPhase {
  name: string;
  description: string;
  duration: string;
  keyActivities: string[];
  expectedOutcomes: string[];
  requirements: string[];
  risks: string[];
  supports: string[];
}

export interface Transition {
  from: string;
  to: string;
  triggers: string[];
  requirements: string[];
  support_needed: string[];
  timeline: string;
  success_indicators: string[];
}

export interface Challenge {
  type: string;
  description: string;
  likelihood: number;          // 0-1
  impact: number;             // 0-1
  mitigation_strategies: string[];
  cultural_considerations: string[];
  support_resources: string[];
}

export interface SuccessFactor {
  factor: string;
  importance: number;          // 0-1
  current_level: number;       // 0-1
  development_plan: string;
  measurement_method: string;
  cultural_relevance: string;
}

export interface IKIGAIProgressMetrics {
  sessionProgress: number;     // 0-1 completion of current session
  overallProgress: number;     // 0-1 completion of bootcamp
  clarityIncrease: number;     // Change since last session
  confidenceIncrease: number;  // Change since last session
  actionTaken: number;         // 0-1 how much action taken
  engagementScore: number;     // 0-1 engagement with process
  culturalResonance: number;   // 0-1 cultural fit of insights
  timeSpent: number;          // Minutes spent in session
  reflectionDepth: number;     // 0-1 depth of reflections
  aiUtilization: number;      // 0-1 how much AI was used/helpful
}

export interface TraumaInformedNote {
  type: 'safety_check' | 'trigger_warning' | 'choice_emphasis' | 'strength_focus' | 'cultural_safety';
  content: string;
  severity: 'info' | 'caution' | 'important' | 'critical';
  actionRequired: boolean;
  culturalConsiderations: string[];
  supportResources: string[];
  followUpRequired: boolean;
}

// Bootcamp Session Flow Types
export interface IKIGAIBootcamp {
  id: string;
  userId: string;
  startedAt: Date;
  expectedCompletionDate: Date;
  actualCompletionDate?: Date;
  sessions: IKIGAISession[];
  overallProgress: number;     // 0-1
  masterMap: IKIGAIAIMap;     // Synthesized across all sessions
  personalGrowthPlan: PersonalGrowthPlan;
  culturalIntegrationPlan: CulturalIntegrationPlan;
  isActive: boolean;
  pausedAt?: Date;
  completionCertificate?: CompletionCertificate;
}

export interface PersonalGrowthPlan {
  vision: string;
  coreValues: string[];
  keyStrengths: string[];
  developmentAreas: string[];
  shortTermGoals: Goal[];
  mediumTermGoals: Goal[];
  longTermVision: string;
  actionPlan: ActionPlan;
  supportSystem: SupportSystem;
  measurementPlan: MeasurementPlan;
}

export interface Goal {
  id: string;
  description: string;
  category: string;
  priority: number;            // 1-10
  timeframe: string;
  successCriteria: string[];
  obstacles: string[];
  resources: string[];
  support: string[];
  culturalAlignment: number;   // 0-1
  ikigaiAlignment: number;     // 0-1
}

export interface SupportSystem {
  mentors: SupportPerson[];
  peers: SupportPerson[];
  family: SupportPerson[];
  community: SupportPerson[];
  professional: SupportPerson[];
  cultural: SupportPerson[];
}

export interface SupportPerson {
  relationship: string;
  supportType: string[];
  availability: string;
  culturalConnection: string;
  contactInformation?: string;
}

export interface MeasurementPlan {
  metrics: SuccessMetric[];
  checkInFrequency: string;
  assessmentMethods: string[];
  feedbackSources: string[];
  adjustmentTriggers: string[];
  culturalMeasurements: string[];
}

export interface CulturalIntegrationPlan {
  culturalStrengths: string[];
  culturalChallenges: string[];
  bridgingStrategies: string[];
  communityEngagement: string[];
  culturalMentorship: string[];
  traditionIntegration: string[];
  modernAdaptation: string[];
}

export interface CompletionCertificate {
  issuedAt: Date;
  uniqueId: string;
  achievements: string[];
  keyInsights: string[];
  personalizedMessage: string;
  culturalRecognition: string;
  nextSteps: string[];
  continuingEducation: string[];
}

// Analytics and Reporting Types
export interface IKIGAIAnalytics {
  sessionId: string;
  userId: string;
  timestamp: Date;
  eventType: 'session_start' | 'quadrant_complete' | 'insight_generated' | 'action_planned' | 'session_complete';
  data: Record<string, any>;
  aiProviderUsed: 'gemini' | 'gpt' | 'hybrid';
  culturalContext: string[];
  engagementMetrics: EngagementMetrics;
  outcomeMetrics: OutcomeMetrics;
}

export interface EngagementMetrics {
  timeSpent: number;
  interactionCount: number;
  reflectionDepth: number;     // 0-1
  aiUtilization: number;       // 0-1
  completionRate: number;      // 0-1
  returnRate: number;          // 0-1
}

export interface OutcomeMetrics {
  clarityIncrease: number;
  confidenceIncrease: number;
  actionPlanning: number;      // 0-1
  culturalAlignment: number;   // 0-1
  goalAlignment: number;       // 0-1
  wellbeingImpact: number;     // 0-1
}

// Component Props Types for React Components
export interface IKIGAIQuadrantProps {
  quadrantType: 'passions' | 'skills' | 'values' | 'opportunities';
  responses: PassionResponse[] | SkillResponse[] | ValueResponse[] | OpportunityResponse[];
  onResponseUpdate: (responses: any[]) => void;
  culturalContext: CulturalAdaptation;
  traumaInformedMode: boolean;
  aiAssistanceEnabled: boolean;
  isCompleted: boolean;
}

export interface IKIGAIMapProps {
  aiMap: IKIGAIAIMap;
  interactive: boolean;
  showInsights: boolean;
  culturalTheme: string;
  onElementClick?: (element: VisualElement) => void;
  onConnectionExplore?: (connection: ConnectionStrength) => void;
  animationEnabled: boolean;
}

export interface IKIGAISessionProps {
  session: IKIGAISession;
  bootcamp: IKIGAIBootcamp;
  onSessionUpdate: (session: IKIGAISession) => void;
  onSessionComplete: (session: IKIGAISession) => void;
  culturalContext: CulturalAdaptation;
  userPreferences: UserPreferences;
}

export interface UserPreferences {
  aiAssistanceLevel: 'minimal' | 'moderate' | 'extensive';
  culturalAdaptation: 'automatic' | 'guided' | 'manual';
  traumaInformedMode: boolean;
  reflectionDepth: 'surface' | 'moderate' | 'deep';
  sessionPacing: 'fast' | 'moderate' | 'contemplative';
  visualStyle: 'minimalist' | 'standard' | 'rich';
  languageSupport: string;
  accessibilityNeeds: string[];
}

// Export all types for easy importing
export * from './ikigai-schema';