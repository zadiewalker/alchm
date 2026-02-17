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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: DESIGN.typography.weights.light }}>{greeting}</div>
          <div style={{ marginTop: '8px', fontSize: '13px', color: DESIGN.colors.textSecondary }}>
            Your sanctuary is open.
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/settings/')}
          aria-label="Open settings"
          style={{
            minHeight: '44px',
            padding: '10px 12px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: 'pointer',
          }}
        >
          Settings
        </button>
      </div>

      <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => router.push('/journal/new/')}
          aria-label="Write a new journal entry"
          style={{
            flex: 1,
            minHeight: '52px',
            borderRadius: DESIGN.radius.full,
            border: 'none',
            backgroundColor: DESIGN.colors.gold,
            color: '#fff',
            fontFamily: DESIGN.typography.sansSerif,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '15px',
            fontWeight: DESIGN.typography.weights.medium,
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
            style={{
              minHeight: '52px',
              padding: '0 16px',
              borderRadius: DESIGN.radius.full,
              border: `1px solid ${DESIGN.colors.border}`,
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: DESIGN.colors.textPrimary,
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
              style={{
                minHeight: '52px',
                padding: '0 18px',
                borderRadius: DESIGN.radius.full,
                border: 'none',
                backgroundColor: DESIGN.colors.gold,
                color: '#fff',
                fontFamily: DESIGN.typography.sansSerif,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '15px',
                fontWeight: DESIGN.typography.weights.medium,
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
