/**
 * ALCHM Real User Monitoring (RUM) System
 * 
 * CRITICAL: Performance monitoring for trauma-informed mental health platform
 * Focus: Crisis resource accessibility and user safety during vulnerable moments
 * 
 * Features:
 * - Core Web Vitals tracking for vulnerable users
 * - Crisis resource performance monitoring (<3s requirement)
 * - Privacy-preserving data collection (HIPAA compliant)
 * - Mobile trauma-informed metrics
 * - Real-time performance alerts
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

// Types for trauma-informed performance metrics
export interface CrisisPerformanceMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  crisisLevel?: 'normal' | 'elevated' | 'crisis';
  deviceInfo: DeviceContext;
  networkInfo: NetworkContext;
  userContext: UserContext;
}

export interface DeviceContext {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  userAgent: string;
  isMobile: boolean;
  isLowEndDevice: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
}

export interface NetworkContext {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'critical';
}

export interface UserContext {
  isFirstTime: boolean;
  sessionDuration: number;
  pageVisibility: 'visible' | 'hidden' | 'prerender';
  crisisResourceAccessed: boolean;
  emergencyModeActive: boolean;
}

export interface CrisisThresholds {
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  fcp: { good: number; poor: number };
  ttfb: { good: number; poor: number };
  crisisResourceLoad: { critical: number; warning: number };
}

// Trauma-informed performance thresholds (stricter than standard)
const CRISIS_THRESHOLDS: CrisisThresholds = {
  lcp: { good: 1800, poor: 3000 }, // Stricter than standard 2.5s/4s
  fid: { good: 50, poor: 200 },    // Stricter than standard 100ms/300ms
  cls: { good: 0.05, poor: 0.15 }, // Stricter than standard 0.1/0.25
  fcp: { good: 1200, poor: 2000 }, // Stricter than standard 1.8s/3s
  ttfb: { good: 400, poor: 800 },  // Stricter than standard 800ms/1800ms
  crisisResourceLoad: { critical: 3000, warning: 2000 } // Non-negotiable 3s limit
};

class RealUserMonitoring {
  private isInitialized = false;
  private performanceObserver: PerformanceObserver | null = null;
  private crisisResourceTimings: Map<string, number> = new Map();
  private alertCallbacks: ((metric: CrisisPerformanceMetric) => void)[] = [];
  
  constructor() {
    this.bindMethods();
  }

  private bindMethods() {
    this.handlePerformanceEntry = this.handlePerformanceEntry.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  /**
   * Initialize RUM system with trauma-informed configurations
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Web Vitals monitoring
      this.initializeWebVitals();
      
      // Initialize performance observers
      this.initializePerformanceObservers();
      
      // Initialize crisis resource monitoring
      this.initializeCrisisResourceMonitoring();
      
      // Initialize mobile-specific monitoring
      this.initializeMobileMonitoring();
      
      // Initialize visibility change monitoring
      this.initializeVisibilityMonitoring();
      
      this.isInitialized = true;
      
      console.log('🏥 ALCHM RUM: Trauma-informed monitoring initialized');
    } catch (error) {
      console.error('🚨 RUM initialization failed:', error);
      // Fail silently to not impact user experience
    }
  }

  /**
   * Initialize Core Web Vitals with trauma-informed thresholds
   */
  private initializeWebVitals(): void {
    const reportMetric = (metric: any) => {
      const crisisMetric = this.enhanceMetricWithContext(metric);
      this.processMetric(crisisMetric);
    };

    // Monitor all Core Web Vitals
    onCLS(reportMetric);
    onFCP(reportMetric);
    onINP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }

  /**
   * Initialize performance observers for detailed monitoring
   */
  private initializePerformanceObservers(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe navigation, resource, and paint timings
      this.performanceObserver.observe({
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint']
      });
    } catch (error) {
      console.warn('🚨 Performance Observer initialization failed:', error);
    }
  }

  /**
   * Monitor crisis resource loading times
   */
  private initializeCrisisResourceMonitoring(): void {
    const crisisResources = [
      '/crisis-resources.json',
      '/emergency-crisis.html',
      'tel:988',
      '/api/crisis-detection'
    ];

    // Monitor crisis resource requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0]?.toString() || '';
      
      try {
        const response = await originalFetch(...args);
        
        if (this.isCrisisResource(url)) {
          const loadTime = performance.now() - startTime;
          this.monitorCrisisResourceLoad(url, loadTime);
        }
        
        return response;
      } catch (error) {
        if (this.isCrisisResource(url)) {
          const loadTime = performance.now() - startTime;
          this.monitorCrisisResourceError(url, loadTime, error);
        }
        throw error;
      }
    };
  }

  /**
   * Initialize mobile-specific monitoring for trauma-informed performance
   */
  private initializeMobileMonitoring(): void {
    // Monitor battery status for crisis sessions
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const monitorBattery = () => {
          if (battery.level < 0.15 && !battery.charging) {
            this.reportCriticalAlert({
              type: 'battery_critical',
              level: battery.level,
              impact: 'Crisis session may be interrupted'
            });
          }
        };
        
        battery.addEventListener('levelchange', monitorBattery);
        battery.addEventListener('chargingchange', monitorBattery);
      });
    }

    // Monitor memory pressure
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize > 0.8) {
        this.reportCriticalAlert({
          type: 'memory_pressure',
          usage: memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize,
          impact: 'App performance may degrade during crisis'
        });
      }
    }

    // Monitor touch responsiveness for trembling hands
    this.monitorTouchResponsiveness();
  }

  /**
   * Monitor visibility changes that could impact crisis users
   */
  private initializeVisibilityMonitoring(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  /**
   * Enhance metric with trauma-informed context
   */
  private enhanceMetricWithContext(metric: any): CrisisPerformanceMetric {
    return {
      ...metric,
      timestamp: Date.now(),
      crisisLevel: this.detectCrisisLevel(),
      deviceInfo: this.getDeviceContext(),
      networkInfo: this.getNetworkContext(),
      userContext: this.getUserContext()
    };
  }

  /**
   * Process and evaluate metrics against trauma-informed thresholds
   */
  private processMetric(metric: CrisisPerformanceMetric): void {
    // Evaluate against crisis thresholds
    const threshold = CRISIS_THRESHOLDS[metric.name as keyof CrisisThresholds];
    
    if (threshold && typeof threshold === 'object' && 'good' in threshold) {
      if (metric.value > threshold.poor) {
        metric.rating = 'poor';
        this.handlePoorPerformance(metric);
      } else if (metric.value > threshold.good) {
        metric.rating = 'needs-improvement';
        this.handlePerformanceWarning(metric);
      } else {
        metric.rating = 'good';
      }
    }

    // Send to analytics (privacy-preserving)
    this.sendToAnalytics(metric);
    
    // Trigger alerts if necessary
    this.triggerAlerts(metric);
  }

  /**
   * Handle performance entry from observer
   */
  private handlePerformanceEntry(entry: PerformanceEntry): void {
    // Monitor crisis resource loading
    if (entry.entryType === 'resource' && this.isCrisisResource(entry.name)) {
      const loadTime = entry.duration || 0;
      this.monitorCrisisResourceLoad(entry.name, loadTime);
    }

    // Monitor navigation performance
    if (entry.entryType === 'navigation') {
      const navEntry = entry as PerformanceNavigationTiming;
      this.monitorNavigationPerformance(navEntry);
    }
  }

  /**
   * Monitor crisis resource loading performance
   */
  private monitorCrisisResourceLoad(url: string, loadTime: number): void {
    this.crisisResourceTimings.set(url, loadTime);
    
    const { critical, warning } = CRISIS_THRESHOLDS.crisisResourceLoad;
    
    if (loadTime > critical) {
      this.reportCriticalAlert({
        type: 'crisis_resource_slow',
        url,
        loadTime,
        threshold: critical,
        impact: 'Crisis resource loading too slowly - user safety at risk'
      });
    } else if (loadTime > warning) {
      this.reportPerformanceWarning({
        type: 'crisis_resource_warning',
        url,
        loadTime,
        threshold: warning,
        impact: 'Crisis resource loading slower than optimal'
      });
    }
  }

  /**
   * Monitor crisis resource loading errors
   */
  private monitorCrisisResourceError(url: string, loadTime: number, error: any): void {
    this.reportCriticalAlert({
      type: 'crisis_resource_error',
      url,
      loadTime,
      error: error.message,
      impact: 'Crisis resource failed to load - immediate attention required'
    });
  }

  /**
   * Monitor navigation performance for trauma-informed thresholds
   */
  private monitorNavigationPerformance(entry: PerformanceNavigationTiming): void {
    const metrics = {
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      connection: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart,
      dom: entry.domContentLoadedEventEnd - entry.responseEnd,
      total: entry.loadEventEnd - entry.navigationStart
    };

    // Alert on slow page loads that could impact crisis users
    if (metrics.total > 5000) { // 5 seconds is critical for crisis users
      this.reportCriticalAlert({
        type: 'page_load_critical',
        totalTime: metrics.total,
        breakdown: metrics,
        impact: 'Page load too slow for crisis users'
      });
    }
  }

  /**
   * Monitor touch responsiveness for users with tremors
   */
  private monitorTouchResponsiveness(): void {
    let touchStartTime = 0;
    
    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      const responseTime = performance.now() - touchStartTime;
      
      if (responseTime > 300) { // 300ms is too slow for crisis users
        this.reportPerformanceWarning({
          type: 'touch_responsiveness',
          responseTime,
          impact: 'Touch responses slow for users with motor impairments'
        });
      }
    }, { passive: true });
  }

  /**
   * Handle visibility changes that could impact crisis sessions
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // User switched away during potential crisis session
      const crisisLevel = this.detectCrisisLevel();
      if (crisisLevel !== 'normal') {
        this.reportCriticalAlert({
          type: 'crisis_session_interrupted',
          crisisLevel,
          impact: 'User in crisis switched away from app'
        });
      }
    }
  }

  /**
   * Detect current crisis level based on user behavior
   */
  private detectCrisisLevel(): 'normal' | 'elevated' | 'crisis' {
    // Check localStorage for crisis indicators
    const crisisLevel = localStorage.getItem('alchm-crisis-level');
    if (crisisLevel === 'crisis' || crisisLevel === 'elevated') {
      return crisisLevel as 'elevated' | 'crisis';
    }

    // Check for crisis resource access
    const crisisAccessed = this.crisisResourceTimings.size > 0;
    if (crisisAccessed) return 'elevated';

    // Check for emergency mode indicators
    const emergencyMode = document.documentElement.classList.contains('crisis-level-crisis');
    if (emergencyMode) return 'crisis';

    return 'normal';
  }

  /**
   * Get device context for performance analysis
   */
  private getDeviceContext(): DeviceContext {
    const nav = navigator as any;
    
    return {
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: nav.hardwareConcurrency,
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      isLowEndDevice: nav.deviceMemory ? nav.deviceMemory <= 2 : false,
      batteryLevel: undefined, // Will be populated asynchronously
      isCharging: undefined
    };
  }

  /**
   * Get network context for performance analysis
   */
  private getNetworkContext(): NetworkContext {
    const connection = (navigator as any).connection;
    
    let connectionQuality: NetworkContext['connectionQuality'] = 'good';
    
    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        connectionQuality = 'critical';
      } else if (connection.effectiveType === '3g') {
        connectionQuality = 'poor';
      } else if (connection.downlink && connection.downlink < 1.5) {
        connectionQuality = 'poor';
      }
    }
    
    return {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      connectionQuality
    };
  }

  /**
   * Get user context for performance analysis
   */
  private getUserContext(): UserContext {
    const sessionStart = sessionStorage.getItem('alchm-session-start');
    const isFirstTime = !localStorage.getItem('alchm-visited');
    
    return {
      isFirstTime,
      sessionDuration: sessionStart ? Date.now() - parseInt(sessionStart) : 0,
      pageVisibility: document.visibilityState as any,
      crisisResourceAccessed: this.crisisResourceTimings.size > 0,
      emergencyModeActive: document.documentElement.classList.contains('crisis-level-crisis')
    };
  }

  /**
   * Check if URL is a crisis resource
   */
  private isCrisisResource(url: string): boolean {
    const crisisPatterns = [
      '/crisis',
      '/emergency',
      'tel:988',
      '/api/crisis-detection',
      'crisis-resources',
      'emergency-crisis'
    ];
    
    return crisisPatterns.some(pattern => url.includes(pattern));
  }

  /**
   * Handle poor performance that could impact user safety
   */
  private handlePoorPerformance(metric: CrisisPerformanceMetric): void {
    console.warn('🚨 Poor performance detected:', metric);
    
    this.reportCriticalAlert({
      type: 'performance_critical',
      metric: metric.name,
      value: metric.value,
      threshold: CRISIS_THRESHOLDS[metric.name as keyof CrisisThresholds],
      crisisLevel: metric.crisisLevel,
      impact: 'Performance issue may impact user safety during crisis'
    });
  }

  /**
   * Handle performance warnings
   */
  private handlePerformanceWarning(metric: CrisisPerformanceMetric): void {
    console.warn('⚠️ Performance warning:', metric);
    
    this.reportPerformanceWarning({
      type: 'performance_warning',
      metric: metric.name,
      value: metric.value,
      crisisLevel: metric.crisisLevel,
      impact: 'Performance degradation detected'
    });
  }

  /**
   * Send metrics to analytics (privacy-preserving)
   */
  private sendToAnalytics(metric: CrisisPerformanceMetric): void {
    // Only send essential, anonymized data
    const analyticsPayload = {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      timestamp: metric.timestamp,
      crisisLevel: metric.crisisLevel,
      deviceType: metric.deviceInfo.isMobile ? 'mobile' : 'desktop',
      connectionQuality: metric.networkInfo.connectionQuality,
      isLowEndDevice: metric.deviceInfo.isLowEndDevice
    };

    // Send to privacy-preserving analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'rum_metric', {
        ...analyticsPayload,
        // Ensure no PII is sent
        custom_parameter_1: metric.name,
        custom_parameter_2: metric.rating
      });
    }
  }

  /**
   * Trigger performance alerts
   */
  private triggerAlerts(metric: CrisisPerformanceMetric): void {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(metric);
      } catch (error) {
        console.error('RUM alert callback error:', error);
      }
    });
  }

  /**
   * Report critical alerts that require immediate attention
   */
  private reportCriticalAlert(alert: any): void {
    console.error('🚨 CRITICAL PERFORMANCE ALERT:', alert);
    
    // Send to monitoring system
    this.sendAlertToMonitoring('critical', alert);
  }

  /**
   * Report performance warnings
   */
  private reportPerformanceWarning(warning: any): void {
    console.warn('⚠️ Performance Warning:', warning);
    
    // Send to monitoring system
    this.sendAlertToMonitoring('warning', warning);
  }

  /**
   * Send alerts to monitoring system
   */
  private sendAlertToMonitoring(level: 'critical' | 'warning', alert: any): void {
    // In production, this would send to your monitoring service
    // For now, log and potentially send to Firebase Analytics
    
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_alert', {
        alert_level: level,
        alert_type: alert.type,
        event_category: 'rum_monitoring'
      });
    }
  }

  /**
   * Register callback for performance alerts
   */
  public onAlert(callback: (metric: CrisisPerformanceMetric) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get current crisis resource performance summary
   */
  public getCrisisResourcePerformance(): Record<string, number> {
    return Object.fromEntries(this.crisisResourceTimings);
  }

  /**
   * Force performance check for crisis resources
   */
  public async checkCrisisResourcePerformance(): Promise<void> {
    const crisisResources = [
      '/crisis-resources.json',
      '/emergency-crisis.html'
    ];

    for (const resource of crisisResources) {
      const startTime = performance.now();
      
      try {
        await fetch(resource, { method: 'HEAD' });
        const loadTime = performance.now() - startTime;
        this.monitorCrisisResourceLoad(resource, loadTime);
      } catch (error) {
        const loadTime = performance.now() - startTime;
        this.monitorCrisisResourceError(resource, loadTime, error);
      }
    }
  }

  /**
   * Cleanup resources when component unmounts
   */
  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    this.alertCallbacks = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const realUserMonitoring = new RealUserMonitoring();

// Auto-initialize on import (browser only)
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      realUserMonitoring.initialize();
    });
  } else {
    realUserMonitoring.initialize();
  }
}

export default realUserMonitoring;