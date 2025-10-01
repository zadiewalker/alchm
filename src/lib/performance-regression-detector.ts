/**
 * ALCHM Performance Regression Detection System
 * Automated detection and alerting for performance degradations
 * Protects vulnerable users from performance regressions
 */

import { guidedExperienceVitals } from './guided-experience-vitals';
import { analyticsBudgetEnforcer } from './analytics-performance-budgets';
import { performanceMonitor } from './performance-monitoring';
import { mobilePerformanceMonitor } from './mobile-performance-monitor';

interface PerformanceBaseline {
  metric: string;
  component: string;
  deviceTier: string;
  networkQuality: string;
  values: {
    mean: number;
    median: number;
    p95: number;
    p99: number;
    standardDeviation: number;
  };
  sampleSize: number;
  lastUpdated: number;
  confidence: 'low' | 'medium' | 'high';
}

interface RegressionAlert {
  id: string;
  metric: string;
  component: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  currentValue: number;
  baselineValue: number;
  percentageIncrease: number;
  impactLevel: 'low' | 'medium' | 'high' | 'crisis';
  affectedUsers: {
    deviceTiers: string[];
    networkQualities: string[];
    vulnerableUsers: boolean;
  };
  detectedAt: number;
  trend: 'improving' | 'stable' | 'degrading' | 'critical';
  recommendedActions: string[];
  autoMitigationApplied: boolean;
}

interface RegressionConfig {
  detectionThresholds: {
    minor: number; // 10% increase
    moderate: number; // 25% increase
    major: number; // 50% increase
    critical: number; // 100% increase
  };
  minSampleSize: number;
  baselineUpdateInterval: number; // ms
  alertCooldown: number; // ms
  autoMitigationEnabled: boolean;
  crisisUserProtection: boolean;
}

interface ComponentPerformanceHistory {
  componentId: string;
  metrics: Map<string, number[]>; // metric -> values array
  timestamps: number[];
  deviceContext: string[];
  networkContext: string[];
}

export class PerformanceRegressionDetector {
  private baselines: Map<string, PerformanceBaseline> = new Map();
  private performanceHistory: Map<string, ComponentPerformanceHistory> = new Map();
  private activeAlerts: Map<string, RegressionAlert> = new Map();
  private alertHistory: RegressionAlert[] = [];
  private isMonitoring = false;
  
  private config: RegressionConfig = {
    detectionThresholds: {
      minor: 10,
      moderate: 25,
      major: 50,
      critical: 100
    },
    minSampleSize: 20,
    baselineUpdateInterval: 24 * 60 * 60 * 1000, // 24 hours
    alertCooldown: 5 * 60 * 1000, // 5 minutes
    autoMitigationEnabled: true,
    crisisUserProtection: true
  };

  private lastBaselineUpdate = 0;
  private mitigationStrategies: Map<string, (() => void)[]> = new Map();

  constructor() {
    this.initializeRegressionDetection();
    this.setupMitigationStrategies();
  }

  /**
   * Initialize performance regression detection
   */
  private initializeRegressionDetection(): void {
    if (typeof window === 'undefined') return;

    this.isMonitoring = true;
    
    // Load existing baselines from storage
    this.loadBaselinesFromStorage();
    
    // Start periodic baseline updates
    this.startBaselineUpdates();
    
    // Setup real-time monitoring
    this.setupRealTimeMonitoring();

    console.log('🔍 Performance regression detection initialized', {
      thresholds: this.config.detectionThresholds,
      autoMitigation: this.config.autoMitigationEnabled
    });
  }

  /**
   * Setup mitigation strategies for different components
   */
  private setupMitigationStrategies(): void {
    // Analytics dashboard mitigations
    this.mitigationStrategies.set('analytics_dashboard', [
      () => this.reduceChartComplexity(),
      () => this.enableDataVirtualization(),
      () => this.deferNonCriticalAnalytics()
    ]);

    // Badge system mitigations
    this.mitigationStrategies.set('badge_system', [
      () => this.disableBadgeAnimations(),
      () => this.simplifyBadgeRendering(),
      () => this.deferBadgeCalculations()
    ]);

    // Wellness analytics mitigations
    this.mitigationStrategies.set('wellness_analytics', [
      () => this.reduceVisualizationQuality(),
      () => this.enableProgressivLoading(),
      () => this.cachePreviousCalculations()
    ]);

    // Crisis resources mitigations (highest priority)
    this.mitigationStrategies.set('crisis_resources', [
      () => this.prioritizeCrisisContent(),
      () => this.disableNonEssentialFeatures(),
      () => this.enableEmergencyMode()
    ]);
  }

