'use client';

import { useCallback, useState } from 'react';
import { getSettings, updateSettings, type AppSettings } from '@/lib/settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  const update = useCallback((partial: Partial<AppSettings>) => {
    const updated = updateSettings(partial);
    setSettings(updated);
    return updated;
  }, []);

  return { settings, update };
}
