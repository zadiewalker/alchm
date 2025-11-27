'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WritingEvolution {
  period: 'before' | 'after';
  timeframe: string;
  entries: JournalEntry[];
  metrics: AnalysisMetrics;
  insights: EvolutionInsight[];
}

interface JournalEntry {
  id: string;
  content: string;
  date: Date;
  wordCount: number;
  emotionalTone: number; // -1 to 1
  complexity: number; // 0 to 1
  themes: string[];
  resilience_indicators: string[];
}

interface AnalysisMetrics {
  avg_word_count: number;
  emotional_range: number;
  positive_sentiment: number;
  self_reflection_depth: number;
  future_orientation: number;
  problem_solving_language: number;
  gratitude_expressions: number;
  growth_mindset_indicators: number;
}

interface EvolutionInsight {
  category: string;
  insight: string;
  evidence: string[];
  significance: 'minor' | 'notable' | 'significant' | 'transformational';
}

interface BeforeAfterAnalysisProps {
  userId: string;
  sacredMode: boolean;
}

export const BeforeAfterAnalysis: React.FC<BeforeAfterAnalysisProps> = ({
  userId,
  sacredMode
}) => {
  const [beforeData, setBeforeData] = useState<WritingEvolution | null>(null);
  const [afterData, setAfterData] = useState<WritingEvolution | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<'overview' | 'entries' | 'themes' | 'language'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'3months' | '6months' | '1year'>('6months');

  useEffect(() => {
    if (userId) {
      loadWritingEvolution();
    }
  }, [userId, timeframe]);

  const loadWritingEvolution = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockBeforeData: WritingEvolution = {
        period: 'before',
        timeframe: 'First 30 days',
        entries: [
          {
            id: '1',
            content: 'I feel so lost today. Everything seems overwhelming and I can\'t see a way forward. I just keep making the same mistakes over and over.',
            date: new Date('2024-01-15'),
            wordCount: 156,
            emotionalTone: -0.7,
            complexity: 0.3,
            themes: ['overwhelm', 'hopelessness', 'repetitive_patterns'],
            resilience_indicators: []
          },
          {
            id: '2',
            content: 'Another difficult day. I tried to meditate but my mind kept racing. I don\'t think I\'m cut out for this self-improvement stuff.',
            date: new Date('2024-01-20'),
            wordCount: 142,
            emotionalTone: -0.5,
            complexity: 0.4,
            themes: ['struggle', 'self-doubt', 'meditation_challenges'],
            resilience_indicators: ['attempting_new_practices']
          }
        ],
        metrics: {
          avg_word_count: 149,
          emotional_range: 0.3,
          positive_sentiment: 0.2,
          self_reflection_depth: 0.4,
          future_orientation: 0.1,
          problem_solving_language: 0.2,
          gratitude_expressions: 0.1,
          growth_mindset_indicators: 0.3
        },
        insights: [
          {
            category: 'emotional_patterns',
            insight: 'Predominant focus on challenges and obstacles',
            evidence: ['75% of entries contain struggle language', 'Limited solution-focused thinking'],
            significance: 'notable'
          }
        ]
      };

      const mockAfterData: WritingEvolution = {
        period: 'after',
        timeframe: 'Last 30 days',
        entries: [
          {
            id: '3',
            content: 'Today I noticed myself approaching a challenge differently. Instead of immediately feeling overwhelmed, I took a breath and asked myself what I could learn from this situation. I\'m grateful for the growth I\'ve experienced.',
            date: new Date('2024-09-15'),
            wordCount: 298,
            emotionalTone: 0.6,
            complexity: 0.7,
            themes: ['mindful_response', 'growth_mindset', 'gratitude', 'learning_orientation'],
            resilience_indicators: ['pause_before_reaction', 'reframing', 'gratitude_practice']
          },
          {
            id: '4',
            content: 'Reflecting on my journey, I can see how each challenge has been a teacher. The meditation practice has become a sanctuary, and I\'m developing more compassion for myself and others. I feel a sense of purpose emerging.',
            date: new Date('2024-09-20'),
            wordCount: 312,
            emotionalTone: 0.8,
            complexity: 0.8,
            themes: ['self_compassion', 'purpose', 'meditation_benefits', 'perspective_shift'],
            resilience_indicators: ['meaning_making', 'self_compassion', 'spiritual_connection']
          }
        ],
        metrics: {
          avg_word_count: 305,
          emotional_range: 0.8,
          positive_sentiment: 0.7,
          self_reflection_depth: 0.8,
          future_orientation: 0.6,
          problem_solving_language: 0.7,
          gratitude_expressions: 0.6,
          growth_mindset_indicators: 0.8
        },
        insights: [
          {
            category: 'cognitive_transformation',
            insight: 'Significant shift toward growth-oriented thinking',
            evidence: ['80% increase in solution-focused language', 'Enhanced metacognitive awareness'],
            significance: 'transformational'
          }
        ]
      };

      setBeforeData(mockBeforeData);
      setAfterData(mockAfterData);
    } catch (error) {
      console.error('Error loading writing evolution:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateChange = (before: number, after: number): number => {
    return ((after - before) / before) * 100;
  };

  const renderMetricsComparison = () => {
    if (!beforeData || !afterData) return null;

    const metrics = [
      { 
        key: 'avg_word_count', 
        label: 'Expression Depth',
        sacredLabel: 'Voice Embodiment',
        description: 'Average words per entry'
      },
      { 
        key: 'emotional_range', 
        label: 'Emotional Range',
        sacredLabel: 'Heart Spectrum',
        description: 'Variety of emotions expressed'
      },
      { 
        key: 'positive_sentiment', 
        label: 'Positive Sentiment',
        sacredLabel: 'Light Frequency',
        description: 'Overall positive tone'
      },
      { 
        key: 'self_reflection_depth', 
        label: 'Self-Reflection',
        sacredLabel: 'Soul Inquiry',
        description: 'Depth of introspective content'
      },
      { 
        key: 'future_orientation', 
        label: 'Future Orientation',
        sacredLabel: 'Vision Clarity',
        description: 'Focus on future possibilities'
      },
      { 
        key: 'problem_solving_language', 
        label: 'Solution Focus',
        sacredLabel: 'Creative Response',
        description: 'Problem-solving approach'
      },
      { 
        key: 'gratitude_expressions', 
        label: 'Gratitude',
        sacredLabel: 'Sacred Appreciation',
        description: 'Appreciation and thankfulness'
      },
      { 
        key: 'growth_mindset_indicators', 
        label: 'Growth Mindset',
        sacredLabel: 'Expansion Consciousness',
        description: 'Learning-oriented thinking'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const beforeValue = beforeData.metrics[metric.key as keyof AnalysisMetrics];
          const afterValue = afterData.metrics[metric.key as keyof AnalysisMetrics];
          const change = calculateChange(beforeValue, afterValue);
          const isPositive = change > 0;

          return (
            <Card key={metric.key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">
                  {sacredMode ? metric.sacredLabel : metric.label}
                </h4>
                <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <span className="text-lg">{isPositive ? '↗' : '↘'}</span>
                  <span className="font-medium">{Math.abs(Math.round(change))}%</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">{metric.description}</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Before</span>
                  <span className="text-sm">{beforeValue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${beforeValue * 100}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">After</span>
                  <span className="text-sm font-medium">{afterValue.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${afterValue * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderWritingSamples = () => {
    if (!beforeData || !afterData) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before Sample */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🌱</span>
            <h3 className="text-lg font-medium">
              {sacredMode ? 'Early Sacred Expressions' : 'Initial Writing Sample'}
            </h3>
          </div>
          
          <div className="space-y-4">
            {beforeData.entries.slice(0, 2).map((entry) => (
              <div key={entry.id} className="border-l-4 border-gray-300 pl-4">
                <div className="text-sm text-gray-500 mb-1">
                  {entry.date.toLocaleDateString()}
                </div>
                <div className="text-sm italic text-gray-700 mb-2">
                  "{entry.content.substring(0, 150)}..."
                </div>
                <div className="flex flex-wrap gap-1">
                  {entry.themes.map((theme) => (
                    <span key={theme} className="px-2 py-1 bg-gray-100 text-xs rounded">
                      {theme.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* After Sample */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🪲</span>
            <h3 className="text-lg font-medium">
              {sacredMode ? 'Transformed Sacred Voice' : 'Recent Writing Sample'}
            </h3>
          </div>
          
          <div className="space-y-4">
            {afterData.entries.slice(0, 2).map((entry) => (
              <div key={entry.id} className="border-l-4 border-amber-500 pl-4">
                <div className="text-sm text-gray-500 mb-1">
                  {entry.date.toLocaleDateString()}
                </div>
                <div className="text-sm italic text-gray-700 mb-2">
                  "{entry.content.substring(0, 150)}..."
                </div>
                <div className="flex flex-wrap gap-1">
                  {entry.themes.map((theme) => (
                    <span key={theme} className="px-2 py-1 bg-amber-100 text-xs rounded">
                      {theme.replace('_', ' ')}
                    </span>
                  ))}
                </div>
                {entry.resilience_indicators.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-green-600 font-medium">Resilience Indicators:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.resilience_indicators.map((indicator) => (
                        <span key={indicator} className="px-2 py-1 bg-green-100 text-xs rounded">
                          {indicator.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderThemeEvolution = () => {
    if (!beforeData || !afterData) return null;

    const beforeThemes = beforeData.entries.flatMap(e => e.themes);
    const afterThemes = afterData.entries.flatMap(e => e.themes);
    
    const themeChanges = [
      {
        category: 'Emotional Expression',
        before: ['overwhelm', 'hopelessness', 'self-doubt'],
        after: ['mindful_response', 'self_compassion', 'gratitude'],
        sacredBefore: ['shadow dwelling', 'soul uncertainty', 'inner critic'],
        sacredAfter: ['conscious presence', 'heart kindness', 'sacred appreciation']
      },
      {
        category: 'Problem Approach',
        before: ['struggle', 'repetitive_patterns', 'challenges'],
        after: ['growth_mindset', 'learning_orientation', 'creative_response'],
        sacredBefore: ['resistance patterns', 'karmic loops', 'life tests'],
        sacredAfter: ['expansion mindset', 'wisdom seeking', 'divine creativity']
      },
      {
        category: 'Future Orientation',
        before: ['uncertainty', 'fear_of_future'],
        after: ['purpose', 'vision_clarity', 'possibility_thinking'],
        sacredBefore: ['path confusion', 'tomorrow anxiety'],
        sacredAfter: ['soul mission', 'divine sight', 'infinite potential']
      }
    ];

    return (
      <div className="space-y-6">
        {themeChanges.map((category) => (
          <Card key={category.category} className="p-6">
            <h3 className="text-lg font-medium mb-4">{category.category}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-gray-600">Before Transformation</h4>
                <div className="space-y-2">
                  {(sacredMode ? category.sacredBefore : category.before).map((theme, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      <span className="text-sm">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-amber-600">After Transformation</h4>
                <div className="space-y-2">
                  {(sacredMode ? category.sacredAfter : category.after).map((theme, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-sm">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderInsightsOverview = () => {
    if (!beforeData || !afterData) return null;

    const allInsights = [...beforeData.insights, ...afterData.insights];
    
    return (
      <div className="space-y-6">
        {/* Transformation Summary */}
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">
            {sacredMode ? 'Sacred Metamorphosis Summary' : 'Transformation Analysis Summary'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <div className="text-2xl font-medium text-green-600">
                +{Math.round(calculateChange(beforeData.metrics.avg_word_count, afterData.metrics.avg_word_count))}%
              </div>
              <div className="text-sm text-gray-600">Expression Depth</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🌅</div>
              <div className="text-2xl font-medium text-amber-600">
                +{Math.round(calculateChange(beforeData.metrics.positive_sentiment, afterData.metrics.positive_sentiment))}%
              </div>
              <div className="text-sm text-gray-600">Positive Sentiment</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🔮</div>
              <div className="text-2xl font-medium text-blue-600">
                +{Math.round(calculateChange(beforeData.metrics.future_orientation, afterData.metrics.future_orientation))}%
              </div>
              <div className="text-sm text-gray-600">Future Orientation</div>
            </div>
          </div>
        </Card>

        {/* Key Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Key Transformation Insights</h3>
          <div className="space-y-4">
            {allInsights.map((insight, index) => (
              <div key={index} className="border-l-4 border-amber-500 pl-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs rounded ${
                    insight.significance === 'transformational' ? 'bg-green-100 text-green-800' :
                    insight.significance === 'significant' ? 'bg-blue-100 text-blue-800' :
                    insight.significance === 'notable' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.significance}
                  </span>
                  <span className="font-medium capitalize">{insight.category.replace('_', ' ')}</span>
                </div>
                <div className="text-sm text-gray-700 mb-2">{insight.insight}</div>
                <div className="text-xs text-gray-500">
                  Evidence: {insight.evidence.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔄</div>
          <p className="text-gray-600">Analyzing your writing evolution...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">
            {sacredMode ? 'Sacred Voice Evolution' : 'Writing Transformation Analysis'}
          </h2>
          <p className="text-gray-600">
            {sacredMode 
              ? "Witness the metamorphosis of your sacred expression"
              : "Evidence-based analysis of your writing transformation"
            }
          </p>
        </div>
        
        <div className="flex space-x-2">
          {[
            { key: '3months', label: '3 Months' },
            { key: '6months', label: '6 Months' },
            { key: '1year', label: '1 Year' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={timeframe === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(key as any)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'overview', label: 'Overview', icon: '📊' },
          { key: 'entries', label: 'Writing Samples', icon: '📝' },
          { key: 'themes', label: 'Theme Evolution', icon: '🎭' },
          { key: 'language', label: 'Language Patterns', icon: '🔤' }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={selectedComparison === key ? 'default' : 'outline'}
            onClick={() => setSelectedComparison(key as any)}
            className="flex items-center space-x-2"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      {selectedComparison === 'overview' && renderInsightsOverview()}
      {selectedComparison === 'entries' && renderWritingSamples()}
      {selectedComparison === 'themes' && renderThemeEvolution()}
      {selectedComparison === 'language' && renderMetricsComparison()}
    </div>
  );
};

export default BeforeAfterAnalysis;