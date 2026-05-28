import { STORAGE_KEYS } from '@/config/storageKeys';
import { getStorageItemWithFallback, removeStorageItemNormalized, setStorageItemNormalized } from '@/utils/storage';

export interface AppSettings {
  theme: 'dark';
  analyticsEnabled: boolean;
  crashReportingEnabled: boolean;
  autoSaveEnabled: boolean;
  autoSaveIntervalMs: number;
  preferredFramework: string | null;
  lastExportDate: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  analyticsEnabled: false,
  crashReportingEnabled: false,
  autoSaveEnabled: true,
  autoSaveIntervalMs: 10000,
  preferredFramework: null,
  lastExportDate: null,
};

export function getSettings(): AppSettings {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  try {
    const current = getSettings();
    const updated = { ...current, ...partial };
    setStorageItemNormalized(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch {
    return getSettings();
  }
}

export function resetSettings(): AppSettings {
  try {
    removeStorageItemNormalized(STORAGE_KEYS.SETTINGS);
  } catch {
    // no-op
  }
  return { ...DEFAULT_SETTINGS };
}
