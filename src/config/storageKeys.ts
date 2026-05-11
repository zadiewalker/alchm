// src/config/storageKeys.ts

import type { ArrivalReason, NotificationPreference, OnboardingData } from '@/types/onboarding';
import {
  getStorageItemWithFallback,
  listStorageKeys as listPersistedStorageKeys,
  removeStorageItemNormalized,
  setStorageItemNormalized,
} from '@/utils/storage';

// INCREMENT THIS on breaking schema changes.
// MAJOR bump (1.x → 2.x) = wipe all storage.
// MINOR bump (1.0 → 1.1) = additive, add migration below.
const STORAGE_VERSION = '1.0';

const k = (key: string) => `alchm_v${STORAGE_VERSION}_${key}`;

export const STORAGE_KEYS = {
  // Auth
  USER_ID:               k('user_id'),
  AUTH_STATE:            k('auth_state'),
  USER_EMAIL:            k('user_email'),
  USER_TIER:             k('user_tier'),
  SUBSCRIPTION_CACHE:    k('subscription_cache'),
  PENDING_AUTH_PROVIDER: k('pending_auth_provider'),
  PENDING_AUTH_UPGRADE:  k('pending_auth_upgrade'),
  PENDING_AUTH_PROFILE:  k('pending_auth_profile'),

  // Onboarding
  ONBOARDING_STATE:      k('onboarding_state'),
  ONBOARDING_COMPLETE:   k('onboarding_complete'),
  ONBOARDING_STEP:       k('onboarding_step'),
  ONBOARDING_WHY:        k('onboarding_why'),
  MINI_ENTRY_DRAFT:      k('mini_entry_draft'),

  // Notifications
  NOTIFICATION_PREF:     k('notification_pref'),
  NOTIFICATION_PREFERENCE: k('notification_pref'), // Alias for consistency
  NOTIFICATION_CADENCE:  k('notification_cadence'),
  LAST_NOTIFICATION_TAP: k('last_notification_tap'),
  PENDING_NOTIFICATION_NAV: k('pending_notification_nav'),
  FIRST_ENTRY_COMPLETED: k('first_entry_completed'),
  NOTIFICATION_PERMISSIONS_REQUESTED: k('notification_permissions_requested'),

  // Containers
  ACTIVE_CONTAINER_ID:   k('active_container_id'),
  CONTAINER_DAY:         k('container_day'),

  // Sessions
  LAST_SESSION_DATE:     k('last_session_date'),
  SESSION_COUNT:         k('session_count'),
  LAST_SEED:             k('last_seed'),
  JOURNAL_DRAFT:         k('journal_draft'),
  LAST_ENTRY_DATE:       k('last_entry_date'),
  ENTRY_COUNT:           k('entry_count'),
  KHEPERA_REFLECTION_COUNT: k('khepera_reflection_count'),

  // App state
  LAUNCHED_BEFORE:       k('launched_before'),
  ONBOARDING_DATA:       k('onboarding_data'),
  MEDICAL_DISCLAIMER_ACCEPTED: k('medical_disclaimer_accepted'),
  SETTINGS:              k('settings'),
  CONTINUITY_THEMES:     k('continuity_themes'),
  LOCAL_ACTIVE_CONTAINER: k('local_active_container'),
  LOCAL_CONTAINER_HISTORY: k('local_container_history'),
  DREAM_ENTRIES:         k('dream_entries'),
  SHADOW_WORK_STATE:     k('shadow_work_state'),

  // Legacy key mapping for migration
  _LEGACY_ONBOARDING:    'alchm-onboarding-complete',
  _LEGACY_SESSION_COUNT: 'alchm-session-count',

  // Dev only — stripped in production
  ...(process.env.NODE_ENV === 'development' ? {
    DEV_SKIP_ONBOARDING: k('dev_skip_onboarding'),
    DEV_FORCE_FRESH:     k('dev_force_fresh'),
  } : {}),
} as const;

