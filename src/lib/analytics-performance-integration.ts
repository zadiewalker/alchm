'use client';

/**
 * ALCHM Analytics Performance Integration
 * Central integration point for all analytics performance optimization systems
 * Provides a unified API for crisis-safe performance management
 */

import { analyticsPerformanceOptimizer } from './analytics-performance-optimizer';
import { analyticsBudgetEnforcer, withBudgetEnforcement } from './analytics-performance-budgets';
import { lowEndDeviceOptimizer } from './low-end-device-optimizer';
import { guidedExperienceVitals } from './guided-experience-vitals';
import { performanceRegressionDetector } from './performance-regression-detector';
import { mobilePerformanceMonitor } from './mobile-performance-monitor';

interface PerformanceState {
  isOptimal: boolean;
  isCrisisMode: boolean;
  deviceTier: string;
  networkQuality: string;
  memoryPressure: number;
  activeOptimizations: string[];
  currentThreats: {
    performance: string[];
    memory: string[];
    network: string[];
  };
}

interface AnalyticsPerformanceConfig {
  enableAutoOptimization: boolean;
  enableCrisisProtection: boolean;
  enableRegressionDetection: boolean;
  enableLowEndOptimizations: boolean;
  performanceBudgets: boolean;
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug';
}

export class AnalyticsPerformanceManager {
  private config: AnalyticsPerformanceConfig = {
    enableAutoOptimization: true,
    enableCrisisProtection: true,
    enableRegressionDetection: true,
    enableLowEndOptimizations: true,
    performanceBudgets: true,
    logLevel: 'warn'
  };

  private isInitialized = false;
  private performanceCallbacks: ((state: PerformanceState) => void)[] = [];

