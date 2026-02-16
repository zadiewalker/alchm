'use client';

import { useEffect, useRef, useState } from 'react';

export function SplashScreenManager() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const hideAttempted = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsHydrated(true);
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
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          const { SplashScreen } = await import('@capacitor/splash-screen');
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
          try {
            await SplashScreen.hide({ 
              fadeOutDuration: 500
            });
          } catch (e) {
            console.warn('🌅 SplashScreen.hide() failed (non-critical):', e);
          }
        }
      } catch (error) {
        console.error('🌅 SplashScreenManager: Critical error:', error);
      }
    };

    hideSplashScreen();
  }, [isReady]);

  return null;
}
