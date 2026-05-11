import { setDoc, serverTimestamp } from 'firebase/firestore';
import type { DocumentReference } from 'firebase/firestore';
import { CRISIS_RESPONSE, type isCrisisSignalPresent as isCrisisSignalPresentType } from '@/services/khepera/crisisDetection';
import type { extractThemesForKheperaEntry as extractThemesForKheperaEntryType, generateSafeKheperaResponse as generateSafeKheperaResponseType } from '@/services/khepera/service';
import { analyzeEntry } from '@/services/khepera/analyzeEntry';
import { generateReflection } from '@/services/khepera/generateReflection';
import { scheduleDelayedReflection } from '@/services/khepera/delayedReflectionQueue';
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
import type { KheperaStyleProfile, ResponseStance } from '@/types/khepera';
import type { QueuedEntry, ThemeTag } from '@/types/journal';
import { combineKheperaResponse } from '@/utils/khepera';
import { normalizeContainerContext } from '@/utils/khepera/containerContext';
import { triggerSupportFailure } from '@/services/support/triggerSupportFailure';

export type QueuedEntryProcessTransition =
  | 'sending_to_model'
  | 'pending_sync'
  | 'persisting_remote'
  | 'completed';

export type QueuedEntryProcessSyncIssue = 'auth_required' | 'remote_unavailable';

type ProcessQueuedEntryDeps = {
  updateQueueEntry: (localId: string, updates: Partial<QueuedEntry>) => Promise<void>;
  releaseQueueEntry: (localId: string, owner: string, updates?: Partial<QueuedEntry>) => Promise<void>;
  generateSafeKheperaResponse: typeof generateSafeKheperaResponseType;
  extractThemesForKheperaEntry: typeof extractThemesForKheperaEntryType;
  updateKheperaMemory: (
    userId: string,
    themes: string[],
    tone: string,
    metadata?: { stance?: ResponseStance; styleProfile?: KheperaStyleProfile; lastReturnType?: 'immediate' | 'delayed' }
  ) => Promise<void>;
  isCrisisSignalPresent: typeof isCrisisSignalPresentType;
  setDoc: typeof setDoc;
  makeSessionRef: (userId: string, localId: string) => Promise<DocumentReference>;
  scheduleDelayedReflection?: typeof scheduleDelayedReflection;
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

  let witness = entry.witness ?? '';
  let perspective = entry.perspective ?? '';
  let kheperaResponse = entry.kheperaResponse ?? '';
  let seed = entry.seed ?? '';
  let isCrisis = entry.isCrisis ?? false;
  const resolvedUserId = entry.userId ?? fallbackUserId;
  let delayedReturnScheduledAt = entry.delayedReflectionScheduledAt ?? '';
  let isDelayedReturn = entry.status === 'delayed_return';
  let delayedThemes: ThemeTag[] = [];
  let delayedTone = entry.dominantTone ?? 'processing';

  if (!kheperaResponse) {
    let hasCrisisSignals = false;
    try {
      hasCrisisSignals = deps.isCrisisSignalPresent(entry.entryText);
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
        const effectiveTiming = timing === 'delayed_return' && !resolvedUserId ? 'short_delay' : timing;

        if (effectiveTiming === 'delayed_return') {
          const scheduledAt = getDelayedReflectionScheduledAt(`${entry.localId}:${entry.writtenAt}`);
          delayedReturnScheduledAt = scheduledAt.toISOString();
          isDelayedReturn = true;
          delayedThemes = reflection.currentThemes;
          delayedTone = analysis.emotionalTone;
          await deps.updateQueueEntry(entry.localId, {
            reflectionTiming: 'delayed_return',
            delayedReflectionScheduledAt: delayedReturnScheduledAt,
            status: 'delayed_return',
          });
        } else {
          await sleepForReflectionTiming(effectiveTiming, `${entry.localId}:${entry.writtenAt}`);
        }

        if (isDelayedReturn) {
          witness = '';
          perspective = '';
          kheperaResponse = '';
          seed = '';
        } else {
        const response = await deps.generateSafeKheperaResponse({
          entryText: entry.entryText,
          userContext,
          userId: entry.userId,
          reflectionTiming: effectiveTiming,
        });

        witness = response.witness;
        perspective = response.perspective;
        kheperaResponse = combineKheperaResponse(response);
        seed = response.seed;

        await deps.updateQueueEntry(entry.localId, {
          witness,
          perspective,
          reflectionTiming: effectiveTiming,
        });
        recordDeliveredKheperaReflection();
        }
      } catch (error) {
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

    if (!isDelayedReturn) {
      await deps.updateQueueEntry(entry.localId, {
        kheperaResponse,
        seed,
        isCrisis,
        status: 'pending_sync',
      });
      await onTransition?.('pending_sync', entry.localId);
    }
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
    const entryRef = await deps.makeSessionRef(resolvedUserId, entry.localId);
    await deps.setDoc(entryRef, {
      userId: resolvedUserId,
      entryText: entry.entryText,
      kheperaResponse,
      seed,
      emotionalTone: entry.dominantTone ?? 'processing',
      themes: [],
      isCrisis,
      reflectionTiming: isDelayedReturn ? 'delayed_return' : entry.reflectionTiming ?? 'immediate',
      delayedReflectionScheduledAt: delayedReturnScheduledAt || null,
      containerId: entry.containerId ?? null,
      userContainerId: entry.userContainerId ?? null,
      containerDay: entry.containerDay ?? null,
      createdAt: serverTimestamp(),
      writtenAt: entry.writtenAt,
      ...(includeSyncedAtOnRemotePersist ? { syncedAt: serverTimestamp() } : {}),
    });

    if (isDelayedReturn && delayedReturnScheduledAt) {
      await (deps.scheduleDelayedReflection ?? scheduleDelayedReflection)(resolvedUserId, {
        entryId: entry.localId,
        emotionalTone: delayedTone,
        themeTags: delayedThemes,
        scheduledAt: new Date(delayedReturnScheduledAt),
      });
    }

    if (kheperaResponse && seed) {
      deps.extractThemesForKheperaEntry(entry.entryText, kheperaResponse)
        .then(({ themes, tone }) => {
          deps.makeSessionRef(resolvedUserId, entry.localId)
            .then((resolvedEntryRef) => deps.setDoc(
              resolvedEntryRef,
              { emotionalTone: tone, themes },
              { merge: true },
            ))
            .catch(() => {});
          const analysis = analyzeEntry(entry.entryText, tone);
          const reflection = generateReflection({
            entryText: entry.entryText,
            analysis,
            context: userContext,
            currentThemes: themes,
          });
          deps.updateKheperaMemory(
            resolvedUserId,
            themes,
            tone,
            {
              stance: reflection.stance,
              styleProfile: reflection.styleProfile,
              lastReturnType: 'immediate',
            },
          ).catch(() => {});
        })
        .catch(() => {});
    }

    await deps.releaseQueueEntry(entry.localId, processingOwner, {
      status: 'complete',
      firestoreId: entry.localId,
      syncedAt: new Date().toISOString(),
      userId: resolvedUserId,
    });
    await onTransition?.('completed', entry.localId);

    if (isDelayedReturn) {
      return {
        outcome: 'delayed_return',
        witness: '',
        perspective: '',
        kheperaResponse: '',
        seed: '',
        isCrisis: false,
        entryId: entry.localId,
        scheduledAt: delayedReturnScheduledAt,
      };
    }

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
    recurringThemes: entry.recurringThemes as ThemeTag[],
    dominantTone: entry.dominantTone,
    containerContext: normalizeContainerContext(entry),
  };
}
