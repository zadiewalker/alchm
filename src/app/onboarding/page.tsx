'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SacredOnboardingCeremony, { OnboardingConfig } from '@/components/onboarding/SacredOnboardingCeremony';
import { useAuth } from '@/hooks/useAuth';
import { SacredCard, SacredText } from '@/components/SacredUIFoundation';
import '@/styles/onboarding-ceremony.css';

// ===== ONBOARDING PAGE =====

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingComplete = async (config: OnboardingConfig) => {
    try {
      setIsCompleting(true);
      setError(null);

      // Save onboarding configuration to user profile
      await updateUserProfile({
        onboardingCompleted: true,
        onboardingConfig: {
          reflectionMode: config.reflectionMode,
          audioPreference: config.audioPreference,
          breathingGuideEnabled: config.breathingGuideEnabled,
          culturalContext: config.culturalContext,
          initialEmotionalState: config.initialEmotionalState,
          completedAt: new Date().toISOString()
        },
        preferences: {
          aiInteractionLevel: config.reflectionMode === 'guided' ? 'standard' : 'minimal',
          culturalFramework: config.culturalContext,
          audioEnabled: config.audioPreference,
          breathingExercises: config.breathingGuideEnabled
        }
      });

      // Navigate to main application
      setTimeout(() => {
        router.push('/journals');
      }, 1000);

    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      setError('There was an issue completing your setup. Please try again.');
      setIsCompleting(false);
    }
  };

  // Show loading state while completing
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-off-white to-healing-mist flex items-center justify-center">
        <SacredCard variant="gentle" className="text-center max-w-md mx-auto">
          <div className="space-y-breath">
            <div className="text-6xl animate-pulse">🌸</div>
            <SacredText variant="title" className="text-sage-green">
              Preparing Your Sanctuary
            </SacredText>
            <SacredText variant="body">
              Setting up your personal space for healing and growth...
            </SacredText>
            <div className="w-full bg-healing-mist rounded-full h-2 mt-breath">
              <div 
                className="h-2 bg-sage-green rounded-full animate-pulse"
                style={{ 
                  width: '100%',
                  backgroundColor: '#a4b792'
                }}
              />
            </div>
          </div>
        </SacredCard>
      </div>
    );
  }

  // Show error state if needed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-off-white to-healing-mist flex items-center justify-center">
        <SacredCard variant="gentle" className="text-center max-w-md mx-auto">
          <div className="space-y-breath">
            <div className="text-6xl">🌿</div>
            <SacredText variant="title" className="text-deep-presence">
              A Moment of Pause
            </SacredText>
            <SacredText variant="body" className="text-subtle">
              {error}
            </SacredText>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="sacred-button mt-breath"
              style={{ backgroundColor: '#a4b792' }}
            >
              Try Again
            </button>
          </div>
        </SacredCard>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <SacredOnboardingCeremony
        onComplete={handleOnboardingComplete}
        userCulture={user?.culturalContext || 'universal'}
        accessibilityMode={user?.accessibilityMode || false}
      />
    </div>
  );
}

// ===== PAGE METADATA =====

export const metadata = {
  title: 'Welcome to ALCHM | Sacred Onboarding',
  description: 'Enter your digital sanctuary for healing and growth. A gentle, trauma-informed onboarding ceremony.',
  robots: 'noindex, nofollow', // Private onboarding experience
};