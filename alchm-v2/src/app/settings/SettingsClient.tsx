'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { AppSettings, PageState } from '@/lib/types';
import { clearAllAlchmData } from '@/lib/storage';
import { getEntries } from '@/lib/journal';
import { getSettings, saveSettings } from '@/lib/settings';
import { getAnthropicApiKey, setAnthropicApiKey } from '@/lib/secrets';
import { exportJournalData } from '@/lib/export';
import { SettingsForm } from './SettingsForm';

export default function SettingsClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [exportStatus, setExportStatus] = useState<string>('');

  useEffect(() => {
    try {
      setSettings(getSettings());
      setApiKey(getAnthropicApiKey());
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  const update = useCallback(
    (partial: Partial<AppSettings>) => {
      if (!settings) return;
      const next = { ...settings, ...partial };
      setSettings(next);
      saveSettings(next);
    },
    [settings],
  );

  const onExport = useCallback(async () => {
    setExportStatus('Preparing export…');
    const entries = getEntries();
    const result = await exportJournalData({ entries, includeReflections: true });
    setExportStatus(result.ok ? 'Export ready.' : result.error || 'Export failed.');
    setTimeout(() => setExportStatus(''), 2500);
  }, []);

  const onClear = useCallback(() => {
    const ok = window.confirm('This will permanently delete all ALCHM data on this device. Continue?');
    if (!ok) return;
    clearAllAlchmData();
    router.push('/');
  }, [router]);

  if (state === 'loading') {
    return <LoadingState label="Loading settings…" />;
  }

  if (state === 'error' || !settings) {
    return <ErrorState onRetry={() => router.refresh()} />;
  }

  return (
    <div style={{ padding: '28px 20px' }}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/')}
        aria-label="Return to dashboard"
        style={{
          border: 'none',
          background: 'transparent',
          color: DESIGN.colors.gold,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          cursor: 'pointer',
          minHeight: '44px',
          padding: 0,
        }}
      >
        ← Dashboard
      </button>

      <SettingsForm
        settings={settings}
        update={update}
        apiKey={apiKey}
        setApiKey={setApiKey}
        onApiKeyCommit={() => setAnthropicApiKey(apiKey.trim())}
        onExport={onExport}
        onClear={onClear}
        exportStatus={exportStatus}
      />
    </div>
  );
}
