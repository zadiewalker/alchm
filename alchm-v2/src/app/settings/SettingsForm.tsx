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
        color: DESIGN.colors.textMuted,
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
      <div style={{ marginTop: '12px', backgroundColor: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.border}`, borderRadius: DESIGN.radius.lg, padding: '14px' }}>
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
            style={{ background: 'transparent', border: `1px solid ${DESIGN.colors.borderLight}`, borderRadius: DESIGN.radius.md, padding: '8px 10px', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}
          />
        </div>
      </div>

      <SectionTitle>Evening Check-in</SectionTitle>
      <div style={{ marginTop: '12px', backgroundColor: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.border}`, borderRadius: DESIGN.radius.lg, padding: '14px' }}>
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
            style={{ background: 'transparent', border: `1px solid ${DESIGN.colors.borderLight}`, borderRadius: DESIGN.radius.md, padding: '8px 10px', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}
          />
        </div>
      </div>

      <SectionTitle>AI (Optional)</SectionTitle>
      <div style={{ marginTop: '12px', backgroundColor: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.border}`, borderRadius: DESIGN.radius.lg, padding: '14px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          To enable cloud reflections, you can add an Anthropic API key. If you leave this blank, Khepera will reflect locally.
        </div>
        <input
          value={props.apiKey}
          onChange={(e) => props.setApiKey(e.target.value)}
          onBlur={props.onApiKeyCommit}
          aria-label="Anthropic API key"
          placeholder="Anthropic API key"
          style={{
            marginTop: '12px',
            width: '100%',
            minHeight: '48px',
            padding: '14px',
            borderRadius: DESIGN.radius.lg,
            border: `1px solid ${DESIGN.colors.borderLight}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '16px',
            outline: 'none',
          }}
        />
      </div>

      <SectionTitle>Data</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={props.onExport} aria-label="Export journal data" style={{ minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.full, border: `1px solid ${DESIGN.colors.border}`, backgroundColor: 'rgba(255,255,255,0.04)', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
          Export
        </button>
        <button type="button" onClick={props.onClear} aria-label="Clear all data" style={{ minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.full, border: `1px solid rgba(196, 122, 106, 0.35)`, backgroundColor: 'rgba(196, 122, 106, 0.10)', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
          Clear all data
        </button>
      </div>
      {props.exportStatus ? <div style={{ marginTop: '10px', fontSize: '12px', color: DESIGN.colors.textMuted }}>{props.exportStatus}</div> : null}

      <SectionTitle>Legal</SectionTitle>
      <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => router.push('/privacy/')} aria-label="Open privacy policy" style={{ minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.full, border: `1px solid ${DESIGN.colors.border}`, backgroundColor: 'rgba(255,255,255,0.04)', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
          Privacy
        </button>
        <button type="button" onClick={() => router.push('/terms/')} aria-label="Open terms of service" style={{ minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.full, border: `1px solid ${DESIGN.colors.border}`, backgroundColor: 'rgba(255,255,255,0.04)', color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif, cursor: 'pointer' }}>
          Terms
        </button>
      </div>

      <SectionTitle>About</SectionTitle>
      <div style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${DESIGN.colors.borderLight}`, borderRadius: DESIGN.radius.lg, padding: '14px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>Version: 0.1</div>
        <div style={{ marginTop: '12px' }}>
          <HealthDisclaimer variant="compact" />
        </div>
      </div>
    </>
  );
}

