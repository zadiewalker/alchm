// ALCHM Performance Monitoring & Competitive Intelligence Dashboard
// Real-time system performance and market positioning analytics

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PerformanceMetrics {
  system: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  webVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  availability: {
    api: number;
    database: number;
    cdn: number;
    auth: number;
  };
  security: {
    threats_blocked: number;
    ssl_grade: string;
    vulnerability_score: number;
    compliance_score: number;
  };
}

interface CompetitiveData {
  marketPosition: {
    ranking: number;
    marketShare: number;
    competitors: Array<{
      name: string;
      ranking: number;
      strengths: string[];
      weaknesses: string[];
    }>;
  };
  featureComparison: {
    ourFeatures: number;
    industryAverage: number;
    gaps: string[];
    advantages: string[];
  };
  pricing: {
    ourPricing: number;
    competitorAverage: number;
    pricePosition: 'premium' | 'competitive' | 'value';
  };
  sentiment: {
    ourRating: number;
    industryAverage: number;
    reviewCount: number;
    keyTopics: string[];
  };
}

const SystemHealthIndicator: React.FC<{
  label: string;
  value: number;
  threshold: { good: number; warning: number };
  unit?: string;
  reverse?: boolean; // For metrics where lower is better
}> = ({ label, value, threshold, unit = '%', reverse = false }) => {
  const getStatus = () => {
    if (reverse) {
      if (value <= threshold.good) return 'good';
      if (value <= threshold.warning) return 'warning';
      return 'critical';
    } else {
      if (value >= threshold.good) return 'good';
      if (value >= threshold.warning) return 'warning';
      return 'critical';
    }
  };

  const status = getStatus();
  const statusColors = {
    good: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusIcons = {
    good: '✅',
    warning: '⚠️',
    critical: '🚨',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-lg">{statusIcons[status]}</span>
      </div>
      <div className="text-2xl font-bold">
        {value.toFixed(unit === 'ms' ? 0 : 1)}{unit}
      </div>
      <div className="text-xs mt-1">
        Target: {reverse ? '< ' : '> '}{threshold.good}{unit}
      </div>
    </div>
  );
};

const WebVitalsChart: React.FC<{ metrics: PerformanceMetrics | null }> = ({ metrics }) => {
  if (!metrics) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  const vitals = [
    { name: 'LCP', value: metrics.webVitals.lcp, threshold: 2500, unit: 'ms' },
    { name: 'FID', value: metrics.webVitals.fid, threshold: 100, unit: 'ms' },
    { name: 'CLS', value: metrics.webVitals.cls, threshold: 0.1, unit: '' },
    { name: 'FCP', value: metrics.webVitals.fcp, threshold: 1800, unit: 'ms' },
    { name: 'TTFB', value: metrics.webVitals.ttfb, threshold: 600, unit: 'ms' },
  ];

  const getScoreColor = (value: number, threshold: number, metric: string) => {
    const ratio = metric === 'CLS' ? value / threshold : value / threshold;
    if (ratio <= 0.75) return 'bg-green-500';
    if (ratio <= 1) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
      <div className="space-y-4">
        {vitals.map((vital) => (
          <div key={vital.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{vital.name}</span>
                <span className="text-xs text-gray-500">
                  (Target: &lt;{vital.threshold}{vital.unit})
                </span>
              </div>
              <span className="font-bold">
                {vital.value.toFixed(vital.name === 'CLS' ? 3 : 0)}{vital.unit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${getScoreColor(vital.value, vital.threshold, vital.name)}`}
                style={{ 
                  width: `${Math.min(100, (vital.value / (vital.threshold * 1.5)) * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>🟢 Good</span>
          <span>🟡 Needs Improvement</span>
          <span>🔴 Poor</span>
        </div>
      </div>
    </Card>
  );
};

const CompetitivePositioning: React.FC<{ data: CompetitiveData | null }> = ({ data }) => {
  if (!data) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Position</h3>
      <div className="space-y-6">
        {/* Market Ranking */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            #{data.marketPosition.ranking}
          </div>
          <div className="text-sm text-gray-600">Market Ranking</div>
          <div className="text-xs text-gray-500 mt-1">
            {data.marketPosition.marketShare.toFixed(1)}% market share
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Feature Competitiveness</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Our Features</span>
            <span className="font-bold text-blue-600">{data.featureComparison.ourFeatures}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Industry Average</span>
            <span className="font-bold text-gray-600">{data.featureComparison.industryAverage}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ 
                width: `${(data.featureComparison.ourFeatures / (data.featureComparison.industryAverage * 1.5)) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Pricing Position */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Pricing Strategy</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Position</span>
            <span className={`font-bold capitalize ${
              data.pricing.pricePosition === 'premium' ? 'text-purple-600' :
              data.pricing.pricePosition === 'competitive' ? 'text-blue-600' :
              'text-green-600'
            }`}>
              {data.pricing.pricePosition}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Our price: ${data.pricing.ourPricing} vs Industry avg: ${data.pricing.competitorAverage}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">User Sentiment</h4>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Our Rating</span>
            <span className="font-bold text-yellow-600">
              {data.sentiment.ourRating.toFixed(1)} ⭐
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Industry Average</span>
            <span className="font-bold text-gray-600">
              {data.sentiment.industryAverage.toFixed(1)} ⭐
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Based on {data.sentiment.reviewCount.toLocaleString()} reviews
          </div>
        </div>
      </div>
    </Card>
  );
};

const SecurityCompliance: React.FC<{ metrics: PerformanceMetrics | null }> = ({ metrics }) => {
  if (!metrics) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const security = metrics.security;
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-600 bg-green-50';
      case 'A-': case 'B+': return 'text-blue-600 bg-blue-50';
      case 'B': case 'B-': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-red-600 bg-red-50';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Compliance</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">SSL Grade</span>
          <span className={`px-3 py-1 rounded-full font-bold ${getGradeColor(security.ssl_grade)}`}>
            {security.ssl_grade}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Vulnerability Score</span>
          <span className="font-bold text-green-600">
            {security.vulnerability_score}/100
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Compliance Score</span>
          <span className="font-bold text-blue-600">
            {security.compliance_score}%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Threats Blocked (24h)</span>
          <span className="font-bold text-red-600">
            {security.threats_blocked.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">🛡️</span>
            <span className="text-sm font-medium text-green-800">
              Security posture: Excellent
            </span>
          </div>
          <div className="text-xs text-green-700 mt-1">
            All critical security measures are active and functioning optimally
          </div>
        </div>
      </div>
    </Card>
  );
};

const SystemAvailability: React.FC<{ metrics: PerformanceMetrics | null }> = ({ metrics }) => {
  if (!metrics) return null;

  const services = [
    { name: 'API', uptime: metrics.availability.api, critical: true },
    { name: 'Database', uptime: metrics.availability.database, critical: true },
    { name: 'CDN', uptime: metrics.availability.cdn, critical: false },
    { name: 'Auth', uptime: metrics.availability.auth, critical: true },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Availability</h3>
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                service.uptime >= 99.9 ? 'bg-green-500' :
                service.uptime >= 99.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">{service.name}</span>
              {service.critical && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  CRITICAL
                </span>
              )}
            </div>
            <span className="font-bold">
              {service.uptime.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics.system.uptime.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-600">Overall System Uptime</div>
        </div>
      </div>
    </Card>
  );
};

export const PerformanceMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [competitiveData, setCompetitiveData] = useState<CompetitiveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alertsCount, setAlertsCount] = useState(0);

  // Simulate fetching performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // Mock performance metrics
        const mockMetrics: PerformanceMetrics = {
          system: {
            uptime: 99.8 + Math.random() * 0.2,
            responseTime: 150 + Math.random() * 100,
            errorRate: Math.random() * 2,
            throughput: 1000 + Math.random() * 500,
            memoryUsage: 60 + Math.random() * 20,
            cpuUsage: 30 + Math.random() * 40,
          },
          webVitals: {
            lcp: 1800 + Math.random() * 1000,
            fid: 50 + Math.random() * 100,
            cls: Math.random() * 0.2,
            fcp: 1200 + Math.random() * 800,
            ttfb: 400 + Math.random() * 400,
          },
          availability: {
            api: 99.9 + Math.random() * 0.1,
            database: 99.95 + Math.random() * 0.05,
            cdn: 99.8 + Math.random() * 0.2,
            auth: 99.9 + Math.random() * 0.1,
          },
          security: {
            threats_blocked: Math.floor(Math.random() * 1000) + 500,
            ssl_grade: 'A+',
            vulnerability_score: 95 + Math.floor(Math.random() * 5),
            compliance_score: 98 + Math.floor(Math.random() * 2),
          },
        };

        const mockCompetitive: CompetitiveData = {
          marketPosition: {
            ranking: 3,
            marketShare: 8.5,
            competitors: [
              { name: 'Headspace', ranking: 1, strengths: ['Brand recognition', 'Content library'], weaknesses: ['Price', 'Personalization'] },
              { name: 'Calm', ranking: 2, strengths: ['Sleep content', 'UX'], weaknesses: ['Crisis support', 'AI features'] },
              { name: 'BetterHelp', ranking: 4, strengths: ['Professional therapy'], weaknesses: ['Cost', 'Privacy concerns'] },
            ],
          },
          featureComparison: {
            ourFeatures: 45,
            industryAverage: 32,
            gaps: ['Live group sessions', 'Wearable integration'],
            advantages: ['Crisis detection', 'AI personalization', 'Trauma-informed design'],
          },
          pricing: {
            ourPricing: 29,
            competitorAverage: 35,
            pricePosition: 'competitive',
          },
          sentiment: {
            ourRating: 4.6,
            industryAverage: 4.2,
            reviewCount: 15432,
            keyTopics: ['Crisis support', 'Privacy', 'Effectiveness'],
          },
        };

        setMetrics(mockMetrics);
        setCompetitiveData(mockCompetitive);
        setLoading(false);
        setLastUpdate(new Date());

        // Count alerts (mock)
        let alerts = 0;
        if (mockMetrics.system.errorRate > 1) alerts++;
        if (mockMetrics.webVitals.lcp > 2500) alerts++;
        if (mockMetrics.system.uptime < 99.5) alerts++;
        setAlertsCount(alerts);

      } catch (error) {
        console.error('Failed to fetch performance data:', error);
        setLoading(false);
      }
    };

    fetchPerformanceData();

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(fetchPerformanceData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRunDiagnostics = async () => {
    // Trigger comprehensive system diagnostics
    console.log('Running system diagnostics...');
  };

  const handleExportReport = async () => {
    // Export performance report
    console.log('Exporting performance report...');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Monitoring</h1>
          <p className="text-gray-600">
            Real-time system performance and competitive intelligence
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {alertsCount > 0 && (
            <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg">
              <span>🚨</span>
              <span className="font-medium">{alertsCount} Alert{alertsCount !== 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="text-right">
            <div className="text-sm text-gray-500">Last updated</div>
            <div className="font-medium">{lastUpdate.toLocaleTimeString()}</div>
          </div>
          <Button onClick={handleRunDiagnostics} variant="outline">
            🔍 Run Diagnostics
          </Button>
          <Button onClick={handleExportReport}>
            📊 Export Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SystemHealthIndicator
          label="System Uptime"
          value={metrics?.system.uptime || 0}
          threshold={{ good: 99.5, warning: 99.0 }}
          unit="%"
        />
        <SystemHealthIndicator
          label="Response Time"
          value={metrics?.system.responseTime || 0}
          threshold={{ good: 200, warning: 500 }}
          unit="ms"
          reverse
        />
        <SystemHealthIndicator
          label="Error Rate"
          value={metrics?.system.errorRate || 0}
          threshold={{ good: 1, warning: 2 }}
          unit="%"
          reverse
        />
        <SystemHealthIndicator
          label="CPU Usage"
          value={metrics?.system.cpuUsage || 0}
          threshold={{ good: 70, warning: 80 }}
          unit="%"
          reverse
        />
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WebVitalsChart metrics={metrics} />
        <SystemAvailability metrics={metrics} />
      </div>

      {/* Security and Competitive Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityCompliance metrics={metrics} />
        <CompetitivePositioning data={competitiveData} />
      </div>

      {/* Additional Insights */}
      {competitiveData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Competitive Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Our Advantages</h4>
              <ul className="space-y-2">
                {competitiveData.featureComparison.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-sm">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
              <ul className="space-y-2">
                {competitiveData.featureComparison.gaps.map((gap, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span className="text-sm">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>
          Performance data is collected in real-time. Competitive intelligence is updated weekly.
        </p>
      </div>
    </div>
  );
};