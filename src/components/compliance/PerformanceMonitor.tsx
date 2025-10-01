'use client';

import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Clock, Cpu, HardDrive, Zap } from 'lucide-react';

interface PerformanceMetrics {
  memoryUsage: number;
  loadTime: number;
  bundleSize: number;
  crashRate: number;
  renderTime: number;
  networkLatency: number;
  batteryImpact: 'low' | 'medium' | 'high';
  lastChecked: Date;
}

interface PerformanceThresholds {
  maxMemoryMB: number;
  maxLoadTimeMs: number;
  maxBundleSizeMB: number;
  maxCrashRate: number;
  maxRenderTimeMs: number;
  maxNetworkLatencyMs: number;
}

const APP_STORE_THRESHOLDS: PerformanceThresholds = {
  maxMemoryMB: 50,
  maxLoadTimeMs: 2000,
  maxBundleSizeMB: 2,
  maxCrashRate: 0.001, // 0.1%
  maxRenderTimeMs: 16.67, // 60 FPS
  maxNetworkLatencyMs: 3000
};

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  const measurePerformance = useCallback(async (): Promise<PerformanceMetrics> => {
    const startTime = performance.now();
    
    // Memory usage (approximation for web)
    const memoryInfo = (performance as any).memory;
    const memoryUsage = memoryInfo ? 
      Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)) : 0;

    // Load time from Navigation API
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigationEntry ? 
      Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart) : 0;

    // Bundle size estimation
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalSize = resources
      .filter(r => r.name.includes('.js') || r.name.includes('.css'))
      .reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const bundleSize = Math.round(totalSize / (1024 * 1024) * 100) / 100;

    // Render time measurement
    const renderEndTime = performance.now();
    const renderTime = Math.round(renderEndTime - startTime);

    // Network latency simulation
    const networkStart = performance.now();
    try {
      await fetch('/api/health/ping', { method: 'HEAD' });
    } catch (error) {
      console.warn('Network test failed:', error);
    }
    const networkLatency = Math.round(performance.now() - networkStart);

    // Battery impact estimation (simplified)
    const batteryImpact: 'low' | 'medium' | 'high' = 
      memoryUsage > 30 || renderTime > 20 ? 'high' :
      memoryUsage > 15 || renderTime > 10 ? 'medium' : 'low';

    // Crash rate (would be tracked over time in production)
    const crashRate = 0;

    return {
      memoryUsage,
      loadTime,
      bundleSize,
      crashRate,
      renderTime,
      networkLatency,
      batteryImpact,
      lastChecked: new Date()
    };
  }, []);

  const checkThresholds = useCallback((metrics: PerformanceMetrics): string[] => {
    const newAlerts: string[] = [];

    if (metrics.memoryUsage > APP_STORE_THRESHOLDS.maxMemoryMB) {
      newAlerts.push(`Memory usage (${metrics.memoryUsage}MB) exceeds App Store limit (${APP_STORE_THRESHOLDS.maxMemoryMB}MB)`);
    }

    if (metrics.loadTime > APP_STORE_THRESHOLDS.maxLoadTimeMs) {
      newAlerts.push(`Load time (${metrics.loadTime}ms) exceeds App Store limit (${APP_STORE_THRESHOLDS.maxLoadTimeMs}ms)`);
    }

    if (metrics.bundleSize > APP_STORE_THRESHOLDS.maxBundleSizeMB) {
      newAlerts.push(`Bundle size (${metrics.bundleSize}MB) exceeds App Store limit (${APP_STORE_THRESHOLDS.maxBundleSizeMB}MB)`);
    }

    if (metrics.crashRate > APP_STORE_THRESHOLDS.maxCrashRate) {
      newAlerts.push(`Crash rate (${(metrics.crashRate * 100).toFixed(3)}%) exceeds App Store limit (${(APP_STORE_THRESHOLDS.maxCrashRate * 100).toFixed(1)}%)`);
    }

    if (metrics.renderTime > APP_STORE_THRESHOLDS.maxRenderTimeMs) {
      newAlerts.push(`Render time (${metrics.renderTime}ms) may impact 60 FPS target`);
    }

    if (metrics.networkLatency > APP_STORE_THRESHOLDS.maxNetworkLatencyMs) {
      newAlerts.push(`Network latency (${metrics.networkLatency}ms) may impact user experience`);
    }

    if (metrics.batteryImpact === 'high') {
      newAlerts.push('High battery impact detected - consider optimization');
    }

    return newAlerts;
  }, []);

  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    try {
      const newMetrics = await measurePerformance();
      setMetrics(newMetrics);
      
      const newAlerts = checkThresholds(newMetrics);
      setAlerts(newAlerts);

      // Log to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_monitor', {
          memory_usage: newMetrics.memoryUsage,
          load_time: newMetrics.loadTime,
          bundle_size: newMetrics.bundleSize,
          alerts_count: newAlerts.length
        });
      }
    } catch (error) {
      console.error('Performance monitoring failed:', error);
      setAlerts(['Performance monitoring failed - check console for details']);
    } finally {
      setIsMonitoring(false);
    }
  }, [measurePerformance, checkThresholds]);

  useEffect(() => {
    // Start monitoring on component mount
    startMonitoring();

    // Set up periodic monitoring
    const interval = setInterval(startMonitoring, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [startMonitoring]);

  const getStatusColor = (value: number, threshold: number, reverse = false): string => {
    const isGood = reverse ? value > threshold : value <= threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (value: number, threshold: number, reverse = false) => {
    const isGood = reverse ? value > threshold : value <= threshold;
    return isGood ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Measuring performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">App Store Performance Monitor</h3>
        </div>
        <button
          onClick={startMonitoring}
          disabled={isMonitoring}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isMonitoring ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Monitoring...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Refresh Metrics
            </>
          )}
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-800">Performance Alerts</h4>
          </div>
          <ul className="space-y-1">
            {alerts.map((alert, index) => (
              <li key={index} className="text-sm text-red-700">• {alert}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
            </div>
            {getStatusIcon(metrics.memoryUsage, APP_STORE_THRESHOLDS.maxMemoryMB)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(metrics.memoryUsage, APP_STORE_THRESHOLDS.maxMemoryMB)}`}>
              {metrics.memoryUsage}
            </span>
            <span className="text-sm text-gray-500">MB</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Limit: {APP_STORE_THRESHOLDS.maxMemoryMB}MB
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Load Time</span>
            </div>
            {getStatusIcon(metrics.loadTime, APP_STORE_THRESHOLDS.maxLoadTimeMs)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(metrics.loadTime, APP_STORE_THRESHOLDS.maxLoadTimeMs)}`}>
              {metrics.loadTime}
            </span>
            <span className="text-sm text-gray-500">ms</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Limit: {APP_STORE_THRESHOLDS.maxLoadTimeMs}ms
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Bundle Size</span>
            </div>
            {getStatusIcon(metrics.bundleSize, APP_STORE_THRESHOLDS.maxBundleSizeMB)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(metrics.bundleSize, APP_STORE_THRESHOLDS.maxBundleSizeMB)}`}>
              {metrics.bundleSize}
            </span>
            <span className="text-sm text-gray-500">MB</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Limit: {APP_STORE_THRESHOLDS.maxBundleSizeMB}MB
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Crash Rate</span>
            </div>
            {getStatusIcon(metrics.crashRate, APP_STORE_THRESHOLDS.maxCrashRate)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(metrics.crashRate, APP_STORE_THRESHOLDS.maxCrashRate)}`}>
              {(metrics.crashRate * 100).toFixed(3)}
            </span>
            <span className="text-sm text-gray-500">%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Limit: {(APP_STORE_THRESHOLDS.maxCrashRate * 100).toFixed(1)}%
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Render Time</span>
            </div>
            {getStatusIcon(metrics.renderTime, APP_STORE_THRESHOLDS.maxRenderTimeMs)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${getStatusColor(metrics.renderTime, APP_STORE_THRESHOLDS.maxRenderTimeMs)}`}>
              {metrics.renderTime}
            </span>
            <span className="text-sm text-gray-500">ms</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: &lt;{APP_STORE_THRESHOLDS.maxRenderTimeMs.toFixed(1)}ms (60 FPS)
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Battery Impact</span>
            </div>
            {metrics.batteryImpact === 'low' ? 
              <CheckCircle className="w-4 h-4 text-green-600" /> : 
              <AlertTriangle className="w-4 h-4 text-red-600" />
            }
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-bold ${
              metrics.batteryImpact === 'low' ? 'text-green-600' : 
              metrics.batteryImpact === 'medium' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.batteryImpact.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: Low impact
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Last checked: {metrics.lastChecked.toLocaleTimeString()}
      </div>
    </div>
  );
}