'use client';

import { useCallback, useState } from 'react';
import {
  clearLegacyLocalSettingsData,
  getSettings,
  updateSettings,
  type AppSettings,
} from '@/services/settings/settingsService';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const update = useCallback((partial: Partial<AppSettings>) => {
    const updated = updateSettings(partial);
    setSettings(updated);
    return updated;
  }, []);

  const clearLocalData = useCallback(() => {
    const reset = clearLegacyLocalSettingsData();
    setSettings(reset);
    return reset;
  }, []);

  return { settings, update, clearLocalData };
}
