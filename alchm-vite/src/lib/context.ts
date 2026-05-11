'use client';

import { getEntries } from '@/lib/journal';
import { getStreak } from '@/lib/streaks';
import type { JournalEntry } from '@/lib/types';

interface EntryDigest {
  date: string;
  mood: string | null;
  themes: string[];
  snippet: string;
  hadReflection: boolean;
}

export interface KheperaMemoryContext {
  recentDigests: EntryDigest[];
  moodArc: string;
  recurringThemes: string[];
  totalEntries: number;
  daysSinceFirst: number;
  currentStreak: number;
  timeOfDay: 'late-night' | 'morning' | 'afternoon' | 'evening';
  dayOfWeek: string;
}

function moodWordForEntry(entry: JournalEntry): string | null {
  const extracted = typeof entry.extractedMood === 'string' ? entry.extractedMood.trim() : '';
  if (extracted) return extracted;
  // Keep numeric moods human-readable without forcing a schema migration.
  if (entry.mood === 1) return 'heavy';
  if (entry.mood === 3) return 'anxious';
  if (entry.mood === 5) return 'neutral';
  if (entry.mood === 7) return 'hopeful';
  if (entry.mood === 9) return 'peaceful';
  return null;
}

function themesForEntry(entry: JournalEntry): string[] {
  const tags = Array.isArray(entry.tags) ? entry.tags : [];
  const extracted = Array.isArray(entry.extractedThemes) ? entry.extractedThemes : [];
  const merged = [...tags, ...extracted]
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 6);
  // De-dupe (case-insensitive).
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of merged) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function timeOfDayFor(now: Date): KheperaMemoryContext['timeOfDay'] {
  const hour = now.getHours();
  if (hour < 5) return 'late-night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function buildKheperaContext(now: Date = new Date()): KheperaMemoryContext {
  const entries = getEntries();
  const streak = getStreak();

  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const timeOfDay = timeOfDayFor(now);

  if (!entries.length) {
    return {
      recentDigests: [],
      moodArc: '',
      recurringThemes: [],
      totalEntries: 0,
      daysSinceFirst: 0,
      currentStreak: 0,
      timeOfDay,
      dayOfWeek,
    };
  }

  const recent = entries.slice(0, 10);
  const recentDigests: EntryDigest[] = recent.map((e) => {
    const created = new Date(e.createdAt || e.updatedAt);
    const date = created.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const snippet = (e.content || '').slice(0, 80).replace(/\s+/g, ' ').trim();
    return {
      date,
      mood: moodWordForEntry(e),
      themes: themesForEntry(e),
      snippet,
      hadReflection: Boolean((e.kheperaReflection || '').trim()),
    };
  });

  const moodArc = recent
    .slice(0, 5)
    .map(moodWordForEntry)
    .filter((m): m is string => typeof m === 'string' && m.length > 0)
    .reverse()
    .join(' → ');

  const themeCounts: Record<string, number> = {};
  for (const e of entries) {
    for (const t of themesForEntry(e)) {
      const key = t.toLowerCase();
      themeCounts[key] = (themeCounts[key] || 0) + 1;
    }
  }
  const recurringThemes = Object.entries(themeCounts)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  const oldest = entries[entries.length - 1];
  const firstDate = new Date(oldest.createdAt || oldest.updatedAt);
  const daysSinceFirst = Number.isNaN(firstDate.getTime())
    ? 0
    : Math.max(0, Math.floor((now.getTime() - firstDate.getTime()) / 86_400_000));

  return {
    recentDigests,
    moodArc,
    recurringThemes,
    totalEntries: entries.length,
    daysSinceFirst,
    currentStreak: Math.max(0, Number(streak.currentStreak || 0)),
    timeOfDay,
    dayOfWeek,
  };
}

export function formatContextForPrompt(ctx: KheperaMemoryContext): string {
  const lines: string[] = [];

  lines.push(`The user has written ${ctx.totalEntries} entries over ${ctx.daysSinceFirst} days.`);
  lines.push(`It is currently ${ctx.timeOfDay} on ${ctx.dayOfWeek}.`);
  lines.push(`Current streak: ${ctx.currentStreak}.`);

  if (ctx.moodArc) lines.push(`Recent mood progression: ${ctx.moodArc}`);
  if (ctx.recurringThemes.length) lines.push(`Recurring themes: ${ctx.recurringThemes.join(', ')}`);

  if (ctx.recentDigests.length) {
    lines.push('Recent entries (most recent first):');
    for (const d of ctx.recentDigests.slice(0, 5)) {
      const mood = d.mood ? ` [${d.mood}]` : '';
      lines.push(`  ${d.date}${mood}: "${d.snippet}${d.snippet.length >= 80 ? '…' : ''}"`);
    }
  }

  return lines.join('\n');
}

