import type {
  EmotionalTone,
  ThemeTag,
} from '@/types/journal';
import type {
  KheperaContinuityMode,
  KheperaMemorySignal,
  KheperaUserContext,
} from '@/types/khepera';

type ToneShift = KheperaMemorySignal['toneShift'];

const THEME_PATTERNS: Array<{ theme: ThemeTag; patterns: RegExp[] }> = [
  { theme: 'grief_loss', patterns: [/\bgrief|loss|miss|mourning|funeral|gone\b/i] },
  { theme: 'relationship_tension', patterns: [/\bpartner|friend|mother|father|relationship|argument|distance|call her|call him\b/i] },
  { theme: 'self_worth', patterns: [/\bfailure|worthless|not enough|ashamed|shame\b/i] },
  { theme: 'identity', patterns: [/\bidentity|who i am|myself|becoming\b/i] },
  { theme: 'work_purpose', patterns: [/\bwork|job|career|office|meeting|purpose\b/i] },
  { theme: 'fear_uncertainty', patterns: [/\bafraid|fear|uncertain|worry|anxious|panic\b/i] },
  { theme: 'anger_injustice', patterns: [/\bangry|rage|resent|unfair|injustice\b/i] },
  { theme: 'body_health', patterns: [/\bbody|chest|stomach|tired|health|sleep|pain\b/i] },
  { theme: 'creativity_expression', patterns: [/\bwrite|writing|painting|music|creative|expression\b/i] },
  { theme: 'spirituality_meaning', patterns: [/\bfaith|god|spiritual|meaning|sacred\b/i] },
  { theme: 'rest_recovery', patterns: [/\brest|sleep|recover|pause|quiet\b/i] },
  { theme: 'joy_gratitude', patterns: [/\bgrateful|gratitude|joy|glad|relief\b/i] },
  { theme: 'transition_change', patterns: [/\bchange|transition|moving|leaving|new season\b/i] },
  { theme: 'boundary_setting', patterns: [/\bboundary|boundaries|no|space|distance\b/i] },
  { theme: 'childhood_origin', patterns: [/\bchildhood|growing up|when i was little|my parents\b/i] },
];

const TONE_WEIGHT: Record<EmotionalTone, number> = {
  clarity: 1,
  tenderness: 1,
  processing: 2,
  ambivalence: 2,
  numbness: 2,
  anxiety: 3,
  anger: 3,
  grief: 3,
};

function uniqueThemes(themes: ThemeTag[]): ThemeTag[] {
  return Array.from(new Set(themes));
}

export function inferThemeTags(entryText: string): ThemeTag[] {
  const text = entryText.trim();
  if (!text) {
    return [];
  }

  const inferred = THEME_PATTERNS
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
    .map(({ theme }) => theme);

  return uniqueThemes(inferred).slice(0, 3);
}

function deriveToneShift(
  currentTone: EmotionalTone,
  previousTone?: EmotionalTone,
): ToneShift {
  if (!previousTone) {
    return 'unclear';
  }

  const currentWeight = TONE_WEIGHT[currentTone];
  const previousWeight = TONE_WEIGHT[previousTone];

  if (currentWeight > previousWeight) {
    return 'intensifying';
  }

  if (currentWeight < previousWeight) {
    return 'softening';
  }

  return 'stable';
}

export function buildKheperaMemorySignal(input: {
  currentThemes: ThemeTag[];
  currentTone: EmotionalTone;
  context?: KheperaUserContext;
}): KheperaMemorySignal {
  const { currentThemes, currentTone, context } = input;
  const recentThemes = uniqueThemes([
    ...(context?.recentThemes ?? []),
    ...(context?.recurringThemes ?? []),
  ]).slice(0, 5);
  const repeatedThemeCount = uniqueThemes(currentThemes).filter((theme) => recentThemes.includes(theme)).length;
  const previousTone = context?.previousTone ?? context?.dominantTone;

  return {
    recentThemes,
    dominantTone: context?.dominantTone,
    previousTone,
    recentStances: context?.recentStances ?? [],
    repeatedThemeCount,
    toneShift: deriveToneShift(currentTone, previousTone),
  };
}

export function selectContinuityMode(input: {
  currentThemes: ThemeTag[];
  memorySignal: KheperaMemorySignal;
  context?: KheperaUserContext;
}): KheperaContinuityMode {
  const { currentThemes, memorySignal, context } = input;
  const recurringThemes = context?.recurringThemes ?? [];
  const recentThemes = context?.recentThemes ?? [];
  const hasRecurringTheme = currentThemes.some((theme) => recurringThemes.includes(theme));
  const hasRecentTheme = currentThemes.some((theme) => recentThemes.includes(theme));
  const repeatedStance =
    memorySignal.recentStances.length >= 2
    && memorySignal.recentStances.at(-1) === memorySignal.recentStances.at(-2);

  if (!currentThemes.length || (!context?.recentThemes?.length && !context?.recurringThemes?.length)) {
    return 'none';
  }

  if (hasRecurringTheme && memorySignal.toneShift !== 'stable' && memorySignal.toneShift !== 'unclear') {
    return 'tone_shift';
  }

  if (hasRecurringTheme && !hasRecentTheme) {
    return 'quiet_return';
  }

  if (repeatedStance) {
    return 'stance_shift';
  }

  if (memorySignal.repeatedThemeCount > 0) {
    return 'subtle_echo';
  }

  return 'none';
}