  constructor(config?: Partial<AnalyticsPerformanceConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Initialize all performance optimization systems
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.log('info', '🚀 Initializing ALCHM Analytics Performance Systems...');

      // Initialize mobile performance monitoring first
      await mobilePerformanceMonitor.initialize();

      // Initialize low-end device optimizations if enabled
      if (this.config.enableLowEndOptimizations) {
        lowEndDeviceOptimizer.optimizeForCurrentConditions();
      }

      // Initialize performance regression detection
      if (this.config.enableRegressionDetection) {
        // Regression detector initializes automatically
        this.log('info', '✅ Performance regression detection enabled');
      }

      // Setup performance monitoring
      this.setupPerformanceMonitoring();

      this.isInitialized = true;
      this.log('info', '✅ Analytics performance systems initialized successfully');

    } catch (error) {
      this.log('error', '❌ Failed to initialize performance systems:', error);
      throw error;
    }
  }

  /**
   * Setup performance monitoring and callbacks
   */
  private setupPerformanceMonitoring(): void {
    // Monitor performance state changes
    setInterval(() => {
      const currentState = this.getPerformanceState();
      this.notifyPerformanceCallbacks(currentState);
    }, 5000); // Check every 5 seconds
  }

  /**
   * Execute analytics operation with full performance protection
   */
  public async executeAnalyticsOperation<T>(
    operationName: string,
    operation: () => Promise<T> | T,
    options: {
      component?: string;
      priority?: 'low' | 'medium' | 'high' | 'critical';
      isVulnerableUser?: boolean;
      dataSize?: number;
      networkRequests?: number;
    } = {}
  ): Promise<T> {
    const {
      component = 'analytics',
      priority = 'medium',
      isVulnerableUser = false,
      dataSize,
      networkRequests
    } = options;

    this.log('debug', `🔄 Executing analytics operation: ${operationName}`, options);

    try {
      // Check if we should proceed based on current performance state
      const shouldProceed = this.shouldExecuteOperation(priority, isVulnerableUser);
      if (!shouldProceed) {
        throw new Error(`Operation ${operationName} deferred due to performance constraints`);
      }

      // Execute with budget enforcement if enabled
      if (this.config.performanceBudgets) {
        return await withBudgetEnforcement(
          operationName,
          async () => {
            const result = await operation();
            
            // Record performance measurement for regression detection
            if (this.config.enableRegressionDetection) {
              this.recordOperationPerformance(component, operationName, isVulnerableUser);
            }
            
            return result;
          },
          { dataSize, networkRequests }
        );
      } else {
        const result = await operation();
        
        // Record performance measurement
        if (this.config.enableRegressionDetection) {
          this.recordOperationPerformance(component, operationName, isVulnerableUser);
        }
        
        return result;
      }

    } catch (error) {
      this.log('error', `❌ Analytics operation failed: ${operationName}`, error);
      
      // If this is a vulnerable user and the operation failed, apply emergency measures
      if (isVulnerableUser && this.config.enableCrisisProtection) {
        this.applyEmergencyMeasures();
      }
      
      throw error;
    }
  }

  /**
   * Start monitoring a guided experience
   */
  public startGuidedExperience(
    experienceId: string,
    experienceType: 'onboarding' | 'analytics_dashboard' | 'badge_journey' | 'crisis_support' | 'journal_guidance',
    userContext: {
      isFirstTime?: boolean;
      isVulnerable?: boolean;
      emotionalState?: 'stable' | 'processing' | 'vulnerable' | 'crisis';
    } = {}
  ): void {
    this.log('info', `📊 Starting guided experience monitoring: ${experienceType}`, userContext);

    guidedExperienceVitals.startExperienceMonitoring(
      experienceId,
      experienceType,
      'start',
      userContext
    );

    // Apply preemptive optimizations for vulnerable users
    if (userContext.isVulnerable || userContext.emotionalState === 'vulnerable') {
      this.applyVulnerableUserOptimizations();
    }
  }

  /**
   * Complete guided experience monitoring
   */
  public completeGuidedExperience(): void {
    const result = guidedExperienceVitals.completeExperienceMonitoring();
    
    if (result) {
      this.log('info', '✅ Guided experience completed', {
        experience: result.experienceType,
        metrics: result.metrics
      });
    }
  }

  /**
   * Check if operation should execute based on current performance state
   */
  private shouldExecuteOperation(
    priority: 'low' | 'medium' | 'high' | 'critical',
    isVulnerableUser: boolean
  ): boolean {
    const state = this.getPerformanceState();

    // Always allow critical operations
    if (priority === 'critical') return true;

    // In crisis mode, only allow high priority operations for vulnerable users
    if (state.isCrisisMode) {
      if (isVulnerableUser) {
        return priority === 'high' || priority === 'critical';
      }
      return priority === 'critical';
    }

    // Check memory pressure
    if (state.memoryPressure > 90) {
      return priority === 'high' || priority === 'critical';
    }

    // Check device tier
    if (['ultra-low', 'low'].includes(state.deviceTier)) {
      if (priority === 'low') {
        return Math.random() < 0.5; // Only execute 50% of low priority operations
      }
    }

    return true;
  }

  /**
   * Record operation performance for regression detection
   */
  private recordOperationPerformance(
    component: string,
    operationName: string,
    isVulnerableUser: boolean
  ): void {
    const startTime = performance.now();
    
    // Use performance.mark/measure if available
    if ('mark' in performance && 'measure' in performance) {
      const markName = `${operationName}_start`;
      performance.mark(markName);
      
      // Measure after a brief delay
      setTimeout(() => {
        try {
          const measureName = `${operationName}_duration`;
          performance.measure(measureName, markName);
          
          const measure = performance.getEntriesByName(measureName)[0];
          if (measure) {
            performanceRegressionDetector.recordPerformanceMeasurement(
              component,
              'execution_time',
              measure.duration,
              {
                deviceTier: mobilePerformanceMonitor.getDeviceTier(),
                isVulnerableUser
              }
            );
          }
        } catch (error) {
          // Fallback measurement
          const duration = performance.now() - startTime;
          performanceRegressionDetector.recordPerformanceMeasurement(
            component,
            'execution_time',
            duration,
            {
              deviceTier: mobilePerformanceMonitor.getDeviceTier(),
              isVulnerableUser
            }
          );
        }
      }, 0);
    }
  }

  /**
   * Apply optimizations for vulnerable users
   */
  private applyVulnerableUserOptimizations(): void {
    this.log('info', '🛡️ Applying vulnerable user optimizations');

    // Enable crisis protection mode
    if (this.config.enableCrisisProtection) {
      analyticsPerformanceOptimizer.addToDeferredQueue({
        id: `vulnerable_user_optimization_${Date.now()}`,
        operation: async () => {
          // Reduce visual complexity
          this.simplifyUI();
          
          // Prioritize essential features
          this.prioritizeEssentialFeatures();
          
          // Enable aggressive performance mode
          this.enableAggressivePerformanceMode();
        },
        priority: 'high',
        category: 'ui',
        estimatedCost: 100,
        retryCount: 0,
        maxRetries: 1
      });
    }
  }

  /**
   * Apply emergency measures during performance issues
   */
  private applyEmergencyMeasures(): void {
    this.log('warn', '🚨 Applying emergency performance measures');

    // Disable all non-essential features
    this.disableNonEssentialFeatures();
    
    // Force memory cleanup
    this.forceMemoryCleanup();
    
    // Enable minimal UI mode
    this.enableMinimalUIMode();
  }

  /**
   * Get current performance state across all systems
   */
  public getPerformanceState(): PerformanceState {
    const analyticsMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();
    const budgetReport = analyticsBudgetEnforcer.generateBudgetReport();
    const lowEndState = lowEndDeviceOptimizer.getOptimizationState();
    const regressionStatus = performanceRegressionDetector.getRegressionStatus();

    const activeOptimizations = [
      ...analyticsMetrics.state.adaptations,
      ...lowEndState.state.activeOptimizations
    ];

    const currentThreats = {
      performance: regressionStatus.activeAlerts
        .filter(alert => alert.severity === 'critical')
        .map(alert => alert.component),
      memory: analyticsMetrics.state.memoryPressure === 'critical' ? ['high_memory_usage'] : [],
      network: lowEndState.state.networkQuality === 'critical' ? ['poor_network'] : []
    };

    return {
      isOptimal: !analyticsMetrics.state.isOverloaded && budgetReport.budgetCompliance > 80,
      isCrisisMode: analyticsMetrics.state.isCrisisMode,
      deviceTier: lowEndState.state.deviceTier,
      networkQuality: lowEndState.state.networkQuality,
      memoryPressure: analyticsMetrics.analytics.memory_usage_percent || 0,
      activeOptimizations,
      currentThreats
    };
  }

  /**
   * Get comprehensive performance report
   */
  public getPerformanceReport(): {
    summary: {
      overall: 'excellent' | 'good' | 'fair' | 'poor';
      criticalIssues: number;
      activeOptimizations: number;
    };
    analytics: ReturnType<typeof analyticsPerformanceOptimizer.getPerformanceMetrics>;
    budgets: ReturnType<typeof analyticsBudgetEnforcer.generateBudgetReport>;
    lowEndOptimizations: ReturnType<typeof lowEndDeviceOptimizer.getOptimizationState>;
    regressions: ReturnType<typeof performanceRegressionDetector.getRegressionStatus>;
    recommendations: string[];
  } {
    const state = this.getPerformanceState();
    const analyticsMetrics = analyticsPerformanceOptimizer.getPerformanceMetrics();
    const budgetReport = analyticsBudgetEnforcer.generateBudgetReport();
    const lowEndState = lowEndDeviceOptimizer.getOptimizationState();
    const regressionStatus = performanceRegressionDetector.getRegressionStatus();

    // Determine overall status
    let overall: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
    const criticalIssues = state.currentThreats.performance.length + 
                          state.currentThreats.memory.length + 
                          state.currentThreats.network.length;

    if (criticalIssues > 0 || state.isCrisisMode) {
      overall = 'poor';
    } else if (budgetReport.budgetCompliance < 70 || state.memoryPressure > 80) {
      overall = 'fair';
    } else if (budgetReport.budgetCompliance < 90 || state.memoryPressure > 60) {
      overall = 'good';
    }

    // Generate recommendations
    const recommendations = [
      ...budgetReport.recommendations,
      ...budgetReport.adaptationsRequired
    ];

    if (state.deviceTier === 'ultra-low') {
      recommendations.push('Consider progressive feature loading for ultra-low-end devices');
    }

    if (state.networkQuality === 'poor') {
      recommendations.push('Enable offline-first optimizations for poor network conditions');
    }

    return {
      summary: {
        overall,
        criticalIssues,
        activeOptimizations: state.activeOptimizations.length
      },
      analytics: analyticsMetrics,
      budgets: budgetReport,
      lowEndOptimizations: lowEndState,
      regressions: regressionStatus,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    };
  }

  /**
   * Register callback for performance state changes
   */
  public onPerformanceStateChange(callback: (state: PerformanceState) => void): () => void {
    this.performanceCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.performanceCallbacks.indexOf(callback);
      if (index > -1) {
        this.performanceCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify performance callbacks
   */
  private notifyPerformanceCallbacks(state: PerformanceState): void {
    this.performanceCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        this.log('error', 'Performance callback error:', error);
      }
    });
  }

  /**
   * Optimization helper methods
   */
  private simplifyUI(): void {
    typeof window !== 'undefined' && document.body.classList.add('alchm-simplified-ui');
  }

  private prioritizeEssentialFeatures(): void {
    const essential = typeof window !== 'undefined' && document.querySelectorAll('[data-essential]');
    essential.forEach(el => {
      (el as HTMLElement).style.zIndex = '1000';
    });
  }

  private enableAggressivePerformanceMode(): void {
    typeof window !== 'undefined' && document.body.classList.add('alchm-aggressive-performance');
  }

  private disableNonEssentialFeatures(): void {
    const nonEssential = typeof window !== 'undefined' && document.querySelectorAll('.non-essential, [data-non-essential]');
    nonEssential.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  private forceMemoryCleanup(): void {
    if ('gc' in typeof window !== 'undefined' && window) {
      (typeof window !== 'undefined' && window as any).gc();
    }
  }

  private enableMinimalUIMode(): void {
    typeof window !== 'undefined' && document.body.classList.add('alchm-minimal-ui');
  }

  /**
   * Logging utility
   */
  private log(level: 'error' | 'warn' | 'info' | 'debug', message: string, ...args: any[]): void {
    const levels = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
    const currentLevel = levels[this.config.logLevel];
    const messageLevel = levels[level];

    if (messageLevel <= currentLevel) {
      console[level](`[ALCHM Performance] ${message}`, ...args);
    }
  }

  /**
   * Clean up all performance systems
   */
  public cleanup(): void {
    analyticsPerformanceOptimizer.cleanup();
    lowEndDeviceOptimizer.cleanup();
    guidedExperienceVitals.cleanup();
    performanceRegressionDetector.cleanup();

    // Remove optimization classes
    typeof window !== 'undefined' && document.body.classList.remove(
      'alchm-simplified-ui',
      'alchm-aggressive-performance',
      'alchm-minimal-ui'
    );

    this.isInitialized = false;
    this.performanceCallbacks = [];
  }
}

