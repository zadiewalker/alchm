'use client';

import { useEffect, useState } from 'react';
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
        setError('Unable to load Mirror right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  if (!isInitialized || loading) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Mirror" showBack />}>
        <LoadingState message="Opening Mirror..." variant="page" />
      </SanctuaryLayout>
    );
  }

  if (error) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Mirror" showBack />}>
        <ErrorState variant="inline" message={error} />
      </SanctuaryLayout>
    );
  }

  if (!entries.length) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Mirror" showBack />}>
        <EmptyState title="Nothing to mirror yet" message="After you write, recent entries can appear here without scores or interpretation." />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Mirror" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard>
          <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.xs }}>
            Mirror
          </SanctuaryText>
          <SanctuaryText variant="body">
            A quiet place to look back at recent writing without scores, rankings, or interpretation.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
            Recent writing
          </SanctuaryText>
          <div style={{ display: 'grid', gap: DESIGN.spacing.xs }}>
            {entries.slice(0, 3).map((entry) => (
              <SanctuaryText key={entry.id} variant="body">
                {new Date(entry.createdAt).toLocaleDateString()}
              </SanctuaryText>
            ))}
          </div>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
            Latest entry
          </SanctuaryText>
          <SanctuaryText variant="body">
            {new Date(entries[0]?.createdAt || Date.now()).toLocaleDateString()}
          </SanctuaryText>
        </SanctuaryCard>
      </div>
    </SanctuaryLayout>
  );
}
