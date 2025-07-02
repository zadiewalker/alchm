'use client';

import { useEffect, useState } from 'react';
import { JournalEntry } from '@/lib/useJournals';
import useJournals from '@/lib/useJournals';

export default function JournalsPage() {
  const { entries, loading } = useJournals();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Your Journals</h1>
      {loading ? (
        <p>Loading your reflections...</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="border p-4 rounded bg-white shadow">
              <p className="mb-2">{entry.reflection}</p>
              <div className="text-sm text-gray-500 flex justify-between">
                <span>{entry.createdAt}</span>
                <span>{entry.tags?.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
