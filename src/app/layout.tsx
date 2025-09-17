import React from 'react';
import '../app/globals.css'; // Use main Tailwind CSS file
import ClientProviders from '@/components/ClientProviders';

export const metadata = {
  title: 'ALCHM - Your Safe Space for Healing & Growth',
  description: 'Trauma-informed AI support that honors all healing traditions & identities. Free forever, culturally responsive, private. Ages 18+.',
  keywords: 'trauma-informed, cultural healing, mental health equity, AI, community healing, resilience, BIPOC mental health, LGBTQ+ support, immigrant mental health, Indigenous healing, collective healing, crisis support, economic justice',
  authors: [{ name: 'ALCHM Team' }],
  creator: 'ALCHM',
  publisher: 'ALCHM',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ALCHM - Your Safe Space for Healing & Growth',
    description: 'Trauma-informed AI support honoring all healing traditions & identities. Free forever, culturally responsive, private. Ages 18+.',
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        {/* FID Optimization: Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebaseapp.com" />
        <link rel="dns-prefetch" href="https://googleapis.com" />
        {/* Critical CSS preload for FID optimization */}
        <link rel="preload" href="/styles/critical.css" as="style" />
        <link rel="preload" href="/styles/core-web-vitals.css" as="style" />
        <link rel="preload" href="/styles/trauma-informed-animations.css" as="style" />
        {/* Jony Ive Design System - Premium Mobile Interface */}
        <link rel="preload" href="/styles/jony-ive-mobile-system.css" as="style" />
        <link rel="stylesheet" href="/styles/jony-ive-mobile-system.css" />
        {/* LCP Optimization: Inline critical CSS for immediate render */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles - inline for fastest LCP */
            body { 
              margin: 0; 
              font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; 
              font-display: swap;
              background-color: #fafafa;
              color: #1f2937;
              line-height: 1.5;
            }
            
            /* Crisis button - Elegant Jony Ive design with sage green */
            .crisis-support { 
              position: fixed; 
              bottom: 24px; 
              right: 24px; 
              z-index: 1000; 
              width: 60px; 
              height: 60px; 
              background: #a4b792; 
              border: none; 
              border-radius: 50%; 
              color: white; 
              font-size: 1.5rem; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              transition: all 300ms cubic-bezier(0.215, 0.61, 0.355, 1);
              will-change: transform;
              contain: layout;
            }
            
            .crisis-support:hover {
              background: #93a682;
              transform: scale(1.05);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            .crisis-support.alert {
              background: #dc2626;
              animation: gentle-pulse 2s infinite;
            }
            
            @keyframes gentle-pulse {
              0%, 100% { 
                transform: scale(1); 
                box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
              }
              50% { 
                transform: scale(1.05); 
                box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
              }
            }
            
            /* Hero section - LCP critical */
            .gradient-sanctuary {
              background: linear-gradient(135deg, #a4b792 0%, #93a682 25%, #82956f 50%, #7a8c6a 75%, #6b7d5a 100%);
              min-height: 100vh;
              contain: layout;
            }
            
            /* Button optimization for LCP */
            .btn-primary {
              background: #a4b792;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              border: none;
              font-weight: 500;
              font-size: 16px;
              min-width: 200px;
              min-height: 52px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-decoration: none;
              cursor: pointer;
              will-change: transform;
              contain: layout;
            }
            
            /* Loading states */
            .loading-gentle { 
              opacity: 0.8; 
              animation: pulse 2s infinite; 
            }
            
            @keyframes pulse { 
              0%, 100% { opacity: 0.8; } 
              50% { opacity: 0.4; } 
            }
            
            /* Typography for LCP */
            .wordmark-sacred {
              font-size: 3rem;
              font-weight: 300;
              letter-spacing: 0.2em;
              contain: layout;
            }
            
            .text-heading {
              font-size: 2.5rem;
              font-weight: 300;
              line-height: 1.2;
              contain: layout;
            }
            
            .text-body {
              font-size: 1.25rem;
              line-height: 1.4;
              contain: layout;
            }
            
            /* Layout containers for LCP */
            .layout-centered {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 2rem 1rem;
              contain: layout;
            }
            
            /* Mobile optimizations for LCP */
            @media (max-width: 768px) {
              .wordmark-sacred { font-size: 2rem; }
              .text-heading { font-size: 1.875rem; }
              .text-body { font-size: 1.125rem; }
              .btn-primary { min-width: 180px; }
            }
          `
        }} />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}