// ALCHM Coach Profile Manager Component
// Interface for managing and customizing adaptive AI coach profiles

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CoachProfile,
  UserCoachingPreferences,
  AdaptiveCoachingSession,
  CoachingContext
} from '@/types/ai-personalization-schema';

interface CoachProfileManagerProps {
  userId: string;
  currentCoachProfile?: CoachProfile;
  userPreferences: UserCoachingPreferences;
  recentSessions: AdaptiveCoachingSession[];
  onProfileUpdate?: (profile: CoachProfile) => void;
  onPreferencesUpdate?: (preferences: UserCoachingPreferences) => void;
  onTestCoach?: (profileId: string) => void;
}

interface CoachPreview {
  profileId: string;
  name: string;
  tone: CoachProfile['tone'];
  pacing: CoachProfile['pacing'];
  description: string;
  strengths: string[];
  bestFor: string[];
  sampleResponse: string;
  effectivenessScore: number;
  userRating?: number;
}

const CoachProfileManager: React.FC<CoachProfileManagerProps> = ({
  userId,
  currentCoachProfile,
  userPreferences,
  recentSessions,
  onProfileUpdate,
  onPreferencesUpdate,
  onTestCoach
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'profiles' | 'preferences' | 'analytics' | 'customize'>('profiles');
  const [availableProfiles, setAvailableProfiles] = useState<CoachPreview[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<CoachProfile | null>(currentCoachProfile || null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizations, setCustomizations] = useState<Partial<CoachProfile>>({});
  const [testingProfile, setTestingProfile] = useState<string | null>(null);
  const [coachingAnalytics, setCoachingAnalytics] = useState<{
    effectivenessRatings: { [profileId: string]: number };
    preferredTones: { tone: string; frequency: number }[];
    engagementLevels: { [profileId: string]: number };
    sessionOutcomes: { [profileId: string]: number };
  } | null>(null);

  // Initialize available coach profiles
  useEffect(() => {
    initializeCoachProfiles();
    loadCoachingAnalytics();
  }, [userId]);

  const initializeCoachProfiles = () => {
    const profiles: CoachPreview[] = [
      {
        profileId: 'mirror',
        name: 'Alex',
        tone: 'mirror',
        pacing: 'gentle',
        description: 'Reflective and empathetic guide who meets you where you are',
        strengths: ['Deep listening', 'Emotional awareness', 'Safe space creation', 'Gentle exploration'],
        bestFor: ['Emotional processing', 'Self-discovery', 'Stress relief', 'Mindfulness practice'],
        sampleResponse: `I hear that you're feeling overwhelmed right now. That sounds really challenging. Can you tell me more about what's contributing to this feeling? Sometimes just naming what we're experiencing can help us understand it better.`,
        effectivenessScore: 8.5,
        userRating: getUserRating('mirror')
      },
      {
        profileId: 'mentor',
        name: 'Jordan',
        tone: 'mentor',
        pacing: 'gentle',
        description: 'Wise and supportive mentor with practical guidance',
        strengths: ['Goal setting', 'Skill building', 'Accountability', 'Strategic thinking'],
        bestFor: ['Career development', 'Goal achievement', 'Skill learning', 'Problem solving'],
        sampleResponse: `Based on what you've shared, I can see you have a clear vision of where you want to go. Let's break this down into actionable steps. What's one specific thing you could do this week to move closer to your goal?`,
        effectivenessScore: 9.2,
        userRating: getUserRating('mentor')
      },
      {
        profileId: 'visionary',
        name: 'Phoenix',
        tone: 'visionary',
        pacing: 'challenging',
        description: 'Inspiring catalyst who helps you see new possibilities',
        strengths: ['Vision creation', 'Breakthrough thinking', 'Motivation', 'Transformation'],
        bestFor: ['Life transitions', 'Creative projects', 'Big decisions', 'Personal transformation'],
        sampleResponse: `I love the energy behind what you're describing! What if we took this even further? Imagine you had unlimited resources and support - what would the most amazing version of this look like? Let's dream big first, then figure out how to make it happen.`,
        effectivenessScore: 8.8,
        userRating: getUserRating('visionary')
      }
    ];

    setAvailableProfiles(profiles);
  };

  const getUserRating = (profileId: string): number | undefined => {
    const sessions = recentSessions.filter(s => s.coachProfile.coachId === profileId);
    if (sessions.length === 0) return undefined;
    
    const ratings = sessions
      .map(s => s.userFeedback.rating)
      .filter(r => r !== null && r !== undefined) as number[];
    
    if (ratings.length === 0) return undefined;
    
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const loadCoachingAnalytics = () => {
    // In real implementation, load from API/database
    const analytics = {
      effectivenessRatings: {
        'mirror': 8.5,
        'mentor': 9.2,
        'visionary': 8.8
      },
      preferredTones: [
        { tone: 'mentor', frequency: 45 },
        { tone: 'mirror', frequency: 35 },
        { tone: 'visionary', frequency: 20 }
      ],
      engagementLevels: {
        'mirror': 8.2,
        'mentor': 8.0,
        'visionary': 9.0
      },
      sessionOutcomes: {
        'mirror': 7.8,
        'mentor': 8.5,
        'visionary': 8.2
      }
    };
    
    setCoachingAnalytics(analytics);
  };

  // Handle profile selection
  const handleProfileSelect = useCallback((profile: CoachPreview) => {
    const fullProfile: CoachProfile = {
      coachId: profile.profileId,
      name: profile.name,
      role: getCoachRole(profile.tone),
      tone: profile.tone,
      pacing: profile.pacing,
      preferredLanguage: userPreferences.preferredLanguage,
      communicationStyle: getDefaultCommunicationStyle(profile.tone),
      questioningApproach: getDefaultQuestioningApproach(profile.tone),
      feedbackStyle: getDefaultFeedbackStyle(profile.tone),
      motivationalStyle: getDefaultMotivationalStyle(profile.tone),
      adaptationRules: [],
      contextualAdjustments: [],
      culturalCompetencies: [],
      expertise: getDefaultExpertise(profile.tone),
      coachingMethods: [],
      interventionPreferences: getDefaultInterventionPreferences(profile.tone),
      learningModel: getDefaultLearningModel(profile.tone),
      adaptationHistory: [],
      effectivenessMetrics: {
        overallRating: profile.effectivenessScore / 10,
        userSatisfaction: (profile.userRating || profile.effectivenessScore) / 10,
        goalAchievementRate: 0.8,
        engagementRate: 0.8,
        culturalCompetencyScore: 0.85,
        adaptationEffectiveness: 0.8,
        lastUpdated: new Date()
      },
      languageProfiles: [],
      culturalFrameworks: [],
      localizationRules: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
      version: '1.0'
    };
    
    setSelectedProfile(fullProfile);
    onProfileUpdate?.(fullProfile);
  }, [userPreferences, onProfileUpdate]);

  // Handle preference updates
  const handlePreferenceUpdate = useCallback((
    key: keyof UserCoachingPreferences,
    value: any
  ) => {
    const updatedPreferences = {
      ...userPreferences,
      [key]: value
    };
    onPreferencesUpdate?.(updatedPreferences);
  }, [userPreferences, onPreferencesUpdate]);

  // Handle coach testing
  const handleTestCoach = async (profileId: string) => {
    setTestingProfile(profileId);
    onTestCoach?.(profileId);
    
    // Simulate testing delay
    setTimeout(() => {
      setTestingProfile(null);
    }, 3000);
  };

  // Get coach role based on tone
  const getCoachRole = (tone: CoachProfile['tone']): string => {
    const roles = {
      'mirror': 'Reflective Guide',
      'mentor': 'Wise Mentor',
      'visionary': 'Visionary Catalyst'
    };
    return roles[tone];
  };

  // Helper functions for default configurations
  const getDefaultCommunicationStyle = (tone: CoachProfile['tone']) => {
    const styles = {
      'mirror': {
        formality: 'warm' as const,
        directness: 'gentle' as const,
        supportiveness: 'empathetic' as const,
        culturalSensitivity: 'high' as const
      },
      'mentor': {
        formality: 'professional' as const,
        directness: 'direct' as const,
        supportiveness: 'encouraging' as const,
        culturalSensitivity: 'high' as const
      },
      'visionary': {
        formality: 'casual' as const,
        directness: 'direct' as const,
        supportiveness: 'challenging' as const,
        culturalSensitivity: 'adaptive' as const
      }
    };
    return styles[tone];
  };

  const getDefaultQuestioningApproach = (tone: CoachProfile['tone']) => {
    const approaches = {
      'mirror': {
        questionTypes: ['open_ended', 'clarifying', 'reflective'] as const,
        questionDepth: 'deep' as const,
        questionTiming: 'reflective' as const,
        culturalAdaptation: true
      },
      'mentor': {
        questionTypes: ['probing', 'clarifying', 'scaling'] as const,
        questionDepth: 'moderate' as const,
        questionTiming: 'strategic' as const,
        culturalAdaptation: true
      },
      'visionary': {
        questionTypes: ['hypothetical', 'open_ended', 'probing'] as const,
        questionDepth: 'transformational' as const,
        questionTiming: 'strategic' as const,
        culturalAdaptation: true
      }
    };
    return approaches[tone];
  };

  const getDefaultFeedbackStyle = (tone: CoachProfile['tone']) => {
    const styles = {
      'mirror': {
        timing: 'delayed' as const,
        specificity: 'specific' as const,
        emotionalTone: 'reflective' as const,
        culturalFraming: true
      },
      'mentor': {
        timing: 'immediate' as const,
        specificity: 'detailed' as const,
        emotionalTone: 'constructive' as const,
        culturalFraming: true
      },
      'visionary': {
        timing: 'immediate' as const,
        specificity: 'general' as const,
        emotionalTone: 'motivational' as const,
        culturalFraming: true
      }
    };
    return styles[tone];
  };

  const getDefaultMotivationalStyle = (tone: CoachProfile['tone']) => {
    const styles = {
      'mirror': {
        approach: 'intrinsic' as const,
        intensity: 'gentle' as const,
        focusAreas: ['growth', 'meaning', 'connection'] as const,
        culturalMotivators: []
      },
      'mentor': {
        approach: 'mixed' as const,
        intensity: 'moderate' as const,
        focusAreas: ['achievement', 'growth', 'mastery'] as const,
        culturalMotivators: []
      },
      'visionary': {
        approach: 'intrinsic' as const,
        intensity: 'high_energy' as const,
        focusAreas: ['achievement', 'meaning', 'mastery'] as const,
        culturalMotivators: []
      }
    };
    return styles[tone];
  };

  const getDefaultExpertise = (tone: CoachProfile['tone']) => {
    const expertise = {
      'mirror': [{
        area: 'emotional_wellness' as const,
        level: 'expert' as const,
        methodologies: ['reflective_listening', 'mindfulness', 'somatic_awareness'],
        certifications: []
      }],
      'mentor': [{
        area: 'goal_achievement' as const,
        level: 'expert' as const,
        methodologies: ['goal_setting', 'accountability', 'skill_building'],
        certifications: []
      }],
      'visionary': [{
        area: 'life_transitions' as const,
        level: 'expert' as const,
        methodologies: ['visioning', 'breakthrough_coaching', 'transformation'],
        certifications: []
      }]
    };
    return expertise[tone];
  };

  const getDefaultInterventionPreferences = (tone: CoachProfile['tone']) => {
    const preferences = {
      'mirror': [{
        interventionType: 'reflection' as const,
        preference: 0.9,
        contextualFactors: []
      }],
      'mentor': [{
        interventionType: 'skill_building' as const,
        preference: 0.8,
        contextualFactors: []
      }],
      'visionary': [{
        interventionType: 'mindset_shift' as const,
        preference: 0.9,
        contextualFactors: []
      }]
    };
    return preferences[tone];
  };

  const getDefaultLearningModel = (tone: CoachProfile['tone']) => {
    const models = {
      'mirror': {
        learningRate: 0.7,
        adaptationSpeed: 'moderate' as const,
        feedbackSensitivity: 0.8,
        memoryRetention: 0.9,
        transferLearning: true
      },
      'mentor': {
        learningRate: 0.8,
        adaptationSpeed: 'fast' as const,
        feedbackSensitivity: 0.7,
        memoryRetention: 0.85,
        transferLearning: true
      },
      'visionary': {
        learningRate: 0.9,
        adaptationSpeed: 'fast' as const,
        feedbackSensitivity: 0.6,
        memoryRetention: 0.8,
        transferLearning: true
      }
    };
    return models[tone];
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          AI Coach Management
        </h2>
        <p className="text-gray-600">
          Customize your AI coaching experience with adaptive coach profiles
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200 overflow-x-auto">
        {['profiles', 'preferences', 'analytics', 'customize'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'profiles' && 'Coach Profiles'}
            {tab === 'preferences' && 'Your Preferences'}
            {tab === 'analytics' && 'Performance Analytics'}
            {tab === 'customize' && 'Customize Coach'}
          </button>
        ))}
      </div>

      {/* Coach Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Available Coach Profiles
            </h3>
            <p className="text-gray-600 text-sm">
              Each coach has a unique personality and coaching style. Try different coaches to find your perfect match.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {availableProfiles.map((profile) => (
              <div 
                key={profile.profileId}
                className={`p-6 border rounded-lg transition-colors cursor-pointer ${
                  selectedProfile?.coachId === profile.profileId
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleProfileSelect(profile)}
              >
                {/* Coach Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{profile.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded ${
                        profile.tone === 'mirror' ? 'bg-blue-100 text-blue-800' :
                        profile.tone === 'mentor' ? 'bg-green-100 text-green-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {profile.tone}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        profile.pacing === 'gentle' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {profile.pacing}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {profile.effectivenessScore}/10
                    </div>
                    <div className="text-xs text-gray-500">effectiveness</div>
                    {profile.userRating && (
                      <div className="text-xs text-gray-600 mt-1">
                        Your rating: {profile.userRating.toFixed(1)}/10
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4">{profile.description}</p>

                {/* Strengths */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Strengths:</h5>
                  <div className="flex flex-wrap gap-1">
                    {profile.strengths.map((strength) => (
                      <span 
                        key={strength}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Best for:</h5>
                  <div className="flex flex-wrap gap-1">
                    {profile.bestFor.map((use) => (
                      <span 
                        key={use}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Response */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Sample Response:</h5>
                  <div className="p-3 bg-gray-50 rounded text-sm text-gray-700 italic">
                    "{profile.sampleResponse}"
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileSelect(profile);
                    }}
                    className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                      selectedProfile?.coachId === profile.profileId
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {selectedProfile?.coachId === profile.profileId ? 'Selected' : 'Select'}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestCoach(profile.profileId);
                    }}
                    disabled={testingProfile === profile.profileId}
                    className="px-4 py-2 border border-purple-300 text-purple-700 rounded font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
                  >
                    {testingProfile === profile.profileId ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Your Coaching Preferences</h3>
          
          {/* Tone Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Coaching Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['mirror', 'mentor', 'visionary', 'adaptive'] as const).map((tone) => (
                <button
                  key={tone}
                  onClick={() => handlePreferenceUpdate('preferredTone', tone)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    userPreferences.preferredTone === tone
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Adaptive mode automatically adjusts tone based on your current state
            </p>
          </div>

          {/* Pacing Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Coaching Pacing
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['gentle', 'challenging', 'adaptive'] as const).map((pacing) => (
                <button
                  key={pacing}
                  onClick={() => handlePreferenceUpdate('preferredPacing', pacing)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    userPreferences.preferredPacing === pacing
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pacing.charAt(0).toUpperCase() + pacing.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Language
            </label>
            <select
              value={userPreferences.preferredLanguage}
              onChange={(e) => handlePreferenceUpdate('preferredLanguage', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="sw">Kiswahili</option>
              <option value="pt">Português</option>
              <option value="ko">한국어</option>
              <option value="hi">हिन्दी</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Communication Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['direct', 'gentle', 'exploratory', 'supportive'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => handlePreferenceUpdate('communicationStyle', style)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    userPreferences.communicationStyle === style
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Depth Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Preferred Conversation Depth
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(['surface', 'moderate', 'deep', 'adaptive'] as const).map((depth) => (
                <button
                  key={depth}
                  onClick={() => handlePreferenceUpdate('preferredDepth', depth)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    userPreferences.preferredDepth === depth
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {depth.charAt(0).toUpperCase() + depth.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural Adaptation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cultural Adaptation Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['minimal', 'moderate', 'comprehensive'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handlePreferenceUpdate('culturalAdaptation', level)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    userPreferences.culturalAdaptation === level
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Higher levels incorporate more cultural context and considerations into coaching
            </p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && coachingAnalytics && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Coaching Performance Analytics</h3>
          
          {/* Effectiveness Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(coachingAnalytics.effectivenessRatings).map(([profileId, rating]) => {
              const profile = availableProfiles.find(p => p.profileId === profileId);
              return (
                <div key={profileId} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">{profile?.name || profileId}</h4>
                  <div className="text-2xl font-bold text-blue-900">{rating}/10</div>
                  <div className="text-sm text-blue-700">Effectiveness Rating</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Engagement: {coachingAnalytics.engagementLevels[profileId]}/10
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preferred Tones Chart */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Your Tone Preferences</h4>
            <div className="space-y-3">
              {coachingAnalytics.preferredTones.map((tone) => (
                <div key={tone.tone} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{tone.tone}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${tone.frequency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{tone.frequency}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Outcomes */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Session Outcomes</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(coachingAnalytics.sessionOutcomes).map(([profileId, outcome]) => {
                const profile = availableProfiles.find(p => p.profileId === profileId);
                return (
                  <div key={profileId} className="text-center">
                    <div className="text-lg font-bold text-gray-800">{outcome}/10</div>
                    <div className="text-sm text-gray-600">{profile?.name} Outcomes</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Sessions Summary */}
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">Recent Sessions</h4>
            <div className="space-y-3">
              {recentSessions.slice(0, 5).map((session) => (
                <div key={session.sessionId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-gray-800">{session.coachProfile.name}</div>
                    <div className="text-sm text-gray-600">
                      {session.sessionType.replace('_', ' ')} • {session.duration} min
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {session.userFeedback.rating ? `${session.userFeedback.rating}/10` : 'No rating'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customize Tab */}
      {activeTab === 'customize' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Customize Your Coach</h3>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Advanced Customization</h4>
            <p className="text-yellow-700 text-sm">
              Create a personalized coach profile that adapts to your unique preferences and needs. 
              This feature combines elements from different coach types to create your perfect coaching companion.
            </p>
          </div>

          {/* Coming Soon Placeholder */}
          <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-center">
            <h4 className="font-semibold text-gray-800 mb-4">Custom Coach Builder Coming Soon</h4>
            <p className="text-gray-600 mb-4">
              Advanced customization features will allow you to create a completely personalized AI coach 
              that learns and adapts to your unique communication style, goals, and preferences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div>• Custom personality blends</div>
              <div>• Adaptive learning preferences</div>
              <div>• Cultural customization</div>
              <div>• Communication style tuning</div>
              <div>• Goal-specific coaching modes</div>
              <div>• Contextual behavior rules</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachProfileManager;