import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export type RoutePath =
  | '/'
  | '/onboarding'
  | '/dashboard'
  | '/journal'
  | '/journal/new'
  | '/pathways'
  | '/insights'
  | '/checkin'
  | '/settings'
  | '/pricing'
  | '/privacy'
  | '/terms';

function normalize(path: string): RoutePath {
  // Normalize to match the static-export style routes used in alchm-v2.
  const raw = path.trim() || '/';
  const noQuery = raw.split('?')[0] || '/';
  const noHash = noQuery.split('#')[0] || '/';
  if (noHash === '/') return '/';
  const trimmed = noHash.endsWith('/') ? noHash.slice(0, -1) : noHash;

  // If an unknown route comes in, fall back to dashboard.
  const allowed: RoutePath[] = [
    '/',
    '/onboarding',
    '/dashboard',
    '/journal',
    '/journal/new',
    '/pathways',
    '/insights',
    '/checkin',
    '/settings',
    '/pricing',
    '/privacy',
    '/terms',
  ];

  return (allowed.includes(trimmed as RoutePath) ? (trimmed as RoutePath) : '/dashboard');
}

type RouterApi = {
  push: (path: RoutePath | string) => void;
  replace: (path: RoutePath | string) => void;
  back: () => void;
  refresh: () => void;
};

type RouterState = {
  pathname: RoutePath;
  refreshKey: number;
  router: RouterApi;
};

const RouterContext = createContext<RouterState | null>(null);

export function RouterProvider({
  initialPathname,
  children,
}: {
  initialPathname: RoutePath;
  children: React.ReactNode;
}) {
  const [pathname, setPathname] = useState<RoutePath>(() => normalize(initialPathname));
  const [refreshKey, setRefreshKey] = useState(0);
  const historyRef = useRef<RoutePath[]>([]);

  const push = useCallback((path: RoutePath | string) => {
    const next = normalize(String(path));
    setPathname((prev) => {
      historyRef.current.push(prev);
      return next;
    });
  }, []);

  const replace = useCallback((path: RoutePath | string) => {
    const next = normalize(String(path));
    setPathname(next);
  }, []);

  const back = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setPathname(prev);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const router = useMemo<RouterApi>(() => ({ push, replace, back, refresh }), [push, replace, back, refresh]);
  const value = useMemo<RouterState>(() => ({ pathname, refreshKey, router }), [pathname, refreshKey, router]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterApi {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx.router;
}

export function usePathname(): RoutePath {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('usePathname must be used within RouterProvider');
  return ctx.pathname;
}

export function useRefreshKey(): number {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRefreshKey must be used within RouterProvider');
  return ctx.refreshKey;
}
