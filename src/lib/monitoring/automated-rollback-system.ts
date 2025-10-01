/**
 * CRITICAL LIFE-SAFETY SYSTEM: Automated Rollback System
 * 
 * This system automatically detects performance regressions that could impact
 * crisis users and triggers immediate rollbacks to preserve user safety.
 * Operates on the principle that stability is more important than new features
 * when user lives are at stake.
 */

import { getPerformanceMonitor, CRISIS_PERFORMANCE_THRESHOLDS, type PerformanceAlert } from './real-time-performance-monitor';

interface RollbackConfiguration {
  enabled: boolean;
  thresholds: {
    consecutiveAlerts: number;
    alertTimeframe: number; // milliseconds
    criticalMetrics: string[];
    emergencyMetrics: string[];
  };
  actions: {
    notificationWebhook?: string;
    rollbackWebhook?: string;
    emergencyContactEmail?: string;
  };
}

interface RollbackEvent {
  id: string;
  timestamp: number;
  trigger: 'PERFORMANCE_REGRESSION' | 'CRISIS_RESOURCE_FAILURE' | 'MEMORY_LEAK' | 'MANUAL';
  severity: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  triggeringAlerts: PerformanceAlert[];
  actionsTaken: string[];
  rollbackVersion?: string;
  success: boolean;
  errorMessage?: string;
}

class AutomatedRollbackSystem {
  private config: RollbackConfiguration;
  private alertHistory: PerformanceAlert[] = [];
  private rollbackHistory: RollbackEvent[] = [];
  private isRollbackInProgress = false;
  private emergencyMode = false;

  constructor(config?: Partial<RollbackConfiguration>) {
    this.config = {
      enabled: true,
      thresholds: {
        consecutiveAlerts: 3, // 3 consecutive critical alerts trigger rollback
        alertTimeframe: 300000, // 5 minutes
        criticalMetrics: ['LCP', 'FID', 'CRISIS_RESOURCE_LOAD', 'MEMORY_USAGE'],
        emergencyMetrics: ['OFFLINE_STATUS', 'MEMORY_LEAK', 'CRISIS_RESOURCE_LOAD']
      },
      actions: {
        notificationWebhook: process.env.NEXT_PUBLIC_ROLLBACK_WEBHOOK_URL,
        rollbackWebhook: process.env.NEXT_PUBLIC_DEPLOY_ROLLBACK_URL,
        emergencyContactEmail: process.env.NEXT_PUBLIC_EMERGENCY_CONTACT_EMAIL
      },
      ...config
    };

    this.initializeSystem();
  }

  private initializeSystem() {
    console.log('[ROLLBACK SYSTEM] Automated rollback system initialized');
    
    // Monitor performance alerts
    const performanceMonitor = getPerformanceMonitor();
    performanceMonitor.onAlert((alert) => {
      this.handlePerformanceAlert(alert);
    });

    // Load previous rollback history from storage
    this.loadRollbackHistory();

    // Set up periodic health checks
    this.startHealthChecks();
  }

  private async handlePerformanceAlert(alert: PerformanceAlert) {
    if (!this.config.enabled) return;

    // Add to alert history
    this.alertHistory.push(alert);
    
    // Keep only recent alerts (last hour)
    const cutoff = Date.now() - 3600000;
    this.alertHistory = this.alertHistory.filter(a => a.timestamp >= cutoff);

    console.log(`[ROLLBACK SYSTEM] Processing alert: ${alert.metric} (${alert.severity})`);

    // Check for immediate emergency conditions
    if (this.shouldTriggerEmergencyRollback(alert)) {
      await this.executeEmergencyRollback([alert]);
      return;
    }

    // Check for progressive rollback conditions
    if (this.shouldTriggerProgressiveRollback()) {
      const recentAlerts = this.getRecentCriticalAlerts();
      await this.executeProgressiveRollback(recentAlerts);
      return;
    }

    // Store alert for trend analysis
    this.storeAlertHistory();
  }

  private shouldTriggerEmergencyRollback(alert: PerformanceAlert): boolean {
    // Emergency rollback for critical scenarios
    const emergencyConditions = [
      // Crisis resource completely fails
      alert.metric === 'CRISIS_RESOURCE_LOAD' && alert.value > CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME * 3,
      
      // Severe memory leak
      alert.metric === 'MEMORY_LEAK' && alert.severity === 'EMERGENCY',
      
      // Complete offline in crisis context
      alert.metric === 'OFFLINE_STATUS' && alert.isCrisisContext,
      
      // Catastrophic LCP degradation in crisis
      alert.metric === 'LCP' && alert.isCrisisContext && alert.value > CRISIS_PERFORMANCE_THRESHOLDS.LCP_CRITICAL * 3
    ];

    return emergencyConditions.some(condition => condition);
  }

  private shouldTriggerProgressiveRollback(): boolean {
    if (this.isRollbackInProgress) return false;

    const recentAlerts = this.getRecentCriticalAlerts();
    
    // Check for consecutive critical alerts
    if (recentAlerts.length >= this.config.thresholds.consecutiveAlerts) {
      const criticalMetricAlerts = recentAlerts.filter(alert => 
        this.config.thresholds.criticalMetrics.includes(alert.metric)
      );
      
      if (criticalMetricAlerts.length >= 2) {
        return true;
      }
    }

    // Check for pattern of degrading performance
    if (this.detectPerformanceRegression()) {
      return true;
    }

    return false;
  }

  private getRecentCriticalAlerts(): PerformanceAlert[] {
    const cutoff = Date.now() - this.config.thresholds.alertTimeframe;
    return this.alertHistory.filter(alert => 
      alert.timestamp >= cutoff && 
      (alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY')
    );
  }

  private detectPerformanceRegression(): boolean {
    // Analyze trends in performance metrics
    const lcpAlerts = this.alertHistory.filter(a => a.metric === 'LCP').slice(-5);
    if (lcpAlerts.length >= 3) {
      // Check if LCP is consistently getting worse
      const values = lcpAlerts.map(a => a.value);
      const isIncreasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
      if (isIncreasing && values[values.length - 1] > values[0] * 1.5) {
        return true;
      }
    }

    // Similar checks for other critical metrics
    const fidAlerts = this.alertHistory.filter(a => a.metric === 'FID').slice(-5);
    if (fidAlerts.length >= 3) {
      const values = fidAlerts.map(a => a.value);
      const isIncreasing = values.every((val, i) => i === 0 || val >= values[i - 1]);
      if (isIncreasing && values[values.length - 1] > values[0] * 2) {
        return true;
      }
    }

    return false;
  }

  private async executeEmergencyRollback(triggeringAlerts: PerformanceAlert[]): Promise<void> {
    if (this.isRollbackInProgress) return;

    this.isRollbackInProgress = true;
    this.emergencyMode = true;

    const rollbackEvent: RollbackEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      trigger: 'PERFORMANCE_REGRESSION',
      severity: 'EMERGENCY',
      triggeringAlerts,
      actionsTaken: [],
      success: false
    };

    console.error('[ROLLBACK SYSTEM] 🚨 EMERGENCY ROLLBACK INITIATED 🚨');
    
    try {
      // 1. Immediately enable emergency mode
      rollbackEvent.actionsTaken.push('EMERGENCY_MODE_ENABLED');
      await this.enableEmergencyMode();

      // 2. Trigger deployment rollback
      if (this.config.actions.rollbackWebhook) {
        rollbackEvent.actionsTaken.push('DEPLOYMENT_ROLLBACK_TRIGGERED');
        await this.triggerDeploymentRollback();
      }

      // 3. Clear problematic caches
      rollbackEvent.actionsTaken.push('CACHE_CLEARED');
      await this.clearPerformanceCaches();

      // 4. Activate fallback systems
      rollbackEvent.actionsTaken.push('FALLBACK_SYSTEMS_ACTIVATED');
      await this.activateFallbackSystems();

      // 5. Send emergency notifications
      rollbackEvent.actionsTaken.push('EMERGENCY_NOTIFICATIONS_SENT');
      await this.sendEmergencyNotifications(rollbackEvent);

      rollbackEvent.success = true;
      console.log('[ROLLBACK SYSTEM] ✅ Emergency rollback completed successfully');

    } catch (error) {
      rollbackEvent.success = false;
      rollbackEvent.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ROLLBACK SYSTEM] ❌ Emergency rollback failed:', error);
    }

