'use client';

import { useCallback, useState } from 'react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { isFirstTimeUser } from '@/lib/onboarding';
import { DESIGN } from '@/lib/design';

export default function SplashPage() {
  const { navigate } = useSafeNavigation(1200);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToDashboard = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    const destination = isFirstTimeUser() ? '/onboarding/' : '/dashboard/';
    navigate(destination, { source: 'splash-cta' });
  }, [isNavigating, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-8 relative"
      style={{
        background: 'var(--color-bg-app)',
        color: DESIGN.colors.textPrimary,
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.15)_0%,_transparent_50%)]" />

      <div className="flex flex-col items-center -mt-16">
        <div className="mb-8">
          <svg
            viewBox="0 0 64 80"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-[72px]"
            aria-label="Khepera scarab"
          >
            <circle cx="32" cy="6" r="5.5" fill="var(--color-sage-500)" />
            <path d="M26,22 Q26,13 32,12 Q38,13 38,22 Z" fill="var(--surface-elevated)" />
            <path d="M28,15 Q24,8 22,6" stroke="var(--color-sage-500)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M36,15 Q40,8 42,6" stroke="var(--color-sage-500)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <ellipse cx="12" cy="36" rx="10" ry="9" fill="var(--surface-elevated)" opacity="0.92" />
            <ellipse cx="52" cy="36" rx="10" ry="9" fill="var(--surface-elevated)" opacity="0.92" />
            <ellipse cx="32" cy="44" rx="14" ry="24" fill="var(--surface-elevated)" />
            <path d="M20,33 Q32,30 44,33" stroke="var(--color-sage-500)" strokeWidth="0.8" fill="none" />
            <path d="M19,40 Q32,37 45,40" stroke="var(--color-sage-500)" strokeWidth="0.8" fill="none" />
            <path d="M20,47 Q32,44 44,47" stroke="var(--color-sage-500)" strokeWidth="0.8" fill="none" />
            <path d="M22,54 Q32,51 42,54" stroke="var(--color-sage-500)" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        <h1
          className="mt-6 text-[42px] font-light mb-4"
          style={{ color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.serif, letterSpacing: 0 }}
        >
          ALCHM
        </h1>

        <p className="mt-4 text-center text-[18px] font-light leading-relaxed max-w-[280px]" style={{ color: DESIGN.colors.textSecondary }}>
          A private space for quiet reflection
        </p>

        <div className="px-8 mt-12 w-full">
          <button
            type="button"
            onClick={navigateToDashboard}
            disabled={isNavigating}
            className="flex items-center justify-center w-full py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Open ALCHM"
            style={{
              borderRadius: DESIGN.radius.md,
              border: DESIGN.colors.border,
              background: DESIGN.colors.bgElevated,
              boxShadow: DESIGN.shadows.card,
            }}
          >
            <span
              style={{
                color: DESIGN.colors.textPrimary,
                textTransform: 'none',
                letterSpacing: 0,
                fontSize: '16px',
                fontWeight: 400,
                whiteSpace: 'nowrap',
              }}
            >
              {isNavigating ? 'Opening...' : 'Open ALCHM'}
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0">
        <p className="text-xs text-center" style={{ color: DESIGN.colors.textMuted, letterSpacing: 0 }}>
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}
