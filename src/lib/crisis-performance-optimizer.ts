/**
 * Crisis Performance Optimizer
 * Emergency bundle size reduction for trauma-informed response times
 */

import { lazy } from 'react';

// Crisis performance thresholds
export const CRISIS_THRESHOLDS = {
  MAX_INITIAL_BUNDLE: 800 * 1024, // 800KB
  MAX_CRISIS_RESPONSE: 100, // 100ms
  MAX_FCP: 1200, // 1.2s
  MAX_LCP: 2000, // 2.0s
  MAX_TTI: 3000  // 3.0s
};

// Check if we're in crisis performance mode
export const isCrisisMode = () => {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  const isCrisis = urlParams.get('crisis') === 'true';
  const isSlowNetwork = navigator.connection?.effectiveType === '2g' || navigator.connection?.effectiveType === 'slow-2g';
  const isLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  
  return isCrisis || isSlowNetwork || isLowMemory;
};

// Crisis-optimized component loader
export const loadCrisisComponent = <T extends React.ComponentType<any>>(
  normalImport: () => Promise<{ default: T }>,
  crisisImport: () => Promise<{ default: T }>
) => {
  return lazy(() => {
    if (isCrisisMode()) {
      return crisisImport();
    }
    return normalImport();
  });
};

// Emergency-only Firebase loader
export const loadFirebaseForCrisis = async () => {
  if (isCrisisMode()) {
    // Load minimal Firebase setup
    const { initializeApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');
    
    return { initializeApp, getAuth };
  } else {
    // Load full Firebase
    return import('@/lib/firebase');
  }
};

// Bundle size monitor
export const monitorBundleSize = () => {
  if (typeof window === 'undefined') return;
  
  const checkBundleSize = () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        // Estimate size based on script loading time
        const loadTime = performance.getEntriesByName(src)[0]?.duration;
        if (loadTime) {
          totalSize += loadTime * 100; // Rough estimate
        }
      }
    });
    
    if (totalSize > CRISIS_THRESHOLDS.MAX_INITIAL_BUNDLE) {
      console.warn(`[Crisis Performance] Bundle size estimated at ${Math.round(totalSize / 1024)}KB - exceeds ${Math.round(CRISIS_THRESHOLDS.MAX_INITIAL_BUNDLE / 1024)}KB crisis threshold`);
      
      // Trigger crisis mode if not already active
      if (!isCrisisMode()) {
        const url = new URL(window.location.href);
        url.searchParams.set('crisis', 'true');
        window.location.href = url.toString();
      }
    }
  };
  
  // Check after initial load
  if (document.readyState === 'complete') {
    checkBundleSize();
  } else {
    window.addEventListener('load', checkBundleSize);
  }
};

// Crisis-safe component wrapper
export const withCrisisOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<P>
) => {
  return (props: P) => {
    if (isCrisisMode() && fallback) {
      return <fallback {...props} />;
    }
    return <Component {...props} />;
  };
};