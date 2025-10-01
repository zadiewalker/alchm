/**
 * ALCHM Competitive Intelligence Executive Dashboard
 * Comprehensive strategic insights and competitive monitoring interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  CompetitorProfile,
  AppStoreMetrics,
  MarketOpportunity,
  CompetitiveAlert,
  CompetitiveReport
} from '@/lib/competitive-intelligence/types';
import { competitiveIntelligence } from '@/lib/competitive-intelligence/core-engine';
import { automatedReporting } from '@/lib/competitive-intelligence/automated-reporting';
import { opportunityIdentification } from '@/lib/competitive-intelligence/opportunity-identification';
import { alertSystem } from '@/lib/competitive-intelligence/alert-system';

interface DashboardData {
  competitors: CompetitorProfile[];
  alerts: CompetitiveAlert[];
  opportunities: MarketOpportunity[];
  executiveSummary: any;
  marketPosition: any;
  threatAssessment: any;
  isLoading: boolean;
  lastUpdated: Date | null;
}

/**
 * Executive Competitive Intelligence Dashboard
 */
export default function CompetitiveIntelligenceDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    competitors: [],
    alerts: [],
    opportunities: [],
    executiveSummary: null,
    marketPosition: null,
    threatAssessment: null,
    isLoading: true,
    lastUpdated: null
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, isLoading: true }));

      // Load data in parallel
      const [
        competitors,
        alerts,
        opportunities,
        executiveSummary,
        marketPosition,
        threatAssessment
      ] = await Promise.all([
        competitiveIntelligence.getActiveCompetitors(),
        competitiveIntelligence.getUnresolvedAlerts(),
        competitiveIntelligence.getMarketOpportunities('high'),
        automatedReporting.generateExecutiveSummary(),
        generateMarketPositionData(),
        generateThreatAssessmentData()
      ]);

      setDashboardData({
        competitors,
        alerts,
        opportunities,
        executiveSummary,
        marketPosition,
        threatAssessment,
        isLoading: false,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setDashboardData(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const generateMarketPositionData = async () => {
    // Mock implementation - would use real market analysis
    return {
      overallRank: 3,
      categoryRank: 2,
      marketShare: 8.5,
      brandStrength: 'Growing',
      competitiveAdvantage: ['Privacy-First', 'Cultural Responsiveness', 'Crisis Support'],
      weaknesses: ['Marketing Reach', 'Brand Recognition'],
      positioning: 'Challenger',
      trajectory: 'Positive'
    };
  };

  const generateThreatAssessmentData = async () => {
    // Mock implementation - would use real threat analysis
    return {
      overallThreatLevel: 'Medium',
      immediateThreats: [
        'New competitor with significant funding',
        'Regulatory changes in data privacy'
      ],
      emergingThreats: [
        'AI commoditization',
        'Market saturation in core segments'
      ],
      mitigationActions: [
        'Accelerate differentiation features',
        'Strengthen regulatory compliance',
        'Expand to underserved markets'
      ]
    };
  };

  if (dashboardData.isLoading) {
    return <DashboardLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <DashboardHeader 
          lastUpdated={dashboardData.lastUpdated}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />

        {/* Navigation Tabs */}
        <DashboardNavigation 
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />

        {/* Main Dashboard Content */}
        <div className="mt-8">
          {selectedView === 'overview' && (
            <OverviewTab dashboardData={dashboardData} />
          )}
          {selectedView === 'competitors' && (
            <CompetitorsTab competitors={dashboardData.competitors} />
          )}
          {selectedView === 'alerts' && (
            <AlertsTab alerts={dashboardData.alerts} />
          )}
          {selectedView === 'opportunities' && (
            <OpportunitiesTab opportunities={dashboardData.opportunities} />
          )}
          {selectedView === 'reports' && (
            <ReportsTab />
          )}
          {selectedView === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Header Component
 */
function DashboardHeader({ 
  lastUpdated, 
  onRefresh, 
  refreshing, 
  selectedTimeframe, 
  onTimeframeChange 
}: {
  lastUpdated: Date | null;
  onRefresh: () => void;
  refreshing: boolean;
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Competitive Intelligence Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Strategic insights and market monitoring for ALCHM
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleDateString()} at {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Timeframe Selector */}
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Navigation Component
 */
function DashboardNavigation({ 
  selectedView, 
  onViewChange 
}: {
  selectedView: string;
  onViewChange: (view: string) => void;
}) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'competitors', label: 'Competitors', icon: '🏢' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'opportunities', label: 'Opportunities', icon: '💡' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              selectedView === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/**
 * Overview Tab Component
 */
function OverviewTab({ dashboardData }: { dashboardData: DashboardData }) {
  const { executiveSummary, marketPosition, threatAssessment, alerts, opportunities } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Market Position"
          value={`#${marketPosition?.overallRank || 'N/A'}`}
          subtitle="Overall Ranking"
          trend="+2"
          trendDirection="up"
        />
        <MetricCard 
          title="Active Alerts"
          value={alerts.length.toString()}
          subtitle="Requiring attention"
          trend={alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length.toString()}
          trendDirection="neutral"
          subtrendLabel="High/Critical"
        />
        <MetricCard 
          title="Opportunities"
          value={opportunities.length.toString()}
          subtitle="High priority"
          trend="+3"
          trendDirection="up"
        />
        <MetricCard 
          title="Threat Level"
          value={threatAssessment?.overallThreatLevel || 'Low'}
          subtitle="Current assessment"
          trend="Stable"
          trendDirection="neutral"
        />
      </div>

      {/* Strategic Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicInsightsCard executiveSummary={executiveSummary} />
        <MarketPositionCard marketPosition={marketPosition} />
      </div>

      {/* Recent Alerts and Top Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlertsCard alerts={alerts.slice(0, 5)} />
        <TopOpportunitiesCard opportunities={opportunities.slice(0, 5)} />
      </div>

      {/* Threat Assessment */}
      <ThreatAssessmentCard threatAssessment={threatAssessment} />
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendDirection, 
  subtrendLabel 
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  subtrendLabel?: string;
}) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }[trendDirection];

  const trendIcon = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  }[trendDirection];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`text-right ${trendColor}`}>
          <div className="flex items-center space-x-1">
            <span>{trendIcon}</span>
            <span className="text-sm font-medium">{trend}</span>
          </div>
          {subtrendLabel && (
            <p className="text-xs text-gray-500 mt-1">{subtrendLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Strategic Insights Card
 */
function StrategicInsightsCard({ executiveSummary }: { executiveSummary: any }) {
  const insights = executiveSummary?.strategicRecommendations || [
    'Accelerate AI feature development',
    'Expand teen mental health offerings',
    'Strengthen privacy messaging',
    'Explore healthcare partnerships'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Strategic Recommendations
      </h3>
      <div className="space-y-3">
        {insights.slice(0, 4).map((insight: string, index: number) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">{insight}</p>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View detailed analysis →
      </button>
    </div>
  );
}

/**
 * Market Position Card
 */
function MarketPositionCard({ marketPosition }: { marketPosition: any }) {
  if (!marketPosition) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Market Position Analysis
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Overall Rank</span>
          <span className="font-semibold">#{marketPosition.overallRank}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Category Rank</span>
          <span className="font-semibold">#{marketPosition.categoryRank}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Market Share</span>
          <span className="font-semibold">{marketPosition.marketShare}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Positioning</span>
          <span className="font-semibold">{marketPosition.positioning}</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Competitive Advantages:</p>
          <div className="flex flex-wrap gap-2">
            {marketPosition.competitiveAdvantage.map((advantage: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {advantage}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Recent Alerts Card
 */
function RecentAlertsCard({ alerts }: { alerts: CompetitiveAlert[] }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all →
        </button>
      </div>
      
      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent alerts</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {alert.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {alert.detectedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Top Opportunities Card
 */
function TopOpportunitiesCard({ opportunities }: { opportunities: MarketOpportunity[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Opportunities</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all →
        </button>
      </div>
      
      {opportunities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No opportunities identified</p>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opportunity.priority)}`}>
                {opportunity.priority.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {opportunity.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {opportunity.description}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs text-gray-500">
                    Confidence: {Math.round(opportunity.confidence * 100)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    Impact: {opportunity.estimatedImpact}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Threat Assessment Card
 */
function ThreatAssessmentCard({ threatAssessment }: { threatAssessment: any }) {
  if (!threatAssessment) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Threat Assessment
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Immediate Threats</h4>
          <div className="space-y-2">
            {threatAssessment.immediateThreats.map((threat: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-red-500 mt-1">⚠️</span>
                <p className="text-sm text-gray-700">{threat}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Mitigation Actions</h4>
          <div className="space-y-2">
            {threatAssessment.mitigationActions.map((action: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 mt-1">✅</span>
                <p className="text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading State Component
 */
function DashboardLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Additional tab components would be implemented here:
// - CompetitorsTab
// - AlertsTab  
// - OpportunitiesTab
// - ReportsTab
// - SettingsTab