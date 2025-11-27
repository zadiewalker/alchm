'use client';

import React, { useState, useEffect } from 'react';
import { SacredCard, SacredText, SacredButton, SacredGrid } from '@/components/SacredUIFoundation';
import { 
  PeerInteractionController, 
  PeerInteractionConfig, 
  PeerInteractionType, 
  PeerMatchResult, 
  PeerInteraction,
  InteractionContext 
} from '@/lib/peer-interaction-architecture';

// ===== PEER INTERACTION HUB TYPES =====

export interface PeerInteractionHubProps {
  userId: string;
  userConfig: PeerInteractionConfig;
  onInteractionStart?: (interactionId: string) => void;
  onSafetyReport?: (reportId: string) => void;
  className?: string;
}

export interface PeerHubState {
  activeTab: 'discover' | 'active' | 'communities' | 'support';
  loading: boolean;
  availablePeers: PeerMatchResult[];
  activeInteractions: PeerInteraction[];
  safetyMode: boolean;
  culturalGuidanceNeeded: boolean;
}

export interface InteractionTypeCard {
  type: PeerInteractionType;
  title: string;
  description: string;
  icon: string;
  safetyLevel: 'safe' | 'supervised' | 'restricted';
  culturalSensitivity: 'low' | 'medium' | 'high';
  recommendedFor: string[];
}

// ===== PEER INTERACTION HUB COMPONENT =====

