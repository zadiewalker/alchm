'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  optional?: boolean;
}

interface UserPreferences {
  communicationStyle: 'gentle' | 'direct' | 'encouraging';
  traumaConsiderations: string[];
  primaryGoals: string[];
  preferredPromptTypes: string[];
  crisisContactMethod: 'email' | 'phone' | 'app_only';
  privacyLevel: 'minimal' | 'standard' | 'maximum';
  notificationPreferences: {
    dailyReminders: boolean;
    streakCelebrations: boolean;
    achievementNotifications: boolean;
    weeklyInsights: boolean;
  };
}

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="text-center space-y-6">
    <div className="mb-8">
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🌟</span>
      </div>
      <h1 className="text-3xl font-medium text-gray-800 mb-2">Welcome to ALCHM Beta!</h1>
      <p className="text-gray-600 text-lg">Let's personalize your trauma-informed journaling experience</p>
    </div>
    
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
      <h3 className="font-medium text-blue-800 mb-3">🛡️ Your Safety Comes First</h3>
      <p className="text-blue-700 text-sm leading-relaxed">
        This onboarding helps us understand your needs and preferences so we can provide the most supportive, 
        trauma-informed experience possible. All information is encrypted and never shared.
      </p>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="font-medium">Personalized AI Responses</span>
        <span className="text-green-600">✓</span>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="font-medium">Crisis Prevention Monitoring</span>
        <span className="text-green-600">✓</span>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="font-medium">Adaptive Difficulty Settings</span>
        <span className="text-green-600">✓</span>
      </div>
    </div>
    
    <Button onClick={onNext} className="w-full bg-purple-600 hover:bg-purple-700 py-3">
      Let's Get Started
    </Button>
  </div>
);

