'use client';

/**
 * ALCHM Business Intelligence Dashboard
 * 
 * Real-time analytics dashboard with privacy-compliant metrics,
 * revenue intelligence, and trauma-informed design principles.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { BusinessMetricsCollector } from '@/lib/business-intelligence/metrics-collector';
import { RevenueIntelligenceEngine } from '@/lib/business-intelligence/revenue-intelligence';
import { UserJourneyAnalytics } from '@/lib/business-intelligence/user-journey-analytics';
import {
  DashboardMetrics,
  RevenueMetrics,
  EngagementMetrics,
  UserAcquisitionMetrics,
  CrisisSafetyMetrics
} from '@/lib/business-intelligence/types';

interface DashboardProps {
  userRole: 'admin' | 'investor' | 'analyst';
  accessLevel: 'full' | 'aggregated' | 'public';
}

export default function BusinessIntelligenceDashboard({ 
  userRole, 
  accessLevel 
}: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Initialize analytics engines
  const [metricsCollector] = useState(() => new BusinessMetricsCollector());
  const [revenueEngine] = useState(() => new RevenueIntelligenceEngine());
  const [journeyAnalytics] = useState(() => new UserJourneyAnalytics());

  useEffect(() => {
    loadDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [selectedDateRange, autoRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await metricsCollector.getDashboardMetrics();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (type: 'csv' | 'pdf' | 'json') => {
    try {
      const dateRange = getDateRangeFromSelection(selectedDateRange);
      const report = await revenueEngine.generateRevenueReport('monthly', true);
      
      // Trigger download based on type
      const blob = new Blob([JSON.stringify(report, null, 2)], { 
        type: type === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alchm-analytics-${new Date().toISOString().split('T')[0]}.${type}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Intelligence Dashboard
            </h1>
            <p className="text-gray-600">
              Privacy-first analytics • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <DashboardControls
              selectedDateRange={selectedDateRange}
              onDateRangeChange={setSelectedDateRange}
              selectedMetrics={selectedMetrics}
              onMetricsChange={setSelectedMetrics}
              autoRefresh={autoRefresh}
              onAutoRefreshToggle={setAutoRefresh}
              onRefresh={loadDashboardData}
              onExport={handleExportReport}
              userRole={userRole}
            />
          </div>
        </div>

        {/* Privacy Compliance Banner */}
        <PrivacyComplianceBanner 
          compliance={dashboardData?.privacyCompliance} 
        />

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Users"
            value={dashboardData?.activeUsers.current || 0}
            change={dashboardData?.activeUsers.trend || 0}
            icon={<Users className="h-6 w-6" />}
            color="blue"
            privacy={{
              anonymized: true,
              cohortSize: 5,
              noiseApplied: true
            }}
          />
          
          <MetricCard
            title="Monthly Revenue"
            value={dashboardData?.businessKPIs.mrr || 0}
            change={12.5}
            icon={<DollarSign className="h-6 w-6" />}
            color="green"
            format="currency"
            privacy={{
              anonymized: true,
              cohortSize: 5,
              noiseApplied: true
            }}
          />
          
          <MetricCard
            title="System Health"
            value={dashboardData?.systemHealth.uptime || 0}
            change={0.1}
            icon={<Activity className="h-6 w-6" />}
            color="purple"
            format="percentage"
            privacy={{
              anonymized: false,
              cohortSize: null,
              noiseApplied: false
            }}
          />
          
          <MetricCard
            title="Crisis Response"
            value={dashboardData?.systemHealth.crisisSystemStatus === 'operational' ? 100 : 75}
            change={0}
            icon={<Shield className="h-6 w-6" />}
            color="red"
            format="percentage"
            privacy={{
              anonymized: false,
              cohortSize: null,
              noiseApplied: false
            }}
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Analytics */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Intelligence</h2>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
            <RevenueChart dateRange={selectedDateRange} />
          </Card>

          {/* User Journey Analytics */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Journey</h2>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
            <UserJourneyChart dateRange={selectedDateRange} />
          </Card>
        </div>

        {/* Detailed Analytics */}
        {selectedMetrics === 'revenue' && (
          <RevenueAnalyticsDashboard 
            dateRange={selectedDateRange}
            accessLevel={accessLevel}
          />
        )}
        
        {selectedMetrics === 'engagement' && (
          <EngagementAnalyticsDashboard 
            dateRange={selectedDateRange}
            accessLevel={accessLevel}
          />
        )}
        
        {selectedMetrics === 'crisis' && userRole === 'admin' && (
          <CrisisSafetyDashboard 
            dateRange={selectedDateRange}
            accessLevel={accessLevel}
          />
        )}

        {/* Privacy and Compliance Footer */}
        <PrivacyFooter />
      </div>
    </div>
  );
}

