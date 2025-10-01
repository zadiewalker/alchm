/**
 * CRITICAL LIFE-SAFETY SYSTEM: Real-Time Performance Monitor
 * 
 * This system monitors performance metrics in real-time and triggers immediate
 * alerts when performance degrades to levels that could impact crisis users.
 * Every millisecond matters when someone is in crisis.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';

// Crisis-critical performance thresholds
export const CRISIS_PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals - stricter than Google recommendations for crisis users
  LCP_CRITICAL: 1200, // 1.2s - faster than standard 2.5s
  FID_CRITICAL: 50,   // 50ms - faster than standard 100ms
  CLS_CRITICAL: 0.05, // 0.05 - stricter than standard 0.1
  
  // Crisis-specific metrics
  CRISIS_RESOURCE_LOAD_TIME: 1000, // 1s maximum for crisis resources
  TTI_CRITICAL: 3000, // 3s time to interactive
  
  // Memory thresholds
  MEMORY_USAGE_CRITICAL: 100 * 1024 * 1024, // 100MB
  MEMORY_LEAK_THRESHOLD: 50 * 1024 * 1024,  // 50MB growth per minute
  
  // Database performance
  FIRESTORE_QUERY_CRITICAL: 500, // 500ms for any Firestore query
  
  // Network resilience
  OFFLINE_DETECTION_TIME: 2000, // 2s to detect offline state
  
  // AI response times (Khepera)
  AI_RESPONSE_CRITICAL: 5000, // 5s maximum for AI responses
} as const;

interface PerformanceMetric {
  timestamp: number;
  type: string;
  value: number;
  url: string;
  userAgent: string;
  isCrisisContext: boolean;
  userId?: string;
}

interface PerformanceAlert {
  id: string;
  timestamp: number;
  severity: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  metric: string;
  value: number;
  threshold: number;
  url: string;
  isCrisisContext: boolean;
  userId?: string;
  actionTaken?: string;
}

class RealTimePerformanceMonitor {
  private db: any;
  private observers: PerformanceObserver[] = [];
  private memoryBaseline: number = 0;
  private lastMemoryCheck: number = 0;
  private isInitialized = false;
  private alertCallbacks: ((alert: PerformanceAlert) => void)[] = [];

  constructor() {
    this.initializeMonitoring();
  }

  private async initializeMonitoring() {
    try {
      // Initialize Firebase if not already done
      if (typeof window !== 'undefined') {
        const firebaseConfig = {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          // Add other config as needed
        };
        
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
      }

      this.setupPerformanceObservers();
      this.startMemoryMonitoring();
      this.monitorNetworkStatus();
      this.monitorCrisisResources();
      
      this.isInitialized = true;
      console.log('[CRISIS MONITOR] Real-time performance monitoring initialized');
    } catch (error) {
      console.error('[CRISIS MONITOR ERROR] Failed to initialize:', error);
    }
  }

  private setupPerformanceObservers() {
    if (typeof window === 'undefined') return;

    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.recordMetric({
          type: 'LCP',
          value: lastEntry.startTime,
          url: window.location.href,
          userAgent: navigator.userAgent,
          isCrisisContext: this.isCrisisContext(),
          timestamp: Date.now()
        });

        // Check for critical threshold
        if (lastEntry.startTime > CRISIS_PERFORMANCE_THRESHOLDS.LCP_CRITICAL) {
          this.triggerAlert({
            severity: 'CRITICAL',
            metric: 'LCP',
            value: lastEntry.startTime,
            threshold: CRISIS_PERFORMANCE_THRESHOLDS.LCP_CRITICAL,
            url: window.location.href,
            isCrisisContext: this.isCrisisContext()
          });
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            type: 'FID',
            value: entry.processingStart - entry.startTime,
            url: window.location.href,
            userAgent: navigator.userAgent,
            isCrisisContext: this.isCrisisContext(),
            timestamp: Date.now()
          });

          const fidValue = entry.processingStart - entry.startTime;
          if (fidValue > CRISIS_PERFORMANCE_THRESHOLDS.FID_CRITICAL) {
            this.triggerAlert({
              severity: 'CRITICAL',
              metric: 'FID',
              value: fidValue,
              threshold: CRISIS_PERFORMANCE_THRESHOLDS.FID_CRITICAL,
              url: window.location.href,
              isCrisisContext: this.isCrisisContext()
            });
          }
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        this.recordMetric({
          type: 'CLS',
          value: clsValue,
          url: window.location.href,
          userAgent: navigator.userAgent,
          isCrisisContext: this.isCrisisContext(),
          timestamp: Date.now()
        });

        if (clsValue > CRISIS_PERFORMANCE_THRESHOLDS.CLS_CRITICAL) {
          this.triggerAlert({
            severity: 'CRITICAL',
            metric: 'CLS',
            value: clsValue,
            threshold: CRISIS_PERFORMANCE_THRESHOLDS.CLS_CRITICAL,
            url: window.location.href,
            isCrisisContext: this.isCrisisContext()
          });
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private startMemoryMonitoring() {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const currentUsage = memory.usedJSHeapSize;
        
        if (this.memoryBaseline === 0) {
          this.memoryBaseline = currentUsage;
          this.lastMemoryCheck = Date.now();
          return;
        }

        // Check for memory leaks
        const timeDiff = Date.now() - this.lastMemoryCheck;
        const memoryGrowth = currentUsage - this.memoryBaseline;
        const growthRate = (memoryGrowth / timeDiff) * 60000; // Growth per minute

        this.recordMetric({
          type: 'MEMORY_USAGE',
          value: currentUsage,
          url: window.location.href,
          userAgent: navigator.userAgent,
          isCrisisContext: this.isCrisisContext(),
          timestamp: Date.now()
        });

        // Check critical thresholds
        if (currentUsage > CRISIS_PERFORMANCE_THRESHOLDS.MEMORY_USAGE_CRITICAL) {
          this.triggerAlert({
            severity: 'CRITICAL',
            metric: 'MEMORY_USAGE',
            value: currentUsage,
            threshold: CRISIS_PERFORMANCE_THRESHOLDS.MEMORY_USAGE_CRITICAL,
            url: window.location.href,
            isCrisisContext: this.isCrisisContext()
          });
        }

        if (growthRate > CRISIS_PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD) {
          this.triggerAlert({
            severity: 'EMERGENCY',
            metric: 'MEMORY_LEAK',
            value: growthRate,
            threshold: CRISIS_PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD,
            url: window.location.href,
            isCrisisContext: this.isCrisisContext()
          });
        }

        this.lastMemoryCheck = Date.now();
      }
    };

    // Check memory every 10 seconds
    setInterval(checkMemory, 10000);
  }

  private monitorNetworkStatus() {
    if (typeof window === 'undefined') return;

    let offlineStartTime: number | null = null;

    const handleOnline = () => {
      if (offlineStartTime) {
        const offlineDuration = Date.now() - offlineStartTime;
        this.recordMetric({
          type: 'OFFLINE_DURATION',
          value: offlineDuration,
          url: window.location.href,
          userAgent: navigator.userAgent,
          isCrisisContext: this.isCrisisContext(),
          timestamp: Date.now()
        });
        offlineStartTime = null;
      }
    };

    const handleOffline = () => {
      offlineStartTime = Date.now();
      
      // Immediate alert for offline status in crisis context
      if (this.isCrisisContext()) {
        this.triggerAlert({
          severity: 'EMERGENCY',
          metric: 'OFFLINE_STATUS',
          value: 1,
          threshold: 0,
          url: window.location.href,
          isCrisisContext: true
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  private monitorCrisisResources() {
    if (typeof window === 'undefined') return;

    // Monitor crisis resource loading times
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const url = entry.name;
        
        // Check if this is a crisis resource
        if (this.isCrisisResource(url)) {
          const loadTime = entry.responseEnd - entry.fetchStart;
          
          this.recordMetric({
            type: 'CRISIS_RESOURCE_LOAD',
            value: loadTime,
            url: url,
            userAgent: navigator.userAgent,
            isCrisisContext: this.isCrisisContext(),
            timestamp: Date.now()
          });

          if (loadTime > CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME) {
            this.triggerAlert({
              severity: 'EMERGENCY',
              metric: 'CRISIS_RESOURCE_LOAD',
              value: loadTime,
              threshold: CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME,
              url: url,
              isCrisisContext: this.isCrisisContext()
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private isCrisisContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    const url = window.location.href;
    const crisisKeywords = [
      '/crisis',
      '/emergency', 
      '/support',
      'crisis=true',
      'emergency=true'
    ];
    
    return crisisKeywords.some(keyword => url.includes(keyword));
  }

  private isCrisisResource(url: string): boolean {
    const crisisResourcePatterns = [
      '/crisis',
      '/emergency',
      '/support',
      'hotline',
      'suicide',
      'mental-health'
    ];
    
    return crisisResourcePatterns.some(pattern => url.includes(pattern));
  }

  private async recordMetric(metric: PerformanceMetric) {
    try {
      if (!this.db) return;

      // Store in Firestore for analysis
      await addDoc(collection(this.db, 'performance_metrics'), {
        ...metric,
        environment: process.env.NODE_ENV,
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown'
      });

      // Also store in browser storage for immediate access
      if (typeof window !== 'undefined') {
        const existingMetrics = JSON.parse(
          localStorage.getItem('alchm_performance_metrics') || '[]'
        );
        existingMetrics.push(metric);
        
        // Keep only last 100 metrics to prevent storage bloat
        if (existingMetrics.length > 100) {
          existingMetrics.splice(0, existingMetrics.length - 100);
        }
        
        localStorage.setItem('alchm_performance_metrics', JSON.stringify(existingMetrics));
      }
    } catch (error) {
      console.error('[CRISIS MONITOR] Failed to record metric:', error);
    }
  }

  private async triggerAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp'>) {
    const alert: PerformanceAlert = {
      ...alertData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    try {
      // Store alert in Firestore
      if (this.db) {
        await addDoc(collection(this.db, 'performance_alerts'), alert);
      }

      // Log to console for immediate visibility
      console.error(`[CRISIS ALERT ${alert.severity}] ${alert.metric}: ${alert.value} > ${alert.threshold}`, alert);

      // Trigger callbacks
      this.alertCallbacks.forEach(callback => {
        try {
          callback(alert);
        } catch (error) {
          console.error('[CRISIS MONITOR] Alert callback error:', error);
        }
      });

      // Send to monitoring service if configured
      if (typeof window !== 'undefined' && alert.severity === 'EMERGENCY') {
        // Could integrate with external monitoring services here
        this.sendEmergencyAlert(alert);
      }
    } catch (error) {
      console.error('[CRISIS MONITOR] Failed to trigger alert:', error);
    }
  }

  private sendEmergencyAlert(alert: PerformanceAlert) {
    // This could send to external monitoring services
    // For now, we'll use console and potentially webhook
    console.error(`🚨 EMERGENCY PERFORMANCE ALERT 🚨`, alert);
    
    // Could implement webhook notification here
    if (process.env.NEXT_PUBLIC_PERFORMANCE_WEBHOOK_URL) {
      fetch(process.env.NEXT_PUBLIC_PERFORMANCE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      }).catch(console.error);
    }
  }

  // Public API
  public onAlert(callback: (alert: PerformanceAlert) => void) {
    this.alertCallbacks.push(callback);
  }

  public async getRecentMetrics(timeframe: number = 3600000): Promise<PerformanceMetric[]> {
    const cutoff = Date.now() - timeframe;
    
    if (typeof window !== 'undefined') {
      const metrics = JSON.parse(
        localStorage.getItem('alchm_performance_metrics') || '[]'
      );
      return metrics.filter((m: PerformanceMetric) => m.timestamp >= cutoff);
    }
    
    return [];
  }

  public async getRecentAlerts(timeframe: number = 3600000): Promise<PerformanceAlert[]> {
    const cutoff = Date.now() - timeframe;
    
    if (typeof window !== 'undefined') {
      const alerts = JSON.parse(
        localStorage.getItem('alchm_performance_alerts') || '[]'
      );
      return alerts.filter((a: PerformanceAlert) => a.timestamp >= cutoff);
    }
    
    return [];
  }

  public measureCustomMetric(name: string, value: number, isCritical: boolean = false) {
    this.recordMetric({
      type: `CUSTOM_${name}`,
      value,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      isCrisisContext: this.isCrisisContext(),
      timestamp: Date.now()
    });

    if (isCritical) {
      this.triggerAlert({
        severity: 'CRITICAL',
        metric: `CUSTOM_${name}`,
        value,
        threshold: 0,
        url: typeof window !== 'undefined' ? window.location.href : 'server',
        isCrisisContext: this.isCrisisContext()
      });
    }
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.alertCallbacks = [];
  }
}

// Singleton instance
let performanceMonitor: RealTimePerformanceMonitor | null = null;

export function getPerformanceMonitor(): RealTimePerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new RealTimePerformanceMonitor();
  }
  return performanceMonitor;
}

// Utility functions for quick access
export function measurePerformance(name: string, value: number, isCritical: boolean = false) {
  const monitor = getPerformanceMonitor();
  monitor.measureCustomMetric(name, value, isCritical);
}

export function onPerformanceAlert(callback: (alert: PerformanceAlert) => void) {
  const monitor = getPerformanceMonitor();
  monitor.onAlert(callback);
}

// Export types for other modules
export type { PerformanceMetric, PerformanceAlert };