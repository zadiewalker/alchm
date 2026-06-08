import type { JournalSubmissionResult } from '@/types/journal';

export function getSubmissionStatusMessage(result: JournalSubmissionResult): string | null {
  switch (result.submissionState) {
    case 'offline_fallback':
      return "Your entry is saved here. This response was created offline, and Khepera will answer fully when connection returns.";
    case 'pending_sync':
      if (result.syncIssue === 'auth_required') {
        return 'Your entry is saved here. Sign in again to finish syncing it.';
      }
      return 'Your entry is saved here. It has not finished syncing yet.';
    case 'crisis_blocked':
      return 'Khepera did not continue. Crisis resources are shown here instead.';
    case 'reflection_limit':
      return 'Transformation includes unlimited Khepera reflections.';
    default:
      return null;
  }
}

export function getSubmissionErrorMessage(error: string | null): string | null {
  switch (error) {
    case 'local_save_failed':
      return 'Your entry could not be saved on this device. Nothing was submitted.';
    case 'aborted':
      return 'This was interrupted before it finished.';
    case 'too_short':
      return 'Write a little more before sending this to Khepera.';
    case 'submission_failed':
      return 'Something interrupted this before it finished.';
    case 'submission_timeout':
      return 'This is taking longer than expected. Your words are still here; try again when the connection settles.';
    default:
      return error;
  }
}
