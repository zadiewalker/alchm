'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

interface TransparencyReport {
  period: string;
  dataCollection: {
    totalUsers: number;
    newUsersThisPeriod: number;
    totalJournalEntries: number;
    totalAIAnalyses: number;
  };
  privacyRequests: {
    dataExports: number;
    accountDeletions: number;
    consentWithdrawals: number;
    dataCorrections: number;
  };
  legalRequests: {
    lawEnforcementRequests: number;
    dataSharedWithAuthorities: number;
    nationalSecurityRequests: number;
  };
  dataBreaches: {
    totalIncidents: number;
    usersAffected: number;
    dataTypesAffected: string[];
  };
  consentMetrics: {
    aiAnalysisOptIn: number;
    crisisMonitoringOptIn: number;
    analyticsOptIn: number;
    researchOptIn: number;
  };
  dataRetention: {
    dataDeletedDueToRetention: number;
    inactiveAccountsDeleted: number;
    averageDataAge: number;
  };
}

// This is intentionally sample data. A real transparency report requires backend aggregation.
const SAMPLE_TRANSPARENCY_DATA: TransparencyReport = {
  period: 'January 2024 - December 2024',
  dataCollection: {
    totalUsers: 15847,
    newUsersThisPeriod: 3291,
    totalJournalEntries: 94523,
    totalAIAnalyses: 78934,
  },
  privacyRequests: {
    dataExports: 127,
    accountDeletions: 43,
    consentWithdrawals: 89,
    dataCorrections: 15,
  },
  legalRequests: {
    lawEnforcementRequests: 0,
    dataSharedWithAuthorities: 0,
    nationalSecurityRequests: 0,
  },
  dataBreaches: {
    totalIncidents: 0,
    usersAffected: 0,
    dataTypesAffected: [],
  },
  consentMetrics: {
    aiAnalysisOptIn: 89.3,
    crisisMonitoringOptIn: 94.7,
    analyticsOptIn: 34.2,
    researchOptIn: 12.8,
  },
  dataRetention: {
    dataDeletedDueToRetention: 2847,
    inactiveAccountsDeleted: 156,
    averageDataAge: 14.2,
  },
};

type MetricColor = 'sage' | 'gold' | 'blue' | 'red';

const METRIC_COLORS: Record<MetricColor, string> = {
  sage: DESIGN.colors.sageMuted,
  gold: DESIGN.colors.goldDim,
  blue: '#4A90E2',
  red: '#C47A6A',
};

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'sage',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: MetricColor;
}) {
  const accent = METRIC_COLORS[color];
  return (
    <SanctuaryCard style={{ borderLeft: `4px solid ${accent}` }}>
      <div style={{ display: 'flex', gap: DESIGN.spacing.sm, alignItems: 'baseline' }}>
        {icon ? (
          <span aria-hidden="true" style={{ fontSize: '20px', lineHeight: 1 }}>
            {icon}
          </span>
        ) : null}
        <SanctuaryText variant="body" style={{ margin: 0 }}>
          {title}
        </SanctuaryText>
      </div>
      <SanctuaryText variant="title" style={{ margin: `${DESIGN.spacing.xs} 0 0 0` }}>
        {value}
      </SanctuaryText>
      {subtitle ? (
        <SanctuaryText variant="muted" style={{ margin: `${DESIGN.spacing.xs} 0 0 0` }}>
          {subtitle}
        </SanctuaryText>
      ) : null}
    </SanctuaryCard>
  );
}

