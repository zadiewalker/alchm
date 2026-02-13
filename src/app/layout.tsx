import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SplashScreenManager } from '@/components/SplashScreenManager';
import NavigationTelemetryObserver from '@/components/NavigationTelemetryObserver';
import NavigationClickTelemetry from '@/components/NavigationClickTelemetry';
import NavigationTelemetryPanel from '@/components/NavigationTelemetryPanel';

export const metadata: Metadata = {
  title: 'ALCHM',
  description: 'Your digital sanctuary for healing and transformation.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#8B9A7C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ALCHM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ALCHM" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body>
        <SplashScreenManager />
        <NavigationClickTelemetry />
        <NavigationTelemetryObserver />
        {process.env.NODE_ENV !== 'production' ? <NavigationTelemetryPanel /> : null}
        {children}
      </body>
    </html>
  );
}
