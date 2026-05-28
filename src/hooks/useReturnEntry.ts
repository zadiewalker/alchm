'use client';

import { useEffect, useState } from 'react';
import { useData } from '@/hooks/useData';
import { getReturnPreview, type ReturnEntryPreview } from '@/services/returns/getReturnPreview';

interface UseReturnEntryOptions {
  enabled?: boolean;
}

interface UseReturnEntryResult {
  data: ReturnEntryPreview | null;
  isLoading: boolean;
  error: string | null;
}

export function useReturnEntry(
  entryId: string | null,
  options: UseReturnEntryOptions = {},
): UseReturnEntryResult {
  const { getJournalEntries } = useData();
  const enabled = options.enabled ?? true;
  const [result, setResult] = useState<UseReturnEntryResult>({
    data: null,
    isLoading: enabled && entryId !== null,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    if (!enabled || entryId === null) {
      setResult({
        data: null,
        isLoading: false,
        error: null,
      });
      return () => {
        mounted = false;
      };
    }

    setResult({
      data: null,
      isLoading: true,
      error: null,
    });

    async function load() {
      try {
        const entries = await getJournalEntries();
        const entry = entries.find((item) => item.id === entryId) || null;
        if (!mounted) return;
        setResult({
          data: getReturnPreview(entry),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (!mounted) return;
        setResult({
          data: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Unable to load this return right now.',
        });
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [enabled, entryId, getJournalEntries]);

  return result;
}
