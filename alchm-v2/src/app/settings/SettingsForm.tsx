'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HealthDisclaimer } from '@/components/HealthDisclaimer';
import { DESIGN } from '@/lib/design';
import type { AppSettings, JournalEntry } from '@/lib/types';
import { formatSummaryAsText, generateTherapySummary } from '@/lib/therapySummary';

function SectionTitle({ children }: { children: string }) {
  return (
    <div style={{ marginTop: '22px', fontSize: '13px', color: DESIGN.colors.sage400, letterSpacing: '0.10em', textTransform: 'uppercase', fontFamily: DESIGN.typography.sansSerif }}>
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

export function SettingsForm(props: {
  settings: AppSettings; update: (partial: Partial<AppSettings>) => void;
  apiKey: string; setApiKey: (v: string) => void; onApiKeyCommit: () => void;
  onExport: () => void; onClear: () => void; exportStatus: string; entries: JournalEntry[];
}) {
  const router = useRouter();
  const recent = useMemo(() => props.entries.slice(0, 10), [props.entries]);
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
      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>Settings</h1>

      <SectionTitle>Reminders</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>Daily reminder</span>
          <input type="checkbox" checked={props.settings.dailyReminderEnabled} onChange={(e) => props.update({ dailyReminderEnabled: e.target.checked })} aria-label="Toggle daily reminder" />
        </label>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: DESIGN.colors.textSecondary }}>Time</span>
          <input type="time" value={props.settings.dailyReminderTime} onChange={(e) => props.update({ dailyReminderTime: e.target.value })} aria-label="Daily reminder time" className="input" style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }} />
        </div>
      </div>

      <SectionTitle>Evening Check-in</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>Enable check-in</span>
          <input type="checkbox" checked={props.settings.eveningCheckInEnabled} onChange={(e) => props.update({ eveningCheckInEnabled: e.target.checked })} aria-label="Toggle evening check-in" />
        </label>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: DESIGN.colors.textSecondary }}>Time</span>
          <input type="time" value={props.settings.eveningCheckInTime} onChange={(e) => props.update({ eveningCheckInTime: e.target.value })} aria-label="Evening check-in time" className="input" style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }} />
        </div>
      </div>

      <SectionTitle>Data</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={props.onExport} aria-label="Export journal data" className="btn-secondary" style={{ fontFamily: DESIGN.typography.sansSerif }}>Export</button>
        <button type="button" onClick={props.onClear} aria-label="Clear all data" className="btn-destructive" style={{ fontFamily: DESIGN.typography.sansSerif }}>Clear all data</button>
      </div>
      {props.exportStatus ? <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{props.exportStatus}</div> : null}

      <SectionTitle>Prepare for Therapy</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }} aria-label="Prepare for therapy">
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          Generate a summary of your patterns to bring to your next session. You choose which entries to include. Nothing is shared without your action.
        </div>
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recent.length ? recent.map((e) => {
            const on = selected.includes(e.id);
            const date = new Date(e.createdAt || e.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const snippet = (e.content || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'Entry';
            return (
              <label key={e.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={on} onChange={(ev) => { const checked = ev.target.checked; setSelected((prev) => checked ? Array.from(new Set([...prev, e.id])) : prev.filter((id) => id !== e.id)); }} aria-label={`Include entry from ${date}`} style={{ marginTop: '3px' }} />
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

      <SectionTitle>Reflections</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>To enable cloud reflections, you can add an Anthropic API key. If you leave this blank, Khepera will reflect locally.</div>
        <input value={props.apiKey} onChange={(e) => props.setApiKey(e.target.value)} onBlur={props.onApiKeyCommit} aria-label="Anthropic API key" placeholder="Anthropic API key" className="input" style={{ marginTop: '12px', width: '100%', fontFamily: DESIGN.typography.sansSerif }} />
      </div>

      <SectionTitle>Subscription</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => router.push('/pricing/')} aria-label="Open subscription options" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>Subscription</button>
      </div>

      <SectionTitle>Legal</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => router.push('/privacy/')} aria-label="Open privacy policy" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>Privacy</button>
        <button type="button" onClick={() => router.push('/terms/')} aria-label="Open terms of service" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>Terms</button>
      </div>

      <SectionTitle>About</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>Version: 0.1</div>
        <div style={{ marginTop: '12px' }}><HealthDisclaimer variant="compact" /></div>
      </div>
    </>
  );
}

