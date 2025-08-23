// Comprehensive monitoring and alerting system for ALCHM
import { logger, structuredLogger } from './logging'
import { AlchmError, ErrorSeverity, ErrorCategory } from './errorHandling'

export interface MonitoringMetrics {
  errorRate: number
  responseTime: number
  throughput: number
  availability: number
  userSatisfaction: number
  timestamp: number
}

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  timestamp: number
  resolved: boolean
  metadata?: Record<string, any>
}

export enum AlertType {
  ERROR_RATE = 'error_rate',
  RESPONSE_TIME = 'response_time',
  AVAILABILITY = 'availability',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  QUOTA = 'quota',
  USER_EXPERIENCE = 'user_experience'
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency'
}

interface ThresholdConfig {
  warning: number
  critical: number
  emergency?: number
}

interface MonitoringConfig {
  errorRate: ThresholdConfig // percentage
  responseTime: ThresholdConfig // milliseconds
  availability: ThresholdConfig // percentage
  performanceScore: ThresholdConfig // 0-100
  consecutiveErrors: ThresholdConfig // count
}

// Monitoring manager class
export class MonitoringManager {
  private static instance: MonitoringManager | null = null
  private metrics: Map<string, number[]> = new Map()
  private alerts: Alert[] = []
  private config: MonitoringConfig
  private monitoringInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.config = {
      errorRate: { warning: 5, critical: 10, emergency: 25 }, // percentage
      responseTime: { warning: 2000, critical: 5000, emergency: 10000 }, // ms
      availability: { warning: 99, critical: 95, emergency: 90 }, // percentage
      performanceScore: { warning: 75, critical: 50, emergency: 25 }, // score
      consecutiveErrors: { warning: 5, critical: 10, emergency: 20 } // count
    }

