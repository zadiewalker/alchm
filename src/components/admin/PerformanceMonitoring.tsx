'use client';

import { useState, useEffect } from 'react';
import { performanceMonitor } from '@/lib/performance';

interface PerformanceMetrics {
  budgetViolations: number;
  avgMetrics: {
    LCP: number;
    INP: number;
    CLS: number;
    FCP: number;
    TTFB: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
  };
}

export default function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      
      // Get real-time metrics from performance monitor
      const summary = performanceMonitor.getPerformanceSummary();
      setMetrics(summary);
      
    } catch (error) {
      console.error('Failed to load performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance Monitoring</h2>
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  const getScoreColor = (score: number, threshold: number) => {
    if (score <= threshold * 0.75) return 'text-green-600 bg-green-50';
    if (score <= threshold) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreGrade = (score: number, threshold: number) => {
    if (score <= threshold * 0.75) return 'Good';
    if (score <= threshold) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Performance Monitoring</h2>
        <button
          onClick={loadMetrics}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Budget Violations Alert */}
      {metrics.budgetViolations > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="font-medium text-red-800">Performance Budget Violations</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            {metrics.budgetViolations} metrics exceeded performance budgets
          </p>
        </div>
      )}

      {/* Core Web Vitals */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Largest Contentful Paint */}
          <div className={`p-4 rounded-lg border ${getScoreColor(metrics.avgMetrics.LCP, 2500)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">LCP</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getScoreGrade(metrics.avgMetrics.LCP, 2500)}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.avgMetrics.LCP ? `${(metrics.avgMetrics.LCP / 1000).toFixed(2)}s` : 'N/A'}
            </div>
            <div className="text-sm opacity-75">Largest Contentful Paint</div>
            <div className="text-xs mt-1">Target: ≤2.5s</div>
          </div>

          {/* Interaction to Next Paint */}
          <div className={`p-4 rounded-lg border ${getScoreColor(metrics.avgMetrics.INP, 200)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">INP</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getScoreGrade(metrics.avgMetrics.INP, 200)}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.avgMetrics.INP ? `${Math.round(metrics.avgMetrics.INP)}ms` : 'N/A'}
            </div>
            <div className="text-sm opacity-75">Interaction to Next Paint</div>
            <div className="text-xs mt-1">Target: ≤200ms</div>
          </div>

          {/* Cumulative Layout Shift */}
          <div className={`p-4 rounded-lg border ${getScoreColor(metrics.avgMetrics.CLS, 0.1)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">CLS</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getScoreGrade(metrics.avgMetrics.CLS, 0.1)}
              </span>
            </div>
            <div className="text-2xl font-bold">
              {metrics.avgMetrics.CLS ? metrics.avgMetrics.CLS.toFixed(3) : 'N/A'}
            </div>
            <div className="text-sm opacity-75">Cumulative Layout Shift</div>
            <div className="text-xs mt-1">Target: ≤0.1</div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Additional Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* First Contentful Paint */}
          <div className={`p-4 rounded-lg border ${getScoreColor(metrics.avgMetrics.FCP, 1800)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">FCP</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getScoreGrade(metrics.avgMetrics.FCP, 1800)}
              </span>
            </div>
            <div className="text-xl font-bold">
              {metrics.avgMetrics.FCP ? `${(metrics.avgMetrics.FCP / 1000).toFixed(2)}s` : 'N/A'}
            </div>
            <div className="text-sm opacity-75">First Contentful Paint</div>
            <div className="text-xs mt-1">Target: ≤1.8s</div>
          </div>

          {/* Time to First Byte */}
          <div className={`p-4 rounded-lg border ${getScoreColor(metrics.avgMetrics.TTFB, 600)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">TTFB</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                {getScoreGrade(metrics.avgMetrics.TTFB, 600)}
              </span>
            </div>
            <div className="text-xl font-bold">
              {metrics.avgMetrics.TTFB ? `${Math.round(metrics.avgMetrics.TTFB)}ms` : 'N/A'}
            </div>
            <div className="text-sm opacity-75">Time to First Byte</div>
            <div className="text-xs mt-1">Target: ≤600ms</div>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div>
        <h3 className="text-lg font-medium mb-4">Device Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.deviceBreakdown.mobile}
            </div>
            <div className="text-sm text-blue-700">Mobile Sessions</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.deviceBreakdown.desktop}
            </div>
            <div className="text-sm text-purple-700">Desktop Sessions</div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      {metrics.budgetViolations > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Optimization Suggestions</h4>
          <ul className="text-sm space-y-1 text-gray-700">
            {metrics.avgMetrics.LCP > 2500 && (
              <li>• Optimize images and reduce server response times to improve LCP</li>
            )}
            {metrics.avgMetrics.INP > 200 && (
              <li>• Reduce JavaScript execution time to improve INP</li>
            )}
            {metrics.avgMetrics.CLS > 0.1 && (
              <li>• Set dimensions for images and ads to reduce layout shifts</li>
            )}
            {metrics.avgMetrics.TTFB > 600 && (
              <li>• Optimize server response time and use CDN for better TTFB</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}