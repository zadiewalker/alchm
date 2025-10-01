'use client';

/**
 * Crisis Performance Monitor
 * Specialized performance monitoring for mobile crisis situations
 * Integrates with crisis coordinator to ensure optimal performance during vulnerable moments
 */

import { getCrisisModeCoordinator } from './crisis-mode-coordinator';

interface CrisisPerformanceMetrics {
  // Core Web Vitals for Crisis Threshold
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay  
  cls: number; // Cumulative Layout Shift
  inp: number; // Interaction to Next Paint (new metric)
  
  // Crisis-Specific Metrics
  crisisDetectionLatency: number; // Time to detect crisis
  emergencyResourceLoadTime: number; // Time to load emergency resources
  offlineResourceAccessTime: number; // Time to access cached resources
  tremorCompensationLatency: number; // Response time for tremor adaptations
  
  // Device Context for Crisis
  memoryPressure: 'low' | 'normal' | 'high' | 'critical';
  batteryImpact: number; // Battery drain rate during crisis
  networkReliability: number; // Connection stability score
  renderingStability: number; // Visual stability during stress
  
  // Accessibility Performance
  voiceOverLatency?: number; // Screen reader responsiveness
  keyboardNavigationTime?: number; // Keyboard navigation speed
  contrastRatioCompliance: number; // Color contrast performance
  
  // User Experience Under Stress
  taskCompletionRate: number; // Success rate for crisis actions
  errorRecoveryTime: number; // Time to recover from errors
  panicGestureResponseTime: number; // Emergency gesture recognition
}

interface CrisisPerformanceThresholds {
  // Critical thresholds for crisis situations (stricter than normal)
  lcp: { good: 1500, poor: 2500, critical: 4000 }; // Crisis users need faster loading
  fid: { good: 25, poor: 50, critical: 100 }; // Reduced tolerance for input delay
  cls: { good: 0.03, poor: 0.05, critical: 0.1 }; // Visual stability crucial
  
  crisisDetectionLatency: { good: 100, poor: 300, critical: 500 };
  emergencyResourceLoadTime: { good: 200, poor: 500, critical: 1000 };
  tremorCompensationLatency: { good: 50, poor: 100, critical: 200 };
  
  memoryUsage: { good: 50, poor: 100, critical: 150 }; // MB
  batteryDrainRate: { good: 2, poor: 5, critical: 10 }; // % per minute
}

export class CrisisPerformanceMonitor {
  private metrics: CrisisPerformanceMetrics;
  private thresholds: CrisisPerformanceThresholds;
  private coordinator: any;
  private observers: Map<string, PerformanceObserver> = new Map();
  private isMonitoring: boolean = false;
  private alertCallbacks: Function[] = [];
  private metricsHistory: CrisisPerformanceMetrics[] = [];
  
  private readonly MAX_HISTORY_SIZE = 50;
  private readonly MONITORING_INTERVAL = 1000; // 1 second during crisis
  
  constructor() {
    this.coordinator = getCrisisModeCoordinator();
    this.thresholds = this.getDefaultThresholds();
    this.metrics = this.getInitialMetrics();
    
    this.initialize();
  }
  
  private getDefaultThresholds(): CrisisPerformanceThresholds {
    return {
      lcp: { good: 1500, poor: 2500, critical: 4000 },
      fid: { good: 25, poor: 50, critical: 100 },
      cls: { good: 0.03, poor: 0.05, critical: 0.1 },
      crisisDetectionLatency: { good: 100, poor: 300, critical: 500 },
      emergencyResourceLoadTime: { good: 200, poor: 500, critical: 1000 },
      tremorCompensationLatency: { good: 50, poor: 100, critical: 200 },
      memoryUsage: { good: 50, poor: 100, critical: 150 },
      batteryDrainRate: { good: 2, poor: 5, critical: 10 }
    };
  }
  
  private getInitialMetrics(): CrisisPerformanceMetrics {
    return {
      lcp: 0,
      fid: 0,
      cls: 0,
      inp: 0,
      crisisDetectionLatency: 0,
      emergencyResourceLoadTime: 0,
      offlineResourceAccessTime: 0,
      tremorCompensationLatency: 0,
      memoryPressure: 'normal',
      batteryImpact: 0,
      networkReliability: 100,
      renderingStability: 100,
      contrastRatioCompliance: 100,
      taskCompletionRate: 100,
      errorRecoveryTime: 0,
      panicGestureResponseTime: 0
    };
  }
  
