'use client';

import type { EmotionalTone } from '@/types/journal';

export type ToneKey = EmotionalTone | 'neutral';

export interface ToneConfig {
  label: string;
  color: string;
  description: string;
  icon?: string;
}

export const TONE_DISPLAY_CONFIG: Record<ToneKey, ToneConfig> = {
  processing: {
    label: 'Processing',
    color: '#B8A082', // Neutral earth - working through
    description: 'Making sense of experience',
    icon: '🔄'
  },
  grief: {
    label: 'Grief',
    color: '#8B7A6B', // Warm earth - supportive
    description: 'Honoring loss',
    icon: '🌧️'
  },
  anger: {
    label: 'Anger',
    color: '#C87B6A', // Warm red-brown
    description: 'Feeling stirred up',
    icon: '🔥'
  },
  anxiety: {
    label: 'Anxiety',
    color: '#9CA486', // Light sage - uncertain
    description: 'Unsettled energy',
    icon: '⚡'
  },
  clarity: {
    label: 'Clarity',
    color: '#D4B86A', // Gold - illumination
    description: 'Seeing clearly',
    icon: '✨'
  },
  numbness: {
    label: 'Numbness',
    color: '#A59B8C', // Neutral - disconnected
    description: 'Feeling distant',
    icon: '🌫️'
  },
  tenderness: {
    label: 'Tenderness',
    color: '#B5A394', // Soft earth - gentle
    description: 'Soft and open',
    icon: '🌸'
  },
  ambivalence: {
    label: 'Ambivalence',
    color: '#97A388', // Muted sage - uncertain
    description: 'Mixed feelings',
    icon: '⚖️'
  },
  neutral: {
    label: 'Entry',
    color: 'rgba(255, 255, 255, 0.6)', // Subtle - no specific tone
    description: 'Journal entry',
    icon: '📝'
  }
};

export function getToneConfig(tone?: string): ToneConfig {
  if (!tone || !(tone in TONE_DISPLAY_CONFIG)) {
    return TONE_DISPLAY_CONFIG.neutral;
  }
  return TONE_DISPLAY_CONFIG[tone as ToneKey];
}

export function getToneColor(tone?: string): string {
  return getToneConfig(tone).color;
}

export function getToneLabel(tone?: string): string {
  return getToneConfig(tone).label;
}

export function isCrisisTone(isCrisis?: boolean): boolean {
  return isCrisis === true;
}

export function shouldShowTone(tone?: string): boolean {
  return tone !== undefined && tone !== 'neutral' && tone in TONE_DISPLAY_CONFIG;
}