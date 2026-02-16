'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const id = window.setTimeout(() => setVisible(true), 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}>{children}</div>;
}
