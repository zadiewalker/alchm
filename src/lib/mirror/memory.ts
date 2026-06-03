import type {
  EmotionalLandscape,
  IdentityNarrative,
  LifeTension,
  MirrorConfidence,
  MirrorFirestoreModel,
  MirrorMemoryObservation,
  MirrorScore,
  MirrorTheme,
  RecurringQuestion,
} from './types';

type ScoreMap<Key extends string> = Partial<Record<Key, MirrorScore>>;

type MirrorObservationInput = {
  id: string;
  observedAt: string;
  source: MirrorMemoryObservation['source'];
  themes?: Partial<Record<MirrorTheme, number>>;
  emotionalLandscapes?: Partial<Record<EmotionalLandscape, number>>;
  identityNarratives?: Partial<Record<IdentityNarrative, number>>;
  recurringQuestions?: Partial<Record<RecurringQuestion, number>>;
  lifeTensions?: Partial<Record<LifeTension, number>>;
  emotionalCharge?: number;
  reflectiveClarity?: number;
  ambiguity?: number;
};

export function clampMirrorScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function mirrorConfidence(score: number, ambiguity: number): MirrorConfidence {
  const adjusted = clampMirrorScore(score) - clampMirrorScore(ambiguity) * 0.35;
  if (adjusted >= 0.7) return 'high';
  if (adjusted >= 0.4) return 'moderate';
  return 'low';
}

function buildScores<Key extends string>(
  input: Partial<Record<Key, number>> | undefined,
  reason: string,
): ScoreMap<Key> {
  const output: ScoreMap<Key> = {};
  if (!input) return output;

  for (const [key, value] of Object.entries(input) as Array<[Key, number]>) {
    const score = clampMirrorScore(value);
    if (score <= 0) continue;
    output[key] = {
      score,
      evidenceCount: 1,
      rationale: [reason],
    };
  }

  return output;
}

function averageScore(maps: Array<ScoreMap<string>>): number {
  const scores = maps.flatMap((map) => (
    Object.values(map)
      .filter((score): score is MirrorScore => score !== undefined)
      .map((score) => score.score)
  ));
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

export function createMirrorMemoryObservation(input: MirrorObservationInput): MirrorMemoryObservation {
  const themes = buildScores(input.themes, 'derived theme signal');
  const emotionalLandscapes = buildScores(input.emotionalLandscapes, 'derived emotional landscape signal');
  const identityNarratives = buildScores(input.identityNarratives, 'derived identity narrative signal');
  const recurringQuestions = buildScores(input.recurringQuestions, 'derived recurring question signal');
  const lifeTensions = buildScores(input.lifeTensions, 'derived life tension signal');
  const ambiguity = clampMirrorScore(input.ambiguity ?? 0.35);
  const signalScore = averageScore([
    themes,
    emotionalLandscapes,
    identityNarratives,
    recurringQuestions,
    lifeTensions,
  ]);

  return {
    id: input.id,
    observedAt: input.observedAt,
    source: input.source,
    themes,
    emotionalLandscapes,
    identityNarratives,
    recurringQuestions,
    lifeTensions,
    emotionalCharge: clampMirrorScore(input.emotionalCharge ?? signalScore),
    reflectiveClarity: clampMirrorScore(input.reflectiveClarity ?? signalScore),
    ambiguity,
    confidence: mirrorConfidence(signalScore, ambiguity),
  };
}

export function buildMirrorFirestoreModel(userId: string): MirrorFirestoreModel {
  return {
    root: `users/${userId}/mirror`,
    observations: `users/${userId}/mirror/observations`,
    patterns: `users/${userId}/mirror/patterns`,
    movements: `users/${userId}/mirror/movements`,
    syntheses: `users/${userId}/mirror/syntheses`,
  };
}
