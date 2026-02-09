'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import StoryCreator from '@/components/community/StoryCreator';
import HealingCircleManager from '@/components/community/HealingCircleManager';
import WisdomLibrary from '@/components/community/WisdomLibrary';
import CollectiveExperiences from '@/components/community/CollectiveExperiences';
import GrowthHealingCircles from '@/components/community/GrowthHealingCircles';
import { safeLocalStorage } from '@/utils/browser';
import { 
  Heart, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Shield,
  Plus,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';

interface CommunityStats {
  activeStories: number;
  healingCircles: number;
  wisdomEntries: number;
  activeMembers: number;
  safetyScore: number;
}

interface CommunityStory {
  id: string;
  title?: string;
  content: string;
  healingStage: string;
  wisdomTags: string[];
  reactions: {
    resonance: number;
    gratitude: number;
    strength: number;
    solidarity: number;
  };
  createdAt: Date;
  anonymousId: string;
}

interface HealingCircle {
  id: string;
  name: string;
  description: string;
  topic: string;
  currentCapacity: number;
  maxCapacity: number;
  isPublic: boolean;
  meetingSchedule: {
    frequency: string;
    timeUTC: string;
  };
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [userTier, setUserTier] = useState<'sanctuary' | 'growth' | 'transformation'>('sanctuary');
  const [tierLoading, setTierLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'circles' | 'wisdom' | 'experiences'>('overview');
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [circles, setCircles] = useState<HealingCircle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('all');
  
  // Modal states
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showCircleManager, setShowCircleManager] = useState(false);
  const [showWisdomLibrary, setShowWisdomLibrary] = useState(false);
  const [showCollectiveExperiences, setShowCollectiveExperiences] = useState(false);
  
  // User permissions (would be loaded from user profile/roles)
  const [userPermissions] = useState({
    canCreateCircles: true, // Mock data - would check user role
    canFacilitate: true
  });

  const healingStages = [
    { value: 'all', label: 'All Stages', color: 'bg-purple-100' },
    { value: 'beginning', label: 'Beginning', color: 'bg-green-100' },
    { value: 'processing', label: 'Processing', color: 'bg-yellow-100' },
    { value: 'integrating', label: 'Integrating', color: 'bg-blue-100' },
    { value: 'thriving', label: 'Thriving', color: 'bg-indigo-100' },
    { value: 'wisdom_sharing', label: 'Wisdom Sharing', color: 'bg-amber-100' }
  ];

  useEffect(() => {
    checkUserTier();
    loadCommunityData();
  }, [activeTab, selectedStage]);

  const checkUserTier = async () => {
    setTierLoading(true);
    
    // Get user tier from localStorage or subscription API
    const storedTier = safeLocalStorage.getItem('userTier') as 'sanctuary' | 'growth' | 'transformation';
    if (storedTier) {
      setUserTier(storedTier);
    }
    
    setTierLoading(false);
  };

  const canAccessCommunity = userTier === 'growth' || userTier === 'transformation';

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      // Load community statistics
      if (activeTab === 'overview') {
        // This would call your Firebase Functions
        setStats({
          activeStories: 247,
          healingCircles: 12,
          wisdomEntries: 89,
          activeMembers: 1203,
          safetyScore: 98.5
        });
      }

      // Load stories by stage
      if (activeTab === 'stories') {
        // Mock data - would call getStoriesByStage function
        setStories([
          {
            id: '1',
            title: 'Finding Light in Dark Times',
            content: 'After months of struggle, I\'m learning that healing isn\'t linear. Some days are harder than others, but I\'m finding strength in small moments of peace. Today I noticed how the morning sun felt warm on my face, and for the first time in weeks, I smiled genuinely.',
            healingStage: 'processing',
            wisdomTags: ['depression', 'self_compassion', 'hope'],
            reactions: { resonance: 23, gratitude: 15, strength: 8, solidarity: 12 },
            createdAt: new Date('2024-01-25'),
            anonymousId: 'gentle_oak_7x9p'
          },
          {
            id: '2', 
            title: 'One Year Later',
            content: 'It\'s been a year since my breakdown, and I wanted to share how far I\'ve come. If you\'re reading this and struggling, please know that recovery is possible. The journey is hard, but you\'re stronger than you know. Take it one day at a time.',
            healingStage: 'thriving',
            wisdomTags: ['recovery', 'hope', 'trauma_healing'],
            reactions: { resonance: 45, gratitude: 32, strength: 28, solidarity: 19 },
            createdAt: new Date('2024-01-24'),
            anonymousId: 'wise_river_3k8m'
          }
        ]);
      }

      // Load healing circles
      if (activeTab === 'circles') {
        setCircles([
          {
            id: '1',
            name: 'Morning Mindfulness Circle',
            description: 'A gentle space for guided meditation and intention setting to start the day with presence and compassion.',
            topic: 'mindfulness',
            currentCapacity: 8,
            maxCapacity: 12,
            isPublic: true,
            meetingSchedule: {
              frequency: 'daily',
              timeUTC: '14:00'
            }
          },
          {
            id: '2',
            name: 'Grief Support Circle',
            description: 'A compassionate space for those navigating loss, offering mutual support and understanding.',
            topic: 'grief',
            currentCapacity: 6,
            maxCapacity: 8,
            isPublic: true,
            meetingSchedule: {
              frequency: 'weekly',
              timeUTC: '19:00'
            }
          }
        ]);
      }

    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReaction = async (storyId: string, reactionType: string) => {
    if (!user) return;
    
    try {
      // Call reactToStory function
      const response = await fetch('/api/community/react-to-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          storyId,
          reactionType
        })
      });

      if (response.ok) {
        // Update local state
        setStories(prev => prev.map(story => 
          story.id === storyId 
            ? { ...story, reactions: { ...story.reactions, [reactionType]: story.reactions[reactionType as keyof typeof story.reactions] + 1 }}
            : story
        ));
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-16 h-16 mx-auto text-purple-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Healing Community</h1>
          <p className="text-gray-600 mb-6">Join our anonymous, safe space for collective healing and peer support.</p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Sign In to Join
          </button>
        </div>
      </div>
    );
  }

  // Show loading while checking tier
  if (tierLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // Show upgrade prompt for Sanctuary users
  if (!canAccessCommunity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-6">
        <div className="bg-white border border-purple-200 p-8 rounded-3xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-6">🤝</div>
          <h1 className="text-2xl text-gray-800 font-light mb-4">Community Healing Circles</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Join anonymous peer support groups and healing circles. Share your journey and connect with others walking similar paths.
          </p>
          <div className="bg-purple-50 p-4 rounded-xl mb-6">
            <h3 className="text-purple-800 font-medium mb-2">Growth & Transformation Members Get:</h3>
            <ul className="text-purple-700 text-sm space-y-1 text-left">
              <li>• Anonymous healing circles</li>
              <li>• Peer support groups</li>
              <li>• Weekly guided discussions</li>
              <li>• Safe story sharing</li>
              <li>• Community wisdom library</li>
            </ul>
          </div>
          <div className="space-y-3">
            <Link
              href="/pricing"
              className="block bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-full font-medium transition-all duration-300"
            >
              Upgrade to Access Community
            </Link>
            <Link
              href="/dashboard"
              className="block text-gray-500 hover:text-gray-700 py-3 px-6 font-light transition-all duration-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="text-purple-500" />
                Healing Community
              </h1>
              <p className="text-gray-600 mt-2">A safe, anonymous space for collective healing and peer support</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-gray-600">Safe Space • Anonymous • Trauma-Informed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Sparkles },
              { id: 'stories', label: 'Stories', icon: MessageCircle },
              { id: 'circles', label: 'Healing Circles', icon: Users },
              { id: 'wisdom', label: 'Wisdom Library', icon: BookOpen },
              { id: 'experiences', label: 'Collective Experiences', icon: Heart }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Community Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Stories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeStories}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Healing Circles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.healingCircles}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Wisdom Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.wisdomEntries}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Safety Score</p>
                    <p className="text-2xl font-bold text-green-600">{stats.safetyScore}%</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Welcome to Our Healing Community</h2>
              <p className="text-purple-100 mb-6">
                This is a safe, anonymous space where you can share your healing journey, 
                connect with others who understand, and find collective wisdom for recovery.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowStoryCreator(true)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-left hover:bg-opacity-30 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 mb-2" />
                  <h3 className="font-semibold">Share Your Story</h3>
                  <p className="text-sm text-purple-100">Anonymously share your healing journey to inspire others</p>
                </button>
                <button 
                  onClick={() => setShowCircleManager(true)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg text-left hover:bg-opacity-30 transition-colors"
                >
                  <Users className="w-6 h-6 mb-2" />
                  <h3 className="font-semibold">Join a Circle</h3>
                  <p className="text-sm text-purple-100">Find your community in guided healing circles</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            {/* Story Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Community Stories</h2>
                <button 
                  onClick={() => setShowStoryCreator(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Share Story
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {healingStages.map(stage => (
                  <button
                    key={stage.value}
                    onClick={() => setSelectedStage(stage.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedStage === stage.value
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Story List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {stories.map(story => (
                  <div key={story.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {story.title && (
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {healingStages.find(s => s.value === story.healingStage)?.label}
                          </span>
                          <span>by {story.anonymousId}</span>
                          <span>•</span>
                          <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{story.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {story.wisdomTags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => addReaction(story.id, 'resonance')}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          {story.reactions.resonance}
                        </button>
                        <button 
                          onClick={() => addReaction(story.id, 'gratitude')}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <span>🙏</span>
                          {story.reactions.gratitude}
                        </button>
                        <button 
                          onClick={() => addReaction(story.id, 'strength')}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                          <span>💪</span>
                          {story.reactions.strength}
                        </button>
                        <button 
                          onClick={() => addReaction(story.id, 'solidarity')}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
                        >
                          <span>🤝</span>
                          {story.reactions.solidarity}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Healing Circles Tab */}
        {activeTab === 'circles' && (
          <GrowthHealingCircles />
        )}

        {/* Placeholder tabs */}
        {activeTab === 'wisdom' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Community Wisdom Library</h2>
            <p className="text-gray-600 mb-6">
              A curated collection of healing insights, coping strategies, and recovery wisdom 
              contributed by our community members.
            </p>
            <button 
              onClick={() => setShowWisdomLibrary(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Wisdom Library
            </button>
          </div>
        )}

        {activeTab === 'experiences' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Collective Healing Experiences</h2>
            <p className="text-gray-600 mb-6">
              Join synchronized meditation sessions, community challenges, and milestone 
              celebrations that foster collective healing and connection.
            </p>
            <button 
              onClick={() => setShowCollectiveExperiences(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Explore Experiences
            </button>
          </div>
        )}

      </div>

      {/* Community Feature Modals */}
      <StoryCreator 
        isOpen={showStoryCreator}
        onClose={() => setShowStoryCreator(false)}
        onStoryCreated={(story) => {
          setStories(prev => [story, ...prev]);
          setShowStoryCreator(false);
        }}
      />

      <HealingCircleManager
        isOpen={showCircleManager}
        onClose={() => setShowCircleManager(false)}
        onCircleCreated={(circle) => {
          setCircles(prev => [circle, ...prev]);
          setShowCircleManager(false);
        }}
        userPermissions={userPermissions}
      />

      <WisdomLibrary
        isOpen={showWisdomLibrary}
        onClose={() => setShowWisdomLibrary(false)}
      />

      <CollectiveExperiences
        isOpen={showCollectiveExperiences}
        onClose={() => setShowCollectiveExperiences(false)}
      />
    </div>
  );
}