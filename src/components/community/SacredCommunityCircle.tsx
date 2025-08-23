'use client';

import React, { useState, useEffect } from 'react';
import { useSacredMicrocopy, useSacredButton, useSacredPrompt } from '@/components/SacredMicrocopyProvider';
import { useSacredTimeAware } from '@/components/SacredMicrocopyProvider';

// ===== COMMUNITY CIRCLE TYPES =====

export interface CommunityMember {
  id: string;
  displayName: string; // Anonymous or chosen sacred name
  avatar?: string; // Sacred symbol or color representation
  culturalContext?: string;
  memberSince: Date;
  lastActive: Date;
  connectionLevel: 'witness' | 'companion' | 'kindred'; // Depth of community engagement
  sacredBoundaries: {
    sharingSafetyLevel: 'gentle' | 'open' | 'deep'; // How much they share
    witnessingCapacity: 'listening' | 'responding' | 'holding'; // How they support others
    culturalSpacePref: 'universal' | 'specific' | 'bridge'; // Cultural connection preference
  };
  healingFocuses: string[]; // Areas of growth/healing they're working on
  supportsOffered: string[]; // Ways they help others in the circle
}

export interface CircleSpace {
  id: string;
  name: string;
  description: string;
  sacredIntention: string; // The emotional/spiritual purpose
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  maxMembers: number;
  currentMembers: CommunityMember[];
  facilitationType: 'peer_guided' | 'wisdom_keeper' | 'rotating_leadership' | 'organic_flow';
  meetingRhythm: 'daily_check' | 'weekly_deep' | 'monthly_ritual' | 'seasonal_ceremony' | 'as_needed';
  createdAt: Date;
  spaceEnergy: 'quiet_reflection' | 'active_sharing' | 'creative_expression' | 'wisdom_seeking' | 'celebration';
  safetyProtections: {
    anonymityLevel: 'full' | 'chosen_names' | 'gradual_reveal';
    moderationStyle: 'community_self' | 'gentle_guidance' | 'wisdom_keeper';
    conflictResolution: 'circle_process' | 'mediated_dialogue' | 'individual_support';
  };
}

export interface CircleGathering {
  id: string;
  spaceId: string;
  title: string;
  sacredPrompt: string; // The question or intention for the gathering
  scheduledTime: Date;
  duration: number; // minutes
  participants: string[]; // member IDs who plan to attend
  gatheringType: 'check_in' | 'deep_share' | 'wisdom_circle' | 'celebration' | 'support_hold';
  culturalRitual?: {
    openingPractice: string;
    closingPractice: string;
    sharedSymbols: string[];
  };
}

// ===== COMMUNITY CIRCLE CONTEXT =====

interface CommunityCircleContextType {
  currentMember: CommunityMember | null;
  joinedCircles: CircleSpace[];
  availableCircles: CircleSpace[];
  upcomingGatherings: CircleGathering[];
  loadingState: 'loading' | 'ready' | 'error';
  joinCircle: (circleId: string, intention: string) => Promise<boolean>;
  leaveCircle: (circleId: string, gratitude: string) => Promise<void>;
  updateBoundaries: (boundaries: Partial<CommunityMember['sacredBoundaries']>) => Promise<void>;
  createGathering: (gathering: Omit<CircleGathering, 'id'>) => Promise<void>;
}

// ===== MAIN COMMUNITY CIRCLE COMPONENT =====

export interface SacredCommunityCircleProps {
  userId: string;
  culturalContext?: string;
  initialView?: 'circles' | 'gatherings' | 'connections' | 'create';
  className?: string;
}

