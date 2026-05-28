import { useState, useCallback, useRef, useEffect } from 'react';
import { useSafeAsync } from './useSafeAsync';
import type { JournalSubmissionInput, JournalSubmissionResult } from '@/types/journal';
import { STORAGE_KEYS } from '@/config/storageKeys';
import { clientStorageService } from '@/services/storage/clientStorageService';
import { recordOperationalEvent } from '@/services/monitoring/telemetry';

export type JournalView = 'writing' | 'loading' | 'receiving' | 'error';

export interface UseJournalReturn {
  // State
  view: JournalView;
  entryText: string;
  result: JournalSubmissionResult | null;
  error: string | null;

  // Actions
  setEntryText: (text: string) => void;
  submit: (input: Omit<JournalSubmissionInput, 'entryText'>) => Promise<void>;
  reset: () => void;
  dismiss: () => void;
}

export function useJournal(): UseJournalReturn {
  const { isMounted, safeDispatch } = useSafeAsync();
  const abortRef = useRef<AbortController | null>(null);
  const isSubmittingRef = useRef(false);
  const operationIdRef = useRef<string | null>(null);
  const [view, setView] = useState<JournalView>('writing');
  const [entryText, setEntryText] = useState('');
  const [result, setResult] = useState<JournalSubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setViewSafe = safeDispatch(setView);
  const setResultSafe = safeDispatch(setResult);
  const setErrorSafe = safeDispatch(setError);

  const submit = useCallback(async (baseInput: Omit<JournalSubmissionInput, 'entryText'>) => {
    if (entryText.trim().length < 3 || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    operationIdRef.current = crypto.randomUUID();
    abortRef.current = new AbortController();
    recordOperationalEvent('first_write_submitted', { localId: operationIdRef.current, source: 'journal_new' });

    setViewSafe('loading');
    setErrorSafe(null);

    const fullInput: JournalSubmissionInput = {
      ...baseInput,
      entryText,
      operationId: operationIdRef.current,
    };
    const { submitJournalEntry } = await import('@/services/journal/submissionPipeline');

    const submissionResult = await submitJournalEntry(fullInput, abortRef.current.signal)
      .catch((err) => {
        if (err?.name === 'AbortError') return null;
        const submissionState: JournalSubmissionResult['submissionState'] =
          err?.message === 'local_save_failed'
            ? 'failed_local_save'
            : 'aborted';
        return {
          success: false,
          entryId: null,
          localId: operationIdRef.current ?? Date.now().toString(),
          kheperaResponse: '',
          seed: '',
          isCrisis: false,
          submissionState,
          error: err?.message ?? 'submission_failed',
        };
      });

    isSubmittingRef.current = false;
    operationIdRef.current = null;

    if (!isMounted() || !submissionResult) return;

    if (!submissionResult.success) {
      setErrorSafe(submissionResult.error ?? 'submission_failed');
      setViewSafe('error');
      return;
    }

    if (submissionResult.entryId && !submissionResult.isCrisis && submissionResult.submissionState !== 'delayed_return') {
      const isFirstEntry = clientStorageService.get(STORAGE_KEYS.FIRST_ENTRY_COMPLETED) !== 'true';
      if (isFirstEntry) {
        clientStorageService.set(STORAGE_KEYS.FIRST_ENTRY_COMPLETED, 'true');
        recordOperationalEvent('first_khepera_received', {
          localId: submissionResult.localId,
          source: 'journal_new',
        });
      }

    }

    setResultSafe(submissionResult);
    setViewSafe('receiving');
  }, [entryText, isMounted, setViewSafe, setResultSafe, setErrorSafe]);

  const reset = useCallback(() => {
    isSubmittingRef.current = false;
    operationIdRef.current = null;
    setEntryText('');
    setResult(null);
    setError(null);
    setView('writing');
  }, []);

  const dismiss = useCallback(() => {
    isSubmittingRef.current = false;
    operationIdRef.current = null;
    setView('writing');
  }, []);

  useEffect(() => () => {
    isSubmittingRef.current = false;
    operationIdRef.current = null;
    abortRef.current?.abort();
  }, []);

  return { view, entryText, result, error, setEntryText, submit, reset, dismiss };
}
