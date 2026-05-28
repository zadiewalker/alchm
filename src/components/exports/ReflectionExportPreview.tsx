'use client';

import { SectionIntro } from '@/components/ui/SectionIntro';
import { RitualCard } from '@/components/ui/RitualCard';
import { SystemCard } from '@/components/ui/SystemCard';
import { AppText } from '@/components/ui/AppText';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ReflectionExportActions } from '@/components/exports/ReflectionExportActions';
import type { ReflectionExportBuildResult, ReflectionExportValidationWarning } from '@/types/exports';
import {
  getReflectionExportFramingMeta,
  getReflectionExportTimeWindowMeta,
  REFLECTION_EXPORT_COMPLETION_TITLE,
  REFLECTION_EXPORT_TRUST_LINE,
} from '@/config/exports/reflectionExportUi';

type ReflectionExportPreviewProps = {
  previewState: 'idle' | 'loading' | 'ready' | 'error';
  previewError: string;
  buildResult: ReflectionExportBuildResult | null;
  warnings: ReflectionExportValidationWarning[];
  exportState: 'idle' | 'exporting' | 'success' | 'error';
  exportError: string;
  exportMessage: string;
  completionTitle: string;
  onBack: () => void;
  onRetryPreview: () => void;
  onExport: () => void;
};

export function ReflectionExportPreview({
  previewState,
  previewError,
  buildResult,
  warnings,
  exportState,
  exportError,
  exportMessage,
  completionTitle,
  onBack,
  onRetryPreview,
  onExport,
}: ReflectionExportPreviewProps): React.JSX.Element {
  if (previewState === 'loading') {
    return <LoadingState message="Preparing your reflection export..." variant="page" />;
  }

  if (previewState === 'error' || !buildResult) {
    return (
      <div className="export-flow-stack">
        <SectionIntro
          label="Preview"
          title="This export could not be prepared."
          body="Nothing has been shared. You can go back, change what is included, and try again."
        />
        <ErrorState
          variant="page"
          message={previewError || 'The reflection export could not be validated.'}
          retryLabel="Try again"
          onRetry={onRetryPreview}
        />
        <ReflectionExportActions
          backLabel="Back to selections"
          onBack={onBack}
          primaryLabel="Try again"
          onPrimary={onRetryPreview}
        />
      </div>
    );
  }

  const { document } = buildResult;
  const framing = getReflectionExportFramingMeta(buildResult.input.framing);
  const timeWindow = getReflectionExportTimeWindowMeta(buildResult.input.timeWindow);

  return (
    <div className="export-flow-stack">
      <SectionIntro
        label="Preview"
        title="Review what will be exported."
        body="Read this as a real document. If anything feels too exposed, too thin, or not quite right, go back and change it."
      />

      <SystemCard className="export-preview-meta-card">
        <AppText variant="whisper" as="p">
          {REFLECTION_EXPORT_TRUST_LINE}
        </AppText>
        <AppText variant="whisper" as="p">
          {framing.label} · {timeWindow.label}
        </AppText>
      </SystemCard>

      {warnings.length > 0 ? (
        <SystemCard className="export-warning-card surface-note-card">
          <AppText variant="label" as="p">
            This draft may feel thin in places.
          </AppText>
          <ul className="export-warning-list">
            {warnings.map((warning) => (
              <li key={`${warning.code}:${warning.path}`}>
                <AppText variant="whisper" as="span">
                  {warning.message}
                </AppText>
              </li>
            ))}
          </ul>
        </SystemCard>
      ) : null}

      <RitualCard className="export-preview-card">
        <div className="export-preview-section">
          <AppText variant="whisper" as="p">
            Reflection Export
          </AppText>
          <AppText variant="display" as="h1">
            {document.documentTitle}
          </AppText>
        </div>

        <section className="export-preview-section">
          <AppText variant="label" as="h2">
            Purpose
          </AppText>
          <AppText variant="body" as="p">
            {document.purpose}
          </AppText>
        </section>

        <section className="export-preview-section">
          <AppText variant="label" as="h2">
            What Has Been Present
          </AppText>
          <AppText variant="body" as="p">
            {document.whatHasBeenPresent}
          </AppText>
        </section>

        <section className="export-preview-section">
          <AppText variant="label" as="h2">
            Recurring Threads
          </AppText>
          <ul className="export-list">
            {document.recurringThreads.map((thread) => (
              <li key={thread}>
                <AppText variant="body" as="span">
                  {thread}
                </AppText>
              </li>
            ))}
          </ul>
        </section>

        <section className="export-preview-section">
          <AppText variant="label" as="h2">
            Emotional Landscape
          </AppText>
          <AppText variant="body" as="p">
            {document.emotionalLandscape}
          </AppText>
        </section>

        {document.selectedExcerpts.length > 0 ? (
          <section className="export-preview-section">
            <AppText variant="label" as="h2">
              Selected Excerpts
            </AppText>
            <div className="export-excerpt-stack">
              {document.selectedExcerpts.map((excerpt) => (
                <blockquote key={`${excerpt.sourceId}:${excerpt.createdAt}:${excerpt.excerpt}`} className="export-excerpt">
                  <AppText variant="body" as="p">
                    {excerpt.excerpt}
                  </AppText>
                  <AppText variant="whisper" as="p">
                    {excerpt.sourceType.replace(/_/g, ' ')} · {excerpt.createdAt.slice(0, 10)}
                  </AppText>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}

        <section className="export-preview-section">
            <AppText variant="label" as="h2">
            What You May Want to Carry Forward
            </AppText>
          <ul className="export-list">
            {document.conversationOpenings.map((opening) => (
              <li key={opening}>
                <AppText variant="body" as="span">
                  {opening}
                </AppText>
              </li>
            ))}
          </ul>
        </section>

        {document.userNote ? (
          <section className="export-preview-section">
            <AppText variant="label" as="h2">
              User Note
            </AppText>
            <AppText variant="body" as="p">
              {document.userNote}
            </AppText>
          </section>
        ) : null}

        <section className="export-preview-section export-boundary-note">
          <AppText variant="label" as="h2">
            Boundary Note
          </AppText>
          <AppText variant="secondary" as="p">
            {document.boundaryNote}
          </AppText>
        </section>
      </RitualCard>

      {exportState === 'error' ? (
        <ErrorState
          variant="inline"
          title="Export unavailable"
          message={exportError || 'The export document could not be created.'}
          retryLabel="Try again"
          onRetry={onExport}
        />
      ) : null}

      {exportState === 'success' && exportMessage ? (
        <SystemCard className="export-status-card surface-meta-card">
          <AppText variant="label" as="p">
            {completionTitle || REFLECTION_EXPORT_COMPLETION_TITLE}
          </AppText>
          <AppText variant="whisper" as="p">
            {exportMessage}
          </AppText>
        </SystemCard>
      ) : null}

      <ReflectionExportActions
        backLabel="Back to selections"
        onBack={onBack}
        primaryLabel="Export document"
        onPrimary={onExport}
        primaryBusy={exportState === 'exporting'}
        helper="This creates a shareable document from only the material shown here."
      />
    </div>
  );
}
