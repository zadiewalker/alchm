'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { useMobileOptimization } from '../MobileOptimizationProvider';
import { useAnalytics } from '@/lib/analytics';

interface MoodEntry {
  date: string;
  mood: 'very-low' | 'low' | 'neutral' | 'good' | 'excellent';
  energy: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  stress: 'none' | 'low' | 'moderate' | 'high' | 'overwhelming';
  sleep: 'poor' | 'fair' | 'good' | 'excellent';
}

interface WellnessMetrics {
  moodStability: number; // 0-100
  energyConsistency: number; // 0-100
  stressManagement: number; // 0-100
  sleepQuality: number; // 0-100
  overallWellness: number; // 0-100
  growthTrend: 'improving' | 'stable' | 'declining';
  streakDays: number;
  totalEntries: number;
}

interface ResearchMetrics {
  phq9Equivalent: number; // Depression screening equivalent
  gad7Equivalent: number; // Anxiety screening equivalent  
  pcl5Equivalent: number; // PTSD screening equivalent
  resilienceScore: number; // Connor-Davidson Resilience Scale equivalent
  meaningInLifeScore: number; // Meaning in Life Questionnaire equivalent
  socialConnectionScore: number; // Social connectedness scale equivalent
}

const DEMO_MOOD_DATA: MoodEntry[] = [
  { date: '2024-01-01', mood: 'low', energy: 'low', stress: 'high', sleep: 'poor' },
  { date: '2024-01-02', mood: 'neutral', energy: 'moderate', stress: 'moderate', sleep: 'fair' },
  { date: '2024-01-03', mood: 'good', energy: 'moderate', stress: 'low', sleep: 'good' },
  { date: '2024-01-04', mood: 'good', energy: 'high', stress: 'low', sleep: 'good' },
  { date: '2024-01-05', mood: 'excellent', energy: 'high', stress: 'none', sleep: 'excellent' },
  { date: '2024-01-06', mood: 'good', energy: 'moderate', stress: 'low', sleep: 'good' },
  { date: '2024-01-07', mood: 'neutral', energy: 'moderate', stress: 'moderate', sleep: 'fair' },
];

