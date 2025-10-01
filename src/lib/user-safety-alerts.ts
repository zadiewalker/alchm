/**
 * ALCHM User Safety Performance Alerts System
 * 
 * Automated alerting system for performance issues that could impact user safety
 * Focuses on crisis resource accessibility and trauma-informed performance standards
 */

import { CrisisPerformanceMetric } from './real-user-monitoring';
import { MobileTraumaMetrics } from './mobile-trauma-performance';

export interface SafetyAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'crisis_resource' | 'performance' | 'accessibility' | 'mobile' | 'network';
  title: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: number;
  metrics?: any;
  recommendations: string[];
  escalationLevel: 1 | 2 | 3 | 4; // 1=info, 2=warning, 3=urgent, 4=emergency
}

export interface AlertThresholds {
  crisisResourceLoad: {
    warning: number;    // 2 seconds
    critical: number;   // 3 seconds
    emergency: number;  // 5 seconds
  };
  coreWebVitals: {
    lcp: { warning: number; critical: number };
    fid: { warning: number; critical: number };
    cls: { warning: number; critical: number };
    fcp: { warning: number; critical: number };
    ttfb: { warning: number; critical: number };
  };
  mobile: {
    touchResponsiveness: { warning: number; critical: number };
    batteryLevel: { warning: number; critical: number };
    memoryPressure: { warning: number; critical: number };
  };
  accessibility: {
    touchTargetSize: { minimum: number; crisis: number };
    contrastRatio: { minimum: number };
  };
}

export interface AlertingConfig {
  enabled: boolean;
  escalationDelayMs: number;
  maxAlertsPerMinute: number;
  suppressDuplicates: boolean;
  notificationChannels: {
    console: boolean;
    analytics: boolean;
    webhook?: string;
    email?: string[];
    sms?: string[];
  };
}

class UserSafetyAlertsSystem {
  private alerts: SafetyAlert[] = [];
  private alertCallbacks: ((alert: SafetyAlert) => void)[] = [];
  private alertCounts: Map<string, number> = new Map();
  private lastAlertTime: Map<string, number> = new Map();
  
  private readonly thresholds: AlertThresholds = {
    crisisResourceLoad: {
      warning: 2000,   // 2 seconds
      critical: 3000,  // 3 seconds - life safety threshold
      emergency: 5000  // 5 seconds - emergency escalation
    },
    coreWebVitals: {
      lcp: { warning: 1800, critical: 3000 },
      fid: { warning: 50, critical: 200 },
      cls: { warning: 0.05, critical: 0.15 },
      fcp: { warning: 1200, critical: 2000 },
      ttfb: { warning: 400, critical: 800 }
    },
    mobile: {
      touchResponsiveness: { warning: 200, critical: 500 },
      batteryLevel: { warning: 0.15, critical: 0.05 },
      memoryPressure: { warning: 0.8, critical: 0.95 }
    },
    accessibility: {
      touchTargetSize: { minimum: 44, crisis: 56 },
      contrastRatio: { minimum: 4.5 }
    }
  };

  private config: AlertingConfig = {
    enabled: true,
    escalationDelayMs: 30000, // 30 seconds
    maxAlertsPerMinute: 10,
    suppressDuplicates: true,
    notificationChannels: {
      console: true,
      analytics: true
    }
  };

  constructor(customConfig?: Partial<AlertingConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }
    
