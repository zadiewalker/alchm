'use client';

import { useRouter } from 'next/navigation';
import { AppText } from '@/components/ui/AppText';
import { OnboardingStep } from '@/components/onboarding/Step';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import { useOperationalEvents } from '@/hooks/useOperationalEvents';

type FlowStep = 'permissionless';

export function OnboardingFlow(): React.JSX.Element {
  const router = useRouter();
  const { navigate } = useInternalNavigation();
  const { complete } = useOnboarding();
  const recordEvent = useOperationalEvents();
  const step: FlowStep = 'permissionless';

  const handleFinish = () => {
    complete();
    router.replace('/journal/new');
  };

  const handleNotNow = () => {
    complete();
    router.replace('/dashboard');
  };

  const openEmergencyResources = () => {
    recordEvent('crisis_resources_opened', { source: 'onboarding' });
    navigate('/emergency', { source: 'onboarding_crisis_resources', surface: 'onboarding' });
  };

  if (step === 'permissionless') {
    return (
      <OnboardingStep
        title="Write what is here."
        body="One entry begins this. Khepera answers in three parts."
        primaryLabel="Start writing"
        onPrimary={handleFinish}
        showSecondary={false}
        shellClassName="onboarding-step-shell--welcome"
        footer={(
          <div className="onboarding-secondary-stack">
            <button
              type="button"
              className="btn-ghost onboarding-not-now-link"
              onClick={handleNotNow}
            >
              Not now
            </button>
            <button
              type="button"
              className="btn-ghost onboarding-crisis-link"
              onClick={openEmergencyResources}
            >
              In crisis? Resources
            </button>
          </div>
        )}
      />
    );
  }

  return (
    <div style={{ minHeight: '100dvh' }}>
      <AppText variant="body">Loading…</AppText>
    </div>
  );
}
