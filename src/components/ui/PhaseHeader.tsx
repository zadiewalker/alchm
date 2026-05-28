'use client';

import type React from 'react';
import { AppText } from '@/components/ui/AppText';

type PhaseHeaderProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
  centered?: boolean;
  bodyStyle?: React.CSSProperties;
};

export function PhaseHeader({
  eyebrow,
  title,
  body,
  icon,
  children,
  className,
  compact = false,
  centered = false,
  bodyStyle,
}: PhaseHeaderProps): React.JSX.Element {
  const align = centered ? 'center' : 'left';

  return (
    <div
      className={className}
      style={{
        marginBottom: compact ? 'var(--space-6)' : 'var(--space-8)',
        textAlign: align as React.CSSProperties['textAlign'],
      }}
    >
      {icon ? (
        <div
          style={{
            display: 'flex',
            justifyContent: centered ? 'center' : 'flex-start',
            marginBottom: compact ? 'var(--space-4)' : 'var(--space-6)',
          }}
        >
          {icon}
        </div>
      ) : null}

      {children}

      {eyebrow ? (
        <AppText variant="whisper" as="p" style={{ margin: children ? '0 0 var(--space-3)' : '0 0 var(--space-2)' }}>
          {eyebrow}
        </AppText>
      ) : null}

      {title ? (
        <AppText
          variant={compact ? 'h2' : 'h1'}
          as="h2"
          style={{ marginBottom: 'var(--space-2)' }}
        >
          {title}
        </AppText>
      ) : null}

      {body ? (
        <AppText
          variant="secondary"
          as="p"
          style={{ ...bodyStyle }}
        >
          {body}
        </AppText>
      ) : null}
    </div>
  );
}
