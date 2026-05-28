'use client';

import { useCallback, useState } from 'react';
import { submitSupportTicket } from '@/services/support/submitSupportTicket';
import type {
  PersistableSupportRequestType,
  SupportCategory,
  SupportContext,
  SupportTicket,
} from '@/types/support';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useSubmitSupportTicket() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);

  const submit = useCallback(async (params: {
    userId: string;
    type: PersistableSupportRequestType;
    description: string;
    category?: SupportCategory;
    context?: SupportContext;
  }) => {
    setStatus('submitting');
    setError(null);

    try {
      const nextTicket = await submitSupportTicket(params);
      setTicket(nextTicket);
      setStatus('success');
      return nextTicket;
    } catch {
      setError('Support could not receive this right now.');
      setStatus('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTicket(null);
  }, []);

  return {
    status,
    error,
    ticket,
    submit,
    reset,
  };
}
