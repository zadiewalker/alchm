// ALCHM Identity Exploration Module
// Interactive identity mapping tools for personal, collective, cultural, and intersectional identity

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  IdentityExplorationProfile,
  PersonalIdentityMap,
  CollectiveIdentityMap,
  CulturalIdentityMap,
  IntersectionalIdentityMap,
  IdentityDevelopmentStage,
  CulturalCompetencyLevel,
  IdentityFacet,
  IdentityValue
} from '@/types/identity-pathway-schema';

interface IdentityExplorationProps {
  userId: string;
  profile: IdentityExplorationProfile;
  onProfileUpdate?: (profile: IdentityExplorationProfile) => void;
  onExplorationComplete?: (insights: ExplorationInsights) => void;
  culturalSafetyEnabled?: boolean;
  anonymousMode?: boolean;
}

interface ExplorationInsights {
  keyDiscoveries: KeyDiscovery[];
  identityStrengths: IdentityStrength[];
  growthAreas: IdentityGrowthArea[];
  intersectionalAwareness: IntersectionalAwareness[];
  culturalConnections: CulturalConnection[];
  nextSteps: IdentityNextStep[];
}

const IdentityExplorationModule: React.FC<IdentityExplorationProps> = ({
  userId,
  profile,
  onProfileUpdate,
  onExplorationComplete,
  culturalSafetyEnabled = true,
  anonymousMode = false
}) => {
  // State management
  const [activeMapping, setActiveMapping] = useState<'personal' | 'collective' | 'cultural' | 'intersectional'>('personal');
  const [explorationStage, setExplorationStage] = useState<'assessment' | 'mapping' | 'reflection' | 'integration'>('assessment');
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [reflectionResponses, setReflectionResponses] = useState<ReflectionResponse[]>([]);
  const [mappingProgress, setMappingProgress] = useState<MappingProgress>({
    personal: 0,
    collective: 0,
    cultural: 0,
    intersectional: 0
  });
  const [safetyCheck, setSafetyCheck] = useState(true);
  const [identityInsights, setIdentityInsights] = useState<IdentityInsight[]>([]);
  const [showPrivacyControls, setShowPrivacyControls] = useState(false);

  // Initialize exploration session
  useEffect(() => {
    initializeExplorationSession();
  }, []);

  const initializeExplorationSession = async () => {
    // Safety and consent check
    if (culturalSafetyEnabled) {
      await conductSafetyCheck();
    }
    
    // Assess current identity development stage
    const developmentStage = await assessIdentityDevelopmentStage(currentProfile);
    
    // Update profile with initial assessment
    const updatedProfile = {
      ...currentProfile,
      identityDevelopmentStage: developmentStage,
      explorationProgress: {
        ...currentProfile.explorationProgress,
        sessionStarted: new Date(),
        currentStage: explorationStage
      }
    };
    
    setCurrentProfile(updatedProfile);
    onProfileUpdate?.(updatedProfile);
  };

  // Conduct safety and consent check
  const conductSafetyCheck = async () => {
    // Implementation would show safety information and gather consent
    setSafetyCheck(true);
  };

  // Handle identity mapping selection
  const handleMappingSelection = useCallback((mappingType: typeof activeMapping) => {
    setActiveMapping(mappingType);
    setActiveExercise(null);
    
    // Update exploration progress
    const updatedProgress = {
      ...mappingProgress,
      currentMapping: mappingType,
      lastActivity: new Date()
    };
    setMappingProgress(updatedProgress);
  }, [mappingProgress]);

  // Handle reflection submission
  const handleReflectionSubmit = useCallback(async (response: ReflectionResponse) => {
    const updatedResponses = [...reflectionResponses, response];
    setReflectionResponses(updatedResponses);
    
    // Analyze response for insights
    const insights = await analyzeReflectionResponse(response, currentProfile);
    setIdentityInsights(prev => [...prev, ...insights]);
    
    // Update mapping progress
    const progressUpdate = calculateMappingProgress(activeMapping, updatedResponses);
    setMappingProgress(prev => ({
      ...prev,
      [activeMapping]: progressUpdate
    }));
    
    // Check if mapping is complete
    if (progressUpdate >= 0.8) {
      await completeMapping(activeMapping);
    }
  }, [reflectionResponses, currentProfile, activeMapping]);

  // Complete identity mapping
  const completeMapping = async (mappingType: typeof activeMapping) => {
    console.log(`Completing ${mappingType} identity mapping`);
    
    // Generate mapping insights
    const mappingInsights = await generateMappingInsights(mappingType, reflectionResponses);
    
    // Update profile with completed mapping
    const updatedProfile = await updateProfileWithMapping(
      currentProfile,
      mappingType,
      mappingInsights
    );
    
    setCurrentProfile(updatedProfile);
    onProfileUpdate?.(updatedProfile);
    
    // Move to next mapping or reflection stage
    const nextStage = determineNextStage(mappingType, mappingProgress);
    if (nextStage) {
      setActiveMapping(nextStage);
    } else {
      setExplorationStage('reflection');
    }
  };

  // Render safety and consent interface
  const renderSafetyInterface = () => {
    if (safetyCheck) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Identity Exploration Safety & Consent
            </h2>
            <p className="text-gray-600">
              Your safety and comfort are our highest priority
            </p>
          </div>

          <div className="space-y-4 mb-6 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">What to Expect</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Guided exploration of your personal, cultural, and social identities</li>
                <li>• Reflection exercises designed to promote self-awareness</li>
                <li>• Safe space to explore complex aspects of identity</li>
                <li>• Complete control over what you share and with whom</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Your Rights & Controls</h3>
              <ul className="space-y-1 text-yellow-700">
                <li>• Pause or stop the exploration at any time</li>
                <li>• Skip questions that feel uncomfortable</li>
                <li>• Control privacy settings for all responses</li>
                <li>• Access support resources if needed</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Cultural Safety Commitment</h3>
              <ul className="space-y-1 text-green-700">
                <li>• Culturally responsive and trauma-informed approach</li>
                <li>• Respect for all identities and experiences</li>
                <li>• No judgment or assumptions about your journey</li>
                <li>• Community guidelines that prioritize inclusion</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setSafetyCheck(true)}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              I understand and consent to begin
            </button>
            <button
              onClick={() => setShowPrivacyControls(true)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Privacy Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render mapping selection interface
  const renderMappingSelection = () => {
    const mappingOptions = [
      {
        type: 'personal' as const,
        title: 'Personal Identity',
        description: 'Explore your individual values, beliefs, and personal narrative',
        icon: '🧭',
        color: 'blue',
        progress: mappingProgress.personal
      },
      {
        type: 'collective' as const,
        title: 'Collective Identity',
        description: 'Examine group memberships, community connections, and social roles',
        icon: '👥',
        color: 'green',
        progress: mappingProgress.collective
      },
      {
        type: 'cultural' as const,
        title: 'Cultural Identity',
        description: 'Connect with cultural heritage, traditions, and cultural expression',
        icon: '🌍',
        color: 'purple',
        progress: mappingProgress.cultural
      },
      {
        type: 'intersectional' as const,
        title: 'Intersectional Identity',
        description: 'Understand how different aspects of identity intersect and interact',
        icon: '🔗',
        color: 'orange',
        progress: mappingProgress.intersectional
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Identity Exploration Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'll explore four dimensions of your identity through guided reflection and mapping exercises. 
            Take your time and remember you can pause anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mappingOptions.map((option) => (
            <div
              key={option.type}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                activeMapping === option.type
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleMappingSelection(option.type)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{option.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                {option.progress > 0 && (
                  <div className="text-right">
                    <div className={`text-sm font-medium text-${option.color}-600`}>
                      {Math.round(option.progress * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${option.color}-500 h-2 rounded-full transition-all`}
                  style={{ width: `${option.progress * 100}%` }}
                />
              </div>

              {option.progress >= 0.8 && (
                <div className="mt-3 flex items-center text-green-600 text-sm">
                  <span className="mr-1">✓</span>
                  Mapping Complete
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current mapping details */}
        {activeMapping && (
          <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {mappingOptions.find(o => o.type === activeMapping)?.title} Exploration
              </h3>
              <button
                onClick={() => setExplorationStage('mapping')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Begin Exploration
              </button>
            </div>
            
            <p className="text-gray-600">
              {mappingOptions.find(o => o.type === activeMapping)?.description}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render active mapping interface
  const renderMappingInterface = () => {
    const exercises = getExercisesForMapping(activeMapping);
    const currentExercise = exercises.find(e => e.id === activeExercise) || exercises[0];

    return (
      <div className="max-w-4xl mx-auto">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setExplorationStage('assessment')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span className="mr-2">←</span>
              Back to Overview
            </button>
            
            <div className="text-sm text-gray-500">
              Exercise {exercises.findIndex(e => e.id === activeExercise) + 1} of {exercises.length}
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{activeMapping.charAt(0).toUpperCase() + activeMapping.slice(1)} Identity</span>
            <span>{Math.round(mappingProgress[activeMapping] * 100)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${mappingProgress[activeMapping] * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {currentExercise.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentExercise.description}
            </p>
            
            {currentExercise.culturalNote && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-purple-600 text-lg mr-2">🌍</span>
                  <div>
                    <div className="font-medium text-purple-800 mb-1">Cultural Consideration</div>
                    <p className="text-purple-700 text-sm">{currentExercise.culturalNote}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exercise interface */}
          {renderExerciseInterface(currentExercise)}
        </div>

        {/* Exercise navigation */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => navigateExercise('previous')}
            disabled={exercises.findIndex(e => e.id === activeExercise) === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Exercise
          </button>

          <div className="flex space-x-2">
            {exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                onClick={() => setActiveExercise(exercise.id)}
                className={`w-3 h-3 rounded-full ${
                  exercise.id === activeExercise
                    ? 'bg-blue-500'
                    : exercise.completed
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => navigateExercise('next')}
            disabled={exercises.findIndex(e => e.id === activeExercise) === exercises.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Exercise
          </button>
        </div>

        {/* Safety controls */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <div className="flex justify-center space-x-4 text-sm">
            <button className="text-gray-600 hover:text-gray-800">
              💾 Save Progress
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              ⏸️ Pause Session
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              🛟 Need Support?
            </button>
            <button className="text-gray-600 hover:text-gray-800">
              🔒 Privacy Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render specific exercise interface
  const renderExerciseInterface = (exercise: IdentityExercise) => {
    switch (exercise.type) {
      case 'reflection':
        return renderReflectionExercise(exercise);
      case 'mapping':
        return renderMappingExercise(exercise);
      case 'values_exploration':
        return renderValuesExercise(exercise);
      case 'timeline':
        return renderTimelineExercise(exercise);
      case 'network_mapping':
        return renderNetworkMappingExercise(exercise);
      default:
        return renderDefaultExercise(exercise);
    }
  };

  // Render reflection exercise
  const renderReflectionExercise = (exercise: IdentityExercise) => {
    const [response, setResponse] = useState('');
    const [emotionalResonance, setEmotionalResonance] = useState(5);
    const [comfort, setComfort] = useState(5);

    const handleSubmit = () => {
      const reflectionResponse: ReflectionResponse = {
        responseId: `resp_${Date.now()}`,
        exerciseId: exercise.id,
        mappingType: activeMapping,
        response,
        emotionalResonance,
        comfort,
        timestamp: new Date(),
        insights: [],
        culturalContext: currentProfile.culturalIdentity?.culturalHeritage || []
      };

      handleReflectionSubmit(reflectionResponse);
      setResponse('');
      setEmotionalResonance(5);
      setComfort(5);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {exercise.prompts?.map((prompt, index) => (
            <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">{prompt}</p>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Reflection
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Take your time to reflect deeply on these questions. There are no right or wrong answers - only your authentic experience."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emotional Resonance: {emotionalResonance}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={emotionalResonance}
              onChange={(e) => setEmotionalResonance(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No connection</span>
              <span>Deep resonance</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comfort Level: {comfort}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={comfort}
              onChange={(e) => setComfort(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Uncomfortable</span>
              <span>Very comfortable</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button className="text-gray-600 hover:text-gray-800 text-sm">
            Skip this exercise
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Reflection
          </button>
        </div>
      </div>
    );
  };

  // Helper functions
  const getExercisesForMapping = (mappingType: typeof activeMapping): IdentityExercise[] => {
    const exerciseMap = {
      personal: [
        {
          id: 'personal_values',
          title: 'Core Values Exploration',
          description: 'Identify and explore your fundamental values and beliefs',
          type: 'values_exploration',
          prompts: [
            'What values guide your daily decisions?',
            'Where did these values come from?',
            'How do your values show up in your relationships and work?'
          ],
          culturalNote: 'Values can be deeply influenced by cultural background and family traditions.',
          completed: false
        },
        {
          id: 'personal_narrative',
          title: 'Personal Story Mapping',
          description: 'Explore the key experiences that have shaped who you are',
          type: 'timeline',
          prompts: [
            'What experiences have most shaped your sense of self?',
            'How has your self-perception evolved over time?',
            'What aspects of your identity feel most authentic to you?'
          ],
          completed: false
        }
      ],
      collective: [
        {
          id: 'group_memberships',
          title: 'Community Connections',
          description: 'Map your various group memberships and community roles',
          type: 'network_mapping',
          prompts: [
            'What groups, communities, or organizations do you belong to?',
            'How do these memberships influence your identity?',
            'Where do you feel the strongest sense of belonging?'
          ],
          completed: false
        }
      ],
      cultural: [
        {
          id: 'cultural_heritage',
          title: 'Cultural Heritage Exploration',
          description: 'Connect with your cultural background and traditions',
          type: 'reflection',
          prompts: [
            'What cultural traditions or practices are meaningful to you?',
            'How does your cultural background influence your worldview?',
            'What aspects of your culture do you want to preserve or share?'
          ],
          culturalNote: 'This exploration honors all cultural backgrounds, including mixed heritage and cultural adoption.',
          completed: false
        }
      ],
      intersectional: [
        {
          id: 'identity_intersections',
          title: 'Identity Intersections Analysis',
          description: 'Explore how different aspects of your identity interact',
          type: 'mapping',
          prompts: [
            'How do different aspects of your identity intersect?',
            'In what contexts do you emphasize different parts of your identity?',
            'What unique perspectives do your intersections provide?'
          ],
          completed: false
        }
      ]
    };

    return exerciseMap[mappingType] || [];
  };

  // More helper functions would be implemented here...
  const assessIdentityDevelopmentStage = async (profile: IdentityExplorationProfile): Promise<IdentityDevelopmentStage> => {
    // Implementation would assess current development stage
    return 'active_exploration';
  };

  const analyzeReflectionResponse = async (response: ReflectionResponse, profile: IdentityExplorationProfile): Promise<IdentityInsight[]> => {
    // Implementation would analyze response for insights
    return [];
  };

  const calculateMappingProgress = (mappingType: string, responses: ReflectionResponse[]): number => {
    // Implementation would calculate progress based on responses
    return responses.length * 0.2; // Simplified calculation
  };

  const generateMappingInsights = async (mappingType: string, responses: ReflectionResponse[]): Promise<MappingInsights> => {
    // Implementation would generate insights from completed mapping
    return { insights: [], themes: [], recommendations: [] };
  };

  const updateProfileWithMapping = async (profile: IdentityExplorationProfile, mappingType: string, insights: MappingInsights): Promise<IdentityExplorationProfile> => {
    // Implementation would update profile with mapping results
    return profile;
  };

  const determineNextStage = (mappingType: string, progress: MappingProgress): typeof activeMapping | null => {
    // Implementation would determine next mapping to focus on
    return null;
  };

  const navigateExercise = (direction: 'previous' | 'next') => {
    const exercises = getExercisesForMapping(activeMapping);
    const currentIndex = exercises.findIndex(e => e.id === activeExercise);
    
    if (direction === 'previous' && currentIndex > 0) {
      setActiveExercise(exercises[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < exercises.length - 1) {
      setActiveExercise(exercises[currentIndex + 1].id);
    }
  };

  const renderMappingExercise = (exercise: IdentityExercise) => {
    return <div>Mapping exercise interface</div>;
  };

  const renderValuesExercise = (exercise: IdentityExercise) => {
    return <div>Values exercise interface</div>;
  };

  const renderTimelineExercise = (exercise: IdentityExercise) => {
    return <div>Timeline exercise interface</div>;
  };

  const renderNetworkMappingExercise = (exercise: IdentityExercise) => {
    return <div>Network mapping exercise interface</div>;
  };

  const renderDefaultExercise = (exercise: IdentityExercise) => {
    return <div>Default exercise interface</div>;
  };

  // Main render
  if (!safetyCheck && culturalSafetyEnabled) {
    return renderSafetyInterface();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {explorationStage === 'assessment' && renderMappingSelection()}
        {explorationStage === 'mapping' && renderMappingInterface()}
        
        {/* Insights sidebar */}
        {identityInsights.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🌟 Your Identity Insights
            </h3>
            <div className="space-y-3">
              {identityInsights.slice(-3).map((insight, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded border border-blue-200">
                  <p className="text-gray-800 text-sm">{insight.insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Supporting interfaces
interface ReflectionResponse {
  responseId: string;
  exerciseId: string;
  mappingType: string;
  response: string;
  emotionalResonance: number;
  comfort: number;
  timestamp: Date;
  insights: string[];
  culturalContext: any[];
}

interface MappingProgress {
  personal: number;
  collective: number;
  cultural: number;
  intersectional: number;
  currentMapping?: string;
  lastActivity?: Date;
}

interface IdentityInsight {
  insight: string;
  confidence: number;
  type: string;
  mappingSource: string;
}

interface IdentityExercise {
  id: string;
  title: string;
  description: string;
  type: 'reflection' | 'mapping' | 'values_exploration' | 'timeline' | 'network_mapping';
  prompts?: string[];
  culturalNote?: string;
  completed: boolean;
}

interface MappingInsights {
  insights: string[];
  themes: string[];
  recommendations: string[];
}

export default IdentityExplorationModule;