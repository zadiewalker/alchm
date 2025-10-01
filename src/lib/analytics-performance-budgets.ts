/**
 * ALCHM Analytics Performance Budgets
 * Strict performance budgets for analytics and engagement features
 * Enforces crisis-safe performance standards
 */

import { analyticsPerformanceOptimizer } from './analytics-performance-optimizer';
import { mobilePerformanceMonitor } from './mobile-performance-monitor';

interface AnalyticsFeatureBudget {
  maxExecutionTime: number; // ms
  maxMemoryAllocation: number; // MB
  maxNetworkRequests: number;
  maxDataProcessing: number; // KB
  priority: 'critical' | 'high' | 'medium' | 'low';
  deferrable: boolean;
  crisisModeBehavior: 'disable' | 'defer' | 'reduce' | 'maintain';
}

interface BudgetViolation {
  feature: string;
  metric: string;
  actual: number;
  budget: number;
  severity: 'warning' | 'critical';
  timestamp: number;
  context: {
    deviceTier: string;
    networkQuality: string;
    memoryPressure: string;
    isCrisisMode: boolean;
  };
}

interface PerformanceBudgetReport {
  totalViolations: number;
  criticalViolations: number;
  affectedFeatures: string[];
  recommendations: string[];
  adaptationsRequired: string[];
  budgetCompliance: number; // 0-100%
}

// Performance budgets for different analytics features
const ANALYTICS_FEATURE_BUDGETS: Record<string, AnalyticsFeatureBudget> = {
  // Wellness Analytics Dashboard
  wellness_analytics_render: {
    maxExecutionTime: 150,
    maxMemoryAllocation: 5,
    maxNetworkRequests: 2,
    maxDataProcessing: 100,
    priority: 'medium',
    deferrable: true,
    crisisModeBehavior: 'defer'
  },

  wellness_chart_generation: {
    maxExecutionTime: 200,
    maxMemoryAllocation: 8,
    maxNetworkRequests: 1,
    maxDataProcessing: 50,
    priority: 'medium',
    deferrable: true,
    crisisModeBehavior: 'reduce'
  },

  // Badge System
  badge_progress_calculation: {
    maxExecutionTime: 100,
    maxMemoryAllocation: 3,
    maxNetworkRequests: 1,
    maxDataProcessing: 25,
    priority: 'low',
    deferrable: true,
    crisisModeBehavior: 'defer'
  },

  badge_animation_rendering: {
    maxExecutionTime: 50,
    maxMemoryAllocation: 2,
    maxNetworkRequests: 0,
    maxDataProcessing: 10,
    priority: 'low',
    deferrable: true,
    crisisModeBehavior: 'disable'
  },

  badge_intelligence_dashboard: {
    maxExecutionTime: 300,
    maxMemoryAllocation: 10,
    maxNetworkRequests: 3,
    maxDataProcessing: 200,
    priority: 'low',
    deferrable: true,
    crisisModeBehavior: 'defer'
  },

  // Gamification Features
  streak_visualization: {
    maxExecutionTime: 75,
    maxMemoryAllocation: 3,
    maxNetworkRequests: 0,
    maxDataProcessing: 20,
    priority: 'medium',
    deferrable: true,
    crisisModeBehavior: 'reduce'
  },

  habit_analytics_processing: {
    maxExecutionTime: 250,
    maxMemoryAllocation: 7,
    maxNetworkRequests: 2,
    maxDataProcessing: 150,
    priority: 'medium',
    deferrable: true,
    crisisModeBehavior: 'defer'
  },

  gamification_progress_sync: {
    maxExecutionTime: 100,
    maxMemoryAllocation: 2,
    maxNetworkRequests: 1,
    maxDataProcessing: 30,
    priority: 'low',
    deferrable: true,
    crisisModeBehavior: 'defer'
  },

  // Crisis-Critical Features (Non-deferrable)
  crisis_button_analytics: {
    maxExecutionTime: 25,
    maxMemoryAllocation: 1,
    maxNetworkRequests: 1,
    maxDataProcessing: 5,
    priority: 'critical',
    deferrable: false,
    crisisModeBehavior: 'maintain'
  },

  journal_save_tracking: {
    maxExecutionTime: 50,
    maxMemoryAllocation: 2,
    maxNetworkRequests: 1,
    maxDataProcessing: 10,
    priority: 'critical',
    deferrable: false,
    crisisModeBehavior: 'maintain'
  },

  user_safety_analytics: {
    maxExecutionTime: 30,
    maxMemoryAllocation: 1,
    maxNetworkRequests: 1,
    maxDataProcessing: 8,
    priority: 'critical',
    deferrable: false,
    crisisModeBehavior: 'maintain'
  },

  // Real-time Features
  realtime_mood_tracking: {
    maxExecutionTime: 60,
    maxMemoryAllocation: 3,
    maxNetworkRequests: 1,
    maxDataProcessing: 15,
    priority: 'high',
    deferrable: false,
    crisisModeBehavior: 'reduce'
  },

  guided_experience_analytics: {
    maxExecutionTime: 80,
    maxMemoryAllocation: 4,
    maxNetworkRequests: 1,
    maxDataProcessing: 25,
    priority: 'high',
    deferrable: true,
    crisisModeBehavior: 'reduce'
  }
};

