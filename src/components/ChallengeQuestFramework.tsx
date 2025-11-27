// ALCHM Challenge & Quest Framework
// Engaging challenge system that builds real-world skills and fosters community participation

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Quest,
  Challenge,
  GamificationProfile,
  QuestTheme,
  FocusArea
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal, LearningPathway } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface ChallengeQuestFrameworkProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  activeGoals: SMARTGoal[];
  learningPathways: LearningPathway[];
  onQuestStart?: (quest: Quest) => void;
  onChallengeJoin?: (challenge: Challenge) => void;
  onQuestComplete?: (questId: string) => void;
  onChallengeComplete?: (challengeId: string) => void;
}

interface QuestProgress {
  questId: string;
  currentPhase: number;
  phaseProgress: number; // 0-1 for current phase
  overallProgress: number; // 0-1 for entire quest
  completedObjectives: string[];
  activeObjectives: QuestObjective[];
  nextMilestones: QuestMilestone[];
  collaborators: QuestCollaborator[];
  timeRemaining: number; // hours
  estimatedCompletion: Date;
}

interface QuestObjective {
  objectiveId: string;
  title: string;
  description: string;
  type: 'reflection' | 'action' | 'skill_practice' | 'connection' | 'creation' | 'exploration';
  difficulty: 'gentle' | 'moderate' | 'challenging' | 'transformational';
  estimatedTime: number; // minutes
  realWorldImpact: boolean;
  culturalAdaptation?: string;
  progress: number; // 0-1
  completed: boolean;
  evidence: ObjectiveEvidence[];
}

interface ObjectiveEvidence {
  evidenceType: 'text_reflection' | 'photo' | 'audio_note' | 'peer_validation' | 'skill_demonstration';
  content: string;
  timestamp: Date;
  isValid: boolean;
  culturalContext?: string;
}

interface ChallengeParticipation {
  challengeId: string;
  joinedAt: Date;
  progress: ChallengeProgress;
  team?: ChallengeTeam;
  personalGoals: PersonalChallengeGoal[];
  achievements: ChallengeAchievement[];
  supportNetwork: ChallengeSupportNetwork;
  culturalAdaptations: ChallengeCulturalAdaptation[];
}

interface ChallengeProgress {
  tasksCompleted: number;
  totalTasks: number;
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number; // 0-1
  skillDevelopment: SkillDevelopmentProgress[];
  realWorldApplications: RealWorldApplication[];
  communityContributions: CommunityContribution[];
}

