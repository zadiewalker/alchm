'use client';

import { useCallback } from 'react';
import {
  recordOperationalEvent,
  type OperationalEvent,
  type OperationalPayload,
} from '@/services/monitoring/telemetry';

export function useOperationalEvents(): (event: OperationalEvent, payload: OperationalPayload) => void {
  return useCallback((event: OperationalEvent, payload: OperationalPayload) => {
    recordOperationalEvent(event, payload);
  }, []);
}
