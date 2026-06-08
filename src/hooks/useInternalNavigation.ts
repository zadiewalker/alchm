'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { recordOperationalEvent } from '@/services/monitoring/telemetry';
import { stripSearch } from '@/utils/navigation';

type InternalNavigationOptions = {
  source: string;
  surface?: 'dashboard' | 'settings' | 'mirror' | 'containers' | 'journal_limit' | 'onboarding' | 'upgrade';
};

type InternalNavigationStep =
  | 'click'
  | 'same_route_noop'
  | 'duplicate_route_noop'
  | 'transition_in_flight'
  | 'route_push'
  | 'route_push_failed'
  | 'transition_released';
type NavigationEventName = 'internal_nav_tap' | 'footer_nav_tap';
const INTERNAL_NAVIGATION_LOCK_MS = 900;
const INTERNAL_NAVIGATION_STALE_LOCK_MS = 1200;
const INTERNAL_NAVIGATION_RECOVERY_MS = 1400;

function getNavigationEventName(source: string): NavigationEventName {
  return source.startsWith('tab:') ? 'footer_nav_tap' : 'internal_nav_tap';
}

function recordInternalNavigationTap(
  route: string,
  options: InternalNavigationOptions,
  step: InternalNavigationStep,
): void {
  const payload = {
    route,
    source: options.source,
    surface: options.surface,
    step,
  };
  const eventName = getNavigationEventName(options.source);

  const record = (): void => {
    try {
      recordOperationalEvent(eventName, payload);
    } catch {
      // Navigation breadcrumbs must never block app routing.
    }
  };

  if (typeof queueMicrotask === 'function') {
    queueMicrotask(record);
    return;
  }

  globalThis.setTimeout(record, 0);
}

function logNavigationDiagnostic(
  route: string,
  options: InternalNavigationOptions,
  step: InternalNavigationStep,
): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (
    step !== 'duplicate_route_noop' &&
    step !== 'transition_in_flight' &&
    step !== 'route_push_failed'
  ) {
    return;
  }

  console.debug('[ALCHM nav]', {
    route,
    source: options.source,
    surface: options.surface,
    step,
  });
}

export function useInternalNavigation(): {
  navigate: (route: string, options: InternalNavigationOptions) => void;
  pathname: string | null;
} {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRouteRef = useRef<string | null>(null);
  const pendingStartedAtRef = useRef<number | null>(null);
  const releaseTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  const clearPendingNavigation = useCallback((step: InternalNavigationStep = 'transition_released'): void => {
    const pendingRoute = pendingRouteRef.current;

    if (releaseTimerRef.current) {
      globalThis.clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }

    pendingRouteRef.current = null;
    pendingStartedAtRef.current = null;

    if (pendingRoute) {
      recordInternalNavigationTap(pendingRoute, { source: 'internal_navigation' }, step);
    }
  }, []);

  useEffect(() => {
    if (!pendingRouteRef.current) {
      return;
    }

    clearPendingNavigation();
  }, [clearPendingNavigation, pathname]);

  useEffect(() => {
    const releaseOnPageLifecycle = (): void => {
      clearPendingNavigation('transition_released');
    };

    const releaseOnVisibilityChange = (): void => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
        releaseOnPageLifecycle();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', releaseOnVisibilityChange);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('pagehide', releaseOnPageLifecycle);
      window.addEventListener('pageshow', releaseOnPageLifecycle);
      window.addEventListener('blur', releaseOnPageLifecycle);
      window.addEventListener('focus', releaseOnPageLifecycle);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', releaseOnVisibilityChange);
      }

      if (typeof window !== 'undefined') {
        window.removeEventListener('pagehide', releaseOnPageLifecycle);
        window.removeEventListener('pageshow', releaseOnPageLifecycle);
        window.removeEventListener('blur', releaseOnPageLifecycle);
        window.removeEventListener('focus', releaseOnPageLifecycle);
      }

      clearPendingNavigation('transition_released');
    };
  }, [clearPendingNavigation]);

  const navigate = useCallback((route: string, options: InternalNavigationOptions): void => {
    const targetRoute = stripSearch(route);
    const currentRoute = stripSearch(pathname);

    recordInternalNavigationTap(route, options, 'click');

    if (currentRoute === targetRoute) {
      clearPendingNavigation('same_route_noop');
      recordInternalNavigationTap(route, options, 'same_route_noop');
      return;
    }

    if (pendingRouteRef.current) {
      const pendingRoute = pendingRouteRef.current;
      const pendingStartedAt = pendingStartedAtRef.current ?? Date.now();
      const pendingAgeMs = Date.now() - pendingStartedAt;

      if (pendingAgeMs > INTERNAL_NAVIGATION_STALE_LOCK_MS) {
        clearPendingNavigation('transition_released');
      } else if (pendingRoute === targetRoute) {
        recordInternalNavigationTap(route, options, 'duplicate_route_noop');
        logNavigationDiagnostic(route, options, 'duplicate_route_noop');
        return;
      } else {
        recordInternalNavigationTap(route, options, 'transition_in_flight');
        logNavigationDiagnostic(route, options, 'transition_in_flight');
        clearPendingNavigation('transition_released');
      }
    }

    let routePushStarted = false;

    try {
      pendingRouteRef.current = targetRoute;
      pendingStartedAtRef.current = Date.now();
      if (releaseTimerRef.current) {
        globalThis.clearTimeout(releaseTimerRef.current);
      }
      releaseTimerRef.current = globalThis.setTimeout(() => {
        const currentPath = typeof window !== 'undefined'
          ? stripSearch(window.location.pathname)
          : targetRoute;
        if (currentPath !== targetRoute && typeof window !== 'undefined') {
          window.location.assign(route);
          return;
        }
        clearPendingNavigation();
      }, INTERNAL_NAVIGATION_RECOVERY_MS);
      router.push(route);
      routePushStarted = true;
      recordInternalNavigationTap(route, options, 'route_push');
    } catch {
      recordInternalNavigationTap(route, options, 'route_push_failed');
      logNavigationDiagnostic(route, options, 'route_push_failed');
    } finally {
      if (!routePushStarted) {
        clearPendingNavigation('route_push_failed');
      }
    }
  }, [clearPendingNavigation, pathname, router]);

  return { navigate, pathname };
}