export default function PeerInteractionHub({
  userId,
  userConfig,
  onInteractionStart,
  onSafetyReport,
  className = ''
}: PeerInteractionHubProps) {
  const [state, setState] = useState<PeerHubState>({
    activeTab: 'discover',
    loading: true,
    availablePeers: [],
    activeInteractions: [],
    safetyMode: userConfig.privacySettings.parentalControlsActive,
    culturalGuidanceNeeded: false
  });

  const [controller] = useState(() => new PeerInteractionController(userConfig));

  const interactionTypes: InteractionTypeCard[] = [
    {
      type: 'reflection_sharing',
      title: 'Share Reflections',
      description: 'Connect through meaningful journal reflections',
      icon: '💭',
      safetyLevel: 'supervised',
      culturalSensitivity: 'high',
      recommendedFor: ['supportive', 'growth-oriented']
    },
    {
      type: 'support_offering',
      title: 'Offer Support',
      description: 'Provide encouragement and guidance to peers',
      icon: '🤝',
      safetyLevel: 'supervised',
      culturalSensitivity: 'medium',
      recommendedFor: ['experienced', 'empathetic']
    },
    {
      type: 'collaborative_journaling',
      title: 'Journal Together',
      description: 'Co-create meaningful written reflections',
      icon: '📝',
      safetyLevel: 'safe',
      culturalSensitivity: 'medium',
      recommendedFor: ['creative', 'collaborative']
    },
    {
      type: 'cultural_exchange',
      title: 'Cultural Sharing',
      description: 'Share traditions, stories, and cultural wisdom',
      icon: '🌍',
      safetyLevel: 'supervised',
      culturalSensitivity: 'high',
      recommendedFor: ['culturally_diverse', 'open_minded']
    },
    {
      type: 'skill_sharing',
      title: 'Share Skills',
      description: 'Teach and learn life skills from each other',
      icon: '🎯',
      safetyLevel: 'safe',
      culturalSensitivity: 'low',
      recommendedFor: ['practical', 'educational']
    },
    {
      type: 'celebration',
      title: 'Celebrate Wins',
      description: 'Share achievements and positive moments',
      icon: '🎉',
      safetyLevel: 'safe',
      culturalSensitivity: 'low',
      recommendedFor: ['positive', 'encouraging']
    },
    {
      type: 'goal_accountability',
      title: 'Goal Partners',
      description: 'Support each other in achieving personal goals',
      icon: '🎯',
      safetyLevel: 'safe',
      culturalSensitivity: 'low',
      recommendedFor: ['motivated', 'committed']
    },
    {
      type: 'creative_collaboration',
      title: 'Create Together',
      description: 'Work on creative projects and artistic expression',
      icon: '🎨',
      safetyLevel: 'safe',
      culturalSensitivity: 'medium',
      recommendedFor: ['artistic', 'innovative']
    }
  ];

  useEffect(() => {
    initializePeerHub();
  }, [userId]);

  const initializePeerHub = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Load available peers based on user preferences
      const peers = await controller.findCompatiblePeers('reflection_sharing', {
        culturalBackground: userConfig.socialLearningProfile.culturalBackground.secondaryCultures,
        sharedInterests: userConfig.interactionPreferences.topicsOfInterest,
        availabilityTimes: [userConfig.interactionPreferences.timeZonePreference]
      });

      setState(prev => ({
        ...prev,
        availablePeers: peers,
        loading: false
      }));

    } catch (error) {
      console.error('Failed to initialize peer hub:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleInteractionTypeSelect = async (type: PeerInteractionType) => {
    try {
      const targetUsers = state.availablePeers.slice(0, 3).map(peer => peer.userId);
      
      const result = await controller.initiateInteraction(type, targetUsers, {
        emotionalTone: 'supportive',
        activityType: type
      });

      if (result.success && result.interactionId) {
        onInteractionStart?.(result.interactionId);
      } else {
        // Handle guidance or restrictions
        setState(prev => ({ 
          ...prev, 
          culturalGuidanceNeeded: !!result.culturalGuidance 
        }));
      }

    } catch (error) {
      console.error('Failed to initiate interaction:', error);
    }
  };

  const renderTabNavigation = () => (
    <div className="flex border-b border-tender-embrace bg-white rounded-lg p-whisper mb-ritual">
      {[
        { id: 'discover', label: 'Discover', icon: '🔍' },
        { id: 'active', label: 'Active', icon: '💬' },
        { id: 'communities', label: 'Communities', icon: '👥' },
        { id: 'support', label: 'Support', icon: '🛡️' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setState(prev => ({ ...prev, activeTab: tab.id as any }))}
          className={`flex-1 px-breath py-gentle text-center border-b-2 transition-colors ${
            state.activeTab === tab.id
              ? 'border-grounding-earth text-grounding-earth'
              : 'border-transparent text-subtle hover:text-deep-presence'
          }`}
        >
          <div className="space-y-whisper">
            <div className="text-lg">{tab.icon}</div>
            <SacredText variant="caption" className="text-xs font-medium">
              {tab.label}
            </SacredText>
          </div>
        </button>
      ))}
    </div>
  );

  const renderDiscoverTab = () => (
    <div className="space-y-ritual">
      {/* Safety Notice */}
      {state.safetyMode && (
        <SacredCard variant="warm">
          <div className="flex items-start gap-gentle">
            <span className="text-2xl">🛡️</span>
            <div className="flex-grow">
              <SacredText variant="caption" className="font-medium">
                Safe Space Active
              </SacredText>
              <SacredText variant="body" className="text-sm">
                Your interactions are supervised and guided for safety. 
                All peer connections are moderated and culturally sensitive.
              </SacredText>
            </div>
          </div>
        </SacredCard>
      )}

      {/* Cultural Guidance Notice */}
      {state.culturalGuidanceNeeded && (
        <SacredCard variant="gentle">
          <div className="flex items-start gap-gentle">
            <span className="text-2xl">🌍</span>
            <div className="flex-grow">
              <SacredText variant="caption" className="font-medium">
                Cultural Guidance Available
              </SacredText>
              <SacredText variant="body" className="text-sm">
                We've prepared some cultural considerations for your peer interactions.
              </SacredText>
              <SacredButton
                intention="gentle"
                size="intimate"
                className="mt-breath"
                onClick={() => setState(prev => ({ ...prev, culturalGuidanceNeeded: false }))}
              >
                📖 View Guidance
              </SacredButton>
            </div>
          </div>
        </SacredCard>
      )}

      {/* Interaction Types */}
      <div>
        <SacredText variant="title" as="h2" className="mb-breath">
          Ways to Connect
        </SacredText>
        <SacredGrid columns={2} gap="breath">
          {interactionTypes.map(interactionType => (
            <InteractionTypeSelector
              key={interactionType.type}
              interactionType={interactionType}
              safetyMode={state.safetyMode}
              onSelect={() => handleInteractionTypeSelect(interactionType.type)}
            />
          ))}
        </SacredGrid>
      </div>

      {/* Available Peers Preview */}
      <div>
        <SacredText variant="title" as="h3" className="mb-breath">
          Potential Connections
        </SacredText>
        {state.loading ? (
          <div className="text-center py-ritual">
            <SacredText variant="body" className="text-subtle">
              Finding compatible peers...
            </SacredText>
          </div>
        ) : (
          <SacredGrid columns={3} gap="breath">
            {state.availablePeers.slice(0, 6).map(peer => (
              <PeerPreviewCard
                key={peer.userId}
                peer={peer}
                safetyMode={state.safetyMode}
              />
            ))}
          </SacredGrid>
        )}
      </div>
    </div>
  );

  const renderActiveTab = () => (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Active Interactions
      </SacredText>
      
      {state.activeInteractions.length === 0 ? (
        <SacredCard variant="gentle" className="text-center py-ritual">
          <div className="space-y-breath">
            <span className="text-4xl">💫</span>
            <SacredText variant="body">
              No active peer interactions yet. Start connecting with others to see your conversations here!
            </SacredText>
            <SacredButton
              intention="primary"
              onClick={() => setState(prev => ({ ...prev, activeTab: 'discover' }))}
            >
              Discover Peers
            </SacredButton>
          </div>
        </SacredCard>
      ) : (
        <div className="space-y-breath">
          {state.activeInteractions.map(interaction => (
            <ActiveInteractionCard
              key={interaction.interactionId}
              interaction={interaction}
              safetyMode={state.safetyMode}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderCommunitiesTab = () => (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Communities
      </SacredText>
      
      <SacredCard variant="gentle" className="text-center py-ritual">
        <div className="space-y-breath">
          <span className="text-4xl">🏘️</span>
          <SacredText variant="body">
            Community features are being developed with your safety and cultural needs in mind.
          </SacredText>
          <SacredText variant="caption" className="text-sm text-subtle">
            Coming soon: Safe spaces for shared interests, cultural backgrounds, and support groups
          </SacredText>
        </div>
      </SacredCard>
    </div>
  );

  const renderSupportTab = () => (
    <div className="space-y-ritual">
      <SacredText variant="title" as="h2">
        Support & Safety
      </SacredText>
      
      <div className="space-y-breath">
        <SacredCard variant="sacred">
          <div className="space-y-breath">
            <div className="flex items-center gap-gentle">
              <span className="text-2xl">🚨</span>
              <SacredText variant="caption" className="font-medium text-grounding-earth">
                Report a Concern
              </SacredText>
            </div>
            <SacredText variant="body" className="text-sm">
              If you experience inappropriate behavior, cultural insensitivity, or safety concerns, please report immediately.
            </SacredText>
            <SacredButton
              intention="release"
              size="comfortable"
              onClick={() => {/* Handle safety report */}}
            >
              🛡️ Report Safety Concern
            </SacredButton>
          </div>
        </SacredCard>

        <SacredCard variant="gentle">
          <div className="space-y-breath">
            <SacredText variant="caption" className="font-medium">
              Community Guidelines
            </SacredText>
            <ul className="space-y-whisper text-sm">
              <li className="flex items-start gap-whisper">
                <span className="text-grounding-earth">•</span>
                <span>Treat all peers with respect and cultural sensitivity</span>
              </li>
              <li className="flex items-start gap-whisper">
                <span className="text-grounding-earth">•</span>
                <span>Share authentically while maintaining appropriate boundaries</span>
              </li>
              <li className="flex items-start gap-whisper">
                <span className="text-grounding-earth">•</span>
                <span>Honor different perspectives and lived experiences</span>
              </li>
              <li className="flex items-start gap-whisper">
                <span className="text-grounding-earth">•</span>
                <span>Seek support when needed and offer help when appropriate</span>
              </li>
            </ul>
          </div>
        </SacredCard>

        <SacredCard variant="gentle">
          <div className="space-y-breath">
            <SacredText variant="caption" className="font-medium">
              Privacy Controls
            </SacredText>
            <div className="grid grid-cols-2 gap-breath text-sm">
              <div className="space-y-whisper">
                <div className="flex justify-between">
                  <span>Anonymous Mode:</span>
                  <span className="font-medium">
                    {userConfig.privacySettings.anonymousParticipation ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Messages:</span>
                  <span className="font-medium">
                    {userConfig.privacySettings.allowDirectMessages ? 'Allowed' : 'Blocked'}
                  </span>
                </div>
              </div>
              <div className="space-y-whisper">
                <div className="flex justify-between">
                  <span>Parental Controls:</span>
                  <span className="font-medium">
                    {userConfig.privacySettings.parentalControlsActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Safety Filtering:</span>
                  <span className="font-medium">
                    {userConfig.safetyControls.moderationLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SacredCard>
      </div>
    </div>
  );

  if (state.loading && state.activeTab === 'discover') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <SacredCard variant="gentle" className="text-center">
          <div className="space-y-breath">
            <div className="text-4xl animate-pulse">🤝</div>
            <SacredText variant="title">
              Preparing Safe Connections
            </SacredText>
            <SacredText variant="body">
              Finding peers who share your interests and values...
            </SacredText>
          </div>
        </SacredCard>
      </div>
    );
  }

  return (
    <SacredCard variant="gentle" className={`peer-interaction-hub ${className}`}>
      <div className="space-y-ritual">
        {/* Header */}
        <div className="text-center space-y-breath">
          <div className="text-4xl">🤝</div>
          <SacredText variant="title" as="h1">
            Peer Connection Hub
          </SacredText>
          <SacredText variant="body">
            Connect with peers in safe, supportive, and culturally sensitive ways. 
            All interactions are guided by trauma-informed principles.
          </SacredText>
        </div>

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Tab Content */}
        <div className="tab-content">
          {state.activeTab === 'discover' && renderDiscoverTab()}
          {state.activeTab === 'active' && renderActiveTab()}
          {state.activeTab === 'communities' && renderCommunitiesTab()}
          {state.activeTab === 'support' && renderSupportTab()}
        </div>
      </div>
    </SacredCard>
  );
}

// ===== INTERACTION TYPE SELECTOR =====

interface InteractionTypeSelectorProps {
  interactionType: InteractionTypeCard;
  safetyMode: boolean;
  onSelect: () => void;
}

function InteractionTypeSelector({ interactionType, safetyMode, onSelect }: InteractionTypeSelectorProps) {
  const getSafetyColor = () => {
    switch (interactionType.safetyLevel) {
      case 'safe': return 'text-green-600';
      case 'supervised': return 'text-yellow-600';
      case 'restricted': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const isRestricted = safetyMode && interactionType.safetyLevel === 'restricted';

  return (
    <SacredCard 
      variant={isRestricted ? "gentle" : "warm"} 
      className={`cursor-pointer transition-all hover:scale-[1.02] ${isRestricted ? 'opacity-60' : ''}`}
      onClick={isRestricted ? undefined : onSelect}
    >
      <div className="space-y-breath">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-gentle">
            <span className="text-2xl">{interactionType.icon}</span>
            <div>
              <SacredText variant="caption" className="font-medium">
                {interactionType.title}
              </SacredText>
              <div className="flex items-center gap-whisper">
                <span className={`text-xs ${getSafetyColor()}`}>
                  ●
                </span>
                <SacredText variant="caption" className="text-xs">
                  {interactionType.safetyLevel}
                </SacredText>
              </div>
            </div>
          </div>
          {isRestricted && (
            <span className="text-lg">🔒</span>
          )}
        </div>
        
        <SacredText variant="body" className="text-sm">
          {interactionType.description}
        </SacredText>
        
        <div className="border-t border-tender-embrace pt-whisper">
          <SacredText variant="caption" className="text-xs text-subtle">
            Cultural sensitivity: {interactionType.culturalSensitivity}
          </SacredText>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== PEER PREVIEW CARD =====

interface PeerPreviewCardProps {
  peer: PeerMatchResult;
  safetyMode: boolean;
}

function PeerPreviewCard({ peer, safetyMode }: PeerPreviewCardProps) {
  return (
    <SacredCard variant="gentle" className="text-center">
      <div className="space-y-whisper">
        <div className="text-2xl">👤</div>
        <div>
          <SacredText variant="caption" className="font-medium text-xs">
            {safetyMode ? 'Anonymous Peer' : `Peer ${peer.userId.slice(-4)}`}
          </SacredText>
          <div className="flex items-center justify-center gap-whisper">
            <span className="text-xs text-green-600">●</span>
            <SacredText variant="caption" className="text-xs">
              {Math.round(peer.compatibilityScore * 100)}% match
            </SacredText>
          </div>
        </div>
        <SacredText variant="caption" className="text-xs text-subtle">
          {peer.matchingFactors.slice(0, 2).join(', ')}
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== ACTIVE INTERACTION CARD =====

interface ActiveInteractionCardProps {
  interaction: PeerInteraction;
  safetyMode: boolean;
}

function ActiveInteractionCard({ interaction, safetyMode }: ActiveInteractionCardProps) {
  const getInteractionIcon = () => {
    const icons = {
      reflection_sharing: '💭',
      support_offering: '🤝',
      collaborative_journaling: '📝',
      cultural_exchange: '🌍',
      skill_sharing: '🎯',
      celebration: '🎉',
      goal_accountability: '🎯',
      creative_collaboration: '🎨'
    };
    return icons[interaction.type as keyof typeof icons] || '💬';
  };

  return (
    <SacredCard variant="warm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-gentle">
          <span className="text-xl">{getInteractionIcon()}</span>
          <div>
            <SacredText variant="caption" className="font-medium">
              {interaction.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SacredText>
            <SacredText variant="caption" className="text-sm text-subtle">
              {safetyMode ? `${interaction.participants.length} participants` : `With ${interaction.participants.length - 1} peers`}
            </SacredText>
            <SacredText variant="caption" className="text-xs text-subtle">
              Started {new Date(interaction.timestamp).toLocaleDateString()}
            </SacredText>
          </div>
        </div>
        
        <div className="flex gap-whisper">
          <SacredButton
            intention="gentle"
            size="intimate"
            onClick={() => {/* Handle view interaction */}}
          >
            View
          </SacredButton>
          <SacredButton
            intention="primary"
            size="intimate"
            onClick={() => {/* Handle continue interaction */}}
          >
            Continue
          </SacredButton>
        </div>
      </div>
    </SacredCard>
  );
}