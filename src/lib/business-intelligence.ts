// ALCHM Business Intelligence Engine
// Privacy-compliant analytics and actionable business insights
'use client';

import { analytics } from './analytics';

// Types for Business Intelligence
export interface BusinessMetrics {
  // User Journey Metrics
  acquisition: {
    totalUsers: number;
    newUsers: number;
    activationRate: number;
    sourceBreakdown: Record<string, number>;
    conversionFunnel: {
      visitors: number;
      signups: number;
      firstJournal: number;
      activeUsers: number;
      paidUsers: number;
    };
  };

  // Revenue Metrics
  revenue: {
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
    arpu: number; // Average Revenue Per User
    ltv: number; // Customer Lifetime Value
    churnRate: number;
    netRevenueRetention: number;
    revenueByTier: Record<string, number>;
    paymentMetrics: {
      successRate: number;
      averageTransactionValue: number;
      refundRate: number;
    };
  };

  // Engagement Metrics
  engagement: {
    dau: number; // Daily Active Users
    wau: number; // Weekly Active Users
    mau: number; // Monthly Active Users
    sessionDuration: number;
    journalsPerUser: number;
    streakDistribution: Record<string, number>;
    featureAdoption: Record<string, number>;
    retentionCohorts: RetentionCohort[];
  };

  // Crisis Safety Metrics
  crisisSafety: {
    interventions: number;
    responseTime: number;
    effectivenessScore: number;
    resourceUtilization: Record<string, number>;
    preventedIncidents: number;
    followUpEngagement: number;
  };

  // Performance Metrics
  performance: {
    averageLoadTime: number;
    crashRate: number;
    errorRate: number;
    uptime: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
  };

  // Support Metrics
  support: {
    ticketVolume: number;
    responseTime: number;
    resolutionTime: number;
    satisfactionScore: number;
    escalationRate: number;
  };
}

export interface RetentionCohort {
  cohortDate: string;
  userCount: number;
  retention: {
    day1: number;
    day7: number;
    day30: number;
    day90: number;
    day365: number;
  };
}

export interface PredictiveInsights {
  churnRisk: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    predictedChurn: number;
  };
  growthForecast: {
    nextMonth: {
      users: number;
      revenue: number;
      confidence: number;
    };
    nextQuarter: {
      users: number;
      revenue: number;
      confidence: number;
    };
  };
  resourceOptimization: {
    serverCapacity: number;
    supportStaffing: number;
    crisisResources: number;
  };
}

export interface CompetitiveIntelligence {
  marketPosition: {
    ranking: number;
    marketShare: number;
    competitorComparison: Record<string, any>;
  };
  featureGaps: string[];
  opportunities: string[];
  threats: string[];
}

