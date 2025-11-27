/**
 * Sanctuary Badge System - Trauma-informed gamification for free tier
 * 
 * Revolutionary design principles:
 * - Celebrates emotional milestones, not productivity metrics
 * - Uses healing metaphors instead of achievement language  
 * - Anti-shame design that honors the process of healing
 * - Badges can be earned multiple times (especially "Still Here" after returns)
 * - Focus on identity evolution: "You are becoming someone who..."
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Leaf, 
  Shield, 
  RotateCcw, 
  Sparkles,
  Award,
  Pause,
  ArrowRight
} from 'lucide-react';
import { SANCTUARY_BADGES, type SanctuaryBadge } from '@/lib/sanctuary-tier';

interface SanctuaryBadgeSystemProps {
  userId: string;
  earnedBadges: string[];
  currentStreak: number;
  totalEntries: number;
  isPaused: boolean;
  recentReturnFromPause: boolean;
  onBadgeCelebration?: (badge: SanctuaryBadge) => void;
}

interface BadgeProgress {
  badgeKey: string;
  progress: number;
  maxProgress: number;
  description: string;
  nextMilestone?: string;
}

export function SanctuaryBadgeSystem({
  userId,
  earnedBadges,
  currentStreak,
  totalEntries,
  isPaused,
  recentReturnFromPause,
  onBadgeCelebration
}: SanctuaryBadgeSystemProps) {
  const [newlyEarnedBadge, setNewlyEarnedBadge] = useState<SanctuaryBadge | null>(null);
  const [showBadgeDetail, setShowBadgeDetail] = useState<string | null>(null);

  // Calculate badge progress for sanctuary tier
  const getBadgeProgress = (): BadgeProgress[] => {
    const progress: BadgeProgress[] = [];

    // First Presence Badge
    if (!earnedBadges.includes('first_presence')) {
      progress.push({
        badgeKey: 'first_presence',
        progress: totalEntries > 0 ? 1 : 0,
        maxProgress: 1,
        description: 'Write your first reflection',
        nextMilestone: 'Show up for yourself once'
      });
    }

    // Still Here Badge (can be earned multiple times)
    const stillHereCount = earnedBadges.filter(b => b === 'still_here_sanctuary').length;
    if (currentStreak >= 3 && (stillHereCount === 0 || recentReturnFromPause)) {
      // Don't show progress if already earned unless returning from pause
    } else if (currentStreak < 3) {
      progress.push({
        badgeKey: 'still_here_sanctuary',
        progress: currentStreak,
        maxProgress: 3,
        description: 'Three days of showing up',
        nextMilestone: `${3 - currentStreak} more days of presence`
      });
    }

    // Gentle Warrior Badge
    if (!earnedBadges.includes('gentle_warrior') && currentStreak < 7) {
      progress.push({
        badgeKey: 'gentle_warrior',
        progress: currentStreak,
        maxProgress: 7,
        description: 'Seven days of consistent presence',
        nextMilestone: `${7 - currentStreak} more days to gentle warrior`
      });
    }

    // Pause Wisdom Badge (when user is paused)
    if (isPaused && !earnedBadges.includes('pause_wisdom')) {
      progress.push({
        badgeKey: 'pause_wisdom',
        progress: 1,
        maxProgress: 1,
        description: 'Honoring your need for rest',
        nextMilestone: 'Already earned by taking this pause'
      });
    }

    // Return Courage Badge (when returning from pause)
    if (recentReturnFromPause) {
      progress.push({
        badgeKey: 'return_courage',
        progress: 1,
        maxProgress: 1,
        description: 'Courage to return after a pause',
        nextMilestone: 'Earned by coming back'
      });
    }

    return progress;
  };

  const badgeProgress = getBadgeProgress();

  // Badge earning logic (would integrate with backend)
  const checkForNewBadges = () => {
    if (totalEntries === 1 && !earnedBadges.includes('first_presence')) {
      const badge = SANCTUARY_BADGES.first_presence;
      setNewlyEarnedBadge(badge);
      onBadgeCelebration?.(badge);
    } else if (currentStreak === 3 && !earnedBadges.includes('still_here_sanctuary')) {
      const badge = SANCTUARY_BADGES.still_here_sanctuary;
      setNewlyEarnedBadge(badge);
      onBadgeCelebration?.(badge);
    } else if (currentStreak === 7 && !earnedBadges.includes('gentle_warrior')) {
      const badge = SANCTUARY_BADGES.gentle_warrior;
      setNewlyEarnedBadge(badge);
      onBadgeCelebration?.(badge);
    } else if (isPaused && !earnedBadges.includes('pause_wisdom')) {
      const badge = SANCTUARY_BADGES.pause_wisdom;
      setNewlyEarnedBadge(badge);
      onBadgeCelebration?.(badge);
    } else if (recentReturnFromPause) {
      const badge = SANCTUARY_BADGES.return_courage;
      setNewlyEarnedBadge(badge);
      onBadgeCelebration?.(badge);
    }
  };

  useEffect(() => {
    checkForNewBadges();
  }, [currentStreak, totalEntries, isPaused, recentReturnFromPause]);

  const getBadgeIcon = (visualTheme: string) => {
    switch (visualTheme) {
      case 'sage_green': return <Leaf className="h-5 w-5 text-green-400" />;
      case 'warm_gold': return <Award className="h-5 w-5 text-yellow-400" />;
      case 'soft_blue': return <Shield className="h-5 w-5 text-blue-400" />;
      case 'gentle_purple': return <Pause className="h-5 w-5 text-purple-400" />;
      default: return <Heart className="h-5 w-5 text-pink-400" />;
    }
  };

  const getThemeColors = (visualTheme: string) => {
    switch (visualTheme) {
      case 'sage_green': 
        return {
          bg: 'from-green-900/20 to-emerald-900/20',
          border: 'border-green-500/30',
          text: 'text-green-200'
        };
      case 'warm_gold':
        return {
          bg: 'from-yellow-900/20 to-amber-900/20',
          border: 'border-yellow-500/30',
          text: 'text-yellow-200'
        };
      case 'soft_blue':
        return {
          bg: 'from-blue-900/20 to-indigo-900/20',
          border: 'border-blue-500/30',
          text: 'text-blue-200'
        };
      case 'gentle_purple':
        return {
          bg: 'from-purple-900/20 to-violet-900/20',
          border: 'border-purple-500/30',
          text: 'text-purple-200'
        };
      default:
        return {
          bg: 'from-gray-900/20 to-slate-900/20',
          border: 'border-gray-500/30',
          text: 'text-gray-200'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Newly Earned Badge Celebration */}
      {newlyEarnedBadge && (
        <Card className={`bg-gradient-to-r ${getThemeColors(newlyEarnedBadge.visualTheme).bg} border ${getThemeColors(newlyEarnedBadge.visualTheme).border} animate-pulse`}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                {getBadgeIcon(newlyEarnedBadge.visualTheme)}
              </div>
              <Badge className="mb-2" variant="outline">
                Badge Earned!
              </Badge>
              <h3 className="font-medium text-white mb-2">{newlyEarnedBadge.name}</h3>
              <p className="text-sm text-gray-300 mb-3">{newlyEarnedBadge.description}</p>
              <div className="bg-black/20 rounded-lg p-3 mb-4">
                <p className="text-sm italic text-gray-200">
                  "{newlyEarnedBadge.celebrationMessage}"
                </p>
              </div>
              <Button
                onClick={() => setNewlyEarnedBadge(null)}
                variant="outline"
                size="sm"
                className={`${getThemeColors(newlyEarnedBadge.visualTheme).border} ${getThemeColors(newlyEarnedBadge.visualTheme).text}`}
              >
                Continue Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earned Badges Gallery */}
      {earnedBadges.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Your Sanctuary Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {earnedBadges.map((badgeKey, index) => {
                const badge = SANCTUARY_BADGES[badgeKey];
                if (!badge) return null;

                const colors = getThemeColors(badge.visualTheme);
                
                return (
                  <div
                    key={`${badgeKey}-${index}`}
                    className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-lg p-3 cursor-pointer transition-all hover:scale-105`}
                    onClick={() => setShowBadgeDetail(showBadgeDetail === badgeKey ? null : badgeKey)}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        {getBadgeIcon(badge.visualTheme)}
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{badge.description}</p>
                      
                      {badge.canEarnMultipleTimes && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          Renewable
                        </Badge>
                      )}
                    </div>

                    {/* Expanded Badge Detail */}
                    {showBadgeDetail === badgeKey && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="bg-black/20 rounded p-2">
                          <p className="text-xs italic text-gray-300">
                            "{badge.celebrationMessage}"
                          </p>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-400">Milestone: </span>
                          <span className="text-xs capitalize text-gray-300">
                            {badge.emotionalMilestone.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Progress */}
      {badgeProgress.length > 0 && (
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-400" />
              Your Next Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {badgeProgress.map((progress) => {
                const badge = SANCTUARY_BADGES[progress.badgeKey];
                if (!badge) return null;

                const colors = getThemeColors(badge.visualTheme);
                const progressPercentage = (progress.progress / progress.maxProgress) * 100;
                
                return (
                  <div
                    key={progress.badgeKey}
                    className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-lg p-3`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getBadgeIcon(badge.visualTheme)}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white text-sm">{badge.name}</h4>
                          <span className="text-xs text-gray-400">
                            {progress.progress}/{progress.maxProgress}
                          </span>
                        </div>
                        
                        <div className="bg-gray-800 rounded-full h-2 mb-1">
                          <div 
                            className={`bg-gradient-to-r from-gray-400 to-white h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        
                        <p className="text-xs text-gray-400">{progress.description}</p>
                        {progress.nextMilestone && (
                          <p className="text-xs text-gray-500 mt-1">
                            Next: {progress.nextMilestone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badge Philosophy */}
      <Card className="bg-sage-900/20 border-sage-500/30">
        <CardContent className="pt-6">
          <h4 className="font-medium text-sage-200 mb-2 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            About Sanctuary Badges
          </h4>
          <p className="text-sm text-sage-100/80">
            These badges celebrate your emotional milestones and inner work. They honor 
            the courage of showing up, the wisdom of taking breaks, and the strength of 
            returning. Some badges can be earned multiple times because every act of 
            self-care deserves recognition.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing badge system
export function useSanctuaryBadges(userId: string) {
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserBadges = async () => {
      try {
        // This would integrate with Firestore badges collection
        // For now, using placeholder data
        setBadges(['first_presence', 'still_here_sanctuary']);
        setLoading(false);
      } catch (err) {
        setError('Failed to load badges');
        setLoading(false);
      }
    };

    if (userId) {
      loadUserBadges();
    }
  }, [userId]);

  const awardBadge = async (badgeKey: string) => {
    try {
      // Would integrate with backend badge awarding
      setBadges(prev => [...prev, badgeKey]);
    } catch (err) {
      setError('Failed to award badge');
    }
  };

  return {
    badges,
    loading,
    error,
    awardBadge
  };
}