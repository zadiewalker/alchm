// ALCHM Pathways Schema - Soul-Centered Systems Architecture
// Transformative SEL engine with AI-augmented rites of passage

export interface SELCompetencyScore {
  selfAwareness: number;        // 0-100 scale
  selfManagement: number;       // 0-100 scale
  socialAwareness: number;      // 0-100 scale
  relationshipSkills: number;   // 0-100 scale
  responsibleDecisionMaking: number; // 0-100 scale
}

export interface PathwayStepProgress {
  status: 'not_started' | 'started' | 'in_progress' | 'completed' | 'unlocked';
  reflections: string[];        // Document references
  aiInsights: string[];         // AI-generated insights
  journalEntries: string[];     // Journal entry references
  badges: string[];             // Earned badges for this step
  timestamp: Date;
  completionScore: number;      // 0-100 completion quality
  engagementTimeMs: number;     // Time spent on step
  retryCount: number;           // Number of attempts
  lastAccessedAt: Date;
}

export interface PathwayProgress {
  id: string;
  userId: string;
  pathwayTemplateId: string;
  currentStep: string;
  stepProgress: Record<string, PathwayStepProgress>;
  isCompleted: boolean;
  isPaused: boolean;
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  engagementScore: number;      // Overall pathway engagement
  SELCompetencyScore: SELCompetencyScore;
  culturalContext: CulturalContext;
  personalizedElements: PersonalizedElement[];
  milestones: PathwayMilestone[];
  nextRecommendedPathway?: string;
  totalTimeSpentMs: number;
  completionRate: number;       // Percentage completed
  lastActiveAt: Date;
}

export interface CulturalContext {
  primaryLanguage: string;
  culturalBackground: string[];
  communicationStyle: 'direct' | 'indirect' | 'high_context' | 'low_context';
  valueSystem: string[];        // e.g., ['collectivist', 'family_centered', 'achievement_oriented']
  religiousSpiritual?: string;
  socioeconomicFactors: string[];
}

export interface PersonalizedElement {
  elementType: 'prompt_tone' | 'example_scenario' | 'cultural_reference' | 'language_adaptation';
  originalContent: string;
  personalizedContent: string;
  adaptationReason: string;
  confidenceScore: number;
}

export interface PathwayMilestone {
  id: string;
  stepId: string;
  type: 'breakthrough' | 'reflection_depth' | 'insight_connection' | 'behavior_shift';
  title: string;
  description: string;
  achievedAt: Date;
  impactScore: number;         // Measured impact on SEL growth
  celebrationMessage: string;
}

