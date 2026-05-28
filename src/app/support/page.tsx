'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { KnownIssuesBanner } from '@/components/support/KnownIssuesBanner';
import { SafetyResourcesCard } from '@/components/support/SafetyResourcesCard';
import { SupportEntry } from '@/components/support/SupportEntry';
import { SupportForm } from '@/components/support/SupportForm';
import { SupportGuidance } from '@/components/support/SupportGuidance';
import type { SupportRequestType } from '@/types/support';

// ALCHM_IDENTITY_ROLE: utility-screen

export default function SupportPage() {
  const [selectedType, setSelectedType] = useState<SupportRequestType | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);

  return (
    <AppLayout header={<AppHeader title="Support" showBack backNavigation={{ fallback: '/settings' }} />}>
      <div className="support-page">
        <KnownIssuesBanner />
        <SupportEntry
          selected={selectedType}
          onSelect={(type) => {
            setSelectedType(type);
            setShowEscalation(false);
          }}
        />
        {selectedType ? (
          <SupportGuidance
            type={selectedType}
            onEscalate={() => setShowEscalation(true)}
          />
        ) : null}
        {showEscalation && selectedType !== 'emotional_boundary' ? (
          <SupportForm />
        ) : null}
        <SafetyResourcesCard />
      </div>
    </AppLayout>
  );
}
