/**
 * Sanctuary Dashboard - Complete freemium experience
 * 
 * This is the main dashboard for Sanctuary tier users, integrating all the 
 * healing-centered features while maintaining dignity and providing genuine value.
 * Never feels like a limited trial but a complete sanctuary experience.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Feather, 
  Sparkles, 
  Users,
  Settings,
  ArrowRight,
  Crown,
  Gift,
  Shield
} from 'lucide-react';

// Import Sanctuary components
import { SanctuaryProgressTracker, useSanctuaryProgress } from './SanctuaryProgressTracker';
import { SanctuaryBadgeSystem, useSanctuaryBadges } from './SanctuaryBadgeSystem';
import { SanctuaryEmotionalSupport, useSanctuaryEmotionalSupport } from './SanctuaryEmotionalSupport';
import { TierFeatureGate, useTierAccess } from '@/components/TierFeatureGate';

interface SanctuaryDashboardProps {
  userId: string;
  userTier: 'sanctuary' | 'deep-cut' | 'oracle';
  onNavigateToJournal: () => void;
  onNavigateToUpgrade?: () => void;
}

export function SanctuaryDashboard({
  userId,
  userTier,
  onNavigateToJournal,
  onNavigateToUpgrade
}: SanctuaryDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showUpgradeHint, setShowUpgradeHint] = useState(false);
  const [dismissedUpgradeHints, setDismissedUpgradeHints] = useState<string[]>([]);

  // Use Sanctuary hooks
  const { progressData, loading: progressLoading, requestPause, returnFromPause } = useSanctuaryProgress(userId);
  const { badges, awardBadge } = useSanctuaryBadges(userId);
  const { sessionState, updateMood, markWrittenToday, startNewSession } = useSanctuaryEmotionalSupport(userId);
  const { isSanctuaryTier, hasDeepCutAccess } = useTierAccess(userTier);

  // Check for milestone-based upgrade hints (respectful, never during crisis)
  useEffect(() => {
    const checkUpgradeHints = () => {
      // Only show upgrade hints on positive milestones and never during difficult times
      if (sessionState.mood === 'crisis' || sessionState.mood === 'difficult') {
        return;
      }

      // Show upgrade hint on 7-day streak (gentle milestone celebration)
      if (progressData.currentStreak === 7 && !dismissedUpgradeHints.includes('7_day_streak')) {
        setShowUpgradeHint(true);
      }

      // Show upgrade hint when user has earned 3+ badges
      if (badges.length >= 3 && !dismissedUpgradeHints.includes('3_badges')) {
        setShowUpgradeHint(true);
      }
    };

    checkUpgradeHints();
  }, [progressData.currentStreak, badges.length, sessionState.mood, dismissedUpgradeHints]);

  const handleStartWriting = () => {
    startNewSession();
    markWrittenToday();
    onNavigateToJournal();
  };

  const handleDismissUpgradeHint = (hintType: string) => {
    setDismissedUpgradeHints(prev => [...prev, hintType]);
    setShowUpgradeHint(false);
  };

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Heart className="h-8 w-8 text-sage-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-300">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Heart className="h-8 w-8 text-sage-400" />
          <h1 className="text-3xl font-bold text-white">Your Sanctuary</h1>
        </div>
        <p className="text-gray-300">
          A safe space for healing, growth, and authentic self-expression
        </p>
        {isSanctuaryTier && (
          <Badge variant="outline" className="mt-2 border-sage-400 text-sage-300">
            <Gift className="h-3 w-3 mr-1" />
            Sanctuary Tier
          </Badge>
        )}
      </div>

      {/* Gentle Upgrade Celebration (only on milestones, never during crisis) */}
      {showUpgradeHint && isSanctuaryTier && sessionState.mood !== 'crisis' && sessionState.mood !== 'difficult' && (
        <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="font-medium text-purple-200">You're Growing Beautifully</h3>
                  <p className="text-sm text-purple-100/80">
                    Your commitment is inspiring. Curious about deeper insights?
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDismissUpgradeHint('milestone')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-300"
                >
                  Not now
                </Button>
                {onNavigateToUpgrade && (
                  <Button
                    onClick={onNavigateToUpgrade}
                    variant="outline"
                    size="sm"
                    className="border-purple-400 text-purple-300 hover:bg-purple-900/20"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Explore features
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-sage-900/20 to-green-900/20 border-sage-500/30 cursor-pointer hover:border-sage-400/50 transition-all"
              onClick={handleStartWriting}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Feather className="h-6 w-6 text-sage-400" />
              <h3 className="font-medium text-sage-200">Write</h3>
            </div>
            <p className="text-sm text-sage-100/80 mb-4">
              Start your reflection with gentle prompts to guide you.
            </p>
            <div className="flex justify-end">
              <ArrowRight className="h-4 w-4 text-sage-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <h3 className="font-medium text-blue-200">Progress</h3>
            </div>
            <p className="text-sm text-blue-100/80 mb-4">
              Celebrate your journey with grace-based tracking and gentle badges.
            </p>
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-blue-400 text-blue-300">
                {progressData.currentStreak} day presence
              </Badge>
              <span className="text-xs text-blue-400">{badges.length} badges</span>
            </div>
          </CardContent>
        </Card>

        <TierFeatureGate
          userTier={userTier}
          requiredTier="deep-cut"
          emotionalState={sessionState.mood}
          showUpgrade={true}
        >
          <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-purple-400" />
                <h3 className="font-medium text-purple-200">Community</h3>
              </div>
              <p className="text-sm text-purple-100/80">
                Connect anonymously with others on similar healing journeys.
              </p>
            </CardContent>
          </Card>
        </TierFeatureGate>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Support
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SanctuaryProgressTracker
              userId={userId}
              currentStreak={progressData.currentStreak}
              graceTokens={progressData.graceTokens}
              lastJournalDate={progressData.lastJournalDate}
              totalEntries={progressData.totalEntries}
              onPauseRequest={requestPause}
              onReturnFromPause={returnFromPause}
              isPaused={progressData.isPaused}
              earnedBadges={badges}
            />
            
            <SanctuaryBadgeSystem
              userId={userId}
              earnedBadges={badges}
              currentStreak={progressData.currentStreak}
              totalEntries={progressData.totalEntries}
              isPaused={progressData.isPaused}
              recentReturnFromPause={false}
              onBadgeCelebration={(badge) => {
                console.log('Badge earned:', badge);
                // Could trigger celebration animation
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <SanctuaryBadgeSystem
            userId={userId}
            earnedBadges={badges}
            currentStreak={progressData.currentStreak}
            totalEntries={progressData.totalEntries}
            isPaused={progressData.isPaused}
            recentReturnFromPause={false}
            onBadgeCelebration={awardBadge}
          />
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <SanctuaryEmotionalSupport
            userId={userId}
            currentMood={sessionState.mood}
            sessionStartTime={sessionState.startTime}
            sessionIntensity={sessionState.intensity}
            hasWrittenToday={sessionState.hasWrittenToday}
            daysSinceLastEntry={progressData.lastJournalDate ? 
              Math.floor((new Date().getTime() - new Date(progressData.lastJournalDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
            }
            onPromptSelect={(prompt) => {
              console.log('Prompt selected:', prompt);
              onNavigateToJournal();
            }}
            onSessionPause={requestPause}
            onBoundaryCheck={() => {
              console.log('Boundary check requested');
            }}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy Settings */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Privacy & Safety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Journal encryption</span>
                    <Badge variant="outline" className="border-green-400 text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Anonymous community</span>
                    <Badge variant="outline" className="border-blue-400 text-blue-300">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Crisis support access</span>
                    <Badge variant="outline" className="border-red-400 text-red-300">
                      Always available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Preferences */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-400" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Reminder style</span>
                    <Badge variant="outline">
                      Gentle
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Progress celebration</span>
                    <Badge variant="outline">
                      Encouraging
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Grace tokens</span>
                    <Badge variant="outline" className="border-purple-400 text-purple-300">
                      2 per week
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sanctuary Tier Information */}
          <Card className="bg-sage-900/20 border-sage-500/30">
            <CardHeader>
              <CardTitle className="text-sage-200 flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Your Sanctuary Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sage-100/80">
                  You have access to all essential healing features including grace-based progress 
                  tracking, trauma-informed badges, emotional support prompts, and complete privacy controls.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sage-200">{progressData.graceTokens}</div>
                    <div className="text-xs text-sage-400">Grace tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sage-200">2</div>
                    <div className="text-xs text-sage-400">Quests/week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sage-200">3mo</div>
                    <div className="text-xs text-sage-400">Storage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sage-200">∞</div>
                    <div className="text-xs text-sage-400">Support</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}