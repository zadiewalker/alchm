'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Types for community creative sharing
interface SharedCreative {
  id: string;
  type: 'art' | 'poetry' | 'voice_reflection' | 'movement_story' | 'music_moment';
  title?: string;
  content: CreativeContent;
  metadata: CreativeMetadata;
  privacy: PrivacyLevel;
  community: CommunityEngagement;
  healing: HealingContext;
  timestamp: Date;
  authorId: string; // Anonymous hash
  authorName: string; // Anonymous name like "Gentle Oak" or "Flowing River"
}

interface CreativeContent {
  // For art
  imageData?: string;
  colorPalette?: string[];
  artStyle?: string;
  
  // For poetry
  text?: string;
  form?: string;
  themes?: string[];
  
  // For voice (transcript only, no audio for privacy)
  transcript?: string;
  emotionalTone?: string;
  duration?: number;
  
  // For movement
  movementStory?: string;
  bodyWisdom?: string;
  energyShift?: string;
  
  // For music
  frequency?: number;
  soundscapeType?: string;
  breathingPattern?: string;
}

interface CreativeMetadata {
  mood?: MoodType;
  healingIntention: string;
  timeSpent: number;
  creativeFlow: 'gentle' | 'flowing' | 'powerful' | 'transformative';
  emotionalJourney: string[];
}

interface PrivacyLevel {
  level: 'anonymous' | 'initials' | 'first_name';
  allowComments: boolean;
  allowResonance: boolean; // Like heart reactions
  shareInsights: boolean; // Share therapeutic insights
}

interface CommunityEngagement {
  resonanceCount: number; // Hearts/likes
  reflections: CommunityReflection[]; // Comments
  healingWitness: HealingWitness[]; // Supportive responses
  sharedBy: number; // Times shared to personal journals
}

interface CommunityReflection {
  id: string;
  authorName: string; // Anonymous
  text: string;
  tone: 'supportive' | 'witnessing' | 'resonant' | 'grateful';
  timestamp: Date;
}

interface HealingWitness {
  id: string;
  authorName: string;
  witnessType: 'seen' | 'felt' | 'honored' | 'grateful';
  message?: string;
  timestamp: Date;
}

interface HealingContext {
  intention: string;
  breakthrough?: string;
  support_needed?: string[];
  gratitude?: string;
  wisdom_shared?: string;
}

interface CreativeCommunityGalleryProps {
  onCreativeShared?: (creative: SharedCreative) => void;
  className?: string;
}

// Anonymous name generator for users
const NATURE_NAMES = {
  adjectives: [
    'Gentle', 'Flowing', 'Radiant', 'Peaceful', 'Brave', 'Tender', 'Wise', 'Strong',
    'Graceful', 'Luminous', 'Serene', 'Courageous', 'Healing', 'Growing', 'Dancing',
    'Singing', 'Blooming', 'Glowing', 'Rising', 'Soaring'
  ],
  nouns: [
    'Oak', 'River', 'Moon', 'Star', 'Mountain', 'Ocean', 'Butterfly', 'Sunrise',
    'Lotus', 'Cedar', 'Willow', 'Phoenix', 'Garden', 'Stream', 'Forest', 'Light',
    'Bridge', 'Dawn', 'Meadow', 'Flame', 'Pearl', 'Stone', 'Wind', 'Rain'
  ]
};

// Community guidelines and sacred contracts
const COMMUNITY_GUIDELINES = [
  'This is a sacred space for healing through creative expression',
  'All shares are met with witnessing, not fixing or advice',
  'We honor each person\'s creative courage and vulnerability',
  'Feedback focuses on resonance and appreciation, not critique',
  'Privacy is sacred - no personal details shared without explicit consent',
  'We celebrate all forms of creative healing, from gentle to powerful',
  'This space is trauma-informed and culturally sensitive',
  'Everyone\'s creative expression is valid and valuable'
];

