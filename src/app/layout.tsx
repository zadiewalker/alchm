import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ALCHM',
  description: 'Your digital sanctuary for healing and transformation',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ALCHM',
  },
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
    <html lang="en" className="antialiased">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] min-h-screen">
        {children}
      </body>
    </html>
  );
}
