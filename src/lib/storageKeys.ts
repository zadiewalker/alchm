'use client';

export const STORAGE_KEYS = {
  settings: 'alchm-settings',
  userEmail: 'alchm-user-email',
  userTier: 'alchm-user-tier',
  journalEntries: 'alchm-journal-entries',
  dreamEntries: 'alchm-dream-entries',
  shadowWorkProgress: 'alchm-shadow-work-progress',
  pathwayProgressPrefix: 'alchm-pathway-progress-',
  selectedChallenge: 'alchm-selected-challenge',
  challengeStartTime: 'alchm-challenge-start-time',
  predictiveAnalysis: 'alchm-predictive-analysis',
  aiAnalysis: 'alchm-ai-analysis',
  currentMood: 'alchm-current-mood',
  moodHistory: 'alchm-mood-history',
  pathwayProgress: 'alchm-pathway-progress',
  transformationProgress: 'alchm-transformation-progress',
  lastTransformationCompletion: 'alchm-last-transformation-completion',
  recentCrisisLevel: 'alchm-recent-crisis-level',
  lastCheckIn: 'alchm-last-check-in',
  safetyContacts: 'alchm-safety-contacts',
  crisisResponses: 'alchm-crisis-responses',
  writingAnalysisHistory: 'alchm-writing-analysis-history',
  offlineCrisisEvents: 'alchm-offline-crisis-events',
  crisisDetectionLogs: 'alchm-crisis-detection-logs',
  hipaaAuditLogs: 'alchm-hipaa-audit-logs',
  migrationMarker: 'alchm-storage-migration-v1',
} as const;

const LEGACY_TO_NAMESPACED: Record<string, string> = {
  userEmail: STORAGE_KEYS.userEmail,
  userTier: STORAGE_KEYS.userTier,
  alchm_settings: STORAGE_KEYS.settings,
  journal_entries: STORAGE_KEYS.journalEntries,
  dream_entries: STORAGE_KEYS.dreamEntries,
  shadow_work_progress: STORAGE_KEYS.shadowWorkProgress,
  selected_challenge: STORAGE_KEYS.selectedChallenge,
  challenge_start_time: STORAGE_KEYS.challengeStartTime,
  predictive_analysis: STORAGE_KEYS.predictiveAnalysis,
  ai_analysis: STORAGE_KEYS.aiAnalysis,
  current_mood: STORAGE_KEYS.currentMood,
  mood_history: STORAGE_KEYS.moodHistory,
  pathway_progress: STORAGE_KEYS.pathwayProgress,
  transformation_progress: STORAGE_KEYS.transformationProgress,
  last_transformation_completion: STORAGE_KEYS.lastTransformationCompletion,
  recent_crisis_level: STORAGE_KEYS.recentCrisisLevel,
  last_check_in: STORAGE_KEYS.lastCheckIn,
  safety_contacts: STORAGE_KEYS.safetyContacts,
  crisis_responses: STORAGE_KEYS.crisisResponses,
  writing_analysis_history: STORAGE_KEYS.writingAnalysisHistory,
  offline_crisis_events: STORAGE_KEYS.offlineCrisisEvents,
  crisis_detection_logs: STORAGE_KEYS.crisisDetectionLogs,
  hipaa_audit_logs: STORAGE_KEYS.hipaaAuditLogs,
};

const NAMESPACED_TO_LEGACY: Record<string, string[]> = Object.entries(LEGACY_TO_NAMESPACED).reduce(
  (acc, [legacy, namespaced]) => {
    if (!acc[namespaced]) acc[namespaced] = [];
    acc[namespaced].push(legacy);
    return acc;
  },
  {} as Record<string, string[]>,
);

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function resolveStorageKey(key: string): string {
  return LEGACY_TO_NAMESPACED[key] || key;
}

export function getLegacyKeysFor(key: string): string[] {
  return NAMESPACED_TO_LEGACY[resolveStorageKey(key)] || [];
}

export function getStorageItemWithFallback(key: string): string | null {
  if (!isBrowser()) return null;

  const resolved = resolveStorageKey(key);
  const primary = window.localStorage.getItem(resolved);
  if (primary !== null) return primary;

  const legacyKeys = key === resolved ? getLegacyKeysFor(key) : [key, ...getLegacyKeysFor(key)];
  for (const legacyKey of legacyKeys) {
    const value = window.localStorage.getItem(legacyKey);
    if (value !== null) return value;
  }

  return null;
}

export function setStorageItemNormalized(key: string, value: string): void {
  if (!isBrowser()) return;
  const resolved = resolveStorageKey(key);
  window.localStorage.setItem(resolved, value);
}

export function removeStorageItemNormalized(key: string): void {
  if (!isBrowser()) return;
  const resolved = resolveStorageKey(key);
  window.localStorage.removeItem(resolved);

  const legacyKeys = key === resolved ? getLegacyKeysFor(key) : [key, ...getLegacyKeysFor(key)];
  for (const legacyKey of legacyKeys) {
    window.localStorage.removeItem(legacyKey);
  }
}

export function migrateLegacyStorageKeys(): { migrated: number; skipped: number } {
  if (!isBrowser()) return { migrated: 0, skipped: 0 };

  try {
    if (window.localStorage.getItem(STORAGE_KEYS.migrationMarker)) {
      return { migrated: 0, skipped: 0 };
    }

    let migrated = 0;
    let skipped = 0;

    for (const [legacyKey, namespacedKey] of Object.entries(LEGACY_TO_NAMESPACED)) {
      const namespacedValue = window.localStorage.getItem(namespacedKey);
      const legacyValue = window.localStorage.getItem(legacyKey);

      if (namespacedValue === null && legacyValue !== null) {
        window.localStorage.setItem(namespacedKey, legacyValue);
        migrated += 1;
      } else {
        skipped += 1;
      }
    }

    window.localStorage.setItem(STORAGE_KEYS.migrationMarker, new Date().toISOString());
    return { migrated, skipped };
  } catch {
    return { migrated: 0, skipped: 0 };
  }
}
