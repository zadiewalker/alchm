'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useMoodContext, MoodType } from './MoodSelector';

// Community sharing types
interface CreativeShare {
  id: string;
  type: 'art' | 'poetry' | 'voice_note' | 'movement_insight' | 'music_reflection';
  content: ShareContent;
  metadata: ShareMetadata;
  privacy: PrivacySettings;
  engagement: EngagementData;
  author: AuthorInfo;
  timestamp: Date;
}

interface ShareContent {
  title?: string;
  description?: string;
  imageData?: string; // for art
  text?: string; // for poetry
  audioUrl?: string; // for voice notes
  duration?: number; // for audio/movement
  insights?: string[]; // for reflections
  therapeuticTags?: string[];
}

interface ShareMetadata {
  mood?: MoodType;
  intention: 'healing' | 'celebration' | 'processing' | 'inspiration' | 'support';
  vulnerabilityLevel: 'low' | 'medium' | 'high';
  seekingResponse: 'none' | 'gentle_witness' | 'shared_experience' | 'encouragement';
  contentWarnings?: string[];
}

interface PrivacySettings {
  visibility: 'anonymous' | 'community' | 'circles_only';
  allowComments: boolean;
  allowReactions: boolean;
  allowSaves: boolean;
  expiresAfter?: number; // days
  moderationLevel: 'standard' | 'extra_gentle';
}

interface EngagementData {
  reactions: Reaction[];
  witnessCount: number;
  saves: number;
  gentleResponses: GentleResponse[];
}

interface Reaction {
  type: 'heart' | 'seen' | 'resonance' | 'courage' | 'gratitude';
  emoji: string;
  meaning: string;
  count: number;
  userReacted: boolean;
}

interface GentleResponse {
  id: string;
  content: string;
  type: 'witness' | 'resonance' | 'encouragement';
  author: AuthorInfo;
  timestamp: Date;
  isAnonymous: boolean;
}

interface AuthorInfo {
  id: string;
  displayName: string;
  isAnonymous: boolean;
  creativeBadges: string[];
  trustLevel: number; // 0-5, for moderation
}

interface CreativeCircle {
  id: string;
  name: string;
  description: string;
  focus: string[];
  memberCount: number;
  isPrivate: boolean;
  moderationStyle: 'gentle' | 'structured' | 'open';
}

interface CreativeCommunityProps {
  onShare?: (share: CreativeShare) => void;
  className?: string;
}

// Pre-defined gentle reactions
const GENTLE_REACTIONS: Reaction[] = [
  {
    type: 'heart',
    emoji: '💚',
    meaning: 'Sending love and support',
    count: 0,
    userReacted: false
  },
  {
    type: 'seen',
    emoji: '👁️',
    meaning: 'I see you and witness your truth',
    count: 0,
    userReacted: false
  },
  {
    type: 'resonance',
    emoji: '🌊',
    meaning: 'This resonates deeply with me',
    count: 0,
    userReacted: false
  },
  {
    type: 'courage',
    emoji: '⚡',
    meaning: 'Thank you for your courage in sharing',
    count: 0,
    userReacted: false
  },
  {
    type: 'gratitude',
    emoji: '🙏',
    meaning: 'Grateful for your vulnerability',
    count: 0,
    userReacted: false
  }
];

