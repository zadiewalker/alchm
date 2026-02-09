import type { Metadata, Viewport } from 'next';

// Force static generation for all pages
export const dynamic = 'force-static';
export const revalidate = false;

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
        {/* Mobile App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ALCHM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ALCHM" />
        
        {/* Progressive Web App */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        
        {/* iOS Safari specific */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Basic styles to avoid flash */}
        <style>{`
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom, #8B9A7C, #A8B5A0);
            min-height: 100vh;
            font-family: system-ui, -apple-system, sans-serif;
          }
        `}</style>
      </head>
      <body>
        {/* Simple debug in development */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            style={{
              position: 'fixed',
              bottom: '10px',
              right: '10px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              padding: '5px 10px',
              fontSize: '12px',
              borderRadius: '4px',
              zIndex: 9999
            }}
          >
            Layout OK - No Complex Logic
          </div>
        )}
        
        {children}
      </body>
    </html>
  );
}