interface SeasonalChallenge {
  challengeId: string;
  title: string;
  description: string;
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year_end' | 'new_year';
  theme: ChallengeTheme;
  duration: number; // days
  participantLimit?: number;
  skillFocus: string[];
  communityGoals: CommunityGoal[];
  culturalConsiderations: SeasonalCulturalConsideration[];
  rewards: SeasonalReward[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface CommunityQuest {
  questId: string;
  title: string;
  description: string;
  questType: 'community_building' | 'skill_sharing' | 'collective_goal' | 'cultural_exchange' | 'mentorship_circle';
  participantCount: number;
  targetParticipants: number;
  roles: CommunityQuestRole[];
  collaborativeObjectives: CollaborativeObjective[];
  sharedProgress: SharedProgress;
  culturalBridge: CulturalBridge;
  impactMeasurement: ImpactMeasurement;
  timeline: CommunityQuestTimeline;
  isOpen: boolean;
}

interface QuestTemplate {
  templateId: string;
  title: string;
  description: string;
  category: 'personal_growth' | 'skill_development' | 'emotional_wellness' | 'career_advancement' | 'relationship_building';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  duration: QuestDuration;
  objectives: ObjectiveTemplate[];
  prerequisites: string[];
  culturalAdaptations: CulturalAdaptation[];
  skillTargets: SkillTarget[];
  realWorldApplications: RealWorldApplicationTemplate[];
  isRecommended: boolean;
  popularityScore: number; // 0-1
}

const ChallengeQuestFramework: React.FC<ChallengeQuestFrameworkProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  activeGoals,
  learningPathways,
  onQuestStart,
  onChallengeJoin,
  onQuestComplete,
  onChallengeComplete
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'discover' | 'active' | 'seasonal' | 'community' | 'create'>('discover');
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [questProgress, setQuestProgress] = useState<Record<string, QuestProgress>>({});
  const [challengeParticipation, setChallengeParticipation] = useState<Record<string, ChallengeParticipation>>({});
  const [recommendedQuests, setRecommendedQuests] = useState<QuestTemplate[]>([]);
  const [seasonalChallenges, setSeasonalChallenges] = useState<SeasonalChallenge[]>([]);
  const [communityQuests, setCommunityQuests] = useState<CommunityQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest | QuestTemplate | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | SeasonalChallenge | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [questStats, setQuestStats] = useState<any>(null);

  // Initialize quest and challenge data
  useEffect(() => {
    loadQuestChallengeData();
  }, [userId, identityProfile, careerProfile, activeGoals]);

  const loadQuestChallengeData = async () => {
    try {
      // Load active quests and challenges
      const activeData = await loadActiveQuestsAndChallenges(userId);
      setActiveQuests(activeData.quests);
      setActiveChallenges(activeData.challenges);

      // Load progress data
      const progressData = await loadProgressData(userId);
      setQuestProgress(progressData.questProgress);
      setChallengeParticipation(progressData.challengeParticipation);

      // Load recommendations
      const recommendations = await generateRecommendations(
        identityProfile,
        careerProfile,
        activeGoals,
        learningPathways,
        culturalContext
      );
      setRecommendedQuests(recommendations);

      // Load seasonal challenges
      const seasonal = await loadSeasonalChallenges(culturalContext);
      setSeasonalChallenges(seasonal);

      // Load community quests
      const community = await loadCommunityQuests(culturalContext);
      setCommunityQuests(community);

      // Generate statistics
      const stats = await generateQuestStats(activeData, progressData);
      setQuestStats(stats);

    } catch (error) {
      console.error('Error loading quest and challenge data:', error);
    }
  };

  // Start a quest
  const handleQuestStart = useCallback(async (quest: Quest | QuestTemplate) => {
    try {
      const startedQuest = await startQuest(quest, userId, culturalContext);
      setActiveQuests(prev => [...prev, startedQuest]);
      onQuestStart?.(startedQuest);
      setShowQuestModal(false);
    } catch (error) {
      console.error('Error starting quest:', error);
    }
  }, [userId, culturalContext, onQuestStart]);

  // Join a challenge
  const handleChallengeJoin = useCallback(async (challenge: Challenge | SeasonalChallenge) => {
    try {
      const joinedChallenge = await joinChallenge(challenge, userId, culturalContext);
      setActiveChallenges(prev => [...prev, joinedChallenge]);
      onChallengeJoin?.(joinedChallenge);
      setShowChallengeModal(false);
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  }, [userId, culturalContext, onChallengeJoin]);

  // Render discovery tab
  const renderDiscoveryTab = () => {
    return (
      <div className="space-y-6">
        {/* Recommended for you */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🎯 Recommended for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedQuests.slice(0, 6).map((quest) => (
              <div
                key={quest.templateId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedQuest(quest);
                  setShowQuestModal(true);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">{quest.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    quest.difficulty === 'master' ? 'bg-purple-100 text-purple-700' :
                    quest.difficulty === 'advanced' ? 'bg-red-100 text-red-700' :
                    quest.difficulty === 'intermediate' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {quest.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{quest.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{quest.duration.estimated} {quest.duration.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Skills:</span>
                    <span className="font-medium">{quest.skillTargets.length} skills</span>
                  </div>
                  {quest.isRecommended && (
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 text-sm">⭐</span>
                      <span className="text-blue-600 text-sm font-medium">Highly Recommended</span>
                    </div>
                  )}
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Start Quest
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quest categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {getQuestCategories().map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-medium text-gray-800 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{category.description}</p>
              <div className="text-sm text-blue-600 font-medium">
                {category.questCount} quests available
              </div>
            </div>
          ))}
        </div>

        {/* Featured challenges */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🔥 Featured Challenges</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalChallenges.filter(c => c.isActive).slice(0, 4).map((challenge) => (
              <div
                key={challenge.challengeId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setShowChallengeModal(true);
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                    {challenge.season}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{challenge.duration} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{challenge.participantCount} joined</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Focus:</span>
                    <span className="font-medium">{challenge.skillFocus.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ 
                      width: `${Math.min(100, (challenge.participantCount / (challenge.participantLimit || 100)) * 100)}%` 
                    }}
                  />
                </div>

                <button className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render active quests and challenges
  const renderActiveTab = () => {
    return (
      <div className="space-y-6">
        {/* Active quests */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🚀 Active Quests</h3>
          {activeQuests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🗺️</div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No Active Quests</h4>
              <p className="text-gray-600 mb-4">Start your first quest to begin your adventure</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Discover Quests
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeQuests.map((quest) => {
                const progress = questProgress[quest.questId];
                if (!progress) return null;

                return (
                  <div key={quest.questId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-800">{quest.title}</h4>
                        <p className="text-sm text-gray-600">{quest.questType.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        quest.status === 'active' ? 'bg-green-100 text-green-700' :
                        quest.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {quest.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-4">{quest.description}</p>

                    {/* Quest progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-medium">{Math.round(progress.overallProgress * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress.overallProgress * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Current phase */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">
                        Current Phase: {progress.currentPhase + 1} of {quest.phases.length}
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {quest.phases[progress.currentPhase]?.name || 'Unknown Phase'}
                      </div>
                    </div>

                    {/* Active objectives */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Active Objectives:</div>
                      <div className="space-y-2">
                        {progress.activeObjectives.slice(0, 2).map((objective) => (
                          <div key={objective.objectiveId} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              objective.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300'
                            }`} />
                            <span className="text-sm text-gray-700">{objective.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time remaining */}
                    {progress.timeRemaining > 0 && (
                      <div className="mb-4 text-sm text-gray-600">
                        Time remaining: {Math.round(progress.timeRemaining / 24)} days
                      </div>
                    )}

                    {/* Collaborators */}
                    {progress.collaborators.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Collaborators:</div>
                        <div className="flex space-x-2">
                          {progress.collaborators.slice(0, 3).map((collaborator, index) => (
                            <div key={index} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">
                                {collaborator.name.charAt(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedQuest(quest);
                          setShowQuestModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Continue Quest
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active challenges */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">🏃‍♀️ Active Challenges</h3>
          {activeChallenges.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🏁</div>
              <h4 className="text-lg font-medium text-gray-800 mb-2">No Active Challenges</h4>
              <p className="text-gray-600 mb-4">Join a challenge to push your limits</p>
              <button
                onClick={() => setActiveTab('discover')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Find Challenges
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeChallenges.map((challenge) => {
                const participation = challengeParticipation[challenge.challengeId];
                if (!participation) return null;

                return (
                  <div key={challenge.challengeId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        challenge.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {challenge.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {participation.progress.tasksCompleted}/{participation.progress.totalTasks}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(participation.progress.tasksCompleted / participation.progress.totalTasks) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Streak:</span>
                        <span className="font-medium text-orange-600">
                          {participation.progress.currentStreak} days 🔥
                        </span>
                      </div>
                    </div>

                    <button className="w-full px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                      Continue Challenge
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render quest modal
  const renderQuestModal = () => {
    if (!showQuestModal || !selectedQuest) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-medium text-gray-800">{selectedQuest.title}</h3>
            <button
              onClick={() => setShowQuestModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Quest overview */}
            <div>
              <p className="text-gray-700 mb-4">{selectedQuest.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="font-medium text-blue-800 mb-1">Difficulty</div>
                  <div className="text-blue-700">{(selectedQuest as QuestTemplate).difficulty || 'Moderate'}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="font-medium text-green-800 mb-1">Duration</div>
                  <div className="text-green-700">
                    {(selectedQuest as QuestTemplate).duration?.estimated} {(selectedQuest as QuestTemplate).duration?.unit}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="font-medium text-purple-800 mb-1">Type</div>
                  <div className="text-purple-700">{selectedQuest.questType?.replace('_', ' ')}</div>
                </div>
              </div>
            </div>

            {/* Quest objectives preview */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Quest Objectives</h4>
              <div className="space-y-3">
                {((selectedQuest as QuestTemplate).objectives || selectedQuest.objectives)?.slice(0, 4).map((objective, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{objective.title}</div>
                      <div className="text-sm text-gray-600">{objective.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills and benefits */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Skills You'll Develop</h4>
              <div className="flex flex-wrap gap-2">
                {((selectedQuest as QuestTemplate).skillTargets || []).map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill.skillName || skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Cultural considerations */}
            {(selectedQuest as QuestTemplate).culturalAdaptations?.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-gray-800 mb-3">Cultural Adaptations</h4>
                <div className="space-y-2">
                  {(selectedQuest as QuestTemplate).culturalAdaptations.map((adaptation, index) => (
                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="text-purple-700">{adaptation.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => handleQuestStart(selectedQuest)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start This Quest
              </button>
              <button
                onClick={() => setShowQuestModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderQuestModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">
            Challenges & Quests
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Embark on meaningful adventures that build real-world skills, connect you with others, 
            and create lasting positive change in your life and community.
          </p>
        </div>

        {/* Stats overview */}
        {questStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-2xl font-medium text-blue-600">{questStats.activeQuests}</div>
              <div className="text-sm text-gray-600">Active Quests</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-2xl font-medium text-orange-600">{questStats.activeChallenges}</div>
              <div className="text-sm text-gray-600">Active Challenges</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-2xl font-medium text-green-600">{questStats.completedQuests}</div>
              <div className="text-sm text-gray-600">Completed Quests</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-2xl font-medium text-purple-600">{questStats.totalExperience}</div>
              <div className="text-sm text-gray-600">Total XP Earned</div>
            </div>
          </div>
        )}

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'discover', label: 'Discover', icon: '🔍' },
              { id: 'active', label: 'Active Adventures', icon: '🚀' },
              { id: 'seasonal', label: 'Seasonal Events', icon: '🌟' },
              { id: 'community', label: 'Community Quests', icon: '👥' },
              { id: 'create', label: 'Create Quest', icon: '✨' }
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
        {activeTab === 'discover' && renderDiscoveryTab()}
        {activeTab === 'active' && renderActiveTab()}
        {activeTab === 'seasonal' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Seasonal challenges and events would be implemented here</p>
          </div>
        )}
        {activeTab === 'community' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Community quest system would be implemented here</p>
          </div>
        )}
        {activeTab === 'create' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Quest creation tools would be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getQuestCategories = () => [
  {
    id: 'personal_growth',
    name: 'Personal Growth',
    icon: '🌱',
    description: 'Develop self-awareness and personal strength',
    questCount: 15
  },
  {
    id: 'skill_development',
    name: 'Skill Building',
    icon: '🛠️',
    description: 'Master new abilities and competencies',
    questCount: 23
  },
  {
    id: 'emotional_wellness',
    name: 'Emotional Wellness',
    icon: '💚',
    description: 'Cultivate emotional intelligence and resilience',
    questCount: 18
  },
  {
    id: 'career_advancement',
    name: 'Career Growth',
    icon: '🚀',
    description: 'Advance your professional journey',
    questCount: 20
  },
  {
    id: 'relationship_building',
    name: 'Connections',
    icon: '🤝',
    description: 'Build meaningful relationships and community',
    questCount: 12
  }
];

// API functions (implementations would be expanded)
const loadActiveQuestsAndChallenges = async (userId: string): Promise<any> => {
  return { quests: [], challenges: [] };
};

const loadProgressData = async (userId: string): Promise<any> => {
  return { questProgress: {}, challengeParticipation: {} };
};

const generateRecommendations = async (
  identityProfile: IdentityExplorationProfile,
  careerProfile: CareerExplorationProfile,
  goals: SMARTGoal[],
  pathways: LearningPathway[],
  culturalContext: CulturalContext
): Promise<QuestTemplate[]> => {
  return [];
};

const loadSeasonalChallenges = async (culturalContext: CulturalContext): Promise<SeasonalChallenge[]> => {
  return [];
};

const loadCommunityQuests = async (culturalContext: CulturalContext): Promise<CommunityQuest[]> => {
  return [];
};

const generateQuestStats = async (activeData: any, progressData: any): Promise<any> => {
  return {
    activeQuests: 3,
    activeChallenges: 2,
    completedQuests: 8,
    totalExperience: 1250
  };
};

const startQuest = async (quest: Quest | QuestTemplate, userId: string, culturalContext: CulturalContext): Promise<Quest> => {
  return {} as Quest;
};

const joinChallenge = async (challenge: Challenge | SeasonalChallenge, userId: string, culturalContext: CulturalContext): Promise<Challenge> => {
  return {} as Challenge;
};

export default ChallengeQuestFramework;