import './globals.css';
import type { Metadata } from 'next';
import "@/lib/env-check";

export const metadata: Metadata = {
  title: 'ALCHM',
  description: 'Transform your daily reflections into meaningful growth with ALCHM.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F9F6F1] text-[#333] antialiased">
        {children}
      </body>
    </html>
  );
}
