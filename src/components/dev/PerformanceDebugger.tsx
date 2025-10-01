// Performance Debugging Component for Dashboard Navigation
// Shows real-time performance metrics in development mode
'use client';

import { useEffect, useState } from 'react';
import { useDashboardPerformance } from '@/lib/dashboardPerformanceMonitor';
import type { DashboardNavigationMetrics, PerformanceAlert } from '@/lib/dashboardPerformanceMonitor';

interface PerformanceDebuggerProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function PerformanceDebugger({ 
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right' 
}: PerformanceDebuggerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<DashboardNavigationMetrics[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [currentVitals, setCurrentVitals] = useState<any>({});
  
  const { getNavigationMetrics, getPerformanceAlerts, getCoreWebVitalsSnapshots } = useDashboardPerformance();

  useEffect(() => {
    if (!enabled) return;

    const updateData = () => {
      setMetrics(getNavigationMetrics().slice(-5)); // Last 5 navigations
      setAlerts(getPerformanceAlerts().filter(alert => 
        Date.now() - alert.timestamp < 300000 // Last 5 minutes
      ));
      
      const vitalsSnapshots = getCoreWebVitalsSnapshots();
      const latest = vitalsSnapshots[vitalsSnapshots.length - 1];
      if (latest) {
        setCurrentVitals(latest);
      }
    };

    updateData();
    const interval = setInterval(updateData, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [enabled, getNavigationMetrics, getPerformanceAlerts, getCoreWebVitalsSnapshots]);

  if (!enabled) return null;

  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
  };

  const getVitalStatus = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const thresholds: Record<string, { good: number; needsImprovement: number }> = {
      cls: { good: 0.1, needsImprovement: 0.25 },
      fid: { good: 100, needsImprovement: 300 },
      inp: { good: 200, needsImprovement: 500 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fcp: { good: 1800, needsImprovement: 3000 },
      ttfb: { good: 800, needsImprovement: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'good': return '#00ff00';
      case 'needs-improvement': return '#ffaa00';
      case 'poor': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ff0000';
      case 'high': return '#ff6600';
      case 'medium': return '#ffaa00';
      case 'low': return '#00ff00';
      default: return '#ffffff';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxWidth: '400px',
        maxHeight: '500px',
        overflow: 'auto',
        zIndex: 10000,
        border: '1px solid #333',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #333',
        paddingBottom: '5px'
      }}>
        <span style={{ fontWeight: 'bold' }}>🎯 Performance Monitor</span>
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>

      {isVisible && (
        <>
          {/* Core Web Vitals */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>📈 Core Web Vitals</div>
            {Object.entries(currentVitals).map(([metric, value]) => {
              if (metric === 'timestamp' || metric === 'route' || !value) return null;
              const status = getVitalStatus(metric, value as number);
              const color = getStatusColor(status);
              const unit = metric === 'cls' ? '' : 'ms';
              
              return (
                <div key={metric} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>{metric.toUpperCase()}:</span>
                  <span style={{ color, fontWeight: 'bold' }}>
                    {typeof value === 'number' ? value.toFixed(metric === 'cls' ? 3 : 0) : 'N/A'}{unit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recent Navigation Metrics */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🧭 Recent Navigations</div>
            {metrics.length === 0 ? (
              <div style={{ color: '#888' }}>No recent navigations</div>
            ) : (
              metrics.map((metric, index) => (
                <div key={index} style={{ 
                  marginBottom: '5px', 
                  padding: '5px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>→ {metric.targetRoute}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Transition:</span>
                    <span style={{ 
                      color: metric.routeTransitionTime > 1200 ? '#ff6600' : '#00ff00',
                      fontWeight: 'bold'
                    }}>
                      {metric.routeTransitionTime.toFixed(0)}ms
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Click Response:</span>
                    <span style={{ 
                      color: metric.cardClickResponseTime > 50 ? '#ff6600' : '#00ff00',
                      fontWeight: 'bold'
                    }}>
                      {metric.cardClickResponseTime.toFixed(0)}ms
                    </span>
                  </div>
                  {metric.layoutShiftDuringNavigation > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>CLS:</span>
                      <span style={{ 
                        color: metric.layoutShiftDuringNavigation > 0.05 ? '#ff6600' : '#00ff00',
                        fontWeight: 'bold'
                      }}>
                        {metric.layoutShiftDuringNavigation.toFixed(3)}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Performance Alerts */}
          {alerts.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🚨 Recent Alerts</div>
              {alerts.slice(-3).map((alert, index) => (
                <div key={index} style={{ 
                  marginBottom: '5px', 
                  padding: '5px', 
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  borderLeft: `3px solid ${getSeverityColor(alert.severity)}`
                }}>
                  <div style={{ fontWeight: 'bold', color: getSeverityColor(alert.severity) }}>
                    {alert.type.replace('_', ' ').toUpperCase()} - {alert.severity.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '10px', color: '#ccc' }}>
                    {alert.metrics.targetRoute} • {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                  {alert.recommendations.length > 0 && (
                    <div style={{ fontSize: '10px', marginTop: '3px', color: '#aaa' }}>
                      💡 {alert.recommendations[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Memory Usage */}
          {metrics.length > 0 && metrics[0]?.memoryUsageAfterNavigation && metrics[0].memoryUsageAfterNavigation > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🧠 Memory</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Current:</span>
                <span>{(metrics[0].memoryUsageAfterNavigation / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div style={{ 
            fontSize: '10px', 
            color: '#888', 
            borderTop: '1px solid #333',
            paddingTop: '5px',
            marginTop: '5px'
          }}>
            💡 Monitor updates every 2s • Only visible in development
          </div>
        </>
      )}
    </div>
  );
}