// Creative circles for different focus areas
const CREATIVE_CIRCLES: CreativeCircle[] = [
  {
    id: 'healing_artists',
    name: 'Healing Artists',
    description: 'Art as medicine for the soul',
    focus: ['art_therapy', 'visual_expression', 'color_healing'],
    memberCount: 248,
    isPrivate: false,
    moderationStyle: 'gentle'
  },
  {
    id: 'poetry_sanctuary',
    name: 'Poetry Sanctuary',
    description: 'Words that heal and transform',
    focus: ['therapeutic_poetry', 'spoken_word', 'writing_medicine'],
    memberCount: 182,
    isPrivate: false,
    moderationStyle: 'gentle'
  },
  {
    id: 'embodied_healing',
    name: 'Embodied Healing',
    description: 'Movement as a path to wholeness',
    focus: ['somatic_therapy', 'dance_medicine', 'body_wisdom'],
    memberCount: 156,
    isPrivate: false,
    moderationStyle: 'gentle'
  },
  {
    id: 'sound_healers',
    name: 'Sound Healers',
    description: 'Frequency, voice, and musical medicine',
    focus: ['music_therapy', 'sound_healing', 'voice_work'],
    memberCount: 134,
    isPrivate: false,
    moderationStyle: 'gentle'
  },
  {
    id: 'trauma_survivors',
    name: 'Trauma Survivors Circle',
    description: 'Safe space for trauma processing through creativity',
    focus: ['trauma_healing', 'ptsd_recovery', 'survivor_support'],
    memberCount: 89,
    isPrivate: true,
    moderationStyle: 'structured'
  },
  {
    id: 'queer_creativity',
    name: 'Queer Creativity Collective',
    description: 'LGBTQ+ healing through authentic expression',
    focus: ['identity_exploration', 'queer_art', 'chosen_family'],
    memberCount: 167,
    isPrivate: false,
    moderationStyle: 'gentle'
  }
];

