import { usePathname, useRouter, type RoutePath } from '@/router';
import { useEffect, useMemo, useState } from 'react';
import { haptics } from '@/services/haptics';
import { getEntries } from '@/lib/journal';
import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

const TABS: Array<{ path: RoutePath; label: string; icon: string }> = [
  { path: '/dashboard', label: 'Dashboard', icon: 'D' },
  { path: '/pathways', label: 'Containers', icon: 'C' },
  { path: '/insights', label: 'Mirror', icon: 'M' },
  { path: '/journal', label: 'Entries', icon: 'E' },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const normalizedPathname = useMemo<RoutePath>(() => {
    if (pathname === '/') return '/dashboard';
    return (pathname.replace(/\/+$/, '') || '/dashboard') as RoutePath;
  }, [pathname]);
  const router = useRouter();
  const [entryCount, setEntryCount] = useState(0);
  const [mirrorSeen, setMirrorSeen] = useState<boolean>(readJsonExact<boolean>(STORAGE_KEYS.mirrorTabSeen, false));

  useEffect(() => {
    setEntryCount(getEntries().filter((entry) => entry.type !== 'check-in' && entry.type !== 'checkin').length);
  }, [pathname]);

  const showMirror = entryCount >= 5;
  const showMirrorNewDot = showMirror && !mirrorSeen;
  const tabs = useMemo(
    () => TABS.filter((tab) => tab.path !== '/insights' || showMirror),
    [showMirror],
  );

  if (!tabs.some((tab) => tab.path === normalizedPathname)) {
    return null;
  }

  return (
    <nav className="tabbar tab-bar" aria-label="Main navigation" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          type="button"
          className={`tabbar-btn ${normalizedPathname === tab.path ? 'tab--active' : 'tab--inactive'}`}
          data-active={normalizedPathname === tab.path}
          onClick={() => {
            void haptics.light();
            if (tab.path === '/insights' && showMirrorNewDot) {
              writeJson(STORAGE_KEYS.mirrorTabSeen, true);
              setMirrorSeen(true);
            }
            if (normalizedPathname === tab.path) {
              window.dispatchEvent(new CustomEvent('alchm:tab-reselect', { detail: { path: tab.path } }));
              const scroller = document.querySelector<HTMLElement>('.scrollable');
              if (scroller) {
                scroller.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
              return;
            }
            router.push(tab.path);
          }}
          role="tab"
          aria-selected={normalizedPathname === tab.path}
          aria-label={tab.label}
          aria-current={normalizedPathname === tab.path ? 'page' : undefined}
        >
          <span className="tabbar-icon tab-icon" aria-hidden="true">
            {tab.icon}
            {tab.path === '/insights' && showMirrorNewDot ? (
              <span
                aria-label="Something new"
                style={{
                  marginLeft: '4px',
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '9999px',
                  background: 'var(--gold-primary)',
                  verticalAlign: 'middle',
                }}
              />
            ) : null}
          </span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
