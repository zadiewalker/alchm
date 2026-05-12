import type { Timestamp } from 'firebase/firestore';
import type { Container, ContainerState } from '@/services/containers/localContainersService';

export type ContainerCategory =
  | 'body-based awareness'
  | 'thought-feeling patterns'
  | 'relationship patterns'
  | 'grief and loss'
  | 'identity and self';

export type ContainerPhase = 'grounding' | 'pattern' | 'contact' | 'integration';
export type ContainerStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type ContainerTier = 'sanctuary' | 'transformation';
export type ContainerAtmosphere = 'quiet' | 'grounded' | 'expansive' | 'low-demand' | 'warm';

// Authored content — static, lives in config, never in Firestore
export interface ContainerDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ContainerCategory;
  tier: ContainerTier;
  atmosphere: ContainerAtmosphere;
  totalDays: 7 | 14 | 21;
  clinicalIntent: string;      // Internal — never shown to user
  openingRitual: string;       // Khepera's first words when entering
  days: ContainerDay[];
}

export interface ContainerDay {
  day: number;
  phase: ContainerPhase;
  prompt: string;
  kheperaIntent: string;       // Internal — never shown to user
  somaticAnchor?: string;
}

// User instance — lives in Firestore at users/{userId}/containers/{id}
export interface UserContainer {
  id: string;
  userId: string;
  containerId: string;
  containerName: string;
  tier: ContainerTier;
  status: ContainerStatus;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  currentDay: number;
  lastEntryAt?: Timestamp;
  missedDays: number[];
  sessionIds: string[];
  completionCeremonyViewed: boolean;
  carryForward?: string;
  leavingBehind?: string;
}

// What the UI receives — clean, no Firestore types
export interface ActiveContainerState {
  definition: ContainerDefinition;
  currentDay: number;
  phase: ContainerPhase;
  phaseMetaphor: string;
  todayPrompt: string;
  kheperaIntent: string;
  somaticAnchor?: string;
  hasWrittenToday: boolean;
  status: ContainerStatus;
  userContainerId: string;
}

export interface ContainerContext {
  containerId: string;
  userContainerId?: string;
  containerName: string;
  clinicalIntent: string;
  currentDay: number;
  phase: ContainerPhase;
  phaseArcNote: string;
  todayPrompt: string;
  kheperaIntent: string;
}

export interface ContainerCardProps {
  container: Container;
  state?: ContainerState;
  isActive?: boolean;
  isCompleted?: boolean;
  canAccess?: boolean;
  onEnroll?: () => void;
  onContinue?: () => void;
}

export interface ContainerCatalogCardProps {
  container: ContainerDefinition;
  isActive?: boolean;
  isCompleted?: boolean;
  canAccess?: boolean;
  onView?: () => void;
  onStart?: () => void;
  onContinue?: () => void;
}

export interface ContainerCompletionCeremonyProps {
  container: Container;
  entryCount: number;
  daysActive: number;
  onComplete: () => void;
}
