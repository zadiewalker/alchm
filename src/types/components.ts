import type { CSSProperties, ReactNode } from 'react';
import type { LunarPhase } from '@/config/containerArc';
import type { KheperaResponse } from '@/types/khepera';

export type LocalizationProviderProps = {
  children: ReactNode;
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
};

export type BootErrorScreenProps = {
  message: string;
  detail?: string;
  onRetry: () => void;
};

export type HealthDisclaimerProps = {
  variant?: 'full' | 'compact' | 'onboarding';
};

export type KheperaScarabProps = {
  size?: number;
  showSunDisk?: boolean;
  style?: CSSProperties;
  className?: string;
  decorative?: boolean;
  ariaLabel?: string;
};

export type SeedDisplayProps = {
  seed: string;
  style?: CSSProperties;
};

export type KheperaReflectionProps = {
  response: KheperaResponse;
  onContinue?: () => void;
};

export type TierGateFeature =
  | 'container_21day'
  | 'exercises_full'
  | 'mirror_full'
  | 'memory_full';

export type TierGateProps = {
  children: ReactNode;
  feature: TierGateFeature;
  fallback?: ReactNode;
};

export type NotificationPermissionPromptProps = {
  onDismiss?: () => void;
};

export type ArcReflectionCardProps = {
  text: string;
  loading?: boolean;
  onDismiss: () => void;
};

export type MoonPhaseIndicatorProps = {
  phase: LunarPhase;
  metaphorText: string;
  size?: number;
  style?: CSSProperties;
};

export type CrisisModalProps = {
  isOpen?: boolean;
  onClose: () => void;
};

export type LoadingProps = {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
};

export type MigrationStatus = 'none' | 'pending' | 'running' | 'completed' | 'error';

export type MigrationPromptProps = {
  migrationStatus: MigrationStatus;
  onMigrate: () => Promise<void>;
  onDismiss: () => void;
  isVisible: boolean;
};

export type JournalSuccessCeremonyProps = {
  isVisible: boolean;
  onComplete: () => void;
  hasKheperaResponse: boolean;
};
