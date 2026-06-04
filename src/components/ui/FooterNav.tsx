'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/journal', label: 'Journal' },
  { href: '/containers', label: 'Containers' },
  { href: '/insights', label: 'Reflections' },
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
      className="alchm-footer-nav fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-2"
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
                  'flex min-h-11 items-center justify-center rounded-2xl px-2 text-sm transition-colors',
                  active
                    ? 'alchm-footer-nav__link alchm-footer-nav__link--active'
                    : 'alchm-footer-nav__link',
                ].join(' ')}
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
