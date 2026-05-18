'use client';

import Link from 'next/link';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

const sections = [
  {
    title: 'What ALCHM Handles',
    body:
      'ALCHM handles account information, writing you choose to save, reflection responses, subscription state, and operational diagnostics needed to keep the app reliable. Journal text is treated as private writing, not as a behavioral score or emotional profile.',
  },
  {
    title: 'Khepera Reflections',
    body:
      'When you request a reflection, crisis detection runs before reflection generation. Khepera is constrained to reflective mirroring and does not diagnose, treat, advise, coach, or rank your emotional state.',
  },
  {
    title: 'Memory Boundary',
    body:
      'Continuity systems use metadata only. Raw journal text is not stored in memory systems for long-term profiling, progress scoring, or emotional analytics.',
  },
  {
    title: 'Service Providers',
    body:
      'ALCHM uses infrastructure and service providers for authentication, storage, app reliability, purchases, diagnostics, and AI reflection. These services must be represented accurately in App Store privacy labels and public disclosures.',
  },
  {
    title: 'User Control',
    body:
      'You can manage account settings, exports, deletion, notifications, and reflection access from the app. Optional notifications are intended to remain quiet and non-manipulative.',
  },
  {
    title: 'Safety Resources',
    body:
      'If writing suggests immediate safety risk, ALCHM presents crisis resources before any reflection. ALCHM is not a therapy service or emergency service.',
  },
];

export default function PrivacyPolicy() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Privacy" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md, paddingBottom: DESIGN.spacing.xl }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="display" style={{ marginBottom: DESIGN.spacing.sm }}>
            Privacy and Trust
          </SanctuaryText>
          <SanctuaryText variant="body">
            ALCHM is a private reflection space. Its privacy posture is built around restraint: collect only what is needed,
            keep sensitive writing protected, avoid emotional analytics, and make important boundaries visible.
          </SanctuaryText>
          <SanctuaryText variant="caption" style={{ marginTop: DESIGN.spacing.sm }}>
            Effective date: January 26, 2026
          </SanctuaryText>
        </SanctuaryCard>

        {sections.map((section) => (
          <SanctuaryCard key={section.title}>
            <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
              {section.title}
            </SanctuaryText>
            <SanctuaryText variant="body">{section.body}</SanctuaryText>
          </SanctuaryCard>
        ))}

        <SanctuaryCard>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.xs }}>
            Contact
          </SanctuaryText>
          <SanctuaryText variant="body">
            Privacy questions can be sent to{' '}
            <a href="mailto:privacy@alchm.app" style={{ color: DESIGN.colors.textPrimary }}>
              privacy@alchm.app
            </a>
            .
          </SanctuaryText>
        </SanctuaryCard>

        <Link
          href="/settings/"
          style={{
            minHeight: '44px',
            borderRadius: DESIGN.radius.md,
            border: `1px solid ${DESIGN.colors.border}`,
            background: DESIGN.colors.bgElevated,
            color: DESIGN.colors.textPrimary,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 16px',
            textDecoration: 'none',
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: DESIGN.typography.sizes.sm,
          }}
        >
          Return to settings
        </Link>
      </div>
    </SanctuaryLayout>
  );
}
