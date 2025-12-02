/**
 * ALCHM Bundle Optimization System
 * 
 * Advanced code splitting and dynamic imports for trauma-informed performance.
 * Prioritizes crisis resources and emergency features to load first.
 */

import { lazy } from 'react';
import type { ComponentType } from 'react';

// Crisis-priority component loading thresholds
const CRISIS_LOAD_PRIORITY = {
  IMMEDIATE: 0,    // Crisis resources, emergency buttons
  HIGH: 1,         // Authentication, basic journaling
  MEDIUM: 2,       // Dashboard, analytics
  LOW: 3,          // Admin, advanced features
  DEFERRED: 4      // Non-essential components
};

interface ComponentLoadConfig {
  priority: number;
  preload?: boolean;
  timeout?: number;
  fallback?: ComponentType<any>;
  errorBoundary?: ComponentType<any>;
}

interface BundleMetrics {
  componentName: string;
  loadTime: number;
  bundleSize?: number;
  cacheHit: boolean;
  timestamp: number;
  isCrisisContext: boolean;
  userConnection?: string;
}

class BundleOptimizer {
  private loadedComponents: Map<string, ComponentType<any>> = new Map();
  private loadingComponents: Map<string, Promise<ComponentType<any>>> = new Map();
  private preloadQueue: string[] = [];
  private metrics: BundleMetrics[] = [];
  private connectionType: string = 'unknown';

  constructor() {
    this.initializeNetworkMonitoring();
    this.preloadCriticalResources();
  }

  private initializeNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection;
    if (connection) {
      this.connectionType = connection.effectiveType;
      connection.addEventListener('change', () => {
        this.connectionType = connection.effectiveType;
        this.adjustLoadingStrategy();
      });
    }
  }

  private adjustLoadingStrategy(): void {
    const isSlowConnection = ['slow-2g', '2g'].includes(this.connectionType);
    
    if (isSlowConnection) {
      console.warn('[BUNDLE OPTIMIZER] Slow connection detected - prioritizing crisis resources');
      this.preloadCriticalResources();
    }
  }

  private preloadCriticalResources(): void {
    // Preload crisis-critical components
    const criticalComponents = [
      'CrisisSupport',
      'EmergencyButton', 
      'CrisisResourcesPage',
      'EmergencyAuth'
    ];

    criticalComponents.forEach(component => {
      this.preloadComponent(component);
    });
  }

  private preloadComponent(componentName: string): void {
    if (this.loadedComponents.has(componentName)) return;
    
    this.loadComponent(componentName, { 
      priority: CRISIS_LOAD_PRIORITY.IMMEDIATE,
      preload: true 
    });
  }

  public loadComponent(
    componentName: string, 
    config: ComponentLoadConfig = { priority: CRISIS_LOAD_PRIORITY.MEDIUM }
  ): Promise<ComponentType<any>> {
    const startTime = performance.now();
    
    // Return cached component if available
    if (this.loadedComponents.has(componentName)) {
      const component = this.loadedComponents.get(componentName)!;
      this.recordMetrics(componentName, performance.now() - startTime, true);
      return Promise.resolve(component);
    }

    // Return in-flight loading promise
    if (this.loadingComponents.has(componentName)) {
      return this.loadingComponents.get(componentName)!;
    }

    // Create new loading promise
    const loadPromise = this.createLoadPromise(componentName, config, startTime);
    this.loadingComponents.set(componentName, loadPromise);

    return loadPromise;
  }

  private async createLoadPromise(
    componentName: string, 
    config: ComponentLoadConfig, 
    startTime: number
  ): Promise<ComponentType<any>> {
    try {
      const component = await this.importComponent(componentName);
      const loadTime = performance.now() - startTime;
      
      // Cache the component
      this.loadedComponents.set(componentName, component);
      this.loadingComponents.delete(componentName);
      
      // Record metrics
      this.recordMetrics(componentName, loadTime, false);
      
      // Alert if crisis component takes too long
      if (config.priority <= CRISIS_LOAD_PRIORITY.HIGH && loadTime > 1000) {
        console.warn(`[BUNDLE OPTIMIZER] Crisis component ${componentName} took ${loadTime}ms to load`);
      }

      return component;
    } catch (error) {
      this.loadingComponents.delete(componentName);
      console.error(`[BUNDLE OPTIMIZER] Failed to load ${componentName}:`, error);
      
      if (config.fallback) {
        return config.fallback;
      }
      
      throw error;
    }
  }

  private async importComponent(componentName: string): Promise<ComponentType<any>> {
    // Dynamic imports based on component categories
    switch (componentName) {
      // Crisis Components (Immediate Priority)
      case 'CrisisSupport':
        return (await import('@/components/crisis/CrisisSupport')).default;
      case 'EmergencyButton':
        return (await import('@/components/ui/EmergencyCrisisButton')).default;
      case 'CrisisResourcesPage':
        return (await import('@/app/crisis-resources/page')).default;
      case 'EmergencyAuth':
        return (await import('@/components/auth/EmergencyAuth')).default;

      // Authentication Components (High Priority)
      case 'LoginClient':
        return (await import('@/app/[locale]/auth/login/LoginClient')).default;
      case 'SignupClient':
        return (await import('@/app/[locale]/auth/signup/SignupClient')).default;
      case 'AuthProviders':
        return (await import('@/components/auth/SignInButtons')).default;

      // Core App Components (Medium Priority)
      case 'Dashboard':
        return (await import('@/components/Dashboard')).default;
      case 'JournalEntry':
        return (await import('@/components/JournalEntry')).default;
      case 'PathwaysDashboard':
        return (await import('@/components/pathways/PathwaysDashboard')).default;

      // AI Components (Medium Priority)
      case 'KheperaChat':
        return (await import('@/components/khepera/KheperaChat')).default;
      case 'AIInsightPanel':
        return (await import('@/components/ai/AIInsightPanel')).default;

      // Analytics Components (Low Priority)
      case 'AnalyticsVisualization':
        return (await import('@/components/analytics/AnalyticsVisualization')).default;
      case 'WellnessAnalytics':
        return (await import('@/components/analytics/WellnessAnalytics')).default;

      // Admin Components (Deferred Priority)
      case 'BusinessIntelligenceDashboard':
        return (await import('@/components/admin/BusinessIntelligenceDashboard')).default;
      case 'ComplianceDashboard':
        return (await import('@/components/compliance/ComplianceDashboard')).default;

      default:
        throw new Error(`Unknown component: ${componentName}`);
    }
  }

  private recordMetrics(
    componentName: string, 
    loadTime: number, 
    cacheHit: boolean
  ): void {
    const metric: BundleMetrics = {
      componentName,
      loadTime,
      cacheHit,
      timestamp: Date.now(),
      isCrisisContext: this.isCrisisContext(),
      userConnection: this.connectionType
    };

    this.metrics.push(metric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Send to performance monitoring
    this.sendMetricsToMonitor(metric);
  }

  private isCrisisContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    const url = window.location.href.toLowerCase();
    return url.includes('crisis') || 
           url.includes('emergency') || 
           url.includes('support');
  }

  private sendMetricsToMonitor(metric: BundleMetrics): void {
    // Send to performance monitor
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('bundle-metric', { detail: metric });
      window.dispatchEvent(event);
    }
  }

  // Public API
  public getMetrics(timeRange?: number): BundleMetrics[] {
    if (!timeRange) return [...this.metrics];
    
    const cutoff = Date.now() - timeRange;
    return this.metrics.filter(m => m.timestamp >= cutoff);
  }

  public getCacheStats() {
    return {
      totalComponents: this.loadedComponents.size,
      loadingComponents: this.loadingComponents.size,
      cacheHitRate: this.calculateCacheHitRate(),
      averageLoadTime: this.calculateAverageLoadTime()
    };
  }

  private calculateCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    
    const cacheHits = this.metrics.filter(m => m.cacheHit).length;
    return (cacheHits / this.metrics.length) * 100;
  }

  private calculateAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const totalTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0);
    return totalTime / this.metrics.length;
  }

  public clearCache(): void {
    this.loadedComponents.clear();
    this.loadingComponents.clear();
    console.log('[BUNDLE OPTIMIZER] Cache cleared');
  }
}

