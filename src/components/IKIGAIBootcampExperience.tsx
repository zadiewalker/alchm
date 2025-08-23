// ALCHM Digital IKIGAI Bootcamp Experience
// Interactive 6-hour bootcamp recreated as progressive AI-guided sessions

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  IKIGAIBootcampExperience,
  IKIGAIDiscoverySession,
  IKIGAIDiscovery,
  IKIGAIPhase,
  IKIGAISessionType,
  IKIGAIElement
} from '@/types/ikigai-purpose-schema';

interface IKIGAIBootcampProps {
  userId: string;
  bootcampExperience: IKIGAIBootcampExperience;
  currentDiscovery: IKIGAIDiscovery;
  onSessionComplete?: (sessionResult: SessionResult) => void;
  onDiscoveryUpdate?: (discovery: IKIGAIDiscovery) => void;
  onBootcampComplete?: (finalResults: BootcampResults) => void;
}

interface SessionResult {
  sessionId: string;
  discoveries: SessionDiscovery[];
  insights: SessionInsight[];
  userResponses: SessionUserResponse[];
  nextPhase?: IKIGAIPhase;
}

interface BootcampResults {
  finalDiscovery: IKIGAIDiscovery;
  personalizedMap: PersonalizedIKIGAIMap;
  actionPlan: IKIGAIActionPlan;
  alignmentScore: number;
  completionCertificate: CompletionCertificate;
}

