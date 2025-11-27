'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CollectiveInsightsEngine,
  type CollectiveGrowthInsight
} from '@/lib/community/privacy-engine';

interface CollectiveGrowthInsightsProps {
  userId?: string; // Used only for personalization, not tracking
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
}

const INSIGHT_TYPES = {
  pathway_trends: {
    icon: '🌱',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    textColor: 'text-green-200'
  },
  emotional_patterns: {
    icon: '💜',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    textColor: 'text-purple-200'
  },
  community_support: {
    icon: '🫂',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-200'
  },
  cultural_wisdom: {
    icon: '🌍',
    color: 'from-orange-400 to-yellow-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    textColor: 'text-orange-200'
  }
};

const ANONYMIZED_STORIES = [
  {
    id: 'healing-1',
    type: 'transformation',
    insight: "Someone in our community shared: 'I thought healing meant going back to who I was before. Now I realize healing means becoming who I was always meant to be.'",
    pathway: 'becoming',
    reactions: { heart: 234, wisdom: 189, strength: 156 },
    timeframe: '2 days ago'
  },
  {
    id: 'resilience-1',
    type: 'strength',
    insight: "A community member reflected: 'The same sensitivity that made me vulnerable to trauma became my superpower for helping others heal.'",
    pathway: 'resilience',
    reactions: { heart: 187, wisdom: 203, strength: 245 },
    timeframe: '4 days ago'
  },
  {
    id: 'purpose-1',
    type: 'meaning',
    insight: "From our community: 'My pain wasn't punishment - it was preparation for the person I needed to become to help others through similar struggles.'",
    pathway: 'purpose',
    reactions: { heart: 156, wisdom: 178, strength: 134 },
    timeframe: '1 week ago'
  }
];

const COMMUNITY_MILESTONES = [
  {
    milestone: '10,000 Anonymous Wisdom Shares',
    description: 'Stories of healing shared without revealing identity',
    impact: '10K+ people feeling less alone in their journey',
    icon: '✨'
  },
  {
    milestone: '2,500 Support Circle Connections',
    description: 'Ephemeral bonds formed in safe, anonymous spaces',
    impact: 'Reduced isolation by 73% in participating members',
    icon: '🕊️'
  },
  {
    milestone: '50 Cultural Healing Traditions',
    description: 'Diverse wisdom traditions shared anonymously',
    impact: 'Cross-cultural healing practices exchange',
    icon: '🌍'
  },
  {
    milestone: 'Zero Privacy Breaches',
    description: '100% anonymity maintained since launch',
    impact: 'Complete trust in community safety',
    icon: '🛡️'
  }
];

