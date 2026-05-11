'use client';

// Centralized, armored localStorage access.
// The only file in the project allowed to touch window.localStorage.

export const STORAGE_KEYS = {
  settings: 'alchm-settings',
  journalEntries: 'alchm-journal-entries',
  draft: 'alchm-draft-entry',
  subscription: 'alchm-subscription',
  onboardingComplete: 'alchm-onboarding-complete',
  // Legacy keys kept for backward compatibility. ALCHM v2 does not display or
  // encourage streak tracking anywhere (no guilt, no gamification).
  lastEntryDate: 'alchm-last-entry-date',
  currentStreak: 'alchm-current-streak',
  longestStreak: 'alchm-longest-streak',
  // Disruption layer (anti-guilt streak tracking).
  streak: 'alchm-streak',
  graceResetDate: 'alchm-grace-reset-date',
  // Local UX state (non-user-content).
  lastShownStageId: 'alchm-last-shown-stage-id',
  lastGraceShownForEntryDate: 'alchm-last-grace-shown-for-entry-date',
  anthropicApiKey: 'alchm-anthropic-api-key',
} as const;

const LEGACY_KEYS: Partial<Record<string, string[]>> = {
  [STORAGE_KEYS.settings]: ['alchm_settings', 'settings'],
  [STORAGE_KEYS.journalEntries]: ['journal_entries'],
  [STORAGE_KEYS.onboardingComplete]: ['onboarding-complete'],
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getRawWithFallback(primaryKey: string): string | null {
  if (!isBrowser()) return null;
  try {
    const primary = window.localStorage.getItem(primaryKey);
    if (primary !== null) return primary;
    const legacy = LEGACY_KEYS[primaryKey] ?? [];
    for (const legacyKey of legacy) {
      const value = window.localStorage.getItem(legacyKey);
      if (value !== null) return value;
    }
    return null;
  } catch {
    return null;
  }
}

export function setRaw(primaryKey: string, value: string): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(primaryKey, value);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(primaryKey: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(primaryKey);
    const legacy = LEGACY_KEYS[primaryKey] ?? [];
    for (const legacyKey of legacy) {
      window.localStorage.removeItem(legacyKey);
    }
  } catch {
    // no-op
  }
}

export function readJsonExact<T>(primaryKey: string, fallback: T): T {
  try {
    const raw = getRawWithFallback(primaryKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(primaryKey: string, value: T): boolean {
  try {
    return setRaw(primaryKey, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function readString(primaryKey: string, fallback: string): string {
  const raw = getRawWithFallback(primaryKey);
  if (raw === null) return fallback;
  return raw;
}

export function writeString(primaryKey: string, value: string): boolean {
  return setRaw(primaryKey, value);
}

export function clearAllAlchmData(): void {
  if (!isBrowser()) return;
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('alchm-')) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    try {
      window.localStorage.clear();
    } catch {
      // no-op
    }
  }
}
