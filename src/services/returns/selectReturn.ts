import { loadEntries } from '@/services/journal/entriesService';
import type { JournalEntry } from '@/types/journal';
import type { NotificationContext, ScheduledNotification } from '@/types/notifications';
import type {
  ReturnCandidateMetadata,
  ReturnHistoryMetadata,
  ReturnSelectionResult,
} from '@/types/return';
import { rankCandidates } from './rankCandidates';
import { suppressReturns } from './suppressReturns';

function toTimestamp(value: JournalEntry['createdAt']): number {
  if (typeof (value as unknown as { toDate?: () => Date }).toDate === 'function') {
    return (value as unknown as { toDate: () => Date }).toDate().getTime();
  }

  return new Date(value as unknown as string | number | Date).getTime();
}

function toCandidate(entry: JournalEntry): ReturnCandidateMetadata {
  return {
    entryId: entry.id,
    createdAt: toTimestamp(entry.createdAt),
    emotionalTone: entry.emotionalTone,
    themes: entry.themes,
  };
}

function buildReturnHistory(
  recentNotifications: ScheduledNotification[],
  candidatesById: Map<string, ReturnCandidateMetadata>,
): ReturnHistoryMetadata[] {
  return recentNotifications
    .filter((notification) => notification.config.type === 'seedReturn')
    .filter((notification) => !notification.cancelled)
    .map((notification) => {
      const entryId = notification.config.context?.entryId;
      if (!entryId) {
        return null;
      }

      const candidate = candidatesById.get(entryId);
      if (!candidate) {
        return null;
      }

      return {
        ...candidate,
        surfacedAt: new Date(notification.scheduledAt).getTime(),
        returnType: notification.config.context?.returnType || 'seed',
      } satisfies ReturnHistoryMetadata;
    })
    .filter((value): value is ReturnHistoryMetadata => value !== null)
    .sort((left, right) => right.surfacedAt - left.surfacedAt)
    .slice(0, 5);
}

function buildFallbackSelection(entryId: string): ReturnSelectionResult {
  return {
    entryId,
    returnType: 'seed',
    suppressed: false,
  };
}

export async function selectReturn(
  context: NotificationContext,
  recentNotifications: ScheduledNotification[],
): Promise<ReturnSelectionResult> {
  if (!context.entryId) {
    return {
      entryId: null,
      returnType: 'seed',
      suppressed: true,
      reason: 'missing_entry_context',
    };
  }

  if (!context.userId || context.userId === 'anonymous') {
    return buildFallbackSelection(context.entryId);
  }

  try {
    const { entries } = await loadEntries({
      userId: context.userId,
      pageSize: 80,
    });

    const candidates = entries.map(toCandidate);
    const candidatesById = new Map(candidates.map((candidate) => [candidate.entryId, candidate]));
    const currentEntry = candidatesById.get(context.entryId);

    if (!currentEntry) {
      return buildFallbackSelection(context.entryId);
    }

    const recentReturns = buildReturnHistory(recentNotifications, candidatesById);
    const suppression = suppressReturns({
      currentEntry,
      recentReturns,
    });

    if (suppression.suppressed) {
      return {
        entryId: null,
        returnType: 'seed',
        suppressed: true,
        reason: suppression.reason,
      };
    }

    const rankedCandidates = rankCandidates({
      currentEntry,
      candidates,
      recentReturns,
    });

    const selectedCandidate = rankedCandidates[0];

    if (!selectedCandidate) {
      return buildFallbackSelection(context.entryId);
    }

    return {
      entryId: selectedCandidate.entryId,
      returnType: selectedCandidate.returnType,
      suppressed: false,
      candidate: selectedCandidate,
    };
  } catch {
    return buildFallbackSelection(context.entryId);
  }
}