// Device-specific budget adjustments
const DEVICE_BUDGET_MULTIPLIERS = {
  'ultra-low': {
    execution: 0.4,
    memory: 0.3,
    network: 0.5,
    data: 0.4
  },
  'low': {
    execution: 0.6,
    memory: 0.5,
    network: 0.7,
    data: 0.6
  },
  'medium': {
    execution: 0.8,
    memory: 0.8,
    network: 0.9,
    data: 0.8
  },
  'high': {
    execution: 1.0,
    memory: 1.0,
    network: 1.0,
    data: 1.0
  },
  'ultra-high': {
    execution: 1.2,
    memory: 1.2,
    network: 1.2,
    data: 1.2
  }
};

export class AnalyticsPerformanceBudgetEnforcer {
  private violations: BudgetViolation[] = [];
  private budgetCache: Map<string, AnalyticsFeatureBudget> = new Map();
  private executionTimings: Map<string, number[]> = new Map();
  private memoryBaseline: number = 0;
  private isMonitoring = false;

  constructor() {
    this.initializeBudgetEnforcement();
  }

  /**
   * Initialize budget enforcement system
   */
  private initializeBudgetEnforcement(): void {
    if (typeof window === 'undefined') return;

    // Establish memory baseline
    if ((performance as any).memory) {
      this.memoryBaseline = (performance as any).memory.usedJSHeapSize;
    }

    // Cache device-adjusted budgets
    this.updateBudgetCache();

    // Start monitoring
    this.isMonitoring = true;
  }

  /**
   * Update budget cache based on device capabilities
   */
  private updateBudgetCache(): void {
    const deviceTier = mobilePerformanceMonitor.getDeviceTier();
    const multipliers = DEVICE_BUDGET_MULTIPLIERS[deviceTier];

    this.budgetCache.clear();

    Object.entries(ANALYTICS_FEATURE_BUDGETS).forEach(([feature, budget]) => {
      const adjustedBudget: AnalyticsFeatureBudget = {
        maxExecutionTime: Math.max(25, budget.maxExecutionTime * multipliers.execution),
        maxMemoryAllocation: Math.max(1, budget.maxMemoryAllocation * multipliers.memory),
        maxNetworkRequests: Math.max(1, Math.floor(budget.maxNetworkRequests * multipliers.network)),
        maxDataProcessing: Math.max(5, budget.maxDataProcessing * multipliers.data),
        priority: budget.priority,
        deferrable: budget.deferrable,
        crisisModeBehavior: budget.crisisModeBehavior
      };

      this.budgetCache.set(feature, adjustedBudget);
    });
  }

