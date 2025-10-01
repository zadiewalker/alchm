'use client';

import React, { useEffect, useState } from 'react';
import { useMobileOptimization } from '@/lib/mobile-performance-optimizer';

interface PerformanceReport {
  timeToInteractive: number;
  firstContentfulPaint: number;
  cumulativeLayoutShift: number;
  crisisDetectionLatency: number;
  memoryUsage: number;
  deviceType: 'very-low-end' | 'low-end' | 'standard';
  connectionType: string;
  timestamp: number;
}

interface MobilePerformanceMonitorProps {
  enableReporting?: boolean;
  showDebugInfo?: boolean;
  reportingInterval?: number; // ms
}

export default function MobilePerformanceMonitor({
  enableReporting = true,
  showDebugInfo = false,
  reportingInterval = 30000 // 30 seconds
}: MobilePerformanceMonitorProps) {
  const {
    capabilities,
    config,
    metrics,
    isStruggling,
    recommendations,
    startCrisisDetectionTiming,
    endCrisisDetectionTiming
  } = useMobileOptimization();

  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!enableReporting || typeof window === 'undefined') return;

    setIsMonitoring(true);

    // Monitor Core Web Vitals
    const observeWebVitals = () => {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcp = entries[entries.length - 1];
            if (lcp && lcp.startTime > 2500) {
              reportPerformanceIssue('LCP', lcp.startTime, 'Largest Contentful Paint is slow');
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = entry.processingStart - entry.startTime;
              if (fid > 100) {
                reportPerformanceIssue('FID', fid, 'First Input Delay is high');
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                if (clsValue > 0.1) {
                  reportPerformanceIssue('CLS', clsValue, 'Cumulative Layout Shift is high');
                }
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

        } catch (error) {
          console.warn('Performance monitoring setup failed:', error);
        }
      }
    };

    observeWebVitals();

    // Monitor memory usage for low-end devices
    const monitorMemory = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / (1024 * 1024);
        const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
        const usagePercent = (usedMB / limitMB) * 100;

        if (usagePercent > 80) {
          reportPerformanceIssue('Memory', usagePercent, 'High memory usage detected');
        }
      }
    };

    // Monitor device performance indicators
    const monitorDevicePerformance = () => {
      // Check for slow script execution
      const startTime = performance.now();
      setTimeout(() => {
        const executionTime = performance.now() - startTime;
        if (executionTime > 50) { // Should be near 0 for setTimeout
          reportPerformanceIssue('Script', executionTime, 'Slow script execution detected');
        }
      }, 0);

      // Monitor long tasks if supported
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.duration > 50) {
                reportPerformanceIssue('LongTask', entry.duration, 'Long task blocking main thread');
              }
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (error) {
          // Long task observer not supported
        }
      }
    };

    // Set up monitoring intervals
    const memoryInterval = setInterval(monitorMemory, 10000); // Every 10 seconds
    const performanceInterval = setInterval(monitorDevicePerformance, 5000); // Every 5 seconds

    // Generate performance reports
    const reportingTimer = setInterval(generatePerformanceReport, reportingInterval);

    return () => {
      clearInterval(memoryInterval);
      clearInterval(performanceInterval);
      clearInterval(reportingTimer);
      setIsMonitoring(false);
    };
  }, [enableReporting, reportingInterval]);

  // Monitor crisis detection timing
  useEffect(() => {
    if (!capabilities?.isInCrisisMode) return;

    const handleCrisisDetectionStart = () => {
      startCrisisDetectionTiming?.();
    };

    const handleCrisisDetectionEnd = () => {
      endCrisisDetectionTiming?.();
    };

    // Listen for crisis detection events
    window.addEventListener('crisisDetectionStarted', handleCrisisDetectionStart);
    window.addEventListener('crisisDetectionCompleted', handleCrisisDetectionEnd);

    return () => {
      window.removeEventListener('crisisDetectionStarted', handleCrisisDetectionStart);
      window.removeEventListener('crisisDetectionCompleted', handleCrisisDetectionEnd);
    };
  }, [capabilities?.isInCrisisMode, startCrisisDetectionTiming, endCrisisDetectionTiming]);

  const reportPerformanceIssue = (metric: string, value: number, description: string) => {
    if (!enableReporting) return;

    const issue = {
      metric,
      value,
      description,
      timestamp: Date.now(),
      deviceType: capabilities?.isVeryLowEnd ? 'very-low-end' : 
                  capabilities?.isLowEnd ? 'low-end' : 'standard',
      connectionType: capabilities?.effectiveType || 'unknown',
      memoryGB: capabilities?.memoryGB || 0,
      coreCount: capabilities?.coreCount || 0
    };

    // Store performance issues locally for analysis
    try {
      const issues = JSON.parse(localStorage.getItem('alchm_performance_issues') || '[]');
      issues.push(issue);
      // Keep only last 50 issues
      localStorage.setItem('alchm_performance_issues', JSON.stringify(issues.slice(-50)));
    } catch (error) {
      console.warn('Failed to store performance issue:', error);
    }

    // Log critical issues
    if (metric === 'FID' && value > 300) {
      console.warn(`CRITICAL: ${description} (${value}ms) - Crisis users may struggle to interact`);
    } else if (metric === 'LCP' && value > 4000) {
      console.warn(`CRITICAL: ${description} (${value}ms) - Page loading too slowly for crisis users`);
    } else if (metric === 'Memory' && value > 90) {
      console.warn(`CRITICAL: ${description} (${value}%) - Device may become unresponsive`);
    }
  };

  const generatePerformanceReport = () => {
    if (!metrics || !capabilities) return;

    const report: PerformanceReport = {
      timeToInteractive: metrics.timeToInteractive,
      firstContentfulPaint: metrics.firstContentfulPaint,
      cumulativeLayoutShift: metrics.cumulativeLayoutShift,
      crisisDetectionLatency: metrics.crisisDetectionLatency,
      memoryUsage: metrics.memoryUsage,
      deviceType: capabilities.isVeryLowEnd ? 'very-low-end' : 
                  capabilities.isLowEnd ? 'low-end' : 'standard',
      connectionType: capabilities.effectiveType,
      timestamp: Date.now()
    };

    setPerformanceReport(report);

    // Store report for analytics
    try {
      const reports = JSON.parse(localStorage.getItem('alchm_performance_reports') || '[]');
      reports.push(report);
      // Keep only last 10 reports
      localStorage.setItem('alchm_performance_reports', JSON.stringify(reports.slice(-10)));
    } catch (error) {
      console.warn('Failed to store performance report:', error);
    }
  };

  // Don't render anything by default (monitoring runs in background)
  if (!showDebugInfo) {
    return null;
  }

  return (
    <div className="mobile-performance-monitor">
      <style jsx>{`
        .mobile-performance-monitor {
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px;
          border-radius: 8px;
          font-size: 12px;
          font-family: monospace;
          max-width: 300px;
          opacity: 0.7;
          pointer-events: none;
        }
        
        .performance-metric {
          margin: 4px 0;
          display: flex;
          justify-content: space-between;
        }
        
        .metric-value {
          font-weight: bold;
        }
        
        .metric-good { color: #4ade80; }
        .metric-warning { color: #fbbf24; }
        .metric-critical { color: #f87171; }
        
        .device-info {
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          margin-top: 8px;
          padding-top: 8px;
          font-size: 11px;
        }
        
        .recommendations {
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          margin-top: 8px;
          padding-top: 8px;
          font-size: 10px;
          max-height: 100px;
          overflow-y: auto;
        }
      `}</style>

      <div className="performance-metric">
        <span>Monitoring:</span>
        <span className={`metric-value ${isMonitoring ? 'metric-good' : 'metric-critical'}`}>
          {isMonitoring ? 'Active' : 'Inactive'}
        </span>
      </div>

      {metrics && (
        <>
          <div className="performance-metric">
            <span>TTI:</span>
            <span className={`metric-value ${
              metrics.timeToInteractive < 5000 ? 'metric-good' : 
              metrics.timeToInteractive < 10000 ? 'metric-warning' : 'metric-critical'
            }`}>
              {metrics.timeToInteractive.toFixed(0)}ms
            </span>
          </div>

          <div className="performance-metric">
            <span>FCP:</span>
            <span className={`metric-value ${
              metrics.firstContentfulPaint < 2000 ? 'metric-good' : 
              metrics.firstContentfulPaint < 4000 ? 'metric-warning' : 'metric-critical'
            }`}>
              {metrics.firstContentfulPaint.toFixed(0)}ms
            </span>
          </div>

          <div className="performance-metric">
            <span>Crisis Detection:</span>
            <span className={`metric-value ${
              metrics.crisisDetectionLatency < 1000 ? 'metric-good' : 
              metrics.crisisDetectionLatency < 2000 ? 'metric-warning' : 'metric-critical'
            }`}>
              {metrics.crisisDetectionLatency.toFixed(0)}ms
            </span>
          </div>

          <div className="performance-metric">
            <span>Memory:</span>
            <span className={`metric-value ${
              metrics.memoryUsage < 50 ? 'metric-good' : 
              metrics.memoryUsage < 100 ? 'metric-warning' : 'metric-critical'
            }`}>
              {metrics.memoryUsage.toFixed(1)}MB
            </span>
          </div>
        </>
      )}

      {capabilities && (
        <div className="device-info">
          <div>Device: {capabilities.isVeryLowEnd ? 'Very Low-End' : capabilities.isLowEnd ? 'Low-End' : 'Standard'}</div>
          <div>Connection: {capabilities.effectiveType}</div>
          <div>Memory: {capabilities.memoryGB}GB</div>
          <div>Cores: {capabilities.coreCount}</div>
          {capabilities.isInCrisisMode && <div style={{ color: '#f87171' }}>🚨 Crisis Mode</div>}
        </div>
      )}

      {isStruggling && (
        <div className="metric-critical" style={{ marginTop: '8px', fontSize: '11px' }}>
          ⚠️ Device struggling with performance
        </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="recommendations">
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Recommendations:</div>
          {recommendations.slice(0, 3).map((rec, index) => (
            <div key={index} style={{ fontSize: '10px', marginBottom: '2px' }}>
              • {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Hook for accessing performance monitoring data
export function usePerformanceMonitoring() {
  const [performanceIssues, setPerformanceIssues] = useState<any[]>([]);
  const [performanceReports, setPerformanceReports] = useState<PerformanceReport[]>([]);

  useEffect(() => {
    try {
      const issues = JSON.parse(localStorage.getItem('alchm_performance_issues') || '[]');
      const reports = JSON.parse(localStorage.getItem('alchm_performance_reports') || '[]');
      setPerformanceIssues(issues);
      setPerformanceReports(reports);
    } catch (error) {
      console.warn('Failed to load performance monitoring data:', error);
    }
  }, []);

  const clearPerformanceData = () => {
    try {
      localStorage.removeItem('alchm_performance_issues');
      localStorage.removeItem('alchm_performance_reports');
      setPerformanceIssues([]);
      setPerformanceReports([]);
    } catch (error) {
      console.warn('Failed to clear performance data:', error);
    }
  };

  const getPerformanceSummary = () => {
    if (performanceReports.length === 0) return null;

    const latest = performanceReports[performanceReports.length - 1];
    const avgTTI = performanceReports.reduce((sum, report) => sum + report.timeToInteractive, 0) / performanceReports.length;
    const avgFCP = performanceReports.reduce((sum, report) => sum + report.firstContentfulPaint, 0) / performanceReports.length;
    const criticalIssues = performanceIssues.filter(issue => 
      (issue.metric === 'FID' && issue.value > 300) ||
      (issue.metric === 'LCP' && issue.value > 4000) ||
      (issue.metric === 'Memory' && issue.value > 90)
    ).length;

    return {
      latest,
      averages: { timeToInteractive: avgTTI, firstContentfulPaint: avgFCP },
      criticalIssues,
      totalReports: performanceReports.length
    };
  };

  return {
    performanceIssues,
    performanceReports,
    clearPerformanceData,
    getPerformanceSummary
  };
}