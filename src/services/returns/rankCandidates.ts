import type {
  RankedReturnCandidate,
  ReturnCandidateMetadata,
  ReturnHistoryMetadata,
  ReturnType,
} from '@/types/return';

interface RankCandidatesInput {
  currentEntry: ReturnCandidateMetadata;
  candidates: ReturnCandidateMetadata[];
  recentReturns: ReturnHistoryMetadata[];
}

const MINIMUM_SPACING_MS = 1000 * 60 * 60 * 24 * 3;

const MEANINGFUL_CONTRASTS: Record<string, string[]> = {
  anxiety: ['clarity', 'tenderness'],
  anger: ['clarity', 'tenderness'],
  grief: ['tenderness', 'clarity'],
  numbness: ['tenderness', 'joy_gratitude'],
  ambivalence: ['clarity', 'tenderness'],
};

function countSharedThemes(left: string[], right: string[]): number {
  const rightSet = new Set(right);
  return left.reduce((count, theme) => count + (rightSet.has(theme) ? 1 : 0), 0);
}

function buildThemeFrequency(candidates: ReturnCandidateMetadata[]): Map<string, number> {
  const frequency = new Map<string, number>();

  for (const candidate of candidates) {
    for (const theme of candidate.themes) {
      frequency.set(theme, (frequency.get(theme) ?? 0) + 1);
    }
  }

  return frequency;
}

function getTonePairingScore(currentTone: string, candidateTone: string): number {
  if (currentTone === candidateTone) {
    return 3;
  }

  const contrasts = MEANINGFUL_CONTRASTS[currentTone] ?? [];
  return contrasts.includes(candidateTone) ? 2 : 0;
}

function inferReturnType(currentEntry: ReturnCandidateMetadata, candidate: ReturnCandidateMetadata): ReturnType {
  const sharedThemes = countSharedThemes(currentEntry.themes, candidate.themes);

  if (sharedThemes > 0) {
    return 'pattern';
  }

  if (getTonePairingScore(currentEntry.emotionalTone, candidate.emotionalTone) >= 2) {
    return 'contrast';
  }

  return 'seed';
}

export function rankCandidates({
  currentEntry,
  candidates,
  recentReturns,
}: RankCandidatesInput): RankedReturnCandidate[] {
  const themeFrequency = buildThemeFrequency(candidates);
  const recentThemeCounts = new Map<string, number>();

  for (const recentReturn of recentReturns) {
    for (const theme of recentReturn.themes) {
      recentThemeCounts.set(theme, (recentThemeCounts.get(theme) ?? 0) + 1);
    }
  }

  return candidates
    .filter((candidate) => candidate.entryId !== currentEntry.entryId)
    .filter((candidate) => currentEntry.createdAt - candidate.createdAt >= MINIMUM_SPACING_MS)
    .map((candidate) => {
      const sharedThemes = countSharedThemes(currentEntry.themes, candidate.themes);
      const recurrenceWeight = candidate.themes.reduce(
        (total, theme) => total + Math.max((themeFrequency.get(theme) ?? 1) - 1, 0),
        0,
      );
      const overexposureCount = candidate.themes.reduce(
        (total, theme) => total + (recentThemeCounts.get(theme) ?? 0),
        0,
      );
      const tonePairingScore = getTonePairingScore(currentEntry.emotionalTone, candidate.emotionalTone);
      const ageDays = Math.max(0, Math.floor((currentEntry.createdAt - candidate.createdAt) / (1000 * 60 * 60 * 24)));
      const ageScore = Math.min(ageDays / 14, 3);
      const score = (sharedThemes * 5) + recurrenceWeight + tonePairingScore + ageScore - (overexposureCount * 6);

      return {
        ...candidate,
        returnType: inferReturnType(currentEntry, candidate),
        score,
      };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.createdAt !== right.createdAt) {
        return left.createdAt - right.createdAt;
      }

      return left.entryId.localeCompare(right.entryId);
    });
}
