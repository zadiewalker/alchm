import { SESSION_STORAGE_KEYS, STORAGE_KEYS } from '@/config/storageKeys';
import { safeSessionStorage } from '@/utils/browser';
import { getStorageItemWithFallback, removeStorageItemNormalized, setStorageItemNormalized } from '@/utils/storage';

export function isFirstTimeUser(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const completed = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
    if (completed) return false;
    return true;
  } catch {
    return true;
  }
}

export function completeOnboarding(): void {
  setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  setStorageItemNormalized(STORAGE_KEYS._LEGACY_ONBOARDING, 'true');
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  return getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function clearOnboarding(): void {
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_COMPLETE);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_DATA);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STEP);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_WHY);
  removeStorageItemNormalized(STORAGE_KEYS.MINI_ENTRY_DRAFT);
  removeStorageItemNormalized(STORAGE_KEYS._LEGACY_ONBOARDING);
}

export function getSessionCount(): number {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.SESSION_COUNT);
    return Number.parseInt(raw || '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function incrementSessionCount(): void {
  try {
    const current = getSessionCount();
    setStorageItemNormalized(STORAGE_KEYS.SESSION_COUNT, String(current + 1));
  } catch {
    // no-op
  }
}

export function incrementSessionCountOncePerAppOpen(): void {
  try {
    if (safeSessionStorage.getItem(SESSION_STORAGE_KEYS.SESSION_MARKED)) return;
    incrementSessionCount();
    safeSessionStorage.setItem(SESSION_STORAGE_KEYS.SESSION_MARKED, 'true');
  } catch {
    // no-op
  }
}

export function clearSessionOpenMarker(): void {
  try {
    safeSessionStorage.removeItem(SESSION_STORAGE_KEYS.SESSION_MARKED);
  } catch {
    // no-op
  }
}
