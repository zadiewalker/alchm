'use client';

import { useEffect } from 'react';
import {
  buildAttemptEvent,
  reportNavigationEvent,
  setPendingNavigation,
} from '@/lib/navigationTelemetry';

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
}

function getAnchorFromEventTarget(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest('a[href]');
}

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function NavigationClickTelemetry() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;
      if (event.button !== 0) return; // Left click only

      const anchor = getAnchorFromEventTarget(event.target);
      if (!anchor) return;
      if (anchor.target === '_blank') return;
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;
      if (rawHref.startsWith('#')) return;
      if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('sms:')) return;

      try {
        const toUrl = new URL(anchor.href, window.location.origin);
        if (toUrl.origin !== window.location.origin) return;

        const fromPath = normalizePath(window.location.pathname || '/');
        const toPath = normalizePath(toUrl.pathname || '/');
        if (!toPath || toPath === fromPath) return;

        const sourceHint =
          anchor.getAttribute('data-nav-source') ||
          anchor.getAttribute('aria-label') ||
          anchor.textContent?.trim().slice(0, 80) ||
          undefined;

        reportNavigationEvent(
          buildAttemptEvent({
            source: sourceHint ? `link:${sourceHint}` : `link:${fromPath}->${toPath}`,
            fromPath,
            toPath,
          })
        );

        setPendingNavigation({
          id: `${Date.now()}-${toPath}`,
          source: sourceHint ? `link:${sourceHint}` : `link:${fromPath}->${toPath}`,
          fromPath,
          toPath,
          startedAt: Date.now(),
        });
      } catch {
        // Ignore malformed URLs.
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
