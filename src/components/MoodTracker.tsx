'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MoodEntry {
  id: string;
  date: string;
  beforeMood: number;
  afterMood?: number;
  emotionalTags: string[];
  celebrationTriggered: boolean;
  timestamp: number;
}

interface MoodTrackerProps {
  userId: string;
  className?: string;
}

interface MoodStats {
  averageImprovement: number;
  totalEntries: number;
  celebrationCount: number;
  currentStreak: number;
  bestMoodDay: { date: string; mood: number } | null;
  commonEmotions: { emotion: string; count: number }[];
}

const MOOD_EMOJIS = {
  1: '😰', 2: '😢', 3: '😕', 4: '😐', 5: '🙂',
  6: '😊', 7: '😃', 8: '😄', 9: '🤩', 10: '🥳'
};

const MOOD_COLORS = {
  1: '#ef4444', 2: '#f97316', 3: '#f59e0b', 4: '#eab308', 5: '#84cc16',
  6: '#22c55e', 7: '#10b981', 8: '#06b6d4', 9: '#3b82f6', 10: '#8b5cf6'
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ userId, className = '' }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [showEmotions, setShowEmotions] = useState(false);

  // Fetch mood data
  useEffect(() => {
    fetchMoodData();
  }, [userId, timeRange]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mood-data?userId=${userId}&range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch mood data');
      
      const data = await response.json();
      setMoodEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setError('Failed to load mood data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate mood statistics
  const moodStats = useMemo((): MoodStats => {
    if (moodEntries.length === 0) {
      return {
        averageImprovement: 0,
        totalEntries: 0,
        celebrationCount: 0,
        currentStreak: 0,
        bestMoodDay: null,
        commonEmotions: []
      };
    }

    const improvements = moodEntries
      .filter(entry => entry.afterMood && entry.beforeMood)
      .map(entry => (entry.afterMood! - entry.beforeMood));
    
    const averageImprovement = improvements.length > 0 
      ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length 
      : 0;

    const celebrationCount = moodEntries.filter(entry => entry.celebrationTriggered).length;

    // Calculate current streak (consecutive days with mood improvement)
    let currentStreak = 0;
    for (let i = moodEntries.length - 1; i >= 0; i--) {
      const entry = moodEntries[i];
      if (entry.afterMood && entry.beforeMood && entry.afterMood > entry.beforeMood) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Find best mood day
    const bestMoodDay = moodEntries.reduce((best, entry) => {
      const mood = entry.afterMood || entry.beforeMood;
      if (!best || mood > best.mood) {
        return { date: entry.date, mood };
      }
      return best;
    }, null as { date: string; mood: number } | null);

    // Calculate common emotions
    const emotionCounts: Record<string, number> = {};
    moodEntries.forEach(entry => {
      entry.emotionalTags.forEach(tag => {
        emotionCounts[tag] = (emotionCounts[tag] || 0) + 1;
      });
    });

    const commonEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      averageImprovement,
      totalEntries: moodEntries.length,
      celebrationCount,
      currentStreak,
      bestMoodDay,
      commonEmotions
    };
  }, [moodEntries]);

  // Chart data for mood trend
  const moodChartData = useMemo(() => {
    const dates = moodEntries.map(entry => new Date(entry.date).toLocaleDateString());
    const beforeMoods = moodEntries.map(entry => entry.beforeMood);
    const afterMoods = moodEntries.map(entry => entry.afterMood || entry.beforeMood);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Before Journaling',
          data: beforeMoods,
          borderColor: '#f87171',
          backgroundColor: 'rgba(248, 113, 113, 0.1)',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'After Journaling',
          data: afterMoods,
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          fill: false,
          tension: 0.3,
        }
      ],
    };
  }, [moodEntries]);

  // Chart data for emotional themes
  const emotionChartData = useMemo(() => {
    return {
      labels: moodStats.commonEmotions.map(e => e.emotion),
      datasets: [
        {
          label: 'Frequency',
          data: moodStats.commonEmotions.map(e => e.count),
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
        }
      ],
    };
  }, [moodStats.commonEmotions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchMoodData}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mood Journey</h2>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">
            +{moodStats.averageImprovement.toFixed(1)}
          </div>
          <div className="text-sm text-blue-600">Avg Improvement</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-700">
            {moodStats.celebrationCount}
          </div>
          <div className="text-sm text-green-600">Breakthroughs</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">
            {moodStats.currentStreak}
          </div>
          <div className="text-sm text-purple-600">Day Streak</div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-700">
            {moodStats.totalEntries}
          </div>
          <div className="text-sm text-yellow-600">Total Entries</div>
        </div>
      </div>

      {/* Mood Trend Chart */}
      {moodEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
          <div className="h-64">
            <Line data={moodChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Mood Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
          <button
            onClick={() => setShowEmotions(!showEmotions)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showEmotions ? 'Hide' : 'Show'} Emotional Themes
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {moodEntries.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  {new Date(entry.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{MOOD_EMOJIS[entry.beforeMood as keyof typeof MOOD_EMOJIS]}</span>
                  <span className="text-sm text-gray-500">{entry.beforeMood}</span>
                  {entry.afterMood && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="text-lg">{MOOD_EMOJIS[Math.round(entry.afterMood) as keyof typeof MOOD_EMOJIS]}</span>
                      <span className="text-sm text-green-600 font-medium">{entry.afterMood.toFixed(1)}</span>
                    </>
                  )}
                </div>
                {entry.celebrationTriggered && (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    🎉 Breakthrough
                  </span>
                )}
              </div>
              
              {showEmotions && entry.emotionalTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.emotionalTags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emotional Themes Chart */}
      {showEmotions && moodStats.commonEmotions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Common Emotional Themes</h3>
          <div className="h-48">
            <Bar 
              data={emotionChartData} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
      )}

      {/* Best Mood Achievement */}
      {moodStats.bestMoodDay && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="font-medium text-gray-900">Best Mood Day</div>
              <div className="text-sm text-gray-600">
                {new Date(moodStats.bestMoodDay.date).toLocaleDateString()} - 
                Mood: {moodStats.bestMoodDay.mood}/10
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Data State */}
      {moodEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">No mood data yet</h3>
          <p className="text-sm">Start journaling to see your mood trends!</p>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;