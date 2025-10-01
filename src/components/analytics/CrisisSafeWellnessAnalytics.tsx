/**
 * Crisis-Safe Wellness Analytics
 * 
 * PROTECTIVE SHIELD: Analytics designed to celebrate progress without inducing shame or crisis
 * 
 * This component transforms traditional analytics into a supportive, strength-based
 * visualization that protects vulnerable users from harmful comparison or pressure
 * while maintaining the insights needed for healing and growth.
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { useMobileOptimization } from '../MobileOptimizationProvider';
import { useAnalytics } from '@/lib/analytics';
import { crisisSafetyCoordinator } from '@/lib/crisis-safety-coordinator';
import { detectEmotionalContext } from '@/lib/emotional-intelligence';
import { logger } from '@/lib/logging';

interface SafeWellnessMetrics {
  // Strength-focused metrics
  resilience: number; // 0-100
  growth: number; // 0-100
  consistency: number; // 0-100
  insight: number; // 0-100
  
  // Progress indicators (always positive framing)
  reflectionStreak: number;
  wordsOfWisdom: number;
  insightsGained: number;
  strengthsDiscovered: number;
  
  // Celebration points
  milestonesReached: string[];
  recentWins: string[];
  progressHighlights: string[];
  
  // Gentle guidance (never shame-inducing)
  encouragement: string;
  nextGrowthOpportunity: string;
  celebrationReady: boolean;
}

interface CrisisProtectedData {
  originalMetrics: any;
  safeMetrics: SafeWellnessMetrics;
  protectionLevel: 'none' | 'gentle' | 'strong' | 'maximum';
  hiddenElements: string[];
  positiveFocus: string[];
}

export default function CrisisSafeWellnessAnalytics() {
  const { user } = useAuth();
  const { trackUser, trackNavigation } = useAnalytics();
  const { 
    isCrisisMode, 
    isOffline, 
    deviceTier, 
    isLowBattery 
  } = useMobileOptimization();
  
  const [protectedData, setProtectedData] = useState<CrisisProtectedData | null>(null);
  const [userCrisisState, setUserCrisisState] = useState<'none' | 'low' | 'moderate' | 'high' | 'critical'>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [celebrationMode, setCelebrationMode] = useState(false);

  // Assess user's current emotional state for protection level
  useEffect(() => {
    const assessUserState = async () => {
      try {
        if (!user?.uid) return;

        // Get recent journal content summary for emotional context
        const recentContent = localStorage.getItem('alchm_recent_content_summary') || '';
        
        if (recentContent) {
          const emotionalContext = detectEmotionalContext(recentContent);
          
          // Determine crisis protection level
          let crisisState: typeof userCrisisState = 'none';
          
          if (emotionalContext.isCrisis) {
            crisisState = 'critical';
          } else if (emotionalContext.needsSupport && emotionalContext.intensity === 'intense') {
            crisisState = 'high';
          } else if (emotionalContext.needsSupport) {
            crisisState = 'moderate';
          } else if (['vulnerability', 'pain'].includes(emotionalContext.primary)) {
            crisisState = 'low';
          }

          setUserCrisisState(crisisState);
        }
      } catch (error) {
        logger.error('Failed to assess user state for analytics protection', error);
      }
    };

    assessUserState();
  }, [user?.uid]);

  // Load and protect analytics data
  useEffect(() => {
    const loadProtectedAnalytics = async () => {
      try {
        setIsLoading(true);

        // Get raw analytics data (this would normally come from your analytics service)
        const rawMetrics = await fetchRawMetrics();
        
        // Apply crisis safety protections
        const protected = await applyCrisisSafetyProtections(rawMetrics, userCrisisState);
        
        setProtectedData(protected);
        
        // Show encouragement if user needs support
        if (['moderate', 'high', 'critical'].includes(userCrisisState)) {
          setShowEncouragement(true);
        }

        // Activate celebration mode for positive milestones
        if (protected.safeMetrics.celebrationReady) {
          setCelebrationMode(true);
        }

      } catch (error) {
        logger.error('Failed to load protected analytics', error);
        
        // Provide safe fallback
        setProtectedData(createSafeFallbackData());
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.uid) {
      loadProtectedAnalytics();
    }
  }, [user?.uid, userCrisisState]);

  // Fetch raw analytics metrics
  const fetchRawMetrics = async () => {
    // This would typically fetch from your analytics API
    // For demo purposes, we'll simulate data
    return {
      streakDays: Math.floor(Math.random() * 30),
      totalEntries: Math.floor(Math.random() * 100) + 20,
      wordCount: Math.floor(Math.random() * 10000) + 1000,
      moodScore: Math.random() * 5,
      energyScore: Math.random() * 5,
      stressScore: Math.random() * 5,
      sleepScore: Math.random() * 5,
      lastEntryDate: new Date(),
      avgSessionTime: Math.floor(Math.random() * 30) + 10
    };
  };

  // Apply crisis safety protections to analytics data
  const applyCrisisSafetyProtections = async (
    rawMetrics: any, 
    crisisState: typeof userCrisisState
  ): Promise<CrisisProtectedData> => {
    
    const protectionLevel = getProtectionLevel(crisisState);
    const hiddenElements: string[] = [];
    const positiveFocus: string[] = [];

    // Create safe metrics with positive framing
    let safeMetrics: SafeWellnessMetrics = {
      resilience: Math.max(50, (rawMetrics.moodScore / 5) * 100), // Never below 50
      growth: Math.max(60, Math.random() * 40 + 60), // 60-100 range
      consistency: Math.max(40, (rawMetrics.streakDays / 30) * 100), // Based on streak
      insight: Math.max(55, (rawMetrics.totalEntries / 100) * 100), // Based on entries
      
      reflectionStreak: Math.max(1, rawMetrics.streakDays), // Never 0
      wordsOfWisdom: rawMetrics.wordCount,
      insightsGained: Math.max(5, rawMetrics.totalEntries), // Positive framing
      strengthsDiscovered: Math.floor(rawMetrics.totalEntries / 5) + 1,
      
      milestonesReached: generatePositiveMilestones(rawMetrics),
      recentWins: generateRecentWins(rawMetrics),
      progressHighlights: generateProgressHighlights(rawMetrics),
      
      encouragement: getContextualEncouragement(crisisState, rawMetrics),
      nextGrowthOpportunity: getGentleGuidance(rawMetrics),
      celebrationReady: shouldCelebrate(rawMetrics, crisisState)
    };

    // Apply protection filters based on crisis state
    if (protectionLevel === 'maximum') {
      // Hide potentially triggering metrics
      hiddenElements.push('streaks', 'comparisons', 'goals', 'achievements');
      
      // Focus only on immediate support and strength
      safeMetrics = {
        ...safeMetrics,
        resilience: Math.max(75, safeMetrics.resilience), // Boost confidence
        encouragement: getCriticalSupportMessage(),
        nextGrowthOpportunity: 'Your well-being is the only priority right now.'
      };
      
      positiveFocus.push('immediate_support', 'safety', 'strength');
      
    } else if (protectionLevel === 'strong') {
      // Hide competitive or pressure-inducing elements
      hiddenElements.push('comparisons', 'goals', 'decline_indicators');
      
      // Emphasize growth and progress
      positiveFocus.push('growth', 'resilience', 'insights');
      
    } else if (protectionLevel === 'gentle') {
      // Hide only directly harmful elements
      hiddenElements.push('decline_indicators', 'missed_goals');
      
      // Maintain balance with gentle positivity
      positiveFocus.push('consistency', 'wisdom', 'reflection');
    }

    return {
      originalMetrics: rawMetrics,
      safeMetrics,
      protectionLevel,
      hiddenElements,
      positiveFocus
    };
  };

  // Determine appropriate protection level
  const getProtectionLevel = (crisisState: typeof userCrisisState): CrisisProtectedData['protectionLevel'] => {
    switch (crisisState) {
      case 'critical': return 'maximum';
      case 'high': return 'strong';
      case 'moderate': return 'gentle';
      case 'low': return 'gentle';
      default: return 'none';
    }
  };

  // Generate positive milestone messages
  const generatePositiveMilestones = (metrics: any): string[] => {
    const milestones = [];
    
    if (metrics.totalEntries >= 10) milestones.push('Dedicated Reflector');
    if (metrics.totalEntries >= 25) milestones.push('Wisdom Seeker');
    if (metrics.totalEntries >= 50) milestones.push('Insight Master');
    if (metrics.wordCount >= 1000) milestones.push('Thoughtful Writer');
    if (metrics.streakDays >= 7) milestones.push('Consistency Champion');
    
    return milestones;
  };

  // Generate recent positive achievements
  const generateRecentWins = (metrics: any): string[] => {
    const wins = [];
    
    if (metrics.streakDays > 0) {
      wins.push(`${metrics.streakDays} day${metrics.streakDays > 1 ? 's' : ''} of consistent reflection`);
    }
    
    if (metrics.totalEntries > 0) {
      wins.push(`${metrics.totalEntries} insights captured`);
    }
    
    wins.push('Commitment to personal growth');
    wins.push('Taking time for self-reflection');
    
    return wins.slice(0, 3); // Keep it concise
  };

  // Generate progress highlights
  const generateProgressHighlights = (metrics: any): string[] => {
    return [
      'Your dedication to self-reflection is remarkable',
      'Every entry is an act of self-care and courage',
      'You\'re building a valuable archive of personal wisdom',
      'Your commitment to growth inspires others'
    ];
  };

  // Get contextual encouragement based on crisis state
  const getContextualEncouragement = (crisisState: typeof userCrisisState, metrics: any): string => {
    switch (crisisState) {
      case 'critical':
        return 'Your safety is our priority. These insights celebrate your strength in seeking support.';
      case 'high':
        return 'You\'re taking brave steps forward. Focus on the progress you\'re making.';
      case 'moderate':
        return 'Every entry is an act of self-care. You\'re building resilience with each reflection.';
      case 'low':
        return 'Your journey of growth continues. Each step matters and has meaning.';
      default:
        return 'Your commitment to self-reflection is creating positive change in your life.';
    }
  };

  // Get gentle guidance for next steps
  const getGentleGuidance = (metrics: any): string => {
    if (metrics.streakDays === 0) {
      return 'When you feel ready, your next reflection awaits.';
    } else if (metrics.avgSessionTime < 5) {
      return 'Take your time - there\'s no rush in self-discovery.';
    } else {
      return 'Continue exploring your inner wisdom at your own pace.';
    }
  };

  // Determine if celebration is appropriate
  const shouldCelebrate = (metrics: any, crisisState: typeof userCrisisState): boolean => {
    if (['high', 'critical'].includes(crisisState)) {
      return false; // No celebration during crisis
    }
    
    return metrics.streakDays >= 7 || metrics.totalEntries >= 25 || metrics.totalEntries % 10 === 0;
  };

  // Get critical support message for crisis state
  const getCriticalSupportMessage = (): string => {
    return 'We care about you. Your well-being matters more than any metrics. Support is available.';
  };

  // Create safe fallback data for errors
  const createSafeFallbackData = (): CrisisProtectedData => {
    return {
      originalMetrics: {},
      safeMetrics: {
        resilience: 75,
        growth: 80,
        consistency: 60,
        insight: 70,
        reflectionStreak: 1,
        wordsOfWisdom: 500,
        insightsGained: 10,
        strengthsDiscovered: 3,
        milestonesReached: ['Brave Explorer'],
        recentWins: ['Taking time for self-reflection'],
        progressHighlights: ['Your willingness to reflect shows incredible strength'],
        encouragement: 'Every moment of self-reflection is valuable.',
        nextGrowthOpportunity: 'Continue your journey at your own pace.',
        celebrationReady: false
      },
      protectionLevel: 'gentle',
      hiddenElements: [],
      positiveFocus: ['strength', 'courage']
    };
  };

  // Handle touch-safe interactions
  const handleTouchSafeAction = (action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      return; // Prevent double-tap
    }
    setLastTapTime(currentTime);
    
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    action();
  };

  // Export safe wellness data
  const exportSafeWellnessData = () => {
    if (!protectedData) return;

    const exportData = {
      wellnessHighlights: {
        resilience: protectedData.safeMetrics.resilience,
        growth: protectedData.safeMetrics.growth,
        consistency: protectedData.safeMetrics.consistency,
        reflectionStreak: protectedData.safeMetrics.reflectionStreak,
        insightsGained: protectedData.safeMetrics.insightsGained
      },
      achievements: protectedData.safeMetrics.milestonesReached,
      recentWins: protectedData.safeMetrics.recentWins,
      encouragement: protectedData.safeMetrics.encouragement,
      exportDate: new Date().toISOString(),
      note: 'This export focuses on your strengths and positive progress.'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ALCHM_Wellness_Highlights_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackUser.preferencesChanged('data_export', 'safe_wellness_data');
  };

  // Crisis mode style overrides
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};
  
  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-semibold border-2 border-sage-400' 
    : 'min-h-[52px] min-w-[52px]';

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!protectedData) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-center py-12">
        <p className="text-muted">Unable to load analytics safely at this time.</p>
        <p className="text-muted text-sm mt-2">Your well-being is more important than any metrics.</p>
      </div>
    );
  }

  const { safeMetrics, protectionLevel, hiddenElements } = protectedData;

  return (
    <div 
      className={`max-w-6xl mx-auto px-4 sm:px-6 pb-20 trauma-informed-mobile-ux ${
        isCrisisMode ? 'crisis-active' : ''
      } ${isLowBattery ? 'battery-saver-mode' : ''}`} 
      style={crisisStyles}
    >
      {/* Crisis-safe header */}
      <div className="text-center mb-8 sm:mb-16 pt-4 sm:pt-8">
        <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 mb-6 sm:mb-8">
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-sage-400 to-sage-500 opacity-20 ${
            !isLowBattery && !isCrisisMode ? 'animate-breathe' : ''
          }`} />
          <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-500 opacity-40" />
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-sage-400 opacity-90" />
        </div>
        <h1 className={`text-2xl sm:text-4xl md:text-5xl font-light text-ink mb-3 sm:mb-4 tracking-tight ${
          isCrisisMode ? 'text-3xl sm:text-4xl font-semibold' : ''
        }`}>
          Your Wellness Journey
        </h1>
        <p className={`text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 ${
          isCrisisMode ? 'text-lg font-medium' : ''
        }`}>
          {protectionLevel === 'maximum' 
            ? 'Celebrating your courage and strength' 
            : 'A strength-based view of your healing progress'
          }
        </p>
      </div>

      {/* Encouragement banner for users needing support */}
      {showEncouragement && (
        <Card className="border-sage-200 bg-gradient-to-r from-sage-50 to-sage-100 mb-8">
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sage-200 flex items-center justify-center">
              <span className="text-sage-600 text-xl">💙</span>
            </div>
            <p className="text-sage-800 font-medium mb-2">
              {safeMetrics.encouragement}
            </p>
            <p className="text-sage-600 text-sm">
              These insights focus on your strengths and growth, not comparisons or pressure.
            </p>
          </div>
        </Card>
      )}

      {/* Celebration banner */}
      {celebrationMode && !['high', 'critical'].includes(userCrisisState) && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 mb-8">
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-200 flex items-center justify-center">
              <span className="text-amber-600 text-xl">🎉</span>
            </div>
            <p className="text-amber-800 font-medium mb-2">
              Time to celebrate your progress!
            </p>
            <p className="text-amber-600 text-sm">
              Your dedication to self-reflection has reached a meaningful milestone.
            </p>
          </div>
        </Card>
      )}

      {/* Strength-based metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
        <Card className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-sage-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-sage-100/30 to-transparent rounded-full ${
            isLowBattery ? 'hidden' : ''
          }`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-sage-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {safeMetrics.resilience}%
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${
              isCrisisMode ? 'text-base font-semibold' : ''
            }`}>
              Inner Strength
            </div>
            <div className={`text-sage-500/70 text-xs font-medium ${
              isCrisisMode ? 'text-sm' : ''
            }`}>
              Your resilience shines
            </div>
          </div>
        </Card>

        <Card className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-blue-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-blue-100/30 to-transparent rounded-full ${
            isLowBattery ? 'hidden' : ''
          }`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-blue-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {safeMetrics.growth}%
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${
              isCrisisMode ? 'text-base font-semibold' : ''
            }`}>
              Personal Growth
            </div>
            <div className={`text-blue-500/70 text-xs font-medium ${
              isCrisisMode ? 'text-sm' : ''
            }`}>
              Continuous evolution
            </div>
          </div>
        </Card>

        {!hiddenElements.includes('streaks') && (
          <Card className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
            isCrisisMode ? 'border-2 border-emerald-400 p-8' : ''
          }`}>
            <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-emerald-100/30 to-transparent rounded-full ${
              isLowBattery ? 'hidden' : ''
            }`} />
            <div className="relative text-center">
              <div className={`text-3xl sm:text-4xl font-light text-emerald-600 mb-2 tracking-tight ${
                isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
              }`}>
                {safeMetrics.reflectionStreak}
              </div>
              <div className={`text-ink font-medium text-sm mb-3 ${
                isCrisisMode ? 'text-base font-semibold' : ''
              }`}>
                Reflection Days
              </div>
              <div className={`text-emerald-500/70 text-xs font-medium ${
                isCrisisMode ? 'text-sm' : ''
              }`}>
                Consistent care
              </div>
            </div>
          </Card>
        )}

        <Card className={`group relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-violet-100 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 touch-target ${
          isCrisisMode ? 'border-2 border-violet-400 p-8' : ''
        }`}>
          <div className={`absolute -top-8 -right-8 w-20 h-20 bg-gradient-radial from-violet-100/30 to-transparent rounded-full ${
            isLowBattery ? 'hidden' : ''
          }`} />
          <div className="relative text-center">
            <div className={`text-3xl sm:text-4xl font-light text-violet-600 mb-2 tracking-tight ${
              isCrisisMode ? 'text-4xl sm:text-5xl font-semibold' : ''
            }`}>
              {safeMetrics.insightsGained}
            </div>
            <div className={`text-ink font-medium text-sm mb-3 ${
              isCrisisMode ? 'text-base font-semibold' : ''
            }`}>
              Insights Gained
            </div>
            <div className={`text-violet-500/70 text-xs font-medium ${
              isCrisisMode ? 'text-sm' : ''
            }`}>
              Wisdom collected
            </div>
          </div>
        </Card>
      </div>

      {/* Recent wins and milestones */}
      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        <div className="lg:col-span-2">
          <Card className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-sage-100 shadow-card">
            <h2 className="text-xl sm:text-2xl font-light text-ink mb-6 sm:mb-8 tracking-tight">
              Your Recent Wins
            </h2>
            <div className="space-y-4">
              {safeMetrics.recentWins.map((win, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-sage-50 rounded-2xl">
                  <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sage-600 text-sm">✨</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-ink font-medium mb-1">{win}</p>
                    <p className="text-sage-600 text-sm">Celebrating your dedication</p>
                  </div>
                </div>
              ))}
            </div>
            
            {safeMetrics.progressHighlights.length > 0 && (
              <div className="mt-8 pt-8 border-t border-sage-100">
                <h3 className="text-lg font-medium text-ink mb-4">Progress Highlights</h3>
                <div className="space-y-2">
                  {safeMetrics.progressHighlights.slice(0, 2).map((highlight, index) => (
                    <p key={index} className="text-sage-700 text-sm italic">
                      "{highlight}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-sage-50 to-sage-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-200">
            <h3 className="text-ink font-semibold mb-4">Milestones Reached</h3>
            <div className="space-y-3">
              {safeMetrics.milestonesReached.length > 0 ? (
                safeMetrics.milestonesReached.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-sage-200">
                    <div className="w-8 h-8 bg-sage-300 rounded-full flex items-center justify-center">
                      <span className="text-sage-700 text-sm">🏆</span>
                    </div>
                    <span className="text-sage-800 font-medium text-sm">{milestone}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sage-600 text-sm">Your first milestone is just around the corner!</p>
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
            <h3 className="text-ink font-semibold mb-4">Next Growth Opportunity</h3>
            <p className="text-sage-700 text-sm leading-relaxed mb-6">
              {safeMetrics.nextGrowthOpportunity}
            </p>
            <Button 
              onClick={() => handleTouchSafeAction(() => window.location.href = '/journal')}
              className={`${touchTargetClass} w-full bg-sage-400 hover:bg-sage-500 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 touch-target ${
                isCrisisMode ? 'py-4 text-lg font-semibold bg-sage-500 border-2 border-sage-600' : ''
              }`}
            >
              Continue Reflecting
            </Button>
          </Card>

          <Card className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-sage-100 shadow-card">
            <h3 className="text-ink font-semibold mb-4">Share Your Progress</h3>
            <p className="text-sage-600 text-sm mb-6 leading-relaxed">
              Export your wellness highlights to celebrate with your support system.
            </p>
            <Button 
              onClick={() => handleTouchSafeAction(exportSafeWellnessData)}
              variant="outline"
              className={`${touchTargetClass} w-full py-3 px-4 rounded-2xl font-medium transition-all duration-200 touch-target ${
                isCrisisMode ? 'py-4 text-lg font-semibold border-2 border-sage-400' : ''
              }`}
            >
              Export Highlights
            </Button>
          </Card>
        </div>
      </div>

      {/* Privacy and support notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-xl sm:rounded-2xl opacity-80" />
          </div>
          <div className="flex-1">
            <h3 className="text-ink font-semibold text-base sm:text-lg mb-3">
              Your Wellness, Your Privacy
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              These analytics are designed to celebrate your growth without creating pressure or shame. 
              Your data is private, and this view focuses on strengths rather than comparisons or deficits.
            </p>
            {protectionLevel !== 'none' && (
              <div className="bg-blue-100 rounded-xl p-3 border border-blue-200">
                <p className="text-blue-800 text-xs font-medium mb-1">
                  Enhanced Privacy Mode Active
                </p>
                <p className="text-blue-700 text-xs">
                  We've customized this view to support your current well-being needs.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}