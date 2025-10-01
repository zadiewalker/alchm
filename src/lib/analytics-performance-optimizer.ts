/**
 * ALCHM Analytics Performance Optimizer
 * Crisis-critical performance optimization for analytics and engagement systems
 * Ensures zero performance impact during vulnerable user moments
 */

import { performanceMonitor } from './performance-monitoring';
import { mobilePerformanceMonitor } from './mobile-performance-monitor';

interface AnalyticsPerformanceConfig {
  maxMemoryUsage: number; // MB
  maxCPUUsage: number; // %
  crisisModeBudget: number; // ms for critical operations
  batchSize: number;
  deferredOperations: string[];
  emergencyThresholds: {
    memory: number;
    cpu: number;
    networkRTT: number;
  };
}

interface PerformanceState {
  isOverloaded: boolean;
  isCrisisMode: boolean;
  memoryPressure: 'low' | 'medium' | 'high' | 'critical';
  cpuPressure: 'low' | 'medium' | 'high' | 'critical';
  networkQuality: 'excellent' | 'good' | 'poor' | 'critical';
  adaptations: string[];
}

interface DeferredOperation {
  id: string;
  operation: () => Promise<void>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'analytics' | 'badge' | 'gamification' | 'ui';
  estimatedCost: number; // ms
  retryCount: number;
  maxRetries: number;
}

export class AnalyticsPerformanceOptimizer {
  private config: AnalyticsPerformanceConfig = {
    maxMemoryUsage: 50, // 50MB
    maxCPUUsage: 70, // 70%
    crisisModeBudget: 100, // 100ms maximum for any operation
    batchSize: 10,
    deferredOperations: ['badge_animation', 'streak_calculation', 'analytics_aggregation'],
    emergencyThresholds: {
      memory: 80, // 80MB triggers emergency mode
      cpu: 85, // 85% CPU usage
      networkRTT: 1000 // 1 second RTT
    }
  };

  private state: PerformanceState = {
    isOverloaded: false,
    isCrisisMode: false,
    memoryPressure: 'low',
    cpuPressure: 'low',
    networkQuality: 'excellent',
    adaptations: []
  };

  private deferredQueue: DeferredOperation[] = [];
  private performanceObserver: PerformanceObserver | null = null;
  private memoryCheckInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private analytics: Map<string, number> = new Map();
  private lastOptimization = 0;

  constructor() {
    this.initializeMonitoring();
    this.startPerformanceOptimization();
  }

  /**
   * Initialize performance monitoring for analytics operations
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor long tasks that could impact analytics performance
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.handleLongTask(entry);
            }
          });
        });
        
        this.performanceObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }

    // Monitor memory usage every 10 seconds
    this.memoryCheckInterval = setInterval(() => {
      this.checkMemoryPressure();
    }, 10000);

    // Monitor network quality changes
    this.monitorNetworkQuality();
  }

  /**
   * Handle long tasks by deferring non-critical analytics operations
   */
  private handleLongTask(entry: PerformanceEntry): void {
    if (entry.duration > this.config.crisisModeBudget) {
      this.enableEmergencyMode();
    }

    // Defer analytics operations during long tasks
    this.deferNonCriticalOperations();
  }

  /**
   * Check memory pressure and adapt accordingly
   */
  private checkMemoryPressure(): void {
    const memory = (performance as any).memory;
    if (!memory) return;

    const usedMB = memory.usedJSHeapSize / 1048576; // Convert to MB
    const totalMB = memory.jsHeapSizeLimit / 1048576;
    const usagePercent = (usedMB / totalMB) * 100;

    // Update memory pressure state
    if (usedMB > this.config.emergencyThresholds.memory) {
      this.state.memoryPressure = 'critical';
      this.enableEmergencyMode();
    } else if (usagePercent > 80) {
      this.state.memoryPressure = 'high';
    } else if (usagePercent > 60) {
      this.state.memoryPressure = 'medium';
    } else {
      this.state.memoryPressure = 'low';
    }

    // Track memory usage analytics
    this.analytics.set('memory_usage_mb', usedMB);
    this.analytics.set('memory_usage_percent', usagePercent);

    if (this.state.memoryPressure !== 'low') {
      this.optimizeMemoryUsage();
    }
  }

