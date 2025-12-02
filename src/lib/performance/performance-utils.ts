/**
 * ALCHM Performance Utilities
 * 
 * React hooks and utility functions for performance monitoring
 * and optimization in components.
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { getPerformanceMonitor, type PerformanceAlert } from '../monitoring/real-time-performance-monitor';
import { getCrisisSafeguards } from './crisis-performance-safeguards';
import { getRUM } from './real-user-monitoring';
import { getMobileOptimizer } from './mobile-performance-optimizer';

// Performance Context
interface PerformanceContextValue {
  performanceGrade: string;
  isEmergencyMode: boolean;
  recentAlerts: PerformanceAlert[];
  healthStatus: any;
  triggerEmergencyMode: () => void;
  clearEmergencyMode: () => void;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export interface PerformanceProviderProps {
  children: ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [performanceGrade, setPerformanceGrade] = useState('A');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<PerformanceAlert[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const updateMetrics = useCallback(() => {
    const performanceMonitor = getPerformanceMonitor();
    const crisisSafeguards = getCrisisSafeguards();

    setPerformanceGrade(performanceMonitor.getCurrentPerformanceGrade());
    setIsEmergencyMode(crisisSafeguards.isInEmergencyMode());
    setRecentAlerts(performanceMonitor.getRecentAlerts(300000)); // Last 5 minutes
  }, []);

  const triggerEmergencyMode = useCallback(() => {
    const mobileOptimizer = getMobileOptimizer();
    mobileOptimizer.enableEmergencyMode();
    updateMetrics();
  }, [updateMetrics]);

  const clearEmergencyMode = useCallback(() => {
    const crisisSafeguards = getCrisisSafeguards();
    const mobileOptimizer = getMobileOptimizer();
    
    crisisSafeguards.exitEmergencyMode();
    mobileOptimizer.disableEmergencyMode();
    updateMetrics();
  }, [updateMetrics]);

  useEffect(() => {
    // Initial update
    updateMetrics();

    // Set up periodic updates
    const interval = setInterval(updateMetrics, 30000); // Every 30 seconds

    // Listen for performance alerts
    const performanceMonitor = getPerformanceMonitor();
    const unsubscribe = performanceMonitor.onAlert(() => {
      updateMetrics();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [updateMetrics]);

  const value: PerformanceContextValue = {
    performanceGrade,
    isEmergencyMode,
    recentAlerts,
    healthStatus,
    triggerEmergencyMode,
    clearEmergencyMode
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformanceContext must be used within a PerformanceProvider');
  }
  return context;
}

/**
 * Hook to monitor performance metrics
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const performanceMonitor = getPerformanceMonitor();
        const recentMetrics = performanceMonitor.getRecentMetrics(3600000); // Last hour
        setMetrics(recentMetrics);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();

    // Update every minute
    const interval = setInterval(loadMetrics, 60000);

    return () => clearInterval(interval);
  }, []);

  return { metrics, isLoading, error };
}

/**
 * Hook to monitor performance alerts
 */
export function usePerformanceAlerts(timeRange: number = 3600000) {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [newAlertCount, setNewAlertCount] = useState(0);

  useEffect(() => {
    const performanceMonitor = getPerformanceMonitor();
    
    const updateAlerts = () => {
      const recentAlerts = performanceMonitor.getRecentAlerts(timeRange);
      const previousCount = alerts.length;
      
      setAlerts(recentAlerts);
      
      if (recentAlerts.length > previousCount) {
        setNewAlertCount(prev => prev + (recentAlerts.length - previousCount));
      }
    };

    // Initial load
    updateAlerts();

    // Listen for new alerts
    const unsubscribe = performanceMonitor.onAlert(() => {
      updateAlerts();
    });

    return unsubscribe;
  }, [timeRange]);

  const clearNewAlerts = useCallback(() => {
    setNewAlertCount(0);
  }, []);

  return { 
    alerts, 
    newAlertCount, 
    clearNewAlerts,
    criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY'),
    crisisAlerts: alerts.filter(a => a.isCrisisContext)
  };
}

/**
 * Hook for crisis-safe component loading
 */
