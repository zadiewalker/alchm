'use client';

import { Share } from '@capacitor/share';
import type { JournalEntry } from '@/lib/types';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export async function exportJournalData(args: {
  entries: JournalEntry[];
  includeReflections: boolean;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const entries = args.includeReflections
      ? args.entries
      : args.entries.map((e) => ({
          ...e,
          kheperaReflection: undefined,
          insights: undefined,
          kheperaFrameworks: undefined,
        }));
    const payload = {
      exportedAt: new Date().toISOString(),
      entries,
    };
    const text = JSON.stringify(payload, null, 2);
    const fileName = `alchm-export-${new Date().toISOString().slice(0, 10)}.json`;

    try {
      await Share.share({
        title: 'ALCHM Export',
        text,
        dialogTitle: 'Export your journal data',
      });
      return { ok: true };
    } catch {
      // Share plugin may be unavailable on web; fall back to download.
    }

    if (isBrowser()) {
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      return { ok: true };
    }

    return { ok: false, error: 'Export is unavailable in this environment.' };
  } catch {
    return { ok: false, error: 'Export failed.' };
  }
}
