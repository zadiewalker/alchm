'use client';

const ONBOARDING_KEY = 'alchm-onboarding-complete';
const SESSION_KEY = 'alchm-session-count';
const JOURNAL_KEYS = ['journal_entries', 'alchm-journal-entries'];

function getStoredEntryCount(): number {
  try {
    if (typeof window === 'undefined') return 0;
    for (const key of JOURNAL_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.length;
    }
    return 0;
  } catch {
    return 0;
  }
}

export function isFirstTimeUser(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const completed = window.localStorage.getItem(ONBOARDING_KEY);
    if (completed) return false;
    return getStoredEntryCount() === 0;
  } catch {
    return true;
  }
}

export function completeOnboarding(): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ONBOARDING_KEY, new Date().toISOString());
  } catch {
    // no-op
  }
}

export function getSessionCount(): number {
  try {
    if (typeof window === 'undefined') return 0;
    const raw = window.localStorage.getItem(SESSION_KEY);
    return Number.parseInt(raw || '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function incrementSessionCount(): void {
  try {
    if (typeof window === 'undefined') return;
    const current = getSessionCount();
    window.localStorage.setItem(SESSION_KEY, String(current + 1));
  } catch {
    // no-op
  }
}

export function incrementSessionCountOncePerAppOpen(): void {
  try {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('alchm-session-marked')) return;
    incrementSessionCount();
    window.sessionStorage.setItem('alchm-session-marked', 'true');
  } catch {
    // no-op
  }
}

export function clearSessionOpenMarker(): void {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem('alchm-session-marked');
  } catch {
    // no-op
  }
}
