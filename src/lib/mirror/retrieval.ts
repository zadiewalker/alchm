import type { MirrorMemoryObservation, MirrorPattern, MirrorRetrievalPlan, MirrorTheme } from './types';

type RetrievalInput = {
  currentThemes?: MirrorTheme[];
  userReferencesPast?: boolean;
  elevatedRisk?: boolean;
  patterns: MirrorPattern[];
  observations: MirrorMemoryObservation[];
};

export function planMirrorRetrieval(input: RetrievalInput): MirrorRetrievalPlan {
  if (input.elevatedRisk) {
    return {
      shouldRetrieve: false,
      observationIds: [],
      patternIds: [],
      rationale: ['present-moment safety should supersede longitudinal interpretation'],
    };
  }

  const currentThemes = new Set(input.currentThemes ?? []);
  const relevantPatterns = input.patterns.filter((pattern) => (
    input.userReferencesPast
    || pattern.kind !== 'theme'
    || currentThemes.has(pattern.key as MirrorTheme)
    || pattern.confidenceScore >= 0.55
  ));
  const observationIds = Array.from(new Set(
    relevantPatterns.flatMap((pattern) => pattern.observationIds),
  )).slice(0, 12);

  return {
    shouldRetrieve: relevantPatterns.length > 0,
    observationIds,
    patternIds: relevantPatterns.map((pattern) => pattern.id).slice(0, 8),
    rationale: relevantPatterns.length > 0
      ? ['derived memory appears relevant enough to support recognition without source text']
      : ['no derived pattern is confident enough to retrieve'],
  };
}
