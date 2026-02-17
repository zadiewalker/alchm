'use client';

import type { JournalEntry } from '@/lib/types';
import { readJsonExact, removeKey, STORAGE_KEYS, writeJson } from '@/lib/storage';

function normalizeEntryList(parsed: unknown): JournalEntry[] {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(Boolean) as JournalEntry[];
}

export function getEntries(): JournalEntry[] {
  return normalizeEntryList(readJsonExact<unknown>(STORAGE_KEYS.journalEntries, []));
}

export function saveEntries(entries: JournalEntry[]): boolean {
  return writeJson(STORAGE_KEYS.journalEntries, entries);
}

export function addEntry(entry: JournalEntry): boolean {
  const entries = getEntries();
  entries.unshift(entry);
  // ALCHM intentionally avoids streak/gamification mechanics.
  return saveEntries(entries);
}

export function updateEntry(id: string, updates: Partial<JournalEntry>): boolean {
  const entries = getEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  entries[idx] = { ...entries[idx], ...updates, updatedAt: new Date().toISOString() };
  return saveEntries(entries);
}

export function getDraft(): Partial<JournalEntry> | null {
  return readJsonExact<Partial<JournalEntry> | null>(STORAGE_KEYS.draft, null);
}

export function saveDraft(draft: Partial<JournalEntry>): boolean {
  return writeJson(STORAGE_KEYS.draft, draft);
}

export function clearDraft(): void {
  removeKey(STORAGE_KEYS.draft);
}

// NOTE: We intentionally do not update streak keys. Legacy keys may exist in
// localStorage from older versions; they are ignored by the v2 experience.