const IKIGAIBootcampExperience: React.FC<IKIGAIBootcampProps> = ({
  userId,
  bootcampExperience,
  currentDiscovery,
  onSessionComplete,
  onDiscoveryUpdate,
  onBootcampComplete
}) => {
  // State management
  const [currentSession, setCurrentSession] = useState<IKIGAIDiscoverySession | null>(null);
  const [sessionResponses, setSessionResponses] = useState<SessionUserResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [discoveryState, setDiscoveryState] = useState(currentDiscovery);
  const [sessionInsights, setSessionInsights] = useState<SessionInsight[]>([]);
  const [currentReflection, setCurrentReflection] = useState('');
  const [emotionalResonance, setEmotionalResonance] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [confidence, setConfidence] = useState(5);
  const [showTransition, setShowTransition] = useState(false);

  // Initialize current session
  useEffect(() => {
    initializeCurrentSession();
  }, [bootcampExperience.currentPhase]);

  const initializeCurrentSession = () => {
    const activeSession = bootcampExperience.sessionStructure.find(
      session => session.isActive || session.completionStatus === 'in_progress'
    );
    
    if (activeSession) {
      setCurrentSession(activeSession);
      setCurrentQuestionIndex(0);
      setSessionProgress(0);
      setSessionResponses([]);
      setSessionInsights([]);
    }
  };

  // Handle user response submission
  const handleResponseSubmit = useCallback(async () => {
    if (!currentSession || !currentReflection.trim()) return;

    setIsProcessing(true);

    const response: SessionUserResponse = {
      responseId: `resp_${Date.now()}`,
      sessionId: currentSession.sessionId,
      questionIndex: currentQuestionIndex,
      prompt: getCurrentPrompt(),
      content: currentReflection,
      emotionalResonance,
      energyLevel,
      confidence,
      timestamp: new Date(),
      followUpThoughts: null,
      culturalReflections: null
    };

    const updatedResponses = [...sessionResponses, response];
    setSessionResponses(updatedResponses);

    // Process response with AI analysis
    try {
      const analysisResult = await analyzeResponse(response, currentSession, discoveryState);
      
      if (analysisResult.insights) {
        setSessionInsights(prev => [...prev, ...analysisResult.insights]);
      }

      // Update discovery state with new findings
      if (analysisResult.discoveries) {
        const updatedDiscovery = await updateDiscoveryWithFindings(
          discoveryState,
          analysisResult.discoveries
        );
        setDiscoveryState(updatedDiscovery);
        onDiscoveryUpdate?.(updatedDiscovery);
      }

      // Move to next question or complete session
      if (currentQuestionIndex < getCurrentSessionQuestions().length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSessionProgress((currentQuestionIndex + 1) / getCurrentSessionQuestions().length);
      } else {
        await completeCurrentSession(updatedResponses);
      }

    } catch (error) {
      console.error('Error processing response:', error);
    } finally {
      setIsProcessing(false);
      setCurrentReflection('');
      setEmotionalResonance(5);
      setEnergyLevel(5);
      setConfidence(5);
    }
  }, [
    currentSession,
    currentQuestionIndex,
    currentReflection,
    emotionalResonance,
    energyLevel,
    confidence,
    sessionResponses,
    discoveryState
  ]);

  // Complete current session
  const completeCurrentSession = async (responses: SessionUserResponse[]) => {
    if (!currentSession) return;

    setShowTransition(true);

    try {
      // Analyze complete session
      const sessionAnalysis = await analyzeCompleteSession(
        currentSession,
        responses,
        discoveryState
      );

      // Create session result
      const sessionResult: SessionResult = {
        sessionId: currentSession.sessionId,
        discoveries: sessionAnalysis.discoveries,
        insights: sessionAnalysis.insights,
        userResponses: responses,
        nextPhase: sessionAnalysis.nextPhase
      };

      onSessionComplete?.(sessionResult);

      // Check if bootcamp is complete
      if (isBootcampComplete(sessionAnalysis.nextPhase)) {
        await completeBootcamp();
      } else {
        // Move to next session
        setTimeout(() => {
          moveToNextSession(sessionAnalysis.nextPhase);
          setShowTransition(false);
        }, 2000);
      }

    } catch (error) {
      console.error('Error completing session:', error);
      setShowTransition(false);
    }
  };

  // Complete entire bootcamp
  const completeBootcamp = async () => {
    try {
      const finalResults = await generateBootcampResults(discoveryState);
      onBootcampComplete?.(finalResults);
    } catch (error) {
      console.error('Error completing bootcamp:', error);
    }
  };

  // Get current session questions
  const getCurrentSessionQuestions = (): GuidedQuestion[] => {
    if (!currentSession) return [];
    return currentSession.guidedQuestions || [];
  };

  // Get current prompt
  const getCurrentPrompt = (): string => {
    const questions = getCurrentSessionQuestions();
    return questions[currentQuestionIndex]?.question || '';
  };

  // Get current session instructions
  const getCurrentInstructions = (): string => {
    const questions = getCurrentSessionQuestions();
    return questions[currentQuestionIndex]?.instructions || '';
  };

  // Get session phase description
  const getSessionPhaseDescription = (): string => {
    if (!currentSession) return '';
    
    const phaseDescriptions = {
      'preparation': 'Welcome to your IKIGAI discovery journey. We\'ll explore what makes your life meaningful and purposeful.',
      'love_exploration': 'Let\'s discover what you truly love - the activities, subjects, and experiences that energize and inspire you.',
      'good_at_discovery': 'Time to identify your natural talents, developed skills, and areas where you excel.',
      'world_needs_analysis': 'We\'ll explore what the world needs that resonates with your heart and values.',
      'paid_for_assessment': 'Let\'s examine what you can be compensated for - your marketable skills and value offerings.',
      'intersection_analysis': 'Now we\'ll find the beautiful intersections between these four elements.',
      'core_ikigai_synthesis': 'The culmination - discovering your unique IKIGAI at the center of it all.',
      'life_integration': 'How will you integrate this discovery into your daily life and long-term vision?',
      'action_planning': 'Creating concrete steps to live more aligned with your purpose.'
    };
    
    return phaseDescriptions[discoveryState.currentPhase] || '';
  };

  // Get progress visualization
  const getProgressVisualization = () => {
    const totalPhases = 9;
    const phaseOrder: IKIGAIPhase[] = [
      'preparation',
      'love_exploration', 
      'good_at_discovery',
      'world_needs_analysis',
      'paid_for_assessment',
      'intersection_analysis',
      'core_ikigai_synthesis',
      'life_integration',
      'action_planning'
    ];
    
    const currentPhaseIndex = phaseOrder.indexOf(discoveryState.currentPhase);
    const overallProgress = (currentPhaseIndex + sessionProgress) / totalPhases;
    
    return {
      currentPhaseIndex,
      totalPhases,
      overallProgress,
      phaseProgress: sessionProgress
    };
  };

  // Render session transition
  const renderSessionTransition = () => {
    if (!showTransition) return null;

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Beautiful discoveries!
            </h3>
            <p className="text-gray-600">
              Processing your insights and preparing the next phase of your journey...
            </p>
          </div>
          
          <div className="space-y-3">
            {sessionInsights.slice(-3).map((insight, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded text-sm text-purple-800">
                {insight.insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {renderSessionTransition()}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">IKIGAI Discovery Bootcamp</h1>
              <p className="text-gray-600 mt-1">Your purpose awaits discovery</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Session Progress</div>
              <div className="text-lg font-semibold text-purple-600">
                {Math.round(getProgressVisualization().overallProgress * 100)}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Phase: {discoveryState.currentPhase.replace('_', ' ').toUpperCase()}</span>
              <span>Question {currentQuestionIndex + 1} of {getCurrentSessionQuestions().length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressVisualization().overallProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Phase Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {discoveryState.currentPhase.replace('_', ' ').toUpperCase()}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {getSessionPhaseDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Current Question */}
        {currentSession && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                {getCurrentPrompt()}
              </h3>
              
              {getCurrentInstructions() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    💡 {getCurrentInstructions()}
                  </p>
                </div>
              )}
            </div>

            {/* Response Input */}
            <div className="space-y-4">
              <textarea
                value={currentReflection}
                onChange={(e) => setCurrentReflection(e.target.value)}
                placeholder="Share your thoughts and reflections here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-32 resize-none"
                disabled={isProcessing}
              />

              {/* Reflection Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Energy Level: {energyLevel}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Draining</span>
                    <span>Energizing</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confidence: {confidence}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={confidence}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="w-full"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Uncertain</span>
                    <span>Very Sure</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {getCurrentSessionQuestions().length}
                </div>
                
                <button
                  onClick={handleResponseSubmit}
                  disabled={!currentReflection.trim() || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : currentQuestionIndex < getCurrentSessionQuestions().length - 1 ? 
                    'Continue' : 'Complete Session'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Insights */}
        {sessionInsights.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              ✨ Insights from this session
            </h3>
            <div className="space-y-3">
              {sessionInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <p className="text-gray-800">{insight.insight}</p>
                  {insight.culturalContext && (
                    <p className="text-sm text-purple-600 mt-2">
                      🌍 Cultural Context: {insight.culturalContext}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {bootcampExperience.format === 'progressive_sessions' ? 
              'Take your time - you can pause and return anytime' :
              'Intensive 6-hour experience'
            }
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
              Save & Exit
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm">
              Need Help?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions would be implemented here
const analyzeResponse = async (
  response: SessionUserResponse,
  session: IKIGAIDiscoverySession,
  discovery: IKIGAIDiscovery
): Promise<ResponseAnalysisResult> => {
  // Implementation would call the IKIGAI Discovery Engine
  return {
    insights: [],
    discoveries: [],
    nextRecommendations: []
  };
};

const updateDiscoveryWithFindings = async (
  discovery: IKIGAIDiscovery,
  findings: SessionDiscovery[]
): Promise<IKIGAIDiscovery> => {
  // Implementation would update the discovery object
  return discovery;
};

const analyzeCompleteSession = async (
  session: IKIGAIDiscoverySession,
  responses: SessionUserResponse[],
  discovery: IKIGAIDiscovery
): Promise<CompleteSessionAnalysis> => {
  // Implementation would analyze the complete session
  return {
    discoveries: [],
    insights: [],
    nextPhase: 'love_exploration'
  };
};

const isBootcampComplete = (nextPhase?: IKIGAIPhase): boolean => {
  return nextPhase === undefined || nextPhase === 'action_planning';
};

const moveToNextSession = (nextPhase?: IKIGAIPhase) => {
  // Implementation would transition to next session
};

const generateBootcampResults = async (discovery: IKIGAIDiscovery): Promise<BootcampResults> => {
  // Implementation would generate final bootcamp results
  return {
    finalDiscovery: discovery,
    personalizedMap: {} as PersonalizedIKIGAIMap,
    actionPlan: {} as IKIGAIActionPlan,
    alignmentScore: 0.8,
    completionCertificate: {} as CompletionCertificate
  };
};

// Supporting interfaces
interface SessionUserResponse {
  responseId: string;
  sessionId: string;
  questionIndex: number;
  prompt: string;
  content: string;
  emotionalResonance: number;
  energyLevel: number;
  confidence: number;
  timestamp: Date;
  followUpThoughts: string | null;
  culturalReflections: string | null;
}

interface ResponseAnalysisResult {
  insights: SessionInsight[];
  discoveries: SessionDiscovery[];
  nextRecommendations: string[];
}

interface CompleteSessionAnalysis {
  discoveries: SessionDiscovery[];
  insights: SessionInsight[];
  nextPhase?: IKIGAIPhase;
}

export default IKIGAIBootcampExperience;