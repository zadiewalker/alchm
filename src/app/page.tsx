'use client';

import { useEffect, useRef } from 'react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { isFirstTimeUser } from '@/lib/onboarding';
import { DESIGN } from '@/lib/design';

export default function SplashPage() {
  const { navigate } = useSafeNavigation(1200);
  const hasStartedNavigation = useRef(false);

  useEffect(() => {
    if (hasStartedNavigation.current) return;
    hasStartedNavigation.current = true;

    const timer = window.setTimeout(() => {
      const destination = isFirstTimeUser() ? '/onboarding/' : '/dashboard/';
      navigate(destination, { source: 'splash-auto', replace: true });
    }, 650);

    return () => {
      window.clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 relative"
      style={{
        background: 'var(--color-bg-app)',
        color: DESIGN.colors.textPrimary,
        fontFamily: DESIGN.typography.sansSerif,
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />

      <div className="relative flex flex-col items-center" aria-live="polite">
        <h1
          className="text-[52px] font-light"
          style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontFamily: DESIGN.typography.serif,
            letterSpacing: 0,
            lineHeight: 1,
            margin: 0,
          }}
        >
          ALCHM
        </h1>

        <p
          className="mt-8 text-center text-[18px] font-light leading-relaxed max-w-[280px]"
          style={{ color: 'rgba(255, 255, 255, 0.84)' }}
        >
          Protecting your writing…
        </p>
      </div>
    </div>
  );
}
