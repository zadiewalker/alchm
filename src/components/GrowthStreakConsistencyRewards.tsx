// ALCHM Growth Streak & Consistency Rewards
// Meaningful consistency recognition that encourages sustainable personal development habits

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GrowthStreak,
  Achievement,
  GamificationProfile,
  CelebrationStyle
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface GrowthStreakConsistencyRewardsProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  gamificationProfile: GamificationProfile;
  activeGoals: SMARTGoal[];
  onStreakMilestoneReached?: (streak: GrowthStreak, milestone: StreakMilestone) => void;
  onConsistencyRewardEarned?: (reward: ConsistencyReward) => void;
  onStreakRecovered?: (streakId: string) => void;
}

interface StreakMilestone {
  milestoneId: string;
  streakType: string;
  daysRequired: number;
  title: string;
  description: string;
  celebration: MilestoneCelebration;
  rewards: StreakReward[];
  culturalRecognition: CulturalRecognition;
  unlockedAt?: Date;
}

interface ConsistencyReward {
  rewardId: string;
  type: 'daily_bonus' | 'weekly_achievement' | 'monthly_recognition' | 'seasonal_celebration' | 'yearly_mastery' | 'perfect_week' | 'comeback_courage';
  title: string;
  description: string;
  earnedFor: string; // streak type
  daysConsistent: number;
  value: RewardValue;
  personalizedMessage: string;
  culturalElements: CulturalRewardElement[];
  earnedAt: Date;
  expiresAt?: Date;
}

interface StreakInsight {
  insightId: string;
  streakType: string;
  insightType: 'pattern_recognition' | 'optimal_timing' | 'motivation_driver' | 'challenge_predictor' | 'strength_identifier' | 'growth_accelerator';
  title: string;
  description: string;
  actionableAdvice: string[];
  confidence: number; // 0-1
  culturalConsideration: string;
  personalRelevance: number; // 0-1
}

interface StreakSupport {
  supportId: string;
  supportType: 'gentle_reminder' | 'motivational_boost' | 'flexibility_option' | 'recovery_assistance' | 'cultural_encouragement' | 'peer_inspiration';
  triggeredBy: 'missed_day' | 'low_motivation' | 'streak_at_risk' | 'milestone_approaching' | 'plateau_detected' | 'external_challenge';
  message: string;
  actionOptions: SupportAction[];
  culturalAdaptation: CulturalAdaptation;
  timing: SupportTiming;
  effectiveness: number; // 0-1 based on user response
}

interface StreakVisualization {
  visualizationId: string;
  streakType: string;
  visualStyle: 'calendar_view' | 'progress_chain' | 'mountain_climb' | 'garden_growth' | 'constellation_map' | 'river_flow';
  culturalTheming: StreakCulturalTheming;
  personalElements: PersonalVisualizationElement[];
  interactiveFeatures: VisualizationInteraction[];
  motivationalElements: VisualMotivationElement[];
}

interface FlexibilityRule {
  ruleId: string;
  ruleName: string;
  description: string;
  allowedMisses: number;
  timeWindow: number; // days
  conditions: FlexibilityCondition[];
  culturalConsiderations: string[];
  personalizedApplication: PersonalizedFlexibility;
}

interface RecoveryMechanic {
  mechanicId: string;
  mechanicType: 'grace_period' | 'double_effort' | 'community_support' | 'reflection_reset' | 'gentle_restart' | 'cultural_forgiveness';
  triggerCondition: string;
  recoveryWindow: number; // hours
  requirements: RecoveryRequirement[];
  culturalFramework: CulturalRecoveryFramework;
  successRate: number; // 0-1
  emotionalSupport: EmotionalSupport;
}

