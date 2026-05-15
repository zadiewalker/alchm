import { setDoc } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import {
  claimQueueEntry,
  getPendingEntries,
  releaseQueueEntry,
  updateQueueEntry,
} from '@/services/offline/localQueue';
import { isCrisisSignalPresent } from '@/services/khepera/crisisDetection';
import { extractThemesForKheperaEntry, generateSafeKheperaResponse } from '@/services/khepera/service';
import { processQueuedEntry } from '@/services/journal/processQueuedEntry';
import type { QueuedEntry, ThemeTag } from '@/types/journal';
import { normalizeContainerContext } from '@/utils/khepera/containerContext';
import { recordOperationalEvent, recordOperationalException } from '@/services/monitoring/telemetry';

const MAX_REPLAY_BATCH_SIZE = 3;

let replayInFlight = false;

function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
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

async function getCurrentUserId(): Promise<string | null> {
  const { getFirebaseAuthOrNull } = await import('@/services/firebase/firebaseService');
  return getFirebaseAuthOrNull()?.currentUser?.uid ?? null;
}

async function makeSessionRef(userId: string, localId: string): Promise<DocumentReference> {
  const [{ doc }, { getFirestoreDb }] = await Promise.all([
    import('firebase/firestore'),
    import('@/services/firebase/firebaseService'),
  ]);
  return doc(getFirestoreDb(), 'users', userId, 'sessions', localId);
}

async function updateKheperaMemory(
  userId: string,
  themes: string[],
  tone: string,
  metadata?: { stance?: string; styleProfile?: string; lastReturnType?: 'immediate' | 'delayed' }
): Promise<void> {
  const { updateKheperaMemory } = await import('@/services/khepera/memory');
  await updateKheperaMemory(userId, themes as never[], tone as never, metadata as never);
}

function buildReplayContext(entry: QueuedEntry) {
  return {
    sessionCount: entry.sessionCount,
    recurringThemes: entry.recurringThemes as ThemeTag[],
    dominantTone: entry.dominantTone,
    containerContext: normalizeContainerContext(entry),
  };
}

async function replayOneQueuedEntry(entry: QueuedEntry, owner: string): Promise<void> {
  const fallbackUserId = entry.userId ?? await getCurrentUserId();

  const result = await processQueuedEntry(
    {
      updateQueueEntry,
      releaseQueueEntry,
      generateSafeKheperaResponse,
      extractThemesForKheperaEntry,
      updateKheperaMemory,
      isCrisisSignalPresent,
      setDoc,
      makeSessionRef,
    },
    {
      entry,
      processingOwner: owner,
      fallbackUserId,
      userContext: buildReplayContext(entry),
      stopAfterCrisis: false,
      allowOfflineFallback: false,
      includeSyncedAtOnRemotePersist: true,
      onPersistFailure: 'return_pending_sync',
      onMissingUserId: 'return_pending_sync',
      getSyncIssue,
      onTransition: (transition, localId) => {
        recordOperationalEvent('submission_transition', {
          localId,
          state: `queue_replay_${transition}`,
        });
      },
    },
  );

  recordOperationalEvent('submission_transition', {
    localId: entry.localId,
    state: `queue_replay_${result.outcome}`,
  });
}

export async function replayPendingJournalQueue(reason = 'startup'): Promise<void> {
  if (replayInFlight || isBrowserOffline()) {
    return;
  }

  replayInFlight = true;

  try {
    const pendingEntries = await getPendingEntries();
    const replayEntries = pendingEntries.slice(0, MAX_REPLAY_BATCH_SIZE);

    if (replayEntries.length === 0) {
      return;
    }

    recordOperationalEvent('submission_transition', {
      state: 'queue_replay_started',
      source: reason,
    });

    for (const pendingEntry of replayEntries) {
      const owner = `queue-replay:${reason}:${pendingEntry.localId}:${Date.now()}`;
      const claimedEntry = await claimQueueEntry(pendingEntry.localId, owner);
      if (!claimedEntry || claimedEntry.status === 'complete' || claimedEntry.status === 'failed') {
        continue;
      }

      try {
        await replayOneQueuedEntry(claimedEntry, owner);
      } catch (error) {
        recordOperationalException('sync_issue', error, {
          localId: claimedEntry.localId,
          state: 'queue_replay_failed',
          issue: getSyncIssue(error),
        });
        await releaseQueueEntry(claimedEntry.localId, owner, {
          status: claimedEntry.kheperaResponse ? 'pending_sync' : 'pending_khepera',
          lastSyncAttempt: new Date().toISOString(),
          lastSyncError: getSyncIssue(error),
          syncAttempts: (claimedEntry.syncAttempts ?? 0) + 1,
        });
      }
    }
  } finally {
    replayInFlight = false;
  }
}