export function useCrisisSafeLoading<T>(
  loadComponent: () => Promise<T>,
  fallback: T,
  isCrisisComponent: boolean = false
) {
  const [component, setComponent] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const startTime = performance.now();
        const loadedComponent = await loadComponent();
        const loadTime = performance.now() - startTime;
        
        // Track loading performance
        const rum = getRUM();
        rum.trackCustomEvent('component_load', {
          loadTime,
          isCrisisComponent,
          success: true
        });
        
        setComponent(loadedComponent);
        setError(null);
      } catch (err) {
        console.error('Crisis-safe component loading failed:', err);
        setError(err instanceof Error ? err : new Error('Component loading failed'));
        
        // Track loading failure
        const rum = getRUM();
        rum.trackCustomEvent('component_load', {
          isCrisisComponent,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        
        // Keep fallback component for crisis components
        if (isCrisisComponent) {
          setComponent(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadComponent, fallback, isCrisisComponent]);

  return { component, isLoading, error };
}

/**
 * Hook for mobile performance optimization
 */
export function useMobilePerformance() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const mobileOptimizer = getMobileOptimizer();
    
    setDeviceInfo(mobileOptimizer.getDeviceInfo());
    setIsOptimized(mobileOptimizer.isOptimizedForMobile());
    setMetrics(mobileOptimizer.getPerformanceMetrics());

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(mobileOptimizer.getPerformanceMetrics());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const enableEmergencyMode = useCallback(() => {
    const mobileOptimizer = getMobileOptimizer();
    mobileOptimizer.enableEmergencyMode();
    setMetrics(mobileOptimizer.getPerformanceMetrics());
  }, []);

  const disableEmergencyMode = useCallback(() => {
    const mobileOptimizer = getMobileOptimizer();
    mobileOptimizer.disableEmergencyMode();
    setMetrics(mobileOptimizer.getPerformanceMetrics());
  }, []);

  return {
    deviceInfo,
    isOptimized,
    metrics,
    enableEmergencyMode,
    disableEmergencyMode,
    isMobile: deviceInfo?.type === 'smartphone' || deviceInfo?.type === 'tablet',
    isLowEndDevice: deviceInfo?.isLowEndDevice || false
  };
}

/**
 * Performance measurement decorator for functions
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string,
  isCritical: boolean = false
): T {
  return ((...args: any[]) => {
    const startTime = performance.now();
    
    try {
      const result = fn(...args);
      
      // Handle both sync and async functions
      if (result && typeof result.then === 'function') {
        return result
          .then((value: any) => {
            const endTime = performance.now();
            recordPerformanceMeasurement(name, endTime - startTime, isCritical);
            return value;
          })
          .catch((error: any) => {
            const endTime = performance.now();
            recordPerformanceMeasurement(name, endTime - startTime, isCritical, error);
            throw error;
          });
      } else {
        const endTime = performance.now();
        recordPerformanceMeasurement(name, endTime - startTime, isCritical);
        return result;
      }
    } catch (error) {
      const endTime = performance.now();
      recordPerformanceMeasurement(name, endTime - startTime, isCritical, error);
      throw error;
    }
  }) as T;
}

function recordPerformanceMeasurement(
  name: string,
  duration: number,
  isCritical: boolean,
  error?: any
) {
  const performanceMonitor = getPerformanceMonitor();
  
  // Record the measurement
  performanceMonitor.measureCustomMetric(name, duration, isCritical);
  
  // Track in RUM
  const rum = getRUM();
  rum.trackCustomEvent('function_performance', {
    functionName: name,
    duration,
    isCritical,
    success: !error,
    error: error ? error.message : undefined
  });
}

/**
 * Utility function to initialize performance system
 */
export function initializePerformanceSystem(): void {
  if (typeof window === 'undefined') return;

  // Initialize all performance systems
  getPerformanceMonitor();
  getCrisisSafeguards();
  getRUM();
  getMobileOptimizer();

  console.log('[PERFORMANCE UTILS] Performance system initialized');
}

/**
 * Create performance provider with default configuration
 */
export function createPerformanceProvider() {
  return PerformanceProvider;
}

/**
 * Utility to check if current page is crisis-related
 */
export function isCrisisPage(): boolean {
  if (typeof window === 'undefined') return false;
  
  const url = window.location.href.toLowerCase();
  return url.includes('crisis') || 
         url.includes('emergency') || 
         url.includes('support');
}

/**
 * Utility to track crisis interactions
 */
export function trackCrisisInteraction(action: string, element?: HTMLElement): void {
  const rum = getRUM();
  
  rum.trackCustomEvent('crisis_interaction', {
    action,
    elementType: element?.tagName,
    elementId: element?.id,
    elementClass: element?.className,
    timestamp: Date.now(),
    url: window.location.href
  });
}

/**
 * Utility to measure component render performance
 */
export function useRenderPerformance(componentName: string) {
  const [renderTime, setRenderTime] = useState<number>(0);
  const [renderCount, setRenderCount] = useState<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    setRenderCount(prev => prev + 1);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      setRenderTime(duration);
      
      // Track render performance
      const rum = getRUM();
      rum.trackCustomEvent('component_render', {
        componentName,
        renderTime: duration,
        renderCount
      });
    };
  });

  return { renderTime, renderCount };
}

/**
 * Utility for performance-aware image loading
 */
export function usePerformanceAwareImageLoading(
  src: string,
  options: { isCritical?: boolean; isAboveTheFold?: boolean } = {}
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageOptimizer = await import('./image-optimization').then(m => m.getImageOptimizer());
        
        // Optimize image source based on device and network conditions
        const optimized = imageOptimizer.optimizeImageSrc(src);
        setOptimizedSrc(optimized);
        
        // Load the image
        await imageOptimizer.loadImage(optimized);
        setIsLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Image loading failed'));
      }
    };

    if (options.isCritical || options.isAboveTheFold) {
      // Load immediately for critical images
      loadImage();
    } else {
      // Defer loading for non-critical images
      const timeout = setTimeout(loadImage, 100);
      return () => clearTimeout(timeout);
    }
  }, [src, options.isCritical, options.isAboveTheFold]);

  return { isLoaded, error, optimizedSrc };
}