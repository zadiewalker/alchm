'use client';

import Link from 'next/link';
import type React from 'react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useData } from '@/hooks/useData';
import type { JournalEntry } from '@/services/data/dataService';
import { searchEntries, getAvailableMoods, getAvailableTags, getDateRange, type SearchFilters } from '@/lib/journalSearch';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { DESIGN } from '@/lib/design';

export default function JournalPage() {
  return (
    <Suspense
      fallback={
        <SanctuaryLayout header={<SanctuaryHeader title="Journal" showBack />}>
          <LoadingState message="Loading your entries..." variant="page" />
        </SanctuaryLayout>
      }
    >
      <JournalContent />
    </Suspense>
  );
}

function JournalContent() {
  const { getJournalEntries, isInitialized } = useData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({ query: '', moods: [], tags: [], hasReflection: false, minWordCount: 0 });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((prev) => ({ ...prev, query: queryInput }));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [queryInput]);

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
        setError('Could not load your entries.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries]);

  const selectedEntry = useMemo(() => entries.find((entry) => entry.id === entryId) || null, [entries, entryId]);
  const moods = useMemo(() => getAvailableMoods(entries).slice(0, 8), [entries]);
  const tags = useMemo(() => getAvailableTags(entries).slice(0, 8), [entries]);
  const dateRange = useMemo(() => getDateRange(entries), [entries]);
  const searchResult = useMemo(() => searchEntries(entries, filters), [entries, filters]);

  const toggleMood = (mood: string) => {
    setFilters((prev) => {
      const current = prev.moods || [];
      const next = current.includes(mood) ? current.filter((item) => item !== mood) : [...current, mood];
      return { ...prev, moods: next };
    });
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => {
      const current = prev.tags || [];
      const next = current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag];
      return { ...prev, tags: next };
    });
  };

  if (!isInitialized || loading) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Journal" showBack />}>
        <LoadingState message="Loading your entries..." variant="page" />
      </SanctuaryLayout>
    );
  }

  if (error) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Journal" showBack />}>
        <ErrorState message={error} onRetry={() => router.refresh()} />
      </SanctuaryLayout>
    );
  }

  if (selectedEntry) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Your Entry" showBack />}>
        <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
          <SanctuaryCard elevated>
            <SanctuaryText variant="caption" style={{ marginBottom: DESIGN.spacing.sm }}>
              {warmDate(selectedEntry.createdAt)}
            </SanctuaryText>
            <SanctuaryText variant="body" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedEntry.content}
            </SanctuaryText>
            {selectedEntry.tags?.length ? (
              <div style={{ display: 'flex', gap: DESIGN.spacing.xs, marginTop: DESIGN.spacing.sm, flexWrap: 'wrap' }}>
                {selectedEntry.tags.map((tag) => (
                  <span key={tag} style={tagPillStyle}>#{tag}</span>
                ))}
                {selectedEntry.type === 'checkin' ? <span style={tagPillStyle}>🌙 check-in</span> : null}
              </div>
            ) : null}
          </SanctuaryCard>

          <SanctuaryCard style={{ background: DESIGN.colors.bgWarm }}>
            <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.xs }}>
              Khepera
            </SanctuaryText>
            <SanctuaryText variant="body">
              {selectedEntry.insights?.[0] || 'Your writing remains here. Return only if and when you choose.'}
            </SanctuaryText>
          </SanctuaryCard>
        </div>
      </SanctuaryLayout>
    );
  }

  if (!entries.length) {
    return (
      <SanctuaryLayout
        header={
          <SanctuaryHeader
            title="Archive"
            showBack
            rightAction={
              <div style={{ display: 'flex', gap: DESIGN.spacing.xs }}>
                <Link href="/settings/" style={newLinkStyle}>Export</Link>
                <Link href="/journal/new/" style={newLinkStyle}>Write</Link>
              </div>
            }
          />
        }
      >
        <EmptyState
          title="No entries yet"
          message="This is where your words will live. There's no right way to begin."
          actionLabel="Begin writing"
          onAction={() => {
            router.push('/journal/new/');
          }}
        />
      </SanctuaryLayout>
    );
  }

  return (
    <SanctuaryLayout
      header={
        <SanctuaryHeader
          title="Archive"
          showBack
          rightAction={
            <div style={{ display: 'flex', gap: DESIGN.spacing.xs }}>
                <Link href="/settings/" style={newLinkStyle}>Export</Link>
                <Link href="/journal/new/" style={newLinkStyle}>Write</Link>
            </div>
          }
        />
      }
    >
      <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
        <SanctuaryCard>
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search the archive"
            style={searchInputStyle}
          />
          <div style={{ marginTop: DESIGN.spacing.sm, display: 'flex', gap: DESIGN.spacing.xs, flexWrap: 'wrap', overflowX: 'auto' }}>
            <FilterChip
              label="All"
              active={!filters.query && !(filters.moods && filters.moods.length) && !(filters.tags && filters.tags.length) && !filters.hasReflection}
              onClick={() => setFilters({ query: '', moods: [], tags: [], hasReflection: false, minWordCount: 0 })}
            />
            {moods.map((mood) => (
              <FilterChip key={mood} label={mood} active={(filters.moods || []).includes(mood)} onClick={() => toggleMood(mood)} />
            ))}
            {tags.map((tag) => (
              <FilterChip key={tag} label={`#${tag}`} active={(filters.tags || []).includes(tag)} onClick={() => toggleTag(tag)} />
            ))}
            <FilterChip
              label="Returned reflection"
              active={Boolean(filters.hasReflection)}
              onClick={() => setFilters((prev) => ({ ...prev, hasReflection: !prev.hasReflection }))}
            />
          </div>
          <div style={{ marginTop: DESIGN.spacing.sm, display: 'flex', gap: DESIGN.spacing.sm, flexWrap: 'wrap' }}>
            <label style={labelStyle}>
              From
              <input
                type="date"
                value={filters.dateFrom || ''}
                min={dateRange?.earliest}
                max={dateRange?.latest}
                onChange={(event) => setFilters((prev) => ({ ...prev, dateFrom: event.target.value || undefined }))}
                style={dateInputStyle}
              />
            </label>
            <label style={labelStyle}>
              To
              <input
                type="date"
                value={filters.dateTo || ''}
                min={dateRange?.earliest}
                max={dateRange?.latest}
                onChange={(event) => setFilters((prev) => ({ ...prev, dateTo: event.target.value || undefined }))}
                style={dateInputStyle}
              />
            </label>
          </div>
          <SanctuaryText variant="caption" style={{ marginTop: DESIGN.spacing.sm }}>
            {searchResult.totalCount} preserved entries
          </SanctuaryText>
        </SanctuaryCard>

        {!searchResult.entries.length ? (
          <EmptyState title="Nothing surfaced" message="Nothing in the archive matches this view right now." />
        ) : (
          <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
            {searchResult.entries.map((entry) => (
              <Link key={entry.id} href={`/journal/?id=${entry.id}`} style={{ textDecoration: 'none' }}>
                <SanctuaryCard>
                  <SanctuaryText variant="caption" style={{ marginBottom: 6 }}>
                    {warmDate(entry.createdAt)}
                  </SanctuaryText>
                  <SanctuaryText variant="body" style={{ marginBottom: 8 }}>
                    {String(entry.content || '').slice(0, 160)}
                  </SanctuaryText>
                  <div style={{ display: 'flex', gap: DESIGN.spacing.xs, flexWrap: 'wrap' }}>
                    {(entry.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} style={tagPillStyle}>#{tag}</span>
                    ))}
                    {entry.type === 'checkin' ? <span style={tagPillStyle}>🌙 check-in</span> : null}
                  </div>
                  {entry.insights?.length ? <SanctuaryText variant="khepera">Khepera reflected ✦</SanctuaryText> : null}
                </SanctuaryCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SanctuaryLayout>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: '34px',
        borderRadius: DESIGN.radius.full,
        border: `1px solid ${active ? DESIGN.colors.goldDim : DESIGN.colors.border}`,
  background: active ? 'rgba(185,151,78,0.16)' : DESIGN.colors.cardBg,
        color: active ? DESIGN.colors.textKhepera : DESIGN.colors.textSecondary,
        fontFamily: DESIGN.typography.sansSerif,
        fontSize: DESIGN.typography.sizes.sm,
        padding: '6px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

const newLinkStyle: React.CSSProperties = {
  minWidth: '44px',
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  padding: '0 14px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: 'rgba(31,42,27,0.3)',
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.base,
  padding: '10px 12px',
};

const tagPillStyle: React.CSSProperties = {
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.xs,
  padding: '3px 8px',
};

const labelStyle: React.CSSProperties = {
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.xs,
  display: 'grid',
  gap: 4,
};

const dateInputStyle: React.CSSProperties = {
  minHeight: '36px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
  padding: '6px 10px',
};

function warmDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
