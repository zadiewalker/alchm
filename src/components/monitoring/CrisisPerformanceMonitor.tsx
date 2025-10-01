'use client';

/**
 * 🛡️ Crisis Performance Monitor Component
 * 
 * Real-time performance monitoring specifically designed for ALCHM's trauma-informed
 * platform. Monitors critical performance metrics that could impact users in crisis.
 * 
 * Key Features:
 * - Crisis button response time monitoring
 * - Core Web Vitals tracking with trauma-informed thresholds
 * - Memory leak detection for sustained usage
 * - AI response performance monitoring
 * - Mobile performance optimization tracking
 * - Automatic performance healing triggers
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Crisis-specific metrics
  crisisButtonResponseTime: number | null;
  emergencyNavigationTime: number | null;
  crisisResourceLoadTime: number | null;
  
  // AI Performance
  aiResponseTime: number | null;
  aiStreamingStartTime: number | null;
  
  // Memory metrics
  memoryUsage: number;
  memoryGrowthRate: number;
  
  // Mobile performance
  touchResponseTime: number | null;
  scrollPerformance: number | null;
}

interface PerformanceAlert {
  id: string;
  type: 'crisis_critical' | 'performance_degradation' | 'memory_leak' | 'ai_slowdown';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: Date;
  metric: string;
  value: number;
  threshold: number;
  userImpact: 'life_critical' | 'crisis_impact' | 'user_experience' | 'performance_impact';
}

interface CrisisPerformanceMonitorProps {
  enabled?: boolean;
  onAlert?: (alert: PerformanceAlert) => void;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  emergencyMode?: boolean;
  userId?: string;
}

// Crisis-critical performance thresholds
const CRISIS_THRESHOLDS = {
  // Core Web Vitals (stricter for crisis users)
  lcp: 1200,  // 1.2s for crisis scenarios
  fid: 50,    // 50ms for immediate response
  cls: 0.05,  // Very low layout shift
  fcp: 800,   // 0.8s first paint
  ttfb: 200,  // 200ms server response
  
  // Crisis-specific thresholds
  crisisButtonResponse: 100,     // 100ms max for crisis button
  emergencyNavigation: 200,      // 200ms max for emergency nav
  crisisResourceLoad: 1000,      // 1s max for crisis resources
  
  // AI thresholds
  aiResponseTime: 2000,          // 2s max for AI responses
  aiStreamingStart: 500,         // 500ms to start streaming
  
  // Memory thresholds
  memoryUsage: 52428800,         // 50MB sustained
  memoryGrowthRate: 10485760,    // 10MB/minute growth
  
  // Mobile thresholds
  touchResponse: 100,            // 100ms touch response
  scrollPerformance: 60          // 60fps scrolling
};

export default function CrisisPerformanceMonitor({
  enabled = true,
  onAlert,
  onMetricsUpdate,
  emergencyMode = false,
  userId
}: CrisisPerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    crisisButtonResponseTime: null,
    emergencyNavigationTime: null,
    crisisResourceLoadTime: null,
    aiResponseTime: null,
    aiStreamingStartTime: null,
    memoryUsage: 0,
    memoryGrowthRate: 0,
    touchResponseTime: null,
    scrollPerformance: null
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // Refs for performance tracking
  const performanceObserver = useRef<PerformanceObserver | null>(null);
  const memoryTracker = useRef<NodeJS.Timeout | null>(null);
  const initialMemory = useRef<number>(0);
  const lastMemoryCheck = useRef<Date>(new Date());

  // Initialize performance monitoring
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    setIsMonitoring(true);
    initializePerformanceMonitoring();

    return () => {
      cleanup();
      setIsMonitoring(false);
    };
  }, [enabled, emergencyMode]);

  const initializePerformanceMonitoring = useCallback(() => {
    // Initialize Core Web Vitals monitoring
    initializeCoreWebVitals();
    
    // Initialize memory monitoring
    initializeMemoryMonitoring();
    
    // Initialize crisis-specific monitoring
    initializeCrisisMonitoring();
    
    // Initialize mobile performance monitoring
    if (isMobileDevice()) {
      initializeMobileMonitoring();
    }
  }, []);

  const initializeCoreWebVitals = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    try {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        updateMetric('lcp', Math.round(lastEntry.startTime));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          updateMetric('fid', Math.round((entry as any).processingStart - entry.startTime));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        updateMetric('cls', Math.round(clsValue * 1000) / 1000);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FCP (First Contentful Paint) and TTFB
      const navigationObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // TTFB
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          updateMetric('ttfb', Math.round(ttfb));
          
          // Get FCP from paint timing
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
          if (fcpEntry) {
            updateMetric('fcp', Math.round(fcpEntry.startTime));
          }
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });

    } catch (error) {
      console.warn('Failed to initialize Core Web Vitals monitoring:', error);
    }
  }, []);

  const initializeMemoryMonitoring = useCallback(() => {
    if (!('memory' in performance)) return;

    const memory = (performance as any).memory;
    initialMemory.current = memory.usedJSHeapSize;
    lastMemoryCheck.current = new Date();

    memoryTracker.current = setInterval(() => {
      const currentMemory = memory.usedJSHeapSize;
      const now = new Date();
      const timeDiff = (now.getTime() - lastMemoryCheck.current.getTime()) / 1000 / 60; // minutes
      const memoryDiff = currentMemory - initialMemory.current;
      const growthRate = timeDiff > 0 ? memoryDiff / timeDiff : 0;

      updateMetric('memoryUsage', currentMemory);
      updateMetric('memoryGrowthRate', growthRate);

      lastMemoryCheck.current = now;
    }, 10000); // Check every 10 seconds
  }, []);

  const initializeCrisisMonitoring = useCallback(() => {
    // Monitor crisis button performance
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-crisis-button]') || 
          target.closest('.crisis-button') ||
          target.closest('#crisis-button')) {
        
        const startTime = performance.now();
        
        // Use requestAnimationFrame to measure response time
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime;
          updateMetric('crisisButtonResponseTime', Math.round(responseTime));
        });
      }
    });

    // Monitor emergency navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const wrapHistoryMethod = (method: Function) => {
      return function(this: History, ...args: any[]) {
        const startTime = performance.now();
        const result = method.apply(this, args);
        
        // Check if this is emergency navigation
        const url = args[2] || '';
        if (url.includes('crisis') || url.includes('emergency') || url.includes('safe')) {
          requestAnimationFrame(() => {
            const navigationTime = performance.now() - startTime;
            updateMetric('emergencyNavigationTime', Math.round(navigationTime));
          });
        }
        
        return result;
      };
    };

    history.pushState = wrapHistoryMethod(originalPushState);
    history.replaceState = wrapHistoryMethod(originalReplaceState);
  }, []);

  const initializeMobileMonitoring = useCallback(() => {
    if (!isMobileDevice()) return;

    // Touch response monitoring
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (touchStartTime > 0) {
        const responseTime = performance.now() - touchStartTime;
        updateMetric('touchResponseTime', Math.round(responseTime));
        touchStartTime = 0;
      }
    }, { passive: true });

    // Scroll performance monitoring
    let frameCount = 0;
    let lastFrameTime = performance.now();
    
    const measureScrollPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastFrameTime >= 1000) { // Every second
        const fps = frameCount * 1000 / (currentTime - lastFrameTime);
        updateMetric('scrollPerformance', Math.round(fps));
        
        frameCount = 0;
        lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureScrollPerformance);
    };

    let isScrolling = false;
    document.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(measureScrollPerformance);
        
        setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
    }, { passive: true });
  }, []);

  const updateMetric = useCallback((metricName: keyof PerformanceMetrics, value: number) => {
    setMetrics(prev => {
      const newMetrics = { ...prev, [metricName]: value };
      
      // Check for threshold violations
      checkThresholds(metricName, value);
      
      // Notify parent component
      if (onMetricsUpdate) {
        onMetricsUpdate(newMetrics);
      }
      
      return newMetrics;
    });
  }, [onMetricsUpdate]);

  const checkThresholds = useCallback((metricName: string, value: number) => {
    const threshold = CRISIS_THRESHOLDS[metricName as keyof typeof CRISIS_THRESHOLDS];
    if (!threshold || value <= threshold) return;

    // Create alert for threshold violation
    const alert: PerformanceAlert = {
      id: `${metricName}-${Date.now()}`,
      type: getCrisisAlertType(metricName),
      severity: getCrisisSeverity(metricName, value, threshold),
      message: getCrisisAlertMessage(metricName, value, threshold),
      timestamp: new Date(),
      metric: metricName,
      value,
      threshold,
      userImpact: getCrisisUserImpact(metricName)
    };

    // Add alert to state
    setAlerts(prev => [...prev.slice(-9), alert]); // Keep last 10 alerts

    // Notify parent component
    if (onAlert) {
      onAlert(alert);
    }

    // Log to Firebase for monitoring
    logPerformanceAlert(alert);

    // Trigger automatic healing in emergency mode
    if (emergencyMode && alert.severity === 'critical') {
      triggerEmergencyHealing(alert);
    }
  }, [onAlert, emergencyMode, userId]);

  const getCrisisAlertType = (metricName: string): PerformanceAlert['type'] => {
    if (metricName.includes('crisis') || metricName.includes('emergency')) {
      return 'crisis_critical';
    }
    if (metricName.includes('memory')) {
      return 'memory_leak';
    }
    if (metricName.includes('ai')) {
      return 'ai_slowdown';
    }
    return 'performance_degradation';
  };

  const getCrisisSeverity = (metricName: string, value: number, threshold: number): PerformanceAlert['severity'] => {
    const ratio = value / threshold;
    
    // Crisis-specific metrics always get higher severity
    if (metricName.includes('crisis') || metricName.includes('emergency')) {
      if (ratio > 3) return 'critical';
      if (ratio > 2) return 'high';
      return 'medium';
    }
    
    if (ratio > 3) return 'critical';
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  };

  const getCrisisAlertMessage = (metricName: string, value: number, threshold: number): string => {
    const messages = {
      crisisButtonResponseTime: `Crisis button response time ${value}ms exceeds ${threshold}ms threshold - users in crisis may experience delays`,
      emergencyNavigationTime: `Emergency navigation time ${value}ms exceeds ${threshold}ms threshold - crisis navigation compromised`,
      crisisResourceLoadTime: `Crisis resource loading time ${value}ms exceeds ${threshold}ms threshold - emergency resources delayed`,
      lcp: `Largest Contentful Paint ${value}ms exceeds ${threshold}ms - page loading too slow for crisis users`,
      fid: `First Input Delay ${value}ms exceeds ${threshold}ms - user interactions delayed in crisis scenarios`,
      cls: `Cumulative Layout Shift ${value} exceeds ${threshold} - page instability may confuse crisis users`,
      fcp: `First Contentful Paint ${value}ms exceeds ${threshold}ms - page appears too slowly for crisis users`,
      ttfb: `Time to First Byte ${value}ms exceeds ${threshold}ms - server response too slow for crisis scenarios`,
      aiResponseTime: `AI response time ${value}ms exceeds ${threshold}ms - Khepera responses delayed`,
      aiStreamingStartTime: `AI streaming start time ${value}ms exceeds ${threshold}ms - AI responses delayed`,
      memoryUsage: `Memory usage ${Math.round(value / 1024 / 1024)}MB exceeds ${Math.round(threshold / 1024 / 1024)}MB - potential memory issues`,
      memoryGrowthRate: `Memory growth rate ${Math.round(value / 1024 / 1024)}MB/min exceeds threshold - potential memory leak`,
      touchResponseTime: `Touch response time ${value}ms exceeds ${threshold}ms - mobile interactions delayed`,
      scrollPerformance: `Scroll performance ${value}fps below ${threshold}fps - mobile scrolling compromised`
    };

    return messages[metricName as keyof typeof messages] || `Performance metric ${metricName} violated threshold`;
  };

  const getCrisisUserImpact = (metricName: string): PerformanceAlert['userImpact'] => {
    if (metricName.includes('crisis') || metricName.includes('emergency')) {
      return 'life_critical';
    }
    if (metricName === 'fid' || metricName === 'crisisButtonResponseTime') {
      return 'crisis_impact';
    }
    return 'user_experience';
  };

  const logPerformanceAlert = async (alert: PerformanceAlert) => {
    try {
      await addDoc(collection(db, 'performance_alerts'), {
        ...alert,
        userId: userId || 'anonymous',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: serverTimestamp(),
        sessionId: getSessionId()
      });
    } catch (error) {
      console.warn('Failed to log performance alert:', error);
    }
  };

  const triggerEmergencyHealing = (alert: PerformanceAlert) => {
    // Trigger emergency performance healing based on alert type
    switch (alert.type) {
      case 'crisis_critical':
        // Force preload crisis resources
        preloadCrisisResources();
        break;
      case 'memory_leak':
        // Trigger garbage collection if available
        if ('gc' in window) {
          (window as any).gc();
        }
        break;
      case 'ai_slowdown':
        // Optimize AI request queue
        optimizeAIRequests();
        break;
      default:
        // General performance optimization
        optimizeGeneralPerformance();
    }
  };

  const preloadCrisisResources = () => {
    const crisisResources = [
      '/crisis-resources',
      '/emergency-safe',
      '/api/crisis-detection'
    ];

    crisisResources.forEach(resource => {
      if (resource.startsWith('/api/')) {
        // Preload API endpoints
        fetch(resource, { method: 'HEAD' }).catch(() => {});
      } else {
        // Preload pages
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      }
    });
  };

  const optimizeAIRequests = () => {
    // Clear AI request cache if available
    if ('caches' in window) {
      caches.delete('ai-responses').catch(() => {});
    }
    
    // Reduce AI request timeout
    window.dispatchEvent(new CustomEvent('optimize-ai-performance', {
      detail: { reduceTimeout: true }
    }));
  };

  const optimizeGeneralPerformance = () => {
    // Clear browser caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (!cacheName.includes('critical')) {
            caches.delete(cacheName);
          }
        });
      });
    }
    
    // Dispatch performance optimization event
    window.dispatchEvent(new CustomEvent('emergency-performance-optimization'));
  };

  const isMobileDevice = (): boolean => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('alchm-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('alchm-session-id', sessionId);
    }
    return sessionId;
  };

  const cleanup = () => {
    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
      performanceObserver.current = null;
    }
    
    if (memoryTracker.current) {
      clearInterval(memoryTracker.current);
      memoryTracker.current = null;
    }
  };

  // Performance monitoring status indicator (only visible in development)
  if (process.env.NODE_ENV === 'development' && isMonitoring) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg"
        title="Performance monitoring active"
      >
        📊 Monitoring
        {alerts.length > 0 && (
          <span className="ml-2 bg-red-500 px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>
    );
  }

  return null; // Component is invisible in production
}

// Export types for external use
export type { PerformanceMetrics, PerformanceAlert, CrisisPerformanceMonitorProps };