'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { DESIGN } from '@/lib/design';
import type { JournalEntry, PageState } from '@/lib/types';
import { getEntries } from '@/lib/journal';

const MOOD_LABELS: Record<string, string> = {
  '1': 'Heavy',
  '3': 'Anxious',
  '5': 'Neutral',
  '7': 'Hopeful',
  '9': 'Peaceful',
};

function topN<T extends string>(map: Record<T, number>, n: number): Array<{ key: T; count: number }> {
  return (Object.entries(map) as Array<[T, number]>)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

export default function InsightsPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    try {
      const all = getEntries();
      setEntries(all);
      setState(all.length >= 5 ? 'ready' : 'empty');
    } catch {
      setState('error');
    }
  }, []);

  const stats = useMemo(() => {
    const moodCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    for (const e of entries) {
      if (typeof e.mood === 'number') {
        const key = String(e.mood);
        moodCounts[key] = (moodCounts[key] || 0) + 1;
      }
      for (const t of e.tags || []) {
        const k = t.toLowerCase();
        tagCounts[k] = (tagCounts[k] || 0) + 1;
      }
    }
    return {
      moods: topN(moodCounts as Record<string, number>, 5),
      tags: topN(tagCounts as Record<string, number>, 8),
    };
  }, [entries]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <button
        type="button"
        onClick={() => router.push('/dashboard/')}
        aria-label="Return to dashboard"
        style={{
          border: 'none',
          background: 'transparent',
          color: DESIGN.colors.gold,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          cursor: 'pointer',
          minHeight: '44px',
          padding: 0,
        }}
      >
        ← Dashboard
      </button>

      <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        Insights
      </h1>
      <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>
        A simple mirror of what you have been writing.
      </div>

      {state === 'loading' ? <LoadingState label="Gathering…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? (
        <EmptyState
          title="Not enough data yet"
          message="Patterns take time. After five entries, this space will start to show what you have been carrying."
          action={
            <button
              type="button"
              onClick={() => router.push('/journal/new/')}
              aria-label="Write a journal entry"
              className="btn-primary"
              style={{
                padding: '0 18px',
                borderRadius: DESIGN.radius.full,
                fontFamily: DESIGN.typography.sansSerif,
                cursor: 'pointer',
              }}
            >
              Write
            </button>
          }
        />
      ) : null}

      {state === 'ready' ? (
        <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold }}>Most common moods</div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {stats.moods.length ? (
                stats.moods.map((m) => (
                  <span key={m.key} style={{ fontSize: '12px', color: DESIGN.colors.textSecondary, border: `1px solid ${DESIGN.colors.borderLight}`, borderRadius: DESIGN.radius.full, padding: '4px 8px' }}>
                    {MOOD_LABELS[m.key] || 'Mood'} · {m.count}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>No mood data yet.</span>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold }}>Recurring tags</div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {stats.tags.length ? (
                stats.tags.map((t) => (
                  <span key={t.key} style={{ fontSize: '12px', color: DESIGN.colors.textSecondary, border: `1px solid ${DESIGN.colors.borderLight}`, borderRadius: DESIGN.radius.full, padding: '4px 8px' }}>
                    {t.key} · {t.count}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '13px', color: DESIGN.colors.textMuted }}>No tags yet.</span>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
