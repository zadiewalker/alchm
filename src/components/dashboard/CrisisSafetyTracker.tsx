// ALCHM Crisis Safety Effectiveness Tracker
// Real-time monitoring and analytics for crisis intervention systems

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CrisisMetrics {
  interventions: {
    total: number;
    successful: number;
    responseTimeAvg: number;
    responseTimeMedian: number;
    escalations: number;
  };
  detection: {
    accuracy: number;
    falsePositives: number;
    falseNegatives: number;
    patternsDetected: number;
  };
  resources: {
    utilization: Record<string, number>;
    availability: Record<string, boolean>;
    responseCapacity: number;
  };
  outcomes: {
    preventedIncidents: number;
    followUpEngagement: number;
    userSatisfaction: number;
    longTermSupport: number;
  };
  trends: {
    interventionsByHour: Record<string, number>;
    interventionsByDay: Record<string, number>;
    seasonalPatterns: any[];
  };
}

interface CrisisAlert {
  id: string;
  type: 'detection' | 'response' | 'resource' | 'outcome';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  actionRequired: boolean;
  resolved: boolean;
}

const CrisisStatusIndicator: React.FC<{
  status: 'optimal' | 'warning' | 'critical';
  label: string;
  value?: string | number;
}> = ({ status, label, value }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'optimal': return '✅';
      case 'warning': return '⚠️';
      case 'critical': return '🚨';
      default: return '📊';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{getStatusIcon()}</span>
          <span className="font-medium text-sm">{label}</span>
        </div>
        {value && (
          <span className="font-bold">{value}</span>
        )}
      </div>
    </div>
  );
};

