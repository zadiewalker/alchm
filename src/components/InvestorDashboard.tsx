// Investor Dashboard - Series A Demo Ready Interface
// Real-time performance metrics and business intelligence for investor presentations

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Brain, 
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Globe,
  DollarSign,
  Target,
  Sparkles
} from 'lucide-react';

interface InvestorDashboardProps {
  accessToken?: string;
  view?: 'overview' | 'technical' | 'business' | 'demo';
  autoRefresh?: boolean;
}

export default function InvestorDashboard({ 
  accessToken, 
  view = 'overview',
  autoRefresh = true 
}: InvestorDashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [liveDemoActive, setLiveDemoActive] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, liveDemoActive]);

  const fetchDashboardData = async () => {
    try {
      const params = new URLSearchParams({
        timeRange: selectedTimeRange,
        liveDemo: liveDemoActive.toString()
      });

      const response = await fetch(`/api/investor-dashboard?${params}`, {
        headers: {
          'x-investor-token': accessToken || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeLiveDemo = async (action: string, parameters: any) => {
    try {
      const response = await fetch('/api/investor-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-token': process.env.NEXT_PUBLIC_LIVE_DEMO_TOKEN || ''
        },
        body: JSON.stringify({ action, parameters })
      });

      if (response.ok) {
        const result = await response.json();
        // Update UI with demo results
        await fetchDashboardData();
        return result;
      }
    } catch (error) {
      console.error('Demo execution failed:', error);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white">Loading investor dashboard...</p>
        </div>
      </div>
    );
  }

  const { dashboard, investor_insights } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ALCHM
                </span>
              </div>
              <Badge variant="outline" className="border-purple-400 text-purple-300">
                Series A Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Activity className="h-4 w-4" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={dashboard.overview.system_status === 'excellent' ? 'default' : 'destructive'}
                  className={dashboard.overview.system_status === 'excellent' ? 'bg-green-600' : ''}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {dashboard.overview.system_status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Monthly Active Users"
            value={dashboard.overview.headline_metrics.monthly_active_users.toLocaleString()}
            change={dashboard.overview.headline_metrics.user_growth_rate}
            icon={<Users className="h-6 w-6" />}
            trend="up"
          />
          
          <MetricCard
            title="System Uptime"
            value={dashboard.overview.headline_metrics.system_uptime}
            subtitle="99.9% SLA target"
            icon={<Zap className="h-6 w-6" />}
            trend="stable"
          />
          
          <MetricCard
            title="AI Prediction Accuracy"
            value={dashboard.overview.headline_metrics.ai_prediction_accuracy}
            subtitle="80% target achieved"
            icon={<Brain className="h-6 w-6" />}
            trend="up"
          />
          
          <MetricCard
            title="Crisis Prevention"
            value={dashboard.overview.headline_metrics.crisis_prevention_success}
            subtitle="Lives saved through AI"
            icon={<Shield className="h-6 w-6" />}
            trend="up"
          />
          
          <MetricCard
            title="Response Time"
            value={`${dashboard.technical_metrics.reliability.average_response_time}ms`}
            subtitle="<200ms target"
            icon={<Activity className="h-6 w-6" />}
            trend="stable"
          />
        </div>

        {/* Investment Narrative */}
        <Card className="mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-purple-400" />
              Series A Investment Narrative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Market Opportunity</h4>
                <p className="text-sm text-gray-300 mb-2">{investor_insights.market_opportunity.tam_size}</p>
                <p className="text-sm text-gray-300">{investor_insights.market_opportunity.growth_rate}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Current Scale</h4>
                <p className="text-sm text-gray-300 mb-2">{investor_insights.scaling_narrative.current_scale}</p>
                <p className="text-sm text-gray-300">{investor_insights.scaling_narrative.growth_trajectory} monthly growth</p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-300 mb-2">Technical Readiness</h4>
                <p className="text-sm text-gray-300 mb-2">{investor_insights.scaling_narrative.technical_readiness}</p>
                <p className="text-sm text-gray-300">{investor_insights.scaling_narrative.ai_moat_strength}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Differentiators */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Competitive Differentiators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investor_insights.key_differentiators.map((differentiator: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{differentiator}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Demo Section */}
        {liveDemoActive && (
          <Card className="mb-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-green-400" />
                Live Demo Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-medium text-green-400">
                    {dashboard.live_demo?.current_demo_session.active_users_simulated.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Simulated Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-blue-400">
                    {dashboard.live_demo?.current_demo_session.ai_responses_generated}
                  </div>
                  <div className="text-sm text-gray-400">AI Responses Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-purple-400">
                    {dashboard.live_demo?.current_demo_session.crisis_interventions_demo}
                  </div>
                  <div className="text-sm text-gray-400">Crisis Interventions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-medium text-pink-400">
                    {dashboard.live_demo?.current_demo_session.response_time_current}ms
                  </div>
                  <div className="text-sm text-gray-400">Current Response Time</div>
                </div>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <Button 
                  onClick={() => executeLiveDemo('simulate_user_growth', { growth_factor: 2.0 })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Simulate Viral Growth (2x)
                </Button>
                <Button 
                  onClick={() => executeLiveDemo('demonstrate_ai_personalization', { user_profile: 'demo' })}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Show AI Personalization
                </Button>
                <Button 
                  onClick={() => executeLiveDemo('show_crisis_prevention', { risk_scenario: 'high' })}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Crisis Prevention Demo
                </Button>
                <Button 
                  onClick={() => executeLiveDemo('stress_test_scaling', { concurrent_users: 100000 })}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Stress Test (100K users)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                AI Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PerformanceBar 
                  label="Prediction Accuracy"
                  value={dashboard.technical_metrics.ai_performance.prediction_accuracy}
                  target={80}
                  unit="%"
                />
                <PerformanceBar 
                  label="User Satisfaction"
                  value={dashboard.technical_metrics.ai_performance.personalization_effectiveness}
                  target={85}
                  unit="%"
                />
                <PerformanceBar 
                  label="Crisis Prevention Success"
                  value={dashboard.technical_metrics.ai_performance.crisis_prevention_rate}
                  target={75}
                  unit="%"
                />
                <PerformanceBar 
                  label="Response Quality Score"
                  value={dashboard.technical_metrics.ai_performance.ai_response_quality_score}
                  target={90}
                  unit="%"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6 text-green-400" />
                System Reliability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PerformanceBar 
                  label="Uptime"
                  value={dashboard.technical_metrics.reliability.uptime_percentage}
                  target={99.9}
                  unit="%"
                />
                <PerformanceBar 
                  label="Error Rate"
                  value={dashboard.technical_metrics.reliability.error_rate}
                  target={0.1}
                  unit="%"
                  inverse={true}
                />
                <PerformanceBar 
                  label="Avg Response Time"
                  value={dashboard.technical_metrics.reliability.average_response_time}
                  target={200}
                  unit="ms"
                  inverse={true}
                />
                <PerformanceBar 
                  label="P95 Response Time"
                  value={dashboard.technical_metrics.reliability.p95_response_time}
                  target={500}
                  unit="ms"
                  inverse={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Metrics */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-400" />
              Business Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-medium text-green-400">
                  ${dashboard.business_metrics.revenue.monthly_recurring_revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Monthly Recurring Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-blue-400">
                  ${dashboard.business_metrics.revenue.customer_acquisition_cost}
                </div>
                <div className="text-sm text-gray-400">Customer Acquisition Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-purple-400">
                  ${dashboard.business_metrics.revenue.lifetime_value}
                </div>
                <div className="text-sm text-gray-400">Customer Lifetime Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-pink-400">
                  {dashboard.business_metrics.revenue.churn_rate_monthly}%
                </div>
                <div className="text-sm text-gray-400">Monthly Churn Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Controls */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setLiveDemoActive(!liveDemoActive)}
            className={`${liveDemoActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} shadow-lg`}
          >
            {liveDemoActive ? 'Stop Live Demo' : 'Start Live Demo'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper Components

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
}

function MetricCard({ title, value, change, subtitle, icon, trend }: MetricCardProps) {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-purple-400">{icon}</div>
          {trend !== 'stable' && (
            <TrendingUp className={`h-4 w-4 ${trendColor} ${trend === 'down' ? 'rotate-180' : ''}`} />
          )}
        </div>
        <div className="text-2xl font-medium text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400 mb-1">{title}</div>
        {change && (
          <div className={`text-sm font-medium ${trendColor}`}>
            {change}
          </div>
        )}
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  );
}

interface PerformanceBarProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  inverse?: boolean;
}

function PerformanceBar({ label, value, target, unit, inverse = false }: PerformanceBarProps) {
  const percentage = inverse 
    ? Math.max(0, Math.min(100, ((target - value) / target) * 100))
    : Math.max(0, Math.min(100, (value / target) * 100));
  
  const isGood = inverse ? value <= target : value >= target;
  const barColor = isGood ? 'bg-green-400' : percentage > 80 ? 'bg-yellow-400' : 'bg-red-400';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-medium text-white">
          {value}{unit} / {target}{unit}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}