'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HealthDisclaimer } from '@/components/HealthDisclaimer';
import { DESIGN } from '@/lib/design';
import type { AppSettings } from '@/lib/types';

function SectionTitle({ children }: { children: string }) {
  return (
    <div
      style={{
        marginTop: '22px',
        fontSize: '13px',
        color: DESIGN.colors.sage400,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      {children}
    </div>
  );
}

export function SettingsForm(props: {
  settings: AppSettings;
  update: (partial: Partial<AppSettings>) => void;
  apiKey: string;
  setApiKey: (v: string) => void;
  onApiKeyCommit: () => void;
  onExport: () => void;
  onClear: () => void;
  exportStatus: string;
}) {
  const router = useRouter();

  return (
    <>
      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Settings
      </h1>

      <SectionTitle>Reminders</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: DESIGN.colors.textPrimary }}>Daily reminder</span>
          <input type="checkbox" checked={props.settings.dailyReminderEnabled} onChange={(e) => props.update({ dailyReminderEnabled: e.target.checked })} aria-label="Toggle daily reminder" />
        </label>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: DESIGN.colors.textSecondary }}>Time</span>
          <input
            type="time"
            value={props.settings.dailyReminderTime}
            onChange={(e) => props.update({ dailyReminderTime: e.target.value })}
            aria-label="Daily reminder time"
            className="input"
            style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }}
          />
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
          <input
            type="time"
            value={props.settings.eveningCheckInTime}
            onChange={(e) => props.update({ eveningCheckInTime: e.target.value })}
            aria-label="Evening check-in time"
            className="input"
            style={{ width: '140px', padding: '8px 10px', fontFamily: DESIGN.typography.sansSerif }}
          />
        </div>
      </div>

      <SectionTitle>Data</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={props.onExport} aria-label="Export journal data" className="btn-secondary" style={{ fontFamily: DESIGN.typography.sansSerif }}>
          Export
        </button>
        <button type="button" onClick={props.onClear} aria-label="Clear all data" className="btn-destructive" style={{ fontFamily: DESIGN.typography.sansSerif }}>
          Clear all data
        </button>
      </div>
      {props.exportStatus ? <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{props.exportStatus}</div> : null}

      <SectionTitle>Reflections</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          To enable cloud reflections, you can add an Anthropic API key. If you leave this blank, Khepera will reflect locally.
        </div>
        <input
          value={props.apiKey}
          onChange={(e) => props.setApiKey(e.target.value)}
          onBlur={props.onApiKeyCommit}
          aria-label="Anthropic API key"
          placeholder="Anthropic API key"
          className="input"
          style={{ marginTop: '12px', width: '100%', fontFamily: DESIGN.typography.sansSerif }}
        />
      </div>

      <SectionTitle>Legal</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => router.push('/privacy/')} aria-label="Open privacy policy" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>
          Privacy
        </button>
        <button type="button" onClick={() => router.push('/terms/')} aria-label="Open terms of service" className="btn-ghost" style={{ fontFamily: DESIGN.typography.sansSerif }}>
          Terms
        </button>
      </div>

      <SectionTitle>About</SectionTitle>
      <div className="card" style={{ marginTop: '12px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>Version: 0.1</div>
        <div style={{ marginTop: '12px' }}>
          <HealthDisclaimer variant="compact" />
        </div>
      </div>
    </>
  );
}
