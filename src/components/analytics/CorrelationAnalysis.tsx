'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Heart, Sun, Moon, Coffee, Book, Users, Home } from 'lucide-react';

interface MoodDataPoint {
  date: string;
  mood: number;
  emotions: string[];
  activities: string[];
  journalLength: number;
  vocabularyScore: number;
}

interface CorrelationAnalysisProps {
  moodData: MoodDataPoint[];
  timeframe: 'week' | 'month' | 'quarter' | 'year';
}

interface ActivityCorrelation {
  activity: string;
  correlation: number;
  frequency: number;
  averageMoodWhenPresent: number;
  averageMoodWhenAbsent: number;
  significance: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  insight: string;
}

interface EmotionCorrelation {
  emotion: string;
  moodCorrelation: number;
  timeOfDayPattern: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  frequency: number;
  insight: string;
}

const ActivityIcon: React.FC<{ activity: string }> = ({ activity }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'exercise': <Activity className="w-5 h-5" />,
    'meditation': <Heart className="w-5 h-5" />,
    'social': <Users className="w-5 h-5" />,
    'work': <Coffee className="w-5 h-5" />,
    'reading': <Book className="w-5 h-5" />,
    'sleep': <Moon className="w-5 h-5" />,
    'outdoors': <Sun className="w-5 h-5" />,
    'home': <Home className="w-5 h-5" />
  };
  
  return iconMap[activity.toLowerCase()] || <Activity className="w-5 h-5" />;
};

const CorrelationStrength: React.FC<{ value: number }> = ({ value }) => {
  const absValue = Math.abs(value);
  const isPositive = value > 0;
  
  const getStrengthLabel = () => {
    if (absValue >= 0.7) return 'Strong';
    if (absValue >= 0.4) return 'Moderate';
    if (absValue >= 0.2) return 'Weak';
    return 'Minimal';
  };

  const getColor = () => {
    if (isPositive) {
      return absValue >= 0.4 ? 'text-green-600' : 'text-green-500';
    } else {
      return absValue >= 0.4 ? 'text-red-600' : 'text-red-500';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isPositive ? (
        <TrendingUp className={`w-4 h-4 ${getColor()}`} />
      ) : (
        <TrendingDown className={`w-4 h-4 ${getColor()}`} />
      )}
      <span className={`text-sm font-medium ${getColor()}`}>
        {getStrengthLabel()} {isPositive ? 'Positive' : 'Negative'}
      </span>
      <span className="text-xs text-sage-500">
        ({(value * 100).toFixed(0)}%)
      </span>
    </div>
  );
};

const ActivityCorrelationCard: React.FC<{ correlation: ActivityCorrelation }> = ({ correlation }) => {
  const impactScore = Math.abs(correlation.correlation) * correlation.frequency / 100;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sage-100 rounded-lg">
            <ActivityIcon activity={correlation.activity} />
          </div>
          <div>
            <h4 className="font-medium text-sage-800 capitalize">
              {correlation.activity.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="text-sm text-sage-500">
              {correlation.frequency}% of days
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium text-sage-800">
            {correlation.averageMoodWhenPresent.toFixed(1)}
          </div>
          <div className="text-xs text-sage-500">avg mood</div>
        </div>
      </div>
      
      <CorrelationStrength value={correlation.correlation} />
      
      <div className="mt-3 p-3 bg-sage-50 rounded-lg">
        <p className="text-sm text-sage-700">
          {correlation.insight}
        </p>
      </div>
      
      {correlation.significance === 'high' && (
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          <span className="text-xs text-amber-600 font-medium">
            Significant pattern detected
          </span>
        </div>
      )}
    </Card>
  );
};

