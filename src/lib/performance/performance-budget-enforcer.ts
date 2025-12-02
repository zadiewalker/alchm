/**
 * ALCHM Performance Budget Enforcer
 * 
 * Enforces strict performance budgets to ensure trauma-informed
 * performance standards are maintained across all deployments.
 */

interface PerformanceBudget {
  id: string;
  name: string;
  metric: 'bundle_size' | 'load_time' | 'memory_usage' | 'network_requests' | 'image_size';
  limit: number;
  unit: 'bytes' | 'ms' | 'count' | 'percentage';
  scope: 'page' | 'component' | 'resource' | 'global';
  priority: 'critical' | 'high' | 'medium' | 'low';
  isCrisisRelated: boolean;
  warningThreshold: number; // Percentage of limit (e.g., 80 = 80% of limit)
  isActive: boolean;
}

interface BudgetViolation {
  id: string;
  budgetId: string;
  budgetName: string;
  currentValue: number;
  budgetLimit: number;
  violationPercentage: number;
  severity: 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  timestamp: number;
  url: string;
  context: string;
  isCrisisContext: boolean;
  impact: 'user_experience' | 'accessibility' | 'crisis_safety' | 'performance';
  remediation: string[];
}

interface BudgetReport {
  totalBudgets: number;
  activeBudgets: number;
  violations: BudgetViolation[];
  complianceRate: number;
  criticalViolations: number;
  crisisImpactingViolations: number;
  recommendations: BudgetRecommendation[];
}

interface BudgetRecommendation {
  type: 'optimize' | 'reduce' | 'defer' | 'remove';
  priority: 'immediate' | 'high' | 'medium' | 'low';
  description: string;
  estimatedImpact: number; // Percentage improvement
  implementation: string;
}

interface ResourceAnalysis {
  url: string;
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'other';
  size: number;
  loadTime: number;
  isCritical: boolean;
  isCrisisRelated: boolean;
  compressionRatio?: number;
  cacheability: 'cacheable' | 'non_cacheable' | 'unknown';
}

class PerformanceBudgetEnforcer {
  private budgets: Map<string, PerformanceBudget> = new Map();
  private violations: BudgetViolation[] = [];
  private resourceAnalyses: ResourceAnalysis[] = [];
  private violationCallbacks: ((violation: BudgetViolation) => void)[] = [];
  private monitoringActive = false;
  private checkInterval: number | null = null;

  constructor() {
    this.initializeDefaultBudgets();
    this.startMonitoring();
  }

  private initializeDefaultBudgets(): void {
    // Crisis-critical budgets (stricter limits)
    this.addBudget({
      id: 'crisis_page_bundle',
      name: 'Crisis Page JavaScript Bundle',
      metric: 'bundle_size',
      limit: 150 * 1024, // 150KB for crisis pages
      unit: 'bytes',
      scope: 'page',
      priority: 'critical',
      isCrisisRelated: true,
      warningThreshold: 80,
      isActive: true
    });

    this.addBudget({
      id: 'crisis_page_load_time',
      name: 'Crisis Page Load Time',
      metric: 'load_time',
      limit: 2000, // 2 seconds max
      unit: 'ms',
      scope: 'page',
      priority: 'critical',
      isCrisisRelated: true,
      warningThreshold: 75,
      isActive: true
    });

    this.addBudget({
      id: 'emergency_button_response',
      name: 'Emergency Button Response',
      metric: 'load_time',
      limit: 100, // 100ms max
      unit: 'ms',
      scope: 'component',
      priority: 'critical',
      isCrisisRelated: true,
      warningThreshold: 70,
      isActive: true
    });

    // General app budgets
    this.addBudget({
      id: 'main_bundle_size',
      name: 'Main JavaScript Bundle',
      metric: 'bundle_size',
      limit: 250 * 1024, // 250KB
      unit: 'bytes',
      scope: 'page',
      priority: 'high',
      isCrisisRelated: false,
      warningThreshold: 85,
      isActive: true
    });

    this.addBudget({
      id: 'page_load_time',
      name: 'Page Load Time',
      metric: 'load_time',
      limit: 4000, // 4 seconds
      unit: 'ms',
      scope: 'page',
      priority: 'high',
      isCrisisRelated: false,
      warningThreshold: 80,
      isActive: true
    });

    this.addBudget({
      id: 'total_page_weight',
      name: 'Total Page Weight',
      metric: 'bundle_size',
      limit: 1024 * 1024, // 1MB total
      unit: 'bytes',
      scope: 'page',
      priority: 'medium',
      isCrisisRelated: false,
      warningThreshold: 85,
      isActive: true
    });

    this.addBudget({
      id: 'image_optimization',
      name: 'Individual Image Size',
      metric: 'image_size',
      limit: 200 * 1024, // 200KB per image
      unit: 'bytes',
      scope: 'resource',
      priority: 'medium',
      isCrisisRelated: false,
      warningThreshold: 90,
      isActive: true
    });

    this.addBudget({
      id: 'network_requests',
      name: 'Total Network Requests',
      metric: 'network_requests',
      limit: 50, // 50 requests max
      unit: 'count',
      scope: 'page',
      priority: 'medium',
      isCrisisRelated: false,
      warningThreshold: 80,
      isActive: true
    });

    this.addBudget({
      id: 'memory_usage_critical',
      name: 'Memory Usage (Crisis Pages)',
      metric: 'memory_usage',
      limit: 100 * 1024 * 1024, // 100MB
      unit: 'bytes',
      scope: 'page',
      priority: 'critical',
      isCrisisRelated: true,
      warningThreshold: 75,
      isActive: true
    });

    this.addBudget({
      id: 'memory_usage_general',
      name: 'Memory Usage (General)',
      metric: 'memory_usage',
      limit: 150 * 1024 * 1024, // 150MB
      unit: 'bytes',
      scope: 'page',
      priority: 'high',
      isCrisisRelated: false,
      warningThreshold: 80,
      isActive: true
    });

    console.log(`[BUDGET ENFORCER] Initialized ${this.budgets.size} performance budgets`);
  }

