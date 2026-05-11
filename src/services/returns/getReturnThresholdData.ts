import { dataService } from '@/services/data/dataService';
import {
  calculateReturnDaysAgo,
  selectReturnExcerpt,
} from '@/services/returns/returnPreview';
import type { ReturnThresholdData } from '@/types/return';

interface JournalEntryRecord {
  id: string;
  text: string;
  createdAt: number | string | Date;
}

async function getJournalEntryById(entryId: string): Promise<JournalEntryRecord | null> {
  const entries = await dataService.getJournalEntries();
  const entry = entries.find((item) => item.id === entryId) || null;

  if (!entry) {
    return null;
  }

  return {
    id: entry.id,
    text: String(entry.content || ''),
    createdAt: entry.createdAt,
  };
}

export async function getReturnThresholdData(entryId: string): Promise<ReturnThresholdData> {
  const entry = await getJournalEntryById(entryId);

  if (!entry) {
    throw new Error(`Return entry not found for id: ${entryId}`);
  }

  return {
    entryId: entry.id,
    excerpt: selectReturnExcerpt(entry.text),
    daysAgo: calculateReturnDaysAgo(entry.createdAt),
  };
}
