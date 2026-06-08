'use client';

import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { CrisisFooter } from '@/components/CrisisFooter';
import { FooterNav } from '@/components/ui/FooterNav';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import { resolveBackFallback, stripSearch } from '@/utils/navigation';

const MAIN_SHELL_ROUTES = [
  '/dashboard',
  '/journal',
  '/entry',
  '/containers',
  '/mirror',
  '/insights',
  '/settings',
  '/upgrade',
  '/emergency',
  '/checkin',
  '/return',
  '/export',
  '/exports',
] as const;

function shouldShowMainShell(pathname: string | null): boolean {
  const normalizedPath = stripSearch(pathname);
  return MAIN_SHELL_ROUTES.some((route) => {
    return normalizedPath === route || normalizedPath.startsWith(`${route}/`);
  });
}

function MainShellBackButton({ pathname }: { pathname: string | null }): React.JSX.Element | null {
  const fallback = resolveBackFallback(pathname);
  const { navigate } = useInternalNavigation();

  if (stripSearch(pathname) === '/dashboard') {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => navigate(fallback, { source: 'main_shell_back' })}
      className="alchm-shell-back-button"
    >
      <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.8} />
    </button>
  );
}

export function MainAppChrome({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const showMainShell = shouldShowMainShell(pathname);

  return (
    <>
      {children}
      {showMainShell ? (
        <>
          <MainShellBackButton pathname={pathname} />
          <CrisisFooter />
          <FooterNav />
        </>
      ) : null}
    </>
  );
}
