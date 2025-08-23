// ALCHM Empathy Building Activities & Communication Tools
// Interactive empathy development with perspective-taking exercises and inclusive communication training

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  EmpathyBuildingSystem,
  PerspectiveTakingExercise,
  EmpathyBaseline,
  EmpathyType,
  InclusiveCommunication,
  CulturalImmersion,
  EmpathyPractice
} from '@/types/identity-pathway-schema';
import { BiasAwarenessEngine, EmpathyBuildingOpportunity } from '@/lib/bias-awareness-engine';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';

interface EmpathyBuildingProps {
  userId: string;
  empathySystem: EmpathyBuildingSystem;
  identityProfile: IdentityExplorationProfile;
  onEmpathyGrowth?: (growth: EmpathyGrowthEvent) => void;
  onSkillDevelopment?: (skills: CommunicationSkill[]) => void;
  culturalSafetyEnabled?: boolean;
}

interface EmpathyGrowthEvent {
  eventId: string;
  empathyType: string;
  growthMeasurement: number;
  exerciseCompleted: string;
  insights: EmpathyInsight[];
  timestamp: Date;
}

interface EmpathyInsight {
  insight: string;
  perspective: string;
  culturalContext?: string;
  applicationArea: string;
}

interface CommunicationSkill {
  skillId: string;
  name: string;
  level: number;
  description: string;
  practiceArea: string;
}

