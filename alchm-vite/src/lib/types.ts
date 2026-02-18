'use client';

export type PageState = 'loading' | 'ready' | 'empty' | 'error';

export type EntryType = 'journal' | 'checkin' | 'onboarding';

// Keep shapes compatible with the existing app's localStorage payloads.
export interface JournalEntry {
  id: string;
  // For anonymous/device-only usage.
  userId?: string;
  title?: string;
  content: string;

  // Mood is a 1-10 slider in the existing app (optional).
  mood?: number;
  // Depth layer (optional, v2+): user-named emotion + somatic check-in.
  emotionSelection?: {
    familyId: import('@/lib/emotions').EmotionFamily;
    specificId: string | null;
    label: string;
  };
  somatic?: {
    region: import('@/lib/somatic').BodyRegionId;
    description: string | null;
  };
  followUp?: {
    question: string;
    response: string | null;
  };
  // Optional post-reflection extraction (Intelligence Layer). Stored as strings so
  // older installs and UI mapping can evolve without breaking stored data.
  extractedMood?: string | null;
  extractedThemes?: string[];
  intensity?: number; // 1-10
  suggestedLens?: 'cbt' | 'ifs' | 'somatic' | 'narrative' | 'existential' | null;
  emotions: string[];
  tags: string[];

  type?: EntryType;
  isPrivate?: boolean;

  // Stored as ISO strings once serialized for on-device storage.
  createdAt: string;
  updatedAt: string;

  pathwayId?: string;
  pathwayStep?: number;

  // Reflection storage has multiple historical fields in the existing codebase.
  kheperaReflection?: string;
  insights?: string[];
  kheperaFrameworks?: string[];
  moodWords?: string[];
}

export interface AppSettings {
  theme: 'dark';
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  eveningCheckInEnabled: boolean;
  eveningCheckInTime: string;
  autoSaveEnabled: boolean;
  autoSaveIntervalMs: number;
  preferredFramework: string | null;
  lastExportDate: string | null;
}

export type SubscriptionTier = 'free' | 'reflections' | 'sanctuary';

export interface TierLimits {
  entriesPerMonth: number | null;
  kheperaReflections: number | null;
  kheperaFollowUps: number | null;
  pathwayAccess: boolean;
  themeExtraction: boolean;
  weeklyReflections: boolean;
  dataExport: boolean;
  eveningCheckIn: boolean;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  expiresAt: string | null;
  reflectionsUsedThisMonth: number;
  monthResetDate: string;
  followUpsUsedThisMonth: number;
}
