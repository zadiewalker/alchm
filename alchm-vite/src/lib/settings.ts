'use client';

import type { AppSettings } from '@/lib/types';
import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  dailyReminderEnabled: false,
  dailyReminderTime: '09:00',
  eveningCheckInEnabled: false,
  eveningCheckInTime: '21:00',
  autoSaveEnabled: true,
  autoSaveIntervalMs: 10000,
  preferredFramework: null,
  lastExportDate: null,
};

function readWithDefaults(): AppSettings {
  const parsed = readJsonExact<Record<string, unknown> | null>(STORAGE_KEYS.settings, null);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...(parsed as Partial<AppSettings>) };
}

export function getSettings(): AppSettings {
  try {
    return readWithDefaults();
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(next: AppSettings): boolean {
  return writeJson(STORAGE_KEYS.settings, next);
}

export function updateSettings(partial: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const next = { ...current, ...partial };
  saveSettings(next);
  return next;
}
