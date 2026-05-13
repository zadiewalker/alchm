'use client';

import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/hooks/useData';
import type { JournalEntry } from '@/lib/dataService';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DESIGN } from '@/lib/design';

export default function InsightsPage() {
  const { isInitialized, getJournalEntries } = useData();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
        setError('Unable to load insights right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  const moodCounts = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((entry) => {
      entry.emotions?.forEach((emotion) => {
        counts.set(emotion, (counts.get(emotion) || 0) + 1);
      });
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries]);

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
            Most present moods
          </SanctuaryText>
          <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
            {moodCounts.slice(0, 5).map(([emotion, count]) => (
              <div key={emotion} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SanctuaryText variant="body">{emotion}</SanctuaryText>
                <SanctuaryText variant="caption">{count}</SanctuaryText>
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
