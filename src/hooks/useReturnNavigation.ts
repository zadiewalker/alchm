'use client';

import { useCallback } from 'react';
import {
  parseReturnSearchParams,
  type ReturnPageSearchParams,
} from '@/services/returns/parseReturnSearchParams';
import { buildReturnToJournalHref } from '@/services/returns/buildReturnToJournalHref';
import type { ParsedReturnSearchParams, ReturnNavigationState } from '@/types/return';

export type { ReturnPageSearchParams };

export function useReturnNavigation(): {
  parse: (params: ReturnPageSearchParams) => ParsedReturnSearchParams;
  buildJournalHref: (state: ReturnNavigationState) => string;
} {
  const parse = useCallback(
    (params: ReturnPageSearchParams) => parseReturnSearchParams(params),
    [],
  );
  const buildJournalHref = useCallback(
    (state: ReturnNavigationState) => buildReturnToJournalHref(state),
    [],
  );
  return { parse, buildJournalHref };
}
