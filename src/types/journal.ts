import type { ContainerContext } from './container';

export type FirestoreTimestampLike = {
  toDate: () => Date;
};

export type EmotionalTone =
  | 'processing'
  | 'grief'
  | 'anger'
  | 'anxiety'
  | 'clarity'
  | 'numbness'
  | 'tenderness'
  | 'ambivalence';

export type ThemeTag =
  | 'grief_loss'
  | 'relationship_tension'
  | 'self_worth'
  | 'identity'
  | 'work_purpose'
  | 'fear_uncertainty'
  | 'anger_injustice'
  | 'body_health'
  | 'creativity_expression'
  | 'spirituality_meaning'
  | 'rest_recovery'
  | 'joy_gratitude'
  | 'transition_change'
  | 'boundary_setting'
  | 'childhood_origin';

// What is written to Firestore
export interface JournalEntry {
  id: string;
  userId: string;
  entryText: string;           // Never used by Khepera after initial processing
  kheperaResponse: string;
  seed: string;
  emotionalTone: EmotionalTone;
  themes: ThemeTag[];
  containerId?: string;
  containerDay?: number;
  createdAt: FirestoreTimestampLike;
  isCrisis: boolean;
}

// What the UI receives — no raw Firestore types
export interface JournalEntryDisplay {
  id: string;
  preview: string;             // First 120 chars of entryText
  kheperaResponse: string;
  seed: string;
  emotionalTone: EmotionalTone;
  themes: ThemeTag[];
  containerId?: string;
  containerDay?: number;
  date: Date;
  isCrisis: boolean;
}

// Submission input — what the UI sends DOWN to the service
export interface JournalSubmissionInput {
  entryText: string;
  operationId?: string;
  userId: string | null;
  containerId?: string;
  userContainerId?: string;
  containerName?: string;
  containerContext?: ContainerContext;
  containerDay?: number;
  containerClinicalIntent?: string;
  containerPhase?: string;
  containerPhaseNote?: string;
  todayPrompt?: string;
  kheperaIntent?: string;
  sessionCount: number;
  recurringThemes: string[];
  dominantTone: EmotionalTone;
  arrivalReason?: string;
  thresholdQuestion?: string;  // The dashboard question shown before writing
}

// Submission result — what the service sends UP to the hook
export interface JournalSubmissionResult {
  success: boolean;
  entryId: string | null;
  localId: string;        // the queue ID — always present
  witness?: string;
  perspective?: string;
  kheperaResponse: string;
  seed: string;
  isCrisis: boolean;
  isOffline?: boolean;    // true if response is an offline fallback
  reflectionAccess?: {
    used: number;
    limit: number | null;
    hasTransformation: boolean;
  };
  submissionState:
    | 'completed'
    | 'pending_sync'
    | 'delayed_return'
    | 'offline_fallback'
    | 'crisis_blocked'
    | 'reflection_limit'
    | 'failed_local_save'
    | 'aborted';
  syncIssue?: 'auth_required' | 'remote_unavailable';
  error?: string;
}

// ─── JOURNAL FLOW PHASES ─────────────────────────────────────────────────────

export type JournalPhase = 'arriving' | 'feeling' | 'writing' | 'pause' | 'receiving';

export type EmotionalCheckIn =
  | 'heavy'        // Something is weighing on me
  | 'anxious'      // Unsettled, restless, uncertain
  | 'numb'         // Flat, disconnected, not much
  | 'tender'       // Soft, open, close to something
  | 'angry'        // Frustrated, resentful, stirred up
  | 'searching'    // Looking for something I can't name
  | 'okay'         // Fine. Genuinely okay, or maybe not sure yet

export interface JournalSession {
  phase: JournalPhase;
  checkIn?: EmotionalCheckIn;
  somaticNote?: string;         // Optional — what the user noticed in Arriving
  entryText: string;
  submittedAt?: Date;
  containerId?: string;
  containerDay?: number;
}

// ─── POST-ENTRY EXERCISES ────────────────────────────────────────────────────

// The 8 post-entry exercises
export type ExerciseType =
  | 'the_reframe'       // CBT cognitive restructuring
  | 'the_witness'       // ACT defusion / observer self
  | 'the_letter'        // DBT self-compassion letter
  | 'the_body'          // Somatic awareness / body scan
  | 'the_opposite'      // Behavioral activation — what would the opposite look like
  | 'the_younger_self'  // Inner child / psychodynamic
  | 'the_values'        // ACT values clarification
  | 'the_unsent'        // Narrative therapy — unsent message

export interface Exercise {
  type: ExerciseType;
  title: string;
  subtitle: string;        // One-line description shown on selection
  duration: string;        // "3 min" | "5 min" | "8 min"
  steps: ExerciseStep[];
  clinicalModality: string; // Internal — never shown to user
}

