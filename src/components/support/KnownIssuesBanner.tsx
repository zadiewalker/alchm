'use client';

import { KNOWN_ISSUES } from '@/config/knownIssues';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';

export function KnownIssuesBanner(): React.JSX.Element | null {
  const activeIssues = KNOWN_ISSUES.filter((issue) => issue.isActive);

  if (!activeIssues.length) {
    return null;
  }

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <AppText variant="h2" as="h2">Known issues</AppText>
        {activeIssues.map((issue) => (
          <div key={issue.id} style={{ display: 'grid', gap: 'var(--space-1)' }}>
            <AppText variant="body" as="p">{issue.title}</AppText>
            <AppText variant="secondary" as="p">{issue.description}</AppText>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
