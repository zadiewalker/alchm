import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type GrowthValue = {
  state: { pendingPhase: string | null; profile: { grace_tokens_available: number } };
  phase: { name: string };
  dismissPendingPhase: () => void;
  logContainerSession: (_v: boolean) => void;
  startBreak: (_date: string) => void;
};

const Ctx = createContext<GrowthValue | null>(null);

export function GrowthProvider(props: { children: ReactNode }) {
  const [pendingPhase, setPendingPhase] = useState<string | null>(null);
  const value = useMemo<GrowthValue>(() => ({
    state: { pendingPhase, profile: { grace_tokens_available: 2 } },
    phase: { name: 'early' },
    dismissPendingPhase: () => setPendingPhase(null),
    logContainerSession: () => {},
    startBreak: () => {},
  }), [pendingPhase]);
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>;
}

export function useGrowth() {
  return useContext(Ctx) || {
    state: { pendingPhase: null, profile: { grace_tokens_available: 2 } },
    phase: { name: 'early' },
    dismissPendingPhase: () => {},
    logContainerSession: () => {},
    startBreak: () => {},
  };
}
