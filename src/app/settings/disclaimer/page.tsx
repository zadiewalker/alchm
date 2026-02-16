'use client';

import { SanctuaryLayout } from '@/components/ui/SanctuaryLayout';
import { SanctuaryHeader } from '@/components/ui/SanctuaryHeader';
import { SanctuaryCard } from '@/components/ui/SanctuaryCard';
import { SanctuaryText } from '@/components/ui/SanctuaryText';
import { DESIGN } from '@/lib/design';

export default function DisclaimerPage() {
  return (
    <SanctuaryLayout header={<SanctuaryHeader title="Medical Disclaimer" showBack />}>
      <SanctuaryCard elevated>
        <Section
          title="Not Medical Advice"
          body="ALCHM supports reflection, mindfulness, and personal growth. It is not a substitute for professional medical advice, diagnosis, or treatment."
        />
        <Section
          title="Seek Professional Help"
          body="If you are experiencing severe distress or thoughts of self-harm, contact a qualified mental health professional or emergency services immediately."
        />
        <Section
          title="Crisis Resources"
          body="In the United States, call or text 988 for the Suicide & Crisis Lifeline, available 24/7."
        />
        <Section
          title="AI Companion"
          body="Khepera provides supportive AI-generated reflections and is not a licensed therapist or clinical treatment provider."
        />
        <Section
          title="Your Responsibility"
          body="By using ALCHM, you acknowledge responsibility for your own wellbeing and understand this app complements, not replaces, professional care."
        />
      </SanctuaryCard>
    </SanctuaryLayout>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ marginBottom: DESIGN.spacing.md }}>
      <SanctuaryText variant="body" style={{ marginBottom: 6 }}>{title}</SanctuaryText>
      <SanctuaryText variant="caption">{body}</SanctuaryText>
    </div>
  );
}
