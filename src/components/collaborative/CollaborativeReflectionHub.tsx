// ALCHM Collaborative Reflection Hub
// Sacred peer learning spaces with trauma-informed safety and cultural responsiveness
// Designed for collective healing and community building

import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  HeartIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import { 
  CollaborativeSpace,
  SharedReflection,
  ParticipationMode,
  CollaborativeSpaceManager,
  COLLABORATIVE_SPACES,
  PARTICIPATION_MODES,
  PeerSupportSystem
} from '@/lib/collaborative-reflection-system';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';
import KheperaScarabIcon from '@/components/khepera/KheperaScarabIcons';

// ===== INTERFACE TYPES =====

interface CollaborativeReflectionHubProps {
  userId: string;
  userProfile: {
    name: string;
    culturalContext?: string;
    accessRequirements: string[];
    preferredParticipation: string[];
  };
  onSpaceJoin?: (spaceId: string) => void;
  onReflectionShare?: (reflection: any) => void;
  className?: string;
}

interface ActiveSpace {
  space: CollaborativeSpace;
  participants: any[];
  currentReflections: SharedReflection[];
  myParticipationMode?: string;
}

// ===== MAIN COMPONENT =====

export default function CollaborativeReflectionHub({
  userId,
  userProfile,
  onSpaceJoin,
  onReflectionShare,
  className = ''
}: CollaborativeReflectionHubProps) {
  
  const { getSacredPrompt, getSacredButton } = useSacredMicrocopy();
  
  // ===== STATE MANAGEMENT =====
  const [activeSpace, setActiveSpace] = useState<ActiveSpace | null>(null);
  const [availableSpaces, setAvailableSpaces] = useState<CollaborativeSpace[]>([]);
  const [selectedParticipationMode, setSelectedParticipationMode] = useState<string>('');
  const [showSpaceGuidelines, setShowSpaceGuidelines] = useState<string | null>(null);
  const [reflectionContent, setReflectionContent] = useState<string>('');
  const [supportOfferings, setSupportOfferings] = useState<any[]>([]);
  const [privacyLevel, setPrivacyLevel] = useState<string>('chosen_identity');

  // ===== SPACE LOADING =====
  useEffect(() => {
    const spaces = CollaborativeSpaceManager.getAvailableSpaces(
      18, // Default age, would come from user profile
      userProfile.culturalContext || 'universal',
      userProfile.accessRequirements
    );
    setAvailableSpaces(spaces);
  }, [userProfile]);

  // ===== SPACE JOINING =====
  const joinSpace = async (space: CollaborativeSpace, participationMode: string) => {
    if (!CollaborativeSpaceManager.validateParticipation(
      space.id, 
      participationMode, 
      userProfile.preferredParticipation
    )) {
      console.warn('Participation validation failed');
      return;
    }

    // Apply cultural adaptation if needed
    const adaptedSpace = userProfile.culturalContext !== 'universal' 
      ? CollaborativeSpaceManager.generateCulturalAdaptation(space, userProfile.culturalContext!)
      : space;

    setActiveSpace({
      space: adaptedSpace,
      participants: [], // Would be loaded from backend
      currentReflections: [], // Would be loaded from backend
      myParticipationMode: participationMode
    });

    if (onSpaceJoin) {
      onSpaceJoin(space.id);
    }
  };

  const leaveSpace = () => {
    setActiveSpace(null);
    setReflectionContent('');
    setSelectedParticipationMode('');
  };

  // ===== REFLECTION SHARING =====
  const shareReflection = async () => {
    if (!activeSpace || !reflectionContent.trim()) return;

    const moderation = CollaborativeSpaceManager.moderateContent(
      reflectionContent,
      activeSpace.space.id
    );

    const reflection: Partial<SharedReflection> = {
      authorId: userId,
      authorIdentity: userProfile.name, // Would be based on privacy level
      spaceId: activeSpace.space.id,
      content: reflectionContent,
      reflectionType: 'story', // Would be determined by content analysis
      timestamp: new Date(),
      reactions: [],
      responses: [],
      visibility: 'circle_only',
      moderation: {
        flagged: moderation.needsReview,
        reviewStatus: moderation.needsReview ? 'pending' : 'approved',
        supportProvided: moderation.supportNeeded ? moderation.recommendations : undefined
      }
    };

    if (onReflectionShare) {
      await onReflectionShare(reflection);
    }

    setReflectionContent('');
  };

  // ===== SPACE SELECTION VIEW =====
  if (!activeSpace) {
    return (
      <div className={`collaborative-reflection-hub ${className}`}>
        <div className="max-w-6xl mx-auto space-y-space-ritual">
          
          {/* Header */}
          <div className="text-center space-y-space-gentle">
            <div className="flex justify-center mb-space-breath">
              <KheperaScarabIcon size={64} mode="present" showAura={true} />
            </div>
            <h1 className="text-text-vibrant font-weight-ceremony text-text-ceremony">
              Sacred Learning Circles
            </h1>
            <p className="text-text-secondary text-text-presence max-w-3xl mx-auto">
              Join peer learning spaces where stories become medicine, wisdom flows freely, and collective healing flourishes through trauma-informed community connection.
            </p>
          </div>

          {/* Community Agreements */}
          <div className="bg-soft-blush-whisper border border-soft-blush-mist rounded-lg p-space-gentle">
            <div className="flex items-start gap-space-breath">
              <ShieldCheckIcon className="w-6 h-6 text-warm-terra mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-text-primary font-weight-presence mb-space-breath">
                  Sacred Community Agreements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-breath text-text-breath">
                  <div className="space-y-space-whisper">
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Honor all sharing as sacred and confidential</span>
                    </div>
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Speak from personal experience, not universal truths</span>
                    </div>
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Listen with sacred attention and presence</span>
                    </div>
                  </div>
                  <div className="space-y-space-whisper">
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Respect cultural protocols and wisdom</span>
                    </div>
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Practice consent in all interactions</span>
                    </div>
                    <div className="flex items-start gap-space-whisper">
                      <div className="w-2 h-2 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>Support community healing and liberation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Spaces */}
          <div className="space-y-space-gentle">
            <h2 className="text-text-primary font-weight-presence text-text-vibrant">
              Sacred Circles Available Now
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-gentle">
              {availableSpaces.map((space) => (
                <SpaceCard 
                  key={space.id}
                  space={space}
                  onJoin={(participationMode) => joinSpace(space, participationMode)}
                  onShowGuidelines={() => setShowSpaceGuidelines(space.id)}
                  userCapabilities={userProfile.preferredParticipation}
                />
              ))}
            </div>
          </div>

          {/* Space Guidelines Modal */}
          {showSpaceGuidelines && (
            <SpaceGuidelinesModal
              space={availableSpaces.find(s => s.id === showSpaceGuidelines)!}
              onClose={() => setShowSpaceGuidelines(null)}
            />
          )}
        </div>
      </div>
    );
  }

  // ===== ACTIVE SPACE VIEW =====
  return (
    <div className={`collaborative-reflection-hub active-space ${className}`}>
      <div className="max-w-6xl mx-auto space-y-space-ritual">
        
        {/* Space Header */}
        <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
          <div className="flex items-center justify-between mb-space-gentle">
            <div className="flex items-center gap-space-breath">
              <div className="space-type-icon">
                {getSpaceTypeIcon(activeSpace.space.type)}
              </div>
              <div>
                <h1 className="text-text-primary font-weight-presence text-text-vibrant">
                  {activeSpace.space.name}
                </h1>
                <p className="text-text-secondary text-text-breath">
                  {activeSpace.space.description}
                </p>
              </div>
            </div>
            <button
              onClick={leaveSpace}
              className="sacred-button sacred-button-secondary"
            >
              {getSacredButton('close', 'Leave Circle')}
            </button>
          </div>

          {/* Cultural Protocols */}
          {activeSpace.space.culturalProtocols && (
            <div className="bg-primary-whisper border border-primary-mist rounded-lg p-space-breath">
              <h4 className="font-weight-presence text-text-primary mb-space-breath">
                Cultural Protocols for this Circle
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-breath text-text-breath">
                <div>
                  <strong>Opening:</strong> {activeSpace.space.culturalProtocols.ceremonyOpening}
                </div>
                <div>
                  <strong>Sharing:</strong> {activeSpace.space.culturalProtocols.sharingProtocol}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Participation Mode Selection */}
        {!activeSpace.myParticipationMode && (
          <div className="bg-healing-whisper border border-healing-mist rounded-lg p-space-gentle">
            <h3 className="text-text-primary font-weight-presence mb-space-gentle">
              How would you like to participate today?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-breath">
              {activeSpace.space.participationModes.map((mode) => (
                <ParticipationModeCard
                  key={mode.id}
                  mode={mode}
                  onSelect={() => setSelectedParticipationMode(mode.id)}
                  isSelected={selectedParticipationMode === mode.id}
                />
              ))}
            </div>
            {selectedParticipationMode && (
              <div className="mt-space-gentle text-center">
                <button
                  onClick={() => setActiveSpace(prev => prev ? {...prev, myParticipationMode: selectedParticipationMode} : null)}
                  className="sacred-button sacred-button-primary"
                >
                  {getSacredButton('begin', 'Join Circle')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Active Participation Interface */}
        {activeSpace.myParticipationMode && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-gentle">
            
            {/* Sharing Interface */}
            <div className="lg:col-span-2 space-y-space-gentle">
              <ReflectionSharingInterface
                participationMode={activeSpace.myParticipationMode}
                content={reflectionContent}
                onChange={setReflectionContent}
                onShare={shareReflection}
                privacyLevel={privacyLevel}
                onPrivacyChange={setPrivacyLevel}
              />
              
              {/* Current Reflections */}
              <div className="space-y-space-breath">
                <h3 className="text-text-primary font-weight-presence">Circle Sharing</h3>
                {activeSpace.currentReflections.map((reflection) => (
                  <ReflectionCard
                    key={reflection.id}
                    reflection={reflection}
                    onReact={(type) => handleReaction(reflection.id, type)}
                    onSupport={(support) => handleSupport(reflection.id, support)}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-space-gentle">
              
              {/* Circle Participants */}
              <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
                <h4 className="font-weight-presence text-text-primary mb-space-breath">
                  Circle Keepers
                </h4>
                <div className="space-y-space-whisper">
                  {activeSpace.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-space-breath">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-text-breath">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Resources */}
              <div className="bg-healing-whisper border border-healing-mist rounded-lg p-space-gentle">
                <h4 className="font-weight-presence text-text-primary mb-space-breath">
                  Sacred Support
                </h4>
                <div className="space-y-space-whisper text-text-breath">
                  <button className="text-left hover:text-warm-terra transition-colors">
                    🌿 Grounding techniques
                  </button>
                  <button className="text-left hover:text-warm-terra transition-colors">
                    💙 Crisis support resources
                  </button>
                  <button className="text-left hover:text-warm-terra transition-colors">
                    🤝 Request peer support
                  </button>
                  <button className="text-left hover:text-warm-terra transition-colors">
                    🔒 Privacy and safety
                  </button>
                </div>
              </div>

              {/* Circle Guidelines */}
              <div className="bg-soft-blush-whisper border border-soft-blush-mist rounded-lg p-space-gentle">
                <h4 className="font-weight-presence text-text-primary mb-space-breath">
                  Circle Guidelines
                </h4>
                <ul className="space-y-space-whisper text-text-breath">
                  {activeSpace.space.safetyProtocols.map((protocol, index) => (
                    <li key={index} className="flex items-start gap-space-whisper">
                      <div className="w-1.5 h-1.5 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                      <span>{protocol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ===== HELPER FUNCTIONS =====
  function handleReaction(reflectionId: string, type: string) {
    // Implementation for reaction handling
    console.log('Reaction:', reflectionId, type);
  }

  function handleSupport(reflectionId: string, support: any) {
    // Implementation for support offering
    console.log('Support:', reflectionId, support);
  }
}

// ===== SPACE CARD COMPONENT =====
function SpaceCard({ 
  space, 
  onJoin, 
  onShowGuidelines, 
  userCapabilities 
}: { 
  space: CollaborativeSpace;
  onJoin: (mode: string) => void;
  onShowGuidelines: () => void;
  userCapabilities: string[];
}) {
  
  const [selectedMode, setSelectedMode] = useState<string>('');
  
  return (
    <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle space-y-space-breath">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-space-breath mb-space-breath">
            {getSpaceTypeIcon(space.type)}
            <h3 className="text-text-primary font-weight-presence">{space.name}</h3>
          </div>
          <p className="text-text-secondary text-text-breath mb-space-breath">
            {space.description}
          </p>
          <div className="flex items-center gap-space-breath text-text-whisper">
            <span className="bg-warm-terra-whisper text-warm-terra px-space-breath py-space-whisper rounded-full">
              {space.duration.replace('_', ' ')}
            </span>
            <span className="bg-primary-whisper text-primary px-space-breath py-space-whisper rounded-full">
              {space.maxParticipants ? `Max ${space.maxParticipants}` : 'Open'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-space-breath">
        <select 
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="w-full p-space-breath border border-healing-mist rounded-lg bg-surface-elevated"
        >
          <option value="">Choose participation style...</option>
          {space.participationModes.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.name}
            </option>
          ))}
        </select>

        <div className="flex gap-space-breath">
          <button
            onClick={() => selectedMode && onJoin(selectedMode)}
            disabled={!selectedMode}
            className="sacred-button sacred-button-primary flex-1 disabled:opacity-50"
          >
            Join Circle
          </button>
          <button
            onClick={onShowGuidelines}
            className="sacred-button sacred-button-secondary"
          >
            Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== PARTICIPATION MODE CARD =====
function ParticipationModeCard({ 
  mode, 
  onSelect, 
  isSelected 
}: { 
  mode: ParticipationMode;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`p-space-gentle rounded-lg border text-left transition-all timing-breath ${
        isSelected
          ? 'border-primary bg-primary-whisper text-primary'
          : 'border-healing-mist bg-surface-elevated hover:border-warm-terra'
      }`}
    >
      <div className="flex items-start gap-space-breath">
        {getParticipationIcon(mode.id)}
        <div className="flex-1">
          <h4 className="font-weight-presence text-text-breath mb-space-whisper">{mode.name}</h4>
          <p className="text-text-whisper">{mode.description}</p>
        </div>
      </div>
    </button>
  );
}

// ===== REFLECTION SHARING INTERFACE =====
function ReflectionSharingInterface({
  participationMode,
  content,
  onChange,
  onShare,
  privacyLevel,
  onPrivacyChange
}: {
  participationMode: string;
  content: string;
  onChange: (content: string) => void;
  onShare: () => void;
  privacyLevel: string;
  onPrivacyChange: (level: string) => void;
}) {
  return (
    <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle">
      <h3 className="text-text-primary font-weight-presence mb-space-gentle">Share Your Reflection</h3>
      
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What wants to be shared and witnessed in this sacred space?"
        className="w-full min-h-[120px] p-space-gentle border border-healing-mist rounded-lg bg-surface-elevated resize-none focus:border-primary focus:outline-none transition-colors timing-breath text-text-breath"
      />
      
      <div className="flex items-center justify-between mt-space-gentle">
        <select 
          value={privacyLevel}
          onChange={(e) => onPrivacyChange(e.target.value)}
          className="p-space-breath border border-healing-mist rounded-lg bg-surface-elevated text-text-breath"
        >
          <option value="chosen_identity">Share with chosen name</option>
          <option value="first_name">Share with first name</option>
          <option value="anonymous">Share anonymously</option>
        </select>
        
        <button
          onClick={onShare}
          disabled={!content.trim()}
          className="sacred-button sacred-button-primary disabled:opacity-50"
        >
          Share with Circle
        </button>
      </div>
    </div>
  );
}

// ===== REFLECTION CARD =====
function ReflectionCard({ 
  reflection, 
  onReact, 
  onSupport 
}: { 
  reflection: SharedReflection;
  onReact: (type: string) => void;
  onSupport: (support: any) => void;
}) {
  return (
    <div className="bg-soft-blush-whisper border border-soft-blush-mist rounded-lg p-space-gentle">
      <div className="flex items-start justify-between mb-space-breath">
        <div className="flex items-center gap-space-breath">
          <div className="w-8 h-8 bg-warm-terra rounded-full flex items-center justify-center">
            <span className="text-white text-text-whisper font-weight-presence">
              {reflection.authorIdentity.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-weight-presence text-text-breath">{reflection.authorIdentity}</div>
            <div className="text-text-whisper">{reflection.timestamp.toLocaleDateString()}</div>
          </div>
        </div>
        {reflection.triggerWarnings && reflection.triggerWarnings.length > 0 && (
          <div className="text-text-whisper bg-healing-whisper px-space-breath py-space-whisper rounded-full">
            Content guidance
          </div>
        )}
      </div>
      
      <p className="text-text-breath mb-space-gentle leading-spacious">
        {reflection.content}
      </p>
      
      <div className="flex items-center gap-space-breath">
        <button 
          onClick={() => onReact('witness')}
          className="flex items-center gap-space-whisper text-text-secondary hover:text-warm-terra transition-colors"
        >
          <HeartIcon className="w-4 h-4" />
          <span className="text-text-whisper">Witness</span>
        </button>
        <button 
          onClick={() => onReact('solidarity')}
          className="flex items-center gap-space-whisper text-text-secondary hover:text-warm-terra transition-colors"
        >
          <HandRaisedIcon className="w-4 h-4" />
          <span className="text-text-whisper">Solidarity</span>
        </button>
        <button 
          onClick={() => onSupport({ type: 'encouragement' })}
          className="flex items-center gap-space-whisper text-text-secondary hover:text-warm-terra transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          <span className="text-text-whisper">Support</span>
        </button>
      </div>
    </div>
  );
}

// ===== SPACE GUIDELINES MODAL =====
function SpaceGuidelinesModal({ 
  space, 
  onClose 
}: { 
  space: CollaborativeSpace;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-space-gentle">
      <div className="bg-surface-elevated border border-healing-mist rounded-lg p-space-ritual max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-space-gentle">
          <h2 className="text-text-primary font-weight-presence text-text-vibrant">
            {space.name} Guidelines
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-space-gentle">
          <div>
            <h3 className="font-weight-presence text-text-primary mb-space-breath">Safety Protocols</h3>
            <ul className="space-y-space-whisper">
              {space.safetyProtocols.map((protocol, index) => (
                <li key={index} className="flex items-start gap-space-whisper">
                  <div className="w-1.5 h-1.5 bg-warm-terra rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-text-breath">{protocol}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-weight-presence text-text-primary mb-space-breath">Participation Modes</h3>
            <div className="space-y-space-breath">
              {space.participationModes.map((mode) => (
                <div key={mode.id} className="border border-healing-mist rounded-lg p-space-breath">
                  <h4 className="font-weight-presence text-text-breath">{mode.name}</h4>
                  <p className="text-text-whisper">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-space-ritual pt-space-gentle border-t border-healing-mist">
          <button
            onClick={onClose}
            className="sacred-button sacred-button-primary w-full"
          >
            Return to Circles
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
function getSpaceTypeIcon(type: string) {
  const icons = {
    circle: <UsersIcon className="w-6 h-6 text-primary" />,
    gallery: <PhotoIcon className="w-6 h-6 text-warm-terra" />,
    story_exchange: <ChatBubbleLeftRightIcon className="w-6 h-6 text-soft-blush" />,
    wisdom_pool: <SparklesIcon className="w-6 h-6 text-primary" />,
    action_planning: <HandRaisedIcon className="w-6 h-6 text-warm-terra" />
  };
  return icons[type as keyof typeof icons] || <UsersIcon className="w-6 h-6 text-primary" />;
}

function getParticipationIcon(mode: string) {
  const icons = {
    verbal_sharing: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    text_sharing: <span className="text-lg">✍️</span>,
    visual_sharing: <PhotoIcon className="w-5 h-5" />,
    silent_witness: <HeartIcon className="w-5 h-5" />,
    movement_expression: <span className="text-lg">💃</span>,
    question_offering: <QuestionMarkCircleIcon className="w-5 h-5" />
  };
  return icons[mode as keyof typeof icons] || <UsersIcon className="w-5 h-5" />;
}