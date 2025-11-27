'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface FirstSessionMagicProps {
  userId: string;
  onComplete?: (data: any) => void;
  className?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'welcome' | 'input' | 'choice' | 'action';
  choices?: string[];
  placeholder?: string;
  required?: boolean;
  supportiveText?: string;
}

/**
 * First Session Magic - Mobile-optimized onboarding for trauma survivors
 * 
 * Features:
 * - Progressive disclosure to reduce cognitive overwhelm
 * - Large touch targets for stress/tremor situations
 * - Gentle animations and supportive language
 * - Crisis detection and immediate support routing
 * - Offline capability for unreliable connections
 * - Memory efficient for older devices
 * - Thumb-friendly one-handed operation
 */
export function FirstSessionMagicMobile({ 
  userId, 
  onComplete,
  className = '' 
}: FirstSessionMagicProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastTouch, setLastTouch] = useState(0);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isOffline, setIsOffline] = useState(false);

  // Crisis keywords for early intervention
  const CRISIS_KEYWORDS = [
    'crisis', 'emergency', 'suicide', 'harm', 'hurt', 'end', 'over',
    'hopeless', 'pointless', 'worthless', 'dying', 'death', 'kill'
  ];

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ALCHM',
      description: 'A sacred space for your healing journey. We\'re honored you\'re here.',
      icon: '🌿',
      type: 'welcome',
      supportiveText: 'Take all the time you need. This space is yours.'
    },
    {
      id: 'safe-space',
      title: 'Creating Your Sanctuary',
      description: 'This is your private, secure space. Everything you share here is protected and confidential.',
      icon: '🛡️',
      type: 'welcome',
      supportiveText: 'Your privacy and safety are our highest priorities.'
    },
    {
      id: 'comfort-check',
      title: 'How are you feeling right now?',
      description: 'There are no wrong answers. We just want to understand how to support you best.',
      icon: '💙',
      type: 'choice',
      choices: [
        'I\'m okay and ready to explore',
        'I\'m feeling overwhelmed but want to try',
        'I\'m in crisis and need immediate support',
        'I\'m not sure how I\'m feeling'
      ],
      supportiveText: 'Your honesty helps us create the right experience for you.'
    },
    {
      id: 'pace-preference',
      title: 'What feels comfortable for you?',
      description: 'We want to move at your pace, always.',
      icon: '🌊',
      type: 'choice',
      choices: [
        'Take me through everything step by step',
        'Give me the essentials and let me explore',
        'I just want to start writing',
        'Show me crisis resources first'
      ],
      supportiveText: 'You can change this anytime. You\'re in control here.'
    },
    {
      id: 'writing-intention',
      title: 'What brings you to journaling?',
      description: 'Understanding your intention helps us personalize your experience.',
      icon: '✨',
      type: 'input',
      placeholder: 'Share whatever feels right... healing, processing, growth, curiosity...',
      supportiveText: 'Even a few words help us understand how to support you.'
    },
    {
      id: 'first-entry',
      title: 'Your First Sacred Entry',
      description: 'Would you like to write your first journal entry now, or explore the app first?',
      icon: '📝',
      type: 'action',
      supportiveText: 'Both choices are perfect. Follow what feels right for you.'
    }
  ];

  // Device optimization checks
  useEffect(() => {
    const checkDeviceState = async () => {
      // Check online status
      setIsOffline(!navigator.onLine);
      
      // Check battery level
      try {
        // @ts-ignore - navigator.getBattery is experimental
        const battery = await navigator.getBattery();
        setBatteryLevel(battery.level);
        
        const updateBattery = () => setBatteryLevel(battery.level);
        battery.addEventListener('levelchange', updateBattery);
        
        return () => battery.removeEventListener('levelchange', updateBattery);
      } catch (error) {
        console.log('Battery API not available');
      }
    };

    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    
    checkDeviceState();
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Crisis detection
  const detectCrisis = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    const crisisScore = CRISIS_KEYWORDS.reduce((score, keyword) => {
      return score + (lowerText.includes(keyword) ? 1 : 0);
    }, 0);

    if (crisisScore >= 2 && !crisisDetected) {
      setCrisisDetected(true);
      showCrisisSupport();
    }
  }, [crisisDetected]);

  // Anti-tremor touch protection
  const handleSafeTouch = useCallback((action: () => void) => {
    const now = Date.now();
    if (now - lastTouch < 1000) return; // Prevent rapid taps during distress
    
    setLastTouch(now);
    
    // Gentle haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    action();
  }, [lastTouch]);

  const showCrisisSupport = () => {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 1.5rem;
        padding: 2rem;
        max-width: 400px;
        width: 100%;
        text-align: center;
      ">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🆘</div>
        <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; color: #374151;">
          Crisis Support Available
        </h2>
        <p style="margin-bottom: 2rem; line-height: 1.6; color: #6b7280;">
          We noticed you might be in distress. You don't have to face this alone. Help is available right now.
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <button onclick="window.open('tel:988', '_self')" style="
            background: #dc2626;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            min-height: 60px;
            font-size: 1.1rem;
          ">
            📞 Call 988 Crisis Lifeline
          </button>
          <button onclick="window.open('https://suicidepreventionlifeline.org/chat/', '_blank')" style="
            background: #2563eb;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            min-height: 60px;
            font-size: 1rem;
            ${isOffline ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          " ${isOffline ? 'disabled' : ''}>
            💬 Crisis Chat ${isOffline ? '(Offline)' : ''}
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
            background: transparent;
            color: #6b7280;
            border: 2px solid #d1d5db;
            padding: 0.75rem 2rem;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            min-height: 52px;
          ">
            Continue to ALCHM
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  const handleResponse = (stepId: string, value: any) => {
    const newResponses = { ...responses, [stepId]: value };
    setResponses(newResponses);

    // Crisis detection for text inputs
    if (typeof value === 'string') {
      detectCrisis(value);
    }

    // Immediate crisis routing
    if (stepId === 'comfort-check' && value.includes('crisis')) {
      showCrisisSupport();
      return;
    }

    // Skip to end if user wants immediate writing
    if (stepId === 'pace-preference' && value.includes('just want to start writing')) {
      handleComplete(newResponses);
      return;
    }
  };

  const handleNext = () => {
    handleSafeTouch(() => {
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete(responses);
      }
    });
  };

  const handleBack = () => {
    handleSafeTouch(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    });
  };

  const handleComplete = async (finalResponses: Record<string, any>) => {
    setIsLoading(true);
    
    try {
      // Save onboarding responses (offline-capable)
      if (!isOffline) {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            responses: finalResponses,
            timestamp: new Date().toISOString()
          })
        });
      } else {
        // Store offline for later sync
        localStorage.setItem(`onboarding_${userId}`, JSON.stringify({
          responses: finalResponses,
          timestamp: new Date().toISOString(),
          synced: false
        }));
      }

      // Route based on user preference
      const pacePreference = finalResponses['pace-preference'] || '';
      
      if (pacePreference.includes('just want to start writing') || 
          finalResponses['first-entry'] === 'write-now') {
        router.push('/journal');
      } else if (pacePreference.includes('Show me crisis resources')) {
        showCrisisSupport();
      } else {
        router.push('/dashboard');
      }

      if (onComplete) {
        onComplete(finalResponses);
      }
      
    } catch (error) {
      console.error('Onboarding completion error:', error);
      // Graceful degradation - still allow user to continue
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const canProceed = currentStepData.required ? responses[currentStepData.id] : true;

  return (
    <div className={`min-h-screen min-h-[100dvh] bg-gradient-to-br from-[#f6f8f4] via-white to-[#e8ede1] p-4 ${className}`}>
      {/* Progress Indicator */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#7a8c6a]">
            Step {currentStep + 1} of {onboardingSteps.length}
          </span>
          {batteryLevel < 0.2 && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              🔋 Power saving mode
            </span>
          )}
        </div>
        <div className="w-full bg-[#d1dac4] rounded-full h-2 overflow-hidden">
          <div 
            className="bg-[#a4b792] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-[#d1dac4] rounded-3xl shadow-xl">
          {/* Step Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#e8ede1] to-[#d1dac4] rounded-2xl mb-4">
              <span className="text-3xl animate-gentle-pulse">
                {currentStepData.icon}
              </span>
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium text-[#505c42] mb-3 tracking-tight leading-[1.6]">
              {currentStepData.title}
            </h2>
            <p className="text-[#7a8c6a] text-base leading-[1.7] mb-4">
              {currentStepData.description}
            </p>
            {currentStepData.supportiveText && (
              <p className="text-[#93a682] text-sm italic">
                {currentStepData.supportiveText}
              </p>
            )}
          </div>

          {/* Step Input */}
          <div className="mb-8">
            {currentStepData.type === 'choice' && currentStepData.choices && (
              <div className="space-y-3">
                {currentStepData.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSafeTouch(() => handleResponse(currentStepData.id, choice))}
                    variant={responses[currentStepData.id] === choice ? 'default' : 'outline'}
                    className={`
                      w-full py-4 px-6 text-left justify-start rounded-2xl transition-all duration-200
                      min-h-[60px] text-base font-medium leading-tight
                      ${responses[currentStepData.id] === choice 
                        ? 'bg-[#a4b792] text-white shadow-md' 
                        : 'bg-white hover:bg-[#f6f8f4] text-[#647354] border-[#d1dac4]'
                      }
                    `}
                    style={{
                      touchAction: 'manipulation',
                      WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.2)'
                    }}
                  >
                    {choice}
                  </Button>
                ))}
              </div>
            )}

            {currentStepData.type === 'input' && (
              <textarea
                value={responses[currentStepData.id] || ''}
                onChange={(e) => {
                  handleResponse(currentStepData.id, e.target.value);
                }}
                placeholder={currentStepData.placeholder}
                className="w-full p-4 border-2 border-[#d1dac4] rounded-2xl focus:border-[#a4b792] focus:ring-2 focus:ring-[#e8ede1] resize-none text-base leading-[1.7] min-h-[120px]"
                style={{
                  touchAction: 'manipulation'
                }}
              />
            )}

            {currentStepData.type === 'action' && (
              <div className="space-y-3">
                <Button
                  onClick={() => handleSafeTouch(() => {
                    handleResponse(currentStepData.id, 'write-now');
                    handleComplete({ ...responses, [currentStepData.id]: 'write-now' });
                  })}
                  className="w-full py-4 px-6 bg-[#a4b792] hover:bg-[#93a682] text-white rounded-2xl text-base font-medium min-h-[60px] transition-all duration-200 hover:shadow-lg"
                  style={{
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)'
                  }}
                >
                  <span className="text-xl mr-3">✍️</span>
                  Start Writing Now
                </Button>
                <Button
                  onClick={() => handleSafeTouch(() => {
                    handleResponse(currentStepData.id, 'explore-first');
                    handleNext();
                  })}
                  variant="outline"
                  className="w-full py-4 px-6 border-2 border-[#d1dac4] text-[#647354] hover:bg-[#f6f8f4] rounded-2xl text-base font-medium min-h-[60px]"
                  style={{
                    touchAction: 'manipulation'
                  }}
                >
                  <span className="text-xl mr-3">🔍</span>
                  Explore ALCHM First
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          {currentStepData.type !== 'action' && (
            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 py-4 border-2 border-[#d1dac4] text-[#647354] hover:bg-[#f6f8f4] rounded-2xl text-base font-medium min-h-[60px]"
                  style={{
                    touchAction: 'manipulation'
                  }}
                >
                  Back
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!canProceed || isLoading}
                className={`
                  py-4 rounded-2xl text-base font-medium min-h-[60px] transition-all duration-200
                  ${currentStep === 0 ? 'w-full' : 'flex-1'}
                  ${canProceed 
                    ? 'bg-[#a4b792] hover:bg-[#93a682] text-white hover:shadow-lg' 
                    : 'bg-[#d1dac4] text-[#a4b792] cursor-not-allowed'
                  }
                `}
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin"></div>
                    <span>Setting up your sanctuary...</span>
                  </div>
                ) : isLastStep ? (
                  'Complete Setup'
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Crisis Support Always Available */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => handleSafeTouch(showCrisisSupport)}
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-2xl py-3 px-6 min-h-[52px] font-medium"
            style={{
              touchAction: 'manipulation'
            }}
          >
            <span className="text-xl mr-2">🆘</span>
            Need Crisis Support?
          </Button>
        </div>

        {/* Offline Indicator */}
        {isOffline && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <span className="text-xl">📡</span>
              <span className="font-medium">Working offline</span>
            </div>
            <p className="text-amber-600 text-sm mt-1">
              Your progress will sync when you're back online
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirstSessionMagicMobile;