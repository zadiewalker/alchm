'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface SystemStatus {
  component: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  lastChecked: number;
  incidents: Incident[];
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  startTime: number;
  endTime?: number;
  updates: IncidentUpdate[];
  affectedSystems: string[];
}

interface IncidentUpdate {
  id: string;
  timestamp: number;
  status: string;
  message: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'outage'>('operational');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Fetch status data
  const fetchStatusData = useCallback(async () => {
    try {
      const [statusResponse, incidentsResponse, metricsResponse] = await Promise.all([
        fetch('/api/status/systems'),
        fetch('/api/status/incidents'),
        fetch('/api/status/metrics')
      ]);

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSystemStatus(statusData);
        
        // Calculate overall status
        const hasOutage = statusData.some((s: SystemStatus) => s.status === 'outage');
        const hasDegraded = statusData.some((s: SystemStatus) => s.status === 'degraded');
        
        if (hasOutage) {
          setOverallStatus('outage');
        } else if (hasDegraded) {
          setOverallStatus('degraded');
        } else {
          setOverallStatus('operational');
        }
      }

      if (incidentsResponse.ok) {
        const incidentsData = await incidentsResponse.json();
        setIncidents(incidentsData);
      }

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setPerformanceMetrics(metricsData);
      }

      setLastUpdated(Date.now());
    } catch (error) {
      console.error('Failed to fetch status data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchStatusData();
    const interval = setInterval(fetchStatusData, 30000);
    return () => clearInterval(interval);
  }, [fetchStatusData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'outage': return 'text-red-600 bg-red-50 border-red-200';
      case 'maintenance': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅';
      case 'degraded': return '⚠️';
      case 'outage': return '❌';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'text-yellow-600 bg-yellow-100';
      case 'major': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateUptime = (uptime: number) => {
    return (uptime * 100).toFixed(3);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium text-gray-900">ALCHM System Status</h1>
              <p className="text-gray-600 mt-1">Real-time status and performance monitoring</p>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(overallStatus)}`}>
                {getStatusIcon(overallStatus)}
                <span className="ml-2 capitalize">{overallStatus}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {getTimeAgo(lastUpdated)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Current Incidents */}
        {incidents.filter(i => i.status !== 'resolved').length > 0 && (
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-medium text-red-800 mb-4">Active Incidents</h2>
            <div className="space-y-4">
              {incidents
                .filter(i => i.status !== 'resolved')
                .map(incident => (
                  <div key={incident.id} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{incident.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(incident.startTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      Affected systems: {incident.affectedSystems.join(', ')}
                    </div>
                    
                    {incident.updates.length > 0 && (
                      <div className="border-t border-gray-200 pt-3">
                        <div className="text-sm">
                          <span className="font-medium">Latest update:</span>
                          <span className="ml-2">{incident.updates[incident.updates.length - 1].message}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTimestamp(incident.updates[incident.updates.length - 1].timestamp)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* System Components */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">System Components</h2>
          <div className="space-y-4">
            {systemStatus.map(system => (
              <div key={system.component} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(system.status)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{system.component}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Uptime: {calculateUptime(system.uptime)}%</span>
                      <span>Response: {system.responseTime}ms</span>
                      <span>Last checked: {getTimeAgo(system.lastChecked)}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(system.status)}`}>
                  {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map(metric => (
              <div key={metric.name} className="text-center">
                <div className={`text-2xl font-medium ${getMetricStatusColor(metric.status)}`}>
                  {metric.value.toFixed(metric.name.includes('Time') ? 0 : 1)}{metric.unit}
                </div>
                <div className="text-sm text-gray-600 mt-1">{metric.name}</div>
                <div className="text-xs text-gray-500">
                  Target: &lt;{metric.target}{metric.unit}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (metric.target / Math.max(metric.value, metric.target)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Incident History */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Recent Incidents</h2>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <div className="text-4xl mb-2">✅</div>
              <p>No incidents in the last 30 days</p>
              <p className="text-sm">All systems have been operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.slice(0, 10).map(incident => (
                <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{incident.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        incident.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span>Started: {formatTimestamp(incident.startTime)}</span>
                    {incident.endTime && (
                      <span className="ml-4">
                        Resolved: {formatTimestamp(incident.endTime)}
                        <span className="ml-2 text-gray-500">
                          (Duration: {Math.round((incident.endTime - incident.startTime) / 60000)} minutes)
                        </span>
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Affected: {incident.affectedSystems.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* System Information */}
        <Card className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Crisis Support Guarantee</h3>
              <p className="text-sm text-gray-600 mb-2">
                Our crisis support pages are designed to load in under 1 second, even during high traffic periods.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Crisis pages: &lt;800ms response time</li>
                <li>• Emergency contacts: &lt;500ms load time</li>
                <li>• 99.95% uptime guarantee</li>
                <li>• Redundant failover systems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Performance Standards</h3>
              <p className="text-sm text-gray-600 mb-2">
                We maintain strict performance standards to ensure ALCHM is always available when you need it.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 95% of pages load under 2 seconds</li>
                <li>• Journal saves: &lt;2 seconds</li>
                <li>• Authentication: &lt;1.5 seconds</li>
                <li>• Global CDN distribution</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-gray-600">
          <p className="text-sm">
            This status page is updated automatically every 30 seconds.
          </p>
          <p className="text-xs mt-2">
            If you're experiencing issues not reflected here, please contact support.
          </p>
          <div className="mt-4 space-x-4 text-xs">
            <span>Crisis Support: Always Available</span>
            <span>•</span>
            <span>Emergency: Call 988 or 911</span>
            <span>•</span>
            <span>Last updated: {formatTimestamp(lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}