  /**
   * Record performance measurement for regression detection
   */
  public recordPerformanceMeasurement(
    componentId: string,
    metric: string,
    value: number,
    context: {
      deviceTier?: string;
      networkQuality?: string;
      isVulnerableUser?: boolean;
    } = {}
  ): void {
    if (!this.isMonitoring) return;

    const deviceTier = context.deviceTier || mobilePerformanceMonitor.getDeviceTier();
    const networkQuality = context.networkQuality || this.getNetworkQuality();
    const timestamp = Date.now();

    // Store in performance history
    this.updatePerformanceHistory(componentId, metric, value, deviceTier, networkQuality, timestamp);

    // Check for regression against baseline
    this.checkForRegression(componentId, metric, value, deviceTier, networkQuality, context.isVulnerableUser);

    // Update baselines if enough time has passed
    if (timestamp - this.lastBaselineUpdate > this.config.baselineUpdateInterval) {
      this.updateBaselines();
    }
  }

  /**
   * Update performance history for a component
   */
  private updatePerformanceHistory(
    componentId: string,
    metric: string,
    value: number,
    deviceTier: string,
    networkQuality: string,
    timestamp: number
  ): void {
    if (!this.performanceHistory.has(componentId)) {
      this.performanceHistory.set(componentId, {
        componentId,
        metrics: new Map(),
        timestamps: [],
        deviceContext: [],
        networkContext: []
      });
    }

    const history = this.performanceHistory.get(componentId)!;
    
    // Add metric value
    if (!history.metrics.has(metric)) {
      history.metrics.set(metric, []);
    }
    history.metrics.get(metric)!.push(value);

    // Add context
    history.timestamps.push(timestamp);
    history.deviceContext.push(deviceTier);
    history.networkContext.push(networkQuality);

    // Keep history manageable (last 1000 measurements)
    const maxHistorySize = 1000;
    if (history.timestamps.length > maxHistorySize) {
      const removeCount = history.timestamps.length - maxHistorySize;
      
      history.timestamps.splice(0, removeCount);
      history.deviceContext.splice(0, removeCount);
      history.networkContext.splice(0, removeCount);
      
      history.metrics.forEach((values) => {
        values.splice(0, removeCount);
      });
    }
  }

  /**
   * Check for performance regression
   */
  private checkForRegression(
    componentId: string,
    metric: string,
    currentValue: number,
    deviceTier: string,
    networkQuality: string,
    isVulnerableUser?: boolean
  ): void {
    const baselineKey = this.getBaselineKey(componentId, metric, deviceTier, networkQuality);
    const baseline = this.baselines.get(baselineKey);

    if (!baseline || baseline.confidence === 'low') {
      return; // Need more data for reliable detection
    }

    // Calculate regression percentage
    const baselineValue = baseline.values.median;
    const percentageIncrease = ((currentValue - baselineValue) / baselineValue) * 100;

    // Determine severity
    let severity: RegressionAlert['severity'] = 'minor';
    if (percentageIncrease >= this.config.detectionThresholds.critical) {
      severity = 'critical';
    } else if (percentageIncrease >= this.config.detectionThresholds.major) {
      severity = 'major';
    } else if (percentageIncrease >= this.config.detectionThresholds.moderate) {
      severity = 'moderate';
    } else if (percentageIncrease >= this.config.detectionThresholds.minor) {
      severity = 'minor';
    } else {
      return; // No regression detected
    }

    // Check alert cooldown
    const alertKey = `${componentId}_${metric}_${deviceTier}_${networkQuality}`;
    const existingAlert = this.activeAlerts.get(alertKey);
    if (existingAlert && Date.now() - existingAlert.detectedAt < this.config.alertCooldown) {
      return; // Still in cooldown period
    }

    // Determine impact level
    let impactLevel: RegressionAlert['impactLevel'] = 'low';
    if (isVulnerableUser || componentId.includes('crisis')) {
      impactLevel = severity === 'critical' ? 'crisis' : 'high';
    } else if (['ultra-low', 'low'].includes(deviceTier)) {
      impactLevel = severity === 'critical' ? 'high' : 'medium';
    } else {
      impactLevel = severity === 'critical' ? 'medium' : 'low';
    }

    // Create regression alert
    const alert = this.createRegressionAlert(
      componentId,
      metric,
      severity,
      currentValue,
      baselineValue,
      percentageIncrease,
      impactLevel,
      deviceTier,
      networkQuality,
      isVulnerableUser || false
    );

    // Store alert
    this.activeAlerts.set(alertKey, alert);
    this.alertHistory.push(alert);

    // Apply auto-mitigation if enabled
    if (this.config.autoMitigationEnabled && (severity === 'major' || severity === 'critical')) {
      this.applyAutoMitigation(componentId, alert);
    }

    // Log critical regressions
    if (severity === 'critical' || impactLevel === 'crisis') {
      console.error('🚨 Critical performance regression detected:', alert);
    } else {
      console.warn('⚠️ Performance regression detected:', alert);
    }
  }

