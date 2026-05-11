import type { ReturnCandidateMetadata, ReturnHistoryMetadata } from '@/types/return';

const HIGH_INTENSITY_TONES = new Set(['grief', 'anger', 'anxiety']);

interface SuppressReturnInput {
  currentEntry?: ReturnCandidateMetadata;
  recentReturns: ReturnHistoryMetadata[];
}

export interface ReturnSuppressionDecision {
  suppressed: boolean;
  reason?: 'high_intensity_hold';
}

export function suppressReturns({
  currentEntry,
}: SuppressReturnInput): ReturnSuppressionDecision {
  if (currentEntry && HIGH_INTENSITY_TONES.has(currentEntry.emotionalTone)) {
    return {
      suppressed: true,
      reason: 'high_intensity_hold',
    };
  }

  return {
    suppressed: false,
  };
}
