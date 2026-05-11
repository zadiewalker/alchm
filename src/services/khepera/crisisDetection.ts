// IMMUTABLE — this file must never be modified without clinical review.
// Any change here is a clinical safety change, not a code change.

import type { KheperaResponse } from '@/types/khepera';

const CRISIS_SIGNALS: readonly string[] = [
  'want to die',
  'want to kill myself',
  'thinking about suicide',
  "don't want to be here anymore",
  'end my life',
  'not worth living',
  'thinking about ending it',
  'no reason to live',
  'better off dead',
  'hurt myself',
  'cutting again',
  'harming myself',
  "wish i wasn't here",
  'wish i could disappear forever',
] as const;

export function isCrisisSignalPresent(text: string): boolean {
  const normalized = text.toLowerCase();
  return CRISIS_SIGNALS.some(signal => normalized.includes(signal));
}

// Backward-compatible alias for legacy imports.
export const detectCrisisSignals = isCrisisSignalPresent;

export const CRISIS_RESPONSE: KheperaResponse = {
  witness: `What you've written matters.`,
  perspective: `Support is available if you want it.\n\nYou can call or text 988 (Suicide and Crisis Lifeline) any time.\n\nYou can also text HOME to 741741 (Crisis Text Line).\n\nKhepera does not continue when writing points to immediate risk.`,
  seed: 'What support feels closest to you right now?',
};
