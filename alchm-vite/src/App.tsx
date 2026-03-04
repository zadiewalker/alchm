// @ts-nocheck
import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { RouterProvider, usePathname, useRefreshKey, useTransitionKind, type RoutePath } from '@/router';
import { DESIGN } from '@/lib/design';
import { CrisisFooter } from '@/components/CrisisFooter';
import { BottomTabBar } from '@/components/BottomTabBar';
import { GrowthProvider, useGrowth } from '@/hooks/useGrowth';
import { PhaseTransition } from '@/components/PhaseTransition';
import { PageTransition } from '@/components/PageTransition';
import { LiveAnnouncer } from '@/components/LiveAnnouncer';
import { initNetworkStatus } from '@/services/networkStatus';
import { processReflectionQueue } from '@/services/offlineQueue';
import { announce } from '@/services/announce';
import { haptics } from '@/services/haptics';
import { appendStartupError } from '@/services/startupErrorLog';
import { log } from '@/utils/logger';
import PathwaysPage from '@/app/pathways/page';
const IS_DEBUG = import.meta.env.DEV;

const CheckinPage = lazy(() => import('@/app/checkin/CheckinClient'));
const DashboardPage = lazy(() => import('@/app/dashboard/page'));
const GrowthPage = lazy(() => import('@/app/growth/page'));
const InsightsPage = lazy(() => import('@/app/insights/page'));
const JournalNewPage = lazy(() => import('@/app/journal/new/NewEntryClient'));
const JournalPage = lazy(() => import('@/app/journal/JournalClient'));
const EntryDetailPage = lazy(() => import('@/app/entry/page'));
const OnboardingPage = lazy(() => import('@/app/onboarding/OnboardingClient'));
const PrivacyPage = lazy(() => import('@/app/privacy/page'));
const PrivacyDataPage = lazy(() => import('@/app/privacy-data/page'));
const QABodyMapPage = lazy(() => import('@/app/qa/body-map/page'));
const SettingsPage = lazy(() => import('@/app/settings/SettingsClient'));
const TermsPage = lazy(() => import('@/app/terms/page'));

function RouterView() {
  const pathname = usePathname();
  const normalizedPathname = useMemo<RoutePath>(() => {
    if (pathname === '/') return '/';
    return (pathname.replace(/\/+$/, '') || '/') as RoutePath;
  }, [pathname]);
  const refreshKey = useRefreshKey();
  const transition = useTransitionKind();

  const view = useMemo(() => {
    switch (normalizedPathname) {
      case '/':
        return <DashboardPage />;
      case '/onboarding':
        return <OnboardingPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/journal/new':
        return <JournalNewPage />;
      case '/journal':
        return <JournalPage />;
      case '/entry':
        return <EntryDetailPage />;
      case '/pathways':
        return <PathwaysPage />;
      case '/insights':
        return <InsightsPage />;
      case '/growth':
        return <GrowthPage />;
      case '/checkin':
        return <CheckinPage />;
      case '/settings':
        return <SettingsPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/privacy-data':
        return <PrivacyDataPage />;
      case '/qa/body-map':
        return <QABodyMapPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <DashboardPage />;
    }
  }, [normalizedPathname]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <PageTransition transitionKey={`${normalizedPathname}:${refreshKey}`} kind={transition}>{view}</PageTransition>
    </Suspense>
  );
}

export default function App() {
  const initialPathname: RoutePath =
    typeof window !== 'undefined' ? (window.location.pathname as RoutePath) : '/dashboard';

  return (
    <ErrorBoundary name="root">
      <CapacitorBootstrap />
      <RouterProvider initialPathname={initialPathname}>
        <GrowthProvider>
          <PageShell>
            <RouterView />
          </PageShell>
          <GrowthPhaseGate />
        </GrowthProvider>
      </RouterProvider>
    </ErrorBoundary>
  );
}

function GrowthPhaseGate() {
  const growth = useGrowth();
  if (!growth.state.pendingPhase) return null;
  return (
    <PhaseTransition
      phaseId={growth.state.pendingPhase}
      onContinue={() => {
        growth.dismissPendingPhase();
        void haptics.warmth();
        announce('Khepera has grown.');
      }}
    />
  );
}

function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
}

