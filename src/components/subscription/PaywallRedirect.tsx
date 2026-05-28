'use client';

import { useEffect } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

type PaywallRedirectProps = {
  source: string;
};

export function PaywallRedirect({ source }: PaywallRedirectProps): React.JSX.Element {
  const { navigate, inFlightRef } = useSafeNavigation();

  useEffect(() => {
    if (inFlightRef.current) {
      return;
    }

    navigate('/upgrade', {
      replace: true,
      source,
    });
  }, [inFlightRef, navigate, source]);

  return <LoadingState message="Opening this space…" variant="page" />;
}
