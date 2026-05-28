'use client';

import type { JournalEntry } from '@/services/data/dataService';

export interface ExportOptions {
  format: 'json' | 'csv' | 'txt';
  includeReflections: boolean;
  dateFrom?: string;
  dateTo?: string;
}

function toDate(input: Date | string | undefined): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function formatDateForHumans(input: Date | string): string {
  const date = toDate(input);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toWordCount(content: string): number {
  const normalized = String(content || '').trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

function filterByDate(entries: JournalEntry[], options: ExportOptions): JournalEntry[] {
  const from = options.dateFrom ? new Date(`${options.dateFrom}T00:00:00`).getTime() : null;
  const to = options.dateTo ? new Date(`${options.dateTo}T23:59:59`).getTime() : null;

  return entries.filter((entry) => {
    const created = toDate(entry.createdAt).getTime();
    if (from !== null && created < from) return false;
    if (to !== null && created > to) return false;
    return true;
  });
}

function exportAsJson(entries: JournalEntry[], includeReflections: boolean): string {
  const timestamps = entries.map((entry) => toDate(entry.createdAt).getTime());
  const earliest = timestamps.length ? new Date(Math.min(...timestamps)).toISOString() : null;
  const latest = timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : null;

  const payload = {
    exported: new Date().toISOString(),
    app: 'ALCHM',
    entryCount: entries.length,
    dateRange: { earliest, latest },
    entries: entries.map((entry) => ({
      id: entry.id,
      date: toDate(entry.createdAt).toISOString(),
      mood: entry.emotions || [],
      content: entry.content,
      tags: entry.tags || [],
      wordCount: toWordCount(entry.content),
      ...(includeReflections && entry.insights?.length
        ? { kheperaReflection: entry.insights.join('\n\n') }
        : {}),
    })),
  };

  return JSON.stringify(payload, null, 2);
}

function exportAsCsv(entries: JournalEntry[], includeReflections: boolean): string {
  const headers = ['Date', 'Mood', 'Tags', 'Content', 'Word Count'];
  if (includeReflections) headers.push('Khepera Reflection');

  const rows = entries.map((entry) => {
    const base = [
      escapeCsvCell(toDate(entry.createdAt).toISOString()),
      escapeCsvCell((entry.emotions || []).join(', ')),
      escapeCsvCell((entry.tags || []).join(', ')),
      escapeCsvCell(String(entry.content || '')),
      escapeCsvCell(String(toWordCount(entry.content))),
    ];

    if (includeReflections) {
      base.push(escapeCsvCell(entry.insights?.join(' | ') || ''));
    }

    return base.join(',');
  });

  return `\uFEFF${headers.map(escapeCsvCell).join(',')}\n${rows.join('\n')}`;
}

function exportAsTxt(entries: JournalEntry[], includeReflections: boolean): string {
  return entries
    .map((entry) => {
      const lines: string[] = [
        '---',
        formatDateForHumans(entry.createdAt),
        `Mood: ${(entry.emotions || []).join(', ') || 'Not set'}`,
        `Tags: ${(entry.tags || []).join(', ') || 'None'}`,
        '',
        String(entry.content || ''),
      ];

      if (includeReflections && entry.insights?.length) {
        lines.push('', 'Khepera reflected:', entry.insights.join('\n\n'));
      }

      lines.push('---');
      return lines.join('\n');
    })
    .join('\n\n');
}

export function exportJournalData(entries: JournalEntry[], options: ExportOptions): { blob: Blob; filename: string; count: number } {
  const filtered = filterByDate(entries, options).sort(
    (a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime(),
  );

  const day = new Date().toISOString().slice(0, 10);

  if (options.format === 'csv') {
    return {
      blob: new Blob([exportAsCsv(filtered, options.includeReflections)], { type: 'text/csv;charset=utf-8' }),
      filename: `alchm-journal-${day}.csv`,
      count: filtered.length,
    };
  }

  if (options.format === 'txt') {
    return {
      blob: new Blob([exportAsTxt(filtered, options.includeReflections)], { type: 'text/plain;charset=utf-8' }),
      filename: `alchm-journal-${day}.txt`,
      count: filtered.length,
    };
  }

  return {
    blob: new Blob([exportAsJson(filtered, options.includeReflections)], { type: 'application/json;charset=utf-8' }),
    filename: `alchm-journal-${day}.json`,
    count: filtered.length,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // no-op
  }
}
