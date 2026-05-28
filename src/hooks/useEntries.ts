'use client';

import { useState, useCallback, useEffect } from 'react';
import type { DocumentSnapshot } from 'firebase/firestore';
import { useSafeAsync } from './useSafeAsync';
import { useAuth } from './useAuth';
import { loadEntries, groupEntriesByMonth } from '@/services/journal/entriesService';
import type { JournalEntry } from '@/types/journal';

export interface UseEntriesReturn {
  entries: JournalEntry[];
  entriesByMonth: Record<string, JournalEntry[]>;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  totalCount: number;
}

export function useEntries(): UseEntriesReturn {
  const { userId } = useAuth();
  const { isMounted, safeDispatch } = useSafeAsync();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>();
  
  const setEntriesSafe = safeDispatch(setEntries);
  const setLoadingSafe = safeDispatch(setIsLoading);
  const setLoadingMoreSafe = safeDispatch(setIsLoadingMore);
  const setHasMoreSafe = safeDispatch(setHasMore);
  const setErrorSafe = safeDispatch(setError);
  const setLastDocSafe = safeDispatch(setLastDoc);
  
  const loadInitial = useCallback(async () => {
    if (!userId) {
      setLoadingSafe(false);
      return;
    }
    
    setLoadingSafe(true);
    setErrorSafe(null);
    
    try {
      const result = await loadEntries({
        userId,
        pageSize: 20
      });
      
      if (isMounted()) {
        setEntriesSafe(result.entries);
        setHasMoreSafe(result.hasMore);
        setLastDocSafe(result.lastDoc);
      }
    } catch (err) {
      if (isMounted()) {
        setErrorSafe(err instanceof Error ? err.message : 'Failed to load entries');
      }
    } finally {
      if (isMounted()) {
        setLoadingSafe(false);
      }
    }
  }, [userId, isMounted, setEntriesSafe, setLoadingSafe, setHasMoreSafe, setErrorSafe, setLastDocSafe]);
  
  const loadMore = useCallback(async () => {
    if (!userId || !hasMore || isLoadingMore || !lastDoc) {
      return;
    }
    
    setLoadingMoreSafe(true);
    setErrorSafe(null);
    
    try {
      const result = await loadEntries({
        userId,
        pageSize: 20,
        startAfter: lastDoc
      });
      
      if (isMounted()) {
        setEntriesSafe(prev => [...prev, ...result.entries]);
        setHasMoreSafe(result.hasMore);
        setLastDocSafe(result.lastDoc);
      }
    } catch (err) {
      if (isMounted()) {
        setErrorSafe(err instanceof Error ? err.message : 'Failed to load more entries');
      }
    } finally {
      if (isMounted()) {
        setLoadingMoreSafe(false);
      }
    }
  }, [userId, hasMore, isLoadingMore, lastDoc, isMounted, setEntriesSafe, setLoadingMoreSafe, setHasMoreSafe, setErrorSafe, setLastDocSafe]);
  
  const refresh = useCallback(async () => {
    setLastDocSafe(undefined);
    await loadInitial();
  }, [loadInitial, setLastDocSafe]);
  
  // Load initial entries when userId changes
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);
  
  const entriesByMonth = groupEntriesByMonth(entries);
  
  return {
    entries,
    entriesByMonth,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    totalCount: entries.length
  };
}
