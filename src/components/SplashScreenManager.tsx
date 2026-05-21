'use client';

import { useEffect, useRef, useState } from 'react';

export function SplashScreenManager() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const hideAttempted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    void import('@/services/monitoring/telemetry')
      .then(({ recordOperationalEvent }) => {
        recordOperationalEvent('app_startup_shell_visible', {
          state: 'js_hydrated',
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    let checks = 0;
    const checkReadyState = () => {
      checks += 1;
      const isDocumentReady = document.readyState === 'complete';
      const hasDomContent = document.body.children.length > 0;
      
      if ((isDocumentReady && hasDomContent) || checks > 40) {
        setIsReady(true);
        void import('@/services/monitoring/telemetry')
          .then(({ recordOperationalEvent }) => {
            recordOperationalEvent(checks > 40 ? 'app_startup_bootstrap_timeout' : 'app_startup_ready', {
              state: checks > 40 ? 'document_ready_timeout' : 'document_ready',
              timeoutMs: checks > 40 ? 4000 : undefined,
            });
          })
          .catch(() => {});
      } else {
        timeoutRef.current = setTimeout(checkReadyState, 100);
      }
    };

    checkReadyState();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHydrated]);

  useEffect(() => {
    if (!isReady || hideAttempted.current) return;

    hideAttempted.current = true;

    const hideSplashScreen = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
          const { hideNativeSplashScreen } = await import('@/services/platform/splashScreenService');
          await hideNativeSplashScreen(500);
          const { recordOperationalEvent } = await import('@/services/monitoring/telemetry');
          recordOperationalEvent('app_startup_ready', {
            state: 'native_splash_dismissed',
          });
        } catch (e) {
          console.warn('🌅 SplashScreen.hide() failed (non-critical):', e);
          const { recordOperationalException } = await import('@/services/monitoring/telemetry');
          recordOperationalException('ui_exception', e, {
            state: 'native_splash_dismiss_failed',
          });
        }
      } catch (error) {
        console.error('🌅 SplashScreenManager: Critical error:', error);
      }
    };

    hideSplashScreen();
  }, [isReady]);

  return null;
}
