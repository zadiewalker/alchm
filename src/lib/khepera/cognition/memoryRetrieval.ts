import type {
  KheperaCognitionInput,
  MemoryCandidate,
  MemoryRetrievalPlan,
  PsychologicalStateAssessment,
  RankedMemoryCandidate,
} from './types';

function sharedThemeCount(a: readonly string[], b: readonly string[]): number {
  return a.filter((item) => b.includes(item)).length;
}

function rankMemory(
  candidate: MemoryCandidate,
  input: Pick<KheperaCognitionInput, 'currentThemes' | 'currentTone'>,
): RankedMemoryCandidate {
  const rankingFactors: string[] = [];
  let retrievalScore = 0;
  const themeMatches = sharedThemeCount(candidate.themes, input.currentThemes ?? []);
  if (themeMatches > 0) {
    retrievalScore += themeMatches * 0.24;
    rankingFactors.push(`semantic-theme-match:${themeMatches}`);
  }
  if (candidate.emotionalTone && candidate.emotionalTone === input.currentTone) {
    retrievalScore += 0.18;
    rankingFactors.push('emotional-similarity');
  }
  if (candidate.recurrenceCount >= 3) {
    retrievalScore += 0.18;
    rankingFactors.push('recurrence');
  }
  if ((candidate.breakthroughSignificance ?? 0) >= 0.6) {
    retrievalScore += 0.16;
    rankingFactors.push('breakthrough-significance');
  }
  if ((candidate.unresolvedLoopSignificance ?? 0) >= 0.6) {
    retrievalScore += 0.16;
    rankingFactors.push('unresolved-loop-significance');
  }
  if ((candidate.userStatedImportance ?? 0) >= 0.6) {
    retrievalScore += 0.14;
    rankingFactors.push('user-stated-importance');
  }
  if (candidate.lastSeenAt) {
    retrievalScore += 0.04;
    rankingFactors.push('has-recency-marker');
  }

  return {
    ...candidate,
    retrievalScore: Math.min(1, Number(retrievalScore.toFixed(3))),
    rankingFactors,
  };
}

export function planMemoryRetrieval(
  input: Pick<KheperaCognitionInput, 'currentThemes' | 'currentTone' | 'memoryCandidates'>,
  assessment: PsychologicalStateAssessment,
): MemoryRetrievalPlan {
  if (assessment.riskLevel !== 'low') {
    return {
      shouldRetrieve: false,
      rankedMemories: [],
      rationale: ['risk is elevated, so memory retrieval is deferred'],
    };
  }

  if (assessment.confidence === 'low') {
    return {
      shouldRetrieve: false,
      rankedMemories: [],
      rationale: ['assessment confidence is low, so memory retrieval would be intrusive'],
    };
  }

  const rankedMemories = (input.memoryCandidates ?? [])
    .map((candidate) => rankMemory(candidate, input))
    .filter((candidate) => candidate.retrievalScore >= 0.34)
    .sort((a, b) => b.retrievalScore - a.retrievalScore)
    .slice(0, 3);

  return {
    shouldRetrieve: rankedMemories.length > 0,
    rankedMemories,
    rationale: rankedMemories.length > 0
      ? ['memory relevance is metadata-bound and strong enough for subtle continuity']
      : ['no memory candidate passed relevance threshold'],
  };
}
