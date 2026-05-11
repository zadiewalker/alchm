'use client';

import type React from 'react';
import { AppText } from '@/components/ui/AppText';

type SectionIntroProps = {
  label?: string;
  title?: string;
  body?: string;
  className?: string;
};

export function SectionIntro({
  label,
  title,
  body,
  className,
}: SectionIntroProps): React.JSX.Element {
  return (
    <div className={className} style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {label ? (
        <AppText variant="whisper" as="p">
          {label}
        </AppText>
      ) : null}

      {title ? (
        <AppText variant="title" as="h2">
          {title}
        </AppText>
      ) : null}

      {body ? (
        <AppText variant="secondary" as="p">
          {body}
        </AppText>
      ) : null}
    </div>
  );
}
