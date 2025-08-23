'use client';

import React from 'react';
import { useJournals } from '@/lib/useJournals';

type JournalEntry = {
  id?: string;
  createdAt?: string | number | Date;
  text?: string;
};

export default function JournalsPage() {
  // Hook returns an array; make sure we always have an array
  const entries = (useJournals() as unknown as JournalEntry[]) ?? [];

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-semibold">Your Journals</h1>

      {entries.length === 0 ? (
        <div className="mt-4 opacity-70">No entries yet.</div>
      ) : (
        <ul className="mt-4 space-y-2">
          {entries.map((entry, i) => (
            <li key={entry?.id ?? i} className="rounded border p-3">
              <div className="text-sm opacity-70">
                {String(entry?.createdAt ?? '')}
              </div>
              <div className="mt-1">{entry?.text ?? ''}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
