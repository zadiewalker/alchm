import { dataService, type JournalEntry } from '@/services/data/dataService';
import { deriveResurfacingToneMode } from '@/utils/resurfacingTone';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { NotificationContext, ScheduledNotification } from '@/types/notifications';
import type {
  ReturnCandidateMetadata,
  ReturnHistoryMetadata,
  ReturnSelectionResult,
} from '@/types/return';
import { selectRelevantCandidates } from './selectRelevantCandidates';
import { suppressReturns } from './suppressReturns';

function toTimestamp(value: JournalEntry['createdAt']): number {
  return value.getTime();
}

function toCandidate(entry: JournalEntry): ReturnCandidateMetadata {
  return {
    entryId: entry.id,
    createdAt: toTimestamp(entry.createdAt),
    emotionalTone: toEmotionalTone(entry),
    themes: toThemes(entry),
  };
}

function toEmotionalTone(entry: JournalEntry): EmotionalTone {
  return (
    normalizeEmotionalTone(entry.emotionalTone)
    ?? normalizeEmotionalTone(entry.aiAnalysis?.emotionalTone)
    ?? normalizeEmotionalTone(entry.emotions[0])
    ?? 'processing'
  );
}

function toThemes(entry: JournalEntry): ThemeTag[] {
  return (entry.themes ?? [])
    .map((theme) => normalizeTheme(theme))
    .filter((theme): theme is ThemeTag => Boolean(theme));
}

function normalizeEmotionalTone(value: unknown): EmotionalTone | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'anxious':
    case 'anxiety':
      return 'anxiety';
    case 'angry':
    case 'anger':
      return 'anger';
    case 'grief':
    case 'heavy':
      return 'grief';
    case 'numb':
    case 'numbness':
      return 'numbness';
    case 'tender':
    case 'tenderness':
      return 'tenderness';
    case 'okay':
    case 'clear':
    case 'clarity':
      return 'clarity';
    case 'searching':
    case 'mixed':
    case 'ambivalence':
      return 'ambivalence';
    case 'processing':
      return 'processing';
    default:
      return null;
  }
}

function normalizeTheme(theme: string): ThemeTag | null {
  const normalized = theme.toLowerCase().replace(/[\s-]+/g, '_');
  switch (normalized) {
    case 'grief_loss':
    case 'relationship_tension':
    case 'self_worth':
    case 'identity':
    case 'work_purpose':
    case 'fear_uncertainty':
    case 'anger_injustice':
    case 'body_health':
    case 'creativity_expression':
    case 'spirituality_meaning':
    case 'rest_recovery':
    case 'joy_gratitude':
    case 'transition_change':
    case 'boundary_setting':
    case 'childhood_origin':
      return normalized;
    default:
      return null;
  }
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
    dataService.setUserId(context.userId);
    const entries = await dataService.getJournalEntries(80);

    const candidates = entries.map(toCandidate);
    const candidatesById = new Map<string, ReturnCandidateMetadata>(
      candidates.map((candidate) => [candidate.entryId, candidate])
    );
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

    const relevantCandidates = selectRelevantCandidates({
      currentEntry,
      candidates,
      recentReturns,
    });

    const selectedCandidate = relevantCandidates[0];

    if (!selectedCandidate) {
      return buildFallbackSelection(context.entryId);
    }

    return {
      entryId: selectedCandidate.entryId,
      returnType: selectedCandidate.returnType,
      suppressed: false,
      candidate: selectedCandidate,
      resurfacingTone: deriveResurfacingToneMode({
        returnType: selectedCandidate.returnType,
        candidateAgeDays: Math.max(
          0,
          Math.floor((Date.now() - selectedCandidate.createdAt) / (1000 * 60 * 60 * 24)),
        ),
        candidateTone: selectedCandidate.emotionalTone,
        currentTone: currentEntry.emotionalTone,
        candidateThemes: selectedCandidate.themes,
        currentThemes: currentEntry.themes,
      }),
    };
  } catch {
    return buildFallbackSelection(context.entryId);
  }
}
