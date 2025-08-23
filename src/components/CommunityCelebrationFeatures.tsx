// ALCHM Community Celebration Features
// Building meaningful community connections through shared celebrations of growth and achievement

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Achievement,
  Milestone,
  GamificationProfile,
  Recognition,
  SharedStory,
  CelebrationStyle
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface CommunityCelebrationFeaturesProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  gamificationProfile: GamificationProfile;
  onCelebrationJoined?: (celebrationId: string) => void;
  onCelebrationCreated?: (celebration: CommunityCelebration) => void;
  onCelebrationResponse?: (celebrationId: string, response: CelebrationResponse) => void;
}

interface CommunityCelebration {
  celebrationId: string;
  type: 'milestone_party' | 'achievement_circle' | 'breakthrough_celebration' | 'gratitude_gathering' | 'progress_appreciation' | 'transformation_witness';
  
  // Celebration Details
  title: string;
  description: string;
  celebrant: CelebrationParticipant;
  achievement?: Achievement;
  milestone?: Milestone;
  story?: SharedStory;
  
  // Community Aspects
  participants: CelebrationParticipant[];
  invitations: CelebrationInvitation[];
  responses: CelebrationResponse[];
  atmosphere: CelebrationAtmosphere;
  
  // Cultural & Personal Elements
  culturalElements: CulturalCelebrationElement[];
  personalizedElements: PersonalizedCelebrationElement[];
  ritualElements: CelebrationRitual[];
  
  // Timing & Format
  scheduledFor: Date;
  duration: number; // minutes
  format: 'real_time' | 'async_appreciation' | 'hybrid' | 'self_paced';
  timezone: string;
  
  // Sharing & Privacy
  visibilityLevel: 'private' | 'circle' | 'community' | 'public';
  isAnonymous: boolean;
  recordingPermission: boolean;
  
  // Engagement
  celebrationActivities: CelebrationActivity[];
  participationLevel: 'observer' | 'supporter' | 'active_participant' | 'co_celebrant';
  communityImpact: CommunityImpact;
  
