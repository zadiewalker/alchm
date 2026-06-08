'use client';

import { usePathname } from 'next/navigation';
import { CrisisFooter } from '@/components/CrisisFooter';
import { FooterNav } from '@/components/ui/FooterNav';
import { stripSearch } from '@/utils/navigation';

const MAIN_SHELL_ROUTES = [
  '/dashboard',
  '/journal',
  '/containers',
  '/mirror',
  '/insights',
  '/settings',
] as const;

function shouldShowMainShell(pathname: string | null): boolean {
  const normalizedPath = stripSearch(pathname);
  return MAIN_SHELL_ROUTES.some((route) => {
    return normalizedPath === route || normalizedPath.startsWith(`${route}/`);
  });
}

export function MainAppChrome({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const showMainShell = shouldShowMainShell(pathname);

  return (
    <>
      {children}
      {showMainShell ? (
        <>
          <CrisisFooter />
          <FooterNav />
        </>
      ) : null}
    </>
  );
}
