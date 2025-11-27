'use client';

/**
 * ALCHM Performance Monitor Component
 * 
 * Real-time performance monitoring with trauma-informed thresholds
 * Displays performance metrics and alerts for crisis resource accessibility
 */

import React, { useEffect, useState, useCallback } from 'react';
import { realUserMonitoring, CrisisPerformanceMetric } from '@/lib/real-user-monitoring';

interface PerformanceState {
  metrics: CrisisPerformanceMetric[];
  crisisResourcePerformance: Record<string, number>;
  alerts: PerformanceAlert[];
  isMonitoring: boolean;
}

interface PerformanceAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
  metric?: string;
  value?: number;
}

export default function PerformanceMonitor() {
  const [state, setState] = useState<PerformanceState>({
    metrics: [],
    crisisResourcePerformance: {},
    alerts: [],
    isMonitoring: false
  });

  const [isVisible, setIsVisible] = useState(false);

  // Handle performance metric updates
  const handleMetricUpdate = useCallback((metric: CrisisPerformanceMetric) => {
    setState(prev => ({
      ...prev,
      metrics: [...prev.metrics.slice(-19), metric], // Keep last 20 metrics
    }));

    // Generate alerts for poor performance
    if (metric.rating === 'poor') {
      const alert: PerformanceAlert = {
        id: `alert-${Date.now()}`,
        type: 'critical',
        message: `Poor ${metric.name}: ${Math.round(metric.value)}ms (Crisis Level: ${metric.crisisLevel})`,
        timestamp: Date.now(),
        metric: metric.name,
        value: metric.value
      };

      setState(prev => ({
        ...prev,
        alerts: [...prev.alerts.slice(-9), alert] // Keep last 10 alerts
      }));
    }
  }, []);

  // Initialize monitoring
  useEffect(() => {
    let mounted = true;

    const initializeMonitoring = async () => {
      try {
        await realUserMonitoring.initialize();
        
        if (mounted) {
          realUserMonitoring.onAlert(handleMetricUpdate);
          
          setState(prev => ({
            ...prev,
            isMonitoring: true,
            crisisResourcePerformance: realUserMonitoring.getCrisisResourcePerformance()
          }));
        }
      } catch (error) {
        console.error('Performance monitoring initialization failed:', error);
      }
    };

    initializeMonitoring();

    // Update crisis resource performance every 5 seconds
    const performanceInterval = setInterval(() => {
      if (mounted) {
        setState(prev => ({
          ...prev,
          crisisResourcePerformance: realUserMonitoring.getCrisisResourcePerformance()
        }));
      }
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(performanceInterval);
      realUserMonitoring.cleanup();
    };
  }, [handleMetricUpdate]);

  // Toggle visibility (development/debug mode)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Only show in development or when explicitly enabled
  const shouldShow = process.env.NODE_ENV === 'development' || 
                   localStorage.getItem('alchm-show-performance') === 'true' ||
                   isVisible;

  if (!shouldShow || !state.isMonitoring) {
    return null;
  }

  const getMetricRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'info': return 'border-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const checkCrisisResources = async () => {
    await realUserMonitoring.checkCrisisResourcePerformance();
    setState(prev => ({
      ...prev,
      crisisResourcePerformance: realUserMonitoring.getCrisisResourcePerformance()
    }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">
            🏥 ALCHM Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Trauma-informed performance tracking
        </p>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Crisis Resource Performance */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              🚨 Crisis Resources
            </h4>
            <button
              onClick={checkCrisisResources}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Check Now
            </button>
          </div>
          
          {Object.keys(state.crisisResourcePerformance).length === 0 ? (
            <p className="text-xs text-gray-500">No crisis resources accessed yet</p>
          ) : (
            <div className="space-y-1">
              {Object.entries(state.crisisResourcePerformance).map(([resource, time]) => (
                <div key={resource} className="flex justify-between text-xs">
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {resource.split('/').pop()}
                  </span>
                  <span className={`font-mono ${time > 3000 ? 'text-red-600 font-medium' : time > 2000 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {Math.round(time)}ms
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Metrics */}
        <div className="p-3 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            📊 Recent Metrics
          </h4>
          
          {state.metrics.length === 0 ? (
            <p className="text-xs text-gray-500">No metrics collected yet</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {state.metrics.slice(-5).map((metric, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-gray-600 min-w-0 truncate">
                      {metric.name.toUpperCase()}
                    </span>
                    <span className={`px-1 py-0.5 rounded text-xs ${getMetricRatingColor(metric.rating)}`}>
                      {metric.rating}
                    </span>
                  </div>
                  <span className="font-mono text-gray-800 ml-2">
                    {Math.round(metric.value)}
                    {metric.name.includes('cls') ? '' : 'ms'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            🚨 Performance Alerts
          </h4>
          
          {state.alerts.length === 0 ? (
            <p className="text-xs text-green-600">✅ No performance issues detected</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {state.alerts.slice(-3).map(alert => (
                <div
                  key={alert.id}
                  className={`p-2 border rounded text-xs ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <p className="flex-1 min-w-0">
                      {alert.message}
                    </p>
                    <span className="text-xs opacity-75 ml-2">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            Metrics: {state.metrics.length} | Alerts: {state.alerts.length}
          </span>
          <span>
            Ctrl+Shift+P to toggle
          </span>
        </div>
      </div>
    </div>
  );
}

// Hook for accessing performance data in other components
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<CrisisPerformanceMetric[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        await realUserMonitoring.initialize();
        
        if (mounted) {
          setIsInitialized(true);
          
          realUserMonitoring.onAlert((metric) => {
            setMetrics(prev => [...prev.slice(-19), metric]);
          });
        }
      } catch (error) {
        console.error('Performance monitoring hook initialization failed:', error);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const getCrisisResourcePerformance = useCallback(() => {
    return realUserMonitoring.getCrisisResourcePerformance();
  }, []);

  const checkCrisisResources = useCallback(async () => {
    await realUserMonitoring.checkCrisisResourcePerformance();
  }, []);

  return {
    metrics,
    isInitialized,
    getCrisisResourcePerformance,
    checkCrisisResources
  };
}