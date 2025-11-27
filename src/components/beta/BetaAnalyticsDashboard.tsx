'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { analyticsService } from '@/lib/beta/analyticsService';
import { BetaAnalytics, TimeSeries, CategoryData, FeatureAdoption } from '@/types/beta';

interface BetaAnalyticsDashboardProps {
  userRole?: 'beta_user' | 'developer' | 'admin';
  userId?: string; // For user-specific analytics
}

export function BetaAnalyticsDashboard({ userRole = 'beta_user', userId }: BetaAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<BetaAnalytics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'feedback' | 'testing'>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  useEffect(() => {
    if (userId && userRole === 'beta_user') {
      loadUserAnalytics();
    }
  }, [userId, userRole]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }
      
      const data = await analyticsService.getBetaAnalytics({ start: startDate, end: endDate });
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserAnalytics = async () => {
    if (!userId) return;
    
    try {
      const data = await analyticsService.getUserAnalytics(userId);
      setUserAnalytics(data);
    } catch (err) {
      console.error('User analytics loading error:', err);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await analyticsService.exportAnalyticsData(format);
      
      const blob = new Blob([data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beta-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Analytics</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadAnalytics}>Retry</Button>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </Card>
    );
  }

  // User-specific analytics view
  if (userRole === 'beta_user' && userId && userAnalytics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Your Beta Testing Analytics
          </h1>
          <p className="text-gray-600">
            Track your contribution and engagement in the beta program.
          </p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-2xl font-medium text-blue-600">
              {userAnalytics.streak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-medium text-green-600">
              {userAnalytics.feedbackContributions.reduce((sum: number, item: any) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Contributions</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-medium text-purple-600">
              {userAnalytics.featureUsage.length}
            </div>
            <div className="text-sm text-gray-600">Features Tested</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-medium text-orange-600">
              {userAnalytics.achievements.length}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement History */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement History</h3>
            <LineChart data={userAnalytics.engagementHistory} />
          </Card>

          {/* Feature Usage */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage</h3>
            <div className="space-y-3">
              {userAnalytics.featureUsage.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (item.usage / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{item.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Contributions */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contributions</h3>
            <div className="space-y-3">
              {userAnalytics.feedbackContributions.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{item.type}</span>
                  <span className="text-lg font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements</h3>
            <div className="grid grid-cols-1 gap-2">
              {userAnalytics.achievements.map((achievement: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <span className="text-yellow-600">🏆</span>
                  <span className="text-sm text-gray-700">{achievement}</span>
                </div>
              ))}
              {userAnalytics.achievements.length === 0 && (
                <p className="text-gray-500 text-sm">No achievements yet. Keep testing to earn your first badge!</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Admin/Developer analytics view
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2">
              Beta Testing Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into beta testing performance and user engagement.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex border rounded-lg">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${range === '7d' ? 'rounded-l-lg' : range === '90d' ? 'rounded-r-lg' : ''}`}
                >
                  {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                Export JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-2xl font-medium text-blue-600">
            {analytics.overview.totalUsers}
          </div>
          <div className="text-sm text-gray-600">Total Users</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-green-600">
            {analytics.overview.activeUsers}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-purple-600">
            {analytics.overview.avgEngagementScore}
          </div>
          <div className="text-sm text-gray-600">Avg Engagement</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-red-600">
            {analytics.overview.bugReports}
          </div>
          <div className="text-sm text-gray-600">Bug Reports</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-yellow-600">
            {analytics.overview.featureRequests}
          </div>
          <div className="text-sm text-gray-600">Feature Requests</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-indigo-600">
            {analytics.overview.surveysCompleted}
          </div>
          <div className="text-sm text-gray-600">Surveys</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-medium text-pink-600">
            {analytics.overview.interviewsCompleted}
          </div>
          <div className="text-sm text-gray-600">Interviews</div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'engagement', label: 'Engagement' },
            { id: 'feedback', label: 'Feedback' },
            { id: 'testing', label: 'Testing' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Active Users</h3>
            <LineChart data={analytics.engagement.dailyActiveUsers} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Adoption</h3>
            <div className="space-y-3">
              {analytics.engagement.featureAdoption.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{feature.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${feature.adoptionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round(feature.adoptionRate)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Duration Trend</h3>
            <LineChart data={analytics.engagement.sessionDuration} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Retention</h3>
            <div className="space-y-3">
              {analytics.engagement.userRetention.slice(0, 5).map((cohort, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="font-medium text-sm text-gray-900 mb-2">{cohort.cohort}</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>Day 1: {Math.round(cohort.day1)}%</div>
                    <div>Day 7: {Math.round(cohort.day7)}%</div>
                    <div>Day 14: {Math.round(cohort.day14)}%</div>
                    <div>Day 30: {Math.round(cohort.day30)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback by Type</h3>
            <PieChart data={analytics.feedback.feedbackByType} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bugs by Priority</h3>
            <PieChart data={analytics.feedback.bugsByPriority} />
          </Card>
          
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resolution Time Trend</h3>
            <LineChart data={analytics.feedback.resolutionTime} />
          </Card>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Coverage</h3>
            <div className="space-y-3">
              {analytics.testing.coverageByFeature.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{feature.feature}</div>
                    <div className="text-xs text-gray-500">
                      {feature.usersTestedCount} users • {feature.bugsFound} bugs • {feature.feedbackCount} feedback
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${feature.coverage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{Math.round(feature.coverage)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Effectiveness</h3>
              <LineChart data={analytics.testing.testingEffectiveness} />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Discovery Rate</h3>
              <LineChart data={analytics.testing.issueDiscoveryRate} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple chart components (you could replace these with a charting library like recharts)
function LineChart({ data }: { data: TimeSeries[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="h-48 flex items-end justify-between gap-1">
      {data.map((point, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-blue-600 rounded-t"
            style={{ height: `${(point.value / maxValue) * 100}%` }}
            title={`${point.date}: ${point.value}`}
          ></div>
          {index % Math.ceil(data.length / 5) === 0 && (
            <div className="text-xs text-gray-500 mt-1 transform -rotate-45">
              {new Date(point.date).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }: { data: CategoryData[] }) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm text-gray-700 capitalize">{item.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-900">{item.count}</span>
            <span className="text-xs text-gray-500">({Math.round(item.percentage)}%)</span>
          </div>
        </div>
      ))}
    </div>
  );
}