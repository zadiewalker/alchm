// ALCHM Identity Discussion Community
// Anonymous community features for identity-based discussions with cultural safety and moderation

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  IdentityDiscussionCommunity,
  DiscussionSpace,
  AffinityGroup,
  SupportCircle,
  CommunityGuideline,
  AnonymousPosting,
  FacilitatedDiscussion
} from '@/types/identity-pathway-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CulturalContext } from '@/types/identity-schema';

interface CommunityProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  community: IdentityDiscussionCommunity;
  onDiscussionJoin?: (discussionId: string) => void;
  onPostCreate?: (post: CommunityPost) => void;
  onReportSubmit?: (report: CommunityReport) => void;
  culturalSafetyEnabled?: boolean;
}

interface CommunityPost {
  postId: string;
  authorId: string; // Anonymous ID
  content: string;
  discussionSpaceId: string;
  tags: string[];
  isAnonymous: boolean;
  culturalContext?: string[];
  triggerWarnings?: string[];
  supportType?: 'seeking' | 'offering' | 'sharing';
  timestamp: Date;
  interactions: PostInteraction[];
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'removed';
}

interface PostInteraction {
  type: 'support' | 'relate' | 'appreciate' | 'resource_share';
  anonymousUserId: string;
  timestamp: Date;
  message?: string;
}

interface CommunityReport {
  reportId: string;
  reportedContentId: string;
  reportedContentType: 'post' | 'comment' | 'user_behavior';
  reportReason: string;
  description: string;
  reporterAnonymousId: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'urgent';
}

const IdentityDiscussionCommunity: React.FC<CommunityProps> = ({
  userId,
  identityProfile,
  community,
  onDiscussionJoin,
  onPostCreate,
  onReportSubmit,
  culturalSafetyEnabled = true
}) => {
  // State management
  const [activeSpace, setActiveSpace] = useState<DiscussionSpace | null>(null);
  const [currentView, setCurrentView] = useState<'spaces' | 'discussion' | 'guidelines' | 'support'>('spaces');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [supportType, setSupportType] = useState<'seeking' | 'offering' | 'sharing'>('sharing');
  const [triggerWarnings, setTriggerWarnings] = useState<string[]>([]);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [anonymousId, setAnonymousId] = useState<string>('');
  const [joinedSpaces, setJoinedSpaces] = useState<string[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  // Initialize community session
  useEffect(() => {
    initializeCommunitySession();
  }, []);

  const initializeCommunitySession = async () => {
    // Generate anonymous ID for this session
    const sessionAnonymousId = await generateAnonymousId(userId);
    setAnonymousId(sessionAnonymousId);
    
    // Load user's joined spaces
    const userSpaces = await loadUserJoinedSpaces(userId);
    setJoinedSpaces(userSpaces);
    
    // Show community guidelines if first time
    const hasSeenGuidelines = await checkGuidelinesAcknowledgment(userId);
    if (!hasSeenGuidelines) {
      setShowGuidelines(true);
    }
  };

  // Handle joining a discussion space
  const handleJoinSpace = useCallback(async (space: DiscussionSpace) => {
    try {
      await joinDiscussionSpace(space.spaceId, userId, anonymousId);
      setJoinedSpaces(prev => [...prev, space.spaceId]);
      setActiveSpace(space);
      setCurrentView('discussion');
      
      // Load posts for this space
      const spacePosts = await loadSpacePosts(space.spaceId);
      setPosts(spacePosts);
      
      onDiscussionJoin?.(space.spaceId);
    } catch (error) {
      console.error('Error joining space:', error);
    }
  }, [userId, anonymousId, onDiscussionJoin]);

  // Handle creating a new post
  const handleCreatePost = useCallback(async () => {
    if (!activeSpace || !newPostContent.trim()) return;

    try {
      const newPost: CommunityPost = {
        postId: `post_${Date.now()}`,
        authorId: isAnonymous ? anonymousId : userId,
        content: newPostContent,
        discussionSpaceId: activeSpace.spaceId,
        tags: selectedTags,
        isAnonymous,
        culturalContext: identityProfile.culturalIdentity?.culturalHeritage?.map(h => h.name) || [],
        triggerWarnings: triggerWarnings.length > 0 ? triggerWarnings : undefined,
        supportType,
        timestamp: new Date(),
        interactions: [],
        moderationStatus: 'pending'
      };

      // Submit for moderation and community validation
      const moderatedPost = await submitPostForModeration(newPost);
      
      if (moderatedPost.moderationStatus === 'approved') {
        setPosts(prev => [moderatedPost, ...prev]);
        onPostCreate?.(moderatedPost);
      }

      // Reset form
      setNewPostContent('');
      setSelectedTags([]);
      setTriggerWarnings([]);
      setSupportType('sharing');
      setShowPostForm(false);

    } catch (error) {
      console.error('Error creating post:', error);
    }
  }, [
    activeSpace,
    newPostContent,
    isAnonymous,
    anonymousId,
    userId,
    selectedTags,
    triggerWarnings,
    supportType,
    identityProfile,
    onPostCreate
  ]);

  // Handle post interaction
  const handlePostInteraction = useCallback(async (
    postId: string,
    interactionType: PostInteraction['type'],
    message?: string
  ) => {
    try {
      const interaction: PostInteraction = {
        type: interactionType,
        anonymousUserId: anonymousId,
        timestamp: new Date(),
        message
      };

      await addPostInteraction(postId, interaction);
      
      // Update local state
      setPosts(prev => prev.map(post => 
        post.postId === postId 
          ? { ...post, interactions: [...post.interactions, interaction] }
          : post
      ));
      
    } catch (error) {
      console.error('Error adding interaction:', error);
    }
  }, [anonymousId]);

  // Handle reporting content
  const handleReportContent = useCallback(async (
    contentId: string,
    contentType: 'post' | 'comment' | 'user_behavior',
    reason: string,
    description: string
  ) => {
    try {
      const report: CommunityReport = {
        reportId: `report_${Date.now()}`,
        reportedContentId: contentId,
        reportedContentType: contentType,
        reportReason: reason,
        description,
        reporterAnonymousId: anonymousId,
        timestamp: new Date(),
        severity: determineSeverity(reason, description)
      };

      await submitCommunityReport(report);
      onReportSubmit?.(report);
      
      setReportDialogOpen(false);
      setReportTarget(null);
      
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  }, [anonymousId, onReportSubmit]);

  // Render community guidelines
  const renderCommunityGuidelines = () => {
    if (!showGuidelines) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl mx-4 max-h-96 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">🤝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Community Guidelines & Cultural Safety
            </h2>
            <p className="text-gray-600">
              Creating a safe, inclusive space for authentic identity conversations
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {community.communityGuidelines.map((guideline, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{guideline.title}</h3>
                <p className="text-gray-700 text-sm mb-2">{guideline.description}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {guideline.specificRules.map((rule, ruleIndex) => (
                    <li key={ruleIndex}>• {rule}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Important Reminders</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Your identity and experiences are valid and valued</li>
                  <li>• Anonymous posting protects your privacy</li>
                  <li>• Report any content that violates guidelines</li>
                  <li>• Seek professional support for crisis situations</li>
                  <li>• Cultural differences in communication are respected</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setShowGuidelines(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              I'll review later
            </button>
            <button
              onClick={() => {
                acknowledgeGuidelines(userId);
                setShowGuidelines(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              I understand and agree
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render discussion spaces overview
  const renderDiscussionSpaces = () => {
    const spaceCategories = groupSpacesByCategory(community.discussionSpaces);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Identity Discussion Spaces
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with others who share similar experiences, explore different perspectives, 
            and find support in your identity journey.
          </p>
        </div>

        {Object.entries(spaceCategories).map(([category, spaces]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
              {category.replace('_', ' ')} Discussions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spaces.map((space) => (
                <div
                  key={space.spaceId}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleJoinSpace(space)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getSpaceIcon(space.category)}</span>
                      <h4 className="font-medium text-gray-800">{space.name}</h4>
                    </div>
                    {joinedSpaces.includes(space.spaceId) && (
                      <span className="text-green-600 text-sm">✓ Joined</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{space.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{space.memberCount} members</span>
                    <span>{space.activityLevel} activity</span>
                  </div>
                  
                  {space.culturalFocus && (
                    <div className="mt-2">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {space.culturalFocus}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render active discussion space
  const renderActiveDiscussion = () => {
    if (!activeSpace) return null;

    return (
      <div className="space-y-6">
        {/* Discussion header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setCurrentView('spaces');
                  setActiveSpace(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Spaces
              </button>
              <span className="text-xl">{getSpaceIcon(activeSpace.category)}</span>
              <h2 className="text-xl font-semibold text-gray-800">{activeSpace.name}</h2>
            </div>
            
            <button
              onClick={() => setShowPostForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Share Experience
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">{activeSpace.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{activeSpace.memberCount} members</span>
            <span>{posts.length} posts</span>
            <span>Activity: {activeSpace.activityLevel}</span>
          </div>
        </div>

        {/* Post creation form */}
        {showPostForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Share Your Experience</h3>
              <button
                onClick={() => setShowPostForm(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to share?
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, questions, or offer support to others..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Type
                  </label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sharing">Sharing Experience</option>
                    <option value="seeking">Seeking Support</option>
                    <option value="offering">Offering Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Level
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(true)}
                        className="mr-2"
                      />
                      Anonymous
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isAnonymous}
                        onChange={() => setIsAnonymous(false)}
                        className="mr-2"
                      />
                      Identified
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Warnings
                  </label>
                  <div className="space-x-2">
                    {['Trauma', 'Discrimination', 'Family', 'Mental Health'].map((warning) => (
                      <label key={warning} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={triggerWarnings.includes(warning)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTriggerWarnings(prev => [...prev, warning]);
                            } else {
                              setTriggerWarnings(prev => prev.filter(w => w !== warning));
                            }
                          }}
                          className="mr-1"
                        />
                        <span className="text-xs">{warning}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowPostForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Share Anonymously
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.postId} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {post.isAnonymous ? 'Anonymous Community Member' : 'Community Member'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.timestamp.toLocaleDateString()} • {post.supportType}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setReportTarget(post.postId);
                    setReportDialogOpen(true);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Report
                </button>
              </div>

              {post.triggerWarnings && post.triggerWarnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span className="text-yellow-800 text-sm font-medium">Content Warning:</span>
                    <span className="text-yellow-700 text-sm">
                      {post.triggerWarnings.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-gray-800">{post.content}</p>
              </div>

              {post.culturalContext && post.culturalContext.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-purple-600">
                    Cultural Context: {post.culturalContext.join(', ')}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handlePostInteraction(post.postId, 'support')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <span>💙</span>
                  <span className="text-sm">Support ({post.interactions.filter(i => i.type === 'support').length})</span>
                </button>
                <button
                  onClick={() => handlePostInteraction(post.postId, 'relate')}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                >
                  <span>🤝</span>
                  <span className="text-sm">Relate ({post.interactions.filter(i => i.type === 'relate').length})</span>
                </button>
                <button
                  onClick={() => handlePostInteraction(post.postId, 'appreciate')}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                >
                  <span>✨</span>
                  <span className="text-sm">Appreciate ({post.interactions.filter(i => i.type === 'appreciate').length})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderCommunityGuidelines()}
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Identity Discussion Community
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A safe, anonymous space to explore identity, share experiences, and connect with others 
            on similar journeys of self-discovery and cultural understanding.
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('spaces')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'spaces' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Discussion Spaces
              </button>
              <button
                onClick={() => setCurrentView('guidelines')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'guidelines' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Community Guidelines
              </button>
              <button
                onClick={() => setCurrentView('support')}
                className={`px-4 py-2 rounded-lg ${
                  currentView === 'support' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Support Resources
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              Anonymous ID: {anonymousId.slice(0, 8)}...
            </div>
          </div>
        </div>

        {/* Content */}
        {currentView === 'spaces' && !activeSpace && renderDiscussionSpaces()}
        {currentView === 'discussion' || activeSpace ? renderActiveDiscussion() : null}
        {currentView === 'guidelines' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Guidelines</h2>
            {/* Guidelines content would be rendered here */}
          </div>
        )}
        {currentView === 'support' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Support Resources</h2>
            {/* Support resources would be rendered here */}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const generateAnonymousId = async (userId: string): Promise<string> => {
  // Implementation would generate a secure anonymous ID
  return `anon_${Date.now().toString(36)}`;
};

const loadUserJoinedSpaces = async (userId: string): Promise<string[]> => {
  // Implementation would load user's joined spaces
  return [];
};

const checkGuidelinesAcknowledgment = async (userId: string): Promise<boolean> => {
  // Implementation would check if user has seen guidelines
  return false;
};

const acknowledgeGuidelines = async (userId: string): Promise<void> => {
  // Implementation would record guidelines acknowledgment
};

const joinDiscussionSpace = async (spaceId: string, userId: string, anonymousId: string): Promise<void> => {
  // Implementation would handle joining space
};

const loadSpacePosts = async (spaceId: string): Promise<CommunityPost[]> => {
  // Implementation would load posts for space
  return [];
};

const submitPostForModeration = async (post: CommunityPost): Promise<CommunityPost> => {
  // Implementation would submit post for moderation
  return { ...post, moderationStatus: 'approved' };
};

const addPostInteraction = async (postId: string, interaction: PostInteraction): Promise<void> => {
  // Implementation would add interaction to post
};

const submitCommunityReport = async (report: CommunityReport): Promise<void> => {
  // Implementation would submit report for review
};

const determineSeverity = (reason: string, description: string): 'low' | 'medium' | 'high' | 'urgent' => {
  // Implementation would determine report severity
  return 'medium';
};

const groupSpacesByCategory = (spaces: DiscussionSpace[]): Record<string, DiscussionSpace[]> => {
  // Implementation would group spaces by category
  return {
    identity_exploration: [],
    cultural_heritage: [],
    bias_awareness: [],
    support_circles: []
  };
};

const getSpaceIcon = (category: string): string => {
  const icons = {
    identity_exploration: '🧭',
    cultural_heritage: '🌍',
    bias_awareness: '👁️',
    support_circles: '🤝',
    intersectional: '🔗',
    community_action: '✊'
  };
  return icons[category as keyof typeof icons] || '💬';
};

export default IdentityDiscussionCommunity;