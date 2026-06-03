import { mirrorSafetyNotes, validateMirrorSynthesis } from './safety';
import type {
  MirrorMovement,
  MirrorPattern,
  MirrorSynthesis,
  NarrativeInterpretation,
  SynthesisKind,
} from './types';

function synthesisKindFor(movement: MirrorMovement): SynthesisKind {
  switch (movement.kind) {
    case 'emergence':
      return 'emergingStories';
    case 'intensification':
      return 'thingsStillUnfolding';
    case 'softening':
      return 'emotionalWeather';
    case 'integration':
      return 'thingsBecomingClearer';
    case 'transformation':
      return 'momentsOfTransformation';
    case 'resolution':
      return 'evidenceOfGrowth';
    case 'recurrence':
      return 'themesInMotion';
  }
}

function titleFor(kind: SynthesisKind): string {
  switch (kind) {
    case 'themesInMotion':
      return 'Themes In Motion';
    case 'questionsReturning':
      return 'Questions That Keep Returning';
    case 'shiftsInPerspective':
      return 'Shifts In Perspective';
    case 'emotionalWeather':
      return 'Emotional Weather';
    case 'emergingStories':
      return 'Emerging Stories';
    case 'thingsBecomingClearer':
      return 'Things Becoming Clearer';
    case 'thingsStillUnfolding':
      return 'Things Still Unfolding';
    case 'momentsOfTransformation':
      return 'Moments Of Transformation';
    case 'recurringTensions':
      return 'Recurring Tensions';
    case 'evidenceOfGrowth':
      return 'Evidence Of Growth';
  }
}

export function composeMirrorSyntheses(
  patterns: MirrorPattern[],
  movements: MirrorMovement[],
  narrative: NarrativeInterpretation,
): MirrorSynthesis[] {
  const byPattern = new Map(patterns.map((pattern) => [pattern.id, pattern]));
  const movementSyntheses = movements.slice(0, 6).map((movement) => {
    const pattern = byPattern.get(movement.patternId);
    const kind = pattern?.kind === 'recurringQuestion'
      ? 'questionsReturning'
      : pattern?.kind === 'lifeTension'
        ? 'recurringTensions'
        : synthesisKindFor(movement);
    const body = `${movement.language} It may be worth noticing this as movement across time rather than as a measurement.`;
    const synthesis: MirrorSynthesis = {
      id: `synthesis:${movement.id}`,
      kind,
      title: titleFor(kind),
      body,
      relatedPatternIds: [movement.patternId],
      relatedMovementIds: [movement.id],
      confidence: movement.confidence,
      safetyNotes: mirrorSafetyNotes(),
    };
    const safety = validateMirrorSynthesis(synthesis);

    return {
      ...synthesis,
      safetyNotes: [...synthesis.safetyNotes, ...safety.issues],
    };
  });

  return [
    {
      id: `synthesis:${narrative.id}`,
      kind: 'shiftsInPerspective',
      title: narrative.title,
      body: narrative.language,
      relatedPatternIds: narrative.patternIds,
      relatedMovementIds: movements.map((movement) => movement.id),
      confidence: narrative.confidence,
      safetyNotes: mirrorSafetyNotes(),
    },
    ...movementSyntheses,
  ];
}
