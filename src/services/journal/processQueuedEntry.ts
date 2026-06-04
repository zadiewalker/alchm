import { CRISIS_RESPONSE, type detectCrisisSignals as detectCrisisSignalsType } from '@/services/khepera/crisisDetection';
import type { generateSafeKheperaResponse as generateSafeKheperaResponseType } from '@/services/khepera/service';
import { analyzeEntry } from '@/services/khepera/analyzeEntry';
import { generateReflection } from '@/services/khepera/generateReflection';
import { persistPrecomputedKheperaReflection } from '@/services/ai/modelProvider';
import {
  buildKheperaPacingState,
  decideReflectionTiming,
  getDelayedReflectionScheduledAt,
  sleepForReflectionTiming,
} from '@/services/khepera/timing';
import {
  getKheperaReflectionAccessState,
  recordDeliveredKheperaReflection,
} from '@/services/subscriptions/kheperaReflectionAccessService';
import type { KheperaReflectionAccessState } from '@/services/subscriptions/kheperaReflectionAccessService';
import type { KheperaResponse, KheperaUserContext } from '@/types/khepera';
import type { QueuedEntry, ThemeTag } from '@/types/journal';
import { combineKheperaResponse, splitKheperaResponse } from '@/utils/khepera';
import { normalizeContainerContext } from '@/utils/khepera/containerContext';
import { triggerSupportFailure } from '@/services/support/triggerSupportFailure';
import { buildCompletedQueueUpdate } from '@/services/offline/queueLease';

export type QueuedEntryProcessTransition =
  | 'sending_to_model'
  | 'pending_sync'
  | 'persisting_remote'
  | 'completed';

export type QueuedEntryProcessSyncIssue = 'auth_required' | 'remote_unavailable';

type ProcessQueuedEntryDeps = {
  updateQueueEntry: (localId: string, updates: Partial<QueuedEntry>) => Promise<void>;
  releaseQueueEntry: (localId: string, owner: string, updates?: Partial<QueuedEntry>) => Promise<void>;
  verifyQueueClaim?: (localId: string, owner: string) => Promise<boolean>;
  generateSafeKheperaResponse: typeof generateSafeKheperaResponseType;
  persistPrecomputedKheperaReflection?: typeof persistPrecomputedKheperaReflection;
  detectCrisisSignals: typeof detectCrisisSignalsType;
  getKheperaReflectionAccessState?: (userId: string | null) => Promise<KheperaReflectionAccessState>;
};

type ProcessQueuedEntryOptions = {
  entry: QueuedEntry;
  processingOwner: string;
  fallbackUserId?: string | null;
  userContext: KheperaUserContext;
  stopAfterCrisis: boolean;
  allowOfflineFallback: boolean;
  includeSyncedAtOnRemotePersist: boolean;
  onPersistFailure: 'return_pending_sync' | 'throw';
  onMissingUserId: 'return_pending_sync' | 'fail';
  getOfflineResponse?: () => KheperaResponse;
  getSyncIssue?: (error: unknown) => QueuedEntryProcessSyncIssue;
  onTransition?: (transition: QueuedEntryProcessTransition, localId: string) => Promise<void> | void;
};

export type ProcessQueuedEntryResult =
  | {
      outcome: 'crisis_blocked';
      witness: string;
      perspective: string;
      kheperaResponse: string;
      seed: string;
      isCrisis: true;
      entryId: null;
    }
  | {
      outcome: 'offline_fallback';
      witness: string;
      perspective: string;
      kheperaResponse: string;
      seed: string;
      isCrisis: false;
      entryId: null;
    }
  | {
      outcome: 'reflection_limit';
      witness: '';
      perspective: '';
      kheperaResponse: '';
      seed: '';
      isCrisis: false;
      entryId: string | null;
      reflectionAccess: {
        used: number;
        limit: number | null;
        hasTransformation: boolean;
      };
      syncIssue?: QueuedEntryProcessSyncIssue;
    }
  | {
      outcome: 'delayed_return';
      witness: '';
      perspective: '';
      kheperaResponse: '';
      seed: '';
      isCrisis: false;
      entryId: string | null;
      scheduledAt: string;
      syncIssue?: QueuedEntryProcessSyncIssue;
    }
  | {
      outcome: 'processed';
      witness: string;
      perspective: string;
      kheperaResponse: string;
      seed: string;
      isCrisis: boolean;
      entryId: string | null;
      syncIssue?: QueuedEntryProcessSyncIssue;
    };

