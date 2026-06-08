'use client';

import type { TabId } from '@/types/shell';
import type { RoutePath } from '@/types/navigation';

export type TabRoute = {
  id: TabId;
  label: string;
  path: string;
  aliases?: string[];
};

export const TAB_ROUTES: TabRoute[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'containers', label: 'Containers', path: '/containers' },
  { id: 'entries', label: 'Entries', path: '/journal' },
  { id: 'mirror', label: 'Mirror', path: '/mirror', aliases: ['/insights'] },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

export function normalizeAppPath(path: string | null | undefined): string {
  if (!path) {
    return '/';
  }

  const [pathname, search = ''] = path.split('?');
  const normalizedPathname = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname || '/';

  return search ? `${normalizedPathname}?${search}` : normalizedPathname;
}

export function stripSearch(path: string | null | undefined): string {
  return normalizeAppPath(path).split('?')[0] || '/';
}

export function isPathMatch(pathname: string | null | undefined, candidate: string): boolean {
  const normalizedPathname = stripSearch(pathname);
  const normalizedCandidate = stripSearch(candidate);

  if (normalizedPathname === normalizedCandidate) {
    return true;
  }

  return normalizedPathname.startsWith(`${normalizedCandidate}/`);
}

export function getActiveTab(pathname: string | null | undefined): TabId | null {
  const normalizedPathname = stripSearch(pathname);
  const tab = TAB_ROUTES.find((route) => {
    if (isPathMatch(normalizedPathname, route.path)) {
      return true;
    }

    return (route.aliases ?? []).some((alias) => isPathMatch(normalizedPathname, alias));
  });

  return tab?.id ?? null;
}

export function isRootDestination(pathname: string | null | undefined): boolean {
  const normalizedPathname = stripSearch(pathname);
  if (normalizedPathname === '/') {
    return true;
  }

  return TAB_ROUTES.some((route) => normalizedPathname === route.path);
}

export function resolveBackFallback(pathname: string | null | undefined): RoutePath {
  const normalizedPathname = stripSearch(pathname);

  if (normalizedPathname.startsWith('/settings/disclaimer')) {
    return '/settings';
  }

  if (normalizedPathname.startsWith('/upgrade')) {
    return '/settings';
  }

  if (normalizedPathname.startsWith('/exports') || normalizedPathname.startsWith('/export')) {
    return '/dashboard';
  }

  if (normalizedPathname.startsWith('/auth/reset')) {
    return '/auth/signin';
  }

  if (normalizedPathname.startsWith('/auth/create')) {
    return '/dashboard';
  }

  if (normalizedPathname.startsWith('/auth/signin') || normalizedPathname.startsWith('/auth/login')) {
    return '/dashboard';
  }

  if (normalizedPathname.startsWith('/auth/signup')) {
    return '/auth/create';
  }

  if (normalizedPathname.startsWith('/journal/new')) {
    return '/journal';
  }

  if (normalizedPathname === '/journal') {
    return '/dashboard';
  }

  if (normalizedPathname.startsWith('/containers/')) {
    const [, , containerId, subroute] = normalizedPathname.split('/');
    if (!containerId) {
      return '/containers';
    }

    if (!subroute) {
      return '/containers';
    }

    return `/containers/${containerId}`;
  }

  if (normalizedPathname.startsWith('/return')) {
    return '/dashboard';
  }

  if (normalizedPathname.startsWith('/mirror')) {
    return '/dashboard';
  }

  return '/dashboard';
}
