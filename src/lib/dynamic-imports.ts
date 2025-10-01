// src/lib/dynamic-imports.ts
// VENDOR OPTIMIZATION: Dynamic import wrappers for non-critical dependencies
// Reduces initial vendor bundle by loading heavy libraries asynchronously

// VENDOR OPTIMIZATION: Framer Motion - animation library (~150KB)
export async function loadFramerMotion() {
  const { motion, AnimatePresence, useAnimation } = await import('framer-motion');
  return { motion, AnimatePresence, useAnimation };
}

// VENDOR OPTIMIZATION: Google AI - generative AI library (~80KB)
export async function loadGoogleAI() {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  return { GoogleGenerativeAI };
}

// VENDOR OPTIMIZATION: Stripe - payment processing (~60KB)
export async function loadStripe() {
  const { loadStripe } = await import('@stripe/stripe-js');
  return { loadStripe };
}

// VENDOR OPTIMIZATION: Date utilities (if needed)
export async function loadDateUtils() {
  // Only load if date-fns or similar is added later
  // const { format, parseISO } = await import('date-fns');
  // return { format, parseISO };
  return {};
}

// VENDOR OPTIMIZATION: Chart libraries (for analytics, if added)
export async function loadChartLibrary() {
  // Future-proofing for analytics charts
  // const Chart = await import('chart.js');
  // return Chart;
  return null;
}

// VENDOR OPTIMIZATION: Firebase Firestore operations
export async function loadFirestoreOperations() {
  const operations = await import('firebase/firestore');
  return operations;
}

// VENDOR OPTIMIZATION: Firebase Auth operations
export async function loadAuthOperations() {
  const operations = await import('firebase/auth');
  return operations;
}

// VENDOR OPTIMIZATION: Analytics (if needed)
export async function loadAnalytics() {
  // Future-proofing for Google Analytics
  // const { gtag } = await import('gtag');
  // return { gtag };
  return null;
}

// VENDOR OPTIMIZATION: PWA utilities
export async function loadPWAUtils() {
  // Future-proofing for PWA functionality
  return {
    registerSW: async () => {
      if ('serviceWorker' in navigator) {
        return navigator.serviceWorker.register('/sw.js');
      }
    }
  };
}

// VENDOR OPTIMIZATION: Crisis resource preloader
export async function loadCrisisResources() {
  // Load crisis-specific resources dynamically
  try {
    const crisisModule = await import('../components/crisis/CrisisResourcePreloader');
    return crisisModule;
  } catch (error) {
    console.warn('Crisis resources not available:', error);
    return null;
  }
}

// VENDOR OPTIMIZATION: Form validation
export async function loadFormValidation() {
  const { z } = await import('zod');
  return { z };
}

// VENDOR OPTIMIZATION: UI components (future-proofing)
export async function loadUIComponents() {
  // Future-proofing for component libraries
  // const components = await import('@headlessui/react');
  // return components;
  return {};
}

// VENDOR OPTIMIZATION: Utility function for conditional loading
export function loadWhenNeeded<T>(
  loader: () => Promise<T>,
  condition: boolean = true
): Promise<T | null> {
  if (!condition) {
    return Promise.resolve(null);
  }
  return loader();
}

// VENDOR OPTIMIZATION: Lazy component wrapper
export function createLazyComponent<T extends React.ComponentType<any>>(
  loader: () => Promise<{ default: T }>
) {
  const { lazy } = require('react');
  return lazy(loader);
}

// VENDOR OPTIMIZATION: Bundle size monitoring
export async function reportBundleUsage(componentName: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📦 Lazy loaded: ${componentName}`);
  }
}

// VENDOR OPTIMIZATION: Crisis mode detection
export function isCrisisMode(): boolean {
  return process.env.CRISIS_MODE === 'true' || 
         typeof window !== 'undefined' && window.location.pathname.includes('/crisis');
}

// VENDOR OPTIMIZATION: Essential vs non-essential loading strategy
export const LoadingStrategy = {
  IMMEDIATE: 'immediate',    // Load in main bundle
  FAST: 'fast',             // Load after initial render
  LAZY: 'lazy',             // Load on user interaction
  BACKGROUND: 'background'   // Load in background when idle
} as const;

export type LoadingStrategy = typeof LoadingStrategy[keyof typeof LoadingStrategy];

// VENDOR OPTIMIZATION: Smart loading based on strategy
export async function loadWithStrategy<T>(
  loader: () => Promise<T>,
  strategy: LoadingStrategy = LoadingStrategy.LAZY
): Promise<T | null> {
  switch (strategy) {
    case LoadingStrategy.IMMEDIATE:
      return loader();
      
    case LoadingStrategy.FAST:
      // Load after a short delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return loader();
      
    case LoadingStrategy.LAZY:
      // Load on next tick
      await new Promise(resolve => setTimeout(resolve, 0));
      return loader();
      
    case LoadingStrategy.BACKGROUND:
      // Load when browser is idle
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        return new Promise(resolve => {
          window.requestIdleCallback(async () => {
            const result = await loader();
            resolve(result);
          });
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loader();
      }
      
    default:
      return loader();
  }
}