'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DESIGN } from '@/lib/design';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/containers', label: 'Containers' },
  { href: '/journal', label: 'Entries' },
  { href: '/insights', label: 'Mirror' },
  { href: '/settings', label: 'Settings' },
] as const;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FooterNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-2 backdrop-blur-xl"
      style={{
        background: 'color-mix(in srgb, var(--color-bg-app) 86%, transparent)',
        borderTop: DESIGN.colors.border,
      }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex min-h-11 items-center justify-center px-2 text-sm transition-colors',
                  active
                    ? 'text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
                ].join(' ')}
                style={{
                  borderRadius: DESIGN.radius.md,
                  background: active ? DESIGN.colors.bgElevated : 'transparent',
                  fontFamily: DESIGN.typography.sansSerif,
                }}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
