/**
 * ALCHM Metric Amplification Dashboard
 * Jony Ive Design Excellence: "Objects should speak to the subconscious"
 * 
 * Executive-level analytics dashboard with sophisticated data visualization,
 * trauma-informed design, and intuitive information hierarchy.
 * 
 * Core Philosophy:
 * - Radical simplicity in complex data
 * - Sage green as the singular design accent
 * - Every pixel serves executive decision-making
 * - Trauma-informed gentle animations and states
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// PERFORMANCE CRITICAL: Lazy imports to prevent memory leaks
const LazyMetricSystem = React.lazy(() => 
  import('@/lib/analytics-optimization/metric-amplification-system').then(module => ({
    default: module.metricAmplificationSystem
  }))
);

// CRISIS OPTIMIZATION: Preload only essential components
const CrisisOptimizedComponents = {
  charts: React.lazy(() => import('./components/OptimizedCharts')),
  alerts: React.lazy(() => import('./components/CrisisAlerts'))
};

interface DashboardMetrics {
  conversion: {
    rate: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    funnelData: any;
  };
  retention: {
    day30: number;
    day90: number;
    day180: number;
    churnRisk: number;
    engagementScore: number;
  };
  professionalNPS: {
    score: number;
    promoters: number;
    detractors: number;
    trend: 'up' | 'down' | 'stable';
  };
  personalization: {
    aiAccuracy: number;
    personalizationScore: number;
    interventionSuccess: number;
  };
  alerts: any[];
}

export function MetricAmplificationDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'conversion' | 'retention' | 'professional' | 'ai'>('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // CRITICAL MEMORY LEAK PREVENTION
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const memoryCleanupRef = useRef<(() => void)[]>([]);
  const componentCacheRef = useRef<Map<string, any>>(new Map());
  
  // PERFORMANCE MONITORING
  const performanceStartRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    const initializationStart = performance.now();
    
    // CRISIS OPTIMIZATION: Faster initial load for crisis users
    const isCrisisUser = window.location.search.includes('crisis=true');
    const refreshInterval = isCrisisUser ? 60000 : 300000; // 1min for crisis, 5min for normal
    
    loadDashboardMetrics();
    
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        // MEMORY MANAGEMENT: Check memory usage before refresh
        if (performance.memory && performance.memory.usedJSHeapSize > 50 * 1024 * 1024) {
          console.warn('[Performance] Memory usage high, skipping refresh cycle');
          return;
        }
        loadDashboardMetrics();
      }, refreshInterval);
    }
    
    // PERFORMANCE TRACKING
    const initTime = performance.now() - initializationStart;
    if (initTime > 1000) {
      console.warn(`[Performance] Dashboard initialization took ${initTime.toFixed(2)}ms`);
    }
    
    return () => {
      // COMPREHENSIVE CLEANUP
      const cleanupStart = performance.now();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      // MEMORY CLEANUP
      memoryCleanupRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.error('[Performance] Cleanup error:', error);
        }
      });
      memoryCleanupRef.current = [];
      
      // CACHE CLEANUP
      componentCacheRef.current.clear();
      
      isMountedRef.current = false;
      
      const cleanupTime = performance.now() - cleanupStart;
      if (cleanupTime > 100) {
        console.warn(`[Performance] Dashboard cleanup took ${cleanupTime.toFixed(2)}ms`);
      }
    };
  }, [timeframe, autoRefresh]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadDashboardMetrics = useCallback(async () => {
    const loadStart = performance.now();
    renderCountRef.current++;
    
    // CRISIS OPTIMIZATION: Skip loading if too many renders
    if (renderCountRef.current > 10) {
      console.warn('[Performance] Too many renders, throttling dashboard updates');
      return;
    }
    
    // MEMORY LEAK PREVENTION
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    try {
      if (!isMountedRef.current) return;
      setLoading(true);
      
      // PERFORMANCE CACHE: Check if we have recent data
      const cacheKey = `metrics_${timeframe}_${Date.now() - (Date.now() % 60000)}`; // 1-minute cache
      const cachedData = componentCacheRef.current.get(cacheKey);
      
      if (cachedData && !window.location.search.includes('crisis=true')) {
        setMetrics(cachedData);
        setLoading(false);
        return;
      }
      
      // CRISIS OPTIMIZATION: Faster mock data loading
      const mockData = {
        metricDashboard: { alerts: [] },
        conversionFunnel: { 
          overallConversionRate: 12.4,
          stages: [
            { stage: 'Landing Page', users: 45280, conversionRate: 100 },
            { stage: 'Account Creation', users: 8920, conversionRate: 19.7 },
            { stage: 'First Journal', users: 6734, conversionRate: 75.5 },
            { stage: 'Premium Upgrade', users: 1347, conversionRate: 20.0 }
          ]
        },
        retentionAnalysis: {
          overallRetention: { day30: 74.1, day90: 68.9, day180: 67.8 },
          churnPrediction: { topFeatures: ['engagement', 'usage'] }
        },
        professionalNPS: {
          overallNPS: 73,
          npsTrend: [{ promoters: 68, detractors: 7 }]
        }
      };
      
      // CRISIS OPTIMIZATION: Reduce delay for crisis users
      const isCrisisUser = window.location.search.includes('crisis=true');
      const delay = isCrisisUser ? 200 : 400;
      await new Promise(resolve => setTimeout(resolve, delay));

      // MEMORY CHECK: Ensure component is still mounted
      if (!isMountedRef.current) return;
      
      const processedMetrics = {
        conversion: {
          rate: mockData.conversionFunnel.overallConversionRate,
          target: 15.0,
          trend: mockData.conversionFunnel.overallConversionRate > 12 ? 'up' : 'down' as const,
          funnelData: mockData.conversionFunnel
        },
        retention: {
          day30: mockData.retentionAnalysis.overallRetention.day30,
          day90: mockData.retentionAnalysis.overallRetention.day90,
          day180: mockData.retentionAnalysis.overallRetention.day180,
          churnRisk: mockData.retentionAnalysis.churnPrediction.topFeatures.length,
          engagementScore: 78.5
        },
        professionalNPS: {
          score: mockData.professionalNPS.overallNPS,
          promoters: mockData.professionalNPS.npsTrend[0]?.promoters || 0,
          detractors: mockData.professionalNPS.npsTrend[0]?.detractors || 0,
          trend: mockData.professionalNPS.overallNPS > 60 ? 'up' : 'down' as const
        },
        personalization: {
          aiAccuracy: 87.5,
          personalizationScore: 82.1,
          interventionSuccess: 74.8
        },
        alerts: mockData.metricDashboard.alerts
      };
      
      // PERFORMANCE CACHE: Store processed data
      componentCacheRef.current.set(cacheKey, processedMetrics);
      
      // MEMORY MANAGEMENT: Limit cache size
      if (componentCacheRef.current.size > 5) {
        const firstKey = componentCacheRef.current.keys().next().value;
        componentCacheRef.current.delete(firstKey);
      }
      
      setMetrics(processedMetrics);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't log as error
        return;
      }
      console.error('[Performance] Failed to load dashboard metrics:', error);
      
      // CRISIS FALLBACK: Ensure we still show basic metrics
      if (window.location.search.includes('crisis=true')) {
        setMetrics({
          conversion: { rate: 0, target: 15.0, trend: 'stable', funnelData: { stages: [] } },
          retention: { day30: 0, day90: 0, day180: 0, churnRisk: 0, engagementScore: 0 },
          professionalNPS: { score: 0, promoters: 0, detractors: 0, trend: 'stable' },
          personalization: { aiAccuracy: 0, personalizationScore: 0, interventionSuccess: 0 },
          alerts: []
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      
      // PERFORMANCE TRACKING
      const loadTime = performance.now() - loadStart;
      if (loadTime > 2000) {
        console.warn(`[Performance] Dashboard metrics load took ${loadTime.toFixed(2)}ms`);
      }
    }
  }, [timeframe]);

  // Jony Ive Loading State: Meditative, never anxious
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fefcfb] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-2 border-[#d1dac4] animate-gentle-pulse"></div>
            <div className="absolute inset-2 rounded-full border-2 border-[#a4b792] animate-gentle-breathe"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-light text-[#262626] tracking-tight">Gathering insights</p>
            <p className="text-sm text-[#737373]">Processing analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefcfb]">
      {/* Jony Ive Header: Generous whitespace, purposeful typography */}
      <div className="pt-12 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-light text-[#171717] tracking-tight leading-[1.6]">
                Analytics Command Center
              </h1>
              <p className="text-lg text-[#525252] font-light leading-[1.7]">
                Executive insights driving conversion, retention, and professional growth
              </p>
            </div>
            
            {/* Minimal Control Panel */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="appearance-none bg-[#fefcfb] border border-[#e5e5e5] rounded-xl px-6 py-3 pr-10 text-[#404040] font-medium focus:outline-none focus:ring-2 focus:ring-[#a4b792]/30 focus:border-[#a4b792] transition-all duration-300 min-h-[44px]"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="180d">Last 180 days</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-[#a3a3a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <Button
                onClick={loadDashboardMetrics}
                variant="primary"
                size="default"
                className="px-6 min-h-[44px]"
              >
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Alert System: Gentle yet urgent */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          {metrics?.alerts && metrics.alerts.length > 0 && (
            <Card variant="gentle" className="mb-8 border-l-4 border-[#a4b792]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#a4b792] rounded-full animate-gentle-pulse"></div>
                  <CardTitle level="h3" className="text-[#262626] font-medium">
                    Active Insights
                  </CardTitle>
                  <span className="text-sm text-[#737373] bg-[#f0f0f0] px-2 py-1 rounded-full">
                    {metrics.alerts.length} items
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.alerts.slice(0, 3).map((alert, index) => (
                    <div key={index} className="group flex items-center justify-between p-4 bg-[#fefcfb] rounded-xl border border-[#f0f0f0] hover:border-[#d1dac4] transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === 'high' ? 'bg-red-400' : 
                          alert.severity === 'medium' ? 'bg-amber-400' : 'bg-[#a4b792]'
                        }`}></div>
                        <div>
                          <p className="font-medium text-[#262626]">{alert.message}</p>
                          <p className="text-sm text-[#737373] capitalize">{alert.severity} priority</p>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Executive Metrics: Jony Ive minimalism meets data storytelling */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <ExecutiveMetricCard
              title="Conversion Excellence"
              value={metrics?.conversion.rate.toFixed(1) || '0.0'}
              unit="%"
              target={metrics?.conversion.target || 15}
              trend={metrics?.conversion.trend}
              description="Revenue conversion rate"
              isPrimary
            />
            
            <ExecutiveMetricCard
              title="Long-term Retention"
              value={metrics?.retention.day180.toFixed(1) || '0.0'}
              unit="%"
              target={60}
              trend={metrics?.retention.day180 > 50 ? 'up' : 'down'}
              description="6-month user retention"
            />
            
            <ExecutiveMetricCard
              title="Professional NPS"
              value={metrics?.professionalNPS.score.toFixed(0) || '0'}
              unit=""
              target={70}
              trend={metrics?.professionalNPS.trend}
              description="Therapist satisfaction"
            />
            
            <ExecutiveMetricCard
              title="AI Performance"
              value={metrics?.personalization.aiAccuracy.toFixed(1) || '0.0'}
              unit="%"
              target={90}
              trend="up"
              description="Model accuracy score"
            />
          </div>
        </div>
      </div>

      {/* Executive Navigation: Clean, purposeful, essential */}
      <div className="px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'overview', label: 'Executive Overview' },
              { id: 'conversion', label: 'Conversion Funnel' },
              { id: 'retention', label: 'Retention Analysis' },
              { id: 'professional', label: 'Professional Network' },
              { id: 'ai', label: 'AI Intelligence' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#a4b792] text-white shadow-soft'
                    : 'text-[#525252] hover:text-[#262626] hover:bg-[#f9f9f9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Content Sections */}
      <div className="px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && metrics && (
            <ExecutiveOverview metrics={metrics} />
          )}
          
          {activeTab === 'conversion' && (
            <ConversionAnalysisView timeframe={timeframe} />
          )}
          
          {activeTab === 'retention' && (
            <RetentionAnalysisView timeframe={timeframe} />
          )}
          
          {activeTab === 'professional' && (
            <ProfessionalNPSView timeframe={timeframe} />
          )}
          
          {activeTab === 'ai' && (
            <AIInsightsView />
          )}
        </div>
      </div>
    </div>
  );
}

// Executive Metric Card: Jony Ive excellence in data presentation
interface ExecutiveMetricCardProps {
  title: string;
  value: string;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  isPrimary?: boolean;
}

function ExecutiveMetricCard({ 
  title, 
  value, 
  unit, 
  target, 
  trend, 
  description, 
  isPrimary = false 
}: ExecutiveMetricCardProps) {
  const numericValue = parseFloat(value);
  const progressPercentage = Math.min((numericValue / target) * 100, 100);
  
  const trendConfig = {
    up: { color: 'text-[#7a8c6a]', icon: '↗', bgColor: 'bg-[#f6f8f4]' },
    down: { color: 'text-red-500', icon: '↘', bgColor: 'bg-red-50' },
    stable: { color: 'text-[#737373]', icon: '→', bgColor: 'bg-[#f9f9f9]' }
  };
  
  const currentTrend = trendConfig[trend];

  return (
    <Card 
      variant={isPrimary ? "elevated" : "sanctuary"} 
      className={`group hover:shadow-nurturing transition-all duration-500 ${
        isPrimary ? 'ring-1 ring-[#d1dac4]' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardDescription className="text-sm text-[#737373] font-medium">
              {title}
            </CardDescription>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-[#171717] tracking-tight">
                {value}
              </span>
              <span className="text-lg text-[#525252] font-medium">
                {unit}
              </span>
            </div>
          </div>
          
          <div className={`p-2 rounded-lg ${currentTrend.bgColor} transition-all duration-300`}>
            <span className={`text-lg font-medium ${currentTrend.color}`}>
              {currentTrend.icon}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#525252]">{description}</span>
              <span className="text-[#737373]">Target: {target}{unit}</span>
            </div>
            
            {/* Progress visualization */}
            <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  progressPercentage >= 100 ? 'bg-[#a4b792]' :
                  progressPercentage >= 75 ? 'bg-[#b5c6a0]' :
                  progressPercentage >= 50 ? 'bg-amber-300' : 'bg-[#d4d4d4]'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Executive Overview: The storytelling dashboard
function ExecutiveOverview({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="space-y-8">
      {/* Conversion Funnel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle level="h2">Revenue Conversion Journey</CardTitle>
              <CardDescription>
                User progression through conversion stages with drop-off analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.conversion.funnelData.stages?.slice(0, 5).map((stage: any, index: number) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between p-4 bg-[#f9f9f9] rounded-xl hover:bg-[#f6f8f4] transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-[#a4b792] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-[#262626]">{stage.stage}</p>
                          <p className="text-sm text-[#737373]">
                            {stage.conversionRate.toFixed(1)}% conversion rate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-light text-[#171717]">
                          {stage.users.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#737373]">users</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Retention Cohort Timeline */}
        <Card variant="sanctuary">
          <CardHeader>
            <CardTitle level="h3">Retention Excellence</CardTitle>
            <CardDescription>User engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { period: 'Day 7', value: metrics.retention.day30, color: 'bg-[#e8ede1]' },
                { period: 'Day 30', value: metrics.retention.day90, color: 'bg-[#d1dac4]' },
                { period: 'Day 90', value: metrics.retention.day180, color: 'bg-[#b5c6a0]' },
                { period: '6 Months', value: metrics.retention.day180, color: 'bg-[#a4b792]' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-[#404040]">{item.period}</span>
                  </div>
                  <span className="text-lg font-light text-[#171717]">
                    {item.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Professional & AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle level="h3">Professional Network Health</CardTitle>
            <CardDescription>Therapist community engagement and satisfaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-light text-[#7a8c6a]">
                  {metrics.professionalNPS.promoters}
                </div>
                <div className="text-sm text-[#525252]">Promoters</div>
                <div className="w-full h-2 bg-[#e8ede1] rounded-full">
                  <div className="h-2 bg-[#a4b792] rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-light text-[#171717]">
                  {metrics.professionalNPS.score}
                </div>
                <div className="text-sm text-[#525252]">NPS Score</div>
                <div className="w-full h-2 bg-[#f0f0f0] rounded-full">
                  <div className="h-2 bg-[#a4b792] rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-light text-red-400">
                  {metrics.professionalNPS.detractors}
                </div>
                <div className="text-sm text-[#525252]">Detractors</div>
                <div className="w-full h-2 bg-red-100 rounded-full">
                  <div className="h-2 bg-red-400 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card variant="elevated">
          <CardHeader>
            <CardTitle level="h3">AI Intelligence Performance</CardTitle>
            <CardDescription>Machine learning model accuracy and personalization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { 
                  label: 'Model Accuracy', 
                  value: metrics.personalization.aiAccuracy, 
                  target: 90,
                  color: 'sage'
                },
                { 
                  label: 'Personalization Score', 
                  value: metrics.personalization.personalizationScore, 
                  target: 85,
                  color: 'sage'
                },
                { 
                  label: 'Intervention Success', 
                  value: metrics.personalization.interventionSuccess, 
                  target: 80,
                  color: 'sage'
                }
              ].map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-[#404040]">{metric.label}</span>
                    <span className="text-lg font-light text-[#171717]">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-[#f0f0f0] rounded-full">
                    <div 
                      className="h-2 bg-[#a4b792] rounded-full transition-all duration-1000"
                      style={{ width: `${(metric.value / metric.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Executive-Level Detailed Views: Sophisticated data storytelling

function ConversionAnalysisView({ timeframe }: { timeframe: string }) {
  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle level="h2">Conversion Funnel Deep Dive</CardTitle>
          <CardDescription>
            Comprehensive revenue optimization analysis for {timeframe}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Funnel Performance</h4>
                <div className="space-y-4">
                  {/* Simulated funnel stages */}
                  {[
                    { stage: 'Landing Page Visits', users: 45280, rate: 100 },
                    { stage: 'Account Creation', users: 8920, rate: 19.7 },
                    { stage: 'First Journal Entry', users: 6734, rate: 75.5 },
                    { stage: 'Premium Upgrade', users: 1347, rate: 20.0 },
                    { stage: 'Long-term Retention', users: 943, rate: 70.0 }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-sanctuary-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-[#262626]">{item.stage}</span>
                        <span className="text-[#7a8c6a] font-medium">{item.rate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#525252]">{item.users.toLocaleString()} users</span>
                        <div className="w-24 h-2 bg-sanctuary-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-[#a4b792] rounded-full transition-all duration-1000"
                            style={{ width: `${(item.rate / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Optimization Opportunities</h4>
                <div className="space-y-3">
                  {[
                    { area: 'Onboarding Flow', impact: 'High', potential: '+12% conversion' },
                    { area: 'Payment Processing', impact: 'Medium', potential: '+5% completion' },
                    { area: 'Mobile Experience', impact: 'High', potential: '+18% mobile conv.' }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border border-sanctuary-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#262626]">{item.area}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          item.impact === 'High' ? 'bg-[#e8ede1] text-[#647354]' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-[#525252] mt-1">{item.potential}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RetentionAnalysisView({ timeframe }: { timeframe: string }) {
  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle level="h2">Retention Excellence Analysis</CardTitle>
          <CardDescription>
            User engagement and lifecycle optimization for {timeframe}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Cohort Retention Curves</h4>
                <div className="h-64 bg-sanctuary-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-[#737373]">Interactive retention curve visualization</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Engagement Patterns</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { metric: 'Daily Active Users', value: '12.4K', change: '+8.2%' },
                    { metric: 'Session Duration', value: '14.2 min', change: '+12.1%' },
                    { metric: 'Weekly Sessions', value: '3.8', change: '+5.7%' },
                    { metric: 'Feature Adoption', value: '67%', change: '+15.3%' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-sanctuary-gray-50 rounded-xl">
                      <p className="text-sm text-[#525252]">{item.metric}</p>
                      <p className="text-2xl font-light text-[#171717]">{item.value}</p>
                      <p className="text-sm text-[#7a8c6a]">{item.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Churn Risk Analysis</h4>
                <div className="space-y-3">
                  {[
                    { risk: 'High Risk', users: 847, color: 'bg-red-100 text-red-700' },
                    { risk: 'Medium Risk', users: 1234, color: 'bg-amber-100 text-amber-700' },
                    { risk: 'Low Risk', users: 8921, color: 'bg-[#e8ede1] text-[#647354]' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-sanctuary-white border border-sanctuary-gray-200 rounded-lg">
                      <span className={`text-sm px-2 py-1 rounded-full ${item.color}`}>{item.risk}</span>
                      <span className="font-medium text-[#171717]">{item.users.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfessionalNPSView({ timeframe }: { timeframe: string }) {
  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle level="h2">Professional Network Intelligence</CardTitle>
          <CardDescription>
            Therapist community health and satisfaction analysis for {timeframe}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">NPS Breakdown</h4>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-[#f6f8f4] rounded-xl">
                    <div className="text-4xl font-light text-[#7a8c6a] mb-2">73</div>
                    <div className="text-sm text-[#525252]">Overall NPS Score</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
                      <div className="text-2xl font-light text-[#7a8c6a]">68%</div>
                      <div className="text-xs text-[#525252]">Promoters</div>
                    </div>
                    <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
                      <div className="text-2xl font-light text-[#404040]">25%</div>
                      <div className="text-xs text-[#525252]">Passives</div>
                    </div>
                    <div className="p-3 bg-sanctuary-gray-50 rounded-lg">
                      <div className="text-2xl font-light text-red-500">7%</div>
                      <div className="text-xs text-[#525252]">Detractors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Feedback Themes</h4>
                <div className="space-y-3">
                  {[
                    { theme: 'Clinical Documentation', sentiment: 'Positive', mentions: 156 },
                    { theme: 'Platform Reliability', sentiment: 'Positive', mentions: 134 },
                    { theme: 'User Interface', sentiment: 'Mixed', mentions: 89 },
                    { theme: 'Integration Tools', sentiment: 'Needs Improvement', mentions: 67 }
                  ].map((item, index) => (
                    <div key={index} className="p-3 border border-sanctuary-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#262626]">{item.theme}</span>
                        <span className="text-sm text-[#737373]">{item.mentions} mentions</span>
                      </div>
                      <div className={`text-sm mt-1 ${
                        item.sentiment === 'Positive' ? 'text-[#7a8c6a]' :
                        item.sentiment === 'Mixed' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {item.sentiment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AIInsightsView() {
  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle level="h2">AI Intelligence Dashboard</CardTitle>
          <CardDescription>
            Machine learning performance and personalization intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Model Performance</h4>
                <div className="space-y-4">
                  {[
                    { model: 'Emotional State Classifier', accuracy: 92.4, confidence: 89.2 },
                    { model: 'Crisis Detection System', accuracy: 96.8, confidence: 94.1 },
                    { model: 'Personalization Engine', accuracy: 87.3, confidence: 85.7 },
                    { model: 'Content Recommendation', accuracy: 84.9, confidence: 81.3 }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-sanctuary-gray-50 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-[#262626]">{item.model}</span>
                        <span className="text-[#7a8c6a] font-medium">{item.accuracy}%</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#525252]">Accuracy</span>
                          <span className="text-[#525252]">Confidence: {item.confidence}%</span>
                        </div>
                        <div className="h-2 bg-sanctuary-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-[#a4b792] rounded-full transition-all duration-1000"
                            style={{ width: `${item.accuracy}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-[#262626] mb-4">Personalization Impact</h4>
                <div className="space-y-4">
                  {[
                    { metric: 'Engagement Lift', value: '+24%', description: 'vs. non-personalized' },
                    { metric: 'Session Duration', value: '+18%', description: 'avg. increase' },
                    { metric: 'Feature Adoption', value: '+31%', description: 'recommended features' },
                    { metric: 'Satisfaction Score', value: '+15%', description: 'user rating improvement' }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border border-sanctuary-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#262626]">{item.metric}</span>
                        <span className="text-2xl font-light text-[#7a8c6a]">{item.value}</span>
                      </div>
                      <p className="text-sm text-[#525252] mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}