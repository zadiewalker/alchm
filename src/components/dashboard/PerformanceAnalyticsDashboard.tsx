'use client';

/**
 * ALCHM Real-Time Performance Analytics Dashboard
 * 
 * Comprehensive performance monitoring dashboard for stakeholders
 * Focus on trauma-informed metrics and crisis resource accessibility
 */

import React, { useState, useEffect, useCallback } from 'react';
import { realUserMonitoring, CrisisPerformanceMetric } from '@/lib/real-user-monitoring';
import { mobileTraumaMonitor, MobileTraumaMetrics } from '@/lib/mobile-trauma-performance';

interface DashboardData {
  coreWebVitals: {
    lcp: { value: number; rating: string; trend: 'up' | 'down' | 'stable' };
    fid: { value: number; rating: string; trend: 'up' | 'down' | 'stable' };
    cls: { value: number; rating: string; trend: 'up' | 'down' | 'stable' };
    fcp: { value: number; rating: string; trend: 'up' | 'down' | 'stable' };
    ttfb: { value: number; rating: string; trend: 'up' | 'down' | 'stable' };
  };
  crisisMetrics: {
    resourceLoadTimes: Record<string, number>;
    emergencyButtonResponseTime: number;
    crisisNavigationTime: number;
    userSafetyScore: number;
  };
  mobileMetrics: MobileTraumaMetrics;
  alerts: {
    critical: number;
    warnings: number;
    lastAlert?: {
      type: string;
      message: string;
      timestamp: number;
    };
  };
  userContext: {
    totalUsers: number;
    crisisUsers: number;
    mobileUsers: number;
    lowEndDevices: number;
  };
}

interface MetricCard {
  title: string;
  value: string | number;
  rating: 'good' | 'needs-improvement' | 'poor';
  trend: 'up' | 'down' | 'stable';
  target: string;
  description: string;
}

