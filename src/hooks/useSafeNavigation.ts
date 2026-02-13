'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { safeWindow } from '@/utils/browser';
import {
  buildAttemptEvent,
  buildBlockedEvent,
  buildFallbackEvent,
  reportNavigationEvent,
  setPendingNavigation,
} from '@/lib/navigationTelemetry';

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
}

export function useSafeNavigation(defaultFallbackMs = 1200) {
  const router = useRouter();
  const inFlightRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      inFlightRef.current = false;
    };
  }, []);

  const navigate = useCallback(
    (path: string, options?: { replace?: boolean; fallbackMs?: number; source?: string }) => {
      const normalizedPath = normalizePath(path);
      const source = options?.source;
      const fromPath = safeWindow.location.pathname || '/';

      if (inFlightRef.current) {
        reportNavigationEvent(
          buildBlockedEvent({
            source,
            fromPath,
            toPath: normalizedPath,
          })
        );
        return;
      }

      const replace = options?.replace ?? false;
      const fallbackMs = options?.fallbackMs ?? defaultFallbackMs;
      const startedAt = Date.now();

      inFlightRef.current = true;

      reportNavigationEvent(
        buildAttemptEvent({
          source,
          fromPath,
          toPath: normalizedPath,
        })
      );
      setPendingNavigation({
        id: `${startedAt}-${normalizedPath}`,
        source,
        fromPath,
        toPath: normalizedPath,
        startedAt,
      });

      const shouldBlockClientPush =
        typeof window !== 'undefined' &&
        /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) &&
        (globalThis as { __ALCHM_TEST_BLOCK_CLIENT_NAV__?: boolean }).__ALCHM_TEST_BLOCK_CLIENT_NAV__ === true;

      if (!shouldBlockClientPush) {
        if (replace) {
          router.replace(normalizedPath);
        } else {
          router.push(normalizedPath);
        }
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (safeWindow.location.pathname !== normalizedPath) {
          reportNavigationEvent(
            buildFallbackEvent({
              source,
              fromPath,
              toPath: normalizedPath,
              durationMs: Date.now() - startedAt,
            })
          );
          safeWindow.open(normalizedPath, '_self');
        }
        inFlightRef.current = false;
      }, fallbackMs);
    },
    [defaultFallbackMs, router]
  );

  return { navigate, inFlightRef };
}