export default function TransparencyPage() {
  const [reportData, setReportData] = useState<TransparencyReport>(SAMPLE_TRANSPARENCY_DATA);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'2024' | '2024-Q4' | '2024-Q3'>('2024');

  useEffect(() => {
    setLoading(true);
    // Placeholder: backend aggregation not wired. Keep stable UI.
    const t = window.setTimeout(() => {
      setReportData(SAMPLE_TRANSPARENCY_DATA);
      setLoading(false);
    }, 150);
    return () => window.clearTimeout(t);
  }, [selectedPeriod]);

  const headerRight = (
    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)} style={selectStyle}>
      <option value="2024">2024 Annual</option>
      <option value="2024-Q4">2024 Q4</option>
      <option value="2024-Q3">2024 Q3</option>
    </select>
  );

  const consentSummary = useMemo(() => {
    const c = reportData.consentMetrics;
    return [
      { title: 'AI analysis opt-in', value: `${c.aiAnalysisOptIn}%`, subtitle: 'Percent of users', icon: '🤖', color: 'gold' as const },
      { title: 'Crisis monitoring opt-in', value: `${c.crisisMonitoringOptIn}%`, subtitle: 'Percent of users', icon: '🛡️', color: 'sage' as const },
      { title: 'Analytics opt-in', value: `${c.analyticsOptIn}%`, subtitle: 'Percent of users', icon: '📈', color: 'blue' as const },
      { title: 'Research opt-in', value: `${c.researchOptIn}%`, subtitle: 'Percent of users', icon: '🧪', color: 'blue' as const },
    ];
  }, [reportData]);

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Transparency" showBack rightAction={headerRight} />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
            ALCHM transparency report
          </SanctuaryText>
          <SanctuaryText variant="muted" style={{ margin: 0 }}>
            Period: {reportData.period}
          </SanctuaryText>
          <SanctuaryText variant="body" style={{ marginTop: DESIGN.spacing.sm }}>
            This page uses sample data today. A real report requires backend aggregation and audit trails.
          </SanctuaryText>
        </SanctuaryCard>

        {loading ? (
          <SanctuaryCard>
            <SanctuaryText variant="body" style={{ margin: 0 }}>
              Loading report…
            </SanctuaryText>
          </SanctuaryCard>
        ) : null}

        <Section title="Data collection overview" icon="📊">
          <Grid>
            <MetricCard
              title="Total users"
              value={reportData.dataCollection.totalUsers.toLocaleString()}
              subtitle="Active user accounts"
              icon="👥"
              color="blue"
            />
            <MetricCard
              title="New users"
              value={reportData.dataCollection.newUsersThisPeriod.toLocaleString()}
              subtitle="This period"
              icon="✨"
              color="sage"
            />
            <MetricCard
              title="Journal entries"
              value={reportData.dataCollection.totalJournalEntries.toLocaleString()}
              subtitle="Created entries"
              icon="📝"
              color="gold"
            />
            <MetricCard
              title="AI analyses"
              value={reportData.dataCollection.totalAIAnalyses.toLocaleString()}
              subtitle="With consent"
              icon="🤖"
              color="gold"
            />
          </Grid>
        </Section>

        <Section title="Privacy rights requests" icon="🛡️">
          <Grid>
            <MetricCard title="Data exports" value={reportData.privacyRequests.dataExports} subtitle="Access/portability" icon="📦" color="blue" />
            <MetricCard title="Account deletions" value={reportData.privacyRequests.accountDeletions} subtitle="Erasure requests" icon="🗑️" color="red" />
            <MetricCard title="Consent withdrawals" value={reportData.privacyRequests.consentWithdrawals} subtitle="AI/crisis/analytics" icon="✋" color="sage" />
            <MetricCard title="Data corrections" value={reportData.privacyRequests.dataCorrections} subtitle="Rectification" icon="✏️" color="blue" />
          </Grid>
        </Section>

        <Section title="Legal requests" icon="⚖️">
          <Grid>
            <MetricCard title="Law enforcement requests" value={reportData.legalRequests.lawEnforcementRequests} icon="👮" color="sage" />
            <MetricCard title="Data shared with authorities" value={reportData.legalRequests.dataSharedWithAuthorities} icon="📄" color="sage" />
            <MetricCard title="National security requests" value={reportData.legalRequests.nationalSecurityRequests} icon="🕵️" color="sage" />
          </Grid>
        </Section>

        <Section title="Data breaches" icon="🚨">
          <Grid>
            <MetricCard title="Total incidents" value={reportData.dataBreaches.totalIncidents} icon="🧯" color="red" />
            <MetricCard title="Users affected" value={reportData.dataBreaches.usersAffected} icon="🧑‍🤝‍🧑" color="red" />
          </Grid>
          {reportData.dataBreaches.dataTypesAffected.length ? (
            <SanctuaryCard>
              <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.xs }}>
                Data types affected
              </SanctuaryText>
              <SanctuaryText variant="body" style={{ margin: 0 }}>
                {reportData.dataBreaches.dataTypesAffected.join(', ')}
              </SanctuaryText>
            </SanctuaryCard>
          ) : null}
        </Section>

        <Section title="Consent metrics" icon="✅">
          <Grid>
            {consentSummary.map((m) => (
              <MetricCard key={m.title} title={m.title} value={m.value} subtitle={m.subtitle} icon={m.icon} color={m.color} />
            ))}
          </Grid>
        </Section>

        <Section title="Data retention" icon="🧹">
          <Grid>
            <MetricCard title="Deleted due to retention" value={reportData.dataRetention.dataDeletedDueToRetention.toLocaleString()} icon="🗑️" color="sage" />
            <MetricCard title="Inactive accounts deleted" value={reportData.dataRetention.inactiveAccountsDeleted.toLocaleString()} icon="🧾" color="sage" />
            <MetricCard title="Average data age" value={`${reportData.dataRetention.averageDataAge} months`} icon="⏳" color="blue" />
          </Grid>
        </Section>

        <Link href="/privacy/" style={{ textDecoration: 'none' }}>
          <SanctuaryCard>
            <SanctuaryText variant="body" style={{ margin: 0 }}>
              Manage privacy settings
            </SanctuaryText>
          </SanctuaryCard>
        </Link>
      </div>
    </SanctuaryLayout>
  );
}

function Section({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
      <div style={{ display: 'flex', gap: DESIGN.spacing.sm, alignItems: 'baseline' }}>
        {icon ? (
          <span aria-hidden="true" style={{ opacity: 0.85 }}>
            {icon}
          </span>
        ) : null}
        <SanctuaryText variant="body" style={{ margin: 0 }}>
          {title}
        </SanctuaryText>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: DESIGN.spacing.sm,
      }}
    >
      {children}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  minHeight: '36px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.bgElevated,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  padding: '6px 10px',
};

