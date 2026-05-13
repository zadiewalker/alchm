import type { EmotionalTone, ThemeTag } from '@/types/journal';

export type ReturnType = 'seed' | 'pattern' | 'contrast';

export interface ReturnNavigationState {
  entryId: string;
  returnType: ReturnType;
  surfacedAt?: number;
  daysElapsed?: number;
}

export interface ParsedReturnSearchParams {
  entryId: string | null;
  returnType: ReturnType;
  surfacedAt?: number;
  daysElapsed?: number;
}

export interface ReturnThresholdData {
  entryId: string;
  excerpt: string;
  daysAgo: number;
}

export interface ReturnCandidateMetadata {
  entryId: string;
  createdAt: number;
  emotionalTone: EmotionalTone;
  themes: ThemeTag[];
}

export interface ReturnHistoryMetadata extends ReturnCandidateMetadata {
  surfacedAt: number;
  returnType: ReturnType;
}

export interface RankedReturnCandidate extends ReturnCandidateMetadata {
  returnType: ReturnType;
  score: number;
}

export interface ReturnSelectionResult {
  entryId: string | null;
  returnType: ReturnType;
  suppressed: boolean;
  reason?:
    | 'high_intensity_hold'
    | 'missing_entry_context'
    | 'weak_current_metadata'
    | 'recent_return_spacing';
  candidate?: RankedReturnCandidate;
}