  // Status
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

interface CelebrationParticipant {
  userId: string;
  userName: string;
  role: 'celebrant' | 'supporter' | 'witness' | 'co_celebrant' | 'facilitator';
  participationStatus: 'invited' | 'accepted' | 'declined' | 'tentative' | 'joined' | 'absent';
  culturalBackground?: string;
  personalizedMessage?: string;
  energyContribution: EnergyContribution;
}

interface CelebrationResponse {
  responseId: string;
  fromUserId: string;
  fromUserName: string;
  responseType: 'congratulations' | 'appreciation' | 'inspiration_shared' | 'support_offered' | 'wisdom_shared' | 'gratitude_expressed';
  message: string;
  emotionalTone: 'joyful' | 'proud' | 'grateful' | 'inspired' | 'moved' | 'hopeful';
  culturalExpression?: CulturalExpression;
  isPublic: boolean;
  timestamp: Date;
}

interface CelebrationAtmosphere {
  overallMood: 'joyful' | 'proud' | 'grateful' | 'inspiring' | 'peaceful' | 'energetic';
  energyLevel: number; // 0-1
  participationLevel: number; // 0-1
  culturalHarmony: number; // 0-1
  authenticity: number; // 0-1
  meaningfulness: number; // 0-1
}

interface CelebrationActivity {
  activityId: string;
  type: 'appreciation_circle' | 'story_sharing' | 'wisdom_exchange' | 'gratitude_moment' | 'blessing_ceremony' | 'recognition_ritual';
  title: string;
  description: string;
  facilitator?: string;
  duration: number; // minutes
  participationRequirement: 'optional' | 'encouraged' | 'required';
  culturalAdaptation: ActivityCulturalAdaptation;
  materials?: string[];
  instructions: string[];
}

interface CelebrationRitual {
  ritualId: string;
  name: string;
  origin: 'cultural' | 'personal' | 'community' | 'universal';
  description: string;
  symbolism: string;
  steps: RitualStep[];
  materials: RitualMaterial[];
  timing: 'opening' | 'closing' | 'throughout' | 'spontaneous';
  participation: 'individual' | 'collective' | 'optional';
}

interface VirtualCelebrationSpace {
  spaceId: string;
  theme: CelebrationTheme;
  layout: SpaceLayout;
  decorations: VirtualDecoration[];
  ambiance: SpaceAmbiance;
  interactiveElements: InteractiveElement[];
  culturalPersonalization: CulturalPersonalization[];
}

interface CelebrationGift {
  giftId: string;
  type: 'wisdom_sharing' | 'resource_offer' | 'connection_introduction' | 'skill_teaching' | 'mentorship_offer' | 'emotional_support';
  fromUserId: string;
  toUserId: string;
  title: string;
  description: string;
  value: GiftValue;
  deliveryMethod: 'immediate' | 'scheduled' | 'ongoing' | 'milestone_based';
  culturalSensitivity: CulturalSensitivity;
  acceptanceStatus: 'offered' | 'accepted' | 'declined' | 'completed';
}

const CommunityCelebrationFeatures: React.FC<CommunityCelebrationFeaturesProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  gamificationProfile,
  onCelebrationJoined,
  onCelebrationCreated,
  onCelebrationResponse
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live_celebrations' | 'create_celebration' | 'celebration_history' | 'community_calendar'>('upcoming');
  const [upcomingCelebrations, setUpcomingCelebrations] = useState<CommunityCelebration[]>([]);
  const [liveCelebrations, setLiveCelebrations] = useState<CommunityCelebration[]>([]);
  const [celebrationHistory, setCelebrationHistory] = useState<CommunityCelebration[]>([]);
  const [selectedCelebration, setSelectedCelebration] = useState<CommunityCelebration | null>(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [celebrationDraft, setCelebrationDraft] = useState<Partial<CommunityCelebration> | null>(null);
  const [virtualSpace, setVirtualSpace] = useState<VirtualCelebrationSpace | null>(null);
  const [receivedGifts, setReceivedGifts] = useState<CelebrationGift[]>([]);
  const [givenGifts, setGivenGifts] = useState<CelebrationGift[]>([]);
  const [communityCalendar, setCommunityCalendar] = useState<CommunityCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const celebrationRef = useRef<HTMLDivElement>(null);

  // Initialize community celebration features
  useEffect(() => {
    loadCommunityCelebrationData();
  }, [userId, culturalContext]);

  const loadCommunityCelebrationData = async () => {
    try {
      setIsLoading(true);

      // Load upcoming celebrations
      const upcoming = await loadUpcomingCelebrations(userId, culturalContext);
      setUpcomingCelebrations(upcoming);

      // Load live celebrations
      const live = await loadLiveCelebrations(userId, culturalContext);
      setLiveCelebrations(live);

      // Load celebration history
      const history = await loadCelebrationHistory(userId);
      setCelebrationHistory(history);

      // Load community calendar
      const calendar = await loadCommunityCalendar(userId, culturalContext);
      setCommunityCalendar(calendar);

      // Load celebration gifts
      const gifts = await loadCelebrationGifts(userId);
      setReceivedGifts(gifts.received);
      setGivenGifts(gifts.given);

    } catch (error) {
      console.error('Error loading community celebration data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Join celebration
  const joinCelebration = useCallback(async (celebrationId: string) => {
    try {
      await joinCommunityCelebration(celebrationId, userId);
      
      // Update local state
      setUpcomingCelebrations(prev => 
        prev.map(c => 
          c.celebrationId === celebrationId 
            ? { 
                ...c, 
                participants: [...c.participants, {
                  userId,
                  userName: identityProfile.preferredName || 'You',
                  role: 'supporter',
                  participationStatus: 'accepted',
                  energyContribution: { type: 'positive_presence', intensity: 0.8 }
                }] 
              }
            : c
        )
      );

      onCelebrationJoined?.(celebrationId);

    } catch (error) {
      console.error('Error joining celebration:', error);
    }
  }, [userId, identityProfile, onCelebrationJoined]);

  // Create celebration
  const createCelebration = useCallback(async (draft: Partial<CommunityCelebration>) => {
    try {
      const celebration = await createCommunityCelebration(draft, userId, culturalContext);
      setUpcomingCelebrations(prev => [...prev, celebration]);
      setCelebrationDraft(null);
      setShowCreateModal(false);
      onCelebrationCreated?.(celebration);

    } catch (error) {
      console.error('Error creating celebration:', error);
    }
  }, [userId, culturalContext, onCelebrationCreated]);

  // Send celebration response
  const sendCelebrationResponse = useCallback(async (
    celebrationId: string,
    response: Omit<CelebrationResponse, 'responseId' | 'timestamp'>
  ) => {
    try {
      const fullResponse = await createCelebrationResponse(response, celebrationId, userId);
      
      // Update local state
      setUpcomingCelebrations(prev =>
        prev.map(c =>
          c.celebrationId === celebrationId
            ? { ...c, responses: [...c.responses, fullResponse] }
            : c
        )
      );

      onCelebrationResponse?.(celebrationId, fullResponse);

    } catch (error) {
      console.error('Error sending celebration response:', error);
    }
  }, [userId, onCelebrationResponse]);

  // Render upcoming celebrations
  const renderUpcomingCelebrations = () => {
    return (
      <div className="space-y-6">
        {/* Quick celebration actions */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">🎉 Celebrate Together</h3>
              <p className="text-yellow-700">Join community celebrations and create meaningful connections</p>
            </div>
            <button
              onClick={() => {
                setCelebrationDraft({
                  type: 'milestone_party',
                  title: '',
                  description: '',
                  format: 'real_time',
                  visibilityLevel: 'community',
                  celebrationActivities: []
                });
                setShowCreateModal(true);
              }}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Create Celebration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-100">
              <div className="text-2xl mb-2">🎊</div>
              <div className="text-sm font-medium text-gray-800">Milestone Parties</div>
              <div className="text-xs text-gray-600">Celebrate major achievements</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-100">
              <div className="text-2xl mb-2">💫</div>
              <div className="text-sm font-medium text-gray-800">Achievement Circles</div>
              <div className="text-xs text-gray-600">Honor breakthrough moments</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-yellow-100">
              <div className="text-2xl mb-2">🙏</div>
              <div className="text-sm font-medium text-gray-800">Gratitude Gatherings</div>
              <div className="text-xs text-gray-600">Share appreciation and thanks</div>
            </div>
          </div>
        </div>

        {/* Upcoming celebrations list */}
        <div className="space-y-4">
          {upcomingCelebrations.map((celebration) => (
            <div
              key={celebration.celebrationId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {celebration.type === 'milestone_party' ? '🎊' :
                       celebration.type === 'achievement_circle' ? '💫' :
                       celebration.type === 'breakthrough_celebration' ? '🚀' :
                       celebration.type === 'gratitude_gathering' ? '🙏' :
                       celebration.type === 'progress_appreciation' ? '📈' : '✨'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{celebration.title}</h3>
                      <div className="text-sm text-gray-600">
                        {celebration.type.replace('_', ' ').toUpperCase()} • {celebration.celebrant.userName}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{celebration.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{celebration.scheduledFor.toLocaleDateString()}</span>
                      <span>{celebration.scheduledFor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{celebration.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{celebration.participants.length} participants</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => joinCelebration(celebration.celebrationId)}
                    disabled={celebration.participants.some(p => p.userId === userId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {celebration.participants.some(p => p.userId === userId) ? 'Joined' : 'Join Celebration'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCelebration(celebration);
                      setShowCelebrationModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Celebration activities preview */}
              {celebration.celebrationActivities.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Planned Activities:</div>
                  <div className="flex flex-wrap gap-2">
                    {celebration.celebrationActivities.slice(0, 3).map((activity, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {activity.title}
                      </span>
                    ))}
                    {celebration.celebrationActivities.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{celebration.celebrationActivities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Cultural elements preview */}
              {celebration.culturalElements.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Cultural Elements:</div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    {celebration.culturalElements.slice(0, 2).map((element, index) => (
                      <div key={index} className="flex items-center space-x-1">
                        <span>{element.symbol}</span>
                        <span>{element.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {upcomingCelebrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Upcoming Celebrations</h3>
            <p className="text-gray-600 mb-4">Be the first to create a celebration for your community!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Celebration
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render live celebrations
  const renderLiveCelebrations = () => {
    return (
      <div className="space-y-6">
        {liveCelebrations.length > 0 ? (
          liveCelebrations.map((celebration) => (
            <div key={celebration.celebrationId} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="text-lg font-semibold text-gray-800">LIVE: {celebration.title}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedCelebration(celebration);
                    setShowCelebrationModal(true);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse"
                >
                  Join Live Celebration
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Celebrating:</div>
                  <div className="text-gray-600">{celebration.celebrant.userName}</div>
                  <div className="text-gray-600">{celebration.description}</div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Current Activity:</div>
                  <div className="text-blue-600">
                    {celebration.celebrationActivities.find(a => a.type === 'appreciation_circle')?.title || 'Community appreciation'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {celebration.participants.length} people celebrating together
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Atmosphere:</div>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      {celebration.atmosphere.overallMood}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {Math.round(celebration.atmosphere.energyLevel * 100)}% energy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Live Celebrations</h3>
            <p className="text-gray-600">Check back later or create your own celebration!</p>
          </div>
        )}
      </div>
    );
  };

  // Render celebration details modal
  const renderCelebrationModal = () => {
    if (!showCelebrationModal || !selectedCelebration) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">{selectedCelebration.title}</h3>
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Celebration overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Celebration Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Type:</span> {selectedCelebration.type.replace('_', ' ')}</div>
                    <div><span className="text-gray-600">Celebrant:</span> {selectedCelebration.celebrant.userName}</div>
                    <div><span className="text-gray-600">When:</span> {selectedCelebration.scheduledFor.toLocaleString()}</div>
                    <div><span className="text-gray-600">Duration:</span> {selectedCelebration.duration} minutes</div>
                    <div><span className="text-gray-600">Format:</span> {selectedCelebration.format.replace('_', ' ')}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Community</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">{selectedCelebration.participants.length} participants</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCelebration.participants.slice(0, 8).map((participant, index) => (
                        <div key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {participant.userName}
                        </div>
                      ))}
                      {selectedCelebration.participants.length > 8 && (
                        <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{selectedCelebration.participants.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Celebration activities */}
              {selectedCelebration.celebrationActivities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Planned Activities</h4>
                  <div className="space-y-3">
                    {selectedCelebration.celebrationActivities.map((activity, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800">{activity.title}</h5>
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            {activity.duration} min
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="text-xs text-gray-500">
                          {activity.participationRequirement === 'required' ? 'Required' :
                           activity.participationRequirement === 'encouraged' ? 'Encouraged' : 'Optional'} participation
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural elements */}
              {selectedCelebration.culturalElements.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Cultural Elements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCelebration.culturalElements.map((element, index) => (
                      <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{element.symbol}</span>
                          <span className="font-medium text-purple-800">{element.name}</span>
                        </div>
                        <p className="text-sm text-purple-700">{element.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Celebration responses */}
              {selectedCelebration.responses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Community Responses</h4>
                  <div className="max-h-64 overflow-y-auto space-y-3">
                    {selectedCelebration.responses.map((response, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-800">{response.fromUserName}</span>
                          <span className="text-xs text-gray-500">{response.timestamp.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{response.message}</p>
                        <div className="text-xs text-gray-600 mt-1">
                          {response.responseType.replace('_', ' ')} • {response.emotionalTone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => joinCelebration(selectedCelebration.celebrationId)}
                  disabled={selectedCelebration.participants.some(p => p.userId === userId)}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {selectedCelebration.participants.some(p => p.userId === userId) ? 'Already Joined' : 'Join Celebration'}
                </button>
                <button
                  onClick={() => {
                    // Handle sending a celebration response
                  }}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Send Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {renderCelebrationModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Community Celebrations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join together in celebrating growth milestones, achievements, and meaningful moments 
            that inspire and connect our community.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'upcoming', label: 'Upcoming', icon: '📅' },
              { id: 'live_celebrations', label: 'Live Now', icon: '🔴' },
              { id: 'create_celebration', label: 'Create', icon: '➕' },
              { id: 'celebration_history', label: 'History', icon: '📚' },
              { id: 'community_calendar', label: 'Calendar', icon: '🗓️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading community celebrations...</p>
          </div>
        ) : (
          <>
            {activeTab === 'upcoming' && renderUpcomingCelebrations()}
            {activeTab === 'live_celebrations' && renderLiveCelebrations()}
            {activeTab === 'create_celebration' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Celebration creation interface would be implemented here</p>
              </div>
            )}
            {activeTab === 'celebration_history' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Celebration history would be implemented here</p>
              </div>
            )}
            {activeTab === 'community_calendar' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Community calendar would be implemented here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Supporting types
interface CulturalCelebrationElement {
  elementId: string;
  name: string;
  symbol: string;
  meaning: string;
  origin: string;
  culturalContext: string;
}

interface PersonalizedCelebrationElement {
  elementId: string;
  type: 'personal_message' | 'favorite_quote' | 'meaningful_symbol' | 'special_memory';
  content: string;
  significance: string;
}

interface EnergyContribution {
  type: 'positive_presence' | 'active_participation' | 'emotional_support' | 'wisdom_sharing' | 'celebration_facilitation';
  intensity: number; // 0-1
}

interface CulturalExpression {
  type: 'blessing' | 'well_wishes' | 'traditional_greeting' | 'symbolic_gesture' | 'cultural_metaphor';
  content: string;
  culturalContext: string;
}

interface CommunityImpact {
  inspirationLevel: number; // 0-1
  connectionStrength: number; // 0-1
  motivationBoost: number; // 0-1
  communityBonding: number; // 0-1
}

interface CommunityCalendarEvent {
  eventId: string;
  title: string;
  type: string;
  date: Date;
  participants: number;
}

// API functions (implementations would be expanded)
const loadUpcomingCelebrations = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<CommunityCelebration[]> => {
  // Implementation would load upcoming celebrations
  return [];
};

const loadLiveCelebrations = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<CommunityCelebration[]> => {
  // Implementation would load live celebrations
  return [];
};

const loadCelebrationHistory = async (userId: string): Promise<CommunityCelebration[]> => {
  // Implementation would load celebration history
  return [];
};

const loadCommunityCalendar = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<CommunityCalendarEvent[]> => {
  // Implementation would load community calendar
  return [];
};

const loadCelebrationGifts = async (userId: string): Promise<{ received: CelebrationGift[]; given: CelebrationGift[] }> => {
  // Implementation would load celebration gifts
  return { received: [], given: [] };
};

const joinCommunityCelebration = async (celebrationId: string, userId: string): Promise<void> => {
  // Implementation would join celebration
};

const createCommunityCelebration = async (
  draft: Partial<CommunityCelebration>,
  userId: string,
  culturalContext: CulturalContext
): Promise<CommunityCelebration> => {
  // Implementation would create celebration
  return {} as CommunityCelebration;
};

const createCelebrationResponse = async (
  response: Omit<CelebrationResponse, 'responseId' | 'timestamp'>,
  celebrationId: string,
  userId: string
): Promise<CelebrationResponse> => {
  // Implementation would create celebration response
  return {} as CelebrationResponse;
};

export default CommunityCelebrationFeatures;