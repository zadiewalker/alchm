'use client';

import { useEffect, useState } from 'react';
import { CrisisFooter } from './CrisisFooter';
import { CrisisModal } from './CrisisModal';
import { TabBar } from './TabBar';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { useNotificationRouting } from '@/hooks/useNotificationRouting';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { onCrisisModalRequest } from '@/utils/crisisEvents';
import type { AppShellProps } from '@/types/shell';

export const TAB_BAR_HEIGHT = 83;
export const CRISIS_FOOTER_HEIGHT = 36;
export const SHELL_BOTTOM_PADDING = TAB_BAR_HEIGHT + CRISIS_FOOTER_HEIGHT;

export function AppShell({ children }: AppShellProps): React.JSX.Element {
  const [crisisOpen, setCrisisOpen] = useState(false);
  const { navigate } = useSafeNavigation();
  
  // Initialize offline sync (passive - no props needed)
  useOfflineSync();
  useNotificationRouting(navigate);

  useEffect(() => {
    const unsubscribe = onCrisisModalRequest(() => setCrisisOpen(true));
    return unsubscribe;
  }, []);

  return (
    <div
      className="screen-gradient"
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          paddingBottom: `calc(${SHELL_BOTTOM_PADDING}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {children}
      </div>
      <CrisisFooter onPress={() => setCrisisOpen(true)} />
      <TabBar />
      {crisisOpen ? <CrisisModal onClose={() => setCrisisOpen(false)} /> : null}
    </div>
  );
}
