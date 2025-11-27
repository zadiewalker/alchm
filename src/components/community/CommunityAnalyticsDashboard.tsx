'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CommunityAnalyticsDashboardProps {}

interface CollectiveMetric {
  id: string;
  title: string;
  description: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  icon: string;
  color: string;
  category: 'healing' | 'connection' | 'growth' | 'safety';
}

interface HealingPattern {
  id: string;
  pattern: string;
  description: string;
  prevalence: number;
  supportingInsight: string;
  recommendedActions: string[];
}

interface CommunityInsight {
  id: string;
  type: 'collective-growth' | 'community-strength' | 'healing-trends' | 'cultural-wisdom';
  title: string;
  insight: string;
  confidence: number;
  impact: 'low' | 'moderate' | 'high';
  timeframe: string;
  anonymizedData: any;
}

const COLLECTIVE_METRICS: CollectiveMetric[] = [
  {
    id: 'total-healing-actions',
    title: 'Collective Healing Actions',
    description: 'Total healing activities completed by community',
    value: '1,247,892',
    trend: 'up',
    trendPercentage: 12,
    icon: '✨',
    color: 'from-purple-400 to-pink-500',
    category: 'healing'
  },
  {
    id: 'supportive-connections',
    title: 'Supportive Connections Made',
    description: 'Anonymous support exchanges between members',
    value: '84,329',
    trend: 'up',
    trendPercentage: 8,
    icon: '🤗',
    color: 'from-blue-400 to-cyan-500',
    category: 'connection'
  },
  {
    id: 'wisdom-shared',
    title: 'Wisdom Pieces Shared',
    description: 'Anonymous insights and healing strategies shared',
    value: '12,847',
    trend: 'up',
    trendPercentage: 15,
    icon: '💡',
    color: 'from-green-400 to-emerald-500',
    category: 'growth'
  },
  {
    id: 'crisis-interventions',
    title: 'Crisis Interventions',
    description: 'Community members connected to professional help',
    value: '2,156',
    trend: 'stable',
    icon: '🛡️',
    color: 'from-red-400 to-orange-500',
    category: 'safety'
  },
  {
    id: 'cultural-traditions',
    title: 'Cultural Traditions Honored',
    description: 'Different healing traditions represented',
    value: '47',
    trend: 'up',
    trendPercentage: 6,
    icon: '🌍',
    color: 'from-indigo-400 to-purple-500',
    category: 'growth'
  },
  {
    id: 'collective-milestones',
    title: 'Collective Milestones',
    description: 'Community challenges and goals achieved',
    value: '189',
    trend: 'up',
    trendPercentage: 23,
    icon: '🎯',
    color: 'from-yellow-400 to-amber-500',
    category: 'growth'
  }
];

const HEALING_PATTERNS: HealingPattern[] = [
  {
    id: 'gradual-progress',
    pattern: 'Gradual, Non-Linear Healing',
    description: 'Most community members report healing progress happens in waves rather than straight lines',
    prevalence: 87,
    supportingInsight: '87% of anonymous progress reports show healing occurs in cycles with setbacks being part of growth',
    recommendedActions: [
      'Normalize healing setbacks in community messaging',
      'Create resources about non-linear progress',
      'Develop setback support protocols'
    ]
  },
  {
    id: 'community-connection',
    pattern: 'Connection Accelerates Healing',
    description: 'Anonymous community engagement strongly correlates with self-reported healing progress',
    prevalence: 94,
    supportingInsight: '94% of active community participants report faster healing compared to isolated healing attempts',
    recommendedActions: [
      'Encourage community participation',
      'Create low-pressure connection opportunities',
      'Highlight connection success stories'
    ]
  },
  {
    id: 'cultural-relevance',
    pattern: 'Cultural Alignment Improves Outcomes',
    description: 'Healing approaches aligned with cultural background show higher success rates',
    prevalence: 78,
    supportingInsight: '78% of participants in culturally-aligned healing circles report better outcomes',
    recommendedActions: [
      'Expand culturally-specific healing circles',
      'Train facilitators in cultural sensitivity',
      'Create more diverse healing traditions'
    ]
  },
  {
    id: 'peer-mentorship',
    pattern: 'Peer Support Builds Resilience',
    description: 'Both giving and receiving peer support contributes to individual healing',
    prevalence: 91,
    supportingInsight: '91% of peer mentors report that helping others accelerated their own healing journey',
    recommendedActions: [
      'Promote mutual aid opportunities',
      'Create structured peer mentorship programs',
      'Recognize giving as part of healing'
    ]
  }
];