  /**
   * Monitor network quality for analytics operations
   */
  private monitorNetworkQuality(): void {
    const connection = (navigator as any).connection;
    if (!connection) return;

    const updateNetworkQuality = () => {
      const rtt = connection.rtt || 0;
      const effectiveType = connection.effectiveType || 'unknown';

      if (rtt > this.config.emergencyThresholds.networkRTT || effectiveType === 'slow-2g') {
        this.state.networkQuality = 'critical';
      } else if (rtt > 500 || effectiveType === '2g') {
        this.state.networkQuality = 'poor';
      } else if (rtt > 200 || effectiveType === '3g') {
        this.state.networkQuality = 'good';
      } else {
        this.state.networkQuality = 'excellent';
      }

      this.adaptToNetworkConditions();
    };

    connection.addEventListener('change', updateNetworkQuality);
    updateNetworkQuality();
  }

  /**
   * Enable emergency mode to protect user experience during crisis moments
   */
  private enableEmergencyMode(): void {
    this.state.isCrisisMode = true;
    this.state.isOverloaded = true;
    this.state.adaptations.push('emergency_mode_enabled');

    // Disable all non-critical analytics
    this.deferAllNonCriticalOperations();

    // Reduce animation complexity
    this.disableComplexAnimations();

    // Batch all remaining operations
    this.enableAggressiveBatching();

    console.warn('🚨 Emergency performance mode enabled for user safety');
  }

  /**
   * Defer non-critical operations to prevent performance impact
   */
  private deferNonCriticalOperations(): void {
    // Analytics that can be deferred
    const deferredOperations = [
      'badge_progress_calculation',
      'streak_visualization_update',
      'habit_analytics_aggregation',
      'wellness_chart_rendering',
      'gamification_progress_sync'
    ];

    deferredOperations.forEach(operation => {
      this.addToDeferredQueue({
        id: `${operation}_${Date.now()}`,
        operation: async () => {
          // Placeholder for actual operation
          console.log(`Executing deferred operation: ${operation}`);
        },
        priority: 'low',
        category: 'analytics',
        estimatedCost: 50,
        retryCount: 0,
        maxRetries: 3
      });
    });
  }

