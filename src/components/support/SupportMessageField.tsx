'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { AppText } from '@/components/ui/AppText';

interface SupportMessageFieldProps {
  value: string;
  onChange: (value: string) => void;
  remainingCharacters: number;
}

export function SupportMessageField({
  value,
  onChange,
  remainingCharacters,
}: SupportMessageFieldProps): React.JSX.Element {
  return (
    <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <AppText variant="label" as="span">{SUPPORT_COPY.messageLabel}</AppText>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={SUPPORT_COPY.maxMessageLength}
        rows={7}
        style={fieldStyle}
      />
      <AppText variant="caption" as="span">{SUPPORT_COPY.messageHelper}</AppText>
      <AppText variant="caption" as="span">{remainingCharacters} characters remaining.</AppText>
    </label>
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '16px',
  border: '1px solid var(--border-divider)',
  background: 'var(--surface-elevated)',
  color: 'var(--text-primary)',
  padding: 'var(--space-4)',
  font: 'inherit',
  resize: 'vertical',
};