export default function PerformanceAnalyticsDashboard() {
  const [data, setData] = useState<DashboardData>({
    coreWebVitals: {
      lcp: { value: 0, rating: 'good', trend: 'stable' },
      fid: { value: 0, rating: 'good', trend: 'stable' },
      cls: { value: 0, rating: 'good', trend: 'stable' },
      fcp: { value: 0, rating: 'good', trend: 'stable' },
      ttfb: { value: 0, rating: 'good', trend: 'stable' }
    },
    crisisMetrics: {
      resourceLoadTimes: {},
      emergencyButtonResponseTime: 0,
      crisisNavigationTime: 0,
      userSafetyScore: 100
    },
    mobileMetrics: {
      touchResponsiveness: 0,
      batteryImpact: 1,
      memoryPressure: 0,
      networkStability: 1,
      accessibilityCompliance: 0.9,
      crisisNavigationTime: 0,
      emergencyButtonAccessibility: 0.9,
      tremorsCompensation: false
    },
    alerts: {
      critical: 0,
      warnings: 0
    },
    userContext: {
      totalUsers: 0,
      crisisUsers: 0,
      mobileUsers: 0,
      lowEndDevices: 0
    }
  });

  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');

  // Update dashboard data
  const updateDashboardData = useCallback(async () => {
    try {
      // Get crisis resource performance
      const crisisResourcePerformance = realUserMonitoring.getCrisisResourcePerformance();
      
      // Get mobile trauma metrics
      const mobileMetrics = mobileTraumaMonitor.getMetrics();
      
      // Calculate user safety score
      const userSafetyScore = calculateUserSafetyScore(crisisResourcePerformance, mobileMetrics);
      
      setData(prevData => ({
        ...prevData,
        crisisMetrics: {
          resourceLoadTimes: crisisResourcePerformance,
          emergencyButtonResponseTime: 150, // placeholder
          crisisNavigationTime: mobileMetrics.crisisNavigationTime,
          userSafetyScore
        },
        mobileMetrics,
        userContext: {
          ...prevData.userContext,
          // These would come from real analytics in production
          totalUsers: Math.floor(Math.random() * 1000) + 500,
          crisisUsers: Math.floor(Math.random() * 50) + 10,
          mobileUsers: Math.floor(Math.random() * 800) + 400,
          lowEndDevices: Math.floor(Math.random() * 200) + 100
        }
      }));
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to update dashboard data:', error);
    }
  }, []);

  // Handle performance metric updates
  const handleMetricUpdate = useCallback((metric: CrisisPerformanceMetric) => {
    setData(prevData => {
      const newCoreWebVitals = { ...prevData.coreWebVitals };
      
      if (metric.name in newCoreWebVitals) {
        const metricKey = metric.name as keyof typeof newCoreWebVitals;
        newCoreWebVitals[metricKey] = {
          value: metric.value,
          rating: metric.rating,
          trend: calculateTrend(prevData.coreWebVitals[metricKey].value, metric.value)
        };
      }
      
      // Update alerts
      const newAlerts = { ...prevData.alerts };
      if (metric.rating === 'poor') {
        newAlerts.critical++;
        newAlerts.lastAlert = {
          type: 'critical',
          message: `Poor ${metric.name}: ${Math.round(metric.value)}ms`,
          timestamp: Date.now()
        };
      } else if (metric.rating === 'needs-improvement') {
        newAlerts.warnings++;
      }
      
      return {
        ...prevData,
        coreWebVitals: newCoreWebVitals,
        alerts: newAlerts
      };
    });
  }, []);

  // Initialize monitoring
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        await realUserMonitoring.initialize();
        await mobileTraumaMonitor.initialize();
        
        if (mounted) {
          realUserMonitoring.onAlert(handleMetricUpdate);
          updateDashboardData();
        }
      } catch (error) {
        console.error('Dashboard initialization failed:', error);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [handleMetricUpdate, updateDashboardData]);

  // Live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(updateDashboardData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [isLive, updateDashboardData]);

  // Calculate user safety score
  const calculateUserSafetyScore = (
    crisisResources: Record<string, number>,
    mobileMetrics: MobileTraumaMetrics
  ): number => {
    let score = 100;
    
    // Deduct points for slow crisis resources
    Object.values(crisisResources).forEach(time => {
      if (time > 3000) score -= 20; // Critical threshold
      else if (time > 2000) score -= 10; // Warning threshold
    });
    
    // Deduct points for poor mobile performance
    if (mobileMetrics.touchResponsiveness > 300) score -= 15;
    if (mobileMetrics.batteryImpact < 0.1) score -= 10;
    if (mobileMetrics.memoryPressure > 0.8) score -= 10;
    if (mobileMetrics.accessibilityCompliance < 0.8) score -= 20;
    
    return Math.max(0, score);
  };

  // Calculate trend
  const calculateTrend = (oldValue: number, newValue: number): 'up' | 'down' | 'stable' => {
    const diff = newValue - oldValue;
    if (Math.abs(diff) < oldValue * 0.05) return 'stable'; // Within 5%
    return diff > 0 ? 'up' : 'down';
  };

  // Get rating color
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
    }
  };

  // Format time
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">
              🏥 ALCHM Performance Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time trauma-informed performance monitoring
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Live Updates:</span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  isLive 
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {isLive ? '🟢 ON' : '🔴 OFF'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* User Safety Score */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">User Safety Score</h3>
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-medium text-gray-900">
              {data.crisisMetrics.userSafetyScore}%
            </div>
            <p className="text-sm text-gray-600">
              Based on crisis resource accessibility
            </p>
          </div>
        </div>

        {/* Crisis Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Crisis Users</h3>
            <span className="text-2xl">🚨</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-medium text-gray-900">
              {data.userContext.crisisUsers}
            </div>
            <p className="text-sm text-gray-600">
              Users currently in crisis mode
            </p>
          </div>
        </div>

        {/* Mobile Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Mobile Users</h3>
            <span className="text-2xl">📱</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-medium text-gray-900">
              {formatPercentage(data.userContext.mobileUsers / data.userContext.totalUsers)}
            </div>
            <p className="text-sm text-gray-600">
              {data.userContext.mobileUsers} of {data.userContext.totalUsers} users
            </p>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Critical Alerts</h3>
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-medium text-red-600">
              {data.alerts.critical}
            </div>
            <p className="text-sm text-gray-600">
              Requiring immediate attention
            </p>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">
            📊 Core Web Vitals (Trauma-Informed Thresholds)
          </h2>
          <p className="text-gray-600 mt-1">
            Stricter thresholds for vulnerable user populations
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(data.coreWebVitals).map(([key, metric]) => (
              <div key={key} className={`p-4 rounded-lg border ${getRatingColor(metric.rating)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium uppercase">{key}</h4>
                  <span>{getTrendIcon(metric.trend)}</span>
                </div>
                <div className="text-2xl font-medium">
                  {key === 'cls' ? metric.value.toFixed(3) : formatTime(metric.value)}
                </div>
                <div className="text-xs mt-1">
                  Rating: {metric.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crisis Resource Performance */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">
            🚨 Crisis Resource Performance
          </h2>
          <p className="text-gray-600 mt-1">
            <3 second loading requirement for life-saving resources
          </p>
        </div>
        
        <div className="p-6">
          {Object.keys(data.crisisMetrics.resourceLoadTimes).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No crisis resources accessed yet
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(data.crisisMetrics.resourceLoadTimes).map(([resource, time]) => (
                <div key={resource} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {resource.split('/').pop()}
                    </h4>
                    <p className="text-sm text-gray-600">{resource}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-medium ${
                      time > 3000 ? 'text-red-600' : 
                      time > 2000 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {formatTime(time)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Target: <3s
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Trauma Metrics */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">
            📱 Mobile Trauma-Informed Metrics
          </h2>
          <p className="text-gray-600 mt-1">
            Specialized metrics for users with motor impairments and crisis situations
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Touch Responsiveness</h4>
              <div className="text-2xl font-medium text-gray-900">
                {formatTime(data.mobileMetrics.touchResponsiveness)}
              </div>
              <div className="text-xs text-gray-600">Target: <100ms</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Battery Impact</h4>
              <div className="text-2xl font-medium text-gray-900">
                {formatPercentage(data.mobileMetrics.batteryImpact)}
              </div>
              <div className="text-xs text-gray-600">Remaining battery</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Memory Pressure</h4>
              <div className="text-2xl font-medium text-gray-900">
                {formatPercentage(data.mobileMetrics.memoryPressure)}
              </div>
              <div className="text-xs text-gray-600">Target: <70%</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility Score</h4>
              <div className="text-2xl font-medium text-gray-900">
                {formatPercentage(data.mobileMetrics.accessibilityCompliance)}
              </div>
              <div className="text-xs text-gray-600">WCAG compliance</div>
            </div>
          </div>
          
          {data.mobileMetrics.tremorsCompensation && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <span className="text-yellow-800 font-medium">
                  Tremors compensation active - User may need larger touch targets
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Alerts */}
      {data.alerts.lastAlert && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-gray-900">
              🚨 Recent Performance Alerts
            </h2>
          </div>
          
          <div className="p-6">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">
                    {data.alerts.lastAlert.message}
                  </p>
                  <p className="text-sm text-red-600">
                    Type: {data.alerts.lastAlert.type}
                  </p>
                </div>
                <div className="text-sm text-red-600">
                  {new Date(data.alerts.lastAlert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}