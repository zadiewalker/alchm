'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NervousSystemState, NeuroplasticityHabitEngine } from '@/lib/neuroplasticity-habits';

interface NervousSystemTrackerProps {
  onAssessmentComplete: (state: NervousSystemState) => void;
  previousState?: NervousSystemState;
  showGentleReminder?: boolean;
}

export const NervousSystemTracker: React.FC<NervousSystemTrackerProps> = ({
  onAssessmentComplete,
  previousState,
  showGentleReminder = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({
    energy_level: '',
    breathing_awareness: '',
    muscle_tension: '',
    heart_awareness: '',
    overall_sense: ''
  });
  
  const [recentExperiences, setRecentExperiences] = useState({
    sleep_quality: 7,
    stress_events: [] as string[],
    positive_connections: [] as string[],
    accomplishments: [] as string[]
  });

  const questions = [
    {
      id: 'energy_level',
      title: 'Energy Check-In',
      description: 'How is your energy feeling right now?',
      options: [
        { value: 'depleted', label: 'Depleted - feeling empty or drained', color: '#8b9dc3' },
        { value: 'low', label: 'Low - tired but manageable', color: '#a4b792' },
        { value: 'stable', label: 'Stable - balanced and even', color: '#7a9971' },
        { value: 'energized', label: 'Energized - feeling alive and present', color: '#6b8e5a' },
        { value: 'hyperaroused', label: 'Hyperaroused - buzzing or restless', color: '#d4a574' }
      ],
      somatic_guidance: 'Notice the quality of energy in your body without trying to change it.'
    },
    {
      id: 'breathing_awareness',
      title: 'Breath Awareness',
      description: 'How is your breathing right now?',
      options: [
        { value: 'calm', label: 'Calm - natural and easy', color: '#7a9971' },
        { value: 'shallow', label: 'Shallow - mostly in the chest', color: '#a4b792' },
        { value: 'rapid', label: 'Rapid - faster than usual', color: '#d4a574' },
        { value: 'irregular', label: 'Irregular - varying patterns', color: '#8b9dc3' }
      ],
      somatic_guidance: 'Just notice your breath without trying to control it.'
    },
    {
      id: 'muscle_tension',
      title: 'Body Tension',
      description: 'What do you notice about tension in your body?',
      options: [
        { value: 'relaxed', label: 'Relaxed - soft and easeful', color: '#7a9971' },
        { value: 'moderate', label: 'Some tension - normal for me', color: '#a4b792' },
        { value: 'tight', label: 'Tight - holding stress', color: '#d4a574' },
        { value: 'rigid', label: 'Rigid - very tense or armored', color: '#8b9dc3' }
      ],
      somatic_guidance: 'Scan from head to toe, noticing without judgment.'
    },
    {
      id: 'heart_awareness',
      title: 'Heart Connection',
      description: 'How does your heart space feel?',
      options: [
        { value: 'open', label: 'Open - spacious and warm', color: '#7a9971' },
        { value: 'neutral', label: 'Neutral - neither open nor closed', color: '#a4b792' },
        { value: 'guarded', label: 'Guarded - somewhat protective', color: '#d4a574' },
        { value: 'closed', label: 'Closed - defended or numb', color: '#8b9dc3' }
      ],
      somatic_guidance: 'Place a gentle hand on your heart as you check in.'
    },
    {
      id: 'overall_sense',
      title: 'Overall Sense',
      description: 'What\'s your overall felt sense right now?',
      options: [
        { value: 'connected', label: 'Connected - present and grounded', color: '#7a9971' },
        { value: 'balanced', label: 'Balanced - steady and okay', color: '#a4b792' },
        { value: 'scattered', label: 'Scattered - pulled in many directions', color: '#d4a574' },
        { value: 'disconnected', label: 'Disconnected - foggy or distant', color: '#8b9dc3' }
      ],
      somatic_guidance: 'Trust the first sense that arises, before your mind analyzes.'
    }
  ];

  const handleResponse = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 500);
    }
  };

  const generateNervousSystemState = async () => {
    const state = NeuroplasticityHabitEngine.assessNervousSystemState(
      responses,
      recentExperiences
    );
    
    onAssessmentComplete(state);
  };

  const getStateDescription = (state: string) => {
    const descriptions = {
      ventral_vagal: {
        title: 'Ventral Vagal - Connected & Calm',
        description: 'Your nervous system feels safe and socially engaged. This is an optimal state for learning and growth.',
        icon: '🌿',
        color: '#7a9971'
      },
      sympathetic: {
        title: 'Sympathetic - Activated & Alert',
        description: 'Your nervous system is mobilized and energized. Great for action, but may need regulation for deep practices.',
        icon: '🔥',
        color: '#d4a574'
      },
      dorsal_vagal: {
        title: 'Dorsal Vagal - Withdrawn & Preserving',
        description: 'Your nervous system is conserving energy. This calls for extra gentleness and minimal expectations.',
        icon: '🌙',
        color: '#8b9dc3'
      }
    };
    
    return descriptions[state as keyof typeof descriptions] || descriptions.ventral_vagal;
  };

  const isComplete = Object.values(responses).every(r => r !== '');

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Gentle Reminder */}
      {showGentleReminder && (
        <Card className="p-6 bg-sage-50 border-sage-200 text-center">
          <div className="text-2xl mb-3">🌙</div>
          <h3 className="text-lg font-medium text-sage-800 mb-2">
            Daily Check-In Time
          </h3>
          <p className="text-sage-600 text-sm">
            Taking a moment to assess your nervous system helps us personalize today's practices to your current capacity
          </p>
        </Card>
      )}
      
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-sage-600'
                  : 'bg-sage-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Question */}
      {currentStep < questions.length && (
        <Card className="p-8 bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-light text-sage-800 mb-2">
              {questions[currentStep].title}
            </h2>
            <p className="text-sage-600 mb-4">
              {questions[currentStep].description}
            </p>
            <div className="text-sm text-sage-500 italic px-4 py-2 bg-sage-50 rounded-lg inline-block">
              {questions[currentStep].somatic_guidance}
            </div>
          </div>

          <div className="space-y-3">
            {questions[currentStep].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleResponse(questions[currentStep].id, option.value)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 hover:scale-102 transform ${
                  responses[questions[currentStep].id as keyof typeof responses] === option.value
                    ? 'border-sage-400 bg-sage-100 shadow-md'
                    : 'border-sage-200 bg-white hover:border-sage-300'
                }`}
                style={{ 
                  borderLeftColor: option.color,
                  borderLeftWidth: '4px'
                }}
              >
                <div className="font-medium text-sage-800">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {isComplete && (
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-r from-sage-100 to-sage-50 border-sage-200">
            <div className="text-center">
              <h3 className="text-xl font-light text-sage-800 mb-4">
                Your Nervous System State
              </h3>
              
              {/* Simulate state assessment result */}
              <div className="p-6 bg-white rounded-lg border border-sage-200 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">🌿</span>
                  <div className="text-left">
                    <h4 className="text-lg font-medium text-sage-800">
                      Ventral Vagal - Connected & Calm
                    </h4>
                    <p className="text-sage-600 text-sm">
                      Your nervous system feels safe and socially engaged
                    </p>
                  </div>
                </div>

                {/* Window of Tolerance */}
                <div className="mb-6">
                  <div className="text-sm text-sage-600 mb-2">Window of Tolerance</div>
                  <div className="w-full bg-sage-200 rounded-full h-2 relative">
                    <div 
                      className="bg-sage-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: '75%' }}
                    />
                    <div 
                      className="absolute top-0 bg-sage-700 h-2 w-1 rounded-full transition-all duration-1000"
                      style={{ left: '70%' }}
                    />
                  </div>
                  <div className="text-xs text-sage-500 mt-1">
                    Current capacity: 75% • Trend: Stable
                  </div>
                </div>

                {/* Recommendations */}
                <div className="text-left space-y-3">
                  <h5 className="font-medium text-sage-800 text-sm">
                    ✨ Perfect for:
                  </h5>
                  <ul className="text-sm text-sage-600 space-y-1 ml-4">
                    <li>• Full habit practices</li>
                    <li>• Learning new skills</li>
                    <li>• Deep reflection</li>
                    <li>• Creative expression</li>
                  </ul>
                </div>
              </div>

              <Button 
                onClick={generateNervousSystemState}
                className="mt-6 bg-sage-600 hover:bg-sage-700 text-white px-8 py-2 rounded-lg transition-colors"
              >
                Continue to Habit Recommendations
              </Button>
            </div>
          </Card>

          {/* Educational Component */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h4 className="text-lg font-medium text-blue-800 mb-3">
              🧠 Understanding Your Nervous System
            </h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                Your nervous system has three main states, each with different capacities for learning and growth:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-white rounded border-l-4 border-green-400">
                  <div className="font-medium text-green-800">🌿 Ventral Vagal</div>
                  <div className="text-xs text-green-600">Safe, connected, learning-ready</div>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-orange-400">
                  <div className="font-medium text-orange-800">🔥 Sympathetic</div>
                  <div className="text-xs text-orange-600">Activated, energized, action-oriented</div>
                </div>
                <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                  <div className="font-medium text-blue-800">🌙 Dorsal Vagal</div>
                  <div className="text-xs text-blue-600">Withdrawn, preserving, need gentleness</div>
                </div>
              </div>
              <p className="text-xs mt-4 italic">
                This assessment helps us match your practices to your current capacity, 
                honoring your nervous system's wisdom.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NervousSystemTracker;