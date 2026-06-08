'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';
import { useData } from '@/hooks/useData';
import type { JournalEntry } from '@/services/data/dataService';
import { exportJournalData, triggerDownload, type ExportOptions } from '@/lib/export';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { CrisisModal } from '@/components/CrisisModal';
import { DESIGN } from '@/lib/design';
import { HealthDisclaimer } from '@/components/HealthDisclaimer';

export default function SettingsPage() {
  const router = useRouter();
  const { getJournalEntries } = useData();
  const { settings, update, clearLocalData } = useSettings();

  const [savedField, setSavedField] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showExportSheet, setShowExportSheet] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeReflections: true,
  });

  const version = useMemo(() => '1.0.16', []);

  useEffect(() => {
    let mounted = true;
    getJournalEntries()
      .then((items) => {
        if (!mounted) return;
        setEntries(items || []);
      })
      .catch(() => {
        if (!mounted) return;
        setEntries([]);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  const onSave = (field: string, partial: Record<string, unknown>) => {
    update(partial);
    setSavedField(field);
    window.setTimeout(() => setSavedField(''), 1200);
  };

  const clearData = () => {
    try {
      clearLocalData();
      router.refresh();
    } catch {
      // no-op
    }
  };

  const exportCount = useMemo(() => {
    const from = exportOptions.dateFrom ? new Date(`${exportOptions.dateFrom}T00:00:00`).getTime() : null;
    const to = exportOptions.dateTo ? new Date(`${exportOptions.dateTo}T23:59:59`).getTime() : null;

    return entries.filter((entry) => {
      const created = new Date(entry.createdAt).getTime();
      if (from !== null && created < from) return false;
      if (to !== null && created > to) return false;
      return true;
    }).length;
  }, [entries, exportOptions.dateFrom, exportOptions.dateTo]);

  const runExport = () => {
    setExporting(true);
    setExportStatus('');

    try {
      const { blob, filename, count } = exportJournalData(entries, exportOptions);
      triggerDownload(blob, filename);
      onSave('export', { lastExportDate: new Date().toISOString() });
      setExportStatus(`Exported ${count} entries`);
      setShowExportSheet(false);
    } catch {
      setExportStatus('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Settings" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md, paddingBottom: DESIGN.spacing.safeBottom }}>
        <Section title="Privacy">
          <ToggleRow
            label="Analytics"
            value={settings.analyticsEnabled}
            onChange={(value) => onSave('analyticsEnabled', { analyticsEnabled: value })}
            saved={savedField === 'analyticsEnabled'}
          />
          <ToggleRow
            label="Crash reporting"
            value={settings.crashReportingEnabled}
            onChange={(value) => onSave('crashReportingEnabled', { crashReportingEnabled: value })}
            saved={savedField === 'crashReportingEnabled'}
          />
        </Section>

        <Section title="Journal">
          <ToggleRow
            label="Auto-save"
            value={settings.autoSaveEnabled}
            onChange={(value) => onSave('autoSaveEnabled', { autoSaveEnabled: value })}
            saved={savedField === 'autoSaveEnabled'}
          />
          <ActionButton label="Export journal" onClick={() => setShowExportSheet(true)} saved={savedField === 'export'} />
          {settings.lastExportDate ? (
            <SanctuaryText variant="caption">Last export: {new Date(settings.lastExportDate).toLocaleString()}</SanctuaryText>
          ) : null}
          {exportStatus ? <SanctuaryText variant="khepera">{exportStatus}</SanctuaryText> : null}
          <ActionButton label="Reset local preferences" onClick={() => setConfirmClear(true)} destructive />
          {confirmClear ? (
            <SanctuaryCard style={{ marginTop: DESIGN.spacing.sm, background: 'var(--surface-elevated)' }}>
              <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.sm }}>
                This resets settings stored on this device only. It does not delete journal entries or account data.
              </SanctuaryText>
              <div style={{ display: 'flex', gap: DESIGN.spacing.sm, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setConfirmClear(false)} style={secondaryButtonStyle}>
                  Cancel
                </button>
                <button type="button" onClick={clearData} style={dangerButtonStyle}>
                  Reset preferences
                </button>
              </div>
            </SanctuaryCard>
          ) : null}
        </Section>

        <Section title="Crisis Resources">
          <ActionButton label="Open crisis resources" onClick={() => setShowCrisisModal(true)} />
          <a href="tel:988" style={resourceLinkStyle}>Call or text 988</a>
          <a href="sms:741741&body=HOME" style={resourceLinkStyle}>Crisis Text Line: Text HOME to 741741</a>
        </Section>

        <Section title="About">
          <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
            <SanctuaryText variant="caption">Made with care by ALCHM</SanctuaryText>
            <Link href="/privacy-policy/" style={resourceLinkStyle}>Privacy Policy</Link>
            <Link href="/terms/" style={resourceLinkStyle}>Terms of Service</Link>
            <HealthDisclaimer variant="compact" />
            <SanctuaryText variant="muted">Version {version}</SanctuaryText>
          </div>
        </Section>
      </div>


      {showExportSheet ? (
        <div style={sheetOverlayStyle} role="dialog" aria-modal="true">
          <div style={sheetStyle}>
            <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>Export Journal</SanctuaryText>

            <label style={sheetRowStyle}>
              <SanctuaryText variant="caption">Format</SanctuaryText>
              <select
                value={exportOptions.format}
                onChange={(event) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    format: event.target.value as ExportOptions['format'],
                  }))
                }
                style={selectStyle}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="txt">Plain text</option>
              </select>
            </label>

            <label style={sheetRowStyle}>
              <span style={rowStyle}>
                <SanctuaryText variant="caption">Include Khepera reflections</SanctuaryText>
                <input
                  type="checkbox"
                  checked={exportOptions.includeReflections}
                  onChange={(event) =>
                    setExportOptions((prev) => ({ ...prev, includeReflections: event.target.checked }))
                  }
                />
              </span>
            </label>

            <div style={sheetRowStyle}>
              <SanctuaryText variant="caption">Date range (optional)</SanctuaryText>
              <div style={{ display: 'flex', gap: DESIGN.spacing.sm }}>
                <input
                  type="date"
                  value={exportOptions.dateFrom || ''}
                  onChange={(event) => setExportOptions((prev) => ({ ...prev, dateFrom: event.target.value || undefined }))}
                  style={dateInputStyle}
                />
                <input
                  type="date"
                  value={exportOptions.dateTo || ''}
                  onChange={(event) => setExportOptions((prev) => ({ ...prev, dateTo: event.target.value || undefined }))}
                  style={dateInputStyle}
                />
              </div>
            </div>

            <SanctuaryText variant="muted" style={{ marginBottom: DESIGN.spacing.md }}>
              {exportCount} entries will be exported
            </SanctuaryText>

            <div style={{ display: 'flex', gap: DESIGN.spacing.sm, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowExportSheet(false)} style={secondaryButtonStyle}>
                Cancel
              </button>
              <button type="button" onClick={runExport} style={primaryButtonStyle} disabled={exporting}>
                {exporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CrisisModal isOpen={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
    </SanctuaryLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SanctuaryCard>
      <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
        {title}
      </SanctuaryText>
      <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>{children}</div>
    </SanctuaryCard>
  );
}

function ToggleRow({ label, value, onChange, saved = false }: { label: string; value: boolean; onChange: (value: boolean) => void; saved?: boolean }) {
  return (
    <div style={rowStyle}>
      <SanctuaryText variant="body">{label}</SanctuaryText>
      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-pressed={value}
        style={{
          width: 52,
          height: 30,
          borderRadius: DESIGN.radius.full,
          border: `1px solid ${value ? DESIGN.colors.goldDim : DESIGN.colors.border}`,
          background: value ? DESIGN.colors.gold : DESIGN.colors.cardBg,
          transition: DESIGN.transitions.normal,
          position: 'relative',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: value ? 'var(--btn-primary-text)' : 'var(--text-secondary)',
            position: 'absolute',
            top: 3,
            left: value ? 26 : 4,
            transition: DESIGN.transitions.normal,
          }}
        />
      </button>
      {saved ? <SanctuaryText variant="khepera">Saved</SanctuaryText> : null}
    </div>
  );
}

function TimeRow({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div style={rowStyle}>
      <SanctuaryText variant="body">{label}</SanctuaryText>
      <input
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          background: DESIGN.colors.cardBg,
          border: `1px solid ${DESIGN.colors.border}`,
          borderRadius: DESIGN.radius.md,
          color: DESIGN.colors.textPrimary,
          fontFamily: DESIGN.typography.sansSerif,
          padding: '8px 10px',
          minHeight: '44px',
        }}
      />
    </div>
  );
}

function ActionButton({ label, onClick, destructive = false, saved = false }: { label: string; onClick: () => void; destructive?: boolean; saved?: boolean }) {
  return (
    <div style={rowStyle}>
      <button type="button" onClick={onClick} style={{ ...secondaryButtonStyle, borderColor: destructive ? DESIGN.colors.error : DESIGN.colors.border }}>
        {label}
      </button>
      {saved ? <SanctuaryText variant="khepera">Saved</SanctuaryText> : null}
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: DESIGN.spacing.sm,
  flexWrap: 'wrap',
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  padding: '10px 12px',
  background: DESIGN.colors.gold,
  color: '#1f2937',
  fontFamily: DESIGN.typography.sansSerif,
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: '10px 12px',
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
};

const dangerButtonStyle: React.CSSProperties = {
  ...secondaryButtonStyle,
  borderColor: DESIGN.colors.error,
  color: DESIGN.colors.error,
};

const resourceLinkStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
  textDecoration: 'none',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const sheetOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'color-mix(in srgb, var(--poster-deep-olive) 82%, transparent)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: DESIGN.spacing.md,
  zIndex: 50,
};

const sheetStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 560,
  borderRadius: DESIGN.radius.lg,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgElevated,
  padding: DESIGN.spacing.md,
};

const sheetRowStyle: React.CSSProperties = {
  display: 'grid',
  gap: DESIGN.spacing.xs,
  marginBottom: DESIGN.spacing.sm,
};

const selectStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  padding: '10px 12px',
};

const dateInputStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  padding: '8px 10px',
};
