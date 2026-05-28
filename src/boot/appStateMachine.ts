// src/boot/appStateMachine.ts

import { isOnboardingComplete } from '@/services/storage/storageMigrationService';

export type AppState =
  | { status: 'bootstrapping' }
  | { status: 'initializing_auth' }
  | { status: 'auth_ready'; userId: string | null }
  | { status: 'onboarding' }
  | { status: 'app_ready'; userId: string | null }
  | { status: 'error'; message: string; recoverable: boolean };

export type AppEvent =
  | { type: 'BOOTSTRAP_COMPLETE'; hasCompletedOnboarding: boolean }
  | { type: 'BOOTSTRAP_FAILED'; error: string }
  | { type: 'AUTH_RESOLVED'; userId: string | null }
  | { type: 'AUTH_TIMEOUT' }
  | { type: 'ONBOARDING_COMPLETE' }
  | { type: 'FATAL_ERROR'; message: string }
  | { type: 'RETRY' };

export function transition(state: AppState, event: AppEvent): AppState {
  switch (state.status) {
    case 'bootstrapping':
      if (event.type === 'BOOTSTRAP_COMPLETE') {
        return { status: 'initializing_auth' };
      }
      if (event.type === 'BOOTSTRAP_FAILED') {
        return { status: 'error', message: event.error, recoverable: true };
      }
      return state;

    case 'initializing_auth':
      if (event.type === 'AUTH_RESOLVED') {
        // Auth resolved (user logged in, logged out, or anonymous)
        // Check if we need onboarding from persisted storage (set during bootstrap)
        const needsOnboarding = !isOnboardingComplete();
        if (needsOnboarding) {
          return { status: 'onboarding' };
        }
        return { status: 'app_ready', userId: event.userId };
      }
      if (event.type === 'AUTH_TIMEOUT') {
        // Auth timed out — continue in offline mode, not an error
        console.warn('[Boot] Auth timeout — offline mode');
        const needsOnboarding = !isOnboardingComplete();
        if (needsOnboarding) {
          return { status: 'onboarding' };
        }
        return { status: 'app_ready', userId: null };
      }
      if (event.type === 'FATAL_ERROR') {
        return { status: 'error', message: event.message, recoverable: true };
      }
      return state;

    case 'onboarding':
      if (event.type === 'ONBOARDING_COMPLETE') {
        return { status: 'app_ready', userId: null }; // userId may be set after auth
      }
      return state;

    case 'app_ready':
      if (event.type === 'FATAL_ERROR') {
        return { status: 'error', message: event.message, recoverable: true };
      }
      return state;

    case 'error':
      if (event.type === 'RETRY') {
        return { status: 'bootstrapping' };
      }
      return state;

    default:
      return state;
  }
}
