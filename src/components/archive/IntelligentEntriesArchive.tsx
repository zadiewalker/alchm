'use client';

import React, { useState, useMemo } from 'react';
import { useJournals } from '@/lib/useJournals';
import { JournalEntry } from '@/types/journal';
import { AIPatternRecognition } from './AIPatternRecognition';
import { EmotionalTimeline } from './EmotionalTimeline';
import { BreakthroughHighlighting } from './BreakthroughHighlighting';
import { TherapistReports } from './TherapistReports';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Filter, BarChart3, Heart, Sparkles, FileText, Download } from 'lucide-react';

interface FilterOptions {
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  mood: 'all' | 'positive' | 'neutral' | 'negative' | 'mixed';
  hasBreakthrough: boolean | null;
  searchQuery: string;
}

export function IntelligentEntriesArchive() {
  const { entries, loading, error } = useJournals();
  const [activeView, setActiveView] = useState<'archive' | 'patterns' | 'timeline' | 'reports'>('archive');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'all',
    mood: 'all',
    hasBreakthrough: null,
    searchQuery: ''
  });

  // Filter and sort entries based on current filters
  const filteredEntries = useMemo(() => {
    if (!entries) return [];

    return entries.filter(entry => {
      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const entryDate = new Date(entry.createdAt);
        let dateThreshold: Date;

        switch (filters.dateRange) {
          case 'week':
            dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'quarter':
            dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            dateThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            dateThreshold = new Date(0);
        }

        if (entryDate < dateThreshold) return false;
      }

      // Mood filter
      if (filters.mood !== 'all' && entry.mood !== filters.mood) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${entry.title} ${entry.content}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      return true;
    });
  }, [entries, filters]);

  // Calculate statistics for the filtered entries
  const archiveStats = useMemo(() => {
    if (!filteredEntries.length) return null;

    const totalEntries = filteredEntries.length;
    const totalWords = filteredEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
    const averageWords = Math.round(totalWords / totalEntries);
    
    // Mood distribution
    const moodCounts = filteredEntries.reduce((acc, entry) => {
      const mood = entry.mood || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Date range for filtered entries
    const dates = filteredEntries.map(entry => new Date(entry.createdAt)).sort((a, b) => a.getTime() - b.getTime());
    const dateRange = dates.length > 0 ? {
      start: dates[0],
      end: dates[dates.length - 1]
    } : null;

    return {
      totalEntries,
      totalWords,
      averageWords,
      moodCounts,
      dateRange
    };
  }, [filteredEntries]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'mixed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getWordCountBadge = (wordCount: number) => {
    if (wordCount > 500) return { text: 'Deep Reflection', color: 'bg-purple-100 text-purple-800' };
    if (wordCount > 200) return { text: 'Thoughtful', color: 'bg-blue-100 text-blue-800' };
    if (wordCount > 50) return { text: 'Brief', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Quick Note', color: 'bg-gray-100 text-gray-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-sage-200 rounded-lg w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-48 shadow-sm"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Archive</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      {/* Header */}
      <div className="bg-white border-b border-sage-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-sage-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sage-600" />
                Wisdom Archive
              </h1>
              <p className="text-sage-600 mt-1">Your journey of reflection and growth, transformed into insights</p>
            </div>

            {/* View Toggle */}
            <div className="flex bg-sage-100 rounded-lg p-1">
              {[
                { key: 'archive', label: 'Archive', icon: FileText },
                { key: 'patterns', label: 'Patterns', icon: BarChart3 },
                { key: 'timeline', label: 'Timeline', icon: Calendar },
                { key: 'reports', label: 'Reports', icon: Download }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeView === key
                      ? 'bg-white text-sage-900 shadow-sm'
                      : 'text-sage-600 hover:text-sage-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'archive' && (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-sage-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-sage-400" />
                  <input
                    type="text"
                    placeholder="Find your reflections..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent outline-none"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 outline-none"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>

                  <select
                    value={filters.mood}
                    onChange={(e) => setFilters(prev => ({ ...prev, mood: e.target.value as any }))}
                    className="px-4 py-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-300 outline-none"
                  >
                    <option value="all">All Moods</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Challenging</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              {/* Archive Statistics */}
              {archiveStats && (
                <div className="mt-6 pt-6 border-t border-sage-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-900">{archiveStats.totalEntries}</div>
                      <div className="text-sm text-sage-600">Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-900">{archiveStats.totalWords.toLocaleString()}</div>
                      <div className="text-sm text-sage-600">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-900">{archiveStats.averageWords}</div>
                      <div className="text-sm text-sage-600">Avg Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-900">
                        {archiveStats.dateRange ? 
                          Math.ceil((archiveStats.dateRange.end.getTime() - archiveStats.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) 
                          : 0}
                      </div>
                      <div className="text-sm text-sage-600">Days Span</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Entries Grid */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-sage-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-700 mb-2">No entries found</h3>
                <p className="text-sage-500">
                  {filters.searchQuery || filters.dateRange !== 'all' || filters.mood !== 'all'
                    ? 'Try adjusting your filters to see more entries.'
                    : 'Start your journaling journey to build your wisdom archive.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry) => {
                  const wordCountBadge = getWordCountBadge(entry.wordCount || 0);
                  
                  return (
                    <Card
                      key={entry.id}
                      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-sage-200 bg-white"
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="p-6">
                        {/* Entry Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-sage-900 line-clamp-2 group-hover:text-sage-700">
                            {entry.title || 'Untitled Entry'}
                          </h3>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {entry.mood && (
                              <Badge className={`text-xs ${getMoodColor(entry.mood)}`}>
                                {entry.mood}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Entry Preview */}
                        <p className="text-sage-600 text-sm line-clamp-3 mb-4">
                          {entry.content}
                        </p>

                        {/* Entry Footer */}
                        <div className="flex items-center justify-between text-xs text-sage-500">
                          <span>{formatDate(entry.createdAt)}</span>
                          <Badge className={wordCountBadge.color}>
                            {wordCountBadge.text}
                          </Badge>
                        </div>
                      </div>

                      {/* Hover Effect Indicator */}
                      <div className="h-1 bg-gradient-to-r from-sage-400 to-sage-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeView === 'patterns' && <AIPatternRecognition entries={filteredEntries} />}
        {activeView === 'timeline' && <EmotionalTimeline entries={filteredEntries} />}
        {activeView === 'reports' && <TherapistReports entries={filteredEntries} />}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-sage-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-sage-900">{selectedEntry.title || 'Untitled Entry'}</h2>
                  <p className="text-sage-600">{formatDate(selectedEntry.createdAt)}</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedEntry(null)}
                  className="text-sage-500 hover:text-sage-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="prose prose-sage max-w-none">
                {selectedEntry.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sage-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Entry Metadata */}
              <div className="mt-8 pt-6 border-t border-sage-200">
                <div className="flex flex-wrap gap-4 text-sm text-sage-600">
                  <span>Words: {selectedEntry.wordCount || 0}</span>
                  {selectedEntry.mood && (
                    <Badge className={getMoodColor(selectedEntry.mood)}>
                      {selectedEntry.mood}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}