  /**
   * Create regression alert object
   */
  private createRegressionAlert(
    componentId: string,
    metric: string,
    severity: RegressionAlert['severity'],
    currentValue: number,
    baselineValue: number,
    percentageIncrease: number,
    impactLevel: RegressionAlert['impactLevel'],
    deviceTier: string,
    networkQuality: string,
    isVulnerableUser: boolean
  ): RegressionAlert {
    return {
      id: `regression_${componentId}_${metric}_${Date.now()}`,
      metric,
      component: componentId,
      severity,
      currentValue,
      baselineValue,
      percentageIncrease,
      impactLevel,
      affectedUsers: {
        deviceTiers: [deviceTier],
        networkQualities: [networkQuality],
        vulnerableUsers: isVulnerableUser
      },
      detectedAt: Date.now(),
      trend: this.calculateTrend(componentId, metric),
      recommendedActions: this.generateRecommendations(componentId, metric, severity),
      autoMitigationApplied: false
    };
  }

  /**
   * Calculate performance trend for component/metric
   */
  private calculateTrend(componentId: string, metric: string): RegressionAlert['trend'] {
    const history = this.performanceHistory.get(componentId);
    if (!history || !history.metrics.has(metric)) {
      return 'stable';
    }

    const values = history.metrics.get(metric)!;
    if (values.length < 10) {
      return 'stable';
    }

    // Compare recent values to older values
    const recentValues = values.slice(-5);
    const olderValues = values.slice(-15, -10);

    const recentAvg = recentValues.reduce((sum, v) => sum + v, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((sum, v) => sum + v, 0) / olderValues.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 20) return 'critical';
    if (change > 10) return 'degrading';
    if (change < -10) return 'improving';
    return 'stable';
  }

  /**
   * Generate recommendations for regression
   */
  private generateRecommendations(
    componentId: string,
    metric: string,
    severity: RegressionAlert['severity']
  ): string[] {
    const recommendations: string[] = [];

    // General recommendations
    if (metric.includes('memory')) {
      recommendations.push('Check for memory leaks');
      recommendations.push('Optimize data structures');
      recommendations.push('Implement data cleanup');
    }

    if (metric.includes('execution') || metric.includes('time')) {
      recommendations.push('Profile JavaScript execution');
      recommendations.push('Consider code splitting');
      recommendations.push('Optimize critical path');
    }

    if (metric.includes('network')) {
      recommendations.push('Optimize request batching');
      recommendations.push('Enable compression');
      recommendations.push('Reduce payload size');
    }

    // Component-specific recommendations
    if (componentId.includes('analytics')) {
      recommendations.push('Implement data virtualization');
      recommendations.push('Reduce chart complexity');
      recommendations.push('Cache calculated metrics');
    }

    if (componentId.includes('badge')) {
      recommendations.push('Simplify badge animations');
      recommendations.push('Defer badge calculations');
      recommendations.push('Optimize badge rendering');
    }

    // Severity-based recommendations
    if (severity === 'critical') {
      recommendations.push('Consider emergency performance mode');
      recommendations.push('Disable non-essential features');
    }

    return recommendations;
  }

  /**
   * Apply automatic mitigation for performance regression
   */
  private applyAutoMitigation(componentId: string, alert: RegressionAlert): void {
    const strategies = this.mitigationStrategies.get(componentId) || [];
    
    if (strategies.length === 0) {
      console.warn(`No mitigation strategies available for ${componentId}`);
      return;
    }

    console.log(`🔧 Applying auto-mitigation for ${componentId}`, {
      severity: alert.severity,
      strategies: strategies.length
    });

    // Apply mitigation strategies based on severity
    let strategiesToApply = 1;
    if (alert.severity === 'critical' || alert.impactLevel === 'crisis') {
      strategiesToApply = strategies.length; // Apply all strategies
    } else if (alert.severity === 'major') {
      strategiesToApply = Math.min(2, strategies.length);
    }

    for (let i = 0; i < strategiesToApply; i++) {
      try {
        strategies[i]();
      } catch (error) {
        console.error(`Failed to apply mitigation strategy ${i} for ${componentId}:`, error);
      }
    }

    // Mark as mitigated
    alert.autoMitigationApplied = true;
    this.activeAlerts.set(`${componentId}_${alert.metric}`, alert);
  }

