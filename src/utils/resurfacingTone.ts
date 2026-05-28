import { RESURFACING_TONE_COPY } from '@/config/resurfacingTone';
import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { ResurfacingToneMode } from '@/types/resurfacingTone';
import type { ReturnType } from '@/types/return';

const WARM_TONES = new Set<EmotionalTone>(['tenderness', 'clarity']);
const LONG_HORIZON_DAYS = 90;

export function getResurfacingToneCopy(mode?: ResurfacingToneMode | null): string {
  return mode ? RESURFACING_TONE_COPY[mode] : RESURFACING_TONE_COPY.quiet_continuity;
}

export function deriveResurfacingToneMode(input: {
  returnType: ReturnType;
  candidateAgeDays: number;
  candidateTone: EmotionalTone;
  currentTone: EmotionalTone;
  candidateThemes: ThemeTag[];
  currentThemes: ThemeTag[];
}): ResurfacingToneMode {
  const sharedThemeCount = input.candidateThemes.filter((theme) => input.currentThemes.includes(theme)).length;

  if (input.candidateAgeDays >= LONG_HORIZON_DAYS) {
    return 'seasonal_return';
  }

  if (WARM_TONES.has(input.candidateTone)) {
    return 'unresolved_warmth';
  }

  if (sharedThemeCount > 0 && input.candidateTone !== input.currentTone) {
    return 'parallel_texture';
  }

  if (input.returnType === 'pattern') {
    return 'emotional_echo';
  }

  if (input.returnType === 'contrast') {
    return 'soft_recurrence';
  }

  return 'quiet_continuity';
}
