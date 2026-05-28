'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/hooks/useData';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DESIGN } from '@/lib/design';
import type { JournalEntry } from '@/services/data/dataService';

function greetingLabel() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardClient() {
  const router = useRouter();
  const { isInitialized, getJournalEntries } = useData();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState(greetingLabel());

  useEffect(() => {
    setGreeting(greetingLabel());
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingEntries(true);
    getJournalEntries(3)
      .then((items) => {
        if (!mounted) return;
        setEntries(items || []);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Could not load recent entries right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingEntries(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  if (!isInitialized) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Dashboard" />}>
        <LoadingState message="Preparing your sanctuary..." variant="page" />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout
      header={
        <SanctuaryHeader
          title="Dashboard"
          rightAction={
            <Link
              href="/settings/"
              aria-label="Open settings"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: DESIGN.radius.full,
                border: `1px solid ${DESIGN.colors.border}`,
                color: DESIGN.colors.textPrimary,
                textDecoration: 'none',
                fontFamily: DESIGN.typography.sansSerif,
              }}
            >
              ⚙
            </Link>
          }
        />
      }
    >
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryText variant="caption">
          {greeting}
        </SanctuaryText>

        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
            What's present for you today?
          </SanctuaryText>
          <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.md }}>
            — Khepera
          </SanctuaryText>
          <button
            type="button"
            onClick={() => router.push('/journal/new/')}
            style={{
              minHeight: '44px',
              borderRadius: DESIGN.radius.full,
              border: `1px solid ${DESIGN.colors.goldDim}`,
              padding: '10px 18px',
              background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
              color: DESIGN.colors.textPrimary,
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: DESIGN.typography.sizes.sm,
            }}
          >
            Begin writing
          </button>
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            <DashboardNav href="/journal/" title="Journal" subtitle="Your past reflections" />
            <DashboardNav href="/insights/" title="Reflections" subtitle="Themes that have gathered" />
            <DashboardNav href="/containers/" title="Containers" subtitle="Guided writing spaces" />
            <DashboardNav href="/community/" title="Community" subtitle="Anonymous wisdom moments" />
          </div>
        </SanctuaryCard>

        {loadingEntries ? <LoadingState message="Loading recent reflections..." variant="inline" /> : null}
        {!loadingEntries && error ? <ErrorState variant="inline" message={error} /> : null}
        {!loadingEntries && !error && !entries.length ? (
          <EmptyState
            title="Welcome to your sanctuary"
            message="This is where your words will live. There's no right way to begin."
            actionLabel="Begin"
            onAction={() => router.push('/journal/new/')}
          />
        ) : null}

        {!loadingEntries && !error && entries.length ? (
          <SanctuaryCard>
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
              Recent entries
            </SanctuaryText>
            <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
              {entries.map((entry) => (
                <Link key={entry.id} href={`/journal/?id=${entry.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      border: `1px solid ${DESIGN.colors.borderLight}`,
                      borderRadius: DESIGN.radius.md,
                      padding: DESIGN.spacing.md,
                    }}
                  >
                    <SanctuaryText variant="caption" style={{ marginBottom: 6 }}>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </SanctuaryText>
                    <SanctuaryText variant="body">{String(entry.content || '').slice(0, 90) || 'Untitled reflection'}</SanctuaryText>
                  </div>
                </Link>
              ))}
            </div>
          </SanctuaryCard>
        ) : null}
      </div>
    </SanctuaryLayout>
  );
}

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: '10px 18px',
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

function DashboardNav({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      style={{
        borderRadius: DESIGN.radius.md,
        border: `1px solid ${DESIGN.colors.borderLight}`,
        padding: DESIGN.spacing.md,
        textDecoration: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <SanctuaryText variant="body" style={{ marginBottom: 2 }}>
          {title}
        </SanctuaryText>
        <SanctuaryText variant="caption">{subtitle}</SanctuaryText>
      </div>
      <SanctuaryText variant="muted">→</SanctuaryText>
    </Link>
  );
}