  /**
   * Update performance baselines
   */
  private updateBaselines(): void {
    this.lastBaselineUpdate = Date.now();

    this.performanceHistory.forEach((history, componentId) => {
      history.metrics.forEach((values, metric) => {
        if (values.length < this.config.minSampleSize) {
          return; // Not enough data for reliable baseline
        }

        // Group by device tier and network quality
        const groups = this.groupMeasurementsByContext(history, metric);
        
        groups.forEach((groupValues, context) => {
          if (groupValues.length >= this.config.minSampleSize) {
            const baseline = this.calculateBaseline(componentId, metric, context, groupValues);
            const baselineKey = `${componentId}_${metric}_${context}`;
            this.baselines.set(baselineKey, baseline);
          }
        });
      });
    });

    // Save baselines to storage
    this.saveBaselinesToStorage();

    console.log(`📊 Updated ${this.baselines.size} performance baselines`);
  }

  /**
   * Group measurements by device and network context
   */
  private groupMeasurementsByContext(
    history: ComponentPerformanceHistory,
    metric: string
  ): Map<string, number[]> {
    const groups = new Map<string, number[]>();
    const values = history.metrics.get(metric)!;

    values.forEach((value, index) => {
      const deviceTier = history.deviceContext[index];
      const networkQuality = history.networkContext[index];
      const context = `${deviceTier}_${networkQuality}`;

      if (!groups.has(context)) {
        groups.set(context, []);
      }
      groups.get(context)!.push(value);
    });

    return groups;
  }

  /**
   * Calculate baseline statistics
   */
  private calculateBaseline(
    componentId: string,
    metric: string,
    context: string,
    values: number[]
  ): PerformanceBaseline {
    const sortedValues = [...values].sort((a, b) => a - b);
    const length = sortedValues.length;

    const mean = values.reduce((sum, v) => sum + v, 0) / length;
    const median = length % 2 === 0 
      ? (sortedValues[length / 2 - 1] + sortedValues[length / 2]) / 2
      : sortedValues[Math.floor(length / 2)];
    
    const p95Index = Math.floor(length * 0.95);
    const p99Index = Math.floor(length * 0.99);
    const p95 = sortedValues[p95Index];
    const p99 = sortedValues[p99Index];

    // Calculate standard deviation
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / length;
    const standardDeviation = Math.sqrt(variance);

    // Determine confidence level
    let confidence: PerformanceBaseline['confidence'] = 'high';
    if (length < this.config.minSampleSize * 2) {
      confidence = 'medium';
    }
    if (length < this.config.minSampleSize) {
      confidence = 'low';
    }

    const [deviceTier, networkQuality] = context.split('_');

    return {
      metric,
      component: componentId,
      deviceTier,
      networkQuality,
      values: {
        mean,
        median,
        p95,
        p99,
        standardDeviation
      },
      sampleSize: length,
      lastUpdated: Date.now(),
      confidence
    };
  }

  /**
   * Get baseline key for lookup
   */
  private getBaselineKey(componentId: string, metric: string, deviceTier: string, networkQuality: string): string {
    return `${componentId}_${metric}_${deviceTier}_${networkQuality}`;
  }

  /**
   * Get network quality
   */
  private getNetworkQuality(): string {
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType || 'unknown';
    const rtt = connection.rtt || 0;

    if (rtt > 1000 || effectiveType === 'slow-2g') return 'critical';
    if (rtt > 500 || effectiveType === '2g') return 'poor';
    if (rtt > 200 || effectiveType === '3g') return 'good';
    return 'excellent';
  }

  /**
   * Start periodic baseline updates
   */
  private startBaselineUpdates(): void {
    setInterval(() => {
      this.updateBaselines();
    }, this.config.baselineUpdateInterval);
  }

  /**
   * Setup real-time monitoring integration
   */
  private setupRealTimeMonitoring(): void {
    // Monitor guided experience vitals
    const originalCompleteMonitoring = guidedExperienceVitals.completeExperienceMonitoring.bind(guidedExperienceVitals);
    guidedExperienceVitals.completeExperienceMonitoring = () => {
      const result = originalCompleteMonitoring();
      if (result) {
        this.processGuidedExperienceData(result);
      }
      return result;
    };
  }

