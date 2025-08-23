// ALCHM Mentor Recognition Systems
// Meaningful recognition and appreciation system for mentors who guide personal development journeys

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Recognition,
  Achievement,
  GamificationProfile,
  CelebrationStyle
} from '@/types/gamification-engagement-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { EmotionalEntry } from '@/types/emotional-wellness-schema';
import { CareerExplorationProfile, SMARTGoal } from '@/types/career-future-readiness-schema';
import { CulturalContext } from '@/types/identity-schema';

interface MentorRecognitionSystemsProps {
  userId: string;
  identityProfile: IdentityExplorationProfile;
  emotionalEntries: EmotionalEntry[];
  careerProfile: CareerExplorationProfile;
  culturalContext: CulturalContext;
  gamificationProfile: GamificationProfile;
  isMentor?: boolean;
  activeMentorships?: MentorshipRelationship[];
  onMentorRecognitionGiven?: (recognition: MentorRecognition) => void;
  onMentorshipMilestoneReached?: (milestone: MentorshipMilestone) => void;
  onMentorAppreciationShared?: (appreciation: MentorAppreciation) => void;
}

interface MentorProfile {
  mentorId: string;
  userId: string;
  mentorName: string;
  specializations: MentorSpecialization[];
  experience: MentorExperience;
  mentorshipStyle: MentorshipStyle;
  culturalWisdom: CulturalWisdom[];
  
  // Recognition & Impact
  recognitions: MentorRecognition[];
  appreciations: MentorAppreciation[];
  achievements: MentorAchievement[];
  impactMetrics: MentorImpactMetrics;
  
  // Community Standing
  mentorRating: number; // 0-5
  totalMentees: number;
  successStories: MentorSuccessStory[];
  testimonials: MentorTestimonial[];
  
  // Availability & Preferences
  availability: MentorAvailability;
  mentoringPreferences: MentoringPreferences;
  culturalConsiderations: CulturalConsideration[];
  
  // Growth & Development
  mentorGrowthJourney: MentorGrowthJourney;
  continuousLearning: ContinuousLearning[];
  peerRecognition: PeerRecognition[];
  
  isActive: boolean;
  joinedAt: Date;
  lastActiveDate: Date;
}

interface MentorRecognition {
  recognitionId: string;
  type: 'wisdom_sharing' | 'patient_guidance' | 'breakthrough_facilitation' | 'cultural_bridge' | 'emotional_support' | 'skill_development' | 'life_transformation';
  fromMenteeId: string;
  fromMenteeName: string;
  toMentorId: string;
  
  // Recognition Content
  title: string;
  message: string;
  specificImpacts: string[];
  growthFacilitated: GrowthFacilitated[];
  
  // Context & Journey
  mentorshipContext: MentorshipContext;
  journeyStage: 'initial_guidance' | 'skill_building' | 'breakthrough_moment' | 'transformation' | 'independence';
  timeframeCovered: TimeframeCovered;
  
  // Cultural & Personal Elements
  culturalAppreciation: CulturalAppreciation;
  personalizedGratitude: PersonalizedGratitude;
  wisdomAcknowledged: WisdomAcknowledged[];
  
  // Visibility & Sharing
  visibility: 'private' | 'mentor_circle' | 'community' | 'public';
  isAnonymous: boolean;
  allowSharing: boolean;
  
  // Impact & Inspiration
  inspirationLevel: number; // 0-1
  communityResonance: number; // 0-1
  mentoringInspiration: number; // 0-1
  
  // Interaction & Response
  mentorResponse?: MentorResponse;
  communityReactions: CommunityReaction[];
  sharingChain: RecognitionSharingChain[];
  
  createdAt: Date;
  celebrationStatus: 'pending' | 'celebrated' | 'featured';
}

interface MentorAppreciation {
  appreciationId: string;
  type: 'milestone_gratitude' | 'journey_completion' | 'wisdom_legacy' | 'cultural_honor' | 'life_impact' | 'ongoing_support';
  fromMenteeId: string;
  fromMenteeName: string;
  toMentorId: string;
  
  // Appreciation Content
  appreciationMessage: string;
  specificMoments: SpecificMoment[];
  transformationStory: TransformationStory;
  lessonsLearned: LessonLearned[];
  
