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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgba(255,255,255,0.2)] bg-[#6B7A5C]/95 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-2 backdrop-blur-xl"
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
                    ? 'bg-[rgba(255,255,255,0.15)] text-[#F2D99D]'
                    : 'text-[#F2D99D]/70 hover:text-[#F2D99D]',
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
