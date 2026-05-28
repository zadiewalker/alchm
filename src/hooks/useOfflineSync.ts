'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getQueueCount } from '@/services/offline/localQueue';
import { recordOperationalException } from '@/services/monitoring/telemetry';

type UseOfflineSyncReturn = {
  sync: () => Promise<void>;
};

export function useOfflineSync(): UseOfflineSyncReturn {
  const { user } = useAuth();
  const isSyncingRef = useRef(false);

  const sync = useCallback(async (): Promise<void> => {
    const userId = user?.uid;
    if (!userId || isSyncingRef.current) return;
    
    const count = await getQueueCount();
    if (count === 0) return;

    isSyncingRef.current = true;
    try {
      const { drainQueue } = await import('@/services/offline/syncEngine');
      await drainQueue(userId);
    } catch (error) {
      recordOperationalException('sync_issue', error, { state: 'auto_sync', issue: 'drain_queue_failed' });
    } finally {
      isSyncingRef.current = false;
    }
  }, [user?.uid]);

  // Sync when user authenticates
  useEffect(() => {
    if (user?.uid) {
      sync();
    }
  }, [user?.uid, sync]);

  // Sync when connectivity returns
  useEffect(() => {
    const handleOnline = () => {
      sync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [sync]);

  // Sync when app comes to foreground (visibility change)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        sync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [sync]);

  return { sync };
}
