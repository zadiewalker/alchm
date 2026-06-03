import type { InterventionFamily, ResponseForm } from '@/lib/khepera/cognition/types';
import type { MirrorTheme, MovementKind, SynthesisKind } from '@/lib/mirror/types';

export type ContainerLensId =
  | 'self-compassion'
  | 'burnout-recovery'
  | 'identity-transition'
  | 'belonging';

export type ContainerRelationshipState =
  | 'entering'
  | 'dwelling'
  | 'deepening'
  | 'resting'
  | 'returning'
  | 'integrating'
  | 'revisiting';

export type ContainerPresenceQuality =
  | 'spacious'
  | 'gentle'
  | 'restorative'
  | 'warm'
  | 'forgiving'
  | 'accepting'
  | 'curious'
  | 'patient'
  | 'exploratory'
  | 'steady'
  | 'quiet';

export type ContainerDevelopmentalPriority =
  | 'shameSoftening'
  | 'restoration'
  | 'boundaryRecognition'
  | 'liminality'
  | 'belongingRepair'
  | 'selfTrust'
  | 'identityIntegration'
  | 'gentleness';

export type ContainerInquiryDomain =
  | 'need'
  | 'carrying'
  | 'becoming'
  | 'belonging'
  | 'boundary'
  | 'rest'
  | 'trust'
  | 'selfWorth';

export type PresenceProfile = {
  qualities: ContainerPresenceQuality[];
  pacing: 'slow' | 'unhurried' | 'steady';
  depth: 'surfaceFirst' | 'gentleDepth' | 'deepWhenInvited';
  posture: 'welcoming' | 'holding' | 'witnessing';
  languageNotes: string[];
};

export type ContainerContext = {
  id: ContainerLensId;
  name: string;
  activeThemes: MirrorTheme[];
  developmentalPriorities: ContainerDevelopmentalPriority[];
  preferredInterventions: InterventionFamily[];
  memoryRetrievalBias: Array<'recent' | 'recurring' | 'softening' | 'unresolvedQuestion' | 'integration'>;
  mirrorMovementFocus: MovementKind[];
  inquiryDomains: ContainerInquiryDomain[];
  safetyAdjustments: string[];
  presenceProfile: PresenceProfile;
};

export type ContainerInquiry = {
  id: string;
  containerId: ContainerLensId;
  text: string;
  domain: ContainerInquiryDomain;
  state: 'recurring' | 'deepening' | 'changing' | 'unresolved' | 'integrating';
  emergedAt: string;
  lastTouchedAt?: string;
  confidence: 'low' | 'moderate' | 'high';
};

export type ContainerMemoryRecord = {
  id: string;
  containerId: ContainerLensId;
  userContainerId: string;
  observedAt: string;
  sourceSessionId?: string;
  derivedFrom: 'kheperaReflection' | 'mirrorSynthesis' | 'containerInquiry' | 'continuityMetadata';
  insights: string[];
  recurringThemes: MirrorTheme[];
  emotionalMovements: MovementKind[];
  unresolvedQuestions: string[];
  emergingQuestions: string[];
  developmentalShifts: ContainerDevelopmentalPriority[];
  momentsOfIntegration: string[];
  ambiguity: number;
};

export type ContainerRelationship = {
  userContainerId: string;
  containerId: ContainerLensId;
  state: ContainerRelationshipState;
  enteredAt: string;
  lastVisitedAt?: string;
  activeInquiryIds: string[];
  memoryRecordIds: string[];
};

export type ContainerFirestoreModel = {
  relationship: `users/${string}/containerRelationships/${string}`;
  memory: `users/${string}/containerRelationships/${string}/memory`;
  inquiries: `users/${string}/containerRelationships/${string}/inquiries`;
  syntheses: `users/${string}/containerRelationships/${string}/syntheses`;
};

export type KheperaContainerIntegration = {
  containerId: ContainerLensId;
  foregroundThemes: MirrorTheme[];
  interventionBias: InterventionFamily[];
  memoryPriorities: ContainerContext['memoryRetrievalBias'];
  inquiryBias: ContainerInquiryDomain[];
  responsePosture: PresenceProfile['posture'];
  responseFormBias: ResponseForm[];
  constraints: string[];
};

export type MirrorContainerIntegration = {
  containerId: ContainerLensId;
  movementFocus: MovementKind[];
  synthesisFocus: SynthesisKind[];
  recognitionQuestions: string[];
  constraints: string[];
};

export type ContainerReentryExperience = {
  state: Extract<ContainerRelationshipState, 'returning' | 'revisiting' | 'resting'>;
  headline: string;
  invitation: string;
  inquiry?: string;
  prohibitedLanguage: string[];
};

export type ContainerEvaluationSignal =
  | 'perceivedSupport'
  | 'recognitionMoment'
  | 'emotionalSafety'
  | 'reflectiveDepth'
  | 'meaningfulReturn'
  | 'longitudinalValue';
