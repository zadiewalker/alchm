import { dataService, type JournalEntry } from '@/services/data/dataService';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { NotificationContext, ScheduledNotification } from '@/types/notifications';
import type {
  ReturnCandidateMetadata,
  ReturnHistoryMetadata,
  ReturnSelectionResult,
} from '@/types/return';
import { rankCandidates } from './rankCandidates';
import { suppressReturns } from './suppressReturns';

const ALLOWED_TONES = new Set<EmotionalTone>([
  'processing',
  'grief',
  'anger',
  'anxiety',
  'clarity',
  'numbness',
  'tenderness',
  'ambivalence',
]);

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
  const themes = entry.themes?.length ? entry.themes : entry.aiAnalysis?.themes || entry.tags;
  return themes
    .map((theme) => normalizeTheme(theme))
    .filter((theme): theme is ThemeTag => Boolean(theme));
}

function normalizeEmotionalTone(value: unknown): EmotionalTone | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.toLowerCase().replace(/[\s-]+/g, '_');
  const aliases: Record<string, EmotionalTone> = {
    anxious: 'anxiety',
    anxiety: 'anxiety',
    angry: 'anger',
    anger: 'anger',
    grief: 'grief',
    heavy: 'grief',
    numb: 'numbness',
    numbness: 'numbness',
    tender: 'tenderness',
    tenderness: 'tenderness',
    okay: 'clarity',
    clear: 'clarity',
    clarity: 'clarity',
    searching: 'ambivalence',
    mixed: 'ambivalence',
    ambivalence: 'ambivalence',
    processing: 'processing',
  };
  const tone = aliases[normalized] ?? normalized;

  return ALLOWED_TONES.has(tone as EmotionalTone) ? (tone as EmotionalTone) : null;
}

function normalizeTheme(theme: string): ThemeTag | null {
  const normalized = theme.toLowerCase().replace(/[\s-]+/g, '_');
  const allowedThemes = new Set<ThemeTag>([
    'grief_loss',
    'relationship_tension',
    'self_worth',
    'identity',
    'work_purpose',
    'fear_uncertainty',
    'anger_injustice',
    'body_health',
    'creativity_expression',
    'spirituality_meaning',
    'rest_recovery',
    'joy_gratitude',
    'transition_change',
    'boundary_setting',
    'childhood_origin',
  ]);

  return allowedThemes.has(normalized as ThemeTag) ? (normalized as ThemeTag) : null;
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
