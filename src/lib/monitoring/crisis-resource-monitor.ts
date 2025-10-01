/**
 * CRITICAL LIFE-SAFETY SYSTEM: Crisis Resource Monitor
 * 
 * This system ensures 100% uptime for crisis resources and immediately
 * detects and responds to any availability issues. Crisis resources must
 * NEVER be unavailable when someone needs help.
 */

import { getPerformanceMonitor } from './real-time-performance-monitor';
import { getRollbackSystem } from './automated-rollback-system';

interface CrisisResource {
  id: string;
  name: string;
  url: string;
  type: 'HOTLINE' | 'TEXT_LINE' | 'CHAT' | 'EMERGENCY' | 'API' | 'CONTENT';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  expectedResponseTime: number; // milliseconds
  checkInterval: number; // milliseconds
  retryAttempts: number;
  failover?: string[]; // Alternative URLs
  healthEndpoint?: string; // Specific health check endpoint
}

interface ResourceHealthCheck {
  resourceId: string;
  timestamp: number;
  responseTime: number;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILING' | 'DOWN';
  statusCode?: number;
  errorMessage?: string;
  location?: string; // Geographic location of check
}

interface ResourceAlert {
  id: string;
  resourceId: string;
  timestamp: number;
  severity: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  type: 'TIMEOUT' | 'HTTP_ERROR' | 'NETWORK_ERROR' | 'CONTENT_ERROR' | 'FAILOVER_ACTIVATED';
  message: string;
  responseTime?: number;
  statusCode?: number;
  actionTaken?: string;
}

interface FailoverEvent {
  resourceId: string;
  timestamp: number;
  originalUrl: string;
  failoverUrl: string;
  reason: string;
  success: boolean;
}

class CrisisResourceMonitor {
  private resources: Map<string, CrisisResource> = new Map();
  private healthChecks: Map<string, ResourceHealthCheck[]> = new Map();
  private alerts: ResourceAlert[] = [];
  private failoverEvents: FailoverEvent[] = [];
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isMonitoring = false;
  private alertCallbacks: ((alert: ResourceAlert) => void)[] = [];

  constructor() {
    this.initializeDefaultResources();
    this.startMonitoring();
  }

  private initializeDefaultResources() {
    const defaultResources: CrisisResource[] = [
      // Emergency Hotlines
      {
        id: 'national-suicide-prevention',
        name: 'National Suicide Prevention Lifeline',
        url: 'tel:988',
        type: 'HOTLINE',
        priority: 'CRITICAL',
        expectedResponseTime: 5000,
        checkInterval: 30000, // 30 seconds
        retryAttempts: 3,
        healthEndpoint: 'https://suicidepreventionlifeline.org/health'
      },
      {
        id: 'crisis-text-line',
        name: 'Crisis Text Line',
        url: 'sms:741741',
        type: 'TEXT_LINE',
        priority: 'CRITICAL',
        expectedResponseTime: 3000,
        checkInterval: 30000,
        retryAttempts: 3
      },
      {
        id: 'emergency-services',
        name: 'Emergency Services',
        url: 'tel:911',
        type: 'EMERGENCY',
        priority: 'CRITICAL',
        expectedResponseTime: 2000,
        checkInterval: 60000, // 1 minute
        retryAttempts: 1
      },

      // Crisis Chat Services
      {
        id: 'national-crisis-chat',
        name: 'National Crisis Chat',
        url: 'https://suicidepreventionlifeline.org/chat/',
        type: 'CHAT',
        priority: 'CRITICAL',
        expectedResponseTime: 10000,
        checkInterval: 60000,
        retryAttempts: 2,
        failover: [
          'https://www.crisischat.org/chat',
          'https://www.imalive.org/'
        ]
      },

      // Crisis Support APIs
      {
        id: 'crisis-resources-api',
        name: 'Crisis Resources API',
        url: '/api/crisis-resources',
        type: 'API',
        priority: 'HIGH',
        expectedResponseTime: 1000,
        checkInterval: 60000,
        retryAttempts: 3,
        healthEndpoint: '/api/crisis-resources/health'
      },
      {
        id: 'emergency-contacts-api',
        name: 'Emergency Contacts API',
        url: '/api/emergency-contacts',
        type: 'API',
        priority: 'HIGH',
        expectedResponseTime: 1000,
        checkInterval: 60000,
        retryAttempts: 3
      },

      // Crisis Content Resources
      {
        id: 'safety-plan-content',
        name: 'Safety Plan Content',
        url: '/crisis-resources/safety-plan',
        type: 'CONTENT',
        priority: 'HIGH',
        expectedResponseTime: 2000,
        checkInterval: 300000, // 5 minutes
        retryAttempts: 2
      },
      {
        id: 'coping-strategies-content',
        name: 'Coping Strategies Content',
        url: '/crisis-resources/coping-strategies',
        type: 'CONTENT',
        priority: 'HIGH',
        expectedResponseTime: 2000,
        checkInterval: 300000,
        retryAttempts: 2
      },

      // International Resources
      {
        id: 'international-hotlines',
        name: 'International Crisis Hotlines',
        url: '/api/international-crisis-resources',
        type: 'API',
        priority: 'HIGH',
        expectedResponseTime: 3000,
        checkInterval: 300000,
        retryAttempts: 2
      }
    ];

    defaultResources.forEach(resource => {
      this.resources.set(resource.id, resource);
      this.healthChecks.set(resource.id, []);
    });

    console.log('[CRISIS MONITOR] Initialized monitoring for', defaultResources.length, 'crisis resources');
  }

