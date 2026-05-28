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
          body="ALCHM offers space for reflection. It is not a substitute for professional medical advice, diagnosis, or treatment."
        />
        <Section
          title="Seek Professional Help"
          body="If immediate support is needed, crisis resources including 988 and emergency services are available."
        />
        <Section
          title="Crisis Resources"
          body="In the United States, call or text 988 for the Suicide & Crisis Lifeline, available 24/7."
        />
        <Section
          title="Khepera Reflections"
          body="Khepera provides supportive AI-generated reflections and is not a licensed therapist or clinical treatment provider."
        />
        <Section
          title="Scope of ALCHM"
          body="ALCHM is available for reflection and does not replace professional care."
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
