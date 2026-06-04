'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { CalmCard } from '@/components/ui/CalmCard';
import { KheperaCard } from '@/components/ui/KheperaCard';
import { PaywallRedirect } from '@/components/subscription/PaywallRedirect';
import { OpenTransformationButton } from '@/components/subscriptions/OpenTransformationButton';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useMirrorData } from '@/hooks/useMirrorData';
import { useMirrorObservation, useMirrorTelemetry, useProcessReadyDelayedReflections } from '@/hooks/useMirrorWorkflows';
import { useSubscription } from '@/hooks/useSubscription';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import type { JournalEntry } from '@/services/data/dataService';
import { selectLongRangeReturns } from '@/utils/selectLongRangeReturns';

// ALCHM_IDENTITY_ROLE: supporting-screen

type MirrorStatePanelProps = {
  label: string;
  title: string;
  body: string;
  note?: string;
  action?: ReactNode;
};

function MirrorStatePanel({
  label,
  title,
  body,
  note,
  action,
}: MirrorStatePanelProps): React.JSX.Element {
  return (
    <AppCard className="mirror-state-panel">
      <AppText variant="caption" as="p" className="mirror-state-label">
        {label}
      </AppText>
      <AppText variant="h2" as="h2" className="mirror-state-title">
        {title}
      </AppText>
      <AppText variant="secondary" as="p" className="mirror-state-body">
        {body}
      </AppText>
      {note ? (
        <AppText variant="caption" as="p" className="mirror-state-note">
          {note}
        </AppText>
      ) : null}
      {action ? <div className="mirror-state-action">{action}</div> : null}
    </AppCard>
  );
}

