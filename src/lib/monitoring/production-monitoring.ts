/**
 * ALCHM Production Monitoring System
 * 
 * Comprehensive monitoring for trauma-informed mental health application
 * with crisis-aware alerting and performance tracking.
 */

export interface MonitoringMetric {
  name: string;
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'error' | 'user_experience' | 'crisis' | 'security';
}

export interface AlertConfig {
  metric: string;
  threshold: number;
  comparison: 'gt' | 'lt' | 'eq';
  duration: number; // milliseconds
  severity: 'warning' | 'error' | 'critical';
  crisisRelated: boolean;
}

export interface CrisisMetric {
  timestamp: Date;
  type: 'crisis_button_click' | 'emergency_call' | 'crisis_text' | 'error_during_crisis';
  responseTime?: number;
  success: boolean;
  metadata?: Record<string, any>;
}

class ProductionMonitoring {
  private metrics: Map<string, MonitoringMetric[]> = new Map();
  private alerts: AlertConfig[] = [];
  private crisisMetrics: CrisisMetric[] = [];
  private isProduction: boolean;
  private monitoringEnabled: boolean = true;
  private alertCallbacks: Array<(alert: any) => void> = [];

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.initializeDefaultAlerts();
    this.startPerformanceMonitoring();
    this.startCrisisMonitoring();
    this.startHealthChecks();
  }

  /**
   * Core Web Vitals and Performance Monitoring
   */
  trackCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as any[];
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric({
        name: 'core_web_vital_lcp',
        value: lastEntry.renderTime || lastEntry.loadTime,
        timestamp: new Date(),
        tags: { type: 'performance', critical_for: 'crisis_access' },
        priority: lastEntry.renderTime > 2500 ? 'critical' : 'medium',
        category: 'performance'
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as any[];
      entries.forEach(entry => {
        this.recordMetric({
          name: 'core_web_vital_fid',
          value: entry.processingStart - entry.startTime,
          timestamp: new Date(),
          tags: { type: 'performance', critical_for: 'crisis_interaction' },
          priority: entry.processingStart - entry.startTime > 100 ? 'critical' : 'medium',
          category: 'performance'
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as any[];
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.recordMetric({
        name: 'core_web_vital_cls',
        value: clsValue,
        timestamp: new Date(),
        tags: { type: 'performance', critical_for: 'trauma_safe_ui' },
        priority: clsValue > 0.02 ? 'critical' : 'medium', // Trauma-informed threshold
        category: 'performance'
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Crisis-Specific Performance Monitoring
   */
  trackCrisisPerformance(action: string, startTime: number): void {
    const endTime = performance.now();
    const duration = endTime - startTime;

    const crisisMetric: CrisisMetric = {
      timestamp: new Date(),
      type: action as any,
      responseTime: duration,
      success: duration < 1000, // Crisis actions must be under 1 second
      metadata: {
        action,
        duration,
        threshold_met: duration < 1000
      }
    };

    this.crisisMetrics.push(crisisMetric);

    // Record as monitoring metric
    this.recordMetric({
      name: 'crisis_action_performance',
      value: duration,
      timestamp: new Date(),
      tags: { 
        action, 
        critical: 'true',
        success: duration < 1000 ? 'true' : 'false'
      },
      priority: duration > 1000 ? 'critical' : 'high',
      category: 'crisis'
    });

    // Immediate alert for slow crisis actions
    if (duration > 1000) {
      this.triggerAlert({
        type: 'crisis_performance_degradation',
        message: `Crisis action "${action}" took ${duration.toFixed(0)}ms (threshold: 1000ms)`,
        severity: 'critical',
        metadata: crisisMetric
      });
    }
  }

  /**
   * User Experience Monitoring
   */
  trackUserExperience(event: {
    type: 'page_load' | 'interaction' | 'error' | 'abandonment';
    page?: string;
    duration?: number;
    success: boolean;
    emotionalContext?: 'calm' | 'neutral' | 'distressed' | 'crisis';
    metadata?: Record<string, any>;
  }): void {
    this.recordMetric({
      name: 'user_experience_event',
      value: event.duration || 0,
      timestamp: new Date(),
      tags: {
        event_type: event.type,
        page: event.page || 'unknown',
        success: event.success ? 'true' : 'false',
        emotional_context: event.emotionalContext || 'unknown'
      },
      priority: event.emotionalContext === 'crisis' ? 'critical' : 'medium',
      category: 'user_experience'
    });

    // Track emotional context patterns
    if (event.emotionalContext) {
      this.trackEmotionalContextMetric(event.emotionalContext, event.success);
    }
  }

  /**
   * Error and Exception Monitoring
   */
  trackError(error: {
    message: string;
    stack?: string;
    component?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    crisisContext?: boolean;
    userState?: string;
    recoveryAction?: string;
  }): void {
    this.recordMetric({
      name: 'application_error',
      value: this.severityToNumber(error.severity),
      timestamp: new Date(),
      tags: {
        component: error.component || 'unknown',
        severity: error.severity,
        crisis_context: error.crisisContext ? 'true' : 'false',
        user_state: error.userState || 'unknown',
        recovery_action: error.recoveryAction || 'none'
      },
      priority: error.severity === 'critical' ? 'critical' : 
                error.crisisContext ? 'high' : 'medium',
      category: 'error'
    });

    // Critical or crisis-related errors trigger immediate alerts
    if (error.severity === 'critical' || error.crisisContext) {
      this.triggerAlert({
        type: 'critical_application_error',
        message: `${error.severity.toUpperCase()} error: ${error.message}`,
        severity: error.severity === 'critical' ? 'critical' : 'error',
        metadata: {
          component: error.component,
          crisisContext: error.crisisContext,
          stack: error.stack?.substring(0, 500) // Truncate for logging
        }
      });
    }
  }

  /**
   * Security Event Monitoring
   */
  trackSecurityEvent(event: {
    type: 'auth_failure' | 'rate_limit' | 'bot_detection' | 'data_breach_attempt';
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    metadata?: Record<string, any>;
  }): void {
    this.recordMetric({
      name: 'security_event',
      value: this.severityToNumber(event.severity),
      timestamp: new Date(),
      tags: {
        event_type: event.type,
        severity: event.severity,
        source: event.source
      },
      priority: event.severity === 'critical' ? 'critical' : 'high',
      category: 'security'
    });

    // All security events above 'low' trigger alerts
    if (event.severity !== 'low') {
      this.triggerAlert({
        type: 'security_incident',
        message: `Security event: ${event.type} from ${event.source}`,
        severity: event.severity === 'critical' ? 'critical' : 'warning',
        metadata: event.metadata
      });
    }
  }

  /**
   * Business Metrics for Mental Health App
   */
  trackWellnessMetrics(metrics: {
    journalEntriesCreated: number;
    crisisButtonClicks: number;
    userRetention: number;
    pathwayCompletions: number;
    emergencyEscalations: number;
  }): void {
    Object.entries(metrics).forEach(([key, value]) => {
      this.recordMetric({
        name: `wellness_metric_${key}`,
        value,
        timestamp: new Date(),
        tags: { metric_type: 'wellness', category: 'business' },
        priority: key === 'emergencyEscalations' && value > 0 ? 'critical' : 'low',
        category: key === 'crisisButtonClicks' ? 'crisis' : 'user_experience'
      });
    });
  }

  /**
   * Alert Management
   */
  addAlert(config: AlertConfig): void {
    this.alerts.push(config);
  }

  private triggerAlert(alert: {
    type: string;
    message: string;
    severity: 'warning' | 'error' | 'critical';
    metadata?: any;
  }): void {
    const alertData = {
      ...alert,
      timestamp: new Date(),
      environment: this.isProduction ? 'production' : 'development'
    };

    // Call registered alert callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alertData);
      } catch (error) {
        console.error('Alert callback failed:', error);
      }
    });

    // Send to monitoring service
    this.sendToMonitoringService(alertData);

    // Log locally for debugging
    console.error('[ALCHM ALERT]', alertData);
  }

  onAlert(callback: (alert: any) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Health Checks
   */
  private startHealthChecks(): void {
    setInterval(() => {
      this.performHealthCheck();
    }, 60000); // Every minute

    // Initial health check
    this.performHealthCheck();
  }

  private async performHealthCheck(): Promise<void> {
    const healthMetrics = {
      memory_usage: this.getMemoryUsage(),
      local_storage_usage: this.getLocalStorageUsage(),
      connection_quality: await this.checkConnectionQuality(),
      crisis_systems_responsive: await this.checkCrisisSystems()
    };

    Object.entries(healthMetrics).forEach(([key, value]) => {
      this.recordMetric({
        name: `health_check_${key}`,
        value: typeof value === 'boolean' ? (value ? 1 : 0) : value,
        timestamp: new Date(),
        tags: { type: 'health_check' },
        priority: key === 'crisis_systems_responsive' && !value ? 'critical' : 'low',
        category: key === 'crisis_systems_responsive' ? 'crisis' : 'performance'
      });
    });

    // Alert if crisis systems are not responsive
    if (!healthMetrics.crisis_systems_responsive) {
      this.triggerAlert({
        type: 'crisis_systems_unresponsive',
        message: 'Crisis support systems are not responding',
        severity: 'critical',
        metadata: healthMetrics
      });
    }
  }

  /**
   * Data Collection and Reporting
   */
  getMetricsSummary(
    startTime: Date, 
    endTime: Date
  ): {
    performance: any;
    errors: any;
    crisis: any;
    userExperience: any;
  } {
    const timeRange = { startTime, endTime };
    
    return {
      performance: this.summarizeMetricsByCategory('performance', timeRange),
      errors: this.summarizeMetricsByCategory('error', timeRange),
      crisis: this.summarizeMetricsByCategory('crisis', timeRange),
      userExperience: this.summarizeMetricsByCategory('user_experience', timeRange)
    };
  }

  getCrisisMetricsSummary(): {
    totalCrisisInteractions: number;
    averageResponseTime: number;
    successRate: number;
    recentCrisisEvents: CrisisMetric[];
  } {
    const total = this.crisisMetrics.length;
    const successful = this.crisisMetrics.filter(m => m.success).length;
    const avgResponseTime = this.crisisMetrics
      .filter(m => m.responseTime)
      .reduce((sum, m) => sum + (m.responseTime || 0), 0) / 
      this.crisisMetrics.filter(m => m.responseTime).length;

    return {
      totalCrisisInteractions: total,
      averageResponseTime: avgResponseTime || 0,
      successRate: total > 0 ? successful / total : 1,
      recentCrisisEvents: this.crisisMetrics.slice(-10)
    };
  }

  /**
   * Private Helper Methods
   */
  private recordMetric(metric: MonitoringMetric): void {
    if (!this.monitoringEnabled) return;

    const key = metric.name;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const metrics = this.metrics.get(key)!;
    metrics.push(metric);

    // Keep only last 1000 metrics per type
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }

    // Check if metric triggers any alerts
    this.checkAlerts(metric);
  }

  private checkAlerts(metric: MonitoringMetric): void {
    this.alerts.forEach(alert => {
      if (alert.metric === metric.name) {
        const triggered = this.evaluateAlert(alert, metric);
        if (triggered) {
          this.triggerAlert({
            type: 'metric_threshold_exceeded',
            message: `Alert: ${alert.metric} ${alert.comparison} ${alert.threshold}`,
            severity: alert.severity,
            metadata: { alert, metric }
          });
        }
      }
    });
  }

  private evaluateAlert(alert: AlertConfig, metric: MonitoringMetric): boolean {
    switch (alert.comparison) {
      case 'gt': return metric.value > alert.threshold;
      case 'lt': return metric.value < alert.threshold;
      case 'eq': return metric.value === alert.threshold;
      default: return false;
    }
  }

  private initializeDefaultAlerts(): void {
    // Crisis-critical alerts
    this.addAlert({
      metric: 'crisis_action_performance',
      threshold: 1000,
      comparison: 'gt',
      duration: 0,
      severity: 'critical',
      crisisRelated: true
    });

    // Performance alerts
    this.addAlert({
      metric: 'core_web_vital_lcp',
      threshold: 2500,
      comparison: 'gt',
      duration: 5000,
      severity: 'warning',
      crisisRelated: false
    });

    // Error rate alerts
    this.addAlert({
      metric: 'application_error',
      threshold: 3, // Critical level
      comparison: 'eq',
      duration: 0,
      severity: 'error',
      crisisRelated: false
    });
  }

  private startPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.trackCoreWebVitals();

    // Monitor navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      
      this.recordMetric({
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        timestamp: new Date(),
        tags: { type: 'navigation' },
        priority: 'medium',
        category: 'performance'
      });
    });
  }

  private startCrisisMonitoring(): void {
    // Monitor crisis button interactions
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.matches('[data-crisis-button], .crisis-button, [href="tel:988"]')) {
        this.trackCrisisPerformance('crisis_button_click', performance.now());
      }
    });
  }

  // Utility methods
  private trackEmotionalContextMetric(context: string, success: boolean): void {
    this.recordMetric({
      name: 'emotional_context_interaction',
      value: success ? 1 : 0,
      timestamp: new Date(),
      tags: { emotional_context: context, success: success.toString() },
      priority: context === 'crisis' ? 'critical' : 'medium',
      category: 'user_experience'
    });
  }

  private severityToNumber(severity: string): number {
    const map: Record<string, number> = {
      'low': 1, 'medium': 2, 'high': 3, 'critical': 4
    };
    return map[severity] || 0;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getLocalStorageUsage(): number {
    if (typeof localStorage === 'undefined') return 0;
    
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total / 1024; // KB
  }

  private async checkConnectionQuality(): Promise<number> {
    if (!navigator.onLine) return 0;
    
    try {
      const start = performance.now();
      await fetch('/api/ping', { method: 'HEAD' });
      const end = performance.now();
      return end - start;
    } catch {
      return -1; // Connection failed
    }
  }

  private async checkCrisisSystems(): Promise<boolean> {
    // Check if crisis support systems are accessible
    try {
      // These should be lightweight checks
      const crisisElementExists = document.querySelector('[data-crisis-support]') !== null;
      const emergencyContactsAccessible = document.querySelector('[href="tel:988"]') !== null;
      
      return crisisElementExists && emergencyContactsAccessible;
    } catch {
      return false;
    }
  }

  private summarizeMetricsByCategory(category: string, timeRange: any): any {
    const categoryMetrics = Array.from(this.metrics.values())
      .flat()
      .filter(m => m.category === category)
      .filter(m => m.timestamp >= timeRange.startTime && m.timestamp <= timeRange.endTime);

    if (categoryMetrics.length === 0) return { count: 0 };

    const values = categoryMetrics.map(m => m.value);
    return {
      count: categoryMetrics.length,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: categoryMetrics[categoryMetrics.length - 1]
    };
  }

  private async sendToMonitoringService(data: any): Promise<void> {
    if (!this.isProduction) return;

    try {
      await fetch('/api/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }
}

// Singleton instance
export const monitoring = new ProductionMonitoring();

// React hook for component use
export function useMonitoring() {
  return {
    trackCrisisPerformance: (action: string, startTime: number) => 
      monitoring.trackCrisisPerformance(action, startTime),
    trackUserExperience: (event: any) => monitoring.trackUserExperience(event),
    trackError: (error: any) => monitoring.trackError(error),
    trackSecurityEvent: (event: any) => monitoring.trackSecurityEvent(event),
    getMetricsSummary: (start: Date, end: Date) => monitoring.getMetricsSummary(start, end),
    getCrisisMetrics: () => monitoring.getCrisisMetricsSummary(),
    onAlert: (callback: (alert: any) => void) => monitoring.onAlert(callback)
  };
}