    this.bindMethods();
  }

  private bindMethods() {
    this.processPerformanceMetric = this.processPerformanceMetric.bind(this);
    this.processMobileMetrics = this.processMobileMetrics.bind(this);
    this.escalateAlert = this.escalateAlert.bind(this);
  }

  /**
   * Process performance metrics and generate alerts
   */
  public processPerformanceMetric(metric: CrisisPerformanceMetric): void {
    if (!this.config.enabled) return;

    // Check Core Web Vitals thresholds
    this.checkCoreWebVitalsThresholds(metric);
    
    // Check crisis-specific thresholds
    this.checkCrisisSpecificThresholds(metric);
    
    // Check user context for elevated risk
    this.checkUserContextRisk(metric);
  }

  /**
   * Process mobile trauma metrics and generate alerts
   */
  public processMobileMetrics(metrics: MobileTraumaMetrics): void {
    if (!this.config.enabled) return;

    // Check touch responsiveness
    if (metrics.touchResponsiveness > this.thresholds.mobile.touchResponsiveness.critical) {
      this.createAlert({
        type: 'critical',
        category: 'mobile',
        title: 'Critical Touch Responsiveness Issue',
        message: `Touch response time ${Math.round(metrics.touchResponsiveness)}ms exceeds critical threshold for users with motor impairments`,
        impact: 'high',
        metrics: { touchResponsiveness: metrics.touchResponsiveness },
        recommendations: [
          'Reduce JavaScript execution on main thread',
          'Optimize touch event handlers',
          'Consider enabling crisis mode touch targets',
          'Review component rendering performance'
        ],
        escalationLevel: 3
      });
    }

    // Check battery level during crisis sessions
    if (metrics.batteryImpact < this.thresholds.mobile.batteryLevel.critical) {
      this.createAlert({
        type: 'critical',
        category: 'mobile',
        title: 'Critical Battery Level During Crisis',
        message: `User battery at ${Math.round(metrics.batteryImpact * 100)}% - risk of session interruption during crisis`,
        impact: 'high',
        metrics: { batteryLevel: metrics.batteryImpact },
        recommendations: [
          'Enable emergency battery mode',
          'Reduce background processing',
          'Disable non-essential animations',
          'Cache critical resources for offline access'
        ],
        escalationLevel: 4
      });
    }

    // Check memory pressure
    if (metrics.memoryPressure > this.thresholds.mobile.memoryPressure.critical) {
      this.createAlert({
        type: 'critical',
        category: 'mobile',
        title: 'Critical Memory Pressure',
        message: `Memory usage at ${Math.round(metrics.memoryPressure * 100)}% - app may crash during crisis session`,
        impact: 'high',
        metrics: { memoryPressure: metrics.memoryPressure },
        recommendations: [
          'Force garbage collection',
          'Cleanup unused components',
          'Reduce image quality',
          'Clear unnecessary caches'
        ],
        escalationLevel: 3
      });
    }

    // Check tremors compensation
    if (metrics.tremorsCompensation) {
      this.createAlert({
        type: 'warning',
        category: 'accessibility',
        title: 'Tremors Detected - Accessibility Adaptation Needed',
        message: 'User showing signs of tremors or motor impairment - larger touch targets recommended',
        impact: 'medium',
        metrics: { tremorsCompensation: true },
        recommendations: [
          'Increase touch target sizes to 56px minimum',
          'Add touch target spacing',
          'Enable double-tap confirmation for critical actions',
          'Provide alternative input methods'
        ],
        escalationLevel: 2
      });
    }
  }

  /**
   * Check Core Web Vitals against trauma-informed thresholds
   */
  private checkCoreWebVitalsThresholds(metric: CrisisPerformanceMetric): void {
    const thresholds = this.thresholds.coreWebVitals[metric.name as keyof typeof this.thresholds.coreWebVitals];
    if (!thresholds) return;

    if (metric.value > thresholds.critical) {
      this.createAlert({
        type: 'critical',
        category: 'performance',
        title: `Critical ${metric.name.toUpperCase()} Performance`,
        message: `${metric.name.toUpperCase()} of ${Math.round(metric.value)}ms exceeds critical threshold for trauma-informed design`,
        impact: 'high',
        metrics: { [metric.name]: metric.value, crisisLevel: metric.crisisLevel },
        recommendations: this.getPerformanceRecommendations(metric.name),
        escalationLevel: metric.crisisLevel === 'crisis' ? 4 : 3
      });
    } else if (metric.value > thresholds.warning) {
      this.createAlert({
        type: 'warning',
        category: 'performance',
        title: `${metric.name.toUpperCase()} Performance Warning`,
        message: `${metric.name.toUpperCase()} of ${Math.round(metric.value)}ms may impact vulnerable users`,
        impact: 'medium',
        metrics: { [metric.name]: metric.value, crisisLevel: metric.crisisLevel },
        recommendations: this.getPerformanceRecommendations(metric.name),
        escalationLevel: 2
      });
    }
  }

  /**
   * Check crisis-specific performance thresholds
   */
  private checkCrisisSpecificThresholds(metric: CrisisPerformanceMetric): void {
    // Check if this is a crisis resource load time
    if (metric.name === 'crisis-resource-load') {
      const { warning, critical, emergency } = this.thresholds.crisisResourceLoad;
      
      if (metric.value > emergency) {
        this.createAlert({
          type: 'critical',
          category: 'crisis_resource',
          title: 'EMERGENCY: Crisis Resource Load Failure',
          message: `Crisis resource taking ${Math.round(metric.value)}ms to load - immediate intervention required`,
          impact: 'high',
          metrics: metric,
          recommendations: [
            'Immediately check CDN and hosting status',
            'Activate emergency fallback resources',
            'Alert on-call team',
            'Consider emergency maintenance mode'
          ],
          escalationLevel: 4
        });
      } else if (metric.value > critical) {
        this.createAlert({
          type: 'critical',
          category: 'crisis_resource',
          title: 'Critical Crisis Resource Performance',
          message: `Crisis resource load time ${Math.round(metric.value)}ms exceeds life-safety threshold`,
          impact: 'high',
          metrics: metric,
          recommendations: [
            'Check crisis resource CDN performance',
            'Verify database connection health',
            'Review server resource utilization',
            'Activate performance optimization protocols'
          ],
          escalationLevel: 3
        });
      }
    }
  }

  /**
   * Check user context for elevated risk
   */
  private checkUserContextRisk(metric: CrisisPerformanceMetric): void {
    // Escalate alerts for users in crisis
    if (metric.crisisLevel === 'crisis' && metric.rating === 'poor') {
      this.createAlert({
        type: 'critical',
        category: 'crisis_resource',
        title: 'Performance Issue During Crisis Session',
        message: `Poor ${metric.name} performance (${Math.round(metric.value)}ms) detected during active crisis session`,
        impact: 'high',
        metrics: metric,
        recommendations: [
          'Prioritize this user\'s session resources',
          'Enable crisis performance mode',
          'Check user\'s network connectivity',
          'Consider direct intervention if prolonged'
        ],
        escalationLevel: 4
      });
    }

    // Check for low-end device performance issues
    if (metric.deviceInfo.isLowEndDevice && metric.rating === 'poor') {
      this.createAlert({
        type: 'warning',
        category: 'mobile',
        title: 'Low-End Device Performance Issue',
        message: `Performance degradation on low-end device: ${metric.name} ${Math.round(metric.value)}ms`,
        impact: 'medium',
        metrics: metric,
        recommendations: [
          'Enable low-end device optimizations',
          'Reduce visual complexity',
          'Prioritize essential functionality',
          'Consider progressive enhancement'
        ],
        escalationLevel: 2
      });
    }
  }

  /**
   * Create and process a new alert
   */
  private createAlert(alertData: Omit<SafetyAlert, 'id' | 'timestamp'>): void {
    const alert: SafetyAlert = {
      ...alertData,
      id: this.generateAlertId(),
      timestamp: Date.now()
    };

    // Check rate limiting
    if (!this.checkRateLimit(alert)) {
      return;
    }

    // Check for duplicate suppression
    if (this.config.suppressDuplicates && this.isDuplicateAlert(alert)) {
      return;
    }

    // Add to alerts list
    this.alerts.push(alert);
    
    // Keep only recent alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-500);
    }

    // Process the alert
    this.processAlert(alert);
    
    // Schedule escalation if needed
    if (alert.escalationLevel >= 3) {
      setTimeout(() => this.escalateAlert(alert), this.config.escalationDelayMs);
    }
  }

  /**
   * Process and distribute alert
   */
  private processAlert(alert: SafetyAlert): void {
    // Log to console
    if (this.config.notificationChannels.console) {
      this.logAlertToConsole(alert);
    }

    // Send to analytics
    if (this.config.notificationChannels.analytics) {
      this.sendAlertToAnalytics(alert);
    }

    // Send to webhook
    if (this.config.notificationChannels.webhook) {
      this.sendAlertToWebhook(alert);
    }

    // Notify registered callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });
  }

  /**
   * Escalate alert if not resolved
   */
  private escalateAlert(alert: SafetyAlert): void {
    // Check if alert is still relevant
    const currentAlert = this.alerts.find(a => a.id === alert.id);
    if (!currentAlert) return;

    // Create escalation alert
    const escalationAlert: SafetyAlert = {
      ...alert,
      id: this.generateAlertId(),
      type: 'critical',
      title: `ESCALATED: ${alert.title}`,
      message: `Previous alert not resolved: ${alert.message}`,
      escalationLevel: Math.min(4, alert.escalationLevel + 1) as 1 | 2 | 3 | 4,
      timestamp: Date.now()
    };

    this.processAlert(escalationAlert);
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(alert: SafetyAlert): boolean {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const key = `${minute}-${alert.category}`;
    
    const count = this.alertCounts.get(key) || 0;
    if (count >= this.config.maxAlertsPerMinute) {
      return false;
    }
    
    this.alertCounts.set(key, count + 1);
    
    // Cleanup old counts
    for (const [k, _] of this.alertCounts) {
      const keyMinute = parseInt(k.split('-')[0]);
      if (now - keyMinute * 60000 > 300000) { // 5 minutes
        this.alertCounts.delete(k);
      }
    }
    
    return true;
  }

  /**
   * Check for duplicate alerts
   */
  private isDuplicateAlert(alert: SafetyAlert): boolean {
    const key = `${alert.category}-${alert.title}`;
    const lastTime = this.lastAlertTime.get(key);
    const now = Date.now();
    
    if (lastTime && now - lastTime < 60000) { // 1 minute
      return true;
    }
    
    this.lastAlertTime.set(key, now);
    return false;
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get performance recommendations for specific metrics
   */
  private getPerformanceRecommendations(metricName: string): string[] {
    switch (metricName) {
      case 'lcp':
        return [
          'Optimize images with WebP format and proper sizing',
          'Preload critical resources',
          'Remove unused CSS and JavaScript',
          'Optimize server response times'
        ];
      case 'fid':
        return [
          'Reduce main thread blocking time',
          'Break up long tasks',
          'Use web workers for heavy computation',
          'Optimize third-party scripts'
        ];
      case 'cls':
        return [
          'Set size attributes on images and videos',
          'Reserve space for dynamic content',
          'Avoid inserting content above existing content',
          'Use CSS containment'
        ];
      case 'fcp':
        return [
          'Minimize critical resource chain',
          'Inline critical CSS',
          'Eliminate render-blocking resources',
          'Optimize font loading'
        ];
      case 'ttfb':
        return [
          'Optimize server response times',
          'Use CDN for static assets',
          'Implement proper caching strategies',
          'Optimize database queries'
        ];
      default:
        return ['Review performance optimization best practices'];
    }
  }

  /**
   * Log alert to console with appropriate level
   */
  private logAlertToConsole(alert: SafetyAlert): void {
    const prefix = this.getAlertPrefix(alert);
    const message = `${prefix} ${alert.title}: ${alert.message}`;
    
    switch (alert.type) {
      case 'critical':
        console.error(message, alert);
        break;
      case 'warning':
        console.warn(message, alert);
        break;
      default:
        console.info(message, alert);
    }
  }

  /**
   * Send alert to analytics
   */
  private sendAlertToAnalytics(alert: SafetyAlert): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'safety_alert', {
        alert_type: alert.type,
        alert_category: alert.category,
        escalation_level: alert.escalationLevel,
        impact: alert.impact,
        event_category: 'user_safety'
      });
    }
  }

  /**
   * Send alert to webhook
   */
  private async sendAlertToWebhook(alert: SafetyAlert): Promise<void> {
    if (!this.config.notificationChannels.webhook) return;

    try {
      await fetch(this.config.notificationChannels.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alert,
          source: 'alchm-rum-system',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send alert to webhook:', error);
    }
  }

  /**
   * Get alert prefix for logging
   */
  private getAlertPrefix(alert: SafetyAlert): string {
    const prefixes = {
      critical: '🚨 CRITICAL',
      warning: '⚠️ WARNING',
      info: 'ℹ️ INFO'
    };
    
    return prefixes[alert.type] || 'ℹ️';
  }

  /**
   * Register alert callback
   */
  public onAlert(callback: (alert: SafetyAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Get recent alerts
   */
  public getRecentAlerts(count: number = 10): SafetyAlert[] {
    return this.alerts.slice(-count);
  }

  /**
   * Get alerts by category
   */
  public getAlertsByCategory(category: SafetyAlert['category']): SafetyAlert[] {
    return this.alerts.filter(alert => alert.category === category);
  }

  /**
   * Get critical alerts
   */
  public getCriticalAlerts(): SafetyAlert[] {
    return this.alerts.filter(alert => alert.type === 'critical');
  }

  /**
   * Clear all alerts
   */
  public clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<AlertingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  public getConfig(): AlertingConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable alerting
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Force check of crisis resources
   */
  public async checkCrisisResourcesPerformance(): Promise<void> {
    const crisisResources = [
      '/crisis-resources.json',
      '/emergency-crisis.html',
      '/api/crisis-detection'
    ];

    for (const resource of crisisResources) {
      const startTime = performance.now();
      
      try {
        await fetch(resource, { method: 'HEAD' });
        const loadTime = performance.now() - startTime;
        
        this.processPerformanceMetric({
          id: `crisis-check-${Date.now()}`,
          name: 'crisis-resource-load',
          value: loadTime,
          delta: loadTime,
          rating: loadTime > 3000 ? 'poor' : loadTime > 2000 ? 'needs-improvement' : 'good',
          timestamp: Date.now(),
          crisisLevel: 'normal',
          deviceInfo: {
            userAgent: navigator.userAgent,
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            isLowEndDevice: false
          },
          networkInfo: {
            connectionQuality: 'good'
          },
          userContext: {
            isFirstTime: false,
            sessionDuration: 0,
            pageVisibility: 'visible',
            crisisResourceAccessed: true,
            emergencyModeActive: false
          }
        } as CrisisPerformanceMetric);
        
      } catch (error) {
        this.createAlert({
          type: 'critical',
          category: 'crisis_resource',
          title: 'Crisis Resource Unavailable',
          message: `Critical crisis resource ${resource} is not accessible`,
          impact: 'high',
          recommendations: [
            'Check server status immediately',
            'Verify CDN configuration',
            'Activate backup resources',
            'Alert infrastructure team'
          ],
          escalationLevel: 4
        });
      }
    }
  }
}

// Export singleton instance
export const userSafetyAlerts = new UserSafetyAlertsSystem();

export default userSafetyAlerts;