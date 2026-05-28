import type { SupportRequestType } from '@/types/support';

export const SUPPORT_DESCRIPTION_MAX_LENGTH = 500;

export const SUPPORT_RESPONSE_WINDOW_COPY = 'You’ll hear back within 24–48 hours.';

export const SUPPORT_OPTIONS: Array<{
  type: SupportRequestType;
  label: string;
}> = [
  { type: 'technical_issue', label: 'Something isn’t working' },
  { type: 'billing_issue', label: 'Billing or subscription' },
  { type: 'product_confusion', label: 'I’m confused about something' },
  { type: 'emotional_boundary', label: 'Something feels off' },
];

export const SUPPORT_GUIDANCE: Record<SupportRequestType, {
  title: string;
  body: string[];
  escalationLabel: string;
}> = {
  technical_issue: {
    title: 'Let’s try a few quick checks',
    body: [
      'Make sure you’re using the latest version of ALCHM.',
      'Close and reopen the app.',
      'Check your connection.',
    ],
    escalationLabel: 'This didn’t help',
  },
  billing_issue: {
    title: 'Subscriptions are managed through Apple',
    body: [
      'You can view or cancel your subscription in Apple ID settings.',
      'Changes may take a few minutes to appear in ALCHM.',
    ],
    escalationLabel: 'I still need help',
  },
  product_confusion: {
    title: 'How ALCHM works',
    body: [
      'ALCHM is a private journaling container for reflection.',
      'Khepera offers reflection in three parts: Witness, Perspective Offer, and Seed.',
      'Khepera does not diagnose, advise, coach, or replace support from a person.',
    ],
    escalationLabel: 'I still have a question',
  },
  emotional_boundary: {
    title: 'If something here felt important, that matters',
    body: [
      'ALCHM is designed for reflection, not conversation or support.',
      'If you’re looking to talk with someone, reaching out to a trusted person or a professional resource may help.',
    ],
    escalationLabel: 'View support resources',
  },
};