const CommunicationStyleStep = ({ 
  preferences, 
  updatePreferences, 
  onNext 
}: { 
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  onNext: () => void;
}) => {
  const [selectedStyle, setSelectedStyle] = useState<UserPreferences['communicationStyle']>(
    preferences.communicationStyle || 'gentle'
  );

  const styles = [
    {
      value: 'gentle' as const,
      title: '🌸 Gentle & Validating',
      description: 'Soft, nurturing responses that prioritize emotional safety and validation',
      example: '"I hear the courage it took to share these feelings. Your emotional awareness is a strength."'
    },
    {
      value: 'direct' as const,
      title: '🎯 Direct & Supportive',
      description: 'Clear, practical guidance with empathetic but straightforward feedback',
      example: '"You\'re recognizing important patterns here. Let\'s explore practical steps forward."'
    },
    {
      value: 'encouraging' as const,
      title: '✨ Encouraging & Motivational',
      description: 'Uplifting, growth-focused responses that celebrate progress and potential',
      example: '"What powerful insights you\'re developing! This growth mindset will serve you well."'
    }
  ];

  const handleNext = () => {
    updatePreferences({ communicationStyle: selectedStyle });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">How do you prefer to receive feedback?</h2>
        <p className="text-gray-600">This helps our AI match your communication preferences</p>
      </div>

      <div className="space-y-4">
        {styles.map((style) => (
          <label
            key={style.value}
            className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
              selectedStyle === style.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="communicationStyle"
              value={style.value}
              checked={selectedStyle === style.value}
              onChange={(e) => setSelectedStyle(e.target.value as UserPreferences['communicationStyle'])}
              className="sr-only"
            />
            
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-1 ${
                selectedStyle === style.value
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {selectedStyle === style.value && (
                  <div className="w-full h-full bg-white rounded-full transform scale-50"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 mb-2">{style.title}</h3>
                <p className="text-gray-600 mb-3">{style.description}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm italic text-gray-700">Example: {style.example}</p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 py-3">
        Continue
      </Button>
    </div>
  );
};

const GoalsStep = ({ 
  preferences, 
  updatePreferences, 
  onNext 
}: { 
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  onNext: () => void;
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(preferences.primaryGoals || []);

  const goals = [
    { id: 'emotional_processing', title: '💭 Process Difficult Emotions', description: 'Work through complex feelings safely' },
    { id: 'build_habits', title: '📝 Build Journaling Habits', description: 'Establish consistent self-reflection practice' },
    { id: 'track_patterns', title: '📊 Identify Patterns', description: 'Recognize triggers, moods, and growth trends' },
    { id: 'crisis_prevention', title: '🛡️ Crisis Prevention', description: 'Early warning system for mental health challenges' },
    { id: 'celebrate_growth', title: '🌱 Celebrate Progress', description: 'Acknowledge healing milestones and achievements' },
    { id: 'connect_community', title: '🤝 Connect with Others', description: 'Share journey with supportive community' }
  ];

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    updatePreferences({ primaryGoals: selectedGoals });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">What are your primary goals?</h2>
        <p className="text-gray-600">Select all that resonate with you (we'll adapt as you grow)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <label
            key={goal.id}
            className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedGoals.includes(goal.id)
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedGoals.includes(goal.id)}
              onChange={() => toggleGoal(goal.id)}
              className="sr-only"
            />
            
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-5 h-5 border-2 rounded mt-0.5 ${
                selectedGoals.includes(goal.id)
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {selectedGoals.includes(goal.id) && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 text-sm">{goal.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{goal.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <Button 
        onClick={handleNext} 
        disabled={selectedGoals.length === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 py-3 disabled:opacity-50"
      >
        Continue ({selectedGoals.length} selected)
      </Button>
    </div>
  );
};

const CrisisPreventionStep = ({ 
  preferences, 
  updatePreferences, 
  onNext 
}: { 
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  onNext: () => void;
}) => {
  const [contactMethod, setContactMethod] = useState<UserPreferences['crisisContactMethod']>(
    preferences.crisisContactMethod || 'app_only'
  );
  const [hasEmergencyContacts, setHasEmergencyContacts] = useState(false);

  const handleNext = () => {
    updatePreferences({ crisisContactMethod: contactMethod });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-6">
        <h2 className="text-xl font-medium text-red-800 mb-2">🚨 Crisis Prevention Setup</h2>
        <p className="text-red-700 text-sm">
          ALCHM monitors for crisis indicators and can provide immediate support. 
          This is NOT a replacement for emergency services or professional care.
        </p>
      </div>

      <div>
        <h3 className="font-medium text-gray-800 mb-4">If we detect crisis indicators, how should we reach you?</h3>
        
        <div className="space-y-3">
          {[
            { value: 'app_only', title: 'In-App Only', description: 'Show resources and support within ALCHM' },
            { value: 'email', title: 'Email + In-App', description: 'Send email with resources and follow-up check-ins' },
            { value: 'phone', title: 'Phone + Email + In-App', description: 'Call for immediate support (requires phone number)' }
          ].map((option) => (
            <label
              key={option.value}
              className={`block p-4 border-2 rounded-lg cursor-pointer ${
                contactMethod === option.value
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="crisisContact"
                value={option.value}
                checked={contactMethod === option.value}
                onChange={(e) => setContactMethod(e.target.value as UserPreferences['crisisContactMethod'])}
                className="sr-only"
              />
              
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 border-2 rounded-full ${
                  contactMethod === option.value ? 'border-red-400 bg-red-400' : 'border-gray-300'
                }`}>
                  {contactMethod === option.value && (
                    <div className="w-full h-full bg-white rounded-full transform scale-50"></div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{option.title}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={hasEmergencyContacts}
            onChange={(e) => setHasEmergencyContacts(e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-blue-800">I have emergency contacts available</div>
            <div className="text-sm text-blue-700">
              Trusted friends, family, or professionals who can support you during difficult times
            </div>
          </div>
        </label>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p className="text-yellow-800 text-sm">
          <strong>Emergency Resources:</strong> If you're in immediate danger, please contact:
          <br />• Emergency Services: 911
          <br />• Crisis Text Line: Text HOME to 741741  
          <br />• National Suicide Prevention Lifeline: 988
        </p>
      </div>

      <Button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 py-3">
        Continue to Privacy Settings
      </Button>
    </div>
  );
};

const CompletionStep = ({ preferences }: { preferences: UserPreferences }) => (
  <div className="text-center space-y-6">
    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
      <span className="text-3xl">🎉</span>
    </div>
    
    <h2 className="text-3xl font-medium text-gray-800 mb-2">You're All Set!</h2>
    <p className="text-gray-600 text-lg">Your personalized ALCHM experience is ready</p>
    
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
      <h3 className="font-medium text-gray-800 mb-4">Your Personalization Summary:</h3>
      <div className="space-y-2 text-sm text-left">
        <div className="flex justify-between">
          <span>Communication Style:</span>
          <span className="font-medium capitalize">{preferences.communicationStyle}</span>
        </div>
        <div className="flex justify-between">
          <span>Primary Goals:</span>
          <span className="font-medium">{preferences.primaryGoals?.length || 0} selected</span>
        </div>
        <div className="flex justify-between">
          <span>Crisis Support:</span>
          <span className="font-medium capitalize">{preferences.crisisContactMethod?.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
    
    <div className="space-y-3">
      <Button className="w-full bg-purple-600 hover:bg-purple-700 py-3">
        Start Your First Journal Entry
      </Button>
      <Button variant="outline" className="w-full">
        Take the Product Tour
      </Button>
    </div>
    
    <p className="text-sm text-gray-500">
      You can update these preferences anytime in Settings
    </p>
  </div>
);

export default function PilotOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    communicationStyle: 'gentle',
    traumaConsiderations: [],
    primaryGoals: [],
    preferredPromptTypes: [],
    crisisContactMethod: 'app_only',
    privacyLevel: 'standard',
    notificationPreferences: {
      dailyReminders: true,
      streakCelebrations: true,
      achievementNotifications: true,
      weeklyInsights: true
    }
  });

  const steps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', description: 'Introduction to ALCHM', component: WelcomeStep },
    { id: 'communication', title: 'Communication Style', description: 'How you prefer feedback', component: CommunicationStyleStep },
    { id: 'goals', title: 'Your Goals', description: 'What you want to achieve', component: GoalsStep },
    { id: 'crisis', title: 'Crisis Prevention', description: 'Safety and support settings', component: CrisisPreventionStep },
    { id: 'complete', title: 'Complete', description: 'Ready to begin!', component: CompletionStep }
  ];

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!currentStepData) {
    return <div>Loading...</div>;
  }

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <CurrentStepComponent
            preferences={preferences}
            updatePreferences={updatePreferences}
            onNext={nextStep}
            onPrev={prevStep}
          />
        </div>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={prevStep}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}