// ALCHM Recognition & Sharing System
// Meaningful recognition, inspiration sharing, and community celebration system

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Recognition,
  SharedStory,
  Achievement,
  Milestone,
  GamificationProfile,
  CelebrationStyle
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface RecognitionSharingSystemProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  gamificationProfile: GamificationProfile;
  onRecognitionGiven?: (recognition: Recognition) => void;
  onStoryShared?: (story: SharedStory) => void;
  onInspirationFound?: (storyId: string) => void;
}

interface RecognitionDraft {
  type: 'peer_appreciation' | 'mentor_pride' | 'community_impact' | 'breakthrough_moment' | 'consistent_growth' | 'inspiring_others';
  toUserId: string;
  toUserName: string;
  message: string;
  specificAchievements: string[];
  contextType: 'milestone_completion' | 'helpful_support' | 'inspiring_story' | 'skill_demonstration' | 'community_contribution';
  visibilityLevel: 'private' | 'circle' | 'community' | 'public';
  isAnonymous: boolean;
}

interface StoryDraft {
  storyType: 'breakthrough' | 'transformation' | 'overcoming_challenge' | 'unexpected_discovery' | 'community_impact' | 'gratitude';
  title: string;
  narrative: string;
  keyInsights: string[];
  lessonsLearned: string[];
  isAnonymous: boolean;
  privacyLevel: 'community_only' | 'public_inspiration' | 'research_contribution';
  inspirationCategories: string[];
}

interface CommunityMember {
  userId: string;
  userName: string;
  avatar?: string;
  journeyPath: string;
  currentMilestones: string[];
  isOnline: boolean;
  lastSeen: Date;
}

interface InspirationFeed {
  stories: SharedStory[];
  recognitions: Recognition[];
  celebrations: CelebrationEvent[];
  recommendations: StoryRecommendation[];
}

interface CelebrationEvent {
  celebrationId: string;
  type: 'achievement_unlock' | 'milestone_reached' | 'story_featured' | 'recognition_milestone' | 'community_impact';
  title: string;
  description: string;
  participantName: string;
  isAnonymous: boolean;
  celebrationStyle: CelebrationStyle;
  communityImpact: number;
  inspirationLevel: number;
  createdAt: Date;
}

