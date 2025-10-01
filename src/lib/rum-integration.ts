/**
 * ALCHM RUM Integration System
 * 
 * Comprehensive Real User Monitoring integration for trauma-informed performance
 * Coordinates all monitoring systems and ensures proper initialization
 */

import { realUserMonitoring } from './real-user-monitoring';
import { mobileTraumaMonitor } from './mobile-trauma-performance';
import { userSafetyAlerts } from './user-safety-alerts';

export interface RUMConfig {
  enableWebVitals: boolean;
  enableMobileMonitoring: boolean;
  enableSafetyAlerts: boolean;
  enableAnalytics: boolean;
  enableCrisisMonitoring: boolean;
  alertWebhook?: string;
  debugMode: boolean;
}

export interface RUMStatus {
  initialized: boolean;
  webVitalsActive: boolean;
  mobileMonitoringActive: boolean;
  safetyAlertsActive: boolean;
  crisisMonitoringActive: boolean;
  lastHealthCheck: number;
  errors: string[];
}

class RUMIntegrationSystem {
  private config: RUMConfig = {
    enableWebVitals: true,
    enableMobileMonitoring: true,
    enableSafetyAlerts: true,
    enableAnalytics: true,
    enableCrisisMonitoring: true,
    debugMode: process.env.NODE_ENV === 'development'
  };

  private status: RUMStatus = {
    initialized: false,
    webVitalsActive: false,
    mobileMonitoringActive: false,
    safetyAlertsActive: false,
    crisisMonitoringActive: false,
    lastHealthCheck: 0,
    errors: []
  };

  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isInitializing = false;

  constructor(customConfig?: Partial<RUMConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }
  }

  /**
   * Initialize all RUM systems
   */
  public async initialize(): Promise<void> {
    if (this.status.initialized || this.isInitializing) return;
    if (typeof window === 'undefined') return;

    this.isInitializing = true;
    this.log('🏥 Initializing ALCHM RUM Integration System...');

    try {
      // Initialize core systems in order of priority
      await this.initializeWebVitalsMonitoring();
      await this.initializeCrisisMonitoring();
      await this.initializeMobileMonitoring();
      await this.initializeSafetyAlerts();
      
      // Set up integrations between systems
      this.setupSystemIntegrations();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      this.status.initialized = true;
      this.log('✅ RUM Integration System initialized successfully');
      
      // Perform initial crisis resource check
      if (this.config.enableCrisisMonitoring) {
        await this.performInitialCrisisCheck();
      }
      
    } catch (error) {
      this.handleInitializationError(error);
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private async initializeWebVitalsMonitoring(): Promise<void> {
    if (!this.config.enableWebVitals) return;

    try {
      await realUserMonitoring.initialize();
      this.status.webVitalsActive = true;
      this.log('📊 Web Vitals monitoring initialized');
    } catch (error) {
      this.addError('Web Vitals initialization failed', error);
    }
  }

  /**
   * Initialize crisis-specific monitoring
   */
  private async initializeCrisisMonitoring(): Promise<void> {
    if (!this.config.enableCrisisMonitoring) return;

    try {
      // Setup crisis resource monitoring
      await this.setupCrisisResourceMonitoring();
      
      // Monitor crisis navigation performance
      this.setupCrisisNavigationMonitoring();
      
      this.status.crisisMonitoringActive = true;
      this.log('🚨 Crisis monitoring initialized');
    } catch (error) {
      this.addError('Crisis monitoring initialization failed', error);
    }
  }

  /**
   * Initialize mobile trauma monitoring
   */
  private async initializeMobileMonitoring(): Promise<void> {
    if (!this.config.enableMobileMonitoring) return;

    try {
      await mobileTraumaMonitor.initialize();
      this.status.mobileMonitoringActive = true;
      this.log('📱 Mobile trauma monitoring initialized');
    } catch (error) {
      this.addError('Mobile monitoring initialization failed', error);
    }
  }

  /**
   * Initialize safety alerts system
   */
  private async initializeSafetyAlerts(): Promise<void> {
    if (!this.config.enableSafetyAlerts) return;

    try {
      // Configure safety alerts
      userSafetyAlerts.updateConfig({
        enabled: true,
        notificationChannels: {
          console: true,
          analytics: this.config.enableAnalytics,
          webhook: this.config.alertWebhook
        }
      });

      this.status.safetyAlertsActive = true;
      this.log('🛡️ Safety alerts system initialized');
    } catch (error) {
      this.addError('Safety alerts initialization failed', error);
    }
  }

  /**
   * Setup integrations between monitoring systems
   */
  private setupSystemIntegrations(): void {
    // Connect RUM to safety alerts
    if (this.status.webVitalsActive && this.status.safetyAlertsActive) {
      realUserMonitoring.onAlert((metric) => {
        userSafetyAlerts.processPerformanceMetric(metric);
      });
    }

    // Connect mobile monitoring to safety alerts
    if (this.status.mobileMonitoringActive && this.status.safetyAlertsActive) {
      // Set up periodic mobile metrics reporting
      setInterval(() => {
        const metrics = mobileTraumaMonitor.getMetrics();
        userSafetyAlerts.processMobileMetrics(metrics);
      }, 10000); // Every 10 seconds
    }

    // Setup crisis-specific alert handlers
    if (this.status.safetyAlertsActive) {
      userSafetyAlerts.onAlert((alert) => {
        this.handleSafetyAlert(alert);
      });
    }

    this.log('🔗 System integrations configured');
  }

  /**
   * Setup crisis resource monitoring
   */
  private async setupCrisisResourceMonitoring(): Promise<void> {
    const crisisResources = [
      '/crisis-resources.json',
      '/emergency-crisis.html',
      '/api/crisis-detection'
    ];

    // Monitor crisis resource fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || '';
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        
        // Check if this is a crisis resource
        if (this.isCrisisResource(url)) {
          const loadTime = performance.now() - startTime;
          this.reportCrisisResourcePerformance(url, loadTime, response.ok);
        }
        
        return response;
      } catch (error) {
        if (this.isCrisisResource(url)) {
          const loadTime = performance.now() - startTime;
          this.reportCrisisResourceError(url, loadTime, error);
        }
        throw error;
      }
    };
  }

  /**
   * Setup crisis navigation monitoring
   */
  private setupCrisisNavigationMonitoring(): void {
    // Monitor navigation to crisis pages
    const crisisPages = ['/crisis', '/emergency', '/resources'];
    
    // Use Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const currentUrl = window.location.pathname;
            
            if (crisisPages.some(page => currentUrl.includes(page))) {
              this.reportCrisisNavigationPerformance(navEntry);
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  /**
   * Start health monitoring for all systems
   */
  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  /**
   * Perform health check on all systems
   */
  private performHealthCheck(): void {
    this.status.lastHealthCheck = Date.now();
    
    // Check if systems are still responsive
    try {
      // Test Web Vitals system
      if (this.config.enableWebVitals && !this.status.webVitalsActive) {
        this.addError('Web Vitals system became inactive');
      }
      
      // Test mobile monitoring
      if (this.config.enableMobileMonitoring && !this.status.mobileMonitoringActive) {
        this.addError('Mobile monitoring system became inactive');
      }
      
      // Test safety alerts
      if (this.config.enableSafetyAlerts && !this.status.safetyAlertsActive) {
        this.addError('Safety alerts system became inactive');
      }
      
      // Report health status
      if (this.config.debugMode) {
        this.log('💚 Health check completed', this.status);
      }
      
    } catch (error) {
      this.addError('Health check failed', error);
    }
  }

  /**
   * Perform initial crisis resource check
   */
  private async performInitialCrisisCheck(): Promise<void> {
    try {
      await userSafetyAlerts.checkCrisisResourcesPerformance();
      this.log('🚨 Initial crisis resource check completed');
    } catch (error) {
      this.addError('Initial crisis check failed', error);
    }
  }

  /**
   * Check if URL is a crisis resource
   */
  private isCrisisResource(url: string): boolean {
    const crisisPatterns = [
      '/crisis',
      '/emergency',
      'crisis-resources',
      'tel:988',
      '/api/crisis-detection'
    ];
    
    return crisisPatterns.some(pattern => url.includes(pattern));
  }

  /**
   * Report crisis resource performance
   */
  private reportCrisisResourcePerformance(url: string, loadTime: number, success: boolean): void {
    if (this.config.debugMode) {
      this.log(`🚨 Crisis resource performance: ${url} - ${Math.round(loadTime)}ms - ${success ? 'SUCCESS' : 'FAILED'}`);
    }

    // Send to analytics if enabled
    if (this.config.enableAnalytics && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'crisis_resource_performance', {
        resource_url: url,
        load_time: Math.round(loadTime),
        success: success,
        event_category: 'crisis_monitoring'
      });
    }
  }

  /**
   * Report crisis resource error
   */
  private reportCrisisResourceError(url: string, loadTime: number, error: any): void {
    this.addError(`Crisis resource failed: ${url}`, error);
    
    // This is critical - crisis resources must be available
    if (this.status.safetyAlertsActive) {
      userSafetyAlerts.createAlert({
        type: 'critical',
        category: 'crisis_resource',
        title: 'Crisis Resource Unavailable',
        message: `Critical crisis resource ${url} failed to load: ${error.message}`,
        impact: 'high',
        recommendations: [
          'Check server status immediately',
          'Verify CDN configuration',
          'Activate backup resources',
          'Alert infrastructure team'
        ],
        escalationLevel: 4
      } as any);
    }
  }

  /**
   * Report crisis navigation performance
   */
  private reportCrisisNavigationPerformance(navEntry: PerformanceNavigationTiming): void {
    const totalTime = navEntry.loadEventEnd - navEntry.navigationStart;
    
    if (this.config.debugMode) {
      this.log(`🚨 Crisis navigation performance: ${Math.round(totalTime)}ms`);
    }

    // Alert on slow crisis navigation
    if (totalTime > 3000) { // 3 seconds is critical for crisis navigation
      if (this.status.safetyAlertsActive) {
        userSafetyAlerts.createAlert({
          type: 'critical',
          category: 'crisis_resource',
          title: 'Slow Crisis Navigation',
          message: `Crisis page navigation took ${Math.round(totalTime)}ms - exceeds safety threshold`,
          impact: 'high',
          recommendations: [
            'Optimize crisis page bundle size',
            'Preload critical crisis resources',
            'Check database query performance',
            'Review server response times'
          ],
          escalationLevel: 3
        } as any);
      }
    }
  }

  /**
   * Handle safety alerts
   */
  private handleSafetyAlert(alert: any): void {
    // Log critical alerts immediately
    if (alert.type === 'critical') {
      console.error('🚨 CRITICAL SAFETY ALERT:', alert);
    }

    // Send to external monitoring if configured
    if (this.config.alertWebhook) {
      this.sendAlertToWebhook(alert);
    }

    // Update internal status
    if (alert.escalationLevel >= 3) {
      this.addError(`Safety alert: ${alert.title}`);
    }
  }

  /**
   * Send alert to external webhook
   */
  private async sendAlertToWebhook(alert: any): Promise<void> {
    if (!this.config.alertWebhook) return;

    try {
      await fetch(this.config.alertWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alert,
          source: 'alchm-rum-integration',
          timestamp: new Date().toISOString(),
          status: this.status
        })
      });
    } catch (error) {
      this.addError('Failed to send alert to webhook', error);
    }
  }

  /**
   * Handle initialization error
   */
  private handleInitializationError(error: any): void {
    this.addError('RUM system initialization failed', error);
    console.error('🚨 RUM Integration System initialization failed:', error);
    
    // Try to initialize individual systems that haven't failed
    this.attemptPartialRecovery();
  }

  /**
   * Attempt partial recovery of failed systems
   */
  private async attemptPartialRecovery(): Promise<void> {
    this.log('🔄 Attempting partial system recovery...');
    
    // Try to recover Web Vitals
    if (this.config.enableWebVitals && !this.status.webVitalsActive) {
      try {
        await this.initializeWebVitalsMonitoring();
      } catch (error) {
        this.log('❌ Web Vitals recovery failed');
      }
    }
    
    // Try to recover mobile monitoring
    if (this.config.enableMobileMonitoring && !this.status.mobileMonitoringActive) {
      try {
        await this.initializeMobileMonitoring();
      } catch (error) {
        this.log('❌ Mobile monitoring recovery failed');
      }
    }
  }

  /**
   * Add error to status
   */
  private addError(message: string, error?: any): void {
    const errorMessage = error ? `${message}: ${error.message}` : message;
    this.status.errors.push(errorMessage);
    
    // Keep only recent errors
    if (this.status.errors.length > 10) {
      this.status.errors = this.status.errors.slice(-5);
    }
    
    if (this.config.debugMode) {
      console.error('🚨 RUM Error:', errorMessage, error);
    }
  }

  /**
   * Log message with timestamp
   */
  private log(message: string, data?: any): void {
    if (this.config.debugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${message}`, data || '');
    }
  }

  /**
   * Get current system status
   */
  public getStatus(): RUMStatus {
    return { ...this.status };
  }

  /**
   * Get current configuration
   */
  public getConfig(): RUMConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<RUMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Apply config changes to subsystems
    if (this.status.safetyAlertsActive) {
      userSafetyAlerts.updateConfig({
        enabled: this.config.enableSafetyAlerts,
        notificationChannels: {
          console: true,
          analytics: this.config.enableAnalytics,
          webhook: this.config.alertWebhook
        }
      });
    }
  }

  /**
   * Force crisis resource check
   */
  public async checkCrisisResources(): Promise<void> {
    if (this.status.safetyAlertsActive) {
      await userSafetyAlerts.checkCrisisResourcesPerformance();
    }
  }

  /**
   * Get recent performance summary
   */
  public getPerformanceSummary(): any {
    return {
      webVitals: this.status.webVitalsActive ? realUserMonitoring.getCrisisResourcePerformance() : {},
      mobileMetrics: this.status.mobileMonitoringActive ? mobileTraumaMonitor.getMetrics() : null,
      recentAlerts: this.status.safetyAlertsActive ? userSafetyAlerts.getRecentAlerts(5) : [],
      systemStatus: this.status
    };
  }

  /**
   * Cleanup all systems
   */
  public cleanup(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    realUserMonitoring.cleanup();
    mobileTraumaMonitor.cleanup();
    
    this.status.initialized = false;
    this.status.webVitalsActive = false;
    this.status.mobileMonitoringActive = false;
    this.status.safetyAlertsActive = false;
    this.status.crisisMonitoringActive = false;
    
    this.log('🧹 RUM Integration System cleaned up');
  }
}

// Export singleton instance
export const rumIntegration = new RUMIntegrationSystem();

// Auto-initialize on browser load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      rumIntegration.initialize();
    });
  } else {
    rumIntegration.initialize();
  }
}

// Global access for debugging
if (typeof window !== 'undefined') {
  (window as any).alchm_rum = rumIntegration;
}

export default rumIntegration;