/**
 * ALCHM Cultural Wellness Orchestrator
 * 
 * Philosophy: "True healing happens when technology meets you exactly where you are -
 * with all your cultures, all your identities, all your wisdom traditions honored."
 * 
 * This orchestrator integrates all cultural responsiveness features:
 * - Cultural analytics and engagement tracking
 * - Identity-affirming communication adaptation
 * - Intersectional badge recommendations  
 * - Crisis resources matched to cultural context
 * - Community-appropriate guided experiences
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/Chip';
import { useAuth } from '@/lib/useAuth';

// Import our cultural systems
import { 
  culturalEngagementAnalytics, 
  CulturalAnalyticsContext,
  CulturalEngagementMetrics
} from '@/lib/analytics/cultural-engagement-analytics';
import { 
  multiCulturalCommunication,
  CulturalCommunicationProfile,
  adaptMessageCulturally
} from '@/lib/multi-cultural-communication-engine';
import { 
  culturalBadgeManager,
  CulturalBadge
} from '@/lib/culturally-responsive-badges';
import { 
  culturalCrisisSafety,
  CulturalCrisisContext,
  CrisisSafetyPlan
} from '@/lib/cultural-crisis-safety-system';
import CulturalGuidedExperience from '@/components/onboarding/CulturalGuidedExperience';
import IntersectionalWellnessHub from '@/components/intersectional/IntersectionalWellnessHub';

interface CulturalWellnessState {
  isInitialized: boolean;
  culturalProfile?: CulturalAnalyticsContext;
  communicationProfile?: CulturalCommunicationProfile;
  engagementMetrics?: CulturalEngagementMetrics;
  relevantBadges: CulturalBadge[];
  safetyPlan?: CrisisSafetyPlan;
  currentExperience?: 'onboarding' | 'wellness_check' | 'crisis_support' | 'identity_exploration';
}

interface CulturalWellnessOrchestratorProps {
  children: React.ReactNode;
  userOnboardingData?: any;
  forceRecultural?: boolean; // Force re-evaluation of cultural context
}

export default function CulturalWellnessOrchestrator({ 
  children, 
  userOnboardingData,
  forceRecultural = false 
}: CulturalWellnessOrchestratorProps) {
  const { user } = useAuth();
  const [wellnessState, setWellnessState] = useState<CulturalWellnessState>({
    isInitialized: false,
    relevantBadges: []
  });
  const [showCulturalSetup, setShowCulturalSetup] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<string | null>(null);

  /**
   * Initialize cultural wellness system for user
   */
  const initializeCulturalWellness = useCallback(async () => {
    if (!user?.uid || wellnessState.isInitialized) return;

    try {
      // Create cultural analytics context from onboarding data
      const culturalProfile: CulturalAnalyticsContext = {
        userId: user.uid,
        culturalBackground: userOnboardingData?.culturalIdentities || [],
        lgbtqIdentity: userOnboardingData?.lgbtqIdentity,
        neurodivergent: userOnboardingData?.neurodivergent,
        immigrantStatus: userOnboardingData?.immigrationStatus,
        communityOrientation: userOnboardingData?.communityOrientation || 'balanced',
        healingApproaches: userOnboardingData?.healingApproaches || [],
        safetyNeeds: {
          familyAcceptance: userOnboardingData?.safetyNeeds?.familyAcceptance || 'unknown',
          needsPrivacyProtection: userOnboardingData?.safetyNeeds?.needsExtraPrivacy || false,
          culturalStigmaAwareness: userOnboardingData?.safetyNeeds?.mentalHealthStigma || false
        },
        communicationStyle: {
          directness: userOnboardingData?.preferredTone === 'direct' ? 0.8 : 0.5,
          storytelling: userOnboardingData?.healingApproaches?.includes('storytelling_narrative') ? 0.8 : 0.4,
          silence_comfort: userOnboardingData?.communicationStyle?.silenceComfort || 0.5,
          community_processing: userOnboardingData?.communityOrientation === 'collective' ? 0.8 : 0.3
        }
      };

      // Create communication profile
      const communicationProfile = await multiCulturalCommunication.createCommunicationProfile(
        user.uid,
        culturalProfile.culturalBackground,
        userOnboardingData?.communicationAssessment || {},
        userOnboardingData
      );

      // Get relevant cultural badges
      const relevantBadges = culturalBadgeManager.getRelevantBadges({
        culturalBackground: culturalProfile.culturalBackground,
        lgbtqIdentity: culturalProfile.lgbtqIdentity,
        neurodivergent: culturalProfile.neurodivergent,
        immigrant: culturalProfile.immigrantStatus !== undefined,
        ageGroup: 'adult',
        intersectionalIdentities: culturalProfile.culturalBackground
      });

      // Create safety plan if needed
      let safetyPlan: CrisisSafetyPlan | undefined;
      if (culturalProfile.safetyNeeds.needsPrivacyProtection || 
          culturalProfile.safetyNeeds.familyAcceptance === 'rejecting' ||
          culturalProfile.immigrantStatus === 'undocumented') {
        
        const crisisContext: CulturalCrisisContext = {
          userId: user.uid,
          culturalBackground: culturalProfile.culturalBackground,
          lgbtqIdentity: culturalProfile.lgbtqIdentity,
          neurodivergent: culturalProfile.neurodivergent,
          immigrationStatus: culturalProfile.immigrantStatus,
          safetyNeeds: {
            familyAcceptance: culturalProfile.safetyNeeds.familyAcceptance,
            communitySafety: 'safe', // Default, should be assessed
            needsPrivacyProtection: culturalProfile.safetyNeeds.needsPrivacyProtection,
            culturalStigmaAwareness: culturalProfile.safetyNeeds.culturalStigmaAwareness
          },
          preferredLanguage: userOnboardingData?.languagePreferences?.[0] || 'en',
          supportPreferences: {
            communityBased: culturalProfile.communityOrientation === 'collective',
            peerSupport: true,
            professionalSupport: true,
            traditionalHealing: culturalProfile.healingApproaches.includes('ritual_ceremonial'),
            faithBased: culturalProfile.healingApproaches.includes('spiritual_prayer')
          }
        };

        safetyPlan = await culturalCrisisSafety.createCulturalSafetyPlan(
          crisisContext,
          {
            personalWarnings: [],
            copingStrategies: culturalProfile.healingApproaches,
            supportNetwork: [],
            environmentalFactors: { homeIsSafe: true, workIsSafe: true, schoolIsSafe: true, communitySafety: true, alternativeSafeSpaces: [] }
          }
        );
      }

      setWellnessState({
        isInitialized: true,
        culturalProfile,
        communicationProfile,
        relevantBadges,
        safetyPlan
      });

    } catch (error) {
      console.error('Error initializing cultural wellness:', error);
      setWellnessState({
        isInitialized: true,
        relevantBadges: []
      });
    }
  }, [user?.uid, userOnboardingData, wellnessState.isInitialized]);

  /**
   * Analyze user engagement with cultural context
   */
  const analyzeCulturalEngagement = useCallback(async (
    journalEntries: string[],
    behaviorData: any
  ) => {
    if (!wellnessState.culturalProfile) return;

    try {
      const metrics = await culturalEngagementAnalytics.analyzeCulturalEngagement(
        user!.uid,
        wellnessState.culturalProfile,
        {
          avg_session_duration: behaviorData.avgSessionDuration || 15,
          entries_per_week: behaviorData.entriesPerWeek || 3,
          streak_data: behaviorData.streakData || { current_streak: 0 },
          entry_content: journalEntries
        }
      );

      const insights = await culturalEngagementAnalytics.generateCulturalInsights(
        metrics,
        wellnessState.culturalProfile
      );

      setWellnessState(prev => ({ 
        ...prev, 
        engagementMetrics: metrics 
      }));

      // Show a cultural insight if available
      if (insights.cultural_affirmations.length > 0) {
        setCurrentInsight(insights.cultural_affirmations[0]);
      }

    } catch (error) {
      console.error('Error analyzing cultural engagement:', error);
    }
  }, [wellnessState.culturalProfile, user]);

  /**
   * Adapt AI message for cultural context
   */
  const adaptAIMessage = useCallback(async (
    message: string,
    context: {
      messageType: 'support' | 'feedback' | 'guidance' | 'celebration' | 'challenge' | 'crisis_response';
      emotionalTone: 'gentle' | 'neutral' | 'encouraging' | 'direct' | 'celebratory' | 'urgent';
      culturalSensitivity: 'low' | 'medium' | 'high' | 'sacred';
      userEmotionalState: 'stable' | 'vulnerable' | 'celebrating' | 'struggling' | 'crisis';
    }
  ) => {
    if (!user?.uid) return message;

    try {
      const adaptedCommunication = await adaptMessageCulturally(
        user.uid,
        message,
        {
          ...context,
          topicSensitivity: [],
          communityRelevance: wellnessState.culturalProfile?.communityOrientation === 'collective' || false
        }
      );

      return adaptedCommunication.adaptedMessage;
    } catch (error) {
      console.error('Error adapting AI message:', error);
      return message;
    }
  }, [user?.uid, wellnessState.culturalProfile]);

  /**
   * Check for culturally-relevant badge awards
   */
  const checkCulturalBadges = useCallback(async (
    journalContent: string[],
    activityData: any
  ) => {
    if (!wellnessState.culturalProfile || !user?.uid) return [];

    try {
      // This would integrate with the badge service
      const eligibleBadges = [];
      
      for (const badge of wellnessState.relevantBadges) {
        const shouldAward = culturalBadgeManager.shouldAwardBadge(
          badge.id,
          journalContent.join(' '),
          wellnessState.culturalProfile,
          activityData
        );
        
        if (shouldAward) {
          eligibleBadges.push(badge.id);
        }
      }

      return eligibleBadges;
    } catch (error) {
      console.error('Error checking cultural badges:', error);
      return [];
    }
  }, [wellnessState.culturalProfile, wellnessState.relevantBadges, user]);

  /**
   * Assess crisis risk with cultural context
   */
  const assessCulturalCrisisRisk = useCallback((
    journalContent: string,
    behaviorPatterns: any
  ) => {
    if (!wellnessState.culturalProfile) return null;

    const crisisContext: CulturalCrisisContext = {
      userId: user!.uid,
      culturalBackground: wellnessState.culturalProfile.culturalBackground,
      lgbtqIdentity: wellnessState.culturalProfile.lgbtqIdentity,
      neurodivergent: wellnessState.culturalProfile.neurodivergent,
      immigrationStatus: wellnessState.culturalProfile.immigrantStatus,
      safetyNeeds: {
        familyAcceptance: wellnessState.culturalProfile.safetyNeeds.familyAcceptance,
        communitySafety: 'safe',
        needsPrivacyProtection: wellnessState.culturalProfile.safetyNeeds.needsPrivacyProtection,
        culturalStigmaAwareness: wellnessState.culturalProfile.safetyNeeds.culturalStigmaAwareness
      },
      preferredLanguage: 'en',
      supportPreferences: {
        communityBased: wellnessState.culturalProfile.communityOrientation === 'collective',
        peerSupport: true,
        professionalSupport: true,
        traditionalHealing: false,
        faithBased: false
      }
    };

    return culturalCrisisSafety.assessCulturalCrisisRisk(
      journalContent,
      crisisContext,
      behaviorPatterns
    );
  }, [wellnessState.culturalProfile, user]);

  // Initialize on mount and when onboarding data changes
  useEffect(() => {
    if (user?.uid && (userOnboardingData || forceRecultural)) {
      initializeCulturalWellness();
    }
  }, [user?.uid, userOnboardingData, forceRecultural, initializeCulturalWellness]);

  // Show cultural setup if not initialized or missing cultural data
  const needsCulturalSetup = !wellnessState.isInitialized || 
    !wellnessState.culturalProfile?.culturalBackground?.length;

  if (needsCulturalSetup && !showCulturalSetup && user?.uid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="text-6xl mb-6">🌍</div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Cultural Wellness Journey</h2>
          <p className="text-gray-600 mb-6">
            ALCHM honors all the identities and wisdom traditions you bring. 
            Let's set up your culturally-responsive experience.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setShowCulturalSetup(true)}
              className="w-full"
            >
              Begin Cultural Setup
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setWellnessState(prev => ({ ...prev, isInitialized: true }))}
              className="w-full"
            >
              Continue with Basic Setup
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showCulturalSetup) {
    return (
      <CulturalGuidedExperience
        userContext={{
          userId: user!.uid,
          culturalBackground: wellnessState.culturalProfile?.culturalBackground,
          healingPreferences: wellnessState.culturalProfile?.healingApproaches,
          languagePreference: 'en',
          communityOrientation: wellnessState.culturalProfile?.communityOrientation,
          traumaInformed: true
        }}
        experienceType="onboarding"
        onComplete={(results) => {
          // Update wellness state with results
          setShowCulturalSetup(false);
          initializeCulturalWellness();
        }}
      />
    );
  }

  // Provide cultural context to child components
  const culturalContext = {
    culturalProfile: wellnessState.culturalProfile,
    communicationProfile: wellnessState.communicationProfile,
    engagementMetrics: wellnessState.engagementMetrics,
    relevantBadges: wellnessState.relevantBadges,
    safetyPlan: wellnessState.safetyPlan,
    
    // Helper functions
    analyzeCulturalEngagement,
    adaptAIMessage,
    checkCulturalBadges,
    assessCulturalCrisisRisk
  };

  return (
    <div className="cultural-wellness-context">
      {/* Cultural Insight Banner */}
      {currentInsight && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <p className="font-medium">{currentInsight}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentInsight(null)}
              className="text-white border-white hover:bg-white hover:text-purple-500"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Cultural Identity Chips */}
      {wellnessState.culturalProfile?.culturalBackground && (
        <div className="bg-white border-b p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Your identities:</span>
              {wellnessState.culturalProfile.culturalBackground.map(identity => (
                <Chip key={identity} variant="purple" size="sm">
                  {identity.replace('_', ' ')}
                </Chip>
              ))}
              {wellnessState.culturalProfile.lgbtqIdentity && (
                <Chip variant="rainbow" size="sm">LGBTQ+</Chip>
              )}
              {wellnessState.culturalProfile.neurodivergent && (
                <Chip variant="blue" size="sm">Neurodivergent</Chip>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content with Cultural Context */}
      <div data-cultural-context={JSON.stringify(culturalContext)}>
        {children}
      </div>

      {/* Cultural Resources Quick Access (if safety plan exists) */}
      {wellnessState.safetyPlan && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => {
              // Show crisis resources modal
              console.log('Show cultural crisis resources', wellnessState.safetyPlan);
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            title="Cultural Crisis Resources"
          >
            🆘
          </Button>
        </div>
      )}
    </div>
  );
}