export function SacredCommunityCircle({
  userId,
  culturalContext = 'universal',
  initialView = 'circles',
  className = ''
}: SacredCommunityCircleProps) {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedCircle, setSelectedCircle] = useState<CircleSpace | null>(null);
  const [memberProfile, setMemberProfile] = useState<CommunityMember | null>(null);
  const [joinedCircles, setJoinedCircles] = useState<CircleSpace[]>([]);
  const [availableCircles, setAvailableCircles] = useState<CircleSpace[]>([]);
  
  const { copy, getContextualCopy } = useSacredMicrocopy();
  const { timeOfDay, getContextualPrompt } = useSacredTimeAware();

  // Initialize member profile and circles
  useEffect(() => {
    initializeCommunityData();
  }, [userId]);

  const initializeCommunityData = async () => {
    // Load member profile
    setMemberProfile({
      id: userId,
      displayName: 'Sacred Seeker', // Default, can be customized
      culturalContext: culturalContext,
      memberSince: new Date(),
      lastActive: new Date(),
      connectionLevel: 'witness',
      sacredBoundaries: {
        sharingSafetyLevel: 'gentle',
        witnessingCapacity: 'listening',
        culturalSpacePref: 'universal'
      },
      healingFocuses: [],
      supportsOffered: []
    });

    // Load sample circles for demonstration
    setAvailableCircles([
      {
        id: 'morning-intentions',
        name: 'Dawn Intentions Circle',
        description: 'Begin each day by sharing what wants to emerge and receiving gentle witness from the community.',
        sacredIntention: 'Grounding and intentional day-beginning',
        culturalContext: 'universal',
        maxMembers: 12,
        currentMembers: [],
        facilitationType: 'rotating_leadership',
        meetingRhythm: 'daily_check',
        createdAt: new Date('2024-01-01'),
        spaceEnergy: 'quiet_reflection',
        safetyProtections: {
          anonymityLevel: 'chosen_names',
          moderationStyle: 'community_self',
          conflictResolution: 'circle_process'
        }
      },
      {
        id: 'wisdom-keepers',
        name: 'Ancestral Wisdom Circle',
        description: 'Share stories, traditions, and lessons from your cultural background while learning from others\' heritage.',
        sacredIntention: 'Cultural exchange and ancestral honoring',
        culturalContext: 'bridge',
        maxMembers: 8,
        currentMembers: [],
        facilitationType: 'wisdom_keeper',
        meetingRhythm: 'weekly_deep',
        createdAt: new Date('2024-01-15'),
        spaceEnergy: 'wisdom_seeking',
        safetyProtections: {
          anonymityLevel: 'chosen_names',
          moderationStyle: 'gentle_guidance',
          conflictResolution: 'mediated_dialogue'
        }
      },
      {
        id: 'healing-hearts',
        name: 'Hearts in Healing Circle',
        description: 'For those walking through difficult seasons. Deep witnessing, gentle support, and shared resilience.',
        sacredIntention: 'Mutual support through challenging times',
        culturalContext: 'universal',
        maxMembers: 6,
        currentMembers: [],
        facilitationType: 'peer_guided',
        meetingRhythm: 'weekly_deep',
        createdAt: new Date('2024-02-01'),
        spaceEnergy: 'quiet_reflection',
        safetyProtections: {
          anonymityLevel: 'full',
          moderationStyle: 'gentle_guidance',
          conflictResolution: 'individual_support'
        }
      }
    ]);
  };

  const joinCircleWithIntention = async (circle: CircleSpace, intention: string) => {
    // Sacred joining ceremony
    try {
      // Here would be the actual API call to join the circle
      setJoinedCircles(prev => [...prev, circle]);
      setCurrentView('gatherings');
      
      // Show confirmation
      return true;
    } catch (error) {
      console.error('Error joining circle:', error);
      return false;
    }
  };

  return (
    <div className={`sacred-community-circle ${className}`}>
      {/* Sacred Navigation */}
      <nav className="sacred-navigation surface-elevated-gentle p-gentle mb-ritual rounded-gentle">
        <div className="flex space-x-breath">
          <button
            onClick={() => setCurrentView('circles')}
            className={`sacred-nav-button ${currentView === 'circles' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🔮</span>
            Sacred Circles
          </button>
          <button
            onClick={() => setCurrentView('gatherings')}
            className={`sacred-nav-button ${currentView === 'gatherings' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🌅</span>
            Gatherings
          </button>
          <button
            onClick={() => setCurrentView('connections')}
            className={`sacred-nav-button ${currentView === 'connections' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🤝</span>
            Kindred Connections
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="sacred-content-area">
        {currentView === 'circles' && (
          <CirclesView
            availableCircles={availableCircles}
            joinedCircles={joinedCircles}
            onJoinCircle={joinCircleWithIntention}
            culturalContext={culturalContext}
          />
        )}
        
        {currentView === 'gatherings' && (
          <GatheringsView
            joinedCircles={joinedCircles}
            memberProfile={memberProfile}
          />
        )}
        
        {currentView === 'connections' && (
          <ConnectionsView
            memberProfile={memberProfile}
            joinedCircles={joinedCircles}
          />
        )}
      </div>
    </div>
  );
}

// ===== CIRCLES VIEW COMPONENT =====

interface CirclesViewProps {
  availableCircles: CircleSpace[];
  joinedCircles: CircleSpace[];
  onJoinCircle: (circle: CircleSpace, intention: string) => Promise<boolean>;
  culturalContext: string;
}

function CirclesView({ availableCircles, joinedCircles, onJoinCircle, culturalContext }: CirclesViewProps) {
  const [selectedCircle, setSelectedCircle] = useState<CircleSpace | null>(null);
  const [joinIntention, setJoinIntention] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const { getContextualCopy } = useSacredMicrocopy();

  const handleJoinRequest = (circle: CircleSpace) => {
    setSelectedCircle(circle);
    setShowJoinModal(true);
  };

  const confirmJoin = async () => {
    if (selectedCircle && joinIntention.trim()) {
      const success = await onJoinCircle(selectedCircle, joinIntention);
      if (success) {
        setShowJoinModal(false);
        setJoinIntention('');
        setSelectedCircle(null);
      }
    }
  };

  return (
    <div className="circles-view">
      {/* Your Sacred Circles */}
      {joinedCircles.length > 0 && (
        <section className="mb-sacred">
          <h2 className="text-ceremonial font-grounding text-primary mb-gentle">
            Your Sacred Circles
          </h2>
          <div className="grid gap-gentle md:grid-cols-2 lg:grid-cols-3">
            {joinedCircles.map(circle => (
              <CircleCard key={circle.id} circle={circle} isJoined={true} />
            ))}
          </div>
        </section>
      )}

      {/* Available Circles */}
      <section>
        <h2 className="text-ceremonial font-grounding text-primary mb-gentle">
          Discover Sacred Circles
        </h2>
        <div className="grid gap-gentle md:grid-cols-2 lg:grid-cols-3">
          {availableCircles
            .filter(circle => !joinedCircles.some(joined => joined.id === circle.id))
            .map(circle => (
              <CircleCard
                key={circle.id}
                circle={circle}
                isJoined={false}
                onJoinRequest={() => handleJoinRequest(circle)}
              />
            ))}
        </div>
      </section>

      {/* Join Circle Modal */}
      {showJoinModal && selectedCircle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-gentle z-50">
          <div className="sacred-modal surface-sanctuary p-ritual rounded-gentle max-w-lg w-full">
            <h3 className="text-sacred font-grounding text-primary mb-gentle">
              Join {selectedCircle.name}
            </h3>
            <p className="text-breath text-secondary mb-ritual leading-spacious">
              {selectedCircle.description}
            </p>
            
            <div className="mb-ritual">
              <label className="block text-presence font-presence text-primary mb-breath">
                What draws you to this circle? Share your intention:
              </label>
              <textarea
                value={joinIntention}
                onChange={(e) => setJoinIntention(e.target.value)}
                placeholder="What healing, connection, or growth are you seeking in this sacred space?"
                className="w-full p-gentle border border-healing-mist rounded-breath resize-none h-24 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-gentle justify-end">
              <button
                onClick={() => setShowJoinModal(false)}
                className="sacred-button intention-gentle"
              >
                Close the space
              </button>
              <button
                onClick={confirmJoin}
                disabled={!joinIntention.trim()}
                className="sacred-button intention-sacred disabled:opacity-50"
              >
                Join with intention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CIRCLE CARD COMPONENT =====

interface CircleCardProps {
  circle: CircleSpace;
  isJoined: boolean;
  onJoinRequest?: () => void;
}

function CircleCard({ circle, isJoined, onJoinRequest }: CircleCardProps) {
  const getEnergyIcon = (energy: CircleSpace['spaceEnergy']) => {
    const iconMap = {
      'quiet_reflection': '🕯️',
      'active_sharing': '💬',
      'creative_expression': '🎨',
      'wisdom_seeking': '🔍',
      'celebration': '✨'
    };
    return iconMap[energy];
  };

  const getRhythmText = (rhythm: CircleSpace['meetingRhythm']) => {
    const rhythmMap = {
      'daily_check': 'Daily morning intentions',
      'weekly_deep': 'Weekly deep sharing',
      'monthly_ritual': 'Monthly ceremonial gathering',
      'seasonal_ceremony': 'Seasonal celebration',
      'as_needed': 'Organic timing'
    };
    return rhythmMap[rhythm];
  };

  return (
    <div className="sacred-circle-card surface-card-gentle p-gentle rounded-gentle border border-healing-mist hover:shadow-breath transition-all timing-breath">
      {/* Circle Header */}
      <div className="flex items-start justify-between mb-breath">
        <div className="flex items-center gap-whisper">
          <span className="text-xl">{getEnergyIcon(circle.spaceEnergy)}</span>
          <div>
            <h3 className="text-grounding font-presence text-primary">{circle.name}</h3>
            <p className="text-whisper text-tertiary">{circle.currentMembers.length}/{circle.maxMembers} members</p>
          </div>
        </div>
        <div className="text-xs bg-healing-mist px-whisper py-whisper rounded-breath">
          {circle.culturalContext}
        </div>
      </div>

      {/* Sacred Intention */}
      <div className="mb-breath">
        <p className="text-breath text-secondary italic leading-spacious">
          "{circle.sacredIntention}"
        </p>
      </div>

      {/* Description */}
      <p className="text-breath text-secondary leading-spacious mb-gentle">
        {circle.description}
      </p>

      {/* Circle Details */}
      <div className="space-y-whisper mb-gentle text-whisper text-tertiary">
        <div className="flex items-center gap-whisper">
          <span>⏰</span>
          <span>{getRhythmText(circle.meetingRhythm)}</span>
        </div>
        <div className="flex items-center gap-whisper">
          <span>🛡️</span>
          <span>{circle.safetyProtections.anonymityLevel.replace('_', ' ')} anonymity</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-breath border-t border-healing-mist">
        {isJoined ? (
          <button className="sacred-button intention-grounding w-full" disabled>
            <span className="mr-whisper">💚</span>
            Circle member
          </button>
        ) : (
          <button 
            onClick={onJoinRequest}
            className="sacred-button intention-sacred w-full hover:transform hover:translateY(-1px)"
            disabled={circle.currentMembers.length >= circle.maxMembers}
          >
            {circle.currentMembers.length >= circle.maxMembers ? (
              <>
                <span className="mr-whisper">🚪</span>
                Circle is full
              </>
            ) : (
              <>
                <span className="mr-whisper">🤝</span>
                Join this circle
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== GATHERINGS VIEW COMPONENT =====

interface GatheringsViewProps {
  joinedCircles: CircleSpace[];
  memberProfile: CommunityMember | null;
}

function GatheringsView({ joinedCircles, memberProfile }: GatheringsViewProps) {
  const [upcomingGatherings, setUpcomingGatherings] = useState<CircleGathering[]>([]);
  const { timeOfDay, getContextualPrompt } = useSacredTimeAware();

  useEffect(() => {
    // Generate sample gatherings
    if (joinedCircles.length > 0) {
      const sampleGatherings: CircleGathering[] = [
        {
          id: 'gathering-1',
          spaceId: joinedCircles[0]?.id || 'morning-intentions',
          title: 'Morning Intentions Sharing',
          sacredPrompt: getContextualPrompt('daily_invitations') || 'What wisdom is stirring as this day begins?',
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 30,
          participants: [],
          gatheringType: 'check_in',
          culturalRitual: {
            openingPractice: 'Three mindful breaths together',
            closingPractice: 'Gratitude circle',
            sharedSymbols: ['🌅', '🙏', '💙']
          }
        }
      ];
      setUpcomingGatherings(sampleGatherings);
    }
  }, [joinedCircles]);

  if (joinedCircles.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🔮</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          No circles joined yet
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          Join a sacred circle to participate in community gatherings and shared reflection.
        </p>
        <button
          onClick={() => {/* Switch to circles view */}}
          className="sacred-button intention-sacred"
        >
          Discover circles
        </button>
      </div>
    );
  }

  return (
    <div className="gatherings-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Upcoming Gatherings
        </h2>
        <p className="text-presence text-secondary">
          Sacred times to come together in community and shared reflection.
        </p>
      </div>

      {upcomingGatherings.length > 0 ? (
        <div className="space-y-gentle">
          {upcomingGatherings.map(gathering => (
            <GatheringCard key={gathering.id} gathering={gathering} />
          ))}
        </div>
      ) : (
        <div className="text-center py-ritual">
          <div className="text-2xl mb-gentle">🌅</div>
          <p className="text-presence text-secondary">
            No upcoming gatherings scheduled yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

// ===== GATHERING CARD COMPONENT =====

interface GatheringCardProps {
  gathering: CircleGathering;
}

function GatheringCard({ gathering }: GatheringCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGatheringIcon = (type: CircleGathering['gatheringType']) => {
    const iconMap = {
      'check_in': '☀️',
      'deep_share': '💫',
      'wisdom_circle': '🌙',
      'celebration': '✨',
      'support_hold': '🤝'
    };
    return iconMap[type];
  };

  return (
    <div className="gathering-card surface-elevated-warm p-gentle rounded-gentle border border-tender-embrace">
      {/* Gathering Header */}
      <div className="flex items-start justify-between mb-gentle">
        <div className="flex items-start gap-breath">
          <span className="text-xl">{getGatheringIcon(gathering.gatheringType)}</span>
          <div>
            <h4 className="text-grounding font-presence text-primary">{gathering.title}</h4>
            <p className="text-breath text-secondary">
              {formatDate(gathering.scheduledTime)} at {formatTime(gathering.scheduledTime)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-whisper text-tertiary">{gathering.duration} minutes</p>
          <p className="text-whisper text-tertiary">{gathering.participants.length} attending</p>
        </div>
      </div>

      {/* Sacred Prompt */}
      <div className="sacred-prompt bg-healing-mist p-breath rounded-breath mb-gentle">
        <p className="text-presence text-primary font-presence leading-spacious italic">
          "{gathering.sacredPrompt}"
        </p>
      </div>

      {/* Cultural Ritual */}
      {gathering.culturalRitual && (
        <div className="cultural-ritual mb-gentle">
          <h5 className="text-breath font-presence text-secondary mb-whisper">Sacred Container:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-breath text-whisper text-tertiary">
            <div>
              <span className="font-presence">Opening:</span> {gathering.culturalRitual.openingPractice}
            </div>
            <div>
              <span className="font-presence">Closing:</span> {gathering.culturalRitual.closingPractice}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-breath justify-end pt-breath border-t border-healing-mist">
        <button className="sacred-button intention-gentle">
          Maybe
        </button>
        <button className="sacred-button intention-sacred">
          <span className="mr-whisper">🙏</span>
          I'll be there
        </button>
      </div>
    </div>
  );
}

// ===== CONNECTIONS VIEW COMPONENT =====

interface ConnectionsViewProps {
  memberProfile: CommunityMember | null;
  joinedCircles: CircleSpace[];
}

function ConnectionsView({ memberProfile, joinedCircles }: ConnectionsViewProps) {
  return (
    <div className="connections-view">
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🤝</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Kindred Connections
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          Discover and nurture meaningful connections with fellow travelers on the healing path.
        </p>
        <div className="bg-healing-mist p-ritual rounded-gentle max-w-lg mx-auto">
          <p className="text-breath text-secondary italic">
            This sacred space for deeper connections will be available soon. 
            For now, practice connecting through circle gatherings and shared reflections.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SacredCommunityCircle;