import { recordOperationalBreadcrumb } from '@/services/monitoring/telemetry';

let hasHiddenNativeSplash = false;
let pendingHide: Promise<void> | null = null;
let fallbackTimerId: number | null = null;

const SPLASH_HIDE_TIMEOUT_MS = 1200;

async function waitForFirstPaint(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timeoutId: number | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(label));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  }
}

export async function hideSplashSafely(reason = 'unknown'): Promise<void> {
  if (hasHiddenNativeSplash) {
    return;
  }

  if (pendingHide) {
    return pendingHide;
  }

  pendingHide = (async () => {
    recordOperationalBreadcrumb('startup.splash_hide_requested', {
      source: 'splash_service',
      step: reason,
      result: 'pending',
    });

    try {
      if (typeof window === 'undefined') {
        hasHiddenNativeSplash = true;
        return;
      }

      if (!('Capacitor' in window)) {
        hasHiddenNativeSplash = true;
        recordOperationalBreadcrumb('startup.splash_hide_skipped', {
          source: 'splash_service',
          step: reason,
          result: 'not_native',
        });
        return;
      }

      await waitForFirstPaint();
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await withTimeout(
        SplashScreen.hide({ fadeOutDuration: 220 }),
        SPLASH_HIDE_TIMEOUT_MS,
        'splash_hide_timeout'
      );
      hasHiddenNativeSplash = true;
      recordOperationalBreadcrumb('startup.splash_hide_success', {
        source: 'splash_service',
        step: reason,
        result: 'success',
      });
    } catch {
      recordOperationalBreadcrumb('startup.splash_hide_failed', {
        source: 'splash_service',
        step: reason,
        result: 'failed',
      });
    } finally {
      pendingHide = null;
    }
  })();

  return pendingHide;
}

export function scheduleSplashHideFallback(delayMs = 2000): void {
  if (typeof window === 'undefined' || hasHiddenNativeSplash) {
    return;
  }

  if (fallbackTimerId !== null) {
    window.clearTimeout(fallbackTimerId);
  }

  fallbackTimerId = window.setTimeout(() => {
    fallbackTimerId = null;
    void hideSplashSafely('bootstrap_fallback');
  }, delayMs);
}

export function syncNativeSplashScreen(appStatus: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  void hideSplashSafely(`state:${appStatus}`);
}
