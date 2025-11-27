'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataVisualizationEngine } from './DataVisualizationEngine';
import { CorrelationAnalysis } from './CorrelationAnalysis';
import { TherapistSummaryReports } from './TherapistSummaryReports';
import { TriggerPatternIdentification } from './TriggerPatternIdentification';
import { emotionalIntelligenceEngine } from '@/lib/analytics/emotional-intelligence-engine';
import { Download, Share2, Eye, Calendar, TrendingUp, Heart } from 'lucide-react';

interface EmotionalReportData {
  userId: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  moodData: Array<{
    date: string;
    mood: number;
    emotions: string[];
    activities: string[];
    journalLength: number;
    vocabularyScore: number;
  }>;
  insights: {
    resilience: number;
    emotionalVocabulary: number;
    selfAwareness: number;
    copingStrategies: number;
    socialConnection: number;
  };
  progress: {
    currentWeek: number;
    previousWeek: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  anonymousComparison: {
    percentile: number;
    similarUsers: number;
  };
}

interface SophisticatedEmotionalReportCardProps {
  userId: string;
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  onShare?: (reportData: EmotionalReportData) => void;
  showTherapistTools?: boolean;
}

export const SophisticatedEmotionalReportCard: React.FC<SophisticatedEmotionalReportCardProps> = ({
  userId,
  timeframe = 'month',
  onShare,
  showTherapistTools = false
}) => {
  const [reportData, setReportData] = useState<EmotionalReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'correlations' | 'therapist'>('overview');
  const [showAnonymousComparison, setShowAnonymousComparison] = useState(false);

  useEffect(() => {
    loadReportData();
  }, [userId, timeframe]);

  // Monday/Wednesday/Friday refresh schedule utility
  const shouldRefreshData = () => {
    const lastRefresh = localStorage.getItem(`alchm_sophisticated_report_last_refresh_${userId}`);
    const now = new Date();
    
    if (!lastRefresh) return true;
    
    const lastRefreshDate = new Date(lastRefresh);
    const currentDay = now.getDay();
    const isRefreshDay = [1, 3, 5].includes(currentDay); // Monday, Wednesday, Friday
    
    // Refresh if it's a refresh day and we haven't refreshed today
    if (isRefreshDay && now.toDateString() !== lastRefreshDate.toDateString()) {
      return true;
    }
    
    // Also refresh if more than 7 days have passed (safety fallback)
    const daysSinceRefresh = (now.getTime() - lastRefreshDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceRefresh > 7;
  };

  const getNextRefreshDate = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const refreshDays = [1, 3, 5]; // Monday, Wednesday, Friday
    
    // Find next refresh day
    let nextRefreshDay = refreshDays.find(day => day > currentDay);
    
    // If no refresh day this week, get Monday of next week
    if (!nextRefreshDay) {
      nextRefreshDay = 1; // Monday
    }
    
    const daysUntilRefresh = nextRefreshDay <= currentDay ? 
      (7 - currentDay + nextRefreshDay) : (nextRefreshDay - currentDay);
    
    const nextRefresh = new Date(now);
    nextRefresh.setDate(now.getDate() + daysUntilRefresh);
    nextRefresh.setHours(6, 0, 0, 0); // 6 AM refresh time
    
    return nextRefresh;
  };

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      // Check if we should refresh data based on schedule
      const cacheKey = `alchm_sophisticated_report_data_${userId}_${timeframe}`;
      const storedData = localStorage.getItem(cacheKey);
      const shouldRefresh = shouldRefreshData();
      
      if (storedData && !shouldRefresh) {
        // Use cached data if not time to refresh
        const cachedData = JSON.parse(storedData);
        setReportData(cachedData);
        setIsLoading(false);
        return;
      }

      const data = await emotionalIntelligenceEngine.generateComprehensiveReport(userId, timeframe);
      
      // Store data and update refresh timestamp
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`alchm_sophisticated_report_last_refresh_${userId}`, new Date().toISOString());
      
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
      // Try to load cached data as fallback
      const cacheKey = `alchm_sophisticated_report_data_${userId}_${timeframe}`;
      const fallbackData = localStorage.getItem(cacheKey);
      if (fallbackData) {
        const cachedData = JSON.parse(fallbackData);
        setReportData(cachedData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateResilienceInsight = (data: EmotionalReportData) => {
    const { resilience, emotionalVocabulary, selfAwareness } = data.insights;
    
    if (resilience >= 80) {
      return "You've been incredibly resilient this month. Your ability to bounce back from challenges shows remarkable inner strength.";
    } else if (resilience >= 60) {
      return "Your resilience is building beautifully. Each challenge you've faced has been met with growing wisdom.";
    } else {
      return "You're cultivating resilience in gentle ways. Every small step forward is meaningful progress.";
    }
  };

  const generateProgressCelebration = (data: EmotionalReportData) => {
    const improvements = [];
    
    if (data.insights.emotionalVocabulary > 70) {
      improvements.push("your expanding emotional vocabulary");
    }
    if (data.insights.selfAwareness > 75) {
      improvements.push("your deepening self-awareness");
    }
    if (data.progress.trend === 'improving') {
      improvements.push("your consistent growth trajectory");
    }

    if (improvements.length > 0) {
      return `Celebrating ${improvements.join(', ')}. These invisible victories are profound markers of your healing journey.`;
    }
    
    return "Your commitment to self-reflection is a powerful act of self-care. This practice itself is meaningful progress.";
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-sage-100 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-sage-50 rounded-lg"></div>
            <div className="h-24 bg-sage-50 rounded-lg"></div>
            <div className="h-24 bg-sage-50 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!reportData) {
    return (
      <Card className="p-8 text-center">
        <div className="text-sage-600 mb-4">
          <Heart className="w-12 h-12 mx-auto mb-4 text-sage-400" />
          <h3 className="text-xl font-medium mb-2">Building Your Report</h3>
          <p>Continue journaling to unlock deeper insights into your emotional journey.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-medium text-sage-800 mb-2">
              Your Emotional Intelligence Report
            </h2>
            <p className="text-sage-600">
              {timeframe === 'week' ? 'This Week' : 
               timeframe === 'month' ? 'This Month' : 
               timeframe === 'quarter' ? 'This Quarter' : 'This Year'} • 
              Generated with love and respect for your journey
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare?.(reportData)}
              className="text-sage-600 border-sage-200"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sage-600 border-sage-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-sage-50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'patterns' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Patterns
          </button>
          <button
            onClick={() => setActiveTab('correlations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'correlations' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Connections
          </button>
          {showTherapistTools && (
            <button
              onClick={() => setActiveTab('therapist')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'therapist' 
                  ? 'bg-white text-sage-800 shadow-sm' 
                  : 'text-sage-600 hover:text-sage-800'
              }`}
            >
              Professional
            </button>
          )}
        </div>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Resilience Insight */}
          <Card className="p-6 bg-gradient-to-br from-sage-50 to-eucalyptus-50">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-sage-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800 mb-2">Resilience Reflection</h3>
                <p className="text-sage-700 leading-relaxed">
                  {generateResilienceInsight(reportData)}
                </p>
              </div>
            </div>
          </Card>

          {/* Progress Celebration */}
          <Card className="p-6 bg-gradient-to-br from-eucalyptus-50 to-sage-50">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-eucalyptus-200 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-eucalyptus-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800 mb-2">Invisible Progress</h3>
                <p className="text-sage-700 leading-relaxed">
                  {generateProgressCelebration(reportData)}
                </p>
              </div>
            </div>
          </Card>

          {/* Data Visualization */}
          <DataVisualizationEngine 
            moodData={reportData.moodData}
            insights={reportData.insights}
            timeframe={timeframe}
          />

          {/* Anonymous Comparison Toggle */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-sage-800 mb-1">Community Insights</h3>
                <p className="text-sage-600 text-sm">
                  See how your journey compares with others (completely anonymous)
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnonymousComparison(!showAnonymousComparison)}
                className="text-sage-600 border-sage-200"
              >
                {showAnonymousComparison ? 'Hide' : 'Show'} Comparison
              </Button>
            </div>
            
            {showAnonymousComparison && (
              <div className="bg-sage-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-medium text-sage-800 mb-2">
                    {reportData.anonymousComparison.percentile}th
                  </div>
                  <div className="text-sage-600 mb-4">
                    percentile among {reportData.anonymousComparison.similarUsers.toLocaleString()} similar users
                  </div>
                  <p className="text-sm text-sage-600">
                    Your emotional growth journey is unique and valuable. This comparison simply shows 
                    you're part of a community of people committed to healing and growth.
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <TriggerPatternIdentification 
          userId={userId}
          timeframe={timeframe}
          moodData={reportData.moodData}
        />
      )}

      {/* Correlations Tab */}
      {activeTab === 'correlations' && (
        <CorrelationAnalysis 
          moodData={reportData.moodData}
          timeframe={timeframe}
        />
      )}

      {/* Therapist Tab */}
      {activeTab === 'therapist' && showTherapistTools && (
        <TherapistSummaryReports 
          reportData={reportData}
          userId={userId}
        />
      )}
    </div>
  );
};