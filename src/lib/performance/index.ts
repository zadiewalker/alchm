/**
 * ALCHM Performance System Index
 * 
 * Central export for all performance optimization and monitoring systems.
 * This is the main entry point for trauma-informed performance management.
 */

// Core monitoring systems
export { 
  getPerformanceMonitor, 
  CRISIS_PERFORMANCE_THRESHOLDS,
  measurePerformance,
  onPerformanceAlert,
  type PerformanceMetric,
  type PerformanceAlert 
} from '../monitoring/real-time-performance-monitor';

export {
  getCrisisSafeguards,
  type CrisisSafeguard,
  type CrisisPerformanceMetric,
  type EmergencyFallback
} from './crisis-performance-safeguards';

// Optimization systems
export {
  getBundleOptimizer,
  lazyLoad,
  loadCrisisComponent,
  preloadUserJourney,
  CRISIS_LOAD_PRIORITY,
  type BundleMetrics,
  type ComponentLoadConfig
} from './bundle-optimization';

export {
  getImageOptimizer,
  OptimizedImage,
  type OptimizedImageProps,
  type ImageMetrics
} from './image-optimization';

export {
  getMobileOptimizer,
  type MobileDeviceInfo,
  type MobileOptimization,
  type TouchOptimization,
  type NetworkOptimization,
  type BatteryOptimization,
  type MobilePerformanceMetrics
} from './mobile-performance-optimizer';

// Monitoring and testing systems
export {
  getRUM,
  trackCrisisAction,
  trackConversion,
  type UserSession,
  type UserJourneyEvent,
  type UserPerformanceEvent,
  type UserErrorEvent,
  type ConversionEvent,
  type RUMAnalytics,
  type CriticalIssue
} from './real-user-monitoring';

export {
  getBudgetEnforcer,
  type PerformanceBudget,
  type BudgetViolation,
  type BudgetReport,
  type BudgetRecommendation,
  type ResourceAnalysis
} from './performance-budget-enforcer';

export {
  getAutomatedTesting,
  type PerformanceTest,
  type TestResult,
  type TestSuite,
  type TestReport,
  type PerformanceMetrics,
  type ThresholdViolation,
  type LighthouseScore
} from './automated-performance-testing';

// Utility functions
export {
  initializePerformanceSystem,
  createPerformanceProvider,
  usePerformanceMetrics,
  usePerformanceAlerts
} from './performance-utils';

/**
 * Initialize the complete ALCHM performance system
 * Call this once in your app's entry point
 */
export function initializeALCHMPerformance(): void {
  if (typeof window === 'undefined') return;

  console.log('[ALCHM PERFORMANCE] Initializing trauma-informed performance system');

  // Initialize core systems
  getPerformanceMonitor();
  getCrisisSafeguards();
  getBundleOptimizer();
  getImageOptimizer();
  getMobileOptimizer();
  getRUM();
  getBudgetEnforcer();

  console.log('[ALCHM PERFORMANCE] System initialization complete');
}

/**
 * Get overall performance health status
 */
export function getPerformanceHealthStatus(): {
  status: 'healthy' | 'warning' | 'critical' | 'emergency';
  score: number;
  criticalIssues: string[];
  recommendations: string[];
} {
  const performanceMonitor = getPerformanceMonitor();
  const crisisSafeguards = getCrisisSafeguards();
  const budgetEnforcer = getBudgetEnforcer();
  const rum = getRUM();

  // Get recent alerts and violations
  const recentAlerts = performanceMonitor.getRecentAlerts(300000); // Last 5 minutes
  const recentViolations = budgetEnforcer.getViolations(300000);
  const isInEmergencyMode = crisisSafeguards.isInEmergencyMode();

  let status: 'healthy' | 'warning' | 'critical' | 'emergency' = 'healthy';
  let score = 100;
  const criticalIssues: string[] = [];
  const recommendations: string[] = [];

  // Check for emergency mode
  if (isInEmergencyMode) {
    status = 'emergency';
    score = 0;
    criticalIssues.push('Crisis safeguards have triggered emergency mode');
    recommendations.push('Investigate crisis performance issues immediately');
  } else {
    // Check alerts
    const criticalAlerts = recentAlerts.filter(a => a.severity === 'EMERGENCY' || a.severity === 'CRITICAL');
    const warningAlerts = recentAlerts.filter(a => a.severity === 'WARNING');

    // Check violations
    const criticalViolations = recentViolations.filter(v => v.severity === 'EMERGENCY' || v.severity === 'CRITICAL');
    const warningViolations = recentViolations.filter(v => v.severity === 'WARNING');

    // Calculate score and status
    score -= criticalAlerts.length * 25;
    score -= warningAlerts.length * 10;
    score -= criticalViolations.length * 20;
    score -= warningViolations.length * 5;

    score = Math.max(0, score);

    if (criticalAlerts.length > 0 || criticalViolations.length > 0) {
      status = 'critical';
      criticalIssues.push(`${criticalAlerts.length + criticalViolations.length} critical performance issues detected`);
      recommendations.push('Address critical performance issues immediately');
    } else if (warningAlerts.length > 2 || warningViolations.length > 3) {
      status = 'warning';
      recommendations.push('Monitor performance trends and optimize proactively');
    }
  }

  // Add crisis-specific recommendations
  const crisisAlerts = recentAlerts.filter(a => a.isCrisisContext);
  if (crisisAlerts.length > 0) {
    criticalIssues.push(`Crisis features experiencing performance issues`);
    recommendations.push('Prioritize crisis feature performance immediately');
  }

  return {
    status,
    score,
    criticalIssues,
    recommendations
  };
}

