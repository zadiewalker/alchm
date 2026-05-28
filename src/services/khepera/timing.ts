import type {
  KheperaPacingState,
  KheperaUserContext,
  ReflectionAnalysis,
  ReflectionTiming,
  ResponseStance,
} from '@/types/khepera';
import type { EmotionalTone } from '@/types/journal';

const SHORT_DELAY_MIN_MS = 300;
const SHORT_DELAY_RANGE_MS = 900;
const DEV_DELAY_MIN_MS = 5_000;
const DEV_DELAY_RANGE_MS = 25_000;
const PROD_DELAY_MIN_MS = 2 * 60 * 60 * 1000;
const PROD_DELAY_RANGE_MS = 46 * 60 * 60 * 1000;

function stableFraction(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function repeatsThreeTimes<T>(items: T[], candidate: T): boolean {
  return items.length >= 2 && items.slice(-2).every((item) => item === candidate);
}

export function buildKheperaPacingState(context?: KheperaUserContext): KheperaPacingState {
  return {
    recentStances: context?.recentStances ?? [],
    recentTones: [context?.previousTone, context?.dominantTone].filter(
      (tone): tone is EmotionalTone => tone !== undefined,
    ),
    lastReturnType: context?.lastReturnType ?? 'immediate',
  };
}

export function adjustStanceForPacing(
  stance: ResponseStance,
  pacingState: KheperaPacingState,
  analysis: ReflectionAnalysis,
): ResponseStance {
  if (!repeatsThreeTimes(pacingState.recentStances, stance)) {
    return stance;
  }

  if (analysis.emotionalIntensity === 'high' || analysis.signalStability === 'disorganized') {
    return stance;
  }

  switch (stance) {
    case 'witnessing':
      return analysis.narrativeMode === 'looping' ? 'clarifying' : 'integrating';
    case 'clarifying':
      return analysis.psychologicalNeedState === 'ambiguity' ? 'holding_ambiguity' : 'witnessing';
    case 'integrating':
      return 'witnessing';
    case 'expanding':
      return 'integrating';
    case 'holding_ambiguity':
      return 'witnessing';
    case 'containing':
    default:
      return stance;
  }
}

export function decideReflectionTiming(input: {
  analysis: ReflectionAnalysis;
  stance: ResponseStance;
  pacingState?: KheperaPacingState;
  seed?: string;
}): ReflectionTiming {
  const { analysis, stance, pacingState, seed = '' } = input;

  if (analysis.emotionalIntensity === 'high' || analysis.signalStability === 'disorganized' || analysis.coherence === 'fragmented') {
    return 'immediate';
  }

  if (analysis.narrativeMode === 'looping' || analysis.cognitiveStyle === 'ruminative' || analysis.signalStability === 'escalating') {
    return pacingState?.lastReturnType === 'delayed' ? 'immediate' : 'short_delay';
  }

  if (analysis.psychologicalNeedState === 'ambiguity' || stance === 'holding_ambiguity') {
    return pacingState?.lastReturnType === 'delayed' ? 'short_delay' : 'delayed_return';
  }

  if (
    analysis.narrativeMode === 'reflective'
    && analysis.signalStability === 'stable'
  ) {
    if (pacingState?.lastReturnType === 'delayed') {
      return 'short_delay';
    }
    return stableFraction(`${seed}:${analysis.emotionalTone}:${stance}`) < 0.45 ? 'short_delay' : 'delayed_return';
  }

  return 'immediate';
}

export function getShortReflectionDelayMs(seed: string): number {
  return Math.round(SHORT_DELAY_MIN_MS + stableFraction(seed) * SHORT_DELAY_RANGE_MS);
}

export function getDelayedReflectionScheduledAt(seed: string, now = Date.now()): Date {
  const isDev = process.env.NODE_ENV !== 'production';
  const min = isDev ? DEV_DELAY_MIN_MS : PROD_DELAY_MIN_MS;
  const range = isDev ? DEV_DELAY_RANGE_MS : PROD_DELAY_RANGE_MS;
  return new Date(now + Math.round(min + stableFraction(seed) * range));
}

export function sleepForReflectionTiming(timing: ReflectionTiming, seed: string): Promise<void> {
  if (timing !== 'short_delay') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    setTimeout(resolve, getShortReflectionDelayMs(seed));
  });
}
