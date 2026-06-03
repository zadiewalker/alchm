import type {
  KheperaCognitionInput,
  KheperaConfidence,
  LongitudinalPattern,
  PatternIntelligenceResult,
  ProgressionState,
  PsychologicalStateAssessment,
} from './types';

function topNeed(assessment: PsychologicalStateAssessment): string {
  return Object.entries(assessment.dominantNeed).sort((a, b) => b[1].score - a[1].score)[0]?.[0] ?? 'witnessing';
}

function resolveProgressionState(
  patterns: LongitudinalPattern[],
  assessment: PsychologicalStateAssessment,
): ProgressionState {
  if (assessment.dominantNeed.integration.score >= 0.62) return 'integration';
  const breakthrough = patterns.find((pattern) => (pattern.breakthroughSignificance ?? 0) >= 0.7);
  if (breakthrough) return 'transformation';
  const chronic = patterns.find(
    (pattern) => pattern.progressionState === 'chronicLoop' || pattern.recurrenceCount >= 6,
  );
  if (chronic) return 'chronicLoop';
  const recurring = patterns.find(
    (pattern) => pattern.progressionState === 'recurringPattern' || pattern.recurrenceCount >= 3,
  );
  if (recurring) return 'recurringPattern';
  const emerging = patterns.find(
    (pattern) => pattern.progressionState === 'emergingPattern' || pattern.recurrenceCount >= 2,
  );
  return emerging ? 'emergingPattern' : 'firstEncounter';
}

function confidenceFor(patterns: LongitudinalPattern[], state: ProgressionState): KheperaConfidence {
  if (state === 'firstEncounter') return 'moderate';
  if (patterns.length >= 2 || patterns.some((pattern) => pattern.recurrenceCount >= 4)) return 'high';
  return 'moderate';
}

export function modelLongitudinalPatterns(
  input: Pick<KheperaCognitionInput, 'currentThemes' | 'longitudinalPatterns'>,
  assessment: PsychologicalStateAssessment,
): PatternIntelligenceResult {
  const currentThemes = input.currentThemes ?? [];
  const patterns = (input.longitudinalPatterns ?? []).filter((pattern) =>
    pattern.themes.some((theme) => currentThemes.includes(theme))
    || pattern.progressionState === 'transformation'
    || pattern.progressionState === 'integration',
  );
  const progressionState = resolveProgressionState(patterns, assessment);
  const rationale = [
    `dominantNeed=${topNeed(assessment)}`,
    `matchedPatterns=${patterns.length}`,
    `progressionState=${progressionState}`,
  ];

  if (progressionState === 'firstEncounter') rationale.push('favor witnessing before pattern naming');
  if (progressionState === 'chronicLoop') rationale.push('allow a new angle only if risk is low');
  if (progressionState === 'transformation') rationale.push('reinforce growth without performance pressure');
  if (progressionState === 'integration') rationale.push('support identity consolidation without certainty claims');

  return {
    progressionState,
    relevantPatterns: patterns,
    rationale,
    confidence: confidenceFor(patterns, progressionState),
  };
}
