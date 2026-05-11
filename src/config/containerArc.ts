export const CONTAINER_PHASES = {
  grounding: {
    days: [1, 2, 3, 4, 5],
    lunarPhase: 'new_moon' as const,
    lunarLabel: 'New Moon',
    metaphor: 'Something beginning',
    kheperaArcNote: 'The user is arriving. Hold space. Don\'t rush.',
  },
  pattern: {
    days: [6, 7, 8, 9, 10],
    lunarPhase: 'waxing' as const,
    lunarLabel: 'Waxing',
    metaphor: 'Something becoming visible',
    kheperaArcNote: 'The user is noticing. Reflect patterns gently.',
  },
  contact: {
    days: [11, 12, 13, 14, 15, 16, 17],
    lunarPhase: 'full_moon' as const,
    lunarLabel: 'Full Moon',
    metaphor: 'Something fully illuminated',
    kheperaArcNote: 'The user is close to tender material. Stay restrained and do not resolve it.',
  },
  integration: {
    days: [18, 19, 20, 21],
    lunarPhase: 'waning' as const,
    lunarLabel: 'Waning',
    metaphor: 'Something settling',
    kheperaArcNote: 'The user is letting the material settle. Do not turn this into closure.',
  },
};

export type LunarPhase = 'new_moon' | 'waxing' | 'full_moon' | 'waning';

export type ContainerPhaseDefinition = (typeof CONTAINER_PHASES)[keyof typeof CONTAINER_PHASES];

export const getContainerPhase = (dayNumber: number): ContainerPhaseDefinition | undefined => {
  return Object.values(CONTAINER_PHASES).find(phase => 
    phase.days.includes(dayNumber)
  );
};

export const getLunarPhaseForDay = (dayNumber: number): LunarPhase => {
  const phase = getContainerPhase(dayNumber);
  return phase?.lunarPhase || 'new_moon';
};

export const getMetaphorForDay = (dayNumber: number): string => {
  const phase = getContainerPhase(dayNumber);
  return phase?.metaphor || 'Something beginning';
};

export const getKheperaArcNote = (dayNumber: number): string => {
  const phase = getContainerPhase(dayNumber);
  return phase?.kheperaArcNote || 'The user is arriving. Hold space.';
};
