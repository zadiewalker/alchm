'use client';

import type { AppLayoutProps } from '@/types/ui';

export const ALCHM_ENVIRONMENT_ROLE = 'root-shell';

export function AppLayout({
  children,
  header,
  noPadding = false,
  variant = 'sanctuary',
  className,
}: AppLayoutProps): React.JSX.Element {
  const backgroundClass = `screen-${variant}`;
  const baseClasses = [backgroundClass, 'page-enter', className].filter(Boolean);

  return (
    <div
      className={['app-shell-field', ...baseClasses].join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div className="alchm-presence" aria-hidden="true" />
      <div className="screen-atmosphere" aria-hidden="true" />
      {header}
      <main 
        className="motion-stagger app-main-shell content-width-shell" 
        style={{ 
          flex: 1, 
          paddingLeft: noPadding ? 0 : 'var(--screen-padding-horizontal)',
          paddingRight: noPadding ? 0 : 'var(--screen-padding-horizontal)',
          paddingTop: noPadding ? 0 : 'var(--screen-top-padding)',
          paddingBottom: noPadding ? 0 : 'calc(var(--space-8) + var(--safe-bottom) + var(--tab-bar-height) + var(--crisis-footer-height))',
          width: '100%',
          maxWidth: 'var(--content-max-width)',
          margin: '0 auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
