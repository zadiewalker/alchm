'use client';

import { SectionIntro } from '@/components/ui/SectionIntro';
import { SystemCard } from '@/components/ui/SystemCard';
import { EmptyStateCard } from '@/components/ui/EmptyStateCard';
import { AppText } from '@/components/ui/AppText';
import { ReflectionExportNote } from '@/components/exports/ReflectionExportNote';
import { ReflectionExportActions } from '@/components/exports/ReflectionExportActions';
import type { ReflectionExportSourceGroup } from '@/hooks/useReflectionExport';
import { REFLECTION_EXPORT_FRAMING_OPTIONS, REFLECTION_EXPORT_TIME_WINDOW_OPTIONS, REFLECTION_EXPORT_TRUST_LINE } from '@/config/exports/reflectionExportUi';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { ReflectionExportFraming, ReflectionExportTimeWindow } from '@/types/exports';

type ReflectionExportSelectionProps = {
  isLoading: boolean;
  error: string;
  sourceGroups: ReflectionExportSourceGroup[];
  framing: ReflectionExportFraming;
  timeWindow: ReflectionExportTimeWindow;
  selectedSourceIds: string[];
  selectedExcerptIds: string[];
  selectionCount: number;
  excerptCount: number;
  userNote: string;
  onToggleSource: (id: string) => void;
  onToggleExcerpt: (id: string) => void;
  onChangeNote: (value: string) => void;
  onChangeFraming: (value: ReflectionExportFraming) => void;
  onChangeTimeWindow: (value: ReflectionExportTimeWindow) => void;
  onContinue: () => void;
};

export function ReflectionExportSelection({
  isLoading,
  error,
  sourceGroups,
  framing,
  timeWindow,
  selectedSourceIds,
  selectedExcerptIds,
  selectionCount,
  excerptCount,
  userNote,
  onToggleSource,
  onToggleExcerpt,
  onChangeNote,
  onChangeFraming,
  onChangeTimeWindow,
  onContinue,
}: ReflectionExportSelectionProps): React.JSX.Element {
  if (isLoading) {
    return <LoadingState message="Loading writing you can choose from..." variant="page" />;
  }

  if (error) {
    return <ErrorState message={error} variant="page" />;
  }

  if (sourceGroups.length === 0) {
    return (
      <EmptyStateCard className="export-empty-card">
        <SectionIntro
          label="Reflection Export"
          title="Nothing is ready to include yet."
          body="When writing, reflections, returns, or excerpts are present, you can gather only what you want to keep or share."
        />
      </EmptyStateCard>
    );
  }

  return (
    <div className="export-flow-stack">
      <SectionIntro
        label="Reflection Export"
        title="Choose what to include."
        body="Choose the writing, reflections, excerpts, and note you want to gather here. Nothing is included unless you select it."
      />

      <SystemCard className="export-selection-summary">
        <AppText variant="whisper" as="p">
          {REFLECTION_EXPORT_TRUST_LINE}
        </AppText>
      </SystemCard>

      <SystemCard className="export-selection-controls">
        <div className="export-control-block">
          <AppText variant="label" as="p">
            Framing
          </AppText>
          <div className="export-control-row">
            {REFLECTION_EXPORT_FRAMING_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={['export-toggle', framing === option.value ? 'export-toggle-active' : ''].filter(Boolean).join(' ')}
                aria-pressed={framing === option.value}
                onClick={() => onChangeFraming(option.value)}
              >
                <AppText variant="whisper" as="span">
                  {option.label}
                </AppText>
              </button>
            ))}
          </div>
        </div>

        <div className="export-control-block">
          <AppText variant="label" as="p">
            Time window
          </AppText>
          <div className="export-control-row">
            {REFLECTION_EXPORT_TIME_WINDOW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={['export-toggle', timeWindow === option.value ? 'export-toggle-active' : ''].filter(Boolean).join(' ')}
                aria-pressed={timeWindow === option.value}
                onClick={() => onChangeTimeWindow(option.value)}
              >
                <AppText variant="whisper" as="span">
                  {option.label}
                </AppText>
              </button>
            ))}
          </div>
        </div>
      </SystemCard>

      <SystemCard className="export-selection-summary">
        <AppText variant="label" as="p">
          {selectionCount} source{selectionCount === 1 ? '' : 's'} selected
        </AppText>
        <AppText variant="whisper" as="p">
          {excerptCount} excerpt{excerptCount === 1 ? '' : 's'} included
        </AppText>
      </SystemCard>

      <div className="export-selection-grid">
        {sourceGroups.map((group) => (
          <SystemCard key={group.entryId} className="export-group-card">
            <div className="export-group-header">
              <AppText variant="label" as="p">
                {group.dateLabel}
              </AppText>
              <AppText variant="whisper" as="p">
                {group.entryPreview}
              </AppText>
            </div>

            <div className="export-source-list">
              {group.sources.map((source) => {
                const isSelected = selectedSourceIds.includes(source.id);
                const excerptId = `${source.id}:excerpt`;
                const isExcerptSelected = selectedExcerptIds.includes(excerptId);

                return (
                  <div key={source.id} className="export-source-row">
                    <div className="export-source-copy">
                      <AppText variant="body" as="p">
                        {source.label}
                      </AppText>
                      <AppText variant="whisper" as="p">
                        {source.preview}
                      </AppText>
                    </div>
                    <div className="export-source-actions">
                      <button
                        type="button"
                        className={['export-toggle', isSelected ? 'export-toggle-active' : ''].filter(Boolean).join(' ')}
                        aria-pressed={isSelected}
                        onClick={() => onToggleSource(source.id)}
                      >
                        <AppText variant="label" as="span">
                          {isSelected ? 'Included' : 'Include'}
                        </AppText>
                      </button>
                      {source.excerptCandidate ? (
                        <button
                          type="button"
                          className={['export-toggle', isExcerptSelected ? 'export-toggle-active' : ''].filter(Boolean).join(' ')}
                          aria-pressed={isExcerptSelected}
                          onClick={() => onToggleExcerpt(source.id)}
                          disabled={!isSelected}
                        >
                          <AppText variant="whisper" as="span">
                            {isExcerptSelected ? 'Excerpt included' : 'Include excerpt'}
                          </AppText>
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </SystemCard>
        ))}
      </div>

      <SystemCard className="export-note-card">
        <ReflectionExportNote value={userNote} onChange={onChangeNote} />
      </SystemCard>

      <ReflectionExportActions
        primaryLabel="Preview export"
        onPrimary={onContinue}
        primaryDisabled={selectionCount === 0}
        helper="You can revise the framing, window, and selections before anything is exported or shared."
      />
    </div>
  );
}
