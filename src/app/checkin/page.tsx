'use client';

import { useMemo, useState } from 'react';
import type React from 'react';
import { useRouter } from 'next/navigation';
import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { UpgradePrompt } from '@/components/ui/UpgradePrompt';
import { DESIGN } from '@/lib/design';
import { useData } from '@/hooks/useData';
import { canAccessFeature } from '@/lib/subscription';
import { cancelReminder } from '@/lib/notifications';

const MOODS = ['anxious', 'heavy', 'numb', 'restless', 'tender', 'hopeful', 'alive', 'shattered', 'calm', 'burning'];
const GOODNIGHT_LINES = [
  'You named what was true tonight. Let that be enough.',
  'Even a brief check-in can soften the edges of a hard day.',
  'You showed up for yourself tonight. Rest gently.',
  'Your words are safe here. Goodnight.',
  'Khepera is here when morning comes.',
];

export default function CheckInPage() {
  const router = useRouter();
  const { saveJournalEntry } = useData();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mood, setMood] = useState<string[]>([]);
  const [sentence, setSentence] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const allowCheckin = canAccessFeature('eveningCheckIn');
  const goodnight = useMemo(() => GOODNIGHT_LINES[new Date().getDate() % GOODNIGHT_LINES.length], []);

  if (!allowCheckin) {
    return (
      <SanctuaryLayout header={<SanctuaryHeader title="Evening Check-in" showBack />}>
        <UpgradePrompt
          feature="Evening check-in"
          message="Evening check-ins are available with Reflections. A gentle way to close each day."
          recommendedTier="reflections"
        />
      </SanctuaryLayout>
    );
  }

  const completeCheckin = async (withText: string) => {
    setSaving(true);
    setError('');
    try {
      await saveJournalEntry({
        title: 'Evening check-in',
        content: withText.trim() || 'Evening check-in completed.',
        mood: 5,
        emotions: mood,
        tags: ['check-in'],
        type: 'checkin',
        isPrivate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      cancelReminder('return').catch(() => {});
      setStep(3);
    } catch {
      setError('Could not save your check-in. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Evening Check-in" showBack />}>
      <div style={{ display: 'grid', gap: DESIGN.spacing.md }}>
        {step === 1 ? (
          <SanctuaryCard elevated>
            <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              How are you landing tonight?
            </SanctuaryText>
            <div style={{ display: 'flex', gap: DESIGN.spacing.xs, overflowX: 'auto' }}>
              {MOODS.map((item) => {
                const active = mood.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMood([item]);
                      setStep(2);
                    }}
                    style={{
                      minHeight: '44px',
                      borderRadius: DESIGN.radius.full,
                      border: `1px solid ${active ? DESIGN.colors.goldDim : DESIGN.colors.border}`,
                      background: active ? 'rgba(232,197,109,0.2)' : DESIGN.colors.cardBg,
                      color: active ? DESIGN.colors.textKhepera : DESIGN.colors.textSecondary,
                      fontFamily: DESIGN.typography.sansSerif,
                      fontSize: DESIGN.typography.sizes.sm,
                      padding: '8px 12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </SanctuaryCard>
        ) : null}

        {step === 2 ? (
          <SanctuaryCard elevated>
            <SanctuaryText variant="title" style={{ marginBottom: DESIGN.spacing.sm }}>
              Anything else? Just one sentence.
            </SanctuaryText>
            <input
              value={sentence}
              onChange={(event) => setSentence(event.target.value)}
              placeholder="One sentence is enough"
              style={{
                width: '100%',
                minHeight: '44px',
                borderRadius: DESIGN.radius.md,
                border: `1px solid ${DESIGN.colors.border}`,
                background: DESIGN.colors.cardBg,
                color: DESIGN.colors.textPrimary,
                fontFamily: DESIGN.typography.sansSerif,
                fontSize: DESIGN.typography.sizes.base,
                padding: '10px 12px',
              }}
            />
            {error ? (
              <SanctuaryText variant="caption" style={{ color: DESIGN.colors.error, marginTop: DESIGN.spacing.sm }}>
                {error}
              </SanctuaryText>
            ) : null}
            <div style={{ display: 'flex', gap: DESIGN.spacing.sm, marginTop: DESIGN.spacing.md }}>
              <button type="button" onClick={() => completeCheckin(sentence)} style={primaryButtonStyle} disabled={saving}>
                {saving ? 'Saving...' : 'Done'}
              </button>
              <button type="button" onClick={() => completeCheckin('')} style={secondaryButtonStyle} disabled={saving}>
                Skip
              </button>
            </div>
          </SanctuaryCard>
        ) : null}

        {step === 3 ? (
          <SanctuaryCard style={{ background: DESIGN.colors.bgWarm }}>
            <SanctuaryText variant="khepera" style={{ marginBottom: DESIGN.spacing.sm }}>
              Khepera
            </SanctuaryText>
            <SanctuaryText variant="body" style={{ marginBottom: DESIGN.spacing.md }}>
              {goodnight}
            </SanctuaryText>
            <button type="button" onClick={() => router.push('/dashboard/')} style={primaryButtonStyle}>
              Goodnight ✦
            </button>
          </SanctuaryCard>
        ) : null}
      </div>
    </SanctuaryLayout>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  padding: '10px 18px',
  background: `linear-gradient(180deg, ${DESIGN.colors.gold}, ${DESIGN.colors.goldDim})`,
  color: '#fff',
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: '44px',
  borderRadius: DESIGN.radius.full,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: '10px 18px',
  background: DESIGN.colors.cardBg,
  color: DESIGN.colors.textSecondary,
  fontFamily: DESIGN.typography.sansSerif,
  fontSize: DESIGN.typography.sizes.sm,
};
