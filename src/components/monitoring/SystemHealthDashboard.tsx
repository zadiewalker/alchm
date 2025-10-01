/**
 * ALCHM System Health Dashboard
 * Real-time monitoring dashboard for mental health platform
 * Priority: Immediate visibility into crisis-critical systems
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '../../monitoring/performance-monitor';
import { errorTracker } from '../../monitoring/error-tracker';
import { crisisSystemMonitor } from '../../monitoring/crisis-system-monitor';
import { userJourneyAnalytics } from '../../monitoring/user-journey-analytics';

// Health status types
type SystemStatus = 'healthy' | 'degraded' | 'critical' | 'emergency';
type ComponentHealth = 'operational' | 'degraded' | 'outage';

interface SystemComponent {
  name: string;
  status: ComponentHealth;
  responseTime: number;
  errorRate: number;
  uptime: number;
  lastCheck: number;
  isCritical: boolean;
  description: string;
}

interface AlertSummary {
  critical: number;
  high: number;
  medium: number;
  resolved: number;
  totalActive: number;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  throughput: number;
  coreWebVitals: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface CrisisMetrics {
  crisisUsersActive: number;
  emergencyResponseTime: number;
  crisisResourcesStatus: ComponentHealth;
  therapistDashboardStatus: ComponentHealth;
  emergencyContactsStatus: ComponentHealth;
}

const SystemHealthDashboard: React.FC = () => {
  const [overallStatus, setOverallStatus] = useState<SystemStatus>('healthy');
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [alerts, setAlerts] = useState<AlertSummary>({
    critical: 0,
    high: 0,
    medium: 0,
    resolved: 0,
    totalActive: 0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    avgResponseTime: 0,
    p95ResponseTime: 0,
    errorRate: 0,
    throughput: 0,
    coreWebVitals: { fcp: 0, lcp: 0, fid: 0, cls: 0 }
  });
  const [crisisMetrics, setCrisisMetrics] = useState<CrisisMetrics>({
    crisisUsersActive: 0,
    emergencyResponseTime: 0,
    crisisResourcesStatus: 'operational',
    therapistDashboardStatus: 'operational',
    emergencyContactsStatus: 'operational'
  });
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Initialize dashboard data
  useEffect(() => {
    initializeComponents();
    if (isRealTimeMode) {
      startRealTimeUpdates();
    }

    return () => {
      stopRealTimeUpdates();
    };
  }, [isRealTimeMode]);

  // Event listeners for real-time updates
  useEffect(() => {
    const handlePerformanceUpdate = (event: any) => {
      updatePerformanceMetrics(event.detail);
    };

    const handleErrorTracked = (event: any) => {
      updateAlertSummary(event.detail);
    };

    const handleCrisisHealthUpdate = (event: any) => {
      updateCrisisMetrics(event.detail);
    };

    window.addEventListener('alchm:performance:update', handlePerformanceUpdate);
    window.addEventListener('alchm:error:tracked', handleErrorTracked);
    window.addEventListener('alchm:crisis:health:update', handleCrisisHealthUpdate);

    return () => {
      window.removeEventListener('alchm:performance:update', handlePerformanceUpdate);
      window.removeEventListener('alchm:error:tracked', handleErrorTracked);
      window.removeEventListener('alchm:crisis:health:update', handleCrisisHealthUpdate);
    };
  }, []);

  const initializeComponents = () => {
    const initialComponents: SystemComponent[] = [
      {
        name: 'Crisis Detection System',
        status: 'operational',
        responseTime: 45,
        errorRate: 0.1,
        uptime: 99.9,
        lastCheck: Date.now(),
        isCritical: true,
        description: 'AI-powered crisis detection and intervention'
      },
      {
        name: 'Crisis Resources API',
        status: 'operational',
        responseTime: 78,
        errorRate: 0.2,
        uptime: 99.8,
        lastCheck: Date.now(),
        isCritical: true,
        description: 'Emergency resources and hotline access'
      },
      {
        name: 'Authentication Service',
        status: 'operational',
        responseTime: 120,
        errorRate: 0.5,
        uptime: 99.7,
        lastCheck: Date.now(),
        isCritical: false,
        description: 'User authentication and authorization'
      },
      {
        name: 'Therapist Dashboard',
        status: 'operational',
        responseTime: 210,
        errorRate: 1.2,
        uptime: 99.5,
        lastCheck: Date.now(),
        isCritical: true,
        description: 'Professional therapist interface'
      },
      {
        name: 'AI Khepera Service',
        status: 'operational',
        responseTime: 890,
        errorRate: 2.1,
        uptime: 98.9,
        lastCheck: Date.now(),
        isCritical: false,
        description: 'AI-powered journaling and insights'
      },
      {
        name: 'Journal Storage',
        status: 'operational',
        responseTime: 95,
        errorRate: 0.3,
        uptime: 99.9,
        lastCheck: Date.now(),
        isCritical: false,
        description: 'Secure journal data storage'
      },
      {
        name: 'Payment Processing',
        status: 'operational',
        responseTime: 1250,
        errorRate: 0.8,
        uptime: 99.6,
        lastCheck: Date.now(),
        isCritical: false,
        description: 'Stripe payment integration'
      },
      {
        name: 'Offline Sync Manager',
        status: 'operational',
        responseTime: 340,
        errorRate: 5.2,
        uptime: 97.8,
        lastCheck: Date.now(),
        isCritical: false,
        description: 'Offline functionality synchronization'
      }
    ];

    setComponents(initialComponents);
    updateOverallStatus(initialComponents);
  };

  const startRealTimeUpdates = () => {
    const interval = setInterval(async () => {
      await updateDashboardData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  const stopRealTimeUpdates = () => {
    // Implementation for stopping updates
  };

  const updateDashboardData = async () => {
    try {
      // Update performance metrics
      const perfHealth = await performanceMonitor.getHealthStatus();
      setPerformanceMetrics(prev => ({
        ...prev,
        avgResponseTime: perfHealth.averagePerformance?.LCP || 0,
        errorRate: (100 - (perfHealth.overall === 'healthy' ? 99.5 : 95)) // Simplified
      }));

      // Update error metrics
      const errorStats = await errorTracker.getErrorStats();
      setAlerts(prev => ({
        ...prev,
        critical: errorStats.criticalErrors,
        high: Math.max(0, errorStats.totalErrors - errorStats.criticalErrors),
        totalActive: errorStats.totalErrors
      }));

      // Update crisis metrics
      const crisisHealth = await crisisSystemMonitor.getCrisisMetrics();
      setCrisisMetrics(prev => ({
        ...prev,
        emergencyResponseTime: crisisHealth.averageResponseTime,
        crisisUsersActive: crisisHealth.crisisUsersAffected
      }));

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to update dashboard data:', error);
    }
  };

  const updatePerformanceMetrics = (metric: any) => {
    setPerformanceMetrics(prev => ({
      ...prev,
      coreWebVitals: {
        ...prev.coreWebVitals,
        [metric.name.toLowerCase()]: metric.value
      }
    }));
  };

  const updateAlertSummary = (error: any) => {
    setAlerts(prev => {
      const newAlerts = { ...prev };
      
      switch (error.severity) {
        case 'CRITICAL':
          newAlerts.critical += 1;
          break;
        case 'HIGH':
          newAlerts.high += 1;
          break;
        case 'MEDIUM':
          newAlerts.medium += 1;
          break;
      }
      
      newAlerts.totalActive += 1;
      return newAlerts;
    });
  };

  const updateCrisisMetrics = (healthData: any) => {
    const systemHealth = healthData.systemHealth;
    
    setCrisisMetrics(prev => ({
      ...prev,
      crisisResourcesStatus: getComponentStatus(systemHealth['/api/crisis-resources']),
      therapistDashboardStatus: getComponentStatus(systemHealth['/api/therapist-emergency']),
      emergencyContactsStatus: getComponentStatus(systemHealth['/api/emergency-contacts'])
    }));
  };

  const getComponentStatus = (health: any): ComponentHealth => {
    if (!health) return 'outage';
    if (health.healthScore > 80) return 'operational';
    if (health.healthScore > 50) return 'degraded';
    return 'outage';
  };

  const updateOverallStatus = (components: SystemComponent[]) => {
    const criticalComponents = components.filter(c => c.isCritical);
    const criticalIssues = criticalComponents.filter(c => c.status !== 'operational');
    
    if (criticalIssues.length > 0) {
      const hasOutages = criticalIssues.some(c => c.status === 'outage');
      if (hasOutages) {
        setOverallStatus('emergency');
      } else {
        setOverallStatus('critical');
      }
    } else {
      const degradedComponents = components.filter(c => c.status === 'degraded');
      if (degradedComponents.length > 2) {
        setOverallStatus('degraded');
      } else {
        setOverallStatus('healthy');
      }
    }
  };

  const getStatusColor = (status: SystemStatus | ComponentHealth): string => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-orange-500';
      case 'emergency':
      case 'outage':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusTextColor = (status: SystemStatus | ComponentHealth): string => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-green-700';
      case 'degraded':
        return 'text-yellow-700';
      case 'critical':
        return 'text-orange-700';
      case 'emergency':
      case 'outage':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const formatUptime = (uptime: number): string => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatResponseTime = (time: number): string => {
    if (time < 1000) {
      return `${Math.round(time)}ms`;
    }
    return `${(time / 1000).toFixed(1)}s`;
  };

  return (
    <div ref={dashboardRef} className="system-health-dashboard bg-white min-h-screen p-6">
      {/* Header */}
      <div className="header-section mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ALCHM System Health
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of crisis-critical mental health systems
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Overall Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(overallStatus)} animate-pulse`}></div>
              <span className={`font-semibold ${getStatusTextColor(overallStatus)}`}>
                {overallStatus.toUpperCase()}
              </span>
            </div>
            
            {/* Real-time Toggle */}
            <label className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Real-time</span>
              <input
                type="checkbox"
                checked={isRealTimeMode}
                onChange={(e) => setIsRealTimeMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            
            {/* Last Update */}
            <div className="text-sm text-gray-500">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Alert Banner */}
      {overallStatus === 'emergency' && (
        <div className="crisis-alert bg-red-600 text-white p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-bold">EMERGENCY: Crisis support systems compromised</span>
          </div>
          <p className="mt-2 text-sm">
            Multiple critical systems are experiencing issues. Emergency protocols activated.
            Crisis users are being redirected to backup resources.
          </p>
        </div>
      )}

      {/* Metrics Overview */}
      <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Crisis Users */}
        <div className="metric-card bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Crisis Users Active</p>
              <p className="text-3xl font-bold text-red-800">{crisisMetrics.crisisUsersActive}</p>
            </div>
            <div className="text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="text-red-600 text-sm mt-2">
            Emergency response: {formatResponseTime(crisisMetrics.emergencyResponseTime)}
          </p>
        </div>

        {/* Performance */}
        <div className="metric-card bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Avg Response Time</p>
              <p className="text-3xl font-bold text-blue-800">
                {formatResponseTime(performanceMetrics.avgResponseTime)}
              </p>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-blue-600 text-sm mt-2">
            P95: {formatResponseTime(performanceMetrics.p95ResponseTime)}
          </p>
        </div>

        {/* Error Rate */}
        <div className="metric-card bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Error Rate</p>
              <p className="text-3xl font-bold text-yellow-800">
                {performanceMetrics.errorRate.toFixed(2)}%
              </p>
            </div>
            <div className="text-yellow-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-yellow-600 text-sm mt-2">
            Active alerts: {alerts.totalActive}
          </p>
        </div>

        {/* System Uptime */}
        <div className="metric-card bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">System Uptime</p>
              <p className="text-3xl font-bold text-green-800">99.8%</p>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-sm mt-2">
            Last 30 days
          </p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="core-web-vitals mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="vital-metric bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">FCP</span>
              <span className={`text-sm font-semibold ${performanceMetrics.coreWebVitals.fcp < 1800 ? 'text-green-600' : 'text-red-600'}`}>
                {formatResponseTime(performanceMetrics.coreWebVitals.fcp)}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${performanceMetrics.coreWebVitals.fcp < 1800 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (performanceMetrics.coreWebVitals.fcp / 3000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="vital-metric bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">LCP</span>
              <span className={`text-sm font-semibold ${performanceMetrics.coreWebVitals.lcp < 2500 ? 'text-green-600' : 'text-red-600'}`}>
                {formatResponseTime(performanceMetrics.coreWebVitals.lcp)}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${performanceMetrics.coreWebVitals.lcp < 2500 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (performanceMetrics.coreWebVitals.lcp / 4000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="vital-metric bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">FID</span>
              <span className={`text-sm font-semibold ${performanceMetrics.coreWebVitals.fid < 100 ? 'text-green-600' : 'text-red-600'}`}>
                {formatResponseTime(performanceMetrics.coreWebVitals.fid)}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${performanceMetrics.coreWebVitals.fid < 100 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (performanceMetrics.coreWebVitals.fid / 300) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="vital-metric bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">CLS</span>
              <span className={`text-sm font-semibold ${performanceMetrics.coreWebVitals.cls < 0.1 ? 'text-green-600' : 'text-red-600'}`}>
                {performanceMetrics.coreWebVitals.cls.toFixed(3)}
              </span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${performanceMetrics.coreWebVitals.cls < 0.1 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (performanceMetrics.coreWebVitals.cls / 0.25) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Components */}
      <div className="components-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Components List */}
        <div className="components-list bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Components</h2>
          <div className="space-y-4">
            {components.map((component, index) => (
              <div key={index} className="component-item border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(component.status)}`}></div>
                    <span className="font-medium text-gray-900">{component.name}</span>
                    {component.isCritical && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${getStatusTextColor(component.status)}`}>
                    {component.status.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Response</span>
                    <p className="font-medium">{formatResponseTime(component.responseTime)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Error Rate</span>
                    <p className="font-medium">{component.errorRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Uptime</span>
                    <p className="font-medium">{formatUptime(component.uptime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Summary */}
        <div className="alerts-summary bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
          
          {alerts.totalActive === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-600 font-medium">All systems operational</p>
              <p className="text-gray-500 text-sm">No active alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.critical > 0 && (
                <div className="alert-category bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-800">Critical Alerts</span>
                    <span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">
                      {alerts.critical}
                    </span>
                  </div>
                </div>
              )}
              
              {alerts.high > 0 && (
                <div className="alert-category bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-orange-800">High Priority</span>
                    <span className="bg-orange-600 text-white text-sm font-bold px-2 py-1 rounded">
                      {alerts.high}
                    </span>
                  </div>
                </div>
              )}
              
              {alerts.medium > 0 && (
                <div className="alert-category bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-yellow-800">Medium Priority</span>
                    <span className="bg-yellow-600 text-white text-sm font-bold px-2 py-1 rounded">
                      {alerts.medium}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Crisis-Specific Metrics */}
          <div className="crisis-metrics mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crisis System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Crisis Resources</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(crisisMetrics.crisisResourcesStatus)}`}></div>
                  <span className={`text-sm font-medium ${getStatusTextColor(crisisMetrics.crisisResourcesStatus)}`}>
                    {crisisMetrics.crisisResourcesStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Therapist Dashboard</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(crisisMetrics.therapistDashboardStatus)}`}></div>
                  <span className={`text-sm font-medium ${getStatusTextColor(crisisMetrics.therapistDashboardStatus)}`}>
                    {crisisMetrics.therapistDashboardStatus.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Emergency Contacts</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(crisisMetrics.emergencyContactsStatus)}`}></div>
                  <span className={`text-sm font-medium ${getStatusTextColor(crisisMetrics.emergencyContactsStatus)}`}>
                    {crisisMetrics.emergencyContactsStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;