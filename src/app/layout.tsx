// Import polyfills first to ensure browser globals are available in server environment
import '../polyfills.js';

import React from 'react';
import { generateMetadata, generateStructuredData } from '@/lib/seo';
import { SECURITY_HEADERS } from '@/lib/security';

export const metadata = generateMetadata({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData();
  
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Security Headers via Meta Tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebaseio.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="h-full bg-white text-gray-900 antialiased flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-600">
          <p>© 2025 ALCHM. All rights reserved.</p>
          <p className="mt-2">
            <a href='/privacy-policy.html' target='_blank' className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
            {' | '}
            <a href="mailto:support@alchm.com" className="text-blue-600 hover:text-blue-800 underline">
              Support
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