  // Mentor Impact
  mentorQualities: MentorQuality[];
  guidanceProvided: GuidanceProvided[];
  supportOffered: SupportOffered[];
  wisdomShared: WisdomShared[];
  
  // Cultural & Ceremonial
  culturalCeremony: CulturalCeremony;
  traditionalHonors: TraditionalHonor[];
  symbolicGestures: SymbolicGesture[];
  
  // Legacy & Future
  ongoingImpact: OngoingImpact;
  futureCommitment: FutureCommitment;
  mentorshipLegacy: MentorshipLegacy;
  
  // Sharing & Recognition
  publicAppreciation: boolean;
  communitySharing: boolean;
  professionalEndorsement: boolean;
  
  expressedAt: Date;
  ceremonyDate?: Date;
}

interface MentorAchievement {
  achievementId: string;
  type: 'mentoring_milestone' | 'impact_achievement' | 'wisdom_recognition' | 'community_service' | 'cultural_bridge' | 'transformation_catalyst';
  title: string;
  description: string;
  
  // Achievement Criteria
  criteria: AchievementCriteria[];
  evidenceRequired: Evidence[];
  validationMethod: 'peer_review' | 'mentee_validation' | 'community_recognition' | 'impact_metrics';
  
  // Recognition Details
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  rarity: number; // 0-1
  significance: 'local' | 'community' | 'cultural' | 'global';
  
  // Impact & Legacy
  menteesImpacted: number;
  transformationsEnabled: number;
  communityContribution: CommunityContribution;
  culturalImpact: CulturalImpact;
  
  // Rewards & Recognition
  rewards: MentorReward[];
  privileges: MentorPrivilege[];
  ceremonialHonors: CeremonialHonor[];
  
  // Status & Timeline
  progress: number; // 0-1
  earnedAt?: Date;
  celebrationCompleted: boolean;
  legacyDocumented: boolean;
}

interface MentorshipRelationship {
  relationshipId: string;
  mentorId: string;
  menteeId: string;
  
  // Relationship Details
  mentorshipType: 'formal' | 'informal' | 'peer' | 'cultural' | 'skill_specific' | 'life_guidance';
  focusAreas: FocusArea[];
  goals: MentorshipGoal[];
  
  // Progress & Milestones
  currentPhase: 'initiation' | 'building_trust' | 'active_guidance' | 'independence_building' | 'completion' | 'ongoing_support';
  milestones: MentorshipMilestone[];
  progressMetrics: ProgressMetric[];
  
  // Cultural & Personal
  culturalDynamics: CulturalDynamics;
  communicationStyle: CommunicationStyle;
  personalizedApproach: PersonalizedApproach;
  
  // Recognition & Growth
  mutualRecognition: MutualRecognition[];
  growthDocumentation: GrowthDocumentation[];
  successMetrics: SuccessMetric[];
  
  startDate: Date;
  expectedDuration?: number; // months
  lastInteraction: Date;
  status: 'active' | 'paused' | 'completed' | 'transitioned';
}

interface MentorshipMilestone {
  milestoneId: string;
  relationshipId: string;
  type: 'trust_established' | 'first_breakthrough' | 'skill_mastery' | 'confidence_building' | 'independence_achieved' | 'wisdom_transferred' | 'legacy_created';
  
  // Milestone Details
  title: string;
  description: string;
  significance: 'minor' | 'moderate' | 'major' | 'transformational';
  
  // Recognition Elements
  celebration: MilestoneCelebration;
  appreciation: MilestoneAppreciation;
  documentation: MilestoneDocumentation;
  
  // Cultural & Personal
  culturalSignificance: CulturalSignificance;
  personalMeaning: PersonalMeaning;
  wisdomCapture: WisdomCapture;
  
  // Impact & Legacy
  impactOnMentee: ImpactOnMentee;
  impactOnMentor: ImpactOnMentor;
  communityImpact: CommunityImpact;
  
  // Timeline & Status
  achievedAt?: Date;
  celebrationDate?: Date;
  recognitionCompleted: boolean;
  legacyPreserved: boolean;
}

interface MentorImpactMetrics {
  totalMentees: number;
  activeMentorships: number;
  completedMentorships: number;
  
  // Impact Measurements
  menteesTransformed: number;
  skillsImparted: number;
  breakthroughsFacilitated: number;
  goalsAchievedByMentees: number;
  
