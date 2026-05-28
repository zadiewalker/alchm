'use client';

import { useEffect } from 'react';
import {
  initializeNotificationRouter,
  isNotificationTapData,
  resolveNotificationRoute,
} from '@/services/notifications/notificationRouter';

type Navigate = (href: string, options: { source: string }) => void;

export function useNotificationRouting(navigate: Navigate): void {
  useEffect(() => {
    let disposed = false;
    let removeNativeListeners: (() => Promise<void>) | null = null;

    void initializeNotificationRouter()
      .then((remove) => {
        if (disposed) {
          void remove();
          return;
        }
        removeNativeListeners = remove;
      })
      .catch((error) => {
        console.warn('Failed to initialize notification router:', error);
      });

    return () => {
      disposed = true;
      void removeNativeListeners?.();
    };
  }, []);

  useEffect(() => {
    const handleNotificationTap = (event: Event) => {
      if (event instanceof CustomEvent) {
        const detail: unknown = event.detail;
        if (isNotificationTapData(detail)) {
          navigate(resolveNotificationRoute(detail), { source: 'notification_tap' });
        }
      }
    };

    window.addEventListener('alchm-notification-tap', handleNotificationTap);
    return () => window.removeEventListener('alchm-notification-tap', handleNotificationTap);
  }, [navigate]);
}