  /**
   * Enforce performance budget for a specific analytics feature
   */
  public async enforceFeatureBudget<T>(
    featureName: string,
    operation: () => Promise<T> | T,
    context?: { dataSize?: number; networkRequests?: number }
  ): Promise<T> {
    if (!this.isMonitoring) {
      return await operation();
    }

    const budget = this.budgetCache.get(featureName);
    if (!budget) {
      console.warn(`No budget defined for feature: ${featureName}`);
      return await operation();
    }

    // Check if feature should be executed in current performance state
    const shouldExecute = this.shouldExecuteFeature(featureName, budget);
    if (!shouldExecute) {
      console.log(`Feature ${featureName} deferred due to performance constraints`);
      
      // Add to deferred queue if deferrable
      if (budget.deferrable) {
        analyticsPerformanceOptimizer.addToDeferredQueue({
          id: `${featureName}_${Date.now()}`,
          operation: async () => { await operation(); },
          priority: budget.priority === 'critical' ? 'critical' : 
                   budget.priority === 'high' ? 'high' : 
                   budget.priority === 'medium' ? 'medium' : 'low',
          category: this.getCategoryFromFeature(featureName),
          estimatedCost: budget.maxExecutionTime,
          retryCount: 0,
          maxRetries: 3
        });
      }

      throw new Error(`Feature ${featureName} execution deferred for performance`);
    }

    // Execute with monitoring
    return await this.executeWithBudgetMonitoring(featureName, budget, operation, context);
  }

  /**
   * Check if feature should execute based on current performance state
   */
  private shouldExecuteFeature(featureName: string, budget: AnalyticsFeatureBudget): boolean {
    const performanceMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();
    
    // Always allow critical features
    if (budget.priority === 'critical') {
      return true;
    }

    // In crisis mode, check behavior setting
    if (performanceMetrics.state.isCrisisMode) {
      switch (budget.crisisModeBehavior) {
        case 'disable':
          return false;
        case 'defer':
          return false;
        case 'reduce':
          return true; // Will be executed with reduced budget
        case 'maintain':
          return true;
      }
    }

    // Check memory pressure
    if (performanceMetrics.state.memoryPressure === 'critical' && budget.priority === 'low') {
      return false;
    }

    // Check if device can handle the operation
    const deviceTier = mobilePerformanceMonitor.getDeviceTier();
    if (deviceTier === 'ultra-low' && budget.priority === 'low') {
      return Math.random() < 0.3; // Only execute 30% of low priority operations
    }

    return true;
  }

  /**
   * Execute operation with budget monitoring
   */
  private async executeWithBudgetMonitoring<T>(
    featureName: string,
    budget: AnalyticsFeatureBudget,
    operation: () => Promise<T> | T,
    context?: { dataSize?: number; networkRequests?: number }
  ): Promise<T> {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

    try {
      // Apply budget restrictions for reduced execution
      const performanceMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();
      if (performanceMetrics.state.isCrisisMode && budget.crisisModeBehavior === 'reduce') {
        budget = this.getReducedBudget(budget);
      }

      const result = await operation();
      
      // Measure execution metrics
      const executionTime = performance.now() - startTime;
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryUsed = Math.max(0, (endMemory - startMemory) / 1048576); // Convert to MB

      // Record timing for trend analysis
      this.recordExecutionTiming(featureName, executionTime);

      // Check budget violations
      this.checkBudgetViolations(featureName, budget, {
        executionTime,
        memoryUsed,
        dataSize: context?.dataSize || 0,
        networkRequests: context?.networkRequests || 0
      });

      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      // Even failed operations count against budget
      this.checkBudgetViolations(featureName, budget, {
        executionTime,
        memoryUsed: 0,
        dataSize: context?.dataSize || 0,
        networkRequests: context?.networkRequests || 0
      });

      throw error;
    }
  }

  /**
   * Get reduced budget for crisis mode
   */
  private getReducedBudget(budget: AnalyticsFeatureBudget): AnalyticsFeatureBudget {
    return {
      ...budget,
      maxExecutionTime: budget.maxExecutionTime * 0.5,
      maxMemoryAllocation: budget.maxMemoryAllocation * 0.6,
      maxNetworkRequests: Math.max(1, Math.floor(budget.maxNetworkRequests * 0.5)),
      maxDataProcessing: budget.maxDataProcessing * 0.4
    };
  }

  /**
   * Record execution timing for trend analysis
   */
  private recordExecutionTiming(featureName: string, timing: number): void {
    if (!this.executionTimings.has(featureName)) {
      this.executionTimings.set(featureName, []);
    }

    const timings = this.executionTimings.get(featureName)!;
    timings.push(timing);

    // Keep only recent timings
    if (timings.length > 50) {
      timings.splice(0, timings.length - 25);
    }
  }

