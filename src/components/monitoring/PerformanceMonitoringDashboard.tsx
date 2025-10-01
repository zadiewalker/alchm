/**
 * ALCHM Performance Monitoring Dashboard
 * 
 * Real-time monitoring of Jony Ive design system performance impact.
 * Crisis-focused visualization with immediate alerts and recommendations.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWebVitalsMonitoring } from '@/lib/core-web-vitals-design-monitor';
import { usePerformanceBudget } from '@/lib/performance-budget-monitor';
import { useCrisisResources } from '@/lib/crisis-resource-performance-optimizer';

interface DashboardMetrics {
  performance: {
    score: number;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    trend: 'improving' | 'stable' | 'declining';
  };
  crisis: {
    buttonResponseTime: number | null;
    journalSaveTime: number | null;
    resourceLoadTime: number | null;
    detectionLatency: number | null;
  };
  system: {
    errorRate: number;
    availability: number;
    responseTime: number;
    throughput: number;
  };
  alerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: number;
    resolved: boolean;
  }>;
}

export default function PerformanceMonitoringDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [showCrisisOnly, setShowCrisisOnly] = useState(false);
  
  const { getMetrics, getAlerts } = useAdvancedPerformanceMonitoring();
  const { checkBudgets, getViolations } = usePerformanceBudget();
  
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchMetrics();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(fetchMetrics, 30000); // 30 seconds
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch performance metrics from multiple sources
      const [systemMetrics, statusMetrics, alertsData] = await Promise.all([
        fetch('/api/monitoring/performance').then(r => r.ok ? r.json() : null),
        fetch('/api/status/metrics').then(r => r.ok ? r.json() : null),
        fetch('/api/monitoring/performance-alert').then(r => r.ok ? r.json() : null)
      ]);
      
      // Get client-side metrics
      const clientMetrics = getMetrics();
      const clientAlerts = getAlerts();
      
      // Combine all metrics
      const combinedMetrics: DashboardMetrics = {
        performance: {
          score: clientMetrics.lcp ? calculatePerformanceScore(clientMetrics) : 85,
          lcp: clientMetrics.lcp,
          fid: clientMetrics.fid,
          cls: clientMetrics.cls,
          trend: determineTrend(systemMetrics?.trends)
        },
        crisis: {
          buttonResponseTime: clientMetrics.crisisButtonResponseTime,
          journalSaveTime: clientMetrics.journalSaveTime,
          resourceLoadTime: clientMetrics.crisisResourceLoadTime,
          detectionLatency: clientMetrics.crisisDetectionLatency
        },
        system: {
          errorRate: systemMetrics?.summary?.criticalAlerts || 0,
          availability: statusMetrics?.[4]?.value || 99.9,
          responseTime: statusMetrics?.[6]?.value || 800,
          throughput: statusMetrics?.[7]?.value || 1200
        },
        alerts: [
          ...clientAlerts.map((alert: any) => ({
            id: alert.id || `alert_${Date.now()}`,
            severity: alert.severity,
            message: `${alert.metric}: ${alert.value} > ${alert.threshold}`,
            timestamp: alert.timestamp,
            resolved: false
          })),
          ...(alertsData?.alerts || []).slice(0, 5)
        ]
      };
      
      setMetrics(combinedMetrics);
      setLastUpdate(Date.now());
      
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePerformanceScore = (metrics: any): number => {
    let score = 100;
    
    if (metrics.lcp) {
      if (metrics.lcp > 2500) score -= 30;
      else if (metrics.lcp > 1200) score -= 15;
    }
    
    if (metrics.fid) {
      if (metrics.fid > 300) score -= 30;
      else if (metrics.fid > 50) score -= 15;
    }
    
    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 30;
      else if (metrics.cls > 0.05) score -= 15;
    }
    
    return Math.max(0, score);
  };

  const determineTrend = (trends: any): 'improving' | 'stable' | 'declining' => {
    if (!trends) return 'stable';
    if (trends.performance === 'improving') return 'improving';
    if (trends.performance === 'declining') return 'declining';
    return 'stable';
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600 bg-green-50 border-green-200';
    if (value <= thresholds.warning) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDuration = (ms: number | null): string => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🎯 ALCHM Performance Monitoring
            </h1>
            <p className="text-gray-600 mt-1">
              Crisis-optimized performance tracking for trauma-informed UX
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Last updated: {formatTimestamp(lastUpdate)}
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            
            <button
              onClick={fetchMetrics}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        </div>
      </div>

      {metrics && (
        <>
          {/* Critical Alerts Banner */}
          {metrics.alerts.some(alert => alert.severity === 'critical' && !alert.resolved) && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">🚨</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">
                    Critical Performance Issues Detected
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {metrics.alerts
                      .filter(alert => alert.severity === 'critical' && !alert.resolved)
                      .map(alert => (
                        <div key={alert.id} className="mb-1">
                          • {alert.message}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Web Vitals */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Core Web Vitals (Crisis Thresholds)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.performance.score,
                { good: 90, warning: 75 }
              )}`}>
                <div className="text-2xl font-bold">
                  {metrics.performance.score.toFixed(0)}
                  <span className="text-sm font-normal">/100</span>
                </div>
                <div className="text-sm font-medium">Performance Score</div>
                <div className="text-xs opacity-75 mt-1">
                  Trend: {metrics.performance.trend === 'improving' ? '📈' : 
                          metrics.performance.trend === 'declining' ? '📉' : '➡️'} 
                  {metrics.performance.trend}
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.performance.lcp || 0,
                { good: 1200, warning: 2500 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.performance.lcp)}
                </div>
                <div className="text-sm font-medium">LCP</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;1.2s</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.performance.fid || 0,
                { good: 50, warning: 100 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.performance.fid)}
                </div>
                <div className="text-sm font-medium">FID</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;50ms</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                (metrics.performance.cls || 0) * 1000,
                { good: 50, warning: 100 }
              )}`}>
                <div className="text-2xl font-bold">
                  {metrics.performance.cls?.toFixed(3) || 'N/A'}
                </div>
                <div className="text-sm font-medium">CLS</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;0.05</div>
              </div>
            </div>
          </div>

          {/* Crisis Response Metrics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🆘 Crisis Response Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.crisis.buttonResponseTime || 0,
                { good: 100, warning: 200 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.crisis.buttonResponseTime)}
                </div>
                <div className="text-sm font-medium">Crisis Button</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;100ms</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.crisis.journalSaveTime || 0,
                { good: 1000, warning: 2000 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.crisis.journalSaveTime)}
                </div>
                <div className="text-sm font-medium">Journal Save</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;1s</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.crisis.resourceLoadTime || 0,
                { good: 500, warning: 1000 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.crisis.resourceLoadTime)}
                </div>
                <div className="text-sm font-medium">Crisis Resources</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;500ms</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.crisis.detectionLatency || 0,
                { good: 100, warning: 300 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.crisis.detectionLatency)}
                </div>
                <div className="text-sm font-medium">Crisis Detection</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;100ms</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔧 System Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.system.errorRate,
                { good: 1, warning: 5 }
              )}`}>
                <div className="text-2xl font-bold">
                  {metrics.system.errorRate.toFixed(1)}%
                </div>
                <div className="text-sm font-medium">Error Rate</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;1%</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                100 - metrics.system.availability,
                { good: 0.1, warning: 0.5 }
              )}`}>
                <div className="text-2xl font-bold">
                  {metrics.system.availability.toFixed(2)}%
                </div>
                <div className="text-sm font-medium">Availability</div>
                <div className="text-xs opacity-75 mt-1">Target: &gt;99.9%</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                metrics.system.responseTime,
                { good: 1000, warning: 2000 }
              )}`}>
                <div className="text-2xl font-bold">
                  {formatDuration(metrics.system.responseTime)}
                </div>
                <div className="text-sm font-medium">Response Time</div>
                <div className="text-xs opacity-75 mt-1">Target: &lt;1s</div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getStatusColor(
                1000 - metrics.system.throughput,
                { good: -500, warning: 0 }
              )}`}>
                <div className="text-2xl font-bold">
                  {metrics.system.throughput.toFixed(0)}
                </div>
                <div className="text-sm font-medium">Req/Min</div>
                <div className="text-xs opacity-75 mt-1">Target: &gt;1000</div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                ⚠️ Recent Performance Alerts
              </h2>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showCrisisOnly}
                  onChange={(e) => setShowCrisisOnly(e.target.checked)}
                  className="rounded"
                />
                <span>Crisis-related only</span>
              </label>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {metrics.alerts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <span className="text-2xl">✅</span>
                    <p className="mt-2">No recent alerts - system performing well!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {metrics.alerts
                      .filter(alert => !showCrisisOnly || alert.message.toLowerCase().includes('crisis'))
                      .slice(0, 10)
                      .map(alert => (
                        <div key={alert.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {formatTimestamp(alert.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">{alert.message}</p>
                            </div>
                            {alert.resolved ? (
                              <span className="text-green-600 text-sm">✓ Resolved</span>
                            ) : (
                              <span className="text-red-600 text-sm">● Active</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}