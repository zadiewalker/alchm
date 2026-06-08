import { dataService } from '@/services/data/dataService';
import {
  calculateReturnDaysAgo,
  selectReturnExcerpt,
} from '@/services/returns/returnPreview';
import type { ReturnThresholdData } from '@/types/return';

interface JournalEntryRecord {
  id: string;
  userId: string;
  text: string;
  createdAt: number | string | Date;
}

export interface GetReturnThresholdDataOptions {
  userId: string | null | undefined;
}

async function getJournalEntryById(
  entryId: string,
  userId: string,
): Promise<JournalEntryRecord | null> {
  dataService.setUserId(userId);
  const entry = await dataService.getJournalEntryById(entryId);

  if (!entry || entry.userId !== userId) {
    return null;
  }

  return {
    id: entry.id,
    userId: entry.userId,
    text: String(entry.content || ''),
    createdAt: entry.createdAt,
  };
}

export async function getReturnThresholdData(
  entryId: string,
  options: GetReturnThresholdDataOptions,
): Promise<ReturnThresholdData> {
  if (!options.userId) {
    throw new Error('Return entry unavailable without authenticated user scope');
  }

  const entry = await getJournalEntryById(entryId, options.userId);

  if (!entry) {
    throw new Error(`Return entry not found for id: ${entryId}`);
  }

  return {
    entryId: entry.id,
    excerpt: selectReturnExcerpt(entry.text),
    daysAgo: calculateReturnDaysAgo(entry.createdAt),
  };
}
