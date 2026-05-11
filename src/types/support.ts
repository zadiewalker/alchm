export type SupportRequestType =
  | 'technical_issue'
  | 'billing_issue'
  | 'product_confusion'
  | 'emotional_boundary';

export type PersistableSupportRequestType =
  | 'technical_issue'
  | 'billing_issue'
  | 'product_confusion';

export type SupportPriority = 'P0' | 'P1' | 'P2';

export type SupportStatus = 'open' | 'in_progress' | 'resolved';

export type SupportCategory =
  | 'writing'
  | 'saving'
  | 'loading'
  | 'subscription'
  | 'account'
  | 'other';

export interface SupportContext {
  hasCrash?: boolean;
  isBlocking?: boolean;
  involvesPayment?: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  type: PersistableSupportRequestType;
  priority: SupportPriority;
  description: string;
  category?: SupportCategory;
  status: SupportStatus;
  createdAt: number;
  updatedAt: number;
}

export type SupportFailureStep =
  | 'indexeddb'
  | 'crisis'
  | 'anthropic'
  | 'firestore';

export type SupportBoundaryClassification =
  | 'standard'
  | 'emotional_boundary'
  | 'crisis_boundary';

export type SupportSubmissionErrorCode =
  | 'missing_category'
  | 'missing_message'
  | 'message_too_long'
  | 'submission_unavailable';

export type SupportPlatform = 'ios' | 'web' | 'unknown';

export interface DiagnosticsOptInState {
  includeDiagnostics: boolean;
}

export interface SupportDiagnosticsMetadata {
  appBuild: string;
  platform: SupportPlatform;
  locale?: string;
}

export interface SupportRequestPayload {
  category: SupportCategory;
  message: string;
  includeDiagnostics: boolean;
  diagnostics?: SupportDiagnosticsMetadata;
  boundary: SupportBoundaryClassification;
}

export interface SupportSubmissionResult {
  ok: boolean;
  boundary: SupportBoundaryClassification;
  mailtoHref?: string;
  errorCode?: SupportSubmissionErrorCode;
}