const EmpathyBuildingActivities: React.FC<EmpathyBuildingProps> = ({
  userId,
  empathySystem,
  identityProfile,
  onEmpathyGrowth,
  onSkillDevelopment,
  culturalSafetyEnabled = true
}) => {
  // State management
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [exerciseType, setExerciseType] = useState<'perspective_taking' | 'narrative_engagement' | 'communication_practice' | 'cultural_immersion'>('perspective_taking');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [empathyInsights, setEmpathyInsights] = useState<EmpathyInsight[]>([]);
  const [communicationSkills, setCommunicationSkills] = useState<CommunicationSkill[]>([]);
  const [exerciseResponse, setExerciseResponse] = useState('');
  const [emotionalResponse, setEmotionalResponse] = useState(5);
  const [perspectiveShift, setPerspectiveShift] = useState(5);
  const [applicationReflection, setApplicationReflection] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCulturalNote, setShowCulturalNote] = useState(false);
  const [selectedPerspective, setSelectedPerspective] = useState<PerspectiveOption | null>(null);

  // Initialize empathy assessment
  useEffect(() => {
    initializeEmpathySession();
  }, []);

  const initializeEmpathySession = async () => {
    // Assess current empathy baseline if not already done
    if (!empathySystem.empathyBaseline.assessmentDate) {
      await conductEmpathyBaseline();
    }
    
    // Load recommended exercises based on identity profile
    const recommendedExercises = await generateRecommendedExercises();
    setActiveExercise(recommendedExercises[0]?.exerciseId || null);
  };

  // Handle exercise completion
  const handleExerciseComplete = useCallback(async () => {
    if (!activeExercise || !exerciseResponse.trim()) return;

    setIsProcessing(true);

    try {
      // Analyze empathy response
      const analysisResult = await analyzeEmpathyResponse({
        exerciseId: activeExercise,
        response: exerciseResponse,
        emotionalResponse,
        perspectiveShift,
        applicationReflection,
        selectedPerspective: selectedPerspective?.id || '',
        culturalContext: identityProfile.culturalIdentity?.culturalHeritage || []
      });

      // Extract insights
      if (analysisResult.insights) {
        setEmpathyInsights(prev => [...prev, ...analysisResult.insights]);
      }

      // Update communication skills
      if (analysisResult.skillDevelopment) {
        setCommunicationSkills(prev => [...prev, ...analysisResult.skillDevelopment]);
        onSkillDevelopment?.(analysisResult.skillDevelopment);
      }

      // Record empathy growth
      const growthEvent: EmpathyGrowthEvent = {
        eventId: `empathy_${Date.now()}`,
        empathyType: exerciseType,
        growthMeasurement: analysisResult.empathyGrowth || 0,
        exerciseCompleted: activeExercise,
        insights: analysisResult.insights || [],
        timestamp: new Date()
      };

      onEmpathyGrowth?.(growthEvent);

      // Move to next exercise or complete session
      await moveToNextExercise();

    } catch (error) {
      console.error('Error processing empathy exercise:', error);
    } finally {
      setIsProcessing(false);
      resetExerciseForm();
    }
  }, [
    activeExercise,
    exerciseResponse,
    emotionalResponse,
    perspectiveShift,
    applicationReflection,
    selectedPerspective,
    exerciseType
  ]);

  // Reset exercise form
  const resetExerciseForm = () => {
    setExerciseResponse('');
    setEmotionalResponse(5);
    setPerspectiveShift(5);
    setApplicationReflection('');
    setSelectedPerspective(null);
  };

  // Render perspective-taking exercise
  const renderPerspectiveTakingExercise = () => {
    const exercise = getCurrentExercise();
    if (!exercise || exercise.type !== 'perspective_taking') return null;

    const perspectiveOptions = getPerspectiveOptions(exercise);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-2xl">👁️</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Perspective-Taking Exercise</h3>
              <p className="text-blue-700">{exercise.scenario}</p>
            </div>
          </div>
        </div>

        {/* Perspective Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Choose a perspective to explore:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {perspectiveOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPerspective?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPerspective(option)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{option.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPerspective && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg">💭</span>
              <div>
                <h4 className="font-medium text-green-800 mb-2">
                  Perspective: {selectedPerspective.name}
                </h4>
                <p className="text-green-700 text-sm mb-3">
                  {selectedPerspective.backgroundContext}
                </p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-800">Consider these aspects:</div>
                  <ul className="text-sm text-green-700 space-y-1">
                    {selectedPerspective.considerations.map((consideration, index) => (
                      <li key={index}>• {consideration}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Response Area */}
        {selectedPerspective && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would this person experience the situation? What would they think, feel, and need?
              </label>
              <textarea
                value={exerciseResponse}
                onChange={(e) => setExerciseResponse(e.target.value)}
                placeholder="Take your time to really step into their shoes. Consider their background, experiences, values, and current circumstances..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32 resize-none"
                disabled={isProcessing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emotional Impact: {emotionalResponse}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={emotionalResponse}
                  onChange={(e) => setEmotionalResponse(Number(e.target.value))}
                  className="w-full"
                  disabled={isProcessing}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimal impact</span>
                  <span>Profound impact</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Perspective Shift: {perspectiveShift}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={perspectiveShift}
                  onChange={(e) => setPerspectiveShift(Number(e.target.value))}
                  className="w-full"
                  disabled={isProcessing}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No new insights</span>
                  <span>Completely new view</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How might this perspective change how you interact with similar situations?
              </label>
              <textarea
                value={applicationReflection}
                onChange={(e) => setApplicationReflection(e.target.value)}
                placeholder="Reflect on how this understanding might influence your future actions, communications, and decisions..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-20 resize-none"
                disabled={isProcessing}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render communication practice exercise
  const renderCommunicationPractice = () => {
    const exercise = getCurrentExercise();
    if (!exercise || exercise.type !== 'communication_practice') return null;

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <span className="text-purple-600 text-2xl">💬</span>
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Inclusive Communication Practice</h3>
              <p className="text-purple-700">{exercise.scenario}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Communication Challenge</h4>
              <p className="text-yellow-700 text-sm">{exercise.challenge}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you approach this conversation inclusively and empathetically?
            </label>
            <textarea
              value={exerciseResponse}
              onChange={(e) => setExerciseResponse(e.target.value)}
              placeholder="Consider: tone, word choice, cultural sensitivity, power dynamics, and creating psychological safety..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-32 resize-none"
              disabled={isProcessing}
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Inclusive Communication Checklist</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {getInclusiveCommunicationChecklist().map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render cultural immersion exercise
  const renderCulturalImmersion = () => {
    const exercise = getCurrentExercise();
    if (!exercise || exercise.type !== 'cultural_immersion') return null;

    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <span className="text-green-600 text-2xl">🌍</span>
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Cultural Immersion Experience</h3>
              <p className="text-green-700">{exercise.scenario}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-lg">📚</span>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Cultural Context</h4>
              <p className="text-blue-700 text-sm mb-2">{exercise.culturalBackground}</p>
              <div className="text-sm">
                <div className="font-medium text-blue-800 mb-1">Key Cultural Values:</div>
                <ul className="text-blue-700 space-y-1">
                  {exercise.culturalValues?.map((value, index) => (
                    <li key={index}>• {value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How does understanding this cultural context change your perspective on the situation?
            </label>
            <textarea
              value={exerciseResponse}
              onChange={(e) => setExerciseResponse(e.target.value)}
              placeholder="Reflect on cultural values, historical context, and how this cultural lens reveals new dimensions of the experience..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-32 resize-none"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What assumptions or biases might you have had before learning this context?
            </label>
            <textarea
              value={applicationReflection}
              onChange={(e) => setApplicationReflection(e.target.value)}
              placeholder="Be honest about initial reactions and how cultural learning shifts understanding..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-20 resize-none"
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    );
  };

  // Get current exercise
  const getCurrentExercise = (): ExerciseData | null => {
    if (!activeExercise) return null;
    return getExerciseData(activeExercise, exerciseType);
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Empathy Building & Communication Development
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Develop deeper empathy and inclusive communication skills through perspective-taking exercises 
            and cultural immersion experiences.
          </p>
        </div>

        {/* Exercise Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Practice Area</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getExerciseTypes().map((type) => (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exerciseType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setExerciseType(type.id as any)}
              >
                <div className="text-center">
                  <span className="text-3xl mb-2 block">{type.icon}</span>
                  <div className="font-medium text-gray-800">{type.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Exercise */}
        {getCurrentExercise() && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {getCurrentExercise()?.title}
              </h2>
              <div className="text-sm text-gray-500">
                Exercise {currentProgress + 1} of 5
              </div>
            </div>

            {/* Cultural Safety Note */}
            {culturalSafetyEnabled && showCulturalNote && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-600 text-lg">🛡️</span>
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">Cultural Safety Reminder</h4>
                    <p className="text-purple-700 text-sm">
                      These exercises involve exploring different perspectives and experiences. 
                      Approach with respect, openness, and humility. If any content feels 
                      triggering, please pause and seek support if needed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Content */}
            {exerciseType === 'perspective_taking' && renderPerspectiveTakingExercise()}
            {exerciseType === 'communication_practice' && renderCommunicationPractice()}
            {exerciseType === 'cultural_immersion' && renderCulturalImmersion()}

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
              <button className="text-gray-600 hover:text-gray-800 text-sm">
                Skip this exercise
              </button>
              
              <button
                onClick={handleExerciseComplete}
                disabled={!exerciseResponse.trim() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Complete Exercise'}
              </button>
            </div>
          </div>
        )}

        {/* Insights Panel */}
        {empathyInsights.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              💡 Your Empathy Insights
            </h3>
            <div className="space-y-3">
              {empathyInsights.slice(-3).map((insight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <p className="text-gray-800 mb-2">{insight.insight}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600">Perspective: {insight.perspective}</span>
                    <span className="text-purple-600">Apply to: {insight.applicationArea}</span>
                  </div>
                  {insight.culturalContext && (
                    <p className="text-sm text-green-600 mt-2">
                      🌍 Cultural Context: {insight.culturalContext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communication Skills Progress */}
        {communicationSkills.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Communication Skills Development
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communicationSkills.map((skill) => (
                <div key={skill.skillId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    <span className="text-sm text-blue-600">{Math.round(skill.level * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${skill.level * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions and data
const getExerciseTypes = () => [
  {
    id: 'perspective_taking',
    name: 'Perspective Taking',
    description: 'Step into different viewpoints',
    icon: '👁️'
  },
  {
    id: 'communication_practice',
    name: 'Communication Practice',
    description: 'Practice inclusive dialogue',
    icon: '💬'
  },
  {
    id: 'cultural_immersion',
    name: 'Cultural Immersion',
    description: 'Explore cultural contexts',
    icon: '🌍'
  },
  {
    id: 'narrative_engagement',
    name: 'Story Engagement',
    description: 'Connect through narratives',
    icon: '📖'
  }
];

const getPerspectiveOptions = (exercise: ExerciseData): PerspectiveOption[] => [
  {
    id: 'colleague',
    name: 'Colleague from Different Background',
    description: 'Someone with different cultural experiences',
    icon: '👥',
    backgroundContext: 'A person from a different cultural background navigating workplace dynamics',
    considerations: [
      'Cultural communication styles',
      'Different professional norms',
      'Potential language barriers',
      'Varying comfort with hierarchy'
    ]
  },
  {
    id: 'community_member',
    name: 'Community Member',
    description: 'Someone affected by community decisions',
    icon: '🏘️',
    backgroundContext: 'A community member whose daily life is impacted by local policies and decisions',
    considerations: [
      'Economic circumstances',
      'Family responsibilities',
      'Community connections',
      'Historical experiences'
    ]
  },
  {
    id: 'young_person',
    name: 'Younger Generation',
    description: 'Someone from a different generation',
    icon: '🌱',
    backgroundContext: 'A young person with different technology use, values, and future concerns',
    considerations: [
      'Different life stage priorities',
      'Technology integration',
      'Economic uncertainties',
      'Environmental concerns'
    ]
  }
];

const getInclusiveCommunicationChecklist = () => [
  'Used inclusive language',
  'Acknowledged different perspectives',
  'Avoided assumptions',
  'Created psychological safety',
  'Demonstrated active listening',
  'Showed cultural sensitivity',
  'Balanced speaking/listening',
  'Asked clarifying questions'
];

// Supporting interfaces
interface ExerciseData {
  type: string;
  title: string;
  scenario: string;
  challenge?: string;
  culturalBackground?: string;
  culturalValues?: string[];
}

interface PerspectiveOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundContext: string;
  considerations: string[];
}

// Helper functions (implementations would be added)
const conductEmpathyBaseline = async () => {
  // Implementation would assess current empathy level
};

const generateRecommendedExercises = async () => {
  // Implementation would recommend exercises based on profile
  return [];
};

const analyzeEmpathyResponse = async (response: any) => {
  // Implementation would analyze empathy development
  return {
    insights: [],
    skillDevelopment: [],
    empathyGrowth: 0
  };
};

const moveToNextExercise = async () => {
  // Implementation would progress to next exercise
};

const getExerciseData = (exerciseId: string, type: string): ExerciseData | null => {
  // Implementation would return exercise data
  return {
    type,
    title: 'Sample Exercise',
    scenario: 'A workplace scenario involving different perspectives...'
  };
};

export default EmpathyBuildingActivities;