/**
 * CRITICAL LIFE-SAFETY SYSTEM: Crisis Performance Safeguards
 * 
 * This system ensures that crisis-related features NEVER experience
 * performance degradation that could impact a user in crisis.
 * 
 * TRAUMA-INFORMED PRINCIPLE: When someone is in crisis, technology
 * must be invisible, instant, and infallible.
 */

import { getPerformanceMonitor } from '../monitoring/real-time-performance-monitor';
import { getRollbackSystem } from '../monitoring/automated-rollback-system';

interface CrisisSafeguard {
  id: string;
  name: string;
  description: string;
  threshold: number;
  action: 'warn' | 'degrade' | 'rollback' | 'emergency';
  isActive: boolean;
  lastTriggered?: number;
  triggerCount: number;
}

interface CrisisPerformanceMetric {
  resourceId: string;
  loadTime: number;
  responseTime: number;
  errorRate: number;
  timestamp: number;
  isCritical: boolean;
}

interface EmergencyFallback {
  componentId: string;
  fallbackComponent: string;
  fallbackMode: 'simple' | 'offline' | 'cached';
  priority: number;
}

class CrisisPerformanceSafeguards {
  private safeguards: Map<string, CrisisSafeguard> = new Map();
  private emergencyFallbacks: Map<string, EmergencyFallback> = new Map();
  private isEmergencyMode = false;
  private crisisMetrics: CrisisPerformanceMetric[] = [];
  private performanceBaselines: Map<string, number> = new Map();
  private degradationCallbacks: ((level: 'warning' | 'critical' | 'emergency') => void)[] = [];

  constructor() {
    this.initializeSafeguards();
    this.setupEmergencyFallbacks();
    this.startContinuousMonitoring();
  }

  private initializeSafeguards(): void {
    // Crisis Resource Loading Safeguards
    this.addSafeguard({
      id: 'crisis_resource_load_time',
      name: 'Crisis Resource Load Time',
      description: 'Ensures crisis resources load within 1 second',
      threshold: 1000,
      action: 'emergency',
      isActive: true,
      triggerCount: 0
    });

    this.addSafeguard({
      id: 'emergency_button_response',
      name: 'Emergency Button Response',
      description: 'Emergency buttons must respond within 100ms',
      threshold: 100,
      action: 'emergency',
      isActive: true,
      triggerCount: 0
    });

    this.addSafeguard({
      id: 'crisis_page_lcp',
      name: 'Crisis Page LCP',
      description: 'Crisis pages must achieve LCP within 1.5 seconds',
      threshold: 1500,
      action: 'rollback',
      isActive: true,
      triggerCount: 0
    });

    this.addSafeguard({
      id: 'hotline_api_response',
      name: 'Crisis Hotline API Response',
      description: 'Crisis hotline APIs must respond within 2 seconds',
      threshold: 2000,
      action: 'degrade',
      isActive: true,
      triggerCount: 0
    });

    this.addSafeguard({
      id: 'crisis_search_performance',
      name: 'Crisis Resource Search',
      description: 'Crisis resource search must return results within 500ms',
      threshold: 500,
      action: 'warn',
      isActive: true,
      triggerCount: 0
    });

    this.addSafeguard({
      id: 'memory_crisis_threshold',
      name: 'Crisis Memory Usage',
      description: 'Memory usage during crisis must stay below 150MB',
      threshold: 150 * 1024 * 1024, // 150MB
      action: 'degrade',
      isActive: true,
      triggerCount: 0
    });

    console.log('[CRISIS SAFEGUARDS] Initialized', this.safeguards.size, 'safeguards');
  }

  private setupEmergencyFallbacks(): void {
    // Define fallback components for crisis features
    this.addEmergencyFallback({
      componentId: 'CrisisResourcesList',
      fallbackComponent: 'StaticCrisisResourcesList',
      fallbackMode: 'cached',
      priority: 1
    });

    this.addEmergencyFallback({
      componentId: 'EmergencyContactForm',
      fallbackComponent: 'SimpleEmergencyForm',
      fallbackMode: 'simple',
      priority: 1
    });

    this.addEmergencyFallback({
      componentId: 'CrisisChat',
      fallbackComponent: 'OfflineCrisisSupport',
      fallbackMode: 'offline',
      priority: 1
    });

    this.addEmergencyFallback({
      componentId: 'HotlineIntegration',
      fallbackComponent: 'StaticHotlineNumbers',
      fallbackMode: 'cached',
      priority: 1
    });

    console.log('[CRISIS SAFEGUARDS] Configured', this.emergencyFallbacks.size, 'emergency fallbacks');
  }

