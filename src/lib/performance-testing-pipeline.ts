/**
 * Automated Performance Testing Pipeline for ALCHM
 * CI/CD Integration with regression prevention and quality gates
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface LighthouseResults {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  metrics: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    tti: number;
    tbt: number;
  };
}

export interface PerformanceTestConfig {
  urls: string[];
  device: 'mobile' | 'desktop';
  connection: 'slow-4g' | '4g' | 'fast-4g';
  iterations: number;
  thresholds: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    lcp: number;
    fid: number;
    cls: number;
  };
}

export interface PerformanceTestResult {
  url: string;
  device: string;
  connection: string;
  timestamp: number;
  lighthouse: LighthouseResults;
  passed: boolean;
  violations: Array<{
    metric: string;
    actual: number;
    threshold: number;
    severity: 'warning' | 'error' | 'critical';
  }>;
  recommendations: string[];
}

export interface RegressionAnalysis {
  hasRegression: boolean;
  regressions: Array<{
    metric: string;
    current: number;
    baseline: number;
    change: number;
    significance: 'minor' | 'major' | 'critical';
  }>;
  improvements: Array<{
    metric: string;
    current: number;
    baseline: number;
    improvement: number;
  }>;
}

// Crisis-optimized performance thresholds
const CRISIS_THRESHOLDS: PerformanceTestConfig['thresholds'] = {
  performance: 95,
  accessibility: 95,
  bestPractices: 90,
  seo: 90,
  lcp: 1200,  // Crisis pages must load fast
  fid: 50,    // Immediate response critical
  cls: 0.05   // No layout shifts for confused users
};

const CORE_THRESHOLDS: PerformanceTestConfig['thresholds'] = {
  performance: 90,
  accessibility: 95,
  bestPractices: 85,
  seo: 85,
  lcp: 2000,
  fid: 100,
  cls: 0.1
};

const SECONDARY_THRESHOLDS: PerformanceTestConfig['thresholds'] = {
  performance: 85,
  accessibility: 90,
  bestPractices: 80,
  seo: 80,
  lcp: 2500,
  fid: 300,
  cls: 0.25
};

export class PerformanceTestingPipeline {
  private baselineResults: Map<string, PerformanceTestResult> = new Map();
  private testHistory: PerformanceTestResult[] = [];

  constructor(private config: PerformanceTestConfig) {}

  /**
   * Run comprehensive performance test suite
   */
  async runTestSuite(): Promise<{
    results: PerformanceTestResult[];
    overall: {
      passed: boolean;
      score: number;
      criticalIssues: number;
    };
    regression: RegressionAnalysis;
  }> {
    console.log('🚀 Starting ALCHM Performance Test Suite...');
    
    const results: PerformanceTestResult[] = [];
    
    // Test each URL
    for (const url of this.config.urls) {
      const result = await this.testURL(url);
      results.push(result);
    }
    
    // Analyze for regressions
    const regression = await this.analyzeRegressions(results);
    
    // Calculate overall score
    const overall = this.calculateOverallScore(results);
    
    // Store results for future comparison
    await this.storeResults(results);
    
    return { results, overall, regression };
  }

  /**
   * Test individual URL with Lighthouse
   */
  private async testURL(url: string): Promise<PerformanceTestResult> {
    console.log(`📊 Testing ${url} on ${this.config.device} with ${this.config.connection}...`);
    
    const results: LighthouseResults[] = [];
    
    // Run multiple iterations for accuracy
    for (let i = 0; i < this.config.iterations; i++) {
      try {
        const result = await this.runLighthouse(url);
        results.push(result);
      } catch (error) {
        console.error(`Lighthouse test ${i + 1} failed for ${url}:`, error);
      }
    }
    
    if (results.length === 0) {
      throw new Error(`All Lighthouse tests failed for ${url}`);
    }
    
    // Average the results
    const lighthouse = this.averageResults(results);
    
    // Determine thresholds based on URL category
    const thresholds = this.getThresholdsForURL(url);
    
    // Check violations
    const violations = this.checkViolations(lighthouse, thresholds);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(lighthouse, violations);
    
    return {
      url,
      device: this.config.device,
      connection: this.config.connection,
      timestamp: Date.now(),
      lighthouse,
      passed: violations.filter(v => v.severity === 'critical' || v.severity === 'error').length === 0,
      violations,
      recommendations
    };
  }

  /**
   * Run Lighthouse test
   */
  private async runLighthouse(url: string): Promise<LighthouseResults> {
    const lighthouseCmd = [
      'npx lighthouse',
      `"${url}"`,
      '--only-categories=performance,accessibility,best-practices,seo,pwa',
      `--form-factor=${this.config.device}`,
      `--throttling.rttMs=${this.getConnectionRTT()}`,
      `--throttling.throughputKbps=${this.getConnectionThroughput()}`,
      '--output=json',
      '--quiet'
    ].join(' ');

    try {
      const { stdout } = await execAsync(lighthouseCmd);
      const report = JSON.parse(stdout);
      
      return this.extractLighthouseMetrics(report);
    } catch (error) {
      console.error('Lighthouse execution failed:', error);
      throw error;
    }
  }

  /**
   * Extract relevant metrics from Lighthouse report
   */
  private extractLighthouseMetrics(report: any): LighthouseResults {
    const categories = report.categories;
    const audits = report.audits;
    
    return {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
      pwa: categories.pwa ? Math.round(categories.pwa.score * 100) : 0,
      metrics: {
        lcp: audits['largest-contentful-paint']?.numericValue || 0,
        fid: audits['max-potential-fid']?.numericValue || 0,
        cls: audits['cumulative-layout-shift']?.numericValue || 0,
        fcp: audits['first-contentful-paint']?.numericValue || 0,
        tti: audits['interactive']?.numericValue || 0,
        tbt: audits['total-blocking-time']?.numericValue || 0
      }
    };
  }

  /**
   * Average multiple test results
   */
  private averageResults(results: LighthouseResults[]): LighthouseResults {
    const count = results.length;
    
    return {
      performance: Math.round(results.reduce((sum, r) => sum + r.performance, 0) / count),
      accessibility: Math.round(results.reduce((sum, r) => sum + r.accessibility, 0) / count),
      bestPractices: Math.round(results.reduce((sum, r) => sum + r.bestPractices, 0) / count),
      seo: Math.round(results.reduce((sum, r) => sum + r.seo, 0) / count),
      pwa: Math.round(results.reduce((sum, r) => sum + r.pwa, 0) / count),
      metrics: {
        lcp: results.reduce((sum, r) => sum + r.metrics.lcp, 0) / count,
        fid: results.reduce((sum, r) => sum + r.metrics.fid, 0) / count,
        cls: results.reduce((sum, r) => sum + r.metrics.cls, 0) / count,
        fcp: results.reduce((sum, r) => sum + r.metrics.fcp, 0) / count,
        tti: results.reduce((sum, r) => sum + r.metrics.tti, 0) / count,
        tbt: results.reduce((sum, r) => sum + r.metrics.tbt, 0) / count
      }
    };
  }

  /**
   * Get appropriate thresholds based on URL category
   */
  private getThresholdsForURL(url: string): PerformanceTestConfig['thresholds'] {
    if (url.includes('crisis') || url.includes('support') || url.includes('emergency')) {
      return CRISIS_THRESHOLDS;
    }
    
    if (url === '/' || url.includes('auth') || url.includes('journal') || url.includes('write')) {
      return CORE_THRESHOLDS;
    }
    
    return SECONDARY_THRESHOLDS;
  }

  /**
   * Check performance violations against thresholds
   */
  private checkViolations(
    results: LighthouseResults, 
    thresholds: PerformanceTestConfig['thresholds']
  ): Array<{
    metric: string;
    actual: number;
    threshold: number;
    severity: 'warning' | 'error' | 'critical';
  }> {
    const violations = [];
    
    // Lighthouse score violations
    if (results.performance < thresholds.performance) {
      violations.push({
        metric: 'Performance Score',
        actual: results.performance,
        threshold: thresholds.performance,
        severity: results.performance < thresholds.performance - 20 ? 'critical' as const : 'error' as const
      });
    }
    
    if (results.accessibility < thresholds.accessibility) {
      violations.push({
        metric: 'Accessibility Score',
        actual: results.accessibility,
        threshold: thresholds.accessibility,
        severity: 'critical' as const // Accessibility is always critical
      });
    }
    
    // Core Web Vitals violations
    if (results.metrics.lcp > thresholds.lcp) {
      violations.push({
        metric: 'Largest Contentful Paint',
        actual: Math.round(results.metrics.lcp),
        threshold: thresholds.lcp,
        severity: results.metrics.lcp > thresholds.lcp * 2 ? 'critical' as const : 'error' as const
      });
    }
    
    if (results.metrics.fid > thresholds.fid) {
      violations.push({
        metric: 'First Input Delay',
        actual: Math.round(results.metrics.fid),
        threshold: thresholds.fid,
        severity: results.metrics.fid > thresholds.fid * 3 ? 'critical' as const : 'error' as const
      });
    }
    
    if (results.metrics.cls > thresholds.cls) {
      violations.push({
        metric: 'Cumulative Layout Shift',
        actual: parseFloat(results.metrics.cls.toFixed(3)),
        threshold: thresholds.cls,
        severity: results.metrics.cls > thresholds.cls * 2 ? 'critical' as const : 'error' as const
      });
    }
    
    return violations;
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    results: LighthouseResults, 
    violations: Array<{ metric: string; actual: number; threshold: number; severity: string }>
  ): string[] {
    const recommendations = [];
    
    violations.forEach(violation => {
      switch (violation.metric) {
        case 'Performance Score':
          recommendations.push('Review Core Web Vitals and optimize critical rendering path');
          break;
        case 'Accessibility Score':
          recommendations.push('Fix accessibility issues - add alt text, improve color contrast, keyboard navigation');
          break;
        case 'Largest Contentful Paint':
          recommendations.push('Optimize LCP: preload critical resources, optimize images, reduce server response time');
          break;
        case 'First Input Delay':
          recommendations.push('Reduce FID: minimize JavaScript execution time, use web workers, defer non-critical scripts');
          break;
        case 'Cumulative Layout Shift':
          recommendations.push('Fix CLS: set dimensions for media, avoid dynamic content insertion, use font-display: swap');
          break;
      }
    });
    
    return [...new Set(recommendations)];
  }

  /**
   * Analyze performance regressions
   */
  private async analyzeRegressions(results: PerformanceTestResult[]): Promise<RegressionAnalysis> {
    const regressions = [];
    const improvements = [];
    
    for (const result of results) {
      const baseline = this.baselineResults.get(result.url);
      if (!baseline) continue;
      
      // Check performance score regression
      const performanceChange = result.lighthouse.performance - baseline.lighthouse.performance;
      if (Math.abs(performanceChange) >= 5) {
        if (performanceChange < 0) {
          regressions.push({
            metric: 'Performance Score',
            current: result.lighthouse.performance,
            baseline: baseline.lighthouse.performance,
            change: performanceChange,
            significance: Math.abs(performanceChange) >= 20 ? 'critical' as const : 
                         Math.abs(performanceChange) >= 10 ? 'major' as const : 'minor' as const
          });
        } else {
          improvements.push({
            metric: 'Performance Score',
            current: result.lighthouse.performance,
            baseline: baseline.lighthouse.performance,
            improvement: performanceChange
          });
        }
      }
      
      // Check LCP regression
      const lcpChange = result.lighthouse.metrics.lcp - baseline.lighthouse.metrics.lcp;
      if (Math.abs(lcpChange) >= 200) {
        if (lcpChange > 0) {
          regressions.push({
            metric: 'LCP',
            current: result.lighthouse.metrics.lcp,
            baseline: baseline.lighthouse.metrics.lcp,
            change: lcpChange,
            significance: lcpChange >= 1000 ? 'critical' as const : 
                         lcpChange >= 500 ? 'major' as const : 'minor' as const
          });
        } else {
          improvements.push({
            metric: 'LCP',
            current: result.lighthouse.metrics.lcp,
            baseline: baseline.lighthouse.metrics.lcp,
            improvement: Math.abs(lcpChange)
          });
        }
      }
    }
    
    return {
      hasRegression: regressions.length > 0,
      regressions,
      improvements
    };
  }

  /**
   * Calculate overall test suite score
   */
  private calculateOverallScore(results: PerformanceTestResult[]): {
    passed: boolean;
    score: number;
    criticalIssues: number;
  } {
    let totalScore = 0;
    let criticalIssues = 0;
    let failedTests = 0;
    
    results.forEach(result => {
      totalScore += result.lighthouse.performance;
      
      const critical = result.violations.filter(v => v.severity === 'critical').length;
      criticalIssues += critical;
      
      if (!result.passed) {
        failedTests++;
      }
    });
    
    const averageScore = totalScore / results.length;
    const passed = failedTests === 0 && criticalIssues === 0;
    
    return {
      passed,
      score: Math.round(averageScore),
      criticalIssues
    };
  }

  /**
   * Store results for future comparison
   */
  private async storeResults(results: PerformanceTestResult[]): Promise<void> {
    const resultsDir = path.join(process.cwd(), 'test-results', 'performance');
    await fs.mkdir(resultsDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `performance-${timestamp}.json`;
    
    await fs.writeFile(
      path.join(resultsDir, filename),
      JSON.stringify({ timestamp: Date.now(), results }, null, 2)
    );
    
    // Update baselines
    results.forEach(result => {
      this.baselineResults.set(result.url, result);
    });
    
    // Keep test history
    this.testHistory.push(...results);
    if (this.testHistory.length > 100) {
      this.testHistory = this.testHistory.slice(-50);
    }
  }

  /**
   * Get connection RTT based on configuration
   */
  private getConnectionRTT(): number {
    switch (this.config.connection) {
      case 'slow-4g': return 150;
      case '4g': return 40;
      case 'fast-4g': return 10;
      default: return 40;
    }
  }

  /**
   * Get connection throughput based on configuration
   */
  private getConnectionThroughput(): number {
    switch (this.config.connection) {
      case 'slow-4g': return 1600;
      case '4g': return 9000;
      case 'fast-4g': return 15000;
      default: return 9000;
    }
  }

  /**
   * Generate CI/CD performance report
   */
  async generateCIReport(results: {
    results: PerformanceTestResult[];
    overall: { passed: boolean; score: number; criticalIssues: number };
    regression: RegressionAnalysis;
  }): Promise<string> {
    let report = '# ALCHM Performance Test Report\n\n';
    
    // Overall status
    report += `## Overall Status: ${results.overall.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;
    report += `- **Average Performance Score**: ${results.overall.score}/100\n`;
    report += `- **Critical Issues**: ${results.overall.criticalIssues}\n`;
    report += `- **Tests Passed**: ${results.results.filter(r => r.passed).length}/${results.results.length}\n\n`;
    
    // Regression analysis
    if (results.regression.hasRegression) {
      report += '## ⚠️ Performance Regressions Detected\n\n';
      results.regression.regressions.forEach(reg => {
        report += `- **${reg.metric}**: ${reg.baseline} → ${reg.current} (${reg.change > 0 ? '+' : ''}${reg.change.toFixed(1)}) - ${reg.significance}\n`;
      });
      report += '\n';
    }
    
    if (results.regression.improvements.length > 0) {
      report += '## 🚀 Performance Improvements\n\n';
      results.regression.improvements.forEach(imp => {
        report += `- **${imp.metric}**: ${imp.baseline} → ${imp.current} (+${imp.improvement.toFixed(1)})\n`;
      });
      report += '\n';
    }
    
    // Individual test results
    report += '## Test Results by Page\n\n';
    results.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      report += `### ${status} ${result.url}\n\n`;
      report += `- **Performance**: ${result.lighthouse.performance}/100\n`;
      report += `- **Accessibility**: ${result.lighthouse.accessibility}/100\n`;
      report += `- **LCP**: ${Math.round(result.lighthouse.metrics.lcp)}ms\n`;
      report += `- **FID**: ${Math.round(result.lighthouse.metrics.fid)}ms\n`;
      report += `- **CLS**: ${result.lighthouse.metrics.cls.toFixed(3)}\n\n`;
      
      if (result.violations.length > 0) {
        report += '**Violations:**\n';
        result.violations.forEach(violation => {
          const icon = violation.severity === 'critical' ? '🔴' : violation.severity === 'error' ? '🟡' : '🔵';
          report += `${icon} ${violation.metric}: ${violation.actual} (threshold: ${violation.threshold})\n`;
        });
        report += '\n';
      }
      
      if (result.recommendations.length > 0) {
        report += '**Recommendations:**\n';
        result.recommendations.forEach(rec => {
          report += `- ${rec}\n`;
        });
        report += '\n';
      }
    });
    
    return report;
  }
}

// Default configurations for different environments
export const PERFORMANCE_TEST_CONFIGS = {
  crisis: {
    urls: [
      'http://localhost:3000/crisis-support',
      'http://localhost:3000/emergency',
      'http://localhost:3000/support'
    ],
    device: 'mobile' as const,
    connection: 'slow-4g' as const,
    iterations: 3,
    thresholds: CRISIS_THRESHOLDS
  },
  
  core: {
    urls: [
      'http://localhost:3000/',
      'http://localhost:3000/auth/login',
      'http://localhost:3000/journal',
      'http://localhost:3000/dashboard'
    ],
    device: 'mobile' as const,
    connection: '4g' as const,
    iterations: 2,
    thresholds: CORE_THRESHOLDS
  },
  
  comprehensive: {
    urls: [
      'http://localhost:3000/',
      'http://localhost:3000/auth/login',
      'http://localhost:3000/journal',
      'http://localhost:3000/dashboard',
      'http://localhost:3000/pricing',
      'http://localhost:3000/journals'
    ],
    device: 'desktop' as const,
    connection: 'fast-4g' as const,
    iterations: 2,
    thresholds: SECONDARY_THRESHOLDS
  }
};

export default PerformanceTestingPipeline;