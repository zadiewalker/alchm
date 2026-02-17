import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageShell } from '@/components/PageShell';
import { CapacitorBootstrap } from '@/components/CapacitorBootstrap';

export const metadata: Metadata = {
  title: 'ALCHM',
  description: 'A quiet sanctuary for journaling and reflection.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Pre-hydration crash trap: if something throws before React mounts, show the error on screen. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  function safeString(v) {
    try { return String(v); } catch (_) { return 'unknown'; }
  }
  function show(title, detail) {
    try {
      var id = '__alchm_pre_hydration_error__';
      var existing = document.getElementById(id);
      if (existing) existing.parentNode.removeChild(existing);
      var el = document.createElement('div');
      el.id = id;
      el.setAttribute('role', 'alert');
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.zIndex = '2147483647';
      el.style.background = 'rgba(0,0,0,0.92)';
      el.style.color = 'rgba(255,255,255,0.92)';
      el.style.padding = '24px 20px';
      el.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif';
      el.style.overflow = 'auto';

      var h = document.createElement('div');
      h.textContent = title;
      h.style.fontSize = '16px';
      h.style.fontWeight = '600';
      h.style.marginBottom = '10px';

      var p = document.createElement('pre');
      p.textContent = detail;
      p.style.whiteSpace = 'pre-wrap';
      p.style.margin = '0';
      p.style.fontSize = '12px';
      p.style.color = 'rgba(255,255,255,0.72)';

      el.appendChild(h);
      el.appendChild(p);

      // Defer append until body exists (covers very early crashes).
      var attach = function () {
        try { (document.body || document.documentElement).appendChild(el); } catch (_) {}
      };
      if (document.body) attach();
      else document.addEventListener('DOMContentLoaded', attach, { once: true });
    } catch (_) {}
  }

  window.addEventListener('error', function (event) {
    var msg = '';
    try {
      if (event && event.error && event.error.message) msg = safeString(event.error.name) + ': ' + safeString(event.error.message);
      else msg = safeString(event && event.message ? event.message : 'Unknown error');
    } catch (_) { msg = 'Unknown error'; }
    var where = safeString(event && event.filename ? event.filename : '');
    var line = safeString(event && event.lineno ? event.lineno : '');
    var col = safeString(event && event.colno ? event.colno : '');
    var loc = where ? (where + (line ? (':' + line) : '') + (col ? (':' + col) : '')) : '';
    show('ALCHM crashed before startup', loc ? (msg + '\\n' + loc) : msg);
  });

  window.addEventListener('unhandledrejection', function (event) {
    var reason = '';
    try {
      reason = event && event.reason && event.reason.message
        ? safeString(event.reason.name) + ': ' + safeString(event.reason.message)
        : safeString(event && event.reason ? event.reason : 'Unknown rejection');
    } catch (_) { reason = 'Unknown rejection'; }
    show('ALCHM hit an unhandled promise rejection', reason);
  });
})();`,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {/* Crisis support available · 988 */}
        <ErrorBoundary name="root">
          <CapacitorBootstrap />
          <PageShell>{children}</PageShell>
        </ErrorBoundary>
      </body>
    </html>
  );
}