const COMMUNITY_INSIGHTS: CommunityInsight[] = [
  {
    id: 'collective-resilience-growth',
    type: 'collective-growth',
    title: 'Community Resilience is Growing',
    insight: 'Our collective emotional resilience has increased by 34% over the past quarter, with particularly strong growth in crisis recovery times and peer support effectiveness.',
    confidence: 92,
    impact: 'high',
    timeframe: 'Past 3 months',
    anonymizedData: {
      resilience_score_change: 34,
      crisis_recovery_improvement: 28,
      peer_support_effectiveness: 41
    }
  },
  {
    id: 'cultural-wisdom-diversity',
    type: 'cultural-wisdom',
    title: 'Cultural Wisdom Creates Healing Innovation',
    insight: 'Communities with diverse cultural healing traditions report 67% more innovative coping strategies and show greater adaptability to individual needs.',
    confidence: 88,
    impact: 'high',
    timeframe: 'Past 6 months',
    anonymizedData: {
      innovation_increase: 67,
      adaptability_score: 89,
      cultural_diversity_index: 47
    }
  },
  {
    id: 'anonymous-sharing-power',
    type: 'community-strength',
    title: 'Anonymity Enables Deeper Healing',
    insight: 'Anonymous sharing results in 3x more vulnerable self-disclosure and 2.4x higher rates of breakthrough insights compared to identified sharing.',
    confidence: 95,
    impact: 'high',
    timeframe: 'Ongoing analysis',
    anonymizedData: {
      vulnerability_multiplier: 3.0,
      breakthrough_rate: 2.4,
      authenticity_score: 94
    }
  },
  {
    id: 'collective-challenges-impact',
    type: 'healing-trends',
    title: 'Collective Challenges Build Community Bond',
    insight: 'Participation in community healing challenges increases individual healing motivation by 156% and creates lasting peer connections for 73% of participants.',
    confidence: 91,
    impact: 'moderate',
    timeframe: 'Past 4 months',
    anonymizedData: {
      motivation_increase: 156,
      lasting_connections: 73,
      completion_rate: 84
    }
  }
];

