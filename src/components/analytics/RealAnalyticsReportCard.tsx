/**
 * ALCHM Real Analytics Report Card
 * 
 * This component replaces the placeholder ReportCard with genuine insights
 * from user journal data while maintaining trauma-informed presentation
 * and absolute privacy protection.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnalyticsService, { 
  EmotionalIntelligenceMetrics, 
  HealingJourneyMetrics, 
  WritingEvolutionMetrics 
} from '@/lib/analytics-service';
import { AnalyticsReport } from '@/lib/analytics-engine';
import {
  SupportiveMetricDisplay,
  HealingProgressRing,
  EmotionalPatternViz,
  GrowthIndicatorsViz,
  HealingMilestoneCelebration,
  SupportiveRecommendations
} from './AnalyticsVisualization';

export interface RealAnalyticsReportCardProps {
  userId: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  variant?: 'compact' | 'full';
  className?: string;
}

interface AnalyticsState {
  emotionalIntelligence: EmotionalIntelligenceMetrics | null;
  healingJourney: HealingJourneyMetrics | null;
  writingEvolution: WritingEvolutionMetrics | null;
  fullReport: AnalyticsReport | null;
  isLoading: boolean;
  hasEnoughData: boolean;
  error: string | null;
}

export default function RealAnalyticsReportCard({
  userId,
  timeframe = 'month',
  variant = 'compact',
  className = ''
}: RealAnalyticsReportCardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsState>({
    emotionalIntelligence: null,
    healingJourney: null,
    writingEvolution: null,
    fullReport: null,
    isLoading: true,
    hasEnoughData: false,
    error: null
  });

  useEffect(() => {
    loadAnalytics();
  }, [userId, timeframe]);

  const loadAnalytics = async () => {
    try {
      setAnalytics(prev => ({ ...prev, isLoading: true, error: null }));

      const dashboardInsights = await AnalyticsService.getDashboardInsights(userId);

      const hasEnoughData = !!(
        dashboardInsights.emotionalIntelligence || 
        dashboardInsights.healingJourney || 
        dashboardInsights.writingEvolution ||
        dashboardInsights.recentReport
      );

      setAnalytics({
        emotionalIntelligence: dashboardInsights.emotionalIntelligence,
        healingJourney: dashboardInsights.healingJourney,
        writingEvolution: dashboardInsights.writingEvolution,
        fullReport: dashboardInsights.recentReport,
        isLoading: false,
        hasEnoughData,
        error: null
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalytics(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to load analytics. Please try again later.',
        hasEnoughData: false
      }));
    }
  };

  if (analytics.isLoading) {
    return <LoadingAnalytics variant={variant} className={className} />;
  }

  if (analytics.error) {
    return <AnalyticsError error={analytics.error} onRetry={loadAnalytics} className={className} />;
  }

  if (!analytics.hasEnoughData) {
    return <InsufficientDataPrompt userId={userId} className={className} />;
  }

  if (variant === 'compact') {
    return <CompactAnalyticsView analytics={analytics} timeframe={timeframe} className={className} />;
  }

  return <FullAnalyticsView analytics={analytics} timeframe={timeframe} className={className} />;
}

// ==============================================================================
// COMPACT ANALYTICS VIEW
// ==============================================================================

function CompactAnalyticsView({ 
  analytics, 
  timeframe, 
  className 
}: { 
  analytics: AnalyticsState;
  timeframe: string;
  className: string;
}) {
  const { emotionalIntelligence, healingJourney, writingEvolution, fullReport } = analytics;

  const formatTimeframe = () => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  const getOverallWellbeingScore = () => {
    if (fullReport) return fullReport.overallWellbeingScore;
    
    // Calculate from available metrics
    const scores = [];
    if (emotionalIntelligence) scores.push(emotionalIntelligence.overallEQ * 100);
    if (healingJourney) scores.push(healingJourney.resilienceScore * 100);
    if (writingEvolution) scores.push(writingEvolution.reflectiveQuality * 100);
    
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 50;
  };

  const getGrowthTrajectory = () => {
    if (fullReport) return fullReport.growthTrajectory;
    if (healingJourney) return healingJourney.progressMomentum;
    return 'steady';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating': return '⚡';
      case 'steady': return '📈';
      case 'plateaued': return '📊';
      case 'needs_attention': return '🌱';
      default: return '💫';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'accelerating': return 'text-purple-600 bg-purple-50';
      case 'steady': return 'text-sage-600 bg-sage-50';
      case 'plateaued': return 'text-blue-600 bg-blue-50';
      case 'needs_attention': return 'text-amber-600 bg-amber-50';
      default: return 'text-sage-600 bg-sage-50';
    }
  };

  const overallScore = getOverallWellbeingScore();
  const trajectory = getGrowthTrajectory();

  return (
    <Card className={`relative overflow-hidden bg-white border-sage-100 rounded-3xl shadow-card transition-all duration-300 hover:shadow-elevated group ${className}`}>
      {/* Header */}
      <CardHeader className="pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-ink font-semibold text-2xl mb-1 tracking-tight">
              Your Healing Journey
            </CardTitle>
            <p className="text-muted text-sm tracking-wide font-medium">
              {formatTimeframe()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${getTrendColor(trajectory)} transition-all duration-300`}>
              <span className="text-xl font-medium">{getTrendIcon(trajectory)}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ink">
                {Math.round(overallScore)}%
              </div>
              <div className="text-xs text-muted uppercase tracking-wide">
                Overall Growth
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-8">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {emotionalIntelligence && (
            <SupportiveMetricDisplay
              value={emotionalIntelligence.overallEQ}
              label="Emotional Intelligence"
              description="Your ability to understand and manage emotions"
              trend="improving"
              isPercentage={true}
              size="compact"
            />
          )}
          
          {healingJourney && (
            <SupportiveMetricDisplay
              value={healingJourney.resilienceScore}
              label="Resilience"
              description="Your capacity to bounce back from challenges"
              trend="improving"
              isPercentage={true}
              size="compact"
            />
          )}
          
          {writingEvolution && (
            <SupportiveMetricDisplay
              value={writingEvolution.reflectiveQuality}
              label="Self-Reflection"
              description="The depth of your introspective writing"
              trend="improving"
              isPercentage={true}
              size="compact"
            />
          )}
          
          {healingJourney && (
            <SupportiveMetricDisplay
              value={healingJourney.selfCompassionLevel}
              label="Self-Compassion"
              description="Your kindness and understanding toward yourself"
              trend="stable"
              isPercentage={true}
              size="compact"
            />
          )}
        </div>

        {/* Emotional Patterns */}
        {fullReport?.emotionalAnalytics.primaryEmotions.length > 0 && (
          <div className="mb-6">
            <EmotionalPatternViz
              emotions={fullReport.emotionalAnalytics.primaryEmotions}
              title="Recent Emotional Patterns"
              size="compact"
            />
          </div>
        )}

        {/* Growth Indicators */}
        {emotionalIntelligence && (
          <div className="mb-6">
            <GrowthIndicatorsViz
              indicators={[
                {
                  name: 'Emotional Awareness',
                  value: emotionalIntelligence.emotionalAwareness,
                  description: 'Recognition and understanding of your emotions'
                },
                {
                  name: 'Social Skills',
                  value: emotionalIntelligence.socialSkills,
                  description: 'Ability to navigate relationships effectively'
                },
                {
                  name: 'Motivation',
                  value: emotionalIntelligence.motivation,
                  description: 'Drive for personal growth and goal achievement'
                }
              ]}
              title="Emotional Intelligence Breakdown"
              size="compact"
            />
          </div>
        )}

        {/* Healing Milestones */}
        {fullReport?.therapeuticInsights.therapeuticMilestones.length > 0 && (
          <div className="mb-6">
            <HealingMilestoneCelebration
              milestones={fullReport.therapeuticInsights.therapeuticMilestones}
              title="Recent Breakthroughs"
            />
          </div>
        )}

        {/* Supportive Recommendations */}
        {fullReport?.recommendations.length > 0 && (
          <div className="mb-6">
            <SupportiveRecommendations
              recommendations={fullReport.recommendations}
              title="Gentle Suggestions"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-sage-100">
          <Link href="/analytics" className="block">
            <Button
              variant="ghost"
              className="w-full py-4 text-center bg-gradient-to-r from-sage-50 to-sage-100/80 hover:from-sage-100 hover:to-sage-200/80 text-sage-700 hover:text-sage-800 rounded-2xl text-sm font-semibold border border-sage-200 hover:border-sage-300 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 tracking-wide group/btn"
            >
              <span className="group-hover/btn:tracking-wider transition-all duration-200">
                Explore Full Analytics
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>

      {/* Signature gradient orb */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-radial from-sage-100/15 via-sage-50/5 to-transparent rounded-full blur-lg pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
    </Card>
  );
}

// ==============================================================================
// FULL ANALYTICS VIEW
// ==============================================================================

function FullAnalyticsView({ 
  analytics, 
  timeframe, 
  className 
}: { 
  analytics: AnalyticsState;
  timeframe: string;
  className: string;
}) {
  // Implementation for full view would go here
  // For now, return the compact view
  return <CompactAnalyticsView analytics={analytics} timeframe={timeframe} className={className} />;
}

// ==============================================================================
// LOADING STATE
// ==============================================================================

function LoadingAnalytics({ variant, className }: { variant: string; className: string }) {
  return (
    <Card className={`relative overflow-hidden bg-white border-sage-100 rounded-3xl shadow-soft transition-all duration-300 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
          <div className="animate-gentle-pulse">
            <div className="w-6 h-6 bg-sage-400 rounded opacity-60 animate-pulse" />
          </div>
        </div>
        <h3 className="text-sage-600 font-medium text-sm tracking-wide mb-2">
          Analyzing Your Journey
        </h3>
        <p className="text-sage-500 text-xs tracking-wide">
          Processing insights from your journal entries
        </p>
      </CardContent>
      
      {/* Signature gradient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-radial from-sage-100/30 via-sage-50/10 to-transparent rounded-full blur-sm" />
    </Card>
  );
}

// ==============================================================================
// ERROR STATE
// ==============================================================================

function AnalyticsError({ 
  error, 
  onRetry, 
  className 
}: { 
  error: string; 
  onRetry: () => void; 
  className: string;
}) {
  return (
    <Card className={`relative overflow-hidden bg-white border-amber-100 rounded-3xl shadow-soft transition-all duration-300 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-amber-700 font-medium text-sm tracking-wide mb-2">
          Analytics Temporarily Unavailable
        </h3>
        <p className="text-amber-600 text-xs tracking-wide mb-4">
          {error}
        </p>
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
        >
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}

// ==============================================================================
// INSUFFICIENT DATA PROMPT
// ==============================================================================

function InsufficientDataPrompt({ userId, className }: { userId: string; className: string }) {
  return (
    <Card className={`relative overflow-hidden bg-white border-sage-100 rounded-3xl shadow-soft p-8 text-center transition-all duration-300 hover:shadow-card group ${className}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-sage-50 to-sage-100">
        <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500">
          🌱
        </div>
      </div>
      
      <h3 className="text-ink font-semibold text-xl mb-3 tracking-tight">
        Your Analytics Are Growing
      </h3>
      
      <p className="text-muted text-sm mb-8 leading-relaxed max-w-xs mx-auto">
        Continue writing to unlock personalized insights about your healing journey and emotional growth.
      </p>
      
      <Link href="/journal">
        <Button
          variant="ghost"
          className="inline-flex items-center gap-3 px-6 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 group/btn"
        >
          <span className="group-hover/btn:scale-110 transition-transform duration-200">✍️</span>
          Continue Writing
        </Button>
      </Link>
      
      {/* Signature gradient orb */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-radial from-sage-100/20 via-sage-50/5 to-transparent rounded-full blur-lg" />
    </Card>
  );
}