  private startContinuousMonitoring(): void {
    // Monitor performance metrics every 5 seconds
    setInterval(() => {
      this.checkAllSafeguards();
    }, 5000);

    // Monitor crisis resource performance in real-time
    this.setupRealTimeCrisisMonitoring();

    // Check for performance degradation trends
    setInterval(() => {
      this.analyzeTrends();
    }, 30000);
  }

  private setupRealTimeCrisisMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor crisis resource performance
    const performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      
      entries.forEach((entry) => {
        if (this.isCrisisResource(entry.name)) {
          const loadTime = entry.responseEnd - entry.startTime;
          
          this.recordCrisisMetric({
            resourceId: entry.name,
            loadTime,
            responseTime: entry.responseEnd - entry.requestStart,
            errorRate: entry.transferSize === 0 ? 1 : 0,
            timestamp: Date.now(),
            isCritical: this.isCriticalResource(entry.name)
          });

          this.checkResourcePerformance(entry.name, loadTime);
        }
      });
    });

    try {
      performanceObserver.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.error('[CRISIS SAFEGUARDS] Failed to setup resource monitoring:', error);
    }

    // Monitor crisis button interactions
    this.setupCrisisButtonMonitoring();

    // Monitor memory usage for crisis pages
    this.setupCrisisMemoryMonitoring();
  }

  private setupCrisisButtonMonitoring(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (this.isCrisisButton(target)) {
        const startTime = performance.now();
        
        // Monitor button response time
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime;
          
          if (responseTime > this.safeguards.get('emergency_button_response')?.threshold || 100) {
            this.triggerSafeguard('emergency_button_response', responseTime);
          }
        });
      }
    }, { passive: true });
  }

  private setupCrisisMemoryMonitoring(): void {
    if (typeof window === 'undefined' || !('performance' in window) || !('memory' in performance)) return;

    setInterval(() => {
      if (this.isOnCrisisPage()) {
        const memoryInfo = (performance as any).memory;
        const currentUsage = memoryInfo.usedJSHeapSize;
        
        if (currentUsage > this.safeguards.get('memory_crisis_threshold')?.threshold || 150 * 1024 * 1024) {
          this.triggerSafeguard('memory_crisis_threshold', currentUsage);
        }
      }
    }, 10000);
  }

  private checkAllSafeguards(): void {
    // Check LCP for crisis pages
    if (this.isOnCrisisPage()) {
      this.checkCrisisPageLCP();
    }

    // Check API response times
    this.checkAPIPerformance();

    // Check search performance
    this.checkSearchPerformance();
  }

  private checkCrisisPageLCP(): void {
    const performanceMonitor = getPerformanceMonitor();
    const recentMetrics = performanceMonitor.getRecentMetrics(60000); // Last minute
    
    const lcpMetrics = recentMetrics.filter(m => m.type === 'LCP' && m.isCrisisContext);
    
    if (lcpMetrics.length > 0) {
      const averageLCP = lcpMetrics.reduce((sum, m) => sum + m.value, 0) / lcpMetrics.length;
      
      if (averageLCP > this.safeguards.get('crisis_page_lcp')?.threshold || 1500) {
        this.triggerSafeguard('crisis_page_lcp', averageLCP);
      }
    }
  }

  private checkAPIPerformance(): void {
    // This would integrate with your API monitoring
    // For now, we'll check if any crisis APIs are responding slowly
    
    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const recentEntry = performanceEntries[performanceEntries.length - 1];
    
    if (recentEntry && this.isOnCrisisPage()) {
      const responseTime = recentEntry.responseEnd - recentEntry.requestStart;
      
      if (responseTime > this.safeguards.get('hotline_api_response')?.threshold || 2000) {
        this.triggerSafeguard('hotline_api_response', responseTime);
      }
    }
  }

  private checkSearchPerformance(): void {
    // This would monitor crisis resource search performance
    // Implementation would depend on your search implementation
  }

  private checkResourcePerformance(resourceName: string, loadTime: number): void {
    const threshold = this.safeguards.get('crisis_resource_load_time')?.threshold || 1000;
    
    if (loadTime > threshold) {
      this.triggerSafeguard('crisis_resource_load_time', loadTime);
    }
  }

  private triggerSafeguard(safeguardId: string, value: number): void {
    const safeguard = this.safeguards.get(safeguardId);
    if (!safeguard || !safeguard.isActive) return;

    safeguard.triggerCount++;
    safeguard.lastTriggered = Date.now();

    console.error(`🚨 [CRISIS SAFEGUARD TRIGGERED] ${safeguard.name}: ${value} exceeded threshold ${safeguard.threshold}`);

    switch (safeguard.action) {
      case 'warn':
        this.handleWarning(safeguardId, safeguard, value);
        break;
      case 'degrade':
        this.handleDegradation(safeguardId, safeguard, value);
        break;
      case 'rollback':
        this.handleRollback(safeguardId, safeguard, value);
        break;
      case 'emergency':
        this.handleEmergency(safeguardId, safeguard, value);
        break;
    }

    // Notify callbacks
    const severity = safeguard.action === 'emergency' ? 'emergency' :
                    safeguard.action === 'rollback' ? 'critical' : 'warning';
    this.notifyDegradation(severity);
  }

  private handleWarning(safeguardId: string, safeguard: CrisisSafeguard, value: number): void {
    console.warn(`⚠️ [CRISIS WARNING] ${safeguard.name} performance degraded: ${value}/${safeguard.threshold}`);
    
    // Send alert to monitoring
    this.sendAlert({
      type: 'warning',
      safeguardId,
      value,
      threshold: safeguard.threshold,
      message: `Crisis performance warning: ${safeguard.name}`
    });
  }

  private handleDegradation(safeguardId: string, safeguard: CrisisSafeguard, value: number): void {
    console.error(`🔴 [CRISIS DEGRADATION] Activating performance degradation for ${safeguard.name}`);
    
    // Enable degraded mode for specific components
    if (safeguardId === 'memory_crisis_threshold') {
      this.enableMemoryOptimizationMode();
    } else if (safeguardId === 'hotline_api_response') {
      this.enableAPIFallbackMode();
    }
    
    this.sendAlert({
      type: 'degradation',
      safeguardId,
      value,
      threshold: safeguard.threshold,
      message: `Crisis performance degradation: ${safeguard.name}`
    });
  }

  private handleRollback(safeguardId: string, safeguard: CrisisSafeguard, value: number): void {
    console.error(`🔄 [CRISIS ROLLBACK] Triggering rollback for ${safeguard.name}`);
    
    const rollbackSystem = getRollbackSystem();
    rollbackSystem.triggerRollback({
      trigger: `crisis_safeguard_${safeguardId}`,
      severity: 'CRITICAL',
      reason: `Crisis safeguard triggered: ${safeguard.name} (${value}/${safeguard.threshold})`,
      affectedComponents: this.getAffectedComponents(safeguardId)
    });

    this.sendAlert({
      type: 'rollback',
      safeguardId,
      value,
      threshold: safeguard.threshold,
      message: `Crisis rollback triggered: ${safeguard.name}`
    });
  }

  private handleEmergency(safeguardId: string, safeguard: CrisisSafeguard, value: number): void {
    console.error(`🚨 [CRISIS EMERGENCY] Activating emergency mode for ${safeguard.name}`);
    
    this.isEmergencyMode = true;
    
    // Activate all emergency fallbacks
    this.activateAllEmergencyFallbacks();
    
    // Disable non-essential features
    this.disableNonEssentialFeatures();
    
    // Clear caches and optimize for performance
    this.emergencyPerformanceOptimization();

    this.sendAlert({
      type: 'emergency',
      safeguardId,
      value,
      threshold: safeguard.threshold,
      message: `EMERGENCY: Crisis safeguard triggered - ${safeguard.name}`
    });
  }

  private enableMemoryOptimizationMode(): void {
    // Clear non-essential caches
    if (typeof window !== 'undefined') {
      // Clear image caches
      const event = new CustomEvent('clear-image-cache');
      window.dispatchEvent(event);
      
      // Clear component caches
      const clearBundleEvent = new CustomEvent('clear-bundle-cache');
      window.dispatchEvent(clearBundleEvent);
      
      console.log('[CRISIS SAFEGUARDS] Memory optimization mode enabled');
    }
  }

  private enableAPIFallbackMode(): void {
    // Switch to cached/static crisis resources
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('enable-api-fallback');
      window.dispatchEvent(event);
      
      console.log('[CRISIS SAFEGUARDS] API fallback mode enabled');
    }
  }

  private activateAllEmergencyFallbacks(): void {
    this.emergencyFallbacks.forEach((fallback, componentId) => {
      this.activateEmergencyFallback(componentId);
    });
  }

  private activateEmergencyFallback(componentId: string): void {
    const fallback = this.emergencyFallbacks.get(componentId);
    if (!fallback) return;

    if (typeof window !== 'undefined') {
      const event = new CustomEvent('activate-emergency-fallback', {
        detail: {
          componentId,
          fallbackComponent: fallback.fallbackComponent,
          fallbackMode: fallback.fallbackMode
        }
      });
      window.dispatchEvent(event);
      
      console.log(`[CRISIS SAFEGUARDS] Activated emergency fallback: ${componentId} -> ${fallback.fallbackComponent}`);
    }
  }

  private disableNonEssentialFeatures(): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('disable-non-essential-features');
      window.dispatchEvent(event);
      
      console.log('[CRISIS SAFEGUARDS] Non-essential features disabled');
    }
  }

  private emergencyPerformanceOptimization(): void {
    // Clear all caches
    this.enableMemoryOptimizationMode();
    
    // Disable animations and transitions
    if (typeof document !== 'undefined') {
      document.body.classList.add('emergency-performance-mode');
    }
    
    // Reduce quality of non-critical images
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('reduce-image-quality');
      window.dispatchEvent(event);
    }
    
    console.log('[CRISIS SAFEGUARDS] Emergency performance optimization enabled');
  }

  private getAffectedComponents(safeguardId: string): string[] {
    const componentMap: Record<string, string[]> = {
      'crisis_resource_load_time': ['CrisisResourcesList', 'HotlineIntegration'],
      'emergency_button_response': ['EmergencyButton', 'CrisisActionButtons'],
      'crisis_page_lcp': ['CrisisPage', 'EmergencyLanding'],
      'hotline_api_response': ['HotlineIntegration', 'CrisisAPI'],
      'crisis_search_performance': ['CrisisSearch', 'ResourceSearch'],
      'memory_crisis_threshold': ['all']
    };

    return componentMap[safeguardId] || [];
  }

  private recordCrisisMetric(metric: CrisisPerformanceMetric): void {
    this.crisisMetrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.crisisMetrics.length > 100) {
      this.crisisMetrics = this.crisisMetrics.slice(-100);
    }
  }

  private analyzeTrends(): void {
    const recentMetrics = this.crisisMetrics.filter(m => 
      Date.now() - m.timestamp < 300000 // Last 5 minutes
    );

    if (recentMetrics.length < 5) return;

    // Check for degrading performance trends
    const averageLoadTime = recentMetrics.reduce((sum, m) => sum + m.loadTime, 0) / recentMetrics.length;
    const baseline = this.performanceBaselines.get('crisis_load_time') || 500;
    
    if (averageLoadTime > baseline * 2) {
      console.warn(`[CRISIS SAFEGUARDS] Performance trend degrading: ${averageLoadTime}ms vs baseline ${baseline}ms`);
      this.notifyDegradation('warning');
    }
  }

  private sendAlert(alert: any): void {
    // Send to external monitoring services
    if (typeof window !== 'undefined') {
      fetch('/api/crisis-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
        keepalive: true
      }).catch(console.error);
    }
  }

  private notifyDegradation(level: 'warning' | 'critical' | 'emergency'): void {
    this.degradationCallbacks.forEach(callback => {
      try {
        callback(level);
      } catch (error) {
        console.error('[CRISIS SAFEGUARDS] Callback error:', error);
      }
    });
  }

  // Utility methods
  private isCrisisResource(url: string): boolean {
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support', 'hotline', '988', '211'];
    return crisisKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private isCriticalResource(url: string): boolean {
    const criticalKeywords = ['emergency', 'crisis', 'suicide', 'hotline'];
    return criticalKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private isCrisisButton(element: HTMLElement): boolean {
    const crisisSelectors = [
      'data-crisis-action',
      'data-emergency',
      'emergency-button',
      'crisis-button'
    ];
    
    return crisisSelectors.some(selector =>
      element.hasAttribute(selector) || element.classList.contains(selector)
    ) || element.textContent?.toLowerCase().includes('emergency') ||
        element.textContent?.toLowerCase().includes('crisis');
  }

  private isOnCrisisPage(): boolean {
    if (typeof window === 'undefined') return false;
    
    const url = window.location.href.toLowerCase();
    return url.includes('crisis') || 
           url.includes('emergency') || 
           url.includes('support');
  }

  // Public API
  public addSafeguard(safeguard: CrisisSafeguard): void {
    this.safeguards.set(safeguard.id, safeguard);
  }

  public addEmergencyFallback(fallback: EmergencyFallback): void {
    this.emergencyFallbacks.set(fallback.componentId, fallback);
  }

  public onDegradation(callback: (level: 'warning' | 'critical' | 'emergency') => void): () => void {
    this.degradationCallbacks.push(callback);
    return () => {
      const index = this.degradationCallbacks.indexOf(callback);
      if (index > -1) {
        this.degradationCallbacks.splice(index, 1);
      }
    };
  }

  public getSafeguardStatus(): { [key: string]: CrisisSafeguard } {
    const status: { [key: string]: CrisisSafeguard } = {};
    this.safeguards.forEach((safeguard, id) => {
      status[id] = { ...safeguard };
    });
    return status;
  }

  public isInEmergencyMode(): boolean {
    return this.isEmergencyMode;
  }

  public getRecentMetrics(timeRange: number = 300000): CrisisPerformanceMetric[] {
    const cutoff = Date.now() - timeRange;
    return this.crisisMetrics.filter(m => m.timestamp >= cutoff);
  }

  public disableSafeguard(safeguardId: string): void {
    const safeguard = this.safeguards.get(safeguardId);
    if (safeguard) {
      safeguard.isActive = false;
      console.log(`[CRISIS SAFEGUARDS] Disabled safeguard: ${safeguardId}`);
    }
  }

  public enableSafeguard(safeguardId: string): void {
    const safeguard = this.safeguards.get(safeguardId);
    if (safeguard) {
      safeguard.isActive = true;
      console.log(`[CRISIS SAFEGUARDS] Enabled safeguard: ${safeguardId}`);
    }
  }

  public exitEmergencyMode(): void {
    this.isEmergencyMode = false;
    
    if (typeof document !== 'undefined') {
      document.body.classList.remove('emergency-performance-mode');
    }
    
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('exit-emergency-mode');
      window.dispatchEvent(event);
    }
    
    console.log('[CRISIS SAFEGUARDS] Exited emergency mode');
  }

  public destroy(): void {
    this.degradationCallbacks = [];
    this.safeguards.clear();
    this.emergencyFallbacks.clear();
    this.crisisMetrics = [];
  }
}

// Singleton instance
let crisisSafeguardsInstance: CrisisPerformanceSafeguards | null = null;

export function getCrisisSafeguards(): CrisisPerformanceSafeguards {
  if (!crisisSafeguardsInstance) {
    crisisSafeguardsInstance = new CrisisPerformanceSafeguards();
  }
  return crisisSafeguardsInstance;
}

export type { 
  CrisisSafeguard, 
  CrisisPerformanceMetric, 
  EmergencyFallback 
};

export default CrisisPerformanceSafeguards;