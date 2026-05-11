import type { KheperaResponse } from '@/types/khepera';

export interface ArcPoint {
  sessionId: string;
  sessionDate: Date;
  tone: string;
  themes: string[];
}

export interface ThreadData {
  theme: string;
  label: string;
  count: number;
  lastSeen: Date;
}

export interface ToneShift {
  from: string;
  to: string;
  message: string;
}

export interface MirrorData {
  arc: ArcPoint[];
  dominantTone: string | null;
  toneShift: ToneShift | null;
  recurringThemes: ThreadData[];
  allThemes: string[];
  openSeeds: string[];
  kheperaObservation: string | null;
  observationGeneratedAt: Date | null;
  delayedReturn: MirrorReturnState;
  sessionCount: number;
  hasEnoughData: boolean;
  isLoading: boolean;
  error: Error | null;
}

export type MirrorReturnState =
  | { state: 'empty' }
  | { state: 'waiting'; scheduledAt: Date | null }
  | { state: 'returned'; entryId: string; response: KheperaResponse | null };

export interface ArcVisualizationProps {
  arc: ArcPoint[];
  className?: string;
}

export interface PrivacySheetProps {
  onClose: () => void;
  userId: string;
}
