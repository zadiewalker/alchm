'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useMoodContext } from './MoodSelector';

interface CreativeAnalyticsProps {
  sessionHistory: any[];
  className?: string;
}

interface CreativePattern {
  type: 'preference' | 'growth' | 'breakthrough' | 'cyclical';
  pattern: string;
  frequency: number;
  insight: string;
  recommendation: string;
}

interface CreativeGrowthMetric {
  dimension: string;
  current: number;
  change: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  milestone?: string;
}

interface CreativeInsight {
  category: 'modality' | 'timing' | 'mood' | 'progress' | 'breakthrough';
  title: string;
  description: string;
  actionable: string;
  confidence: number;
}

const CreativeAnalytics: React.FC<CreativeAnalyticsProps> = ({
  sessionHistory,
  className = ''
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [focusMetric, setFocusMetric] = useState<'sessions' | 'duration' | 'modalities' | 'growth'>('sessions');
  const [insights, setInsights] = useState<CreativeInsight[]>([]);
  const [patterns, setPatterns] = useState<CreativePattern[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<CreativeGrowthMetric[]>([]);
  
  const { currentMood } = useMoodContext();

  // Filter sessions by time range
  const filteredSessions = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) return [];
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return sessionHistory.filter(session => 
      session.timestamp && new Date(session.timestamp) >= cutoffDate
    );
  }, [sessionHistory, timeRange]);

  // Calculate creative metrics
  const metrics = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        avgDuration: 0,
        uniqueModalities: 0,
        modalityDistribution: {},
        moodDistribution: {},
        weeklyTrend: 0,
        consistencyScore: 0
      };
    }

    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgDuration = totalDuration / totalSessions;
    
    // Modality analysis
    const modalities = new Set();
    const modalityCount: Record<string, number> = {};
    
    filteredSessions.forEach(session => {
      const modality = session.type || 'unknown';
      modalities.add(modality);
      modalityCount[modality] = (modalityCount[modality] || 0) + 1;
    });

    // Mood distribution
    const moodCount: Record<string, number> = {};
    filteredSessions.forEach(session => {
      if (session.mood) {
        moodCount[session.mood] = (moodCount[session.mood] || 0) + 1;
      }
    });

    // Weekly trend (simplified)
    const recentWeek = filteredSessions.filter(s => 
      new Date(s.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const previousWeek = filteredSessions.filter(s => {
      const date = new Date(s.timestamp);
      return date >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) && 
             date < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;
    
    const weeklyTrend = previousWeek === 0 ? 100 : ((recentWeek - previousWeek) / previousWeek) * 100;
    
    // Consistency score (sessions distributed across time range)
    const daysSinceFirst = Math.max(1, (Date.now() - new Date(filteredSessions[filteredSessions.length - 1].timestamp).getTime()) / (24 * 60 * 60 * 1000));
    const consistencyScore = Math.min(100, (totalSessions / daysSinceFirst) * 30); // Target: session every 30 days = 100%

    return {
      totalSessions,
      totalDuration,
      avgDuration,
      uniqueModalities: modalities.size,
      modalityDistribution: modalityCount,
      moodDistribution: moodCount,
      weeklyTrend,
      consistencyScore
    };
  }, [filteredSessions]);

  // Generate insights based on data
  const generateInsights = useCallback(() => {
    if (filteredSessions.length === 0) {
      setInsights([]);
      return;
    }

    const newInsights: CreativeInsight[] = [];
    
    // Modality preference insights
    const topModality = Object.entries(metrics.modalityDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topModality) {
      newInsights.push({
        category: 'modality',
        title: `${topModality[0].replace('_', ' ')} is your preferred expression`,
        description: `${Math.round((topModality[1] / metrics.totalSessions) * 100)}% of your sessions use this modality`,
        actionable: `Consider exploring how other modalities might complement your ${topModality[0].replace('_', ' ')} practice`,
        confidence: 0.8
      });
    }

    // Growth insights
    if (metrics.totalSessions >= 5) {
      const recentSessions = filteredSessions.slice(0, 5);
      const olderSessions = filteredSessions.slice(-5);
      
      const recentAvgDuration = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / recentSessions.length;
      const olderAvgDuration = olderSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / olderSessions.length;
      
      if (recentAvgDuration > olderAvgDuration * 1.2) {
        newInsights.push({
          category: 'growth',
          title: 'Your creative sessions are deepening',
          description: `Recent sessions average ${Math.round((recentAvgDuration - olderAvgDuration) / 60)} minutes longer`,
          actionable: 'This suggests growing comfort and engagement with creative expression',
          confidence: 0.7
        });
      }
    }

    // Consistency insights
    if (metrics.consistencyScore > 70) {
      newInsights.push({
        category: 'progress',
        title: 'Excellent creative consistency',
        description: `${Math.round(metrics.consistencyScore)}% consistency score shows regular engagement`,
        actionable: 'Your consistent practice is building creative resilience and self-awareness',
        confidence: 0.9
      });
    } else if (metrics.consistencyScore < 30) {
      newInsights.push({
        category: 'progress',
        title: 'Opportunity for more regular practice',
        description: `${Math.round(metrics.consistencyScore)}% consistency suggests sporadic engagement`,
        actionable: 'Consider setting a gentle weekly intention for creative expression',
        confidence: 0.6
      });
    }

    // Mood-creativity correlation
    const moodEntries = Object.entries(metrics.moodDistribution);
    if (moodEntries.length > 0) {
      const topMood = moodEntries.sort(([,a], [,b]) => b - a)[0];
      newInsights.push({
        category: 'mood',
        title: `You create most when feeling ${topMood[0]}`,
        description: `${Math.round((topMood[1] / metrics.totalSessions) * 100)}% of creative sessions occur in this mood state`,
        actionable: 'Notice how different moods invite different forms of creative expression',
        confidence: 0.6
      });
    }

    setInsights(newInsights);
  }, [filteredSessions, metrics]);

  // Generate patterns
  const generatePatterns = useCallback(() => {
    if (filteredSessions.length < 3) {
      setPatterns([]);
      return;
    }

    const newPatterns: CreativePattern[] = [];

    // Modality switching pattern
    const modalitySequence = filteredSessions.map(s => s.type).slice(0, 10);
    const switches = modalitySequence.filter((m, i) => i > 0 && m !== modalitySequence[i-1]).length;
    
    if (switches > modalitySequence.length * 0.5) {
      newPatterns.push({
        type: 'preference',
        pattern: 'Multi-modal exploration',
        frequency: switches / modalitySequence.length,
        insight: 'You frequently switch between creative modalities',
        recommendation: 'This variety supports comprehensive emotional processing'
      });
    }

    // Time-based patterns (simplified)
    const sessionDays = filteredSessions.map(s => new Date(s.timestamp).getDay());
    const weekendSessions = sessionDays.filter(day => day === 0 || day === 6).length;
    
    if (weekendSessions > filteredSessions.length * 0.6) {
      newPatterns.push({
        type: 'cyclical',
        pattern: 'Weekend creative focus',
        frequency: weekendSessions / filteredSessions.length,
        insight: 'You tend to engage in creative expression during weekends',
        recommendation: 'Consider brief weekday creative moments to maintain flow'
      });
    }

    setPatterns(newPatterns);
  }, [filteredSessions]);

  // Generate growth metrics
  const generateGrowthMetrics = useCallback(() => {
    if (filteredSessions.length < 3) {
      setGrowthMetrics([]);
      return;
    }

    const newMetrics: CreativeGrowthMetric[] = [];

    // Session duration growth
    const recent = filteredSessions.slice(0, Math.floor(filteredSessions.length / 2));
    const older = filteredSessions.slice(Math.floor(filteredSessions.length / 2));
    
    const recentAvg = recent.reduce((sum, s) => sum + (s.duration || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + (s.duration || 0), 0) / older.length;
    const durationChange = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    newMetrics.push({
      dimension: 'Session Depth',
      current: Math.round(recentAvg / 60), // in minutes
      change: durationChange,
      trend: durationChange > 5 ? 'increasing' : durationChange < -5 ? 'decreasing' : 'stable',
      milestone: durationChange > 20 ? 'Significant depth increase' : undefined
    });

    // Modality diversity
    const recentModalities = new Set(recent.map(s => s.type)).size;
    const olderModalities = new Set(older.map(s => s.type)).size;
    
    newMetrics.push({
      dimension: 'Creative Diversity',
      current: recentModalities,
      change: recentModalities - olderModalities,
      trend: recentModalities > olderModalities ? 'increasing' : recentModalities < olderModalities ? 'decreasing' : 'stable',
      milestone: recentModalities >= 4 ? 'Multi-modal mastery' : undefined
    });

    // Frequency
    newMetrics.push({
      dimension: 'Practice Consistency',
      current: Math.round(metrics.consistencyScore),
      change: metrics.weeklyTrend,
      trend: metrics.weeklyTrend > 10 ? 'increasing' : metrics.weeklyTrend < -10 ? 'decreasing' : 'stable',
      milestone: metrics.consistencyScore > 80 ? 'Consistent practice achieved' : undefined
    });

    setGrowthMetrics(newMetrics);
  }, [filteredSessions, metrics]);

  // Update analytics when data changes
  useEffect(() => {
    generateInsights();
    generatePatterns();
    generateGrowthMetrics();
  }, [generateInsights, generatePatterns, generateGrowthMetrics]);

  // Format duration
  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  if (sessionHistory.length === 0) {
    return (
      <div className={`creative-analytics ${className}`}>
        <div className="text-center p-12 bg-gradient-to-br from-sage-50 to-green-50 rounded-3xl">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Creative Analytics Awaiting
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Complete your first creative sessions to unlock insights about your artistic journey and healing patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`creative-analytics ${className}`}>
      {/* Header and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-medium text-gray-800">Creative Analytics</h3>
          <p className="text-sm text-gray-600">Insights from your artistic healing journey</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="px-3 py-2 bg-white border border-sage-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-300"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past 3 Months</option>
            <option value="year">Past Year</option>
          </select>
          
          {/* Metric Focus */}
          <select
            value={focusMetric}
            onChange={(e) => setFocusMetric(e.target.value as typeof focusMetric)}
            className="px-3 py-2 bg-white border border-sage-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-300"
          >
            <option value="sessions">Session Focus</option>
            <option value="duration">Time Focus</option>
            <option value="modalities">Modality Focus</option>
            <option value="growth">Growth Focus</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="metric-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-light text-sage-600 mb-1">{metrics.totalSessions}</div>
          <div className="text-sm text-gray-600">Sessions</div>
          <div className={`text-xs mt-1 ${metrics.weeklyTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.weeklyTrend >= 0 ? '↗' : '↘'} {Math.abs(Math.round(metrics.weeklyTrend))}% weekly
          </div>
        </div>

        <div className="metric-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-light text-blue-600 mb-1">{formatDuration(metrics.totalDuration)}</div>
          <div className="text-sm text-gray-600">Total Time</div>
          <div className="text-xs text-gray-500 mt-1">
            Avg: {formatDuration(metrics.avgDuration)}
          </div>
        </div>

        <div className="metric-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-light text-purple-600 mb-1">{metrics.uniqueModalities}</div>
          <div className="text-sm text-gray-600">Modalities</div>
          <div className="text-xs text-gray-500 mt-1">
            Explored
          </div>
        </div>

        <div className="metric-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-2xl font-light text-orange-600 mb-1">{Math.round(metrics.consistencyScore)}%</div>
          <div className="text-sm text-gray-600">Consistency</div>
          <div className="text-xs text-gray-500 mt-1">
            Practice rhythm
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      {growthMetrics.length > 0 && (
        <div className="growth-section mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Growth Tracking</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {growthMetrics.map((metric, i) => (
              <div key={i} className="growth-card p-4 bg-gradient-to-br from-sage-50 to-green-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">{metric.dimension}</h5>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend === 'increasing' ? 'bg-green-200 text-green-800' :
                    metric.trend === 'decreasing' ? 'bg-red-200 text-red-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {metric.trend === 'increasing' ? '↗' : metric.trend === 'decreasing' ? '↘' : '→'} 
                    {metric.trend}
                  </div>
                </div>
                <div className="text-xl font-light text-gray-800 mb-1">{metric.current}</div>
                <div className="text-xs text-gray-600">
                  Change: {metric.change > 0 ? '+' : ''}{Math.round(metric.change)}
                  {metric.dimension.includes('Consistency') ? '%' : ''}
                </div>
                {metric.milestone && (
                  <div className="mt-2 text-xs text-sage-700 font-medium">
                    🏆 {metric.milestone}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modality Distribution */}
      <div className="modality-section mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Creative Modality Usage</h4>
        <div className="modality-chart bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {Object.entries(metrics.modalityDistribution).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(metrics.modalityDistribution)
                .sort(([,a], [,b]) => b - a)
                .map(([modality, count], i) => {
                  const percentage = (count / metrics.totalSessions) * 100;
                  return (
                    <div key={modality} className="flex items-center">
                      <div className="w-24 text-sm text-gray-600 capitalize">
                        {modality.replace('_', ' ')}
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-gray-700">{count} sessions</div>
                          <div className="text-sm text-gray-500">{Math.round(percentage)}%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              i === 0 ? 'bg-sage-400' : 
                              i === 1 ? 'bg-blue-400' : 
                              i === 2 ? 'bg-purple-400' : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No modality data available for this time range
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="insights-section mb-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Creative Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <div key={i} className="insight-card p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-800">{insight.title}</h5>
                  <div className="text-xs text-gray-500">
                    {Math.round(insight.confidence * 100)}% confidence
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                <p className="text-xs text-blue-700 italic">{insight.actionable}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns */}
      {patterns.length > 0 && (
        <div className="patterns-section">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Creative Patterns</h4>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <div key={i} className="pattern-card p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-800">{pattern.pattern}</h5>
                  <div className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full capitalize">
                    {pattern.type}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-1">{pattern.insight}</p>
                <p className="text-xs text-gray-600 italic">{pattern.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="encouragement-section mt-8 p-6 bg-gradient-to-r from-sage-100 to-green-100 rounded-xl text-center">
        <h4 className="text-lg font-medium text-gray-800 mb-2">Your Creative Journey</h4>
        <p className="text-sm text-gray-700">
          {metrics.totalSessions === 1 ? 
            "You've taken the beautiful first step in your creative healing journey. Each expression matters." :
            metrics.totalSessions < 5 ?
            "You're building a foundation of creative expression. Every session adds to your healing toolkit." :
            metrics.totalSessions < 20 ?
            "Your consistent creative practice is developing depth and personal insight. This is powerful work." :
            "You're embodying the transformative power of creative expression. Your artistic healing practice is a gift to yourself and the world."
          }
        </p>
      </div>
    </div>
  );
};

export default CreativeAnalytics;