  /**
   * Check for budget violations
   */
  private checkBudgetViolations(
    featureName: string,
    budget: AnalyticsFeatureBudget,
    metrics: {
      executionTime: number;
      memoryUsed: number;
      dataSize: number;
      networkRequests: number;
    }
  ): void {
    const performanceMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();
    const context = {
      deviceTier: mobilePerformanceMonitor.getDeviceTier(),
      networkQuality: performanceMetrics.state.networkQuality,
      memoryPressure: performanceMetrics.state.memoryPressure,
      isCrisisMode: performanceMetrics.state.isCrisisMode
    };

    // Check execution time violation
    if (metrics.executionTime > budget.maxExecutionTime) {
      this.recordViolation(featureName, 'executionTime', metrics.executionTime, budget.maxExecutionTime, context);
    }

    // Check memory violation
    if (metrics.memoryUsed > budget.maxMemoryAllocation) {
      this.recordViolation(featureName, 'memoryUsage', metrics.memoryUsed, budget.maxMemoryAllocation, context);
    }

    // Check network requests violation
    if (metrics.networkRequests > budget.maxNetworkRequests) {
      this.recordViolation(featureName, 'networkRequests', metrics.networkRequests, budget.maxNetworkRequests, context);
    }

    // Check data processing violation
    if (metrics.dataSize > budget.maxDataProcessing * 1024) { // Convert KB to bytes
      this.recordViolation(featureName, 'dataProcessing', metrics.dataSize / 1024, budget.maxDataProcessing, context);
    }
  }

  /**
   * Record a budget violation
   */
  private recordViolation(
    feature: string,
    metric: string,
    actual: number,
    budget: number,
    context: BudgetViolation['context']
  ): void {
    const severity = actual > budget * 2 ? 'critical' : 'warning';
    
    const violation: BudgetViolation = {
      feature,
      metric,
      actual,
      budget,
      severity,
      timestamp: Date.now(),
      context
    };

    this.violations.push(violation);

    // Keep only recent violations
    if (this.violations.length > 100) {
      this.violations = this.violations.slice(-50);
    }

    // Log critical violations immediately
    if (severity === 'critical') {
      console.error(`Critical budget violation in ${feature}: ${metric} = ${actual} > ${budget}`, violation);
    }
  }

  /**
   * Get category from feature name
   */
  private getCategoryFromFeature(featureName: string): 'analytics' | 'badge' | 'gamification' | 'ui' {
    if (featureName.includes('badge')) return 'badge';
    if (featureName.includes('gamification') || featureName.includes('streak')) return 'gamification';
    if (featureName.includes('analytics')) return 'analytics';
    return 'ui';
  }