    this.startMonitoring()
  }

  static getInstance(): MonitoringManager {
    if (!this.instance) {
      this.instance = new MonitoringManager()
    }
    return this.instance
  }

  // Metric collection methods
  recordResponseTime(endpoint: string, duration: number): void {
    this.recordMetric(`response_time_${endpoint}`, duration)
    this.recordMetric('response_time_global', duration)
    
    // Check thresholds
    this.checkResponseTimeThresholds(endpoint, duration)
  }

  recordError(error: AlchmError): void {
    this.recordMetric('error_count', 1)
    this.recordMetric(`error_${error.category}`, 1)
    this.recordMetric(`error_${error.severity}`, 1)
    
    // Check error rate thresholds
    this.checkErrorRateThresholds()
    
    // Check consecutive errors
    this.checkConsecutiveErrors()
    
    // Security-specific monitoring
    if (error.category === ErrorCategory.SECURITY) {
      this.handleSecurityAlert(error)
    }
  }

  recordAPICall(endpoint: string, status: number, duration: number): void {
    this.recordMetric(`api_calls_${endpoint}`, 1)
    this.recordMetric('api_calls_total', 1)
    
    if (status >= 200 && status < 300) {
      this.recordMetric(`api_success_${endpoint}`, 1)
    } else if (status >= 400) {
      this.recordMetric(`api_error_${endpoint}`, 1)
      this.recordMetric('api_errors_total', 1)
    }
    
    this.recordResponseTime(endpoint, duration)
  }

  recordUserAction(action: string, userId: string, success: boolean): void {
    this.recordMetric(`user_action_${action}`, 1)
    
    if (success) {
      this.recordMetric(`user_success_${action}`, 1)
    } else {
      this.recordMetric(`user_error_${action}`, 1)
    }
    
    // Track user engagement
    this.recordMetric(`active_users`, 1, userId)
  }

  recordPerformanceMetric(metric: string, value: number): void {
    this.recordMetric(`performance_${metric}`, value)
    
    // Check performance thresholds
    this.checkPerformanceThresholds(metric, value)
  }

  recordBusinessMetric(metric: string, value: number, metadata?: Record<string, any>): void {
    this.recordMetric(`business_${metric}`, value)
    
    logger.info(`Business metric recorded: ${metric}`, {
      value,
      ...metadata
    }, {
      component: 'monitoring',
      action: 'business_metric'
    })
  }

  // Core metric recording
  private recordMetric(key: string, value: number, uniqueId?: string): void {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const values = this.metrics.get(key)!
    values.push(value)
    
    // Keep only last 1000 values for memory efficiency
    if (values.length > 1000) {
      values.splice(0, values.length - 1000)
    }
    
    // For unique metrics (like active users), use Set-like behavior
    if (uniqueId) {
      const uniqueKey = `${key}_unique`
      if (!this.metrics.has(uniqueKey)) {
        this.metrics.set(uniqueKey, [])
      }
      
      const uniqueValues = this.metrics.get(uniqueKey)!
      const now = Date.now()
      const oneHour = 60 * 60 * 1000
      
      // Add with timestamp
      uniqueValues.push(now)
      
      // Clean old entries (older than 1 hour)
      const recentValues = uniqueValues.filter(timestamp => now - timestamp < oneHour)
      this.metrics.set(uniqueKey, recentValues)
    }
  }

  // Threshold checking methods
  private checkResponseTimeThresholds(endpoint: string, duration: number): void {
    const thresholds = this.config.responseTime
    
    if (duration > thresholds.emergency!) {
      this.createAlert(
        AlertType.RESPONSE_TIME,
        AlertSeverity.EMERGENCY,
        'Critical Response Time',
        `Endpoint ${endpoint} responded in ${duration}ms (emergency threshold: ${thresholds.emergency}ms)`,
        { endpoint, duration, threshold: thresholds.emergency }
      )
    } else if (duration > thresholds.critical) {
      this.createAlert(
        AlertType.RESPONSE_TIME,
        AlertSeverity.CRITICAL,
        'High Response Time',
        `Endpoint ${endpoint} responded in ${duration}ms (critical threshold: ${thresholds.critical}ms)`,
        { endpoint, duration, threshold: thresholds.critical }
      )
    } else if (duration > thresholds.warning) {
      this.createAlert(
        AlertType.RESPONSE_TIME,
        AlertSeverity.WARNING,
        'Slow Response Time',
        `Endpoint ${endpoint} responded in ${duration}ms (warning threshold: ${thresholds.warning}ms)`,
        { endpoint, duration, threshold: thresholds.warning }
      )
    }
  }

  private checkErrorRateThresholds(): void {
    const errorRate = this.calculateErrorRate()
    const thresholds = this.config.errorRate
    
    if (errorRate > thresholds.emergency!) {
      this.createAlert(
        AlertType.ERROR_RATE,
        AlertSeverity.EMERGENCY,
        'Critical Error Rate',
        `Error rate is ${errorRate.toFixed(2)}% (emergency threshold: ${thresholds.emergency}%)`,
        { errorRate, threshold: thresholds.emergency }
      )
    } else if (errorRate > thresholds.critical) {
      this.createAlert(
        AlertType.ERROR_RATE,
        AlertSeverity.CRITICAL,
        'High Error Rate',
        `Error rate is ${errorRate.toFixed(2)}% (critical threshold: ${thresholds.critical}%)`,
        { errorRate, threshold: thresholds.critical }
      )
    } else if (errorRate > thresholds.warning) {
      this.createAlert(
        AlertType.ERROR_RATE,
        AlertSeverity.WARNING,
        'Elevated Error Rate',
        `Error rate is ${errorRate.toFixed(2)}% (warning threshold: ${thresholds.warning}%)`,
        { errorRate, threshold: thresholds.warning }
      )
    }
  }

  private checkConsecutiveErrors(): void {
    const consecutiveErrors = this.getConsecutiveErrors()
    const thresholds = this.config.consecutiveErrors
    
    if (consecutiveErrors > thresholds.critical) {
      this.createAlert(
        AlertType.ERROR_RATE,
        AlertSeverity.CRITICAL,
        'Consecutive Errors',
        `${consecutiveErrors} consecutive errors detected`,
        { consecutiveErrors, threshold: thresholds.critical }
      )
    }
  }

  private checkPerformanceThresholds(metric: string, value: number): void {
    // Core Web Vitals thresholds
    const vitalsThresholds: Record<string, ThresholdConfig> = {
      'cls': { warning: 0.1, critical: 0.25 },
      'lcp': { warning: 2500, critical: 4000 },
      'fid': { warning: 100, critical: 300 },
      'inp': { warning: 200, critical: 500 },
      'fcp': { warning: 1800, critical: 3000 },
      'ttfb': { warning: 800, critical: 1800 }
    }
    
    const thresholds = vitalsThresholds[metric.toLowerCase()]
    if (!thresholds) return
    
    if (value > thresholds.critical) {
      this.createAlert(
        AlertType.PERFORMANCE,
        AlertSeverity.CRITICAL,
        'Performance Degradation',
        `${metric.toUpperCase()} is ${value} (critical threshold: ${thresholds.critical})`,
        { metric, value, threshold: thresholds.critical }
      )
    } else if (value > thresholds.warning) {
      this.createAlert(
        AlertType.PERFORMANCE,
        AlertSeverity.WARNING,
        'Performance Warning',
        `${metric.toUpperCase()} is ${value} (warning threshold: ${thresholds.warning})`,
        { metric, value, threshold: thresholds.warning }
      )
    }
  }

  private handleSecurityAlert(error: AlchmError): void {
    this.createAlert(
      AlertType.SECURITY,
      error.severity === ErrorSeverity.CRITICAL ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
      'Security Event',
      `Security-related error: ${error.message}`,
      {
        errorId: error.id,
        errorCode: error.code,
        userId: error.context.userId,
        url: error.context.url
      }
    )
  }

  // Alert management
  private createAlert(
    type: AlertType,
    severity: AlertSeverity,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): void {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const alert: Alert = {
      id: alertId,
      type,
      severity,
      title,
      message,
      timestamp: Date.now(),
      resolved: false,
      metadata
    }
    
    this.alerts.push(alert)
    
    // Log the alert
    logger.warn(`Alert created: ${title}`, {
      alertId,
      type,
      severity,
      message,
      ...metadata
    }, {
      component: 'monitoring',
      action: 'alert_created'
    })
    
    // Send to external alerting systems
    this.sendExternalAlert(alert)
    
    // Auto-resolve old alerts of the same type
    this.autoResolveOldAlerts(type)
  }

  private async sendExternalAlert(alert: Alert): Promise<void> {
    try {
      // Send to webhook/notification service
      await fetch('/api/monitoring/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      })
      
      // For critical/emergency alerts, also try additional channels
      if (alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.EMERGENCY) {
        this.sendCriticalAlert(alert)
      }
    } catch (error) {
      console.error('Failed to send external alert:', error)
    }
  }

  private async sendCriticalAlert(alert: Alert): Promise<void> {
    // This would integrate with services like PagerDuty, Slack, email, etc.
    logger.fatal('Critical alert triggered', undefined, {
      alert: alert.id,
      title: alert.title,
      message: alert.message
    }, {
      component: 'monitoring',
      action: 'critical_alert'
    })
  }

  private autoResolveOldAlerts(type: AlertType): void {
    const oneHour = 60 * 60 * 1000
    const now = Date.now()
    
    this.alerts
      .filter(alert => 
        alert.type === type && 
        !alert.resolved && 
        (now - alert.timestamp) > oneHour
      )
      .forEach(alert => {
        alert.resolved = true
        logger.info(`Alert auto-resolved: ${alert.title}`, {
          alertId: alert.id
        }, {
          component: 'monitoring',
          action: 'alert_resolved'
        })
      })
  }

  // Metric calculation methods
  private calculateErrorRate(timeWindow: number = 5 * 60 * 1000): number {
    const now = Date.now()
    const errors = this.getMetricInTimeWindow('error_count', timeWindow, now)
    const total = this.getMetricInTimeWindow('api_calls_total', timeWindow, now)
    
    if (total === 0) return 0
    return (errors / total) * 100
  }

  private getConsecutiveErrors(): number {
    const errors = this.metrics.get('error_count') || []
    let consecutive = 0
    
    for (let i = errors.length - 1; i >= 0; i--) {
      if (errors[i] > 0) {
        consecutive++
      } else {
        break
      }
    }
    
    return consecutive
  }

  private getMetricInTimeWindow(key: string, timeWindow: number, endTime: number): number {
    const values = this.metrics.get(key) || []
    const startTime = endTime - timeWindow
    
    // This is simplified - in practice, you'd store timestamps with values
    return values.reduce((sum, value) => sum + value, 0)
  }

  // Health check methods
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: Record<string, boolean>
    metrics: MonitoringMetrics
  }> {
    const checks = {
      database: await this.checkDatabaseHealth(),
      api: await this.checkAPIHealth(),
      performance: this.checkPerformanceHealth(),
      errors: this.checkErrorHealth()
    }
    
    const healthyCount = Object.values(checks).filter(check => check).length
    const totalChecks = Object.keys(checks).length
    
    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (healthyCount === totalChecks) {
      status = 'healthy'
    } else if (healthyCount >= totalChecks * 0.7) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }
    
    const metrics: MonitoringMetrics = {
      errorRate: this.calculateErrorRate(),
      responseTime: this.getAverageResponseTime(),
      throughput: this.getThroughput(),
      availability: this.getAvailability(),
      userSatisfaction: this.getUserSatisfactionScore(),
      timestamp: Date.now()
    }
    
    return { status, checks, metrics }
  }

  private async checkDatabaseHealth(): Promise<boolean> {
    try {
      // Test database connectivity
      await fetch('/api/health/database')
      return true
    } catch {
      return false
    }
  }

  private async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/health/ping')
      return response.ok
    } catch {
      return false
    }
  }

  private checkPerformanceHealth(): boolean {
    const avgResponseTime = this.getAverageResponseTime()
    return avgResponseTime < this.config.responseTime.warning
  }

  private checkErrorHealth(): boolean {
    const errorRate = this.calculateErrorRate()
    return errorRate < this.config.errorRate.warning
  }

  private getAverageResponseTime(): number {
    const times = this.metrics.get('response_time_global') || []
    if (times.length === 0) return 0
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  private getThroughput(): number {
    const calls = this.metrics.get('api_calls_total') || []
    return calls.length // Simplified - requests per time window
  }

  private getAvailability(): number {
    const total = this.metrics.get('api_calls_total') || []
    const errors = this.metrics.get('api_errors_total') || []
    
    if (total.length === 0) return 100
    const successRate = ((total.length - errors.length) / total.length) * 100
    return Math.max(0, successRate)
  }

  private getUserSatisfactionScore(): number {
    // This would be based on actual user feedback, Core Web Vitals, etc.
    const performanceScore = this.getPerformanceScore()
    const errorRate = this.calculateErrorRate()
    
    // Simplified calculation
    return Math.max(0, 100 - errorRate - (100 - performanceScore))
  }

  private getPerformanceScore(): number {
    // Calculate based on Core Web Vitals
    const lcp = this.getLatestMetric('performance_lcp')
    const cls = this.getLatestMetric('performance_cls')
    const fid = this.getLatestMetric('performance_fid')
    
    let score = 100
    
    if (lcp > 4000) score -= 30
    else if (lcp > 2500) score -= 15
    
    if (cls > 0.25) score -= 30
    else if (cls > 0.1) score -= 15
    
    if (fid > 300) score -= 30
    else if (fid > 100) score -= 15
    
    return Math.max(0, score)
  }

  private getLatestMetric(key: string): number {
    const values = this.metrics.get(key) || []
    return values.length > 0 ? values[values.length - 1] : 0
  }

  // Monitoring lifecycle
  private startMonitoring(): void {
    // Run health checks every minute
    this.monitoringInterval = setInterval(async () => {
      const health = await this.performHealthCheck()
      
      logger.info('Health check completed', {
        status: health.status,
        checks: health.checks,
        metrics: health.metrics
      }, {
        component: 'monitoring',
        action: 'health_check'
      })
      
      // Create alerts for unhealthy status
      if (health.status === 'unhealthy') {
        this.createAlert(
          AlertType.AVAILABILITY,
          AlertSeverity.CRITICAL,
          'System Unhealthy',
          'Multiple health checks are failing',
          { healthStatus: health.status, failedChecks: health.checks }
        )
      }
    }, 60000)
  }

  // Public API
  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved)
  }

  getRecentMetrics(): Record<string, number[]> {
    const result: Record<string, number[]> = {}
    this.metrics.forEach((values, key) => {
      result[key] = values.slice(-100) // Last 100 values
    })
    return result
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved = true
      logger.info(`Alert resolved: ${alert.title}`, {
        alertId
      }, {
        component: 'monitoring',
        action: 'alert_resolved'
      })
    }
  }

  // Cleanup
  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
  }
}

// Global monitoring instance
export const monitoring = MonitoringManager.getInstance()

// Setup monitoring on module load
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    monitoring.destroy()
  })
}

export default MonitoringManager