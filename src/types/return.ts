import type { EmotionalTone, ThemeTag } from '@/types/journal';
import type { ResurfacingToneMode } from './resurfacingTone';

export type ReturnType = 'seed' | 'pattern' | 'contrast';

export interface ReturnNavigationState {
  entryId: string;
  returnType: ReturnType;
  surfacedAt?: number;
  daysElapsed?: number;
  resurfacingTone?: ResurfacingToneMode;
}

export interface ParsedReturnSearchParams {
  entryId: string | null;
  returnType: ReturnType;
  surfacedAt?: number;
  daysElapsed?: number;
  resurfacingTone?: ResurfacingToneMode;
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

export interface RelevantReturnCandidate extends ReturnCandidateMetadata {
  returnType: ReturnType;
  relevance: number;
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
  candidate?: RelevantReturnCandidate;
  resurfacingTone?: ResurfacingToneMode;
}
