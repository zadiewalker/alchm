import { clampMirrorScore, mirrorConfidence } from './memory';
import type {
  MirrorMemoryObservation,
  MirrorPattern,
  MirrorScore,
  MirrorSignalKind,
} from './types';

type SignalRecord = {
  kind: MirrorSignalKind;
  key: string;
  label: string;
  observation: MirrorMemoryObservation;
  score: MirrorScore;
};

const LABELS: Record<string, string> = {
  selfWorth: 'self-worth',
  recurringAnxiety: 'recurring anxiety',
  persistentHope: 'persistent hope',
  whatDoIWant: 'What do I want?',
  amIEnough: 'Am I enough?',
  canITrustMyself: 'Can I trust myself?',
  whatMattersNow: 'What matters now?',
  safetyVsGrowth: 'safety and growth',
  autonomyVsConnection: 'autonomy and connection',
  certaintyVsPossibility: 'certainty and possibility',
  acceptanceVsChange: 'acceptance and change',
};

function labelFor(key: string): string {
  return LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').toLowerCase();
}

function daysBetween(a: string, b: string): number {
  const delta = Math.abs(Date.parse(a) - Date.parse(b));
  return delta / (1000 * 60 * 60 * 24);
}

function collectSignals(observations: MirrorMemoryObservation[]): SignalRecord[] {
  return observations.flatMap((observation) => [
    ...Object.entries(observation.themes).map(([key, score]) => ({
      kind: 'theme' as const,
      key,
      label: labelFor(key),
      observation,
      score,
    })),
    ...Object.entries(observation.emotionalLandscapes).map(([key, score]) => ({
      kind: 'emotionalLandscape' as const,
      key,
      label: labelFor(key),
      observation,
      score,
    })),
    ...Object.entries(observation.identityNarratives).map(([key, score]) => ({
      kind: 'identityNarrative' as const,
      key,
      label: labelFor(key),
      observation,
      score,
    })),
    ...Object.entries(observation.recurringQuestions).map(([key, score]) => ({
      kind: 'recurringQuestion' as const,
      key,
      label: labelFor(key),
      observation,
      score,
    })),
    ...Object.entries(observation.lifeTensions).map(([key, score]) => ({
      kind: 'lifeTension' as const,
      key,
      label: labelFor(key),
      observation,
      score,
    })),
  ]);
}

function groupKey(signal: SignalRecord): string {
  return `${signal.kind}:${signal.key}`;
}

function buildPatternLanguage(signal: SignalRecord, confidenceScore: number): string {
  const confidencePhrase = confidenceScore >= 0.7 ? 'appears to recur' : 'may be beginning to recur';
  if (signal.kind === 'recurringQuestion') {
    return `A question around "${signal.label}" ${confidencePhrase} across the record.`;
  }
  if (signal.kind === 'lifeTension') {
    return `A tension between ${signal.label} ${confidencePhrase} without needing to be resolved.`;
  }
  return `${signal.label} ${confidencePhrase} as a theme to notice, not a conclusion about the user.`;
}

export function formMirrorPatterns(
  observations: MirrorMemoryObservation[],
  nowIso = new Date().toISOString(),
): MirrorPattern[] {
  const signals = collectSignals(observations);
  const grouped = new Map<string, SignalRecord[]>();

  for (const signal of signals) {
    const key = groupKey(signal);
    grouped.set(key, [...(grouped.get(key) ?? []), signal]);
  }

  return [...grouped.entries()]
    .filter(([, group]) => group.length >= 2)
    .map(([id, group]) => {
      const sorted = [...group].sort((a, b) => Date.parse(a.observation.observedAt) - Date.parse(b.observation.observedAt));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const scoreAverage = sorted.reduce((sum, signal) => sum + signal.score.score, 0) / sorted.length;
      const ambiguityScore = sorted.reduce((sum, signal) => sum + signal.observation.ambiguity, 0) / sorted.length;
      const spanDays = Math.max(1, daysBetween(first.observation.observedAt, last.observation.observedAt));
      const recencyDays = daysBetween(last.observation.observedAt, nowIso);
      const evidenceStrength = clampMirrorScore(sorted.length / 6);
      const recency = clampMirrorScore(1 - recencyDays / 120);
      const persistence = clampMirrorScore(spanDays / 120);
      const confidenceScore = clampMirrorScore((evidenceStrength + recency + persistence + scoreAverage) / 4 - ambiguityScore * 0.2);

      return {
        id,
        kind: first.kind,
        key: first.key,
        label: first.label,
        firstSeenAt: first.observation.observedAt,
        lastSeenAt: last.observation.observedAt,
        observationIds: sorted.map((signal) => signal.observation.id),
        evidenceStrength,
        recency,
        persistence,
        ambiguityScore: clampMirrorScore(ambiguityScore),
        confidenceScore,
        confidence: mirrorConfidence(confidenceScore, ambiguityScore),
        language: buildPatternLanguage(first, confidenceScore),
      };
    })
    .sort((a, b) => b.confidenceScore - a.confidenceScore);
}