  /**
   * Generate performance budget report
   */
  public generateBudgetReport(): PerformanceBudgetReport {
    const totalViolations = this.violations.length;
    const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
    const affectedFeatures = [...new Set(this.violations.map(v => v.feature))];
    
    const recommendations = this.generateRecommendations();
    const adaptationsRequired = this.generateAdaptationRecommendations();
    
    // Calculate budget compliance (percentage of operations within budget)
    const totalOperations = Array.from(this.executionTimings.values())
      .reduce((sum, timings) => sum + timings.length, 0);
    
    const budgetCompliance = totalOperations > 0 
      ? Math.max(0, 100 - (totalViolations / totalOperations * 100))
      : 100;

    return {
      totalViolations,
      criticalViolations,
      affectedFeatures,
      recommendations,
      adaptationsRequired,
      budgetCompliance
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const violationsByFeature = this.groupViolationsByFeature();

    Object.entries(violationsByFeature).forEach(([feature, violations]) => {
      const executionViolations = violations.filter(v => v.metric === 'executionTime');
      const memoryViolations = violations.filter(v => v.metric === 'memoryUsage');

      if (executionViolations.length > 0) {
        recommendations.push(`Optimize ${feature} execution time - consider code splitting or lazy loading`);
      }

      if (memoryViolations.length > 0) {
        recommendations.push(`Reduce ${feature} memory usage - implement data virtualization or cleanup`);
      }
    });

    // Device-specific recommendations
    const deviceTier = mobilePerformanceMonitor.getDeviceTier();
    if (['ultra-low', 'low'].includes(deviceTier)) {
      recommendations.push('Consider progressive feature loading for low-end devices');
      recommendations.push('Implement aggressive caching for repeated analytics operations');
    }

    return recommendations;
  }

  /**
   * Generate adaptation recommendations
   */
  private generateAdaptationRecommendations(): string[] {
    const adaptations: string[] = [];
    const performanceMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();

    if (performanceMetrics.state.memoryPressure === 'high') {
      adaptations.push('Enable memory optimization mode');
      adaptations.push('Reduce chart rendering quality');
    }

    if (performanceMetrics.state.networkQuality === 'poor') {
      adaptations.push('Enable offline-first analytics');
      adaptations.push('Reduce real-time sync frequency');
    }

    if (this.violations.filter(v => v.severity === 'critical').length > 5) {
      adaptations.push('Consider enabling emergency performance mode');
    }

    return adaptations;
  }

  /**
   * Group violations by feature for analysis
   */
  private groupViolationsByFeature(): Record<string, BudgetViolation[]> {
    return this.violations.reduce((groups, violation) => {
      if (!groups[violation.feature]) {
        groups[violation.feature] = [];
      }
      groups[violation.feature].push(violation);
      return groups;
    }, {} as Record<string, BudgetViolation[]>);
  }

  /**
   * Get budget for a specific feature
   */
  public getFeatureBudget(featureName: string): AnalyticsFeatureBudget | null {
    return this.budgetCache.get(featureName) || null;
  }

  /**
   * Get recent violations for a feature
   */
  public getFeatureViolations(featureName: string): BudgetViolation[] {
    return this.violations.filter(v => v.feature === featureName);
  }

  /**
   * Get performance trends for a feature
   */
  public getFeaturePerformanceTrend(featureName: string): {
    averageExecutionTime: number;
    trend: 'improving' | 'stable' | 'degrading';
    violationRate: number;
  } {
    const timings = this.executionTimings.get(featureName) || [];
    const violations = this.getFeatureViolations(featureName);

    if (timings.length === 0) {
      return { averageExecutionTime: 0, trend: 'stable', violationRate: 0 };
    }

    const averageExecutionTime = timings.reduce((sum, t) => sum + t, 0) / timings.length;
    const violationRate = violations.length / timings.length;

    // Determine trend by comparing first and last halves
    const firstHalf = timings.slice(0, Math.floor(timings.length / 2));
    const lastHalf = timings.slice(Math.floor(timings.length / 2));

    const firstAvg = firstHalf.reduce((sum, t) => sum + t, 0) / firstHalf.length;
    const lastAvg = lastHalf.reduce((sum, t) => sum + t, 0) / lastHalf.length;

    let trend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (lastAvg < firstAvg * 0.9) trend = 'improving';
    else if (lastAvg > firstAvg * 1.1) trend = 'degrading';

    return { averageExecutionTime, trend, violationRate };
  }

  /**
   * Clear violations and reset monitoring
   */
  public reset(): void {
    this.violations = [];
    this.executionTimings.clear();
    this.updateBudgetCache();
  }
}

// Global budget enforcer instance
export const analyticsBudgetEnforcer = new AnalyticsPerformanceBudgetEnforcer();

// Helper function to wrap analytics operations with budget enforcement
export const withBudgetEnforcement = <T>(
  featureName: string,
  operation: () => Promise<T> | T,
  context?: { dataSize?: number; networkRequests?: number }
): Promise<T> => {
  return analyticsBudgetEnforcer.enforceFeatureBudget(featureName, operation, context);
};

// React hook for budget monitoring
export const useAnalyticsBudget = () => {
  return {
    getReport: () => analyticsBudgetEnforcer.generateBudgetReport(),
    getFeatureBudget: (feature: string) => analyticsBudgetEnforcer.getFeatureBudget(feature),
    getViolations: (feature?: string) => 
      feature ? analyticsBudgetEnforcer.getFeatureViolations(feature) : analyticsBudgetEnforcer.generateBudgetReport(),
    getTrend: (feature: string) => analyticsBudgetEnforcer.getFeaturePerformanceTrend(feature),
    enforceForFeature: withBudgetEnforcement
  };
};

export default analyticsBudgetEnforcer;