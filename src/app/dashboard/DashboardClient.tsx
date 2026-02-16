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
import { getSettings } from '@/lib/settings';
import { cancelReminder, scheduleReturnReminder } from '@/lib/notifications';
import { getActivePathway, getPathwayById } from '@/lib/pathways';
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
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [activePathwayId, setActivePathwayId] = useState('');
  const [activeStep, setActiveStep] = useState(0);

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
    const hour = new Date().getHours();
    const settings = getSettings();
    setShowCheckIn(settings.eveningCheckInEnabled && hour >= 18);
    const active = getActivePathway();
    setActivePathwayId(active?.pathwayId || '');
    setActiveStep(active?.currentStep || 0);

    if ((context.daysSinceLastEntry || 0) >= 2) {
      scheduleReturnReminder().catch(() => {});
    } else {
      cancelReminder('return').catch(() => {});
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
          {sessionCount === 2 ? 'Welcome back.' : greeting}
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

        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
            What's present for you today?
          </SanctuaryText>
          {sessionCount >= 3 && sessionCount <= 5 ? (
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.xs }}>
              Try today&apos;s prompt and let Khepera mirror back what it notices.
            </SanctuaryText>
          ) : null}
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
              color: '#fff',
              fontFamily: DESIGN.typography.sansSerif,
              fontSize: DESIGN.typography.sizes.sm,
            }}
          >
            Begin writing
          </button>
          {showCheckIn ? (
            <button
              type="button"
              onClick={() => router.push('/checkin/')}
              style={{
                marginTop: DESIGN.spacing.sm,
                ...secondaryButtonStyle,
              }}
            >
              Check in
            </button>
          ) : null}
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
            <DashboardNav href="/journal/" title="Journal" subtitle="Your past reflections" />
            <DashboardNav href="/insights/" title="Insights" subtitle="Patterns Khepera has noticed" />
            <DashboardNav href="/pathways/" title="Pathways" subtitle="Guided healing journeys" />
            <DashboardNav href="/community/" title="Community" subtitle="Anonymous wisdom moments" />
          </div>
        </SanctuaryCard>

        {activePathwayId ? (
          <SanctuaryCard style={{ borderColor: DESIGN.colors.goldDim }}>
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.xs }}>
              Active pathway
            </SanctuaryText>
            <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.sm }}>
              Day {activeStep + 1} of {getPathwayById(activePathwayId)?.duration || 1}:{' '}
              {getPathwayById(activePathwayId)?.steps[activeStep]?.title || 'Current step'}
            </SanctuaryText>
            <button
              type="button"
              onClick={() => router.push(`/journal/new/?pathway=${activePathwayId}&step=${activeStep}`)}
              style={primaryButtonStyle}
            >
              Continue pathway
            </button>
          </SanctuaryCard>
        ) : null}

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
