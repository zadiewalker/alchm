'use client';

import { useEffect } from 'react';

export function QueueReplayBootstrap(): null {
  useEffect(() => {
    let cancelled = false;

    const replay = (reason: string) => {
      void import('@/services/journal/queueReplay')
        .then(({ replayPendingJournalQueue }) => {
          if (!cancelled) {
            return replayPendingJournalQueue(reason);
          }
          return undefined;
        })
        .catch((error) => {
          void import('@/services/monitoring/telemetry')
            .then(({ recordOperationalException }) => {
              recordOperationalException('sync_issue', error, {
                state: 'queue_replay_bootstrap_import_failed',
                source: reason,
              });
            })
            .catch(() => {});
        });
    };

    const onOnline = () => replay('online');
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        replay('visible');
      }
    };

    replay('startup');
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return null;
}
