// ALCHM Community Discourse Platform
// Anonymous, culturally safe spaces for identity exploration and mutual support

'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  IdentityHubGroup,
  CommunityDiscussion,
  CommunityResponse,
  CulturalContext,
  IdentityJourney,
  BiasReflection,
  AIModerationResult
} from '@/types/identity-schema';
import { BiasAwarenessEngine } from '@/lib/bias-awareness-engine';

interface CommunityDiscourseProps {
  userId: string;
  identityJourney: IdentityJourney;
  culturalContext: CulturalContext;
  availableGroups: IdentityHubGroup[];
  onJoinGroup: (groupId: string) => void;
  onCreateDiscussion: (discussion: Omit<CommunityDiscussion, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  onRespondToDiscussion: (discussionId: string, response: Omit<CommunityResponse, 'id' | 'createdAt'>) => void;
  traumaInformedMode: boolean;
  anonymityLevel: 'fully_anonymous' | 'consistent_pseudonym' | 'verified_member';
}

interface DiscourseState {
  activeGroupId: string | null;
  activeDiscussionId: string | null;
  viewMode: 'groups' | 'discussions' | 'create_discussion' | 'discussion_detail';
  filterBy: 'all' | 'cultural_affinity' | 'intersectional_support' | 'bias_accountability' | 'empathy_building' | 'healing_circles';
  sortBy: 'recent' | 'engagement' | 'cultural_resonance' | 'healing_focus';
  showOnlyMyGroups: boolean;
  moderationAlerts: ModerationAlert[];
  communityWisdom: CommunityWisdomMoment[];
  safetyMode: boolean;
}

interface ModerationAlert {
  id: string;
  type: 'bias_detected' | 'cultural_insensitivity' | 'trauma_risk' | 'healing_opportunity';
  severity: 'info' | 'caution' | 'important';
  message: string;
  suggestedActions: string[];
}

interface CommunityWisdomMoment {
  id: string;
  content: string;
  culturalOrigin: string;
  applicableContext: string[];
  sharedBy: 'community' | 'elder' | 'ai_assistant';
}

export const CommunityDiscourseComponent: React.FC<CommunityDiscourseProps> = ({
  userId,
  identityJourney,
  culturalContext,
  availableGroups,
  onJoinGroup,
  onCreateDiscussion,
  onRespondToDiscussion,
  traumaInformedMode,
  anonymityLevel
}) => {
  
  const [state, setState] = useState<DiscourseState>({
    activeGroupId: null,
    activeDiscussionId: null,
    viewMode: 'groups',
    filterBy: 'all',
    sortBy: 'recent',
    showOnlyMyGroups: false,
    moderationAlerts: [],
    communityWisdom: [],
    safetyMode: traumaInformedMode
  });

  const [biasEngine] = useState(() => new BiasAwarenessEngine({
    sensitivityLevel: 'high',
    culturalContextRequired: true,
    intersectionalAnalysis: true,
    traumaInformedApproach: traumaInformedMode,
    anonymousProcessing: true,
    communityLearningEnabled: true
  }));

  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    discussionType: 'narrative_sharing' as const,
    culturalContext: [] as string[],
    contentWarnings: [] as string[],
    visibility: 'group_only' as const
  });

  const [newResponse, setNewResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Filter and sort groups based on current settings
  const filteredGroups = useMemo(() => {
    let groups = availableGroups;

    if (state.filterBy !== 'all') {
      groups = groups.filter(group => group.groupType === state.filterBy);
    }

    if (state.showOnlyMyGroups) {
      // This would check user membership in real implementation
      groups = groups.filter(group => group.participantCount > 0);
    }

    return groups.sort((a, b) => {
      switch (state.sortBy) {
        case 'engagement':
          return b.engagementLevel - a.engagementLevel;
        case 'cultural_resonance':
          return b.culturalFocusAreas.length - a.culturalFocusAreas.length;
        case 'healing_focus':
          return (b.groupType === 'healing_circles' ? 1 : 0) - (a.groupType === 'healing_circles' ? 1 : 0);
        default:
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      }
    });
  }, [availableGroups, state.filterBy, state.sortBy, state.showOnlyMyGroups]);

  // AI moderation for content before posting
  const analyzeContent = useCallback(async (content: string, context: 'discussion' | 'response') => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await biasEngine.detectBias(content, {
        userId,
        culturalContext,
        identityElements: identityJourney.identityMap.personal,
        previousReflections: identityJourney.biasReflections
      });

      const alerts: ModerationAlert[] = [];

      // Check for detected biases
      if (analysis.detectedBiases.length > 0) {
        analysis.detectedBiases.forEach(bias => {
          if (bias.confidenceScore > 0.6) {
            alerts.push({
              id: `bias_alert_${Date.now()}`,
              type: 'bias_detected',
              severity: bias.severity === 'critical' ? 'important' : 'caution',
              message: `Potential ${bias.biasCategory} bias detected: ${bias.evidenceText}`,
              suggestedActions: [
                'Consider rephrasing with more inclusive language',
                'Reflect on assumptions being made',
                'Ask for diverse perspectives'
              ]
            });
          }
        });
      }

      // Check trauma safety
      if (analysis.traumaSafety.safetyLevel !== 'safe') {
        alerts.push({
          id: `trauma_alert_${Date.now()}`,
          type: 'trauma_risk',
          severity: 'important',
          message: 'Content may be emotionally challenging for some community members',
          suggestedActions: [
            'Add content warnings',
            'Use gentler language',
            'Provide support resources'
          ]
        });
      }

      // Highlight healing opportunities
      if (analysis.empathyBuildingOpportunities.length > 0) {
        alerts.push({
          id: `healing_alert_${Date.now()}`,
          type: 'healing_opportunity',
          severity: 'info',
          message: 'This content has potential for community healing and empathy building',
          suggestedActions: [
            'Consider sharing with healing-focused groups',
            'Invite supportive responses',
            'Connect with similar experiences'
          ]
        });
      }

      setState(prev => ({ ...prev, moderationAlerts: alerts }));

      // Generate community wisdom if applicable
      if (analysis.communityLearningValue > 0.7) {
        const wisdom: CommunityWisdomMoment = {
          id: `wisdom_${Date.now()}`,
          content: 'This reflection offers valuable learning for the community about identity and bias awareness.',
          culturalOrigin: culturalContext.valueSystem?.[0] || 'universal',
          applicableContext: ['bias_awareness', 'identity_exploration'],
          sharedBy: 'ai_assistant'
        };
        
        setState(prev => ({ 
          ...prev, 
          communityWisdom: [...prev.communityWisdom, wisdom] 
        }));
      }

    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [biasEngine, userId, culturalContext, identityJourney]);

  // Handle creating new discussion
  const handleCreateDiscussion = useCallback(async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim() || !state.activeGroupId) {
      return;
    }

    // AI moderation before posting
    await analyzeContent(newDiscussion.content, 'discussion');

    const discussion: Omit<CommunityDiscussion, 'id' | 'createdAt' | 'lastUpdated'> = {
      groupId: state.activeGroupId,
      authorId: anonymityLevel === 'fully_anonymous' ? 'anonymous' : userId,
      title: newDiscussion.title,
      content: newDiscussion.content,
      discussionType: newDiscussion.discussionType,
      culturalContext: newDiscussion.culturalContext,
      identityDimensions: identityJourney.identityMap.cultural.map(c => c.culturalDimension),
      contentWarnings: newDiscussion.contentWarnings,
      aiModeration: {
        moderationScore: 0.8,
        flaggedContent: [],
        culturalSensitivity: 0.9,
        traumaInformed: traumaInformedMode
      } as AIModerationResult,
      responses: [],
      empathyMetrics: [],
      learningOutcomes: [],
      culturalBridges: [],
      biasCallouts: [],
      supportOffered: [],
      healingWitness: [],
      advocacyMoments: [],
      wisdomShared: [],
      connectionsMade: [],
      visibility: newDiscussion.visibility,
      anonymityLevel: anonymityLevel,
      engagementLevel: 1,
      impactScore: 1,
      culturalSensitivityScore: 0.9,
      traumaInformedScore: traumaInformedMode ? 0.9 : 0.7,
      isActive: true,
      isArchived: false
    };

    onCreateDiscussion(discussion);
    
    // Reset form
    setNewDiscussion({
      title: '',
      content: '',
      discussionType: 'narrative_sharing',
      culturalContext: [],
      contentWarnings: [],
      visibility: 'group_only'
    });

    setState(prev => ({ ...prev, viewMode: 'discussions' }));
  }, [newDiscussion, state.activeGroupId, analyzeContent, onCreateDiscussion, anonymityLevel, userId, identityJourney, traumaInformedMode]);

  // Handle responding to discussion
  const handleRespondToDiscussion = useCallback(async () => {
    if (!newResponse.trim() || !state.activeDiscussionId) {
      return;
    }

    // AI moderation before posting
    await analyzeContent(newResponse, 'response');

    const response: Omit<CommunityResponse, 'id' | 'createdAt'> = {
      authorId: anonymityLevel === 'fully_anonymous' ? 'anonymous' : userId,
      content: newResponse,
      responseType: 'supportive_sharing',
      culturalContext: culturalContext.valueSystem || [],
      empathyLevel: 8, // Would be calculated based on content analysis
      supportLevel: 7,
      learningContribution: 6,
      healingPotential: traumaInformedMode ? 8 : 5,
      biasChallenge: null,
      wisdomShared: null,
      connectionOffered: true,
      advocacyAction: null,
      anonymityLevel: anonymityLevel,
      aiModeration: {
        moderationScore: 0.8,
        flaggedContent: [],
        culturalSensitivity: 0.9,
        traumaInformed: traumaInformedMode
      } as AIModerationResult,
      culturalSensitivityScore: 0.9,
      traumaInformedScore: traumaInformedMode ? 0.9 : 0.7,
      engagementLevel: 8,
      impactScore: 7
    };

    onRespondToDiscussion(state.activeDiscussionId, response);
    setNewResponse('');
  }, [newResponse, state.activeDiscussionId, analyzeContent, onRespondToDiscussion, anonymityLevel, userId, culturalContext, traumaInformedMode]);

  // Render group card
  const renderGroupCard = useCallback((group: IdentityHubGroup) => {
    const groupIcons = {
      cultural_affinity: '🌍',
      intersectional_support: '🤝',
      bias_accountability: '⚖️',
      empathy_building: '❤️',
      narrative_sharing: '📖',
      allyship_action: '🤜',
      healing_circles: '💚',
      identity_exploration: '🔍'
    };

    return (
      <div
        key={group.id}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          border: '2px solid #f1f3f4',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
        onClick={() => setState(prev => ({ ...prev, activeGroupId: group.id, viewMode: 'discussions' }))}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#3498db';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#f1f3f4';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '32px' }}>{groupIcons[group.groupType]}</span>
          <div>
            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>{group.name}</h3>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              {group.participantCount} members • {group.activeDiscussions} active discussions
            </p>
          </div>
        </div>
        
        <p style={{ color: '#34495e', fontSize: '14px', lineHeight: 1.4, marginBottom: '12px' }}>
          {group.description}
        </p>
        
        {group.culturalFocusAreas.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {group.culturalFocusAreas.slice(0, 3).map(area => (
                <span
                  key={area}
                  style={{
                    backgroundColor: '#ecf0f1',
                    color: '#2c3e50',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
            Privacy: {group.privacyLevel} • Moderation: {group.moderationLevel.replace('_', ' ')}
          </div>
          <div style={{
            backgroundColor: group.engagementLevel > 7 ? '#2ecc71' : group.engagementLevel > 4 ? '#f39c12' : '#e74c3c',
            width: '8px',
            height: '8px',
            borderRadius: '50%'
          }} />
        </div>

        {/* Safety indicators */}
        {traumaInformedMode && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#27ae60',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}>
            💚 Trauma-Informed
          </div>
        )}
      </div>
    );
  }, [traumaInformedMode]);

  // Render discussion creation form
  const renderDiscussionForm = useCallback(() => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px'
    }}>
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>🌟 Start a New Discussion</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
          Discussion Title
        </label>
        <input
          type="text"
          value={newDiscussion.title}
          onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
          placeholder="What would you like to discuss?"
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ecf0f1',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3498db'; }}
          onBlur={(e) => { e.target.style.borderColor = '#ecf0f1'; }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
          Discussion Type
        </label>
        <select
          value={newDiscussion.discussionType}
          onChange={(e) => setNewDiscussion(prev => ({ ...prev, discussionType: e.target.value as any }))}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ecf0f1',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: 'white'
          }}
        >
          <option value="narrative_sharing">📖 Narrative Sharing</option>
          <option value="bias_processing">⚖️ Bias Processing</option>
          <option value="cultural_exploration">🌍 Cultural Exploration</option>
          <option value="empathy_building">❤️ Empathy Building</option>
          <option value="intersectional_dialogue">🤝 Intersectional Dialogue</option>
          <option value="healing_support">💚 Healing Support</option>
          <option value="advocacy_planning">🤜 Advocacy Planning</option>
          <option value="celebration">🎉 Celebration</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
          Your Thoughts
        </label>
        <textarea
          value={newDiscussion.content}
          onChange={(e) => {
            setNewDiscussion(prev => ({ ...prev, content: e.target.value }));
            // Debounced analysis would go here
          }}
          placeholder="Share your thoughts, experiences, or questions..."
          rows={6}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #ecf0f1',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3498db'; }}
          onBlur={(e) => { e.target.style.borderColor = '#ecf0f1'; }}
        />
      </div>

      {/* Content warnings */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
          Content Warnings (optional)
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['trauma', 'discrimination', 'family_conflict', 'mental_health', 'identity_struggle'].map(warning => (
            <label key={warning} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <input
                type="checkbox"
                checked={newDiscussion.contentWarnings.includes(warning)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewDiscussion(prev => ({ 
                      ...prev, 
                      contentWarnings: [...prev.contentWarnings, warning] 
                    }));
                  } else {
                    setNewDiscussion(prev => ({ 
                      ...prev, 
                      contentWarnings: prev.contentWarnings.filter(w => w !== warning) 
                    }));
                  }
                }}
              />
              <span>{warning.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Anonymity level */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
          Anonymity Level: {anonymityLevel.replace('_', ' ')}
        </label>
        <p style={{ fontSize: '12px', color: '#7f8c8d', margin: 0 }}>
          {anonymityLevel === 'fully_anonymous' && 'Your identity is completely hidden'}
          {anonymityLevel === 'consistent_pseudonym' && 'You\'ll appear with the same pseudonym across discussions'}
          {anonymityLevel === 'verified_member' && 'Your verified community identity will be shown'}
        </p>
      </div>

      {/* Moderation alerts */}
      {state.moderationAlerts.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {state.moderationAlerts.map(alert => (
            <div
              key={alert.id}
              style={{
                backgroundColor: alert.severity === 'important' ? '#fff5f5' : '#f0f8ff',
                border: `1px solid ${alert.severity === 'important' ? '#feb2b2' : '#bee3f8'}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px'
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#2c3e50' }}>
                {alert.type === 'bias_detected' && '⚖️'} 
                {alert.type === 'trauma_risk' && '💚'} 
                {alert.type === 'healing_opportunity' && '✨'} 
                {alert.message}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Suggestions: {alert.suggestedActions.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Community wisdom */}
      {state.communityWisdom.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {state.communityWisdom.map(wisdom => (
            <div
              key={wisdom.id}
              style={{
                backgroundColor: '#f0f8ff',
                border: '1px solid #bee3f8',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px'
              }}
            >
              <div style={{ fontWeight: '500', marginBottom: '4px', color: '#2c3e50' }}>
                ✨ Community Wisdom
              </div>
              <div style={{ fontSize: '14px', color: '#34495e', fontStyle: 'italic' }}>
                {wisdom.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trauma-informed reminder */}
      {traumaInformedMode && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #27ae60',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          fontSize: '12px',
          color: '#27ae60'
        }}>
          💚 <strong>Gentle Reminder:</strong> You have complete control over what you share. This is a safe space for authentic expression at your own pace.
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleCreateDiscussion}
          disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim() || isAnalyzing}
          style={{
            backgroundColor: newDiscussion.title.trim() && newDiscussion.content.trim() && !isAnalyzing ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: newDiscussion.title.trim() && newDiscussion.content.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Share with Community'}
        </button>
        
        <button
          onClick={() => setState(prev => ({ ...prev, viewMode: 'discussions' }))}
          style={{
            backgroundColor: 'transparent',
            color: '#7f8c8d',
            border: '2px solid #bdc3c7',
            borderRadius: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ), [newDiscussion, state.moderationAlerts, state.communityWisdom, anonymityLevel, traumaInformedMode, isAnalyzing, handleCreateDiscussion]);

  return (
    <div className="community-discourse-container" style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>
          🤝 Community Identity Hub
        </h2>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Safe spaces for identity exploration, cultural exchange, and mutual support
        </p>
      </div>

      {/* Navigation and Filters */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        {/* View Mode Selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { mode: 'groups', label: '🌍 Groups', icon: '🌍' },
            { mode: 'discussions', label: '💬 Discussions', icon: '💬' },
            { mode: 'create_discussion', label: '✨ Start Discussion', icon: '✨' }
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setState(prev => ({ ...prev, viewMode: mode as any }))}
              style={{
                backgroundColor: state.viewMode === mode ? '#3498db' : 'transparent',
                color: state.viewMode === mode ? 'white' : '#3498db',
                border: '2px solid #3498db',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {state.viewMode === 'groups' && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={state.filterBy}
              onChange={(e) => setState(prev => ({ ...prev, filterBy: e.target.value as any }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #bdc3c7',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              <option value="all">All Groups</option>
              <option value="cultural_affinity">Cultural Affinity</option>
              <option value="intersectional_support">Intersectional Support</option>
              <option value="bias_accountability">Bias Accountability</option>
              <option value="empathy_building">Empathy Building</option>
              <option value="healing_circles">Healing Circles</option>
            </select>

            <select
              value={state.sortBy}
              onChange={(e) => setState(prev => ({ ...prev, sortBy: e.target.value as any }))}
              style={{
                padding: '8px 12px',
                border: '1px solid #bdc3c7',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="engagement">Most Engaged</option>
              <option value="cultural_resonance">Cultural Relevance</option>
              <option value="healing_focus">Healing Focus</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <input
                type="checkbox"
                checked={state.showOnlyMyGroups}
                onChange={(e) => setState(prev => ({ ...prev, showOnlyMyGroups: e.target.checked }))}
              />
              My Groups Only
            </label>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div>
        {/* Groups View */}
        {state.viewMode === 'groups' && (
          <div>
            {filteredGroups.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#7f8c8d'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p>No groups match your current filters.</p>
              </div>
            ) : (
              filteredGroups.map(group => renderGroupCard(group))
            )}
          </div>
        )}

        {/* Create Discussion View */}
        {state.viewMode === 'create_discussion' && renderDiscussionForm()}

        {/* Discussions View - Would render discussions for active group */}
        {state.viewMode === 'discussions' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#7f8c8d'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <p>Select a group to view discussions, or start a new conversation!</p>
            <button
              onClick={() => setState(prev => ({ ...prev, viewMode: 'create_discussion' }))}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              Start New Discussion
            </button>
          </div>
        )}
      </div>

      {/* Safety Mode Indicator */}
      {state.safetyMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
        }}>
          <span>💚</span>
          <span>Trauma-Informed Mode Active</span>
        </div>
      )}
    </div>
  );
};

export default CommunityDiscourseComponent;