const CreativeCommunityGallery: React.FC<CreativeCommunityGalleryProps> = ({
  onCreativeShared,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'gallery' | 'share' | 'my_shares'>('gallery');
  const [sharedCreatives, setSharedCreatives] = useState<SharedCreative[]>([]);
  const [filterMood, setFilterMood] = useState<MoodType | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [selectedCreative, setSelectedCreative] = useState<SharedCreative | null>(null);
  
  // User's anonymous identity
  const [userAnonymousName, setUserAnonymousName] = useState<string>('');
  
  // Sharing state
  const [shareData, setShareData] = useState({
    type: 'art' as SharedCreative['type'],
    title: '',
    content: {} as CreativeContent,
    healingIntention: '',
    allowComments: true,
    allowResonance: true,
    shareInsights: false
  });

  const { currentMood } = useMoodContext();

  // Generate anonymous name for user
  useEffect(() => {
    const existingName = localStorage.getItem('alchm_anonymous_name');
    if (existingName) {
      setUserAnonymousName(existingName);
    } else {
      const adjective = NATURE_NAMES.adjectives[Math.floor(Math.random() * NATURE_NAMES.adjectives.length)];
      const noun = NATURE_NAMES.nouns[Math.floor(Math.random() * NATURE_NAMES.nouns.length)];
      const newName = `${adjective} ${noun}`;
      setUserAnonymousName(newName);
      localStorage.setItem('alchm_anonymous_name', newName);
    }
  }, []);

  // Load shared creatives (mock data for demonstration)
  useEffect(() => {
    const mockSharedCreatives: SharedCreative[] = [
      {
        id: '1',
        type: 'art',
        title: 'Sunrise After Storm',
        content: {
          imageData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...', // Mock
          colorPalette: ['#f7d794', '#a4b792', '#cb997e'],
          artStyle: 'Watercolor flow'
        },
        metadata: {
          mood: 'tender',
          healingIntention: 'Processing grief with gentleness',
          timeSpent: 1200,
          creativeFlow: 'gentle',
          emotionalJourney: ['raw', 'processing', 'tender', 'hopeful']
        },
        privacy: {
          level: 'anonymous',
          allowComments: true,
          allowResonance: true,
          shareInsights: true
        },
        community: {
          resonanceCount: 12,
          reflections: [
            {
              id: 'r1',
              authorName: 'Peaceful Mountain',
              text: 'Your colors speak to the hope that lives even in difficult times. Thank you for sharing this beauty.',
              tone: 'witnessing',
              timestamp: new Date(Date.now() - 3600000)
            }
          ],
          healingWitness: [
            {
              id: 'w1',
              authorName: 'Flowing Stream',
              witnessType: 'seen',
              message: 'I see your courage in creating through grief',
              timestamp: new Date(Date.now() - 1800000)
            }
          ],
          sharedBy: 5
        },
        healing: {
          intention: 'Finding light in darkness through color and form',
          breakthrough: 'Realized that storms can create the most beautiful sunrises',
          gratitude: 'Grateful for the healing power of creative expression'
        },
        timestamp: new Date(Date.now() - 7200000),
        authorId: 'anonymous_user_1',
        authorName: 'Gentle Dawn'
      },
      {
        id: '2',
        type: 'poetry',
        title: 'Body Remembers',
        content: {
          text: `My body remembers\nwhat my mind forgot—\nthe safety in stillness,\nthe wisdom in rest.\n\nEach breath a teacher,\neach heartbeat a friend,\nwhispering softly:\n"You are enough."\n\nHere, in this moment,\nI choose to trust\nthe ancient knowing\nthat lives in my bones.`,
          form: 'free_verse',
          themes: ['body wisdom', 'self-trust', 'healing']
        },
        metadata: {
          mood: 'contemplative',
          healingIntention: 'Reconnecting with body wisdom after trauma',
          timeSpent: 900,
          creativeFlow: 'flowing',
          emotionalJourney: ['raw', 'tender', 'contemplative', 'grateful']
        },
        privacy: {
          level: 'anonymous',
          allowComments: true,
          allowResonance: true,
          shareInsights: true
        },
        community: {
          resonanceCount: 18,
          reflections: [
            {
              id: 'r2',
              authorName: 'Wise Cedar',
              text: 'This poem found me exactly when I needed to remember to trust my body again. Thank you.',
              tone: 'grateful',
              timestamp: new Date(Date.now() - 5400000)
            }
          ],
          healingWitness: [
            {
              id: 'w2',
              authorName: 'Strong Oak',
              witnessType: 'felt',
              message: 'I felt the truth in every word',
              timestamp: new Date(Date.now() - 3600000)
            }
          ],
          sharedBy: 8
        },
        healing: {
          intention: 'Healing relationship with my body through words',
          wisdom_shared: 'Our bodies hold wisdom that our minds are still learning to hear'
        },
        timestamp: new Date(Date.now() - 14400000),
        authorId: 'anonymous_user_2',
        authorName: 'Blooming Lotus'
      }
    ];
    
    setSharedCreatives(mockSharedCreatives);
  }, []);

  // Filter creatives by mood and type
  const filteredCreatives = useMemo(() => {
    return sharedCreatives.filter(creative => {
      const moodMatch = filterMood === 'all' || creative.metadata.mood === filterMood;
      const typeMatch = filterType === 'all' || creative.type === filterType;
      return moodMatch && typeMatch;
    });
  }, [sharedCreatives, filterMood, filterType]);

  // Add resonance (like/heart) to creative
  const addResonance = useCallback((creativeId: string) => {
    setSharedCreatives(prev => prev.map(creative => 
      creative.id === creativeId 
        ? {
            ...creative,
            community: {
              ...creative.community,
              resonanceCount: creative.community.resonanceCount + 1
            }
          }
        : creative
    ));
    
    // Gentle haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50]);
    }
  }, []);

  // Add reflection (comment) to creative
  const addReflection = useCallback((creativeId: string, text: string, tone: CommunityReflection['tone']) => {
    const newReflection: CommunityReflection = {
      id: Date.now().toString(),
      authorName: userAnonymousName,
      text,
      tone,
      timestamp: new Date()
    };
    
    setSharedCreatives(prev => prev.map(creative => 
      creative.id === creativeId 
        ? {
            ...creative,
            community: {
              ...creative.community,
              reflections: [...creative.community.reflections, newReflection]
            }
          }
        : creative
    ));
  }, [userAnonymousName]);

  // Add healing witness
  const addHealingWitness = useCallback((creativeId: string, witnessType: HealingWitness['witnessType'], message?: string) => {
    const newWitness: HealingWitness = {
      id: Date.now().toString(),
      authorName: userAnonymousName,
      witnessType,
      message,
      timestamp: new Date()
    };
    
    setSharedCreatives(prev => prev.map(creative => 
      creative.id === creativeId 
        ? {
            ...creative,
            community: {
              ...creative.community,
              healingWitness: [...creative.community.healingWitness, newWitness]
            }
          }
        : creative
    ));
    
    // Meaningful haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [userAnonymousName]);

  // Format time ago
  const formatTimeAgo = useCallback((timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  }, []);

  return (
    <div className={`creative-community-gallery ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Creative Community Gallery
        </h3>
        <p className="text-sm text-gray-600">
          A sacred space for sharing and witnessing creative healing
        </p>
      </div>

      {/* Navigation */}
      <div className="gallery-nav mb-6 flex items-center justify-between">
        <div className="nav-buttons flex items-center gap-3">
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'gallery'
                ? 'bg-sage-400 text-white'
                : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setViewMode('share')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'share'
                ? 'bg-purple-400 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Share Creative
          </button>
          <button
            onClick={() => setViewMode('my_shares')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'my_shares'
                ? 'bg-blue-400 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            My Shares
          </button>
        </div>
        
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          Community Guidelines
        </button>
      </div>

      {/* Community Guidelines Modal */}
      {showGuidelines && (
        <div className="guidelines-modal mb-6 p-6 bg-gradient-to-br from-sage-50 to-green-50 rounded-2xl border border-sage-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Sacred Community Guidelines</h4>
            <button
              onClick={() => setShowGuidelines(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            {COMMUNITY_GUIDELINES.map((guideline, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 leading-relaxed">{guideline}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-sage-700 italic font-medium">
              "We witness each other's healing with love and respect"
            </p>
          </div>
        </div>
      )}

      {/* Gallery View */}
      {viewMode === 'gallery' && (
        <div className="gallery-view">
          {/* Filters */}
          <div className="filters mb-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="filter-group">
                <label className="text-xs text-gray-600 mb-1 block">Mood Energy</label>
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value as MoodType | 'all')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All Moods</option>
                  <option value="raw">Raw</option>
                  <option value="tender">Tender</option>
                  <option value="empowered">Empowered</option>
                  <option value="contemplative">Contemplative</option>
                  <option value="grateful">Grateful</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label className="text-xs text-gray-600 mb-1 block">Creative Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="art">Visual Art</option>
                  <option value="poetry">Poetry</option>
                  <option value="voice_reflection">Voice Reflection</option>
                  <option value="movement_story">Movement Story</option>
                  <option value="music_moment">Music Moment</option>
                </select>
              </div>
              
              <div className="stats ml-auto text-xs text-gray-600">
                {filteredCreatives.length} creative expressions
              </div>
            </div>
          </div>

          {/* Creative Cards Grid */}
          <div className="creatives-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreatives.map(creative => (
              <div key={creative.id} className="creative-card bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                
                {/* Header */}
                <div className="card-header p-4 bg-gradient-to-r from-sage-50 to-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg">
                        {creative.type === 'art' && '🎨'}
                        {creative.type === 'poetry' && '✨'}
                        {creative.type === 'voice_reflection' && '🎙️'}
                        {creative.type === 'movement_story' && '💃'}
                        {creative.type === 'music_moment' && '🎵'}
                      </div>
                      <span className="text-xs text-gray-600 capitalize">
                        {creative.type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(creative.timestamp)}
                    </span>
                  </div>
                  
                  <h5 className="font-semibold text-gray-800 mb-1">
                    {creative.title || 'Untitled Expression'}
                  </h5>
                  <div className="text-xs text-gray-600 mb-2">
                    by {creative.authorName}
                  </div>
                  
                  {creative.metadata.mood && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-sage-200 text-sage-800 px-2 py-1 rounded-full capitalize">
                        {creative.metadata.mood} energy
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Preview */}
                <div className="card-content p-4">
                  {creative.type === 'art' && creative.content.colorPalette && (
                    <div className="art-preview mb-3">
                      <div className="color-palette flex gap-1 mb-2">
                        {creative.content.colorPalette.map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{creative.content.artStyle}</p>
                    </div>
                  )}
                  
                  {creative.type === 'poetry' && creative.content.text && (
                    <div className="poetry-preview mb-3">
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        {creative.content.text.split('\n').slice(0, 3).join('\n')}
                        {creative.content.text.split('\n').length > 3 && '...'}
                      </p>
                    </div>
                  )}
                  
                  <div className="healing-intention text-xs text-purple-700 bg-purple-50 p-2 rounded-lg mb-3">
                    <span className="font-medium">Healing Intention: </span>
                    {creative.metadata.healingIntention}
                  </div>
                  
                  {creative.healing.breakthrough && (
                    <div className="breakthrough text-xs text-green-700 bg-green-50 p-2 rounded-lg mb-3">
                      <span className="font-medium">Breakthrough: </span>
                      {creative.healing.breakthrough}
                    </div>
                  )}
                </div>

                {/* Community Engagement */}
                <div className="card-footer p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="engagement-stats flex items-center gap-4">
                      <button
                        onClick={() => addResonance(creative.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <span>💖</span>
                        <span className="text-xs">{creative.community.resonanceCount}</span>
                      </button>
                      
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>💬</span>
                        <span className="text-xs">{creative.community.reflections.length}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-blue-600">
                        <span>👁️</span>
                        <span className="text-xs">{creative.community.healingWitness.length}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedCreative(creative)}
                      className="text-xs text-sage-600 hover:text-sage-800 font-medium"
                    >
                      View & Witness
                    </button>
                  </div>
                  
                  {/* Witness Buttons */}
                  <div className="witness-actions flex gap-2">
                    <button
                      onClick={() => addHealingWitness(creative.id, 'seen')}
                      className="flex-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors"
                    >
                      I see you
                    </button>
                    <button
                      onClick={() => addHealingWitness(creative.id, 'felt')}
                      className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors"
                    >
                      I feel this
                    </button>
                    <button
                      onClick={() => addHealingWitness(creative.id, 'honored')}
                      className="flex-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors"
                    >
                      I honor you
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCreatives.length === 0 && (
            <div className="empty-state text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Nurturing Creative Community
              </h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                This sacred space is growing. Be the first to share your creative healing 
                and inspire others on their journey.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Share Creative View */}
      {viewMode === 'share' && (
        <div className="share-view">
          <div className="share-form bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Share Your Creative Healing
            </h4>
            
            <div className="anonymous-identity mb-6 p-4 bg-sage-50 rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-2">
                You're sharing as: <span className="font-semibold text-sage-700">{userAnonymousName}</span>
              </p>
              <p className="text-xs text-gray-600">
                Your identity is protected. Only you know who you are in this sacred space.
              </p>
            </div>
            
            <div className="form-content space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creative Type
                </label>
                <select
                  value={shareData.type}
                  onChange={(e) => setShareData(prev => ({ ...prev, type: e.target.value as SharedCreative['type'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                >
                  <option value="art">Visual Art Creation</option>
                  <option value="poetry">Poetry & Writing</option>
                  <option value="voice_reflection">Voice Reflection (transcript only)</option>
                  <option value="movement_story">Movement & Body Story</option>
                  <option value="music_moment">Music & Sound Moment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={shareData.title}
                  onChange={(e) => setShareData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your creation a name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Healing Intention
                </label>
                <textarea
                  value={shareData.healingIntention}
                  onChange={(e) => setShareData(prev => ({ ...prev, healingIntention: e.target.value }))}
                  placeholder="What healing intention guided this creative expression?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent h-20"
                />
              </div>
              
              <div className="privacy-settings p-4 bg-purple-50 rounded-lg">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Privacy & Community Settings</h5>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareData.allowResonance}
                      onChange={(e) => setShareData(prev => ({ ...prev, allowResonance: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Allow community to express resonance (hearts)</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareData.allowComments}
                      onChange={(e) => setShareData(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Allow supportive reflections & witnessing</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareData.shareInsights}
                      onChange={(e) => setShareData(prev => ({ ...prev, shareInsights: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Share therapeutic insights for community learning</span>
                  </label>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    // Handle creative sharing
                    console.log('Sharing creative:', shareData);
                    // In real implementation, this would save to database
                  }}
                  disabled={!shareData.healingIntention.trim()}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    shareData.healingIntention.trim()
                      ? 'bg-sage-400 text-white hover:bg-sage-500'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Share with Sacred Community
                </button>
              </div>
              
              <p className="text-xs text-gray-600 text-center">
                By sharing, you agree to our community guidelines and consent to anonymous sharing for healing purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Creative View Modal */}
      {selectedCreative && (
        <div className="creative-detail-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="modal-header p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-800">
                  {selectedCreative.title || 'Creative Expression'}
                </h4>
                <button
                  onClick={() => setSelectedCreative(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                by {selectedCreative.authorName} • {formatTimeAgo(selectedCreative.timestamp)}
              </div>
            </div>
            
            <div className="modal-body p-6">
              {/* Full content would be displayed here based on type */}
              <div className="healing-context mb-6">
                <div className="intention mb-4 p-4 bg-purple-50 rounded-lg">
                  <h5 className="text-sm font-semibold text-purple-800 mb-2">Healing Intention</h5>
                  <p className="text-sm text-gray-700">{selectedCreative.metadata.healingIntention}</p>
                </div>
                
                {selectedCreative.healing.breakthrough && (
                  <div className="breakthrough mb-4 p-4 bg-green-50 rounded-lg">
                    <h5 className="text-sm font-semibold text-green-800 mb-2">Breakthrough</h5>
                    <p className="text-sm text-gray-700">{selectedCreative.healing.breakthrough}</p>
                  </div>
                )}
                
                {selectedCreative.healing.wisdom_shared && (
                  <div className="wisdom mb-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-semibold text-blue-800 mb-2">Wisdom Shared</h5>
                    <p className="text-sm text-gray-700">{selectedCreative.healing.wisdom_shared}</p>
                  </div>
                )}
              </div>
              
              {/* Community reflections would go here */}
              <div className="community-section">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Community Witnessing</h5>
                
                {selectedCreative.community.healingWitness.length > 0 && (
                  <div className="healing-witness mb-6">
                    <h6 className="text-sm font-semibold text-gray-700 mb-2">Healing Witness</h6>
                    <div className="space-y-2">
                      {selectedCreative.community.healingWitness.map(witness => (
                        <div key={witness.id} className="witness p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-800">{witness.authorName}</span>
                            <span className="text-xs text-gray-600 capitalize">{witness.witnessType} you</span>
                            <span className="text-xs text-gray-500">{formatTimeAgo(witness.timestamp)}</span>
                          </div>
                          {witness.message && (
                            <p className="text-sm text-gray-700">{witness.message}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeCommunityGallery;