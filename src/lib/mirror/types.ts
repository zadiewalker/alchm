export type MirrorTheme =
  | 'belonging'
  | 'purpose'
  | 'grief'
  | 'burnout'
  | 'trust'
  | 'selfWorth'
  | 'uncertainty'
  | 'connection'
  | 'identity'
  | 'creativity';

export type EmotionalLandscape =
  | 'recurringAnxiety'
  | 'persistentHope'
  | 'overwhelm'
  | 'resilience'
  | 'loneliness'
  | 'confidence';

export type IdentityNarrative =
  | 'caretaker'
  | 'achiever'
  | 'outsider'
  | 'creator'
  | 'seeker'
  | 'protector'
  | 'healer';

export type RecurringQuestion =
  | 'whatDoIWant'
  | 'amIEnough'
  | 'canITrustMyself'
  | 'whatMattersNow';

export type LifeTension =
  | 'safetyVsGrowth'
  | 'autonomyVsConnection'
  | 'certaintyVsPossibility'
  | 'acceptanceVsChange';

export type MirrorSignalKind =
  | 'theme'
  | 'emotionalLandscape'
  | 'identityNarrative'
  | 'recurringQuestion'
  | 'lifeTension';

export type MovementKind =
  | 'emergence'
  | 'intensification'
  | 'softening'
  | 'integration'
  | 'transformation'
  | 'recurrence'
  | 'resolution';

export type NarrativeSeason =
  | 'beginning'
  | 'uncertainty'
  | 'repetition'
  | 'turning'
  | 'integration'
  | 'quiet';

export type SynthesisKind =
  | 'themesInMotion'
  | 'questionsReturning'
  | 'shiftsInPerspective'
  | 'emotionalWeather'
  | 'emergingStories'
  | 'thingsBecomingClearer'
  | 'thingsStillUnfolding'
  | 'momentsOfTransformation'
  | 'recurringTensions'
  | 'evidenceOfGrowth';

export type MirrorConfidence = 'low' | 'moderate' | 'high';

export type MirrorScore = {
  score: number;
  evidenceCount: number;
  rationale: string[];
};

export type MirrorDerivedSource = {
  sessionId: string;
  kheperaReflectionId?: string;
  derivedFrom: 'kheperaReflection' | 'kheperaMemory' | 'continuityMetadata';
};

export type MirrorMemoryObservation = {
  id: string;
  observedAt: string;
  source: MirrorDerivedSource;
  themes: Partial<Record<MirrorTheme, MirrorScore>>;
  emotionalLandscapes: Partial<Record<EmotionalLandscape, MirrorScore>>;
  identityNarratives: Partial<Record<IdentityNarrative, MirrorScore>>;
  recurringQuestions: Partial<Record<RecurringQuestion, MirrorScore>>;
  lifeTensions: Partial<Record<LifeTension, MirrorScore>>;
  emotionalCharge: number;
  reflectiveClarity: number;
  ambiguity: number;
  confidence: MirrorConfidence;
};

export type MirrorFirestoreModel = {
  root: `users/${string}/mirror`;
  observations: `users/${string}/mirror/observations`;
  patterns: `users/${string}/mirror/patterns`;
  movements: `users/${string}/mirror/movements`;
  syntheses: `users/${string}/mirror/syntheses`;
};

export type MirrorPattern = {
  id: string;
  kind: MirrorSignalKind;
  key: string;
  label: string;
  firstSeenAt: string;
  lastSeenAt: string;
  observationIds: string[];
  evidenceStrength: number;
  recency: number;
  persistence: number;
  ambiguityScore: number;
  confidenceScore: number;
  confidence: MirrorConfidence;
  language: string;
};

export type MirrorMovement = {
  id: string;
  patternId: string;
  kind: MovementKind;
  observedAt: string;
  confidence: MirrorConfidence;
  evidence: string[];
  language: string;
};

export type NarrativeInterpretation = {
  id: string;
  season: NarrativeSeason;
  title: string;
  timeframeLabel: string;
  movements: MovementKind[];
  patternIds: string[];
  confidence: MirrorConfidence;
  language: string;
};

export type MirrorSynthesis = {
  id: string;
  kind: SynthesisKind;
  title: string;
  body: string;
  relatedPatternIds: string[];
  relatedMovementIds: string[];
  confidence: MirrorConfidence;
  safetyNotes: string[];
};

export type MirrorRetrievalPlan = {
  shouldRetrieve: boolean;
  observationIds: string[];
  patternIds: string[];
  rationale: string[];
};

export type MirrorEvaluationSignal =
  | 'recognitionMoment'
  | 'perceivedSelfUnderstanding'
  | 'emotionalResonance'
  | 'longitudinalUsefulness'
  | 'narrativeContinuity'
  | 'userTrust';