  private startMonitoring(): void {
    if (this.monitoringActive || typeof window === 'undefined') return;

    this.setupResourceMonitoring();
    this.setupMemoryMonitoring();
    this.setupLoadTimeMonitoring();
    this.setupNetworkRequestMonitoring();

    // Check budgets every 30 seconds
    this.checkInterval = window.setInterval(() => {
      this.checkAllBudgets();
    }, 30000);

    this.monitoringActive = true;
    console.log('[BUDGET ENFORCER] Monitoring started');
  }

  private setupResourceMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      
      entries.forEach((entry) => {
        const analysis = this.analyzeResource(entry);
        this.resourceAnalyses.push(analysis);
        
        // Check resource-specific budgets
        this.checkResourceBudgets(analysis);
      });
      
      // Keep only last 100 analyses
      if (this.resourceAnalyses.length > 100) {
        this.resourceAnalyses = this.resourceAnalyses.slice(-100);
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private analyzeResource(entry: PerformanceResourceTiming): ResourceAnalysis {
    const url = entry.name;
    const size = entry.transferSize || entry.decodedBodySize || 0;
    const loadTime = entry.responseEnd - entry.startTime;
    
    let type: ResourceAnalysis['type'] = 'other';
    if (url.endsWith('.js')) type = 'script';
    else if (url.endsWith('.css')) type = 'stylesheet';
    else if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) type = 'image';
    else if (url.match(/\.(woff|woff2|ttf|eot)$/)) type = 'font';

    const isCrisisRelated = this.isCrisisResource(url);
    const isCritical = isCrisisRelated || this.isCriticalResource(url);

    return {
      url,
      type,
      size,
      loadTime,
      isCritical,
      isCrisisRelated,
      compressionRatio: this.calculateCompressionRatio(entry),
      cacheability: this.determineCacheability(entry)
    };
  }

  private calculateCompressionRatio(entry: PerformanceResourceTiming): number | undefined {
    if (entry.decodedBodySize && entry.transferSize) {
      return entry.transferSize / entry.decodedBodySize;
    }
    return undefined;
  }

  private determineCacheability(entry: PerformanceResourceTiming): ResourceAnalysis['cacheability'] {
    // This would analyze cache headers in a real implementation
    // For now, we'll use simple heuristics
    if (entry.name.includes('?v=') || entry.name.includes('?_=')) {
      return 'non_cacheable';
    }
    return 'cacheable';
  }

  private setupMemoryMonitoring(): void {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memoryInfo = (performance as any).memory;
      const currentUsage = memoryInfo.usedJSHeapSize;
      
      const isCrisisPage = this.isCrisisPage();
      const budgetId = isCrisisPage ? 'memory_usage_critical' : 'memory_usage_general';
      
      this.checkBudget(budgetId, currentUsage);
    };

