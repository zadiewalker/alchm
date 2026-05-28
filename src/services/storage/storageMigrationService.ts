import { STORAGE_KEYS } from '@/config/storageKeys';
import {
  getStorageItemWithFallback,
  removeStorageItemNormalized,
  setStorageItemNormalized,
} from '@/utils/storage';
import type { ArrivalReason, NotificationPreference, OnboardingData } from '@/types/onboarding';

type LegacyOnboardingState = Record<string, unknown>;

function sanitizeOnboardingStateValue(value: unknown): LegacyOnboardingState {
  const state = typeof value === 'object' && value !== null ? { ...(value as LegacyOnboardingState) } : {};
  delete state.miniEntryText;
  delete state.miniEntryResponse;
  delete state.miniEntrySeed;
  return state;
}

export function sanitizeOnboardingDataValue(value: unknown): OnboardingData {
  const data = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
  const validArrivalReasons: ArrivalReason[] = [
    'something_happened',
    'feelings_i_cant_name',
    'understand_myself',
    'recommended',
    'between_sessions',
    'i_dont_know',
  ];
  const validNotificationPreferences: NotificationPreference[] = ['seeds_only', 'none'];
  return {
    arrivalReasons: Array.isArray(data.arrivalReasons)
      ? data.arrivalReasons.filter(
          (reason): reason is ArrivalReason =>
            typeof reason === 'string' && validArrivalReasons.includes(reason as ArrivalReason),
        )
      : [],
    selectedContainerId: typeof data.selectedContainerId === 'string' ? data.selectedContainerId : '',
    notificationPreference:
      typeof data.notificationPreference === 'string' &&
      validNotificationPreferences.includes(data.notificationPreference as NotificationPreference)
        ? data.notificationPreference as NotificationPreference
        : 'none',
    completedAt: typeof data.completedAt === 'string' ? data.completedAt : null,
  };
}

export function migrateStorage(): void {
  const migrations: Record<string, string> = {
    'alchm-onboarding-complete': STORAGE_KEYS.ONBOARDING_COMPLETE,
    'alchm_onboarding_completed': STORAGE_KEYS.ONBOARDING_COMPLETE,
    onboarding_complete: STORAGE_KEYS.ONBOARDING_COMPLETE,
    'alchm-session-count': STORAGE_KEYS.SESSION_COUNT,
    active_container: STORAGE_KEYS.ACTIVE_CONTAINER_ID,
    userEmail: STORAGE_KEYS.USER_EMAIL,
    userTier: STORAGE_KEYS.USER_TIER,
    alchm_settings: STORAGE_KEYS.SETTINGS,
    'alchm-last-entry-date': STORAGE_KEYS.LAST_ENTRY_DATE,
    'alchm-entry-count': STORAGE_KEYS.ENTRY_COUNT,
    'alchm-khepera-themes': STORAGE_KEYS.CONTINUITY_THEMES,
    'alchm-active-container': STORAGE_KEYS.LOCAL_ACTIVE_CONTAINER,
    'alchm-container-state': STORAGE_KEYS.LOCAL_CONTAINER_HISTORY,
    dream_entries: STORAGE_KEYS.DREAM_ENTRIES,
    shadow_work_state: STORAGE_KEYS.SHADOW_WORK_STATE,
  };

  Object.entries(migrations).forEach(([oldKey, newKey]) => {
    const value = getStorageItemWithFallback(oldKey);
    if (value !== null) {
      setStorageItemNormalized(newKey, value);
      removeStorageItemNormalized(oldKey);
    }
  });

  const onboardingState = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_STATE);
  if (onboardingState) {
    try {
      setStorageItemNormalized(
        STORAGE_KEYS.ONBOARDING_STATE,
        JSON.stringify(sanitizeOnboardingStateValue(JSON.parse(onboardingState))),
      );
    } catch {
      removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STATE);
    }
  }

  const onboardingData = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_DATA);
  if (onboardingData) {
    try {
      setStorageItemNormalized(
        STORAGE_KEYS.ONBOARDING_DATA,
        JSON.stringify(sanitizeOnboardingDataValue(JSON.parse(onboardingData))),
      );
    } catch {
      removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_DATA);
    }
  }
}

export function isOnboardingComplete(): boolean {
  return getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function hasCachedUserSession(): boolean {
  return Boolean(getStorageItemWithFallback(STORAGE_KEYS.USER_ID));
}
