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

const JOURNAL_SUBMISSION_UI_RECOVERY_MS = 18000;

function buildSubmissionTimeoutResult(localId: string): JournalSubmissionResult {
  return {
    success: false,
    entryId: null,
    localId,
    witness: '',
    perspective: '',
    kheperaResponse: '',
    seed: '',
    isCrisis: false,
    submissionState: 'aborted',
    error: 'submission_timeout',
  };
}

function waitForSubmissionRecovery(localId: string): Promise<JournalSubmissionResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(buildSubmissionTimeoutResult(localId));
    }, JOURNAL_SUBMISSION_UI_RECOVERY_MS);
  });
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
    operationIdRef.current = operationIdRef.current ?? crypto.randomUUID();
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

    const activeOperationId = operationIdRef.current;
    const submission = submitJournalEntry(fullInput, abortRef.current.signal)
      .catch((err) => {
        if (err?.name === 'AbortError') return null;
        const submissionState: JournalSubmissionResult['submissionState'] =
          err?.message === 'local_save_failed'
            ? 'failed_local_save'
            : 'aborted';
        return {
          success: false,
          entryId: null,
          localId: activeOperationId,
          kheperaResponse: '',
          seed: '',
          isCrisis: false,
          submissionState,
          error: err?.message ?? 'submission_failed',
        };
      });
    const submissionResult = await Promise.race([
      submission,
      waitForSubmissionRecovery(activeOperationId),
    ]);

    isSubmittingRef.current = false;

    if (!isMounted() || !submissionResult) return;

    if (!submissionResult.success) {
      setErrorSafe(submissionResult.error ?? 'submission_failed');
      setViewSafe('error');
      submission.then((settledResult) => {
        if (!isMounted() || !settledResult || operationIdRef.current !== activeOperationId) return;
        isSubmittingRef.current = false;
        if (!settledResult.success) return;
        setResultSafe(settledResult);
        setErrorSafe(null);
        setViewSafe('receiving');
        operationIdRef.current = null;
      }).catch(() => {
        // The visible error state already preserves the draft and retry affordance.
      });
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
    operationIdRef.current = null;
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
