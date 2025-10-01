/**
 * CRISIS PERFORMANCE MONITOR
 * 
 * MISSION CRITICAL: Monitors crisis system performance in real-time
 * Ensures sub-100ms emergency response times and alerts when
 * life-safety performance degrades below acceptable thresholds.
 */

import { z } from 'zod';

// Performance monitoring configuration
export const CrisisPerformanceConfig = z.object({
  emergencyResponseTarget: z.number().default(100), // 100ms for emergency actions
  resourceLoadingTarget: z.number().default(3000), // 3 seconds for resource loading
  detectionProcessingTarget: z.number().default(50), // 50ms for crisis detection
  alertThreshold: z.number().default(0.8), // Alert when 80% of target is exceeded
  monitoringInterval: z.number().default(30000), // 30 seconds
  metricsRetentionPeriod: z.number().default(24 * 60 * 60 * 1000), // 24 hours
  enableRealTimeAlerting: z.boolean().default(true),
  enablePerformanceLogging: z.boolean().default(true)
});

// Performance metric schema
export const PerformanceMetric = z.object({
  metricId: z.string(),
  timestamp: z.date(),
  operationType: z.enum([
    'emergency_button_click',
    'crisis_detection',
    'resource_loading',
    'hotline_dial',
    'text_service_access',
    'emergency_bypass_creation',
    'resource_validation',
    'ui_rendering',
    'offline_access'
  ]),
  responseTime: z.number(), // milliseconds
  success: z.boolean(),
  errorCode: z.string().optional(),
  contextData: z.object({
    userAgent: z.string().optional(),
    networkType: z.string().optional(),
    deviceType: z.enum(['mobile', 'desktop', 'tablet']).optional(),
    batteryLevel: z.number().min(0).max(100).optional(),
    isOffline: z.boolean().optional()
  }).optional()
});

export const PerformanceAlert = z.object({
  alertId: z.string(),
  timestamp: z.date(),
  severity: z.enum(['warning', 'critical', 'emergency']),
  alertType: z.enum([
    'response_time_exceeded',
    'system_degradation',
    'resource_unavailable',
    'detection_failure',
    'ui_unresponsive',
    'emergency_system_down'
  ]),
  operationType: z.string(),
  measuredValue: z.number(),
  targetValue: z.number(),
  impact: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  actionRequired: z.boolean(),
  escalationLevel: z.number().min(0).max(5)
});

export type CrisisPerformanceConfigType = z.infer<typeof CrisisPerformanceConfig>;
export type PerformanceMetricType = z.infer<typeof PerformanceMetric>;
export type PerformanceAlertType = z.infer<typeof PerformanceAlert>;

/**
 * Crisis Performance Monitor
 * 
 * Tracks and monitors all crisis-related performance metrics
 * with real-time alerting for performance degradation
 */
export class CrisisPerformanceMonitor {
  private config: CrisisPerformanceConfigType;
  private metrics: Map<string, PerformanceMetricType[]> = new Map();
  private activeAlerts: Map<string, PerformanceAlertType> = new Map();
  private alertCallbacks: Array<(alert: PerformanceAlertType) => void> = [];
  private monitoringInterval: NodeJS.Timer | null = null;
  private isMonitoring = false;

  constructor(config: Partial<CrisisPerformanceConfigType> = {}) {
    this.config = CrisisPerformanceConfig.parse(config);
    this.startMonitoring();
  }

  /**
   * CRITICAL FUNCTION: Record crisis operation performance
   * 
   * @param operation - Type of crisis operation
   * @param responseTime - Time taken in milliseconds
   * @param success - Whether operation succeeded
   * @param context - Additional context data
   */
  public recordMetric(
    operation: PerformanceMetricType['operationType'],
    responseTime: number,
    success: boolean = true,
    context?: PerformanceMetricType['contextData'],
    errorCode?: string
  ): string {
    const metricId = this.generateMetricId();
    const metric: PerformanceMetricType = {
      metricId,
      timestamp: new Date(),
      operationType: operation,
      responseTime,
      success,
      errorCode,
      contextData: context
    };

    // Store metric
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(metric);

    // Check performance thresholds immediately
    this.checkPerformanceThresholds(operation, responseTime, success);

    // Log if enabled
    if (this.config.enablePerformanceLogging) {
      this.logPerformanceMetric(metric);
    }

    // Clean old metrics
    this.cleanupOldMetrics();

    return metricId;
  }

