/**
 * ALCHM Invisible Progress Tracker
 * 
 * Tracks tone evolution, emotional vocabulary growth, and other invisible markers
 * of therapeutic progress without creating pressure or performance anxiety.
 * 
 * This component operates silently, celebrating growth only when it's meaningful
 * and the user is ready to receive recognition.
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { therapeuticMomentumEngine, type ProgressInsight } from '@/lib/retention/therapeutic-momentum-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, TrendingUp, Brain, Compass } from 'lucide-react';

interface ProgressMetrics {
  toneEvolution: {
    current: number;
    trend: 'improving' | 'stable' | 'concerning';
    weeklyChange: number;
  };
  vocabularyGrowth: {
    totalWords: number;
    newWordsThisWeek: number;
    emotionalRange: number; // 0-100 scale
  };
  insightDepth: {
    averageDepth: number;
    recentBreakthroughs: number;
    patternRecognition: number;
  };
  writingConsistency: {
    streakDays: number;
    weeklyAverage: number;
    engagementQuality: number;
  };
  connectionStrength: {
    communityEngagement: number;
    vulnerabilityComfort: number;
    supportSeeking: number;
  };
}

interface CelebrationMoment {
  id: string;
  type: 'micro' | 'milestone' | 'breakthrough' | 'transformation';
  title: string;
  description: string;
  icon: React.ReactNode;
  significance: number;
  showImmediately?: boolean;
}

export default function InvisibleProgressTracker({ 
  journalEntry,
  onProgressUpdate,
  celebrationStyle = 'gentle'
}: {
  journalEntry?: any;
  onProgressUpdate?: (metrics: ProgressMetrics) => void;
  celebrationStyle?: 'gentle' | 'visible' | 'silent';
}) {
  const { user } = useAuth();
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const [pendingCelebrations, setPendingCelebrations] = useState<CelebrationMoment[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentCelebration, setCurrentCelebration] = useState<CelebrationMoment | null>(null);
  const lastAnalysisRef = useRef<string>('');
  const isTrackingRef = useRef(false);

  /**
   * Initialize invisible progress tracking
   */
  useEffect(() => {
    if (!user?.uid) return;

    const initializeTracking = async () => {
      try {
        isTrackingRef.current = true;
        await loadProgressMetrics();
        
        // Set up periodic progress assessment (every 24 hours)
        const assessmentInterval = setInterval(assessPeriodicProgress, 24 * 60 * 60 * 1000);
        
        return () => {
          clearInterval(assessmentInterval);
          isTrackingRef.current = false;
        };
      } catch (error) {
        console.error('Error initializing progress tracking:', error);
      }
    };

    initializeTracking();
  }, [user?.uid]);

  /**
   * Track progress when new journal entry is created
   */
  useEffect(() => {
    if (!journalEntry || !user?.uid || !isTrackingRef.current) return;
    
    // Avoid duplicate analysis of the same entry
    const entryKey = `${journalEntry.id}-${journalEntry.timestamp}`;
    if (lastAnalysisRef.current === entryKey) return;
    lastAnalysisRef.current = entryKey;

    analyzeJournalProgress(journalEntry);
  }, [journalEntry, user?.uid]);

  /**
   * Load current progress metrics
   */
  const loadProgressMetrics = async () => {
    if (!user?.uid) return;

    try {
      const momentum = await therapeuticMomentumEngine.calculateMomentum(user.uid);
      
      const metrics: ProgressMetrics = {
        toneEvolution: {
          current: momentum.writingToneEvolution,
          trend: momentum.growthTrajectory === 'accelerating' ? 'improving' : 
                 momentum.growthTrajectory === 'declining' ? 'concerning' : 'stable',
          weeklyChange: momentum.weeklyGrowth
        },
        vocabularyGrowth: {
          totalWords: momentum.emotionalVocabularyGrowth,
          newWordsThisWeek: Math.max(0, momentum.weeklyGrowth * 0.3),
          emotionalRange: Math.min(100, momentum.emotionalVocabularyGrowth * 2)
        },
        insightDepth: {
          averageDepth: momentum.insightDepthScore,
          recentBreakthroughs: momentum.breakthroughMoments,
          patternRecognition: Math.min(100, momentum.totalSessions * 2)
        },
        writingConsistency: {
          streakDays: momentum.consecutiveDays,
          weeklyAverage: momentum.weeklyGrowth,
          engagementQuality: momentum.currentMomentum
        },
        connectionStrength: {
          communityEngagement: momentum.connectionStrength,
          vulnerabilityComfort: Math.min(100, momentum.totalSessions * 1.5),
          supportSeeking: momentum.interventionTriggers.length > 0 ? 75 : 50
        }
      };

      setProgressMetrics(metrics);
      onProgressUpdate?.(metrics);
    } catch (error) {
      console.error('Error loading progress metrics:', error);
    }
  };

  /**
   * Analyze journal entry for progress indicators
   */
  const analyzeJournalProgress = async (entry: any) => {
    if (!user?.uid) return;

    try {
      // Detect breakthroughs and insights
      const insights = await therapeuticMomentumEngine.detectBreakthroughs(user.uid, entry);
      
      // Convert insights to celebration moments
      const celebrations = insights.map(insight => createCelebrationMoment(insight));
      
      // Add to pending celebrations
      setPendingCelebrations(prev => [...prev, ...celebrations]);
      
      // Amplify therapeutic momentum
      await therapeuticMomentumEngine.amplifyMomentum(
        user.uid, 
        determineActivityType(entry, insights),
        { insights, entry }
      );
      
      // Refresh metrics
      await loadProgressMetrics();
      
      // Show celebration if appropriate
      if (celebrations.length > 0 && celebrationStyle !== 'silent') {
        queueCelebration(celebrations[0]);
      }
    } catch (error) {
      console.error('Error analyzing journal progress:', error);
    }
  };

  /**
   * Assess progress periodically for long-term patterns
   */
  const assessPeriodicProgress = async () => {
    if (!user?.uid || !progressMetrics) return;

    try {
      // Check for long-term progress patterns
      const celebrations: CelebrationMoment[] = [];

      // Vocabulary milestone
      if (progressMetrics.vocabularyGrowth.totalWords > 0 && 
          progressMetrics.vocabularyGrowth.totalWords % 10 === 0) {
        celebrations.push({
          id: `vocab_milestone_${Date.now()}`,
          type: 'milestone',
          title: 'Your emotional vocabulary is flourishing',
          description: `You've discovered ${progressMetrics.vocabularyGrowth.totalWords} unique ways to express your feelings.`,
          icon: <Brain className="w-6 h-6" />,
          significance: 60
        });
      }

      // Consistency celebration
      if (progressMetrics.writingConsistency.streakDays > 0 && 
          progressMetrics.writingConsistency.streakDays % 7 === 0) {
        celebrations.push({
          id: `consistency_${Date.now()}`,
          type: 'milestone',
          title: 'You\'re building beautiful habits',
          description: `${progressMetrics.writingConsistency.streakDays} days of showing up for yourself.`,
          icon: <TrendingUp className="w-6 h-6" />,
          significance: 50
        });
      }

      // Tone evolution breakthrough
      if (progressMetrics.toneEvolution.trend === 'improving' && 
          progressMetrics.toneEvolution.weeklyChange > 0.5) {
        celebrations.push({
          id: `tone_breakthrough_${Date.now()}`,
          type: 'breakthrough',
          title: 'Your inner voice is transforming',
          description: 'We can see the shift toward self-compassion in your writing.',
          icon: <Heart className="w-6 h-6" />,
          significance: 80
        });
      }

      if (celebrations.length > 0) {
        setPendingCelebrations(prev => [...prev, ...celebrations]);
        if (celebrationStyle === 'visible') {
          queueCelebration(celebrations[0]);
        }
      }
    } catch (error) {
      console.error('Error in periodic progress assessment:', error);
    }
  };

  /**
   * Create celebration moment from progress insight
   */
  const createCelebrationMoment = (insight: ProgressInsight): CelebrationMoment => {
    const iconMap = {
      tone_evolution: <Heart className="w-6 h-6" />,
      vocabulary_growth: <Brain className="w-6 h-6" />,
      insight_depth: <Sparkles className="w-6 h-6" />,
      pattern_breakthrough: <Compass className="w-6 h-6" />,
      emotional_regulation: <TrendingUp className="w-6 h-6" />
    };

    return {
      id: insight.id,
      type: insight.celebrationLevel,
      title: insight.title,
      description: insight.description,
      icon: iconMap[insight.type] || <Sparkles className="w-6 h-6" />,
      significance: insight.significanceScore,
      showImmediately: insight.celebrationLevel === 'transformation'
    };
  };

  /**
   * Determine activity type for momentum amplification
   */
  const determineActivityType = (entry: any, insights: ProgressInsight[]): string => {
    if (insights.some(i => i.celebrationLevel === 'transformation')) {
      return 'breakthrough_insight';
    }
    if (insights.some(i => i.type === 'pattern_breakthrough')) {
      return 'pattern_recognition';
    }
    if (entry.content && entry.content.length > 500) {
      return 'deep_reflection';
    }
    return 'regular_journaling';
  };

  /**
   * Queue celebration for display
   */
  const queueCelebration = (celebration: CelebrationMoment) => {
    if (currentCelebration) {
      // Add to queue if celebration is already showing
      return;
    }

    setCurrentCelebration(celebration);
    setShowCelebration(true);

    // Auto-hide after delay based on significance
    const hideDelay = Math.max(3000, celebration.significance * 50);
    setTimeout(() => {
      setShowCelebration(false);
      setTimeout(() => {
        setCurrentCelebration(null);
        // Show next celebration if any
        setPendingCelebrations(prev => {
          const remaining = prev.filter(c => c.id !== celebration.id);
          if (remaining.length > 0) {
            queueCelebration(remaining[0]);
          }
          return remaining;
        });
      }, 300);
    }, hideDelay);
  };

  /**
   * Manual celebration trigger (for user-initiated viewing)
   */
  const showProgressCelebration = () => {
    if (pendingCelebrations.length > 0) {
      queueCelebration(pendingCelebrations[0]);
    }
  };

  // Silent tracking mode - no visible UI
  if (celebrationStyle === 'silent') {
    return null;
  }

  return (
    <div className="invisible-progress-tracker">
      {/* Celebration Display */}
      <AnimatePresence>
        {showCelebration && currentCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <div className="text-emerald-600 mt-1 flex-shrink-0">
                  {currentCelebration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-emerald-900 mb-1">
                    {currentCelebration.title}
                  </h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {currentCelebration.description}
                  </p>
                </div>
              </div>
              
              {/* Celebration type indicator */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium capitalize">
                  {currentCelebration.type}
                </span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.ceil(currentCelebration.significance / 25) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Insights Panel (gentle mode) */}
      {celebrationStyle === 'gentle' && progressMetrics && (
        <div className="mt-4 space-y-3">
          {/* Invisible progress indicators */}
          <div className="text-xs text-gray-500 space-y-1">
            {progressMetrics.toneEvolution.trend === 'improving' && (
              <div className="flex items-center space-x-2">
                <Heart className="w-3 h-3 text-rose-400" />
                <span>Your writing tone is evolving beautifully</span>
              </div>
            )}
            
            {progressMetrics.vocabularyGrowth.newWordsThisWeek > 0 && (
              <div className="flex items-center space-x-2">
                <Brain className="w-3 h-3 text-blue-400" />
                <span>
                  {progressMetrics.vocabularyGrowth.newWordsThisWeek} new emotional expressions this week
                </span>
              </div>
            )}
            
            {progressMetrics.insightDepth.recentBreakthroughs > 0 && (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Deep insights emerging in your reflections</span>
              </div>
            )}
          </div>

          {/* Pending celebrations indicator */}
          {pendingCelebrations.length > 0 && (
            <button
              onClick={showProgressCelebration}
              className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View your recent growth ({pendingCelebrations.length} insights)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Hook for accessing progress metrics
 */
export const useInvisibleProgress = () => {
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  
  return {
    metrics,
    updateMetrics: setMetrics
  };
};

/**
 * Progress Summary Component for Dashboard
 */
export const ProgressSummary = ({ metrics }: { metrics: ProgressMetrics | null }) => {
  if (!metrics) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
      <h3 className="text-sm font-medium text-emerald-900 mb-3">Your Invisible Growth</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs text-emerald-700">Writing Evolution</div>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-emerald-900">
              {metrics.toneEvolution.trend === 'improving' ? 'Growing stronger' :
               metrics.toneEvolution.trend === 'stable' ? 'Steady progress' : 'Finding balance'}
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-emerald-700">Emotional Range</div>
          <div className="text-sm font-medium text-emerald-900">
            {metrics.vocabularyGrowth.totalWords} expressions discovered
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-emerald-700">Insight Depth</div>
          <div className="text-sm font-medium text-emerald-900">
            {metrics.insightDepth.recentBreakthroughs} breakthroughs
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs text-emerald-700">Connection</div>
          <div className="text-sm font-medium text-emerald-900">
            Growing comfort with vulnerability
          </div>
        </div>
      </div>
    </div>
  );
};