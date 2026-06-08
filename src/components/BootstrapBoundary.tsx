'use client';

import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { bootstrap } from '@/boot/bootstrap';
import { ErrorScreen } from '@/components/boot/ErrorScreen';

export function BootstrapBoundary({ children }: { children: ReactNode }): React.JSX.Element | null {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBootstrap = useCallback((): void => {
    const result = bootstrap();
    if (result.ok) {
      setError(null);
      setReady(true);
      return;
    }

    setReady(false);
    setError(result.error ?? 'Startup failed');
  }, []);

  useLayoutEffect(() => {
    runBootstrap();
  }, [runBootstrap]);

  useEffect(() => {
    const handleFatal = (event: Event): void => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setReady(false);
      setError(detail?.message ?? 'A JavaScript error occurred during startup.');
    };

    window.addEventListener('alchm:fatal', handleFatal as EventListener);
    return () => {
      window.removeEventListener('alchm:fatal', handleFatal as EventListener);
    };
  }, []);

  if (error) {
    return (
      <ErrorScreen
        message="Try again to reopen the app."
        detail={process.env.NODE_ENV === 'development' ? error : undefined}
        onRetry={runBootstrap}
      />
    );
  }

  return ready ? <>{children}</> : null;
}
