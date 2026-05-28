import { SUPPORT_BOUNDARY_RULES, SUPPORT_EMAIL } from '@/config/supportBoundaries';

export const SUPPORT_COPY = {
  pageTitle: 'Support',
  pageDescription:
    'Support can help with product, account, billing, privacy, export, and technical issues.',
  introBody:
    'Support can help with product, account, billing, privacy, export, and technical issues.',
  scopeBody: SUPPORT_BOUNDARY_RULES.scope,
  limitsBody: SUPPORT_BOUNDARY_RULES.notCounseling,
  safetyBody: SUPPORT_BOUNDARY_RULES.safetyRedirect,
  responseWindow: SUPPORT_BOUNDARY_RULES.responseWindow,
  categoryLabel: 'Category',
  categoryPlaceholder: 'Choose a support category',
  messageLabel: 'What is happening?',
  messageHelper:
    'Describe the screen, account, purchase, or product issue. Do not paste private journal entries unless they are strictly necessary to describe a bug.',
  diagnosticsLabel: 'Include app details',
  diagnosticsHelper:
    'This includes app build, platform, and language. It does not include journal text.',
  submitLabel: 'Send to support',
  safetyCardTitle: 'Safety resources',
  safetyCardBody:
    'If what is happening feels urgent or unsafe, use Safety resources instead of support.',
  safetyCardAction: 'Open Safety resources',
  confirmationTitle: 'Your support message is ready.',
  confirmationBody:
    'ALCHM opened your email app with a structured message for support.',
  confirmationAction: 'Open Mail again',
  errorTitle: 'Your message could not be prepared.',
  errorBody: `Try again or email ${SUPPORT_EMAIL}.`,
  emptyMessageError: 'Add a short description before sending.',
  emptyCategoryError: 'Choose a category before sending.',
  tooLongMessageError: 'Keep the message under 2000 characters.',
  maxMessageLength: 2000,
  boundaryNotice:
    'Support can review product and account issues, but it cannot respond to personal or emotional content in the way a therapist, counselor, or crisis service can.',
  crisisNotice:
    'Support is not able to provide crisis help. If you may be at immediate risk, call or text 988 now if you are in the U.S., or use local emergency or crisis services where you are.',
} as const;