    setInterval(checkMemory, 15000); // Check every 15 seconds
  }

  private setupLoadTimeMonitoring(): void {
    const checkLoadTime = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        
        const isCrisisPage = this.isCrisisPage();
        const budgetId = isCrisisPage ? 'crisis_page_load_time' : 'page_load_time';
        
        this.checkBudget(budgetId, loadTime);
      }
    };

    // Check load time on page load and navigation
    if (document.readyState === 'complete') {
      checkLoadTime();
    } else {
      window.addEventListener('load', checkLoadTime);
    }
  }

  private setupNetworkRequestMonitoring(): void {
    const observer = new PerformanceObserver((list) => {
      const networkRequests = list.getEntries().length;
      this.checkBudget('network_requests', networkRequests);
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('[BUDGET ENFORCER] Network monitoring not supported');
    }
  }

  private checkAllBudgets(): void {
    // Check bundle sizes
    this.checkBundleSizes();
    
    // Check page weight
    this.checkPageWeight();
    
    // Check image optimization
    this.checkImageOptimization();
  }

  private checkBundleSizes(): void {
    const scriptResources = this.resourceAnalyses.filter(r => r.type === 'script');
    
    scriptResources.forEach(resource => {
      const isCrisisRelated = resource.isCrisisRelated;
      const budgetId = isCrisisRelated ? 'crisis_page_bundle' : 'main_bundle_size';
      
      this.checkBudget(budgetId, resource.size);
    });
  }

  private checkPageWeight(): void {
    const totalSize = this.resourceAnalyses.reduce((sum, r) => sum + r.size, 0);
    this.checkBudget('total_page_weight', totalSize);
  }

  private checkImageOptimization(): void {
    const imageResources = this.resourceAnalyses.filter(r => r.type === 'image');
    
    imageResources.forEach(resource => {
      this.checkBudget('image_optimization', resource.size);
    });
  }

  private checkBudget(budgetId: string, currentValue: number): void {
    const budget = this.budgets.get(budgetId);
    if (!budget || !budget.isActive) return;

    const violationPercentage = (currentValue / budget.limit) * 100;
    
    if (violationPercentage >= 100) {
      this.createViolation(budget, currentValue, 'CRITICAL');
    } else if (violationPercentage >= budget.warningThreshold) {
      this.createViolation(budget, currentValue, 'WARNING');
    }
  }

  private checkResourceBudgets(resource: ResourceAnalysis): void {
    // Check emergency button response time
    if (this.isEmergencyButton(resource.url)) {
      this.checkBudget('emergency_button_response', resource.loadTime);
    }
    
    // Check image size budget
    if (resource.type === 'image') {
      this.checkBudget('image_optimization', resource.size);
    }
  }

  private createViolation(
    budget: PerformanceBudget, 
    currentValue: number, 
    severity: BudgetViolation['severity']
  ): void {
    const violationId = this.generateViolationId();
    const violationPercentage = (currentValue / budget.limit) * 100;
    
    // Upgrade severity for crisis-related violations
    if (budget.isCrisisRelated && severity === 'CRITICAL') {
      severity = 'EMERGENCY';
    }

    const violation: BudgetViolation = {
      id: violationId,
      budgetId: budget.id,
      budgetName: budget.name,
      currentValue,
      budgetLimit: budget.limit,
      violationPercentage,
      severity,
      timestamp: Date.now(),
      url: window.location.href,
      context: this.getCurrentContext(),
      isCrisisContext: this.isCrisisPage(),
      impact: this.determineImpact(budget),
      remediation: this.generateRemediation(budget, currentValue)
    };

    this.violations.push(violation);
    
    // Keep only last 50 violations
    if (this.violations.length > 50) {
      this.violations = this.violations.slice(-50);
    }

    // Log violation
    const emoji = severity === 'EMERGENCY' ? '🚨' : severity === 'CRITICAL' ? '🔴' : '⚠️';
    console.warn(
      `${emoji} [BUDGET VIOLATION] ${budget.name}: ${currentValue}${budget.unit} exceeds limit of ${budget.limit}${budget.unit} (${violationPercentage.toFixed(1)}%)`
    );

    // Notify callbacks
    this.violationCallbacks.forEach(callback => {
      try {
        callback(violation);
      } catch (error) {
        console.error('[BUDGET ENFORCER] Callback error:', error);
      }
    });

    // Send to monitoring
    this.sendViolationAlert(violation);

    // Take immediate action for emergency violations
    if (severity === 'EMERGENCY') {
      this.handleEmergencyViolation(violation);
    }
  }

  private determineImpact(budget: PerformanceBudget): BudgetViolation['impact'] {
    if (budget.isCrisisRelated) return 'crisis_safety';
    if (budget.priority === 'critical') return 'accessibility';
    if (budget.metric === 'load_time') return 'user_experience';
    return 'performance';
  }

  private generateRemediation(budget: PerformanceBudget, currentValue: number): string[] {
    const remediation: string[] = [];
    const overage = currentValue - budget.limit;
    
    switch (budget.metric) {
      case 'bundle_size':
        remediation.push('Enable code splitting and dynamic imports');
        remediation.push('Remove unused dependencies and dead code');
        remediation.push('Implement tree shaking optimization');
        if (budget.isCrisisRelated) {
          remediation.push('Defer non-critical crisis features');
        }
        break;
        
      case 'load_time':
        remediation.push('Optimize critical rendering path');
        remediation.push('Implement resource preloading');
        remediation.push('Enable CDN and caching optimizations');
        if (budget.isCrisisRelated) {
          remediation.push('URGENT: Implement emergency fallbacks');
        }
        break;
        
      case 'image_size':
        remediation.push('Implement WebP/AVIF image formats');
        remediation.push('Add responsive image sizing');
        remediation.push('Enable image compression and optimization');
        break;
        
      case 'memory_usage':
        remediation.push('Implement memory leak detection');
        remediation.push('Clear unused caches and references');
        remediation.push('Optimize component lifecycle management');
        break;
        
      case 'network_requests':
        remediation.push('Bundle resources to reduce requests');
        remediation.push('Implement resource concatenation');
        remediation.push('Remove duplicate or unnecessary requests');
        break;
    }
    
    return remediation;
  }

  private handleEmergencyViolation(violation: BudgetViolation): void {
    console.error('🚨 [EMERGENCY VIOLATION] Taking immediate action:', violation);
    
    // Trigger emergency performance mode
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('performance-emergency', {
        detail: { violation }
      });
      window.dispatchEvent(event);
    }
    
    // Could implement automatic rollback or degradation here
  }

  private async sendViolationAlert(violation: BudgetViolation): Promise<void> {
    try {
      await fetch('/api/performance/budget-violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation),
        keepalive: true
      });
    } catch (error) {
      console.error('[BUDGET ENFORCER] Failed to send violation alert:', error);
    }
  }

  private generateViolationId(): string {
    return `violation-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  private getCurrentContext(): string {
    const url = window.location.pathname;
    if (url.includes('crisis')) return 'crisis';
    if (url.includes('auth')) return 'authentication';
    if (url.includes('journal')) return 'journaling';
    if (url.includes('dashboard')) return 'dashboard';
    return 'general';
  }

  private isCrisisPage(): boolean {
    const url = window.location.href.toLowerCase();
    return url.includes('crisis') || 
           url.includes('emergency') || 
           url.includes('support');
  }

  private isCrisisResource(url: string): boolean {
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support'];
    return crisisKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private isCriticalResource(url: string): boolean {
    const criticalKeywords = ['main', 'app', 'vendor', 'critical'];
    return criticalKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private isEmergencyButton(url: string): boolean {
    return url.includes('emergency') || url.includes('crisis-button');
  }

  // Public API
  public addBudget(budget: PerformanceBudget): void {
    this.budgets.set(budget.id, budget);
    console.log(`[BUDGET ENFORCER] Added budget: ${budget.name}`);
  }

  public removeBudget(budgetId: string): void {
    this.budgets.delete(budgetId);
    console.log(`[BUDGET ENFORCER] Removed budget: ${budgetId}`);
  }

  public updateBudget(budgetId: string, updates: Partial<PerformanceBudget>): void {
    const budget = this.budgets.get(budgetId);
    if (budget) {
      Object.assign(budget, updates);
      console.log(`[BUDGET ENFORCER] Updated budget: ${budgetId}`);
    }
  }

  public getBudgets(): PerformanceBudget[] {
    return Array.from(this.budgets.values());
  }

  public getViolations(timeRange?: number): BudgetViolation[] {
    if (!timeRange) return [...this.violations];
    
    const cutoff = Date.now() - timeRange;
    return this.violations.filter(v => v.timestamp >= cutoff);
  }

  public getBudgetReport(): BudgetReport {
    const violations = this.getViolations();
    const criticalViolations = violations.filter(v => v.severity === 'CRITICAL' || v.severity === 'EMERGENCY');
    const crisisImpactingViolations = violations.filter(v => v.isCrisisContext);
    
    return {
      totalBudgets: this.budgets.size,
      activeBudgets: Array.from(this.budgets.values()).filter(b => b.isActive).length,
      violations,
      complianceRate: this.calculateComplianceRate(),
      criticalViolations: criticalViolations.length,
      crisisImpactingViolations: crisisImpactingViolations.length,
      recommendations: this.generateRecommendations()
    };
  }

  private calculateComplianceRate(): number {
    const activeBudgets = Array.from(this.budgets.values()).filter(b => b.isActive);
    if (activeBudgets.length === 0) return 100;
    
    const recentViolations = this.getViolations(3600000); // Last hour
    const violatedBudgets = new Set(recentViolations.map(v => v.budgetId));
    
    const compliantBudgets = activeBudgets.length - violatedBudgets.size;
    return (compliantBudgets / activeBudgets.length) * 100;
  }

  private generateRecommendations(): BudgetRecommendation[] {
    const recommendations: BudgetRecommendation[] = [];
    const recentViolations = this.getViolations(3600000);
    
    // Group violations by type
    const bundleViolations = recentViolations.filter(v => v.budgetName.includes('Bundle'));
    const loadTimeViolations = recentViolations.filter(v => v.budgetName.includes('Load Time'));
    const imageViolations = recentViolations.filter(v => v.budgetName.includes('Image'));
    
    if (bundleViolations.length > 0) {
      recommendations.push({
        type: 'optimize',
        priority: bundleViolations.some(v => v.isCrisisContext) ? 'immediate' : 'high',
        description: 'Implement code splitting and remove unused dependencies',
        estimatedImpact: 30,
        implementation: 'Use dynamic imports and webpack-bundle-analyzer'
      });
    }
    
    if (loadTimeViolations.length > 0) {
      recommendations.push({
        type: 'optimize',
        priority: loadTimeViolations.some(v => v.isCrisisContext) ? 'immediate' : 'high',
        description: 'Optimize critical rendering path and implement preloading',
        estimatedImpact: 25,
        implementation: 'Add resource hints and optimize CSS delivery'
      });
    }
    
    if (imageViolations.length > 0) {
      recommendations.push({
        type: 'optimize',
        priority: 'medium',
        description: 'Implement modern image formats and responsive sizing',
        estimatedImpact: 20,
        implementation: 'Use WebP/AVIF with picture element fallbacks'
      });
    }
    
    return recommendations;
  }

  public onViolation(callback: (violation: BudgetViolation) => void): () => void {
    this.violationCallbacks.push(callback);
    return () => {
      const index = this.violationCallbacks.indexOf(callback);
      if (index > -1) {
        this.violationCallbacks.splice(index, 1);
      }
    };
  }

  public enableBudget(budgetId: string): void {
    const budget = this.budgets.get(budgetId);
    if (budget) {
      budget.isActive = true;
      console.log(`[BUDGET ENFORCER] Enabled budget: ${budgetId}`);
    }
  }

  public disableBudget(budgetId: string): void {
    const budget = this.budgets.get(budgetId);
    if (budget) {
      budget.isActive = false;
      console.log(`[BUDGET ENFORCER] Disabled budget: ${budgetId}`);
    }
  }

  public getResourceAnalysis(): ResourceAnalysis[] {
    return [...this.resourceAnalyses];
  }

  public destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    this.violationCallbacks = [];
    this.monitoringActive = false;
    
    console.log('[BUDGET ENFORCER] Monitoring stopped');
  }
}

// Singleton instance
let budgetEnforcerInstance: PerformanceBudgetEnforcer | null = null;

export function getBudgetEnforcer(): PerformanceBudgetEnforcer {
  if (!budgetEnforcerInstance) {
    budgetEnforcerInstance = new PerformanceBudgetEnforcer();
  }
  return budgetEnforcerInstance;
}

export type {
  PerformanceBudget,
  BudgetViolation,
  BudgetReport,
  BudgetRecommendation,
  ResourceAnalysis
};

export default PerformanceBudgetEnforcer;