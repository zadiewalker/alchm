'use client';

import { AppText } from '@/components/ui/AppText';
import { KheperaCard } from '@/components/ui/KheperaCard';
import type { ArcReflectionCardProps } from '@/types/components';

export function ArcReflectionCard({
  text, loading = false, onDismiss
}: ArcReflectionCardProps): React.JSX.Element {
  return (
    <KheperaCard
      role="region"
      aria-label="Khepera arc reflection"
    >
      <AppText variant="whisper" as="p" style={{ margin: '0 0 14px' }}>
        arc reflection
      </AppText>

      {loading ? (
        <AppText variant="h2" as="p" style={{ margin: '0 0 24px', color: 'var(--text-tertiary)' }}>
          Gathering what has shifted here...
        </AppText>
      ) : (
        <AppText
          variant="khepera"
          as="p"
          style={{ margin: '0 0 24px', whiteSpace: 'pre-line' }}
        >
          {text}
        </AppText>
      )}

      <button
        className="btn-ghost"
        onClick={onDismiss}
        style={{ width: '100%', textAlign: 'center' }}
        aria-label="Acknowledge arc reflection and continue"
      >
        <AppText as="span" variant="body">Continue</AppText>
      </button>
    </KheperaCard>
  );
}
