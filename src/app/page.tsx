'use client';

import { useEffect, useRef } from 'react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { isFirstTimeUser } from '@/lib/onboarding';

const STARTUP_DECISION_DELAY_MS = 900;
const STARTUP_HARD_TIMEOUT_MS = 2400;

function normalizePath(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

function resolveStartupDestination(): string {
  try {
    return isFirstTimeUser() ? '/onboarding/' : '/dashboard/';
  } catch {
    return '/onboarding/';
  }
}

export default function SplashPage() {
  const { navigate } = useSafeNavigation(900);
  const hasStartedNavigation = useRef(false);

  useEffect(() => {
    if (hasStartedNavigation.current) return;
    hasStartedNavigation.current = true;

    const destination = resolveStartupDestination();
    const normalizedDestination = normalizePath(destination);

    const navigationTimer = window.setTimeout(() => {
      navigate(destination, { source: 'splash-auto', replace: true, fallbackMs: 900 });
    }, STARTUP_DECISION_DELAY_MS);

    const hardTimeout = window.setTimeout(() => {
      const currentPath = normalizePath(window.location.pathname || '/');
      if (currentPath === '/' || currentPath !== normalizedDestination) {
        window.location.replace(normalizedDestination);
      }
    }, STARTUP_HARD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(navigationTimer);
      window.clearTimeout(hardTimeout);
    };
  }, [navigate]);

  return (
    <main className="launch-splash" aria-label="ALCHM is opening">
      <div className="launch-splash__center" aria-live="polite">
        <h1 className="launch-splash__wordmark">ALCHM</h1>
        <p className="launch-splash__subtitle">Protecting your writing…</p>
      </div>
    </main>
  );
}
