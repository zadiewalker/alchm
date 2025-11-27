'use client';

import React, { useMemo, useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Heart,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3
} from 'lucide-react';

interface TimelineEntry {
  date: Date;
  mood: string;
  title: string;
  content: string;
  wordCount: number;
  significance?: 'breakthrough' | 'growth' | 'challenge' | 'insight';
  moodScore: number; // -2 to 2 for visualization
}

interface EmotionalTimelineProps {
  entries: JournalEntry[];
}

interface TimelinePeriod {
  start: Date;
  end: Date;
  label: string;
  entries: TimelineEntry[];
  averageMood: number;
  trends: {
    direction: 'up' | 'down' | 'stable';
    strength: number;
  };
}

export function EmotionalTimeline({ entries }: EmotionalTimelineProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [focusedEntry, setFocusedEntry] = useState<TimelineEntry | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'chart'>('timeline');

  // Convert journal entries to timeline entries with mood scores
  const timelineEntries = useMemo(() => {
    return entries.map(entry => {
      const moodScore = (() => {
        switch (entry.mood) {
          case 'positive': return 2;
          case 'mixed': return 0;
          case 'negative': return -2;
          default: return 0; // neutral
        }
      })();

      // Detect significance based on patterns
      let significance: TimelineEntry['significance'] | undefined;
      
      const wordCount = entry.wordCount || 0;
      if (wordCount > 800) significance = 'breakthrough';
      else if (wordCount > 400 && entry.mood === 'positive') significance = 'growth';
      else if (entry.mood === 'negative' && wordCount > 200) significance = 'challenge';
      else if (wordCount > 300) significance = 'insight';

      return {
        date: new Date(entry.createdAt),
        mood: entry.mood || 'neutral',
        title: entry.title || 'Untitled Entry',
        content: entry.content,
        wordCount,
        significance,
        moodScore
      } as TimelineEntry;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [entries]);

  // Group entries into periods
  const timelinePeriods = useMemo(() => {
    if (!timelineEntries.length) return [];

    const periods: TimelinePeriod[] = [];
    const startDate = new Date(timelineEntries[0].date);
    const endDate = new Date(timelineEntries[timelineEntries.length - 1].date);

    // Calculate period duration
    const periodDuration = (() => {
      switch (selectedPeriod) {
        case 'week': return 7 * 24 * 60 * 60 * 1000;
        case 'month': return 30 * 24 * 60 * 60 * 1000;
        case 'quarter': return 90 * 24 * 60 * 60 * 1000;
        case 'year': return 365 * 24 * 60 * 60 * 1000;
      }
    })();

    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const periodEnd = new Date(currentDate.getTime() + periodDuration);
      const periodEntries = timelineEntries.filter(entry => 
        entry.date >= currentDate && entry.date < periodEnd
      );

      if (periodEntries.length > 0) {
        const averageMood = periodEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / periodEntries.length;
        
        // Calculate trend
        const firstHalf = periodEntries.slice(0, Math.ceil(periodEntries.length / 2));
        const secondHalf = periodEntries.slice(Math.floor(periodEntries.length / 2));
        const firstAvg = firstHalf.reduce((sum, e) => sum + e.moodScore, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, e) => sum + e.moodScore, 0) / secondHalf.length;
        const trendStrength = Math.abs(secondAvg - firstAvg);
        
        let direction: 'up' | 'down' | 'stable' = 'stable';
        if (secondAvg > firstAvg + 0.3) direction = 'up';
        else if (secondAvg < firstAvg - 0.3) direction = 'down';

        periods.push({
          start: new Date(currentDate),
          end: new Date(periodEnd),
          label: formatPeriodLabel(currentDate, selectedPeriod),
          entries: periodEntries,
          averageMood,
          trends: { direction, strength: trendStrength }
        });
      }

      currentDate = new Date(periodEnd);
    }

    return periods;
  }, [timelineEntries, selectedPeriod]);

  const formatPeriodLabel = (date: Date, period: string) => {
    switch (period) {
      case 'week':
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} ${date.getFullYear()}`;
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-500 border-green-600';
      case 'negative': return 'bg-red-500 border-red-600';
      case 'mixed': return 'bg-yellow-500 border-yellow-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getSignificanceIcon = (significance?: TimelineEntry['significance']) => {
    switch (significance) {
      case 'breakthrough': return '🚀';
      case 'growth': return '🌱';
      case 'challenge': return '⚡';
      case 'insight': return '💡';
      default: return null;
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!entries.length) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-700 mb-2">No timeline data available</h3>
        <p className="text-sage-500">Create more journal entries to see your emotional journey unfold.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-sage-900 mb-1">Emotional Journey Timeline</h2>
          <p className="text-sage-600">Track your emotional evolution and growth patterns over time</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-sage-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'timeline'
                  ? 'bg-white text-sage-900 shadow-sm'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                viewMode === 'chart'
                  ? 'bg-white text-sage-900 shadow-sm'
                  : 'text-sage-600 hover:text-sage-900'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Chart
            </button>
          </div>

          {/* Period Selection */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 outline-none"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-8">
          {timelinePeriods.map((period, periodIndex) => (
            <Card key={periodIndex} className="p-6 border-sage-200">
              {/* Period Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-sage-900">{period.label}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-sage-600">{period.entries.length} entries</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(period.trends.direction)}
                      <span className="text-sm text-sage-600">
                        {period.trends.direction === 'stable' ? 'Stable mood' : 
                         period.trends.direction === 'up' ? 'Improving trend' : 'Challenging period'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Average Mood Indicator */}
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    period.averageMood > 0.5 ? 'bg-green-500' :
                    period.averageMood < -0.5 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {period.averageMood > 0 ? '+' : ''}{period.averageMood.toFixed(1)}
                  </div>
                  <div className="text-xs text-sage-600 mt-1">Avg Mood</div>
                </div>
              </div>

              {/* Timeline Entries */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-sage-200"></div>
                
                <div className="space-y-4">
                  {period.entries.map((entry, entryIndex) => (
                    <div key={entryIndex} className="relative flex items-start gap-4">
                      {/* Timeline Node */}
                      <div className={`relative z-10 w-12 h-12 rounded-full border-4 ${getMoodColor(entry.mood)} flex items-center justify-center text-white font-medium`}>
                        {getSignificanceIcon(entry.significance) || entry.moodScore}
                      </div>
                      
                      {/* Entry Content */}
                      <div className="flex-1 bg-sage-50 rounded-lg p-4 hover:bg-sage-100 transition-colors cursor-pointer"
                           onClick={() => setFocusedEntry(entry)}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sage-900 line-clamp-1">{entry.title}</h4>
                          <div className="flex items-center gap-2 ml-4">
                            {entry.significance && (
                              <Badge variant="outline" className="text-xs capitalize">
                                {entry.significance}
                              </Badge>
                            )}
                            <span className="text-xs text-sage-500">
                              {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sage-600 text-sm line-clamp-2 mb-2">{entry.content}</p>
                        
                        <div className="flex items-center justify-between text-xs text-sage-500">
                          <span>{entry.wordCount} words</span>
                          <Badge className={`${getMoodColor(entry.mood).replace('bg-', 'bg-opacity-20 text-').replace('border-', 'border-opacity-30 border-')}`}>
                            {entry.mood}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Chart View */}
      {viewMode === 'chart' && (
        <Card className="p-6 border-sage-200">
          <h3 className="text-lg font-medium text-sage-900 mb-6">Mood Evolution Chart</h3>
          
          <div className="relative h-64 bg-sage-50 rounded-lg p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-sage-500 pr-2">
              <span>Positive</span>
              <span>Neutral</span>
              <span>Challenging</span>
            </div>
            
            {/* Chart area */}
            <div className="ml-12 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="h-1/3 border-b border-sage-200"></div>
                <div className="h-1/3 border-b border-sage-200"></div>
                <div className="h-1/3"></div>
              </div>
              
              {/* Data points and line */}
              <svg className="absolute inset-0 w-full h-full">
                {timelineEntries.map((entry, index) => {
                  const x = (index / (timelineEntries.length - 1)) * 100;
                  const y = 50 - (entry.moodScore / 4) * 40; // Convert -2 to +2 scale to 10-90% position
                  
                  return (
                    <g key={index}>
                      {/* Connection line */}
                      {index > 0 && (
                        <line
                          x1={`${((index - 1) / (timelineEntries.length - 1)) * 100}%`}
                          y1={`${50 - (timelineEntries[index - 1].moodScore / 4) * 40}%`}
                          x2={`${x}%`}
                          y2={`${y}%`}
                          stroke="#10b981"
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      )}
                      
                      {/* Data point */}
                      <circle
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="4"
                        className={getMoodColor(entry.mood).replace('bg-', 'fill-')}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFocusedEntry(entry)}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-sage-500 pt-2">
              <span>{timelineEntries[0]?.date.toLocaleDateString('en-US', { month: 'short' })}</span>
              <span>{timelineEntries[timelineEntries.length - 1]?.date.toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            {['positive', 'neutral', 'mixed', 'negative'].map(mood => (
              <div key={mood} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getMoodColor(mood)}`}></div>
                <span className="text-sm text-sage-600 capitalize">{mood}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Growth Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-medium text-sage-900">
                {timelinePeriods.filter(p => p.trends.direction === 'up').length}
              </div>
              <div className="text-sm text-sage-600">Growth Periods</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-medium text-sage-900">
                {timelineEntries.filter(e => e.significance === 'breakthrough').length}
              </div>
              <div className="text-sm text-sage-600">Breakthrough Moments</div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-sage-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-medium text-sage-900">
                {timelineEntries.filter(e => e.significance === 'insight').length}
              </div>
              <div className="text-sm text-sage-600">Key Insights</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Focused Entry Modal */}
      {focusedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-sage-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-sage-900">{focusedEntry.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sage-600">
                      {focusedEntry.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Badge className={getMoodColor(focusedEntry.mood)}>
                      {focusedEntry.mood}
                    </Badge>
                    {focusedEntry.significance && (
                      <Badge variant="outline" className="capitalize">
                        {getSignificanceIcon(focusedEntry.significance)} {focusedEntry.significance}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setFocusedEntry(null)}
                  className="text-sage-500 hover:text-sage-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sage max-w-none">
                {focusedEntry.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sage-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}