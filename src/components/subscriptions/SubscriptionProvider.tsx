'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  useSubscriptionController,
  type SubscriptionController,
} from '@/hooks/useSubscriptionController';

const SubscriptionContext = createContext<SubscriptionController | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const subscription = useSubscriptionController();
  return (
    <SubscriptionContext.Provider value={subscription}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext(): SubscriptionController {
  const value = useContext(SubscriptionContext);
  if (!value) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return value;
}
