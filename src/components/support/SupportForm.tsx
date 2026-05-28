'use client';

import type React from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import { useSupportForm } from '@/hooks/support/useSupportForm';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { DiagnosticsOptInRow } from './DiagnosticsOptInRow';
import { SupportBoundaryNotice } from './SupportBoundaryNotice';
import { SupportCategorySelect } from './SupportCategorySelect';
import { SupportConfirmationState } from './SupportConfirmationState';
import { SupportMessageField } from './SupportMessageField';

export function SupportForm(): React.JSX.Element {
  const {
    category,
    setCategory,
    message,
    setMessage,
    includeDiagnostics,
    setIncludeDiagnostics,
    boundary,
    status,
    errorMessage,
    submissionResult,
    remainingCharacters,
    handleSubmit,
    handleReset,
  } = useSupportForm();

  if (status === 'success' && submissionResult) {
    return <SupportConfirmationState result={submissionResult} onReset={handleReset} />;
  }

  return (
    <AppCard className="support-card">
      <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <AppText variant="h2" as="h2">{SUPPORT_COPY.pageTitle}</AppText>
          <AppText variant="secondary" as="p">{SUPPORT_COPY.scopeBody}</AppText>
        </div>

        <SupportCategorySelect value={category} onChange={setCategory} />
        <SupportMessageField
          value={message}
          onChange={setMessage}
          remainingCharacters={remainingCharacters}
        />
        <DiagnosticsOptInRow
          checked={includeDiagnostics}
          onChange={setIncludeDiagnostics}
        />
        <SupportBoundaryNotice boundary={boundary} />

        {status === 'error' ? (
          <AppText variant="secondary" as="p">{errorMessage}</AppText>
        ) : null}

        <button
          type="button"
          className="btn-primary"
          onClick={() => void handleSubmit()}
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Preparing message...' : SUPPORT_COPY.submitLabel}
        </button>
      </div>
    </AppCard>
  );
}
