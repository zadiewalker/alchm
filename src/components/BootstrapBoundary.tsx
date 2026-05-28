'use client';

import { useLayoutEffect, useState, type ReactNode } from 'react';
import { bootstrap } from '@/boot/bootstrap';

export function BootstrapBoundary({ children }: { children: ReactNode }): React.JSX.Element | null {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const result = bootstrap();
    if (result.ok) {
      setReady(true);
      return;
    }

    window.dispatchEvent(new CustomEvent('alchm:fatal', {
      detail: { message: result.error ?? 'Startup failed' },
    }));
  }, []);

  return ready ? <>{children}</> : null;
}