export default function MirrorPage() {
  const { navigate } = useInternalNavigation();
  const auth = useAuth();
  const subscription = useSubscription();
  const { isInitialized, getJournalEntries } = useData();
  const [mirrorRefreshKey, setMirrorRefreshKey] = useState(0);
  const mirrorData = useMirrorData(auth.userId ?? null, mirrorRefreshKey);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [error, setError] = useState('');
  const refreshMirror = useCallback(() => setMirrorRefreshKey((value) => value + 1), []);
  const hasLongRangeAccess = subscription.canAccessFeature('long_range_returns');
  useMirrorTelemetry({
    userId: auth.userId ?? null,
    isConfigured: subscription.isConfigured,
    isLoading: subscription.isLoading,
    isReady: subscription.isReady,
    accessSource: subscription.status.source,
    hasAccess: hasLongRangeAccess,
  });
  useProcessReadyDelayedReflections({
    enabled: subscription.hasTransformation,
    userId: auth.userId ?? null,
    delayedState: mirrorData.delayedReturn.state,
    onCompleted: refreshMirror,
  });
  useEffect(() => {
    if (!subscription.hasTransformation || !isInitialized) {
      setEntriesLoading(false);
      return;
    }

    let mounted = true;
    setEntriesLoading(true);
    getJournalEntries(80)
      .then((items) => {
        if (!mounted) return;
        setEntries(items);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Long-range returns could not be gathered right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setEntriesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries, isInitialized, subscription.hasTransformation]);

  const mirrorObservation = useMirrorObservation({
    enabled: subscription.hasTransformation,
    userId: auth.userId ?? null,
    mirrorData,
  });

  const longRangeReturns = useMemo(
    () => selectLongRangeReturns(entries, mirrorData.arc),
    [entries, mirrorData.arc],
  );
  const featuredReturn = longRangeReturns[0] ?? null;
  const supportingReturn = longRangeReturns[1] ?? null;
  const mirrorLead = 'Mirror shows what keeps returning.';
  const mirrorSupport = 'When enough has gathered, old questions and quiet themes can surface here without turning your journal into a feed.';
  const mirrorQuietLine = 'Until then, nothing needs to be forced.';
  const showSupportingSections = Boolean(
    featuredReturn ||
    supportingReturn ||
    mirrorObservation ||
    mirrorData.delayedReturn.state !== 'empty' ||
    mirrorData.recurringThemes.length ||
    mirrorData.openSeeds.length
  );

  if (subscription.isLoading && !subscription.isReady) {
    return (
      <AppLayout className="page-enter" header={<AppHeader title="Mirror" />}>
        <div className="mirror-stack">
          <div className="mirror-arrival-copy">
            <div className="mirror__accent" aria-hidden="true" />
            <AppText variant="title" as="h2" className="mirror-arrival-title">
              {mirrorLead}
            </AppText>
            <AppText variant="secondary" as="p" className="mirror-arrival-body">
              {mirrorSupport}
            </AppText>
          </div>
          <MirrorStatePanel
            label="Gathering"
            title="Letting returns gather."
            body="Mirror waits for delayed reflections, recurring themes, and long-range returns to become clear enough to show."
            note={mirrorQuietLine}
          />
        </div>
      </AppLayout>
    );
  }

  const isMirrorLoading = mirrorData.isLoading || entriesLoading;
  const mirrorError = error || (mirrorData.error ? 'Mirror could not gather returns right now.' : '');
  const showAccessFallback =
    !hasLongRangeAccess &&
    Boolean(subscription.error) &&
    subscription.status.source === 'fallback';

  return (
    <AppLayout className="page-enter" header={<AppHeader title="Mirror" />}>
      {showAccessFallback ? (
        <div className="mirror-stack">
          <div className="mirror-arrival-copy">
            <div className="mirror__accent" aria-hidden="true" />
            <AppText variant="title" as="h2" className="mirror-arrival-title">
              {mirrorLead}
            </AppText>
            <AppText variant="secondary" as="p" className="mirror-arrival-body">
              {mirrorSupport}
            </AppText>
          </div>
          <CalmCard
            eyebrow="Access"
            title="Access could not be confirmed."
            body="Mirror still opens through Transformation when access settles."
            tone="strong"
          >
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  void subscription.refresh();
                }}
              >
                <AppText as="span" variant="body">
                  Try again
                </AppText>
              </button>
              <OpenTransformationButton
                surface="mirror"
                source="mirror_transformation"
                route="/mirror"
                className="btn-primary mirror-feature-cta"
                label="Open Transformation"
              />
            </div>
          </CalmCard>
        </div>
      ) : !hasLongRangeAccess ? (
        <PaywallRedirect source="mirror_paywall_gate" />
      ) : isMirrorLoading ? (
        <div className="mirror-stack">
          <div className="mirror-arrival-copy">
            <div className="mirror__accent" aria-hidden="true" />
            <AppText variant="title" as="h2" className="mirror-arrival-title">
              {mirrorLead}
            </AppText>
            <AppText variant="secondary" as="p" className="mirror-arrival-body">
              {mirrorSupport}
            </AppText>
          </div>
          <MirrorStatePanel
            label="Gathering"
            title="Letting returns gather."
            body="Mirror waits for delayed reflections, recurring themes, and long-range returns to become clear enough to show."
            note={mirrorQuietLine}
          />
        </div>
      ) : (
        <div className="mirror-stack">
          <div className="mirror-arrival-copy">
            <div className="mirror__accent" aria-hidden="true" />
            <AppText variant="title" as="h2" className="mirror-arrival-title">
              {mirrorLead}
            </AppText>
            <AppText variant="secondary" as="p" className="mirror-arrival-body">
              {mirrorSupport}
            </AppText>
          </div>

          {mirrorError ? (
            <MirrorStatePanel
              label="Unavailable"
              title="Mirror could not gather returns right now."
              body="Your journal remains available, and this space can be checked again when the connection settles."
              action={
                <button
                  type="button"
                  className="btn-ghost mirror-state-secondary-action"
                  onClick={refreshMirror}
                >
                  <AppText as="span" variant="body">
                    Try again
                  </AppText>
                </button>
              }
            />
          ) : featuredReturn ? (
            <>
              <CalmCard
                eyebrow="Long-range return"
                title={featuredReturn.framing}
                body="From an earlier entry."
                tone="strong"
                className="mirror-feature-card"
              >
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <blockquote className="export-excerpt">
                    <AppText variant="display" as="p">
                      {featuredReturn.excerpt}
                    </AppText>
                  </blockquote>

                  <div>
                    <button
                      type="button"
                      onClick={() => navigate('/journal/new', { source: 'mirror_feature_return', surface: 'mirror' })}
                      className="btn-primary mirror-feature-cta"
                    >
                      <AppText as="span" variant="body" style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Begin from this return
                      </AppText>
                    </button>
                  </div>
                </div>
              </CalmCard>

              {supportingReturn ? (
                <AppCard style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  <AppText variant="caption" as="p">
                    Also returning
                  </AppText>
                  <AppText variant="body" as="p">
                    {supportingReturn.framing}
                  </AppText>
                  <AppText variant="secondary" as="p">
                    From an earlier entry.
                  </AppText>
                </AppCard>
              ) : null}
            </>
          ) : (
            <div className="mirror-empty-state">
              <div className="mirror-empty-sunburst" aria-hidden="true" />
              <AppText variant="caption" as="p" className="mirror-state-label">
                No returns yet
              </AppText>
              <AppText variant="h2" as="h2" className="mirror-empty-title">
                Nothing has returned yet.
              </AppText>
              <AppText variant="secondary" as="p" className="mirror-empty-body">
                When enough has gathered, old questions and quiet themes can surface here without turning your journal into a feed.
              </AppText>
              <AppText variant="caption" as="p" className="mirror-empty-note">
                {mirrorQuietLine}
              </AppText>
              <div style={{ marginTop: 'var(--space-5)', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate('/journal/new', { source: 'mirror_empty_begin', surface: 'mirror' })}
                  className="btn-primary mirror-feature-cta"
                >
                  <AppText as="span" variant="body" style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Begin writing
                  </AppText>
                </button>
              </div>
            </div>
          )}

          {mirrorData.delayedReturn.state === 'returned' ? (
            <KheperaCard>
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                This came back.
              </AppText>
              {mirrorData.delayedReturn.response ? (
                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                  <AppText variant="kheperaWitness" as="p">
                    {mirrorData.delayedReturn.response.witness}
                  </AppText>
                  <AppText variant="kheperaPerspective" as="p">
                    {mirrorData.delayedReturn.response.perspective}
                  </AppText>
                  <AppText variant="kheperaSeed" as="p">
                    {mirrorData.delayedReturn.response.seed}
                  </AppText>
                </div>
              ) : null}
            </KheperaCard>
          ) : mirrorData.delayedReturn.state === 'waiting' ? (
            <AppCard className="mirror-soft-return-slot">
              <div className="mirror__accent" aria-hidden="true" />
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                Waiting
              </AppText>
              <AppText variant="secondary" as="p">
                Something may return.
              </AppText>
            </AppCard>
          ) : !showSupportingSections ? (
            <AppCard className="mirror-soft-return-slot">
              <div className="mirror__accent" aria-hidden="true" />
              <AppText variant="secondary" as="p">
                Nothing has returned yet.
              </AppText>
            </AppCard>
          ) : null}

          {showSupportingSections ? (
            <AppCard>
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                Arc
              </AppText>
              <AppText variant="secondary" as="p">
                This is a view of how tone has been moving, not a measure of how well you are doing.
              </AppText>
            </AppCard>
          ) : null}

          {showSupportingSections ? (
            <AppCard>
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                Threads
              </AppText>
              {mirrorData.recurringThemes.length ? (
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                  <AppText variant="secondary" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                    Threads are themes that have returned more than once. Repetition here is only something to notice.
                  </AppText>
                  {mirrorData.recurringThemes.slice(0, 5).map((theme) => (
                    <AppText key={theme.theme} variant="secondary" as="p">
                      {theme.label}
                    </AppText>
                  ))}
                </div>
              ) : (
                <AppText variant="secondary" as="p">
                  As themes and tone gather over time, they can collect here without holding your raw writing.
                </AppText>
              )}
            </AppCard>
          ) : null}

          {showSupportingSections ? (
            <AppCard>
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                Open seeds
              </AppText>
              <AppText variant="secondary" as="p">
                Open seeds are questions or noticings that have not fully closed yet. They can stay open without being forced.
              </AppText>
            </AppCard>
          ) : null}

          {mirrorObservation ? (
            <AppCard>
              <AppText variant="caption" as="p" style={{ marginBottom: 'var(--space-2)' }}>
                Khepera
              </AppText>
              <AppText variant="secondary" as="p" style={{ marginBottom: 'var(--space-3)' }}>
                A quiet reflection across what Mirror is already holding.
              </AppText>
              <AppText variant="body" as="p">
                {mirrorObservation}
              </AppText>
            </AppCard>
          ) : null}
        </div>
      )}
    </AppLayout>
  );
}
