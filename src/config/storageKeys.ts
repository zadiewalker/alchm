// src/config/storageKeys.ts

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