export const SESSION_STORAGE_KEYS = {
  SESSION_MARKED: 'alchm-session-marked',
  CONTINUITY_DISMISSED_CARD: 'alchm-continuity-dismissed-card',
  RELOAD_COUNT: 'alchm-reload-count',
  ERROR_STATE: 'alchm-error-state',
} as const;

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
  const validNotificationPreferences: NotificationPreference[] = [
    'seeds_only',
    'none',
  ];
  return {
    arrivalReasons: Array.isArray(data.arrivalReasons)
      ? data.arrivalReasons.filter(
          (reason): reason is ArrivalReason =>
            typeof reason === 'string' &&
            validArrivalReasons.includes(reason as ArrivalReason)
        )
      : [],
    selectedContainerId: typeof data.selectedContainerId === 'string' ? data.selectedContainerId : '',
    notificationPreference:
      typeof data.notificationPreference === 'string' &&
      validNotificationPreferences.includes(data.notificationPreference as NotificationPreference)
        ? (data.notificationPreference as NotificationPreference)
        : 'none',
    completedAt: typeof data.completedAt === 'string' ? data.completedAt : null,
  };
}

// Wipe ALL versioned ALCHM storage — used in simulator reset and "Clear data" settings
export const clearAllStorage = (): void => {
  if (typeof window === 'undefined') return;

  const keys = listStorageKeys().filter(k => k.startsWith('alchm_'));
  keys.forEach(k => removeStorageItemNormalized(k));
};

// Migrate from unversioned keys (old builds) to versioned keys (new builds)
// Call this once on app boot, before any other initialization
export const migrateStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  const migrations: Record<string, string> = {
    'alchm-onboarding-complete': STORAGE_KEYS.ONBOARDING_COMPLETE,
    'alchm_onboarding_completed': STORAGE_KEYS.ONBOARDING_COMPLETE,
    'onboarding_complete': STORAGE_KEYS.ONBOARDING_COMPLETE,
    'alchm-session-count': STORAGE_KEYS.SESSION_COUNT,
    'active_container': STORAGE_KEYS.ACTIVE_CONTAINER_ID,
    'userEmail': STORAGE_KEYS.USER_EMAIL,
    'userTier': STORAGE_KEYS.USER_TIER,
    'alchm_settings': STORAGE_KEYS.SETTINGS,
    'alchm-last-entry-date': STORAGE_KEYS.LAST_ENTRY_DATE,
    'alchm-entry-count': STORAGE_KEYS.ENTRY_COUNT,
    'alchm-khepera-themes': STORAGE_KEYS.CONTINUITY_THEMES,
    'alchm-active-container': STORAGE_KEYS.LOCAL_ACTIVE_CONTAINER,
    'alchm-container-state': STORAGE_KEYS.LOCAL_CONTAINER_HISTORY,
    'dream_entries': STORAGE_KEYS.DREAM_ENTRIES,
    'shadow_work_state': STORAGE_KEYS.SHADOW_WORK_STATE,
    // Add future migrations here
  };

  let migrated = 0;
  Object.entries(migrations).forEach(([oldKey, newKey]) => {
    const val = getStorageItemWithFallback(oldKey);
    if (val !== null) {
      setStorageItemNormalized(newKey, val);
      removeStorageItemNormalized(oldKey);
      migrated++;
    }
  });

  void migrated;

  const onboardingState = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_STATE);
  if (onboardingState) {
    try {
      const sanitized = sanitizeOnboardingStateValue(JSON.parse(onboardingState));
      setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(sanitized));
    } catch {
      removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STATE);
    }
  }

  const onboardingData = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_DATA);
  if (onboardingData) {
    try {
      const sanitized = sanitizeOnboardingDataValue(JSON.parse(onboardingData));
      setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(sanitized));
    } catch {
      removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_DATA);
    }
  }
};

// Helper functions that replace the old onboarding.ts functions
export const hasCompletedOnboarding = (): boolean => {
  return isOnboardingComplete();
};

export const completeOnboarding = (): void => {
  if (typeof window === 'undefined') return;
  setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
};

export const clearOnboarding = (): void => {
  if (typeof window === 'undefined') return;
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_COMPLETE);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STATE);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_DATA);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STEP);
  removeStorageItemNormalized(STORAGE_KEYS.ONBOARDING_WHY);
  removeStorageItemNormalized(STORAGE_KEYS.MINI_ENTRY_DRAFT);
};

export const isOnboardingComplete = (): boolean => {
  if (typeof window === 'undefined') return false;
  return getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
};

function listStorageKeys(): string[] {
  return listPersistedStorageKeys();
}
