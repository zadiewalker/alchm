
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@/router';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { AppSettings, JournalEntry, PageState } from '@/lib/types';
import { clearAllAlchmData } from '@/lib/storage';
import { getEntries } from '@/lib/journal';
import { getSettings, saveSettings } from '@/lib/settings';
import { getAnthropicApiKey, setAnthropicApiKey } from '@/lib/secrets';
import { SettingsForm } from './SettingsForm';

async function exportJournalData(args: { entries: JournalEntry[]; includeReflections: boolean }): Promise<{ ok: boolean; error?: string }> {
  try {
    const entries = args.includeReflections
      ? args.entries
      : args.entries.map((e) => ({ ...e, kheperaReflection: undefined, insights: undefined, kheperaFrameworks: undefined }));

    const payload = { exportedAt: new Date().toISOString(), entries };
    const text = JSON.stringify(payload, null, 2);
    const fileName = `alchm-export-${new Date().toISOString().slice(0, 10)}.json`;

    try {
      const mod = await import('@capacitor/share');
      await mod.Share.share({ title: 'ALCHM Export', text, dialogTitle: 'Export your journal data' });
      return { ok: true };
    } catch {
      // Share plugin may be unavailable on web; fall back to download.
    }

    if (typeof window !== 'undefined') {
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return { ok: true };
    }

    return { ok: false, error: 'Export is unavailable in this environment.' };
  } catch {
    return { ok: false, error: 'Export failed.' };
  }
}

export default function SettingsClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [exportStatus, setExportStatus] = useState<string>('');

  useEffect(() => {
    try {
      setSettings(getSettings());
      setApiKey(getAnthropicApiKey());
      setEntries(getEntries());
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
        entries={entries}
      />
    </div>
  );
}
