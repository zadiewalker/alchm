'use client';

import React, { useMemo, useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Heart, 
  Target,
  Calendar,
  Star,
  Award,
  Zap,
  Crown,
  Flame,
  Gem,
  ChevronRight,
  Eye,
  Share2
} from 'lucide-react';

interface BreakthroughMoment {
  id: string;
  type: 'emotional' | 'insight' | 'behavioral' | 'growth' | 'resilience' | 'creative';
  title: string;
  description: string;
  entry: JournalEntry;
  significance: 'major' | 'significant' | 'notable';
  indicators: string[];
  emotionalImpact: number; // 1-10 scale
  growthAreas: string[];
  celebrationLevel: 'milestone' | 'breakthrough' | 'transformation';
}

interface BreakthroughHighlightingProps {
  entries: JournalEntry[];
}

export function BreakthroughHighlighting({ entries }: BreakthroughHighlightingProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [focusedBreakthrough, setFocusedBreakthrough] = useState<BreakthroughMoment | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'timeline'>('gallery');

  // Analyze entries to identify breakthrough moments
  const breakthroughMoments = useMemo(() => {
    if (!entries.length) return [];

    const moments: BreakthroughMoment[] = [];
    const sortedEntries = [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    sortedEntries.forEach((entry, index) => {
      const wordCount = entry.wordCount || 0;
      const mood = entry.mood;
      const content = entry.content.toLowerCase();
      
      // Identify emotional breakthroughs
      if (mood === 'positive' && wordCount > 400) {
        const positiveKeywords = ['breakthrough', 'realize', 'understand', 'clarity', 'peace', 'joy', 'grateful', 'proud', 'accomplished', 'love', 'hope'];
        const hasPositiveKeywords = positiveKeywords.some(keyword => content.includes(keyword));
        
        if (hasPositiveKeywords) {
          moments.push({
            id: `emotional-${entry.id}`,
            type: 'emotional',
            title: 'Emotional Breakthrough',
            description: 'A moment of significant positive emotional shift and clarity',
            entry,
            significance: wordCount > 600 ? 'major' : 'significant',
            indicators: [
              'Positive emotional language',
              'Extended reflection',
              'Clarity expressions',
              'Gratitude themes'
            ],
            emotionalImpact: wordCount > 600 ? 9 : 7,
            growthAreas: ['Emotional Intelligence', 'Self-Awareness', 'Positive Mindset'],
            celebrationLevel: wordCount > 600 ? 'transformation' : 'breakthrough'
          });
        }
      }

      // Identify insight moments
      const insightKeywords = ['realized', 'understand', 'insight', 'epiphany', 'clarity', 'discovered', 'learned', 'figured out'];
      const hasInsightKeywords = insightKeywords.some(keyword => content.includes(keyword));
      
      if (hasInsightKeywords && wordCount > 300) {
        moments.push({
          id: `insight-${entry.id}`,
          type: 'insight',
          title: 'Key Insight Discovery',
          description: 'A moment of significant understanding or realization',
          entry,
          significance: wordCount > 500 ? 'significant' : 'notable',
          indicators: [
            'Learning language',
            'Understanding expressions',
            'Problem-solving content',
            'Future planning'
          ],
          emotionalImpact: 6,
          growthAreas: ['Critical Thinking', 'Self-Understanding', 'Wisdom'],
          celebrationLevel: 'breakthrough'
        });
      }

      // Identify behavioral change moments
      const behaviorKeywords = ['changed', 'decided', 'will start', 'commitment', 'habit', 'routine', 'different approach', 'new way'];
      const hasBehaviorKeywords = behaviorKeywords.some(keyword => content.includes(keyword));
      
      if (hasBehaviorKeywords && wordCount > 250) {
        moments.push({
          id: `behavioral-${entry.id}`,
          type: 'behavioral',
          title: 'Behavioral Transformation',
          description: 'A commitment to positive change and new habits',
          entry,
          significance: 'notable',
          indicators: [
            'Action-oriented language',
            'Commitment expressions',
            'Future plans',
            'Habit formation'
          ],
          emotionalImpact: 7,
          growthAreas: ['Self-Discipline', 'Personal Development', 'Life Skills'],
          celebrationLevel: 'milestone'
        });
      }

      // Identify resilience moments
      if (mood === 'mixed' || (mood === 'negative' && wordCount > 400)) {
        const resilienceKeywords = ['despite', 'overcome', 'persist', 'strength', 'courage', 'survived', 'endured', 'fighting', 'won\'t give up'];
        const hasResilienceKeywords = resilienceKeywords.some(keyword => content.includes(keyword));
        
        if (hasResilienceKeywords) {
          moments.push({
            id: `resilience-${entry.id}`,
            type: 'resilience',
            title: 'Resilience Demonstration',
            description: 'Showing strength and perseverance through challenges',
            entry,
            significance: 'significant',
            indicators: [
              'Strength language',
              'Perseverance themes',
              'Courage expressions',
              'Hope maintenance'
            ],
            emotionalImpact: 8,
            growthAreas: ['Resilience', 'Mental Strength', 'Emotional Fortitude'],
            celebrationLevel: 'breakthrough'
          });
        }
      }

      // Identify creative breakthroughs
      const creativeKeywords = ['creative', 'idea', 'inspired', 'artistic', 'imagination', 'vision', 'dream', 'create', 'express'];
      const hasCreativeKeywords = creativeKeywords.some(keyword => content.includes(keyword));
      
      if (hasCreativeKeywords && wordCount > 350) {
        moments.push({
          id: `creative-${entry.id}`,
          type: 'creative',
          title: 'Creative Expression',
          description: 'A moment of creative inspiration and artistic expression',
          entry,
          significance: 'notable',
          indicators: [
            'Creative language',
            'Imaginative content',
            'Artistic themes',
            'Vision sharing'
          ],
          emotionalImpact: 6,
          growthAreas: ['Creativity', 'Self-Expression', 'Artistic Development'],
          celebrationLevel: 'milestone'
        });
      }

      // Identify growth moments (comparing to previous entries)
      if (index > 0 && wordCount > sortedEntries[index - 1].wordCount * 1.5) {
        moments.push({
          id: `growth-${entry.id}`,
          type: 'growth',
          title: 'Deepening Practice',
          description: 'Significant expansion in reflection depth and self-exploration',
          entry,
          significance: 'notable',
          indicators: [
            'Increased writing depth',
            'More detailed analysis',
            'Complex emotional processing',
            'Enhanced self-awareness'
          ],
          emotionalImpact: 5,
          growthAreas: ['Self-Reflection', 'Writing Practice', 'Emotional Depth'],
          celebrationLevel: 'milestone'
        });
      }
    });

    // Remove duplicates and sort by significance and emotional impact
    const uniqueMoments = moments.filter((moment, index, array) => 
      array.findIndex(m => m.entry.id === moment.entry.id) === index
    );

    return uniqueMoments.sort((a, b) => {
      const significanceOrder = { 'major': 3, 'significant': 2, 'notable': 1 };
      const aScore = significanceOrder[a.significance] + a.emotionalImpact / 10;
      const bScore = significanceOrder[b.significance] + b.emotionalImpact / 10;
      return bScore - aScore;
    });
  }, [entries]);

  // Group moments by type
  const momentsByType = useMemo(() => {
    return breakthroughMoments.reduce((acc, moment) => {
      if (!acc[moment.type]) acc[moment.type] = [];
      acc[moment.type].push(moment);
      return acc;
    }, {} as Record<string, BreakthroughMoment[]>);
  }, [breakthroughMoments]);

  const getTypeIcon = (type: BreakthroughMoment['type']) => {
    switch (type) {
      case 'emotional': return Heart;
      case 'insight': return Lightbulb;
      case 'behavioral': return Target;
      case 'growth': return TrendingUp;
      case 'resilience': return Zap;
      case 'creative': return Sparkles;
      default: return Star;
    }
  };

  const getSignificanceIcon = (significance: BreakthroughMoment['significance']) => {
    switch (significance) {
      case 'major': return Crown;
      case 'significant': return Gem;
      case 'notable': return Star;
    }
  };

  const getCelebrationIcon = (level: BreakthroughMoment['celebrationLevel']) => {
    switch (level) {
      case 'transformation': return '🎊';
      case 'breakthrough': return '🚀';
      case 'milestone': return '🌟';
    }
  };

  const getSignificanceColor = (significance: BreakthroughMoment['significance']) => {
    switch (significance) {
      case 'major': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'significant': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'notable': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <Sparkles className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-700 mb-2">No breakthrough moments yet</h3>
        <p className="text-sage-500">Continue your journaling journey to discover meaningful breakthroughs and milestones.</p>
      </div>
    );
  }

  if (!breakthroughMoments.length) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-700 mb-2">Building toward breakthroughs</h3>
        <p className="text-sage-500">Keep writing thoughtfully - meaningful moments and insights are on their way!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-sage-900 mb-1 flex items-center gap-2">
            <Award className="h-6 w-6 text-sage-600" />
            Breakthrough Moments
          </h2>
          <p className="text-sage-600">Celebrating your significant growth and milestone achievements</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-sage-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'gallery'
                  ? 'bg-white text-sage-900 shadow-sm'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-sage-900 shadow-sm'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-sage-200">
          <div className="text-center">
            <div className="text-2xl font-medium text-sage-900">{breakthroughMoments.length}</div>
            <div className="text-sm text-sage-600">Total Breakthroughs</div>
          </div>
        </Card>
        
        <Card className="p-4 border-sage-200">
          <div className="text-center">
            <div className="text-2xl font-medium text-purple-600">
              {breakthroughMoments.filter(m => m.significance === 'major').length}
            </div>
            <div className="text-sm text-sage-600">Major Moments</div>
          </div>
        </Card>
        
        <Card className="p-4 border-sage-200">
          <div className="text-center">
            <div className="text-2xl font-medium text-blue-600">
              {breakthroughMoments.filter(m => m.celebrationLevel === 'transformation').length}
            </div>
            <div className="text-sm text-sage-600">Transformations</div>
          </div>
        </Card>
        
        <Card className="p-4 border-sage-200">
          <div className="text-center">
            <div className="text-2xl font-medium text-green-600">
              {Object.keys(momentsByType).length}
            </div>
            <div className="text-sm text-sage-600">Growth Areas</div>
          </div>
        </Card>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          onClick={() => setSelectedType(null)}
          className="text-sm"
        >
          All Types
        </Button>
        {Object.entries(momentsByType).map(([type, moments]) => {
          const Icon = getTypeIcon(type as any);
          return (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className="text-sm capitalize"
            >
              <Icon className="h-4 w-4 mr-1" />
              {type} ({moments.length})
            </Button>
          );
        })}
      </div>

      {/* Breakthrough Moments Display */}
      <div className={viewMode === 'gallery' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
        {breakthroughMoments
          .filter(moment => selectedType === null || moment.type === selectedType)
          .map((moment) => {
            const Icon = getTypeIcon(moment.type);
            const SignificanceIcon = getSignificanceIcon(moment.significance);
            
            return (
              <Card 
                key={moment.id} 
                className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-sage-200 bg-gradient-to-br from-white to-sage-50"
                onClick={() => setFocusedBreakthrough(moment)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sage-100 rounded-lg">
                        <Icon className="h-5 w-5 text-sage-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sage-900 group-hover:text-sage-700">
                          {moment.title}
                        </h3>
                        <p className="text-sm text-sage-600 capitalize">{moment.type} breakthrough</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCelebrationIcon(moment.celebrationLevel)}</span>
                      <Badge className={getSignificanceColor(moment.significance)}>
                        <SignificanceIcon className="h-3 w-3 mr-1" />
                        {moment.significance}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sage-700 mb-4">{moment.description}</p>

                  {/* Entry Preview */}
                  <div className="bg-white rounded-lg p-3 mb-4 border border-sage-100">
                    <h4 className="font-medium text-sage-900 mb-1 text-sm">
                      {moment.entry.title || 'Untitled Entry'}
                    </h4>
                    <p className="text-sage-600 text-sm line-clamp-2">
                      {moment.entry.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-sage-500">
                      <span>{formatDate(moment.entry.createdAt)}</span>
                      <span>{moment.entry.wordCount} words</span>
                    </div>
                  </div>

                  {/* Growth Areas */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-sage-700 mb-2">Growth Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {moment.growthAreas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Emotional Impact */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-sage-600">Impact</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < moment.emotionalImpact ? 'bg-red-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="h-1 bg-gradient-to-r from-sage-400 to-sage-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Card>
            );
          })}
      </div>

      {/* Focused Breakthrough Modal */}
      {focusedBreakthrough && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-sage-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sage-100 rounded-lg">
                    {React.createElement(getTypeIcon(focusedBreakthrough.type), {
                      className: "h-6 w-6 text-sage-600"
                    })}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-sage-900 flex items-center gap-2">
                      {focusedBreakthrough.title}
                      <span className="text-2xl">{getCelebrationIcon(focusedBreakthrough.celebrationLevel)}</span>
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={getSignificanceColor(focusedBreakthrough.significance)}>
                        {focusedBreakthrough.significance}
                      </Badge>
                      <span className="text-sage-600 capitalize">{focusedBreakthrough.type} breakthrough</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setFocusedBreakthrough(null)}
                  className="text-sage-500 hover:text-sage-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-medium text-sage-900 mb-2">About This Breakthrough</h3>
                <p className="text-sage-700">{focusedBreakthrough.description}</p>
              </div>

              {/* Journal Entry */}
              <div className="bg-sage-50 rounded-lg p-4">
                <h3 className="font-medium text-sage-900 mb-2">Journal Entry</h3>
                <h4 className="font-medium text-sage-800 mb-1">
                  {focusedBreakthrough.entry.title || 'Untitled Entry'}
                </h4>
                <p className="text-sm text-sage-600 mb-3">
                  {formatDate(focusedBreakthrough.entry.createdAt)} • {focusedBreakthrough.entry.wordCount} words
                </p>
                <div className="prose prose-sage max-w-none">
                  {focusedBreakthrough.entry.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-sage-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Indicators */}
              <div>
                <h3 className="font-medium text-sage-900 mb-3">Breakthrough Indicators</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {focusedBreakthrough.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-center gap-2 text-sage-700">
                      <ChevronRight className="h-4 w-4 text-sage-400" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Growth Areas */}
              <div>
                <h3 className="font-medium text-sage-900 mb-3">Growth Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {focusedBreakthrough.growthAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Emotional Impact */}
              <div>
                <h3 className="font-medium text-sage-900 mb-3">Emotional Impact</h3>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < focusedBreakthrough.emotionalImpact ? 'bg-red-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sage-600">
                    {focusedBreakthrough.emotionalImpact}/10 impact level
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}