'use client';

import type React from 'react';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function EmergencyPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Crisis Support" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        <SanctuaryCard elevated>
          <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>You're not alone</SanctuaryText>
          <SanctuaryText variant="body">
            If you're having thoughts of hurting yourself or others, please reach out now. Help is available 24/7.
          </SanctuaryText>
        </SanctuaryCard>

        <SanctuaryCard>
          <a href="tel:988" style={actionStyle}>Call 988 — Suicide & Crisis Lifeline</a>
          <a href="sms:741741&body=HOME" style={actionStyle}>Text HOME to 741741 — Crisis Text Line</a>
          <a href="tel:911" style={actionStyle}>Call 911 — Emergency Services</a>
        </SanctuaryCard>

        <SanctuaryCard>
          <SanctuaryText variant="caption">Additional resources</SanctuaryText>
          <a href="tel:1-866-488-7386" style={subLinkStyle}>Trevor Project Lifeline: 1-866-488-7386</a>
          <a href="sms:678678&body=START" style={subLinkStyle}>Trevor Project Text: START to 678-678</a>
          <a href="tel:1-800-950-6264" style={subLinkStyle}>NAMI Helpline: 1-800-950-6264</a>
        </SanctuaryCard>
      </div>
    </SanctuaryLayout>
  );
}

const actionStyle: React.CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  marginBottom: DESIGN.spacing.sm,
  minHeight: '44px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: 'rgba(232,197,109,0.15)',
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  padding: '12px 14px',
};

const subLinkStyle: React.CSSProperties = {
  display: 'block',
  textDecoration: 'none',
  marginTop: DESIGN.spacing.xs,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
};
