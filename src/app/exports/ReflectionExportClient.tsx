'use client';

import { AppLayout } from '@/components/ui/AppLayout';
import { AppHeader } from '@/components/ui/AppHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { PaywallRedirect } from '@/components/subscription/PaywallRedirect';
import { useSubscription } from '@/hooks/useSubscription';
import { useReflectionExport } from '@/hooks/useReflectionExport';
import { ReflectionExportSelection } from '@/components/exports/ReflectionExportSelection';
import { ReflectionExportPreview } from '@/components/exports/ReflectionExportPreview';

export default function ReflectionExportClient(): React.JSX.Element {
  const subscription = useSubscription();
  const exportFlow = useReflectionExport();

  if (subscription.isLoading && !subscription.isReady) {
    return (
      <AppLayout header={<AppHeader title="Reflection Export" showBack backNavigation={{ fallback: '/dashboard' }} />}>
        <LoadingState message="Checking access…" variant="page" />
      </AppLayout>
    );
  }

  return (
    <AppLayout header={<AppHeader title="Reflection Export" showBack backNavigation={{ fallback: '/dashboard' }} />}>
      {!subscription.canAccessFeature('reflection_export') ? (
        <PaywallRedirect source="exports_paywall_gate" />
      ) : exportFlow.step === 'selection' ? (
        <ReflectionExportSelection
          isLoading={exportFlow.isLoadingEntries}
          error={exportFlow.selectionError}
          sourceGroups={exportFlow.sourceGroups}
          framing={exportFlow.framing}
          timeWindow={exportFlow.timeWindow}
          selectedSourceIds={exportFlow.selectedSourceIds}
          selectedExcerptIds={exportFlow.selectedExcerptIds}
          selectionCount={exportFlow.selectionCount}
          excerptCount={exportFlow.excerptCount}
          userNote={exportFlow.userNote}
          onToggleSource={exportFlow.toggleSource}
          onToggleExcerpt={exportFlow.toggleExcerpt}
          onChangeNote={exportFlow.updateUserNote}
          onChangeFraming={exportFlow.updateFraming}
          onChangeTimeWindow={exportFlow.updateTimeWindow}
          onContinue={exportFlow.generatePreview}
        />
      ) : (
        <ReflectionExportPreview
          previewState={exportFlow.previewState}
          previewError={exportFlow.previewError}
          buildResult={exportFlow.buildResult}
          warnings={exportFlow.previewWarnings}
          exportState={exportFlow.exportState}
          exportError={exportFlow.exportError}
          exportMessage={exportFlow.exportMessage}
          completionTitle={exportFlow.completionTitle}
          onBack={exportFlow.goBackToSelection}
          onRetryPreview={exportFlow.retryPreview}
          onExport={exportFlow.exportDocument}
        />
      )}
    </AppLayout>
  );
}
