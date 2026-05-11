import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export type OnboardingScreen =
  | 'arrival'
  | 'what_this_is'
  | 'pause'
  | 'the_origin'
  | 'first_question'
  | 'meeting_khepera'
  | 'mini_entry'
  | 'account_creation'
  | 'container_selection'
  | 'notification_preference'
  | 'threshold';

export type ArrivalReason =
  | 'something_happened'
  | 'feelings_i_cant_name'
  | 'understand_myself'
  | 'recommended'
  | 'between_sessions'
  | 'i_dont_know';

export type NotificationPreference =
  | 'seeds_only'
  | 'none';

export interface OnboardingState {
  currentScreen: OnboardingScreen;
  arrivalReasons: ArrivalReason[];
  miniEntryText: string;
  miniEntryResponse: string;
  miniEntrySeed: string;
  selectedContainerId: string;
  notificationPreference: NotificationPreference;
  completedAt: string | null;
  skippedMiniEntry: boolean;
}

export type OnboardingStep =
  | 'arrival'
  | 'what_this_is'
  | 'pause'
  | 'origin'
  | 'first_question'
  | 'meeting_khepera'
  | 'mini_entry'
  | 'notification_preference'
  | 'threshold';

export interface OnboardingData {
  arrivalReasons: ArrivalReason[];
  selectedContainerId: string;
  notificationPreference: NotificationPreference;
  completedAt?: string | null;
}

export interface WhatThisIsProps {
  onContinue: () => void;
}

export interface MiniEntryProps {
  onContinue: (entryText: string, kheperaResponse: string, seed: string) => void;
}

export interface ArrivalProps {
  onContinue: () => void;
}

export interface TheOriginProps {
  onContinue: () => void;
  onSkip: () => void;
}

export interface FirstQuestionProps {
  onContinue: (selectedReasons: ArrivalReason[]) => void;
}

export interface ThresholdProps {
  onBegin: () => void;
}

export interface MeetingKheperaProps {
  onReady: () => void;
  onLearnMore: () => void;
}

export interface NotificationPreferenceProps {
  onContinue: (preference: NotificationPreference) => void;
}

export interface OnboardingNavigatorProps {
  onComplete?: () => void;
}

export interface OnboardingFlowProps {
  onComplete: () => void;
}

export interface OnboardingScreenProps {
  state: OnboardingState;
  update: (updates: Partial<OnboardingState>) => void;
  advance: (screen: OnboardingScreen) => void;
  complete: () => void;
  router: AppRouterInstance;
}

export const ARRIVAL_REASON_LABELS: Record<ArrivalReason, string> = {
  something_happened: 'Something happened and I need a place to put it',
  feelings_i_cant_name: 'I\'ve been carrying feelings I can\'t quite name',
  understand_myself: 'I want to notice my patterns more clearly',
  recommended: 'Someone pointed me here',
  between_sessions: 'I want a place to write between therapy sessions',
  i_dont_know: 'I\'m not fully sure. I just know I needed somewhere to begin.',
};
