'use client';

// src/app/RootLayoutClient.tsx

import { useEffect, useReducer, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { bootstrap } from '@/boot/bootstrap';
import { transition, AppState, AppEvent } from '@/boot/appStateMachine';
import { QA_ROUTES_ENABLED } from '@/config/qa';
import { ErrorScreen } from '@/components/boot/ErrorScreen';
import { AppShell } from '@/components/shell/AppShell';
import { ALCHMWordmark } from '@/components/ui/ALCHMWordmark';
import { AppText } from '@/components/ui/AppText';
import { PageTransition } from '@/components/ui/PageTransition';
import { A11yAudit } from '@/components/dev/A11yAudit';
import { SubscriptionProvider } from '@/components/subscriptions/SubscriptionProvider';
import { useRootRuntimeServices } from '@/hooks/useRootRuntimeServices';
import { reconcilePendingNavigationForCurrentPath } from '@/hooks/useSafeNavigation';
import type { RootClientShellProps } from '@/types/shell';

const initialState: AppState = { status: 'bootstrapping' };
const ROOT_AUTH_TIMEOUT_MS = 5000;
const ROOT_SPLASH_FALLBACK_MS = 2000;

function appReducer(state: AppState, event: AppEvent): AppState {
  const next = transition(state, event);
  return next;
}

export function RootLayoutClient({ children }: RootClientShellProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const rootRuntime = useRootRuntimeServices();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const authUnsubscribe = useRef<(() => void) | null>(null);
  const startupStartedAtRef = useRef<number>(Date.now());
  const startupEventLoggedRef = useRef(false);
  const startupShellVisibleRef = useRef(false);
  const startupReadyRef = useRef(false);
  const startupFallbackRef = useRef(false);
  const isQaRoute = QA_ROUTES_ENABLED && pathname?.startsWith('/qa');
  const hasCachedSession = rootRuntime.hasCachedSession();

  useEffect(() => {
    rootRuntime.recordOperationalBreadcrumb('startup.root_mounted', {
      source: 'root_layout',
      route: pathname ?? 'unknown',
      result: 'mounted',
    });
    rootRuntime.recordOperationalBreadcrumb('startup.startup_shell_visible', {
      source: 'root_layout',
      route: pathname ?? 'unknown',
      result: 'visible',
    });

    void rootRuntime.hideSplashSafely('root_mounted');
    rootRuntime.scheduleSplashHideFallback(ROOT_SPLASH_FALLBACK_MS);
  }, [rootRuntime, pathname]);

  useEffect(() => {
    if (startupEventLoggedRef.current) {
      return;
    }

    startupEventLoggedRef.current = true;
    rootRuntime.recordOperationalEvent('app_startup_started', {
      step: 'bootstrap',
      route: pathname ?? 'unknown',
      result: 'pending',
      hasCachedSession,
      hasFirebaseUser: false,
      source: 'root_layout',
    });
  }, [hasCachedSession, pathname, rootRuntime]);

  // ─── PHASE 1: BOOTSTRAP ─────────────────────────────────────────────────
  useEffect(() => {
    if (state.status !== 'bootstrapping') {
      return;
    }

    const bootstrapResult = bootstrap();
    if (bootstrapResult.ok) {
      dispatch({ type: 'BOOTSTRAP_COMPLETE', hasCompletedOnboarding: bootstrapResult.hasCompletedOnboarding });
    } else {
      dispatch({ type: 'BOOTSTRAP_FAILED', error: bootstrapResult.error ?? 'Unknown bootstrap error' });
    }
  }, [state.status]);

  useEffect(() => {
    const handleFatal = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      void rootRuntime.hideSplashSafely('fatal_event');
      dispatch({
        type: 'FATAL_ERROR',
        message: customEvent.detail?.message || 'A JavaScript error occurred during startup.',
      });
    };

    window.addEventListener('alchm:fatal', handleFatal as EventListener);
    return () => {
      window.removeEventListener('alchm:fatal', handleFatal as EventListener);
    };
  }, [rootRuntime]);

  // ─── PHASE 2: AUTH ──────────────────────────────────────────────────────
  useEffect(() => {
    if (state.status !== 'initializing_auth') return;

    let resolved = false;
    let unsubscribe: (() => void) | null = null;

    // Hard timeout — continue without blocking first entry.
    const timeout = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      startupFallbackRef.current = true;
      rootRuntime.recordOperationalEvent('app_startup_bootstrap_timeout', {
        step: 'initializing_auth',
        route: pathname ?? 'unknown',
        result: 'timeout',
        durationMs: Date.now() - startupStartedAtRef.current,
        hasCachedSession,
        hasFirebaseUser: false,
        source: 'auth_listener',
      });
      rootRuntime.recordOperationalEvent('app_startup_fallback', {
        step: 'initializing_auth',
        route: pathname ?? 'unknown',
        result: 'fallback',
        durationMs: Date.now() - startupStartedAtRef.current,
        hasCachedSession,
        hasFirebaseUser: false,
        source: 'auth_timeout',
      });
      dispatch({ type: 'AUTH_TIMEOUT' });
    }, ROOT_AUTH_TIMEOUT_MS);

    const initializeAuth = async (): Promise<void> => {
      try {
        unsubscribe = await rootRuntime.startAuthListener(ROOT_AUTH_TIMEOUT_MS, (user) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timeout);
          rootRuntime.recordOperationalEvent('app_startup_auth_ready', {
            step: 'auth_resolved',
            route: pathname ?? 'unknown',
            result: 'success',
            durationMs: Date.now() - startupStartedAtRef.current,
            hasCachedSession,
            hasFirebaseUser: Boolean(user),
            source: user ? 'firebase_auth' : 'anonymous_or_signed_out',
          });

          dispatch({ type: 'AUTH_RESOLVED', userId: user?.uid ?? null });
        });
        authUnsubscribe.current = unsubscribe;
      } catch (error) {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        const message = error instanceof Error ? error.message : 'Failed to initialize authentication.';
        console.error('[FATAL auth init]', {
          message,
          error,
          stack: error instanceof Error ? error.stack : undefined,
        });
        dispatch({ type: 'FATAL_ERROR', message });
      }
    };

    void initializeAuth();

    return () => {
      clearTimeout(timeout);
      unsubscribe?.();
      authUnsubscribe.current = null;
    };
  }, [hasCachedSession, pathname, rootRuntime, state.status]);

  useEffect(() => {
    if (startupShellVisibleRef.current) {
      return;
    }

    if (state.status !== 'bootstrapping' && state.status !== 'initializing_auth') {
      return;
    }

    startupShellVisibleRef.current = true;
    rootRuntime.recordOperationalEvent('app_startup_shell_visible', {
      step: state.status,
      route: pathname ?? 'unknown',
      result: 'visible',
      durationMs: Date.now() - startupStartedAtRef.current,
      hasCachedSession,
      hasFirebaseUser: false,
      source: 'root_layout',
    });
  }, [hasCachedSession, pathname, rootRuntime, state.status]);

  useEffect(() => {
    if (startupReadyRef.current) {
      return;
    }

    if (state.status !== 'onboarding' && state.status !== 'app_ready') {
      return;
    }

    startupReadyRef.current = true;
    rootRuntime.recordOperationalEvent('app_startup_ready', {
      step: state.status,
      route: pathname ?? 'unknown',
      result: startupFallbackRef.current ? 'fallback' : 'success',
      durationMs: Date.now() - startupStartedAtRef.current,
      hasCachedSession,
      hasFirebaseUser: state.status === 'app_ready' ? Boolean(state.userId) : false,
      source: startupFallbackRef.current ? 'timeout_recovered' : 'root_layout',
    });
  }, [hasCachedSession, pathname, rootRuntime, state]);

  // ─── PHASE 3: ROUTE GATING ─────────────────────────────────────────────
  useEffect(() => {
    rootRuntime.syncNativeSplashScreen(state.status);
  }, [rootRuntime, state.status]);

  const handleRetry = (): void => {
    startupEventLoggedRef.current = false;
    startupShellVisibleRef.current = false;
    startupReadyRef.current = false;
    startupFallbackRef.current = false;
    startupStartedAtRef.current = Date.now();
    dispatch({ type: 'RETRY' });
  };

  useEffect(() => {
    reconcilePendingNavigationForCurrentPath();
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onboardingComplete = rootRuntime.isOnboardingComplete();

    if (state.status === 'onboarding') {
      if (onboardingComplete) {
        dispatch({ type: 'ONBOARDING_COMPLETE' });
        return;
      }

  const isAllowedOnboardingRoute =
        pathname === '/' ||
        pathname?.startsWith('/settings') ||
        pathname?.startsWith('/onboarding') ||
        pathname?.startsWith('/paywall') ||
        pathname?.startsWith('/upgrade') ||
        pathname?.startsWith('/auth/') ||
        isQaRoute;

      if (!isAllowedOnboardingRoute) {
        router.replace('/onboarding');
      }
      return;
    }

    if (state.status === 'app_ready' && pathname?.startsWith('/onboarding')) {
      router.replace('/dashboard');
    }
  }, [state.status, pathname, router, rootRuntime]);

  const isShelllessRoute =
    pathname === '/' ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/paywall') ||
    pathname?.startsWith('/upgrade') ||
    pathname?.startsWith('/auth/') ||
    pathname?.startsWith('/journal/new') ||
    pathname?.startsWith('/entry/new') ||
    isQaRoute;

  const isFirstContactRoute =
    pathname === '/' ||
    pathname?.startsWith('/onboarding') ||
    isQaRoute;

  // ─── RENDER BY STATE ────────────────────────────────────────────────────
  switch (state.status) {
    case 'bootstrapping':
    case 'initializing_auth':
      return (
        <div className="splash-brand-screen startup-wordmark-screen">
          <div className="scarab-logo-slot scarab-logo-slot--splash">
            <ALCHMWordmark variant="fallback" />
          </div>
          <AppText variant="secondary" as="p" className="startup-wordmark-copy">
            Protecting your writing...
          </AppText>
        </div>
      );

    case 'onboarding':
      if (isFirstContactRoute) {
        return (
          <SubscriptionProvider>
            {children}
          </SubscriptionProvider>
        );
      }
      return (
        <SubscriptionProvider>
          <PageTransition>{children}</PageTransition>
        </SubscriptionProvider>
      );

    case 'app_ready':
      if (isShelllessRoute) {
        if (isFirstContactRoute) {
          return (
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          );
        }
        return (
          <SubscriptionProvider>
            <PageTransition>{children}</PageTransition>
          </SubscriptionProvider>
        );
      }

      return (
        <SubscriptionProvider>
          <AppShell>
            <PageTransition>{children}</PageTransition>
            {process.env.NODE_ENV === 'development' && <A11yAudit />}
          </AppShell>
        </SubscriptionProvider>
      );

    case 'error':
      return (
        <ErrorScreen
          message="Try again to reopen the app."
          detail={process.env.NODE_ENV === 'development' ? state.message : undefined}
          onRetry={handleRetry}
        />
      );

    default:
      return (
        <ErrorScreen
          message="Try again to reopen the app."
          detail={process.env.NODE_ENV === 'development' ? 'An unexpected app state occurred.' : undefined}
          onRetry={handleRetry}
        />
      );
  }
}
