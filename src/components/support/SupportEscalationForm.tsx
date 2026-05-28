'use client';

import React from 'react';
import { SUPPORT_DESCRIPTION_MAX_LENGTH, SUPPORT_RESPONSE_WINDOW_COPY } from '@/config/support';
import { useAuth } from '@/hooks/useAuth';
import { useSubmitSupportTicket } from '@/hooks/useSubmitSupportTicket';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import type {
  PersistableSupportRequestType,
  SupportCategory,
} from '@/types/support';

const SUPPORT_CATEGORIES: SupportCategory[] = [
  'writing',
  'saving',
  'loading',
  'subscription',
  'account',
  'other',
];

export function SupportEscalationForm({
  type,
}: {
  type: PersistableSupportRequestType;
}): React.JSX.Element {
  const auth = useAuth();
  const submitTicket = useSubmitSupportTicket();
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<SupportCategory>('other');
  const [localError, setLocalError] = React.useState('');

  if (submitTicket.status === 'success') {
    return (
      <AppCard className="support-card">
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <AppText variant="h2" as="h2">Thanks — I’ve received this.</AppText>
          <AppText variant="secondary" as="p">{SUPPORT_RESPONSE_WINDOW_COPY}</AppText>
        </div>
      </AppCard>
    );
  }

  const handleSubmit = async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      setLocalError('Add a brief product description before sending.');
      return;
    }

    const userId = auth.user?.uid;
    if (!userId) {
      setLocalError('Support could not receive this until account access is ready.');
      return;
    }

    setLocalError('');
    await submitTicket.submit({
      userId,
      type,
      description: trimmed,
      category,
      context: {
        involvesPayment: type === 'billing_issue',
      },
    });
  };

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="h2" as="h2">Send a support note</AppText>
          <AppText variant="secondary" as="p">
            Describe the product issue. Please do not include journal entry text.
          </AppText>
        </div>
        <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="caption" as="span">Category</AppText>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as SupportCategory)}
            className="support-select"
          >
            {SUPPORT_CATEGORIES.map((item) => (
              <option key={item} value={item}>{item.replace('_', ' ')}</option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="caption" as="span">Description</AppText>
          <textarea
            value={description}
            maxLength={SUPPORT_DESCRIPTION_MAX_LENGTH}
            onChange={(event) => setDescription(event.target.value)}
            className="support-textarea"
            placeholder="What happened in the app?"
          />
          <AppText variant="caption" as="span">
            {SUPPORT_DESCRIPTION_MAX_LENGTH - description.length} characters left
          </AppText>
        </label>
        {localError || submitTicket.error ? (
          <AppText variant="secondary" as="p">{localError || submitTicket.error}</AppText>
        ) : null}
        <button
          type="button"
          className="btn-primary"
          onClick={() => void handleSubmit()}
          disabled={submitTicket.status === 'submitting'}
        >
          {submitTicket.status === 'submitting' ? 'Sending' : 'Send to support'}
        </button>
      </div>
    </AppCard>
  );
}
