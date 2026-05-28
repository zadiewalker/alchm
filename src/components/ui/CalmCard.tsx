'use client';

import type React from 'react';
import { SystemCard } from '@/components/ui/SystemCard';
import { AppText } from '@/components/ui/AppText';

type CalmCardProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  children?: React.ReactNode;
  className?: string;
  tone?: 'default' | 'strong' | 'soft';
  style?: React.CSSProperties;
};

const TONE_STYLES: Record<NonNullable<CalmCardProps['tone']>, React.CSSProperties> = {
  default: {
    background: 'var(--surface-system)',
  },
  strong: {
    background: 'var(--surface-elevated)',
  },
  soft: {
    background: 'var(--surface-soft)',
  },
};

export function CalmCard({
  eyebrow,
  title,
  body,
  children,
  className,
  tone = 'default',
  style,
}: CalmCardProps): React.JSX.Element {
  return (
    <SystemCard className={className} style={{ ...TONE_STYLES[tone], ...style }}>
      {eyebrow ? (
        <AppText variant="whisper" as="p" style={{ marginBottom: 'var(--space-2)' }}>
          {eyebrow}
        </AppText>
      ) : null}

      {title ? (
        <AppText variant="h2" as="p" style={{ marginBottom: 'var(--space-2)' }}>
          {title}
        </AppText>
      ) : null}

      {body ? (
        <AppText variant="secondary" as="p" style={{ margin: children ? '0 0 var(--space-3)' : 0 }}>
          {body}
        </AppText>
      ) : null}

      {children}
    </SystemCard>
  );
}
