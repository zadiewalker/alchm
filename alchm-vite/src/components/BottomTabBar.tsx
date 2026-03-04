// @ts-nocheck
import { usePathname, useRouter, type RoutePath } from '@/router';
import { useEffect, useMemo, useState } from 'react';
import { haptics } from '@/services/haptics';
import { getEntries } from '@/lib/journal';
import { readJsonExact, STORAGE_KEYS, writeJson } from '@/lib/storage';

const TABS: Array<{ path: RoutePath; label: string; icon: 'home' | 'containers' | 'mirror' | 'entries' }> = [
  { path: '/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/pathways', label: 'Containers', icon: 'containers' },
  { path: '/insights', label: 'Mirror', icon: 'mirror' },
  { path: '/journal', label: 'Entries', icon: 'entries' },
];

function TabIcon(props: { name: 'home' | 'containers' | 'mirror' | 'entries' }) {
  if (props.name === 'home') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 11.5L12 5l8 6.5" />
        <path d="M7.5 10.5V19h9v-8.5" />
      </svg>
    );
  }
  if (props.name === 'containers') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4.5" y="5.5" width="15" height="13" rx="2.5" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
    );
  }
  if (props.name === 'mirror') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="12" rx="8.5" ry="5.5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 6h10M7 12h10M7 18h10" />
      <circle cx="5" cy="6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
            <TabIcon name={tab.icon} />
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