const EmotionPatternCard: React.FC<{ emotion: EmotionCorrelation }> = ({ emotion }) => {
  const timeData = [
    { label: 'Morning', value: emotion.timeOfDayPattern.morning, color: 'bg-yellow-200' },
    { label: 'Afternoon', value: emotion.timeOfDayPattern.afternoon, color: 'bg-orange-200' },
    { label: 'Evening', value: emotion.timeOfDayPattern.evening, color: 'bg-purple-200' }
  ];
  
  const maxValue = Math.max(...Object.values(emotion.timeOfDayPattern));
  
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-sage-800 capitalize">
            {emotion.emotion}
          </h4>
          <div className="text-sm text-sage-500">
            Appears {emotion.frequency}% of the time
          </div>
        </div>
        <CorrelationStrength value={emotion.moodCorrelation} />
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="text-xs font-medium text-sage-600 mb-1">Time of Day Patterns</div>
        {timeData.map((time, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-sage-600">{time.label}</div>
            <div className="flex-1 bg-sage-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${time.color}`}
                style={{ width: `${(time.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-sage-500 w-8">
              {time.value.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-eucalyptus-50 rounded-lg">
        <p className="text-sm text-sage-700">
          {emotion.insight}
        </p>
      </div>
    </Card>
  );
};

export const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  moodData,
  timeframe
}) => {
  const [activeView, setActiveView] = useState<'activities' | 'emotions' | 'insights'>('activities');

  const activityCorrelations = useMemo(() => {
    const activityMap = new Map<string, { moods: number[], totalDays: number, presentDays: number }>();
    
    // Initialize activity tracking
    moodData.forEach(day => {
      day.activities.forEach(activity => {
        if (!activityMap.has(activity)) {
          activityMap.set(activity, { moods: [], totalDays: 0, presentDays: 0 });
        }
      });
    });

    // Collect mood data for each activity
    moodData.forEach(day => {
      const dayActivities = new Set(day.activities);
      
      activityMap.forEach((data, activity) => {
        data.totalDays++;
        if (dayActivities.has(activity)) {
          data.moods.push(day.mood);
          data.presentDays++;
        }
      });
    });

    // Calculate correlations and insights
    const correlations: ActivityCorrelation[] = [];
    
    activityMap.forEach((data, activity) => {
      if (data.presentDays < 3) return; // Skip activities with insufficient data
      
      const frequency = (data.presentDays / data.totalDays) * 100;
      const averageMoodWhenPresent = data.moods.reduce((sum, mood) => sum + mood, 0) / data.moods.length;
      
      // Calculate mood when activity is absent
      const moodsWhenAbsent = moodData
        .filter(day => !day.activities.includes(activity))
        .map(day => day.mood);
      const averageMoodWhenAbsent = moodsWhenAbsent.length > 0 ? 
        moodsWhenAbsent.reduce((sum, mood) => sum + mood, 0) / moodsWhenAbsent.length : 0;
      
      const correlation = (averageMoodWhenPresent - averageMoodWhenAbsent) / 10; // Normalize to -1 to 1 scale
      
      let significance: 'high' | 'medium' | 'low' = 'low';
      if (Math.abs(correlation) >= 0.4 && frequency >= 20) significance = 'high';
      else if (Math.abs(correlation) >= 0.2 && frequency >= 10) significance = 'medium';
      
      let insight = '';
      if (correlation > 0.3) {
        insight = `${activity} appears to have a strong positive impact on your mood. Consider incorporating this more regularly.`;
      } else if (correlation < -0.3) {
        insight = `${activity} may be associated with lower mood states. This could indicate stress or the need for better boundaries.`;
      } else if (correlation > 0.1) {
        insight = `${activity} shows a gentle positive association with your wellbeing.`;
      } else {
        insight = `${activity} shows a neutral relationship with your mood patterns.`;
      }

      correlations.push({
        activity,
        correlation,
        frequency,
        averageMoodWhenPresent,
        averageMoodWhenAbsent,
        significance,
        icon: <ActivityIcon activity={activity} />,
        insight
      });
    });

    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [moodData]);

  const emotionCorrelations = useMemo(() => {
    const emotionMap = new Map<string, { moods: number[], times: Date[], frequency: number }>();
    
    moodData.forEach(day => {
      const dayDate = new Date(day.date);
      day.emotions.forEach(emotion => {
        if (!emotionMap.has(emotion)) {
          emotionMap.set(emotion, { moods: [], times: [], frequency: 0 });
        }
        const data = emotionMap.get(emotion)!;
        data.moods.push(day.mood);
        data.times.push(dayDate);
        data.frequency++;
      });
    });

    const correlations: EmotionCorrelation[] = [];
    
    emotionMap.forEach((data, emotion) => {
      if (data.frequency < 2) return;
      
      const averageMood = data.moods.reduce((sum, mood) => sum + mood, 0) / data.moods.length;
      const overallAverageMood = moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length;
      const moodCorrelation = (averageMood - overallAverageMood) / 10;
      
      // Time of day patterns (simplified - would need actual time data)
      const timeOfDayPattern = {
        morning: Math.random() * 5 + 2, // Placeholder - would analyze actual timestamps
        afternoon: Math.random() * 5 + 2,
        evening: Math.random() * 5 + 2
      };
      
      const frequency = (data.frequency / moodData.length) * 100;
      
      let insight = '';
      if (moodCorrelation > 0.2) {
        insight = `${emotion} is associated with higher mood states, suggesting healthy emotional processing.`;
      } else if (moodCorrelation < -0.2) {
        insight = `${emotion} appears during more challenging times. This awareness can guide self-care strategies.`;
      } else {
        insight = `${emotion} appears across various mood states, indicating balanced emotional awareness.`;
      }

      correlations.push({
        emotion,
        moodCorrelation,
        timeOfDayPattern,
        frequency,
        insight
      });
    });

    return correlations.sort((a, b) => Math.abs(b.moodCorrelation) - Math.abs(a.moodCorrelation));
  }, [moodData]);

  const keyInsights = useMemo(() => {
    const insights = [];
    
    const strongPositiveActivities = activityCorrelations.filter(a => a.correlation > 0.3);
    const strongNegativeActivities = activityCorrelations.filter(a => a.correlation < -0.3);
    const highFrequencyActivities = activityCorrelations.filter(a => a.frequency > 50);
    
    if (strongPositiveActivities.length > 0) {
      insights.push({
        type: 'positive',
        title: 'Mood Boosters Identified',
        description: `${strongPositiveActivities[0].activity} shows the strongest positive correlation with your wellbeing.`,
        recommendation: 'Consider prioritizing these activities when you need emotional support.'
      });
    }
    
    if (strongNegativeActivities.length > 0) {
      insights.push({
        type: 'caution',
        title: 'Stress Pattern Detected',
        description: `${strongNegativeActivities[0].activity} appears to correlate with more challenging emotional states.`,
        recommendation: 'Explore ways to approach this activity with more support or boundaries.'
      });
    }
    
    if (highFrequencyActivities.length > 0) {
      const avgCorrelation = highFrequencyActivities.reduce((sum, a) => sum + a.correlation, 0) / highFrequencyActivities.length;
      if (avgCorrelation > 0.1) {
        insights.push({
          type: 'pattern',
          title: 'Positive Daily Routines',
          description: 'Your most frequent activities show positive associations with mood.',
          recommendation: 'Your daily patterns are supporting your emotional wellbeing.'
        });
      }
    }
    
    return insights;
  }, [activityCorrelations]);

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card className="p-4">
        <div className="flex space-x-1 bg-sage-50 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('activities')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'activities' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            Activity Patterns
          </button>
          <button
            onClick={() => setActiveView('emotions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'emotions' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            Emotional Patterns
          </button>
          <button
            onClick={() => setActiveView('insights')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === 'insights' 
                ? 'bg-white text-sage-800 shadow-sm' 
                : 'text-sage-600 hover:text-sage-800'
            }`}
          >
            Key Insights
          </button>
        </div>
      </Card>

      {/* Activity Correlations */}
      {activeView === 'activities' && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium text-sage-800 mb-2">
              Activity-Mood Connections
            </h3>
            <p className="text-sage-600 text-sm">
              Understanding which activities support or challenge your emotional wellbeing.
            </p>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            {activityCorrelations.slice(0, 8).map((correlation, index) => (
              <ActivityCorrelationCard key={index} correlation={correlation} />
            ))}
          </div>
        </div>
      )}

      {/* Emotion Patterns */}
      {activeView === 'emotions' && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium text-sage-800 mb-2">
              Emotional Landscape Patterns
            </h3>
            <p className="text-sage-600 text-sm">
              How different emotions appear in your life and their relationship to your overall wellbeing.
            </p>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            {emotionCorrelations.slice(0, 6).map((emotion, index) => (
              <EmotionPatternCard key={index} emotion={emotion} />
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      {activeView === 'insights' && (
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-medium text-sage-800 mb-2">
              Personalized Insights
            </h3>
            <p className="text-sage-600 text-sm">
              Key patterns and recommendations based on your unique emotional journey.
            </p>
          </Card>
          
          <div className="space-y-4">
            {keyInsights.map((insight, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    insight.type === 'positive' ? 'bg-green-100' :
                    insight.type === 'caution' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {insight.type === 'positive' ? <TrendingUp className="w-6 h-6 text-green-600" /> :
                     insight.type === 'caution' ? <TrendingDown className="w-6 h-6 text-amber-600" /> :
                     <Activity className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sage-800 mb-2">{insight.title}</h4>
                    <p className="text-sage-700 mb-3">{insight.description}</p>
                    <div className="bg-sage-50 rounded-lg p-3">
                      <p className="text-sm text-sage-600 font-medium">Recommendation:</p>
                      <p className="text-sm text-sage-700">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};