'use client';

import { getEntries } from '@/lib/journal';
import type { JournalEntry } from '@/lib/types';

export interface MoodPattern { mood: string; count: number; percentage: number; trend: 'rising' | 'falling' | 'stable'; peakDay: string | null; peakTime: 'late-night' | 'morning' | 'afternoon' | 'evening' | null; }
export interface ThemeCluster { theme: string; count: number; firstSeen: string; lastSeen: string; associatedMoods: string[]; trend: 'rising' | 'falling' | 'stable'; }
export interface TemporalInsight { type: 'day_pattern' | 'time_pattern' | 'frequency_change' | 'mood_shift'; description: string; }
export interface InsightReport { moodPatterns: MoodPattern[]; themePatterns: ThemeCluster[]; temporalInsights: TemporalInsight[]; totalEntries: number; entriesNeeded: number; }

function moodWord(e: JournalEntry): string | null {
  const ex = typeof e.extractedMood === 'string' ? e.extractedMood.trim().toLowerCase() : '';
  if (ex) return ex;
  if (e.mood === 1) return 'heavy';
  if (e.mood === 3) return 'anxious';
  if (e.mood === 5) return 'neutral';
  if (e.mood === 7) return 'hopeful';
  if (e.mood === 9) return 'peaceful';
  return null;
}

function entryThemes(e: JournalEntry): string[] {
  const tags = Array.isArray(e.tags) ? e.tags : [];
  const ex = Array.isArray(e.extractedThemes) ? e.extractedThemes : [];
  const merged = [...tags, ...ex].map((t) => String(t).trim()).filter(Boolean);
  const seen = new Set<string>(); const out: string[] = [];
  for (const t of merged) { const k = t.toLowerCase(); if (seen.has(k)) continue; seen.add(k); out.push(t); if (out.length >= 3) break; }
  return out;
}

function bucket(d: Date): 'late-night' | 'morning' | 'afternoon' | 'evening' { const h = d.getHours(); if (h < 5) return 'late-night'; if (h < 12) return 'morning'; if (h < 17) return 'afternoon'; return 'evening'; }
function peak(map: Record<string, number>): string | null {
  const es = Object.entries(map); if (!es.length) return null;
  es.sort((a, b) => b[1] - a[1]);
  const avg = es.reduce((s, [, c]) => s + c, 0) / es.length;
  return es[0][1] >= avg * 1.5 ? es[0][0] : null;
}
const fmt = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function generateInsightReport(): InsightReport {
  const entries = getEntries(); const minEntries = 5; const totalEntries = entries.length; const entriesNeeded = Math.max(0, minEntries - totalEntries);
  if (totalEntries < minEntries) return { moodPatterns: [], themePatterns: [], temporalInsights: [], totalEntries, entriesNeeded };

  const moods = entries.map((e) => ({ e, m: moodWord(e) })).filter((x): x is { e: JournalEntry; m: string } => typeof x.m === 'string' && x.m.length > 0);
  const moodCounts: Record<string, number> = {}; const byDay: Record<string, Record<string, number>> = {}; const byTime: Record<string, Record<string, number>> = {};
  for (const { e, m } of moods) {
    moodCounts[m] = (moodCounts[m] || 0) + 1;
    const dt = new Date(e.createdAt || e.updatedAt); const day = dt.toLocaleDateString('en-US', { weekday: 'long' }); const t = bucket(dt);
    byDay[m] = byDay[m] || {}; byTime[m] = byTime[m] || {}; byDay[m][day] = (byDay[m][day] || 0) + 1; byTime[m][t] = (byTime[m][t] || 0) + 1;
  }

  const mid = Math.floor(moods.length / 2); const recent = moods.slice(0, mid); const older = moods.slice(mid);
  const trendFor = (m: string): MoodPattern['trend'] => {
    if (!older.length || !recent.length) return 'stable';
    const o = older.filter((x) => x.m === m).length / older.length; const n = recent.filter((x) => x.m === m).length / recent.length;
    if (n > o + 0.1) return 'rising'; if (n < o - 0.1) return 'falling'; return 'stable';
  };
  const moodPatterns: MoodPattern[] = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([m, c]) => ({
    mood: m, count: c, percentage: Math.round((c / Math.max(1, moods.length)) * 100), trend: trendFor(m),
    peakDay: peak(byDay[m] || {}), peakTime: (peak(byTime[m] || {}) as MoodPattern['peakTime']) || null,
  }));

  const themeMeta: Record<string, { count: number; first: string; last: string; moods: string[]; recent: number; old: number }> = {};
  const tMid = Math.floor(entries.length / 2);
  for (let i = 0; i < entries.length; i += 1) {
    const e = entries[i]; const m = moodWord(e); const themes = entryThemes(e);
    for (const raw of themes) {
      const key = raw.toLowerCase();
      if (!themeMeta[key]) themeMeta[key] = { count: 0, first: e.createdAt || e.updatedAt, last: e.createdAt || e.updatedAt, moods: [], recent: 0, old: 0 };
      const meta = themeMeta[key]; meta.count += 1; meta.last = e.createdAt || e.updatedAt; if (m) meta.moods.push(m); if (i < tMid) meta.recent += 1; else meta.old += 1;
    }
  }
  const themePatterns: ThemeCluster[] = Object.entries(themeMeta).filter(([, m]) => m.count >= 2).sort((a, b) => b[1].count - a[1].count).slice(0, 8).map(([theme, m]) => ({
    theme, count: m.count, firstSeen: fmt(m.first), lastSeen: fmt(m.last), associatedMoods: Array.from(new Set(m.moods)).slice(0, 3),
    trend: m.recent > m.old + 1 ? 'rising' : m.recent < m.old - 1 ? 'falling' : 'stable',
  }));

  const temporalInsights: TemporalInsight[] = [];
  const dayCounts: Record<string, number> = {}; const timeCounts: Record<string, number> = {};
  for (const e of entries) { const dt = new Date(e.createdAt || e.updatedAt); const day = dt.toLocaleDateString('en-US', { weekday: 'long' }); const t = bucket(dt); dayCounts[day] = (dayCounts[day] || 0) + 1; timeCounts[t] = (timeCounts[t] || 0) + 1; }
  const topDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
  if (topDay && topDay[1] >= 3) temporalInsights.push({ type: 'day_pattern', description: `You write most on ${topDay[0]}s. Something about that day pulls you here.` });
  const late = timeCounts['late-night'] || 0;
  if (late >= 3) temporalInsights.push({ type: 'time_pattern', description: `${Math.round((late / Math.max(1, entries.length)) * 100)}% of your entries happen after midnight. Those late-night words matter.` });

  if (entries.length >= 10) {
    const dom = (slice: JournalEntry[]) => {
      const c: Record<string, number> = {};
      for (const e of slice) { const m = moodWord(e); if (!m) continue; c[m] = (c[m] || 0) + 1; }
      return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    };
    const r = dom(entries.slice(0, 5)); const o = dom(entries.slice(-5));
    if (r && o && r !== o) temporalInsights.push({ type: 'mood_shift', description: `Your entries have shifted from mostly ${o} to mostly ${r}. That's movement.` });
  }

  if (entries.length >= 14) {
    const now = Date.now(); const week = 7 * 86_400_000;
    const thisWeek = entries.filter((e) => new Date(e.createdAt || e.updatedAt).getTime() > now - week).length;
    const lastWeek = entries.filter((e) => { const t = new Date(e.createdAt || e.updatedAt).getTime(); return t > now - week * 2 && t <= now - week; }).length;
    if (thisWeek > lastWeek + 2) temporalInsights.push({ type: 'frequency_change', description: 'You wrote more this week than last. Something is asking to be processed.' });
    else if (thisWeek < lastWeek - 2) temporalInsights.push({ type: 'frequency_change', description: "Quieter week. That's not a failure. Sometimes integration happens in silence." });
  }

  return { moodPatterns, themePatterns, temporalInsights, totalEntries, entriesNeeded };
}

