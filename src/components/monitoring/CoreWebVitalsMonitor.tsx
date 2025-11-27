'use client';

// ALCHM Core Web Vitals Performance Monitor
// Trauma-informed performance tracking for vulnerable users

import React, { useEffect, useState, useCallback } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// ===== INTERFACES =====

interface WebVitalsMetrics {
  cls: number | null;    // Cumulative Layout Shift
  inp: number | null;    // Interaction to Next Paint
  fcp: number | null;    // First Contentful Paint
  lcp: number | null;    // Largest Contentful Paint
  ttfb: number | null;   // Time to First Byte
}

interface PerformanceAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  message: string;
  userAgent?: string;
  connectionType?: string;
}

interface TraumaInformedThresholds {
  crisisResources: {
    fcp: { good: 500, needsImprovement: 1000, poor: 2000 };
    lcp: { good: 1000, needsImprovement: 2000, poor: 4000 };
    inp: { good: 100, needsImprovement: 200, poor: 500 };
    cls: { good: 0.02, needsImprovement: 0.05, poor: 0.1 };
    ttfb: { good: 300, needsImprovement: 600, poor: 1000 };
  };
  generalApp: {
    fcp: { good: 1200, needsImprovement: 2000, poor: 4000 };
    lcp: { good: 2000, needsImprovement: 3000, poor: 6000 };
    inp: { good: 200, needsImprovement: 300, poor: 500 };
    cls: { good: 0.05, needsImprovement: 0.1, poor: 0.25 };
    ttfb: { good: 600, needsImprovement: 1000, poor: 2000 };
  };
}

// ===== TRAUMA-INFORMED PERFORMANCE THRESHOLDS =====

const TRAUMA_INFORMED_THRESHOLDS: TraumaInformedThresholds = {
  // Critical thresholds for crisis resources (life-saving functionality)
  crisisResources: {
    fcp: { good: 500, needsImprovement: 1000, poor: 2000 },     // Crisis resources must appear instantly
    lcp: { good: 1000, needsImprovement: 2000, poor: 4000 },   // Main crisis content loading
    inp: { good: 100, needsImprovement: 200, poor: 500 },        // Crisis buttons must respond immediately
    cls: { good: 0.02, needsImprovement: 0.05, poor: 0.1 },    // Perfect visual stability during crisis
    ttfb: { good: 300, needsImprovement: 600, poor: 1000 }     // Server response for crisis features
  },
  
  // General app performance for trauma-informed UX
  generalApp: {
    fcp: { good: 1200, needsImprovement: 2000, poor: 4000 },   // 3G network compatibility
    lcp: { good: 2000, needsImprovement: 3000, poor: 6000 },   // All devices including older smartphones
    inp: { good: 200, needsImprovement: 300, poor: 500 },       // Trauma-responsive interaction
    cls: { good: 0.05, needsImprovement: 0.1, poor: 0.25 },    // Visual stability for trauma users
    ttfb: { good: 600, needsImprovement: 1000, poor: 2000 }    // General server response
  }
};

// ===== MAIN COMPONENT =====

