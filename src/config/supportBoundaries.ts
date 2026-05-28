export const SUPPORT_EMAIL = 'support@alchm.app';

export const SUPPORT_BOUNDARY_RULES = {
  scope: 'Support is for product, account, billing, privacy, export, and technical issues only.',
  notCounseling: 'Support cannot provide counseling, emotional support, or crisis response.',
  safetyRedirect: 'If the issue is about immediate safety or crisis, use Safety resources instead.',
  responseWindow: 'Support is asynchronous and usually replies within one business day.',
} as const;

export const EMOTIONAL_BOUNDARY_KEYWORDS = [
  'trauma',
  'panic',
  'depressed',
  'depression',
  'abuse',
  'grief',
  'flashback',
  'hopeless',
  'unsafe',
] as const;
