'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NeuroplasticityDashboard from './NeuroplasticityDashboard';
import NeuralPathwayVisualization from './NeuralPathwayVisualization';
import { 
  NeuroplasticityHabitEngine, 
  TraumaInformedInterventionEngine 
} from '@/lib/neuroplasticity-habits';
import { RegulatoryCircuitsEngine } from '@/lib/regulatory-circuits';

interface HabitFormationLabProps {
  userId: string;
  userProfile?: {
    trauma_history: string[];
    current_challenges: string[];
    preferred_practices: string[];
    nervous_system_baseline: any;
  };
}

export const HabitFormationLab: React.FC<HabitFormationLabProps> = ({
  userId,
  userProfile
}) => {
  const [currentMode, setCurrentMode] = useState<'onboarding' | 'dashboard' | 'deep_work'>('onboarding');
  const [isInitialized, setIsInitialized] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (userProfile && !isInitialized) {
      setIsInitialized(true);
      setCurrentMode('dashboard');
    }
  }, [userProfile, isInitialized]);

  if (showWelcome) {
    return <WelcomeExperience onComplete={() => setShowWelcome(false)} />;
  }

  if (currentMode === 'onboarding') {
    return <OnboardingFlow onComplete={() => setCurrentMode('dashboard')} />;
  }

  if (currentMode === 'deep_work') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-white">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <Button
              onClick={() => setCurrentMode('dashboard')}
              className="mb-4 text-sage-600 hover:text-sage-800 bg-transparent hover:bg-sage-100 border border-sage-300 rounded-full px-6 py-2 transition-all"
            >
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-light text-sage-800 mb-2">
              Deep Neural Work
            </h1>
            <p className="text-sage-600">
              Advanced neuroplasticity training for established practitioners
            </p>
          </div>
          
          <DeepWorkSession userId={userId} />
        </div>
      </div>
    );
  }

  return <NeuroplasticityDashboard userId={userId} />;
};

// Welcome Experience Component
const WelcomeExperience: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Your Neuroplasticity Lab",
      content: "A space designed with the precision of Jony Ive and the wisdom of trauma-informed neuroscience.",
      icon: "🧠",
      background: "from-sage-100 to-sage-50"
    },
    {
      title: "Your Brain Can Change",
      content: "Neuroplasticity means your brain forms new connections throughout life. Small, trauma-informed practices create profound structural changes.",
      icon: "🌱", 
      background: "from-green-100 to-green-50"
    },
    {
      title: "Trauma-Informed by Design",
      content: "Every element respects your nervous system's capacity. We honor your window of tolerance and adapt practices to your current state.",
      icon: "💚",
      background: "from-blue-100 to-blue-50"
    },
    {
      title: "Choice & Agency Always",
      content: "You have complete control. Modify, pause, or skip any practice. Your body's wisdom guides the journey.",
      icon: "✨",
      background: "from-purple-100 to-purple-50"
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-6">
      <Card className="max-w-2xl mx-auto p-12 text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentStepData.background} flex items-center justify-center mx-auto mb-8`}>
          <span className="text-4xl">{currentStepData.icon}</span>
        </div>
        
        <h1 className="text-3xl font-light text-sage-800 mb-6">
          {currentStepData.title}
        </h1>
        
        <p className="text-sage-600 text-lg mb-12 leading-relaxed">
          {currentStepData.content}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-sage-600'
                  : index < currentStep
                    ? 'bg-sage-400'
                    : 'bg-sage-200'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8 py-3 bg-transparent text-sage-600 border border-sage-300 rounded-full hover:bg-sage-50 transition-colors"
            >
              Previous
            </Button>
          )}
          
          <Button
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                onComplete();
              }
            }}
            className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors"
          >
            {currentStep < steps.length - 1 ? 'Continue' : 'Begin Your Journey'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Onboarding Flow Component
const OnboardingFlow: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'trauma_awareness' | 'goals' | 'preferences' | 'complete'>('trauma_awareness');
  const [responses, setResponses] = useState({
    trauma_awareness: '',
    primary_goal: '',
    preferred_practices: [] as string[],
    time_availability: 5
  });

  const handleStageComplete = (data: any) => {
    setResponses(prev => ({ ...prev, ...data }));
    
    switch (stage) {
      case 'trauma_awareness':
        setStage('goals');
        break;
      case 'goals':
        setStage('preferences');
        break;
      case 'preferences':
        setStage('complete');
        break;
      case 'complete':
        onComplete();
        break;
    }
  };

  if (stage === 'trauma_awareness') {
    return (
      <TraumaAwarenessStep 
        onComplete={(data) => handleStageComplete({ trauma_awareness: data })}
      />
    );
  }

  if (stage === 'goals') {
    return (
      <GoalsStep 
        onComplete={(data) => handleStageComplete({ primary_goal: data })}
      />
    );
  }

  if (stage === 'preferences') {
    return (
      <PreferencesStep 
        onComplete={(data) => handleStageComplete({ 
          preferred_practices: data.practices,
          time_availability: data.time
        })}
      />
    );
  }

  return (
    <OnboardingComplete 
      responses={responses}
      onComplete={() => onComplete()}
    />
  );
};