  /**
   * Add operation to deferred execution queue
   */
  public addToDeferredQueue(operation: DeferredOperation): void {
    this.deferredQueue.push(operation);
    
    // Sort by priority (critical first, then by estimated cost)
    this.deferredQueue.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.estimatedCost - b.estimatedCost;
    });

    // Limit queue size to prevent memory issues
    if (this.deferredQueue.length > 100) {
      this.deferredQueue = this.deferredQueue.slice(0, 50);
    }
  }

  /**
   * Process deferred operations when performance allows
   */
  private async processDeferredQueue(): Promise<void> {
    if (this.isProcessing || this.deferredQueue.length === 0) return;
    if (this.state.isCrisisMode || this.state.memoryPressure === 'critical') return;

    this.isProcessing = true;

    try {
      const batchSize = this.getBatchSize();
      const batch = this.deferredQueue.splice(0, batchSize);

      for (const operation of batch) {
        try {
          const startTime = performance.now();
          await operation.operation();
          const duration = performance.now() - startTime;

          // Track operation performance
          this.analytics.set(`deferred_${operation.category}_duration`, duration);

          // If operation takes too long, reduce batch size
          if (duration > this.config.crisisModeBudget) {
            this.config.batchSize = Math.max(1, Math.floor(this.config.batchSize * 0.8));
          }

        } catch (error) {
          console.warn(`Deferred operation failed: ${operation.id}`, error);
          
          // Retry if under limit
          if (operation.retryCount < operation.maxRetries) {
            operation.retryCount++;
            this.deferredQueue.push(operation);
          }
        }

        // Yield control to prevent blocking
        await this.yieldToMain();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Yield control to main thread
   */
  private yieldToMain(): Promise<void> {
    return new Promise(resolve => {
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        (window as any).scheduler.postTask(resolve, { priority: 'background' });
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  /**
   * Get optimal batch size based on current performance
   */
  private getBatchSize(): number {
    if (this.state.memoryPressure === 'high') return Math.max(1, Math.floor(this.config.batchSize * 0.5));
    if (this.state.cpuPressure === 'high') return Math.max(1, Math.floor(this.config.batchSize * 0.7));
    if (this.state.networkQuality === 'poor') return Math.max(1, Math.floor(this.config.batchSize * 0.6));
    
    return this.config.batchSize;
  }

  /**
   * Optimize memory usage for analytics components
   */
  private optimizeMemoryUsage(): void {
    // Clear old analytics data
    if (this.analytics.size > 100) {
      const entries = Array.from(this.analytics.entries());
      const recent = entries.slice(-50);
      this.analytics.clear();
      recent.forEach(([key, value]) => this.analytics.set(key, value));
    }

    // Request garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    this.state.adaptations.push('memory_optimization_applied');
  }

  /**
   * Disable complex animations to improve performance
   */
  private disableComplexAnimations(): void {
    const style = document.createElement('style');
    style.id = 'analytics-performance-mode';
    style.textContent = `
      .badge-animation,
      .streak-animation,
      .progress-animation {
        animation: none !important;
        transition: none !important;
      }
      
      .analytics-chart {
        will-change: auto !important;
      }
      
      .gamification-effects {
        opacity: 0.8 !important;
        transform: none !important;
      }
    `;

    document.head.appendChild(style);
    this.state.adaptations.push('animations_disabled');
  }

  /**
   * Enable aggressive batching for analytics operations
   */
  private enableAggressiveBatching(): void {
    this.config.batchSize = Math.max(1, Math.floor(this.config.batchSize * 0.3));
    this.state.adaptations.push('aggressive_batching_enabled');
  }

  /**
   * Adapt to network conditions
   */
  private adaptToNetworkConditions(): void {
    if (this.state.networkQuality === 'critical' || this.state.networkQuality === 'poor') {
      // Reduce real-time sync frequency
      this.reduceNetworkOperations();
      
      // Enable offline-first analytics
      this.enableOfflineAnalytics();
    }
  }

  /**
   * Reduce network operations for poor connections
   */
  private reduceNetworkOperations(): void {
    // Batch analytics requests more aggressively
    this.config.batchSize = Math.max(1, Math.floor(this.config.batchSize * 0.5));
    
    // Defer non-critical analytics sync
    this.deferNetworkOperations();
    
    this.state.adaptations.push('network_operations_reduced');
  }

  /**
   * Defer network operations during poor connectivity
   */
  private deferNetworkOperations(): void {
    const networkOperations = [
      'badge_progress_sync',
      'analytics_data_upload',
      'gamification_leaderboard_update',
      'wellness_data_backup'
    ];

    networkOperations.forEach(operation => {
      this.addToDeferredQueue({
        id: `network_${operation}_${Date.now()}`,
        operation: async () => {
          console.log(`Executing deferred network operation: ${operation}`);
        },
        priority: 'low',
        category: 'analytics',
        estimatedCost: 200,
        retryCount: 0,
        maxRetries: 5
      });
    });
  }

  /**
   * Enable offline-first analytics storage
   */
  private enableOfflineAnalytics(): void {
    // Store analytics data locally for later sync
    try {
      const analyticsData = Array.from(this.analytics.entries());
      localStorage.setItem('alchm_offline_analytics', JSON.stringify({
        data: analyticsData,
        timestamp: Date.now(),
        state: this.state
      }));
    } catch (error) {
      console.warn('Failed to store offline analytics:', error);
    }

    this.state.adaptations.push('offline_analytics_enabled');
  }

  /**
   * Defer all non-critical operations during crisis
   */
  private deferAllNonCriticalOperations(): void {
    // Only allow critical user safety operations
    const criticalOperations = [
      'crisis_button_tracking',
      'emergency_resource_analytics',
      'safety_plan_interaction'
    ];

    // Everything else gets deferred
    this.config.deferredOperations = [
      'badge_calculations',
      'streak_updates',
      'gamification_progress',
      'wellness_visualization',
      'habit_analytics',
      'social_features',
      'achievement_notifications'
    ];
  }

  /**
   * Start performance optimization loop
   */
  private startPerformanceOptimization(): void {
    const optimize = async () => {
      const now = Date.now();
      
      // Run optimization every 5 seconds, or immediately if in crisis mode
      if (now - this.lastOptimization < 5000 && !this.state.isCrisisMode) {
        return;
      }

      this.lastOptimization = now;

      // Check if we need to exit emergency mode
      if (this.state.isCrisisMode && this.canExitEmergencyMode()) {
        this.exitEmergencyMode();
      }

      // Process deferred operations if performance allows
      if (!this.state.isCrisisMode) {
        await this.processDeferredQueue();
      }

      // Update performance state
      this.updatePerformanceState();
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleOptimization = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(async (deadline) => {
          if (deadline.timeRemaining() > 10 || this.state.isCrisisMode) {
            await optimize();
          }
          scheduleOptimization();
        });
      } else {
        setTimeout(async () => {
          await optimize();
          scheduleOptimization();
        }, this.state.isCrisisMode ? 1000 : 5000);
      }
    };

    scheduleOptimization();
  }

  /**
   * Check if we can safely exit emergency mode
   */
  private canExitEmergencyMode(): boolean {
    return (
      this.state.memoryPressure !== 'critical' &&
      this.state.cpuPressure !== 'critical' &&
      this.state.networkQuality !== 'critical'
    );
  }

  /**
   * Exit emergency mode and restore normal operation
   */
  private exitEmergencyMode(): void {
    this.state.isCrisisMode = false;
    this.state.isOverloaded = false;
    this.state.adaptations.push('emergency_mode_exited');

    // Remove performance mode styles
    const performanceStyle = document.getElementById('analytics-performance-mode');
    if (performanceStyle) {
      performanceStyle.remove();
    }

    // Restore normal batch size
    this.config.batchSize = 10;

    console.log('✅ Emergency performance mode disabled - normal operation restored');
  }

  /**
   * Update overall performance state
   */
  private updatePerformanceState(): void {
    const deviceTier = mobilePerformanceMonitor.getDeviceTier();
    const isLowEndDevice = ['ultra-low', 'low'].includes(deviceTier);
    
    this.state.isOverloaded = (
      this.state.memoryPressure === 'high' ||
      this.state.cpuPressure === 'high' ||
      (isLowEndDevice && this.deferredQueue.length > 20)
    );

    // Track performance metrics
    this.analytics.set('performance_state_overloaded', this.state.isOverloaded ? 1 : 0);
    this.analytics.set('deferred_queue_length', this.deferredQueue.length);
    this.analytics.set('adaptations_count', this.state.adaptations.length);
  }

  /**
   * Get current performance metrics for monitoring
   */
  public getPerformanceMetrics(): {
    state: PerformanceState;
    analytics: Record<string, number>;
    queueLength: number;
    config: AnalyticsPerformanceConfig;
  } {
    return {
      state: { ...this.state },
      analytics: Object.fromEntries(this.analytics),
      queueLength: this.deferredQueue.length,
      config: { ...this.config }
    };
  }

  /**
   * Manually trigger performance optimization
   */
  public optimizeNow(): void {
    if (this.state.memoryPressure !== 'low') {
      this.optimizeMemoryUsage();
    }
    
    if (this.deferredQueue.length > 0) {
      this.processDeferredQueue();
    }
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }

    // Clean up performance mode styles
    const performanceStyle = document.getElementById('analytics-performance-mode');
    if (performanceStyle) {
      performanceStyle.remove();
    }
  }
}

// Global instance
export const analyticsPerformanceOptimizer = new AnalyticsPerformanceOptimizer();

// React hook for analytics performance monitoring
export const useAnalyticsPerformance = () => {
  return {
    getMetrics: () => analyticsPerformanceOptimizer.getPerformanceMetrics(),
    optimizeNow: () => analyticsPerformanceOptimizer.optimizeNow(),
    addDeferredOperation: (operation: DeferredOperation) => 
      analyticsPerformanceOptimizer.addToDeferredQueue(operation),
    isOptimal: () => !analyticsPerformanceOptimizer.getPerformanceMetrics().state.isOverloaded
  };
};

export default analyticsPerformanceOptimizer;