export default function CoreWebVitalsMonitor({ 
  mode = 'generalApp',
  onAlert,
  showDetailedMetrics = false
}: {
  mode?: 'crisisResources' | 'generalApp';
  onAlert?: (alert: PerformanceAlert) => void;
  showDetailedMetrics?: boolean;
}) {
  const [vitals, setVitals] = useState<WebVitalsMetrics>({
    cls: null,
    inp: null,
    fcp: null,
    lcp: null,
    ttfb: null
  });
  
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [performanceGrade, setPerformanceGrade] = useState<'A' | 'B' | 'C' | 'D' | 'F'>('A');

  // ===== PERFORMANCE MONITORING INITIALIZATION =====

  useEffect(() => {
    // Get network information if available
    if ('connection' in navigator) {
      setNetworkInfo((navigator as any).connection);
      
      // Listen for network changes
      (navigator as any).connection.addEventListener('change', () => {
        setNetworkInfo((navigator as any).connection);
      });
    }

    // Initialize Web Vitals monitoring
    initializeWebVitalsMonitoring();
    
    // Set up performance monitoring for crisis resources
    if (mode === 'crisisResources') {
      setupCrisisResourceMonitoring();
    }

    // Monitor for performance regressions
    const regressionMonitor = setInterval(() => {
      checkForPerformanceRegressions();
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(regressionMonitor);
    };
  }, [mode]);

  // ===== WEB VITALS MONITORING =====

  const initializeWebVitalsMonitoring = useCallback(() => {
    const thresholds = TRAUMA_INFORMED_THRESHOLDS[mode];

    // Cumulative Layout Shift - Critical for trauma users
    onCLS((metric: Metric) => {
      setVitals(prev => ({ ...prev, cls: metric.value }));
      
      const threshold = thresholds.cls;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      
      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'warning';
      }
      
      if (severity !== 'info') {
        const alert: PerformanceAlert = {
          id: `cls_${Date.now()}`,
          metric: 'Cumulative Layout Shift',
          value: metric.value,
          threshold: mode === 'crisisResources' ? threshold.good : threshold.needsImprovement,
          severity,
          timestamp: new Date(),
          message: severity === 'critical' 
            ? `Critical visual instability detected (${metric.value.toFixed(3)}). This may be traumatic for vulnerable users.`
            : `Layout shift detected (${metric.value.toFixed(3)}). Monitor for trauma-informed stability.`,
          userAgent: navigator.userAgent,
          connectionType: networkInfo?.effectiveType
        };
        
        addAlert(alert);
        sendPerformanceAlert('cls_threshold_exceeded', metric.value);
      }
    });

    // First Input Delay - Critical for crisis button responsiveness
    onFID((metric: Metric) => {
      setVitals(prev => ({ ...prev, fid: metric.value }));
      
      const threshold = thresholds.fid;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      
      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'warning';
      }
      
      if (severity !== 'info') {
        const alert: PerformanceAlert = {
          id: `fid_${Date.now()}`,
          metric: 'First Input Delay',
          value: metric.value,
          threshold: mode === 'crisisResources' ? threshold.good : threshold.needsImprovement,
          severity,
          timestamp: new Date(),
          message: severity === 'critical'
            ? `Critical input delay (${metric.value}ms). Crisis buttons may not respond properly for trauma users.`
            : `Input delay detected (${metric.value}ms). Monitor touch responsiveness.`,
          userAgent: navigator.userAgent,
          connectionType: networkInfo?.effectiveType
        };
        
        addAlert(alert);
        sendPerformanceAlert('fid_threshold_exceeded', metric.value);
      }
    });

    // First Contentful Paint - Crisis resources must appear immediately
    onFCP((metric: Metric) => {
      setVitals(prev => ({ ...prev, fcp: metric.value }));
      
      const threshold = thresholds.fcp;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      
      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'warning';
      }
      
      if (severity !== 'info') {
        const alert: PerformanceAlert = {
          id: `fcp_${Date.now()}`,
          metric: 'First Contentful Paint',
          value: metric.value,
          threshold: mode === 'crisisResources' ? threshold.good : threshold.needsImprovement,
          severity,
          timestamp: new Date(),
          message: severity === 'critical'
            ? `Critical loading delay (${metric.value}ms). Crisis resources may not appear fast enough.`
            : `Content loading slower than optimal (${metric.value}ms).`,
          userAgent: navigator.userAgent,
          connectionType: networkInfo?.effectiveType
        };
        
        addAlert(alert);
      }
    });

    // Largest Contentful Paint - Main content visibility
    onLCP((metric: Metric) => {
      setVitals(prev => ({ ...prev, lcp: metric.value }));
      
      const threshold = thresholds.lcp;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      
      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'warning';
      }
      
      if (severity !== 'info') {
        const alert: PerformanceAlert = {
          id: `lcp_${Date.now()}`,
          metric: 'Largest Contentful Paint',
          value: metric.value,
          threshold: mode === 'crisisResources' ? threshold.good : threshold.needsImprovement,
          severity,
          timestamp: new Date(),
          message: severity === 'critical'
            ? `Critical content loading delay (${metric.value}ms). Main content too slow for crisis users.`
            : `Main content loading slower than optimal (${metric.value}ms).`,
          userAgent: navigator.userAgent,
          connectionType: networkInfo?.effectiveType
        };
        
        addAlert(alert);
      }
    });

    // Time to First Byte - Server responsiveness
    onTTFB((metric: Metric) => {
      setVitals(prev => ({ ...prev, ttfb: metric.value }));
      
      const threshold = thresholds.ttfb;
      let severity: 'info' | 'warning' | 'critical' = 'info';
      
      if (metric.value > threshold.poor) {
        severity = 'critical';
      } else if (metric.value > threshold.needsImprovement) {
        severity = 'warning';
      }
      
      if (severity !== 'info') {
        const alert: PerformanceAlert = {
          id: `ttfb_${Date.now()}`,
          metric: 'Time to First Byte',
          value: metric.value,
          threshold: mode === 'crisisResources' ? threshold.good : threshold.needsImprovement,
          severity,
          timestamp: new Date(),
          message: severity === 'critical'
            ? `Critical server response delay (${metric.value}ms). Backend too slow for crisis features.`
            : `Server response slower than optimal (${metric.value}ms).`,
          userAgent: navigator.userAgent,
          connectionType: networkInfo?.effectiveType
        };
        
        addAlert(alert);
      }
    });
  }, [mode, networkInfo]);

  // ===== CRISIS RESOURCE MONITORING =====

  const setupCrisisResourceMonitoring = useCallback(() => {
    // Monitor crisis resource loading times
    const crisisButtons = document.querySelectorAll('[data-crisis-action]');
    
    crisisButtons.forEach((button) => {
      const startTime = performance.now();
      
      button.addEventListener('click', () => {
        const responseTime = performance.now() - startTime;
        
        if (responseTime > 100) {
          const alert: PerformanceAlert = {
            id: `crisis_response_${Date.now()}`,
            metric: 'Crisis Button Response',
            value: responseTime,
            threshold: 100,
            severity: responseTime > 200 ? 'critical' : 'warning',
            timestamp: new Date(),
            message: `Crisis button response time: ${responseTime.toFixed(1)}ms. Target: <100ms for trauma users.`,
            userAgent: navigator.userAgent
          };
          
          addAlert(alert);
        }
      });
    });

    // Monitor crisis resource loading performance
    const crisisResourceElements = document.querySelectorAll('[data-crisis-resource]');
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('crisis-resource')) {
          if (entry.duration > 1000) {
            const alert: PerformanceAlert = {
              id: `crisis_resource_${Date.now()}`,
              metric: 'Crisis Resource Loading',
              value: entry.duration,
              threshold: 1000,
              severity: entry.duration > 2000 ? 'critical' : 'warning',
              timestamp: new Date(),
              message: `Crisis resource loading time: ${entry.duration.toFixed(1)}ms. Target: <1000ms.`
            };
            
            addAlert(alert);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }, []);

  // ===== PERFORMANCE ALERT MANAGEMENT =====

  const addAlert = useCallback((alert: PerformanceAlert) => {
    setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    
    if (onAlert) {
      onAlert(alert);
    }
    
    // Log to console for development
    const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.warn(`${emoji} Performance Alert: ${alert.message}`);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_alert', {
        metric_name: alert.metric,
        metric_value: alert.value,
        severity: alert.severity,
        threshold: alert.threshold,
        mode: mode
      });
    }
  }, [onAlert, mode]);

  const sendPerformanceAlert = useCallback(async (alertType: string, value: number) => {
    try {
      // Send alert to monitoring service
      await fetch('/api/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType,
          value,
          mode,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          connectionType: networkInfo?.effectiveType,
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency
        })
      });
    } catch (error) {
      console.error('Failed to send performance alert:', error);
    }
  }, [mode, networkInfo]);

  // ===== PERFORMANCE GRADING =====

  const calculatePerformanceGrade = useCallback(() => {
    const thresholds = TRAUMA_INFORMED_THRESHOLDS[mode];
    let score = 100;
    
    // Grade each metric
    if (vitals.cls !== null) {
      if (vitals.cls > thresholds.cls.poor) score -= 30;
      else if (vitals.cls > thresholds.cls.needsImprovement) score -= 15;
    }
    
    if (vitals.fid !== null) {
      if (vitals.fid > thresholds.fid.poor) score -= 25;
      else if (vitals.fid > thresholds.fid.needsImprovement) score -= 10;
    }
    
    if (vitals.fcp !== null) {
      if (vitals.fcp > thresholds.fcp.poor) score -= 20;
      else if (vitals.fcp > thresholds.fcp.needsImprovement) score -= 10;
    }
    
    if (vitals.lcp !== null) {
      if (vitals.lcp > thresholds.lcp.poor) score -= 20;
      else if (vitals.lcp > thresholds.lcp.needsImprovement) score -= 10;
    }
    
    if (vitals.ttfb !== null) {
      if (vitals.ttfb > thresholds.ttfb.poor) score -= 5;
      else if (vitals.ttfb > thresholds.ttfb.needsImprovement) score -= 2;
    }
    
    // Determine grade
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }, [vitals, mode]);

  useEffect(() => {
    setPerformanceGrade(calculatePerformanceGrade());
  }, [vitals, calculatePerformanceGrade]);

  // ===== PERFORMANCE REGRESSION MONITORING =====

  const checkForPerformanceRegressions = useCallback(() => {
    // Check if performance has degraded significantly
    const criticalAlerts = alerts.filter(alert => 
      alert.severity === 'critical' && 
      Date.now() - alert.timestamp.getTime() < 60000 // Last minute
    );
    
    if (criticalAlerts.length >= 3) {
      console.error('🚨 PERFORMANCE REGRESSION DETECTED - Multiple critical alerts in last minute');
      
      // Notify technical team
      sendPerformanceAlert('performance_regression', criticalAlerts.length);
    }
  }, [alerts, sendPerformanceAlert]);

  // ===== RENDER COMPONENT =====

  if (!showDetailedMetrics) {
    return (
      <div className="web-vitals-compact">
        <div className={`performance-grade grade-${performanceGrade.toLowerCase()}`}>
          {performanceGrade}
        </div>
        {alerts.length > 0 && (
          <div className="alert-indicator">
            {alerts.filter(a => a.severity === 'critical').length > 0 && (
              <span className="critical-indicator">🚨</span>
            )}
            {alerts.filter(a => a.severity === 'warning').length > 0 && (
              <span className="warning-indicator">⚠️</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="web-vitals-monitor">
      <div className="monitor-header">
        <h3>Core Web Vitals - {mode === 'crisisResources' ? 'Crisis Resources' : 'General App'}</h3>
        <div className={`performance-grade grade-${performanceGrade.toLowerCase()}`}>
          Grade: {performanceGrade}
        </div>
      </div>

      <div className="vitals-grid">
        <VitalMetric
          name="First Contentful Paint"
          value={vitals.fcp}
          unit="ms"
          thresholds={TRAUMA_INFORMED_THRESHOLDS[mode].fcp}
          description="Time until crisis resources appear"
          critical={mode === 'crisisResources'}
        />
        
        <VitalMetric
          name="Largest Contentful Paint"
          value={vitals.lcp}
          unit="ms"
          thresholds={TRAUMA_INFORMED_THRESHOLDS[mode].lcp}
          description="Main content loading for all devices"
          critical={mode === 'crisisResources'}
        />
        
        <VitalMetric
          name="First Input Delay"
          value={vitals.fid}
          unit="ms"
          thresholds={TRAUMA_INFORMED_THRESHOLDS[mode].fid}
          description="Touch response for trauma users"
          critical={true}
        />
        
        <VitalMetric
          name="Cumulative Layout Shift"
          value={vitals.cls}
          unit=""
          thresholds={TRAUMA_INFORMED_THRESHOLDS[mode].cls}
          description="Visual stability during crisis"
          critical={true}
        />
        
        <VitalMetric
          name="Time to First Byte"
          value={vitals.ttfb}
          unit="ms"
          thresholds={TRAUMA_INFORMED_THRESHOLDS[mode].ttfb}
          description="Server response time"
          critical={mode === 'crisisResources'}
        />
        
        {networkInfo && (
          <NetworkInfo networkInfo={networkInfo} />
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="performance-alerts">
          <h4>Recent Performance Alerts</h4>
          <div className="alerts-list">
            {alerts.slice(0, 5).map(alert => (
              <PerformanceAlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function VitalMetric({ 
  name, 
  value, 
  unit, 
  thresholds, 
  description, 
  critical 
}: {
  name: string;
  value: number | null;
  unit: string;
  thresholds: { good: number; needsImprovement: number; poor: number };
  description: string;
  critical?: boolean;
}) {
  const getStatus = () => {
    if (value === null) return 'loading';
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  };
  
  const status = getStatus();
  
  return (
    <div className={`vital-metric ${status} ${critical ? 'critical-metric' : ''}`}>
      <div className="metric-header">
        <div className="metric-name">{name}</div>
        {critical && <span className="critical-badge">Critical</span>}
      </div>
      
      <div className="metric-value">
        {value !== null ? `${Math.round(value)}${unit}` : 'Loading...'}
      </div>
      
      <div className="metric-threshold">
        Target: {thresholds.good}{unit}
      </div>
      
      <div className="metric-description">{description}</div>
      
      <div className="metric-status-bar">
        <div 
          className="status-fill"
          style={{ 
            width: value !== null 
              ? `${Math.min(100, (thresholds.good / Math.max(value, thresholds.good)) * 100)}%`
              : '0%'
          }}
        />
      </div>
    </div>
  );
}

function NetworkInfo({ networkInfo }: { networkInfo: any }) {
  return (
    <div className="network-info vital-metric">
      <div className="metric-name">Network Info</div>
      <div className="network-details">
        <div>Type: {networkInfo.effectiveType}</div>
        {networkInfo.downlink && (
          <div>Speed: {networkInfo.downlink} Mbps</div>
        )}
        {networkInfo.rtt && (
          <div>Latency: {networkInfo.rtt}ms</div>
        )}
      </div>
    </div>
  );
}

function PerformanceAlertItem({ alert }: { alert: PerformanceAlert }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  };
  
  return (
    <div 
      className="performance-alert-item"
      style={{ borderLeftColor: getSeverityColor(alert.severity) }}
    >
      <div className="alert-header">
        <span className="alert-metric">{alert.metric}</span>
        <span className="alert-time">
          {alert.timestamp.toLocaleTimeString()}
        </span>
      </div>
      <div className="alert-message">{alert.message}</div>
      <div className="alert-details">
        Value: {alert.value.toFixed(1)} | Threshold: {alert.threshold}
      </div>
    </div>
  );
}

export { CoreWebVitalsMonitor };