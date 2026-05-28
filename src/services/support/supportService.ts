import { getSupportCategoryDefinition } from '@/config/supportCategories';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { SUPPORT_EMAIL } from '@/config/supportBoundaries';
import type {
  DiagnosticsOptInState,
  SupportCategory,
  SupportRequestPayload,
  SupportSubmissionResult,
} from '@/types/support';
import { classifySupportBoundary } from './supportBoundaryClassifier';
import { buildSupportDiagnosticsMetadata } from './supportMetadata';

export interface PrepareSupportRequestInput {
  category: SupportCategory | '';
  message: string;
  diagnostics: DiagnosticsOptInState;
}

function normalizeWhitespace(value: string): string {
  return value
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function buildSupportBody(payload: SupportRequestPayload): string {
  const category = getSupportCategoryDefinition(payload.category);
  const sections = [
    `Category: ${category.label}`,
    '',
    'Message:',
    payload.message,
  ];

  if (payload.diagnostics) {
    sections.push(
      '',
      'Diagnostics:',
      `Build: ${payload.diagnostics.appBuild}`,
      `Platform: ${payload.diagnostics.platform}`,
      payload.diagnostics.locale ? `Locale: ${payload.diagnostics.locale}` : ''
    );
  }

  return sections.filter(Boolean).join('\n');
}

export function prepareSupportRequest(
  input: PrepareSupportRequestInput
): SupportRequestPayload | SupportSubmissionResult {
  if (!input.category) {
    return {
      ok: false,
      boundary: 'standard',
      errorCode: 'missing_category',
    };
  }

  const message = normalizeWhitespace(input.message);

  if (!message) {
    return {
      ok: false,
      boundary: 'standard',
      errorCode: 'missing_message',
    };
  }

  if (message.length > SUPPORT_COPY.maxMessageLength) {
    return {
      ok: false,
      boundary: 'standard',
      errorCode: 'message_too_long',
    };
  }

  return {
    category: input.category,
    message,
    includeDiagnostics: input.diagnostics.includeDiagnostics,
    diagnostics: buildSupportDiagnosticsMetadata(input.diagnostics),
    boundary: classifySupportBoundary(message),
  };
}

export function buildSupportMailtoHref(payload: SupportRequestPayload): string {
  const category = getSupportCategoryDefinition(payload.category);
  const subject = encodeURIComponent(`ALCHM support — ${category.label}`);
  const body = encodeURIComponent(buildSupportBody(payload));
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

export function launchSupportMailto(mailtoHref: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const link = document.createElement('a');
  link.href = mailtoHref;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  return true;
}

export async function submitSupportRequest(
  input: PrepareSupportRequestInput
): Promise<SupportSubmissionResult> {
  const prepared = prepareSupportRequest(input);

  if ('ok' in prepared) {
    return prepared;
  }

  const mailtoHref = buildSupportMailtoHref(prepared);
  const launched = launchSupportMailto(mailtoHref);

  if (!launched) {
    return {
      ok: false,
      boundary: prepared.boundary,
      errorCode: 'submission_unavailable',
    };
  }

  return {
    ok: true,
    boundary: prepared.boundary,
    mailtoHref,
  };
}