  /**
   * Time a crisis operation and record performance
   */
  public timeOperation<T>(
    operation: PerformanceMetricType['operationType'],
    fn: () => Promise<T> | T,
    context?: PerformanceMetricType['contextData']
  ): Promise<{ result: T; responseTime: number; metricId: string }> {
    return new Promise(async (resolve, reject) => {
      const startTime = performance.now();
      let success = true;
      let errorCode: string | undefined;
      let result: T;

      try {
        result = await fn();
      } catch (error) {
        success = false;
        errorCode = error instanceof Error ? error.message : 'unknown_error';
        reject(error);
        return;
      }

      const responseTime = performance.now() - startTime;
      const metricId = this.recordMetric(operation, responseTime, success, context, errorCode);

      resolve({
        result,
        responseTime,
        metricId
      });
    });
  }

  /**
   * Get real-time performance status
   */
  public getPerformanceStatus(): {
    overall: 'healthy' | 'degraded' | 'critical';
    emergencyResponseHealth: 'healthy' | 'degraded' | 'critical';
    resourceLoadingHealth: 'healthy' | 'degraded' | 'critical';
    detectionHealth: 'healthy' | 'degraded' | 'critical';
    activeAlerts: number;
    criticalAlerts: number;
    averageResponseTimes: Record<string, number>;
    successRates: Record<string, number>;
  } {
    const emergencyHealth = this.getOperationHealth('emergency_button_click');
    const resourceHealth = this.getOperationHealth('resource_loading');
    const detectionHealth = this.getOperationHealth('crisis_detection');

    // Overall health is worst of critical systems
    const healthLevels = [emergencyHealth, resourceHealth, detectionHealth];
    const overall = healthLevels.includes('critical') ? 'critical' :
                   healthLevels.includes('degraded') ? 'degraded' : 'healthy';

    const activeAlerts = this.activeAlerts.size;
    const criticalAlerts = Array.from(this.activeAlerts.values())
      .filter(alert => alert.severity === 'critical' || alert.severity === 'emergency').length;

    const averageResponseTimes = this.calculateAverageResponseTimes();
    const successRates = this.calculateSuccessRates();

    return {
      overall,
      emergencyResponseHealth: emergencyHealth,
      resourceLoadingHealth: resourceHealth,
      detectionHealth,
      activeAlerts,
      criticalAlerts,
      averageResponseTimes,
      successRates
    };
  }

  /**
   * Get performance metrics for specific operation
   */
  public getOperationMetrics(
    operation: PerformanceMetricType['operationType'],
    timeRange: number = 60 * 60 * 1000 // 1 hour default
  ): {
    totalOperations: number;
    averageResponseTime: number;
    successRate: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    recentTrend: 'improving' | 'stable' | 'degrading';
    exceedsThreshold: boolean;
  } {
    const now = Date.now();
    const cutoffTime = now - timeRange;
    const operationMetrics = this.metrics.get(operation) || [];
    
    const recentMetrics = operationMetrics.filter(metric =>
      metric.timestamp.getTime() > cutoffTime
    );

    if (recentMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        successRate: 1.0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        recentTrend: 'stable',
        exceedsThreshold: false
      };
    }

    // Calculate metrics
    const responseTimes = recentMetrics.map(m => m.responseTime).sort((a, b) => a - b);
    const successfulOps = recentMetrics.filter(m => m.success).length;
    
    const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    const successRate = successfulOps / recentMetrics.length;
    const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0;
    const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0;

