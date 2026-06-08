'use client';

import type { AppHeaderProps } from '@/types/ui';
import { AppText } from '@/components/ui/AppText';
import { BackButton } from '@/components/ui/BackButton';

export function AppHeader({ title, children, showBack = false, backNavigation, rightAction, variant = 'default' }: AppHeaderProps): React.JSX.Element {
  const shouldShowBack = showBack && !!backNavigation;
  const headerStyle = variant === 'transparent' 
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'transparent',
      }
    : {
        position: 'sticky' as const,
        top: 0,
        zIndex: 20,
        background: 'transparent',
        borderBottom: 'none',
      };

  return (
    <header
      className="app-header-shell"
      style={{
        ...headerStyle,
        paddingTop: 'calc(var(--safe-top) + var(--space-5))',
        paddingBottom: 'var(--space-2)',
        paddingLeft: 'var(--screen-padding-horizontal)',
        paddingRight: 'var(--screen-padding-horizontal)',
        transition: 'background var(--transition-base), border-color var(--transition-base)',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'var(--nav-bar-height)',
        }}
      >
        {shouldShowBack && (
          <BackButton
            navigation={backNavigation}
            label="Back"
            className="app-header-back"
            style={{
              position: 'absolute',
              left: 0,
              zIndex: 1,
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              background: 'color-mix(in srgb, var(--primary-sage) 24%, var(--poster-deep-olive))',
              border: '1px solid var(--border-divider)',
            }}
          />
        )}

        <AppText
          variant="h2"
          as="h1"
          className="app-header-title"
          style={{
            textAlign: 'center',
            flex: 1,
            pointerEvents: 'none',
            paddingLeft: shouldShowBack ? 'calc(var(--space-10) + var(--space-1))' : 0,
            paddingRight: rightAction ? 'calc(var(--space-10) + var(--space-1))' : 0,
          }}
        >
          {children || title}
        </AppText>

        {rightAction && (
          <div style={{ position: 'absolute', right: 0, zIndex: 1 }}>
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
