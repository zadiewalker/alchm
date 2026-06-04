'use client';

import { useCallback, useState } from 'react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';

export default function SplashPage() {
  const { navigate } = useSafeNavigation(1200);
  const { isFirstTimeUser } = useOnboardingStatus();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateToDashboard = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    const destination = isFirstTimeUser() ? '/onboarding/' : '/dashboard/';
    navigate(destination, { source: 'splash-cta' });
  }, [isNavigating, navigate]);

  return (
    <div className="alchm-poster-home">
      <div className="alchm-poster-geometry" aria-hidden="true" />

      <div className="alchm-home-niche">
        <div className="alchm-home-mark">
          <svg
            viewBox="0 0 64 80"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-[72px]"
            aria-label="Khepera scarab"
          >
            <circle cx="32" cy="6" r="5.5" fill="#E5C97D" />
            <path d="M26,22 Q26,13 32,12 Q38,13 38,22 Z" fill="#F2D99D" />
            <path d="M28,15 Q24,8 22,6" stroke="#F2D99D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M36,15 Q40,8 42,6" stroke="#F2D99D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <ellipse cx="12" cy="36" rx="10" ry="9" fill="#F2D99D" opacity="0.92" />
            <ellipse cx="52" cy="36" rx="10" ry="9" fill="#F2D99D" opacity="0.92" />
            <ellipse cx="32" cy="44" rx="14" ry="24" fill="#F2D99D" />
            <path d="M20,33 Q32,30 44,33" stroke="#E5C97D" strokeWidth="0.8" fill="none" />
            <path d="M19,40 Q32,37 45,40" stroke="#E5C97D" strokeWidth="0.8" fill="none" />
            <path d="M20,47 Q32,44 44,47" stroke="#E5C97D" strokeWidth="0.8" fill="none" />
            <path d="M22,54 Q32,51 42,54" stroke="#E5C97D" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        <h1 className="alchm-home-title">
          ALCHM
        </h1>

        <p className="alchm-home-copy">
          A private place to write<br />
          where nothing disappears.
        </p>

        <p className="alchm-home-ritual">
          Write.<br />
          Leave.<br />
          Return.
        </p>

        <p className="alchm-home-assurance">
          No streaks. No goals. No pressure.
        </p>

        <button
          type="button"
          onClick={navigateToDashboard}
          disabled={isNavigating}
          className="btn-primary alchm-home-action"
          aria-label="Enter ALCHM"
        >
          {isNavigating ? 'Opening the chamber' : 'Enter'}
        </button>
      </div>

      <div className="alchm-home-footer">
        <p>
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}
