'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useCoreWebVitals } from '@/lib/coreWebVitals';
import { usePerformanceMonitoring } from '@/lib/performance-monitoring';
import { usePerformanceBudget } from '@/lib/performance-budget';

interface MetricCard {
  name: string;
  value: number | null;
  threshold: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  trend: 'up' | 'down' | 'stable';
}

interface AlertItem {
  id: string;
  metric: string;
  severity: 'warning' | 'critical' | 'emergency';
  message: string;
  timestamp: number;
}

export default function PerformanceExcellenceDashboard() {
  const [lighthouseScore, setLighthouseScore] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(true);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  
  const { getVitalsData, generateReport, getRecommendations } = useCoreWebVitals();
  const { getMetrics, getCrisisMetrics, getAlerts, getPerformanceScore } = usePerformanceMonitoring();
  const { getViolations, getPageCategory, getBudgets } = usePerformanceBudget();

  // Real-time data fetching
  const fetchRealTimeData = useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/real-time-metrics');
      if (response.ok) {
        const data = await response.json();
        setRealTimeData(data);
      }
    } catch (error) {
      console.warn('Failed to fetch real-time metrics:', error);
    }
  }, []);

  // Calculate Lighthouse score approximation
  const calculateLighthouseScore = useCallback(() => {
    const vitals = getVitalsData();
    const performanceScore = getPerformanceScore();
    
    // Weighted calculation based on Core Web Vitals
    let score = 100;
    
    // LCP (25% weight)
    if (vitals.lcp) {
      if (vitals.lcp > 4000) score -= 25;
      else if (vitals.lcp > 2500) score -= 15;
      else if (vitals.lcp > 1200) score -= 5;
    }
    
    // FID/INP (25% weight)
    const interactivity = vitals.fid || vitals.inp;
    if (interactivity) {
      if (interactivity > 300) score -= 25;
      else if (interactivity > 100) score -= 15;
      else if (interactivity > 50) score -= 5;
    }
    
    // CLS (25% weight)
    if (vitals.cls) {
      if (vitals.cls > 0.25) score -= 25;
      else if (vitals.cls > 0.1) score -= 15;
      else if (vitals.cls > 0.05) score -= 5;
    }
    
    // FCP (15% weight)
    if (vitals.fcp) {
      if (vitals.fcp > 3000) score -= 15;
      else if (vitals.fcp > 1800) score -= 10;
      else if (vitals.fcp > 800) score -= 3;
    }
    
    // TTI (10% weight)
    if (vitals.ttfb) {
      if (vitals.ttfb > 1800) score -= 10;
      else if (vitals.ttfb > 800) score -= 5;
      else if (vitals.ttfb > 200) score -= 2;
    }
    
    return Math.max(0, Math.round(score));
  }, [getVitalsData, getPerformanceScore]);

  // Update lighthouse score periodically
  useEffect(() => {
    const updateScore = () => {
      const score = calculateLighthouseScore();
      setLighthouseScore(score);
    };

    updateScore();
    const interval = setInterval(updateScore, 5000);
    return () => clearInterval(interval);
  }, [calculateLighthouseScore]);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = () => {
      const performanceAlerts = getAlerts();
      const formattedAlerts: AlertItem[] = performanceAlerts.map(alert => ({
        id: `perf-${Date.now()}-${Math.random()}`,
        metric: alert.metric,
        severity: alert.severity as 'warning' | 'critical' | 'emergency',
        message: `${alert.metric}: ${alert.value.toFixed(0)}ms exceeds ${alert.threshold}ms threshold`,
        timestamp: Date.now()
      }));
      
      setAlerts(prev => [...formattedAlerts, ...prev].slice(0, 10));
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [getAlerts]);

  // Monitor online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Real-time updates
  useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  // Prepare metric cards
  const vitals = getVitalsData();
  const crisisMetrics = getCrisisMetrics();
  const pageCategory = getPageCategory();
  const budgets = getBudgets(pageCategory);

  const metricCards: MetricCard[] = [
    {
      name: 'LCP',
      value: vitals.lcp,
      threshold: budgets.LCP,
      unit: 'ms',
      status: vitals.lcp ? (vitals.lcp <= budgets.LCP ? 'good' : vitals.lcp <= budgets.LCP * 1.5 ? 'needs-improvement' : 'poor') : 'good',
      trend: 'stable'
    },
    {
      name: 'FID',
      value: vitals.fid,
      threshold: budgets.FID,
      unit: 'ms',
      status: vitals.fid ? (vitals.fid <= budgets.FID ? 'good' : vitals.fid <= budgets.FID * 2 ? 'needs-improvement' : 'poor') : 'good',
      trend: 'stable'
    },
    {
      name: 'CLS',
      value: vitals.cls,
      threshold: budgets.CLS,
      unit: '',
      status: vitals.cls ? (vitals.cls <= budgets.CLS ? 'good' : vitals.cls <= budgets.CLS * 2 ? 'needs-improvement' : 'poor') : 'good',
      trend: 'stable'
    },
    {
      name: 'FCP',
      value: vitals.fcp,
      threshold: budgets.FCP,
      unit: 'ms',
      status: vitals.fcp ? (vitals.fcp <= budgets.FCP ? 'good' : vitals.fcp <= budgets.FCP * 1.5 ? 'needs-improvement' : 'poor') : 'good',
      trend: 'stable'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'text-red-700 bg-red-100 border-red-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Performance Excellence Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring • Crisis-optimized • 95+ Lighthouse target</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Lighthouse Score</div>
            <div className={`text-2xl font-medium ${getScoreColor(lighthouseScore)}`}>
              {lighthouseScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <h3 className="text-lg font-medium text-red-800 mb-3">Active Performance Alerts</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alerts.slice(0, 3).map(alert => (
              <div key={alert.id} className={`px-3 py-2 rounded border text-sm ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.metric}</span>
                  <span className="text-xs">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map(metric => (
          <Card key={metric.name} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getMetricColor(metric.status)}`}>
                {metric.status.replace('-', ' ')}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-medium text-gray-900">
                  {metric.value !== null ? 
                    (metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value)) 
                    : '--'
                  }
                </span>
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Target: {metric.name === 'CLS' ? metric.threshold.toFixed(3) : metric.threshold}{metric.unit}
              </div>
              
              {/* Progress bar */}
              {metric.value !== null && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (metric.threshold / Math.max(metric.value, metric.threshold)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Crisis Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Crisis-Critical Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-blue-600">
              {crisisMetrics.emergencyButtonResponseTime ? 
                `${Math.round(crisisMetrics.emergencyButtonResponseTime)}ms` : '--'
              }
            </div>
            <div className="text-sm text-gray-500">Emergency Button Response</div>
            <div className="text-xs text-gray-400 mt-1">Target: &lt;200ms</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-medium text-green-600">
              {crisisMetrics.journalSaveTime ? 
                `${Math.round(crisisMetrics.journalSaveTime)}ms` : '--'
              }
            </div>
            <div className="text-sm text-gray-500">Journal Save Time</div>
            <div className="text-xs text-gray-400 mt-1">Target: &lt;2000ms</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-medium text-purple-600">
              {crisisMetrics.authLoadTime ? 
                `${Math.round(crisisMetrics.authLoadTime)}ms` : '--'
              }
            </div>
            <div className="text-sm text-gray-500">Auth Load Time</div>
            <div className="text-xs text-gray-400 mt-1">Target: &lt;1500ms</div>
          </div>
        </div>
      </Card>

      {/* Performance Budget Status */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Budget Status</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Page Category: {pageCategory.replace('_', ' ')}</span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            getViolations().length === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {getViolations().length === 0 ? 'Within Budget' : `${getViolations().length} Violations`}
          </span>
        </div>
        
        {getViolations().length > 0 && (
          <div className="space-y-2">
            {getViolations().slice(0, 3).map((violation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200">
                <div>
                  <span className="font-medium text-red-800">{violation.metric}</span>
                  <span className="text-sm text-red-600 ml-2">
                    {violation.actual} exceeds {violation.budget} by {violation.percentageOver.toFixed(1)}%
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  violation.severity === 'critical' ? 'bg-red-200 text-red-800' :
                  violation.severity === 'error' ? 'bg-orange-200 text-orange-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}>
                  {violation.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Real-Time Metrics */}
      {realTimeData && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Real-Time System Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-medium text-blue-600">
                {realTimeData.activeUsers || 0}
              </div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-medium text-green-600">
                {realTimeData.uptime || '99.9%'}
              </div>
              <div className="text-sm text-gray-500">Uptime (24h)</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-medium text-purple-600">
                {realTimeData.avgResponseTime || '--'}ms
              </div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-medium text-orange-600">
                {realTimeData.errorRate || '0.0%'}
              </div>
              <div className="text-sm text-gray-500">Error Rate</div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Run Lighthouse Test
          </button>
          
          <button 
            onClick={() => {
              const report = generateReport();
              console.log(report);
              alert('Performance report logged to console');
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Generate Report
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Refresh Metrics
          </button>
          
          <button 
            onClick={() => fetchRealTimeData()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Update Real-Time Data
          </button>
        </div>
      </Card>
    </div>
  );
}