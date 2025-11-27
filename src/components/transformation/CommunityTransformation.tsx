'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TransformationStory {
  id: string;
  anonymousId: string;
  title: string;
  transformationType: 'healing' | 'growth' | 'breakthrough' | 'integration';
  beforeSummary: string;
  afterSummary: string;
  keyInsight: string;
  timeframe: string;
  isShared: boolean;
  likes: number;
  inspirations: number;
  supportMessages: number;
  stage: 'emergence' | 'metamorphosis' | 'integration' | 'transcendence';
  dimensions: {
    emotional: number;
    behavioral: number;
    cognitive: number;
    spiritual: number;
    relational: number;
  };
  createdAt: Date;
  sacredSymbol: string;
}

interface CommunityStats {
  totalStories: number;
  collectiveGrowth: number;
  averageTransformation: number;
  inspirationGiven: number;
  supportOffered: number;
}

interface CommunityTransformationProps {
  userId: string;
}

export const CommunityTransformation: React.FC<CommunityTransformationProps> = ({
  userId
}) => {
  const [stories, setStories] = useState<TransformationStory[]>([]);
  const [userStory, setUserStory] = useState<TransformationStory | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'healing' | 'growth' | 'breakthrough' | 'integration'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sacredMode, setSacredMode] = useState(true);

  useEffect(() => {
    loadCommunityStories();
    loadUserStory();
    loadCommunityStats();
  }, [userId, selectedFilter]);

  const loadCommunityStories = async () => {
    try {
      // Mock community transformation stories
      const mockStories: TransformationStory[] = [
        {
          id: '1',
          anonymousId: 'SacredTraveler_Aurora',
          title: 'From Anxiety Spiral to Inner Peace',
          transformationType: 'healing',
          beforeSummary: 'Constant worry and panic attacks were controlling my life. I felt trapped in cycles of fear.',
          afterSummary: 'Developed daily mindfulness practice and learned to observe anxiety without being consumed by it.',
          keyInsight: 'Anxiety became my teacher, showing me where I needed to cultivate more self-compassion.',
          timeframe: '8 months',
          isShared: true,
          likes: 47,
          inspirations: 23,
          supportMessages: 12,
          stage: 'integration',
          dimensions: {
            emotional: 0.85,
            behavioral: 0.75,
            cognitive: 0.80,
            spiritual: 0.70,
            relational: 0.65
          },
          createdAt: new Date('2024-08-15'),
          sacredSymbol: '🕊️'
        },
        {
          id: '2',
          anonymousId: 'PhoenixRising_Dawn',
          title: 'Transforming Grief into Gratitude',
          transformationType: 'breakthrough',
          beforeSummary: 'Lost my partner and felt like life had no meaning. Everything felt dark and empty.',
          afterSummary: 'Found a way to honor their memory through service and discovered new purpose in helping others.',
          keyInsight: 'Love doesn\'t end with death - it transforms into a different kind of presence and purpose.',
          timeframe: '1 year 3 months',
          isShared: true,
          likes: 89,
          inspirations: 56,
          supportMessages: 34,
          stage: 'transcendence',
          dimensions: {
            emotional: 0.90,
            behavioral: 0.85,
            cognitive: 0.88,
            spiritual: 0.95,
            relational: 0.80
          },
          createdAt: new Date('2024-07-22'),
          sacredSymbol: '🌅'
        },
        {
          id: '3',
          anonymousId: 'GentleWarrior_Sage',
          title: 'Breaking Generational Trauma Patterns',
          transformationType: 'integration',
          beforeSummary: 'Repeating the same toxic relationship patterns my family modeled for generations.',
          afterSummary: 'Learned to set healthy boundaries and create the loving relationships I always wanted.',
          keyInsight: 'Healing myself became a gift to past and future generations of my family line.',
          timeframe: '2 years',
          isShared: true,
          likes: 72,
          inspirations: 41,
          supportMessages: 28,
          stage: 'integration',
          dimensions: {
            emotional: 0.82,
            behavioral: 0.88,
            cognitive: 0.85,
            spiritual: 0.78,
            relational: 0.92
          },
          createdAt: new Date('2024-06-10'),
          sacredSymbol: '🌳'
        },
        {
          id: '4',
          anonymousId: 'CreativeSoul_Bloom',
          title: 'From Creative Block to Artistic Flow',
          transformationType: 'growth',
          beforeSummary: 'Felt disconnected from my creativity and doubted my artistic abilities for years.',
          afterSummary: 'Rediscovered my creative voice and now art flows as a natural expression of my soul.',
          keyInsight: 'Creativity isn\'t about being perfect - it\'s about being authentic and vulnerable.',
          timeframe: '6 months',
          isShared: true,
          likes: 38,
          inspirations: 19,
          supportMessages: 8,
          stage: 'metamorphosis',
          dimensions: {
            emotional: 0.78,
            behavioral: 0.70,
            cognitive: 0.75,
            spiritual: 0.85,
            relational: 0.68
          },
          createdAt: new Date('2024-09-01'),
          sacredSymbol: '🎨'
        }
      ];

      setStories(mockStories.filter(story => 
        selectedFilter === 'all' || story.transformationType === selectedFilter
      ));
    } catch (error) {
      console.error('Error loading community stories:', error);
    }
  };

  const loadUserStory = async () => {
    try {
      // Mock user's transformation story
      const mockUserStory: TransformationStory = {
        id: 'user_story',
        anonymousId: 'SacredSeeker_Current',
        title: 'My Journey of Self-Discovery',
        transformationType: 'growth',
        beforeSummary: 'Felt disconnected from myself and uncertain about my life direction.',
        afterSummary: 'Developing greater self-awareness and finding clarity about my values and goals.',
        keyInsight: 'The journey inward has been the most transformative adventure of my life.',
        timeframe: '4 months',
        isShared: false,
        likes: 0,
        inspirations: 0,
        supportMessages: 0,
        stage: 'metamorphosis',
        dimensions: {
          emotional: 0.72,
          behavioral: 0.68,
          cognitive: 0.75,
          spiritual: 0.70,
          relational: 0.65
        },
        createdAt: new Date(),
        sacredSymbol: '🦋'
      };

      setUserStory(mockUserStory);
    } catch (error) {
      console.error('Error loading user story:', error);
    }
  };

  const loadCommunityStats = async () => {
    try {
      const mockStats: CommunityStats = {
        totalStories: 1247,
        collectiveGrowth: 0.78,
        averageTransformation: 0.73,
        inspirationGiven: 15683,
        supportOffered: 8924
      };

      setCommunityStats(mockStats);
    } catch (error) {
      console.error('Error loading community stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareStory = async () => {
    try {
      if (userStory) {
        const updatedStory = { ...userStory, isShared: true };
        setUserStory(updatedStory);
        setShowShareModal(false);
      }
    } catch (error) {
      console.error('Error sharing story:', error);
    }
  };

  const handleSupportStory = async (storyId: string) => {
    try {
      setStories(stories.map(story => 
        story.id === storyId 
          ? { ...story, supportMessages: story.supportMessages + 1 }
          : story
      ));
    } catch (error) {
      console.error('Error sending support:', error);
    }
  };

  const handleInspiration = async (storyId: string) => {
    try {
      setStories(stories.map(story => 
        story.id === storyId 
          ? { ...story, inspirations: story.inspirations + 1 }
          : story
      ));
    } catch (error) {
      console.error('Error adding inspiration:', error);
    }
  };

  const renderCommunityStats = () => {
    if (!communityStats) return null;

    return (
      <Card className="p-6 mb-6">
        <h3 className="text-xl font-medium mb-4">
          {sacredMode ? 'Sacred Community Metamorphosis' : 'Community Transformation Impact'}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🌍</div>
            <div className="text-2xl font-medium text-amber-600">{communityStats.totalStories.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Transformation Stories</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-2xl font-medium text-green-600">{Math.round(communityStats.collectiveGrowth * 100)}%</div>
            <div className="text-xs text-gray-600">Collective Growth</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">✨</div>
            <div className="text-2xl font-medium text-blue-600">{Math.round(communityStats.averageTransformation * 100)}%</div>
            <div className="text-xs text-gray-600">Average Progress</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">💫</div>
            <div className="text-2xl font-medium text-purple-600">{communityStats.inspirationGiven.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Inspirations Shared</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-1">🤗</div>
            <div className="text-2xl font-medium text-pink-600">{communityStats.supportOffered.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Support Messages</div>
          </div>
        </div>
      </Card>
    );
  };

  const renderUserStoryCard = () => {
    if (!userStory) return null;

    return (
      <Card className="p-6 mb-6 border-2 border-amber-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{userStory.sacredSymbol}</span>
            <div>
              <h3 className="text-lg font-medium">Your Transformation Journey</h3>
              <p className="text-sm text-gray-600">
                {userStory.isShared ? 'Shared with community' : 'Private (not shared)'}
              </p>
            </div>
          </div>
          
          {!userStory.isShared && (
            <Button onClick={() => setShowShareModal(true)} className="bg-amber-500 hover:bg-amber-600">
              Share Anonymously
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium mb-2">Before</h4>
            <p className="text-sm text-gray-700">{userStory.beforeSummary}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">After</h4>
            <p className="text-sm text-gray-700">{userStory.afterSummary}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Key Insight</h4>
          <p className="text-sm italic text-amber-700">"{userStory.keyInsight}"</p>
        </div>

        {/* Growth Visualization */}
        <div className="mt-4">
          <h4 className="font-medium mb-2">Your Growth Dimensions</h4>
          <div className="space-y-2">
            {Object.entries(userStory.dimensions).map(([dimension, progress]) => (
              <div key={dimension} className="flex items-center space-x-2">
                <span className="w-20 text-sm capitalize">{dimension}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{Math.round(progress * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const renderStoryCard = (story: TransformationStory) => {
    return (
      <Card key={story.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{story.sacredSymbol}</span>
            <div>
              <h3 className="font-medium">{story.title}</h3>
              <p className="text-sm text-gray-600">by {story.anonymousId}</p>
              <p className="text-xs text-gray-500">{story.timeframe} transformation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              story.transformationType === 'breakthrough' ? 'bg-green-100 text-green-800' :
              story.transformationType === 'healing' ? 'bg-blue-100 text-blue-800' :
              story.transformationType === 'growth' ? 'bg-purple-100 text-purple-800' :
              'bg-amber-100 text-amber-800'
            }`}>
              {story.transformationType}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              story.stage === 'transcendence' ? 'bg-gold-100 text-gold-800' :
              story.stage === 'integration' ? 'bg-green-100 text-green-800' :
              story.stage === 'metamorphosis' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {story.stage}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Before</h4>
            <p className="text-sm text-gray-700">{story.beforeSummary}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">After</h4>
            <p className="text-sm text-gray-700">{story.afterSummary}</p>
          </div>
        </div>

        <div className="border-t pt-3 mb-4">
          <h4 className="text-sm font-medium text-amber-600 mb-1">Key Insight</h4>
          <p className="text-sm italic text-gray-700">"{story.keyInsight}"</p>
        </div>

        {/* Mini growth chart */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Growth Dimensions</h4>
          <div className="grid grid-cols-5 gap-1">
            {Object.entries(story.dimensions).map(([dimension, progress]) => (
              <div key={dimension} className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                  <div
                    className="bg-amber-500 h-1 rounded-full"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 capitalize">{dimension.slice(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{story.likes}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>✨</span>
              <span>{story.inspirations}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🤗</span>
              <span>{story.supportMessages}</span>
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleInspiration(story.id)}
              className="flex items-center space-x-1"
            >
              <span>✨</span>
              <span>Inspire</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSupportStory(story.id)}
              className="flex items-center space-x-1"
            >
              <span>🤗</span>
              <span>Support</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderShareModal = () => {
    if (!showShareModal || !userStory) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="max-w-md w-full p-6">
          <h3 className="text-lg font-medium mb-4">Share Your Transformation</h3>
          
          <div className="space-y-4 mb-6">
            <p className="text-sm text-gray-600">
              Your story can inspire others on their healing journey. When you share:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your identity remains completely anonymous</li>
              <li>• Only your transformation summary is shared</li>
              <li>• You can remove your story at any time</li>
              <li>• You help create a supportive community</li>
            </ul>
            
            <div className="bg-amber-50 p-3 rounded">
              <p className="text-sm text-amber-800">
                🌟 <strong>Sacred Intention:</strong> By sharing your story, you become a beacon of hope for others walking similar paths.
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowShareModal(false)}
              className="flex-1"
            >
              Keep Private
            </Button>
            <Button
              onClick={handleShareStory}
              className="flex-1 bg-amber-500 hover:bg-amber-600"
            >
              Share Anonymously
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🌍</div>
          <p className="text-gray-600">Loading community transformations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">
            {sacredMode ? 'Sacred Community of Transformation' : 'Community Transformation Stories'}
          </h2>
          <p className="text-gray-600">
            {sacredMode 
              ? "Anonymous stories of metamorphosis shared in sacred community"
              : "Real transformation stories shared anonymously by our community"
            }
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setSacredMode(!sacredMode)}
        >
          {sacredMode ? 'Scientific View' : 'Sacred View'}
        </Button>
      </div>

      {/* Community Stats */}
      {renderCommunityStats()}

      {/* User's Story */}
      {renderUserStoryCard()}

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Stories', icon: '🌟' },
          { key: 'healing', label: 'Healing', icon: '🕊️' },
          { key: 'growth', label: 'Growth', icon: '🌱' },
          { key: 'breakthrough', label: 'Breakthrough', icon: '💥' },
          { key: 'integration', label: 'Integration', icon: '🔗' }
        ].map(({ key, label, icon }) => (
          <Button
            key={key}
            variant={selectedFilter === key ? 'default' : 'outline'}
            onClick={() => setSelectedFilter(key as any)}
            className="flex items-center space-x-2"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Community Stories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map(renderStoryCard)}
      </div>

      {/* Collective Wisdom */}
      <Card className="p-6">
        <h3 className="text-xl font-medium mb-4">Collective Transformation Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Most Transformative Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Daily reflection/journaling (87%)</li>
              <li>• Mindfulness meditation (74%)</li>
              <li>• Boundary setting (68%)</li>
              <li>• Professional support (61%)</li>
              <li>• Community connection (58%)</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Common Breakthrough Themes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Self-compassion development</li>
              <li>• Relationship pattern healing</li>
              <li>• Purpose and meaning discovery</li>
              <li>• Trauma integration</li>
              <li>• Creative expression renewal</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Average Timeframes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Initial awareness: 2-4 weeks</li>
              <li>• Behavioral changes: 2-3 months</li>
              <li>• Cognitive shifts: 4-6 months</li>
              <li>• Deep integration: 8-12 months</li>
              <li>• Stable transformation: 1-2 years</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Share Modal */}
      {renderShareModal()}
    </div>
  );
};

export default CommunityTransformation;