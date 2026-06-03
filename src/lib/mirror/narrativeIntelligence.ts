import type { MirrorMovement, MirrorPattern, NarrativeInterpretation, NarrativeSeason } from './types';

function chooseSeason(movements: MirrorMovement[]): NarrativeSeason {
  const kinds = new Set(movements.map((movement) => movement.kind));
  if (kinds.has('transformation')) return 'turning';
  if (kinds.has('integration')) return 'integration';
  if (kinds.has('intensification')) return 'uncertainty';
  if (kinds.has('recurrence')) return 'repetition';
  if (kinds.has('emergence')) return 'beginning';
  return 'quiet';
}

function titleFor(season: NarrativeSeason): string {
  switch (season) {
    case 'beginning':
      return 'A Beginning Taking Shape';
    case 'uncertainty':
      return 'A Season Of Uncertainty';
    case 'repetition':
      return 'A Thread Returning';
    case 'turning':
      return 'A Possible Turning Point';
    case 'integration':
      return 'Something Becoming More Integrated';
    case 'quiet':
      return 'A Quieter Stretch';
  }
}

export function interpretMirrorNarrative(
  patterns: MirrorPattern[],
  movements: MirrorMovement[],
  timeframeLabel = 'this season',
): NarrativeInterpretation {
  const season = chooseSeason(movements);
  const leadingPatterns = patterns.slice(0, 3);
  const patternPhrase = leadingPatterns.map((pattern) => pattern.label).join(', ') || 'what has been present';
  const movementKinds = Array.from(new Set(movements.map((movement) => movement.kind)));

  return {
    id: `narrative:${season}:${leadingPatterns.map((pattern) => pattern.key).join('-') || 'quiet'}`,
    season,
    title: titleFor(season),
    timeframeLabel,
    movements: movementKinds,
    patternIds: leadingPatterns.map((pattern) => pattern.id),
    confidence: leadingPatterns[0]?.confidence ?? 'low',
    language: `Across ${timeframeLabel}, ${patternPhrase} may be forming part of the larger shape. This is a possible reading, not a verdict.`,
  };
}
