'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getReturnThresholdData } from '@/services/returns/getReturnThresholdData';
import type { ReturnThresholdData } from '@/types/return';

interface UseReturnThresholdDataState {
  data: ReturnThresholdData | null;
  isLoading: boolean;
  error: string | null;
}

export function useReturnThresholdData(entryId: string | null): UseReturnThresholdDataState {
  const auth = useAuth();
  const [state, setState] = useState<UseReturnThresholdDataState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    if (!entryId) {
      setState({
        data: null,
        isLoading: false,
        error: 'This return is not available right now.',
      });
      return () => {
        isActive = false;
      };
    }

    if (auth.isLoading) {
      setState({
        data: null,
        isLoading: true,
        error: null,
      });
      return () => {
        isActive = false;
      };
    }

    if (!auth.user?.uid) {
      setState({
        data: null,
        isLoading: false,
        error: 'This return is not available right now.',
      });
      return () => {
        isActive = false;
      };
    }

    const resolvedEntryId = entryId;
    const userId = auth.user.uid;

    async function load(): Promise<void> {
      try {
        const data = await getReturnThresholdData(resolvedEntryId, { userId });

        if (!isActive) {
          return;
        }

        setState({
          data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error ? error.message : 'Unable to load this return right now.';

        setState({
          data: null,
          isLoading: false,
          error: message,
        });
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [auth.isLoading, auth.user?.uid, entryId]);

  return state;
}
