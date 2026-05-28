import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dataService, type JournalEntry } from '@/services/data/dataService';
import type { UserContainer } from '@/types/container';

export interface UseDataReturn {
  isInitialized: boolean;
  getJournalEntries: (limit?: number) => Promise<JournalEntry[]>;
  getUserContainers: () => Promise<UserContainer[]>;
}

export function useData(): UseDataReturn {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    dataService.setUserId(auth.user?.uid ?? '');
    setIsInitialized(true);
  }, [auth.isLoading, auth.user?.uid]);

  const getJournalEntries = useCallback(async (limit?: number): Promise<JournalEntry[]> => {
    return dataService.getJournalEntries(limit);
  }, []);

  const getUserContainers = useCallback(async (): Promise<UserContainer[]> => {
    return dataService.getUserContainers();
  }, []);

  return {
    isInitialized,
    getJournalEntries,
    getUserContainers,
  };
}

export default useData;