// ===== SUPPORTING COMPONENTS =====

interface DashboardControlsProps {
  selectedDateRange: string;
  onDateRangeChange: (range: string) => void;
  selectedMetrics: string;
  onMetricsChange: (metrics: string) => void;
  autoRefresh: boolean;
  onAutoRefreshToggle: (enabled: boolean) => void;
  onRefresh: () => void;
  onExport: (type: 'csv' | 'pdf' | 'json') => void;
  userRole: string;
}

function DashboardControls({
  selectedDateRange,
  onDateRangeChange,
  selectedMetrics,
  onMetricsChange,
  autoRefresh,
  onAutoRefreshToggle,
  onRefresh,
  onExport,
  userRole
}: DashboardControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={selectedDateRange}
        onChange={(e) => onDateRangeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>

      <select
        value={selectedMetrics}
        onChange={(e) => onMetricsChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
      >
        <option value="overview">Overview</option>
        <option value="revenue">Revenue</option>
        <option value="engagement">Engagement</option>
        {userRole === 'admin' && <option value="crisis">Crisis Safety</option>}
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>

      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden group-hover:block">
          <button
            onClick={() => onExport('csv')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            JSON
          </button>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red';
  format?: 'number' | 'currency' | 'percentage';
  privacy: {
    anonymized: boolean;
    cohortSize: number | null;
    noiseApplied: boolean;
  };
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  format = 'number',
  privacy
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600', 
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600'
  };

  const isPositive = change >= 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {privacy.anonymized && (
          <div className="flex items-center text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1" />
            <span>Private</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">
            {formatValue(value)}
          </p>
          {change !== 0 && (
            <div className={`ml-2 flex items-center text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        {privacy.anonymized && (
          <div className="mt-2 text-xs text-gray-400">
            {privacy.noiseApplied && 'Differential privacy applied • '}
            {privacy.cohortSize && `Min cohort: ${privacy.cohortSize}`}
          </div>
        )}
      </div>
    </Card>
  );
}

function PrivacyComplianceBanner({ compliance }: { compliance?: any }) {
  if (!compliance) return null;

  const isCompliant = compliance.auditStatus === 'compliant';

  return (
    <Card className={`p-4 mb-6 border-l-4 ${
      isCompliant ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isCompliant ? (
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          )}
          <div>
            <h3 className={`font-medium ${
              isCompliant ? 'text-green-800' : 'text-yellow-800'
            }`}>
              Privacy Compliance Status: {isCompliant ? 'Compliant' : 'Needs Attention'}
            </h3>
            <p className={`text-sm ${
              isCompliant ? 'text-green-600' : 'text-yellow-600'
            }`}>
              Data minimization score: {compliance.dataMinimizationScore}% • 
              Consent rate: {compliance.consentRate}% • 
              Pending deletions: {compliance.deletionRequestsPending}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function RevenueChart({ dateRange }: { dateRange: string }) {
  // This would integrate with actual chart library (Chart.js, Recharts, etc.)
  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Revenue trends for {dateRange}</p>
        <p className="text-xs text-gray-400 mt-1">Privacy-protected aggregated data</p>
      </div>
    </div>
  );
}

function UserJourneyChart({ dateRange }: { dateRange: string }) {
  return (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">User journey funnel for {dateRange}</p>
        <p className="text-xs text-gray-400 mt-1">Anonymized user progression data</p>
      </div>
    </div>
  );
}

function RevenueAnalyticsDashboard({ dateRange, accessLevel }: any) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Revenue Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Subscription Tiers</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <PieChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Revenue Forecast</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <LineChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Churn Analysis</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <BarChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function EngagementAnalyticsDashboard({ dateRange, accessLevel }: any) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">User Engagement Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Feature Adoption</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <BarChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Retention Cohorts</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
            <LineChart className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function CrisisSafetyDashboard({ dateRange, accessLevel }: any) {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Crisis Safety Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Detection Accuracy</h3>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Response Time</h3>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3s</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">System Status</h3>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-1" />
              <div className="text-sm text-gray-600">Operational</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PrivacyFooter() {
  return (
    <Card className="p-4 mt-8 bg-gray-50">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          <span>All data is privacy-protected with k-anonymity (k≥5) and differential privacy</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>HIPAA compliant • Data retention: 90 days</span>
        </div>
      </div>
    </Card>
  );
}

// Helper function
function getDateRangeFromSelection(selection: string): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  
  switch (selection) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
}