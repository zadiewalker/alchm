'use client';

import { BookOpen, Home, Layers3, Settings, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';

type FooterNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  aliases?: string[];
};

const NAV_ITEMS: FooterNavItem[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/containers', label: 'Containers', icon: Layers3 },
  { href: '/mirror', label: 'Reflections', icon: Sparkles, aliases: ['/insights'] },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FooterNav(): React.JSX.Element {
  const { navigate, pathname } = useInternalNavigation();

  return (
    <nav
      aria-label="Primary navigation"
      className="alchm-footer-nav fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-2"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href) || (item.aliases ?? []).some((alias) => isActive(pathname, alias));
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => navigate(item.href, { source: `tab:${item.label.toLowerCase()}` })}
                className={[
                  'flex min-h-11 w-full flex-col items-center justify-center rounded-2xl px-1 text-sm transition-colors',
                  active
                    ? 'alchm-footer-nav__link alchm-footer-nav__link--active'
                    : 'alchm-footer-nav__link',
                ].join(' ')}
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.7} />
                <span className="alchm-footer-nav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
