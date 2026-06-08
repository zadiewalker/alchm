'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/hooks/useData';
import type { JournalEntry } from '@/services/data/dataService';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { OpenTransformationButton } from '@/components/subscriptions/OpenTransformationButton';
import { useSubscription } from '@/hooks/useSubscription';
import { DESIGN } from '@/lib/design';

export default function InsightsPage() {
  const { isInitialized, getJournalEntries } = useData();
  const subscription = useSubscription();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subscription.hasTransformation) {
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    getJournalEntries()
      .then((items) => {
        if (!mounted) return;
        setEntries(items || []);
        setError('');
      })
      .catch(() => {
        if (!mounted) return;
        setError('Unable to load reflections right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries, subscription.hasTransformation]);

  const recentlyNamedTones = useMemo(() => {
    const tones = entries.flatMap((entry) => entry.emotions || []);
    return Array.from(new Set(tones.filter(Boolean))).slice(0, 5);
  }, [entries]);

  if (subscription.isLoading && !subscription.isReady) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
        <LoadingState message="Letting the reflections gather..." variant="page" />
      </SanctuaryLayout>
    );
  }

  if (!subscription.hasTransformation) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
        <SanctuaryCard>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
            Transformation
          </SanctuaryText>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
            Reflections are part of Transformation.
          </SanctuaryText>
          <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.md }}>
            Mirror and Reflections open when Transformation is active. Your journal remains private and available in Sanctuary.
          </SanctuaryText>
          <OpenTransformationButton
            surface="mirror"
            source="reflections_transformation_gate"
            route="/insights"
            label="Open Transformation"
          />
        </SanctuaryCard>
      </SanctuaryLayout>
    );
  }

  if (!isInitialized || loading) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
        <LoadingState message="Letting the reflections gather..." variant="page" />
      </SanctuaryLayout>
    );
  }

  if (error) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
        <ErrorState variant="inline" message={error} />
      </SanctuaryLayout>
    );
  }

  if (!entries.length) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
        <EmptyState title="Nothing has gathered yet" message="After a few entries, themes may begin to appear here." />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Reflections" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard>
          <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.xs }}>
            Khepera reflects
          </SanctuaryText>
          <SanctuaryText variant="body">
            You have written {entries.length} reflections. Your words are building a gentler picture of what you carry.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
            Recently named tones
          </SanctuaryText>
          <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
            {recentlyNamedTones.map((emotion) => (
              <div key={emotion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SanctuaryText variant="body">{emotion}</SanctuaryText>
              </div>
            ))}
          </div>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
            Reflection rhythm
          </SanctuaryText>
          <SanctuaryText variant="body">
            Most recent reflection: {new Date(entries[0]?.createdAt || Date.now()).toLocaleDateString()}.
          </SanctuaryText>
        </SanctuaryCard>
      </div>
    </SanctuaryLayout>
  );
}
