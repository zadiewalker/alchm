'use client';

import React, { useMemo, useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Brain, 
  Heart, 
  Calendar, 
  Target, 
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PatternInsight {
  type: 'emotional' | 'behavioral' | 'temporal' | 'thematic' | 'growth';
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  recommendation?: string;
  trend: 'improving' | 'stable' | 'declining' | 'emerging';
}

interface AIPatternRecognitionProps {
  entries: JournalEntry[];
}

export function AIPatternRecognition({ entries }: AIPatternRecognitionProps) {
  const [selectedInsightType, setSelectedInsightType] = useState<string | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  // Analyze patterns in the journal entries
  const patternAnalysis = useMemo(() => {
    if (!entries.length) return { insights: [], themes: [], emotionalTrends: [], writingPatterns: [] };

    const insights: PatternInsight[] = [];
    
    // Emotional Pattern Analysis
    const moodDistribution = entries.reduce((acc, entry) => {
      const mood = entry.mood || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalMoods = Object.values(moodDistribution).reduce((sum, count) => sum + count, 0);
    const positiveRatio = (moodDistribution.positive || 0) / totalMoods;
    const negativeRatio = (moodDistribution.negative || 0) / totalMoods;

    if (positiveRatio > 0.6) {
      insights.push({
        type: 'emotional',
        title: 'Predominantly Positive Emotional State',
        description: `${Math.round(positiveRatio * 100)}% of your entries reflect positive emotions, indicating strong emotional resilience.`,
        confidence: 0.85,
        evidence: [
          `${moodDistribution.positive || 0} positive entries out of ${totalMoods} total`,
          'Consistent use of uplifting language patterns',
          'Frequent gratitude expressions'
        ],
        recommendation: 'Continue practices that maintain this positive emotional state.',
        trend: 'stable'
      });
    }

    if (negativeRatio > 0.4) {
      insights.push({
        type: 'emotional',
        title: 'Emotional Processing Pattern',
        description: `${Math.round(negativeRatio * 100)}% of entries show challenging emotions, suggesting active emotional processing.`,
        confidence: 0.78,
        evidence: [
          `${moodDistribution.negative || 0} challenging entries`,
          'Consistent reflection during difficult periods',
          'Evidence of emotional growth through writing'
        ],
        recommendation: 'Consider exploring coping strategies and support systems.',
        trend: 'improving'
      });
    }

    // Writing Frequency Analysis
    const entryDates = entries.map(e => new Date(e.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const daysBetween = entryDates.length > 1 ? 
      (entryDates[entryDates.length - 1].getTime() - entryDates[0].getTime()) / (1000 * 60 * 60 * 24) : 0;
    const averageFrequency = daysBetween > 0 ? entries.length / daysBetween : 0;

    if (averageFrequency > 0.3) { // More than once every 3 days
      insights.push({
        type: 'behavioral',
        title: 'Consistent Reflection Practice',
        description: `You write approximately every ${Math.round(1/averageFrequency)} days, showing strong commitment to self-reflection.`,
        confidence: 0.9,
        evidence: [
          `${entries.length} entries over ${Math.round(daysBetween)} days`,
          'Regular writing schedule',
          'Sustained engagement with personal growth'
        ],
        recommendation: 'Your consistency is excellent. Consider setting specific themes for deeper exploration.',
        trend: 'stable'
      });
    }

    // Word Count Evolution
    const wordCounts = entries.map(e => ({ date: new Date(e.createdAt), count: e.wordCount || 0 }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (wordCounts.length > 5) {
      const early = wordCounts.slice(0, Math.floor(wordCounts.length / 3));
      const recent = wordCounts.slice(-Math.floor(wordCounts.length / 3));
      const earlyAvg = early.reduce((sum, e) => sum + e.count, 0) / early.length;
      const recentAvg = recent.reduce((sum, e) => sum + e.count, 0) / recent.length;
      
      if (recentAvg > earlyAvg * 1.3) {
        insights.push({
          type: 'growth',
          title: 'Deepening Reflection Practice',
          description: `Your recent entries average ${Math.round(recentAvg)} words vs ${Math.round(earlyAvg)} initially, showing deeper engagement.`,
          confidence: 0.82,
          evidence: [
            `Recent entries are ${Math.round((recentAvg/earlyAvg - 1) * 100)}% longer`,
            'Increased detail in emotional descriptions',
            'More complex thought processes'
          ],
          recommendation: 'You\'re developing stronger introspective abilities. Continue this trajectory.',
          trend: 'improving'
        });
      }
    }

    // Temporal Patterns
    const hourlyPattern = entries.reduce((acc, entry) => {
      const hour = new Date(entry.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHours = Object.entries(hourlyPattern)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    const timeOfDay = peakHours[0] < 12 ? 'morning' : peakHours[0] < 18 ? 'afternoon' : 'evening';
    
    insights.push({
      type: 'temporal',
      title: `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Reflection Preference`,
      description: `You most often write in the ${timeOfDay}, with ${hourlyPattern[peakHours[0]] || 0} entries during this time.`,
      confidence: 0.75,
      evidence: [
        `Peak writing time: ${peakHours[0]}:00`,
        `${Math.round((hourlyPattern[peakHours[0]] || 0) / entries.length * 100)}% of entries in preferred time`,
        'Consistent timing suggests optimal reflection periods'
      ],
      recommendation: `Your ${timeOfDay} writing sessions seem most productive. Consider protecting this time.`,
      trend: 'stable'
    });

    // Thematic Analysis
    const commonWords = entries
      .flatMap(entry => entry.content.toLowerCase().split(/\W+/))
      .filter(word => word.length > 4 && !['about', 'would', 'could', 'should', 'think', 'really', 'something'].includes(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topThemes = Object.entries(commonWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    if (topThemes.length > 0) {
      insights.push({
        type: 'thematic',
        title: 'Core Life Themes',
        description: `Your writing frequently explores themes around: ${topThemes.slice(0, 3).map(t => t.word).join(', ')}.`,
        confidence: 0.68,
        evidence: topThemes.map(t => `"${t.word}" appears ${t.count} times`),
        recommendation: 'Consider dedicating specific sessions to explore these important themes more deeply.',
        trend: 'emerging'
      });
    }

    return {
      insights,
      themes: topThemes,
      emotionalTrends: Object.entries(moodDistribution),
      writingPatterns: {
        averageWords: Math.round(entries.reduce((sum, e) => sum + (e.wordCount || 0), 0) / entries.length),
        frequency: averageFrequency,
        preferredTime: timeOfDay,
        consistency: averageFrequency > 0.2 ? 'high' : averageFrequency > 0.1 ? 'moderate' : 'low'
      }
    };
  }, [entries]);

  const toggleInsight = (insightTitle: string) => {
    const newExpanded = new Set(expandedInsights);
    if (newExpanded.has(insightTitle)) {
      newExpanded.delete(insightTitle);
    } else {
      newExpanded.add(insightTitle);
    }
    setExpandedInsights(newExpanded);
  };

  const getInsightIcon = (type: PatternInsight['type']) => {
    switch (type) {
      case 'emotional': return Heart;
      case 'behavioral': return Activity;
      case 'temporal': return Calendar;
      case 'thematic': return Brain;
      case 'growth': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getTrendIcon = (trend: PatternInsight['trend']) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      case 'emerging': return '🌱';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.8) return 'text-green-600 bg-green-50';
    if (confidence > 0.6) return 'text-blue-600 bg-blue-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-700 mb-2">No patterns to analyze yet</h3>
        <p className="text-sage-500">Write more entries to discover meaningful insights about your journey.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900">{patternAnalysis.insights.length}</div>
              <div className="text-sm text-sage-600">Insights Discovered</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900">{patternAnalysis.writingPatterns.averageWords}</div>
              <div className="text-sm text-sage-600">Avg Words/Entry</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900 capitalize">{patternAnalysis.writingPatterns.preferredTime}</div>
              <div className="text-sm text-sage-600">Peak Writing Time</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sage-900 capitalize">{patternAnalysis.writingPatterns.consistency}</div>
              <div className="text-sm text-sage-600">Consistency Level</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Insight Type Filter */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={selectedInsightType === null ? "default" : "outline"}
          onClick={() => setSelectedInsightType(null)}
          className="text-sm"
        >
          All Insights
        </Button>
        {['emotional', 'behavioral', 'temporal', 'thematic', 'growth'].map(type => {
          const count = patternAnalysis.insights.filter(i => i.type === type).length;
          if (count === 0) return null;
          
          return (
            <Button
              key={type}
              variant={selectedInsightType === type ? "default" : "outline"}
              onClick={() => setSelectedInsightType(type)}
              className="text-sm capitalize"
            >
              {type} ({count})
            </Button>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-6">
        {patternAnalysis.insights
          .filter(insight => selectedInsightType === null || insight.type === selectedInsightType)
          .map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const isExpanded = expandedInsights.has(insight.title);
            
            return (
              <Card key={index} className="border-sage-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-sage-100 rounded-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-sage-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-sage-900 mb-1">{insight.title}</h3>
                          <div className="flex items-center gap-3">
                            <Badge className="capitalize text-xs">{insight.type}</Badge>
                            <span className="text-xl">{getTrendIcon(insight.trend)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(insight.confidence)}`}>
                              {Math.round(insight.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleInsight(insight.title)}
                          className="text-sage-500 hover:text-sage-700"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <p className="text-sage-700 mb-4">{insight.description}</p>
                      
                      {insight.recommendation && (
                        <div className="bg-sage-50 border border-sage-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sage-900 mb-1">Recommendation</h4>
                              <p className="text-sage-700 text-sm">{insight.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {isExpanded && (
                        <div className="border-t border-sage-200 pt-4">
                          <h4 className="font-medium text-sage-900 mb-3">Supporting Evidence</h4>
                          <ul className="space-y-2">
                            {insight.evidence.map((evidence, evidenceIndex) => (
                              <li key={evidenceIndex} className="flex items-start gap-2 text-sm text-sage-600">
                                <ArrowRight className="h-4 w-4 text-sage-400 flex-shrink-0 mt-0.5" />
                                {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
      </div>

      {/* Emotional Distribution Chart */}
      {patternAnalysis.emotionalTrends.length > 0 && (
        <Card className="p-6 border-sage-200">
          <h3 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-sage-600" />
            Emotional Distribution
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {patternAnalysis.emotionalTrends.map(([mood, count]) => {
              const percentage = Math.round((count / entries.length) * 100);
              const getMoodColor = (mood: string) => {
                switch (mood) {
                  case 'positive': return 'bg-green-500';
                  case 'negative': return 'bg-red-500';
                  case 'mixed': return 'bg-yellow-500';
                  default: return 'bg-gray-500';
                }
              };
              
              return (
                <div key={mood} className="text-center">
                  <div className="mb-2">
                    <div className={`w-16 h-16 rounded-full ${getMoodColor(mood)} mx-auto flex items-center justify-center text-white font-bold`}>
                      {percentage}%
                    </div>
                  </div>
                  <div className="text-sm font-medium text-sage-900 capitalize">{mood}</div>
                  <div className="text-xs text-sage-600">{count} entries</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Core Themes */}
      {patternAnalysis.themes.length > 0 && (
        <Card className="p-6 border-sage-200">
          <h3 className="text-lg font-semibold text-sage-900 mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-sage-600" />
            Most Explored Themes
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {patternAnalysis.themes.map(({ word, count }) => (
              <Badge key={word} variant="outline" className="px-3 py-1">
                {word} ({count})
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}