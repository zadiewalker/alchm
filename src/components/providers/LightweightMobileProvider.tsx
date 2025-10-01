'use client';

import { useEffect } from 'react';

interface LightweightMobileProviderProps {
  children: React.ReactNode;
}

export default function LightweightMobileProvider({ children }: LightweightMobileProviderProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only essential mobile optimizations - no heavy dependencies
    const applyCriticalStyles = () => {
      const SAGE_PRIMARY = '#a4b792';
      const SAGE_SECONDARY = '#8fa37c';
      const WHITE_TEXT = '#fefcfb';
      
      // Apply sage colors if needed
      if (document.body) {
        document.body.style.setProperty('--sage-primary', SAGE_PRIMARY);
        document.body.style.setProperty('--sage-secondary', SAGE_SECONDARY);
        document.body.style.setProperty('--sanctuary-white', WHITE_TEXT);
      }
      
      // Apply basic accessibility preferences
      try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');

        if (prefersReducedMotion.matches) {
          document.body.classList.add('prefers-reduced-motion');
        }
        if (prefersHighContrast.matches) {
          document.body.classList.add('prefers-high-contrast');
        }
      } catch (error) {
        // Fail silently
      }
    };

    // Apply styles once, without aggressive loops
    applyCriticalStyles();
  }, []);

  return <>{children}</>;
}