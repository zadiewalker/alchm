'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DESIGN } from '@/lib/design';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '22px' }}>
      <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold }}>{title}</div>
      <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.7, color: DESIGN.colors.textSecondary }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '28px 20px', maxWidth: '720px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        style={{
          border: 'none',
          background: 'transparent',
          color: DESIGN.colors.gold,
          fontFamily: DESIGN.typography.sansSerif,
          fontSize: '15px',
          cursor: 'pointer',
          minHeight: '44px',
          padding: 0,
        }}
      >
        ← Back
      </button>

        <h1 style={{ margin: '12px 0 0', fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
          Privacy Policy
        </h1>
        <div style={{ marginTop: '8px', fontSize: '12px', color: DESIGN.colors.textMuted }}>
          Last updated: February 2026
        </div>

        <Section title="What ALCHM Stores">
          ALCHM stores your journal entries and app preferences locally on your device using on-device storage. There are no accounts and no
          server-side database for your journal data in this build.
        </Section>

        <Section title="When Data Leaves Your Device">
          If you enable cloud reflections by adding an Anthropic API key, your journal entry text may be sent to Anthropic to generate a
          reflection. Anthropic&apos;s policies apply. If you do not provide a key, reflections are generated locally.
        </Section>

        <Section title="What We Do Not Collect">
          ALCHM does not collect your name, email address, phone number, precise location, or advertising identifiers by default. We do not
          sell your data.
        </Section>

        <Section title="Data Deletion">
          You can delete all local data at any time from Settings → Clear all data. This removes journal entries and preferences stored on this
          device.
        </Section>

        <Section title="Crisis Support">
          If you are in crisis, call or text{' '}
          <a href="tel:988" aria-label="Call 988 Suicide and Crisis Lifeline" style={{ color: DESIGN.colors.gold, textDecoration: 'underline' }}>
            988
          </a>{' '}
          (US). If you are outside the US, see the crisis resources in the footer.
        </Section>

        <Section title="Contact">
          Privacy questions: <span style={{ color: DESIGN.colors.textPrimary }}>privacy@alchm.app</span>
        </Section>
    </div>
  );
}