const RecognitionSharingSystem: React.FC<RecognitionSharingSystemProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  gamificationProfile,
  onRecognitionGiven,
  onStoryShared,
  onInspirationFound
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'feed' | 'give_recognition' | 'share_story' | 'my_recognition' | 'community'>('feed');
  const [inspirationFeed, setInspirationFeed] = useState<InspirationFeed | null>(null);
  const [recognitionDraft, setRecognitionDraft] = useState<RecognitionDraft | null>(null);
  const [storyDraft, setStoryDraft] = useState<StoryDraft | null>(null);
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [receivedRecognitions, setReceivedRecognitions] = useState<Recognition[]>([]);
  const [givenRecognitions, setGivenRecognitions] = useState<Recognition[]>([]);
  const [mySharedStories, setMySharedStories] = useState<SharedStory[]>([]);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SharedStory | null>(null);
  const [feedFilters, setFeedFilters] = useState<FeedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const recognitionFormRef = useRef<HTMLFormElement>(null);
  const storyFormRef = useRef<HTMLFormElement>(null);

  // Initialize recognition and sharing system
  useEffect(() => {
    loadRecognitionSharingData();
  }, [userId, culturalContext]);

  const loadRecognitionSharingData = async () => {
    try {
      setIsLoading(true);

      // Load inspiration feed
      const feed = await loadInspirationFeed(userId, culturalContext, identityProfile);
      setInspirationFeed(feed);

      // Load community members
      const members = await loadCommunityMembers(userId, culturalContext);
      setCommunityMembers(members);

      // Load user's recognition history
      const recognitionData = await loadUserRecognitions(userId);
      setReceivedRecognitions(recognitionData.received);
      setGivenRecognitions(recognitionData.given);

      // Load user's shared stories
      const stories = await loadUserStories(userId);
      setMySharedStories(stories);

    } catch (error) {
      console.error('Error loading recognition sharing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Give recognition
  const giveRecognition = useCallback(async (draft: RecognitionDraft) => {
    try {
      const recognition = await createRecognition(draft, userId, culturalContext);
      setGivenRecognitions(prev => [...prev, recognition]);
      setRecognitionDraft(null);
      setShowRecognitionModal(false);
      onRecognitionGiven?.(recognition);

      // Refresh feed to show new recognition
      const updatedFeed = await loadInspirationFeed(userId, culturalContext, identityProfile);
      setInspirationFeed(updatedFeed);

    } catch (error) {
      console.error('Error giving recognition:', error);
    }
  }, [userId, culturalContext, identityProfile, onRecognitionGiven]);

  // Share story
  const shareStory = useCallback(async (draft: StoryDraft) => {
    try {
      const story = await createSharedStory(draft, userId, identityProfile, culturalContext);
      setMySharedStories(prev => [...prev, story]);
      setStoryDraft(null);
      setShowStoryModal(false);
      onStoryShared?.(story);

      // Refresh feed to show new story
      const updatedFeed = await loadInspirationFeed(userId, culturalContext, identityProfile);
      setInspirationFeed(updatedFeed);

    } catch (error) {
      console.error('Error sharing story:', error);
    }
  }, [userId, identityProfile, culturalContext, onStoryShared]);

  // Render inspiration feed
  const renderInspirationFeed = () => {
    if (!inspirationFeed) return null;

    return (
      <div className="space-y-6">
        {/* Feed filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex space-x-4">
            {[
              { id: 'all', label: 'All', icon: '🌟' },
              { id: 'stories', label: 'Stories', icon: '📖' },
              { id: 'recognitions', label: 'Recognition', icon: '🏆' },
              { id: 'celebrations', label: 'Celebrations', icon: '🎉' },
              { id: 'my_journey', label: 'My Journey', icon: '🛤️' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFeedFilters([filter.id as any])}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  feedFilters.includes(filter.id as any)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setRecognitionDraft({
                type: 'peer_appreciation',
                toUserId: '',
                toUserName: '',
                message: '',
                specificAchievements: [],
                contextType: 'helpful_support',
                visibilityLevel: 'community',
                isAnonymous: false
              });
              setShowRecognitionModal(true);
            }}
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="text-lg font-medium mb-1">Give Recognition</h3>
              <p className="text-sm opacity-90">Appreciate someone's growth journey</p>
            </div>
          </button>

          <button
            onClick={() => {
              setStoryDraft({
                storyType: 'breakthrough',
                title: '',
                narrative: '',
                keyInsights: [],
                lessonsLearned: [],
                isAnonymous: false,
                privacyLevel: 'community_only',
                inspirationCategories: []
              });
              setShowStoryModal(true);
            }}
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="text-lg font-medium mb-1">Share Your Story</h3>
              <p className="text-sm opacity-90">Inspire others with your journey</p>
            </div>
          </button>
        </div>

        {/* Feed content */}
        <div className="space-y-6">
          {/* Recent celebrations */}
          {inspirationFeed.celebrations.length > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-4">🎉 Recent Celebrations</h3>
              <div className="space-y-4">
                {inspirationFeed.celebrations.slice(0, 3).map((celebration) => (
                  <div key={celebration.celebrationId} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-yellow-100">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">
                        {celebration.type === 'achievement_unlock' ? '🏆' :
                         celebration.type === 'milestone_reached' ? '🎯' :
                         celebration.type === 'story_featured' ? '⭐' :
                         celebration.type === 'recognition_milestone' ? '💫' : '🌟'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{celebration.title}</h4>
                      <p className="text-sm text-gray-600">{celebration.description}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {celebration.isAnonymous ? 'Anonymous member' : celebration.participantName} • {celebration.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg">🎊</div>
                      <div className="text-xs text-gray-600">Celebrate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared stories */}
          {inspirationFeed.stories.map((story) => (
            <div
              key={story.storyId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{story.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded capitalize">
                      {story.storyType.replace('_', ' ')}
                    </span>
                    <span>{story.isAnonymous ? 'Anonymous' : 'Community Member'}</span>
                    <span>{story.sharedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>💝 {story.totalInspiration}</span>
                  <span>⭐ {Math.round(story.hopefulnessScore * 100)}%</span>
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{story.narrative}</p>

              {story.keyInsights.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Key Insights:</div>
                  <div className="space-y-1">
                    {story.keyInsights.slice(0, 2).map((insight, index) => (
                      <div key={index} className="text-sm text-blue-600">• {insight}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {story.inspirationCategories.slice(0, 3).map((category, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {category}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspirationFound?.(story.storyId);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Find this inspiring →
                </button>
              </div>
            </div>
          ))}

          {/* Recognition posts */}
          {inspirationFeed.recognitions.map((recognition) => (
            <div key={recognition.recognitionId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">
                    {recognition.type === 'peer_appreciation' ? '🤝' :
                     recognition.type === 'mentor_pride' ? '🌟' :
                     recognition.type === 'community_impact' ? '🌍' :
                     recognition.type === 'breakthrough_moment' ? '💡' :
                     recognition.type === 'consistent_growth' ? '📈' : '✨'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {recognition.isAnonymous ? 'Anonymous' : recognition.fromUserName} recognized{' '}
                        {recognition.toUserId === userId ? 'you' : 
                         recognition.isAnonymous ? 'a community member' : recognition.fromUserName}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {recognition.type.replace('_', ' ').toUpperCase()} • {recognition.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      💫 {Math.round(recognition.inspirationImpact * 100)}% inspiration
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{recognition.message}</p>

                  {recognition.specificAchievements.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Specific Achievements:</div>
                      <div className="flex flex-wrap gap-2">
                        {recognition.specificAchievements.map((achievement, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>💚 {recognition.reactions?.length || 0} reactions</span>
                      <span>💬 {recognition.responses?.length || 0} responses</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-700 text-sm">❤️ Appreciate</button>
                      <button className="text-blue-600 hover:text-blue-700 text-sm">💬 Respond</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render my recognition page
  const renderMyRecognition = () => {
    return (
      <div className="space-y-6">
        {/* Recognition statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💚</div>
              <div>
                <div className="text-2xl font-medium">{receivedRecognitions.length}</div>
                <div className="text-sm opacity-80">Recognition Received</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤝</div>
              <div>
                <div className="text-2xl font-medium">{givenRecognitions.length}</div>
                <div className="text-sm opacity-80">Recognition Given</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📖</div>
              <div>
                <div className="text-2xl font-medium">{mySharedStories.length}</div>
                <div className="text-sm opacity-80">Stories Shared</div>
              </div>
            </div>
          </div>
        </div>

        {/* Received recognition */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">💚 Recognition You've Received</h3>
          <div className="space-y-4">
            {receivedRecognitions.map((recognition) => (
              <div key={recognition.recognitionId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      From {recognition.isAnonymous ? 'Anonymous' : recognition.fromUserName}
                    </h4>
                    <div className="text-sm text-gray-600">
                      {recognition.type.replace('_', ' ').toUpperCase()} • {recognition.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    +{Math.round(recognition.motivationBoost * 100)} motivation
                  </span>
                </div>
                <p className="text-gray-700">{recognition.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shared stories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">📖 Your Shared Stories</h3>
          <div className="space-y-4">
            {mySharedStories.map((story) => (
              <div key={story.storyId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{story.title}</h4>
                    <div className="text-sm text-gray-600">
                      {story.storyType.replace('_', ' ').toUpperCase()} • {story.sharedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>💝 {story.totalInspiration} inspired</span>
                    <span>⭐ {Math.round(story.hopefulnessScore * 100)}% hope</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">{story.narrative}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render recognition modal
  const renderRecognitionModal = () => {
    if (!showRecognitionModal || !recognitionDraft) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">Give Recognition</h3>
              <button
                onClick={() => setShowRecognitionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form ref={recognitionFormRef} className="space-y-6">
              {/* Recognition type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Recognition
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'peer_appreciation', label: 'Peer Appreciation', icon: '🤝' },
                    { value: 'mentor_pride', label: 'Mentor Pride', icon: '🌟' },
                    { value: 'community_impact', label: 'Community Impact', icon: '🌍' },
                    { value: 'breakthrough_moment', label: 'Breakthrough Moment', icon: '💡' },
                    { value: 'consistent_growth', label: 'Consistent Growth', icon: '📈' },
                    { value: 'inspiring_others', label: 'Inspiring Others', icon: '✨' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="recognitionType"
                        value={type.value}
                        checked={recognitionDraft.type === type.value}
                        onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, type: e.target.value as any }))}
                        className="text-blue-600"
                      />
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recipient selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognize Someone
                </label>
                <select
                  value={recognitionDraft.toUserId}
                  onChange={(e) => {
                    const selectedMember = communityMembers.find(m => m.userId === e.target.value);
                    setRecognitionDraft(prev => ({
                      ...prev!,
                      toUserId: e.target.value,
                      toUserName: selectedMember?.userName || ''
                    }));
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a community member...</option>
                  {communityMembers.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.userName} - {member.journeyPath}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recognition message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Recognition Message
                </label>
                <textarea
                  value={recognitionDraft.message}
                  onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, message: e.target.value }))}
                  placeholder="Share what you appreciate about their journey and growth..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-32"
                />
              </div>

              {/* Privacy settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility & Privacy
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={recognitionDraft.isAnonymous}
                      onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, isAnonymous: e.target.checked }))}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Give recognition anonymously</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    {[
                      { value: 'private', label: 'Private' },
                      { value: 'circle', label: 'Your Circle' },
                      { value: 'community', label: 'Community' },
                      { value: 'public', label: 'Public' }
                    ].map((level) => (
                      <label key={level.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="visibilityLevel"
                          value={level.value}
                          checked={recognitionDraft.visibilityLevel === level.value}
                          onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, visibilityLevel: e.target.value as any }))}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRecognitionModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => giveRecognition(recognitionDraft)}
                  disabled={!recognitionDraft.toUserId || !recognitionDraft.message.trim()}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Give Recognition
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderRecognitionModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-800 mb-4">
            Recognition & Sharing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Celebrate growth journeys, share inspiring stories, and build meaningful connections 
            within our community of personal development.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'feed', label: 'Inspiration Feed', icon: '🌟' },
              { id: 'give_recognition', label: 'Give Recognition', icon: '🤝' },
              { id: 'share_story', label: 'Share Story', icon: '📖' },
              { id: 'my_recognition', label: 'My Recognition', icon: '💚' },
              { id: 'community', label: 'Community', icon: '🌍' }
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
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading inspiration and recognition...</p>
          </div>
        ) : (
          <>
            {activeTab === 'feed' && renderInspirationFeed()}
            {activeTab === 'my_recognition' && renderMyRecognition()}
            {activeTab === 'give_recognition' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Recognition giving interface would be integrated here</p>
              </div>
            )}
            {activeTab === 'share_story' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Story sharing interface would be integrated here</p>
              </div>
            )}
            {activeTab === 'community' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Community directory and connections would be implemented here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper types
interface FeedFilter {
  // Implementation would define feed filter types
}

interface StoryRecommendation {
  storyId: string;
  reason: string;
  relevanceScore: number;
}

// API functions (implementations would be expanded)
const loadInspirationFeed = async (
  userId: string,
  culturalContext: CulturalContext,
  identityProfile: IdentityExplorationProfile
): Promise<InspirationFeed> => {
  // Implementation would load personalized inspiration feed
  return {
    stories: [],
    recognitions: [],
    celebrations: [],
    recommendations: []
  };
};

const loadCommunityMembers = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<CommunityMember[]> => {
  // Implementation would load community members for recognition
  return [];
};

const loadUserRecognitions = async (userId: string): Promise<{ received: Recognition[]; given: Recognition[] }> => {
  // Implementation would load user's recognition history
  return { received: [], given: [] };
};

const loadUserStories = async (userId: string): Promise<SharedStory[]> => {
  // Implementation would load user's shared stories
  return [];
};

const createRecognition = async (
  draft: RecognitionDraft,
  userId: string,
  culturalContext: CulturalContext
): Promise<Recognition> => {
  // Implementation would create and save recognition
  return {} as Recognition;
};

const createSharedStory = async (
  draft: StoryDraft,
  userId: string,
  identityProfile: IdentityExplorationProfile,
  culturalContext: CulturalContext
): Promise<SharedStory> => {
  // Implementation would create and save shared story
  return {} as SharedStory;
};

export default RecognitionSharingSystem;