function sanitizeThemeTags(themes: string[]): ThemeTag[] {
  return themes.filter((theme): theme is ThemeTag => (
    theme === 'grief_loss'
    || theme === 'relationship_tension'
    || theme === 'self_worth'
    || theme === 'identity'
    || theme === 'work_purpose'
    || theme === 'fear_uncertainty'
    || theme === 'anger_injustice'
    || theme === 'body_health'
    || theme === 'creativity_expression'
    || theme === 'spirituality_meaning'
    || theme === 'rest_recovery'
    || theme === 'joy_gratitude'
    || theme === 'transition_change'
    || theme === 'boundary_setting'
    || theme === 'childhood_origin'
  ));
}

export async function processQueuedEntry(
  deps: ProcessQueuedEntryDeps,
  options: ProcessQueuedEntryOptions,
): Promise<ProcessQueuedEntryResult> {
  const {
    entry,
    processingOwner,
    fallbackUserId = null,
    userContext,
    stopAfterCrisis,
    allowOfflineFallback,
    includeSyncedAtOnRemotePersist,
    onPersistFailure,
    onMissingUserId,
    getOfflineResponse,
    getSyncIssue,
    onTransition,
  } = options;

  let kheperaResponse = entry.kheperaResponse ?? '';
  const existingSplit = splitKheperaResponse(kheperaResponse, entry.seed);
  let witness = entry.witness ?? existingSplit.witness;
  let perspective = entry.perspective ?? existingSplit.perspective;
  let seed = entry.seed ?? existingSplit.seed;
  let isCrisis = entry.isCrisis ?? false;
  const resolvedUserId = entry.userId ?? fallbackUserId;
  let serverPersistenceConfirmed = entry.serverPersistenceConfirmed === true;

  if (kheperaResponse && (!witness.trim() || !perspective.trim() || !seed.trim())) {
    kheperaResponse = '';
    witness = '';
    perspective = '';
    seed = '';
    serverPersistenceConfirmed = false;
  }

  async function assertClaimOwnership(): Promise<void> {
    if (deps.verifyQueueClaim && !(await deps.verifyQueueClaim(entry.localId, processingOwner))) {
      throw new Error('queue_claim_lost');
    }
  }

  if (!kheperaResponse) {
    let hasCrisisSignals = false;
    try {
      hasCrisisSignals = deps.detectCrisisSignals(entry.entryText);
    } catch (error) {
      triggerSupportFailure({ step: 'crisis', error });
      throw error;
    }

    if (hasCrisisSignals) {
      witness = CRISIS_RESPONSE.witness;
      perspective = CRISIS_RESPONSE.perspective;
      kheperaResponse = combineKheperaResponse(CRISIS_RESPONSE);
      seed = CRISIS_RESPONSE.seed;
      isCrisis = true;

      if (stopAfterCrisis) {
        await deps.releaseQueueEntry(entry.localId, processingOwner, {
          witness,
          perspective,
          kheperaResponse,
          seed,
          isCrisis,
          status: 'pending_sync',
        });

        return {
          outcome: 'crisis_blocked',
          witness,
          perspective,
          kheperaResponse,
          seed,
          isCrisis: true,
          entryId: null,
        };
      }

      await deps.updateQueueEntry(entry.localId, {
        witness,
        perspective,
      });
    } else {
      const accessState = await (deps.getKheperaReflectionAccessState ?? getKheperaReflectionAccessState)(resolvedUserId ?? null);
      if (!accessState.allowed) {
        await deps.releaseQueueEntry(entry.localId, processingOwner, {
          witness: '',
          perspective: '',
          kheperaResponse: '',
          seed: '',
          isCrisis: false,
          status: 'failed',
          lastSyncAttempt: new Date().toISOString(),
          lastSyncError: 'reflection_limit',
          userId: resolvedUserId ?? entry.userId ?? null,
        });
        await onTransition?.('completed', entry.localId);
        return {
          outcome: 'reflection_limit',
          witness: '',
          perspective: '',
          kheperaResponse: '',
          seed: '',
          isCrisis: false,
          entryId: null,
          reflectionAccess: accessState,
        };
      }

      await onTransition?.('sending_to_model', entry.localId);

      try {
        const analysis = analyzeEntry(entry.entryText, userContext.dominantTone);
        const reflection = generateReflection({
          entryText: entry.entryText,
          analysis,
          context: userContext,
        });
        const timing = decideReflectionTiming({
          analysis,
          stance: reflection.stance,
          pacingState: buildKheperaPacingState(userContext),
          seed: `${entry.localId}:${entry.writtenAt}`,
        });
        // Delayed generated output is disabled until it has a server-owned
        // persistence path. Preserve paced delivery with a bounded delay.
        const effectiveTiming = timing === 'delayed_return' ? 'short_delay' : timing;
        await sleepForReflectionTiming(effectiveTiming, `${entry.localId}:${entry.writtenAt}`);

        await assertClaimOwnership();
        const response = await deps.generateSafeKheperaResponse({
          entryText: entry.entryText,
          userContext,
          userId: entry.userId,
          reflectionTiming: effectiveTiming,
          ...(resolvedUserId ? {
            canonicalSession: {
              sessionId: entry.localId,
              writtenAt: entry.writtenAt,
              reflectionTiming: effectiveTiming,
            },
          } : {}),
        });

        witness = response.witness;
        perspective = response.perspective;
        kheperaResponse = combineKheperaResponse(response);
        seed = response.seed;

        await deps.updateQueueEntry(entry.localId, {
          witness,
          perspective,
          reflectionTiming: effectiveTiming,
          serverPersistenceConfirmed: Boolean(resolvedUserId),
        });
        serverPersistenceConfirmed = Boolean(resolvedUserId);
        recordDeliveredKheperaReflection();
      } catch (error) {
        if (error instanceof Error && error.message === 'queue_claim_lost') {
          throw error;
        }
        triggerSupportFailure({ step: 'anthropic', error });
        if (!allowOfflineFallback || !getOfflineResponse) {
          throw error;
        }

        const offline = getOfflineResponse();
        await deps.releaseQueueEntry(entry.localId, processingOwner, {
          witness: offline.witness,
          perspective: offline.perspective,
          status: 'pending_khepera',
          lastSyncError: error instanceof Error ? error.message : 'offline_fallback',
        });

        return {
          outcome: 'offline_fallback',
          witness: offline.witness,
          perspective: offline.perspective,
          kheperaResponse: combineKheperaResponse(offline),
          seed: offline.seed,
          isCrisis: false,
          entryId: null,
        };
      }
    }

    await deps.updateQueueEntry(entry.localId, {
      kheperaResponse,
      seed,
      isCrisis,
      status: 'pending_sync',
      serverPersistenceConfirmed,
    });
    await onTransition?.('pending_sync', entry.localId);
  }
  if (!resolvedUserId) {
    if (onMissingUserId === 'fail') {
      await deps.releaseQueueEntry(entry.localId, processingOwner, { status: 'failed' });
      await onTransition?.('completed', entry.localId);
      return {
        outcome: 'processed',
        witness,
        perspective,
        kheperaResponse,
        seed,
        isCrisis,
        entryId: null,
      };
    }

    await deps.releaseQueueEntry(entry.localId, processingOwner, { status: 'pending_sync' });
    return {
      outcome: 'processed',
      witness,
      perspective,
      kheperaResponse,
      seed,
      isCrisis,
      entryId: null,
    };
  }

  await onTransition?.('persisting_remote', entry.localId);

  try {
    await assertClaimOwnership();
    if (isCrisis) {
      throw new Error('crisis_remote_persistence_unavailable');
    }
    if (!serverPersistenceConfirmed) {
      await (deps.persistPrecomputedKheperaReflection ?? persistPrecomputedKheperaReflection)(
        entry.entryText,
        { witness, perspective, seed },
        {
          sessionId: entry.localId,
          writtenAt: entry.writtenAt,
          reflectionTiming: entry.reflectionTiming === 'short_delay' ? 'short_delay' : 'immediate',
        },
      );
      serverPersistenceConfirmed = true;
      await deps.updateQueueEntry(entry.localId, {
        serverPersistenceConfirmed: true,
      });
    }

    await deps.releaseQueueEntry(
      entry.localId,
      processingOwner,
      buildCompletedQueueUpdate(entry, resolvedUserId, new Date().toISOString()),
    );
    await onTransition?.('completed', entry.localId);

    return {
      outcome: 'processed',
      witness,
      perspective,
      kheperaResponse,
      seed,
      isCrisis,
      entryId: entry.localId,
    };
  } catch (error) {
    triggerSupportFailure({ step: 'firestore', error });
    if (onPersistFailure === 'throw' || !getSyncIssue) {
      throw error;
    }

    const syncIssue = getSyncIssue(error);
    await deps.releaseQueueEntry(entry.localId, processingOwner, {
      status: 'pending_sync',
      lastSyncAttempt: new Date().toISOString(),
      lastSyncError: syncIssue,
    });
    await onTransition?.('pending_sync', entry.localId);

    return {
      outcome: 'processed',
      witness,
      perspective,
      kheperaResponse,
      seed,
      isCrisis,
      entryId: null,
      syncIssue,
    };
  }
}

export function buildQueuedEntryUserContext(entry: QueuedEntry): KheperaUserContext {
  return {
    sessionCount: entry.sessionCount,
    recurringThemes: sanitizeThemeTags(entry.recurringThemes),
    dominantTone: entry.dominantTone,
    containerContext: normalizeContainerContext(entry),
  };
}
