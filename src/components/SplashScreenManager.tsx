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
        console.log('🌅 App fully ready for splash hide');
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

    console.log('🌅 SplashScreenManager: Starting precise hide sequence');
    hideAttempted.current = true;

    const hideSplashScreen = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          console.log('🌅 SplashScreenManager: Capacitor detected, importing SplashScreen');
          const { SplashScreen } = await import('@capacitor/splash-screen');
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
          try {
            await SplashScreen.hide({ 
              fadeOutDuration: 500
            });
            console.log('🌅 Splash screen hidden - sanctuary ready');
          } catch (e) {
            console.warn('🌅 SplashScreen.hide() failed (non-critical):', e);
          }
        } else {
          console.log('🌅 SplashScreenManager: No Capacitor environment detected');
        }
      } catch (error) {
        console.error('🌅 SplashScreenManager: Critical error:', error);
      }
    };

    hideSplashScreen();
  }, [isReady]);

  return null;
}
