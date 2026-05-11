import type { SubscriptionTier } from '@/types/subscriptions';
import type { SupportedAuthProvider } from '@/types/auth';

export type AppTier = SubscriptionTier;

export type { EntitlementStatus, OfferingPackageSummary as SubscriptionPackage } from '@/types/subscriptions';

export type NotificationPreference =
  | 'seeds_only'   // Only when Khepera has something specific
  | 'none';        // I'll come back when I'm ready

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  id: string;
  label: string;
  sublabel?: string;
  type: 'navigation' | 'toggle' | 'action' | 'link' | 'info' | 'destructive';
  value?: string | boolean;
  url?: string;
  onPress?: () => void;
}

export interface UserProfile {
  userId: string;
  email?: string;              // null for Apple sign-in with hidden email
  displayName?: string;
  authProvider: SupportedAuthProvider;
  tier: AppTier;
  notificationPreference: NotificationPreference;
  arrivalReason?: string;
  onboardingCompletedAt?: Date;
  createdAt: Date;
  lastSeenAt: Date;
  // Migration tracking
  wasAnonymous: boolean;       // true if migrated from anonymous
  anonymousUid?: string;       // original anonymous UID, for debugging
}

export interface AuthState {
  user: import('firebase/auth').User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAnonymous: boolean;
}