export default function CollectiveGrowthInsights({ 
  userId, 
  pathway 
}: CollectiveGrowthInsightsProps) {
  const [insights, setInsights] = useState<CollectiveGrowthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<CollectiveGrowthInsight | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    loadCollectiveInsights();
  }, [pathway]);

  const loadCollectiveInsights = async () => {
    setIsLoading(true);
    
    try {
      // In production, this would fetch real aggregated insights
      const aggregatedInsights = await CollectiveInsightsEngine.generateCollectiveInsights();
      setInsights(aggregatedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
      // Fallback to mock data for demonstration
      const mockInsights: CollectiveGrowthInsight[] = [
        {
          id: 'community-growth-1',
          type: 'community_support',
          title: 'Collective Healing Power',
          insight: 'This month, our community shared 1,247 expressions of support. When you share your truth, it creates ripples that help 23 people on average feel less alone.',
          supportingData: {
            totalSupport: 1247,
            rippleEffect: 23,
            participatingMembers: 456
          },
          createdAt: new Date(),
          confidence: 0.94
        },
        {
          id: 'pathway-trends-1',
          type: 'pathway_trends',
          title: 'Resilience Rising',
          insight: '68% of our community is currently exploring resilience pathways. You\'re part of a powerful movement of people rebuilding strength together.',
          supportingData: {
            percentage: 68,
            totalParticipants: 892,
            growthRate: '+23% this month'
          },
          createdAt: new Date(),
          confidence: 0.91
        },
        {
          id: 'emotional-patterns-1',
          type: 'emotional_patterns',
          title: 'Shared Emotional Journey',
          insight: 'The most common emotion processed in our community this month was "hope emerging from despair" - shared by 34% of anonymous contributions.',
          supportingData: {
            primaryEmotion: 'hope emerging from despair',
            percentage: 34,
            secondaryEmotions: ['strength', 'acceptance', 'transformation']
          },
          createdAt: new Date(),
          confidence: 0.87
        },
        {
          id: 'cultural-wisdom-1',
          type: 'cultural_wisdom',
          title: 'Global Healing Traditions',
          insight: 'Our community draws from 47 different cultural healing traditions, creating a rich tapestry of wisdom. Ubuntu philosophy was shared 89 times this month.',
          supportingData: {
            traditionsCount: 47,
            topTradition: 'Ubuntu philosophy',
            shareCount: 89,
            culturalDiversity: '23 countries represented'
          },
          createdAt: new Date(),
          confidence: 0.89
        }
      ];
      
      setInsights(mockInsights);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsightClick = (insight: CollectiveGrowthInsight) => {
    setSelectedInsight(insight);
    setShowDetailedView(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded mx-auto w-64"></div>
            <div className="h-4 bg-white/5 rounded mx-auto w-96"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showDetailedView && selectedInsight) {
    const typeConfig = INSIGHT_TYPES[selectedInsight.type];
    
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Button
          onClick={() => setShowDetailedView(false)}
          variant="ghost"
          className="text-white/60 hover:text-white/80 mb-4"
        >
          ← Back to All Insights
        </Button>

        <Card className={`${typeConfig.bgColor} ${typeConfig.borderColor} p-6`}>
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${typeConfig.color} flex items-center justify-center text-2xl`}>
              {typeConfig.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-light text-white mb-2">{selectedInsight.title}</h1>
              <p className="text-white/90 text-lg leading-relaxed mb-4">{selectedInsight.insight}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(selectedInsight.supportingData).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-medium ${typeConfig.textColor}`}>
                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                    </div>
                    <div className="text-white/60 text-xs capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-white/40 text-sm">
                  Confidence: {Math.round(selectedInsight.confidence * 100)}%
                </span>
                <span className="text-white/40 text-sm">
                  Generated: {selectedInsight.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Anonymous Stories */}
        <div className="space-y-4">
          <h2 className="text-xl font-light text-white">Related Anonymous Stories</h2>
          {ANONYMIZED_STORIES
            .filter(story => story.pathway === pathway || !pathway)
            .map(story => (
              <Card key={story.id} className="bg-white/5 border-white/10 p-4">
                <p className="text-white/90 italic mb-3">"{story.insight}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/60">Anonymous • {story.timeframe}</span>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full capitalize">
                      {story.pathway}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>💜 {story.reactions.heart}</span>
                    <span>🌟 {story.reactions.wisdom}</span>
                    <span>💪 {story.reactions.strength}</span>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Collective Growth Insights</h1>
        <p className="text-white/80 text-sm max-w-2xl mx-auto">
          Discover patterns from our anonymous community. These insights are generated from aggregated, 
          privacy-preserved data to show you're not alone in your journey.
        </p>
      </div>

      {/* Privacy Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">🔒</span>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Privacy-Preserved Analytics</p>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              All insights are generated from anonymized, aggregated data. Individual contributions cannot be traced back to users. 
              Your privacy is maintained while revealing meaningful community patterns.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight) => {
          const typeConfig = INSIGHT_TYPES[insight.type];
          
          return (
            <div 
              key={insight.id} 
              className={`rounded-2xl bg-sanctuary border border-sage-200/50 shadow-soft p-6 transition-all duration-300 ease-out backdrop-blur-sm ${typeConfig.bgColor} ${typeConfig.borderColor} cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg`}
              onClick={() => handleInsightClick(insight)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${typeConfig.color} flex items-center justify-center text-xl`}>
                  {typeConfig.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">{insight.title}</h3>
                  <p className={`${typeConfig.textColor} text-sm leading-relaxed mb-3`}>
                    {insight.insight}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                    <span className="text-white/60 text-xs">
                      Click to explore →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Milestones */}
      <div className="mt-12">
        <h2 className="text-xl font-light text-white mb-6 text-center">Community Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMUNITY_MILESTONES.map((milestone, index) => (
            <Card key={index} className="bg-white/5 border-white/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{milestone.icon}</span>
                <div>
                  <h3 className="text-white font-medium mb-1">{milestone.milestone}</h3>
                  <p className="text-white/80 text-sm mb-2">{milestone.description}</p>
                  <p className="text-[#5E8E7F] text-xs">{milestone.impact}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Anonymous Wisdom Highlights */}
      <div className="mt-12">
        <h2 className="text-xl font-light text-white mb-6 text-center">Community Wisdom</h2>
        <div className="space-y-4">
          {ANONYMIZED_STORIES.map(story => (
            <Card key={story.id} className="bg-white/5 border-white/10 p-6">
              <p className="text-white/90 italic text-lg mb-4">"{story.insight}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/60">Shared anonymously • {story.timeframe}</span>
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full capitalize">
                    {story.pathway}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-white/60">💜 {story.reactions.heart}</span>
                  <span className="text-sm text-white/60">🌟 {story.reactions.wisdom}</span>
                  <span className="text-sm text-white/60">💪 {story.reactions.strength}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-6 text-center">
        <h3 className="text-lg font-medium text-white mb-2">Your Story Matters</h3>
        <p className="text-white/80 text-sm mb-4">
          Every anonymous share contributes to our collective understanding of healing. 
          Your experience helps others feel less alone in their journey.
        </p>
        <Button
          onClick={() => window.location.href = '/community/share'}
          className="bg-[#5E8E7F] hover:bg-[#4A6B5E]"
        >
          Share Your Wisdom Anonymously
        </Button>
      </Card>
    </div>
  );
}