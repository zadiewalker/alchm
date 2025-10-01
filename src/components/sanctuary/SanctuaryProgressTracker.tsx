/**
 * Sanctuary Progress Tracker - Grace-based progress for free tier users
 * 
 * This component embodies our revolutionary approach to progress tracking:
 * - Celebrates presence over productivity
 * - Uses healing metaphors instead of achievement language
 * - Never shames for missed days or breaks
 * - Honors the courage of showing up
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Moon, 
  Sun, 
  Heart, 
  Pause, 
  RotateCcw,
  Sparkles,
  Shield
} from 'lucide-react';
import { SANCTUARY_BADGES, SANCTUARY_ENCOURAGEMENT } from '@/lib/sanctuary-tier';

interface SanctuaryProgressProps {
  userId: string;
  currentStreak: number;
  graceTokens: number;
  lastJournalDate: string | null;
  totalEntries: number;
  onPauseRequest: () => void;
  onReturnFromPause: () => void;
  isPaused: boolean;
  earnedBadges: string[];
}

export function SanctuaryProgressTracker({
  userId,
  currentStreak,
  graceTokens,
  lastJournalDate,
  totalEntries,
  onPauseRequest,
  onReturnFromPause,
  isPaused,
  earnedBadges
}: SanctuaryProgressProps) {
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  // Calculate days since last journal entry
  const daysSinceLastEntry = lastJournalDate 
    ? Math.floor((new Date().getTime() - new Date(lastJournalDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Determine current phase of the user's journey
  const getJourneyPhase = () => {
    if (isPaused) return 'resting';
    if (daysSinceLastEntry > 3) return 'returning';
    if (currentStreak >= 7) return 'flowing';
    if (currentStreak >= 3) return 'building';
    return 'beginning';
  };

  const journeyPhase = getJourneyPhase();

  // Get phase-appropriate encouragement
  useEffect(() => {
    const getPhaseEncouragement = () => {
      switch (journeyPhase) {
        case 'resting':
          return SANCTUARY_ENCOURAGEMENT.pauseValidation[
            Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.pauseValidation.length)
          ];
        case 'returning':
          return SANCTUARY_ENCOURAGEMENT.returnCelebration[
            Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.returnCelebration.length)
          ];
        case 'flowing':
        case 'building':
        case 'beginning':
          return SANCTUARY_ENCOURAGEMENT.showingUpMessages[
            Math.floor(Math.random() * SANCTUARY_ENCOURAGEMENT.showingUpMessages.length)
          ];
        default:
          return "You're exactly where you need to be.";
      }
    };

    setEncouragementMessage(getPhaseEncouragement());
  }, [journeyPhase]);

  // Visual theme based on journey phase
  const getPhaseTheme = () => {
    switch (journeyPhase) {
      case 'resting':
        return {
          gradient: 'from-purple-900/20 to-indigo-900/20',
          icon: Moon,
          iconColor: 'text-purple-300',
          borderColor: 'border-purple-500/30'
        };
      case 'returning':
        return {
          gradient: 'from-amber-900/20 to-orange-900/20',
          icon: Sun,
          iconColor: 'text-amber-300',
          borderColor: 'border-amber-500/30'
        };
      case 'flowing':
        return {
          gradient: 'from-emerald-900/20 to-teal-900/20',
          icon: Sparkles,
          iconColor: 'text-emerald-300',
          borderColor: 'border-emerald-500/30'
        };
      case 'building':
        return {
          gradient: 'from-green-900/20 to-emerald-900/20',
          icon: Leaf,
          iconColor: 'text-green-300',
          borderColor: 'border-green-500/30'
        };
      default:
        return {
          gradient: 'from-sage-900/20 to-green-900/20',
          icon: Heart,
          iconColor: 'text-sage-300',
          borderColor: 'border-sage-500/30'
        };
    }
  };

  const theme = getPhaseTheme();
  const PhaseIcon = theme.icon;

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <Card className={`bg-gradient-to-r ${theme.gradient} border ${theme.borderColor}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <PhaseIcon className={`h-6 w-6 ${theme.iconColor}`} />
              <div>
                <h3 className="font-medium text-white">Your Journey</h3>
                <p className="text-sm text-gray-300 capitalize">{journeyPhase} phase</p>
              </div>
            </div>
            
            {/* Grace Tokens Display */}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-300" />
              <span className="text-sm text-gray-300">
                {graceTokens} grace tokens
              </span>
            </div>
          </div>

          {/* Encouragement Message */}
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-200 italic">
              "{encouragementMessage}"
            </p>
          </div>

          {/* Current Status */}
          {!isPaused ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Days present</span>
                <span className="text-lg font-medium text-white">{currentStreak}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Total reflections</span>
                <span className="text-lg font-medium text-white">{totalEntries}</span>
              </div>

              {daysSinceLastEntry > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Days since last visit</span>
                  <span className="text-sm text-gray-200">{daysSinceLastEntry}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-2">You're taking a healing pause</p>
              <Button
                onClick={onReturnFromPause}
                variant="outline"
                size="sm"
                className="border-purple-400 text-purple-300 hover:bg-purple-900/20"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Ready to return
              </Button>
            </div>
          )}

          {/* Pause Button */}
          {!isPaused && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <Button
                onClick={onPauseRequest}
                variant="ghost"
                size="sm"
                className="w-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              >
                <Pause className="h-4 w-4 mr-2" />
                I need a pause
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Badges */}
      {earnedBadges.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="pt-6">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              Your Sanctuary Badges
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {earnedBadges.slice(-4).map((badgeKey) => {
                const badge = SANCTUARY_BADGES[badgeKey];
                if (!badge) return null;
                
                return (
                  <div 
                    key={badgeKey}
                    className="bg-gray-800/50 rounded-lg p-2 text-center"
                  >
                    <div className="text-lg mb-1">
                      {badge.visualTheme === 'sage_green' && '🌱'}
                      {badge.visualTheme === 'warm_gold' && '⭐'}
                      {badge.visualTheme === 'soft_blue' && '💙'}
                      {badge.visualTheme === 'gentle_purple' && '🔮'}
                    </div>
                    <p className="text-xs text-gray-300 font-medium">{badge.name}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grace Token Explanation */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-200 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            About Grace Tokens
          </h4>
          <p className="text-sm text-blue-100/80">
            You get 2 grace tokens each week (renewed Mondays). Use them when life gets 
            overwhelming - they protect your streak during difficult times. Taking breaks 
            is part of healing, not failure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing sanctuary progress
export function useSanctuaryProgress(userId: string) {
  const [progressData, setProgressData] = useState({
    currentStreak: 0,
    graceTokens: 2,
    lastJournalDate: null as string | null,
    totalEntries: 0,
    isPaused: false,
    earnedBadges: [] as string[]
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress data from Firestore
  useEffect(() => {
    const loadProgressData = async () => {
      try {
        // This would integrate with the existing Firestore collections
        // For now, using placeholder data
        setProgressData({
          currentStreak: 3,
          graceTokens: 2,
          lastJournalDate: new Date().toISOString(),
          totalEntries: 5,
          isPaused: false,
          earnedBadges: ['first_presence', 'still_here_sanctuary']
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    if (userId) {
      loadProgressData();
    }
  }, [userId]);

  const requestPause = async () => {
    try {
      // Integrate with existing kindness break system
      console.log('Requesting pause for user:', userId);
      setProgressData(prev => ({ ...prev, isPaused: true }));
    } catch (err) {
      setError('Failed to request pause');
    }
  };

  const returnFromPause = async () => {
    try {
      // Integrate with existing return from kindness break
      console.log('Returning from pause for user:', userId);
      setProgressData(prev => ({ 
        ...prev, 
        isPaused: false,
        graceTokens: 2 // Refresh grace tokens on return
      }));
    } catch (err) {
      setError('Failed to return from pause');
    }
  };

  return {
    progressData,
    loading,
    error,
    requestPause,
    returnFromPause
  };
}