export default function CommunityAnalyticsDashboard({}: CommunityAnalyticsDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const filteredMetrics = selectedCategory 
    ? COLLECTIVE_METRICS.filter(metric => metric.category === selectedCategory)
    : COLLECTIVE_METRICS;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Community Healing Analytics</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          Collective healing patterns and community impact insights - all while maintaining complete individual privacy.
        </p>
      </div>

      {/* Privacy Assurance */}
      <Card className="bg-green-500/10 border-green-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
            <span className="text-green-300 text-xl">🔒</span>
          </div>
          <div className="flex-1">
            <h3 className="text-green-200 font-medium mb-2">Complete Privacy Protection</h3>
            <p className="text-green-200/80 text-sm leading-relaxed mb-3">
              All data is aggregated and anonymized. No individual healing journeys are tracked or identifiable. 
              These insights emerge from collective patterns without compromising anyone's privacy.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-green-300 font-medium text-sm">0</div>
                <div className="text-green-200/60 text-xs">Individual Records</div>
              </div>
              <div>
                <div className="text-green-300 font-medium text-sm">100%</div>
                <div className="text-green-200/60 text-xs">Anonymous Data</div>
              </div>
              <div>
                <div className="text-green-300 font-medium text-sm">∞</div>
                <div className="text-green-200/60 text-xs">Privacy Level</div>
              </div>
              <div>
                <div className="text-green-300 font-medium text-sm">24/7</div>
                <div className="text-green-200/60 text-xs">Data Protection</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Time Frame and Category Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="bg-white/5 border-white/10 p-4 flex-1">
          <h3 className="text-white/90 font-medium mb-3">Time Frame</h3>
          <div className="flex gap-2">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period as any)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  timeframe === period
                    ? 'bg-[#5E8E7F] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-4 flex-1">
          <h3 className="text-white/90 font-medium mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-[#5E8E7F] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {['healing', 'connection', 'growth', 'safety'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#5E8E7F] text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Collective Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <Card key={metric.id} className="bg-white/5 border-white/10 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center text-xl`}>
                {metric.icon}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                metric.trend === 'up' ? 'bg-green-500/20 text-green-300' :
                metric.trend === 'down' ? 'bg-red-500/20 text-red-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {metric.trend === 'up' && metric.trendPercentage ? `↗ +${metric.trendPercentage}%` :
                 metric.trend === 'down' && metric.trendPercentage ? `↘ -${metric.trendPercentage}%` :
                 '→ Stable'}
              </div>
            </div>
            <div className="text-2xl font-medium text-white mb-2">{metric.value}</div>
            <h3 className="text-white/90 font-medium text-sm mb-1">{metric.title}</h3>
            <p className="text-white/60 text-xs leading-relaxed">{metric.description}</p>
          </Card>
        ))}
      </div>

      {/* Community Insights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-white text-center">Community Healing Insights</h2>
        
        <div className="grid gap-6">
          {COMMUNITY_INSIGHTS.map((insight) => (
            <Card key={insight.id} className="bg-white/5 border-white/10 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">
                      {insight.type === 'collective-growth' ? '📈' :
                       insight.type === 'community-strength' ? '💪' :
                       insight.type === 'healing-trends' ? '🌊' : '🌍'}
                    </span>
                    <h3 className="text-white font-medium text-lg">{insight.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                    <span className="px-2 py-1 rounded-full bg-white/10">
                      {insight.type.replace('-', ' ')}
                    </span>
                    <span>{insight.timeframe}</span>
                    <span className={`px-2 py-1 rounded-full ${
                      insight.impact === 'high' ? 'bg-red-500/20 text-red-300' :
                      insight.impact === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {insight.impact} impact
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#5E8E7F] font-medium text-lg">{insight.confidence}%</div>
                  <div className="text-white/60 text-xs">Confidence</div>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed mb-4">{insight.insight}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                {Object.entries(insight.anonymizedData).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-[#5E8E7F] font-medium">
                      {typeof value === 'number' ? 
                        (value > 100 ? value.toLocaleString() : `${value}${key.includes('percentage') || key.includes('rate') || key.includes('score') ? '%' : ''}`) : 
                        value}
                    </div>
                    <div className="text-white/60 text-xs">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Healing Patterns */}
      <div className="space-y-6">
        <h2 className="text-2xl font-light text-white text-center">Discovered Healing Patterns</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {HEALING_PATTERNS.map((pattern) => (
            <Card key={pattern.id} className="bg-white/5 border-white/10 p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-medium text-lg">{pattern.pattern}</h3>
                <div className="text-right">
                  <div className="text-[#5E8E7F] font-medium text-xl">{pattern.prevalence}%</div>
                  <div className="text-white/60 text-xs">Prevalence</div>
                </div>
              </div>
              
              <p className="text-white/80 text-sm leading-relaxed mb-3">{pattern.description}</p>
              
              <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
                <p className="text-blue-200/90 text-xs italic leading-relaxed">{pattern.supportingInsight}</p>
              </div>
              
              <div>
                <h4 className="text-white/70 text-sm font-medium mb-2">Recommended Community Actions</h4>
                <ul className="text-white/60 text-xs space-y-1">
                  {pattern.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40 mt-2"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Impact Summary */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-8">
        <div className="text-center">
          <h3 className="text-2xl font-light text-white mb-4">Collective Healing Impact</h3>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Together, our anonymous community has created a powerful force for healing. 
            Every story shared, every supportive response, and every moment of connection contributes to this collective transformation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-medium text-purple-300 mb-1">1.2M+</div>
              <div className="text-purple-200/70 text-sm">Healing Actions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium text-purple-300 mb-1">84K+</div>
              <div className="text-purple-200/70 text-sm">Support Connections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium text-purple-300 mb-1">47</div>
              <div className="text-purple-200/70 text-sm">Cultural Traditions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-medium text-purple-300 mb-1">100%</div>
              <div className="text-purple-200/70 text-sm">Anonymous</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}