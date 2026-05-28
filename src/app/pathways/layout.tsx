'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PathwaysLayout(): React.JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    router.replace('/containers/');
  }, [router]);

  return null;
}
