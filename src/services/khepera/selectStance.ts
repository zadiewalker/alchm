import type {
  KheperaContinuityMode,
  KheperaMemorySignal,
  ReflectionAnalysis,
  ResponseStance,
} from '@/types/khepera';

const STANCE_ROTATION: ResponseStance[] = [
  'witnessing',
  'clarifying',
  'integrating',
  'holding_ambiguity',
];

function rotateStance(
  recentStances: ResponseStance[],
  fallback: ResponseStance,
): ResponseStance {
  const lastRotatingStance = [...recentStances].reverse().find((stance) => STANCE_ROTATION.includes(stance));

  if (!lastRotatingStance) {
    return STANCE_ROTATION.includes(fallback) ? fallback : 'witnessing';
  }

  const currentIndex = STANCE_ROTATION.indexOf(lastRotatingStance);
  const nextIndex = (currentIndex + 1) % STANCE_ROTATION.length;
  return STANCE_ROTATION[nextIndex];
}

function repeatedTooOften(recentStances: ResponseStance[], stance: ResponseStance): boolean {
  return recentStances.length >= 2
    && recentStances.at(-1) === stance
    && recentStances.at(-2) === stance;
}

function shouldRotate(
  base: ResponseStance,
  memorySignal?: KheperaMemorySignal,
  continuityMode?: KheperaContinuityMode,
): boolean {
  if (!memorySignal) {
    return false;
  }

  if (!STANCE_ROTATION.includes(base)) {
    return false;
  }

  if (continuityMode === 'stance_shift') {
    return true;
  }

  if (repeatedTooOften(memorySignal.recentStances, base)) {
    return true;
  }

  return memorySignal.repeatedThemeCount > 0;
}

function resolveWithRotation(
  base: ResponseStance,
  memorySignal?: KheperaMemorySignal,
  continuityMode?: KheperaContinuityMode,
): ResponseStance {
  if (!shouldRotate(base, memorySignal, continuityMode)) {
    return base;
  }

  return rotateStance(memorySignal?.recentStances ?? [], base);
}

export function selectStance(
  analysis: ReflectionAnalysis,
  options: {
    memorySignal?: KheperaMemorySignal;
    continuityMode?: KheperaContinuityMode;
  } = {}
): ResponseStance {
  const { memorySignal, continuityMode } = options;
  if (
    analysis.relationalPosture === 'self-attacking'
    || (analysis.relationalPosture === 'self-protective' && analysis.emotionalIntensity !== 'low')
  ) {
    return 'containing';
  }

  if (
    analysis.signalStability === 'disorganized'
    || analysis.emotionalIntensity === 'high'
    || analysis.temporalFrame === 'present_overwhelm'
  ) {
    return 'containing';
  }

  if (
    analysis.psychologicalNeedState === 'witnessing'
    || analysis.narrativeMode === 'fragmented'
  ) {
    return resolveWithRotation('witnessing', memorySignal, continuityMode);
  }

  if (
    analysis.narrativeMode === 'looping'
    || (
      analysis.psychologicalNeedState === 'coherence'
      && analysis.cognitiveStyle === 'ruminative'
      && analysis.signalStability !== 'stable'
    )
  ) {
    return resolveWithRotation('clarifying', memorySignal, continuityMode);
  }

  if (
    analysis.psychologicalNeedState === 'ambiguity'
    || analysis.narrativeMode === 'exploratory'
    || (
      analysis.relationalPosture === 'self-protective'
      && analysis.emotionalIntensity === 'low'
    )
  ) {
    return resolveWithRotation('holding_ambiguity', memorySignal, continuityMode);
  }

  if (
    (analysis.emotionalTone === 'grief' || analysis.relationalPosture === 'tender')
    && analysis.movementSignal !== 'shifting'
    && analysis.movementSignal !== 'settled'
  ) {
    return resolveWithRotation('witnessing', memorySignal, continuityMode);
  }

  if (
    analysis.psychologicalNeedState === 'integration'
    || analysis.movementSignal === 'shifting'
    || analysis.movementSignal === 'settled'
  ) {
    return resolveWithRotation('integrating', memorySignal, continuityMode);
  }

  if (
    analysis.psychologicalNeedState === 'distancing'
    || analysis.distanceFromSelf === 'distanced'
    || analysis.narrativeMode === 'avoidant'
    || (analysis.cognitiveStyle === 'concrete' && analysis.textStructure.wordCount <= 24)
  ) {
    return resolveWithRotation('clarifying', memorySignal, continuityMode);
  }

  if (
    analysis.narrativeMode === 'reflective'
    && analysis.psychologicalNeedState === 'coherence'
    && analysis.signalStability === 'stable'
  ) {
    const base: ResponseStance =
      analysis.cognitiveStyle === 'meaning-making'
        ? 'integrating'
        : 'expanding';
    return resolveWithRotation(base, memorySignal, continuityMode);
  }

  const base: ResponseStance = 'clarifying';
  return resolveWithRotation(base, memorySignal, continuityMode);
}