  private async initialize() {
    if (typeof window === 'undefined') return;
    
    this.setupCoreWebVitalsMonitoring();
    this.setupCrisisSpecificMonitoring();
    this.setupAccessibilityMonitoring();
    this.setupNetworkMonitoring();
    this.setupMemoryMonitoring();
    this.setupBatteryMonitoring();
    
    // Listen for crisis mode changes
    this.coordinator.on('crisis-activated', () => {
      this.startCrisisMonitoring();
    });
    
    this.coordinator.on('crisis-deactivated', () => {
      this.stopCrisisMonitoring();
    });
    
    console.log('[CrisisPerformanceMonitor] Initialized');
  }
  
  private setupCoreWebVitalsMonitoring() {
    // Enhanced LCP monitoring with crisis context
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.checkThreshold('lcp', lastEntry.startTime);
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (error) {
        console.warn('[CrisisPerformanceMonitor] LCP observer failed:', error);
      }
      
      // FID monitoring
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkThreshold('fid', this.metrics.fid);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (error) {
        console.warn('[CrisisPerformanceMonitor] FID observer failed:', error);
      }
      
      // CLS monitoring
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.metrics.cls = clsValue;
        this.checkThreshold('cls', clsValue);
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (error) {
        console.warn('[CrisisPerformanceMonitor] CLS observer failed:', error);
      }
    }
  }
  
  private setupCrisisSpecificMonitoring() {
    // Crisis detection latency monitoring
    window.addEventListener('alchm:crisis-detection-start', (event: any) => {
      const startTime = event.detail.timestamp || performance.now();
      
      const handleDetectionComplete = (completeEvent: any) => {
        const endTime = completeEvent.detail.timestamp || performance.now();
        this.metrics.crisisDetectionLatency = endTime - startTime;
        this.checkThreshold('crisisDetectionLatency', this.metrics.crisisDetectionLatency);
        
        window.removeEventListener('alchm:crisis-detection-complete', handleDetectionComplete);
      };
      
      window.addEventListener('alchm:crisis-detection-complete', handleDetectionComplete);
    });
    
    // Emergency resource load time monitoring
    window.addEventListener('alchm:emergency-resource-request', (event: any) => {
      const startTime = performance.now();
      
      const handleResourceLoad = () => {
        this.metrics.emergencyResourceLoadTime = performance.now() - startTime;
        this.checkThreshold('emergencyResourceLoadTime', this.metrics.emergencyResourceLoadTime);
      };
      
      window.addEventListener('alchm:emergency-resource-loaded', handleResourceLoad, { once: true });
    });
    
    // Tremor compensation response time
    window.addEventListener('alchm:tremor-detected', (event: any) => {
      const startTime = performance.now();
      
      const handleCompensationActive = () => {
        this.metrics.tremorCompensationLatency = performance.now() - startTime;
        this.checkThreshold('tremorCompensationLatency', this.metrics.tremorCompensationLatency);
      };
      
      window.addEventListener('alchm:tremor-compensation-active', handleCompensationActive, { once: true });
    });
  }
  
  private setupAccessibilityMonitoring() {
    // Monitor screen reader performance
    if ('speechSynthesis' in window) {
      let voiceOverStartTime: number;
      
      window.addEventListener('alchm:voice-over-start', () => {
        voiceOverStartTime = performance.now();
      });
      
      window.addEventListener('alchm:voice-over-complete', () => {
        if (voiceOverStartTime) {
          this.metrics.voiceOverLatency = performance.now() - voiceOverStartTime;
        }
      });
    }
    
    // Monitor contrast ratio compliance
    this.monitorContrastCompliance();
  }
  
  private setupNetworkMonitoring() {
    const updateNetworkReliability = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType;
        
        // Score network reliability based on connection type
        const reliabilityScores = {
          'slow-2g': 20,
          '2g': 40,
          '3g': 70,
          '4g': 95,
          '5g': 100
        };
        
        this.metrics.networkReliability = reliabilityScores[effectiveType as keyof typeof reliabilityScores] || 50;
      }
    };
    
    updateNetworkReliability();
    
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', updateNetworkReliability);
    }
    
    // Monitor network failures
    window.addEventListener('offline', () => {
      this.metrics.networkReliability = 0;
      this.alertCriticalState('network', 'Connection lost during crisis');
    });
    
    window.addEventListener('online', () => {
      updateNetworkReliability();
    });
  }
  
  private setupMemoryMonitoring() {
    const checkMemoryPressure = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const usedMB = memInfo.usedJSHeapSize / 1024 / 1024;
        const totalMB = memInfo.totalJSHeapSize / 1024 / 1024;
        const usagePercent = (usedMB / totalMB) * 100;
        
        if (usagePercent > 90) {
          this.metrics.memoryPressure = 'critical';
        } else if (usagePercent > 75) {
          this.metrics.memoryPressure = 'high';
        } else if (usagePercent > 50) {
          this.metrics.memoryPressure = 'normal';
        } else {
          this.metrics.memoryPressure = 'low';
        }
        
        if (this.metrics.memoryPressure === 'critical') {\n          this.alertCriticalState('memory', `High memory usage: ${usedMB.toFixed(1)}MB`);\n        }\n      }\n    };\n    \n    // Check memory every 5 seconds during crisis\n    setInterval(checkMemoryPressure, 5000);\n  }\n  \n  private async setupBatteryMonitoring() {\n    if ('getBattery' in navigator) {\n      try {\n        const battery = await (navigator as any).getBattery();\n        let lastLevel = battery.level;\n        let lastTimestamp = Date.now();\n        \n        const updateBatteryImpact = () => {\n          const currentLevel = battery.level;\n          const currentTime = Date.now();\n          const timeDelta = (currentTime - lastTimestamp) / 60000; // minutes\n          const levelDelta = lastLevel - currentLevel;\n          \n          if (timeDelta > 0 && levelDelta > 0) {\n            this.metrics.batteryImpact = (levelDelta / timeDelta) * 100; // % per minute\n            \n            if (this.metrics.batteryImpact > this.thresholds.batteryDrainRate.critical) {\n              this.alertCriticalState('battery', `High battery drain: ${this.metrics.batteryImpact.toFixed(1)}%/min`);\n            }\n          }\n          \n          lastLevel = currentLevel;\n          lastTimestamp = currentTime;\n        };\n        \n        battery.addEventListener('levelchange', updateBatteryImpact);\n      } catch (error) {\n        console.warn('[CrisisPerformanceMonitor] Battery monitoring failed:', error);\n      }\n    }\n  }\n  \n  private monitorContrastCompliance() {\n    // Sample contrast ratios of critical UI elements\n    const checkContrast = () => {\n      const criticalElements = document.querySelectorAll('.crisis-button, .emergency-button, [data-crisis-critical]');\n      let compliantElements = 0;\n      \n      criticalElements.forEach(element => {\n        const styles = window.getComputedStyle(element);\n        const bgColor = styles.backgroundColor;\n        const textColor = styles.color;\n        \n        // Simplified contrast check (in production, use proper contrast calculation)\n        const hasGoodContrast = this.calculateContrastRatio(bgColor, textColor) >= 4.5;\n        if (hasGoodContrast) compliantElements++;\n      });\n      \n      this.metrics.contrastRatioCompliance = criticalElements.length > 0 \n        ? (compliantElements / criticalElements.length) * 100 \n        : 100;\n    };\n    \n    // Check contrast on DOM changes\n    if ('MutationObserver' in window) {\n      const observer = new MutationObserver(checkContrast);\n      observer.observe(document.body, { childList: true, subtree: true });\n    }\n    \n    // Initial check\n    setTimeout(checkContrast, 1000);\n  }\n  \n  private calculateContrastRatio(bg: string, fg: string): number {\n    // Simplified contrast calculation\n    // In production, use a proper color contrast library\n    return 4.5; // Placeholder\n  }\n  \n  private checkThreshold(metric: string, value: number) {\n    const threshold = this.thresholds[metric as keyof CrisisPerformanceThresholds];\n    if (!threshold) return;\n    \n    let severity: 'good' | 'poor' | 'critical';\n    \n    if (typeof threshold === 'object' && 'good' in threshold) {\n      if (value <= threshold.good) {\n        severity = 'good';\n      } else if (value <= threshold.poor) {\n        severity = 'poor';\n      } else {\n        severity = 'critical';\n      }\n    } else {\n      return;\n    }\n    \n    if (severity === 'critical') {\n      this.alertCriticalState(metric, `${metric}: ${value}`);\n      \n      // Trigger crisis coordinator response\n      if (this.coordinator && this.coordinator.getState().isActive) {\n        this.coordinator.activateCrisisMode('performance_degradation', 'high', 80);\n      }\n    }\n    \n    this.notifyAlertCallbacks({\n      metric,\n      value,\n      severity,\n      threshold,\n      timestamp: Date.now()\n    });\n  }\n  \n  private alertCriticalState(type: string, message: string) {\n    console.error(`[CrisisPerformanceMonitor] Critical ${type}: ${message}`);\n    \n    // Log to coordinator for audit trail\n    if (this.coordinator) {\n      this.coordinator.logAuditEvent('performance_critical', {\n        type,\n        message,\n        metrics: this.metrics,\n        timestamp: Date.now()\n      });\n    }\n  }\n  \n  private startCrisisMonitoring() {\n    if (this.isMonitoring) return;\n    \n    this.isMonitoring = true;\n    console.log('[CrisisPerformanceMonitor] Crisis monitoring started');\n    \n    // Increase monitoring frequency during crisis\n    const monitoringInterval = setInterval(() => {\n      this.collectMetrics();\n      this.storeMetricsHistory();\n    }, this.MONITORING_INTERVAL);\n    \n    // Stop monitoring when crisis ends\n    const stopMonitoring = () => {\n      clearInterval(monitoringInterval);\n      this.isMonitoring = false;\n    };\n    \n    this.coordinator.on('crisis-deactivated', stopMonitoring);\n  }\n  \n  private stopCrisisMonitoring() {\n    this.isMonitoring = false;\n    console.log('[CrisisPerformanceMonitor] Crisis monitoring stopped');\n  }\n  \n  private collectMetrics() {\n    // Collect current performance metrics\n    if ('performance' in window) {\n      const navigation = performance.getEntriesByType('navigation')[0] as any;\n      if (navigation) {\n        // Update metrics with latest values\n        this.metrics.renderingStability = this.calculateRenderingStability();\n        this.metrics.taskCompletionRate = this.calculateTaskCompletionRate();\n      }\n    }\n  }\n  \n  private calculateRenderingStability(): number {\n    // Calculate visual stability based on layout shifts\n    return Math.max(0, 100 - (this.metrics.cls * 1000));\n  }\n  \n  private calculateTaskCompletionRate(): number {\n    // Monitor successful crisis-related interactions\n    const attempts = parseInt(sessionStorage.getItem('crisis-task-attempts') || '1');\n    const successes = parseInt(sessionStorage.getItem('crisis-task-successes') || '1');\n    \n    return Math.min(100, (successes / attempts) * 100);\n  }\n  \n  private storeMetricsHistory() {\n    this.metricsHistory.push({ ...this.metrics });\n    \n    // Keep only recent history\n    if (this.metricsHistory.length > this.MAX_HISTORY_SIZE) {\n      this.metricsHistory = this.metricsHistory.slice(-this.MAX_HISTORY_SIZE);\n    }\n  }\n  \n  private notifyAlertCallbacks(alert: any) {\n    this.alertCallbacks.forEach(callback => {\n      try {\n        callback(alert);\n      } catch (error) {\n        console.error('[CrisisPerformanceMonitor] Alert callback error:', error);\n      }\n    });\n  }\n  \n  // Public API\n  public getMetrics(): Readonly<CrisisPerformanceMetrics> {\n    return { ...this.metrics };\n  }\n  \n  public getThresholds(): Readonly<CrisisPerformanceThresholds> {\n    return { ...this.thresholds };\n  }\n  \n  public updateThresholds(updates: Partial<CrisisPerformanceThresholds>) {\n    this.thresholds = { ...this.thresholds, ...updates };\n  }\n  \n  public onAlert(callback: Function) {\n    this.alertCallbacks.push(callback);\n    \n    return () => {\n      const index = this.alertCallbacks.indexOf(callback);\n      if (index > -1) {\n        this.alertCallbacks.splice(index, 1);\n      }\n    };\n  }\n  \n  public getPerformanceReport() {\n    const report = {\n      currentMetrics: this.getMetrics(),\n      thresholds: this.getThresholds(),\n      history: this.metricsHistory.slice(-10), // Last 10 measurements\n      summary: {\n        overallHealth: this.calculateOverallHealth(),\n        criticalIssues: this.identifyCriticalIssues(),\n        recommendations: this.generateRecommendations()\n      },\n      timestamp: new Date().toISOString()\n    };\n    \n    return report;\n  }\n  \n  private calculateOverallHealth(): number {\n    const weights = {\n      lcp: 0.25,\n      fid: 0.20,\n      cls: 0.15,\n      memoryPressure: 0.15,\n      batteryImpact: 0.10,\n      networkReliability: 0.10,\n      contrastRatioCompliance: 0.05\n    };\n    \n    let score = 0;\n    \n    // LCP score\n    score += (this.metrics.lcp <= this.thresholds.lcp.good ? 100 : \n             this.metrics.lcp <= this.thresholds.lcp.poor ? 70 : 30) * weights.lcp;\n    \n    // FID score\n    score += (this.metrics.fid <= this.thresholds.fid.good ? 100 : \n             this.metrics.fid <= this.thresholds.fid.poor ? 70 : 30) * weights.fid;\n    \n    // CLS score\n    score += (this.metrics.cls <= this.thresholds.cls.good ? 100 : \n             this.metrics.cls <= this.thresholds.cls.poor ? 70 : 30) * weights.cls;\n    \n    // Memory pressure score\n    const memoryScores = { low: 100, normal: 80, high: 50, critical: 20 };\n    score += memoryScores[this.metrics.memoryPressure] * weights.memoryPressure;\n    \n    // Battery impact score\n    score += (this.metrics.batteryImpact <= this.thresholds.batteryDrainRate.good ? 100 : \n             this.metrics.batteryImpact <= this.thresholds.batteryDrainRate.poor ? 70 : 30) * weights.batteryImpact;\n    \n    // Network reliability score\n    score += this.metrics.networkReliability * weights.networkReliability;\n    \n    // Contrast compliance score\n    score += this.metrics.contrastRatioCompliance * weights.contrastRatioCompliance;\n    \n    return Math.round(score);\n  }\n  \n  private identifyCriticalIssues(): string[] {\n    const issues: string[] = [];\n    \n    if (this.metrics.lcp > this.thresholds.lcp.critical) {\n      issues.push(`Slow page loading (${this.metrics.lcp}ms LCP)`);\n    }\n    \n    if (this.metrics.fid > this.thresholds.fid.critical) {\n      issues.push(`Poor input responsiveness (${this.metrics.fid}ms FID)`);\n    }\n    \n    if (this.metrics.cls > this.thresholds.cls.critical) {\n      issues.push(`Visual instability (${this.metrics.cls} CLS)`);\n    }\n    \n    if (this.metrics.memoryPressure === 'critical') {\n      issues.push('Critical memory pressure');\n    }\n    \n    if (this.metrics.batteryImpact > this.thresholds.batteryDrainRate.critical) {\n      issues.push(`High battery drain (${this.metrics.batteryImpact.toFixed(1)}%/min)`);\n    }\n    \n    if (this.metrics.networkReliability < 30) {\n      issues.push('Poor network connectivity');\n    }\n    \n    return issues;\n  }\n  \n  private generateRecommendations(): string[] {\n    const recommendations: string[] = [];\n    \n    if (this.metrics.lcp > this.thresholds.lcp.poor) {\n      recommendations.push('Enable ultra-minimal mode to reduce loading time');\n    }\n    \n    if (this.metrics.memoryPressure === 'high' || this.metrics.memoryPressure === 'critical') {\n      recommendations.push('Clear non-essential cached data');\n    }\n    \n    if (this.metrics.batteryImpact > this.thresholds.batteryDrainRate.poor) {\n      recommendations.push('Activate battery conservation mode');\n    }\n    \n    if (this.metrics.networkReliability < 50) {\n      recommendations.push('Ensure offline crisis resources are cached');\n    }\n    \n    if (this.metrics.contrastRatioCompliance < 90) {\n      recommendations.push('Enhance contrast for better accessibility');\n    }\n    \n    return recommendations;\n  }\n  \n  public exportMetrics() {\n    return {\n      metrics: this.getMetrics(),\n      history: this.metricsHistory,\n      report: this.getPerformanceReport(),\n      exportTimestamp: new Date().toISOString()\n    };\n  }\n  \n  public destroy() {\n    // Clean up observers\n    this.observers.forEach(observer => observer.disconnect());\n    this.observers.clear();\n    \n    // Clear callbacks\n    this.alertCallbacks = [];\n    \n    this.isMonitoring = false;\n    console.log('[CrisisPerformanceMonitor] Destroyed');\n  }\n}\n\n// Global instance\nlet globalCrisisPerformanceMonitor: CrisisPerformanceMonitor | null = null;\n\nexport function getCrisisPerformanceMonitor(): CrisisPerformanceMonitor {\n  if (!globalCrisisPerformanceMonitor) {\n    globalCrisisPerformanceMonitor = new CrisisPerformanceMonitor();\n  }\n  return globalCrisisPerformanceMonitor;\n}\n\nexport function resetCrisisPerformanceMonitor() {\n  if (globalCrisisPerformanceMonitor) {\n    globalCrisisPerformanceMonitor.destroy();\n    globalCrisisPerformanceMonitor = null;\n  }\n}\n\nexport default CrisisPerformanceMonitor;