import type { ContainerContext, ContainerPhase } from '@/types/container';

type ContainerContextFields = {
  containerContext?: ContainerContext;
  containerId?: string;
  userContainerId?: string;
  containerName?: string;
  containerDay?: number;
  containerClinicalIntent?: string;
  containerPhase?: string;
  containerPhaseNote?: string;
  todayPrompt?: string;
  kheperaIntent?: string;
};

export function normalizeContainerContext(fields: ContainerContextFields): ContainerContext | undefined {
  if (fields.containerContext) {
    return fields.containerContext;
  }

  if (!fields.containerId) {
    return undefined;
  }

  return {
    containerId: fields.containerId,
    userContainerId: fields.userContainerId,
    containerName: fields.containerName ?? fields.containerId,
    clinicalIntent: fields.containerClinicalIntent ?? '',
    currentDay: fields.containerDay ?? 1,
    phase: (fields.containerPhase ?? 'grounding') as ContainerPhase,
    phaseArcNote: fields.containerPhaseNote ?? '',
    todayPrompt: fields.todayPrompt ?? '',
    kheperaIntent: fields.kheperaIntent ?? '',
  };
}

export function buildContainerPromptBlock(containerContext?: ContainerContext): string {
  if (!containerContext) return '';

  return `
Container context:
The user is writing within the ${containerContext.containerName} container.

Use this only as quiet emotional context.
Do not mention the container unless the user names it.
Do not introduce tasks, advice, coaching, diagnosis, arc claims, or resolution language.
Let the current entry remain primary.
Maintain the required Khepera structure exactly.
`.trim();
}

export function isArcReflectionDay(day: number): boolean {
  return day === 7 || day === 14;
}

export function getContainerMoonPhase(currentDay: number, totalDays: number): {
  phase: 'new' | 'waxing' | 'full' | 'waning';
  metaphorText: string;
} {
  if (totalDays === 7) {
    if (currentDay <= 2) {
      return { phase: 'new', metaphorText: 'Something beginning' };
    }
    if (currentDay <= 5) {
      return { phase: 'waxing', metaphorText: 'Growing awareness' };
    }
    return { phase: 'full', metaphorText: 'Coming together' };
  }

  if (currentDay <= 5) {
    return { phase: 'new', metaphorText: 'Something beginning' };
  }
  if (currentDay <= 10) {
    return { phase: 'waxing', metaphorText: 'Patterns emerging' };
  }
  if (currentDay <= 17) {
    return { phase: 'full', metaphorText: 'Meeting what is' };
  }
  return { phase: 'waning', metaphorText: 'Integration' };
}