// Pathway Template System
export interface PathwayTemplate {
  id: string;
  title: string;
  description: string;
  category: PathwayCategory;
  targetAge: AgeGroup;
  culturalAdaptations: string[];
  estimatedDurationMinutes: number;
  difficultyLevel: 'foundation' | 'exploration' | 'integration' | 'mastery';
  prerequisitePathways: string[];
  SELCompetencyFocus: Partial<SELCompetencyScore>;
  steps: PathwayStep[];
  tags: string[];
  isActive: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PathwayStep {
  id: string;
  order: number;
  title: string;
  type: StepType;
  estimatedDurationMinutes: number;
  content: StepContent;
  aiPrompts: AIPromptConfig;
  triggers: StepTrigger[];
  validationCriteria: ValidationCriteria;
  adaptiveElements: AdaptiveElement[];
  unlockConditions: UnlockCondition[];
  isOptional: boolean;
}

export type PathwayCategory = 
  | 'self_discovery'
  | 'emotional_regulation'
  | 'social_connection'
  | 'purpose_exploration'
  | 'resilience_building'
  | 'leadership_development'
  | 'cultural_identity'
  | 'trauma_informed'
  | 'crisis_support';

export type AgeGroup = 
  | 'early_adolescent'    // 11-14
  | 'mid_adolescent'      // 15-17
  | 'late_adolescent'     // 18-21
  | 'young_adult';        // 22-25

export type StepType = 
  | 'reflection_prompt'
  | 'guided_meditation'
  | 'creative_expression'
  | 'peer_interaction'
  | 'mentor_dialogue'
  | 'skill_practice'
  | 'insight_synthesis'
  | 'action_planning'
  | 'progress_celebration';

export interface StepContent {
  primaryPrompt: string;
  contextualPrompts: Record<string, string>; // Cultural/situational variations
  supportingMedia?: MediaContent[];
  interactiveElements: InteractiveElement[];
  reflectionQuestions: ReflectionQuestion[];
  examples: ExampleScenario[];
}

export interface MediaContent {
  type: 'image' | 'audio' | 'video' | 'animation';
  url: string;
  altText?: string;
  culturalContext?: string;
  emotionalTone: string;
}

export interface InteractiveElement {
  type: 'slider' | 'choice_selection' | 'text_input' | 'draw_canvas' | 'mood_picker' | 'timeline';
  configuration: Record<string, any>;
  validationRules?: ValidationRule[];
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  type: 'open_ended' | 'scale_rating' | 'multiple_choice' | 'ranking';
  isRequired: boolean;
  culturalAdaptations: Record<string, string>;
  followUpLogic?: FollowUpLogic;
}

export interface ExampleScenario {
  id: string;
  scenario: string;
  culturalContext: string;
  ageAppropriate: AgeGroup[];
  outcomeExample: string;
  learningObjective: string;
}

export interface AIPromptConfig {
  geminiPrompts: GeminiPromptSet;
  gptPrompts: GPTPromptSet;
  orchestrationLogic: OrchestrationRule[];
  adaptivePrompting: AdaptivePromptConfig;
}

export interface GeminiPromptSet {
  moodAnalysis: string;
  biasDetection: string;
  SELScoring: string;
  culturalSensitivity: string;
  safetyAssessment: string;
}

export interface GPTPromptSet {
  mentorPrompt: string;
  mirrorPrompt: string;      // Reflective coaching
  visionaryPrompt: string;   // Future-focused guidance
  contextualPrompt: string;  // Situational adaptation
  encouragementPrompt: string;
}

export interface OrchestrationRule {
  condition: string;         // When to trigger
  aiProvider: 'gemini' | 'gpt';
  promptType: string;
  parameters: Record<string, any>;
  successCriteria: string;
  fallbackAction: string;
}

export interface AdaptivePromptConfig {
  personalityAdaptation: boolean;
  culturalAdaptation: boolean;
  progressBasedAdaptation: boolean;
  moodBasedAdaptation: boolean;
  learningStyleAdaptation: boolean;
}

export interface StepTrigger {
  type: 'time_based' | 'completion_based' | 'mood_based' | 'engagement_based';
  condition: string;
  action: TriggerAction;
}

export interface TriggerAction {
  type: 'unlock_step' | 'send_notification' | 'adjust_difficulty' | 'provide_support';
  parameters: Record<string, any>;
}

export interface ValidationCriteria {
  minimumWordCount?: number;
  requiredElements: string[];
  qualityThresholds: QualityThreshold[];
  timeRequirements: TimeRequirement;
}

export interface QualityThreshold {
  metric: 'reflection_depth' | 'emotional_awareness' | 'insight_connection';
  minimumScore: number;
  measurementMethod: string;
}

export interface TimeRequirement {
  minimumSeconds: number;
  maximumSeconds?: number;
  optimalRange: [number, number];
}

export interface AdaptiveElement {
  elementId: string;
  adaptationType: 'difficulty' | 'tone' | 'cultural' | 'length' | 'interactivity';
  baselineValue: any;
  adaptationRules: AdaptationRule[];
}

export interface AdaptationRule {
  condition: string;
  adjustedValue: any;
  confidence: number;
  explanation: string;
}

export interface UnlockCondition {
  type: 'previous_step_completed' | 'score_threshold' | 'time_elapsed' | 'external_trigger';
  requirement: string;
  parameters: Record<string, any>;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min_length' | 'max_length' | 'pattern' | 'custom';
  value: any;
  errorMessage: string;
}

export interface FollowUpLogic {
  conditions: Record<string, string>;
  followUpQuestions: Record<string, string>;
  aiPromptAdjustments: Record<string, string>;
}

// AI Analysis Results
export interface PathwayAIInsight {
  id: string;
  userId: string;
  pathwayId: string;
  stepId: string;
  insightType: InsightType;
  content: string;
  confidence: number;
  timestamp: Date;
  aiProvider: 'gemini' | 'gpt' | 'hybrid';
  triggers: string[];           // What triggered this insight
  recommendations: Recommendation[];
  emotionalState: EmotionalState;
  SELGrowthIndicators: SELGrowthIndicator[];
  culturalConsiderations: string[];
}

export type InsightType = 
  | 'emotional_pattern'
  | 'growth_opportunity'
  | 'strength_identification'
  | 'behavior_prediction'
  | 'intervention_suggestion'
  | 'celebration_moment'
  | 'support_needed';

export interface Recommendation {
  type: 'next_step' | 'skill_practice' | 'reflection_prompt' | 'external_resource';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedImpact: number;
  timeframe: string;
  actionItems: string[];
}

export interface EmotionalState {
  primaryEmotion: string;
  intensity: number;           // 0-10 scale
  valence: number;            // -1 to 1 (negative to positive)
  arousal: number;            // 0-1 (calm to excited)
  complexity: number;         // 0-1 (simple to complex emotions)
  regulation: number;         // 0-1 (dysregulated to well-regulated)
}

export interface SELGrowthIndicator {
  competency: keyof SELCompetencyScore;
  growthDirection: 'improving' | 'maintaining' | 'declining';
  growthRate: number;         // Rate of change
  evidence: string[];         // What indicates this growth
  nextMilestone: string;
  supportStrategy: string;
}

// Pathway Analytics
export interface PathwayAnalytics {
  pathwayId: string;
  userId: string;
  sessionMetrics: SessionMetric[];
  engagementPatterns: EngagementPattern[];
  learningVelocity: LearningVelocity;
  dropOffPoints: DropOffPoint[];
  breakthroughMoments: BreakthroughMoment[];
  culturalResonance: CulturalResonance;
  aiEffectiveness: AIEffectiveness;
}

export interface SessionMetric {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  stepsCompleted: string[];
  averageEngagement: number;
  emotionalJourney: EmotionalState[];
  interactionQuality: number;
}

export interface EngagementPattern {
  timeOfDay: string;
  dayOfWeek: string;
  durationMinutes: number;
  qualityScore: number;
  completionRate: number;
  moodBefore: number;
  moodAfter: number;
}

export interface LearningVelocity {
  conceptAcquisition: number;     // How quickly new concepts are grasped
  skillApplication: number;       // How quickly skills are applied
  insightIntegration: number;     // How quickly insights are integrated
  overallPace: 'slow' | 'steady' | 'accelerated' | 'variable';
}

export interface DropOffPoint {
  stepId: string;
  timestamp: Date;
  durationBeforeDropOff: number;
  lastInteraction: string;
  possibleCauses: string[];
  recoveryStrategies: string[];
}

export interface BreakthroughMoment {
  stepId: string;
  timestamp: Date;
  insightType: string;
  emotionalShift: number;        // Magnitude of emotional change
  SELGrowthJump: Partial<SELCompetencyScore>;
  userExpression: string;        // How user expressed the breakthrough
  impactPrediction: number;      // Predicted long-term impact
}

export interface CulturalResonance {
  alignmentScore: number;        // How well pathway aligns with user's culture
  adaptationEffectiveness: number;
  culturalElementsEngagement: Record<string, number>;
  misalignmentPoints: string[];
  improvementSuggestions: string[];
}

export interface AIEffectiveness {
  geminiPerformance: AIProviderMetrics;
  gptPerformance: AIProviderMetrics;
  orchestrationSuccess: number;
  userSatisfactionWithAI: number;
  aiResponseRelevance: number;
  culturalSensitivityScore: number;
}

export interface AIProviderMetrics {
  responseQuality: number;
  responseTime: number;
  culturalSensitivity: number;
  userEngagement: number;
  insightAccuracy: number;
  safetyCompliance: number;
}

// Export all types for easy importing
export * from './pathways-schema';