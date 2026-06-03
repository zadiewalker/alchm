import type { ContainerRelationship, ContainerRelationshipState } from './types';

export function inferContainerRelationshipState(input: {
  enteredAt: string;
  lastVisitedAt?: string;
  memoryRecordCount: number;
  integrationCount: number;
  nowIso?: string;
}): ContainerRelationshipState {
  const now = Date.parse(input.nowIso ?? new Date().toISOString());
  const lastVisit = input.lastVisitedAt ? Date.parse(input.lastVisitedAt) : Date.parse(input.enteredAt);
  const daysAway = Math.max(0, (now - lastVisit) / (1000 * 60 * 60 * 24));

  if (input.integrationCount > 0) return 'integrating';
  if (daysAway >= 21) return 'returning';
  if (daysAway >= 7) return 'resting';
  if (input.memoryRecordCount >= 8) return 'deepening';
  if (input.memoryRecordCount >= 2) return 'dwelling';
  return 'entering';
}

export function updateContainerRelationship(
  relationship: ContainerRelationship,
  state: ContainerRelationshipState,
  visitedAt: string,
): ContainerRelationship {
  return {
    ...relationship,
    state,
    lastVisitedAt: visitedAt,
  };
}

export function relationshipStateIsPressureFree(state: ContainerRelationshipState): boolean {
  return [
    'entering',
    'dwelling',
    'deepening',
    'resting',
    'returning',
    'integrating',
    'revisiting',
  ].includes(state);
}