// Sample creative shares (mock data)
const SAMPLE_SHARES: CreativeShare[] = [
  {
    id: '1',
    type: 'poetry',
    content: {
      title: 'Growing Through Cracks',
      text: 'In the crevices of my breaking,\nI found where the light gets in.\nNot despite my scars,\nbut because of them—\nI am becoming\nwho I was meant to be.',
      therapeuticTags: ['resilience', 'growth', 'self_acceptance']
    },
    metadata: {
      mood: 'empowered',
      intention: 'inspiration',
      vulnerabilityLevel: 'medium',
      seekingResponse: 'gentle_witness'
    },
    privacy: {
      visibility: 'anonymous',
      allowComments: true,
      allowReactions: true,
      allowSaves: true,
      moderationLevel: 'standard'
    },
    engagement: {
      reactions: [
        { ...GENTLE_REACTIONS[0], count: 23 },
        { ...GENTLE_REACTIONS[2], count: 18 },
        { ...GENTLE_REACTIONS[3], count: 15 }
      ],
      witnessCount: 47,
      saves: 12,
      gentleResponses: []
    },
    author: {
      id: 'anon_1',
      displayName: 'Anonymous Poet',
      isAnonymous: true,
      creativeBadges: ['poetry_healer'],
      trustLevel: 4
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    type: 'art',
    content: {
      title: 'Ocean of Emotions',
      description: 'Painted during a difficult processing session. The blues represent my sadness, but notice how they blend into greens of hope.',
      imageData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Im9jZWFuIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNEY4NkY3O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzMzQ0Q3O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2E0Yjc5MjtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0idXJsKCNvY2VhbikiLz48L3N2Zz4=',
      therapeuticTags: ['emotional_release', 'hope', 'color_therapy']
    },
    metadata: {
      mood: 'tender',
      intention: 'processing',
      vulnerabilityLevel: 'high',
      seekingResponse: 'shared_experience'
    },
    privacy: {
      visibility: 'community',
      allowComments: true,
      allowReactions: true,
      allowSaves: false,
      moderationLevel: 'extra_gentle'
    },
    engagement: {
      reactions: [
        { ...GENTLE_REACTIONS[1], count: 31 },
        { ...GENTLE_REACTIONS[0], count: 28 },
        { ...GENTLE_REACTIONS[4], count: 19 }
      ],
      witnessCount: 62,
      saves: 0,
      gentleResponses: []
    },
    author: {
      id: 'user_healing_artist',
      displayName: 'Healing Artist',
      isAnonymous: false,
      creativeBadges: ['art_therapist', 'color_healer'],
      trustLevel: 5
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  }
];

const CreativeCommunity: React.FC<CreativeCommunityProps> = ({
  onShare,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'share' | 'circles' | 'my_shares'>('explore');
  const [shares, setShares] = useState<CreativeShare[]>(SAMPLE_SHARES);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [shareMode, setShareMode] = useState<'art' | 'poetry' | 'voice_note' | 'reflection' | null>(null);
  const [newShare, setNewShare] = useState<Partial<CreativeShare>>({});
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'mood' | 'intention'>('all');

  const { currentMood } = useMoodContext();

  // Filter shares based on current selection
  const filteredShares = useMemo(() => {
    let filtered = shares;

    if (selectedCircle && selectedCircle !== 'all') {
      // Filter by circle focus areas (simplified)
      const circle = CREATIVE_CIRCLES.find(c => c.id === selectedCircle);
      if (circle) {
        filtered = filtered.filter(share => 
          share.content.therapeuticTags?.some(tag => 
            circle.focus.some(focus => focus.includes(tag))
          )
        );
      }
    }

    if (filterBy === 'mood' && currentMood) {
      filtered = filtered.filter(share => share.metadata.mood === currentMood);
    } else if (filterBy === 'intention') {
      filtered = filtered.filter(share => share.metadata.intention === 'inspiration');
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [shares, selectedCircle, filterBy, currentMood]);

  // Handle reaction to a share
  const handleReaction = useCallback((shareId: string, reactionType: string) => {
    setShares(prev => prev.map(share => {
      if (share.id === shareId) {
        const updatedReactions = share.engagement.reactions.map(reaction => {
          if (reaction.type === reactionType) {
            return {
              ...reaction,
              count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
              userReacted: !reaction.userReacted
            };
          } else if (reaction.userReacted) {
            // Remove previous reaction
            return { ...reaction, count: reaction.count - 1, userReacted: false };
          }
          return reaction;
        });
        
        return {
          ...share,
          engagement: {
            ...share.engagement,
            reactions: updatedReactions
          }
        };
      }
      return share;
    }));

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, []);

  // Create new share
  const createShare = useCallback(() => {
    if (!shareMode || !newShare.content?.title) return;

    const share: CreativeShare = {
      id: Date.now().toString(),
      type: shareMode,
      content: newShare.content || {},
      metadata: {
        mood: currentMood,
        intention: 'healing',
        vulnerabilityLevel: 'medium',
        seekingResponse: 'gentle_witness',
        ...newShare.metadata
      },
      privacy: {
        visibility: 'anonymous',
        allowComments: true,
        allowReactions: true,
        allowSaves: true,
        moderationLevel: 'standard',
        ...newShare.privacy
      },
      engagement: {
        reactions: GENTLE_REACTIONS.map(r => ({ ...r, count: 0, userReacted: false })),
        witnessCount: 0,
        saves: 0,
        gentleResponses: []
      },
      author: {
        id: 'current_user',
        displayName: newShare.privacy?.visibility === 'anonymous' ? 'Anonymous Creator' : 'Creative Soul',
        isAnonymous: newShare.privacy?.visibility === 'anonymous' || false,
        creativeBadges: [],
        trustLevel: 3
      },
      timestamp: new Date()
    };

    setShares(prev => [share, ...prev]);
    onShare?.(share);

    // Reset form
    setNewShare({});
    setShareMode(null);
    setActiveTab('explore');

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [shareMode, newShare, currentMood, onShare]);

  // Format relative time
  const formatRelativeTime = useCallback((date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  }, []);

  return (
    <div className={`creative-community ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Creative Community
        </h3>
        <p className="text-sm text-gray-600">
          Share your healing journey through creative expression
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs flex items-center justify-center mb-6 bg-sage-50 rounded-2xl p-1">
        {[
          { id: 'explore', name: 'Explore', icon: '🌟' },
          { id: 'share', name: 'Share', icon: '✨' },
          { id: 'circles', name: 'Circles', icon: '🤝' },
          { id: 'my_shares', name: 'My Shares', icon: '📖' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-sage-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Explore Tab */}
      {activeTab === 'explore' && (
        <div className="explore-tab">
          
          {/* Filters */}
          <div className="filters mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={selectedCircle || 'all'}
                onChange={(e) => setSelectedCircle(e.target.value === 'all' ? null : e.target.value)}
                className="px-3 py-2 bg-white border border-sage-200 rounded-lg text-sm"
              >
                <option value="all">All Circles</option>
                {CREATIVE_CIRCLES.map(circle => (
                  <option key={circle.id} value={circle.id}>
                    {circle.name} ({circle.memberCount})
                  </option>
                ))}
              </select>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-sage-200 rounded-lg text-sm"
              >
                <option value="all">All Posts</option>
                <option value="mood">My Mood</option>
                <option value="intention">Inspiring</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredShares.length} shares
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="guidelines mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2">Community Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• This is a trauma-informed, healing-focused space</li>
              <li>• All creative expression is welcome and celebrated</li>
              <li>• Respond with gentle witnessing rather than advice</li>
              <li>• Respect privacy choices and content warnings</li>
              <li>• Report any content that feels unsafe or inappropriate</li>
            </ul>
          </div>

          {/* Shares Feed */}
          <div className="shares-feed space-y-6">
            {filteredShares.map(share => (
              <div key={share.id} className="share-card bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                
                {/* Share Header */}
                <div className="share-header flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="author-avatar w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                      {share.author.isAnonymous ? '🎭' : '✨'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{share.author.displayName}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatRelativeTime(share.timestamp)}</span>
                        {share.metadata.mood && (
                          <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full capitalize">
                            {share.metadata.mood}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                          {share.metadata.intention}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋯
                  </button>
                </div>

                {/* Share Content */}
                <div className="share-content mb-4">
                  {share.content.title && (
                    <h4 className="font-medium text-gray-800 mb-2">{share.content.title}</h4>
                  )}
                  
                  {share.type === 'art' && share.content.imageData && (
                    <div className="art-display mb-3">
                      <img 
                        src={share.content.imageData} 
                        alt={share.content.title || 'Shared artwork'}
                        className="w-full max-w-md mx-auto rounded-xl"
                      />
                    </div>
                  )}
                  
                  {share.type === 'poetry' && share.content.text && (
                    <div className="poetry-display p-4 bg-gray-50 rounded-xl mb-3">
                      <pre className="whitespace-pre-wrap text-gray-800 font-serif leading-relaxed">
                        {share.content.text}
                      </pre>
                    </div>
                  )}
                  
                  {share.content.description && (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {share.content.description}
                    </p>
                  )}
                  
                  {share.content.therapeuticTags && share.content.therapeuticTags.length > 0 && (
                    <div className="therapeutic-tags flex flex-wrap gap-2 mb-3">
                      {share.content.therapeuticTags.map(tag => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vulnerability & Seeking */}
                <div className="share-meta mb-4 p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        Sharing level: <span className="font-medium capitalize text-sage-700">
                          {share.metadata.vulnerabilityLevel} vulnerability
                        </span>
                      </span>
                      {share.metadata.seekingResponse !== 'none' && (
                        <span className="text-gray-600">
                          Seeking: <span className="font-medium text-blue-700">
                            {share.metadata.seekingResponse.replace('_', ' ')}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {share.engagement.witnessCount} witnessed
                    </span>
                  </div>
                </div>

                {/* Reactions */}
                <div className="share-reactions flex items-center justify-between">
                  <div className="reactions-list flex items-center gap-1">
                    {share.engagement.reactions
                      .filter(reaction => reaction.count > 0 || reaction.userReacted)
                      .map(reaction => (
                        <button
                          key={reaction.type}
                          onClick={() => handleReaction(share.id, reaction.type)}
                          className={`reaction-button px-3 py-1 rounded-full text-sm transition-all ${
                            reaction.userReacted
                              ? 'bg-sage-200 text-sage-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-sage-100'
                          }`}
                          title={reaction.meaning}
                        >
                          <span className="mr-1">{reaction.emoji}</span>
                          {reaction.count > 0 && <span>{reaction.count}</span>}
                        </button>
                      ))}
                  </div>
                  
                  <div className="share-actions flex items-center gap-2">
                    {share.privacy.allowSaves && (
                      <button className="text-gray-400 hover:text-sage-600 p-2">
                        🔖
                      </button>
                    )}
                    {share.privacy.allowComments && (
                      <button className="text-gray-400 hover:text-blue-600 p-2">
                        💬
                      </button>
                    )}
                  </div>
                </div>

                {/* Gentle Response Options */}
                {share.metadata.seekingResponse !== 'none' && (
                  <div className="gentle-responses mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Quick responses:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'I see your courage 💚',
                        'This resonates with me 🌊',
                        'Thank you for sharing ✨',
                        'Sending gentle support 🤗'
                      ].map(response => (
                        <button
                          key={response}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                        >
                          {response}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Tab */}
      {activeTab === 'share' && (
        <div className="share-tab">
          {!shareMode ? (
            <div className="share-mode-selection">
              <h4 className="text-lg font-medium text-gray-800 mb-6 text-center">
                What would you like to share?
              </h4>
              
              <div className="share-types grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { type: 'art', name: 'Artwork', icon: '🎨', description: 'Visual creation or digital art' },
                  { type: 'poetry', name: 'Poetry', icon: '📝', description: 'Written words and verses' },
                  { type: 'voice_note', name: 'Voice Note', icon: '🎤', description: 'Spoken reflection or sharing' },
                  { type: 'reflection', name: 'Reflection', icon: '💭', description: 'Insights from your journey' }
                ].map(shareType => (
                  <button
                    key={shareType.type}
                    onClick={() => setShareMode(shareType.type as any)}
                    className="share-type-card p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-sage-300 hover:shadow-sm transition-all duration-200 text-center"
                  >
                    <div className="text-3xl mb-2">{shareType.icon}</div>
                    <div className="font-medium text-gray-800 mb-1">{shareType.name}</div>
                    <div className="text-xs text-gray-600">{shareType.description}</div>
                  </button>
                ))}
              </div>

              <div className="sharing-inspiration p-4 bg-gradient-to-r from-sage-50 to-green-50 rounded-xl">
                <h5 className="font-medium text-gray-800 mb-2">Sharing as Healing</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  When we share our creative expressions, we transform isolation into connection. 
                  Your vulnerability gives others permission to be authentic too. Every share contributes 
                  to our collective healing journey.
                </p>
              </div>
            </div>
          ) : (
            <div className="share-creation bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium text-gray-800">
                  Share Your {shareMode?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <button
                  onClick={() => setShareMode(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={newShare.content?.title || ''}
                    onChange={(e) => setNewShare(prev => ({
                      ...prev,
                      content: { ...prev.content, title: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent"
                    placeholder="Give your creation a title..."
                  />
                </div>

                {/* Content based on type */}
                {shareMode === 'poetry' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Poetry
                    </label>
                    <textarea
                      value={newShare.content?.text || ''}
                      onChange={(e) => setNewShare(prev => ({
                        ...prev,
                        content: { ...prev.content, text: e.target.value }
                      }))}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent h-48 font-serif leading-relaxed"
                      placeholder="Let your words flow..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}

                {shareMode === 'reflection' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reflection
                    </label>
                    <textarea
                      value={newShare.content?.description || ''}
                      onChange={(e) => setNewShare(prev => ({
                        ...prev,
                        content: { ...prev.content, description: e.target.value }
                      }))}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-300 focus:border-transparent h-32"
                      placeholder="Share your insights, learnings, or reflections..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}

                {/* Therapeutic Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Therapeutic Themes (optional)
                  </label>
                  <div className="therapeutic-tags-input">
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {[
                        'healing', 'growth', 'resilience', 'self_love', 'grief',
                        'joy', 'transformation', 'courage', 'hope', 'release',
                        'connection', 'boundaries', 'authenticity', 'creativity', 'peace'
                      ].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = newShare.content?.therapeuticTags || [];
                            const hasTag = currentTags.includes(tag);
                            setNewShare(prev => ({
                              ...prev,
                              content: {
                                ...prev.content,
                                therapeuticTags: hasTag
                                  ? currentTags.filter(t => t !== tag)
                                  : [...currentTags, tag]
                              }
                            }));
                          }}
                          className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                            newShare.content?.therapeuticTags?.includes(tag)
                              ? 'bg-purple-200 text-purple-800'
                              : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                          }`}
                        >
                          {tag.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sharing Settings */}
                <div className="sharing-settings p-4 bg-sage-50 rounded-xl">
                  <h5 className="font-medium text-gray-800 mb-3">Sharing Settings</h5>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Intention */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intention
                      </label>
                      <select
                        value={newShare.metadata?.intention || 'healing'}
                        onChange={(e) => setNewShare(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, intention: e.target.value as any }
                        }))}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="healing">Healing</option>
                        <option value="celebration">Celebration</option>
                        <option value="processing">Processing</option>
                        <option value="inspiration">Inspiration</option>
                        <option value="support">Seeking Support</option>
                      </select>
                    </div>

                    {/* Vulnerability Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vulnerability Level
                      </label>
                      <select
                        value={newShare.metadata?.vulnerabilityLevel || 'medium'}
                        onChange={(e) => setNewShare(prev => ({
                          ...prev,
                          metadata: { ...prev.metadata, vulnerabilityLevel: e.target.value as any }
                        }))}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="low">Low - Safe to share widely</option>
                        <option value="medium">Medium - Personal but not deeply sensitive</option>
                        <option value="high">High - Very personal and sensitive</option>
                      </select>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="privacy-options">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Privacy & Visibility</span>
                      <button
                        onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                        className="text-xs text-sage-600 hover:text-sage-800"
                      >
                        {showPrivacySettings ? 'Hide' : 'Show'} options
                      </button>
                    </div>
                    
                    {showPrivacySettings && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Visibility</label>
                          <select
                            value={newShare.privacy?.visibility || 'anonymous'}
                            onChange={(e) => setNewShare(prev => ({
                              ...prev,
                              privacy: { ...prev.privacy, visibility: e.target.value as any }
                            }))}
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                          >
                            <option value="anonymous">Anonymous - Hide my identity</option>
                            <option value="community">Community - Show my display name</option>
                            <option value="circles_only">Circles Only - Only in my circles</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={newShare.privacy?.allowReactions !== false}
                              onChange={(e) => setNewShare(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, allowReactions: e.target.checked }
                              }))}
                            />
                            Allow reactions
                          </label>
                          
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={newShare.privacy?.allowComments !== false}
                              onChange={(e) => setNewShare(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, allowComments: e.target.checked }
                              }))}
                            />
                            Allow responses
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Button */}
                <div className="text-center">
                  <button
                    onClick={createShare}
                    disabled={!newShare.content?.title && !newShare.content?.text && !newShare.content?.description}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      newShare.content?.title || newShare.content?.text || newShare.content?.description
                        ? 'bg-sage-400 text-white hover:bg-sage-500'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Share with Community
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Circles Tab */}
      {activeTab === 'circles' && (
        <div className="circles-tab">
          <h4 className="text-lg font-medium text-gray-800 mb-6 text-center">
            Creative Healing Circles
          </h4>
          
          <div className="circles-grid space-y-4">
            {CREATIVE_CIRCLES.map(circle => (
              <div key={circle.id} className="circle-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="font-medium text-gray-800">{circle.name}</h5>
                      {circle.isPrivate && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{circle.description}</p>
                    
                    <div className="circle-meta flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>{circle.memberCount} members</span>
                      <span className="capitalize">{circle.moderationStyle} moderation</span>
                    </div>
                    
                    <div className="focus-areas flex flex-wrap gap-2">
                      {circle.focus.map(focus => (
                        <span 
                          key={focus}
                          className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                        >
                          {focus.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-sage-400 text-white rounded-lg text-sm hover:bg-sage-500 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Shares Tab */}
      {activeTab === 'my_shares' && (
        <div className="my-shares-tab text-center">
          <div className="empty-state py-12">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">
              Your Creative Shares
            </h4>
            <p className="text-gray-600 mb-6">
              When you share your creative expressions, they'll appear here
            </p>
            <button
              onClick={() => setActiveTab('share')}
              className="px-6 py-3 bg-sage-400 text-white rounded-lg hover:bg-sage-500 transition-colors"
            >
              Share Something Beautiful
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeCommunity;