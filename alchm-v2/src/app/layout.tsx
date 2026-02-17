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
