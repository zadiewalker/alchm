'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  connectionSpeed?: string;
  isCrisisPeformance: boolean;
}

interface MobileCrisisPerformanceMonitorProps {
  onPerformanceIssue?: (metrics: PerformanceMetrics) => void;
  enableAlerts?: boolean;
}

export default function MobileCrisisPerformanceMonitor({
  onPerformanceIssue,
  enableAlerts = true
}: MobileCrisisPerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const metricsRef = useRef<PerformanceMetrics | null>(null);

  useEffect(() => {
    const measurePerformance = () => {
      try {
        // Core Web Vitals - Critical for crisis accessibility
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paintEntries = performance.getEntriesByType('paint');
        
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0;
        
        // Calculate key metrics
        const pageLoadTime = navigation.loadEventEnd - navigation.navigationStart;
        const timeToFirstByte = navigation.responseStart - navigation.navigationStart;
        
        // Memory usage (if available)
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : undefined;
        
        // Connection speed detection
        const connection = (navigator as any).connection;
        const connectionSpeed = connection?.effectiveType || 'unknown';
        
        const currentMetrics: PerformanceMetrics = {
          pageLoadTime: Math.round(pageLoadTime),
          timeToFirstByte: Math.round(timeToFirstByte),
          firstContentfulPaint: Math.round(fcp),
          largestContentfulPaint: Math.round(lcp),
          cumulativeLayoutShift: 0, // Would need layout shift observer
          firstInputDelay: 0, // Would need FID observer
          memoryUsage: memoryUsage ? Math.round(memoryUsage) : undefined,
          connectionSpeed,
          isCrisisPeformance: isPerformanceCritical(pageLoadTime, fcp, lcp, connectionSpeed)
        };
        
        setMetrics(currentMetrics);
        metricsRef.current = currentMetrics;
        
        // Alert for poor performance during crisis situations
        if (currentMetrics.isCrisisPeformance && enableAlerts) {
          setShowAlert(true);
          onPerformanceIssue?.(currentMetrics);
          
          // Auto-hide alert after 10 seconds
          setTimeout(() => setShowAlert(false), 10000);
        }
        
      } catch (error) {
        console.warn('Performance monitoring error:', error);
      }
    };

    // Measure performance when page is loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Layout Shift Observer for CLS
    if ('LayoutShiftObserver' in window) {
      let clsValue = 0;
      const observer = new (window as any).LayoutShiftObserver((list: any) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        
        if (metricsRef.current) {
          metricsRef.current.cumulativeLayoutShift = clsValue;
          setMetrics({ ...metricsRef.current });
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      
      return () => {
        observer.disconnect();
        window.removeEventListener('load', measurePerformance);
      };
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, [onPerformanceIssue, enableAlerts]);

  // Determine if performance is critical for crisis situations
  const isPerformanceCritical = (
    loadTime: number, 
    fcp: number, 
    lcp: number, 
    connectionSpeed: string
  ): boolean => {
    // Crisis performance thresholds (stricter than normal)
    const CRISIS_THRESHOLDS = {
      pageLoadTime: 3000, // 3 seconds max
      firstContentfulPaint: 1500, // 1.5 seconds max
      largestContentfulPaint: 2500, // 2.5 seconds max
    };

    return (
      loadTime > CRISIS_THRESHOLDS.pageLoadTime ||
      fcp > CRISIS_THRESHOLDS.firstContentfulPaint ||
      lcp > CRISIS_THRESHOLDS.largestContentfulPaint ||
      connectionSpeed === 'slow-2g'
    );
  };

  if (!showAlert || !metrics?.isCrisisPeformance) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-sm">
      <div 
        className="bg-orange-500/90 backdrop-blur-md border border-orange-400/30 rounded-2xl p-4 shadow-lg"
        style={{
          animation: 'crisis-panel-enter 0.3s ease forwards'
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm mb-1">
              Connection Optimization
            </h3>
            <p className="text-orange-100 text-xs mb-3 leading-relaxed">
              We're optimizing for your connection. Crisis support remains available.
            </p>
            
            {/* Performance stats for debugging */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-orange-600/30 rounded p-2">
                <div className="text-orange-100">Load Time</div>
                <div className="text-white font-mono">{metrics.pageLoadTime}ms</div>
              </div>
              <div className="bg-orange-600/30 rounded p-2">
                <div className="text-orange-100">Connection</div>
                <div className="text-white font-mono">{metrics.connectionSpeed}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg touch-safe transition-colors"
                style={{ 
                  minHeight: '32px',
                  touchAction: 'manipulation'
                }}
              >
                Retry
              </button>
              <button
                onClick={() => setShowAlert(false)}
                className="px-3 py-1.5 bg-orange-600/30 hover:bg-orange-600/50 text-white text-xs rounded-lg touch-safe transition-colors"
                style={{ 
                  minHeight: '32px',
                  touchAction: 'manipulation'
                }}
              >
                Continue
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setShowAlert(false)}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-600/30 hover:bg-orange-600/50 flex items-center justify-center text-white text-xs touch-safe"
            style={{ touchAction: 'manipulation' }}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for accessing performance metrics
export function useMobilePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  
  useEffect(() => {
    const measureMetrics = () => {
      // Simplified metrics for hook usage
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.navigationStart;
        const connection = (navigator as any).connection;
        
        setMetrics({
          pageLoadTime: Math.round(loadTime),
          timeToFirstByte: Math.round(navigation.responseStart - navigation.navigationStart),
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
          connectionSpeed: connection?.effectiveType || 'unknown',
          isCrisisPeformance: loadTime > 3000
        });
      }
    };
    
    if (document.readyState === 'complete') {
      measureMetrics();
    } else {
      window.addEventListener('load', measureMetrics);
    }
    
    return () => window.removeEventListener('load', measureMetrics);
  }, []);
  
  return metrics;
}