    // Calculate trend (compare first half vs second half)
    const halfPoint = Math.floor(recentMetrics.length / 2);
    const firstHalf = recentMetrics.slice(0, halfPoint);
    const secondHalf = recentMetrics.slice(halfPoint);
    
    let recentTrend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstHalfAvg = firstHalf.reduce((sum, m) => sum + m.responseTime, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, m) => sum + m.responseTime, 0) / secondHalf.length;
      const changePercentage = (secondHalfAvg - firstHalfAvg) / firstHalfAvg;
      
      if (changePercentage > 0.1) recentTrend = 'degrading';
      else if (changePercentage < -0.1) recentTrend = 'improving';
    }

    // Check threshold
    const threshold = this.getThresholdForOperation(operation);
    const exceedsThreshold = averageResponseTime > threshold * this.config.alertThreshold;

    return {
      totalOperations: recentMetrics.length,
      averageResponseTime,
      successRate,
      p95ResponseTime,
      p99ResponseTime,
      recentTrend,
      exceedsThreshold
    };
  }

  /**
   * Get current active alerts
   */
  public getActiveAlerts(): PerformanceAlertType[] {
    return Array.from(this.activeAlerts.values())
      .sort((a, b) => {
        // Sort by severity and timestamp
        const severityOrder = { emergency: 0, critical: 1, warning: 2 };
        const aSeverity = severityOrder[a.severity];
        const bSeverity = severityOrder[b.severity];
        
        if (aSeverity !== bSeverity) return aSeverity - bSeverity;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
  }

  /**
   * Subscribe to performance alerts
   */
  public onAlert(callback: (alert: PerformanceAlertType) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Generate performance report
   */
  public generatePerformanceReport(timeRange: number = 24 * 60 * 60 * 1000): {
    summary: {
      reportPeriod: string;
      overallHealth: string;
      totalOperations: number;
      criticalAlerts: number;
      averageResponseTime: number;
    };
    operationBreakdown: Record<string, any>;
    alertSummary: {
      totalAlerts: number;
      alertsByType: Record<string, number>;
      alertsBySeverity: Record<string, number>;
    };
    recommendations: string[];
  } {
    const now = Date.now();
    const startTime = now - timeRange;
    
    // Calculate summary metrics
    const allMetrics = Array.from(this.metrics.values()).flat()
      .filter(m => m.timestamp.getTime() > startTime);
    
    const totalOperations = allMetrics.length;
    const averageResponseTime = allMetrics.length > 0 
      ? allMetrics.reduce((sum, m) => sum + m.responseTime, 0) / allMetrics.length 
      : 0;

    // Get alerts in time range
    const alertsInRange = Array.from(this.activeAlerts.values())
      .filter(a => a.timestamp.getTime() > startTime);
    
    const criticalAlerts = alertsInRange.filter(a => 
      a.severity === 'critical' || a.severity === 'emergency'
    ).length;

    // Operation breakdown
    const operationBreakdown: Record<string, any> = {};
    for (const operation of this.metrics.keys()) {
      operationBreakdown[operation] = this.getOperationMetrics(operation, timeRange);
    }

    // Alert summary
    const alertsByType: Record<string, number> = {};
    const alertsBySeverity: Record<string, number> = {};
    
    alertsInRange.forEach(alert => {
      alertsByType[alert.alertType] = (alertsByType[alert.alertType] || 0) + 1;
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1;
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(operationBreakdown, alertsInRange);

    const status = this.getPerformanceStatus();

    return {
      summary: {
        reportPeriod: `${new Date(startTime).toISOString()} to ${new Date(now).toISOString()}`,
        overallHealth: status.overall,
        totalOperations,
        criticalAlerts,
        averageResponseTime: Math.round(averageResponseTime)
      },
      operationBreakdown,
      alertSummary: {
        totalAlerts: alertsInRange.length,
        alertsByType,
        alertsBySeverity
      },
      recommendations
    };
  }

  /**
   * Private helper methods
   */
  private startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
      this.cleanupOldMetrics();
      this.resolveExpiredAlerts();
    }, this.config.monitoringInterval);

    this.isMonitoring = true;
    console.log('[Crisis Performance Monitor] Started monitoring');
  }

  private performHealthCheck(): void {
    // Check each operation type for performance issues
    for (const operation of this.metrics.keys()) {
      const metrics = this.getOperationMetrics(operation);
      
      if (metrics.exceedsThreshold) {
        this.triggerPerformanceAlert(operation, metrics.averageResponseTime);
      }

      if (metrics.successRate < 0.95) {
        this.triggerReliabilityAlert(operation, metrics.successRate);
      }

      if (metrics.recentTrend === 'degrading') {
        this.triggerDegradationAlert(operation);
      }
    }
  }

  private checkPerformanceThresholds(
    operation: PerformanceMetricType['operationType'],
    responseTime: number,
    success: boolean
  ): void {
    const threshold = this.getThresholdForOperation(operation);
    const alertThreshold = threshold * this.config.alertThreshold;

    // Immediate response time check
    if (responseTime > alertThreshold) {
      this.triggerPerformanceAlert(operation, responseTime);
    }

    // Emergency response time critical check
    if (operation === 'emergency_button_click' && responseTime > this.config.emergencyResponseTarget) {
      this.triggerCriticalAlert(operation, responseTime, this.config.emergencyResponseTarget);
    }

    // Failure check
    if (!success) {
      this.triggerFailureAlert(operation, responseTime);
    }
  }

  private triggerPerformanceAlert(operation: string, responseTime: number): void {
    const threshold = this.getThresholdForOperation(operation as any);
    const alertId = `perf_${operation}_${Date.now()}`;
    
    const severity: PerformanceAlertType['severity'] = 
      responseTime > threshold * 2 ? 'critical' :
      responseTime > threshold * 1.5 ? 'warning' : 'warning';

    const alert: PerformanceAlertType = {
      alertId,
      timestamp: new Date(),
      severity,
      alertType: 'response_time_exceeded',
      operationType: operation,
      measuredValue: responseTime,
      targetValue: threshold,
      impact: this.determineImpact(operation as any),
      description: `${operation} response time of ${Math.round(responseTime)}ms exceeds threshold of ${threshold}ms`,
      actionRequired: severity === 'critical',
      escalationLevel: severity === 'critical' ? 3 : 1
    };

    this.activeAlerts.set(alertId, alert);
    this.notifyAlertCallbacks(alert);

    console.warn(`[Crisis Performance Monitor] ${severity.toUpperCase()} Alert: ${alert.description}`);
  }

  private triggerCriticalAlert(operation: string, responseTime: number, target: number): void {
    const alertId = `critical_${operation}_${Date.now()}`;
    
    const alert: PerformanceAlertType = {
      alertId,
      timestamp: new Date(),
      severity: 'emergency',
      alertType: 'emergency_system_down',
      operationType: operation,
      measuredValue: responseTime,
      targetValue: target,
      impact: 'critical',
      description: `CRITICAL: Emergency ${operation} response time of ${Math.round(responseTime)}ms exceeds critical threshold of ${target}ms - USER SAFETY AT RISK`,
      actionRequired: true,
      escalationLevel: 5
    };

    this.activeAlerts.set(alertId, alert);
    this.notifyAlertCallbacks(alert);

    console.error(`[Crisis Performance Monitor] EMERGENCY Alert: ${alert.description}`);
  }

  private triggerReliabilityAlert(operation: string, successRate: number): void {
    const alertId = `reliability_${operation}_${Date.now()}`;
    
    const alert: PerformanceAlertType = {
      alertId,
      timestamp: new Date(),
      severity: successRate < 0.8 ? 'critical' : 'warning',
      alertType: 'system_degradation',
      operationType: operation,
      measuredValue: successRate,
      targetValue: 0.95,
      impact: this.determineImpact(operation as any),
      description: `${operation} success rate of ${(successRate * 100).toFixed(1)}% below target of 95%`,
      actionRequired: successRate < 0.9,
      escalationLevel: successRate < 0.8 ? 3 : 1
    };

    this.activeAlerts.set(alertId, alert);
    this.notifyAlertCallbacks(alert);
  }

  private triggerDegradationAlert(operation: string): void {
    const alertId = `degradation_${operation}_${Date.now()}`;
    
    const alert: PerformanceAlertType = {
      alertId,
      timestamp: new Date(),
      severity: 'warning',
      alertType: 'system_degradation',
      operationType: operation,
      measuredValue: 0,
      targetValue: 0,
      impact: this.determineImpact(operation as any),
      description: `${operation} performance is degrading over time`,
      actionRequired: false,
      escalationLevel: 1
    };

    this.activeAlerts.set(alertId, alert);
    this.notifyAlertCallbacks(alert);
  }

  private triggerFailureAlert(operation: string, responseTime: number): void {
    const alertId = `failure_${operation}_${Date.now()}`;
    
    const alert: PerformanceAlertType = {
      alertId,
      timestamp: new Date(),
      severity: operation.includes('emergency') ? 'critical' : 'warning',
      alertType: operation.includes('detection') ? 'detection_failure' : 'resource_unavailable',
      operationType: operation,
      measuredValue: responseTime,
      targetValue: 0, // Success target is 100%
      impact: this.determineImpact(operation as any),
      description: `${operation} operation failed`,
      actionRequired: operation.includes('emergency'),
      escalationLevel: operation.includes('emergency') ? 4 : 2
    };

    this.activeAlerts.set(alertId, alert);
    this.notifyAlertCallbacks(alert);
  }

  private getThresholdForOperation(operation: PerformanceMetricType['operationType']): number {
    switch (operation) {
      case 'emergency_button_click':
      case 'hotline_dial':
        return this.config.emergencyResponseTarget;
      case 'crisis_detection':
        return this.config.detectionProcessingTarget;
      case 'resource_loading':
      case 'resource_validation':
        return this.config.resourceLoadingTarget;
      case 'text_service_access':
      case 'emergency_bypass_creation':
        return this.config.emergencyResponseTarget * 2;
      case 'ui_rendering':
        return 200; // 200ms for UI rendering
      case 'offline_access':
        return 500; // 500ms for offline operations
      default:
        return 1000; // 1 second default
    }
  }

  private determineImpact(operation: PerformanceMetricType['operationType']): PerformanceAlertType['impact'] {
    switch (operation) {
      case 'emergency_button_click':
      case 'hotline_dial':
      case 'crisis_detection':
        return 'critical';
      case 'resource_loading':
      case 'text_service_access':
      case 'emergency_bypass_creation':
        return 'high';
      case 'resource_validation':
      case 'ui_rendering':
        return 'medium';
      case 'offline_access':
        return 'low';
      default:
        return 'medium';
    }
  }

  private getOperationHealth(operation: PerformanceMetricType['operationType']): 'healthy' | 'degraded' | 'critical' {
    const metrics = this.getOperationMetrics(operation);
    const threshold = this.getThresholdForOperation(operation);
    
    if (metrics.averageResponseTime > threshold * 2 || metrics.successRate < 0.8) {
      return 'critical';
    } else if (metrics.averageResponseTime > threshold * this.config.alertThreshold || metrics.successRate < 0.95) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  private calculateAverageResponseTimes(): Record<string, number> {
    const averages: Record<string, number> = {};
    
    for (const [operation, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        averages[operation] = metrics.reduce((sum, m) => sum + m.responseTime, 0) / metrics.length;
      }
    }
    
    return averages;
  }

  private calculateSuccessRates(): Record<string, number> {
    const rates: Record<string, number> = {};
    
    for (const [operation, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        const successfulOps = metrics.filter(m => m.success).length;
        rates[operation] = successfulOps / metrics.length;
      }
    }
    
    return rates;
  }

  private generateRecommendations(
    operationBreakdown: Record<string, any>,
    alerts: PerformanceAlertType[]
  ): string[] {
    const recommendations: string[] = [];

    // Check emergency response times
    const emergencyMetrics = operationBreakdown['emergency_button_click'];
    if (emergencyMetrics?.averageResponseTime > this.config.emergencyResponseTarget) {
      recommendations.push('CRITICAL: Emergency button response time exceeds 100ms - optimize event handlers and reduce UI blocking operations');
    }

    // Check crisis detection performance
    const detectionMetrics = operationBreakdown['crisis_detection'];
    if (detectionMetrics?.averageResponseTime > this.config.detectionProcessingTarget) {
      recommendations.push('Optimize crisis detection algorithms - consider caching patterns and reducing complexity');
    }

    // Check resource loading
    const resourceMetrics = operationBreakdown['resource_loading'];
    if (resourceMetrics?.averageResponseTime > this.config.resourceLoadingTarget) {
      recommendations.push('Improve resource loading times - implement resource preloading and CDN optimization');
    }

    // Check for recurring failures
    const failureAlerts = alerts.filter(a => a.alertType === 'resource_unavailable');
    if (failureAlerts.length > 5) {
      recommendations.push('Multiple resource failures detected - implement better failover mechanisms and resource validation');
    }

    // Check for trending issues
    const degradationAlerts = alerts.filter(a => a.alertType === 'system_degradation');
    if (degradationAlerts.length > 3) {
      recommendations.push('System performance is degrading - investigate server resources and database performance');
    }

    if (recommendations.length === 0) {
      recommendations.push('Crisis system performance is within acceptable parameters - continue monitoring');
    }

    return recommendations;
  }

  private generateMetricId(): string {
    return `metric_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private logPerformanceMetric(metric: PerformanceMetricType): void {
    const logData = {
      operation: metric.operationType,
      responseTime: metric.responseTime,
      success: metric.success,
      timestamp: metric.timestamp.toISOString(),
      context: metric.contextData
    };

    console.log('[Crisis Performance Monitor]', JSON.stringify(logData));
  }

  private notifyAlertCallbacks(alert: PerformanceAlertType): void {
    if (!this.config.enableRealTimeAlerting) return;

    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('[Crisis Performance Monitor] Alert callback failed:', error);
      }
    });
  }

  private cleanupOldMetrics(): void {
    const cutoffTime = Date.now() - this.config.metricsRetentionPeriod;
    
    for (const [operation, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter(m => m.timestamp.getTime() > cutoffTime);
      this.metrics.set(operation, filteredMetrics);
    }
  }

  private resolveExpiredAlerts(): void {
    const now = Date.now();
    const alertExpiry = 60 * 60 * 1000; // 1 hour
    
    for (const [alertId, alert] of this.activeAlerts.entries()) {
      if (now - alert.timestamp.getTime() > alertExpiry) {
        this.activeAlerts.delete(alertId);
      }
    }
  }

  /**
   * Public management methods
   */
  public clearAlert(alertId: string): boolean {
    return this.activeAlerts.delete(alertId);
  }

  public updateConfig(newConfig: Partial<CrisisPerformanceConfigType>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.isMonitoring = false;
    this.alertCallbacks.length = 0;
    
    console.log('[Crisis Performance Monitor] Destroyed');
  }
}

// Export singleton instance
export const crisisPerformanceMonitor = new CrisisPerformanceMonitor({
  emergencyResponseTarget: 100,
  resourceLoadingTarget: 3000,
  detectionProcessingTarget: 50,
  alertThreshold: 0.8,
  monitoringInterval: 30000,
  metricsRetentionPeriod: 24 * 60 * 60 * 1000,
  enableRealTimeAlerting: true,
  enablePerformanceLogging: true
});

// Helper function for timing operations
export function timeOperation<T>(
  operation: PerformanceMetricType['operationType'],
  fn: () => Promise<T> | T,
  context?: PerformanceMetricType['contextData']
): Promise<{ result: T; responseTime: number; metricId: string }> {
  return crisisPerformanceMonitor.timeOperation(operation, fn, context);
}