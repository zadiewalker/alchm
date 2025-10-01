/**
 * CRITICAL LIFE-SAFETY SYSTEMS: Performance Monitoring Suite
 * 
 * This module exports all performance monitoring and safety systems
 * designed to protect users in crisis situations.
 */

// Core monitoring systems
export {
  getPerformanceMonitor,
  measurePerformance,
  onPerformanceAlert,
  CRISIS_PERFORMANCE_THRESHOLDS,
  type PerformanceMetric,
  type PerformanceAlert
} from './real-time-performance-monitor';

export {
  getRollbackSystem,
  triggerManualRollback,
  isInEmergencyMode,
  type RollbackConfiguration,
  type RollbackEvent
} from './automated-rollback-system';

export {
  getBudgetEnforcer,
  checkPerformanceBudget,
  onBudgetViolation,
  addPerformanceBudget,
  type PerformanceBudget,
  type BudgetViolation,
  type ComponentBudget
} from './performance-budget-enforcer';

export {
  getCrisisResourceMonitor,
  addCrisisResource,
  onCrisisResourceAlert,
  getCrisisResourceHealth,
  type CrisisResource,
  type ResourceHealthCheck,
  type ResourceAlert,
  type FailoverEvent
} from './crisis-resource-monitor';

export {
  getEmergencyFallbackSystem,
  isInEmergencyFallbackMode,
  activateEmergencyMode,
  deactivateEmergencyMode,
  type FallbackResource,
  type FallbackState,
  type EmergencyMode
} from './emergency-fallback-system';

// React component
export { default as PerformanceDashboard } from '../../components/monitoring/PerformanceDashboard';

/**
 * Initialize all monitoring systems
 * Call this once in your app initialization
 */
export function initializeMonitoringSystems(): void {
  console.log('[MONITORING SYSTEMS] Initializing life-critical monitoring...');
  
  // Initialize all systems (they're singletons, so this is safe)
  getPerformanceMonitor();
  getRollbackSystem();
  getBudgetEnforcer();
  getCrisisResourceMonitor();
  getEmergencyFallbackSystem();
  
  console.log('[MONITORING SYSTEMS] ✅ All monitoring systems initialized');
}

/**
 * Get comprehensive system health status
 */
export function getSystemHealthStatus(): {
  performance: 'healthy' | 'degraded' | 'critical' | 'emergency';
  crisisResources: 'healthy' | 'degraded' | 'critical' | 'emergency';
  emergencyMode: boolean;
  rollbackActive: boolean;
  criticalAlerts: number;
  lastUpdate: Date;
} {
  const performanceMonitor = getPerformanceMonitor();
  const crisisMonitor = getCrisisResourceMonitor();
  const rollbackSystem = getRollbackSystem();
  const fallbackSystem = getEmergencyFallbackSystem();
  
  // Get crisis resource health
  const crisisHealth = getCrisisResourceHealth();
  
  // Determine crisis resources status
  let crisisResourcesStatus: 'healthy' | 'degraded' | 'critical' | 'emergency' = 'healthy';
  if (crisisHealth.downResources > 0) {
    crisisResourcesStatus = 'emergency';
  } else if (crisisHealth.failingResources > 0) {
    crisisResourcesStatus = 'critical';
  } else if (crisisHealth.degradedResources > 0) {
    crisisResourcesStatus = 'degraded';
  }
  
  // For performance status, we'd need to check recent metrics
  // This is a simplified version
  const performanceStatus: 'healthy' | 'degraded' | 'critical' | 'emergency' = 'healthy';
  
  return {
    performance: performanceStatus,
    crisisResources: crisisResourcesStatus,
    emergencyMode: isInEmergencyMode() || fallbackSystem.isInEmergencyMode(),
    rollbackActive: rollbackSystem.getRollbackHistory().length > 0,
    criticalAlerts: crisisHealth.criticalIssues,
    lastUpdate: new Date()
  };
}

/**
 * Emergency shutdown - use only in critical situations
 */
export async function emergencyShutdown(reason: string): Promise<void> {
  console.error(`[EMERGENCY SHUTDOWN] 🚨 Initiating emergency shutdown: ${reason}`);
  
  try {
    // Activate emergency fallbacks
    await activateEmergencyMode();
    
    // Trigger rollback
    await triggerManualRollback(`Emergency shutdown: ${reason}`);
    
    console.error('[EMERGENCY SHUTDOWN] ✅ Emergency procedures completed');
  } catch (error) {
    console.error('[EMERGENCY SHUTDOWN] ❌ Emergency shutdown failed:', error);
  }
}