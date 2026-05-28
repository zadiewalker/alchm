'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type ClientRouteRedirectProps = {
  to: string | (() => string);
};

export function ClientRouteRedirect({ to }: ClientRouteRedirectProps): React.JSX.Element | null {
  const router = useRouter();
  const targetRef = useRef<string>('/');
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const target = typeof to === 'function' ? to() : to;
    targetRef.current = target;
    router.replace(target);

    const recoveryTimer = window.setTimeout(() => {
      setShowRecovery(true);
    }, 1800);

    return () => {
      window.clearTimeout(recoveryTimer);
    };
  }, [router, to]);

  if (!showRecovery) {
    return null;
  }

  return (
    <main className="splash-brand-screen startup-wordmark-screen" aria-label="Opening ALCHM">
      <p className="startup-wordmark-copy">ALCHM is opening.</p>
      <button
        type="button"
        className="btn-primary"
        onClick={() => router.replace(targetRef.current)}
      >
        Continue
      </button>
    </main>
  );
}
