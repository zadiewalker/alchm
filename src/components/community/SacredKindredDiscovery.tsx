'use client';

import React, { useState, useEffect } from 'react';
import { useSacredMicrocopy, useSacredButton, useSacredPrompt } from '@/components/SacredMicrocopyProvider';

// ===== KINDRED DISCOVERY TYPES =====

export interface KindredProfile {
  id: string;
  sacredName: string; // Chosen display name for community
  avatar?: {
    type: 'symbol' | 'color' | 'nature' | 'custom';
    value: string; // Emoji, hex color, nature element, or image URL
  };
  culturalRoots: string[]; // Cultural backgrounds/contexts
  healingJourney: {
    currentFocuses: string[]; // Areas of active growth/healing
    strengthsOffered: string[]; // Ways they support others
    seasonOfLife: 'beginning' | 'deep_work' | 'integration' | 'offering_back' | 'rest_renewal';
    yearsSeeking: number; // Time on healing path
  };
  sacredValues: string[]; // Core values/principles
  communicationStyle: {
    preference: 'deep_listener' | 'gentle_sharer' | 'wisdom_keeper' | 'creative_expresser' | 'bridge_builder';
    responseTime: 'immediate' | 'contemplative' | 'seasonal'; // How they prefer to connect
    energyLevel: 'quiet_presence' | 'gentle_energy' | 'vibrant_engagement';
  };
  connectionBoundaries: {
    availabilityLevel: 'witness_only' | 'gentle_exchange' | 'deep_friendship' | 'mentorship_offering';
    sharedTopics: string[]; // Comfortable discussion areas
    offLimitTopics: string[]; // Topics they prefer to avoid
    meetingPreference: 'text_only' | 'voice_calls' | 'video_circles' | 'in_person_local';
  };
  resonanceIndicators: {
    // Non-invasive ways to understand compatibility
    favoriteQuietMoments: string[]; // What brings them peace
    creativePractices: string[]; // How they express themselves
    wisdomSources: string[]; // Books, teachers, traditions that guide them
    natureConnections: string[]; // How they connect with nature
  };
  lastActive: Date;
  memberSince: Date;
  connectionHistory: {
    currentConnections: string[]; // Active kindred spirit connections
    pastConnections: number; // Number of previous meaningful connections
    witnessedReflections: number; // Community participation level
  };
}

export interface KindredMatch {
  profile: KindredProfile;
  resonanceScore: number; // 0-1, based on values/journey alignment
  sharedElements: {
    culturalBridge: string[];
    healingOverlap: string[];
    valueAlignment: string[];
    communicationFit: boolean;
    boundaryCompatibility: boolean;
  };
  connectionSuggestion: {
    type: 'gentle_witness' | 'shared_exploration' | 'mutual_support' | 'wisdom_exchange';
    initialActivity: string; // Suggested first interaction
    connectionReason: string; // Why they might resonate
  };
}

export interface ConnectionInvitation {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  invitationType: 'gentle_witness' | 'shared_exploration' | 'mutual_support' | 'wisdom_exchange';
  personalMessage: string;
  suggestedActivity: string;
  sentAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date;
}

export interface KindredConnection {
  id: string;
  profiles: [string, string]; // Two profile IDs
  connectionType: 'witness_companion' | 'healing_buddy' | 'wisdom_circle' | 'cultural_bridge' | 'creative_collaboration';
  establishedAt: Date;
  lastInteraction: Date;
  sharedActivities: string[];
  connectionStrength: 'new_connection' | 'growing_trust' | 'deep_kinship' | 'sacred_friendship';
  mutualBoundaries: {
    communicationFrequency: 'as_needed' | 'weekly_check' | 'daily_support';
    topicAgreements: string[];
    supportStyles: string[];
  };
}

// ===== SACRED KINDRED DISCOVERY COMPONENT =====

export interface SacredKindredDiscoveryProps {
  userId: string;
  userProfile?: Partial<KindredProfile>;
  initialView?: 'discover' | 'profile' | 'connections' | 'invitations';
  className?: string;
}

