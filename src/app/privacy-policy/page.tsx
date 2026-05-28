'use client';

import type React from 'react';
import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function PrivacyPolicyPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Privacy Policy" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
            Privacy Policy
          </SanctuaryText>
          <SanctuaryText variant="caption">Implementation status for this build</SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <Section title="Writing and Reflection Data">
            <P>
              Journal entries may be held in a local queue on your device. When you are signed in, submitted sessions
              may also be stored in ALCHM&apos;s cloud data store with the related Khepera reflection and timing
              metadata.
            </P>
            <P>
              Khepera memory is limited in code to theme tags and emotional tone. It is not intended to contain your
              original journal text or reconstructed excerpts.
            </P>
          </Section>

          <Section title="AI Processing Status">
            <P>
              Khepera is a non-directive reflection system, not therapy or professional advice. Model-provider
              processing is routed through an authenticated server-controlled gateway in this source build. Reflection
              processing remains unavailable unless that gateway is deployed and configured.
            </P>
            <P>
              The application still checks submitted writing synchronously for crisis signals before any reflection
              generation path and provides crisis resources when that check is triggered.
            </P>
          </Section>

          <Section title="Controls Available in This Build">
            <P>
              The reset control in Settings clears local preferences only. It does not delete journal entries or
              account data.
            </P>
            <P>
              Backend export and deletion work is being validated against ALCHM&apos;s canonical session storage.
              Until that workflow is verified in a deployed environment, this build does not present an in-app
              promise of completed export or deletion.
            </P>
          </Section>

          <Section title="Data Minimization and Retention">
            <P>
              ALCHM&apos;s product rule is that journal entries are not used to train AI models. Automatic
              inactivity-based deletion is disabled in the current source while retention policy and deployment
              authority are reviewed.
            </P>
          </Section>

          <Section title="Service Boundaries">
            <P>
              The source uses Firebase services for authentication and cloud persistence. Any production AI provider,
              processing agreement, storage security posture, export delivery method, or retention commitment
              requires deployment and policy verification before it is stated as available.
            </P>
          </Section>

          <Section title="Questions and Requests">
            <P>
              For privacy questions or a data-rights request, contact{' '}
              <a href="mailto:privacy@alchm.app" style={linkStyle}>privacy@alchm.app</a>. Requests require
              verification and processing through an approved backend workflow.
            </P>
            <P>
              You can review local controls in <Link href="/settings/" style={linkStyle}>Settings</Link>.
            </P>
          </Section>
        </SanctuaryCard>
      </div>
    </SanctuaryLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: DESIGN.spacing.xs, marginBottom: DESIGN.spacing.md }}>
      <SanctuaryText variant="caption" style={{ color: DESIGN.colors.textPrimary }}>
        {title}
      </SanctuaryText>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <SanctuaryText variant="body" style={{ margin: 0 }}>
      {children}
    </SanctuaryText>
  );
}

const linkStyle: React.CSSProperties = {
  color: DESIGN.colors.gold,
  textDecoration: 'underline',
  fontFamily: DESIGN.typography.sansSerif,
};
