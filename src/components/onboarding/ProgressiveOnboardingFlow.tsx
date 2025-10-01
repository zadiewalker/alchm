'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Trauma-informed onboarding that respects user agency and provides safe exits

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  canSkip: boolean;
  pauseAllowed: boolean;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  onNext: () => void;
  onSkip: () => void;
  onPause: () => void;
  onExit: () => void;
}

// Step 1: Welcome & Safety Orientation
function WelcomeStep({ onNext, onSkip, onExit }: OnboardingStepProps) {
  return (
    <div className="sanctuary-card max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-accent-bg flex items-center justify-center breathing-element">
        <span className="text-3xl">🕊️</span>
      </div>
      
      <h1 className="text-3xl font-light text-sanctuary-gray-800 mb-4">
        Welcome to Your Digital Sanctuary
      </h1>
      
      <p className="text-lg text-sanctuary-gray-600 mb-6 leading-relaxed max-w-lg mx-auto">
        ALCHM is designed as a safe space for your healing journey. You have complete control here—
        pause, skip, or exit anytime you need.
      </p>
      
      <div className="bg-sage-accent-bg border border-sage-200 rounded-xl p-4 mb-8 text-left">
        <h3 className="font-medium text-sage-700 mb-2">Your Safety Reminders</h3>
        <ul className="text-sm text-sage-600 space-y-1">
          <li>• You can pause or exit this process at any time</li>
          <li>• All information you share is private and secure</li>
          <li>• There are no wrong answers or judgments here</li>
          <li>• Take as much time as you need</li>
        </ul>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onNext}
          className="sage-primary min-w-[140px]"
        >
          I'm ready to begin
        </Button>
        
        <Button 
          onClick={onSkip}
          variant="secondary"
          className="min-w-[120px]"
        >
          Skip for now
        </Button>
      </div>
      
      <button
        onClick={onExit}
        className="mt-6 text-sm text-sanctuary-gray-400 hover:text-sanctuary-gray-600 transition-colors"
      >
        Not ready? That's okay too →
      </button>
    </div>
  );
}

