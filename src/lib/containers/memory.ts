import type {
  ContainerContext,
  ContainerFirestoreModel,
  ContainerMemoryRecord,
  ContainerRelationship,
} from './types';

export function buildContainerFirestoreModel(userId: string, userContainerId: string): ContainerFirestoreModel {
  return {
    relationship: `users/${userId}/containerRelationships/${userContainerId}`,
    memory: `users/${userId}/containerRelationships/${userContainerId}/memory`,
    inquiries: `users/${userId}/containerRelationships/${userContainerId}/inquiries`,
    syntheses: `users/${userId}/containerRelationships/${userContainerId}/syntheses`,
  };
}

export function createContainerMemoryRecord(input: {
  id: string;
  context: ContainerContext;
  relationship: ContainerRelationship;
  observedAt: string;
  sourceSessionId?: string;
  insights?: string[];
  unresolvedQuestions?: string[];
  emergingQuestions?: string[];
  momentsOfIntegration?: string[];
  ambiguity?: number;
}): ContainerMemoryRecord {
  return {
    id: input.id,
    containerId: input.context.id,
    userContainerId: input.relationship.userContainerId,
    observedAt: input.observedAt,
    sourceSessionId: input.sourceSessionId,
    derivedFrom: 'kheperaReflection',
    insights: input.insights ?? [],
    recurringThemes: input.context.activeThemes,
    emotionalMovements: input.context.mirrorMovementFocus.slice(0, 2),
    unresolvedQuestions: input.unresolvedQuestions ?? [],
    emergingQuestions: input.emergingQuestions ?? [],
    developmentalShifts: input.context.developmentalPriorities.slice(0, 2),
    momentsOfIntegration: input.momentsOfIntegration ?? [],
    ambiguity: Math.max(0, Math.min(1, input.ambiguity ?? 0.45)),
  };
}

export function summarizeContainerMemoryForRetrieval(records: ContainerMemoryRecord[]): {
  unresolvedQuestions: string[];
  emergingQuestions: string[];
  integrationSignals: string[];
} {
  return {
    unresolvedQuestions: Array.from(new Set(records.flatMap((record) => record.unresolvedQuestions))).slice(0, 5),
    emergingQuestions: Array.from(new Set(records.flatMap((record) => record.emergingQuestions))).slice(0, 5),
    integrationSignals: Array.from(new Set(records.flatMap((record) => record.momentsOfIntegration))).slice(0, 5),
  };
}