export default function WellnessAnalytics() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [moodData] = useState<MoodEntry[]>(DEMO_MOOD_DATA);
  const [selectedMetric, setSelectedMetric] = useState<'mood' | 'energy' | 'stress' | 'sleep'>('mood');
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Mobile optimization context
  const { 
    isCrisisMode, 
    isOffline, 
    deviceTier, 
    isLowBattery,
    enableCrisisMode 
  } = useMobileOptimization();
  
  // Analytics tracking
  const { trackUser, trackNavigation } = useAnalytics();
  
  // Track page view
  useEffect(() => {
    trackNavigation.pageView('/analytics', document.referrer);
  }, [trackNavigation]);

  // Calculate wellness metrics
  const calculateWellnessMetrics = (): WellnessMetrics => {
    if (moodData.length === 0) {
      return {
        moodStability: 0,
        energyConsistency: 0,
        stressManagement: 0,
        sleepQuality: 0,
        overallWellness: 0,
        growthTrend: 'stable',
        streakDays: 0,
        totalEntries: 0
      };
    }

    // Convert categorical data to numerical scores
    const moodScores = moodData.map(entry => {
      const moodMap = { 'very-low': 1, 'low': 2, 'neutral': 3, 'good': 4, 'excellent': 5 };
      const energyMap = { 'very-low': 1, 'low': 2, 'moderate': 3, 'high': 4, 'very-high': 5 };
      const stressMap = { 'overwhelming': 1, 'high': 2, 'moderate': 3, 'low': 4, 'none': 5 };
      const sleepMap = { 'poor': 1, 'fair': 2, 'good': 4, 'excellent': 5 };

      return {
        mood: moodMap[entry.mood],
        energy: energyMap[entry.energy],
        stress: stressMap[entry.stress],
        sleep: sleepMap[entry.sleep]
      };
    });

    // Calculate averages and stability
    const avgMood = moodScores.reduce((sum, entry) => sum + entry.mood, 0) / moodScores.length;
    const avgEnergy = moodScores.reduce((sum, entry) => sum + entry.energy, 0) / moodScores.length;
    const avgStress = moodScores.reduce((sum, entry) => sum + entry.stress, 0) / moodScores.length;
    const avgSleep = moodScores.reduce((sum, entry) => sum + entry.sleep, 0) / moodScores.length;

    // Calculate stability (inverse of variance)
    const moodVariance = moodScores.reduce((sum, entry) => sum + Math.pow(entry.mood - avgMood, 2), 0) / moodScores.length;
    const moodStability = Math.max(0, 100 - (moodVariance * 20));

    // Calculate growth trend
    const firstHalf = moodScores.slice(0, Math.floor(moodScores.length / 2));
    const secondHalf = moodScores.slice(Math.floor(moodScores.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
    
    let growthTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (secondHalfAvg - firstHalfAvg > 0.3) growthTrend = 'improving';
    else if (firstHalfAvg - secondHalfAvg > 0.3) growthTrend = 'declining';

    return {
      moodStability: Math.round(moodStability),
      energyConsistency: Math.round((avgEnergy / 5) * 100),
      stressManagement: Math.round((avgStress / 5) * 100),
      sleepQuality: Math.round((avgSleep / 5) * 100),
      overallWellness: Math.round(((avgMood + avgEnergy + avgStress + avgSleep) / 20) * 100),
      growthTrend,
      streakDays: moodData.length,
      totalEntries: moodData.length
    };
  };

  // Calculate research-grade metrics
  const calculateResearchMetrics = (): ResearchMetrics => {
    if (moodData.length === 0) {
      return {
        phq9Equivalent: 0,
        gad7Equivalent: 0,
        pcl5Equivalent: 0,
        resilienceScore: 50,
        meaningInLifeScore: 50,
        socialConnectionScore: 50
      };
    }

    const scores = moodData.map(entry => {
      const moodMap = { 'very-low': 1, 'low': 2, 'neutral': 3, 'good': 4, 'excellent': 5 };
      const stressMap = { 'overwhelming': 5, 'high': 4, 'moderate': 3, 'low': 2, 'none': 1 };
      const sleepMap = { 'poor': 1, 'fair': 2, 'good': 4, 'excellent': 5 };
      const energyMap = { 'very-low': 1, 'low': 2, 'moderate': 3, 'high': 4, 'very-high': 5 };

      return {
        mood: moodMap[entry.mood],
        stress: stressMap[entry.stress],
        sleep: sleepMap[entry.sleep],
        energy: energyMap[entry.energy]
      };
    });

    const avgMood = scores.reduce((sum, s) => sum + s.mood, 0) / scores.length;
    const avgStress = scores.reduce((sum, s) => sum + s.stress, 0) / scores.length;
    const avgSleep = scores.reduce((sum, s) => sum + s.sleep, 0) / scores.length;
    const avgEnergy = scores.reduce((sum, s) => sum + s.energy, 0) / scores.length;

    // Convert to research scale equivalents (approximate)
    const phq9Equivalent = Math.max(0, Math.min(27, Math.round((5 - avgMood) * 5.4))); // 0-27 scale
    const gad7Equivalent = Math.max(0, Math.min(21, Math.round((avgStress - 1) * 5.25))); // 0-21 scale
    const pcl5Equivalent = Math.max(0, Math.min(80, Math.round((avgStress + (5 - avgSleep)) * 8))); // 0-80 scale
    const resilienceScore = Math.max(0, Math.min(100, Math.round((avgMood + avgEnergy) * 10))); // 0-100 scale
    const meaningInLifeScore = Math.max(0, Math.min(100, Math.round(avgMood * 20))); // 0-100 scale
    const socialConnectionScore = Math.max(0, Math.min(100, Math.round((avgMood + (5 - avgStress)) * 10))); // 0-100 scale

    return {
      phq9Equivalent,
      gad7Equivalent,
      pcl5Equivalent,
      resilienceScore,
      meaningInLifeScore,
      socialConnectionScore
    };
  };

  const wellnessMetrics = calculateWellnessMetrics();
  const researchMetrics = calculateResearchMetrics();

  const getMetricData = () => {
    const metricMap = {
      mood: moodData.map(entry => {
        const moodValues = { 'very-low': 1, 'low': 2, 'neutral': 3, 'good': 4, 'excellent': 5 };
        return { date: entry.date, value: moodValues[entry.mood] };
      }),
      energy: moodData.map(entry => {
        const energyValues = { 'very-low': 1, 'low': 2, 'moderate': 3, 'high': 4, 'very-high': 5 };
        return { date: entry.date, value: energyValues[entry.energy] };
      }),
      stress: moodData.map(entry => {
        const stressValues = { 'overwhelming': 1, 'high': 2, 'moderate': 3, 'low': 4, 'none': 5 };
        return { date: entry.date, value: stressValues[entry.stress] };
      }),
      sleep: moodData.map(entry => {
        const sleepValues = { 'poor': 1, 'fair': 2, 'good': 4, 'excellent': 5 };
        return { date: entry.date, value: sleepValues[entry.sleep] };
      })
    };
    return metricMap[selectedMetric];
  };

  // Handle double-tap protection for tremor compensation
  const handleTouchSafeAction = (action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      return; // Prevent double-tap within 300ms
    }
    setLastTapTime(currentTime);
    
    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    action();
  };
  
  const exportResearchData = () => {
    trackUser.preferencesChanged('data_export', 'analytics_data');
    
    const data = {
      wellnessMetrics,
      researchMetrics,
      rawData: moodData,
      exportDate: new Date().toISOString(),
      timeframe,
      studyParticipantId: 'anonymous_' + Date.now(),
      deviceContext: {
        isMobile: window.innerWidth <= 768,
        deviceTier,
        wasOffline: isOffline,
        batterySaverMode: isLowBattery
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ALCHM_Research_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Crisis mode style overrides
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};
  
  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-semibold border-2 border-red-400' 
    : 'min-h-[52px] min-w-[52px]';

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 pb-20 trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''} ${isLowBattery ? 'battery-saver-mode' : ''}`} style={crisisStyles}>
      {/* Crisis-safe header with enhanced readability */}
      <div className="text-center mb-8 sm:mb-16 pt-4 sm:pt-8">
        <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          {/* Reduced animation for battery saving and crisis mode */}
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-sage-400 to-sage-500 opacity-20 ${!isLowBattery && !isCrisisMode ? 'animate-breathe' : ''}`} />
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-500 opacity-40" />
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-sage-400 opacity-90" />
        </div>
        <h1 className={`text-2xl sm:text-4xl md:text-5xl font-light text-ink mb-3 sm:mb-4 tracking-tight ${
          isCrisisMode ? 'text-3xl sm:text-4xl font-semibold' : ''
        }`}>
          Wellness Analytics
        </h1>
        <p className={`text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 ${
          isCrisisMode ? 'text-lg font-medium' : ''
        }`}>
          {isCrisisMode 
            ? 'Your progress is safe here. Take your time.' 
            : 'Evidence-based insights into your healing journey, designed to celebrate progress and honor growth'
          }
        </p>
      </div>

      {/* Mobile-optimized controls with crisis mode adaptations */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-stretch sm:items-center mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
          <span className={`text-sm font-medium text-muted ${isCrisisMode ? 'text-base font-semibold' : ''}`}>Timeframe</span>
          <div className="flex bg-sage-50 rounded-2xl p-1 border border-sage-100 w-full sm:w-auto">
            {(['week', 'month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => handleTouchSafeAction(() => setTimeframe(period))}
                className={`${touchTargetClass} flex-1 sm:flex-initial px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 touch-target ${
                  timeframe === period 
                    ? 'bg-sage-400 text-white shadow-subtle' 
                    : 'text-muted hover:text-ink hover:bg-sage-100/50'
                } ${isCrisisMode ? 'text-lg py-4' : ''}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <button
          onClick={() => handleTouchSafeAction(exportResearchData)}
          disabled={isLoading}
          className={`${touchTargetClass} flex items-center justify-center gap-3 px-6 py-3 bg-white border border-sage-200 hover:border-sage-300 text-sage-600 hover:text-sage-700 rounded-2xl text-sm font-medium transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 touch-target disabled:opacity-50 disabled:cursor-not-allowed ${
            isCrisisMode ? 'text-lg py-4 border-2 border-sage-400' : ''
          }`}
        >
          <div className="w-4 h-4 opacity-60 flex-shrink-0">📊</div>
          <span className="whitespace-nowrap">{isLoading ? 'Exporting...' : 'Export Data'}</span>
          {isOffline && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full ml-2">Offline</span>}
        </button>
      </div>

      {/* Mobile-optimized key metrics with crisis mode support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
        <div className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-sage-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-sage-100/30 to-transparent rounded-full ${isLowBattery ? 'hidden' : ''}`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-sage-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {wellnessMetrics.overallWellness}%
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${isCrisisMode ? 'text-base font-semibold' : ''}`}>Overall Wellness</div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-2xl text-xs font-medium ${
              wellnessMetrics.growthTrend === 'improving' ? 'bg-sage-50 text-sage-600' :
              wellnessMetrics.growthTrend === 'declining' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
            } ${isCrisisMode ? 'text-sm px-4 py-2' : ''}`}>
              <span className="text-lg">{wellnessMetrics.growthTrend === 'improving' ? '↗' : wellnessMetrics.growthTrend === 'declining' ? '↘' : '→'}</span>
              {wellnessMetrics.growthTrend}
            </div>
          </div>
        </div>

        <div className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-blue-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-blue-100/30 to-transparent rounded-full ${isLowBattery ? 'hidden' : ''}`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-blue-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {wellnessMetrics.moodStability}%
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${isCrisisMode ? 'text-base font-semibold' : ''}`}>Mood Stability</div>
            <div className={`text-blue-500/70 text-xs font-medium ${isCrisisMode ? 'text-sm' : ''}`}>Emotional Balance</div>
          </div>
        </div>

        <div className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-emerald-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-emerald-100/30 to-transparent rounded-full ${isLowBattery ? 'hidden' : ''}`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-emerald-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {wellnessMetrics.streakDays}
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${isCrisisMode ? 'text-base font-semibold' : ''}`}>Day Streak</div>
            <div className={`text-emerald-500/70 text-xs font-medium ${isCrisisMode ? 'text-sm' : ''}`}>Consistency</div>
          </div>
        </div>

        <div className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-violet-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-violet-100/30 to-transparent rounded-full ${isLowBattery ? 'hidden' : ''}`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-violet-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {wellnessMetrics.totalEntries}
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${isCrisisMode ? 'text-base font-semibold' : ''}`}>Total Entries</div>
            <div className={`text-violet-500/70 text-xs font-medium ${isCrisisMode ? 'text-sm' : ''}`}>Reflections</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* Wellness Journey Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-500 group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-light text-ink mb-2 tracking-tight">Your Wellness Journey</h2>
                <p className="text-muted text-sm leading-relaxed">Beautiful progress across all dimensions of your wellbeing</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-sage-50 rounded-2xl p-1 overflow-x-auto w-full sm:w-auto">
                {(['mood', 'energy', 'stress', 'sleep'] as const).map(metric => (
                  <button
                    key={metric}
                    onClick={() => handleTouchSafeAction(() => setSelectedMetric(metric))}
                    className={`${touchTargetClass} flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 capitalize whitespace-nowrap touch-target ${
                      selectedMetric === metric
                        ? 'bg-sage-400 text-white shadow-subtle'
                        : 'text-muted hover:text-ink hover:bg-sage-100/50'
                    } ${isCrisisMode ? 'text-sm py-3 px-4 font-semibold' : ''}`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile-optimized chart visualization with crisis mode support */}
            <div className="space-y-3 sm:space-y-4">
              {getMetricData().map((dataPoint, index) => {
                const percentage = (dataPoint.value / 5) * 100;
                const isGood = dataPoint.value >= 4;
                const isModeratee = dataPoint.value === 3;
                
                return (
                  <div key={index} className={`group/bar relative ${isCrisisMode ? 'p-2 border border-sage-200 rounded-xl' : ''}`}>
                    <div className={`flex items-center gap-3 sm:gap-4 lg:gap-6 py-3 sm:py-3 px-2 hover:bg-sage-50/50 rounded-2xl transition-all duration-300 ${isCrisisMode ? 'py-4' : ''}`}>
                      <div className={`w-16 sm:w-20 text-muted text-xs sm:text-sm font-medium shrink-0 ${isCrisisMode ? 'text-sm font-semibold' : ''}`}>
                        {new Date(dataPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      
                      <div className="flex-1 relative min-w-0">
                        {/* Background track - larger for mobile */}
                        <div className={`w-full bg-gradient-to-r from-sage-100 to-sage-50 rounded-full overflow-hidden ${isCrisisMode ? 'h-6' : 'h-3 sm:h-4'}`}>
                          {/* Progress bar with crisis mode adaptations */}
                          <div 
                            className={`h-full rounded-full transition-all ease-out ${
                              isGood ? 'bg-gradient-to-r from-sage-400 to-sage-500' :
                              isModeratee ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                              'bg-gradient-to-r from-rose-400 to-rose-500'
                            } ${!isLowBattery ? 'shadow-subtle' : ''} ${isCrisisMode ? 'shadow-lg' : ''} ${isLowBattery ? 'duration-0' : 'duration-700'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        
                        {/* Mobile-friendly score indicator */}
                        <div 
                          className={`absolute top-0 -mt-1 transform -translate-x-1/2 transition-all duration-300 ${
                            isCrisisMode 
                              ? 'opacity-100 -mt-2' 
                              : 'hidden sm:block opacity-0 group-hover/bar:opacity-100'
                          }`}
                          style={{ left: `${percentage}%` }}
                        >
                          <div className={`bg-ink text-white px-2 py-1 rounded-lg font-medium shadow-soft ${
                            isCrisisMode ? 'text-sm px-3 py-2' : 'text-xs'
                          }`}>
                            {dataPoint.value}/5
                          </div>
                          <div className={`bg-ink transform rotate-45 -mt-1 mx-auto ${
                            isCrisisMode ? 'w-3 h-3' : 'w-2 h-2'
                          }`} />
                        </div>
                      </div>
                      
                      {/* Always visible score for mobile accessibility */}
                      <div className={`w-12 sm:w-14 text-right font-medium shrink-0 ${
                        isGood ? 'text-sage-600' :
                        isModeratee ? 'text-amber-600' :
                        'text-rose-600'
                      } ${isCrisisMode ? 'text-base font-bold w-16' : 'text-sm'}`}>
                        {dataPoint.value}/5
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Journey insights */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-sage-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Average {selectedMetric} score</span>
                <span className="font-semibold text-sage-600">
                  {(getMetricData().reduce((sum, dp) => sum + dp.value, 0) / getMetricData().length).toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Strength-Based Insights */}
        <div>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-500 group mb-6">
            <h3 className="text-lg sm:text-xl font-light text-ink mb-4 sm:mb-6 tracking-tight">Your Strengths</h3>
            
            <div className="space-y-6">
              <div className="group/metric">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink text-sm font-medium">Resilience Score</span>
                  <span className="text-sage-600 text-sm font-semibold">
                    {researchMetrics.resilienceScore}/100
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-700 shadow-subtle"
                      style={{ width: `${researchMetrics.resilienceScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-muted text-xs mt-2 leading-relaxed">Your ability to bounce back from challenges</p>
              </div>

              <div className="group/metric">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink text-sm font-medium">Purpose & Meaning</span>
                  <span className="text-violet-600 text-sm font-semibold">
                    {researchMetrics.meaningInLifeScore}/100
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-violet-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-700 shadow-subtle"
                      style={{ width: `${researchMetrics.meaningInLifeScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-muted text-xs mt-2 leading-relaxed">Your sense of purpose and life satisfaction</p>
              </div>

              <div className="group/metric">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink text-sm font-medium">Social Connection</span>
                  <span className="text-blue-600 text-sm font-semibold">
                    {researchMetrics.socialConnectionScore}/100
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700 shadow-subtle"
                      style={{ width: `${researchMetrics.socialConnectionScore}%` }}
                    />
                  </div>
                </div>
                <p className="text-muted text-xs mt-2 leading-relaxed">Your feelings of belonging and support</p>
              </div>
            </div>
          </div>
          
          {/* Wellbeing Indicators */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-500">
            <h3 className="text-lg sm:text-xl font-light text-ink mb-4 sm:mb-6 tracking-tight">Wellbeing Indicators</h3>
            
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink text-sm font-medium">Mood Patterns</span>
                  <span className={`text-sm font-semibold ${
                    researchMetrics.phq9Equivalent <= 4 ? 'text-sage-600' :
                    researchMetrics.phq9Equivalent <= 9 ? 'text-amber-600' :
                    researchMetrics.phq9Equivalent <= 14 ? 'text-orange-600' : 'text-rose-600'
                  }`}>
                    {researchMetrics.phq9Equivalent <= 4 ? 'Positive' :
                     researchMetrics.phq9Equivalent <= 9 ? 'Mild' :
                     researchMetrics.phq9Equivalent <= 14 ? 'Moderate' : 'Significant'}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 shadow-subtle ${
                        researchMetrics.phq9Equivalent <= 4 ? 'bg-gradient-to-r from-sage-400 to-sage-500' :
                        researchMetrics.phq9Equivalent <= 9 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        researchMetrics.phq9Equivalent <= 14 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'
                      }`}
                      style={{ width: `${Math.max(10, 100 - (researchMetrics.phq9Equivalent / 27) * 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-muted text-xs mt-2 leading-relaxed">Emotional wellbeing and mood stability</p>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-ink text-sm font-medium">Anxiety Levels</span>
                  <span className={`text-sm font-semibold ${
                    researchMetrics.gad7Equivalent <= 4 ? 'text-sage-600' :
                    researchMetrics.gad7Equivalent <= 9 ? 'text-amber-600' :
                    researchMetrics.gad7Equivalent <= 14 ? 'text-orange-600' : 'text-rose-600'
                  }`}>
                    {researchMetrics.gad7Equivalent <= 4 ? 'Low' :
                     researchMetrics.gad7Equivalent <= 9 ? 'Mild' :
                     researchMetrics.gad7Equivalent <= 14 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 shadow-subtle ${
                        researchMetrics.gad7Equivalent <= 4 ? 'bg-gradient-to-r from-sage-400 to-sage-500' :
                        researchMetrics.gad7Equivalent <= 9 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        researchMetrics.gad7Equivalent <= 14 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'
                      }`}
                      style={{ width: `${Math.max(10, 100 - (researchMetrics.gad7Equivalent / 21) * 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-muted text-xs mt-2 leading-relaxed">Your stress management and calm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights & Growth Section */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        {/* Personal Insights */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-sage-100 shadow-card">
            <h3 className="text-xl sm:text-2xl font-light text-ink mb-6 sm:mb-8 tracking-tight">Your Growth Insights</h3>
            
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="group">
                <div className="w-12 h-12 bg-sage-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-sage-200 transition-colors duration-300">
                  <div className="w-6 h-6 bg-sage-400 rounded-lg opacity-80" />
                </div>
                <h4 className="text-ink font-semibold mb-2">Consistency Wins</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Your {wellnessMetrics.streakDays}-day journaling streak shows remarkable dedication to self-care and reflection.
                </p>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <div className="w-6 h-6 bg-blue-400 rounded-lg opacity-80" />
                </div>
                <h4 className="text-ink font-semibold mb-2">Emotional Balance</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Your mood stability score of {wellnessMetrics.moodStability}% indicates growing emotional resilience and self-awareness.
                </p>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors duration-300">
                  <div className="w-6 h-6 bg-violet-400 rounded-lg opacity-80" />
                </div>
                <h4 className="text-ink font-semibold mb-2">Personal Growth</h4>
                <p className="text-muted text-sm leading-relaxed">
                  Your overall wellness trend is {wellnessMetrics.growthTrend}, showing positive momentum in your healing journey.
                </p>
              </div>
              
              <div className="group">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                  <div className="w-6 h-6 bg-emerald-400 rounded-lg opacity-80" />
                </div>
                <h4 className="text-ink font-semibold mb-2">Rich Reflections</h4>
                <p className="text-muted text-sm leading-relaxed">
                  With {wellnessMetrics.totalEntries} journal entries, you're building a meaningful archive of self-discovery.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Cards */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-200">
            <h4 className="text-ink font-semibold mb-4">Continue Your Journey</h4>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Your progress is beautiful. Keep nurturing your wellbeing with regular reflection.
            </p>
            <button 
              onClick={() => handleTouchSafeAction(() => window.location.href = '/journal')}
              className={`${touchTargetClass} w-full bg-sage-400 hover:bg-sage-500 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 touch-target ${
                isCrisisMode ? 'py-4 text-lg font-semibold bg-sage-500 border-2 border-sage-600' : ''
              }`}
            >
              Write New Entry
            </button>
          </div>
          
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
            <h4 className="text-ink font-semibold mb-4">Share Your Progress</h4>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Export your wellness data to share with healthcare providers or for personal records.
            </p>
            <button 
              onClick={() => handleTouchSafeAction(exportResearchData)}
              disabled={isLoading}
              className={`${touchTargetClass} w-full bg-sage-100 hover:bg-sage-200 text-sage-700 py-3 px-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 touch-target disabled:opacity-50 disabled:cursor-not-allowed ${
                isCrisisMode ? 'py-4 text-lg font-semibold bg-sage-200 border-2 border-sage-400' : ''
              }`}
            >
              {isLoading ? 'Exporting...' : 'Export Data'}
              {isOffline && <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mt-1">Available offline</div>}
            </button>
          </div>
          
          {/* Goal Setting Interface */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-violet-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 bg-violet-400 rounded-lg opacity-80" />
              </div>
              <h4 className="text-ink font-semibold">Set Wellness Goals</h4>
            </div>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Based on your {selectedMetric} journey, consider setting a gentle goal for continued growth.
            </p>
            
            {/* Suggested Goal Based on Current Metric */}
            <div className="bg-white/70 rounded-2xl p-4 mb-4 border border-violet-200/50">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-violet-300 rounded-lg opacity-60 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h5 className="text-ink font-medium text-sm mb-1">
                    {selectedMetric === 'mood' ? 'Improve Mood Consistency' :
                     selectedMetric === 'energy' ? 'Boost Energy Levels' :
                     selectedMetric === 'stress' ? 'Enhance Stress Management' :
                     'Better Sleep Quality'}
                  </h5>
                  <p className="text-muted text-xs leading-relaxed">
                    {selectedMetric === 'mood' ? 'Maintain a stable mood range of 4-5 for the next 2 weeks' :
                     selectedMetric === 'energy' ? 'Achieve 3+ energy levels on 80% of days this month' :
                     selectedMetric === 'stress' ? 'Practice stress reduction techniques when levels reach 3+' :
                     'Establish a consistent bedtime routine for better sleep'}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleTouchSafeAction(() => {
                trackUser.preferencesChanged('wellness_goal', selectedMetric);
                // TODO: Implement goal creation flow
                alert('Wellness goal creation coming soon!');
              })}
              className={`${touchTargetClass} w-full bg-violet-400 hover:bg-violet-500 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 touch-target ${
                isCrisisMode ? 'py-4 text-lg font-semibold bg-violet-500 border-2 border-violet-600' : ''
              }`}
            >
              Create Wellness Goal
            </button>
          </div>
        </div>
      </div>
      
      {/* Wellness Recommendations */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-16">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-100 group hover:shadow-soft transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 bg-emerald-400 rounded-lg opacity-80" />
            </div>
            <h4 className="text-ink font-semibold text-sm">Mindful Moments</h4>
          </div>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Based on your mood patterns, try 5-minute breathing exercises when stress levels rise.
          </p>
          <div className="text-emerald-600 text-xs font-medium">Recommended for mood stability</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-amber-100 group hover:shadow-soft transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 bg-amber-400 rounded-lg opacity-80" />
            </div>
            <h4 className="text-ink font-semibold text-sm">Energy Boosters</h4>
          </div>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Morning sunlight and gentle movement could enhance your energy consistency.
          </p>
          <div className="text-amber-600 text-xs font-medium">Tailored to your energy patterns</div>
        </div>
        
        <div className="sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-rose-100 group hover:shadow-soft transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 bg-rose-400 rounded-lg opacity-80" />
            </div>
            <h4 className="text-ink font-semibold text-sm">Sleep Sanctuary</h4>
          </div>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Consider creating a bedtime ritual based on your sleep quality insights for deeper rest.
          </p>
          <div className="text-rose-600 text-xs font-medium">Personalized sleep guidance</div>
        </div>
      </div>
      
      {/* Research & Privacy Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-xl sm:rounded-2xl opacity-80" />
          </div>
          <div className="flex-1">
            <h3 className="text-ink font-semibold text-base sm:text-lg mb-3">Evidence-Based Wellness Tracking</h3>
            <p className="text-muted text-sm leading-relaxed mb-4 sm:mb-6">
              Your analytics are based on validated psychological instruments used in research and clinical practice. 
              These insights support your personal growth but are not diagnostic tools. Always consult qualified 
              mental health professionals for clinical assessment and treatment.
            </p>
            <div className="bg-white/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-200/50">
              <p className="text-muted text-xs leading-relaxed">
                <strong>Privacy & Research:</strong> Your data is encrypted and personally unidentifiable. With your explicit consent, 
                anonymized data may contribute to mental health research, helping improve care for others on similar journeys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}