// Singleton instance
let bundleOptimizer: BundleOptimizer | null = null;

export function getBundleOptimizer(): BundleOptimizer {
  if (!bundleOptimizer) {
    bundleOptimizer = new BundleOptimizer();
  }
  return bundleOptimizer;
}

// Lazy loading wrapper with crisis priority
export function lazyLoad<T extends ComponentType<any>>(
  componentName: string,
  config?: ComponentLoadConfig
): T {
  return lazy(async () => {
    const optimizer = getBundleOptimizer();
    const component = await optimizer.loadComponent(componentName, config);
    return { default: component };
  }) as T;
}

// Crisis-priority component loader
export function loadCrisisComponent<T extends ComponentType<any>>(
  componentName: string
): Promise<T> {
  const optimizer = getBundleOptimizer();
  return optimizer.loadComponent(componentName, {
    priority: CRISIS_LOAD_PRIORITY.IMMEDIATE,
    timeout: 1000
  }) as Promise<T>;
}

// Preload components based on user journey
export function preloadUserJourney(journey: 'crisis' | 'auth' | 'journal' | 'analytics'): void {
  const optimizer = getBundleOptimizer();
  
  const journeyComponents = {
    crisis: ['CrisisSupport', 'EmergencyButton', 'CrisisResourcesPage'],
    auth: ['LoginClient', 'SignupClient', 'AuthProviders'],
    journal: ['JournalEntry', 'Dashboard', 'KheperaChat'],
    analytics: ['AnalyticsVisualization', 'WellnessAnalytics']
  };

  const components = journeyComponents[journey] || [];
  components.forEach(component => {
    optimizer.loadComponent(component, { 
      priority: journey === 'crisis' ? CRISIS_LOAD_PRIORITY.IMMEDIATE : CRISIS_LOAD_PRIORITY.HIGH,
      preload: true 
    });
  });
}

export type { BundleMetrics, ComponentLoadConfig };
export { CRISIS_LOAD_PRIORITY };
export default BundleOptimizer;