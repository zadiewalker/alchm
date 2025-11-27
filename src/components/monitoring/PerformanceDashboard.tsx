/**
 * CRITICAL LIFE-SAFETY SYSTEM: Performance Monitoring Dashboard
 * 
 * This dashboard provides real-time visibility into system performance
 * with focus on crisis-critical metrics. Designed for immediate
 * identification of issues that could impact user safety.
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  getPerformanceMonitor, 
  type PerformanceMetric, 
  type PerformanceAlert,
  CRISIS_PERFORMANCE_THRESHOLDS 
} from '@/lib/monitoring/real-time-performance-monitor';
import { 
  getRollbackSystem, 
  type RollbackEvent,
  isInEmergencyMode 
} from '@/lib/monitoring/automated-rollback-system';
import { 
  getBudgetEnforcer, 
  type BudgetViolation 
} from '@/lib/monitoring/performance-budget-enforcer';
import { 
  getCrisisResourceMonitor, 
  type ResourceAlert,
  getCrisisResourceHealth 
} from '@/lib/monitoring/crisis-resource-monitor';

interface PerformanceDashboardProps {
  compactMode?: boolean;
  showOnlyCritical?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface MetricCardProps {
  title: string;
  value: number | string;
  threshold?: number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical' | 'emergency';
  description?: string;
  isCrisisMetric?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  threshold, 
  unit = '', 
  status, 
  description,
  isCrisisMetric = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'emergency': return 'text-red-800 bg-red-100 border-red-300 animate-pulse';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🔴';
      case 'emergency': return '🚨';
      default: return '❔';
    }
  };

  return (
    <Card className={`relative ${getStatusColor(status)} ${isCrisisMetric ? 'ring-2 ring-blue-200' : ''}`}>
      {isCrisisMetric && (
        <div className="absolute top-2 right-2 text-blue-600 font-medium text-xs">
          CRISIS
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <span className="text-lg">{getStatusIcon(status)}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium">
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="text-sm font-normal ml-1">{unit}</span>
        </div>
        {threshold && (
          <div className="text-xs text-gray-500 mt-1">
            Threshold: {threshold.toLocaleString()}{unit}
          </div>
        )}
        {description && (
          <div className="text-xs text-gray-600 mt-2">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AlertsList: React.FC<{ alerts: (PerformanceAlert | ResourceAlert | BudgetViolation)[], title: string }> = ({ 
  alerts, 
  title 
}) => {
  const sortedAlerts = alerts.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'WARNING': return 'text-yellow-600 bg-yellow-50';
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'EMERGENCY': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedAlerts.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No recent alerts
            </div>
          ) : (
            sortedAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} text-sm`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">
                    {'metric' in alert ? alert.metric : ('resourceId' in alert ? alert.resourceId : alert.type)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="mt-1">
                  {'message' in alert ? alert.message : 
                   ('currentValue' in alert ? `${alert.currentValue} > ${alert.budgetLimit}` : 
                    `${alert.url || ''}`)}
                </div>
                {alert.isCrisisContext && (
                  <div className="mt-1 text-blue-600 font-medium text-xs">
                    🆘 CRISIS CONTEXT
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RollbackHistory: React.FC<{ events: RollbackEvent[] }> = ({ events }) => {
  const recentEvents = events.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Rollback Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentEvents.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No recent rollback events
            </div>
          ) : (
            recentEvents.map((event) => (
              <div 
                key={event.id}
                className={`p-3 rounded-lg border ${
                  event.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">
                    {event.trigger} - {event.severity}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm mt-1">
                  Actions: {event.actionsTaken.join(', ')}
                </div>
                {event.errorMessage && (
                  <div className="text-red-600 text-xs mt-1">
                    Error: {event.errorMessage}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  compactMode = false,
  showOnlyCritical = false,
  autoRefresh = true,
  refreshInterval = 30000
}) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([]);
  const [budgetViolations, setBudgetViolations] = useState<BudgetViolation[]>([]);
  const [resourceAlerts, setResourceAlerts] = useState<ResourceAlert[]>([]);
  const [rollbackEvents, setRollbackEvents] = useState<RollbackEvent[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshData = async () => {
    try {
      const performanceMonitor = getPerformanceMonitor();
      const budgetEnforcer = getBudgetEnforcer();
      const rollbackSystem = getRollbackSystem();
      const crisisMonitor = getCrisisResourceMonitor();

      // Get recent data
      const [metrics, alerts, violations, resourceAlerts] = await Promise.all([
        performanceMonitor.getRecentMetrics(300000), // Last 5 minutes
        performanceMonitor.getRecentAlerts(3600000), // Last hour
        budgetEnforcer.getViolations(3600000), // Last hour
        crisisMonitor.getAlerts(3600000) // Last hour
      ]);

      setPerformanceMetrics(metrics);
      setPerformanceAlerts(alerts);
      setBudgetViolations(violations);
      setResourceAlerts(resourceAlerts);
      setRollbackEvents(rollbackSystem.getRollbackHistory());
      setIsEmergency(isInEmergencyMode());
      setLastUpdate(new Date());
    } catch (error) {
      console.error('[PERFORMANCE DASHBOARD] Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    refreshData();

    if (autoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Calculate current performance status
  const performanceStatus = useMemo(() => {
    const latestMetrics = new Map<string, PerformanceMetric>();
    
    // Get latest value for each metric type
    performanceMetrics.forEach(metric => {
      const existing = latestMetrics.get(metric.type);
      if (!existing || metric.timestamp > existing.timestamp) {
        latestMetrics.set(metric.type, metric);
      }
    });

    const getMetricStatus = (metric: PerformanceMetric): 'healthy' | 'warning' | 'critical' | 'emergency' => {
      const threshold = CRISIS_PERFORMANCE_THRESHOLDS[metric.type as keyof typeof CRISIS_PERFORMANCE_THRESHOLDS];
      if (!threshold) return 'healthy';

      if (metric.value > threshold * 2) return 'emergency';
      if (metric.value > threshold * 1.5) return 'critical';
      if (metric.value > threshold) return 'warning';
      return 'healthy';
    };

    return {
      lcp: latestMetrics.get('LCP'),
      fid: latestMetrics.get('FID'),
      cls: latestMetrics.get('CLS'),
      tti: latestMetrics.get('TTI'),
      crisisResourceLoad: latestMetrics.get('CRISIS_RESOURCE_LOAD'),
      memoryUsage: latestMetrics.get('MEMORY_USAGE'),
      getStatus: getMetricStatus
    };
  }, [performanceMetrics]);

  // Crisis resource health
  const crisisResourceHealth = getCrisisResourceHealth();

  // Filter alerts for display
  const filteredAlerts = showOnlyCritical 
    ? [...performanceAlerts, ...resourceAlerts, ...budgetViolations].filter(alert => 
        alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY'
      )
    : [...performanceAlerts, ...resourceAlerts, ...budgetViolations];

  const criticalIssuesCount = filteredAlerts.filter(alert => 
    alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY'
  ).length;

  if (compactMode) {
    return (
      <Card className={`${isEmergency ? 'border-red-500 bg-red-50' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Performance Status</span>
            {isEmergency && <span className="text-red-600 animate-pulse">🚨 EMERGENCY</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-lg">
                {performanceStatus.lcp ? Math.round(performanceStatus.lcp.value) : '—'}ms
              </div>
              <div>LCP</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-lg">{criticalIssuesCount}</div>
              <div>Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-lg">
                {crisisResourceHealth.healthyResources}/{crisisResourceHealth.totalResources}
              </div>
              <div>Resources OK</div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Mode Banner */}
      {isEmergency && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 text-red-800">
              <span className="text-2xl animate-pulse">🚨</span>
              <div className="text-center">
                <div className="font-medium text-lg">EMERGENCY MODE ACTIVE</div>
                <div className="text-sm">Automated performance protection enabled</div>
              </div>
              <span className="text-2xl animate-pulse">🚨</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Performance Monitoring Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button 
            onClick={refreshData}
            size="sm"
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h2 className="text-xl font-medium mb-4">Core Web Vitals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Largest Contentful Paint"
            value={performanceStatus.lcp ? Math.round(performanceStatus.lcp.value) : 0}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.LCP_CRITICAL}
            unit="ms"
            status={performanceStatus.lcp ? performanceStatus.getStatus(performanceStatus.lcp) : 'healthy'}
            description="Time to render largest content element"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="First Input Delay"
            value={performanceStatus.fid ? Math.round(performanceStatus.fid.value) : 0}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.FID_CRITICAL}
            unit="ms"
            status={performanceStatus.fid ? performanceStatus.getStatus(performanceStatus.fid) : 'healthy'}
            description="Time to first user interaction"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="Cumulative Layout Shift"
            value={performanceStatus.cls ? performanceStatus.cls.value.toFixed(3) : '0.000'}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.CLS_CRITICAL}
            unit=""
            status={performanceStatus.cls ? performanceStatus.getStatus(performanceStatus.cls) : 'healthy'}
            description="Visual stability metric"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="Time to Interactive"
            value={performanceStatus.tti ? Math.round(performanceStatus.tti.value) : 0}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.TTI_CRITICAL}
            unit="ms"
            status={performanceStatus.tti ? performanceStatus.getStatus(performanceStatus.tti) : 'healthy'}
            description="Time until fully interactive"
            isCrisisMetric={true}
          />
        </div>
      </div>

      {/* Crisis Resources */}
      <div>
        <h2 className="text-xl font-medium mb-4">Crisis Resources Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Healthy Resources"
            value={`${crisisResourceHealth.healthyResources}/${crisisResourceHealth.totalResources}`}
            status={crisisResourceHealth.downResources > 0 ? 'emergency' : 
                   crisisResourceHealth.failingResources > 0 ? 'critical' :
                   crisisResourceHealth.degradedResources > 0 ? 'warning' : 'healthy'}
            description="Crisis resources operational"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="Average Response Time"
            value={Math.round(crisisResourceHealth.averageResponseTime)}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME}
            unit="ms"
            status={crisisResourceHealth.averageResponseTime > CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME * 2 ? 'emergency' :
                   crisisResourceHealth.averageResponseTime > CRISIS_PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD_TIME ? 'critical' : 'healthy'}
            description="Average resource load time"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="Critical Issues"
            value={crisisResourceHealth.criticalIssues}
            status={crisisResourceHealth.criticalIssues > 5 ? 'emergency' :
                   crisisResourceHealth.criticalIssues > 2 ? 'critical' :
                   crisisResourceHealth.criticalIssues > 0 ? 'warning' : 'healthy'}
            description="Critical alerts in last hour"
            isCrisisMetric={true}
          />
          
          <MetricCard
            title="Memory Usage"
            value={performanceStatus.memoryUsage ? Math.round(performanceStatus.memoryUsage.value / 1024 / 1024) : 0}
            threshold={CRISIS_PERFORMANCE_THRESHOLDS.MEMORY_USAGE_CRITICAL / 1024 / 1024}
            unit="MB"
            status={performanceStatus.memoryUsage ? performanceStatus.getStatus(performanceStatus.memoryUsage) : 'healthy'}
            description="Current memory usage"
          />
        </div>
      </div>

      {/* Alerts and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList 
          alerts={filteredAlerts} 
          title={`Recent Alerts (${filteredAlerts.length})`}
        />
        
        <RollbackHistory events={rollbackEvents} />
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-2xl text-green-600">
                {performanceStatus.lcp && performanceStatus.getStatus(performanceStatus.lcp) === 'healthy' ? '✅' : '⚠️'}
              </div>
              <div>Performance</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-2xl text-green-600">
                {crisisResourceHealth.downResources === 0 ? '✅' : '🚨'}
              </div>
              <div>Crisis Resources</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-2xl text-green-600">
                {budgetViolations.filter(v => v.violationType === 'EMERGENCY').length === 0 ? '✅' : '🚨'}
              </div>
              <div>Budget Compliance</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium text-2xl text-green-600">
                {isEmergency ? '🚨' : '✅'}
              </div>
              <div>Emergency Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;