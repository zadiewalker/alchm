import type { ReturnCandidateMetadata, ReturnHistoryMetadata } from '@/types/return';

const HIGH_INTENSITY_TONES = new Set(['grief', 'anger', 'anxiety']);
const MIN_RETURN_SPACING_MS = 1000 * 60 * 60 * 24 * 5;

interface SuppressReturnInput {
  currentEntry?: ReturnCandidateMetadata;
  recentReturns: ReturnHistoryMetadata[];
  now?: number;
}

export interface ReturnSuppressionDecision {
  suppressed: boolean;
  reason?: 'high_intensity_hold' | 'weak_current_metadata' | 'recent_return_spacing';
}

export function suppressReturns({
  currentEntry,
  recentReturns,
  now = Date.now(),
}: SuppressReturnInput): ReturnSuppressionDecision {
  if (!currentEntry || currentEntry.themes.length === 0 || currentEntry.emotionalTone === 'processing') {
    return {
      suppressed: true,
      reason: 'weak_current_metadata',
    };
  }

  if (currentEntry && HIGH_INTENSITY_TONES.has(currentEntry.emotionalTone)) {
    return {
      suppressed: true,
      reason: 'high_intensity_hold',
    };
  }

  const mostRecentReturn = recentReturns
    .map((recentReturn) => recentReturn.surfacedAt)
    .filter((surfacedAt) => Number.isFinite(surfacedAt))
    .sort((left, right) => right - left)[0];

  if (mostRecentReturn && now - mostRecentReturn < MIN_RETURN_SPACING_MS) {
    return {
      suppressed: true,
      reason: 'recent_return_spacing',
    };
  }

  return {
    suppressed: false,
  };
}
