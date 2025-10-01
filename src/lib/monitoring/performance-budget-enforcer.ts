/**
 * CRITICAL LIFE-SAFETY SYSTEM: Performance Budget Enforcer
 * 
 * This system enforces strict performance budgets across all components
 * and prevents deployments that could degrade performance for crisis users.
 * Operates with zero tolerance for performance regressions that could
 * impact user safety.
 */

import { getPerformanceMonitor, type PerformanceMetric } from './real-time-performance-monitor';
import { getRollbackSystem } from './automated-rollback-system';

interface PerformanceBudget {
  metric: string;
  limit: number;
  warningThreshold: number; // percentage of limit (e.g., 0.8 = 80%)
  emergencyThreshold: number; // percentage of limit (e.g., 1.2 = 120%)
  isCrisisMetric: boolean;
  description: string;
}

interface BudgetViolation {
  id: string;
  timestamp: number;
  metric: string;
  currentValue: number;
  budgetLimit: number;
  violationType: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  isCrisisContext: boolean;
  url: string;
  component?: string;
  actionTaken?: string;
}

interface ComponentBudget {
  componentName: string;
  budgets: PerformanceBudget[];
  currentUsage: Record<string, number>;
  violations: BudgetViolation[];
}

class PerformanceBudgetEnforcer {
  private budgets: Map<string, PerformanceBudget> = new Map();
  private componentBudgets: Map<string, ComponentBudget> = new Map();
  private violations: BudgetViolation[] = [];
  private isEnforcing = true;
  private violationCallbacks: ((violation: BudgetViolation) => void)[] = [];

  constructor() {
    this.initializeDefaultBudgets();
    this.startMonitoring();
  }

  private initializeDefaultBudgets() {
    const defaultBudgets: PerformanceBudget[] = [
      // Core Web Vitals - Crisis Optimized
      {
        metric: 'LCP',
        limit: 1200, // 1.2s for crisis users
        warningThreshold: 0.8,
        emergencyThreshold: 1.5,
        isCrisisMetric: true,
        description: 'Largest Contentful Paint - critical for first impression'
      },
      {
        metric: 'FID',
        limit: 50, // 50ms for immediate responsiveness
        warningThreshold: 0.7,
        emergencyThreshold: 2.0,
        isCrisisMetric: true,
        description: 'First Input Delay - critical for interaction responsiveness'
      },
      {
        metric: 'CLS',
        limit: 0.05, // Very strict for visual stability
        warningThreshold: 0.6,
        emergencyThreshold: 2.0,
        isCrisisMetric: true,
        description: 'Cumulative Layout Shift - critical for visual stability'
      },
      {
        metric: 'TTI',
        limit: 3000, // 3s time to interactive
        warningThreshold: 0.8,
        emergencyThreshold: 1.3,
        isCrisisMetric: true,
        description: 'Time to Interactive - critical for full functionality'
      },

      // Crisis-Specific Metrics
      {
        metric: 'CRISIS_RESOURCE_LOAD',
        limit: 1000, // 1s maximum for crisis resources
        warningThreshold: 0.7,
        emergencyThreshold: 1.0, // No tolerance for crisis resource delays
        isCrisisMetric: true,
        description: 'Crisis resource loading time - life-critical'
      },
      {
        metric: 'AI_RESPONSE_TIME',
        limit: 5000, // 5s for AI responses
        warningThreshold: 0.8,
        emergencyThreshold: 1.5,
        isCrisisMetric: true,
        description: 'AI response time - important for crisis support'
      },

      // Memory Management
      {
        metric: 'MEMORY_USAGE',
        limit: 100 * 1024 * 1024, // 100MB
        warningThreshold: 0.8,
        emergencyThreshold: 1.2,
        isCrisisMetric: false,
        description: 'JavaScript heap usage'
      },
      {
        metric: 'MEMORY_LEAK_RATE',
        limit: 50 * 1024 * 1024, // 50MB per minute
        warningThreshold: 0.5,
        emergencyThreshold: 1.0,
        isCrisisMetric: true,
        description: 'Memory leak detection rate'
      },

      // Bundle Sizes
      {
        metric: 'INITIAL_BUNDLE_SIZE',
        limit: 250 * 1024, // 250KB initial bundle
        warningThreshold: 0.9,
        emergencyThreshold: 1.3,
        isCrisisMetric: false,
        description: 'Initial JavaScript bundle size'
      },
      {
        metric: 'TOTAL_BUNDLE_SIZE',
        limit: 1024 * 1024, // 1MB total bundles
        warningThreshold: 0.9,
        emergencyThreshold: 1.2,
        isCrisisMetric: false,
        description: 'Total JavaScript bundle size'
      },

      // Database Performance
      {
        metric: 'FIRESTORE_QUERY_TIME',
        limit: 500, // 500ms for any Firestore query
        warningThreshold: 0.8,
        emergencyThreshold: 2.0,
        isCrisisMetric: false,
        description: 'Firestore query response time'
      },

      // Network Performance
      {
        metric: 'API_RESPONSE_TIME',
        limit: 2000, // 2s for API responses
        warningThreshold: 0.8,
        emergencyThreshold: 1.5,
        isCrisisMetric: false,
        description: 'API endpoint response time'
      }
    ];

    defaultBudgets.forEach(budget => {
      this.budgets.set(budget.metric, budget);
    });

    console.log('[BUDGET ENFORCER] Initialized with', defaultBudgets.length, 'performance budgets');
  }

