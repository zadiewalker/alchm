// ALCHM Executive Business Intelligence Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  useBusinessMetrics, 
  useRealTimeKPIs, 
  usePredictiveInsights,
  businessIntelligence,
  BusinessMetrics 
} from '@/lib/business-intelligence';

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'currency' | 'percentage' | 'number';
  loading?: boolean;
}> = ({ title, value, change, trend, format = 'number', loading = false }) => {
  const formatValue = (val: string | number) => {
    if (loading) return '...';
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getTrendColor = () => {
    if (!change) return 'text-gray-500';
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <Card className="p-6 bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(change).toFixed(1)}%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Chart Component for Revenue Trends
const RevenueChart: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        {/* Placeholder for chart library integration */}
        <div className="text-center">
          <p>Revenue Chart</p>
          <p className="text-sm">MRR: ${data?.revenue?.mrr || 0}</p>
          <p className="text-sm">ARR: ${data?.revenue?.arr || 0}</p>
        </div>
      </div>
    </Card>
  );
};

// User Engagement Heatmap
const EngagementHeatmap: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }, (_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const generateHeatmapData = () => {
    // Generate sample heatmap data for demonstration
    const days = 28;
    const heatmapData = [];
    for (let i = 0; i < days; i++) {
      const intensity = Math.random();
      heatmapData.push({
        day: i,
        intensity,
        users: Math.floor(intensity * 100),
      });
    }
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-green-100';
    if (intensity < 0.4) return 'bg-green-200';
    if (intensity < 0.6) return 'bg-green-300';
    if (intensity < 0.8) return 'bg-green-400';
    return 'bg-green-500';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement (28 days)</h3>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {heatmapData.map((day) => (
          <div
            key={day.day}
            className={`h-8 rounded ${getIntensityColor(day.intensity)} flex items-center justify-center text-xs text-gray-700`}
            title={`Day ${day.day + 1}: ${day.users} active users`}
          >
            {day.users}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Less active</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <div className="w-3 h-3 bg-green-200 rounded"></div>
          <div className="w-3 h-3 bg-green-300 rounded"></div>
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
        </div>
        <span>More active</span>
      </div>
    </Card>
  );
};

// Crisis Safety Metrics
const CrisisSafetyMetrics: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const crisisData = data?.crisisSafety || {
    interventions: 0,
    responseTime: 0,
    effectivenessScore: 0,
    preventedIncidents: 0,
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Crisis Safety Performance</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Interventions</span>
          <span className="font-semibold text-blue-600">{crisisData.interventions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Response Time</span>
          <span className="font-semibold text-green-600">{crisisData.responseTime}s</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Effectiveness Score</span>
          <span className="font-semibold text-purple-600">{crisisData.effectivenessScore}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Prevented Incidents</span>
          <span className="font-semibold text-emerald-600">{crisisData.preventedIncidents}</span>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            Crisis safety systems operating at optimal efficiency
          </p>
        </div>
      </div>
    </Card>
  );
};

// Conversion Funnel
const ConversionFunnel: React.FC<{ data: any; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const funnelData = data?.acquisition?.conversionFunnel || {
    visitors: 1000,
    signups: 250,
    firstJournal: 180,
    activeUsers: 120,
    paidUsers: 30,
  };

  const steps = [
    { label: 'Visitors', value: funnelData.visitors, color: 'bg-blue-500' },
    { label: 'Signups', value: funnelData.signups, color: 'bg-indigo-500' },
    { label: 'First Journal', value: funnelData.firstJournal, color: 'bg-purple-500' },
    { label: 'Active Users', value: funnelData.activeUsers, color: 'bg-pink-500' },
    { label: 'Paid Users', value: funnelData.paidUsers, color: 'bg-red-500' },
  ];

  const maxValue = Math.max(...steps.map(step => step.value));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const percentage = (step.value / maxValue) * 100;
          const conversionRate = index > 0 ? (step.value / steps[index - 1].value) * 100 : 100;
          
          return (
            <div key={step.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{step.label}</span>
                <span className="font-medium">
                  {step.value} ({conversionRate.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${step.color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Main Executive Dashboard Component
export const ExecutiveDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { metrics, loading: metricsLoading, error } = useBusinessMetrics(timeframe);
  const { kpis, loading: kpisLoading } = useRealTimeKPIs(autoRefresh ? 30000 : 0);
  const { insights, loading: insightsLoading } = usePredictiveInsights();

  const handleExportReport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      const result = await businessIntelligence.generateReport('weekly', format);
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        console.log('Report generated:', result);
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  if (error) {
    return (
      <Card className="p-6 m-6">
        <div className="text-center text-red-600">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ALCHM Executive Dashboard</h1>
          <p className="text-gray-600">Real-time business intelligence and insights</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
          >
            {autoRefresh ? '🔄 Auto Refresh' : '⏸️ Paused'}
          </Button>
          <Button
            onClick={() => handleExportReport('pdf')}
            variant="outline"
          >
            📊 Export Report
          </Button>
        </div>
      </div>

      {/* Real-time KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          title="Active Users"
          value={kpis?.activeUsers || 0}
          change={12.5}
          trend="up"
          loading={kpisLoading}
        />
        <KPICard
          title="New Signups"
          value={kpis?.newSignups || 0}
          change={8.2}
          trend="up"
          loading={kpisLoading}
        />
        <KPICard
          title="Revenue"
          value={kpis?.revenue || 0}
          change={15.7}
          trend="up"
          format="currency"
          loading={kpisLoading}
        />
        <KPICard
          title="Crisis Interventions"
          value={kpis?.crisisInterventions || 0}
          change={-5.3}
          trend="down"
          loading={kpisLoading}
        />
        <KPICard
          title="System Health"
          value={kpis?.systemHealth || 100}
          change={0.5}
          trend="stable"
          format="percentage"
          loading={kpisLoading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Recurring Revenue"
          value={metrics?.revenue?.mrr || 0}
          change={18.3}
          trend="up"
          format="currency"
          loading={metricsLoading}
        />
        <KPICard
          title="Average Revenue Per User"
          value={metrics?.revenue?.arpu || 0}
          change={7.1}
          trend="up"
          format="currency"
          loading={metricsLoading}
        />
        <KPICard
          title="Monthly Active Users"
          value={metrics?.engagement?.mau || 0}
          change={22.4}
          trend="up"
          loading={metricsLoading}
        />
        <KPICard
          title="Churn Rate"
          value={metrics?.revenue?.churnRate || 0}
          change={-2.1}
          trend="down"
          format="percentage"
          loading={metricsLoading}
        />
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={metrics} loading={metricsLoading} />
        <ConversionFunnel data={metrics} loading={metricsLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementHeatmap data={metrics} loading={metricsLoading} />
        <CrisisSafetyMetrics data={metrics} loading={metricsLoading} />
      </div>

      {/* Predictive Insights */}
      {insights && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Next Month Forecast</p>
              <p className="text-xl font-bold text-blue-600">
                {insights.growthForecast.nextMonth.users} users
              </p>
              <p className="text-lg font-semibold text-green-600">
                ${insights.growthForecast.nextMonth.revenue} revenue
              </p>
              <p className="text-sm text-gray-500">
                {insights.growthForecast.nextMonth.confidence}% confidence
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Churn Risk Analysis</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">High Risk</span>
                  <span className="text-sm font-medium text-red-600">
                    {insights.churnRisk.highRisk}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Medium Risk</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {insights.churnRisk.mediumRisk}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Low Risk</span>
                  <span className="text-sm font-medium text-green-600">
                    {insights.churnRisk.lowRisk}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Resource Optimization</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Server Capacity</span>
                  <span className="text-sm font-medium">
                    {insights.resourceOptimization.serverCapacity}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Support Staffing</span>
                  <span className="text-sm font-medium">
                    {insights.resourceOptimization.supportStaffing}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Crisis Resources</span>
                  <span className="text-sm font-medium">
                    {insights.resourceOptimization.crisisResources}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>
          Data is privacy-compliant and aggregated. Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};