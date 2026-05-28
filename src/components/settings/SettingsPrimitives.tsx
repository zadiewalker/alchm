'use client';

import type React from 'react';
import { ChevronRight } from 'lucide-react';
import { AppText } from '@/components/ui/AppText';

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="settings-section">
      {title ? (
        <AppText variant="caption" as="p" className="settings-section-title">
          {title}
        </AppText>
      ) : null}
      <div className="settings-section-body">
        {children}
      </div>
    </div>
  );
}

export function SettingsRow({
  icon,
  label,
  sublabel,
  type,
  onPress,
  url,
}: {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  type: 'navigation' | 'action' | 'link' | 'info' | 'destructive';
  onPress?: () => void;
  url?: string;
}): React.JSX.Element {
  const isInteractive =
    type === 'link'
      ? Boolean(url)
      : type === 'info'
      ? false
      : Boolean(onPress);

  if (
    process.env.NODE_ENV !== 'production' &&
    !isInteractive &&
    (type === 'navigation' || type === 'action' || type === 'destructive')
  ) {
    console.warn(`[SettingsRow] "${label}" is interactive but has no handler.`);
  }

  const content = (
    <div className={['settings-row-content', isInteractive ? 'is-interactive' : ''].filter(Boolean).join(' ')}>
      <div className="settings-row-leading">
        {icon ? (
          <span className="settings-row-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div>
          <AppText
            variant="body"
            as="p"
            style={{ color: type === 'destructive' ? 'var(--text-secondary)' : 'var(--text-primary)' }}
          >
            {label}
          </AppText>
          {sublabel ? (
            <AppText variant="caption" as="p" className="settings-row-sublabel">
              {sublabel}
            </AppText>
          ) : null}
        </div>
      </div>
      <div>
        <AppText
          as="span"
          variant="caption"
          className="settings-row-trailing"
        >
          {(type === 'navigation' || type === 'link') ? (
            <ChevronRight size={16} strokeWidth={1.5} color="var(--text-tertiary)" />
          ) : null}
        </AppText>
      </div>
    </div>
  );

  if (type === 'link' && url) {
    const isExternalHttp = /^https?:\/\//.test(url);
    return (
      <a
        href={url}
        className="settings-row-link"
        target={isExternalHttp ? '_blank' : undefined}
        rel={isExternalHttp ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  if (!isInteractive) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="settings-row"
    >
      {content}
    </button>
  );
}