// Privacy-Compliant Business Intelligence Manager
class BusinessIntelligenceManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Get comprehensive business metrics
  async getBusinessMetrics(timeframe: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<BusinessMetrics> {
    const cacheKey = `business-metrics-${timeframe}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`/api/business-intelligence/metrics?timeframe=${timeframe}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const metrics = await response.json();
      this.setCachedData(cacheKey, metrics);
      return metrics;
    } catch (error) {
      console.error('[BI] Failed to fetch business metrics:', error);
      return this.getFallbackMetrics();
    }
  }

  // Get real-time KPIs
  async getRealTimeKPIs(): Promise<{
    activeUsers: number;
    newSignups: number;
    revenue: number;
    crisisInterventions: number;
    systemHealth: number;
  }> {
    try {
      const response = await fetch('/api/business-intelligence/realtime-kpis');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('[BI] Failed to fetch real-time KPIs:', error);
    }

    return {
      activeUsers: 0,
      newSignups: 0,
      revenue: 0,
      crisisInterventions: 0,
      systemHealth: 100,
    };
  }

  // Get user behavior insights
  async getUserBehaviorInsights(timeframe: string = '30d'): Promise<{
    journeyAnalysis: any;
    engagementPatterns: any;
    dropoffPoints: any;
    featureUsage: any;
  }> {
    const cacheKey = `user-behavior-${timeframe}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`/api/business-intelligence/user-behavior?timeframe=${timeframe}`);
      if (response.ok) {
        const insights = await response.json();
        this.setCachedData(cacheKey, insights);
        return insights;
      }
    } catch (error) {
      console.error('[BI] Failed to fetch user behavior insights:', error);
    }

    return {
      journeyAnalysis: {},
      engagementPatterns: {},
      dropoffPoints: {},
      featureUsage: {},
    };
  }

  // Get predictive analytics
  async getPredictiveInsights(): Promise<PredictiveInsights> {
    const cacheKey = 'predictive-insights';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch('/api/business-intelligence/predictive');
      if (response.ok) {
        const insights = await response.json();
        this.setCachedData(cacheKey, insights);
        return insights;
      }
    } catch (error) {
      console.error('[BI] Failed to fetch predictive insights:', error);
    }

    return {
      churnRisk: { highRisk: 0, mediumRisk: 0, lowRisk: 0, predictedChurn: 0 },
      growthForecast: {
        nextMonth: { users: 0, revenue: 0, confidence: 0 },
        nextQuarter: { users: 0, revenue: 0, confidence: 0 },
      },
      resourceOptimization: {
        serverCapacity: 100,
        supportStaffing: 100,
        crisisResources: 100,
      },
    };
  }

  // Get competitive intelligence
  async getCompetitiveIntelligence(): Promise<CompetitiveIntelligence> {
    const cacheKey = 'competitive-intelligence';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch('/api/business-intelligence/competitive');
      if (response.ok) {
        const intelligence = await response.json();
        this.setCachedData(cacheKey, intelligence);
        return intelligence;
      }
    } catch (error) {
      console.error('[BI] Failed to fetch competitive intelligence:', error);
    }

    return {
      marketPosition: { ranking: 0, marketShare: 0, competitorComparison: {} },
      featureGaps: [],
      opportunities: [],
      threats: [],
    };
  }

  // Generate automated reports
  async generateReport(
    type: 'daily' | 'weekly' | 'monthly' | 'investor',
    format: 'json' | 'pdf' | 'csv' = 'json'
  ): Promise<{
    reportId: string;
    downloadUrl?: string;
    data?: any;
  }> {
    try {
      const response = await fetch('/api/business-intelligence/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, format }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('[BI] Failed to generate report:', error);
    }

    return {
      reportId: `error-${Date.now()}`,
      data: { error: 'Report generation failed' },
    };
  }

  // Export data with privacy compliance
  async exportData(
    dataType: 'metrics' | 'insights' | 'reports',
    timeframe: string,
    format: 'json' | 'csv' | 'pdf'
  ): Promise<Blob | null> {
    try {
      const response = await fetch('/api/business-intelligence/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataType, timeframe, format }),
      });

      if (response.ok) {
        return await response.blob();
      }
    } catch (error) {
      console.error('[BI] Failed to export data:', error);
    }

    return null;
  }

  // Track business events
  trackBusinessEvent(
    event: string,
    category: 'revenue' | 'user' | 'crisis' | 'performance' | 'support',
    metadata?: Record<string, any>
  ): void {
    analytics.track(category, event, undefined, undefined, {
      ...metadata,
      businessContext: true,
      timestamp: Date.now(),
    });
  }

  // Monitor critical alerts
  async getCriticalAlerts(): Promise<{
    alerts: Array<{
      id: string;
      type: 'revenue' | 'crisis' | 'performance' | 'security';
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      timestamp: number;
      actionRequired: boolean;
    }>;
  }> {
    try {
      const response = await fetch('/api/business-intelligence/alerts');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('[BI] Failed to fetch critical alerts:', error);
    }

    return { alerts: [] };
  }

  // Utility methods
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getFallbackMetrics(): BusinessMetrics {
    return {
      acquisition: {
        totalUsers: 0,
        newUsers: 0,
        activationRate: 0,
        sourceBreakdown: {},
        conversionFunnel: {
          visitors: 0,
          signups: 0,
          firstJournal: 0,
          activeUsers: 0,
          paidUsers: 0,
        },
      },
      revenue: {
        mrr: 0,
        arr: 0,
        arpu: 0,
        ltv: 0,
        churnRate: 0,
        netRevenueRetention: 0,
        revenueByTier: {},
        paymentMetrics: {
          successRate: 0,
          averageTransactionValue: 0,
          refundRate: 0,
        },
      },
      engagement: {
        dau: 0,
        wau: 0,
        mau: 0,
        sessionDuration: 0,
        journalsPerUser: 0,
        streakDistribution: {},
        featureAdoption: {},
        retentionCohorts: [],
      },
      crisisSafety: {
        interventions: 0,
        responseTime: 0,
        effectivenessScore: 0,
        resourceUtilization: {},
        preventedIncidents: 0,
        followUpEngagement: 0,
      },
      performance: {
        averageLoadTime: 0,
        crashRate: 0,
        errorRate: 0,
        uptime: 100,
        coreWebVitals: {
          lcp: 0,
          fid: 0,
          cls: 0,
        },
      },
      support: {
        ticketVolume: 0,
        responseTime: 0,
        resolutionTime: 0,
        satisfactionScore: 0,
        escalationRate: 0,
      },
    };
  }
}

// Create singleton instance
export const businessIntelligence = new BusinessIntelligenceManager();

// React hooks for business intelligence
export function useBusinessMetrics(timeframe: '24h' | '7d' | '30d' | '90d' = '30d') {
  const [metrics, setMetrics] = React.useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function fetchMetrics() {
      try {
        setLoading(true);
        setError(null);
        const data = await businessIntelligence.getBusinessMetrics(timeframe);
        if (mounted) {
          setMetrics(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchMetrics();

    return () => {
      mounted = false;
    };
  }, [timeframe]);

  return { metrics, loading, error, refetch: () => setLoading(true) };
}

export function useRealTimeKPIs(refreshInterval: number = 30000) {
  const [kpis, setKpis] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    let interval: NodeJS.Timeout;

    async function fetchKPIs() {
      try {
        const data = await businessIntelligence.getRealTimeKPIs();
        if (mounted) {
          setKpis(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('[BI Hook] Failed to fetch real-time KPIs:', error);
      }
    }

    fetchKPIs();
    interval = setInterval(fetchKPIs, refreshInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return { kpis, loading };
}

export function usePredictiveInsights() {
  const [insights, setInsights] = React.useState<PredictiveInsights | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    async function fetchInsights() {
      try {
        const data = await businessIntelligence.getPredictiveInsights();
        if (mounted) {
          setInsights(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('[BI Hook] Failed to fetch predictive insights:', error);
      }
    }

    fetchInsights();

    return () => {
      mounted = false;
    };
  }, []);

  return { insights, loading };
}

// Import React for hooks
import React from 'react';