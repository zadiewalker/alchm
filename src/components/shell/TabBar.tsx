'use client';

import { TabIcon } from './TabIcon';
import { AppText } from '@/components/ui/AppText';
import { TAB_ROUTES, getActiveTab } from '@/utils/navigation';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';

export function TabBar(): React.JSX.Element {
  const { navigate, pathname } = useInternalNavigation();
  const activeTab = getActiveTab(pathname) ?? 'dashboard';

  return (
    <div className="tab-bar">
      {TAB_ROUTES.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            className="btn-ghost tab-bar-link"
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path, { source: `tab:${tab.id}` })}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <TabIcon tab={tab.id} isActive={isActive} />
            <AppText
              variant="whisper"
              as="span"
              className={isActive ? 'tab-bar-label-active' : 'tab-bar-label'}
            >
              {tab.label}
            </AppText>
          </button>
        );
      })}
    </div>
  );
}
