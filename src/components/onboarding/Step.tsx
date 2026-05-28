'use client';

import type React from 'react';
import { ALCHMWordmark } from '@/components/ui/ALCHMWordmark';
import { AppText } from '@/components/ui/AppText';

type OnboardingStepProps = {
  title: string;
  body: string;
  grounding?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  showSecondary?: boolean;
  footer?: React.ReactNode;
  shellClassName?: string;
};

export function OnboardingStep({
  title,
  body,
  grounding,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showSecondary = true,
  footer,
  shellClassName,
}: OnboardingStepProps): React.JSX.Element {
  return (
    <div className="onboarding-wordmark-screen onboarding-step-screen">
      <div className={['onboarding-step-shell', shellClassName].filter(Boolean).join(' ')}>
        <div className="onboarding-top-brand-region onboarding-wordmark-slot">
          <ALCHMWordmark variant="onboarding" />
        </div>

        <div className="onboarding-center-content-region onboarding-step-copy">
          <AppText variant="display" as="h1" className="onboarding-step-title">
            {title}
          </AppText>
          <AppText variant="secondary" as="p" className="onboarding-step-body">
            {body}
          </AppText>
        </div>

        <div className="onboarding-bottom-action-region">
          <div className="onboarding-step-actions">
            {grounding ? (
              <AppText variant="caption" as="p" className="onboarding-step-ground">
                {grounding}
              </AppText>
            ) : null}
            <button type="button" className="btn-primary" onClick={onPrimary}>
              {primaryLabel}
            </button>
            {secondaryLabel && onSecondary && showSecondary ? (
              <button type="button" className="btn-ghost" onClick={onSecondary}>
                {secondaryLabel}
              </button>
            ) : null}
          </div>

          {footer ? (
            <div className="onboarding-step-footer">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
