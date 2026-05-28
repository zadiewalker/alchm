'use client';

import { useCallback } from 'react';
import { getSubmissionErrorMessage } from '@/services/journal/submissionState';

export function useSubmissionErrorMessage(): (error: string) => string | null {
  return useCallback((error: string) => getSubmissionErrorMessage(error), []);
}
