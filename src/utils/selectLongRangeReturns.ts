import type { JournalEntry } from '@/services/data/dataService';
import { selectReturnExcerpt } from '@/services/returns/returnPreview';
import type { ArcPoint } from '@/types/mirror';

export interface LongRangeReturnCandidate {
  entryId: string;
  excerpt: string;
  daysElapsed: number;
  createdAt: Date;
  score: number;
  matchedThemes: string[];
  tone: string;
  framing: string;
}

const MINIMUM_LONG_RANGE_DAYS = 45;
const RARITY_SCORE_THRESHOLD = 4;

function calculateReturnDaysAgo(createdAt: Date): number {
  return Math.max(0, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
}

function ageScore(daysElapsed: number): number {
  if (daysElapsed >= 180) return 4;
  if (daysElapsed >= 120) return 3;
  if (daysElapsed >= 90) return 2;
  if (daysElapsed >= MINIMUM_LONG_RANGE_DAYS) return 1;
  return 0;
}

function buildThemeSignature(themes: string[]): string {
  return [...themes].sort().join('|');
}

function buildFraming(themeOverlapCount: number, toneMatches: boolean): string {
  if (themeOverlapCount >= 2) {
    return 'A thread from before meets you again.';
  }

  if (themeOverlapCount === 1 || toneMatches) {
    return 'Something here feels familiar.';
  }

  return 'This returns from earlier.';
}

export function selectLongRangeReturns(
  entries: JournalEntry[],
  arc: ArcPoint[],
  maxCount = 2,
): LongRangeReturnCandidate[] {
  const arcById = new Map(arc.map((point) => [point.sessionId, point]));
  const recentArc = arc.slice(-3);
  const recentThemes = new Set(recentArc.flatMap((point) => point.themes));
  const recentTone = recentArc.at(-1)?.tone ?? null;
  const selectedThemeSignatures = new Set<string>();

  return entries
    .map((entry) => {
      const memoryPoint = arcById.get(entry.id);
      if (!memoryPoint) {
        return null;
      }

      const daysElapsed = calculateReturnDaysAgo(entry.createdAt);
      if (daysElapsed < MINIMUM_LONG_RANGE_DAYS) {
        return null;
      }

      const matchedThemes = memoryPoint.themes.filter((theme) => recentThemes.has(theme));
      const toneMatches = Boolean(recentTone && memoryPoint.tone === recentTone);
      const score =
        ageScore(daysElapsed) +
        matchedThemes.length * 2 +
        (toneMatches ? 1 : 0);

      if (
        score < RARITY_SCORE_THRESHOLD ||
        (matchedThemes.length === 0 && !toneMatches && daysElapsed < 180)
      ) {
        return null;
      }

      return {
        entryId: entry.id,
        excerpt: selectReturnExcerpt(String(entry.content || '')),
        daysElapsed,
        createdAt: entry.createdAt,
        score,
        matchedThemes,
        tone: memoryPoint.tone,
        framing: buildFraming(matchedThemes.length, toneMatches),
        themeSignature: buildThemeSignature(memoryPoint.themes),
      };
    })
    .filter((entry): entry is LongRangeReturnCandidate & { themeSignature: string } => Boolean(entry?.excerpt))
    .sort((left, right) =>
      right.score - left.score ||
      right.daysElapsed - left.daysElapsed ||
      left.entryId.localeCompare(right.entryId),
    )
    .filter((candidate) => {
      const signature = candidate.themeSignature || candidate.entryId;
      if (selectedThemeSignatures.has(signature)) {
        return false;
      }

      selectedThemeSignatures.add(signature);
      return true;
    })
    .slice(0, maxCount)
    .map(({ themeSignature, ...candidate }) => candidate);
}
