/**
 * ALCHM Mobile Core Web Vitals - Crisis-Optimized Performance Monitoring
 * 
 * Trauma-informed performance monitoring for users in crisis situations.
 * Ensures <1.2s LCP, <50ms FID, and <0.05 CLS for vulnerable users.
 * 
 * Critical for users experiencing:
 * - Panic attacks
 * - Dissociation
 * - Physical tremors
 * - Cognitive impairment during crisis
 * - Poor network conditions
 * - Low-end devices
 */

interface MobileCrisisMetrics {
  // Core Web Vitals
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  firstContentfulPaint: number;
  timeToFirstByte: number;
  
  // Crisis-specific metrics
  crisisResourceLoadTime: number;
  emergencyButtonResponseTime: number;
  offlineResourceAvailability: number;
  batteryImpact: number;
  memoryPressure: number;
  
  // Accessibility metrics
  tremorCompensationActive: boolean;
  highContrastMode: boolean;
  reducedMotionActive: boolean;
  oneHandedModeActive: boolean;
  
  // Network & device context
  connectionType: string;
  deviceMemory: number;
  deviceCores: number;
  batteryLevel?: number;
  isLowPowerMode: boolean;
  
  // User context
  crisisLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  timeInCrisis: number;
  panicModeActive: boolean;
  
  timestamp: number;
  sessionId: string;
}

interface CrisisThresholds {
  critical: {
    lcp: 1200;    // 1.2s - Critical for crisis users
    fid: 50;      // 50ms - Tremor-safe responsiveness
    cls: 0.05;    // 0.05 - Visual stability critical
    fcp: 800;     // 800ms - First content critical
    ttfb: 400;    // 400ms - Server response critical
  };
  emergency: {
    lcp: 2000;    // 2s - Emergency threshold
    fid: 100;     // 100ms - Emergency responsiveness
    cls: 0.1;     // 0.1 - Emergency visual stability
    fcp: 1500;    // 1.5s - Emergency content
    ttfb: 800;    // 800ms - Emergency server response
  };
}

