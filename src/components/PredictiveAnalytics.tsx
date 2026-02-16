'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/hooks/useData';
import { setStorageItemNormalized } from '@/lib/storageKeys';

interface RiskPattern {
  id: string;
  pattern: string;
  confidence: number;
  timeframe: string;
  indicators: string[];
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface TrendAnalysis {
  mood: {
    trend: 'improving' | 'stable' | 'declining' | 'concerning';
    direction: number; // -1 to 1
    confidence: number;
  };
  stress: {
    level: number; // 0-10
    triggers: string[];
    peak_times: string[];
  };
  sleep: {
    quality: number; // 0-10
    pattern_disruption: boolean;
    correlation_with_mood: number;
  };
  social: {
    engagement: number; // 0-10
    support_network_strength: number;
    isolation_risk: number;
  };
}

interface EarlyWarningAlert {
  id: string;
  type: 'mood_decline' | 'isolation_pattern' | 'stress_spike' | 'sleep_disruption' | 'crisis_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  recommendations: string[];
  timestamp: Date;
  dismissed: boolean;
}

export default function PredictiveAnalytics() {
  const { user } = useAuth();
  const { getJournalEntries, isInitialized } = useData();
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [riskPatterns, setRiskPatterns] = useState<RiskPattern[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  useEffect(() => {
    if (isInitialized) {
      loadAnalytics();
    }
  }, [isInitialized]);

  const loadAnalytics = async () => {
    try {
      setIsAnalyzing(true);
      
      // Get recent journal entries for analysis
      const entries = await getJournalEntries(30); // Last 30 entries
      
      if (entries.length < 5) {
        // Not enough data for meaningful analysis
        setTrendAnalysis(null);
        setRiskPatterns([]);
        return;
      }

      const analysis = await analyzePatterns(entries);
      setTrendAnalysis(analysis.trends);
      setRiskPatterns(analysis.patterns);
      setEarlyWarnings(analysis.warnings);
      setLastAnalysis(new Date());
      
      // Store analysis locally
      setStorageItemNormalized('predictive_analysis', JSON.stringify({
        trends: analysis.trends,
        patterns: analysis.patterns,
        warnings: analysis.warnings,
        timestamp: new Date()
      }));
      
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzePatterns = async (entries: any[]): Promise<{
    trends: TrendAnalysis;
    patterns: RiskPattern[];
    warnings: EarlyWarningAlert[];
  }> => {
    // Analyze mood trends
    const moodTrend = analyzeMoodTrend(entries);
    
    // Analyze stress patterns
    const stressAnalysis = analyzeStressPatterns(entries);
    
    // Analyze sleep quality
    const sleepAnalysis = analyzeSleepPatterns(entries);
    
    // Analyze social engagement
    const socialAnalysis = analyzeSocialPatterns(entries);
    
    const trends: TrendAnalysis = {
      mood: moodTrend,
      stress: stressAnalysis,
      sleep: sleepAnalysis,
      social: socialAnalysis
    };

    // Identify risk patterns
    const patterns = identifyRiskPatterns(entries, trends);
    
    // Generate early warning alerts
    const warnings = generateEarlyWarnings(trends, patterns);

    return { trends, patterns, warnings };
  };

  const analyzeMoodTrend = (entries: any[]) => {
    const recentMoods = entries
      .filter(entry => entry.mood !== undefined)
      .slice(0, 14) // Last 14 entries with mood data
      .map(entry => entry.mood);

    if (recentMoods.length < 5) {
      return {
        trend: 'stable' as const,
        direction: 0,
        confidence: 0.3
      };
    }

    // Calculate trend using simple linear regression
    const n = recentMoods.length;
    const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
    const sumY = recentMoods.reduce((a, b) => a + b, 0);
    const sumXY = recentMoods.reduce((sum, mood, index) => sum + mood * index, 0);
    const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);

    const denominator = (n * sumX2 - sumX * sumX);
    const rawSlope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
    const slope = isNaN(rawSlope) ? 0 : rawSlope;
    const direction = Math.max(-1, Math.min(1, slope / 2)); // Normalize to -1 to 1

    let trend: 'improving' | 'stable' | 'declining' | 'concerning';
    const rawConfidence = Math.abs(slope) * 0.3 + 0.5;
    const confidence = Math.min(0.95, isNaN(rawConfidence) ? 0.3 : rawConfidence);

    if (direction > 0.3) trend = 'improving';
    else if (direction < -0.3) trend = 'declining';
    else if (direction < -0.6) trend = 'concerning';
    else trend = 'stable';

    return { trend, direction, confidence };
  };

  const analyzeStressPatterns = (entries: any[]) => {
    const stressWords = ['stress', 'anxious', 'worried', 'overwhelmed', 'pressure', 'panic', 'fear'];
    const stressCounts = entries.map(entry => {
      const content = entry.content.toLowerCase();
      return stressWords.filter(word => content.includes(word)).length;
    });

    const totalStress = stressCounts.reduce((a, b) => a + b, 0);
    const avgStress = stressCounts.length > 0 ? totalStress / stressCounts.length : 0;
    const safeAvgStress = isNaN(avgStress) ? 0 : avgStress;
    const stressLevel = Math.min(10, Math.max(0, safeAvgStress * 2));

    // Identify common stress triggers
    const triggers: string[] = [];
    const commonTriggers = ['work', 'family', 'relationship', 'money', 'health', 'school'];
    
    commonTriggers.forEach(trigger => {
      const mentions = entries.filter(entry => 
        entry.content.toLowerCase().includes(trigger) && 
        stressWords.some(word => entry.content.toLowerCase().includes(word))
      ).length;
      
      if (mentions > entries.length * 0.2) {
        triggers.push(trigger);
      }
    });

    // Identify peak stress times
    const peak_times: string[] = [];
    const hourCounts = new Array(24).fill(0);
    entries.forEach(entry => {
      const hour = new Date(entry.createdAt).getHours();
      const content = entry.content.toLowerCase();
      const hasStress = stressWords.some(word => content.includes(word));
      if (hasStress) hourCounts[hour]++;
    });

    const maxStress = hourCounts.length > 0 && Math.max(...hourCounts) > 0 ? Math.max(...hourCounts) : 1;
    hourCounts.forEach((count, hour) => {
      if (count > maxStress * 0.7) {
        peak_times.push(`${hour}:00`);
      }
    });

    return { level: stressLevel, triggers, peak_times };
  };

  const analyzeSleepPatterns = (entries: any[]) => {
    const sleepWords = ['tired', 'exhausted', 'sleep', 'insomnia', 'awake', 'rest'];
    const sleepMentions = entries.filter(entry => 
      sleepWords.some(word => entry.content.toLowerCase().includes(word))
    );

    const ratio = entries.length > 0 ? sleepMentions.length / entries.length : 0;
    const safeRatio = isNaN(ratio) ? 0 : ratio;
    const quality = Math.max(1, 10 - safeRatio * 8);
    const pattern_disruption = sleepMentions.length > entries.length * 0.3;
    
    // Correlate with mood
    const moodEntries = entries.filter(entry => entry.mood !== undefined);
    const sleepMoodCorrelation = calculateSleepMoodCorrelation(moodEntries, sleepWords);

    return {
      quality,
      pattern_disruption,
      correlation_with_mood: sleepMoodCorrelation
    };
  };

  const calculateSleepMoodCorrelation = (entries: any[], sleepWords: string[]) => {
    if (entries.length < 5) return 0;

    const points = entries.map(entry => ({
      sleepMention: sleepWords.some(word => entry.content.toLowerCase().includes(word)),
      mood: entry.mood
    }));

    const sleepMentionMoods = points.filter(p => p.sleepMention).map(p => p.mood);
    const noSleepMentionMoods = points.filter(p => !p.sleepMention).map(p => p.mood);

    if (sleepMentionMoods.length === 0 || noSleepMentionMoods.length === 0) return 0;

    const avgSleepMood = sleepMentionMoods.reduce((a, b) => a + b, 0) / sleepMentionMoods.length;
    const avgNoSleepMood = noSleepMentionMoods.reduce((a, b) => a + b, 0) / noSleepMentionMoods.length;
    
    const safeAvgSleepMood = isNaN(avgSleepMood) ? 0 : avgSleepMood;
    const safeAvgNoSleepMood = isNaN(avgNoSleepMood) ? 0 : avgNoSleepMood;

    return (safeAvgNoSleepMood - safeAvgSleepMood) / 10; // Normalized correlation
  };

  const analyzeSocialPatterns = (entries: any[]) => {
    const socialWords = ['friend', 'family', 'alone', 'isolated', 'social', 'people', 'together'];
    const isolationWords = ['alone', 'isolated', 'lonely', 'disconnect'];
    
    const socialMentions = entries.filter(entry => 
      socialWords.some(word => entry.content.toLowerCase().includes(word))
    ).length;

    const isolationMentions = entries.filter(entry =>
      isolationWords.some(word => entry.content.toLowerCase().includes(word))
    ).length;

    const isolationRatio = entries.length > 0 ? isolationMentions / entries.length : 0;
    const socialRatio = entries.length > 0 ? socialMentions / entries.length : 0;
    
    const safeIsolationRatio = isNaN(isolationRatio) ? 0 : isolationRatio;
    const safeSocialRatio = isNaN(socialRatio) ? 0 : socialRatio;
    
    const engagement = Math.max(1, 10 - safeIsolationRatio * 10);
    const support_network_strength = Math.min(10, safeSocialRatio * 15);
    const isolation_risk = Math.min(10, safeIsolationRatio * 20);

    return { engagement, support_network_strength, isolation_risk };
  };

  const identifyRiskPatterns = (entries: any[], trends: TrendAnalysis): RiskPattern[] => {
    const patterns: RiskPattern[] = [];

    // Mood decline pattern
    if (trends.mood.trend === 'declining' || trends.mood.trend === 'concerning') {
      patterns.push({
        id: 'mood_decline',
        pattern: 'Declining mood trend detected',
        confidence: trends.mood.confidence,
        timeframe: 'Past 2 weeks',
        indicators: ['Consistent decrease in mood ratings', 'Negative sentiment in entries'],
        recommendation: 'Consider reaching out to mental health professional',
        severity: trends.mood.trend === 'concerning' ? 'critical' : 'high'
      });
    }

    // High stress pattern
    if (trends.stress.level > 7) {
      patterns.push({
        id: 'high_stress',
        pattern: 'Elevated stress levels',
        confidence: 0.85,
        timeframe: 'Ongoing',
        indicators: [`Stress level: ${trends.stress.level}/10`, 'Frequent stress indicators in writing'],
        recommendation: 'Practice stress management techniques and consider support',
        severity: trends.stress.level > 8.5 ? 'critical' : 'high'
      });
    }

    // Social isolation pattern
    if (trends.social.isolation_risk > 6) {
      patterns.push({
        id: 'social_isolation',
        pattern: 'Social isolation indicators',
        confidence: 0.75,
        timeframe: 'Recent entries',
        indicators: ['Mentions of loneliness', 'Reduced social connection references'],
        recommendation: 'Reconnect with support network or join social activities',
        severity: trends.social.isolation_risk > 8 ? 'high' : 'medium'
      });
    }

    // Sleep disruption pattern
    if (trends.sleep.pattern_disruption) {
      patterns.push({
        id: 'sleep_disruption',
        pattern: 'Sleep pattern concerns',
        confidence: 0.70,
        timeframe: 'Recent weeks',
        indicators: ['Frequent sleep-related concerns', 'Correlation with mood changes'],
        recommendation: 'Address sleep hygiene and consider medical consultation',
        severity: trends.sleep.correlation_with_mood > 0.5 ? 'medium' : 'low'
      });
    }

    return patterns;
  };

  const generateEarlyWarnings = (trends: TrendAnalysis, patterns: RiskPattern[]): EarlyWarningAlert[] => {
    const warnings: EarlyWarningAlert[] = [];

    // Critical mood decline warning
    if (trends.mood.trend === 'concerning') {
      warnings.push({
        id: 'critical_mood_decline',
        type: 'mood_decline',
        severity: 'critical',
        message: 'Significant mood decline detected over recent entries',
        recommendations: [
          'Contact mental health professional immediately',
          'Use crisis support resources if needed',
          'Reach out to trusted support person'
        ],
        timestamp: new Date(),
        dismissed: false
      });
    }

    // High stress spike warning
    if (trends.stress.level > 8) {
      warnings.push({
        id: 'stress_spike',
        type: 'stress_spike',
        severity: 'high',
        message: 'Elevated stress levels detected',
        recommendations: [
          'Practice immediate stress relief techniques',
          'Consider removing stressors where possible',
          'Schedule relaxation time'
        ],
        timestamp: new Date(),
        dismissed: false
      });
    }

    // Social isolation warning
    if (trends.social.isolation_risk > 7) {
      warnings.push({
        id: 'isolation_warning',
        type: 'isolation_pattern',
        severity: 'medium',
        message: 'Signs of social withdrawal detected',
        recommendations: [
          'Reach out to a friend or family member',
          'Plan social activities',
          'Consider joining support groups'
        ],
        timestamp: new Date(),
        dismissed: false
      });
    }

    return warnings;
  };

  const dismissWarning = (warningId: string) => {
    setEarlyWarnings(prev => 
      prev.map(warning => 
        warning.id === warningId 
          ? { ...warning, dismissed: true }
          : warning
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-green-500 bg-green-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'concerning': return '🚨';
      default: return '📊';
    }
  };

  return (
    <div className="predictive-analytics max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🔮</div>
        <h2 className="text-2xl text-white font-light mb-3">Predictive Wellness Analytics</h2>
        <p className="text-white/70 text-sm">
          AI-powered insights into your mental health patterns and early warning system
        </p>
      </div>

      {/* Analysis Controls */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-white text-lg font-light">Pattern Analysis</h3>
            {lastAnalysis && (
              <p className="text-white/60 text-sm">
                Last updated: {lastAnalysis.toLocaleDateString()} at {lastAnalysis.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={loadAnalytics}
            disabled={isAnalyzing}
            className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              'Refresh Analysis'
            )}
          </button>
        </div>
      </div>

      {/* Early Warning Alerts */}
      {earlyWarnings.filter(w => !w.dismissed).length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="text-white text-lg font-light">🚨 Early Warning Alerts</h3>
          {earlyWarnings.filter(w => !w.dismissed).map((warning) => (
            <div
              key={warning.id}
              className={`border-2 rounded-2xl p-6 ${getSeverityColor(warning.severity)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-medium text-lg">{warning.message}</h4>
                  <p className="text-white/60 text-sm mt-1">
                    Severity: {warning.severity.charAt(0).toUpperCase() + warning.severity.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => dismissWarning(warning.id)}
                  className="text-white/60 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              
              <div>
                <h5 className="text-white/80 font-medium mb-2">Recommended Actions:</h5>
                <ul className="space-y-1">
                  {warning.recommendations.map((rec, index) => (
                    <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-[#8B9A7C] mt-1">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trend Analysis */}
      {trendAnalysis && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mood Trends */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getTrendIcon(trendAnalysis.mood.trend)}</span>
              <div>
                <h4 className="text-white font-medium">Mood Trends</h4>
                <p className="text-white/60 text-sm">
                  {trendAnalysis.mood.trend.charAt(0).toUpperCase() + trendAnalysis.mood.trend.slice(1)}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Direction:</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-700 rounded-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        trendAnalysis.mood.direction > 0 ? 'bg-[#8B9A7C]' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.abs(trendAnalysis.mood.direction || 0) * 100}%`,
                        marginLeft: (trendAnalysis.mood.direction || 0) < 0 ? `${Math.max(0, (1 + (trendAnalysis.mood.direction || 0)) * 100)}%` : '0'
                      }}
                    />
                  </div>
                  <span className="text-white/70 text-xs">
                    {trendAnalysis.mood.direction > 0 ? '↗' : '↘'}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Confidence:</span>
                <span className="text-white text-sm">
                  {Math.round(isNaN(trendAnalysis.mood.confidence) ? 0 : (trendAnalysis.mood.confidence || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Stress Analysis */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="text-white font-medium">Stress Level</h4>
                <p className="text-white/60 text-sm">
                  {(isNaN(trendAnalysis.stress.level) ? 0 : trendAnalysis.stress.level).toFixed(1)}/10
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full h-3 bg-gray-700 rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    trendAnalysis.stress.level > 7 ? 'bg-red-500' : 
                    trendAnalysis.stress.level > 4 ? 'bg-[#E5C97D]' : 'bg-[#8B9A7C]'
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, ((isNaN(trendAnalysis.stress.level) ? 0 : trendAnalysis.stress.level) / 10) * 100))}%` }}
                />
              </div>

              {trendAnalysis.stress.triggers.length > 0 && (
                <div>
                  <h5 className="text-white/80 text-sm mb-1">Common Triggers:</h5>
                  <div className="flex flex-wrap gap-1">
                    {trendAnalysis.stress.triggers.map((trigger) => (
                      <span 
                        key={trigger} 
                        className="bg-red-600/20 text-red-200 px-2 py-1 rounded text-xs"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">😴</span>
              <div>
                <h4 className="text-white font-medium">Sleep Quality</h4>
                <p className="text-white/60 text-sm">
                  {(isNaN(trendAnalysis.sleep.quality) ? 0 : trendAnalysis.sleep.quality).toFixed(1)}/10
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full h-3 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-[#8B9A7C] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, ((isNaN(trendAnalysis.sleep.quality) ? 0 : trendAnalysis.sleep.quality) / 10) * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Pattern Disruption:</span>
                <span className={`${trendAnalysis.sleep.pattern_disruption ? 'text-red-400' : 'text-[#8B9A7C]'}`}>
                  {trendAnalysis.sleep.pattern_disruption ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">Mood Correlation:</span>
                <span className="text-white/70">
                  {((isNaN(trendAnalysis.sleep.correlation_with_mood) ? 0 : trendAnalysis.sleep.correlation_with_mood) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Social Engagement */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="text-white font-medium">Social Connection</h4>
                <p className="text-white/60 text-sm">
                  Engagement: {(isNaN(trendAnalysis.social.engagement) ? 0 : trendAnalysis.social.engagement).toFixed(1)}/10
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Support Network:</span>
                  <span className="text-white/70">{(isNaN(trendAnalysis.social.support_network_strength) ? 0 : trendAnalysis.social.support_network_strength).toFixed(1)}/10</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-[#8B9A7C] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, ((isNaN(trendAnalysis.social.support_network_strength) ? 0 : trendAnalysis.social.support_network_strength) / 10) * 100))}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/80">Isolation Risk:</span>
                  <span className="text-white/70">{(isNaN(trendAnalysis.social.isolation_risk) ? 0 : trendAnalysis.social.isolation_risk).toFixed(1)}/10</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      trendAnalysis.social.isolation_risk > 6 ? 'bg-red-500' : 'bg-[#E5C97D]'
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, ((isNaN(trendAnalysis.social.isolation_risk) ? 0 : trendAnalysis.social.isolation_risk) / 10) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Patterns */}
      {riskPatterns.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-light">🔍 Identified Risk Patterns</h3>
          {riskPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`border-2 rounded-2xl p-6 ${getSeverityColor(pattern.severity)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-medium">{pattern.pattern}</h4>
                <span className="text-xs px-2 py-1 bg-black/30 rounded-full text-white/70">
                  {Math.round(isNaN(pattern.confidence) ? 0 : (pattern.confidence || 0) * 100)}% confidence
                </span>
              </div>

              <p className="text-white/70 text-sm mb-3">{pattern.recommendation}</p>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="text-white/80 mb-2">Indicators:</h5>
                  <ul className="space-y-1">
                    {pattern.indicators.map((indicator, index) => (
                      <li key={index} className="text-white/60 flex items-start gap-2">
                        <span className="text-[#E5C97D] mt-1">•</span>
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-white/80 mb-2">Timeframe:</h5>
                  <p className="text-white/60">{pattern.timeframe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Data State */}
      {!trendAnalysis && !isAnalyzing && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-white text-lg font-light mb-2">Not Enough Data</h3>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Continue journaling to build up enough data for meaningful pattern analysis. 
            We need at least 5 entries to provide insights.
          </p>
        </div>
      )}
    </div>
  );
}
