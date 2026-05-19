'use client';

import { usePathname } from 'next/navigation';
import { DESIGN } from '@/lib/design';

const HIDDEN_FOOTER_PATHS = new Set(['/', '/onboarding']);

function shouldHideFooter(pathname: string | null): boolean {
  if (!pathname) return true;
  const normalized = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return HIDDEN_FOOTER_PATHS.has(normalized);
}

export function CrisisFooter() {
  const pathname = usePathname();

  if (shouldHideFooter(pathname)) {
    return <></>;
  }

  return (
    <footer
      style={{
        marginTop: 'auto',
        paddingTop: DESIGN.spacing.lg,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        textAlign: 'center',
      }}
    >
      <span style={{ color: DESIGN.colors.textMuted, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}>
        If you're in crisis, call or text{' '}
      </span>
      <a
        href="tel:988"
        aria-label="Call 988 Suicide and Crisis Lifeline"
        style={{ color: DESIGN.colors.gold, fontSize: DESIGN.typography.sizes.sm, fontFamily: DESIGN.typography.sansSerif }}
      >
        988
      </a>
    </footer>
  );
}