  /**
   * Process guided experience data for regression detection
   */
  private processGuidedExperienceData(experience: any): void {
    const componentId = `guided_${experience.experienceType}`;
    
    Object.entries(experience.metrics).forEach(([metric, value]) => {
      if (value !== null) {
        this.recordPerformanceMeasurement(
          componentId,
          metric,
          value as number,
          {
            deviceTier: experience.userContext.deviceTier,
            networkQuality: experience.userContext.networkQuality,
            isVulnerableUser: experience.userContext.isVulnerable
          }
        );
      }
    });
  }

  /**
   * Load baselines from local storage
   */
  private loadBaselinesFromStorage(): void {
    try {
      const stored = localStorage.getItem('alchm_performance_baselines');
      if (stored) {
        const data = JSON.parse(stored);
        this.baselines = new Map(data.baselines);
        this.lastBaselineUpdate = data.lastUpdate || 0;
      }
    } catch (error) {
      console.warn('Failed to load performance baselines:', error);
    }
  }

  /**
   * Save baselines to local storage
   */
  private saveBaselinesToStorage(): void {
    try {
      const data = {
        baselines: Array.from(this.baselines.entries()),
        lastUpdate: this.lastBaselineUpdate
      };
      localStorage.setItem('alchm_performance_baselines', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save performance baselines:', error);
    }
  }

  // Mitigation strategy implementations
  private reduceChartComplexity(): void {
    const style = document.createElement('style');
    style.textContent = `
      .analytics-chart { 
        --chart-quality: low;
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  private enableDataVirtualization(): void {
    document.body.classList.add('data-virtualization-enabled');
  }

  private deferNonCriticalAnalytics(): void {
    const nonCriticalElements = document.querySelectorAll('.analytics-secondary');
    nonCriticalElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  private disableBadgeAnimations(): void {
    const style = document.createElement('style');
    style.textContent = `
      .badge-animation { animation: none !important; }
    `;
    document.head.appendChild(style);
  }

  private simplifyBadgeRendering(): void {
    document.body.classList.add('simplified-badges');
  }

  private deferBadgeCalculations(): void {
    // Implementation would defer badge progress calculations
    console.log('Badge calculations deferred for performance');
  }

  private reduceVisualizationQuality(): void {
    document.body.classList.add('reduced-viz-quality');
  }

  private enableProgressivLoading(): void {
    document.body.classList.add('progressive-loading');
  }

  private cachePreviousCalculations(): void {
    // Implementation would enable aggressive caching
    console.log('Aggressive caching enabled for performance');
  }

  private prioritizeCrisisContent(): void {
    const crisisElements = document.querySelectorAll('[data-crisis]');
    crisisElements.forEach(el => {
      (el as HTMLElement).style.zIndex = '9999';
    });
  }

  private disableNonEssentialFeatures(): void {
    const nonEssential = document.querySelectorAll('.non-essential');
    nonEssential.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
  }

  private enableEmergencyMode(): void {
    document.body.classList.add('emergency-performance-mode');
  }

  /**
   * Get current regression status
   */
  public getRegressionStatus(): {
    activeAlerts: RegressionAlert[];
    alertHistory: RegressionAlert[];
    baselines: number;
    monitoring: boolean;
  } {
    return {
      activeAlerts: Array.from(this.activeAlerts.values()),
      alertHistory: [...this.alertHistory],
      baselines: this.baselines.size,
      monitoring: this.isMonitoring
    };
  }

  /**
   * Clear specific alert
   */
  public clearAlert(alertId: string): void {
    const alert = Array.from(this.activeAlerts.values()).find(a => a.id === alertId);
    if (alert) {
      const key = `${alert.component}_${alert.metric}`;
      this.activeAlerts.delete(key);
    }
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.isMonitoring = false;
    this.saveBaselinesToStorage();
    
    // Remove mitigation styles
    const mitigationStyles = document.querySelectorAll('style[data-mitigation]');
    mitigationStyles.forEach(style => style.remove());
    
    // Remove mitigation classes
    document.body.classList.remove(
      'data-virtualization-enabled',
      'simplified-badges',
      'reduced-viz-quality',
      'progressive-loading',
      'emergency-performance-mode'
    );
  }
}

// Global regression detector
export const performanceRegressionDetector = new PerformanceRegressionDetector();

// React hook for regression monitoring
export const usePerformanceRegression = () => {
  return {
    recordMeasurement: (componentId: string, metric: string, value: number, context?: any) =>
      performanceRegressionDetector.recordPerformanceMeasurement(componentId, metric, value, context),
    
    getStatus: () => performanceRegressionDetector.getRegressionStatus(),
    
    clearAlert: (alertId: string) => performanceRegressionDetector.clearAlert(alertId),
    
    isMonitoring: () => performanceRegressionDetector.getRegressionStatus().monitoring
  };
};

export default performanceRegressionDetector;