// Global performance manager instance
export const analyticsPerformanceManager = new AnalyticsPerformanceManager();

// React hook for analytics performance management
export const useAnalyticsPerformance = () => {
  const [performanceState, setPerformanceState] = React.useState<PerformanceState | null>(null);

  React.useEffect(() => {
    const unsubscribe = analyticsPerformanceManager.onPerformanceStateChange(setPerformanceState);
    
    // Get initial state
    setPerformanceState(analyticsPerformanceManager.getPerformanceState());
    
    return unsubscribe;
  }, []);

  return {
    performanceState,
    execute: analyticsPerformanceManager.executeAnalyticsOperation.bind(analyticsPerformanceManager),
    startExperience: analyticsPerformanceManager.startGuidedExperience.bind(analyticsPerformanceManager),
    completeExperience: analyticsPerformanceManager.completeGuidedExperience.bind(analyticsPerformanceManager),
    getReport: () => analyticsPerformanceManager.getPerformanceReport(),
    isOptimal: performanceState?.isOptimal || false,
    isCrisisMode: performanceState?.isCrisisMode || false
  };
};

// Export everything for easy integration
export {
  analyticsPerformanceOptimizer,
  analyticsBudgetEnforcer,
  withBudgetEnforcement,
  lowEndDeviceOptimizer,
  guidedExperienceVitals,
  performanceRegressionDetector,
  mobilePerformanceMonitor
};

export default analyticsPerformanceManager;