/**
 * Emergency performance optimization
 * Triggers all available performance optimizations immediately
 */
export function triggerEmergencyOptimization(): void {
  console.warn('[ALCHM PERFORMANCE] EMERGENCY OPTIMIZATION TRIGGERED');

  const mobileOptimizer = getMobileOptimizer();
  const crisisSafeguards = getCrisisSafeguards();

  // Enable emergency mode
  mobileOptimizer.enableEmergencyMode();
  
  // Clear all non-essential caches
  const bundleOptimizer = getBundleOptimizer();
  const imageOptimizer = getImageOptimizer();
  
  bundleOptimizer.clearCache();
  imageOptimizer.clearCache();

  // Enable all safeguards
  const safeguardStatus = crisisSafeguards.getSafeguardStatus();
  Object.keys(safeguardStatus).forEach(safeguardId => {
    crisisSafeguards.enableSafeguard(safeguardId);
  });

  console.warn('[ALCHM PERFORMANCE] Emergency optimization complete');
}

/**
 * Generate comprehensive performance report
 */
export function generatePerformanceReport(): {
  timestamp: number;
  healthStatus: any;
  performanceGrade: string;
  coreMetrics: any;
  rumAnalytics: any;
  budgetReport: any;
  safeguardStatus: any;
  mobileOptimization: any;
  recommendations: string[];
} {
  const performanceMonitor = getPerformanceMonitor();
  const rum = getRUM();
  const budgetEnforcer = getBudgetEnforcer();
  const crisisSafeguards = getCrisisSafeguards();
  const mobileOptimizer = getMobileOptimizer();

  return {
    timestamp: Date.now(),
    healthStatus: getPerformanceHealthStatus(),
    performanceGrade: performanceMonitor.getCurrentPerformanceGrade(),
    coreMetrics: {
      recentMetrics: performanceMonitor.getRecentMetrics(300000),
      recentAlerts: performanceMonitor.getRecentAlerts(3600000)
    },
    rumAnalytics: rum.getAnalytics(),
    budgetReport: budgetEnforcer.getBudgetReport(),
    safeguardStatus: crisisSafeguards.getSafeguardStatus(),
    mobileOptimization: mobileOptimizer.getOptimizationReport(),
    recommendations: getPerformanceRecommendations()
  };
}

function getPerformanceRecommendations(): string[] {
  const recommendations: string[] = [];
  const healthStatus = getPerformanceHealthStatus();
  const budgetEnforcer = getBudgetEnforcer();
  const budgetReport = budgetEnforcer.getBudgetReport();

  // Add health-based recommendations
  recommendations.push(...healthStatus.recommendations);

  // Add budget-based recommendations
  budgetReport.recommendations.forEach(rec => {
    recommendations.push(`${rec.priority.toUpperCase()}: ${rec.description}`);
  });

  // Add crisis-specific recommendations
  if (budgetReport.crisisImpactingViolations > 0) {
    recommendations.unshift('CRITICAL: Resolve crisis feature performance issues immediately');
  }

  return recommendations.slice(0, 10); // Top 10 recommendations
}