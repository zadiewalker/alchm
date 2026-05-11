import type { NotificationPreference } from '@/types/user';

export type SupportedAuthProvider = 'anonymous' | 'apple' | 'email';

export interface AuthProfileSeed {
  displayName?: string;
  notificationPreference?: NotificationPreference;
}

export type AuthFlowResult = 'complete' | 'redirect';