export function SacredKindredDiscovery({
  userId,
  userProfile = {},
  initialView = 'discover',
  className = ''
}: SacredKindredDiscoveryProps) {
  const [currentView, setCurrentView] = useState(initialView);
  const [myProfile, setMyProfile] = useState<KindredProfile | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<KindredMatch[]>([]);
  const [activeConnections, setActiveConnections] = useState<KindredConnection[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<ConnectionInvitation[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const { copy } = useSacredMicrocopy();

  // Initialize kindred discovery system
  useEffect(() => {
    initializeKindredData();
  }, [userId]);

  const initializeKindredData = async () => {
    // Create or load user's kindred profile
    const profile: KindredProfile = {
      id: userId,
      sacredName: userProfile.sacredName || 'Sacred Seeker',
      avatar: userProfile.avatar || { type: 'symbol', value: '🌱' },
      culturalRoots: userProfile.culturalRoots || ['universal'],
      healingJourney: {
        currentFocuses: ['self_awareness', 'emotional_regulation'],
        strengthsOffered: ['gentle_listening', 'creative_perspective'],
        seasonOfLife: 'deep_work',
        yearsSeeking: 2,
        ...userProfile.healingJourney
      },
      sacredValues: userProfile.sacredValues || ['authenticity', 'compassion', 'growth'],
      communicationStyle: {
        preference: 'gentle_sharer',
        responseTime: 'contemplative',
        energyLevel: 'gentle_energy',
        ...userProfile.communicationStyle
      },
      connectionBoundaries: {
        availabilityLevel: 'gentle_exchange',
        sharedTopics: ['healing', 'creativity', 'nature'],
        offLimitTopics: [],
        meetingPreference: 'text_only',
        ...userProfile.connectionBoundaries
      },
      resonanceIndicators: {
        favoriteQuietMoments: ['morning_coffee', 'sunset_walks'],
        creativePractices: ['journaling', 'nature_photography'],
        wisdomSources: ['poetry', 'meditation_teachers'],
        natureConnections: ['forest_bathing', 'gardening'],
        ...userProfile.resonanceIndicators
      },
      lastActive: new Date(),
      memberSince: userProfile.memberSince || new Date(),
      connectionHistory: {
        currentConnections: [],
        pastConnections: 0,
        witnessedReflections: 5,
        ...userProfile.connectionHistory
      }
    };

    setMyProfile(profile);
    setIsProfileComplete(checkProfileCompleteness(profile));

    // Generate sample potential matches
    generatePotentialMatches(profile);
  };

  const checkProfileCompleteness = (profile: KindredProfile): boolean => {
    return !!(
      profile.sacredName &&
      profile.healingJourney.currentFocuses.length > 0 &&
      profile.sacredValues.length > 0 &&
      profile.resonanceIndicators.favoriteQuietMoments.length > 0
    );
  };

  const generatePotentialMatches = (userProfile: KindredProfile) => {
    // Sample kindred profiles for matching
    const sampleProfiles: KindredProfile[] = [
      {
        id: 'kindred-1',
        sacredName: 'Gentle Wanderer',
        avatar: { type: 'symbol', value: '🦋' },
        culturalRoots: ['east_asian', 'universal'],
        healingJourney: {
          currentFocuses: ['anxiety_healing', 'creative_expression'],
          strengthsOffered: ['deep_listening', 'artistic_perspective'],
          seasonOfLife: 'deep_work',
          yearsSeeking: 3
        },
        sacredValues: ['mindfulness', 'creativity', 'gentle_growth'],
        communicationStyle: {
          preference: 'deep_listener',
          responseTime: 'contemplative',
          energyLevel: 'quiet_presence'
        },
        connectionBoundaries: {
          availabilityLevel: 'gentle_exchange',
          sharedTopics: ['art_therapy', 'mindfulness', 'cultural_healing'],
          offLimitTopics: ['family_trauma'],
          meetingPreference: 'text_only'
        },
        resonanceIndicators: {
          favoriteQuietMoments: ['tea_ceremony', 'sketch_time'],
          creativePractices: ['watercolor', 'poetry'],
          wisdomSources: ['buddhist_teachings', 'artist_memoirs'],
          natureConnections: ['rain_walking', 'cherry_blossoms']
        },
        lastActive: new Date(),
        memberSince: new Date('2024-01-01'),
        connectionHistory: {
          currentConnections: ['kindred-3'],
          pastConnections: 2,
          witnessedReflections: 15
        }
      },
      {
        id: 'kindred-2',
        sacredName: 'Earth Wisdom Keeper',
        avatar: { type: 'symbol', value: '🌳' },
        culturalRoots: ['indigenous', 'bridge'],
        healingJourney: {
          currentFocuses: ['ancestral_healing', 'land_connection'],
          strengthsOffered: ['ceremonial_guidance', 'earth_practices'],
          seasonOfLife: 'offering_back',
          yearsSeeking: 15
        },
        sacredValues: ['reciprocity', 'earth_connection', 'ancestral_wisdom'],
        communicationStyle: {
          preference: 'wisdom_keeper',
          responseTime: 'seasonal',
          energyLevel: 'vibrant_engagement'
        },
        connectionBoundaries: {
          availabilityLevel: 'mentorship_offering',
          sharedTopics: ['land_practices', 'cultural_healing', 'ceremony'],
          offLimitTopics: ['appropriation_concerns'],
          meetingPreference: 'voice_calls'
        },
        resonanceIndicators: {
          favoriteQuietMoments: ['dawn_prayers', 'earth_touching'],
          creativePractices: ['plant_medicine', 'story_weaving'],
          wisdomSources: ['elder_teachings', 'plant_allies'],
          natureConnections: ['forest_communion', 'star_guidance']
        },
        lastActive: new Date(),
        memberSince: new Date('2023-06-01'),
        connectionHistory: {
          currentConnections: ['kindred-4', 'kindred-5'],
          pastConnections: 8,
          witnessedReflections: 45
        }
      }
    ];

    // Calculate matches based on resonance
    const matches: KindredMatch[] = sampleProfiles.map(profile => {
      const match = calculateKindredResonance(userProfile, profile);
      return match;
    }).filter(match => match.resonanceScore > 0.3); // Only show meaningful matches

    setPotentialMatches(matches);
  };

  const calculateKindredResonance = (user: KindredProfile, potential: KindredProfile): KindredMatch => {
    // Cultural bridge calculation
    const culturalBridge = user.culturalRoots.filter(root => 
      potential.culturalRoots.includes(root) || 
      potential.culturalRoots.includes('bridge') || 
      user.culturalRoots.includes('bridge')
    );

    // Healing overlap
    const healingOverlap = user.healingJourney.currentFocuses.filter(focus =>
      potential.healingJourney.strengthsOffered.includes(focus) ||
      potential.healingJourney.currentFocuses.includes(focus)
    );

    // Value alignment
    const valueAlignment = user.sacredValues.filter(value =>
      potential.sacredValues.includes(value)
    );

    // Communication compatibility
    const communicationFit = (
      user.communicationStyle.energyLevel === potential.communicationStyle.energyLevel ||
      (user.communicationStyle.preference === 'deep_listener' && potential.communicationStyle.preference === 'gentle_sharer') ||
      (user.communicationStyle.preference === 'gentle_sharer' && potential.communicationStyle.preference === 'deep_listener')
    );

    // Boundary compatibility
    const boundaryCompatibility = (
      user.connectionBoundaries.meetingPreference === potential.connectionBoundaries.meetingPreference ||
      potential.connectionBoundaries.meetingPreference === 'text_only' // Text is universally compatible
    );

    // Calculate overall resonance score
    let resonanceScore = 0;
    resonanceScore += culturalBridge.length * 0.15;
    resonanceScore += healingOverlap.length * 0.25;
    resonanceScore += valueAlignment.length * 0.20;
    resonanceScore += communicationFit ? 0.20 : 0;
    resonanceScore += boundaryCompatibility ? 0.15 : 0;
    
    // Bonus for complementary healing seasons
    if (user.healingJourney.seasonOfLife === 'beginning' && potential.healingJourney.seasonOfLife === 'offering_back') {
      resonanceScore += 0.10;
    }

    // Determine connection suggestion
    let connectionType: KindredMatch['connectionSuggestion']['type'];
    let initialActivity: string;
    let connectionReason: string;

    if (healingOverlap.length > 0) {
      connectionType = 'mutual_support';
      initialActivity = 'Share reflections on your healing journeys';
      connectionReason = `You both are working with ${healingOverlap[0].replace('_', ' ')}`;
    } else if (potential.healingJourney.seasonOfLife === 'offering_back') {
      connectionType = 'wisdom_exchange';
      initialActivity = 'Gentle mentorship conversation';
      connectionReason = `${potential.sacredName} offers wisdom in areas you're exploring`;
    } else if (valueAlignment.length > 1) {
      connectionType = 'shared_exploration';
      initialActivity = 'Explore your shared values together';
      connectionReason = `You both deeply value ${valueAlignment[0]} and ${valueAlignment[1]}`;
    } else {
      connectionType = 'gentle_witness';
      initialActivity = 'Practice witnessing each other\'s reflections';
      connectionReason = 'Your communication styles complement each other beautifully';
    }

    return {
      profile: potential,
      resonanceScore: Math.min(resonanceScore, 1),
      sharedElements: {
        culturalBridge,
        healingOverlap,
        valueAlignment,
        communicationFit,
        boundaryCompatibility
      },
      connectionSuggestion: {
        type: connectionType,
        initialActivity,
        connectionReason
      }
    };
  };

  return (
    <div className={`sacred-kindred-discovery ${className}`}>
      {/* Sacred Navigation */}
      <nav className="sacred-navigation surface-elevated-gentle p-gentle mb-ritual rounded-gentle">
        <div className="flex space-x-breath">
          <button
            onClick={() => setCurrentView('profile')}
            className={`sacred-nav-button ${currentView === 'profile' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🦋</span>
            Your Sacred Profile
          </button>
          <button
            onClick={() => setCurrentView('discover')}
            className={`sacred-nav-button ${currentView === 'discover' ? 'active' : ''} ${!isProfileComplete ? 'opacity-50' : ''}`}
            disabled={!isProfileComplete}
          >
            <span className="text-lg mr-whisper">🔍</span>
            Discover Kindred
          </button>
          <button
            onClick={() => setCurrentView('connections')}
            className={`sacred-nav-button ${currentView === 'connections' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">💫</span>
            Sacred Connections
          </button>
          <button
            onClick={() => setCurrentView('invitations')}
            className={`sacred-nav-button ${currentView === 'invitations' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">💌</span>
            Invitations
            {pendingInvitations.length > 0 && (
              <span className="ml-whisper bg-primary text-white text-whisper px-whisper rounded-full">
                {pendingInvitations.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="sacred-content-area">
        {currentView === 'profile' && (
          <ProfileView
            profile={myProfile}
            onUpdateProfile={setMyProfile}
            onProfileComplete={() => setIsProfileComplete(true)}
          />
        )}
        
        {currentView === 'discover' && isProfileComplete && (
          <DiscoverView
            matches={potentialMatches}
            userProfile={myProfile}
            onSendInvitation={(match, invitation) => {
              setPendingInvitations(prev => [...prev, invitation]);
            }}
          />
        )}
        
        {currentView === 'connections' && (
          <ConnectionsView
            connections={activeConnections}
            userProfile={myProfile}
          />
        )}
        
        {currentView === 'invitations' && (
          <InvitationsView
            invitations={pendingInvitations}
            onAcceptInvitation={(invitation) => {
              // Handle invitation acceptance
              setPendingInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
            }}
            onDeclineInvitation={(invitation) => {
              setPendingInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
            }}
          />
        )}

        {currentView === 'discover' && !isProfileComplete && (
          <div className="text-center py-sanctuary">
            <div className="text-4xl mb-gentle">🌱</div>
            <h3 className="text-ceremonial font-grounding text-primary mb-breath">
              Complete Your Sacred Profile
            </h3>
            <p className="text-presence text-secondary mb-ritual">
              Share a bit about your healing journey to discover kindred spirits who resonate with your path.
            </p>
            <button
              onClick={() => setCurrentView('profile')}
              className="sacred-button intention-sacred"
            >
              Complete your profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== PROFILE VIEW COMPONENT =====

interface ProfileViewProps {
  profile: KindredProfile | null;
  onUpdateProfile: (profile: KindredProfile) => void;
  onProfileComplete: () => void;
}

function ProfileView({ profile, onUpdateProfile, onProfileComplete }: ProfileViewProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<any>({});

  if (!profile) return null;

  const updateProfileSection = (section: string, values: any) => {
    const updatedProfile = { ...profile, [section]: { ...profile[section as keyof KindredProfile], ...values } };
    onUpdateProfile(updatedProfile);
    setEditingSection(null);
    setTempValues({});
    
    // Check if profile is now complete
    if (checkProfileCompleteness(updatedProfile)) {
      onProfileComplete();
    }
  };

  const checkProfileCompleteness = (prof: KindredProfile): boolean => {
    return !!(
      prof.sacredName &&
      prof.healingJourney.currentFocuses.length > 0 &&
      prof.sacredValues.length > 0 &&
      prof.resonanceIndicators.favoriteQuietMoments.length > 0
    );
  };

  return (
    <div className="profile-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Your Sacred Profile
        </h2>
        <p className="text-presence text-secondary">
          Share your authentic self to find kindred spirits who resonate with your journey.
        </p>
      </div>

      <div className="space-y-ritual">
        {/* Basic Information */}
        <ProfileSection
          title="Sacred Identity"
          icon="🦋"
          isEditing={editingSection === 'identity'}
          onEdit={() => setEditingSection('identity')}
          onSave={(values) => updateProfileSection('', values)}
          onCancel={() => setEditingSection(null)}
        >
          {editingSection === 'identity' ? (
            <div className="space-y-gentle">
              <div>
                <label className="block text-breath font-presence text-primary mb-whisper">Sacred Name</label>
                <input
                  type="text"
                  defaultValue={profile.sacredName}
                  onChange={(e) => setTempValues({...tempValues, sacredName: e.target.value})}
                  className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
                  placeholder="How would you like to be known in the community?"
                />
              </div>
              <div>
                <label className="block text-breath font-presence text-primary mb-whisper">Avatar Symbol</label>
                <input
                  type="text"
                  defaultValue={profile.avatar?.value}
                  onChange={(e) => setTempValues({...tempValues, avatar: { type: 'symbol', value: e.target.value }})}
                  className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
                  placeholder="Choose an emoji that represents you 🌱"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-breath">
              <span className="text-2xl">{profile.avatar?.value}</span>
              <div>
                <p className="text-grounding font-presence text-primary">{profile.sacredName}</p>
                <p className="text-breath text-secondary">Member since {profile.memberSince.toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </ProfileSection>

        {/* Healing Journey */}
        <ProfileSection
          title="Healing Journey"
          icon="🌱"
          isEditing={editingSection === 'healing'}
          onEdit={() => setEditingSection('healing')}
          onSave={(values) => updateProfileSection('healingJourney', values)}
          onCancel={() => setEditingSection(null)}
        >
          {editingSection === 'healing' ? (
            <HealingJourneyEditor
              initialValues={profile.healingJourney}
              onUpdate={(values) => setTempValues(values)}
            />
          ) : (
            <div className="space-y-breath">
              <div>
                <h5 className="text-breath font-presence text-primary mb-whisper">Current Focuses</h5>
                <div className="flex gap-whisper flex-wrap">
                  {profile.healingJourney.currentFocuses.map(focus => (
                    <span key={focus} className="text-whisper bg-healing-mist px-breath py-whisper rounded-breath">
                      {focus.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-breath font-presence text-primary mb-whisper">Strengths Offered</h5>
                <div className="flex gap-whisper flex-wrap">
                  {profile.healingJourney.strengthsOffered.map(strength => (
                    <span key={strength} className="text-whisper bg-tender-embrace px-breath py-whisper rounded-breath">
                      {strength.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-breath text-secondary">
                Season of life: <span className="font-presence">{profile.healingJourney.seasonOfLife.replace('_', ' ')}</span>
              </p>
            </div>
          )}
        </ProfileSection>

        {/* Sacred Values */}
        <ProfileSection
          title="Sacred Values"
          icon="💎"
          isEditing={editingSection === 'values'}
          onEdit={() => setEditingSection('values')}
          onSave={(values) => updateProfileSection('', values)}
          onCancel={() => setEditingSection(null)}
        >
          <div className="flex gap-whisper flex-wrap">
            {profile.sacredValues.map(value => (
              <span key={value} className="text-whisper bg-moon-whisper px-breath py-whisper rounded-breath">
                {value.replace('_', ' ')}
              </span>
            ))}
          </div>
        </ProfileSection>

        {/* Resonance Indicators */}
        <ProfileSection
          title="Resonance Indicators"
          icon="✨"
          isEditing={editingSection === 'resonance'}
          onEdit={() => setEditingSection('resonance')}
          onSave={(values) => updateProfileSection('resonanceIndicators', values)}
          onCancel={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gentle">
            <div>
              <h5 className="text-breath font-presence text-primary mb-whisper">Favorite Quiet Moments</h5>
              <div className="space-y-whisper">
                {profile.resonanceIndicators.favoriteQuietMoments.map(moment => (
                  <p key={moment} className="text-breath text-secondary">{moment.replace('_', ' ')}</p>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-breath font-presence text-primary mb-whisper">Creative Practices</h5>
              <div className="space-y-whisper">
                {profile.resonanceIndicators.creativePractices.map(practice => (
                  <p key={practice} className="text-breath text-secondary">{practice.replace('_', ' ')}</p>
                ))}
              </div>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}

// ===== PROFILE SECTION COMPONENT =====

interface ProfileSectionProps {
  title: string;
  icon: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (values: any) => void;
  onCancel: () => void;
  children: React.ReactNode;
}

function ProfileSection({ title, icon, isEditing, onEdit, onSave, onCancel, children }: ProfileSectionProps) {
  return (
    <div className="profile-section surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
      <div className="flex items-center justify-between mb-gentle">
        <div className="flex items-center gap-breath">
          <span className="text-xl">{icon}</span>
          <h4 className="text-grounding font-presence text-primary">{title}</h4>
        </div>
        {!isEditing && (
          <button
            onClick={onEdit}
            className="sacred-button intention-gentle text-breath"
          >
            Edit
          </button>
        )}
      </div>

      {children}

      {isEditing && (
        <div className="flex gap-breath justify-end mt-gentle pt-breath border-t border-healing-mist">
          <button onClick={onCancel} className="sacred-button intention-gentle">
            Cancel
          </button>
          <button onClick={() => onSave({})} className="sacred-button intention-sacred">
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}

// ===== HEALING JOURNEY EDITOR =====

interface HealingJourneyEditorProps {
  initialValues: KindredProfile['healingJourney'];
  onUpdate: (values: KindredProfile['healingJourney']) => void;
}

function HealingJourneyEditor({ initialValues, onUpdate }: HealingJourneyEditorProps) {
  const [focuses, setFocuses] = useState(initialValues.currentFocuses);
  const [strengths, setStrengths] = useState(initialValues.strengthsOffered);
  const [season, setSeason] = useState(initialValues.seasonOfLife);

  const focusOptions = [
    'self_awareness', 'emotional_regulation', 'trauma_healing', 'anxiety_healing',
    'depression_support', 'relationship_patterns', 'creative_expression', 'spiritual_growth',
    'cultural_healing', 'ancestral_wounds', 'grief_processing', 'addiction_recovery'
  ];

  const strengthOptions = [
    'deep_listening', 'gentle_encouragement', 'creative_perspective', 'practical_wisdom',
    'cultural_bridging', 'spiritual_guidance', 'artistic_expression', 'crisis_support',
    'boundary_setting', 'somatic_awareness', 'nature_connection', 'ritual_creation'
  ];

  useEffect(() => {
    onUpdate({ currentFocuses: focuses, strengthsOffered: strengths, seasonOfLife: season, yearsSeeking: initialValues.yearsSeeking });
  }, [focuses, strengths, season]);

  return (
    <div className="space-y-gentle">
      <div>
        <label className="block text-breath font-presence text-primary mb-breath">Current Healing Focuses</label>
        <div className="grid grid-cols-2 gap-whisper">
          {focusOptions.map(option => (
            <label key={option} className="flex items-center gap-whisper">
              <input
                type="checkbox"
                checked={focuses.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFocuses([...focuses, option]);
                  } else {
                    setFocuses(focuses.filter(f => f !== option));
                  }
                }}
                className="rounded"
              />
              <span className="text-breath text-secondary">{option.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-breath font-presence text-primary mb-breath">Strengths You Offer</label>
        <div className="grid grid-cols-2 gap-whisper">
          {strengthOptions.map(option => (
            <label key={option} className="flex items-center gap-whisper">
              <input
                type="checkbox"
                checked={strengths.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setStrengths([...strengths, option]);
                  } else {
                    setStrengths(strengths.filter(s => s !== option));
                  }
                }}
                className="rounded"
              />
              <span className="text-breath text-secondary">{option.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-breath font-presence text-primary mb-breath">Season of Life</label>
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value as KindredProfile['healingJourney']['seasonOfLife'])}
          className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
        >
          <option value="beginning">Beginning my healing journey</option>
          <option value="deep_work">Doing deep healing work</option>
          <option value="integration">Integrating lessons learned</option>
          <option value="offering_back">Offering wisdom to others</option>
          <option value="rest_renewal">Resting and renewing</option>
        </select>
      </div>
    </div>
  );
}

// ===== DISCOVER VIEW COMPONENT =====

interface DiscoverViewProps {
  matches: KindredMatch[];
  userProfile: KindredProfile | null;
  onSendInvitation: (match: KindredMatch, invitation: ConnectionInvitation) => void;
}

function DiscoverView({ matches, userProfile, onSendInvitation }: DiscoverViewProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🔍</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Seeking Kindred Spirits
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          We're looking for souls whose journeys might resonate with yours. Check back soon as our community grows.
        </p>
      </div>
    );
  }

  return (
    <div className="discover-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Kindred Spirits Awaiting Connection
        </h2>
        <p className="text-presence text-secondary">
          These souls share resonant elements with your journey. Reach out when your heart feels called to connect.
        </p>
      </div>

      <div className="space-y-ritual">
        {matches.map(match => (
          <KindredMatchCard
            key={match.profile.id}
            match={match}
            userProfile={userProfile}
            onSendInvitation={onSendInvitation}
          />
        ))}
      </div>
    </div>
  );
}

// ===== KINDRED MATCH CARD =====

interface KindredMatchCardProps {
  match: KindredMatch;
  userProfile: KindredProfile | null;
  onSendInvitation: (match: KindredMatch, invitation: ConnectionInvitation) => void;
}

function KindredMatchCard({ match, userProfile, onSendInvitation }: KindredMatchCardProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');

  const sendInvitation = () => {
    if (!userProfile || !personalMessage.trim()) return;

    const invitation: ConnectionInvitation = {
      id: `invitation-${Date.now()}`,
      fromProfileId: userProfile.id,
      toProfileId: match.profile.id,
      invitationType: match.connectionSuggestion.type,
      personalMessage: personalMessage,
      suggestedActivity: match.connectionSuggestion.initialActivity,
      sentAt: new Date(),
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    onSendInvitation(match, invitation);
    setShowInviteModal(false);
    setPersonalMessage('');
  };

  return (
    <div className="kindred-match-card surface-card-gentle p-ritual rounded-gentle border border-healing-mist">
      {/* Match Header */}
      <div className="flex items-start justify-between mb-gentle">
        <div className="flex items-center gap-breath">
          <span className="text-2xl">{match.profile.avatar?.value}</span>
          <div>
            <h4 className="text-grounding font-presence text-primary">{match.profile.sacredName}</h4>
            <p className="text-breath text-secondary">
              {match.profile.healingJourney.seasonOfLife.replace('_', ' ')} • {match.profile.healingJourney.yearsSeeking} years seeking
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-whisper mb-whisper">
            <span className="text-whisper text-tertiary">Resonance</span>
            <div className="flex gap-whisper">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={i < Math.round(match.resonanceScore * 5) ? 'text-primary' : 'text-healing-mist'}
                >
                  ✦
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Reason */}
      <div className="connection-reason bg-tender-embrace p-breath rounded-breath mb-gentle">
        <p className="text-breath text-primary font-presence italic">
          {match.connectionSuggestion.connectionReason}
        </p>
      </div>

      {/* Shared Elements */}
      <div className="shared-elements mb-gentle">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-breath text-whisper">
          {match.sharedElements.culturalBridge.length > 0 && (
            <div>
              <span className="font-presence text-secondary">Cultural bridge:</span>
              <p className="text-tertiary">{match.sharedElements.culturalBridge.join(', ')}</p>
            </div>
          )}
          {match.sharedElements.healingOverlap.length > 0 && (
            <div>
              <span className="font-presence text-secondary">Healing overlap:</span>
              <p className="text-tertiary">{match.sharedElements.healingOverlap.join(', ').replace(/_/g, ' ')}</p>
            </div>
          )}
          {match.sharedElements.valueAlignment.length > 0 && (
            <div>
              <span className="font-presence text-secondary">Shared values:</span>
              <p className="text-tertiary">{match.sharedElements.valueAlignment.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Profile Highlights */}
      <div className="profile-highlights mb-gentle space-y-breath">
        <div>
          <h5 className="text-breath font-presence text-primary mb-whisper">Current Focus</h5>
          <div className="flex gap-whisper flex-wrap">
            {match.profile.healingJourney.currentFocuses.slice(0, 3).map(focus => (
              <span key={focus} className="text-whisper bg-healing-mist px-whisper py-whisper rounded-breath">
                {focus.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-breath font-presence text-primary mb-whisper">Offers</h5>
          <div className="flex gap-whisper flex-wrap">
            {match.profile.healingJourney.strengthsOffered.slice(0, 3).map(strength => (
              <span key={strength} className="text-whisper bg-moon-whisper px-whisper py-whisper rounded-breath">
                {strength.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="pt-breath border-t border-healing-mist">
        <button
          onClick={() => setShowInviteModal(true)}
          className="sacred-button intention-sacred w-full"
        >
          <span className="mr-whisper">💌</span>
          Send connection invitation
        </button>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-gentle z-50">
          <div className="sacred-modal surface-sanctuary p-ritual rounded-gentle max-w-lg w-full">
            <h3 className="text-sacred font-grounding text-primary mb-gentle">
              Invitation to {match.profile.sacredName}
            </h3>
            
            <div className="mb-gentle">
              <p className="text-breath text-secondary mb-breath">
                <span className="font-presence">Suggested connection:</span> {match.connectionSuggestion.initialActivity}
              </p>
            </div>

            <div className="mb-ritual">
              <label className="block text-presence font-presence text-primary mb-breath">
                Personal message
              </label>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Share what drew you to connect and how you'd like to support each other..."
                className="w-full p-gentle border border-healing-mist rounded-breath resize-none h-24 focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-gentle justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="sacred-button intention-gentle"
              >
                Close
              </button>
              <button
                onClick={sendInvitation}
                disabled={!personalMessage.trim()}
                className="sacred-button intention-sacred disabled:opacity-50"
              >
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== CONNECTIONS VIEW COMPONENT =====

interface ConnectionsViewProps {
  connections: KindredConnection[];
  userProfile: KindredProfile | null;
}

function ConnectionsView({ connections, userProfile }: ConnectionsViewProps) {
  if (connections.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">💫</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Connections Awaiting
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          Your kindred spirit connections will appear here as you build relationships in the community.
        </p>
        <button className="sacred-button intention-sacred">
          Discover kindred spirits
        </button>
      </div>
    );
  }

  return (
    <div className="connections-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Your Sacred Connections
        </h2>
        <p className="text-presence text-secondary">
          Nurture and celebrate the meaningful relationships you've built.
        </p>
      </div>

      <div className="space-y-gentle">
        {connections.map(connection => (
          <div key={connection.id} className="connection-card surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
            {/* Connection details would go here */}
            <p className="text-breath text-secondary">Connection details coming soon...</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== INVITATIONS VIEW COMPONENT =====

interface InvitationsViewProps {
  invitations: ConnectionInvitation[];
  onAcceptInvitation: (invitation: ConnectionInvitation) => void;
  onDeclineInvitation: (invitation: ConnectionInvitation) => void;
}

function InvitationsView({ invitations, onAcceptInvitation, onDeclineInvitation }: InvitationsViewProps) {
  if (invitations.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">💌</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Invitation Space Open
        </h3>
        <p className="text-presence text-secondary">
          Connection invitations from kindred spirits will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="invitations-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Invitations
        </h2>
        <p className="text-presence text-secondary">
          Kindred spirits who would like to connect with you.
        </p>
      </div>

      <div className="space-y-gentle">
        {invitations.map(invitation => (
          <div key={invitation.id} className="invitation-card surface-card-gentle p-gentle rounded-gentle border border-healing-mist">
            <div className="flex items-start justify-between mb-gentle">
              <div>
                <h4 className="text-grounding font-presence text-primary">Connection Invitation</h4>
                <p className="text-breath text-secondary">
                  {new Date(invitation.sentAt).toLocaleDateString()} • Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg">💌</span>
            </div>

            <div className="mb-gentle">
              <p className="text-breath text-secondary mb-breath">
                <span className="font-presence">Suggested activity:</span> {invitation.suggestedActivity}
              </p>
              <div className="bg-healing-mist p-breath rounded-breath">
                <p className="text-breath text-primary leading-spacious">"{invitation.personalMessage}"</p>
              </div>
            </div>

            <div className="flex gap-breath justify-end">
              <button
                onClick={() => onDeclineInvitation(invitation)}
                className="sacred-button intention-gentle"
              >
                Respectfully decline
              </button>
              <button
                onClick={() => onAcceptInvitation(invitation)}
                className="sacred-button intention-sacred"
              >
                <span className="mr-whisper">🤝</span>
                Accept connection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SacredKindredDiscovery;