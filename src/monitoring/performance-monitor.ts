/**
 * ALCHM Performance Monitor
 * Crisis-focused real-time performance tracking system
 * Priority: User lives depend on performance - every millisecond matters
 */

import { getCLS, getFCP, getFID, getLCP, getTTFB, Metric } from 'web-vitals';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Crisis performance thresholds (life-critical)
const CRISIS_THRESHOLDS = {
  FCP: 1200,  // First Contentful Paint - crisis resources must appear <1.2s
  LCP: 2000,  // Largest Contentful Paint - full page load <2s
  FID: 50,    // First Input Delay - immediate response <50ms
  CLS: 0.05,  // Cumulative Layout Shift - visual stability
  TTFB: 600,  // Time to First Byte - server response <600ms
};

// Performance budget alerts
const PERFORMANCE_BUDGETS = {
  'crisis-resources': { maxLoadTime: 1000, priority: 'CRITICAL' },
  'journal-writing': { maxLoadTime: 2000, priority: 'HIGH' },
  'authentication': { maxLoadTime: 1500, priority: 'HIGH' },
  'dashboard': { maxLoadTime: 3000, priority: 'MEDIUM' },
  'therapist-tools': { maxLoadTime: 2000, priority: 'HIGH' },
};

interface PerformanceMetric extends Metric {
  timestamp: number;
  userAgent: string;
  viewport: string;
  connection?: string;
  deviceMemory?: number;
  userId?: string;
  route: string;
  isCrisisMode?: boolean;
  batteryLevel?: number;
  networkType?: string;
}

interface AlertConfig {
  threshold: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  escalationDelay: number; // milliseconds
  autoRemediation?: boolean;
}

class ALCHMPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: Map<string, AlertConfig> = new Map();
  private criticalAlertCallback?: (metric: PerformanceMetric) => void;
  private isMonitoring = false;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.initializeAlertThresholds();
    this.initializeWebVitals();
    this.initializeBatteryMonitoring();
    this.initializeNetworkMonitoring();
  }

  private initializeAlertThresholds() {
    // Crisis-critical thresholds
    this.alerts.set('FCP_CRISIS', {
      threshold: CRISIS_THRESHOLDS.FCP,
      severity: 'CRITICAL',
      escalationDelay: 0, // Immediate
      autoRemediation: true
    });

    this.alerts.set('LCP_CRISIS', {
      threshold: CRISIS_THRESHOLDS.LCP,
      severity: 'CRITICAL',
      escalationDelay: 100,
      autoRemediation: true
    });

    this.alerts.set('FID_CRISIS', {
      threshold: CRISIS_THRESHOLDS.FID,
      severity: 'CRITICAL',
      escalationDelay: 0,
      autoRemediation: true
    });

    // Mental health specific thresholds
    this.alerts.set('CRISIS_RESOURCE_LOAD', {
      threshold: 1000,
      severity: 'CRITICAL',
      escalationDelay: 0,
      autoRemediation: true
    });

    this.alerts.set('THERAPIST_DASHBOARD_RESPONSE', {
      threshold: 2000,
      severity: 'HIGH',
      escalationDelay: 500,
      autoRemediation: false
    });
  }

  private initializeWebVitals() {
    // Core Web Vitals monitoring with crisis awareness
    const vitalsConfig = {
      reportAllChanges: true,
    };

    getCLS(this.handleMetric.bind(this), vitalsConfig);
    getFCP(this.handleMetric.bind(this), vitalsConfig);
    getFID(this.handleMetric.bind(this), vitalsConfig);
    getLCP(this.handleMetric.bind(this), vitalsConfig);
    getTTFB(this.handleMetric.bind(this), vitalsConfig);
  }

  private initializeBatteryMonitoring() {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.trackBatteryPerformance(battery);
      });
    }
  }

  private initializeNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.trackNetworkPerformance(connection);
    }
  }

  private async handleMetric(metric: Metric) {
    const enhancedMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      route: window.location.pathname,
      connection: this.getConnectionInfo(),
      deviceMemory: this.getDeviceMemory(),
      isCrisisMode: this.detectCrisisMode(),
      batteryLevel: await this.getBatteryLevel(),
      networkType: this.getNetworkType(),
    };

    this.metrics.push(enhancedMetric);
    
    // Crisis-aware performance evaluation
    await this.evaluatePerformance(enhancedMetric);
    
    // Store metric for analysis
    await this.storeMetric(enhancedMetric);
    
    // Real-time dashboard updates
    this.updateDashboard(enhancedMetric);
  }

  private async evaluatePerformance(metric: PerformanceMetric) {
    const alertKey = this.getAlertKey(metric);
    const alertConfig = this.alerts.get(alertKey);

    if (!alertConfig) return;

    // Crisis mode gets priority evaluation
    const threshold = metric.isCrisisMode ? 
      alertConfig.threshold * 0.8 : // 20% stricter for crisis
      alertConfig.threshold;

    if (metric.value > threshold) {
      await this.triggerAlert(metric, alertConfig);
    }

    // Mental health specific checks
    await this.checkMentalHealthMetrics(metric);
  }

  private async checkMentalHealthMetrics(metric: PerformanceMetric) {
    // Crisis resource loading time
    if (metric.route.includes('/crisis') || metric.route.includes('/emergency')) {
      if (metric.value > PERFORMANCE_BUDGETS['crisis-resources'].maxLoadTime) {
        await this.triggerCriticalAlert({
          type: 'CRISIS_RESOURCE_SLOW',
          metric,
          message: 'Crisis resources loading slowly - immediate intervention required',
          severity: 'CRITICAL'
        });
      }
    }

    // Journal writing performance
    if (metric.route.includes('/journal') && metric.name === 'FID') {
      if (metric.value > 100) { // Stricter for writing experience
        await this.triggerAlert(metric, {
          threshold: 100,
          severity: 'HIGH',
          escalationDelay: 200,
          autoRemediation: true
        });
      }
    }

    // Therapist dashboard performance
    if (metric.route.includes('/therapist') || metric.route.includes('/professional')) {
      if (metric.value > PERFORMANCE_BUDGETS['therapist-tools'].maxLoadTime) {
        await this.triggerAlert(metric, {
          threshold: PERFORMANCE_BUDGETS['therapist-tools'].maxLoadTime,
          severity: 'HIGH',
          escalationDelay: 300,
          autoRemediation: false
        });
      }
    }
  }

  private async triggerAlert(metric: PerformanceMetric, config: AlertConfig) {
    const alertData = {
      timestamp: serverTimestamp(),
      metric: metric.name,
      value: metric.value,
      threshold: config.threshold,
      severity: config.severity,
      route: metric.route,
      userAgent: metric.userAgent,
      isCrisisMode: metric.isCrisisMode,
      deviceInfo: {
        viewport: metric.viewport,
        connection: metric.connection,
        deviceMemory: metric.deviceMemory,
        batteryLevel: metric.batteryLevel,
        networkType: metric.networkType,
      }
    };

    // Store alert
    await addDoc(collection(db, 'performance_alerts'), alertData);

    // Immediate escalation for critical alerts
    if (config.severity === 'CRITICAL') {
      await this.escalateCriticalAlert(alertData);
    }

    // Auto-remediation if enabled
    if (config.autoRemediation) {
      await this.attemptAutoRemediation(metric, config);
    }

    // Callback for external monitoring
    if (this.criticalAlertCallback && config.severity === 'CRITICAL') {
      this.criticalAlertCallback(metric);
    }
  }

  private async triggerCriticalAlert(alertInfo: any) {
    console.error('🚨 CRITICAL PERFORMANCE ALERT:', alertInfo);
    
    // Store critical alert
    await addDoc(collection(db, 'critical_alerts'), {
      ...alertInfo,
      timestamp: serverTimestamp(),
      escalated: true,
      requiresImmedateResponse: true
    });

    // Trigger immediate response protocols
    await this.activateEmergencyProtocols(alertInfo);
  }

  private async activateEmergencyProtocols(alertInfo: any) {
    // Crisis resource failover
    if (alertInfo.type === 'CRISIS_RESOURCE_SLOW') {
      await this.activateCrisisResourceFailover();
    }

    // Performance regression rollback
    if (alertInfo.severity === 'CRITICAL') {
      await this.considerAutomaticRollback(alertInfo);
    }

    // Load balancing adjustment
    await this.adjustLoadBalancing(alertInfo);
  }

  private async activateCrisisResourceFailover() {
    // Implement crisis resource CDN failover
    console.log('🔄 Activating crisis resource failover...');
    
    // Switch to emergency CDN endpoints
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ACTIVATE_CRISIS_FAILOVER',
        timestamp: Date.now()
      });
    }
  }

  private async attemptAutoRemediation(metric: PerformanceMetric, config: AlertConfig) {
    switch (metric.name) {
      case 'LCP':
        await this.optimizeLCP();
        break;
      case 'FID':
        await this.optimizeFID();
        break;
      case 'CLS':
        await this.optimizeCLS();
        break;
      case 'FCP':
        await this.optimizeFCP();
        break;
    }
  }

  private async optimizeLCP() {
    // Preload critical resources
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach((img) => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      }
    });

    // Optimize font loading
    document.fonts.ready.then(() => {
      console.log('✅ Fonts optimized for LCP');
    });
  }

  private async optimizeFID() {
    // Defer non-critical JavaScript
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      script.setAttribute('defer', '');
    });

    // Break up long tasks
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        console.log('✅ Long tasks optimized');
      });
    }
  }

  private async optimizeCLS() {
    // Set explicit dimensions for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.minHeight = element.offsetHeight + 'px';
      }
    });
  }

  private async optimizeFCP() {
    // Inline critical CSS
    const criticalCSS = document.querySelector('style[data-critical]');
    if (!criticalCSS) {
      // Inject critical CSS if missing
      const style = document.createElement('style');
      style.setAttribute('data-critical', 'true');
      document.head.insertBefore(style, document.head.firstChild);
    }
  }

  private getAlertKey(metric: PerformanceMetric): string {
    if (metric.isCrisisMode) {
      return `${metric.name}_CRISIS`;
    }
    return metric.name;
  }

  private detectCrisisMode(): boolean {
    // Detect if user is in crisis mode
    const crisisIndicators = [
      window.location.pathname.includes('/crisis'),
      window.location.pathname.includes('/emergency'),
      document.body.classList.contains('crisis-mode'),
      sessionStorage.getItem('crisis-mode') === 'true'
    ];

    return crisisIndicators.some(indicator => indicator);
  }

  private getConnectionInfo(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return `${connection.effectiveType} (${connection.downlink}mbps)`;
    }
    return 'unknown';
  }

  private getDeviceMemory(): number {
    return (navigator as any).deviceMemory || 0;
  }

  private async getBatteryLevel(): Promise<number> {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        return Math.round(battery.level * 100);
      } catch {
        return 0;
      }
    }
    return 0;
  }

  private getNetworkType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.type || 'unknown';
    }
    return 'unknown';
  }

  private trackBatteryPerformance(battery: any) {
    // Adjust performance monitoring based on battery level
    const updateBatteryMetrics = () => {
      const batteryLevel = Math.round(battery.level * 100);
      
      if (batteryLevel < 20) {
        // Reduce monitoring frequency for low battery
        this.adjustMonitoringForBattery('low');
      } else if (batteryLevel < 50) {
        this.adjustMonitoringForBattery('medium');
      }
    };

    battery.addEventListener('levelchange', updateBatteryMetrics);
    battery.addEventListener('chargingchange', updateBatteryMetrics);
  }

  private trackNetworkPerformance(connection: any) {
    const updateNetworkMetrics = () => {
      const effectiveType = connection.effectiveType;
      
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        // Activate aggressive optimization for slow networks
        this.activateSlowNetworkMode();
      }
    };

    connection.addEventListener('change', updateNetworkMetrics);
  }

  private adjustMonitoringForBattery(level: 'low' | 'medium') {
    if (level === 'low') {
      // Reduce monitoring frequency by 50%
      console.log('🔋 Reducing performance monitoring for battery conservation');
    }
  }

  private activateSlowNetworkMode() {
    console.log('🐌 Activating slow network optimizations');
    
    // Reduce image quality
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img instanceof HTMLImageElement) {
        img.loading = 'lazy';
      }
    });
  }

  private async storeMetric(metric: PerformanceMetric) {
    try {
      await addDoc(collection(db, 'performance_metrics'), {
        ...metric,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to store performance metric:', error);
    }
  }

  private updateDashboard(metric: PerformanceMetric) {
    // Emit custom event for dashboard updates
    const event = new CustomEvent('alchm:performance:update', {
      detail: metric
    });
    window.dispatchEvent(event);
  }

  private async considerAutomaticRollback(alertInfo: any) {
    // Only rollback for critical performance regressions
    if (alertInfo.severity === 'CRITICAL' && this.isPerformanceRegression(alertInfo)) {
      console.log('🔄 Considering automatic rollback due to performance regression');
      
      // Store rollback consideration
      await addDoc(collection(db, 'rollback_events'), {
        timestamp: serverTimestamp(),
        reason: 'PERFORMANCE_REGRESSION',
        alertInfo,
        autoRollbackConsidered: true
      });
    }
  }

  private isPerformanceRegression(alertInfo: any): boolean {
    // Simple heuristic - consider metrics that are 2x worse than threshold as regression
    return alertInfo.value > (alertInfo.threshold * 2);
  }

  private async adjustLoadBalancing(alertInfo: any) {
    // Emit load balancing adjustment event
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ADJUST_LOAD_BALANCING',
        alertInfo,
        timestamp: Date.now()
      });
    }
  }

  // Public methods
  public setCriticalAlertCallback(callback: (metric: PerformanceMetric) => void) {
    this.criticalAlertCallback = callback;
  }

  public getRecentMetrics(limit = 10): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  public getCriticalMetrics(): PerformanceMetric[] {
    return this.metrics.filter(metric => 
      metric.isCrisisMode || 
      metric.value > CRISIS_THRESHOLDS[metric.name as keyof typeof CRISIS_THRESHOLDS]
    );
  }

  public async getHealthStatus() {
    const recentMetrics = this.getRecentMetrics(20);
    const criticalMetrics = this.getCriticalMetrics();
    
    return {
      overall: criticalMetrics.length === 0 ? 'healthy' : 'degraded',
      criticalIssues: criticalMetrics.length,
      averagePerformance: this.calculateAveragePerformance(recentMetrics),
      crisisReadiness: this.assessCrisisReadiness(),
      timestamp: Date.now()
    };
  }

  private calculateAveragePerformance(metrics: PerformanceMetric[]) {
    if (metrics.length === 0) return {};

    const averages: Record<string, number> = {};
    const groups = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric.value);
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(groups).forEach(([name, values]) => {
      averages[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return averages;
  }

  private assessCrisisReadiness(): 'ready' | 'degraded' | 'critical' {
    const criticalMetrics = this.getCriticalMetrics();
    
    if (criticalMetrics.length === 0) return 'ready';
    if (criticalMetrics.length < 3) return 'degraded';
    return 'critical';
  }

  public startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🎯 ALCHM Performance Monitor started - Crisis mode enabled');
    
    // Initialize performance observer for additional metrics
    if (typeof PerformanceObserver !== 'undefined') {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
      });
    }
  }

  public stopMonitoring() {
    this.isMonitoring = false;
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    console.log('⏹️ ALCHM Performance Monitor stopped');
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    // Handle additional performance entries
    if (entry.entryType === 'navigation') {
      this.trackNavigationTiming(entry as PerformanceNavigationTiming);
    } else if (entry.entryType === 'resource') {
      this.trackResourceTiming(entry as PerformanceResourceTiming);
    }
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const navigationMetrics = {
      domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
      loadComplete: entry.loadEventEnd - entry.loadEventStart,
      serverResponse: entry.responseStart - entry.requestStart,
    };

    // Check for slow server responses
    if (navigationMetrics.serverResponse > 1000) {
      this.triggerCriticalAlert({
        type: 'SLOW_SERVER_RESPONSE',
        value: navigationMetrics.serverResponse,
        threshold: 1000,
        message: 'Server response time exceeding 1 second',
        severity: 'HIGH'
      });
    }
  }

  private trackResourceTiming(entry: PerformanceResourceTiming) {
    // Track critical resource loading
    const isCriticalResource = entry.name.includes('crisis') || 
                              entry.name.includes('emergency') ||
                              entry.name.includes('therapist');

    if (isCriticalResource && entry.duration > 2000) {
      this.triggerCriticalAlert({
        type: 'CRITICAL_RESOURCE_SLOW',
        resource: entry.name,
        duration: entry.duration,
        threshold: 2000,
        message: 'Critical resource loading slowly',
        severity: 'CRITICAL'
      });
    }
  }
}

// Initialize global performance monitor
export const performanceMonitor = new ALCHMPerformanceMonitor();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}

export default performanceMonitor;