const ResponseTimeChart: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  // Generate sample response time data
  const responseData = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    avgResponse: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
    interventions: Math.floor(Math.random() * 10),
  }));

  const maxResponse = Math.max(...responseData.map(d => d.avgResponse));
  const maxInterventions = Math.max(...responseData.map(d => d.interventions));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Crisis Response Times (24h)
      </h3>
      <div className="space-y-3">
        {responseData.map((item) => (
          <div key={item.hour} className="flex items-center space-x-4">
            <div className="w-8 text-xs text-gray-500">
              {item.hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Response: {item.avgResponse}s</span>
                <span>Count: {item.interventions}</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(item.avgResponse / maxResponse) * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(item.interventions / maxInterventions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>🔵 Response Time</span>
          <span>🔴 Intervention Count</span>
        </div>
      </div>
    </Card>
  );
};

const DetectionAccuracyPanel: React.FC<{ metrics: CrisisMetrics | null }> = ({ metrics }) => {
  const detection = metrics?.detection || {
    accuracy: 92.5,
    falsePositives: 3,
    falseNegatives: 1,
    patternsDetected: 45,
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Detection System Accuracy
      </h3>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {detection.accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Overall Accuracy</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xl font-bold text-red-600">{detection.falsePositives}</div>
            <div className="text-xs text-red-700">False Positives</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{detection.falseNegatives}</div>
            <div className="text-xs text-orange-700">False Negatives</div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Patterns Detected</span>
            <span className="font-semibold">{detection.patternsDetected}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Precision Rate</span>
            <span className="font-semibold text-green-600">
              {((detection.patternsDetected - detection.falsePositives) / detection.patternsDetected * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ResourceAvailabilityGrid: React.FC<{ metrics: CrisisMetrics | null }> = ({ metrics }) => {
  const resources = metrics?.resources || {
    utilization: {
      'crisis-hotline': 75,
      'text-support': 60,
      'emergency-contacts': 40,
      'mental-health-professionals': 85,
    },
    availability: {
      'crisis-hotline': true,
      'text-support': true,
      'emergency-contacts': true,
      'mental-health-professionals': true,
    },
    responseCapacity: 95,
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'bg-green-500';
    if (utilization < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Crisis Resource Availability
      </h3>
      <div className="space-y-4">
        {Object.entries(resources.utilization).map(([resource, utilization]) => {
          const isAvailable = resources.availability[resource];
          const displayName = resource.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <div key={resource} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <span className="text-sm text-gray-600">{utilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getUtilizationColor(utilization)}`}
                  style={{ width: `${utilization}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Capacity</span>
            <span className="text-lg font-bold text-blue-600">{resources.responseCapacity}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CrisisAlertsPanel: React.FC<{ alerts: CrisisAlert[] }> = ({ alerts }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'unresolved'>('all');

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'critical':
        return alert.severity === 'critical';
      case 'unresolved':
        return !alert.resolved;
      default:
        return true;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Crisis System Alerts</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All Alerts</option>
          <option value="critical">Critical Only</option>
          <option value="unresolved">Unresolved</option>
        </select>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <p>No alerts matching filter criteria</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium uppercase">{alert.type}</span>
                  {alert.actionRequired && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      ACTION REQUIRED
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{alert.message}</p>
              {alert.resolved && (
                <div className="mt-2 text-xs text-green-600 font-medium">
                  ✅ Resolved
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export const CrisisSafetyTracker: React.FC = () => {
  const [metrics, setMetrics] = useState<CrisisMetrics | null>(null);
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate fetching crisis metrics
  useEffect(() => {
    const fetchCrisisMetrics = async () => {
      try {
        // In production, fetch from API
        const mockMetrics: CrisisMetrics = {
          interventions: {
            total: 45,
            successful: 42,
            responseTimeAvg: 85,
            responseTimeMedian: 72,
            escalations: 3,
          },
          detection: {
            accuracy: 92.5,
            falsePositives: 3,
            falseNegatives: 1,
            patternsDetected: 45,
          },
          resources: {
            utilization: {
              'crisis-hotline': 75,
              'text-support': 60,
              'emergency-contacts': 40,
              'mental-health-professionals': 85,
            },
            availability: {
              'crisis-hotline': true,
              'text-support': true,
              'emergency-contacts': true,
              'mental-health-professionals': true,
            },
            responseCapacity: 95,
          },
          outcomes: {
            preventedIncidents: 38,
            followUpEngagement: 35,
            userSatisfaction: 4.7,
            longTermSupport: 28,
          },
          trends: {
            interventionsByHour: {},
            interventionsByDay: {},
            seasonalPatterns: [],
          },
        };

        const mockAlerts: CrisisAlert[] = [
          {
            id: '1',
            type: 'detection',
            severity: 'medium',
            message: 'False positive rate increased by 15% in the last hour',
            timestamp: Date.now() - 1800000,
            actionRequired: false,
            resolved: false,
          },
          {
            id: '2',
            type: 'resource',
            severity: 'high',
            message: 'Mental health professional utilization at 85% - consider scaling',
            timestamp: Date.now() - 3600000,
            actionRequired: true,
            resolved: false,
          },
          {
            id: '3',
            type: 'outcome',
            severity: 'low',
            message: 'Follow-up engagement rate improved by 8%',
            timestamp: Date.now() - 7200000,
            actionRequired: false,
            resolved: true,
          },
        ];

        setMetrics(mockMetrics);
        setAlerts(mockAlerts);
        setLoading(false);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch crisis metrics:', error);
        setLoading(false);
      }
    };

    fetchCrisisMetrics();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchCrisisMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = (): 'optimal' | 'warning' | 'critical' => {
    if (!metrics) return 'warning';
    
    const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
    if (criticalAlerts.length > 0) return 'critical';
    
    const highAlerts = alerts.filter(a => a.severity === 'high' && !a.resolved);
    if (highAlerts.length > 2) return 'warning';
    
    if (metrics.interventions.responseTimeAvg > 120) return 'warning';
    if (metrics.detection.accuracy < 90) return 'warning';
    
    return 'optimal';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crisis Safety Dashboard</h1>
          <p className="text-gray-600">
            Real-time monitoring of crisis intervention effectiveness
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Last updated</div>
          <div className="font-medium">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CrisisStatusIndicator
          status={getOverallStatus()}
          label="System Status"
          value={getOverallStatus().toUpperCase()}
        />
        <CrisisStatusIndicator
          status={metrics?.detection.accuracy && metrics.detection.accuracy > 90 ? 'optimal' : 'warning'}
          label="Detection Accuracy"
          value={`${metrics?.detection.accuracy?.toFixed(1) || 0}%`}
        />
        <CrisisStatusIndicator
          status={metrics?.interventions.responseTimeAvg && metrics.interventions.responseTimeAvg < 90 ? 'optimal' : 'warning'}
          label="Avg Response Time"
          value={`${metrics?.interventions.responseTimeAvg || 0}s`}
        />
        <CrisisStatusIndicator
          status={metrics?.resources.responseCapacity && metrics.resources.responseCapacity > 90 ? 'optimal' : 'warning'}
          label="Resource Capacity"
          value={`${metrics?.resources.responseCapacity || 0}%`}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {metrics?.interventions.total || 0}
          </div>
          <div className="text-sm text-gray-600">Total Interventions</div>
          <div className="text-xs text-green-600 mt-1">
            {metrics?.interventions.successful || 0} successful
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {metrics?.outcomes.preventedIncidents || 0}
          </div>
          <div className="text-sm text-gray-600">Prevented Incidents</div>
          <div className="text-xs text-blue-600 mt-1">
            84% success rate
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {metrics?.outcomes.followUpEngagement || 0}
          </div>
          <div className="text-sm text-gray-600">Follow-up Engaged</div>
          <div className="text-xs text-green-600 mt-1">
            78% engagement rate
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-2">
            {metrics?.outcomes.userSatisfaction?.toFixed(1) || 0}
          </div>
          <div className="text-sm text-gray-600">User Satisfaction</div>
          <div className="text-xs text-green-600 mt-1">
            Out of 5.0 stars
          </div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponseTimeChart data={metrics} loading={loading} />
        <DetectionAccuracyPanel metrics={metrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceAvailabilityGrid metrics={metrics} />
        <CrisisAlertsPanel alerts={alerts} />
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        <p>
          Crisis safety data is anonymized and aggregated. All interventions follow trauma-informed protocols.
        </p>
      </div>
    </div>
  );
};