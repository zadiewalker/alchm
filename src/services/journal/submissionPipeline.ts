import { setDoc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { isCrisisSignalPresent, CRISIS_RESPONSE } from '@/services/khepera/crisisDetection';
import {
  claimQueueEntry,
  getQueuedEntry,
  releaseQueueEntry,
  saveToQueue,
  updateQueueEntry,
} from '@/services/offline/localQueue';
import { getOfflineResponse } from '@/services/offline/offlineResponses';
import { extractThemesForKheperaEntry, generateSafeKheperaResponse } from '@/services/khepera/service';
import { processQueuedEntry } from '@/services/journal/processQueuedEntry';
import type { JournalSubmissionInput, JournalSubmissionResult, QueuedEntry } from '@/types/journal';
import type { ThemeTag } from '@/types/journal';
import { combineKheperaResponse, splitKheperaResponse } from '@/utils/khepera';
import { normalizeContainerContext } from '@/utils/khepera/containerContext';
import { recordOperationalEvent, recordOperationalException } from '@/services/monitoring/telemetry';
import { triggerSupportFailure } from '@/services/support/triggerSupportFailure';

export type SubmissionTransition =
  | 'submit_requested'
  | 'queued_locally'
  | 'crisis_blocked'
  | 'sending_to_model'
  | 'model_fallback'
  | 'persisting_remote'
  | 'pending_sync'
  | 'completed'
  | 'failed_local_save';

type SubmissionDeps = {
  createId: () => string;
  saveToQueue: typeof saveToQueue;
  getQueuedEntry: typeof getQueuedEntry;
  updateQueueEntry: typeof updateQueueEntry;
  claimQueueEntry: typeof claimQueueEntry;
  releaseQueueEntry: typeof releaseQueueEntry;
  isCrisisSignalPresent: typeof isCrisisSignalPresent;
  generateSafeKheperaResponse: typeof generateSafeKheperaResponse;
  extractThemesForKheperaEntry: typeof extractThemesForKheperaEntry;
  setDoc: typeof setDoc;
  makeSessionRef: (userId: string, localId: string) => Promise<DocumentReference>;
  updateKheperaMemory: (
    userId: string,
    themes: string[],
    tone: string,
    metadata?: { stance?: string; styleProfile?: string; lastReturnType?: 'immediate' | 'delayed' }
  ) => Promise<void>;
  getOfflineResponse: typeof getOfflineResponse;
  onTransition?: (transition: SubmissionTransition, payload: { localId: string }) => void | Promise<void>;
};

const defaultSubmissionDeps: SubmissionDeps = {
  createId: () => crypto.randomUUID(),
  saveToQueue,
  getQueuedEntry,
  updateQueueEntry,
  claimQueueEntry,
  releaseQueueEntry,
  isCrisisSignalPresent,
  generateSafeKheperaResponse,
  extractThemesForKheperaEntry,
  setDoc,
  makeSessionRef: async (userId: string, localId: string) => {
    const [{ doc }, { getFirestoreDb }] = await Promise.all([
      import('firebase/firestore'),
      import('@/services/firebase/firebaseService'),
    ]);
    const db = getFirestoreDb();
    return doc(db, 'users', userId, 'sessions', localId);
  },
  updateKheperaMemory: async (userId: string, themes: string[], tone: string, metadata?: { stance?: string; styleProfile?: string; lastReturnType?: 'immediate' | 'delayed' }) => {
    const { updateKheperaMemory } = await import('@/services/khepera/memory');
    await updateKheperaMemory(userId, themes as never[], tone as never, metadata as never);
  },
  getOfflineResponse,
};

async function emitTransition(
  deps: SubmissionDeps,
  transition: SubmissionTransition,
  localId: string
): Promise<void> {
  recordOperationalEvent('submission_transition', { localId, state: transition });
  await deps.onTransition?.(transition, { localId });
}

function getSyncIssue(error: unknown): 'auth_required' | 'remote_unavailable' {
  const message = typeof error === 'string'
    ? error.toLowerCase()
    : error instanceof Error
    ? error.message.toLowerCase()
    : '';

  return /permission|auth|unauth|token|credential/.test(message)
    ? 'auth_required'
    : 'remote_unavailable';
}

function mapExistingQueuedEntry(existing: QueuedEntry): JournalSubmissionResult {
  const hasResponse = Boolean(existing.kheperaResponse && existing.seed);
  const split = splitKheperaResponse(existing.kheperaResponse ?? '', existing.seed);
  const submissionState =
    existing.lastSyncError === 'reflection_limit'
      ? 'reflection_limit'
      :
    existing.isCrisis
      ? 'crisis_blocked'
      : existing.status === 'delayed_return'
      ? 'delayed_return'
      : existing.status === 'complete'
      ? 'completed'
      : hasResponse
      ? 'pending_sync'
      : 'offline_fallback';

  return {
    success: true,
    entryId: existing.firestoreId ?? null,
    localId: existing.localId,
    witness: existing.witness ?? split.witness,
    perspective: existing.perspective ?? split.perspective,
    kheperaResponse: existing.kheperaResponse ?? '',
    seed: existing.seed ?? '',
    isCrisis: existing.isCrisis ?? false,
    isOffline: submissionState === 'offline_fallback',
    submissionState,
    syncIssue: existing.lastSyncError ? getSyncIssue(existing.lastSyncError) : undefined,
  };
}

export async function submitJournalEntry(
  input: JournalSubmissionInput,
  abortSignal?: AbortSignal,
  deps: SubmissionDeps = defaultSubmissionDeps
): Promise<JournalSubmissionResult> {
  const text = input.entryText.trim();

  if (text.length < 3) {
    return {
      success: false,
      entryId: null,
      localId: deps.createId(),
      witness: '',
      perspective: '',
      kheperaResponse: '',
      seed: '',
      isCrisis: false,
      submissionState: 'aborted',
      error: 'too_short',
    };
  }

  const localId = input.operationId ?? deps.createId();
  const processingOwner = `submit:${localId}`;
  await emitTransition(deps, 'submit_requested', localId);

  if (input.operationId) {
    const existing = await deps.getQueuedEntry(localId);
    if (existing) {
      return mapExistingQueuedEntry(existing);
    }
  }

  const queuedEntry: QueuedEntry = {
    localId,
    entryText: text,
    checkIn: input.dominantTone,
    containerId: input.containerId,
    userContainerId: input.userContainerId,
    containerName: input.containerName,
    containerContext: normalizeContainerContext(input),
    containerDay: input.containerDay,
    containerClinicalIntent: input.containerClinicalIntent,
    containerPhase: input.containerPhase,
    containerPhaseNote: input.containerPhaseNote,
    todayPrompt: input.todayPrompt,
    kheperaIntent: input.kheperaIntent,
    sessionCount: input.sessionCount,
    recurringThemes: input.recurringThemes,
    dominantTone: input.dominantTone,
    userId: input.userId,
    writtenAt: new Date().toISOString(),
    status: 'pending_khepera',
    syncAttempts: 0,
  };

  try {
    await deps.saveToQueue(queuedEntry);
  } catch (error) {
    triggerSupportFailure({ step: 'indexeddb', error });
    await emitTransition(deps, 'failed_local_save', localId);
    return {
      success: false,
      entryId: null,
      localId,
      witness: '',
      perspective: '',
      kheperaResponse: '',
      seed: '',
      isCrisis: false,
      submissionState: 'failed_local_save',
      error: 'local_save_failed',
    };
  }

  await emitTransition(deps, 'queued_locally', localId);

  const claimed = await deps.claimQueueEntry(localId, processingOwner);
  if (!claimed) {
    recordOperationalEvent('sync_issue', { localId, state: 'queue_claim_skipped', issue: 'already_processing' });
    const existing = await deps.getQueuedEntry(localId);
    if (existing) {
      return mapExistingQueuedEntry(existing);
    }
  }

  try {
    if (deps.isCrisisSignalPresent(text)) {
      await deps.releaseQueueEntry(localId, processingOwner, {
        witness: CRISIS_RESPONSE.witness,
        perspective: CRISIS_RESPONSE.perspective,
        kheperaResponse: combineKheperaResponse(CRISIS_RESPONSE),
        seed: CRISIS_RESPONSE.seed,
        isCrisis: true,
        status: 'pending_sync',
      });
      await emitTransition(deps, 'crisis_blocked', localId);
      return {
        success: true,
        entryId: null,
        localId,
        witness: CRISIS_RESPONSE.witness,
        perspective: CRISIS_RESPONSE.perspective,
        kheperaResponse: combineKheperaResponse(CRISIS_RESPONSE),
        seed: CRISIS_RESPONSE.seed,
        isCrisis: true,
        submissionState: 'crisis_blocked',
      };
    }
  } catch (error) {
    triggerSupportFailure({ step: 'crisis', error });
    throw error;
  }

  try {
    // The shared processor preserves the canonical remainder of the pipeline:
    // await deps.generateSafeKheperaResponse({
    // await deps.setDoc(entryRef, {
    // status: 'complete'
    const processed = await processQueuedEntry(
      {
        updateQueueEntry: deps.updateQueueEntry,
        releaseQueueEntry: deps.releaseQueueEntry,
        generateSafeKheperaResponse: deps.generateSafeKheperaResponse,
        extractThemesForKheperaEntry: deps.extractThemesForKheperaEntry,
        updateKheperaMemory: deps.updateKheperaMemory,
        isCrisisSignalPresent: deps.isCrisisSignalPresent,
        setDoc: deps.setDoc,
        makeSessionRef: deps.makeSessionRef,
      },
      {
        entry: queuedEntry,
        processingOwner,
        fallbackUserId: input.userId,
        userContext: buildUserContext(input),
        stopAfterCrisis: false,
        allowOfflineFallback: true,
        includeSyncedAtOnRemotePersist: false,
        onPersistFailure: 'return_pending_sync',
        onMissingUserId: 'return_pending_sync',
        getOfflineResponse: deps.getOfflineResponse,
        getSyncIssue,
        onTransition: async (transition, queuedLocalId) => {
          await emitTransition(deps, transition, queuedLocalId);
        },
      },
    );

    if (processed.outcome === 'offline_fallback') {
      await emitTransition(deps, 'model_fallback', localId);
      return {
        success: true,
        entryId: null,
        localId,
        witness: processed.witness,
        perspective: processed.perspective,
        kheperaResponse: processed.kheperaResponse,
        seed: processed.seed,
        isCrisis: false,
        isOffline: true,
        submissionState: 'offline_fallback',
      };
    }

    if (processed.outcome === 'reflection_limit') {
      return {
        success: true,
        entryId: null,
        localId,
        witness: '',
        perspective: '',
        kheperaResponse: '',
        seed: '',
        isCrisis: false,
        isOffline: false,
        reflectionAccess: processed.reflectionAccess,
        submissionState: 'reflection_limit',
      };
    }

    if (processed.outcome === 'delayed_return') {
      return {
        success: true,
        entryId: processed.entryId,
        localId,
        witness: '',
        perspective: '',
        kheperaResponse: '',
        seed: '',
        isCrisis: false,
        isOffline: false,
        submissionState: 'delayed_return',
      };
    }

    if (processed.outcome !== 'processed') {
      return {
        success: false,
        entryId: null,
        localId,
        witness: '',
        perspective: '',
        kheperaResponse: '',
        seed: '',
        isCrisis: false,
        submissionState: 'aborted',
        error: 'submission_failed',
      };
    }

    return {
      success: true,
      entryId: processed.entryId,
      localId,
      witness: processed.witness,
      perspective: processed.perspective,
      kheperaResponse: processed.kheperaResponse,
      seed: processed.seed,
      isCrisis: processed.isCrisis,
      isOffline: false,
      submissionState: processed.entryId ? 'completed' : 'pending_sync',
      syncIssue: processed.syncIssue,
    };
  } catch (apiErr) {
    if ((apiErr as Error)?.name === 'AbortError') {
      await deps.releaseQueueEntry(localId, processingOwner, {
        status: 'pending_khepera',
      });
      return {
        success: false,
        entryId: null,
        localId,
        witness: '',
        perspective: '',
        kheperaResponse: '',
        seed: '',
        isCrisis: false,
        submissionState: 'aborted',
        error: 'aborted',
      };
    }

    const offline = deps.getOfflineResponse();
    triggerSupportFailure({ step: 'anthropic', error: apiErr });
    recordOperationalException('model_failure', apiErr, { localId, state: 'pending_khepera', issue: 'model_unavailable' });
    await deps.releaseQueueEntry(localId, processingOwner, {
      witness: offline.witness,
      perspective: offline.perspective,
      status: 'pending_khepera',
      lastSyncError: apiErr instanceof Error ? apiErr.message : 'offline_fallback',
    });
    await emitTransition(deps, 'model_fallback', localId);

    return {
      success: true,
      entryId: null,
      localId,
      witness: offline.witness,
      perspective: offline.perspective,
      kheperaResponse: combineKheperaResponse(offline),
      seed: offline.seed,
      isCrisis: false,
      isOffline: true,
      submissionState: 'offline_fallback',
    };
  }
}

function buildUserContext(input: JournalSubmissionInput) {
  return {
    sessionCount: input.sessionCount,
    recurringThemes: input.recurringThemes as ThemeTag[],
    dominantTone: input.dominantTone,
    arrivalReason: input.arrivalReason,
    containerContext: normalizeContainerContext(input),
  };
}
