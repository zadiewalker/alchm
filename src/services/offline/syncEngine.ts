import {
  generateSafeKheperaResponse,
} from '@/services/khepera/service';
import { detectCrisisSignals } from '@/services/khepera/crisisDetection';
import { buildQueuedEntryUserContext, processQueuedEntry } from '@/services/journal/processQueuedEntry';
import {
  claimQueueEntry,
  getPendingEntries,
  MAX_SYNC_ATTEMPTS,
  releaseQueueEntry,
  updateQueueEntry,
  verifyQueueClaim,
} from './localQueue';
import type { QueuedEntry } from '@/types/journal';
import { recordOperationalEvent, recordOperationalException } from '@/services/monitoring/telemetry';

let isSyncing = false;

export type SyncTransition =
  | 'sync_started'
  | 'sending_to_model'
  | 'pending_sync'
  | 'persisting_remote'
  | 'completed'
  | 'failed_remote_sync';

type SyncDeps = {
  getPendingEntries: typeof getPendingEntries;
  updateQueueEntry: typeof updateQueueEntry;
  claimQueueEntry: typeof claimQueueEntry;
  releaseQueueEntry: typeof releaseQueueEntry;
  verifyQueueClaim: typeof verifyQueueClaim;
  generateSafeKheperaResponse: typeof generateSafeKheperaResponse;
  detectCrisisSignals: typeof detectCrisisSignals;
  onTransition?: (transition: SyncTransition, payload: { localId: string }) => void | Promise<void>;
};

const defaultSyncDeps: SyncDeps = {
  getPendingEntries,
  updateQueueEntry,
  claimQueueEntry,
  releaseQueueEntry,
  verifyQueueClaim,
  generateSafeKheperaResponse,
  detectCrisisSignals,
};

async function emitSyncTransition(
  deps: SyncDeps,
  transition: SyncTransition,
  localId: string
): Promise<void> {
  recordOperationalEvent('submission_transition', { localId, state: transition });
  await deps.onTransition?.(transition, { localId });
}

export async function drainQueue(userId: string, deps: SyncDeps = defaultSyncDeps): Promise<{
  synced: number;
  failed: number;
}> {
  if (isSyncing) return { synced: 0, failed: 0 };
  isSyncing = true;

  let synced = 0;
  let failed = 0;

  try {
    const pending = await deps.getPendingEntries();
    const userEntries = pending.filter((entry) => entry.userId === userId || entry.userId == null);

    for (const entry of userEntries) {
      const processingOwner = `sync:${entry.localId}`;
      const claimed = await deps.claimQueueEntry(entry.localId, processingOwner);
      if (!claimed) {
        continue;
      }

      try {
        await syncEntry(claimed, userId, processingOwner, deps);
        synced++;
      } catch (err) {
        failed++;
        recordOperationalEvent('sync_issue', { localId: entry.localId, state: 'failed_remote_sync', issue: err instanceof Error ? err.message : 'unknown' });
        recordOperationalException('sync_issue', err, { localId: entry.localId, state: 'failed_remote_sync', issue: 'drain_queue_failed' });
        const nextAttempts = claimed.syncAttempts + 1;
        const latest = await deps.claimQueueEntry(entry.localId, processingOwner);
        await deps.releaseQueueEntry(entry.localId, processingOwner, {
          status: nextAttempts >= MAX_SYNC_ATTEMPTS ? 'failed' : latest?.kheperaResponse ? 'pending_sync' : 'pending_khepera',
          syncAttempts: nextAttempts,
          lastSyncAttempt: new Date().toISOString(),
          lastSyncError: err instanceof Error ? err.message : 'unknown',
        });
      }
    }
  } finally {
    isSyncing = false;
  }

  return { synced, failed };
}

async function syncEntry(
  entry: QueuedEntry,
  userId: string,
  processingOwner: string,
  deps: SyncDeps
): Promise<void> {
  await deps.updateQueueEntry(entry.localId, {
    status: 'syncing',
    userId: entry.userId ?? userId,
  });
  await emitSyncTransition(deps, 'sync_started', entry.localId);

  try {
    await processQueuedEntry(
      {
        updateQueueEntry: deps.updateQueueEntry,
        releaseQueueEntry: deps.releaseQueueEntry,
        verifyQueueClaim: deps.verifyQueueClaim,
        generateSafeKheperaResponse: deps.generateSafeKheperaResponse,
        detectCrisisSignals: deps.detectCrisisSignals,
      },
      {
        entry,
        processingOwner,
        fallbackUserId: userId,
        userContext: buildQueuedEntryUserContext(entry),
        stopAfterCrisis: false,
        allowOfflineFallback: false,
        includeSyncedAtOnRemotePersist: true,
        onPersistFailure: 'throw',
        onMissingUserId: 'fail',
        onTransition: async (transition, localId) => {
          await emitSyncTransition(deps, transition, localId);
        },
      },
    );
  } catch (err) {
    await emitSyncTransition(deps, 'failed_remote_sync', entry.localId);
    throw err;
  }
}
