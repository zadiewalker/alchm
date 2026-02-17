'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { EntryCard } from '@/components/EntryCard';
import { DESIGN } from '@/lib/design';
import type { JournalEntry, PageState } from '@/lib/types';
import { getEntries } from '@/lib/journal';
import { getSettings } from '@/lib/settings';

function greetingForNow(now: Date): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const settings = useMemo(() => getSettings(), []);
  const greeting = useMemo(() => greetingForNow(new Date()), []);

  useEffect(() => {
    try {
      const all = getEntries();
      if (!all.length) {
        setEntries([]);
        setState('empty');
      } else {
        setEntries(all.slice(0, 3));
        setState('ready');
      }
    } catch {
      setEntries([]);
      setState('error');
    }
  }, []);

  const showCheckin = useMemo(() => {
    if (!settings.eveningCheckInEnabled) return false;
    const h = new Date().getHours();
    return h >= 18;
  }, [settings.eveningCheckInEnabled]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div
        className="card"
        style={{
          background: DESIGN.gradients.dashboardHeader,
          border: `1px solid ${DESIGN.colors.borderLight}`,
          padding: '18px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '0.5px' }}>{greeting}</div>
            <div style={{ marginTop: '8px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>
              Your sanctuary is open.
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/settings/')}
            aria-label="Open settings"
            className="btn-ghost"
            style={{
              color: DESIGN.colors.textSecondary,
              fontFamily: DESIGN.typography.sansSerif,
              cursor: 'pointer',
              padding: '8px 10px',
              alignSelf: 'flex-start',
            }}
          >
            Settings
          </button>
        </div>
      </div>

      <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => router.push('/journal/new/')}
          aria-label="Write a new journal entry"
          className="btn-primary"
          style={{
            flex: 1,
            borderRadius: DESIGN.radius.full,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
          }}
        >
          Write
        </button>
        {showCheckin ? (
          <button
            type="button"
            onClick={() => router.push('/checkin/')}
            aria-label="Evening check-in"
            className="btn-secondary"
            style={{
              padding: '0 16px',
              borderRadius: DESIGN.radius.full,
              fontFamily: DESIGN.typography.sansSerif,
              cursor: 'pointer',
            }}
          >
            Check in
          </button>
        ) : null}
      </div>

      <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: DESIGN.colors.textPrimary, fontWeight: DESIGN.typography.weights.semibold }}>
          Recent
        </div>
        <button
          type="button"
          onClick={() => router.push('/journal/')}
          aria-label="Open journal list"
          style={{
            border: 'none',
            background: 'transparent',
            color: DESIGN.colors.gold,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
            minHeight: '44px',
            padding: '0 8px',
          }}
        >
          View all →
        </button>
      </div>

      <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => router.push('/pathways/')}
          aria-label="Open pathways"
          className="btn-secondary"
          style={{
            flex: 1,
            borderRadius: DESIGN.radius.full,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
          }}
        >
          Pathways
        </button>
        <button
          type="button"
          onClick={() => router.push('/insights/')}
          aria-label="Open insights"
          className="btn-secondary"
          style={{
            flex: 1,
            borderRadius: DESIGN.radius.full,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
          }}
        >
          Insights
        </button>
        <button
          type="button"
          onClick={() => router.push('/pricing/')}
          aria-label="Open pricing"
          className="btn-secondary"
          style={{
            borderRadius: DESIGN.radius.full,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
          }}
        >
          Pricing
        </button>
      </div>

      {state === 'loading' ? <LoadingState label="Loading your sanctuary…" /> : null}
      {state === 'empty' ? (
        <EmptyState
          title="No entries yet"
          message="If you want, start with one sentence. Khepera will meet you there."
          action={
            <button
              type="button"
              onClick={() => router.push('/journal/new/')}
              aria-label="Write your first journal entry"
              className="btn-primary"
              style={{
                padding: '0 18px',
                borderRadius: DESIGN.radius.full,
                fontFamily: DESIGN.typography.sansSerif,
                cursor: 'pointer',
              }}
            >
              Write your first
            </button>
          }
        />
      ) : null}
      {state === 'ready' ? (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {entries.map((e) => (
            <EntryCard key={e.id} entry={e} onOpen={() => router.push('/journal/')} />
          ))}
        </div>
      ) : null}
      {state === 'error' ? (
        <ErrorState
          message="ALCHM couldn't load your entries. Your data is still on your device."
          onRetry={() => router.refresh()}
        />
      ) : null}
    </div>
  );
}
