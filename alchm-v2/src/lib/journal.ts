'use client';

import type { JournalEntry } from '@/lib/types';
import { readJsonExact, readString, removeKey, STORAGE_KEYS, writeJson, writeString } from '@/lib/storage';

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
  const ok = saveEntries(entries);
  if (ok) updateStreakMetrics(entry.createdAt);
  return ok;
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

function updateStreakMetrics(entryDateIso: string): void {
  try {
    const entryDate = new Date(entryDateIso);
    if (Number.isNaN(entryDate.getTime())) return;

    const lastRaw = readString(STORAGE_KEYS.lastEntryDate, '');
    const lastDate = lastRaw ? new Date(lastRaw) : null;
    const previousStreak = Number.parseInt(readString(STORAGE_KEYS.currentStreak, '0'), 10) || 0;
    const longest = Number.parseInt(readString(STORAGE_KEYS.longestStreak, '0'), 10) || 0;

    let nextStreak = 1;
    if (lastDate && !Number.isNaN(lastDate.getTime())) {
      const dayDiff = Math.floor((entryDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff <= 0) nextStreak = Math.max(previousStreak, 1);
      else if (dayDiff === 1) nextStreak = previousStreak + 1;
      else if (dayDiff <= 3) nextStreak = Math.max(previousStreak, 1);
    }

    const nextLongest = Math.max(longest, nextStreak);
    writeString(STORAGE_KEYS.lastEntryDate, entryDate.toISOString());
    writeString(STORAGE_KEYS.currentStreak, String(nextStreak));
    writeString(STORAGE_KEYS.longestStreak, String(nextLongest));
  } catch {
    // no-op
  }
}