export interface ExerciseStep {
  id: string;
  prompt: string;
  type: 'reflection' | 'writing' | 'breathing' | 'body_scan' | 'completion';
  placeholder?: string;
  breathCount?: number;    // For breathing steps
  userResponse?: string;   // Filled in during exercise
}

export interface ExerciseRouting {
  checkIn: EmotionalCheckIn;
  primaryExercise: ExerciseType;
  alternateExercises: ExerciseType[];
}

// ─── OFFLINE QUEUE SYSTEM ────────────────────────────────────────────────────

export type QueuedEntryStatus =
  | 'pending_khepera'    // Entry saved, waiting for Khepera response
  | 'delayed_return'     // Entry saved, Khepera scheduled to return later
  | 'pending_sync'       // Has Khepera response, waiting for Firestore save
  | 'syncing'            // Currently attempting sync
  | 'failed'             // Sync failed after retries — retained locally until explicit recovery
  | 'complete';          // Successfully synced — ready to remove

export interface QueuedEntry {
  localId: string;           // UUID — primary key in local store
  entryText: string;         // The precious thing — never lost
  checkIn?: string;          // EmotionalCheckIn from Prompt 63
  somaticNote?: string;
  containerId?: string;
  userContainerId?: string;
  containerName?: string;
  containerContext?: ContainerContext;
  containerDay?: number;
  containerClinicalIntent?: string;
  containerPhase?: string;
  containerPhaseNote?: string;
  todayPrompt?: string;
  kheperaIntent?: string;
  sessionCount: number;
  recurringThemes: string[];
  dominantTone: EmotionalTone;
  userId: string | null;
  writtenAt: string;         // ISO string — stable across restarts
  status: QueuedEntryStatus;
  thresholdQuestion?: string;  // The dashboard question shown before writing
  // Populated after Khepera responds (online or offline fallback):
  witness?: string;
  perspective?: string;
  kheperaResponse?: string;
  seed?: string;
  isCrisis?: boolean;
  reflectionTiming?: import('@/types/khepera').ReflectionTiming;
  delayedReflectionScheduledAt?: string;
  // Populated after Firestore sync:
  firestoreId?: string;
  syncedAt?: string;
  // Error tracking
  syncAttempts: number;
  lastSyncAttempt?: string;
  lastSyncError?: string;
  processingOwner?: string;
  processingLeaseExpiresAt?: string;
}

export interface JournalEntryCompletePayload {
  text: string;
  kheperaResponse: import('@/types/khepera').KheperaResponse;
}

export interface JournalEntryProps {
  onEntryComplete?: (entry: JournalEntryCompletePayload) => void;
  initialText?: string;
}

export interface EntryCardProps {
  entry: import('@/services/data/dataService').JournalEntry;
  showMood?: boolean;
  showKheperaIndicator?: boolean;
}

export interface JournalFlowProps {
  onComplete?: () => void;
  containerPrompt?: string;
  somaticAnchor?: string;
  thresholdQuestion?: string;
  completionContext?: {
    destination: 'journal' | 'container' | 'arc' | 'ceremony';
    title: string;
    detail: string;
    ctaLabel: string;
  } | null;
  containerOriginContext?: {
    containerId: string;
    name: string;
    dayLabel?: string;
    prompt?: string;
    somaticAnchor?: string;
    phaseLabel?: string;
  } | null;
  quickStartContext?: {
    templateId: string;
    title?: string;
    mood?: string;
    prompt: string;
  } | null;
  returnContext?: {
    entryId: string;
    label?: string;
    detail?: string;
    excerpt?: string | null;
    isUnavailable?: boolean;
    metadata?: ReturnMetadata;
  } | null;
}

export interface ReturnMetadata {
  entryId: string;
  surfacedAt: number;
  returnType: 'seed' | 'pattern' | 'contrast';
  daysElapsed: number;
}

export interface ExerciseViewProps {
  exercise: Exercise;
  step: ExerciseStep;
  stepIndex: number;
  totalSteps: number;
  response: string;
  onResponseChange: (val: string) => void;
  onNext: () => void;
  onExit: () => void;
}

export interface BodyMapping {
  area: 'head' | 'chest' | 'stomach' | 'shoulders' | 'arms' | 'legs' | 'back' | 'throat';
  sensation: 'tight' | 'open' | 'heavy' | 'light' | 'warm' | 'cold' | 'buzzing' | 'numb' | 'flowing';
  intensity: number;
  notes?: string;
}

export interface SomaticJournalData {
  bodyMappings: BodyMapping[];
  breathPattern: 'shallow' | 'deep' | 'irregular' | 'held';
  energyLevel: number;
  tensionAreas: string[];
  groundingRating: number;
  somaticInsights: string[];
  sessionDuration: number;
}

export interface SomaticEntryModeProps {
  onSubmit: (content: string, somaticData: SomaticJournalData) => void;
  onCancel: () => void;
  prompt?: string;
}
