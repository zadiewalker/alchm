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
import type { JournalEntry } from '@/lib/dataService';
import { getSessionCount, incrementSessionCountOncePerAppOpen } from '@/lib/onboarding';
import { getReflectionUsageSummary } from '@/lib/subscription';
import {
  dismissContinuityCardForSession,
  generateContinuityCard,
  generateDashboardGreeting,
  getContinuityContext,
  isContinuityCardDismissedForSession,
  type ContinuityCard,
} from '@/lib/continuity';

function greetingLabel() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const primaryButtonStyle: React.CSSProperties = {
  height: '44px',
  width: '100%',
  border: `1px solid ${DESIGN.colors.goldDim}`,
  borderRadius: DESIGN.radius.full,
  backgroundColor: DESIGN.colors.goldDim,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  fontWeight: DESIGN.typography.weights.medium,
  cursor: 'pointer',
  transition: DESIGN.transitions.normal,
};

export default function DashboardClient() {
  const router = useRouter();
  const { isInitialized, getJournalEntries } = useData();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [error, setError] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const [reflectionSummary, setReflectionSummary] = useState(() => getReflectionUsageSummary());
  const [continuityCard, setContinuityCard] = useState<ContinuityCard | null>(null);
  const [greeting, setGreeting] = useState(greetingLabel());

  useEffect(() => {
    incrementSessionCountOncePerAppOpen();
    setSessionCount(getSessionCount());
    setReflectionSummary(getReflectionUsageSummary());
    const context = getContinuityContext();
    setGreeting(generateDashboardGreeting(context));
    const card = generateContinuityCard(context);
    if (card && !isContinuityCardDismissedForSession(card.type)) {
      setContinuityCard(card);
    }
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
      <SanctuaryLayout header={<SanctuaryHeader title="ALCHM" />}>
        <LoadingState message="Preparing ALCHM..." variant="page" />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout
      header={
        <SanctuaryHeader
          title="ALCHM"
        />
      }
    >
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryText variant="caption">
          {sessionCount === 2 ? 'You are here.' : greeting}
        </SanctuaryText>

        {continuityCard ? (
          <SanctuaryCard
            style={{
              borderColor: continuityCard.accent === 'gold' ? DESIGN.colors.goldDim : DESIGN.colors.sageLight,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: DESIGN.spacing.sm }}>
              <div>
                <SanctuaryText
                  variant="caption"
                  style={{ color: continuityCard.accent === 'gold' ? DESIGN.colors.textKhepera : DESIGN.colors.textSecondary }}
                >
                  {continuityCard.title}
                </SanctuaryText>
                <SanctuaryText variant="body">{continuityCard.message}</SanctuaryText>
              </div>
              <button
                type="button"
                onClick={() => {
                  dismissContinuityCardForSession(continuityCard.type);
                  setContinuityCard(null);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: DESIGN.colors.textMuted,
                  fontFamily: DESIGN.typography.sansSerif,
                  fontSize: DESIGN.typography.sizes.lg,
                }}
                aria-label="Dismiss continuity card"
              >
                ×
              </button>
            </div>
          </SanctuaryCard>
        ) : null}

        <section>
          <SanctuaryText variant="display" as="h2" style={{ marginBottom: DESIGN.spacing.sm }}>
            Begin from what is here.
          </SanctuaryText>
          <SanctuaryText variant="body">
            Write, return to entries, and keep containers and Khepera reflections close without any need to hurry.
          </SanctuaryText>
        </section>

        <SanctuaryCard elevated style={{ padding: DESIGN.spacing.xl }}>
          {sessionCount >= 3 && sessionCount <= 5 ? (
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.xs }}>
              Today&apos;s opening
            </SanctuaryText>
          ) : null}
          <SanctuaryText variant="display" as="p" style={{ marginBottom: DESIGN.spacing.lg }}>
            What are you trying to figure out that you can&apos;t quite hold still long enough to see?
          </SanctuaryText>
          <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.lg }}>
            — Khepera is here.
          </SanctuaryText>
          <button
            type="button"
            onClick={() => router.push('/journal/new/')}
            style={primaryButtonStyle}
          >
            Begin writing
          </button>
          {reflectionSummary.tier === 'free' ? (
            <button
              type="button"
              onClick={() => router.push('/pricing/')}
              style={{
                marginTop: DESIGN.spacing.sm,
                border: 'none',
                background: 'transparent',
                padding: 0,
                color: DESIGN.colors.textSecondary,
                fontFamily: DESIGN.typography.sansSerif,
                fontSize: DESIGN.typography.sizes.sm,
                textDecoration: 'underline',
                textAlign: 'left',
              }}
            >
              {reflectionSummary.remaining === 0
                ? 'Khepera reflections renew next month'
                : `${reflectionSummary.remaining} reflections remaining this month`}
            </button>
          ) : null}
        </SanctuaryCard>

        <SanctuaryCard>
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            <DashboardNav href="/journal/" title="Entries" subtitle="Your writing archive" />
            <DashboardNav href="/containers/" title="Containers" subtitle="Structured reflection spaces" />
            <DashboardNav href="/insights/" title="Mirror" subtitle="A quiet look back at recent writing" />
            <DashboardNav href="/settings/" title="Settings" subtitle="Privacy, export, and app controls" />
          </div>
        </SanctuaryCard>

        {loadingEntries ? <LoadingState message="Loading recent entries..." variant="inline" /> : null}
        {!loadingEntries && error ? <ErrorState variant="inline" message={error} /> : null}
        {!loadingEntries && !error && !entries.length ? (
          <EmptyState
            title="Welcome to your space"
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
