'use client';

import React, { useState, useEffect } from 'react';
import { AIOptOutManager, AI_INTERACTION_LEVELS } from '@/lib/ai-opt-out-manager';

interface ProgressiveAIIntroductionProps {
  userId: string;
  userAge?: number;
  onConsentComplete: (preferences: any) => void;
  skipIntroduction?: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  canSkip: boolean;
  timeEstimate: string;
}

export default function ProgressiveAIIntroduction({
  userId,
  userAge,
  onConsentComplete,
  skipIntroduction = false
}: ProgressiveAIIntroductionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [consentFlow, setConsentFlow] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<'none' | 'minimal' | 'standard' | 'enhanced'>('standard');
  const [viewingTime, setViewingTime] = useState<Record<string, number>>({});
  const [educationalProgress, setEducationalProgress] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customChoices, setCustomChoices] = useState<Record<string, boolean>>({});
  const [parentalEmail, setParentalEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const aiOptOutManager = AIOptOutManager.getInstance();

  useEffect(() => {
    initializeConsentFlow();
  }, [userId, userAge]);

  useEffect(() => {
    // Track time spent on each step
    const stepId = onboardingSteps[currentStep]?.id;
    if (stepId) {
      const startTime = Date.now();
      return () => {
        const timeSpent = Date.now() - startTime;
        setViewingTime(prev => ({
          ...prev,
          [stepId]: (prev[stepId] || 0) + timeSpent
        }));
      };
    }
  }, [currentStep]);

  const initializeConsentFlow = async () => {
    try {
      const flow = await aiOptOutManager.initiateConsentFlow(userId, userAge);
      setConsentFlow(flow);
      setSelectedLevel(flow.recommendedLevel);
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize consent flow:', error);
      setLoading(false);
    }
  };

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ALCHM',
      description: 'Your personal space for reflection and growth',
      timeEstimate: '2 minutes',
      canSkip: false,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Your Digital Sanctuary</h2>
            <p className="text-gray-600">
              ALCHM is designed to support your emotional wellness journey with respect, privacy, and cultural sensitivity.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What Makes ALCHM Special</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Trauma-informed approach designed by mental health experts</li>
              <li>• Cultural responsiveness honoring diverse healing traditions</li>
              <li>• Complete privacy protection with end-to-end encryption</li>
              <li>• AI assistance that you can control or disable entirely</li>
              <li>• Crisis safety support available 24/7</li>
            </ul>
          </div>

          {consentFlow?.requiresParentalConsent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">For Young Journalers</h3>
              <p className="text-green-800 text-sm">
                We've designed special protections for young people, including parental oversight and extra privacy safeguards.
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'ai_explanation',
      title: 'Understanding AI in Journaling',
      description: 'Learn how AI can support your reflection',
      timeEstimate: '3 minutes',
      canSkip: true,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">What is AI-Assisted Journaling?</h2>
            <p className="text-gray-700 mb-4">
              AI (Artificial Intelligence) can help enhance your journaling experience by offering gentle insights 
              and supportive prompts. Think of it as a thoughtful writing companion that never judges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ What AI Does</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Offers gentle emotional insights</li>
                <li>• Suggests reflection questions</li>
                <li>• Provides crisis safety support</li>
                <li>• Adapts to your cultural background</li>
                <li>• Recognizes your growth patterns</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">❌ What AI Does NOT Do</h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Diagnose mental health conditions</li>
                <li>• Give medical advice</li>
                <li>• Replace human counselors</li>
                <li>• Remember between sessions</li>
                <li>• Judge your thoughts or feelings</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">🔒 Your Privacy is Protected</h3>
            <p className="text-purple-800 text-sm">
              All your journal entries are encrypted and private. AI processes your writing to help you, 
              but your personal thoughts are never shared with anyone. You control your data completely.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'interaction_levels',
      title: 'Choose Your AI Interaction Level',
      description: 'Select how much AI assistance you want',
      timeEstimate: '4 minutes',
      canSkip: false,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How Much AI Support Do You Want?</h2>
            <p className="text-gray-700 mb-4">
              You have complete control over how AI assists your journaling. Choose the level that feels right for you.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(AI_INTERACTION_LEVELS).map(([key, level]) => (
              <div
                key={key}
                onClick={() => setSelectedLevel(level.level)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedLevel === level.level
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        checked={selectedLevel === level.level}
                        onChange={() => setSelectedLevel(level.level)}
                        className="mr-3"
                      />
                      <h3 className="font-semibold text-gray-900">{level.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{level.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-700">Features:</span>
                        <ul className="text-gray-600 mt-1">
                          {Object.entries(level.features)
                            .filter(([_, enabled]) => enabled)
                            .map(([feature, _]) => (
                              <li key={feature}>• {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Data Processing:</span>
                        <p className="text-gray-600 mt-1 capitalize">{level.dataProcessing}</p>
                        {level.crisisSafety && (
                          <p className="text-green-600 text-xs mt-1">✓ Crisis safety always enabled</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {consentFlow?.recommendedLevel === level.level && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
          </button>

          {showAdvancedOptions && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Customize Specific Features</h4>
              <div className="space-y-2">
                {aiOptOutManager.getGranularControls().map((control) => (
                  <label key={control.feature} className="flex items-start">
                    <input
                      type="checkbox"
                      checked={customChoices[control.feature] !== false}
                      onChange={(e) => setCustomChoices(prev => ({
                        ...prev,
                        [control.feature]: e.target.checked
                      }))}
                      disabled={!control.canOptOut}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{control.feature}</div>
                      <div className="text-gray-600 text-sm">{control.description}</div>
                      {!control.canOptOut && (
                        <div className="text-green-600 text-xs">Required for safety</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'analog_preview',
      title: 'Analog Journaling Option',
      description: 'See what journaling without AI looks like',
      timeEstimate: '2 minutes',
      canSkip: true,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pure Analog Journaling</h2>
            <p className="text-gray-700 mb-4">
              Prefer to journal without any AI assistance? That's perfectly valid. 
              Our analog mode offers rich, human-curated reflection experiences.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 mb-4">Analog Mode Features</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-amber-800 mb-2">What You Get</h4>
                <ul className="text-amber-700 text-sm space-y-1">
                  <li>• 150+ trauma-informed prompts</li>
                  <li>• Cultural wisdom from diverse traditions</li>
                  <li>• Grounding techniques and breathing exercises</li>
                  <li>• Progress tracking without AI analysis</li>
                  <li>• Complete privacy - no AI processing</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-amber-800 mb-2">Sample Prompts</h4>
                <div className="space-y-2">
                  <div className="bg-white rounded p-2 text-amber-900 text-sm">
                    "How did your body speak to you today?"
                  </div>
                  <div className="bg-white rounded p-2 text-amber-900 text-sm">
                    "What small acts of courage did you show?"
                  </div>
                  <div className="bg-white rounded p-2 text-amber-900 text-sm">
                    "What wisdom from your culture guides you?"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedLevel('none')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLevel === 'none'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              Choose Analog Mode
            </button>
            <span className="text-gray-500 text-sm">or continue with AI assistance</span>
          </div>
        </div>
      )
    },
    {
      id: 'parental_consent',
      title: 'Parental Consent',
      description: 'Get parent/guardian approval',
      timeEstimate: '3 minutes',
      canSkip: false,
      content: consentFlow?.requiresParentalConsent ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parental Consent Required</h2>
            <p className="text-gray-700 mb-4">
              Since you're under 13, we need your parent or guardian to review and approve your AI interaction settings.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What Your Parent/Guardian Will Review</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Your chosen AI interaction level</li>
              <li>• Privacy and safety protections in place</li>
              <li>• Data handling and retention policies</li>
              <li>• Crisis safety features (always enabled)</li>
              <li>• Your ability to change settings anytime</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent/Guardian Email Address
            </label>
            <input
              type="email"
              value={parentalEmail}
              onChange={(e) => setParentalEmail(e.target.value)}
              placeholder="parent@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <p className="text-gray-500 text-xs mt-1">
              We'll send them a secure link to review and approve your settings
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Privacy Protection</h3>
            <p className="text-green-800 text-sm">
              Your parent/guardian can review your settings and safety features, but they cannot read your actual journal entries. 
              Your thoughts remain completely private.
            </p>
          </div>
        </div>
      ) : null
    },
    {
      id: 'confirmation',
      title: 'Confirm Your Choices',
      description: 'Review and finalize your preferences',
      timeEstimate: '2 minutes',
      canSkip: false,
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Your AI Preferences</h2>
            <p className="text-gray-700 mb-4">
              Please review your choices. You can change these settings anytime in your preferences.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Selected Settings</h3>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">AI Interaction Level:</span>
                <span className="ml-2 text-gray-900">
                  {AI_INTERACTION_LEVELS[selectedLevel].name}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-600 text-sm mt-1">
                  {AI_INTERACTION_LEVELS[selectedLevel].description}
                </p>
              </div>

              {consentFlow?.requiresParentalConsent && parentalEmail && (
                <div>
                  <span className="font-medium text-gray-700">Parent/Guardian Email:</span>
                  <span className="ml-2 text-gray-900">{parentalEmail}</span>
                </div>
              )}

              <div>
                <span className="font-medium text-gray-700">Crisis Safety:</span>
                <span className="ml-2 text-green-600">✓ Always Enabled</span>
              </div>

              {Object.keys(customChoices).length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Custom Settings:</span>
                  <ul className="text-gray-600 text-sm mt-1">
                    {Object.entries(customChoices).map(([feature, enabled]) => (
                      <li key={feature}>
                        {enabled ? '✓' : '✗'} {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Remember</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• You can change these settings anytime</li>
              <li>• Your journal entries are always private and encrypted</li>
              <li>• Crisis safety support is always available</li>
              <li>• You own your data and can delete it anytime</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Filter out parental consent step if not needed
  const activeSteps = onboardingSteps.filter(step => 
    step.id !== 'parental_consent' || consentFlow?.requiresParentalConsent
  );

  const handleNext = () => {
    const stepId = activeSteps[currentStep]?.id;
    if (stepId && !educationalProgress.includes(stepId)) {
      setEducationalProgress(prev => [...prev, stepId]);
    }

    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const decision = {
        selectedLevel,
        explicitChoices: customChoices,
        educationalContentViewed: educationalProgress,
        timeSpentReviewing: Object.values(viewingTime).reduce((sum, time) => sum + time, 0),
        parentalApproval: consentFlow?.requiresParentalConsent ? {
          parentEmail: parentalEmail,
          approvalTimestamp: new Date().toISOString(),
          verificationMethod: 'email' as const,
          approvalToken: 'pending'
        } : undefined,
        ipAddress: 'unknown', // Would be populated by API
        userAgent: navigator.userAgent,
        reviewFrequency: 'quarterly' as const
      };

      const consentRecord = await aiOptOutManager.recordConsentDecision(userId, decision);
      onConsentComplete(consentRecord);
    } catch (error) {
      console.error('Failed to complete consent process:', error);
    }
  };

  const handleSkip = () => {
    if (activeSteps[currentStep]?.canSkip) {
      handleNext();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your journaling experience...</p>
        </div>
      </div>
    );
  }

  if (skipIntroduction) {
    return null;
  }

  const currentStepData = activeSteps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {activeSteps.length}</span>
            <span>{currentStepData?.timeEstimate}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData?.title}
            </h1>
            <p className="text-gray-600">
              {currentStepData?.description}
            </p>
          </div>

          {currentStepData?.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStepData?.canSkip && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip This Step
              </button>
            )}

            {currentStep === activeSteps.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={consentFlow?.requiresParentalConsent && !parentalEmail}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Setup
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}