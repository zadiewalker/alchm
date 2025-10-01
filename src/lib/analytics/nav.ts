"use client";

import { logEvent } from '@/lib/analytics';

export interface NavAnalyticsEvent {
  route: string;
  from?: string;
  to?: string;
  surface?: 'header' | 'mobile_tab' | 'breadcrumb' | 'cta_button' | 'card_link';
  timestamp?: number;
}

/**
 * Log navigation view
 */
export function trackNavView(route: string) {
  logEvent('nav_view', { route });
}

/**
 * Log navigation click
 */
export function trackNavClick({ from, to, surface }: Pick<NavAnalyticsEvent, 'from' | 'to' | 'surface'>) {
  logEvent('nav_click', {
    from: from || typeof window !== 'undefined' && window.location.pathname,
    to,
    surface: surface || 'unknown',
    timestamp: Date.now()
  });
}

/**
 * Track time-to-write metric
 */
export function trackTimeToWrite(startTime: number) {
  const ttw = Date.now() - startTime;
  logEvent('ttw_ms', { 
    duration: ttw,
    route: typeof window !== 'undefined' && window.location.pathname 
  });
}

/**
 * Track ritual flow completion
 */
export function trackRitualFlow(steps: string[], totalDuration: number) {
  logEvent('ritual_flow_complete', {
    steps,
    duration_ms: totalDuration,
    step_count: steps.length
  });
}

/**
 * Track dead-end pages (no CTA visible after 3s)
 */
export function trackDeadEnd(route: string) {
  logEvent('nav_dead_end', { route });
}

// Analytics link functionality removed - use trackNavClick directly with Link components

/**
 * Hook to track page loads and TTW
 */
export function useNavAnalytics() {
  const trackPageLoad = (route: string) => {
    trackNavView(route);
    
    // Set up dead-end tracking
    const timer = setTimeout(() => {
      // Check if primary CTA is visible
      const writeButton = typeof window !== 'undefined' && document.querySelector('[aria-label*="Start writing"], [href="/write"]');
      if (!writeButton) {
        trackDeadEnd(route);
      }
    }, 3000);

    return () => clearTimeout(timer);
  };

  const startTTWTracking = () => {
    return Date.now();
  };

  const completeTTWTracking = (startTime: number) => {
    trackTimeToWrite(startTime);
  };

  return {
    trackPageLoad,
    startTTWTracking,
    completeTTWTracking
  };
}