  // Recognition Metrics
  appreciationsReceived: number;
  testimonialCount: number;
  communityRecognitions: number;
  peerEndorsements: number;
  
  // Engagement & Quality
  averageRating: number; // 0-5
  retentionRate: number; // 0-1
  successRate: number; // 0-1
  satisfactionScore: number; // 0-1
  
  // Cultural & Community
  culturalBridging: number;
  communityService: number;
  wisdomSharing: number;
  nextGenerationMentors: number;
  
  lastUpdated: Date;
}

const MentorRecognitionSystems: React.FC<MentorRecognitionSystemsProps> = ({
  userId,
  identityProfile,
  emotionalEntries,
  careerProfile,
  culturalContext,
  gamificationProfile,
  isMentor = false,
  activeMentorships = [],
  onMentorRecognitionGiven,
  onMentorshipMilestoneReached,
  onMentorAppreciationShared
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'recognition_dashboard' | 'give_recognition' | 'mentor_appreciation' | 'mentorship_milestones' | 'mentor_hall_of_fame'>('recognition_dashboard');
  const [mentorProfiles, setMentorProfiles] = useState<MentorProfile[]>([]);
  const [myMentorRecognitions, setMyMentorRecognitions] = useState<MentorRecognition[]>([]);
  const [receivedAppreciations, setReceivedAppreciations] = useState<MentorAppreciation[]>([]);
  const [mentorshipMilestones, setMentorshipMilestones] = useState<MentorshipMilestone[]>([]);
  const [communityMentors, setCommunityMentors] = useState<MentorProfile[]>([]);
  const [recognitionDraft, setRecognitionDraft] = useState<MentorRecognitionDraft | null>(null);
  const [appreciationDraft, setAppreciationDraft] = useState<MentorAppreciationDraft | null>(null);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [showAppreciationModal, setShowAppreciationModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [mentorshipStats, setMentorshipStats] = useState<MentorshipStatistics | null>(null);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const recognitionRef = useRef<HTMLDivElement>(null);

  // Initialize mentor recognition systems
  useEffect(() => {
    loadMentorRecognitionData();
  }, [userId, activeMentorships, culturalContext]);

  const loadMentorRecognitionData = async () => {
    try {
      setIsLoading(true);

      // Load mentor profiles
      const mentors = await loadCommunityMentors(userId, culturalContext);
      setCommunityMentors(mentors);

      // Load user's mentor recognitions
      const recognitions = await loadUserMentorRecognitions(userId);
      setMyMentorRecognitions(recognitions);

      // Load received appreciations (if user is a mentor)
      if (isMentor) {
        const appreciations = await loadReceivedMentorAppreciations(userId);
        setReceivedAppreciations(appreciations);
      }

      // Load mentorship milestones
      const milestones = await loadMentorshipMilestones(activeMentorships);
      setMentorshipMilestones(milestones);

      // Load mentorship statistics
      const stats = await generateMentorshipStatistics(userId, recognitions, appreciations, milestones);
      setMentorshipStats(stats);

      // Load Hall of Fame
      const fame = await loadMentorHallOfFame(culturalContext);
      setHallOfFame(fame);

    } catch (error) {
      console.error('Error loading mentor recognition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Give mentor recognition
  const giveMentorRecognition = useCallback(async (draft: MentorRecognitionDraft) => {
    try {
      const recognition = await createMentorRecognition(draft, userId, culturalContext);
      setMyMentorRecognitions(prev => [...prev, recognition]);
      setRecognitionDraft(null);
      setShowRecognitionModal(false);
      onMentorRecognitionGiven?.(recognition);

    } catch (error) {
      console.error('Error giving mentor recognition:', error);
    }
  }, [userId, culturalContext, onMentorRecognitionGiven]);

  // Share mentor appreciation
  const shareMentorAppreciation = useCallback(async (draft: MentorAppreciationDraft) => {
    try {
      const appreciation = await createMentorAppreciation(draft, userId, culturalContext);
      setReceivedAppreciations(prev => [...prev, appreciation]);
      setAppreciationDraft(null);
      setShowAppreciationModal(false);
      onMentorAppreciationShared?.(appreciation);

    } catch (error) {
      console.error('Error sharing mentor appreciation:', error);
    }
  }, [userId, culturalContext, onMentorAppreciationShared]);

  // Render recognition dashboard
  const renderRecognitionDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Mentorship overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌟</div>
              <div>
                <div className="text-2xl font-bold">{myMentorRecognitions.length}</div>
                <div className="text-sm opacity-80">Recognitions Given</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">💚</div>
              <div>
                <div className="text-2xl font-bold">{receivedAppreciations.length}</div>
                <div className="text-sm opacity-80">Appreciations Received</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="text-2xl font-bold">{mentorshipMilestones.filter(m => m.achievedAt).length}</div>
                <div className="text-sm opacity-80">Milestones Reached</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🤝</div>
              <div>
                <div className="text-2xl font-bold">{activeMentorships.length}</div>
                <div className="text-sm opacity-80">Active Mentorships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-800">Honor Your Mentors</h3>
              <p className="text-purple-700">Express gratitude and recognize the wisdom that has guided your journey</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setRecognitionDraft({
                  type: 'wisdom_sharing',
                  toMentorId: '',
                  title: '',
                  message: '',
                  specificImpacts: [],
                  visibility: 'community',
                  isAnonymous: false
                });
                setShowRecognitionModal(true);
              }}
              className="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🙏</div>
                <h4 className="font-medium text-gray-800 mb-1">Give Recognition</h4>
                <p className="text-sm text-gray-600">Acknowledge specific guidance and wisdom</p>
              </div>
            </button>

            <button
              onClick={() => {
                setAppreciationDraft({
                  type: 'milestone_gratitude',
                  toMentorId: '',
                  appreciationMessage: '',
                  transformationStory: { narrative: '', keyThemes: [], impactAreas: [] },
                  publicAppreciation: true
                });
                setShowAppreciationModal(true);
              }}
              className="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💝</div>
                <h4 className="font-medium text-gray-800 mb-1">Share Appreciation</h4>
                <p className="text-sm text-gray-600">Express deep gratitude for transformation</p>
              </div>
            </button>

            <button className="p-4 bg-white rounded-lg border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-medium text-gray-800 mb-1">Nominate for Honor</h4>
                <p className="text-sm text-gray-600">Nominate mentor for community recognition</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent recognitions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Mentor Recognitions</h3>
          <div className="space-y-4">
            {myMentorRecognitions
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 5)
              .map((recognition) => (
                <div key={recognition.recognitionId} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{recognition.title}</h4>
                      <div className="text-sm text-gray-600">
                        To: {getCommunityMentorName(recognition.toMentorId, communityMentors)} • 
                        {recognition.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{recognition.createdAt.toLocaleDateString()}</div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-3">{recognition.message}</p>
                  
                  {recognition.specificImpacts.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-600">Specific Impacts:</div>
                      {recognition.specificImpacts.slice(0, 2).map((impact, index) => (
                        <div key={index} className="text-xs text-blue-600">• {impact}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Mentor appreciation received (if user is a mentor) */}
        {isMentor && receivedAppreciations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💚 Appreciation You've Received</h3>
            <div className="space-y-4">
              {receivedAppreciations
                .sort((a, b) => b.expressedAt.getTime() - a.expressedAt.getTime())
                .slice(0, 3)
                .map((appreciation) => (
                  <div key={appreciation.appreciationId} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-green-800">
                          From: {appreciation.fromMenteeName}
                        </h4>
                        <div className="text-sm text-green-600 capitalize">
                          {appreciation.type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-sm text-green-600">
                        {appreciation.expressedAt.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-green-700 text-sm mb-3">"{appreciation.appreciationMessage}"</p>
                    
                    {appreciation.mentorQualities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {appreciation.mentorQualities.slice(0, 3).map((quality, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {quality.qualityName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Mentorship milestones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Mentorship Milestones</h3>
          <div className="space-y-4">
            {mentorshipMilestones
              .filter(m => m.achievedAt)
              .sort((a, b) => (b.achievedAt?.getTime() || 0) - (a.achievedAt?.getTime() || 0))
              .slice(0, 5)
              .map((milestone) => (
                <div key={milestone.milestoneId} className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">
                      {milestone.type === 'trust_established' ? '🤝' :
                       milestone.type === 'first_breakthrough' ? '💡' :
                       milestone.type === 'skill_mastery' ? '🎓' :
                       milestone.type === 'confidence_building' ? '💪' :
                       milestone.type === 'independence_achieved' ? '🚀' :
                       milestone.type === 'wisdom_transferred' ? '📚' : '👑'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">{milestone.title}</h4>
                    <p className="text-sm text-blue-700">{milestone.description}</p>
                    <div className="text-xs text-blue-600 mt-1">
                      {milestone.significance} • {milestone.achievedAt?.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg">🎉</div>
                    <div className="text-xs text-blue-600">Achieved</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Community mentor highlights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🌟 Community Mentor Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityMentors
              .sort((a, b) => b.impactMetrics.averageRating - a.impactMetrics.averageRating)
              .slice(0, 6)
              .map((mentor) => (
                <div
                  key={mentor.mentorId}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedMentor(mentor)}
                >
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-gray-800">{mentor.mentorName}</h4>
                    <div className="text-sm text-gray-600">
                      {mentor.specializations.slice(0, 2).map(s => s.name).join(', ')}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="text-yellow-600">
                        {'★'.repeat(Math.round(mentor.mentorRating))} {mentor.mentorRating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mentees:</span>
                      <span className="text-blue-600">{mentor.totalMentees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recognition:</span>
                      <span className="text-purple-600">{mentor.recognitions.length}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  // Render recognition modal
  const renderRecognitionModal = () => {
    if (!showRecognitionModal || !recognitionDraft) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Give Mentor Recognition</h3>
              <button
                onClick={() => setShowRecognitionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Recognition type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Recognition
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'wisdom_sharing', label: 'Wisdom Sharing', icon: '📚' },
                    { value: 'patient_guidance', label: 'Patient Guidance', icon: '🤲' },
                    { value: 'breakthrough_facilitation', label: 'Breakthrough Facilitation', icon: '💡' },
                    { value: 'cultural_bridge', label: 'Cultural Bridge', icon: '🌉' },
                    { value: 'emotional_support', label: 'Emotional Support', icon: '💚' },
                    { value: 'life_transformation', label: 'Life Transformation', icon: '✨' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="recognitionType"
                        value={type.value}
                        checked={recognitionDraft.type === type.value}
                        onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, type: e.target.value as any }))}
                        className="text-purple-600"
                      />
                      <span className="text-lg">{type.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mentor selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Mentor
                </label>
                <select
                  value={recognitionDraft.toMentorId}
                  onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, toMentorId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Choose a mentor to recognize...</option>
                  {communityMentors.map((mentor) => (
                    <option key={mentor.mentorId} value={mentor.mentorId}>
                      {mentor.mentorName} - {mentor.specializations[0]?.name || 'General Mentoring'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recognition title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognition Title
                </label>
                <input
                  type="text"
                  value={recognitionDraft.title}
                  onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, title: e.target.value }))}
                  placeholder="Give your recognition a meaningful title..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Recognition message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognition Message
                </label>
                <textarea
                  value={recognitionDraft.message}
                  onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, message: e.target.value }))}
                  placeholder="Share how this mentor has impacted your journey..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 min-h-32"
                />
              </div>

              {/* Specific impacts */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Impacts (Optional)
                </label>
                <div className="space-y-2">
                  {recognitionDraft.specificImpacts.map((impact, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={impact}
                        onChange={(e) => {
                          const newImpacts = [...recognitionDraft.specificImpacts];
                          newImpacts[index] = e.target.value;
                          setRecognitionDraft(prev => ({ ...prev!, specificImpacts: newImpacts }));
                        }}
                        placeholder="Describe a specific impact..."
                        className="flex-1 p-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => {
                          const newImpacts = recognitionDraft.specificImpacts.filter((_, i) => i !== index);
                          setRecognitionDraft(prev => ({ ...prev!, specificImpacts: newImpacts }));
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setRecognitionDraft(prev => ({
                        ...prev!,
                        specificImpacts: [...prev!.specificImpacts, '']
                      }));
                    }}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    + Add specific impact
                  </button>
                </div>
              </div>

              {/* Visibility settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recognition Visibility
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'private', label: 'Private - Only mentor and you' },
                    { value: 'mentor_circle', label: 'Mentor Circle - Mentoring community' },
                    { value: 'community', label: 'Community - All ALCHM members' },
                    { value: 'public', label: 'Public - Visible to everyone' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={recognitionDraft.visibility === option.value}
                        onChange={(e) => setRecognitionDraft(prev => ({ ...prev!, visibility: e.target.value as any }))}
                        className="text-purple-600"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowRecognitionModal(false)}
                  className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => giveMentorRecognition(recognitionDraft)}
                  disabled={!recognitionDraft.toMentorId || !recognitionDraft.title || !recognitionDraft.message}
                  className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  Give Recognition
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {renderRecognitionModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Mentor Recognition Systems
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Honor the wisdom, guidance, and transformation facilitated by mentors who 
            light the path for others' personal development journeys.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'recognition_dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'give_recognition', label: 'Give Recognition', icon: '🙏' },
              { id: 'mentor_appreciation', label: 'Appreciation', icon: '💝' },
              { id: 'mentorship_milestones', label: 'Milestones', icon: '🎯' },
              { id: 'mentor_hall_of_fame', label: 'Hall of Fame', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700'
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
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading mentor recognition systems...</p>
          </div>
        ) : (
          <>
            {activeTab === 'recognition_dashboard' && renderRecognitionDashboard()}
            {activeTab === 'give_recognition' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Mentor recognition interface would be integrated here</p>
              </div>
            )}
            {activeTab === 'mentor_appreciation' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Mentor appreciation system would be implemented here</p>
              </div>
            )}
            {activeTab === 'mentorship_milestones' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Mentorship milestones tracking would be implemented here</p>
              </div>
            )}
            {activeTab === 'mentor_hall_of_fame' && (
              <div className="text-center py-12">
                <p className="text-gray-600">Mentor Hall of Fame would be implemented here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getCommunityMentorName = (mentorId: string, mentors: MentorProfile[]): string => {
  const mentor = mentors.find(m => m.mentorId === mentorId);
  return mentor?.mentorName || 'Unknown Mentor';
};

// Supporting types
interface MentorRecognitionDraft {
  type: string;
  toMentorId: string;
  title: string;
  message: string;
  specificImpacts: string[];
  visibility: string;
  isAnonymous: boolean;
}

interface MentorAppreciationDraft {
  type: string;
  toMentorId: string;
  appreciationMessage: string;
  transformationStory: any;
  publicAppreciation: boolean;
}

interface MentorshipStatistics {
  totalRecognitionsGiven: number;
  appreciationsReceived: number;
  mentorshipMilestones: number;
  communityImpact: number;
}

interface HallOfFameEntry {
  mentorId: string;
  mentorName: string;
  achievements: string[];
  recognitionCount: number;
  impactScore: number;
}

// API functions (implementations would be expanded)
const loadCommunityMentors = async (
  userId: string,
  culturalContext: CulturalContext
): Promise<MentorProfile[]> => {
  // Implementation would load community mentors
  return [];
};

const loadUserMentorRecognitions = async (userId: string): Promise<MentorRecognition[]> => {
  // Implementation would load user's mentor recognitions
  return [];
};

const loadReceivedMentorAppreciations = async (userId: string): Promise<MentorAppreciation[]> => {
  // Implementation would load received appreciations
  return [];
};

const loadMentorshipMilestones = async (
  mentorships: MentorshipRelationship[]
): Promise<MentorshipMilestone[]> => {
  // Implementation would load mentorship milestones
  return [];
};

const generateMentorshipStatistics = async (
  userId: string,
  recognitions: MentorRecognition[],
  appreciations: MentorAppreciation[],
  milestones: MentorshipMilestone[]
): Promise<MentorshipStatistics> => {
  // Implementation would generate statistics
  return {
    totalRecognitionsGiven: 0,
    appreciationsReceived: 0,
    mentorshipMilestones: 0,
    communityImpact: 0
  };
};

const loadMentorHallOfFame = async (culturalContext: CulturalContext): Promise<HallOfFameEntry[]> => {
  // Implementation would load Hall of Fame
  return [];
};

const createMentorRecognition = async (
  draft: MentorRecognitionDraft,
  userId: string,
  culturalContext: CulturalContext
): Promise<MentorRecognition> => {
  // Implementation would create mentor recognition
  return {} as MentorRecognition;
};

const createMentorAppreciation = async (
  draft: MentorAppreciationDraft,
  userId: string,
  culturalContext: CulturalContext
): Promise<MentorAppreciation> => {
  // Implementation would create mentor appreciation
  return {} as MentorAppreciation;
};

export default MentorRecognitionSystems;