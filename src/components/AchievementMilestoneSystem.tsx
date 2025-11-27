// ALCHM Achievement & Milestone System
// Meaningful recognition and celebration system for personal development progress

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Achievement,
  Milestone,
  GamificationProfile,
  CelebrationStyle,
  Badge
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal, LearningPathway } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface AchievementMilestoneSystemProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  activeGoals: SMARTGoal[];
  learningPathways: LearningPathway[];
  onAchievementUnlocked?: (achievement: Achievement) => void;
  onMilestoneReached?: (milestone: Milestone) => void;
  onCelebrationComplete?: (celebrationId: string) => void;
}

interface AchievementProgress {
  achievementId: string;
  currentProgress: number; // 0-1
  requirements: RequirementProgress[];
  estimatedCompletion: Date;
  nextSteps: string[];
  isNearCompletion: boolean;
}

interface RequirementProgress {
  requirementId: string;
  description: string;
  completed: boolean;
  progress: number; // 0-1
  evidence: EvidenceItem[];
}

interface EvidenceItem {
  evidenceType: 'journal_entry' | 'goal_completion' | 'skill_demonstration' | 'peer_recognition' | 'milestone_reached';
  description: string;
  date: Date;
  confidence: number; // 0-1
  culturalContext?: string;
}

interface CelebrationEvent {
  celebrationId: string;
  type: 'achievement_unlock' | 'milestone_reached' | 'streak_milestone' | 'transformation_moment' | 'community_recognition';
  title: string;
  description: string;
  celebrationStyle: CelebrationStyle;
  personalizedElements: PersonalizedElement[];
  culturalElements: CulturalElement[];
  sharingOptions: SharingOption[];
  isActive: boolean;
  scheduledFor: Date;
  completedAt?: Date;
}

interface PersonalizedElement {
  elementType: 'personal_message' | 'favorite_quote' | 'growth_reflection' | 'future_vision' | 'gratitude_moment';
  content: string;
  isUserGenerated: boolean;
}

interface BadgeShowcase {
  badgeId: string;
  badge: Badge;
  unlockedAt: Date;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  displayPriority: number;
  isVisible: boolean;
  sharingEnabled: boolean;
}

interface MilestoneJourney {
  journeyId: string;
  pathway: 'identity' | 'emotional' | 'career' | 'holistic';
  milestones: MilestoneNode[];
  currentMilestone: string;
  nextMilestone: string;
  overallProgress: number; // 0-1
  estimatedCompletion: Date;
  culturalAdaptations: MilestoneCulturalAdaptation[];
}

interface MilestoneNode {
  milestoneId: string;
  title: string;
  description: string;
  requirements: string[];
  rewards: MilestoneReward[];
  position: { x: number; y: number };
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  celebrationCompleted: boolean;
}

