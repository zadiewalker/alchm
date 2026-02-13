'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  buildCompleteEvent,
  clearPendingNavigation,
  getPendingNavigation,
  reportNavigationEvent,
} from '@/lib/navigationTelemetry';

export default function NavigationTelemetryObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = getPendingNavigation();
    if (!pending) return;

    const currentPath = pathname || '/';
    if (currentPath !== pending.toPath) return;

    const durationMs = Date.now() - pending.startedAt;
    reportNavigationEvent(
      buildCompleteEvent({
        source: pending.source,
        fromPath: pending.fromPath,
        toPath: pending.toPath,
        durationMs,
      })
    );
    clearPendingNavigation();
  }, [pathname]);

  return null;
}
