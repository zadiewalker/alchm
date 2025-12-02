'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  duration: number;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    pause?: number;
  };
  benefits: string[];
  instructions: string;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box-breathing',
    name: '4-4-4-4 Box Breathing',
    description: 'A calming technique used by Navy SEALs and first responders',
    duration: 4,
    pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system'],
    instructions: 'Breathe in for 4 counts, hold for 4, exhale for 4, pause for 4. Repeat.'
  },
  {
    id: 'calm-breathing',
    name: '4-6 Calm Breathing',
    description: 'Extended exhale to activate the parasympathetic nervous system',
    duration: 5,
    pattern: { inhale: 4, exhale: 6 },
    benefits: ['Activates relaxation response', 'Reduces anxiety', 'Improves sleep'],
    instructions: 'Breathe in slowly for 4 counts, then breathe out slowly for 6 counts.'
  },
  {
    id: 'energizing-breath',
    name: '4-7-8 Relaxing Breath',
    description: 'Dr. Andrew Weil\'s technique for deep relaxation',
    duration: 3,
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    benefits: ['Promotes deep relaxation', 'Helps with sleep', 'Reduces stress'],
    instructions: 'Inhale for 4, hold for 7, exhale slowly for 8. Very powerful for relaxation.'
  },
  {
    id: 'quick-calm',
    name: '3-3 Quick Calm',
    description: 'Simple technique for immediate stress relief',
    duration: 2,
    pattern: { inhale: 3, exhale: 3 },
    benefits: ['Quick stress relief', 'Easy to remember', 'Can be done anywhere'],
    instructions: 'Simple and quick - breathe in for 3, breathe out for 3.'
  }
];

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export default function BreathePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [phaseCount, setPhaseCount] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Redirect to auth if needed (but allow guests)
  useEffect(() => {
    if (!loading && !user) {
      // Allow breathing exercises for non-authenticated users in crisis
      // but show a gentle suggestion to sign up
    }
  }, [loading, user]);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setPhaseCount(prev => {
          const newCount = prev + 1;
          const pattern = selectedTechnique.pattern;
          
          // Determine next phase based on current phase and count
          let nextPhase = currentPhase;
          let resetCount = false;
          
          if (currentPhase === 'inhale' && newCount >= pattern.inhale) {
            nextPhase = pattern.hold ? 'hold' : 'exhale';
            resetCount = true;
          } else if (currentPhase === 'hold' && pattern.hold && newCount >= pattern.hold) {
            nextPhase = 'exhale';
            resetCount = true;
          } else if (currentPhase === 'exhale' && newCount >= pattern.exhale) {
            nextPhase = pattern.pause ? 'pause' : 'inhale';
            resetCount = true;
            if (!pattern.pause) {
              setCycleCount(c => c + 1);
            }
          } else if (currentPhase === 'pause' && pattern.pause && newCount >= pattern.pause) {
            nextPhase = 'inhale';
            resetCount = true;
            setCycleCount(c => c + 1);
          }
          
          if (resetCount) {
            setCurrentPhase(nextPhase);
            setTotalTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            return 0;
          }
          
          return newCount;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedTechnique]);

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setPhaseCount(0);
    setCycleCount(0);
    setTotalTime(0);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseCount(0);
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-yellow-500';
      case 'exhale': return 'bg-green-500';
      case 'pause': return 'bg-gray-400';
    }
  };

  const getCurrentCount = () => {
    const pattern = selectedTechnique.pattern;
    switch (currentPhase) {
      case 'inhale': return pattern.inhale - phaseCount;
      case 'hold': return (pattern.hold || 0) - phaseCount;
      case 'exhale': return pattern.exhale - phaseCount;
      case 'pause': return (pattern.pause || 0) - phaseCount;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sage-600 hover:text-sage-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="text-sm text-sage-600">
              {cycleCount} cycles • {totalTime}s
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-sage-900 mb-4">
            Breathing Sanctuary
          </h1>
          <p className="text-sage-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Find calm and center yourself with guided breathing exercises. 
            These techniques are designed to help regulate your nervous system and bring peace to difficult moments.
          </p>
        </div>

        {/* Technique Selection */}
        {!isActive && (
          <div className="mb-8">
            <h2 className="text-xl font-medium text-sage-900 mb-4">Choose Your Technique</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {breathingTechniques.map((technique) => (
                <button
                  key={technique.id}
                  onClick={() => setSelectedTechnique(technique)}
                  className={`p-6 rounded-2xl text-left transition-all border-2 ${
                    selectedTechnique.id === technique.id
                      ? 'border-sage-400 bg-sage-50'
                      : 'border-sage-200 bg-white/60 hover:border-sage-300'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-sage-900 mb-2">{technique.name}</h3>
                  <p className="text-sage-700 text-sm mb-3">{technique.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {technique.benefits.slice(0, 2).map((benefit, index) => (
                      <span key={index} className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Breathing Circle */}
        <div className="flex flex-col items-center mb-8">
          <div className={`relative w-80 h-80 rounded-full transition-all duration-1000 ${getPhaseColor()} 
                         flex items-center justify-center mb-6 shadow-2xl
                         ${isActive ? 'animate-pulse' : ''}`}>
            <div className="text-center text-white">
              <div className="text-3xl font-light mb-2">{getPhaseInstruction()}</div>
              <div className="text-6xl font-light">{getCurrentCount()}</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-medium text-sage-900 mb-2">{selectedTechnique.name}</h3>
            <p className="text-sage-600 max-w-md">{selectedTechnique.instructions}</p>
          </div>

          <div className="flex gap-4">
            {!isActive ? (
              <button
                onClick={startBreathing}
                className="px-8 py-4 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium text-lg"
              >
                Start Breathing
              </button>
            ) : (
              <button
                onClick={stopBreathing}
                className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-lg"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Benefits & Tips */}
        {!isActive && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Benefits of {selectedTechnique.name}</h3>
              <ul className="space-y-2">
                {selectedTechnique.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sage-700">
                    <span className="w-2 h-2 bg-sage-500 rounded-full"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-4">Tips for Success</h3>
              <ul className="space-y-2 text-sage-700 text-sm">
                <li>• Find a quiet, comfortable place</li>
                <li>• Sit or lie down with good posture</li>
                <li>• Focus only on your breath</li>
                <li>• Start with shorter sessions</li>
                <li>• Be patient with yourself</li>
                <li>• Practice regularly for best results</li>
              </ul>
            </div>
          </div>
        )}

        {/* Guest User Invitation */}
        {!user && !loading && (
          <div className="mt-8 bg-sage-50 rounded-2xl p-6 text-center border border-sage-200">
            <h3 className="text-lg font-medium text-sage-900 mb-2">Ready to Track Your Progress?</h3>
            <p className="text-sage-600 mb-4">
              Create a free account to save your breathing sessions and access your complete wellness journey.
            </p>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-6 py-3 bg-sage-600 text-white rounded-xl hover:bg-sage-700 transition-colors font-medium"
            >
              Create Free Account
            </button>
          </div>
        )}
      </div>

      {/* Crisis Support */}
      <div className="fixed bottom-6 right-6">
        <a 
          href="tel:988" 
          className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Crisis support - Call 988"
        >
          📞
        </a>
      </div>
    </div>
  );
}

// Arrow Left Icon
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H6m0 0l6-6m-6 6l6 6"/>
  </svg>
);