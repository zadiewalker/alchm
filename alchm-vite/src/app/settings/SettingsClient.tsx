
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/router';
import { PageHeader } from '@/components/PageHeader';
import { ErrorState, LoadingState } from '@/components/States';
import { HealthDisclaimer } from '@/components/HealthDisclaimer';
import { DESIGN } from '@/lib/design';
import type { AppSettings, JournalEntry, PageState } from '@/lib/types';
import { clearAllAlchmData } from '@/lib/storage';
import { getEntries } from '@/lib/journal';
import { getSettings, saveSettings } from '@/lib/settings';
import { formatSummaryAsText, generateTherapySummary } from '@/lib/therapySummary';
import { generateNudge, nextOccurrence } from '@/lib/nudge';
import { useGrowth } from '@/hooks/useGrowth';
import { KindnessBreakSheet } from '@/components/KindnessBreakSheet';
import { haptics } from '@/services/haptics';
import { announce } from '@/services/announce';
import { getStartupErrors } from '@/services/startupErrorLog';
import { getActivityLog, getGrowthProfile, getMarkers, getWeeklyReflections } from '@/services/growthService';
import { forgetRelationalEntity, getRelationalEntities } from '@/services/patternEngine';

async function exportJournalData(args: {
  entries: JournalEntry[];
  includeReflections: boolean;
  settings: AppSettings;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const entries = args.includeReflections
      ? args.entries
      : args.entries.map((e) => ({ ...e, kheperaReflection: undefined, insights: undefined, kheperaFrameworks: undefined }));

    const payload = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      entries,
      appSettings: args.settings,
      growthProfile: getGrowthProfile(),
      growthMarkers: getMarkers(),
      growthActivity: getActivityLog(),
      weeklyReflections: getWeeklyReflections(),
    };
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

function parseTimeHHMM(value: string): { hour: number; minute: number } {
  const [hourRaw, minuteRaw] = value.split(':');
  const hour = Math.max(0, Math.min(23, Number(hourRaw || 0)));
  const minute = Math.max(0, Math.min(59, Number(minuteRaw || 0)));
  return { hour, minute };
}

function mostCommonMoodForDay(entries: JournalEntry[], dayOfWeek: string): string | null {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const day = new Date(entry.createdAt || entry.updatedAt).toLocaleDateString('en-US', { weekday: 'long' });
    if (day !== dayOfWeek) continue;
    const mood = entry.depth?.emotion?.label || entry.emotionSelection?.label || entry.extractedMood || null;
    if (!mood) continue;
    counts[mood] = (counts[mood] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return top?.[0] || null;
}

async function scheduleContextualNudge(settings: AppSettings, entries: JournalEntry[]): Promise<void> {
  try {
    const mod = await import('@capacitor/local-notifications');
    const { LocalNotifications } = mod;
    await LocalNotifications.cancel({ notifications: [{ id: 1001 }, { id: 1002 }] });

    if (!settings.dailyReminderEnabled && !settings.eveningCheckInEnabled) return;

    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return;

    if (settings.dailyReminderEnabled) {
      const { hour, minute } = parseTimeHHMM(settings.dailyReminderTime);
      const now = new Date();
      const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
      const last = entries[0] || null;
      const daysSinceLastEntry = last
        ? Math.round((Date.now() - new Date(last.createdAt || last.updatedAt).getTime()) / 86_400_000)
        : 999;
      const body = generateNudge({
        dayOfWeek,
        daysSinceLastEntry,
        lastEmotion: last?.depth?.emotion?.label || last?.emotionSelection?.label || last?.extractedMood || null,
        dominantEmotionByDay: mostCommonMoodForDay(entries, dayOfWeek),
      });

      await LocalNotifications.schedule({
        notifications: [{
          id: 1001,
          title: 'ALCHM',
          body,
          schedule: { at: nextOccurrence(hour, minute), allowWhileIdle: true },
        }],
      });
    }

    if (settings.eveningCheckInEnabled) {
      const { hour, minute } = parseTimeHHMM(settings.eveningCheckInTime);
      await LocalNotifications.schedule({
        notifications: [{
          id: 1002,
          title: 'ALCHM',
          body: 'A brief check-in is enough tonight.',
          schedule: { at: nextOccurrence(hour, minute), allowWhileIdle: true },
        }],
      });
    }
  } catch {
    // Notification scheduling is optional on unsupported platforms.
  }
}

export default function SettingsClient() {
  const router = useRouter();
  const growth = useGrowth();
  const [state, setState] = useState<PageState>('loading');
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [exportStatus, setExportStatus] = useState<string>('');
  const [showBreakSheet, setShowBreakSheet] = useState(false);

  useEffect(() => {
    try {
      setSettings(getSettings());
      setEntries(getEntries());
      setState('ready');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (!settings) return;
    void scheduleContextualNudge(settings, entries);
  }, [settings, entries]);

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
    if (!settings) return;
    setExportStatus('Preparing export…');
    const entries = getEntries();
    const result = await exportJournalData({ entries, includeReflections: true, settings });
    setExportStatus(result.ok ? 'Export ready.' : result.error || 'Export failed.');
    setTimeout(() => setExportStatus(''), 2500);
  }, [settings]);

  const onClear = useCallback(() => {
    const ok = window.confirm('This will permanently delete all ALCHM data on this device. Continue?');
    if (!ok) return;
    void haptics.medium();
    announce('All local data cleared.');
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
    <div style={{ paddingBottom: '32px' }}>
      <PageHeader backLabel="← Back" title="Settings" subtitle="Your words stay on this device. Always." />
      <div style={{ marginTop: '14px', padding: '0 24px' }}>
        <SettingsForm
        settings={settings}
        update={update}
        onExport={onExport}
        onClear={onClear}
        exportStatus={exportStatus}
        entries={entries}
        phaseName={growth.phase.name}
        graceRemaining={growth.state.profile.grace_tokens_available}
        onOpenBreak={() => setShowBreakSheet(true)}
        />
      </div>
      <KindnessBreakSheet
        open={showBreakSheet}
        onClose={() => setShowBreakSheet(false)}
        onConfirm={(returnDate) => {
          growth.startBreak(returnDate);
          setShowBreakSheet(false);
        }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ marginTop: '24px', fontSize: '13px', color: DESIGN.colors.textSecondary, letterSpacing: '0.2px', fontFamily: DESIGN.typography.sansSerif, fontWeight: 600 }}>
      {children}
    </div>
  );
}

async function shareText(title: string, text: string): Promise<'shared' | 'copied' | 'unavailable'> {
  try {
    const mod = await import('@capacitor/share');
    await mod.Share.share({ title, text });
    return 'shared';
  } catch { /* fallthrough */ }
  if (navigator.share) { await navigator.share({ title, text }); return 'shared'; }
  if (navigator.clipboard) { await navigator.clipboard.writeText(text); return 'copied'; }
  return 'unavailable';
}

function SettingsForm(props: {
  settings: AppSettings; update: (partial: Partial<AppSettings>) => void;
  onExport: () => void; onClear: () => void; exportStatus: string; entries: JournalEntry[];
  phaseName: string;
  graceRemaining: number;
  onOpenBreak: () => void;
}) {
  const router = useRouter();
  const recent = useMemo(() => props.entries.slice(0, 10), [props.entries]);
  const [entities, setEntities] = useState(() => getRelationalEntities());
  const [selected, setSelected] = useState<string[]>([]);
  const [therapyStatus, setTherapyStatus] = useState('');

  const buildAndShare = async () => {
    setTherapyStatus('Building summary…');
    try {
      const text = formatSummaryAsText(generateTherapySummary(selected));
      const res = await shareText('ALCHM Journal Summary', text);
      setTherapyStatus(res === 'shared' ? 'Shared.' : res === 'copied' ? 'Copied to clipboard.' : 'Summary ready, but sharing is not available here.');
    } catch {
      setTherapyStatus("Couldn't build a summary right now.");
    } finally {
      setTimeout(() => setTherapyStatus(''), 3000);
    }
  };

  return (
    <>
      <SectionTitle>Reminders</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '15px', color: DESIGN.colors.textPrimary }}>Daily reminder</span>
          <input type="checkbox" checked={props.settings.dailyReminderEnabled} onChange={(e) => props.update({ dailyReminderEnabled: e.target.checked })} aria-label="Toggle daily reminder" />
        </label>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: DESIGN.colors.textSecondary }}>Time</span>
          <input type="time" value={props.settings.dailyReminderTime} onChange={(e) => props.update({ dailyReminderTime: e.target.value })} aria-label="Daily reminder time" className="input" style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }} />
        </div>
      </div>

      <SectionTitle>Evening check-in</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '15px', color: DESIGN.colors.textPrimary }}>Enable check-in</span>
          <input type="checkbox" checked={props.settings.eveningCheckInEnabled} onChange={(e) => props.update({ eveningCheckInEnabled: e.target.checked })} aria-label="Toggle evening check-in" />
        </label>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: DESIGN.colors.textSecondary }}>Time</span>
          <input type="time" value={props.settings.eveningCheckInTime} onChange={(e) => props.update({ eveningCheckInTime: e.target.value })} aria-label="Evening check-in time" className="input" style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }} />
        </div>
      </div>

      <SectionTitle>Pattern recognition</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '15px', color: DESIGN.colors.textPrimary }}>Enable longitudinal patterns</span>
          <input
            type="checkbox"
            checked={props.settings.patternRecognitionEnabled}
            onChange={(e) => props.update({ patternRecognitionEnabled: e.target.checked })}
            aria-label="Toggle pattern analysis"
          />
        </label>
        <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted, lineHeight: 1.55 }}>
          ALCHM periodically analyzes your entries to identify emotional cycles, linguistic shifts, and relational themes.
        </div>
      </div>

      <SectionTitle>Your companion</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>Khepera · {props.phaseName}</div>
        <div style={{ marginTop: '6px', fontSize: '13px', color: DESIGN.colors.textMuted }}>Khepera grows as you write.</div>
        <div style={{ marginTop: '6px', fontSize: '13px', color: DESIGN.colors.textMuted }}>Grace tokens this week: {props.graceRemaining} of 2 remaining</div>
        <button
          type="button"
          onClick={props.onOpenBreak}
          aria-label="Take a kindness break"
          style={{ marginTop: '8px', border: 'none', background: 'transparent', color: DESIGN.colors.gold, fontSize: '14px', cursor: 'pointer', padding: 0, minHeight: '44px' }}
        >
          Need a pause? Take a break →
        </button>
      </div>

      <SectionTitle>Your data</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          Download everything ALCHM knows about you.
          <br />
          It fits in one file because we don&apos;t collect much.
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" onClick={props.onExport} aria-label="Export journal data" className="btn-secondary" style={{ fontFamily: DESIGN.typography.sansSerif }}>Export as JSON</button>
        </div>
        <div className="section-divider" style={{ margin: '16px 0 12px' }} />
        <button type="button" onClick={props.onClear} aria-label="Clear all data" className="btn-destructive" style={{ fontFamily: DESIGN.typography.sansSerif, border: '1px solid rgba(196, 91, 74, 0.28)', color: 'var(--danger)' }}>Clear all data</button>
        <button type="button" className="btn-ghost" style={{ marginTop: '10px' }} onClick={() => router.push('/privacy-data/')}>
          How your data works →
        </button>
      </div>
      {props.exportStatus ? <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{props.exportStatus}</div> : null}

      <SectionTitle>Relational memory</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          ALCHM can infer recurring people from your writing. You can remove anyone below.
        </div>
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entities.length ? entities.slice(0, 10).map((entity) => (
            <div key={entity.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: DESIGN.colors.textPrimary, textTransform: 'capitalize' }}>{entity.name}</div>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  forgetRelationalEntity(entity.name);
                  setEntities(getRelationalEntities());
                }}
              >
                Forget
              </button>
            </div>
          )) : (
            <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>No relational entities detected yet.</div>
          )}
        </div>
      </div>

      <SectionTitle>Prepare for therapy</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }} aria-label="Prepare for therapy">
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          Generate a summary of your patterns to bring to your next session. You choose which entries to include. Nothing is shared without your action.
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.length ? recent.map((e) => {
            const on = selected.includes(e.id);
            const date = new Date(e.createdAt || e.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const mood = e.depth?.emotion?.label || e.emotionSelection?.label || e.extractedMood || '';
            const snippet = (e.type === 'check-in' || e.type === 'checkin')
              ? (mood ? `Check-in · ${mood}` : 'Check-in')
              : ((e.content || '').replace(/\\s+/g, ' ').trim().slice(0, 60) || 'Entry');
            return (
              <label key={e.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={(ev) => {
                    const checked = ev.target.checked;
                    setSelected((prev: string[]) =>
                      checked ? Array.from(new Set([...prev, e.id])) : prev.filter((id: string) => id !== e.id),
                    );
                  }}
                  aria-label={`Include entry from ${date}`}
                  style={{ marginTop: '3px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>{date}</div>
                  <div style={{ fontSize: '13px', color: DESIGN.colors.textPrimary, lineHeight: 1.5 }}>{snippet}</div>
                </div>
              </label>
            );
          }) : <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textMuted }}>Write a few entries first. This summary is built from your words.</div>}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => void buildAndShare()} aria-label="Build and share therapy summary" className="btn-secondary" disabled={!selected.length} style={{ fontFamily: DESIGN.typography.sansSerif, opacity: selected.length ? 1 : 0.5, cursor: selected.length ? 'pointer' : 'default' }}>Build Summary →</button>
          {therapyStatus ? <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted }}>{therapyStatus}</div> : null}
        </div>
      </div>

      <SectionTitle>Legal</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => router.push('/privacy/')} aria-label="Open privacy policy" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>Privacy</button>
        <button type="button" onClick={() => router.push('/terms/')} aria-label="Open terms of service" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>Terms</button>
        <button type="button" onClick={() => router.push('/privacy-data/')} aria-label="How your data works" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>
          How your data works
        </button>
      </div>

      <SectionTitle>About</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>Version: 0.1</div>
        <button
          type="button"
          className="btn-ghost"
          style={{ marginTop: '8px' }}
          onClick={async () => {
            const logs = getStartupErrors();
            const payload = logs.length ? JSON.stringify(logs, null, 2) : 'No startup/runtime errors captured.';
            const res = await shareText('ALCHM Runtime Logs', payload);
            setTherapyStatus(res === 'shared' ? 'Runtime logs shared.' : res === 'copied' ? 'Runtime logs copied.' : 'Sharing unavailable.');
            setTimeout(() => setTherapyStatus(''), 3000);
          }}
        >
          Share runtime logs
        </button>
        <div style={{ marginTop: '12px' }}><HealthDisclaimer variant="compact" /></div>
      </div>
    </>
  );
}
