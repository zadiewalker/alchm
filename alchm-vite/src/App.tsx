import { useMemo } from 'react';
import { CapacitorBootstrap } from '@/components/CapacitorBootstrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageShell } from '@/components/PageShell';
import { isOnboarded } from '@/lib/onboarding';
import { RouterProvider, usePathname, useRefreshKey, type RoutePath } from '@/router';

import CheckinPage from '@/app/checkin/page';
import DashboardPage from '@/app/dashboard/page';
import InsightsPage from '@/app/insights/page';
import JournalNewPage from '@/app/journal/new/page';
import JournalPage from '@/app/journal/page';
import OnboardingPage from '@/app/onboarding/page';
import PathwaysPage from '@/app/pathways/page';
import PricingPage from '@/app/pricing/page';
import PrivacyPage from '@/app/privacy/page';
import SettingsPage from '@/app/settings/page';
import TermsPage from '@/app/terms/page';
import SplashPage from '@/app/page';

function RouterView() {
  const pathname = usePathname();
  const refreshKey = useRefreshKey();

  const view = useMemo(() => {
    switch (pathname) {
      case '/':
        return <SplashPage />;
      case '/onboarding':
        return <OnboardingPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/journal/new':
        return <JournalNewPage />;
      case '/journal':
        return <JournalPage />;
      case '/pathways':
        return <PathwaysPage />;
      case '/insights':
        return <InsightsPage />;
      case '/checkin':
        return <CheckinPage />;
      case '/settings':
        return <SettingsPage />;
      case '/pricing':
        return <PricingPage />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <DashboardPage />;
    }
  }, [pathname]);

  return <div key={`${pathname}:${refreshKey}`}>{view}</div>;
}

export default function App() {
  const initialPathname: RoutePath = isOnboarded() ? '/dashboard' : '/';

  return (
    <ErrorBoundary name="root">
      <CapacitorBootstrap />
      <RouterProvider initialPathname={initialPathname}>
        <PageShell>
          <RouterView />
        </PageShell>
      </RouterProvider>
    </ErrorBoundary>
  );
}
