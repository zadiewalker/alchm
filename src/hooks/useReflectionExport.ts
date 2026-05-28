'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useData } from '@/hooks/useData';
import type { JournalEntry } from '@/services/data/dataService';
import type {
  ReflectionExportBuildResult,
  ReflectionExportFraming,
  ReflectionExportInput,
  ReflectionExportPurpose,
  ReflectionExportSelectedExcerptInput,
  ReflectionExportSelectedSource,
  ReflectionExportSourceType,
  ReflectionExportTimeWindow,
  ReflectionExportValidationWarning,
} from '@/types/exports';
import {
  getReflectionExportTimeWindowMeta,
  REFLECTION_EXPORT_COMPLETION_BODY,
  REFLECTION_EXPORT_COMPLETION_TITLE,
} from '@/config/exports/reflectionExportUi';
import { buildReflectionExport } from '@/services/exports/buildReflectionExport';
import { composeReflectionExportDraft } from '@/services/exports/composeReflectionExportDraft';
import { exportReflectionDocument } from '@/services/exports/exportReflectionDocument';
import { getReturnPreview, selectReturnExcerpt } from '@/services/returns/getReturnPreview';

type ReflectionExportStep = 'selection' | 'preview';
type ReflectionExportPreviewState = 'idle' | 'loading' | 'ready' | 'error';
type ReflectionExportExportState = 'idle' | 'exporting' | 'success' | 'error';

export type ReflectionExportSourceOption = {
  id: string;
  sourceId: string;
  entryId: string;
  sourceType: ReflectionExportSourceType;
  createdAt: string;
  label: string;
  content: string;
  preview: string;
  excerptCandidate?: ReflectionExportSelectedExcerptInput;
};

export type ReflectionExportSourceGroup = {
  entryId: string;
  createdAt: string;
  dateLabel: string;
  entryPreview: string;
  sources: ReflectionExportSourceOption[];
};

function isWithinSelectedWindow(
  value: Date,
  timeWindow: ReflectionExportTimeWindow,
  now: Date,
): boolean {
  const { days } = getReflectionExportTimeWindowMeta(timeWindow);
  if (days === null) {
    return true;
  }

  const ageInDays = (now.getTime() - value.getTime()) / (1000 * 60 * 60 * 24);
  return ageInDays <= days;
}