// Step 2: Intention Setting
function IntentionStep({ onNext, onSkip, onPause }: OnboardingStepProps) {
  const [intention, setIntention] = useState('');
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([]);
  
  const commonIntentions = [
    "Healing from past experiences",
    "Building emotional resilience", 
    "Discovering my authentic self",
    "Creating meaningful connections",
    "Finding purpose and direction",
    "Processing difficult emotions",
    "Developing self-compassion",
    "Strengthening cultural identity"
  ];
  
  const toggleIntention = (intent: string) => {
    setSelectedIntentions(prev => 
      prev.includes(intent) 
        ? prev.filter(i => i !== intent)
        : [...prev, intent]
    );
  };

  return (
    <div className="sanctuary-card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-accent-bg flex items-center justify-center">
          <span className="text-2xl">💎</span>
        </div>
        <h2 className="text-2xl font-light text-sanctuary-gray-800 mb-2">
          Set Your Sacred Intention
        </h2>
        <p className="text-sanctuary-gray-600">
          What brings you here today? Choose what resonates or share your own.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonIntentions.map((intent) => (
            <button
              key={intent}
              onClick={() => toggleIntention(intent)}
              className={`p-4 text-left rounded-lg border transition-all ${
                selectedIntentions.includes(intent)
                  ? 'border-sage-400 bg-sage-50 text-sage-700'
                  : 'border-sanctuary-gray-200 hover:border-sage-300 hover:bg-sage-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  selectedIntentions.includes(intent)
                    ? 'border-sage-400 bg-sage-400'
                    : 'border-sanctuary-gray-300'
                }`}>
                  {selectedIntentions.includes(intent) && (
                    <div className="w-full h-full rounded-full bg-sage-400"></div>
                  )}
                </div>
                <span className="text-sm font-medium">{intent}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-sanctuary-gray-700 mb-2">
            Or write your own intention:
          </label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="I'm here to..."
            className="sanctuary-input resize-none h-24"
          />
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onNext}
          disabled={selectedIntentions.length === 0 && !intention.trim()}
          className="sage-primary min-w-[120px]"
        >
          Continue
        </Button>
        
        <Button onClick={onSkip} variant="secondary">
          Skip this step
        </Button>
        
        <Button onClick={onPause} variant="ghost" size="sm">
          Take a pause
        </Button>
      </div>
    </div>
  );
}

// Step 3: Gentle Preference Discovery
function PreferencesStep({ onNext, onSkip }: OnboardingStepProps) {
  const [preferences, setPreferences] = useState({
    pace: '',
    style: '',
    support: '',
    privacy: ''
  });
  
  const updatePreference = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const questions = [
    {
      key: 'pace',
      question: "What pace feels right for your journey?",
      options: [
        { id: 'gentle', label: "Gentle - I prefer to move slowly and mindfully" },
        { id: 'steady', label: "Steady - I like consistent, manageable progress" },
        { id: 'flexible', label: "Flexible - Some days fast, some days slow" }
      ]
    },
    {
      key: 'style',
      question: "How do you prefer to reflect?",
      options: [
        { id: 'writing', label: "Writing - I process best through words" },
        { id: 'prompts', label: "Guided prompts - I like structured questions" },
        { id: 'creative', label: "Creative expression - Art, voice, movement" }
      ]
    },
    {
      key: 'support',
      question: "What kind of guidance feels supportive?",
      options: [
        { id: 'gentle', label: "Gentle suggestions - Soft nudges and encouragement" },
        { id: 'structured', label: "Clear structure - Step-by-step guidance" },
        { id: 'adaptive', label: "Adaptive - Changes based on my needs" }
      ]
    }
  ];

  const allAnswered = questions.every(q => preferences[q.key as keyof typeof preferences]);

  return (
    <div className="sanctuary-card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-accent-bg flex items-center justify-center">
          <span className="text-2xl">🎨</span>
        </div>
        <h2 className="text-2xl font-light text-sanctuary-gray-800 mb-2">
          Personalize Your Experience
        </h2>
        <p className="text-sanctuary-gray-600">
          Help us understand how to best support your unique journey.
        </p>
      </div>
      
      <div className="space-y-8">
        {questions.map((question, index) => (
          <motion.div
            key={question.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-medium text-sanctuary-gray-700">
              {question.question}
            </h3>
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updatePreference(question.key, option.id)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    preferences[question.key as keyof typeof preferences] === option.id
                      ? 'border-sage-400 bg-sage-50 text-sage-700'
                      : 'border-sanctuary-gray-200 hover:border-sage-300 hover:bg-sage-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      preferences[question.key as keyof typeof preferences] === option.id
                        ? 'border-sage-400 bg-sage-400'
                        : 'border-sanctuary-gray-300'
                    }`}>
                      {preferences[question.key as keyof typeof preferences] === option.id && (
                        <div className="w-full h-full rounded-full bg-sage-400"></div>
                      )}
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex gap-4 justify-center mt-8">
        <Button 
          onClick={onNext}
          disabled={!allAnswered}
          className="sage-primary min-w-[120px]"
        >
          Continue
        </Button>
        
        <Button onClick={onSkip} variant="secondary">
          Skip preferences
        </Button>
      </div>
    </div>
  );
}

// Step 4: Journey Preview & Commitment
function CommitmentStep({ onNext }: OnboardingStepProps) {
  return (
    <div className="sanctuary-card max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-accent-bg flex items-center justify-center breathing-element">
        <span className="text-3xl">🌱</span>
      </div>
      
      <h2 className="text-2xl font-light text-sanctuary-gray-800 mb-4">
        Your Sanctuary Awaits
      </h2>
      
      <p className="text-lg text-sanctuary-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
        You've created a personalized space for healing and growth. 
        Remember: this journey is yours to shape.
      </p>
      
      <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 mb-8">
        <h3 className="font-medium text-sage-700 mb-4">Your Sacred Promises to Yourself</h3>
        <div className="text-left space-y-2 text-sm text-sage-600">
          <p>• I will be gentle with myself as I grow</p>
          <p>• I will honor my pace and my needs</p>
          <p>• I will celebrate small victories along the way</p>
          <p>• I will ask for help when I need it</p>
        </div>
      </div>
      
      <Button 
        onClick={onNext}
        className="sage-primary min-w-[160px] text-lg"
      >
        Begin My Journey
      </Button>
      
      <p className="mt-4 text-xs text-sanctuary-gray-400">
        You can return to these settings anytime in your profile
      </p>
    </div>
  );
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Creating your safe space',
    description: 'Understanding ALCHM and setting safety expectations',
    canSkip: true,
    pauseAllowed: false,
    component: WelcomeStep
  },
  {
    id: 'intention',
    title: 'Intention',
    subtitle: 'Setting your sacred purpose',
    description: 'Clarifying what brings you to this healing space',
    canSkip: true,
    pauseAllowed: true,
    component: IntentionStep
  },
  {
    id: 'preferences',
    title: 'Preferences',
    subtitle: 'Personalizing your experience',
    description: 'Customizing how ALCHM supports your unique journey',
    canSkip: true,
    pauseAllowed: true,
    component: PreferencesStep
  },
  {
    id: 'commitment',
    title: 'Commitment',
    subtitle: 'Entering your sanctuary',
    description: 'Making sacred promises to yourself',
    canSkip: false,
    pauseAllowed: false,
    component: CommitmentStep
  }
];

export default function ProgressiveOnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [onboardingData, setOnboardingData] = useState({});

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const currentStepData = ONBOARDING_STEPS[currentStep];
  const StepComponent = currentStepData.component;

  useEffect(() => {
    // Check if user has paused and wants to resume
    const pausedStep = localStorage.getItem('alchm_onboarding_paused_step');
    if (pausedStep) {
      setCurrentStep(parseInt(pausedStep));
      setIsPaused(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsPaused(false);
      localStorage.removeItem('alchm_onboarding_paused_step');
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePause = () => {
    localStorage.setItem('alchm_onboarding_paused_step', currentStep.toString());
    localStorage.setItem('alchm_onboarding_data', JSON.stringify(onboardingData));
    router.push('/dashboard?onboarding_paused=true');
  };

  const handleExit = () => {
    router.push('/');
  };

  const completeOnboarding = () => {
    localStorage.setItem('alchm_onboarding_complete', 'true');
    localStorage.setItem('alchm_onboarding_data', JSON.stringify(onboardingData));
    localStorage.removeItem('alchm_onboarding_paused_step');
    router.push('/dashboard');
  };

  if (isPaused) {
    return (
      <div className="min-h-screen bg-sanctuary-white flex items-center justify-center p-4">
        <div className="sanctuary-card max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-accent-bg flex items-center justify-center">
            <span className="text-2xl">⏸️</span>
          </div>
          <h2 className="text-xl font-light text-sanctuary-gray-800 mb-2">
            Welcome back
          </h2>
          <p className="text-sanctuary-gray-600 mb-6">
            You paused your onboarding. Ready to continue where you left off?
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setIsPaused(false)} className="sage-primary">
              Continue journey
            </Button>
            <Button onClick={handleExit} variant="secondary">
              Exit for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Crisis-Safe Exit Button */}
      <button
        onClick={handleExit}
        className="crisis-safe-exit"
        aria-label="Safe exit"
        title="Exit anytime - your safety matters"
      >
        ×
      </button>

      {/* Progress Header */}
      <div className="sanctuary-nav">
        <div className="sanctuary-container w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-sage-accent-bg flex items-center justify-center">
                <span className="text-xs font-medium text-sage-700">
                  {currentStep + 1}
                </span>
              </div>
              <div>
                <h1 className="font-medium text-sanctuary-gray-800">
                  {currentStepData.title}
                </h1>
                <p className="text-sm text-sanctuary-gray-600">
                  {currentStepData.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-sanctuary-gray-600">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </div>
              <div className="sanctuary-progress w-32">
                <div 
                  className="sanctuary-progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="sanctuary-section">
        <div className="sanctuary-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                onNext={handleNext}
                onSkip={handleSkip}
                onPause={handlePause}
                onExit={handleExit}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step Navigation Breadcrumbs */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-sage-400'
                  : index < currentStep
                  ? 'bg-sage-300'
                  : 'bg-sanctuary-gray-200'
              }`}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}