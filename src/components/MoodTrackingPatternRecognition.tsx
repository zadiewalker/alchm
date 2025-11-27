// ALCHM Mood Tracking & Pattern Recognition Component
// Comprehensive mood tracking with AI-powered pattern analysis and insights

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  EmotionalEntry,
  EmotionalPattern,
  EmotionalState,
  AIEmotionalInsight,
  WellnessMetrics,
  PatternType,
  TrendPrediction
} from '@/types/emotional-wellness-schema';

interface MoodTrackingProps {
  userId: string;
  recentEntries: EmotionalEntry[];
  detectedPatterns: EmotionalPattern[];
  aiInsights: AIEmotionalInsight[];
  culturalContext: {
    emotionalExpressionStyle: string;
    moodTrackingPreferences: string[];
    culturalMoodConcepts: string[];
    timeOrientations: string[];
  };
  onNewMoodEntry?: (entry: Partial<EmotionalEntry>) => void;
  onPatternInteraction?: (patternId: string, interaction: string) => void;
}

interface MoodEntry {
  timestamp: Date;
  mood: number; // 1-10
  energy: number; // 1-10
  stress: number; // 1-10
  anxiety: number; // 1-10
  motivation: number; // 1-10
  socialConnection: number; // 1-10
  physicalHealth: number; // 1-10
  primaryEmotion: string;
  emotionTags: string[];
  context: string;
  location: string;
  weather: string;
  activities: string[];
  triggers: string[];
  copingStrategies: string[];
  notes: string;
}

interface PatternVisualization {
  patternId: string;
  type: PatternType;
  strength: number; // 0-1
  frequency: string;
  description: string;
  visualData: {
    timePoints: { date: Date; value: number }[];
    correlations: { factor: string; correlation: number }[];
    predictions: { date: Date; predictedMood: number; confidence: number }[];
  };
  actionableInsights: string[];
  interventionSuggestions: string[];
}