    this.rollbackHistory.push(rollbackEvent);
    this.storeRollbackHistory();
    this.isRollbackInProgress = false;

    // Keep emergency mode active for monitoring
    setTimeout(() => {
      this.emergencyMode = false;
      console.log('[ROLLBACK SYSTEM] Emergency mode deactivated');
    }, 600000); // 10 minutes
  }

  private async executeProgressiveRollback(triggeringAlerts: PerformanceAlert[]): Promise<void> {
    if (this.isRollbackInProgress) return;

    this.isRollbackInProgress = true;

    const rollbackEvent: RollbackEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      trigger: 'PERFORMANCE_REGRESSION',
      severity: 'CRITICAL',
      triggeringAlerts,
      actionsTaken: [],
      success: false
    };

    console.warn('[ROLLBACK SYSTEM] ⚠️ Progressive rollback initiated');

    try {
      // 1. First try performance optimizations
      rollbackEvent.actionsTaken.push('PERFORMANCE_OPTIMIZATIONS_APPLIED');
      await this.applyPerformanceOptimizations();

      // 2. Wait and check if problem persists
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

      if (await this.isPerformanceStillDegraded()) {
        // 3. Clear caches and restart services
        rollbackEvent.actionsTaken.push('CACHE_RESTART_APPLIED');
        await this.clearPerformanceCaches();
        
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
        
        if (await this.isPerformanceStillDegraded()) {
          // 4. Trigger deployment rollback as last resort
          rollbackEvent.actionsTaken.push('DEPLOYMENT_ROLLBACK_TRIGGERED');
          await this.triggerDeploymentRollback();
        }
      }

      // 5. Send notifications
      rollbackEvent.actionsTaken.push('NOTIFICATIONS_SENT');
      await this.sendRollbackNotifications(rollbackEvent);

      rollbackEvent.success = true;
      console.log('[ROLLBACK SYSTEM] ✅ Progressive rollback completed');

    } catch (error) {
      rollbackEvent.success = false;
      rollbackEvent.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ROLLBACK SYSTEM] ❌ Progressive rollback failed:', error);
    }

    this.rollbackHistory.push(rollbackEvent);
    this.storeRollbackHistory();
    this.isRollbackInProgress = false;
  }

  private async enableEmergencyMode(): Promise<void> {
    // Set emergency flags in localStorage for immediate UI updates
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm_emergency_mode', 'true');
      localStorage.setItem('alchm_emergency_timestamp', Date.now().toString());
    }

    // Broadcast emergency mode to all tabs
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('alchm_emergency');
      channel.postMessage({ type: 'EMERGENCY_MODE_ENABLED', timestamp: Date.now() });
    }
  }

  private async triggerDeploymentRollback(): Promise<void> {
    if (!this.config.actions.rollbackWebhook) {
      throw new Error('No rollback webhook configured');
    }

    const response = await fetch(this.config.actions.rollbackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ROLLBACK_TOKEN}`
      },
      body: JSON.stringify({
        action: 'rollback',
        reason: 'performance_regression',
        timestamp: Date.now(),
        severity: this.emergencyMode ? 'emergency' : 'critical'
      })
    });

    if (!response.ok) {
      throw new Error(`Rollback webhook failed: ${response.status}`);
    }
  }

  private async clearPerformanceCaches(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Clear various browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage performance data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('alchm_performance_') || 
        key.startsWith('alchm_cache_')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Force reload critical resources
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach((link: any) => {
        const href = link.href;
        link.href = href + (href.includes('?') ? '&' : '?') + 'bust=' + Date.now();
      });
    }
  }

  private async activateFallbackSystems(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Enable offline-first mode
      localStorage.setItem('alchm_offline_first', 'true');
      
      // Preload critical crisis resources
      const criticalResources = [
        '/crisis-resources.json',
        '/emergency-contacts.json',
        '/crisis-support.html'
      ];
      
      for (const resource of criticalResources) {
        try {
          const response = await fetch(resource);
          if (response.ok) {
            const content = await response.text();
            localStorage.setItem(`alchm_fallback_${resource}`, content);
          }
        } catch (error) {
          console.warn(`Failed to cache fallback resource: ${resource}`, error);
        }
      }
    }
  }

  private async applyPerformanceOptimizations(): Promise<void> {
    if (typeof window !== 'undefined') {
      // Reduce JavaScript execution
      localStorage.setItem('alchm_reduced_animations', 'true');
      localStorage.setItem('alchm_minimal_features', 'true');
      
      // Disable non-critical features
      localStorage.setItem('alchm_disable_analytics', 'true');
      localStorage.setItem('alchm_disable_prefetch', 'true');
    }
  }

  private async isPerformanceStillDegraded(): Promise<boolean> {
    // Quick performance check
    const performanceMonitor = getPerformanceMonitor();
    const recentMetrics = await performanceMonitor.getRecentMetrics(60000); // Last minute
    
    const lcpMetrics = recentMetrics.filter(m => m.type === 'LCP');
    const avgLcp = lcpMetrics.length > 0 
      ? lcpMetrics.reduce((sum, m) => sum + m.value, 0) / lcpMetrics.length 
      : 0;
    
    return avgLcp > CRISIS_PERFORMANCE_THRESHOLDS.LCP_CRITICAL;
  }

  private async sendEmergencyNotifications(rollbackEvent: RollbackEvent): Promise<void> {
    const notification = {
      type: 'EMERGENCY_ROLLBACK',
      timestamp: rollbackEvent.timestamp,
      triggeringAlerts: rollbackEvent.triggeringAlerts,
      actionsTaken: rollbackEvent.actionsTaken,
      message: '🚨 EMERGENCY: Automated rollback triggered due to critical performance degradation affecting crisis users'
    };

    // Send to notification webhook
    if (this.config.actions.notificationWebhook) {
      try {
        await fetch(this.config.actions.notificationWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
      } catch (error) {
        console.error('Failed to send emergency notification:', error);
      }
    }

    // Send email if configured
    if (this.config.actions.emergencyContactEmail) {
      // Implementation would depend on email service
      console.error(`EMERGENCY NOTIFICATION NEEDED: ${this.config.actions.emergencyContactEmail}`, notification);
    }
  }

  private async sendRollbackNotifications(rollbackEvent: RollbackEvent): Promise<void> {
    const notification = {
      type: 'PROGRESSIVE_ROLLBACK',
      timestamp: rollbackEvent.timestamp,
      triggeringAlerts: rollbackEvent.triggeringAlerts,
      actionsTaken: rollbackEvent.actionsTaken,
      message: '⚠️ Automated performance rollback executed due to detected regression'
    };

    if (this.config.actions.notificationWebhook) {
      try {
        await fetch(this.config.actions.notificationWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });
      } catch (error) {
        console.error('Failed to send rollback notification:', error);
      }
    }
  }

  private startHealthChecks(): void {
    // Perform health checks every 2 minutes
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        console.error('[ROLLBACK SYSTEM] Health check failed:', error);
      }
    }, 120000);
  }

  private async performHealthCheck(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check if we're in a degraded state
    const emergencyMode = localStorage.getItem('alchm_emergency_mode') === 'true';
    const emergencyTimestamp = parseInt(localStorage.getItem('alchm_emergency_timestamp') || '0');
    
    // Auto-recover from emergency mode after 1 hour if performance is stable
    if (emergencyMode && Date.now() - emergencyTimestamp > 3600000) {
      const isStable = await this.checkPerformanceStability();
      if (isStable) {
        localStorage.removeItem('alchm_emergency_mode');
        localStorage.removeItem('alchm_emergency_timestamp');
        console.log('[ROLLBACK SYSTEM] ✅ Auto-recovered from emergency mode');
      }
    }
  }

  private async checkPerformanceStability(): Promise<boolean> {
    const performanceMonitor = getPerformanceMonitor();
    const recentAlerts = await performanceMonitor.getRecentAlerts(600000); // Last 10 minutes
    
    // No critical alerts in the last 10 minutes indicates stability
    const criticalAlerts = recentAlerts.filter(a => 
      a.severity === 'CRITICAL' || a.severity === 'EMERGENCY'
    );
    
    return criticalAlerts.length === 0;
  }

  private loadRollbackHistory(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('alchm_rollback_history');
      if (stored) {
        try {
          this.rollbackHistory = JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to load rollback history:', error);
        }
      }
    }
  }

  private storeRollbackHistory(): void {
    if (typeof window !== 'undefined') {
      // Keep only last 20 rollback events
      if (this.rollbackHistory.length > 20) {
        this.rollbackHistory = this.rollbackHistory.slice(-20);
      }
      
      localStorage.setItem('alchm_rollback_history', JSON.stringify(this.rollbackHistory));
    }
  }

  private storeAlertHistory(): void {
    if (typeof window !== 'undefined') {
      // Keep only last 100 alerts
      if (this.alertHistory.length > 100) {
        this.alertHistory = this.alertHistory.slice(-100);
      }
      
      localStorage.setItem('alchm_alert_history', JSON.stringify(this.alertHistory));
    }
  }

  // Public API
  public async manualRollback(reason: string): Promise<RollbackEvent> {
    const rollbackEvent: RollbackEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      trigger: 'MANUAL',
      severity: 'WARNING',
      triggeringAlerts: [],
      actionsTaken: [],
      success: false
    };

    try {
      await this.triggerDeploymentRollback();
      rollbackEvent.actionsTaken.push('MANUAL_DEPLOYMENT_ROLLBACK');
      rollbackEvent.success = true;
    } catch (error) {
      rollbackEvent.errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    this.rollbackHistory.push(rollbackEvent);
    this.storeRollbackHistory();
    
    return rollbackEvent;
  }

  public getRollbackHistory(): RollbackEvent[] {
    return [...this.rollbackHistory];
  }

  public isInEmergencyMode(): boolean {
    return this.emergencyMode || 
           (typeof window !== 'undefined' && localStorage.getItem('alchm_emergency_mode') === 'true');
  }

  public getConfiguration(): RollbackConfiguration {
    return { ...this.config };
  }

  public updateConfiguration(newConfig: Partial<RollbackConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('[ROLLBACK SYSTEM] Configuration updated');
  }
}

// Singleton instance
let rollbackSystem: AutomatedRollbackSystem | null = null;

export function getRollbackSystem(config?: Partial<RollbackConfiguration>): AutomatedRollbackSystem {
  if (!rollbackSystem) {
    rollbackSystem = new AutomatedRollbackSystem(config);
  }
  return rollbackSystem;
}

// Utility functions
export function triggerManualRollback(reason: string): Promise<RollbackEvent> {
  const system = getRollbackSystem();
  return system.manualRollback(reason);
}

export function isInEmergencyMode(): boolean {
  if (rollbackSystem) {
    return rollbackSystem.isInEmergencyMode();
  }
  return typeof window !== 'undefined' && localStorage.getItem('alchm_emergency_mode') === 'true';
}

// Export types
export type { RollbackConfiguration, RollbackEvent };