import { clampMirrorScore, mirrorConfidence } from './memory';
import type { MirrorMemoryObservation, MirrorMovement, MirrorPattern, MovementKind } from './types';

function chargeFor(pattern: MirrorPattern, observation: MirrorMemoryObservation): number {
  return pattern.observationIds.includes(observation.id) ? observation.emotionalCharge : 0;
}

function clarityFor(pattern: MirrorPattern, observation: MirrorMemoryObservation): number {
  return pattern.observationIds.includes(observation.id) ? observation.reflectiveClarity : 0;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function selectMovement(input: {
  pattern: MirrorPattern;
  recentCharge: number;
  priorCharge: number;
  recentClarity: number;
  priorClarity: number;
}): MovementKind {
  const chargeDelta = input.recentCharge - input.priorCharge;
  const clarityDelta = input.recentClarity - input.priorClarity;

  if (input.pattern.observationIds.length <= 2 && input.pattern.recency > 0.7) return 'emergence';
  if (clarityDelta > 0.25 && chargeDelta < -0.1) return 'integration';
  if (clarityDelta > 0.3) return 'transformation';
  if (chargeDelta > 0.25) return 'intensification';
  if (chargeDelta < -0.2) return 'softening';
  if (input.pattern.recency < 0.35 && input.pattern.persistence > 0.45) return 'resolution';
  return 'recurrence';
}

function movementLanguage(kind: MovementKind, label: string): string {
  switch (kind) {
    case 'emergence':
      return `${label} seems to be newly gathering shape.`;
    case 'intensification':
      return `${label} appears to be carrying more charge lately.`;
    case 'softening':
      return `${label} still appears, but with a softer emotional edge.`;
    case 'integration':
      return `${label} appears to be becoming easier to hold with clarity.`;
    case 'transformation':
      return `${label} seems connected to a different self-understanding than before.`;
    case 'resolution':
      return `${label} appears less central right now, though it remains part of the record.`;
    case 'recurrence':
      return `${label} has returned enough to be noticed again.`;
  }
}

export function detectMirrorMovements(
  patterns: MirrorPattern[],
  observations: MirrorMemoryObservation[],
  nowIso = new Date().toISOString(),
): MirrorMovement[] {
  return patterns.map((pattern) => {
    const related = observations
      .filter((observation) => pattern.observationIds.includes(observation.id))
      .sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
    const midpoint = Math.max(1, Math.floor(related.length / 2));
    const prior = related.slice(0, midpoint);
    const recent = related.slice(midpoint);
    const recentCharge = average(recent.map((observation) => chargeFor(pattern, observation)));
    const priorCharge = average(prior.map((observation) => chargeFor(pattern, observation)));
    const recentClarity = average(recent.map((observation) => clarityFor(pattern, observation)));
    const priorClarity = average(prior.map((observation) => clarityFor(pattern, observation)));
    const kind = selectMovement({ pattern, recentCharge, priorCharge, recentClarity, priorClarity });
    const movementScore = clampMirrorScore(
      pattern.confidenceScore
      + Math.abs(recentCharge - priorCharge) * 0.25
      + Math.abs(recentClarity - priorClarity) * 0.25,
    );

    return {
      id: `${pattern.id}:${kind}`,
      patternId: pattern.id,
      kind,
      observedAt: nowIso,
      confidence: mirrorConfidence(movementScore, pattern.ambiguityScore),
      evidence: [
        `relatedObservations=${related.length}`,
        `recentCharge=${recentCharge.toFixed(2)}`,
        `priorCharge=${priorCharge.toFixed(2)}`,
        `recentClarity=${recentClarity.toFixed(2)}`,
        `priorClarity=${priorClarity.toFixed(2)}`,
      ],
      language: movementLanguage(kind, pattern.label),
    };
  });
}
