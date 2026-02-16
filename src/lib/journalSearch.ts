'use client';

import type { JournalEntry } from '@/lib/dataService';

export interface SearchFilters {
  query?: string;
  moods?: string[];
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  hasReflection?: boolean;
  minWordCount?: number;
}

export interface SearchResult {
  entries: JournalEntry[];
  totalCount: number;
  query: SearchFilters;
}

export function searchEntries(allEntries: JournalEntry[], filters: SearchFilters): SearchResult {
  const query = (filters.query || '').trim().toLowerCase();
  const moodSet = new Set((filters.moods || []).map((m) => m.toLowerCase()));
  const tagSet = new Set((filters.tags || []).map((t) => t.toLowerCase()));
  const fromTs = filters.dateFrom ? new Date(filters.dateFrom).getTime() : null;
  const toTs = filters.dateTo ? new Date(filters.dateTo).getTime() + 86400000 - 1 : null;
  const minWords = filters.minWordCount || 0;

  const entries = allEntries
    .filter((entry) => {
      const content = String(entry.content || '');
      const contentLower = content.toLowerCase();
      const entryTs = new Date(entry.createdAt).getTime();
      const entryMoods = (entry.emotions || []).map((m) => String(m).toLowerCase());
      const entryTags = (entry.tags || []).map((t) => String(t).toLowerCase());
      const wordCount = Math.max(0, content.trim() ? content.trim().split(/\s+/).length : 0);

      if (query && !contentLower.includes(query)) return false;
      if (moodSet.size > 0 && !entryMoods.some((m) => moodSet.has(m))) return false;
      if (tagSet.size > 0 && !entryTags.some((t) => tagSet.has(t))) return false;
      if (fromTs !== null && entryTs < fromTs) return false;
      if (toTs !== null && entryTs > toTs) return false;
      if (filters.hasReflection === true && !(entry.insights && entry.insights.length > 0)) return false;
      if (wordCount < minWords) return false;

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    entries,
    totalCount: entries.length,
    query: filters,
  };
}

export function getAvailableMoods(entries: JournalEntry[]): string[] {
  const counts = new Map<string, number>();
  entries.forEach((entry) => {
    (entry.emotions || []).forEach((mood) => {
      const key = String(mood).toLowerCase();
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([mood]) => mood);
}

export function getAvailableTags(entries: JournalEntry[]): string[] {
  const tags = new Set<string>();
  entries.forEach((entry) => {
    (entry.tags || []).forEach((tag) => tags.add(String(tag).toLowerCase()));
  });

  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getDateRange(entries: JournalEntry[]): { earliest: string; latest: string } | null {
  if (!entries.length) return null;

  const timestamps = entries.map((entry) => new Date(entry.createdAt).getTime()).filter((ts) => !Number.isNaN(ts));
  if (!timestamps.length) return null;

  const earliest = new Date(Math.min(...timestamps)).toISOString().slice(0, 10);
  const latest = new Date(Math.max(...timestamps)).toISOString().slice(0, 10);

  return { earliest, latest };
}
