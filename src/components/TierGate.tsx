'use client';

import type { TierGateProps } from '@/types/components';

export function TierGate({ children, feature, fallback }: TierGateProps): React.JSX.Element | null {
  void feature;
  void fallback;
  return <>{children}</>;
}
