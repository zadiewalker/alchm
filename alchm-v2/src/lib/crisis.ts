'use client';

export type CrisisSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface CrisisCheck {
  detected: boolean;
  severity: CrisisSeverity | null;
}

const CRITICAL = [
  'kill myself',
  'end my life',
  'suicide',
  'suicidal',
  'better off dead',
  'want to die',
  'end it all',
  'not worth living',
  "cant go on",
  "can't go on",
  'escape this pain',
  'permanent solution',
];

const HIGH = [
  'breaking point',
  'last straw',
  'final',
  'enough',
  'overwhelmed',
  'spiraling',
  'getting worse',
  'no way out',
  'trapped',
  'hopeless',
];

const MODERATE = [
  'alone',
  'nobody cares',
  'isolated',
  'disconnected',
  'abandoned',
  'forgotten',
  'invisible',
  'lonely',
  'meaningless',
  'pointless',
];

export function checkForCrisis(text: string): CrisisCheck {
  const lower = (text || '').toLowerCase();
  if (!lower.trim()) return { detected: false, severity: null };

  if (CRITICAL.some((kw) => lower.includes(kw))) return { detected: true, severity: 'critical' };
  if (HIGH.some((kw) => lower.includes(kw))) return { detected: true, severity: 'high' };
  if (MODERATE.some((kw) => lower.includes(kw))) return { detected: true, severity: 'moderate' };
  return { detected: false, severity: null };
}