export class MobileCoreWebVitals {
  private static instance: MobileCoreWebVitals;
  private metrics: MobileCrisisMetrics[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private alerts: Array<(alert: CrisisPerformanceAlert) => void> = [];
  private sessionId: string;
  private startTime: number;
  
  // Crisis-optimized thresholds
  private readonly thresholds: CrisisThresholds = {
    critical: {
      lcp: 1200,    // 1.2s - Crisis users can't wait
      fid: 50,      // 50ms - Must work with tremors
      cls: 0.05,    // 0.05 - Stability critical during panic
      fcp: 800,     // 800ms - Quick content display
      ttfb: 400     // 400ms - Fast server response
    },
    emergency: {
      lcp: 2000,    // 2s - Still usable in emergency
      fid: 100,     // 100ms - Acceptable for emergency
      cls: 0.1,     // 0.1 - Some shift acceptable
      fcp: 1500,    // 1.5s - Emergency content load
      ttfb: 800     // 800ms - Emergency server response
    }
  };

  static getInstance(): MobileCoreWebVitals {
    if (!this.instance) {
      this.instance = new MobileCoreWebVitals();
    }
    return this.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private generateSessionId(): string {
    return `crisis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    // Initialize all Core Web Vitals monitoring
    this.initializeLCP();
    this.initializeFID();
    this.initializeCLS();
    this.initializeFCP();
    this.initializeTTFB();
    
    // Crisis-specific monitoring
    this.initializeCrisisMetrics();
    this.initializeBatteryMonitoring();
    this.initializeMemoryMonitoring();
    this.initializeConnectionMonitoring();
    
    // Accessibility monitoring
    this.initializeAccessibilityMonitoring();
    
    // Start periodic collection optimized for crisis situations
    this.startCrisisOptimizedCollection();
  }

  private initializeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          this.recordLCP(lastEntry.startTime);
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('lcp', observer);
    } catch (error) {
      console.warn('[Mobile CWV] LCP monitoring not supported');
    }
  }

  private initializeFID(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          this.recordFID(fid);
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.set('fid', observer);
    } catch (error) {
      console.warn('[Mobile CWV] FID monitoring not supported');
    }
  }

  private initializeCLS(): void {
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          
          // Only count unexpected shifts
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.recordCLS(clsValue);
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('cls', observer);
    } catch (error) {
      console.warn('[Mobile CWV] CLS monitoring not supported');
    }
  }

  private initializeFCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordFCP(entry.startTime);
          }
        }
      });

      observer.observe({ type: 'paint', buffered: true });
      this.observers.set('fcp', observer);
    } catch (error) {
      console.warn('[Mobile CWV] FCP monitoring not supported');
    }
  }

  private initializeTTFB(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.recordTTFB(ttfb);
          }
        }
      });

      observer.observe({ type: 'navigation', buffered: true });
      this.observers.set('ttfb', observer);
    } catch (error) {
      console.warn('[Mobile CWV] TTFB monitoring not supported');
    }
  }

  private initializeCrisisMetrics(): void {
    // Monitor crisis resource loading
    this.monitorCrisisResourcePerformance();
    
    // Monitor emergency button responsiveness
    this.monitorEmergencyButtonPerformance();
    
    // Monitor offline resource availability
    this.monitorOfflineResourceAvailability();
  }

  private monitorCrisisResourcePerformance(): void {
    const crisisStartTime = performance.now();
    
    // Monitor critical crisis resources
    const crisisResources = [
      '/crisis-support',
      '/emergency',
      '/api/crisis-detection',
      '/hotlines'
    ];

    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        if (crisisResources.some(cr => resource.name.includes(cr))) {
          const loadTime = resource.responseEnd - resource.responseStart;
          this.recordCrisisResourceLoad(loadTime);
          
          // Critical alert if crisis resource takes too long
          if (loadTime > this.thresholds.critical.lcp) {
            this.triggerCrisisAlert('crisis-resource-slow', loadTime);
          }
        }
      }
    });

    resourceObserver.observe({ type: 'resource', buffered: true });
    this.observers.set('crisis-resources', resourceObserver);
  }

  private monitorEmergencyButtonPerformance(): void {
    // Monitor emergency button response times
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement;
      
      if (this.isEmergencyButton(target)) {
        const startTime = performance.now();
        
        const handleResponse = () => {
          const responseTime = performance.now() - startTime;
          this.recordEmergencyButtonResponse(responseTime);
          
          if (responseTime > this.thresholds.critical.fid) {
            this.triggerCrisisAlert('emergency-button-slow', responseTime);
          }
          
          target.removeEventListener('touchend', handleResponse);
          target.removeEventListener('click', handleResponse);
        };

        target.addEventListener('touchend', handleResponse, { once: true });
        target.addEventListener('click', handleResponse, { once: true });
      }
    }, { passive: true });
  }

  private isEmergencyButton(element: HTMLElement): boolean {
    return element.classList.contains('crisis-button') ||
           element.classList.contains('emergency-button') ||
           element.getAttribute('data-crisis') === 'true' ||
           element.textContent?.toLowerCase().includes('crisis') ||
           element.textContent?.toLowerCase().includes('emergency');
  }

  private monitorOfflineResourceAvailability(): void {
    // Check offline cache availability for crisis resources
    if ('caches' in window) {
      const checkOfflineResources = async () => {
        try {
          const crisisCache = await caches.open('alchm-crisis-v1');
          const keys = await crisisCache.keys();
          const availability = keys.length > 0 ? 1 : 0;
          
          this.recordOfflineResourceAvailability(availability);
          
          if (availability === 0) {
            this.triggerCrisisAlert('offline-resources-unavailable', 0);
          }
        } catch (error) {
          this.recordOfflineResourceAvailability(0);
        }
      };

      // Check immediately and every 30 seconds
      checkOfflineResources();
      setInterval(checkOfflineResources, 30000);
    }
  }

  private initializeBatteryMonitoring(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryMetrics = () => {
          this.recordBatteryMetrics(battery.level, battery.charging);
          
          // Critical alert for low battery during crisis
          if (battery.level < 0.15 && this.getCurrentCrisisLevel() !== 'none') {
            this.triggerCrisisAlert('low-battery-crisis', battery.level);
          }
        };

        battery.addEventListener('levelchange', updateBatteryMetrics);
        battery.addEventListener('chargingchange', updateBatteryMetrics);
        updateBatteryMetrics(); // Initial reading
      }).catch(() => {
        // Battery API not available
      });
    }
  }

  private initializeMemoryMonitoring(): void {
    if ((performance as any).memory) {
      const checkMemoryPressure = () => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
        const pressure = usedMB / limitMB;
        
        this.recordMemoryPressure(pressure);
        
        // Critical memory pressure during crisis
        if (pressure > 0.8 && this.getCurrentCrisisLevel() !== 'none') {
          this.triggerCrisisAlert('memory-pressure-crisis', pressure);
        }
      };

      // Check every 10 seconds
      setInterval(checkMemoryPressure, 10000);
      checkMemoryPressure(); // Initial check
    }
  }

  private initializeConnectionMonitoring(): void {
    const connection = (navigator as any).connection;
    if (connection) {
      const updateConnectionMetrics = () => {
        this.recordConnectionMetrics(
          connection.effectiveType,
          connection.downlink,
          connection.rtt
        );
        
        // Critical alert for very poor connection during crisis
        if ((connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') &&
            this.getCurrentCrisisLevel() !== 'none') {
          this.triggerCrisisAlert('poor-connection-crisis', connection.effectiveType);
        }
      };

      connection.addEventListener('change', updateConnectionMetrics);
      updateConnectionMetrics(); // Initial reading
    }

    // Monitor online/offline status
    window.addEventListener('online', () => this.recordConnectionStatus(true));
    window.addEventListener('offline', () => {
      this.recordConnectionStatus(false);
      
      if (this.getCurrentCrisisLevel() !== 'none') {
        this.triggerCrisisAlert('offline-during-crisis', 0);
      }
    });
  }

  private initializeAccessibilityMonitoring(): void {
    // Monitor for accessibility mode activations
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as Element;
          
          this.updateAccessibilityMetrics({
            tremorCompensation: target.classList.contains('tremor-compensation'),
            highContrast: target.classList.contains('high-contrast'),
            reducedMotion: target.classList.contains('reduced-motion'),
            oneHandedMode: target.classList.contains('one-handed')
          });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private startCrisisOptimizedCollection(): void {
    // Collect metrics every 2 seconds during crisis (vs 5s normal)
    const collectInterval = this.getCurrentCrisisLevel() !== 'none' ? 2000 : 5000;
    
    setInterval(() => {
      this.collectCurrentMetrics();
    }, collectInterval);

    // Immediate collection
    this.collectCurrentMetrics();
  }

  private collectCurrentMetrics(): void {
    const now = Date.now();
    
    const currentMetrics: MobileCrisisMetrics = {
      // Core Web Vitals
      largestContentfulPaint: this.getLatestLCP(),
      firstInputDelay: this.getLatestFID(),
      cumulativeLayoutShift: this.getLatestCLS(),
      firstContentfulPaint: this.getLatestFCP(),
      timeToFirstByte: this.getLatestTTFB(),
      
      // Crisis-specific metrics
      crisisResourceLoadTime: this.getLatestCrisisResourceLoad(),
      emergencyButtonResponseTime: this.getLatestEmergencyButtonResponse(),
      offlineResourceAvailability: this.getLatestOfflineResourceAvailability(),
      batteryImpact: this.getLatestBatteryImpact(),
      memoryPressure: this.getLatestMemoryPressure(),
      
      // Accessibility metrics
      tremorCompensationActive: this.getAccessibilityState().tremorCompensation,
      highContrastMode: this.getAccessibilityState().highContrast,
      reducedMotionActive: this.getAccessibilityState().reducedMotion,
      oneHandedModeActive: this.getAccessibilityState().oneHandedMode,
      
      // Network & device context
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory(),
      deviceCores: navigator.hardwareConcurrency || 2,
      batteryLevel: this.getBatteryLevel(),
      isLowPowerMode: this.isLowPowerMode(),
      
      // User context
      crisisLevel: this.getCurrentCrisisLevel(),
      timeInCrisis: this.getTimeInCrisis(),
      panicModeActive: this.isPanicModeActive(),
      
      timestamp: now,
      sessionId: this.sessionId
    };

    this.metrics.push(currentMetrics);
    
    // Keep only last 50 metrics for performance
    if (this.metrics.length > 50) {
      this.metrics.shift();
    }

    // Check for crisis-level performance issues
    this.checkCrisisThresholds(currentMetrics);
  }

  private checkCrisisThresholds(metrics: MobileCrisisMetrics): void {
    const thresholds = this.thresholds.critical;
    
    // Check each metric against crisis thresholds
    if (metrics.largestContentfulPaint > thresholds.lcp) {
      this.triggerCrisisAlert('lcp-critical', metrics.largestContentfulPaint);
    }
    
    if (metrics.firstInputDelay > thresholds.fid) {
      this.triggerCrisisAlert('fid-critical', metrics.firstInputDelay);
    }
    
    if (metrics.cumulativeLayoutShift > thresholds.cls) {
      this.triggerCrisisAlert('cls-critical', metrics.cumulativeLayoutShift);
    }
    
    if (metrics.firstContentfulPaint > thresholds.fcp) {
      this.triggerCrisisAlert('fcp-critical', metrics.firstContentfulPaint);
    }
    
    if (metrics.timeToFirstByte > thresholds.ttfb) {
      this.triggerCrisisAlert('ttfb-critical', metrics.timeToFirstByte);
    }

    // Crisis-specific checks
    if (metrics.crisisResourceLoadTime > thresholds.lcp) {
      this.triggerCrisisAlert('crisis-resource-critical', metrics.crisisResourceLoadTime);
    }
    
    if (metrics.emergencyButtonResponseTime > thresholds.fid) {
      this.triggerCrisisAlert('emergency-button-critical', metrics.emergencyButtonResponseTime);
    }
  }

  private triggerCrisisAlert(type: string, value: number | string): void {
    const alert: CrisisPerformanceAlert = {
      type,
      value,
      severity: this.determineSeverity(type, value),
      timestamp: Date.now(),
      sessionId: this.sessionId,
      crisisLevel: this.getCurrentCrisisLevel(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log crisis-level alerts immediately
    if (alert.severity === 'critical') {
      console.error(`🚨 CRISIS PERFORMANCE ALERT: ${type} = ${value}`);
    } else {
      console.warn(`⚠️ Performance warning: ${type} = ${value}`);
    }

    // Notify all alert handlers
    this.alerts.forEach(handler => {
      try {
        handler(alert);
      } catch (error) {
        console.error('Crisis alert handler error:', error);
      }
    });

    // Send to monitoring API
    this.sendCrisisAlert(alert);
  }

  private determineSeverity(type: string, value: number | string): 'warning' | 'critical' {
    if (type.includes('critical') || type.includes('crisis')) {
      return 'critical';
    }
    
    if (typeof value === 'number') {
      if (type.includes('lcp') && value > this.thresholds.emergency.lcp) return 'critical';
      if (type.includes('fid') && value > this.thresholds.emergency.fid) return 'critical';
      if (type.includes('cls') && value > this.thresholds.emergency.cls) return 'critical';
    }
    
    return 'warning';
  }

  private async sendCrisisAlert(alert: CrisisPerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/crisis-performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.warn('Failed to send crisis alert:', error);
    }
  }

  // Metric recording methods
  private recordLCP(value: number): void { this.latestMetrics.lcp = value; }
  private recordFID(value: number): void { this.latestMetrics.fid = value; }
  private recordCLS(value: number): void { this.latestMetrics.cls = value; }
  private recordFCP(value: number): void { this.latestMetrics.fcp = value; }
  private recordTTFB(value: number): void { this.latestMetrics.ttfb = value; }
  private recordCrisisResourceLoad(value: number): void { this.latestMetrics.crisisResourceLoad = value; }
  private recordEmergencyButtonResponse(value: number): void { this.latestMetrics.emergencyButtonResponse = value; }
  private recordOfflineResourceAvailability(value: number): void { this.latestMetrics.offlineResourceAvailability = value; }
  private recordBatteryMetrics(level: number, charging: boolean): void {
    this.latestMetrics.batteryLevel = level;
    this.latestMetrics.isCharging = charging;
  }
  private recordMemoryPressure(value: number): void { this.latestMetrics.memoryPressure = value; }
  private recordConnectionMetrics(type: string, downlink: number, rtt: number): void {
    this.latestMetrics.connectionType = type;
    this.latestMetrics.downlink = downlink;
    this.latestMetrics.rtt = rtt;
  }
  private recordConnectionStatus(online: boolean): void { this.latestMetrics.isOnline = online; }
  private updateAccessibilityMetrics(metrics: any): void { this.latestMetrics.accessibility = metrics; }

  // Current state tracking
  private latestMetrics: any = {};

  // Getter methods
  private getLatestLCP(): number { return this.latestMetrics.lcp || 0; }
  private getLatestFID(): number { return this.latestMetrics.fid || 0; }
  private getLatestCLS(): number { return this.latestMetrics.cls || 0; }
  private getLatestFCP(): number { return this.latestMetrics.fcp || 0; }
  private getLatestTTFB(): number { return this.latestMetrics.ttfb || 0; }
  private getLatestCrisisResourceLoad(): number { return this.latestMetrics.crisisResourceLoad || 0; }
  private getLatestEmergencyButtonResponse(): number { return this.latestMetrics.emergencyButtonResponse || 0; }
  private getLatestOfflineResourceAvailability(): number { return this.latestMetrics.offlineResourceAvailability || 0; }
  private getLatestBatteryImpact(): number { return this.calculateBatteryImpact(); }
  private getLatestMemoryPressure(): number { return this.latestMetrics.memoryPressure || 0; }
  private getConnectionType(): string { return this.latestMetrics.connectionType || 'unknown'; }
  private getDeviceMemory(): number { return (navigator as any).deviceMemory || 2; }
  private getBatteryLevel(): number | undefined { return this.latestMetrics.batteryLevel; }
  private isLowPowerMode(): boolean { return this.getBatteryLevel() ? this.getBatteryLevel()! < 0.2 : false; }
  private getAccessibilityState(): any { return this.latestMetrics.accessibility || {}; }
  
  private getCurrentCrisisLevel(): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    // Determine crisis level based on current state
    const body = document.body;
    if (body.classList.contains('crisis-critical')) return 'critical';
    if (body.classList.contains('crisis-high')) return 'high';
    if (body.classList.contains('crisis-medium')) return 'medium';
    if (body.classList.contains('crisis-low')) return 'low';
    return 'none';
  }
  
  private getTimeInCrisis(): number {
    // Calculate time since crisis mode was activated
    const crisisStart = parseInt(sessionStorage.getItem('crisis_start_time') || '0');
    return crisisStart ? Date.now() - crisisStart : 0;
  }
  
  private isPanicModeActive(): boolean {
    return document.body.classList.contains('panic-mode') || 
           document.body.classList.contains('emergency-mode');
  }

  private calculateBatteryImpact(): number {
    // Calculate battery drain rate (simplified)
    const level = this.getBatteryLevel();
    if (!level) return 0;
    
    const timeElapsed = Date.now() - this.startTime;
    const estimatedDrain = timeElapsed / (1000 * 60 * 60); // Hours
    return Math.max(0, Math.min(1, estimatedDrain * 0.1)); // Rough estimate
  }

  // Public API methods
  public getLatestMetrics(): MobileCrisisMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  public getAllMetrics(): MobileCrisisMetrics[] {
    return [...this.metrics];
  }

  public getCrisisPerformanceGrade(): CrisisPerformanceGrade {
    const latest = this.getLatestMetrics();
    if (!latest) return { overall: 'unknown', grades: {} };

    const grades = {
      lcp: this.gradeMetric('lcp', latest.largestContentfulPaint),
      fid: this.gradeMetric('fid', latest.firstInputDelay),
      cls: this.gradeMetric('cls', latest.cumulativeLayoutShift),
      crisisResponse: this.gradeMetric('crisis', latest.crisisResourceLoadTime),
      accessibility: this.gradeAccessibility(latest)
    };

    // Calculate overall grade with crisis weighting
    const gradeValues = Object.values(grades).filter(g => g !== 'unknown');
    const criticalCount = gradeValues.filter(g => g === 'critical').length;
    const poorCount = gradeValues.filter(g => g === 'poor').length;

    let overall: CrisisPerformanceGrade['overall'];
    if (criticalCount > 0) {
      overall = 'critical';
    } else if (poorCount > 0) {
      overall = 'poor';
    } else if (gradeValues.some(g => g === 'needs-improvement')) {
      overall = 'needs-improvement';
    } else if (gradeValues.length > 0) {
      overall = 'good';
    } else {
      overall = 'unknown';
    }

    return { overall, grades };
  }

  private gradeMetric(metric: string, value: number): string {
    const critical = this.thresholds.critical as any;
    const emergency = this.thresholds.emergency as any;
    
    if (metric === 'crisis') {
      if (value <= critical.lcp) return 'good';
      if (value <= emergency.lcp) return 'needs-improvement';
      if (value <= emergency.lcp * 2) return 'poor';
      return 'critical';
    }
    
    const criticalThreshold = critical[metric];
    const emergencyThreshold = emergency[metric];
    
    if (!criticalThreshold) return 'unknown';
    
    if (value <= criticalThreshold) return 'good';
    if (value <= emergencyThreshold) return 'needs-improvement';
    if (value <= emergencyThreshold * 2) return 'poor';
    return 'critical';
  }

  private gradeAccessibility(metrics: MobileCrisisMetrics): string {
    // Grade accessibility based on active features and crisis level
    const accessibilityScore = 
      (metrics.tremorCompensationActive ? 1 : 0) +
      (metrics.highContrastMode ? 1 : 0) +
      (metrics.reducedMotionActive ? 1 : 0) +
      (metrics.oneHandedModeActive ? 1 : 0);
    
    if (metrics.crisisLevel === 'critical' && accessibilityScore >= 3) return 'good';
    if (metrics.crisisLevel === 'high' && accessibilityScore >= 2) return 'good';
    if (accessibilityScore >= 1) return 'needs-improvement';
    return 'poor';
  }

  public onAlert(callback: (alert: CrisisPerformanceAlert) => void): () => void {
    this.alerts.push(callback);
    return () => {
      const index = this.alerts.indexOf(callback);
      if (index > -1) {
        this.alerts.splice(index, 1);
      }
    };
  }

  public exportCrisisReport(): string {
    const report = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: Date.now(),
      metrics: this.metrics,
      performanceGrade: this.getCrisisPerformanceGrade(),
      userAgent: navigator.userAgent,
      deviceCapabilities: {
        memory: (navigator as any).deviceMemory,
        cores: navigator.hardwareConcurrency,
        connection: (navigator as any).connection?.effectiveType
      }
    };
    
    return JSON.stringify(report, null, 2);
  }

  public destroy(): void {
    // Clean up all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.alerts.length = 0;
    this.metrics.length = 0;
  }
}

export interface CrisisPerformanceAlert {
  type: string;
  value: number | string;
  severity: 'warning' | 'critical';
  timestamp: number;
  sessionId: string;
  crisisLevel: string;
  userAgent: string;
  url: string;
}

export interface CrisisPerformanceGrade {
  overall: 'good' | 'needs-improvement' | 'poor' | 'critical' | 'unknown';
  grades: {
    lcp?: string;
    fid?: string;
    cls?: string;
    crisisResponse?: string;
    accessibility?: string;
  };
}

// Singleton instance
export const mobileCoreWebVitals = MobileCoreWebVitals.getInstance();

// React hook for crisis performance monitoring
export function useMobileCrisisPerformance() {
  const monitor = mobileCoreWebVitals;
  
  return {
    latestMetrics: monitor.getLatestMetrics(),
    performanceGrade: monitor.getCrisisPerformanceGrade(),
    exportReport: () => monitor.exportCrisisReport(),
    onAlert: (callback: (alert: CrisisPerformanceAlert) => void) => monitor.onAlert(callback)
  };
}