const MoodTrackingPatternRecognition: React.FC<MoodTrackingProps> = ({
  userId,
  recentEntries,
  detectedPatterns,
  aiInsights,
  culturalContext,
  onNewMoodEntry,
  onPatternInteraction
}) => {
  // State management
  const [activeView, setActiveView] = useState<'quick' | 'detailed' | 'patterns' | 'insights' | 'trends'>('quick');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [currentMoodEntry, setCurrentMoodEntry] = useState<MoodEntry>({
    timestamp: new Date(),
    mood: 5,
    energy: 5,
    stress: 5,
    anxiety: 5,
    motivation: 5,
    socialConnection: 5,
    physicalHealth: 5,
    primaryEmotion: '',
    emotionTags: [],
    context: '',
    location: '',
    weather: '',
    activities: [],
    triggers: [],
    copingStrategies: [],
    notes: ''
  });
  const [selectedPattern, setSelectedPattern] = useState<EmotionalPattern | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [patternVisualizations, setPatternVisualizations] = useState<PatternVisualization[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<{
    overallTrend: 'improving' | 'stable' | 'declining' | 'cyclical';
    trendStrength: number;
    keyFactors: string[];
    predictions: TrendPrediction[];
    recommendations: string[];
  } | null>(null);

  // Convert EmotionalEntry to MoodEntry format
  const convertToMoodEntry = useCallback((entry: EmotionalEntry): MoodEntry => {
    return {
      timestamp: entry.timestamp,
      mood: entry.moodAfter,
      energy: entry.energyLevel,
      stress: entry.stressLevel,
      anxiety: entry.emotionalState.emotionIntensity,
      motivation: 5, // Default if not available
      socialConnection: entry.connectionLevel,
      physicalHealth: 5, // Default if not available
      primaryEmotion: entry.emotionalState.primaryEmotion,
      emotionTags: entry.emotionalState.secondaryEmotions,
      context: entry.reflectionText.substring(0, 100),
      location: entry.location.description,
      weather: entry.seasonalInfluence.season,
      activities: [entry.activity],
      triggers: entry.triggers.map(t => t.description),
      copingStrategies: [],
      notes: entry.reflectionText
    };
  }, []);

  // Initialize mood history from recent entries
  useEffect(() => {
    const history = recentEntries.map(convertToMoodEntry);
    setMoodHistory(history);
  }, [recentEntries, convertToMoodEntry]);

  // Pattern visualization generator
  const generatePatternVisualizations = useCallback((): PatternVisualization[] => {
    return detectedPatterns.map(pattern => {
      // Generate time series data for pattern
      const timePoints = moodHistory
        .filter(entry => {
          // Filter based on pattern type
          const patternMatch = pattern.patternType === 'daily_cycle' ? 
            true : // Include all for daily patterns
            pattern.triggers.some(trigger => 
              entry.triggers.includes(trigger.description) ||
              entry.activities.includes(trigger.description)
            );
          return patternMatch;
        })
        .map(entry => ({
          date: entry.timestamp,
          value: entry.mood
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      // Generate correlations
      const correlations = [
        { factor: 'stress_level', correlation: -0.7 },
        { factor: 'energy_level', correlation: 0.6 },
        { factor: 'social_connection', correlation: 0.5 },
        { factor: 'physical_health', correlation: 0.4 }
      ];

      // Generate predictions
      const predictions = generateMoodPredictions(timePoints);

      // Generate insights
      const insights = generatePatternInsights(pattern, timePoints);

      return {
        patternId: pattern.patternId,
        type: pattern.patternType,
        strength: pattern.confidence,
        frequency: pattern.frequency,
        description: generatePatternDescription(pattern),
        visualData: {
          timePoints,
          correlations,
          predictions
        },
        actionableInsights: insights.actionable,
        interventionSuggestions: insights.interventions
      };
    });
  }, [detectedPatterns, moodHistory]);

  // Helper functions for pattern analysis
  const generateMoodPredictions = (timePoints: { date: Date; value: number }[]): 
    { date: Date; predictedMood: number; confidence: number }[] => {
    if (timePoints.length < 3) return [];

    const predictions: { date: Date; predictedMood: number; confidence: number }[] = [];
    const recentTrend = calculateTrend(timePoints.slice(-7)); // Last 7 points
    
    // Generate predictions for next 7 days
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      const lastMood = timePoints[timePoints.length - 1]?.value || 5;
      const predictedMood = Math.max(1, Math.min(10, 
        lastMood + (recentTrend * i) + (Math.random() - 0.5) * 0.5
      ));
      
      predictions.push({
        date: futureDate,
        predictedMood: Math.round(predictedMood * 10) / 10,
        confidence: Math.max(0.3, 0.8 - (i * 0.1)) // Decreasing confidence over time
      });
    }
    
    return predictions;
  };

  const calculateTrend = (points: { date: Date; value: number }[]): number => {
    if (points.length < 2) return 0;
    
    const n = points.length;
    const sumX = points.reduce((sum, _, index) => sum + index, 0);
    const sumY = points.reduce((sum, point) => sum + point.value, 0);
    const sumXY = points.reduce((sum, point, index) => sum + (index * point.value), 0);
    const sumXX = points.reduce((sum, _, index) => sum + (index * index), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  };

  const generatePatternDescription = (pattern: EmotionalPattern): string => {
    const descriptions = {
      'daily_cycle': `Daily mood pattern with ${pattern.frequency} regularity`,
      'weekly_cycle': `Weekly mood cycle showing ${pattern.frequency} patterns`,
      'stress_response': `Stress-related mood changes with ${pattern.confidence * 100}% reliability`,
      'seasonal': `Seasonal mood variations linked to environmental factors`,
      'trigger_response': `Mood responses to specific triggers or events`,
      'recovery': `Recovery patterns showing resilience and adaptation`,
      'social': `Social context mood variations`,
      'activity': `Activity-related mood correlations`
    };
    
    return descriptions[pattern.patternType as keyof typeof descriptions] || 
           `${pattern.patternType} pattern detected`;
  };

  const generatePatternInsights = (pattern: EmotionalPattern, timePoints: { date: Date; value: number }[]): 
    { actionable: string[]; interventions: string[] } => {
    
    const insights = {
      actionable: [] as string[],
      interventions: [] as string[]
    };

    // Generate insights based on pattern type
    switch (pattern.patternType) {
      case 'daily_cycle':
        insights.actionable.push(
          'Your mood follows a daily pattern - track energy levels to optimize scheduling',
          'Consider planning important activities during your natural mood peaks'
        );
        insights.interventions.push(
          'Morning light exposure for mood regulation',
          'Evening wind-down routine for better sleep'
        );
        break;
        
      case 'stress_response':
        insights.actionable.push(
          'Stress significantly impacts your mood - early stress management is key',
          'Recovery time varies - build in buffer time after stressful events'
        );
        insights.interventions.push(
          'Preventive stress management techniques',
          'Quick stress-relief practices for high-stress periods'
        );
        break;
        
      case 'social':
        insights.actionable.push(
          'Social connections strongly influence your emotional well-being',
          'Quality of social interactions matters more than quantity'
        );
        insights.interventions.push(
          'Schedule regular meaningful social connections',
          'Practice boundary setting in draining relationships'
        );
        break;
        
      default:
        insights.actionable.push(
          'This pattern provides insight into your emotional rhythms',
          'Awareness of this pattern can help with planning and self-care'
        );
        insights.interventions.push(
          'Personalized strategies based on pattern recognition',
          'Mindful attention to pattern triggers and responses'
        );
    }

    return insights;
  };

  // Generate mood statistics
  const moodStatistics = useMemo(() => {
    if (moodHistory.length === 0) return null;

    const timeRangeData = moodHistory.filter(entry => {
      const cutoffDate = new Date();
      switch (timeRange) {
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(cutoffDate.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
          break;
      }
      return entry.timestamp >= cutoffDate;
    });

    const avgMood = timeRangeData.reduce((sum, entry) => sum + entry.mood, 0) / timeRangeData.length;
    const avgEnergy = timeRangeData.reduce((sum, entry) => sum + entry.energy, 0) / timeRangeData.length;
    const avgStress = timeRangeData.reduce((sum, entry) => sum + entry.stress, 0) / timeRangeData.length;
    
    const moodVariability = calculateVariability(timeRangeData.map(e => e.mood));
    const trend = calculateTrend(timeRangeData.map((entry, index) => ({ date: entry.timestamp, value: entry.mood })));
    
    const mostCommonEmotions = getMostCommon(timeRangeData.flatMap(e => [e.primaryEmotion, ...e.emotionTags]));
    const mostCommonTriggers = getMostCommon(timeRangeData.flatMap(e => e.triggers));
    const mostEffectiveCoping = getMostCommon(timeRangeData.flatMap(e => e.copingStrategies));

    return {
      averages: {
        mood: Math.round(avgMood * 10) / 10,
        energy: Math.round(avgEnergy * 10) / 10,
        stress: Math.round(avgStress * 10) / 10
      },
      variability: Math.round(moodVariability * 10) / 10,
      trend: Math.round(trend * 100) / 100,
      trendDirection: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
      entryCount: timeRangeData.length,
      insights: {
        mostCommonEmotions: mostCommonEmotions.slice(0, 3),
        mostCommonTriggers: mostCommonTriggers.slice(0, 3),
        mostEffectiveCoping: mostEffectiveCoping.slice(0, 3)
      }
    };
  }, [moodHistory, timeRange]);

  // Helper functions
  const calculateVariability = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const getMostCommon = (items: string[]): string[] => {
    const counts = items.reduce((acc, item) => {
      if (item) acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .map(([item]) => item);
  };

  // Submit mood entry
  const submitMoodEntry = useCallback(() => {
    const newEntry: Partial<EmotionalEntry> = {
      userId,
      timestamp: currentMoodEntry.timestamp,
      moodBefore: 5, // Default
      moodAfter: currentMoodEntry.mood,
      activity: currentMoodEntry.activities[0] || 'mood_tracking',
      reflectionText: currentMoodEntry.notes,
      aiInsight: '', // Will be generated by AI
      emotionalState: {
        primaryEmotion: currentMoodEntry.primaryEmotion as any,
        secondaryEmotions: currentMoodEntry.emotionTags as any[],
        emotionIntensity: currentMoodEntry.anxiety,
        emotionClarity: 8, // Assume good clarity from detailed tracking
        emotionAcceptance: 7, // Default
        conflictingEmotions: [],
        emotionalNuance: [],
        culturalEmotionalExpression: [],
        bodyAwareness: {
          overallBodyAwareness: 5,
          tensionAreas: [],
          comfortAreas: [],
          energyDistribution: 'balanced',
          physicalSymptoms: [],
          somaticMarkers: []
        },
        breathAwareness: {
          breathDepth: 'normal',
          breathRhythm: 'regular',
          breathQuality: 'easy',
          breathTension: 'relaxed',
          breathAwareness: 5
        },
        tensionAreas: [],
        energeticState: {
          overall: currentMoodEntry.energy,
          physical: currentMoodEntry.physicalHealth,
          emotional: currentMoodEntry.mood,
          mental: 5, // Default
          spiritual: 5 // Default
        },
        mentalClarity: 7, // Default
        cognitiveLoad: 10 - currentMoodEntry.stress, // Inverse of stress
        mindfulnessLevel: 6, // Default
        presentMomentAwareness: 6, // Default
        connectionToSelf: currentMoodEntry.mood,
        connectionToOthers: currentMoodEntry.socialConnection,
        connectionToNature: 5, // Default
        connectionToPurpose: currentMoodEntry.motivation,
        connectionToAncestors: 5 // Default
      },
      stressLevel: currentMoodEntry.stress,
      energyLevel: currentMoodEntry.energy,
      clarityLevel: 7, // Default
      connectionLevel: currentMoodEntry.socialConnection,
      resilienceGrowth: 0.1 // Small growth from tracking
    };

    // Add to mood history
    setMoodHistory(prev => [...prev, currentMoodEntry]);
    
    // Reset form
    setCurrentMoodEntry({
      timestamp: new Date(),
      mood: 5,
      energy: 5,
      stress: 5,
      anxiety: 5,
      motivation: 5,
      socialConnection: 5,
      physicalHealth: 5,
      primaryEmotion: '',
      emotionTags: [],
      context: '',
      location: '',
      weather: '',
      activities: [],
      triggers: [],
      copingStrategies: [],
      notes: ''
    });

    onNewMoodEntry?.(newEntry);
  }, [currentMoodEntry, userId, onNewMoodEntry]);

  // Generate pattern visualizations
  useEffect(() => {
    setPatternVisualizations(generatePatternVisualizations());
  }, [generatePatternVisualizations]);

  // Emotional options for selection
  const emotionOptions = [
    'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust', 'love', 'shame', 
    'guilt', 'pride', 'envy', 'gratitude', 'hope', 'despair', 'peace', 'anxiety', 
    'excitement', 'boredom', 'curiosity', 'compassion', 'frustration', 'contentment'
  ];

  const activityOptions = [
    'work', 'exercise', 'socializing', 'relaxing', 'creative', 'learning', 
    'meditation', 'nature', 'family_time', 'self_care', 'commuting', 'eating', 
    'sleeping', 'entertainment', 'volunteering', 'spiritual_practice'
  ];

  const triggerOptions = [
    'work_stress', 'relationship_conflict', 'health_concern', 'financial_worry', 
    'family_issue', 'social_pressure', 'life_change', 'weather', 'hormonal', 
    'sleep_quality', 'diet', 'exercise_lack', 'overstimulation', 'isolation'
  ];

  const copingOptions = [
    'deep_breathing', 'meditation', 'exercise', 'talking_to_friend', 'journaling', 
    'music', 'nature_walk', 'creative_activity', 'professional_help', 'prayer', 
    'cultural_practice', 'community_support', 'self_compassion', 'boundary_setting'
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          Mood Tracking & Pattern Recognition
        </h2>
        <p className="text-gray-600">
          Track your emotional journey and discover meaningful patterns
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        {['quick', 'detailed', 'patterns', 'insights', 'trends'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeView === view
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {view === 'quick' && 'Quick Check-in'}
            {view === 'detailed' && 'Detailed Entry'}
            {view === 'patterns' && 'Pattern Analysis'}
            {view === 'insights' && 'AI Insights'}
            {view === 'trends' && 'Trends & Predictions'}
          </button>
        ))}
      </div>

      {/* Quick Check-in */}
      {activeView === 'quick' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              How are you feeling right now?
            </h3>
          </div>

          {/* Mood Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Mood */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Mood (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMoodEntry.mood}
                  onChange={(e) => setCurrentMoodEntry(prev => ({
                    ...prev,
                    mood: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span className="font-medium">{currentMoodEntry.mood}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMoodEntry.energy}
                  onChange={(e) => setCurrentMoodEntry(prev => ({
                    ...prev,
                    energy: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gradient-to-r from-gray-400 via-blue-400 to-yellow-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Tired</span>
                  <span className="font-medium">{currentMoodEntry.energy}</span>
                  <span>Energized</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMoodEntry.stress}
                  onChange={(e) => setCurrentMoodEntry(prev => ({
                    ...prev,
                    stress: parseInt(e.target.value)
                  }))}
                  className="w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Calm</span>
                  <span className="font-medium">{currentMoodEntry.stress}</span>
                  <span>Stressed</span>
                </div>
              </div>
            </div>

            {/* Emotion Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Emotion
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {emotionOptions.slice(0, 12).map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => setCurrentMoodEntry(prev => ({
                      ...prev,
                      primaryEmotion: emotion
                    }))}
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      currentMoodEntry.primaryEmotion === emotion
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Notes (optional)
                </label>
                <textarea
                  value={currentMoodEntry.notes}
                  onChange={(e) => setCurrentMoodEntry(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="What's happening? How are you feeling?"
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={submitMoodEntry}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Mood Entry
            </button>
          </div>
        </div>
      )}

      {/* Detailed Entry */}
      {activeView === 'detailed' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Detailed Mood Entry</h3>
          
          {/* Extended Mood Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'mood', label: 'Overall Mood', value: currentMoodEntry.mood },
              { key: 'energy', label: 'Energy', value: currentMoodEntry.energy },
              { key: 'stress', label: 'Stress', value: currentMoodEntry.stress },
              { key: 'anxiety', label: 'Anxiety', value: currentMoodEntry.anxiety },
              { key: 'motivation', label: 'Motivation', value: currentMoodEntry.motivation },
              { key: 'socialConnection', label: 'Social Connection', value: currentMoodEntry.socialConnection }
            ].map(({ key, label, value }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} (1-10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={value}
                  onChange={(e) => setCurrentMoodEntry(prev => ({
                    ...prev,
                    [key]: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
                <div className="text-center text-sm font-medium text-gray-600 mt-1">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Context Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recent Activities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {activityOptions.map((activity) => (
                  <button
                    key={activity}
                    onClick={() => setCurrentMoodEntry(prev => ({
                      ...prev,
                      activities: prev.activities.includes(activity)
                        ? prev.activities.filter(a => a !== activity)
                        : [...prev.activities, activity]
                    }))}
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      currentMoodEntry.activities.includes(activity)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {activity.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potential Triggers
              </label>
              <div className="grid grid-cols-2 gap-2">
                {triggerOptions.map((trigger) => (
                  <button
                    key={trigger}
                    onClick={() => setCurrentMoodEntry(prev => ({
                      ...prev,
                      triggers: prev.triggers.includes(trigger)
                        ? prev.triggers.filter(t => t !== trigger)
                        : [...prev.triggers, trigger]
                    }))}
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      currentMoodEntry.triggers.includes(trigger)
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {trigger.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coping Strategies Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coping Strategies Used
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {copingOptions.map((coping) => (
                <button
                  key={coping}
                  onClick={() => setCurrentMoodEntry(prev => ({
                    ...prev,
                    copingStrategies: prev.copingStrategies.includes(coping)
                      ? prev.copingStrategies.filter(c => c !== coping)
                      : [...prev.copingStrategies, coping]
                  }))}
                  className={`px-3 py-2 text-sm rounded border transition-colors ${
                    currentMoodEntry.copingStrategies.includes(coping)
                      ? 'bg-purple-100 border-purple-300 text-purple-800'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {coping.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={submitMoodEntry}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Detailed Entry
            </button>
          </div>
        </div>
      )}

      {/* Pattern Analysis */}
      {activeView === 'patterns' && (
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Pattern Analysis</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Mood Statistics */}
          {moodStatistics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Average Mood</h4>
                <div className="text-2xl font-medium text-blue-900">{moodStatistics.averages.mood}</div>
                <div className="text-sm text-blue-700">
                  Trend: {moodStatistics.trendDirection}
                  {moodStatistics.trend !== 0 && (
                    <span className={moodStatistics.trend > 0 ? 'text-green-600' : 'text-red-600'}>
                      {moodStatistics.trend > 0 ? ' ↗' : ' ↘'}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Energy Level</h4>
                <div className="text-2xl font-medium text-green-900">{moodStatistics.averages.energy}</div>
                <div className="text-sm text-green-700">Variability: {moodStatistics.variability}</div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Stress Level</h4>
                <div className="text-2xl font-medium text-yellow-900">{moodStatistics.averages.stress}</div>
                <div className="text-sm text-yellow-700">{moodStatistics.entryCount} entries</div>
              </div>
            </div>
          )}

          {/* Detected Patterns */}
          <div>
            <h4 className="font-medium text-gray-800 mb-4">Detected Patterns</h4>
            <div className="space-y-4">
              {patternVisualizations.map((pattern) => (
                <div 
                  key={pattern.patternId}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedPattern(detectedPatterns.find(p => p.patternId === pattern.patternId) || null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-800">{pattern.description}</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{pattern.frequency}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${pattern.strength * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Pattern Insights */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Key Insights:</span>
                      <ul className="text-sm text-gray-600 ml-4">
                        {pattern.actionableInsights.slice(0, 2).map((insight, index) => (
                          <li key={index} className="list-disc">{insight}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">Suggestions:</span>
                      <ul className="text-sm text-gray-600 ml-4">
                        {pattern.interventionSuggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="list-disc">{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Interaction Button */}
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPatternInteraction?.(pattern.patternId, 'explore');
                      }}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      Explore Pattern
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Insights */}
          {moodStatistics?.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2">Common Emotions</h5>
                <div className="space-y-1">
                  {moodStatistics.insights.mostCommonEmotions.map((emotion, index) => (
                    <div key={emotion} className="text-sm text-purple-700">
                      {index + 1}. {emotion}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">Common Triggers</h5>
                <div className="space-y-1">
                  {moodStatistics.insights.mostCommonTriggers.map((trigger, index) => (
                    <div key={trigger} className="text-sm text-red-700">
                      {index + 1}. {trigger.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Effective Coping</h5>
                <div className="space-y-1">
                  {moodStatistics.insights.mostEffectiveCoping.map((coping, index) => (
                    <div key={coping} className="text-sm text-green-700">
                      {index + 1}. {coping.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      {activeView === 'insights' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">AI-Generated Insights</h3>
          
          {aiInsights.length > 0 ? (
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div key={insight.insightId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-800">
                      {insight.insightType.replace('_', ' ')}
                    </h4>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{insight.insight}</p>
                  
                  {insight.immediateRecommendations.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-700 mb-2">Immediate Actions:</h5>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        {insight.immediateRecommendations.map((rec, index) => (
                          <li key={index}>{rec.recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {insight.longTermRecommendations.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Long-term Strategies:</h5>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        {insight.longTermRecommendations.map((rec, index) => (
                          <li key={index}>{rec.recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>AI insights will appear as you track more mood entries.</p>
              <p className="text-sm mt-2">Complete a few mood entries to see personalized insights.</p>
            </div>
          )}
        </div>
      )}

      {/* Trends & Predictions */}
      {activeView === 'trends' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800">Trends & Predictions</h3>
          
          {/* Future Feature Placeholder */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-center">
            <h4 className="font-medium text-gray-800 mb-4">Predictive Analytics Coming Soon</h4>
            <p className="text-gray-600 mb-4">
              Advanced trend analysis and mood predictions based on your personal patterns, 
              seasonal factors, and life events.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div>• 7-day mood forecasts</div>
              <div>• Stress level predictions</div>
              <div>• Optimal timing suggestions</div>
              <div>• Seasonal pattern analysis</div>
              <div>• Life event impact modeling</div>
              <div>• Personalized intervention timing</div>
            </div>
          </div>

          {/* Current Trends Preview */}
          {moodStatistics && (
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Current Trend Summary</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Overall Direction:</strong> 
                  <span className={`ml-2 ${
                    moodStatistics.trendDirection === 'improving' ? 'text-green-600' :
                    moodStatistics.trendDirection === 'declining' ? 'text-red-600' :
                    'text-blue-600'
                  }`}>
                    {moodStatistics.trendDirection}
                    {moodStatistics.trend > 0 ? ' ↗' : moodStatistics.trend < 0 ? ' ↘' : ' →'}
                  </span>
                </p>
                <p><strong>Variability:</strong> {moodStatistics.variability} (lower is more stable)</p>
                <p><strong>Data Points:</strong> {moodStatistics.entryCount} entries in {timeRange}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTrackingPatternRecognition;