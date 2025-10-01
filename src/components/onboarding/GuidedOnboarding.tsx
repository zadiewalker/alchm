'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useMobileOptimization } from '../MobileOptimizationProvider';
import { useAnalytics } from '@/lib/analytics';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  action: {
    text: string;
    onClick: () => void;
  };
  skipable?: boolean;
}

interface GuidedOnboardingProps {
  onComplete: () => void;
  showSkip?: boolean;
}

interface OnboardingProgress {
  stepId: string;
  completedAt: number;
  skipReason?: string;
  timeSpent: number;
}

export default function GuidedOnboarding({ onComplete, showSkip = true }: GuidedOnboardingProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    displayName: '',
    pronouns: '',
    kheperaArchetype: '',
    preferredLanguage: 'en'
  });
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);
  const [savedProgress, setSavedProgress] = useState<OnboardingProgress[]>([]);
  
  // Mobile optimization and analytics
  const {
    isCrisisMode,
    isOffline,
    deviceTier,
    isLowBattery,
    enableCrisisMode
  } = useMobileOptimization();
  
  const { trackUser, trackNavigation } = useAnalytics();
  
  // Monitor network status for offline capability
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('alchm_onboarding_progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved) as OnboardingProgress[];
        setSavedProgress(progress);
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
      }
    }
    
    // Track analytics
    trackNavigation.pageView('/onboarding', document.referrer);
  }, [trackNavigation]);
  
  // Handle double-tap protection for tremor compensation
  const handleTouchSafeAction = useCallback((action: () => void) => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) {
      return; // Prevent double-tap within 300ms
    }
    setLastTapTime(currentTime);
    
    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate && !isLowBattery) {
      navigator.vibrate(50);
    }
    
    action();
  }, [lastTapTime, isLowBattery]);
  
  // Save progress to local storage
  const saveProgress = useCallback((stepId: string, completed: boolean, skipReason?: string) => {
    const progress: OnboardingProgress = {
      stepId,
      completedAt: Date.now(),
      skipReason,
      timeSpent: Date.now() - stepStartTime
    };
    
    const updatedProgress = [...savedProgress, progress];
    setSavedProgress(updatedProgress);
    
    try {
      localStorage.setItem('alchm_onboarding_progress', JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
    
    // Track step completion
    trackUser.preferencesChanged('onboarding_step', `${stepId}_${completed ? 'completed' : 'skipped'}`);
  }, [savedProgress, stepStartTime, trackUser]);
  
  // Navigate to next step with progress tracking
  const goToNextStep = useCallback((skipReason?: string) => {
    if (currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      if (currentStepData) {
        saveProgress(currentStepData.id, !skipReason, skipReason);
      }
      
      setCurrentStep(currentStep + 1);
      setStepStartTime(Date.now());
    }
  }, [currentStep, savedProgress, saveProgress]);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to your digital sanctuary',
      subtitle: 'A space designed with trauma-informed care principles',
      content: (
        <div style={{ textAlign: 'center', padding: 'var(--space-rest) 0' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: 'var(--space-rest)',
            filter: 'drop-shadow(0 4px 8px rgba(164, 183, 146, 0.3))'
          }}>
            🌿
          </div>
          <p style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'rgba(254, 252, 251, 0.9)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            ALCHM is built on the understanding that healing happens differently for everyone. 
            We're honored you're here.
          </p>
        </div>
      ),
      action: {
        text: isCrisisMode ? "I'm ready (take your time)" : "Let's Begin",
        onClick: () => handleTouchSafeAction(() => goToNextStep())
      }
    },
    {
      id: 'identity',
      title: 'How should we address you?',
      subtitle: 'Your identity matters to us',
      content: (
        <div style={{ padding: 'var(--space-rest) 0' }}>
          <div style={{ marginBottom: 'var(--space-rest)' }}>
            <label style={{
              display: 'block',
              color: 'rgba(254, 252, 251, 0.9)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              marginBottom: 'var(--space-breath)',
              letterSpacing: 'var(--tracking-wide)'
            }}>
              Name (optional)
            </label>
            <input
              type="text"
              value={userPreferences.displayName}
              onChange={(e) => setUserPreferences(prev => ({
                ...prev,
                displayName: e.target.value
              }))}
              placeholder="What would you like to be called?"
              style={{
                width: '100%',
                padding: isCrisisMode ? '16px' : 'var(--space-breath)',
                borderRadius: isCrisisMode ? '8px' : '12px',
                border: isCrisisMode ? '2px solid rgba(164, 183, 146, 0.5)' : '1px solid rgba(164, 183, 146, 0.3)',
                background: isCrisisMode ? 'rgba(254, 252, 251, 0.9)' : 'rgba(254, 252, 251, 0.05)',
                color: isCrisisMode ? '#2e2e2e' : 'var(--sanctuary-white)',
                fontSize: isCrisisMode ? '18px' : 'max(16px, var(--text-base))', // Prevent zoom on iOS
                outline: 'none',
                transition: isLowBattery ? 'none' : 'all 0.2s var(--ease-sanctuary)',
                minHeight: '48px' // Minimum touch target
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                if (!isLowBattery) {
                  e.target.style.boxShadow = isCrisisMode 
                    ? '0 0 0 4px rgba(164, 183, 146, 0.2)'
                    : '0 0 0 3px rgba(164, 183, 146, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isCrisisMode 
                  ? 'rgba(164, 183, 146, 0.5)' 
                  : 'rgba(164, 183, 146, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(254, 252, 251, 0.9)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-medium)',
              marginBottom: 'var(--space-breath)',
              letterSpacing: 'var(--tracking-wide)'
            }}>
              Pronouns (optional)
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: 'var(--space-breath)'
            }}>
              {['they/them', 'she/her', 'he/him', 'other'].map((pronoun) => (
                <button
                  key={pronoun}
                  onClick={() => handleTouchSafeAction(() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      pronouns: pronoun === 'other' ? '' : pronoun
                    }));
                  })}
                  className={`${touchTargetClass} touch-target`}
                  style={{
                    padding: isCrisisMode ? '12px 16px' : 'var(--space-whisper) var(--space-breath)',
                    borderRadius: isCrisisMode ? '12px' : '20px',
                    border: userPreferences.pronouns === pronoun 
                      ? `${isCrisisMode ? '3px' : '2px'} solid var(--color-primary)`
                      : `${isCrisisMode ? '2px' : '1px'} solid rgba(164, 183, 146, 0.3)`,
                    background: userPreferences.pronouns === pronoun 
                      ? isCrisisMode ? 'rgba(164, 183, 146, 0.3)' : 'rgba(164, 183, 146, 0.2)'
                      : isCrisisMode ? 'rgba(254, 252, 251, 0.9)' : 'rgba(254, 252, 251, 0.05)',
                    color: isCrisisMode ? '#2e2e2e' : 'var(--sanctuary-white)',
                    fontSize: isCrisisMode ? '16px' : 'var(--text-sm)',
                    cursor: 'pointer',
                    transition: isLowBattery ? 'none' : 'all 0.2s var(--ease-sanctuary)',
                    fontWeight: isCrisisMode ? '600' : 'normal'
                  }}
                  onMouseEnter={(e) => {
                    if (userPreferences.pronouns !== pronoun) {
                      e.currentTarget.style.background = 'rgba(164, 183, 146, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (userPreferences.pronouns !== pronoun) {
                      e.currentTarget.style.background = 'rgba(254, 252, 251, 0.05)';
                    }
                  }}
                >
                  {pronoun}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
      action: {
        text: isCrisisMode ? 'Continue when ready' : 'Continue',
        onClick: () => handleTouchSafeAction(() => goToNextStep())
      },
      skipable: true
    },
    {
      id: 'archetype',
      title: 'Choose how ALCHM speaks to you',
      subtitle: 'Select your preferred guidance style',
      content: (
        <div style={{ padding: 'var(--space-rest) 0' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-breath)'
          }}>
            {[
              {
                id: 'sage',
                name: 'The Sage',
                icon: '🔮',
                description: 'Wise, mystical guidance with ancient wisdom',
                personality: 'Speaks in metaphors, offers deep insights'
              },
              {
                id: 'coach',
                name: 'The Coach',
                icon: '💪',
                description: 'Supportive, practical guidance for growth',
                personality: 'Encouraging, solution-focused, empowering'
              },
              {
                id: 'poet',
                name: 'The Poet',
                icon: '🌙',
                description: 'Gentle, artistic guidance with beautiful language',
                personality: 'Creative, expressive, emotionally resonant'
              }
            ].map((archetype) => (
              <button
                key={archetype.id}
                onClick={() => handleTouchSafeAction(() => {
                  setUserPreferences(prev => ({
                    ...prev,
                    kheperaArchetype: archetype.id
                  }));
                })}
                className={`${touchTargetClass} touch-target`}
                style={{
                  padding: isCrisisMode ? '20px' : 'var(--space-rest)',
                  borderRadius: isCrisisMode ? '12px' : '16px',
                  border: userPreferences.kheperaArchetype === archetype.id 
                    ? `${isCrisisMode ? '3px' : '2px'} solid var(--color-primary)`
                    : `${isCrisisMode ? '2px' : '1px'} solid rgba(164, 183, 146, 0.2)`,
                  background: userPreferences.kheperaArchetype === archetype.id
                    ? isCrisisMode ? 'rgba(164, 183, 146, 0.25)' : 'rgba(164, 183, 146, 0.15)'
                    : isCrisisMode ? 'rgba(254, 252, 251, 0.9)' : 'rgba(254, 252, 251, 0.05)',
                  cursor: 'pointer',
                  transition: isLowBattery ? 'none' : 'all 0.2s var(--ease-sanctuary)',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (userPreferences.kheperaArchetype !== archetype.id) {
                    e.currentTarget.style.background = 'rgba(164, 183, 146, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (userPreferences.kheperaArchetype !== archetype.id) {
                    e.currentTarget.style.background = 'rgba(254, 252, 251, 0.05)';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-breath)'
                }}>
                  <span style={{ fontSize: isCrisisMode ? '2.5rem' : '2rem' }}>{archetype.icon}</span>
                  <div>
                    <h3 style={{
                      color: isCrisisMode ? '#2e2e2e' : 'var(--sanctuary-white)',
                      fontSize: isCrisisMode ? '1.3rem' : 'var(--text-lg)',
                      fontWeight: isCrisisMode ? '700' : 'var(--font-medium)',
                      marginBottom: 'var(--space-whisper)'
                    }}>
                      {archetype.name}
                    </h3>
                    <p style={{
                      color: isCrisisMode ? '#555555' : 'rgba(254, 252, 251, 0.8)',
                      fontSize: isCrisisMode ? '1rem' : 'var(--text-sm)',
                      marginBottom: 'var(--space-whisper)',
                      lineHeight: 'var(--leading-relaxed)'
                    }}>
                      {archetype.description}
                    </p>
                    <p style={{
                      color: 'rgba(254, 252, 251, 0.6)',
                      fontSize: 'var(--text-xs)',
                      fontStyle: 'italic'
                    }}>
                      {archetype.personality}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ),
      action: {
        text: isCrisisMode ? 'This feels right' : 'Continue',
        onClick: () => handleTouchSafeAction(() => goToNextStep())
      }
    },
    {
      id: 'first-entry',
      title: 'Your first reflection awaits',
      subtitle: 'Ready to begin your healing journey?',
      content: (
        <div style={{ textAlign: 'center', padding: 'var(--space-rest) 0' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 'var(--space-rest)',
            filter: 'drop-shadow(0 2px 4px rgba(164, 183, 146, 0.3))'
          }}>
            ✍️
          </div>
          <p style={{
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'rgba(254, 252, 251, 0.9)',
            maxWidth: '400px',
            margin: '0 auto var(--space-rest)'
          }}>
            Everything you need is already within you. ALCHM is here to help you discover it.
          </p>
          <div style={{
            background: 'rgba(164, 183, 146, 0.1)',
            border: '1px solid rgba(164, 183, 146, 0.2)',
            borderRadius: '12px',
            padding: 'var(--space-rest)',
            fontSize: 'var(--text-sm)',
            color: 'rgba(254, 252, 251, 0.8)',
            fontStyle: 'italic'
          }}>
            "What brought you here today? What does your heart need to say?"
          </div>
        </div>
      ),
      action: {
        text: isCrisisMode ? 'Begin my journey' : 'Start Writing',
        onClick: () => handleTouchSafeAction(() => {
          saveUserPreferences();
          router.push('/journal?onboarded=true');
        })
      }
    }
  ];

  const saveUserPreferences = async () => {
    try {
      // In production, save to Firestore user profile
      localStorage.setItem('alchm_user_preferences', JSON.stringify(userPreferences));
      localStorage.setItem('alchm_onboarding_completed', 'true');
      
      // Update user display name if provided
      if (userPreferences.displayName && user) {
        // Would update Firebase Auth profile in production
        console.log('Saving user preferences:', userPreferences);
      }
      
      onComplete();
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  const skipOnboarding = () => {
    handleTouchSafeAction(() => {
      saveProgress('onboarding_skipped', false, 'user_initiated');
      saveUserPreferences();
      router.push('/dashboard');
    });
  };
  
  // Crisis mode style overrides
  const touchTargetClass = isCrisisMode 
    ? 'min-h-[60px] min-w-[60px] text-lg font-semibold border-2 border-red-400' 
    : 'min-h-[52px] min-w-[52px]';
    
  const crisisStyles = isCrisisMode ? {
    filter: 'contrast(1.2) brightness(1.1)',
    fontSize: '18px',
  } : {};

  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return null;
  }

  return (
    <div className={`trauma-informed-mobile-ux ${isCrisisMode ? 'crisis-active' : ''} ${isLowBattery ? 'battery-saver-mode' : ''}`} style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(164, 183, 146, 0.1) 0%, rgba(76, 107, 94, 0.2) 100%)',
      backdropFilter: isLowBattery ? 'none' : 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: isCrisisMode ? '24px' : '16px',
      ...crisisStyles
    }}>
      {/* Background decoration - hidden in crisis mode for focus */}
      {!isCrisisMode && !isLowBattery && (
        <>
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(164, 183, 146, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(164, 183, 146, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }} />
        </>
      )}

      {/* Main onboarding card */}
      <div style={{
        background: isCrisisMode ? 'rgba(254, 252, 251, 0.95)' : 'rgba(254, 252, 251, 0.1)',
        backdropFilter: isLowBattery ? 'none' : 'blur(40px)',
        border: isCrisisMode ? '3px solid rgba(164, 183, 146, 0.8)' : '1px solid rgba(164, 183, 146, 0.2)',
        borderRadius: isCrisisMode ? '16px' : '24px',
        padding: isCrisisMode ? '32px' : 'var(--space-sanctuary)',
        maxWidth: isCrisisMode ? '600px' : '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: isLowBattery ? 'none' : '0 20px 64px rgba(164, 183, 146, 0.15), 0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        margin: '16px'
      }}>
        {/* Mobile-friendly progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-sanctuary)',
          gap: isCrisisMode ? '12px' : 'var(--space-whisper)'
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: isCrisisMode ? '12px' : '8px',
                height: isCrisisMode ? '12px' : '8px',
                borderRadius: '50%',
                background: index <= currentStep 
                  ? 'var(--color-primary)' 
                  : 'rgba(164, 183, 146, 0.3)',
                transition: isLowBattery ? 'none' : 'all 0.3s var(--ease-sanctuary)',
                border: isCrisisMode ? '2px solid rgba(164, 183, 146, 0.6)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-sanctuary)' }}>
          <h1 style={{
            color: 'var(--sanctuary-white)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-light)',
            marginBottom: currentStepData.subtitle ? 'var(--space-whisper)' : 'var(--space-rest)',
            lineHeight: 'var(--leading-tight)'
          }}>
            {currentStepData.title}
          </h1>
          
          {currentStepData.subtitle && (
            <p style={{
              color: 'rgba(254, 252, 251, 0.8)',
              fontSize: 'var(--text-base)',
              marginBottom: 'var(--space-rest)'
            }}>
              {currentStepData.subtitle}
            </p>
          )}
        </div>

        {currentStepData.content}

        {/* Actions */}
        {/* Mobile-optimized action buttons */}
        <div style={{
          display: 'flex',
          flexDirection: isCrisisMode ? 'column' : 'row',
          gap: isCrisisMode ? '16px' : 'var(--space-breath)',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 'var(--space-sanctuary)'
        }}>
          {currentStepData.skipable && showSkip && (
            <button
              onClick={() => handleTouchSafeAction(() => goToNextStep('user_skip'))}
              className={`${touchTargetClass} touch-target`}
              style={{
                background: 'transparent',
                color: isCrisisMode ? 'rgba(100, 100, 100, 0.8)' : 'rgba(254, 252, 251, 0.7)',
                border: isCrisisMode ? '2px solid rgba(164, 183, 146, 0.3)' : 'none',
                fontSize: isCrisisMode ? '16px' : 'var(--text-sm)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: isCrisisMode ? '12px 24px' : 'var(--space-whisper)',
                borderRadius: isCrisisMode ? '12px' : '6px',
                width: isCrisisMode ? '100%' : 'auto'
              }}
            >
              {isCrisisMode ? 'Skip this step' : 'Skip'}
            </button>
          )}
          
          <button
            onClick={currentStepData.action.onClick}
            className={`${touchTargetClass} touch-target`}
            style={{
              background: isCrisisMode 
                ? 'linear-gradient(145deg, #a4b792 0%, #8fa37c 100%)'
                : 'linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
              color: 'var(--sanctuary-white)',
              border: isCrisisMode ? '3px solid rgba(164, 183, 146, 0.6)' : 'none',
              padding: isCrisisMode ? '16px 32px' : 'var(--space-breath) var(--space-comfort)',
              borderRadius: isCrisisMode ? '16px' : '24px',
              fontSize: isCrisisMode ? '18px' : 'var(--text-base)',
              fontWeight: isCrisisMode ? '600' : 'var(--font-medium)',
              cursor: 'pointer',
              minWidth: isCrisisMode ? '100%' : '140px',
              transition: isLowBattery ? 'none' : 'all 0.2s var(--ease-sanctuary)',
              boxShadow: isLowBattery ? 'none' : '0 4px 16px rgba(164, 183, 146, 0.25)',
              width: isCrisisMode ? '100%' : 'auto'
            }}
            onMouseEnter={(e) => {
              if (!isLowBattery && !isCrisisMode) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(164, 183, 146, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLowBattery && !isCrisisMode) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(164, 183, 146, 0.25)';
              }
            }}
          >
            {currentStepData.action.text}
          </button>
        </div>

        {/* Skip all option with offline indicator */}
        {showSkip && currentStep > 0 && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-rest)' }}>
            <button
              onClick={skipOnboarding}
              className={`${touchTargetClass} touch-target`}
              style={{
                background: 'transparent',
                color: isCrisisMode ? 'rgba(100, 100, 100, 0.7)' : 'rgba(254, 252, 251, 0.6)',
                border: isCrisisMode ? '1px solid rgba(164, 183, 146, 0.3)' : 'none',
                fontSize: isCrisisMode ? '14px' : 'var(--text-xs)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: isCrisisMode ? '8px 16px' : 'var(--space-whisper)',
                letterSpacing: 'var(--tracking-wide)',
                borderRadius: isCrisisMode ? '8px' : '4px'
              }}
            >
              {isCrisisMode ? "I'll go at my own pace" : "I'll explore on my own"}
            </button>
            
            {/* Offline mode indicator */}
            {(isOffline || isOfflineMode) && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'rgba(245, 158, 11, 0.8)'
              }}>
                📡 Your progress is saved offline
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}