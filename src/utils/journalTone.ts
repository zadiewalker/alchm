import type { EmotionalCheckIn, EmotionalTone } from '@/types/journal';

const CHECK_IN_TONE_MAP: Record<EmotionalCheckIn, EmotionalTone> = {
  heavy: 'grief',
  anxious: 'anxiety',
  numb: 'numbness',
  tender: 'tenderness',
  angry: 'anger',
  searching: 'ambivalence',
  okay: 'processing',
};

export function resolveSubmissionTone(checkIn: EmotionalCheckIn | null): EmotionalTone {
  if (!checkIn) return 'processing';
  return CHECK_IN_TONE_MAP[checkIn];
}
