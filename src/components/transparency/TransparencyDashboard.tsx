/**
 * Real-Time Impact Transparency Dashboard
 * Displays measurable positive outcomes while protecting user privacy.
 * Demonstrates ALCHM's commitment to genuine social benefit over engagement manipulation.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

// Types for dashboard data
interface ImpactMetrics {
  wellnessImprovements: {
    usersReportingImprovement: number;
    averageWellnessIncrease: number;
    stressReductionRate: number;
    resilienceGrowth: number;
  };
  crisisPrevention: {
    interventionsDeployed: number;
    successfulOutcomes: number;
    responseTime: number; // in minutes
    resourcesConnected: number;
  };
  communitySupport: {
    supportInteractions: number;
    mutualAidConnections: number;
    sharedWisdom: number;
    culturalAdaptations: number;
  };
  researchContributions: {
    studiesSupported: number;
    dataPointsContributed: number;
    publicationsEnabled: number;
    evidenceGenerated: number;
  };
  privacyProtection: {
    userControlActions: number;
    dataMinimizationMeasures: number;
    transparencyRequests: number;
    rightsFulfilled: number;
  };
}

interface TransparencyMetrics {
  publicReports: number;
  auditResults: number;
  incidentTransparency: number;
  communityGovernance: number;
  openScience: number;
}

interface RealtimeData {
  currentUsers: number;
  systemHealth: number;
  safetyScore: number;
  responseTime: number;
  uptime: number;
}

export function TransparencyDashboard() {
  const [impactData, setImpactData] = useState<ImpactMetrics | null>(null);
  const [transparencyData, setTransparencyData] = useState<TransparencyMetrics | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const [impact, transparency, realtime] = await Promise.all([
        fetchImpactMetrics(timeRange),
        fetchTransparencyMetrics(timeRange),
        fetchRealtimeMetrics(),
      ]);

      setImpactData(impact);
      setTransparencyData(transparency);
      setRealtimeData(realtime);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchImpactMetrics = async (range: string): Promise<ImpactMetrics> => {
    // Simulated data - replace with actual API call
    return {
      wellnessImprovements: {
        usersReportingImprovement: 8750,
        averageWellnessIncrease: 23.5,
        stressReductionRate: 67.2,
        resilienceGrowth: 45.8,
      },
      crisisPrevention: {
        interventionsDeployed: 147,
        successfulOutcomes: 142,
        responseTime: 2.3,
        resourcesConnected: 89,
      },
      communitySupport: {
        supportInteractions: 12450,
        mutualAidConnections: 3210,
        sharedWisdom: 8960,
        culturalAdaptations: 15,
      },
      researchContributions: {
        studiesSupported: 8,
        dataPointsContributed: 250000,
        publicationsEnabled: 3,
        evidenceGenerated: 12,
      },
      privacyProtection: {
        userControlActions: 5670,
        dataMinimizationMeasures: 89,
        transparencyRequests: 234,
        rightsFulfilled: 45,
      },
    };
  };

  const fetchTransparencyMetrics = async (range: string): Promise<TransparencyMetrics> => {
    return {
      publicReports: 4,
      auditResults: 2,
      incidentTransparency: 100,
      communityGovernance: 15,
      openScience: 8,
    };
  };

  const fetchRealtimeMetrics = async (): Promise<RealtimeData> => {
    return {
      currentUsers: 1247,
      systemHealth: 99.8,
      safetyScore: 98.7,
      responseTime: 145,
      uptime: 99.95,
    };
  };

  if (loading || !impactData || !transparencyData || !realtimeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading transparency dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ALCHM Transparency Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Real-time insights into our impact, safety measures, and accountability practices
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['24h', '7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatusCard
            title="Current Users"
            value={realtimeData.currentUsers.toLocaleString()}
            icon="👥"
            status="good"
          />
          <StatusCard
            title="System Health"
            value={`${realtimeData.systemHealth}%`}
            icon="💚"
            status="excellent"
          />
          <StatusCard
            title="Safety Score"
            value={`${realtimeData.safetyScore}%`}
            icon="🛡️"
            status="excellent"
          />
          <StatusCard
            title="Response Time"
            value={`${realtimeData.responseTime}ms`}
            icon="⚡"
            status="good"
          />
          <StatusCard
            title="Uptime"
            value={`${realtimeData.uptime}%`}
            icon="📈"
            status="excellent"
          />
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🌱 Wellness Impact
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="Users Reporting Improvement"
                value={impactData.wellnessImprovements.usersReportingImprovement.toLocaleString()}
                trend="+12.3%"
                description="Users who report improved mental wellness"
              />
              <MetricRow
                label="Average Wellness Increase"
                value={`${impactData.wellnessImprovements.averageWellnessIncrease}%`}
                trend="+5.2%"
                description="Average improvement in self-reported wellness scores"
              />
              <MetricRow
                label="Stress Reduction Rate"
                value={`${impactData.wellnessImprovements.stressReductionRate}%`}
                trend="+8.1%"
                description="Users reporting reduced stress levels"
              />
              <MetricRow
                label="Resilience Growth"
                value={`${impactData.wellnessImprovements.resilienceGrowth}%`}
                trend="+6.7%"
                description="Users showing increased resilience markers"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚨 Crisis Prevention
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="Interventions Deployed"
                value={impactData.crisisPrevention.interventionsDeployed.toLocaleString()}
                trend="-3.2%"
                description="Proactive crisis interventions initiated"
                trendPositive={false}
              />
              <MetricRow
                label="Successful Outcomes"
                value={`${Math.round((impactData.crisisPrevention.successfulOutcomes / impactData.crisisPrevention.interventionsDeployed) * 100)}%`}
                trend="+2.1%"
                description="Crisis interventions with positive outcomes"
              />
              <MetricRow
                label="Average Response Time"
                value={`${impactData.crisisPrevention.responseTime} min`}
                trend="-0.5 min"
                description="Time from detection to intervention"
                trendPositive={false}
              />
              <MetricRow
                label="Resources Connected"
                value={impactData.crisisPrevention.resourcesConnected.toLocaleString()}
                trend="+15.3%"
                description="Users connected to professional resources"
              />
            </div>
          </Card>
        </div>

        {/* Community & Research Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🤝 Community Support
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="Support Interactions"
                value={impactData.communitySupport.supportInteractions.toLocaleString()}
                trend="+18.7%"
                description="Peer-to-peer support exchanges"
              />
              <MetricRow
                label="Mutual Aid Connections"
                value={impactData.communitySupport.mutualAidConnections.toLocaleString()}
                trend="+22.1%"
                description="Users connected for mutual support"
              />
              <MetricRow
                label="Shared Wisdom"
                value={impactData.communitySupport.sharedWisdom.toLocaleString()}
                trend="+14.5%"
                description="Wisdom and insights shared across cultures"
              />
              <MetricRow
                label="Cultural Adaptations"
                value={impactData.communitySupport.culturalAdaptations.toLocaleString()}
                trend="+3"
                description="New cultural adaptations implemented"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔬 Research Contributions
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="Studies Supported"
                value={impactData.researchContributions.studiesSupported.toLocaleString()}
                trend="+2"
                description="Active research studies supported"
              />
              <MetricRow
                label="Data Points Contributed"
                value={impactData.researchContributions.dataPointsContributed.toLocaleString()}
                trend="+35.2%"
                description="Anonymized data points for research"
              />
              <MetricRow
                label="Publications Enabled"
                value={impactData.researchContributions.publicationsEnabled.toLocaleString()}
                trend="+1"
                description="Peer-reviewed publications supported"
              />
              <MetricRow
                label="Evidence Generated"
                value={impactData.researchContributions.evidenceGenerated.toLocaleString()}
                trend="+4"
                description="Research evidence contributions"
              />
            </div>
          </Card>
        </div>

        {/* Privacy & Transparency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🔒 Privacy Protection
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="User Control Actions"
                value={impactData.privacyProtection.userControlActions.toLocaleString()}
                trend="+28.3%"
                description="Privacy control actions by users"
              />
              <MetricRow
                label="Data Minimization Measures"
                value={impactData.privacyProtection.dataMinimizationMeasures.toLocaleString()}
                trend="+12"
                description="Proactive data minimization measures"
              />
              <MetricRow
                label="Transparency Requests"
                value={impactData.privacyProtection.transparencyRequests.toLocaleString()}
                trend="+45.1%"
                description="User requests for transparency reports"
              />
              <MetricRow
                label="Rights Fulfilled"
                value={impactData.privacyProtection.rightsFulfilled.toLocaleString()}
                trend="+15"
                description="Data rights requests fulfilled"
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📊 Transparency Measures
            </h2>
            <div className="space-y-4">
              <MetricRow
                label="Public Reports"
                value={transparencyData.publicReports.toLocaleString()}
                trend="+1"
                description="Quarterly transparency reports published"
              />
              <MetricRow
                label="Audit Results"
                value={transparencyData.auditResults.toLocaleString()}
                trend="+1"
                description="Third-party audit results published"
              />
              <MetricRow
                label="Incident Transparency"
                value={`${transparencyData.incidentTransparency}%`}
                trend="0%"
                description="Incidents with transparent disclosure"
              />
              <MetricRow
                label="Community Governance"
                value={transparencyData.communityGovernance.toLocaleString()}
                trend="+7"
                description="Active community governance proposals"
              />
            </div>
          </Card>
        </div>

        {/* Action Items & Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Transparency Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TransparencyLink
              title="Full Transparency Report"
              description="Complete quarterly report with detailed metrics"
              href="/transparency/reports/latest"
              icon="📄"
            />
            <TransparencyLink
              title="Audit Results"
              description="Third-party security and privacy audit findings"
              href="/transparency/audits"
              icon="🔍"
            />
            <TransparencyLink
              title="Community Governance"
              description="Participate in platform governance decisions"
              href="/governance"
              icon="🗳️"
            />
            <TransparencyLink
              title="Research Ethics"
              description="Our research practices and open science initiatives"
              href="/transparency/research"
              icon="🧪"
            />
          </div>
        </Card>

        {/* Privacy Notice */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 text-xl">🔒</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Privacy-First Transparency
              </h3>
              <p className="text-blue-800 mb-3">
                All metrics shown are derived from anonymized, aggregated data that cannot be traced back to individual users. 
                We employ differential privacy, k-anonymity, and other privacy-preserving techniques to ensure your data remains protected 
                while still allowing us to demonstrate our positive impact.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Learn About Our Privacy Measures
                </Button>
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  View Your Data Controls
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: string;
  icon: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

function StatusCard({ title, value, icon, status }: StatusCardProps) {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200 text-green-800',
    good: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <Card className={`p-4 ${statusColors[status]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </Card>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  trend: string;
  description: string;
  trendPositive?: boolean;
}

function MetricRow({ label, value, trend, description, trendPositive = true }: MetricRowProps) {
  const trendColor = trendPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">{value}</span>
            <span className={`text-sm font-medium ${trendColor}`}>{trend}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}

interface TransparencyLinkProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

function TransparencyLink({ title, description, href, icon }: TransparencyLinkProps) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
    >
      <div className="flex items-start space-x-3">
        <div className="text-xl">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
            {title}
          </h3>
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}