const GrowthStreakConsistencyRewards: React.FC<GrowthStreakConsistencyRewardsProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  gamificationProfile,
  activeGoals,
  onStreakMilestoneReached,
  onConsistencyRewardEarned,
  onStreakRecovered
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'active_streaks' | 'streak_insights' | 'consistency_rewards' | 'streak_support'>('overview');
  const [growthStreaks, setGrowthStreaks] = useState<GrowthStreak[]>([]);
  const [streakMilestones, setStreakMilestones] = useState<StreakMilestone[]>([]);
  const [consistencyRewards, setConsistencyRewards] = useState<ConsistencyReward[]>([]);
  const [streakInsights, setStreakInsights] = useState<StreakInsight[]>([]);
  const [streakSupport, setStreakSupport] = useState<StreakSupport[]>([]);
  const [selectedStreak, setSelectedStreak] = useState<GrowthStreak | null>(null);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakVisualizations, setStreakVisualizations] = useState<StreakVisualization[]>([]);
  const [flexibilityRules, setFlexibilityRules] = useState<FlexibilityRule[]>([]);
  const [recoveryMechanics, setRecoveryMechanics] = useState<RecoveryMechanic[]>([]);
  const [streakStats, setStreakStats] = useState<StreakStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const visualizationRef = useRef<HTMLDivElement>(null);

  // Initialize streak and consistency system
  useEffect(() => {
    loadStreakConsistencyData();
  }, [userId, activeGoals, culturalContext]);

  const loadStreakConsistencyData = async () => {
    try {
      setIsLoading(true);

      // Load growth streaks
      const streaks = await loadUserGrowthStreaks(userId);
      setGrowthStreaks(streaks);

      // Load streak milestones
      const milestones = await loadStreakMilestones(userId, culturalContext);
      setStreakMilestones(milestones);

      // Load consistency rewards
      const rewards = await loadConsistencyRewards(userId);
      setConsistencyRewards(rewards);

      // Load streak insights
      const insights = await generateStreakInsights(streaks, culturalContext, identityProfile);
      setStreakInsights(insights);

      // Load streak support
      const support = await loadStreakSupport(userId, streaks);
      setStreakSupport(support);

      // Load visualizations
      const visualizations = await loadStreakVisualizations(userId, culturalContext);
      setStreakVisualizations(visualizations);

      // Load flexibility rules and recovery mechanics
      const rules = await loadFlexibilityRules(culturalContext);
      setFlexibilityRules(rules);

      const mechanics = await loadRecoveryMechanics(culturalContext);
      setRecoveryMechanics(mechanics);

      // Generate streak statistics
      const stats = await generateStreakStatistics(streaks, rewards, milestones);
      setStreakStats(stats);

    } catch (error) {
      console.error('Error loading streak consistency data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle streak milestone reached
  const handleStreakMilestone = useCallback(async (streak: GrowthStreak, milestone: StreakMilestone) => {
    try {
      // Update milestone as unlocked
      setStreakMilestones(prev =>
        prev.map(m =>
          m.milestoneId === milestone.milestoneId
            ? { ...m, unlockedAt: new Date() }
            : m
        )
      );

      // Award milestone rewards
      for (const reward of milestone.rewards) {
        await awardStreakReward(reward, userId);
      }

      onStreakMilestoneReached?.(streak, milestone);

    } catch (error) {
      console.error('Error handling streak milestone:', error);
    }
  }, [userId, onStreakMilestoneReached]);

  // Recover streak
  const recoverStreak = useCallback(async (streakId: string, mechanicId: string) => {
    try {
      const success = await executeStreakRecovery(streakId, mechanicId, userId);
      
      if (success) {
        // Update streak status
        setGrowthStreaks(prev =>
          prev.map(s =>
            s.streakId === streakId
              ? { ...s, isActive: true, isPaused: false }
              : s
          )
        );

        onStreakRecovered?.(streakId);
      }

    } catch (error) {
      console.error('Error recovering streak:', error);
    }
  }, [userId, onStreakRecovered]);

  // Render streak overview
  const renderStreakOverview = () => {
    const activeStreaksCount = growthStreaks.filter(s => s.isActive).length;
    const totalDaysThisMonth = growthStreaks.reduce((sum, s) => sum + (s.currentStreak || 0), 0);
    const longestCurrentStreak = Math.max(...growthStreaks.map(s => s.currentStreak), 0);

    return (
      <div className="space-y-6">
        {/* Streak statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="text-2xl font-bold">{activeStreaksCount}</div>
                <div className="text-sm opacity-80">Active Streaks</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📈</div>
              <div>
                <div className="text-2xl font-bold">{longestCurrentStreak}</div>
                <div className="text-sm opacity-80">Longest Current</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💎</div>
              <div>
                <div className="text-2xl font-bold">{Math.max(...growthStreaks.map(s => s.longestStreak), 0)}</div>
                <div className="text-sm opacity-80">Personal Best</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <div className="text-2xl font-bold">{consistencyRewards.length}</div>
                <div className="text-sm opacity-80">Rewards Earned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured active streaks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 Your Active Growth Streaks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {growthStreaks
              .filter(s => s.isActive)
              .map((streak) => (
                <div
                  key={streak.streakId}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedStreak(streak);
                    setShowStreakModal(true);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 capitalize">
                        {streak.streakType.replace('_', ' ')}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {getStreakDescription(streak.streakType)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{streak.currentStreak}</div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                  </div>

                  {/* Streak progress visualization */}
                  <div className="mb-3">
                    <div className="flex space-x-1">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const dayOffset = 6 - index;
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() - dayOffset);
                        const isActiveDay = streak.currentStreak > dayOffset;
                        
                        return (
                          <div
                            key={index}
                            className={`w-6 h-6 rounded-sm ${
                              isActiveDay 
                                ? 'bg-green-500' 
                                : 'bg-gray-200'
                            }`}
                            title={targetDate.toLocaleDateString()}
                          />
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
                  </div>

                  {/* Next milestone */}
                  <div className="text-sm">
                    {getNextMilestone(streak, streakMilestones) && (
                      <div className="text-blue-600">
                        🎯 Next milestone: {getNextMilestone(streak, streakMilestones)?.daysRequired} days
                      </div>
                    )}
                    
                    <div className="text-gray-500 mt-1">
                      Started {new Date(streak.streakStartDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {activeStreaksCount === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Start Your Growth Journey</h4>
              <p className="text-gray-600 mb-4">Build consistent habits that support your personal development</p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Start a Streak
              </button>
            </div>
          )}
        </div>

        {/* Recent consistency rewards */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Recent Consistency Rewards</h3>
          <div className="space-y-4">
            {consistencyRewards
              .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime())
              .slice(0, 5)
              .map((reward) => (
                <div key={reward.rewardId} className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">
                      {reward.type === 'daily_bonus' ? '⭐' :
                       reward.type === 'weekly_achievement' ? '🏅' :
                       reward.type === 'monthly_recognition' ? '👑' :
                       reward.type === 'perfect_week' ? '💯' :
                       reward.type === 'comeback_courage' ? '💪' : '🎖️'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-800">{reward.title}</h4>
                    <p className="text-sm text-yellow-700">{reward.description}</p>
                    <div className="text-xs text-yellow-600 mt-1">
                      {reward.daysConsistent} days • {reward.earnedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">🎉</div>
                    <div className="text-xs text-yellow-600">Earned</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Streak insights preview */}
        {streakInsights.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 Streak Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {streakInsights.slice(0, 4).map((insight) => (
                <div key={insight.insightId} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                      <span className="text-sm">
                        {insight.insightType === 'pattern_recognition' ? '📊' :
                         insight.insightType === 'optimal_timing' ? '⏰' :
                         insight.insightType === 'motivation_driver' ? '🚀' :
                         insight.insightType === 'strength_identifier' ? '💪' : '🎯'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-800 mb-1">{insight.title}</h4>
                      <p className="text-sm text-blue-700 mb-2">{insight.description}</p>
                      <div className="text-xs text-blue-600">
                        {Math.round(insight.confidence * 100)}% confidence • {insight.personalRelevance > 0.7 ? 'Highly relevant' : 'Relevant'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render active streaks
  const renderActiveStreaks = () => {
    return (
      <div className="space-y-6">
        {/* Streak management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Manage Your Growth Streaks</h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Start New Streak
            </button>
          </div>

          <div className="space-y-6">
            {growthStreaks.map((streak) => (
              <div key={streak.streakId} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                      {streak.streakType.replace('_', ' ')} Streak
                    </h4>
                    <p className="text-gray-600">{getStreakDescription(streak.streakType)}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-1">{streak.currentStreak}</div>
                    <div className="text-sm text-gray-500">current days</div>
                    <div className="text-xs text-gray-400">best: {streak.longestStreak}</div>
                  </div>
                </div>

                {/* Streak calendar visualization */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Last 30 Days</div>
                  <div className="grid grid-cols-15 gap-1">
                    {Array.from({ length: 30 }).map((_, index) => {
                      const dayOffset = 29 - index;
                      const isActiveDay = streak.currentStreak > dayOffset;
                      const date = new Date();
                      date.setDate(date.getDate() - dayOffset);
                      
                      return (
                        <div
                          key={index}
                          className={`w-4 h-4 rounded-sm ${
                            isActiveDay ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          title={`${date.toLocaleDateString()}: ${isActiveDay ? 'Active' : 'Inactive'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Streak requirements and flexibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Requirements</div>
                    <div className="space-y-1">
                      {streak.streakRequirements?.map((req, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {req.description}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Flexibility Options</div>
                    <div className="space-y-1">
                      {streak.flexibilityRules?.map((rule, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {rule.description}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Streak actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedStreak(streak);
                      setShowStreakModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </button>
                  
                  {streak.isPaused && (
                    <button
                      onClick={() => recoverStreak(streak.streakId, 'gentle_restart')}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                      Resume Streak
                    </button>
                  )}
                  
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Adjust Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render streak modal
  const renderStreakModal = () => {
    if (!showStreakModal || !selectedStreak) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 capitalize">
                {selectedStreak.streakType.replace('_', ' ')} Streak
              </h3>
              <button
                onClick={() => setShowStreakModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Streak overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">{selectedStreak.currentStreak}</div>
                  <div className="text-sm text-green-700">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{selectedStreak.longestStreak}</div>
                  <div className="text-sm text-blue-700">Personal Best</div>
                </div>
                <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">{selectedStreak.totalActiveDays}</div>
                  <div className="text-sm text-purple-700">Total Active Days</div>
                </div>
              </div>

              {/* Upcoming milestones */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Upcoming Milestones</h4>
                <div className="space-y-3">
                  {getUpcomingMilestones(selectedStreak, streakMilestones).map((milestone, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-gray-800">{milestone.title}</h5>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{milestone.daysRequired - selectedStreak.currentStreak}</div>
                          <div className="text-xs text-gray-500">days to go</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streak support */}
              {getStreakSupport(selectedStreak, streakSupport).length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Support & Encouragement</h4>
                  <div className="space-y-3">
                    {getStreakSupport(selectedStreak, streakSupport).map((support, index) => (
                      <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-medium text-yellow-800 mb-2">{support.supportType.replace('_', ' ').toUpperCase()}</h5>
                        <p className="text-yellow-700 text-sm mb-3">{support.message}</p>
                        <div className="flex space-x-2">
                          {support.actionOptions.map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {renderStreakModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Growth Streaks & Consistency
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Build sustainable habits and celebrate consistent progress on your personal development journey 
            with meaningful rewards and cultural recognition.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'active_streaks', label: 'Active Streaks', icon: '🔥' },
              { id: 'streak_insights', label: 'Insights', icon: '💡' },
              { id: 'consistency_rewards', label: 'Rewards', icon: '🏆' },
              { id: 'streak_support', label: 'Support', icon: '🤝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading your growth streaks...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderStreakOverview()}
            {activeTab === 'active_streaks' && renderActiveStreaks()}
            {activeTab === 'streak_insights' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Detailed streak insights would be implemented here</p>
              </div>
            )}
            {activeTab === 'consistency_rewards' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Consistency rewards gallery would be implemented here</p>
              </div>
            )}
            {activeTab === 'streak_support' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Streak support and motivation tools would be implemented here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getStreakDescription = (streakType: string): string => {
  const descriptions = {
    daily_reflection: 'Regular self-reflection and journaling practice',
    goal_progress: 'Consistent progress on your personal goals',
    skill_practice: 'Daily practice of specific skills',
    community_engagement: 'Active participation in community activities',
    mindfulness: 'Daily mindfulness and meditation practice',
    learning: 'Continuous learning and knowledge expansion'
  };
  return descriptions[streakType as keyof typeof descriptions] || 'Personal growth activity';
};

const getNextMilestone = (streak: GrowthStreak, milestones: StreakMilestone[]): StreakMilestone | null => {
  return milestones
    .filter(m => m.streakType === streak.streakType && m.daysRequired > streak.currentStreak)
    .sort((a, b) => a.daysRequired - b.daysRequired)[0] || null;
};

const getUpcomingMilestones = (streak: GrowthStreak, milestones: StreakMilestone[]): StreakMilestone[] => {
  return milestones
    .filter(m => m.streakType === streak.streakType && m.daysRequired > streak.currentStreak)
    .sort((a, b) => a.daysRequired - b.daysRequired)
    .slice(0, 3);
};

const getStreakSupport = (streak: GrowthStreak, support: StreakSupport[]): StreakSupport[] => {
  return support.filter(s => 
    s.supportType.includes(streak.streakType) ||
    (streak.isPaused && s.supportType === 'recovery_assistance') ||
    (streak.currentStreak > 20 && s.supportType === 'motivational_boost')
  );
};

// Supporting types
interface StreakStatistics {
  totalActiveStreaks: number;
  longestCurrentStreak: number;
  personalBest: number;
  rewardsEarned: number;
  monthlyConsistency: number;
}

interface RewardValue {
  type: 'experience_points' | 'badge' | 'feature_unlock' | 'community_recognition';
  amount: number;
  description: string;
}

interface CulturalRewardElement {
  type: 'blessing' | 'wisdom_quote' | 'cultural_symbol' | 'traditional_recognition';
  content: string;
  culturalContext: string;
}

interface SupportAction {
  actionId: string;
  label: string;
  type: 'immediate' | 'scheduled' | 'ongoing';
  description: string;
}

interface SupportTiming {
  when: 'immediate' | 'next_day' | 'evening_reminder' | 'morning_motivation';
  frequency: 'once' | 'daily' | 'until_recovered';
}

// API functions (implementations would be expanded)
const loadUserGrowthStreaks = async (userId: string): Promise<GrowthStreak[]> => {
  // Implementation would load user's growth streaks
  return [];
};

const loadStreakMilestones = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<StreakMilestone[]> => {
  // Implementation would load streak milestones
  return [];
};

const loadConsistencyRewards = async (userId: string): Promise<ConsistencyReward[]> => {
  // Implementation would load consistency rewards
  return [];
};

const generateStreakInsights = async (
  streaks: GrowthStreak[],
  culturalContext: CulturalContext,
  identityProfile: IdentityExplorationProfile
): Promise<StreakInsight[]> => {
  // Implementation would generate AI insights about streaks
  return [];
};

const loadStreakSupport = async (
  userId: string,
  streaks: GrowthStreak[]
): Promise<StreakSupport[]> => {
  // Implementation would load streak support mechanisms
  return [];
};

const loadStreakVisualizations = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<StreakVisualization[]> => {
  // Implementation would load streak visualizations
  return [];
};

const loadFlexibilityRules = async (culturalContext: CulturalContext): Promise<FlexibilityRule[]> => {
  // Implementation would load flexibility rules
  return [];
};

const loadRecoveryMechanics = async (culturalContext: CulturalContext): Promise<RecoveryMechanic[]> => {
  // Implementation would load recovery mechanics
  return [];
};

const generateStreakStatistics = async (
  streaks: GrowthStreak[],
  rewards: ConsistencyReward[],
  milestones: StreakMilestone[]
): Promise<StreakStatistics> => {
  // Implementation would generate streak statistics
  return {
    totalActiveStreaks: 0,
    longestCurrentStreak: 0,
    personalBest: 0,
    rewardsEarned: 0,
    monthlyConsistency: 0
  };
};

const awardStreakReward = async (reward: any, userId: string): Promise<void> => {
  // Implementation would award streak reward
};

const executeStreakRecovery = async (
  streakId: string,
  mechanicId: string,
  userId: string
): Promise<boolean> => {
  // Implementation would execute streak recovery
  return true;
};

export default GrowthStreakConsistencyRewards;