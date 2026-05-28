import { useCallback } from 'react';
import { submitJournalEntry } from '@/services/journal/submissionPipeline';
import { cancelReminder } from '@/services/notifications/localReminderService';
import type { JournalSubmissionInput, JournalSubmissionResult } from '@/types/journal';

export interface StandaloneJournalSubmissionController {
  submitEntry: (input: JournalSubmissionInput) => Promise<JournalSubmissionResult>;
  submitCheckIn: (input: JournalSubmissionInput) => Promise<JournalSubmissionResult>;
}

export function useStandaloneJournalSubmission(): StandaloneJournalSubmissionController {
  const submitEntry = useCallback(async (input: JournalSubmissionInput): Promise<JournalSubmissionResult> => {
    return submitJournalEntry(input);
  }, []);

  const submitCheckIn = useCallback(async (input: JournalSubmissionInput): Promise<JournalSubmissionResult> => {
    const result = await submitJournalEntry(input);
    if (result.success) {
      await cancelReminder('return');
    }
    return result;
  }, []);

  return { submitEntry, submitCheckIn };
}
