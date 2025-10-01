/**
 * ALCHM Content Moderation Dashboard
 * 
 * Executive dashboard for monitoring content safety and therapeutic value
 * across the ALCHM platform with real-time analytics and intervention management.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiContentModerationSystem, ContentClassification, ModerationAction } from '@/lib/content-moderation/ai-moderation-system';

interface ModerationMetrics {
  totalContentAnalyzed: number;
  therapeuticContentPercentage: number;
  safetyInterventions: number;
  flaggedContent: number;
  averageTherapeuticValue: number;
  dailyTrends: {
    date: string;
    analyzed: number;
    flagged: number;
    therapeutic: number;
  }[];
}

interface ContentAlert {
  id: string;
  userId: string;
  contentPreview: string;
  classification: ContentClassification;
  action: ModerationAction;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function ContentModerationDashboard() {
  const [metrics, setMetrics] = useState<ModerationMetrics | null>(null);
  const [alerts, setAlerts] = useState<ContentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'analytics'>('overview');

  useEffect(() => {
    loadDashboardData();
    
    // Real-time updates
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load metrics and alerts from the moderation system
      const [metricsData, alertsData] = await Promise.all([
        aiContentModerationSystem.getModerationMetrics(),
        aiContentModerationSystem.getActiveAlerts()
      ]);
      
      setMetrics(metricsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load moderation dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertAction = async (alertId: string, action: 'approve' | 'remove' | 'escalate') => {
    try {
      await aiContentModerationSystem.handleAlertAction(alertId, action);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to handle alert action:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a4b792]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Content Moderation Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          AI-powered content safety and therapeutic value monitoring
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'alerts', label: 'Active Alerts' },
          { id: 'analytics', label: 'Analytics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-[#a4b792] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Key Metrics Cards */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Content Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalContentAnalyzed.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Therapeutic Content</p>
                <p className="text-2xl font-bold text-green-600">{metrics.therapeuticContentPercentage.toFixed(1)}%</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Safety Interventions</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.safetyInterventions}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Content</p>
                <p className="text-2xl font-bold text-red-600">{metrics.flaggedContent}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Active Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Active Content Alerts</h2>
            <div className="text-sm text-gray-500">
              {alerts.filter(a => a.status === 'pending').length} pending review
            </div>
          </div>

          {alerts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Alerts</h3>
              <p className="text-gray-500">All content is currently within safety guidelines.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-900 mb-2 bg-gray-50 p-3 rounded border-l-4 border-[#a4b792]">
                        "{alert.contentPreview}..."
                      </p>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Safety Score: {alert.classification.safety.score.toFixed(2)}</div>
                        <div>Therapeutic Value: {alert.classification.therapeutic.score.toFixed(2)}</div>
                        {alert.classification.safety.concerns.length > 0 && (
                          <div>Concerns: {alert.classification.safety.concerns.join(', ')}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlertAction(alert.id, 'approve')}
                        disabled={alert.status !== 'pending'}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlertAction(alert.id, 'remove')}
                        disabled={alert.status !== 'pending'}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAlertAction(alert.id, 'escalate')}
                        disabled={alert.status !== 'pending'}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Escalate
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && metrics && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content Trends</h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Analytics visualization would be implemented here</p>
                <p className="text-sm">Integration with Chart.js or D3.js recommended</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Therapeutic Categories</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Emotional Processing</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Self-Reflection</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Growth Insights</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crisis Support</span>
                  <span className="text-sm font-medium">16%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Safety Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Safe Content</span>
                  <span className="text-sm font-medium text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minor Concerns</span>
                  <span className="text-sm font-medium text-yellow-600">4.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Flagged Content</span>
                  <span className="text-sm font-medium text-orange-600">1.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Critical Issues</span>
                  <span className="text-sm font-medium text-red-600">0.2%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}