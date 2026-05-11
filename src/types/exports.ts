import type { EmotionalTone, ThemeTag } from './journal.ts';

export type ReflectionExportPurpose =
  | 'reflection_export'
  | 'conversation_summary'
  | 'session_reflection_brief';

export type ReflectionExportFraming =
  | 'shareable_reflection'
  | 'personal_conversation'
  | 'just_for_me';

export type ReflectionExportTimeWindow =
  | 'last_2_weeks'
  | 'last_month'
  | 'last_3_months'
  | 'custom_selected_items';

export type ReflectionExportSourceType =
  | 'journal_entry'
  | 'khepera_reflection'
  | 'return';

export interface ReflectionExportSelectedSource {
  id: string;
  sourceType: ReflectionExportSourceType;
  createdAt: string;
  content: string;
}

export interface ReflectionExportSelectedExcerptInput {
  id: string;
  sourceId: string;
  sourceType: ReflectionExportSourceType;
  createdAt: string;
  excerpt: string;
}

export interface ReflectionExportSourceManifest {
  selectedSourceIds: string[];
  selectedExcerptIds: string[];
  sourceCount: number;
  excerptCount: number;
}

export interface ReflectionExportInput {
  documentTitle?: string;
  generatedAt: string;
  purpose: ReflectionExportPurpose;
  framing: ReflectionExportFraming;
  timeWindow: ReflectionExportTimeWindow;
  selectedSources: ReflectionExportSelectedSource[];
  selectedExcerpts: ReflectionExportSelectedExcerptInput[];
  themeTags?: ThemeTag[];
  emotionalTones?: EmotionalTone[];
  userNote?: string;
  includeSourceManifest?: boolean;
}

export interface ReflectionExportSelectedExcerpt {
  sourceId: string;
  sourceType: ReflectionExportSourceType;
  createdAt: string;
  excerpt: string;
}

export interface ReflectionExportDocument {
  documentTitle: string;
  generatedAt: string;
  exportVersion: string;
  purpose: string;
  whatHasBeenPresent: string;
  recurringThreads: string[];
  emotionalLandscape: string;
  selectedExcerpts: ReflectionExportSelectedExcerpt[];
  conversationOpenings: string[];
  userNote?: string;
  boundaryNote: string;
  sourceManifest?: ReflectionExportSourceManifest;
}

export interface ReflectionExportValidationIssue {
  code:
    | 'invalid_json'
    | 'schema_type'
    | 'schema_required'
    | 'schema_additional_property'
    | 'schema_enum'
    | 'schema_const'
    | 'schema_min_length'
    | 'schema_max_length'
    | 'schema_min_items'
    | 'schema_max_items'
    | 'schema_format'
    | 'banned_diagnostic_language'
    | 'banned_treatment_language'
    | 'banned_therapist_instruction'
    | 'banned_behavior_inference'
    | 'unselected_excerpt'
    | 'excerpt_mismatch';
  path: string;
  message: string;
}

export interface ReflectionExportValidationWarning {
  code:
    | 'weak_purpose'
    | 'shallow_recurring_thread'
    | 'generic_emotional_landscape'
    | 'weak_conversation_opening'
    | 'repetitive_conversation_opening'
    | 'abstract_language';
  path: string;
  message: string;
}

export interface ReflectionExportValidationResult {
  ok: boolean;
  issues: ReflectionExportValidationIssue[];
  warnings: ReflectionExportValidationWarning[];
  value?: ReflectionExportDocument;
}

export interface ReflectionExportGenerationRequest {
  schemaName: 'reflection_export';
  schemaVersion: string;
  systemPrompt: string;
  userPrompt: string;
}

export interface ReflectionExportDocumentOutput {
  fileName: string;
  markdown: string;
  html: string;
}

export interface ReflectionExportBuildResult {
  input: ReflectionExportInput;
  document: ReflectionExportDocument;
  output: ReflectionExportDocumentOutput;
  warnings: ReflectionExportValidationWarning[];
}
