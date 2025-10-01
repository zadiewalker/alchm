'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * ALCHM Performance Monitor - Crisis User Priority
 * 
 * Real-time monitoring of Core Web Vitals with immediate alerts
 * for performance regressions that could impact users in crisis.
 * 
 * Features:
 * - Real User Monitoring (RUM)
 * - Crisis resource load time tracking
 * - Performance budget enforcement
 * - Automatic degraded mode activation
 */

interface PerformanceMetrics {
  fcp: number;           // First Contentful Paint
  lcp: number;           // Largest Contentful Paint
  fid: number;           // First Input Delay
  cls: number;           // Cumulative Layout Shift
  ttfb: number;          // Time to First Byte
  crisisLoadTime: number; // Crisis resource load time
  bundleSize: number;    // JavaScript bundle size
  timestamp: number;
}

interface PerformanceThresholds {
  fcp: { good: number; poor: number };
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  crisisLoadTime: { good: number; poor: number };
}

// Crisis-focused performance thresholds
const CRISIS_THRESHOLDS: PerformanceThresholds = {
  fcp: { good: 1200, poor: 2400 },    // Crisis users need faster FCP
  lcp: { good: 2000, poor: 4000 },    // Critical for crisis resource access
  fid: { good: 50, poor: 200 },       // Emergency buttons must be responsive
  cls: { good: 0.05, poor: 0.15 },    // Visual stability during crisis
  crisisLoadTime: { good: 1000, poor: 3000 } // Crisis resources MUST load quickly
};

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isPerformanceDegraded, setIsPerformanceDegraded] = useState(false);

  const measureCoreWebVitals = useCallback(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const newMetrics: Partial<PerformanceMetrics> = {};

      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              newMetrics.fcp = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            newMetrics.lcp = entry.startTime;
            break;
          case 'first-input':
            newMetrics.fid = entry.processingStart - entry.startTime;
            break;
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              newMetrics.cls = (newMetrics.cls || 0) + entry.value;
            }
            break;
          case 'navigation':
            newMetrics.ttfb = entry.responseStart - entry.requestStart;
            break;
        }
      });

      if (Object.keys(newMetrics).length > 0) {
        setMetrics(prev => ({
          ...prev,
          ...newMetrics,
          timestamp: Date.now()
        } as PerformanceMetrics));
      }
    });

    // Observe Core Web Vitals
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });

    return () => observer.disconnect();
  }, []);

  const measureCrisisResourcePerformance = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    
    try {
      // Test critical crisis resources
      const crisisEndpoints = ['/api/crisis-support', '/crisis', '/emergency'];
      const promises = crisisEndpoints.map(endpoint => 
        fetch(endpoint, { method: 'HEAD' }).catch(() => null)
      );

      await Promise.all(promises);
      const endTime = performance.now();
      const crisisLoadTime = endTime - startTime;

      setMetrics(prev => ({
        ...prev,
        crisisLoadTime,
        timestamp: Date.now()
      } as PerformanceMetrics));

      // Alert if crisis resources are slow
      if (crisisLoadTime > CRISIS_THRESHOLDS.crisisLoadTime.poor) {
        console.error('[ALCHM Performance] CRITICAL: Crisis resources loading slowly!', crisisLoadTime);
        
        // Report to monitoring service
        reportCrisisPerformanceIssue(crisisLoadTime);
      }
    } catch (error) {
      console.error('[ALCHM Performance] Crisis resource test failed:', error);
    }
  }, []);

  const checkPerformanceBudget = useCallback((metrics: PerformanceMetrics) => {
    const issues: string[] = [];

    // Check each metric against crisis thresholds
    if (metrics.fcp && metrics.fcp > CRISIS_THRESHOLDS.fcp.poor) {
      issues.push(`FCP too slow: ${metrics.fcp}ms (max: ${CRISIS_THRESHOLDS.fcp.poor}ms)`);
    }
    
    if (metrics.lcp && metrics.lcp > CRISIS_THRESHOLDS.lcp.poor) {
      issues.push(`LCP too slow: ${metrics.lcp}ms (max: ${CRISIS_THRESHOLDS.lcp.poor}ms)`);
    }
    
    if (metrics.fid && metrics.fid > CRISIS_THRESHOLDS.fid.poor) {
      issues.push(`FID too slow: ${metrics.fid}ms (max: ${CRISIS_THRESHOLDS.fid.poor}ms)`);
    }
    
    if (metrics.cls && metrics.cls > CRISIS_THRESHOLDS.cls.poor) {
      issues.push(`CLS too high: ${metrics.cls} (max: ${CRISIS_THRESHOLDS.cls.poor})`);
    }
    
    if (metrics.crisisLoadTime && metrics.crisisLoadTime > CRISIS_THRESHOLDS.crisisLoadTime.poor) {
      issues.push(`Crisis resources too slow: ${metrics.crisisLoadTime}ms (max: ${CRISIS_THRESHOLDS.crisisLoadTime.poor}ms)`);
    }

    const isDegraded = issues.length > 0;
    setIsPerformanceDegraded(isDegraded);

    if (isDegraded) {
      console.warn('[ALCHM Performance] Performance degraded:', issues);
      
      // Activate performance degraded mode
      activateDegradedMode(issues);
    }

    return issues;
  }, []);

  const reportCrisisPerformanceIssue = useCallback((loadTime: number) => {
    // Report to external monitoring (Firebase Performance, etc.)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PERFORMANCE_REPORT',
        isCrisis: true,
        loadTime,
        timestamp: Date.now()
      });
    }

    // Log to console for development
    console.error('[CRISIS PERFORMANCE ALERT]', {
      loadTime,
      threshold: CRISIS_THRESHOLDS.crisisLoadTime.poor,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType
    });
  }, []);

  const activateDegradedMode = useCallback((issues: string[]) => {
    // Activate performance degraded mode
    document.body.classList.add('performance-degraded');
    
    // Reduce animations
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    
    // Show performance notice to user
    const notice = document.createElement('div');
    notice.className = 'performance-notice';
    notice.innerHTML = `
      <div style="
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #f59e0b;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 9999;
        animation: fade-in 0.3s ease;
      ">
        Network issues detected. Crisis support remains available.
      </div>
    `;
    
    document.body.appendChild(notice);
    
    // Remove notice after 5 seconds
    setTimeout(() => {
      if (notice.parentNode) {
        notice.parentNode.removeChild(notice);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    // Initialize performance monitoring
    const cleanup = measureCoreWebVitals();
    
    // Measure crisis resource performance immediately
    measureCrisisResourcePerformance();
    
    // Re-check crisis resources every 30 seconds
    const crisisInterval = setInterval(measureCrisisResourcePerformance, 30000);
    
    return () => {
      cleanup?.();
      clearInterval(crisisInterval);
    };
  }, [measureCoreWebVitals, measureCrisisResourcePerformance]);

  useEffect(() => {
    if (metrics) {
      checkPerformanceBudget(metrics);
    }
  }, [metrics, checkPerformanceBudget]);

  // Development-only performance display
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
        <div><strong>ALCHM Performance Monitor</strong></div>
        {metrics && (
          <>
            <div>FCP: {metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A'}</div>
            <div>LCP: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}</div>
            <div>FID: {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}</div>
            <div>CLS: {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
            <div>Crisis Load: {metrics.crisisLoadTime ? `${Math.round(metrics.crisisLoadTime)}ms` : 'N/A'}</div>
            {isPerformanceDegraded && (
              <div style={{ color: '#f87171', fontWeight: 'bold' }}>⚠ DEGRADED</div>
            )}
          </>
        )}
      </div>
    );
  }

  // Production: No visual component, monitoring runs in background
  return null;
}