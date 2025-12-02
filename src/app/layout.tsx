import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';

// Essential providers only - no complex monitoring
const ClientProviders = dynamic(
  () => import('@/components/ClientProviders'),
  { 
    ssr: false,
    loading: () => null
  }
);

// Feedback button - loaded dynamically to avoid SSR issues
const FeedbackButton = dynamic(
  () => import('@/components/feedback').then(mod => ({ default: mod.FeedbackButton })),
  { 
    ssr: false,
    loading: () => null
  }
);

export const metadata = {
  title: 'ALCHM - Your Safe Space for Healing & Growth',
  description: 'Trauma-informed journaling platform. Private, secure, ages 18+.',
  keywords: 'trauma-informed, mental health, AI journaling, crisis support',
  authors: [{ name: 'ALCHM Team' }],
  creator: 'ALCHM',
  openGraph: {
    title: 'ALCHM - Your Safe Space for Healing & Growth',
    description: 'Trauma-informed journaling platform. Private, secure, ages 18+.',
    url: 'https://alchmapp.web.app',
    siteName: 'ALCHM',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Minimal crisis support - inline for performance
const InlineCrisisSupport = () => (
  <div 
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      gap: '12px'
    }}
  >
    <a 
      href="tel:988" 
      style={{
        width: '56px',
        height: '56px',
        backgroundColor: '#dc2626',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textDecoration: 'none',
        fontSize: '24px',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
        border: '2px solid rgba(255, 255, 255, 0.3)'
      }}
      aria-label="Call 988 Crisis Hotline"
    >
      📞
    </a>
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#a4b792" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
        <InlineCrisisSupport />
        <FeedbackButton position="bottom-left" />
      </body>
    </html>
  );
}