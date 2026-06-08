import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/tokens.css';
import { SplashScreenManager } from '@/components/SplashScreenManager';
import { PageTransition } from '@/components/ui/PageTransition';
import { CrisisFooter } from '@/components/CrisisFooter';
import { FooterNav } from '@/components/ui/FooterNav';
import { SubscriptionProvider } from '@/components/subscriptions/SubscriptionProvider';
import { BootstrapBoundary } from '@/components/BootstrapBoundary';
import { MainAppChrome } from '@/components/ui/MainAppChrome';

export const metadata: Metadata = {
  title: 'ALCHM',
  description: 'A private space for writing and reflection.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#A4B792',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <BootstrapBoundary>
          <SplashScreenManager />
          <SubscriptionProvider>
            <MainAppChrome>
              <PageTransition>{children}</PageTransition>
            </MainAppChrome>
          </SubscriptionProvider>
        </BootstrapBoundary>
      </body>
    </html>
  );
}