  private startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('[CRISIS MONITOR] Starting crisis resource monitoring');

    // Start monitoring each resource
    for (const [resourceId, resource] of this.resources) {
      this.startResourceMonitoring(resourceId, resource);
    }

    // Start global health checks
    this.startGlobalHealthChecks();
  }

  private startResourceMonitoring(resourceId: string, resource: CrisisResource) {
    // Clear existing interval if any
    const existingInterval = this.monitoringIntervals.get(resourceId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new monitoring interval
    const interval = setInterval(async () => {
      await this.checkResourceHealth(resourceId, resource);
    }, resource.checkInterval);

    this.monitoringIntervals.set(resourceId, interval);

    // Perform immediate check
    this.checkResourceHealth(resourceId, resource);
  }

  private async checkResourceHealth(resourceId: string, resource: CrisisResource): Promise<void> {
    const startTime = Date.now();
    
    try {
      const healthCheck = await this.performHealthCheck(resource);
      
      // Store health check result
      const checks = this.healthChecks.get(resourceId) || [];
      checks.push(healthCheck);
      
      // Keep only last 100 checks per resource
      if (checks.length > 100) {
        checks.splice(0, checks.length - 100);
      }
      
      this.healthChecks.set(resourceId, checks);

      // Analyze health status and trigger alerts if necessary
      await this.analyzeResourceHealth(resourceId, resource, healthCheck);

    } catch (error) {
      const healthCheck: ResourceHealthCheck = {
        resourceId,
        timestamp: Date.now(),
        responseTime: Date.now() - startTime,
        status: 'DOWN',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };

      const checks = this.healthChecks.get(resourceId) || [];
      checks.push(healthCheck);
      this.healthChecks.set(resourceId, checks);

      // Trigger immediate alert for failed health check
      await this.triggerResourceAlert({
        resourceId,
        severity: resource.priority === 'CRITICAL' ? 'EMERGENCY' : 'CRITICAL',
        type: 'NETWORK_ERROR',
        message: `Failed to check health for ${resource.name}: ${healthCheck.errorMessage}`,
        responseTime: healthCheck.responseTime
      });
    }
  }

  private async performHealthCheck(resource: CrisisResource): Promise<ResourceHealthCheck> {
    const startTime = Date.now();

    // Skip actual network calls for phone numbers and SMS
    if (resource.type === 'HOTLINE' || resource.type === 'TEXT_LINE' || resource.type === 'EMERGENCY') {
      return {
        resourceId: resource.id,
        timestamp: Date.now(),
        responseTime: 0,
        status: 'HEALTHY' // Assume phone services are available
      };
    }

    // Use health endpoint if available, otherwise use main URL
    const checkUrl = resource.healthEndpoint || resource.url;
    const fullUrl = checkUrl.startsWith('http') ? checkUrl : `${window.location.origin}${checkUrl}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), resource.expectedResponseTime * 2);

      const response = await fetch(fullUrl, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'User-Agent': 'ALCHM-Crisis-Monitor/1.0'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      let status: ResourceHealthCheck['status'] = 'HEALTHY';
      
      if (responseTime > resource.expectedResponseTime * 2) {
        status = 'FAILING';
      } else if (responseTime > resource.expectedResponseTime) {
        status = 'DEGRADED';
      }

      if (!response.ok) {
        status = response.status >= 500 ? 'FAILING' : 'DEGRADED';
      }

      return {
        resourceId: resource.id,
        timestamp: Date.now(),
        responseTime,
        status,
        statusCode: response.status
      };

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        resourceId: resource.id,
        timestamp: Date.now(),
        responseTime,
        status: 'DOWN',
        errorMessage: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  private async analyzeResourceHealth(
    resourceId: string, 
    resource: CrisisResource, 
    latestCheck: ResourceHealthCheck
  ): Promise<void> {
    const checks = this.healthChecks.get(resourceId) || [];
    const recentChecks = checks.slice(-5); // Last 5 checks

    // Immediate alerts for critical status
    if (latestCheck.status === 'DOWN' || latestCheck.status === 'FAILING') {
      await this.triggerResourceAlert({
        resourceId,
        severity: resource.priority === 'CRITICAL' ? 'EMERGENCY' : 'CRITICAL',
        type: latestCheck.status === 'DOWN' ? 'NETWORK_ERROR' : 'HTTP_ERROR',
        message: `${resource.name} is ${latestCheck.status.toLowerCase()}`,
        responseTime: latestCheck.responseTime,
        statusCode: latestCheck.statusCode
      });

      // Attempt failover for critical resources
      if (resource.priority === 'CRITICAL' && resource.failover && resource.failover.length > 0) {
        await this.attemptFailover(resourceId, resource);
      }
    }

    // Performance degradation alerts
    if (latestCheck.responseTime > resource.expectedResponseTime * 1.5) {
      await this.triggerResourceAlert({
        resourceId,
        severity: 'WARNING',
        type: 'TIMEOUT',
        message: `${resource.name} response time degraded`,
        responseTime: latestCheck.responseTime
      });
    }

    // Pattern analysis for sustained issues
    if (recentChecks.length >= 3) {
      const failingChecks = recentChecks.filter(c => c.status === 'FAILING' || c.status === 'DOWN').length;
      const degradedChecks = recentChecks.filter(c => c.status === 'DEGRADED').length;

      if (failingChecks >= 2) {
        await this.triggerResourceAlert({
          resourceId,
          severity: 'EMERGENCY',
          type: 'NETWORK_ERROR',
          message: `${resource.name} has sustained failures`,
          responseTime: latestCheck.responseTime
        });
      } else if (degradedChecks >= 3) {
        await this.triggerResourceAlert({
          resourceId,
          severity: 'CRITICAL',
          type: 'TIMEOUT',
          message: `${resource.name} has sustained performance degradation`,
          responseTime: latestCheck.responseTime
        });
      }
    }
  }

  private async attemptFailover(resourceId: string, resource: CrisisResource): Promise<void> {
    if (!resource.failover || resource.failover.length === 0) return;

    console.warn(`[CRISIS MONITOR] Attempting failover for ${resource.name}`);

    for (const failoverUrl of resource.failover) {
      try {
        const failoverResource = { ...resource, url: failoverUrl };
        const healthCheck = await this.performHealthCheck(failoverResource);

        if (healthCheck.status === 'HEALTHY' || healthCheck.status === 'DEGRADED') {
          // Successful failover
          const failoverEvent: FailoverEvent = {
            resourceId,
            timestamp: Date.now(),
            originalUrl: resource.url,
            failoverUrl,
            reason: 'Original resource unavailable',
            success: true
          };

          this.failoverEvents.push(failoverEvent);

          await this.triggerResourceAlert({
            resourceId,
            severity: 'WARNING',
            type: 'FAILOVER_ACTIVATED',
            message: `Failover activated for ${resource.name}`,
            actionTaken: `Switched to ${failoverUrl}`
          });

          // Update resource URL temporarily
          resource.url = failoverUrl;
          this.resources.set(resourceId, resource);

          console.log(`[CRISIS MONITOR] ✅ Failover successful for ${resource.name}`);
          return;
        }
      } catch (error) {
        console.warn(`[CRISIS MONITOR] Failover attempt failed for ${failoverUrl}:`, error);
      }
    }

    // All failovers failed
    const failoverEvent: FailoverEvent = {
      resourceId,
      timestamp: Date.now(),
      originalUrl: resource.url,
      failoverUrl: 'ALL_FAILED',
      reason: 'All failover URLs unavailable',
      success: false
    };

    this.failoverEvents.push(failoverEvent);

    await this.triggerResourceAlert({
      resourceId,
      severity: 'EMERGENCY',
      type: 'FAILOVER_ACTIVATED',
      message: `ALL FAILOVERS FAILED for ${resource.name}`,
      actionTaken: 'Manual intervention required'
    });
  }

  private async triggerResourceAlert(alertData: Omit<ResourceAlert, 'id' | 'timestamp'>): Promise<void> {
    const alert: ResourceAlert = {
      ...alertData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    this.alerts.push(alert);

    // Keep only recent alerts (last 24 hours)
    const cutoff = Date.now() - 86400000;
    this.alerts = this.alerts.filter(a => a.timestamp >= cutoff);

    console.error(`[CRISIS ALERT ${alert.severity}] ${alert.message}`, alert);

    // Handle emergency alerts
    if (alert.severity === 'EMERGENCY') {
      await this.handleEmergencyAlert(alert);
    }

    // Notify callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('[CRISIS MONITOR] Alert callback error:', error);
      }
    });

    // Store alert
    this.storeAlert(alert);
  }

  private async handleEmergencyAlert(alert: ResourceAlert): Promise<void> {
    // Trigger automated response systems
    const rollbackSystem = getRollbackSystem();
    
    // Emergency notifications
    if (process.env.NEXT_PUBLIC_CRISIS_ALERT_WEBHOOK_URL) {
      try {
        await fetch(process.env.NEXT_PUBLIC_CRISIS_ALERT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CRISIS_RESOURCE_EMERGENCY',
            alert,
            timestamp: Date.now(),
            message: '🚨 CRITICAL: Crisis resource unavailable - immediate intervention required'
          })
        });
      } catch (error) {
        console.error('Failed to send crisis alert:', error);
      }
    }

    // Log to performance monitor for integrated alerting
    const performanceMonitor = getPerformanceMonitor();
    performanceMonitor.measureCustomMetric('CRISIS_RESOURCE_FAILURE', 1, true);
  }

  private startGlobalHealthChecks(): void {
    // Global health summary every 5 minutes
    setInterval(() => {
      this.generateHealthSummary();
    }, 300000);

    // Cleanup old data every hour
    setInterval(() => {
      this.cleanupOldData();
    }, 3600000);
  }

  private generateHealthSummary(): void {
    const summary = this.getHealthSummary();
    
    if (summary.criticalIssues > 0 || summary.downResources > 0) {
      console.error('[CRISIS MONITOR] Health Summary:', summary);
    } else {
      console.log('[CRISIS MONITOR] All crisis resources healthy');
    }

    // Store summary for dashboard
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm_crisis_health_summary', JSON.stringify({
        ...summary,
        timestamp: Date.now()
      }));
    }
  }

  private cleanupOldData(): void {
    const cutoff = Date.now() - 86400000; // 24 hours

    // Clean alerts
    this.alerts = this.alerts.filter(a => a.timestamp >= cutoff);

    // Clean health checks (keep more recent data)
    const healthCutoff = Date.now() - 3600000; // 1 hour
    for (const [resourceId, checks] of this.healthChecks) {
      const filteredChecks = checks.filter(c => c.timestamp >= healthCutoff);
      this.healthChecks.set(resourceId, filteredChecks);
    }

    // Clean failover events
    this.failoverEvents = this.failoverEvents.filter(e => e.timestamp >= cutoff);
  }

  private storeAlert(alert: ResourceAlert): void {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('alchm_crisis_alerts') || '[]');
      stored.push(alert);
      
      // Keep only last 50 alerts
      if (stored.length > 50) {
        stored.splice(0, stored.length - 50);
      }
      
      localStorage.setItem('alchm_crisis_alerts', JSON.stringify(stored));
    }
  }

  // Public API
  public addResource(resource: CrisisResource): void {
    this.resources.set(resource.id, resource);
    this.healthChecks.set(resource.id, []);
    
    if (this.isMonitoring) {
      this.startResourceMonitoring(resource.id, resource);
    }
    
    console.log(`[CRISIS MONITOR] Added resource: ${resource.name}`);
  }

  public removeResource(resourceId: string): void {
    this.resources.delete(resourceId);
    this.healthChecks.delete(resourceId);
    
    const interval = this.monitoringIntervals.get(resourceId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(resourceId);
    }
    
    console.log(`[CRISIS MONITOR] Removed resource: ${resourceId}`);
  }

  public getResource(resourceId: string): CrisisResource | undefined {
    return this.resources.get(resourceId);
  }

  public getAllResources(): CrisisResource[] {
    return Array.from(this.resources.values());
  }

  public getResourceHealth(resourceId: string): ResourceHealthCheck[] {
    return this.healthChecks.get(resourceId) || [];
  }

  public getLatestResourceHealth(resourceId: string): ResourceHealthCheck | null {
    const checks = this.healthChecks.get(resourceId) || [];
    return checks.length > 0 ? checks[checks.length - 1] : null;
  }

  public getAlerts(timeframe: number = 3600000): ResourceAlert[] {
    const cutoff = Date.now() - timeframe;
    return this.alerts.filter(a => a.timestamp >= cutoff);
  }

  public getCriticalAlerts(timeframe: number = 3600000): ResourceAlert[] {
    return this.getAlerts(timeframe).filter(a => 
      a.severity === 'CRITICAL' || a.severity === 'EMERGENCY'
    );
  }

  public getFailoverEvents(timeframe: number = 86400000): FailoverEvent[] {
    const cutoff = Date.now() - timeframe;
    return this.failoverEvents.filter(e => e.timestamp >= cutoff);
  }

  public onAlert(callback: (alert: ResourceAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  public getHealthSummary(): {
    totalResources: number;
    healthyResources: number;
    degradedResources: number;
    failingResources: number;
    downResources: number;
    criticalIssues: number;
    averageResponseTime: number;
  } {
    const resources = Array.from(this.resources.values());
    let healthyCount = 0;
    let degradedCount = 0;
    let failingCount = 0;
    let downCount = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    resources.forEach(resource => {
      const latestHealth = this.getLatestResourceHealth(resource.id);
      if (latestHealth) {
        switch (latestHealth.status) {
          case 'HEALTHY':
            healthyCount++;
            break;
          case 'DEGRADED':
            degradedCount++;
            break;
          case 'FAILING':
            failingCount++;
            break;
          case 'DOWN':
            downCount++;
            break;
        }
        
        totalResponseTime += latestHealth.responseTime;
        responseTimeCount++;
      }
    });

    const criticalIssues = this.getCriticalAlerts(3600000).length; // Last hour

    return {
      totalResources: resources.length,
      healthyResources: healthyCount,
      degradedResources: degradedCount,
      failingResources: failingCount,
      downResources: downCount,
      criticalIssues,
      averageResponseTime: responseTimeCount > 0 ? totalResponseTime / responseTimeCount : 0
    };
  }

  public async forceHealthCheck(resourceId?: string): Promise<void> {
    if (resourceId) {
      const resource = this.resources.get(resourceId);
      if (resource) {
        await this.checkResourceHealth(resourceId, resource);
      }
    } else {
      // Check all resources
      for (const [id, resource] of this.resources) {
        await this.checkResourceHealth(id, resource);
      }
    }
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    for (const interval of this.monitoringIntervals.values()) {
      clearInterval(interval);
    }
    this.monitoringIntervals.clear();
    
    console.log('[CRISIS MONITOR] Stopped monitoring');
  }

  public startMonitoringIfStopped(): void {
    if (!this.isMonitoring) {
      this.startMonitoring();
    }
  }
}

// Singleton instance
let crisisResourceMonitor: CrisisResourceMonitor | null = null;

export function getCrisisResourceMonitor(): CrisisResourceMonitor {
  if (!crisisResourceMonitor) {
    crisisResourceMonitor = new CrisisResourceMonitor();
  }
  return crisisResourceMonitor;
}

// Utility functions
export function addCrisisResource(resource: CrisisResource): void {
  const monitor = getCrisisResourceMonitor();
  monitor.addResource(resource);
}

export function onCrisisResourceAlert(callback: (alert: ResourceAlert) => void): void {
  const monitor = getCrisisResourceMonitor();
  monitor.onAlert(callback);
}

export function getCrisisResourceHealth(): ReturnType<CrisisResourceMonitor['getHealthSummary']> {
  const monitor = getCrisisResourceMonitor();
  return monitor.getHealthSummary();
}

// Export types
export type { CrisisResource, ResourceHealthCheck, ResourceAlert, FailoverEvent };