function CapacitorBootstrap() {
  useEffect(() => {
    if (!isCapacitor()) return;

    void (async () => {
      try {
        const mod = await import('@capacitor/splash-screen');
        await mod.SplashScreen.hide({ fadeOutDuration: 200 });
        try {
          const status = await import('@capacitor/status-bar');
          await status.StatusBar.setStyle({ style: status.Style.Light });
          await status.StatusBar.setBackgroundColor({ color: '#A8B89C' });
        } catch {
          // no-op (web/unsupported)
        }
        await initNetworkStatus();
        await processReflectionQueue();
      } catch {
        // no-op
      }
    })();
  }, []);

  useEffect(() => {
    const onOnline = () => {
      void processReflectionQueue();
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void processReflectionQueue();
    };
    window.addEventListener('online', onOnline);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  useEffect(() => {
    if (!IS_DEBUG) return;
    const show = (title: string, detail: string) => {
      try {
        const id = '__alchm_runtime_error__';
        const existing = document.getElementById(id);
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.id = id;
        el.setAttribute('role', 'alert');
        el.style.position = 'fixed';
        el.style.inset = '0';
        el.style.zIndex = '99999';
        el.style.background = 'rgba(0,0,0,0.92)';
        el.style.color = 'rgba(255,255,255,0.92)';
        el.style.padding = '24px 20px';
        el.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif';
        el.style.overflow = 'auto';

        const h = document.createElement('div');
        h.textContent = title;
        h.style.fontSize = '16px';
        h.style.fontWeight = '600';
        h.style.marginBottom = '10px';

        const p = document.createElement('pre');
        p.textContent = detail;
        p.style.whiteSpace = 'pre-wrap';
        p.style.margin = '0';
        p.style.fontSize = '12px';
        p.style.color = 'rgba(255,255,255,0.72)';

        el.appendChild(h);
        el.appendChild(p);
        document.body.appendChild(el);
      } catch {
        // no-op
      }
    };

    const onError = (event: ErrorEvent) => {
      const msg = event.error instanceof Error ? `${event.error.name}: ${event.error.message}` : String(event.message || 'Unknown error');
      const where = event.filename ? `${event.filename}:${event.lineno || 0}:${event.colno || 0}` : '';
      const detail = [msg, where, event.error instanceof Error && event.error.stack ? event.error.stack : ''].filter(Boolean).join('\n');
      appendStartupError({ type: 'error', title: 'ALCHM encountered a runtime error', detail });
      show('ALCHM encountered a runtime error', detail);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : String(event.reason || 'Unknown rejection');
      const detail = [reason, event.reason instanceof Error && event.reason.stack ? event.reason.stack : ''].filter(Boolean).join('\n');
      appendStartupError({ type: 'unhandledrejection', title: 'ALCHM encountered an unhandled promise rejection', detail });
      show('ALCHM encountered an unhandled promise rejection', detail);
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}

function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const bg = useMemo(() => {
    if (pathname === '/') return DESIGN.gradients.splash;
    if (pathname === '/dashboard') {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 7) return 'linear-gradient(180deg, var(--sage-dark) 0%, var(--sage-deep) 100%)';
      if (hour >= 7 && hour < 12) return 'linear-gradient(180deg, var(--sage-base) 0%, var(--sage-deep) 100%)';
      if (hour >= 12 && hour < 17) return 'linear-gradient(180deg, var(--sage-light) 0%, var(--sage-mid) 100%)';
      if (hour >= 17 && hour < 22) return 'linear-gradient(180deg, var(--sage-mid) 0%, var(--sage-dark) 100%)';
      return 'linear-gradient(180deg, var(--sage-dark) 0%, var(--sage-deep) 100%)';
    }
    return DESIGN.gradients.sanctuary;
  }, [pathname]);

  return (
    <div className="page-container" style={{ background: bg, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}>
      <LiveAnnouncer />
      <div className="scrollable">{children}</div>
      <BottomTabBar />
      {pathname !== '/' ? <CrisisFooter /> : null}
    </div>
  );
}

function RouteFallback() {
  return (
    <div style={{ minHeight: '55vh', display: 'grid', placeItems: 'center', color: DESIGN.colors.textSecondary }}>
      Loading...
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; name?: string },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack || ''}` : String(error);
    appendStartupError({ type: 'react-boundary', title: `ErrorBoundary:${this.props.name || 'app'}`, detail });
    if (IS_DEBUG) log.error('ErrorBoundary:', this.props.name || 'app', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: DESIGN.colors.bgDeep,
          color: DESIGN.colors.textPrimary,
          fontFamily: DESIGN.typography.sansSerif,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: DESIGN.typography.weights.medium }}>ALCHM hit an error</div>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>
          {this.state.message || 'Something went wrong.'}
        </div>
        <button
          type="button"
          onClick={this.handleReset}
          aria-label="Reset the app view"
          style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: DESIGN.colors.cardBg,
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }
}
