'use client';

import { useCallback, useMemo, useState } from 'react';
import { SUPPORT_COPY } from '@/config/supportCopy';
import type {
  SupportBoundaryClassification,
  SupportCategory,
  SupportSubmissionResult,
} from '@/types/support';
import { classifySupportBoundary } from '@/services/support/supportBoundaryClassifier';
import { submitSupportRequest } from '@/services/support/supportService';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

function getErrorMessage(errorCode?: SupportSubmissionResult['errorCode']): string {
  switch (errorCode) {
    case 'missing_category':
      return SUPPORT_COPY.emptyCategoryError;
    case 'missing_message':
      return SUPPORT_COPY.emptyMessageError;
    case 'message_too_long':
      return SUPPORT_COPY.tooLongMessageError;
    case 'submission_unavailable':
    default:
      return SUPPORT_COPY.errorBody;
  }
}

export function useSupportForm() {
  const [category, setCategory] = useState<SupportCategory | ''>('');
  const [message, setMessage] = useState('');
  const [includeDiagnostics, setIncludeDiagnostics] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionResult, setSubmissionResult] = useState<SupportSubmissionResult | null>(null);

  const boundary = useMemo<SupportBoundaryClassification>(() => (
    message.trim() ? classifySupportBoundary(message) : 'standard'
  ), [message]);

  const handleSubmit = useCallback(async () => {
    setStatus('submitting');
    setErrorMessage('');

    const result = await submitSupportRequest({
      category,
      message,
      diagnostics: { includeDiagnostics },
    });

    setSubmissionResult(result);

    if (result.ok) {
      setStatus('success');
      return;
    }

    setStatus('error');
    setErrorMessage(getErrorMessage(result.errorCode));
  }, [category, message, includeDiagnostics]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
    setSubmissionResult(null);
  }, []);

  return {
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
    remainingCharacters: SUPPORT_COPY.maxMessageLength - message.length,
    handleSubmit,
    handleReset,
  };
}