const AchievementMilestoneSystem: React.FC<AchievementMilestoneSystemProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  activeGoals,
  learningPathways,
  onAchievementUnlocked,
  onMilestoneReached,
  onCelebrationComplete
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'milestones' | 'badges' | 'celebrations'>('overview');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<AchievementProgress[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneJourneys, setMilestoneJourneys] = useState<MilestoneJourney[]>([]);
  const [badges, setBadges] = useState<BadgeShowcase[]>([]);
  const [pendingCelebrations, setPendingCelebrations] = useState<CelebrationEvent[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationEvent | null>(null);
  const [achievementStats, setAchievementStats] = useState<any>(null);

  // Initialize achievement system
  useEffect(() => {
    loadAchievementData();
  }, [userId, identityProfile, emotionalEntries, careerProfile, activeGoals]);

  const loadAchievementData = async () => {
    try {
      // Load user achievements and progress
      const achievementData = await loadUserAchievements(userId);
      setAchievements(achievementData.achievements);
      setAchievementProgress(achievementData.progress);

      // Load milestones and journeys
      const milestoneData = await loadUserMilestones(userId);
      setMilestones(milestoneData.milestones);
      setMilestoneJourneys(milestoneData.journeys);

      // Load badge collection
      const badgeData = await loadUserBadges(userId);
      setBadges(badgeData);

      // Check for new achievements and milestones
      await checkForNewAchievements(
        identityProfile,
        emotionalEntries,
        careerProfile,
        activeGoals,
        learningPathways
      );

      // Load pending celebrations
      const celebrations = await loadPendingCelebrations(userId);
      setPendingCelebrations(celebrations);

      // Generate achievement statistics
      const stats = await generateAchievementStats(achievementData, milestoneData, badgeData);
      setAchievementStats(stats);

    } catch (error) {
      console.error('Error loading achievement data:', error);
    }
  };

  // Check for new achievements
  const checkForNewAchievements = useCallback(async (
    identity: IdentityExplorationProfile,
    emotions: EmotionalEntry[],
    career: CareerExplorationProfile,
    goals: SMARTGoal[],
    pathways: LearningPathway[]
  ) => {
    try {
      const newAchievements = await evaluateAchievementCriteria(
        { identity, emotions, career, goals, pathways },
        achievements,
        culturalContext
      );

      for (const achievement of newAchievements) {
        await unlockAchievement(achievement);
      }

      const newMilestones = await evaluateMilestoneCriteria(
        { identity, emotions, career, goals, pathways },
        milestones,
        culturalContext
      );

      for (const milestone of newMilestones) {
        await reachMilestone(milestone);
      }

    } catch (error) {
      console.error('Error checking for new achievements:', error);
    }
  }, [achievements, milestones, culturalContext]);

  // Unlock achievement
  const unlockAchievement = useCallback(async (achievement: Achievement) => {
    try {
      const unlockedAchievement = {
        ...achievement,
        unlockedAt: new Date()
      };

      setAchievements(prev => [...prev, unlockedAchievement]);
      
      // Create celebration event
      const celebrationEvent = await createCelebrationEvent(
        'achievement_unlock',
        unlockedAchievement,
        culturalContext
      );
      
      setPendingCelebrations(prev => [...prev, celebrationEvent]);
      setActiveCelebration(celebrationEvent);
      setShowCelebrationModal(true);

      onAchievementUnlocked?.(unlockedAchievement);

    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  }, [culturalContext, onAchievementUnlocked]);

  // Reach milestone
  const reachMilestone = useCallback(async (milestone: Milestone) => {
    try {
      const completedMilestone = {
        ...milestone,
        completedAt: new Date(),
        currentProgress: 1
      };

      setMilestones(prev => 
        prev.map(m => 
          m.milestoneId === milestone.milestoneId ? completedMilestone : m
        )
      );

      // Create celebration event
      const celebrationEvent = await createCelebrationEvent(
        'milestone_reached',
        completedMilestone,
        culturalContext
      );
      
      setPendingCelebrations(prev => [...prev, celebrationEvent]);
      setActiveCelebration(celebrationEvent);
      setShowCelebrationModal(true);

      onMilestoneReached?.(completedMilestone);

    } catch (error) {
      console.error('Error reaching milestone:', error);
    }
  }, [culturalContext, onMilestoneReached]);

  // Render overview dashboard
  const renderOverview = () => {
    return (
      <div className="space-y-6">
        {/* Achievement statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <div className="text-2xl font-medium">{achievements.length}</div>
                <div className="text-sm opacity-80">Achievements Unlocked</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="text-2xl font-medium">{milestones.filter(m => m.completedAt).length}</div>
                <div className="text-sm opacity-80">Milestones Reached</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏅</div>
              <div>
                <div className="text-2xl font-medium">{badges.length}</div>
                <div className="text-sm opacity-80">Badges Earned</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⭐</div>
              <div>
                <div className="text-2xl font-medium">
                  {Math.round((achievementStats?.overallProgress || 0) * 100)}%
                </div>
                <div className="text-sm opacity-80">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent achievements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🎉 Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements
              .filter(a => a.unlockedAt)
              .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
              .slice(0, 6)
              .map((achievement) => (
                <div
                  key={achievement.achievementId}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      achievement.difficulty === 'legendary' ? 'bg-yellow-100' :
                      achievement.difficulty === 'platinum' ? 'bg-purple-100' :
                      achievement.difficulty === 'gold' ? 'bg-orange-100' :
                      achievement.difficulty === 'silver' ? 'bg-gray-100' :
                      'bg-amber-100'
                    }`}>
                      <span className="text-xl">
                        {achievement.difficulty === 'legendary' ? '👑' :
                         achievement.difficulty === 'platinum' ? '💎' :
                         achievement.difficulty === 'gold' ? '🥇' :
                         achievement.difficulty === 'silver' ? '🥈' : '🥉'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.category.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{achievement.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Unlocked {achievement.unlockedAt?.toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      +{achievement.experiencePoints} XP
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Milestone progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🛤️ Milestone Progress</h3>
          <div className="space-y-4">
            {milestoneJourneys.map((journey) => (
              <div key={journey.journeyId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">
                    {journey.pathway.charAt(0).toUpperCase() + journey.pathway.slice(1)} Journey
                  </h4>
                  <span className="text-sm text-gray-600">
                    {Math.round(journey.overallProgress * 100)}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${journey.overallProgress * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {journey.milestones.filter(m => m.isCompleted).length} of {journey.milestones.length} milestones
                  </span>
                  <span>
                    Est. completion: {journey.estimatedCompletion.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress towards next achievements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🎯 Progress Towards Next Achievements</h3>
          <div className="space-y-4">
            {achievementProgress
              .filter(progress => progress.currentProgress > 0 && progress.currentProgress < 1)
              .sort((a, b) => b.currentProgress - a.currentProgress)
              .slice(0, 5)
              .map((progress) => {
                const achievement = achievements.find(a => a.achievementId === progress.achievementId);
                if (!achievement) return null;

                return (
                  <div key={progress.achievementId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(progress.currentProgress * 100)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress.currentProgress * 100}%` }}
                      />
                    </div>

                    <div className="text-sm text-gray-600">
                      Next steps: {progress.nextSteps.slice(0, 2).join(', ')}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // Render achievements gallery
  const renderAchievementsGallery = () => {
    const achievementCategories = ['identity', 'emotional', 'career', 'learning', 'community', 'mastery', 'transformation'];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-800 mb-2">Achievement Gallery</h3>
          <p className="text-gray-600">Your collection of personal development achievements</p>
        </div>

        {achievementCategories.map((category) => {
          const categoryAchievements = achievements.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4 capitalize">
                {category.replace('_', ' ')} Achievements
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAchievements.map((achievement) => (
                  <div
                    key={achievement.achievementId}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedAchievement(achievement)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.difficulty === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        achievement.difficulty === 'platinum' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                        achievement.difficulty === 'gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        achievement.difficulty === 'silver' ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        'bg-gradient-to-br from-amber-400 to-amber-600'
                      }`}>
                        <span className="text-2xl text-white">
                          {achievement.category === 'identity' ? '🌟' :
                           achievement.category === 'emotional' ? '💚' :
                           achievement.category === 'career' ? '🚀' :
                           achievement.category === 'learning' ? '📚' :
                           achievement.category === 'community' ? '🤝' :
                           achievement.category === 'mastery' ? '👑' : '✨'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{achievement.title}</h5>
                        <p className="text-sm text-gray-600 capitalize">{achievement.difficulty}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {achievement.unlockedAt?.toLocaleDateString() || 'Locked'}
                      </span>
                      {achievement.rarity && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                          {Math.round(achievement.rarity * 100)}% rarity
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render celebration modal
  const renderCelebrationModal = () => {
    if (!showCelebrationModal || !activeCelebration) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl font-medium text-gray-800 mb-2">{activeCelebration.title}</h3>
            <p className="text-gray-600">{activeCelebration.description}</p>
          </div>

          {/* Personalized celebration elements */}
          <div className="space-y-4 mb-6">
            {activeCelebration.personalizedElements.map((element, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-800">{element.content}</div>
              </div>
            ))}
          </div>

          {/* Cultural celebration elements */}
          {activeCelebration.culturalElements.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Cultural Celebration</h4>
              <div className="space-y-2">
                {activeCelebration.culturalElements.map((element, index) => (
                  <div key={index} className="text-purple-700">
                    {element.symbol} {element.meaning}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sharing options */}
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => {
                setShowCelebrationModal(false);
                onCelebrationComplete?.(activeCelebration.celebrationId);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Celebrate Privately
            </button>
            <button
              onClick={() => {
                // Handle sharing logic
                setShowCelebrationModal(false);
                onCelebrationComplete?.(activeCelebration.celebrationId);
              }}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Share with Community
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderCelebrationModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">
            Achievements & Milestones
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrate your personal development journey with meaningful achievements, 
            milestones, and recognition that honor your growth and transformation.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'milestones', label: 'Milestones', icon: '🎯' },
              { id: 'badges', label: 'Badge Collection', icon: '🏅' },
              { id: 'celebrations', label: 'Celebrations', icon: '🎉' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'achievements' && renderAchievementsGallery()}
        {activeTab === 'milestones' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Milestone journey visualization would be implemented here</p>
          </div>
        )}
        {activeTab === 'badges' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Badge collection showcase would be implemented here</p>
          </div>
        )}
        {activeTab === 'celebrations' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Celebration history and preferences would be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions and API implementations would be added here...

// API functions (implementations would be expanded)
const loadUserAchievements = async (userId: string): Promise<any> => {
  // Implementation would load user achievements from database
  return { achievements: [], progress: [] };
};

const loadUserMilestones = async (userId: string): Promise<any> => {
  // Implementation would load user milestones from database
  return { milestones: [], journeys: [] };
};

const loadUserBadges = async (userId: string): Promise<BadgeShowcase[]> => {
  // Implementation would load user badge collection
  return [];
};

const loadPendingCelebrations = async (userId: string): Promise<CelebrationEvent[]> => {
  // Implementation would load pending celebrations
  return [];
};

const generateAchievementStats = async (achievements: any, milestones: any, badges: any): Promise<any> => {
  // Implementation would generate comprehensive achievement statistics
  return { overallProgress: 0.65 };
};

const evaluateAchievementCriteria = async (
  userData: any,
  existingAchievements: Achievement[],
  culturalContext: CulturalContext
): Promise<Achievement[]> => {
  // Implementation would evaluate if user meets new achievement criteria
  return [];
};

const evaluateMilestoneCriteria = async (
  userData: any,
  existingMilestones: Milestone[],
  culturalContext: CulturalContext
): Promise<Milestone[]> => {
  // Implementation would evaluate if user meets new milestone criteria
  return [];
};

const createCelebrationEvent = async (
  type: string,
  achievement: any,
  culturalContext: CulturalContext
): Promise<CelebrationEvent> => {
  // Implementation would create culturally appropriate celebration event
  return {} as CelebrationEvent;
};

export default AchievementMilestoneSystem;