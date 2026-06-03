import type { EmotionalTone, ThemeTag } from '@/types/journal';

export type KheperaScore = {
  score: number;
  evidence: string[];
};

export type KheperaRiskLevel = 'low' | 'elevated' | 'crisis';
export type KheperaConfidence = 'low' | 'moderate' | 'high';

export type EmotionalState =
  | 'grief'
  | 'shame'
  | 'anger'
  | 'anxiety'
  | 'overwhelm'
  | 'confusion'
  | 'hope'
  | 'numbness'
  | 'loneliness'
  | 'exhaustion'
  | 'relief';

export type NervousSystemState =
  | 'regulated'
  | 'mildlyActivated'
  | 'highlyActivated'
  | 'fight'
  | 'flight'
  | 'freeze'
  | 'shutdown'
  | 'dissociation';

export type CognitiveDynamic =
  | 'rumination'
  | 'catastrophizing'
  | 'perfectionism'
  | 'selfCriticism'
  | 'avoidance'
  | 'guiltSpiral'
  | 'blackAndWhiteThinking'
  | 'helplessness';

export type ReflectiveCapacity = 'minimal' | 'emerging' | 'available' | 'integrative';
export type Readiness =
  | 'validationOnly'
  | 'gentleCuriosity'
  | 'reframing'
  | 'challenge'
  | 'actionPlanning';

export type DominantNeed =
  | 'witnessing'
  | 'regulation'
  | 'compassion'
  | 'clarity'
  | 'perspective'
  | 'agency'
  | 'griefSupport'
  | 'identityExploration'
  | 'integration';

export type ProgressionState =
  | 'firstEncounter'
  | 'emergingPattern'
  | 'recurringPattern'
  | 'chronicLoop'
  | 'transformation'
  | 'integration';

export type InterventionFamily =
  | 'witnessing'
  | 'reflection'
  | 'compassion'
  | 'regulation'
  | 'exploration'
  | 'meaningMaking'
  | 'gentleChallenge'
  | 'integration'
  | 'agencyActivation'
  | 'identityDevelopment'
  | 'growthReinforcement';

export type ResponseForm =
  | 'conciseReflection'
  | 'extendedWitnessing'
  | 'exploratoryDialogue'
  | 'narrativeInterpretation'
  | 'groundingResponse'
  | 'insightSynthesis'
  | 'patternSummary'
  | 'compassionateConfrontation'
  | 'futureOrientedReflection';

export type LengthBand = 'brief' | 'medium' | 'spacious';
export type EmotionalPosture = 'closeWitness' | 'steadyContainer' | 'curiousMirror' | 'warmIntegrator' | 'firmGentle';
export type ChallengeLevel = 'none' | 'low' | 'moderate';
export type ReflectionLevel = 'close' | 'patternAware' | 'integrative';

export type PsychologicalStateAssessment = {
  emotionalState: Record<EmotionalState, KheperaScore>;
  nervousSystemState: Record<NervousSystemState, KheperaScore>;
  cognitiveDynamics: Record<CognitiveDynamic, KheperaScore>;
  reflectiveCapacity: Record<ReflectiveCapacity, KheperaScore>;
  readiness: Record<Readiness, KheperaScore>;
  dominantNeed: Record<DominantNeed, KheperaScore>;
  riskLevel: KheperaRiskLevel;
  confidence: KheperaConfidence;
};

export type LongitudinalPattern = {
  id: string;
  themes: ThemeTag[];
  emotionalTone?: EmotionalTone;
  selfBelief?: string;
  wound?: string;
  trigger?: string;
  stuckPoint?: string;
  growthEvidence?: string;
  breakthroughSignificance?: number;
  unresolvedLoopSignificance?: number;
  recurrenceCount: number;
  lastSeenAt?: string;
  userStatedImportance?: number;
  progressionState: ProgressionState;
};

export type PatternIntelligenceResult = {
  progressionState: ProgressionState;
  relevantPatterns: LongitudinalPattern[];
  rationale: string[];
  confidence: KheperaConfidence;
};

export type ResponseVarietyMetadata = {
  interventionFamily: InterventionFamily;
  responseForm: ResponseForm;
  emotionalPosture: EmotionalPosture;
  questionCount: 0 | 1;
  lengthBand: LengthBand;
  usesDirectAdvice: false;
  usesMemory: boolean;
  challengeLevel: ChallengeLevel;
  reflectionLevel: ReflectionLevel;
};

export type InterventionDecision = {
  selectedIntervention: InterventionFamily;
  rejectedInterventions: Array<{
    intervention: InterventionFamily;
    reason: string;
  }>;
  rationale: string[];
  riskConsiderations: string[];
  confidence: KheperaConfidence;
  responseFormRecommendation: ResponseForm;
  varietyMetadata: ResponseVarietyMetadata;
};

export type MemoryCandidate = {
  id: string;
  themes: ThemeTag[];
  emotionalTone?: EmotionalTone;
  progressionState: ProgressionState;
  recurrenceCount: number;
  lastSeenAt?: string;
  breakthroughSignificance?: number;
  unresolvedLoopSignificance?: number;
  userStatedImportance?: number;
};

export type RankedMemoryCandidate = MemoryCandidate & {
  retrievalScore: number;
  rankingFactors: string[];
};

export type MemoryRetrievalPlan = {
  shouldRetrieve: boolean;
  rankedMemories: RankedMemoryCandidate[];
  rationale: string[];
};

export type KheperaCognitionInput = {
  entryText: string;
  crisisDetected?: boolean;
  currentTone?: EmotionalTone;
  currentThemes?: ThemeTag[];
  longitudinalPatterns?: LongitudinalPattern[];
  memoryCandidates?: MemoryCandidate[];
  recentResponses?: ResponseVarietyMetadata[];
};

export type KheperaPromptPlan = {
  currentEntryPolicy: 'raw-entry-for-provider-only';
  assessment: PsychologicalStateAssessment;
  patternIntelligence: PatternIntelligenceResult;
  memoryRetrieval: MemoryRetrievalPlan;
  interventionDecision: InterventionDecision;
  safetyConstraints: string[];
  varietyConstraints: string[];
  promptSummary: string;
};