function formatDateLabel(value: Date): string {
  return value.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function buildSourceOptions(entry: JournalEntry): ReflectionExportSourceOption[] {
  const createdAt = entry.createdAt.toISOString();
  const baseOptions: ReflectionExportSourceOption[] = [];
  const entryPreview = selectReturnExcerpt(entry.content);

  if (entry.content.trim()) {
    baseOptions.push({
      id: `${entry.id}:journal_entry`,
      sourceId: entry.id,
      entryId: entry.id,
      sourceType: 'journal_entry',
      createdAt,
      label: 'Journal entry',
      content: entry.content,
      preview: entryPreview,
      excerptCandidate: {
        id: `${entry.id}:journal_entry:excerpt`,
        sourceId: entry.id,
        sourceType: 'journal_entry',
        createdAt,
        excerpt: entryPreview,
      },
    });
  }

  if (entry.kheperaReflection?.trim()) {
    const reflectionExcerpt = selectReturnExcerpt(entry.kheperaReflection);
    baseOptions.push({
      id: `${entry.id}:khepera_reflection`,
      sourceId: `${entry.id}:khepera`,
      entryId: entry.id,
      sourceType: 'khepera_reflection',
      createdAt,
      label: 'Khepera reflection',
      content: entry.kheperaReflection,
      preview: reflectionExcerpt,
      excerptCandidate: {
        id: `${entry.id}:khepera_reflection:excerpt`,
        sourceId: `${entry.id}:khepera`,
        sourceType: 'khepera_reflection',
        createdAt,
        excerpt: reflectionExcerpt,
      },
    });
  }

  const returnPreview = getReturnPreview(entry);
  if (returnPreview) {
    baseOptions.push({
      id: `${entry.id}:return`,
      sourceId: `${entry.id}:return`,
      entryId: entry.id,
      sourceType: 'return',
      createdAt,
      label: 'Return',
      content: returnPreview.excerpt,
      preview: returnPreview.excerpt,
      excerptCandidate: {
        id: `${entry.id}:return:excerpt`,
        sourceId: `${entry.id}:return`,
        sourceType: 'return',
        createdAt,
        excerpt: returnPreview.excerpt,
      },
    });
  }

  return baseOptions;
}

function buildSourceGroups(entries: JournalEntry[]): ReflectionExportSourceGroup[] {
  return entries
    .map((entry) => ({
      entryId: entry.id,
      createdAt: entry.createdAt.toISOString(),
      dateLabel: formatDateLabel(entry.createdAt),
      entryPreview: selectReturnExcerpt(entry.content),
      sources: buildSourceOptions(entry),
    }))
    .filter((group) => group.sources.length > 0)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function toSelectedSource(option: ReflectionExportSourceOption): ReflectionExportSelectedSource {
  return {
    id: option.sourceId,
    sourceType: option.sourceType,
    createdAt: option.createdAt,
    content: option.content,
  };
}

function compareSelections(
  left: { createdAt: string; sourceType: ReflectionExportSourceType; id: string },
  right: { createdAt: string; sourceType: ReflectionExportSourceType; id: string }
): number {
  return (
    left.createdAt.localeCompare(right.createdAt) ||
    left.sourceType.localeCompare(right.sourceType) ||
    left.id.localeCompare(right.id)
  );
}

export function useReflectionExport() {
  const { isInitialized, getJournalEntries } = useData();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectionError, setSelectionError] = useState('');
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [selectedExcerptIds, setSelectedExcerptIds] = useState<string[]>([]);
  const [userNote, setUserNote] = useState('');
  const [purpose] = useState<ReflectionExportPurpose>('reflection_export');
  const [framing, setFraming] = useState<ReflectionExportFraming>('personal_conversation');
  const [timeWindow, setTimeWindow] = useState<ReflectionExportTimeWindow>('last_month');
  const [step, setStep] = useState<ReflectionExportStep>('selection');
  const [previewState, setPreviewState] = useState<ReflectionExportPreviewState>('idle');
  const [previewError, setPreviewError] = useState('');
  const [buildResult, setBuildResult] = useState<ReflectionExportBuildResult | null>(null);
  const [exportState, setExportState] = useState<ReflectionExportExportState>('idle');
  const [exportError, setExportError] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    let mounted = true;
    setIsLoadingEntries(true);
    getJournalEntries(80)
      .then((items) => {
        if (!mounted) return;
        setEntries(items ?? []);
        setSelectionError('');
      })
      .catch(() => {
        if (!mounted) return;
        setSelectionError('Your recent writing could not be loaded right now.');
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoadingEntries(false);
      });

    return () => {
      mounted = false;
    };
  }, [getJournalEntries, isInitialized]);

  const allSourceGroups = useMemo(() => buildSourceGroups(entries), [entries]);

  const sourceGroups = useMemo(() => {
    const now = new Date();
    return allSourceGroups.filter((group) => {
      if (timeWindow === 'custom_selected_items') {
        return true;
      }

      return isWithinSelectedWindow(new Date(group.createdAt), timeWindow, now);
    });
  }, [allSourceGroups, timeWindow]);

  const sourceMap = useMemo(() => {
    const map = new Map<string, ReflectionExportSourceOption>();
    sourceGroups.forEach((group) => {
      group.sources.forEach((source) => {
        map.set(source.id, source);
      });
    });
    return map;
  }, [sourceGroups]);

  useEffect(() => {
    const visibleSourceIds = new Set(
      sourceGroups.flatMap((group) => group.sources.map((source) => source.id)),
    );

    setSelectedSourceIds((current) =>
      current.filter((id) => visibleSourceIds.has(id)),
    );
    setSelectedExcerptIds((current) =>
      current.filter((id) => visibleSourceIds.has(id.replace(/:excerpt$/, ''))),
    );
  }, [sourceGroups]);

  const selectedSources = useMemo(
    () =>
      selectedSourceIds
        .map((id) => sourceMap.get(id))
        .filter((source): source is ReflectionExportSourceOption => Boolean(source))
        .sort(compareSelections)
        .map(toSelectedSource),
    [selectedSourceIds, sourceMap]
  );

  const selectedExcerpts = useMemo(
    () =>
      selectedExcerptIds
        .map((id) => sourceMap.get(id.replace(/:excerpt$/, ''))?.excerptCandidate)
        .filter((excerpt): excerpt is ReflectionExportSelectedExcerptInput => Boolean(excerpt))
        .sort(compareSelections),
    [selectedExcerptIds, sourceMap]
  );

  const hasSelections = selectedSources.length > 0;

  const resetPreview = useCallback(() => {
    setBuildResult(null);
    setPreviewState('idle');
    setPreviewError('');
    setExportState('idle');
    setExportError('');
    setExportMessage('');
  }, []);

  const toggleSource = useCallback(
    (sourceId: string) => {
      resetPreview();
      setSelectedSourceIds((current) =>
        current.includes(sourceId) ? current.filter((id) => id !== sourceId) : [...current, sourceId]
      );
      setSelectedExcerptIds((current) =>
        current.filter((id) => id.replace(/:excerpt$/, '') !== sourceId)
      );
    },
    [resetPreview]
  );

  const toggleExcerpt = useCallback(
    (sourceId: string) => {
      if (!selectedSourceIds.includes(sourceId)) {
        return;
      }

      resetPreview();
      const excerptId = `${sourceId}:excerpt`;
      setSelectedExcerptIds((current) =>
        current.includes(excerptId) ? current.filter((id) => id !== excerptId) : [...current, excerptId]
      );
    },
    [resetPreview, selectedSourceIds]
  );

  const updateUserNote = useCallback(
    (nextValue: string) => {
      resetPreview();
      setUserNote(nextValue);
    },
    [resetPreview]
  );

  const updateFraming = useCallback((nextValue: ReflectionExportFraming) => {
    resetPreview();
    setFraming(nextValue);
  }, [resetPreview]);

  const updateTimeWindow = useCallback((nextValue: ReflectionExportTimeWindow) => {
    resetPreview();
    setTimeWindow(nextValue);
  }, [resetPreview]);

  const buildInput = useCallback((): ReflectionExportInput => {
    return {
      generatedAt: new Date().toISOString(),
      purpose,
      framing,
      timeWindow,
      selectedSources,
      selectedExcerpts,
      userNote: userNote.trim() || undefined,
      includeSourceManifest: true,
    };
  }, [framing, purpose, selectedExcerpts, selectedSources, timeWindow, userNote]);

  const generatePreview = useCallback(async () => {
    if (!hasSelections) {
      return;
    }

    setPreviewState('loading');
    setPreviewError('');
    setExportState('idle');
    setExportError('');
    setExportMessage('');

    try {
      const input = buildInput();
      const rawOutput = composeReflectionExportDraft(input);
      const nextBuild = buildReflectionExport(input, rawOutput);
      setBuildResult(nextBuild);
      setPreviewState('ready');
      setStep('preview');
    } catch (error) {
      setBuildResult(null);
      setPreviewState('error');
      setPreviewError(
        error instanceof Error
          ? error.message.replace(/^Reflection export validation failed:\s*/i, '')
          : 'The export could not be prepared right now.'
      );
      setStep('preview');
    }
  }, [buildInput, hasSelections]);

  const retryPreview = useCallback(async () => {
    await generatePreview();
  }, [generatePreview]);

  const goBackToSelection = useCallback(() => {
    setStep('selection');
    setExportState('idle');
    setExportError('');
    setExportMessage('');
  }, []);

  const exportDocument = useCallback(async () => {
    if (!buildResult) {
      return;
    }

    setExportState('exporting');
    setExportError('');
    setExportMessage('');

    try {
      const result = await exportReflectionDocument(buildResult.output);
      setExportState('success');
      setExportMessage(
        result.method === 'share'
          ? REFLECTION_EXPORT_COMPLETION_BODY
          : REFLECTION_EXPORT_COMPLETION_BODY
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setExportState('idle');
        return;
      }

      setExportState('error');
      setExportError(error instanceof Error ? error.message : 'The export could not be completed right now.');
    }
  }, [buildResult]);

  const previewWarnings: ReflectionExportValidationWarning[] = buildResult?.warnings ?? [];

  return {
    step,
    isLoadingEntries,
    selectionError,
    sourceGroups,
    framing,
    timeWindow,
    selectedSourceIds,
    selectedExcerptIds,
    selectedSources,
    selectedExcerpts,
    hasSelections,
    selectionCount: selectedSources.length,
    excerptCount: selectedExcerpts.length,
    userNote,
    previewState,
    previewError,
    buildResult,
    previewWarnings,
    exportState,
    exportError,
    exportMessage,
    completionTitle: REFLECTION_EXPORT_COMPLETION_TITLE,
    toggleSource,
    toggleExcerpt,
    updateUserNote,
    updateFraming,
    updateTimeWindow,
    generatePreview,
    retryPreview,
    goBackToSelection,
    exportDocument,
  };
}
