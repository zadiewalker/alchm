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
import { JournalDetail } from './JournalDetail';

export default function JournalClient() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('loading');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const all = getEntries();
      setEntries(all);
      setState(all.length ? 'ready' : 'empty');
    } catch {
      setEntries([]);
      setState('error');
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        (e.content || '').toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return entries.find((e) => e.id === selectedId) || null;
  }, [entries, selectedId]);

  return (
    <div style={{ padding: '28px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <button type="button" onClick={() => router.push('/dashboard/')} aria-label="Return to dashboard" className="btn-ghost">
          ← Dashboard
        </button>
        <button type="button" onClick={() => router.push('/journal/new/')} aria-label="Write a new journal entry" className="btn-secondary">
          Write
        </button>
      </div>

      <div style={{ marginTop: '14px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search journal entries"
          placeholder="Search…"
          className="input"
          style={{ width: '100%', fontFamily: DESIGN.typography.sansSerif }}
        />
      </div>

      {state === 'loading' ? <LoadingState label="Loading entries…" /> : null}
      {state === 'error' ? <ErrorState onRetry={() => router.refresh()} /> : null}
      {state === 'empty' ? (
        <EmptyState
          title="Your journal is empty"
          message="When you're ready, write one sentence. Khepera will meet you there."
          action={
            <button
              type="button"
              onClick={() => router.push('/journal/new/')}
              aria-label="Write your first journal entry"
              className="btn-primary"
              style={{ fontFamily: DESIGN.typography.sansSerif }}
            >
              Write your first
            </button>
          }
        />
      ) : null}

      {state === 'ready' ? (
        <>
          {selected ? <JournalDetail entry={selected} onClose={() => setSelectedId(null)} /> : null}

          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((e) => (
              <EntryCard key={e.id} entry={e} onOpen={() => setSelectedId(e.id)} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