// Individual Onboarding Steps
const TraumaAwarenessStep: React.FC<{ onComplete: (data: string) => void }> = ({ onComplete }) => {
  const [selection, setSelection] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-6">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-light text-sage-800 mb-6 text-center">
          Understanding Your Experience
        </h2>
        
        <div className="bg-sage-50 p-6 rounded-lg border border-sage-200 mb-8">
          <div className="text-sm text-sage-700">
            <strong>🤗 This is completely optional and private.</strong><br/>
            Understanding your background helps us create the most supportive experience. 
            You can skip any question or provide as much or as little detail as feels comfortable.
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="text-sage-800 mb-4">
            Have you experienced any form of trauma or significant life challenges?
          </div>
          
          {[
            { value: 'yes_receiving_support', label: 'Yes, and I\'m receiving professional support', description: 'Working with therapist, counselor, or healing professional' },
            { value: 'yes_self_guided', label: 'Yes, and I\'m working on healing independently', description: 'Using self-help, books, community support' },
            { value: 'maybe', label: 'I\'m not sure, but I\'ve had difficult experiences', description: 'Something feels unresolved but unsure if it\'s trauma' },
            { value: 'prefer_not_say', label: 'I\'d prefer not to share', description: 'You\'ll still receive trauma-informed practices' },
            { value: 'no', label: 'No significant trauma history', description: 'Life has had normal ups and downs' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelection(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selection === option.value
                  ? 'border-sage-400 bg-sage-50'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className="font-medium text-sage-800">{option.label}</div>
              <div className="text-sm text-sage-600 mt-1">{option.description}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => onComplete(selection)}
            disabled={!selection}
            className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

const GoalsStep: React.FC<{ onComplete: (data: string) => void }> = ({ onComplete }) => {
  const [selection, setSelection] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-6">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-light text-sage-800 mb-6 text-center">
          What Draws You Here?
        </h2>

        <div className="space-y-4 mb-8">
          {[
            { value: 'emotional_regulation', label: 'Better emotional regulation', icon: '💚', description: 'Handle emotions with more ease and wisdom' },
            { value: 'stress_resilience', label: 'Build resilience to stress', icon: '🌱', description: 'Bounce back faster from challenges' },
            { value: 'nervous_system_healing', label: 'Nervous system healing', icon: '🌙', description: 'Soothe hypervigilance and anxiety' },
            { value: 'habit_formation', label: 'Create healthy habits', icon: '✨', description: 'Build sustainable practices that stick' },
            { value: 'self_compassion', label: 'Develop self-compassion', icon: '🤲', description: 'Treat yourself with kindness and understanding' },
            { value: 'trauma_recovery', label: 'Support trauma recovery', icon: '🦋', description: 'Gentle practices for healing and integration' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSelection(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selection === option.value
                  ? 'border-sage-400 bg-sage-50'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-sage-800">{option.label}</div>
                  <div className="text-sm text-sage-600">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => onComplete(selection)}
            disabled={!selection}
            className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors disabled:opacity-50"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
};

const PreferencesStep: React.FC<{ onComplete: (data: { practices: string[], time: number }) => void }> = ({ onComplete }) => {
  const [practices, setPractices] = useState<string[]>([]);
  const [timeAvailable, setTimeAvailable] = useState(5);

  const handlePracticeToggle = (practice: string) => {
    setPractices(prev => 
      prev.includes(practice) 
        ? prev.filter(p => p !== practice)
        : [...prev, practice]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-6">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-2xl font-light text-sage-800 mb-6 text-center">
          Your Practice Preferences
        </h2>

        <div className="space-y-8">
          {/* Practice Types */}
          <div>
            <h3 className="font-medium text-sage-800 mb-4">
              What types of practices appeal to you? (Select all that interest you)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 'breathing', label: 'Breathing practices', icon: '🫁' },
                { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
                { value: 'body_awareness', label: 'Body awareness', icon: '🤸' },
                { value: 'movement', label: 'Gentle movement', icon: '🌿' },
                { value: 'journaling', label: 'Reflective journaling', icon: '📝' },
                { value: 'visualization', label: 'Visualization', icon: '✨' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePracticeToggle(option.value)}
                  className={`p-3 text-left rounded-lg border-2 transition-all ${
                    practices.includes(option.value)
                      ? 'border-sage-400 bg-sage-50'
                      : 'border-sage-200 bg-white hover:border-sage-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{option.icon}</span>
                    <span className="text-sm font-medium text-sage-800">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Availability */}
          <div>
            <h3 className="font-medium text-sage-800 mb-4">
              How much time can you typically dedicate to practice daily?
            </h3>
            
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="30"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sage-600">
                {timeAvailable} minute{timeAvailable !== 1 ? 's' : ''} per day
              </div>
              <div className="text-xs text-sage-500 text-center">
                {timeAvailable <= 5 && "Perfect for micro-practices"}
                {timeAvailable > 5 && timeAvailable <= 15 && "Great for structured sessions"}
                {timeAvailable > 15 && "Excellent for deep work"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => onComplete({ practices, time: timeAvailable })}
            className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors"
          >
            Create My Program
          </Button>
        </div>
      </Card>
    </div>
  );
};

const OnboardingComplete: React.FC<{ 
  responses: any; 
  onComplete: () => void;
}> = ({ responses, onComplete }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-white p-6">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="w-16 h-16 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">✨</span>
        </div>
        
        <h2 className="text-2xl font-light text-sage-800 mb-4">
          Your Neuroplasticity Lab is Ready
        </h2>
        
        <p className="text-sage-600 mb-8 leading-relaxed">
          We've created a personalized program based on your responses. 
          Your practices will adapt to your nervous system's current capacity, 
          honoring your pace and preferences every step of the way.
        </p>

        <div className="bg-sage-50 p-6 rounded-lg border border-sage-200 mb-8">
          <h3 className="font-medium text-sage-800 mb-4">Your Program Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <div className="text-sage-600">Primary Focus:</div>
              <div className="font-medium text-sage-800 capitalize">
                {responses.primary_goal?.replace('_', ' ') || 'Holistic wellness'}
              </div>
            </div>
            <div className="text-left">
              <div className="text-sage-600">Daily Practice Time:</div>
              <div className="font-medium text-sage-800">
                {responses.time_availability} minutes
              </div>
            </div>
            <div className="text-left">
              <div className="text-sage-600">Preferred Practices:</div>
              <div className="font-medium text-sage-800">
                {responses.preferred_practices?.length || 0} selected
              </div>
            </div>
            <div className="text-left">
              <div className="text-sage-600">Trauma-Informed:</div>
              <div className="font-medium text-sage-800">Always</div>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors"
        >
          Enter Your Lab ✨
        </Button>
      </Card>
    </div>
  );
};

// Deep Work Session Component
const DeepWorkSession: React.FC<{ userId: string }> = ({ userId }) => {
  const [sessionType, setSessionType] = useState<'regulatory_circuits' | 'trauma_integration' | 'advanced_neuroplasticity'>('regulatory_circuits');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className={`p-6 cursor-pointer transition-all ${
            sessionType === 'regulatory_circuits' ? 'ring-2 ring-sage-400' : ''
          }`}
          onClick={() => setSessionType('regulatory_circuits')}
        >
          <h3 className="font-medium text-sage-800 mb-2">🧠 Regulatory Circuits</h3>
          <p className="text-sm text-sage-600">Strengthen specific brain circuits for emotional regulation</p>
        </Card>
        
        <Card 
          className={`p-6 cursor-pointer transition-all ${
            sessionType === 'trauma_integration' ? 'ring-2 ring-sage-400' : ''
          }`}
          onClick={() => setSessionType('trauma_integration')}
        >
          <h3 className="font-medium text-sage-800 mb-2">🦋 Trauma Integration</h3>
          <p className="text-sm text-sage-600">Advanced practices for trauma processing and integration</p>
        </Card>
        
        <Card 
          className={`p-6 cursor-pointer transition-all ${
            sessionType === 'advanced_neuroplasticity' ? 'ring-2 ring-sage-400' : ''
          }`}
          onClick={() => setSessionType('advanced_neuroplasticity')}
        >
          <h3 className="font-medium text-sage-800 mb-2">⚡ Advanced Neuroplasticity</h3>
          <p className="text-sm text-sage-600">Complex neural training for experienced practitioners</p>
        </Card>
      </div>

      <NeuralPathwayVisualization
        pathwayStrength={75}
        pathwayName="Prefrontal-Amygdala Regulation"
        targetRegion="Prefrontal Cortex"
        daysPracticed={42}
        milestones={[
          { 
            name: 'Initial Formation',
            description: 'Basic neural pathway established',
            achieved: true,
            date: new Date('2024-01-15'),
            strength_threshold: 25
          },
          {
            name: 'Strengthening Phase',
            description: 'Pathway shows consistent activation',
            achieved: true,
            date: new Date('2024-02-10'),
            strength_threshold: 50
          },
          {
            name: 'Integration Milestone',
            description: 'Automatic activation under stress',
            achieved: false,
            strength_threshold: 75
          }
        ]}
        onCelebrateMilestone={(milestone) => {
          console.log('Milestone achieved:', milestone);
        }}
      />
    </div>
  );
};

export default HabitFormationLab;