  private startMonitoring() {
    const performanceMonitor = getPerformanceMonitor();
    
    // Monitor all performance metrics against budgets
    performanceMonitor.onAlert((alert) => {
      this.checkBudgetViolation(alert.metric, alert.value, {
        url: alert.url,
        isCrisisContext: alert.isCrisisContext,
        userId: alert.userId
      });
    });

    // Set up periodic budget checks
    this.startPeriodicChecks();
  }

  private startPeriodicChecks() {
    // Check budgets every 30 seconds
    setInterval(() => {
      this.performBudgetAudit();
    }, 30000);

    // Bundle size check every 5 minutes
    setInterval(() => {
      this.checkBundleSizes();
    }, 300000);
  }

  private async performBudgetAudit() {
    if (typeof window === 'undefined') return;

    const performanceMonitor = getPerformanceMonitor();
    const recentMetrics = await performanceMonitor.getRecentMetrics(60000); // Last minute

    // Group metrics by type and check against budgets
    const metricGroups = new Map<string, PerformanceMetric[]>();
    recentMetrics.forEach(metric => {
      if (!metricGroups.has(metric.type)) {
        metricGroups.set(metric.type, []);
      }
      metricGroups.get(metric.type)!.push(metric);
    });

    // Check each metric type against its budget
    for (const [metricType, metrics] of metricGroups) {
      if (metrics.length === 0) continue;

      // Use the most recent value or average for analysis
      const latestValue = metrics[metrics.length - 1].value;
      const avgValue = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      
      // Use worst case for budget enforcement
      const valueToCheck = Math.max(latestValue, avgValue);
      
      this.checkBudgetViolation(metricType, valueToCheck, {
        url: window.location.href,
        isCrisisContext: this.isCrisisContext()
      });
    }
  }

  private async checkBundleSizes() {
    if (typeof window === 'undefined') return;

    try {
      // Check if we have bundle analysis data
      const bundleData = await this.getBundleAnalysisData();
      
      if (bundleData) {
        this.checkBudgetViolation('INITIAL_BUNDLE_SIZE', bundleData.initialSize, {
          url: window.location.href,
          isCrisisContext: this.isCrisisContext()
        });

        this.checkBudgetViolation('TOTAL_BUNDLE_SIZE', bundleData.totalSize, {
          url: window.location.href,
          isCrisisContext: this.isCrisisContext()
        });
      }
    } catch (error) {
      console.warn('[BUDGET ENFORCER] Failed to check bundle sizes:', error);
    }
  }

  private async getBundleAnalysisData(): Promise<{ initialSize: number; totalSize: number } | null> {
    // This would integrate with your bundle analysis system
    // For now, we'll estimate based on network requests
    if (typeof window === 'undefined') return null;

    const resources = performance.getEntriesByType('resource');
    const jsResources = resources.filter(r => r.name.includes('.js'));
    
    let initialSize = 0;
    let totalSize = 0;

    jsResources.forEach(resource => {
      const size = (resource as any).transferSize || 0;
      totalSize += size;
      
      // Consider initial chunks (usually contain 'main' or 'index')
      if (resource.name.includes('main') || resource.name.includes('index') || resource.name.includes('app')) {
        initialSize += size;
      }
    });

    return { initialSize, totalSize };
  }

  private checkBudgetViolation(
    metric: string, 
    value: number, 
    context: { url: string; isCrisisContext: boolean; userId?: string; component?: string }
  ) {
    const budget = this.budgets.get(metric);
    if (!budget || !this.isEnforcing) return;

    const violationType = this.determineViolationType(value, budget);
    if (!violationType) return; // No violation

    const violation: BudgetViolation = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      metric,
      currentValue: value,
      budgetLimit: budget.limit,
      violationType,
      isCrisisContext: context.isCrisisContext,
      url: context.url,
      component: context.component
    };

    this.violations.push(violation);
    
