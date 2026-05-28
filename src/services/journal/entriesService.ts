'use client';

import { 
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  DocumentSnapshot
} from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import type { JournalEntry } from '@/types/journal';

export interface EntriesPage {
  entries: JournalEntry[];
  lastDoc?: DocumentSnapshot;
  hasMore: boolean;
}

export interface LoadEntriesOptions {
  userId: string;
  pageSize?: number;
  startAfter?: DocumentSnapshot;
  includeDeleted?: boolean;
}

export async function loadEntries({
  userId,
  pageSize = 20,
  startAfter: startAfterDoc,
  includeDeleted: _includeDeleted = false
}: LoadEntriesOptions): Promise<EntriesPage> {
  try {
    const db = getFirestoreDb();
    const entriesRef = collection(db, 'users', userId, 'sessions');
    
    let q = query(
      entriesRef,
      orderBy('createdAt', 'desc'),
      limit(pageSize + 1) // Load one extra to check if there are more
    );
    
    // Note: Current JournalEntry schema doesn't support soft deletion
    // All entries are considered active
    
    // Add pagination cursor
    if (startAfterDoc) {
      q = query(
        entriesRef,
        orderBy('createdAt', 'desc'),
        startAfter(startAfterDoc),
        limit(pageSize + 1)
      );
    }
    
    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    
    // Check if there are more pages
    const hasMore = docs.length > pageSize;
    const entries = docs.slice(0, pageSize);
    const lastDoc = entries.length > 0 ? entries[entries.length - 1] : undefined;
    
    return {
      entries: entries.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JournalEntry)),
      lastDoc,
      hasMore
    };
  } catch (error) {
    console.error('Failed to load entries:', error);
    throw new Error('Failed to load entries');
  }
}

export async function loadEntry(entryId: string, userId: string): Promise<JournalEntry | null> {
  try {
    const db = getFirestoreDb();
    const entryRef = doc(db, 'users', userId, 'sessions', entryId);
    const entrySnap = await getDoc(entryRef);
    
    if (!entrySnap.exists()) {
      return null;
    }
    
    const entry = { id: entrySnap.id, ...entrySnap.data() } as JournalEntry;
    
    return entry;
  } catch (error) {
    console.error('Failed to load entry:', error);
    throw new Error('Failed to load entry');
  }
}

export function groupEntriesByMonth(entries: JournalEntry[]): Record<string, JournalEntry[]> {
  const groups: Record<string, JournalEntry[]> = {};
  
  for (const entry of entries) {
    if (!entry.createdAt) continue;

    const date = entry.createdAt.toDate();
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(entry);
  }
  
  return groups;
}

export function getMonthDisplayName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long'
  });
}

export function getEntryPreview(entry: JournalEntry, maxLength: number = 120): string {
  if (!entry.entryText) return '';
  
  // Strip any markdown or formatting
  const plainText = entry.entryText.replace(/[#*`_~]/g, '').trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last space before the cutoff to avoid cutting words
  const cutoff = plainText.lastIndexOf(' ', maxLength);
  return plainText.slice(0, cutoff > 0 ? cutoff : maxLength) + '…';
}
