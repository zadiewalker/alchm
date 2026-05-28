'use client';

import { useEffect, useRef, useState } from 'react';
import { useSplashScreenDismissal } from '@/hooks/useSplashScreenDismissal';

export function SplashScreenManager() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useSplashScreenDismissal(isReady);

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

  return null;
}