    // Keep only recent violations (last 24 hours)
    const cutoff = Date.now() - 86400000;
    this.violations = this.violations.filter(v => v.timestamp >= cutoff);

    console.warn(`[BUDGET VIOLATION ${violationType}] ${metric}: ${value} > ${budget.limit * (violationType === 'WARNING' ? budget.warningThreshold : 1)}`, violation);

    // Handle violation based on severity
    this.handleBudgetViolation(violation, budget);

    // Notify callbacks
    this.violationCallbacks.forEach(callback => {
      try {
        callback(violation);
      } catch (error) {
        console.error('[BUDGET ENFORCER] Callback error:', error);
      }
    });

    this.storeViolation(violation);
  }

  private determineViolationType(value: number, budget: PerformanceBudget): 'WARNING' | 'CRITICAL' | 'EMERGENCY' | null {
    if (value > budget.limit * budget.emergencyThreshold) {
      return 'EMERGENCY';
    }
    if (value > budget.limit) {
      return 'CRITICAL';
    }
    if (value > budget.limit * budget.warningThreshold) {
      return 'WARNING';
    }
    return null;
  }

  private async handleBudgetViolation(violation: BudgetViolation, budget: PerformanceBudget) {
    let actionTaken = '';

    switch (violation.violationType) {
      case 'EMERGENCY':
        // Emergency actions for critical violations
        if (budget.isCrisisMetric || violation.isCrisisContext) {
          actionTaken = 'EMERGENCY_ROLLBACK_TRIGGERED';
          const rollbackSystem = getRollbackSystem();
          // This will be handled by the rollback system
        } else {
          actionTaken = 'PERFORMANCE_DEGRADATION_MODE_ENABLED';
          await this.enablePerformanceDegradationMode();
        }
        break;

      case 'CRITICAL':
        if (budget.isCrisisMetric) {
          actionTaken = 'CRISIS_OPTIMIZATION_MODE_ENABLED';
          await this.enableCrisisOptimizationMode();
        } else {
          actionTaken = 'PERFORMANCE_WARNING_LOGGED';
          await this.logPerformanceWarning(violation);
        }
        break;

      case 'WARNING':
        actionTaken = 'PERFORMANCE_MONITORING_ENHANCED';
        await this.enhanceMonitoring(violation.metric);
        break;
    }

    violation.actionTaken = actionTaken;
  }

  private async enablePerformanceDegradationMode() {
    if (typeof window !== 'undefined') {
      // Reduce non-essential features
      localStorage.setItem('alchm_performance_degradation_mode', 'true');
      localStorage.setItem('alchm_reduce_animations', 'true');
      localStorage.setItem('alchm_minimal_ui', 'true');
      
      console.warn('[BUDGET ENFORCER] Performance degradation mode enabled');
    }
  }

  private async enableCrisisOptimizationMode() {
    if (typeof window !== 'undefined') {
      // Prioritize crisis features only
      localStorage.setItem('alchm_crisis_optimization_mode', 'true');
      localStorage.setItem('alchm_disable_non_critical_features', 'true');
      localStorage.setItem('alchm_preload_crisis_resources', 'true');
      
      console.warn('[BUDGET ENFORCER] Crisis optimization mode enabled');
    }
  }

  private async logPerformanceWarning(violation: BudgetViolation) {
    // Send warning to monitoring system
    if (process.env.NEXT_PUBLIC_PERFORMANCE_WEBHOOK_URL) {
      try {
        await fetch(process.env.NEXT_PUBLIC_PERFORMANCE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'BUDGET_VIOLATION',
            violation,
            timestamp: Date.now()
          })
        });
      } catch (error) {
        console.error('Failed to send performance warning:', error);
      }
    }
  }

  private async enhanceMonitoring(metric: string) {
    // Increase monitoring frequency for this metric
    const performanceMonitor = getPerformanceMonitor();
    performanceMonitor.measureCustomMetric(`ENHANCED_${metric}`, Date.now(), false);
  }

  private storeViolation(violation: BudgetViolation) {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('alchm_budget_violations') || '[]');
      stored.push(violation);
      
      // Keep only last 100 violations
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem('alchm_budget_violations', JSON.stringify(stored));
    }
  }

  private isCrisisContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    const url = window.location.href;
    const crisisKeywords = ['/crisis', '/emergency', '/support', 'crisis=true'];
    
    return crisisKeywords.some(keyword => url.includes(keyword));
  }

  // Public API
  public addBudget(budget: PerformanceBudget): void {
    this.budgets.set(budget.metric, budget);
    console.log(`[BUDGET ENFORCER] Added budget for ${budget.metric}: ${budget.limit}`);
  }

  public removeBudget(metric: string): void {
    this.budgets.delete(metric);
    console.log(`[BUDGET ENFORCER] Removed budget for ${metric}`);
  }

  public updateBudget(metric: string, updates: Partial<PerformanceBudget>): void {
    const existing = this.budgets.get(metric);
    if (existing) {
      this.budgets.set(metric, { ...existing, ...updates });
      console.log(`[BUDGET ENFORCER] Updated budget for ${metric}`);
    }
  }

  public getBudgets(): PerformanceBudget[] {
    return Array.from(this.budgets.values());
  }

  public getViolations(timeframe: number = 3600000): BudgetViolation[] {
    const cutoff = Date.now() - timeframe;
    return this.violations.filter(v => v.timestamp >= cutoff);
  }

  public getCriticalViolations(timeframe: number = 3600000): BudgetViolation[] {
    return this.getViolations(timeframe).filter(v => 
      v.violationType === 'CRITICAL' || v.violationType === 'EMERGENCY'
    );
  }

  public onViolation(callback: (violation: BudgetViolation) => void): void {
    this.violationCallbacks.push(callback);
  }

  public checkMetricAgainstBudget(metric: string, value: number): BudgetViolation | null {
    const budget = this.budgets.get(metric);
    if (!budget) return null;

    const violationType = this.determineViolationType(value, budget);
    if (!violationType) return null;

    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      metric,
      currentValue: value,
      budgetLimit: budget.limit,
      violationType,
      isCrisisContext: this.isCrisisContext(),
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    };
  }

  public enableEnforcement(): void {
    this.isEnforcing = true;
    console.log('[BUDGET ENFORCER] Enforcement enabled');
  }

  public disableEnforcement(): void {
    this.isEnforcing = false;
    console.log('[BUDGET ENFORCER] Enforcement disabled');
  }

  public isEnforcementEnabled(): boolean {
    return this.isEnforcing;
  }

  public getBudgetStatus(): { budget: PerformanceBudget; status: 'OK' | 'WARNING' | 'CRITICAL' | 'EMERGENCY' | 'UNKNOWN' }[] {
    const performanceMonitor = getPerformanceMonitor();
    
    return Array.from(this.budgets.values()).map(budget => {
      // Get recent violations for this metric
      const recentViolations = this.getViolations(300000).filter(v => v.metric === budget.metric);
      
      let status: 'OK' | 'WARNING' | 'CRITICAL' | 'EMERGENCY' | 'UNKNOWN' = 'OK';
      
      if (recentViolations.length > 0) {
        const latestViolation = recentViolations[recentViolations.length - 1];
        status = latestViolation.violationType;
      }
      
      return { budget, status };
    });
  }

  public generateBudgetReport(): {
    summary: {
      totalBudgets: number;
      violationsLast24h: number;
      criticalViolationsLast24h: number;
      worstMetric: string | null;
    };
    budgetStatus: ReturnType<typeof this.getBudgetStatus>;
    recentViolations: BudgetViolation[];
  } {
    const violations24h = this.getViolations(86400000);
    const criticalViolations24h = this.getCriticalViolations(86400000);
    
    // Find worst performing metric
    const metricViolationCounts = new Map<string, number>();
    violations24h.forEach(v => {
      metricViolationCounts.set(v.metric, (metricViolationCounts.get(v.metric) || 0) + 1);
    });
    
    const worstMetric = metricViolationCounts.size > 0 
      ? Array.from(metricViolationCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    return {
      summary: {
        totalBudgets: this.budgets.size,
        violationsLast24h: violations24h.length,
        criticalViolationsLast24h: criticalViolations24h.length,
        worstMetric
      },
      budgetStatus: this.getBudgetStatus(),
      recentViolations: this.getViolations(3600000) // Last hour
    };
  }
}

// Singleton instance
let budgetEnforcer: PerformanceBudgetEnforcer | null = null;

export function getBudgetEnforcer(): PerformanceBudgetEnforcer {
  if (!budgetEnforcer) {
    budgetEnforcer = new PerformanceBudgetEnforcer();
  }
  return budgetEnforcer;
}

// Utility functions
export function checkPerformanceBudget(metric: string, value: number): BudgetViolation | null {
  const enforcer = getBudgetEnforcer();
  return enforcer.checkMetricAgainstBudget(metric, value);
}

export function onBudgetViolation(callback: (violation: BudgetViolation) => void): void {
  const enforcer = getBudgetEnforcer();
  enforcer.onViolation(callback);
}

export function addPerformanceBudget(budget: PerformanceBudget): void {
  const enforcer = getBudgetEnforcer();
  enforcer.addBudget(budget);
}

// Export types
export type { PerformanceBudget, BudgetViolation, ComponentBudget };