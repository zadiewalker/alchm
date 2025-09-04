import React from 'react';
import '../styles/globals.css';
import '../styles/jony-ive-sage-system.css';
import '../styles/mobile-trauma-informed.css';
import '../styles/sacred-utility-classes.css';
import MobileOptimizationProvider from '../components/MobileOptimizationProvider';

export const metadata = {
  title: 'ALCHM - Your Digital Sanctuary for Healing',
  description: 'Trauma-informed AI-powered journaling platform for healing, reflection, and personal growth. Write it raw. Turn it gold. Ages 17+.',
  keywords: 'trauma-informed, journaling, mental health, AI, healing, resilience, privacy, self-reflection, therapy journal, emotional wellness, crisis support, mental health app',
  authors: [{ name: 'ALCHM Team' }],
  creator: 'ALCHM',
  publisher: 'ALCHM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ALCHM - Your Digital Sanctuary for Healing',
    description: 'Trauma-informed AI-powered journaling for healing, reflection, and personal growth. Private, secure, and designed for ages 17+.',
    url: 'https://alchm-digital-sanctuary.web.app',
    siteName: 'ALCHM',
    images: [
      {
        url: 'https://alchm-digital-sanctuary.web.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ALCHM - Trauma-Informed AI Journaling Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALCHM - Your Digital Sanctuary',
    description: 'Trauma-informed AI journaling for healing and growth. Private, secure, ages 17+.',
    images: ['https://alchm-digital-sanctuary.web.app/twitter-card.png'],
    creator: '@alchm_app',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    google: 'verification-code-here',
  },
  category: 'health',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        
        {/* Mobile Cache Busting */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-bust" content={Date.now().toString()} />
        
        {/* PWA Manifest */}
        <link rel="manifest" href={`/manifest.json?v=${Date.now()}`} />
        <meta name="theme-color" content="#a4b792" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ALCHM" />
        
        {/* Crisis Support Meta */}
        <meta name="crisis-support" content="988" />
        <meta name="emergency-accessible" content="true" />
        
        {/* PWA Icons */}
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        
        {/* Prefetch critical crisis resources */}
        <link rel="prefetch" href="/crisis-resources" />
        
        {/* Mobile Cache Clear Script */}
        <script src="/mobile-cache-clear.js" async></script>
        {/* NUCLEAR OPTION - Complete cache destruction */}
        <script src="/nuclear-cache-clear.js" async></script>
        {/* MOBILE SAGE GREEN ENFORCER - Highest priority */}
        <script src="/mobile-sage-enforcer.js"></script>
      </head>
      <body className="trauma-informed-mobile-ux">
        <MobileOptimizationProvider>
          {children}
        </MobileOptimizationProvider>
      </body>
    </html>
  );
}