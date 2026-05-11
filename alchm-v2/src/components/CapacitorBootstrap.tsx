'use client';

import { useEffect } from 'react';

function isCapacitor(): boolean {
  return typeof window !== 'undefined' && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
}

/**
 * Small runtime bootstrap for WKWebView builds.
 * - Hides the native splash as soon as React mounts (prevents black flashes + SplashScreen warnings).
 * - Installs minimal error handlers so "black screen" failures surface an on-screen message.
 */
export function CapacitorBootstrap() {
  useEffect(() => {
    if (!isCapacitor()) return;

    // Hide the native splash as soon as the web app has mounted.
    void (async () => {
      try {
        const mod = await import('@capacitor/splash-screen');
        await mod.SplashScreen.hide({ fadeOutDuration: 200 });
      } catch {
        // If the plugin isn't available, do nothing.
      }
    })();
  }, []);

  useEffect(() => {
    // If something throws before React can render any UI, show a minimal overlay.
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
        el.style.fontFamily = '-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", sans-serif';
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
      show('ALCHM encountered a runtime error', [msg, where].filter(Boolean).join('\n'));
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason instanceof Error ? `${event.reason.name}: ${event.reason.message}` : String(event.reason || 'Unknown rejection');
      show('ALCHM encountered an unhandled promise rejection', reason);
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

