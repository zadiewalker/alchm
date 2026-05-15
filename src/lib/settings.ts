export interface AppSettings {
  theme: 'dark';
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  eveningCheckInEnabled: boolean;
  eveningCheckInTime: string;
  crashReportingEnabled: boolean;
  autoSaveEnabled: boolean;
  autoSaveIntervalMs: number;
  preferredFramework: string | null;
  lastExportDate: string | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  dailyReminderEnabled: false,
  dailyReminderTime: '09:00',
  eveningCheckInEnabled: false,
  eveningCheckInTime: '21:00',
  crashReportingEnabled: true,
  autoSaveEnabled: true,
  autoSaveIntervalMs: 10000,
  preferredFramework: null,
  lastExportDate: null,
};

const STORAGE_KEY = 'alchm-settings';

export function getSettings(): AppSettings {
  try {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    const raw = window.localStorage.getItem(STORAGE_KEY);
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
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  } catch {
    return getSettings();
  }
}

export function resetSettings(): AppSettings {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // no-op
  }
  return { ...DEFAULT_SETTINGS };
}
