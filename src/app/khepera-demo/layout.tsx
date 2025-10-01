import React from 'react';

export const metadata = {
  title: 'Khepera Chat Demo - ALCHM',
  description: 'Experience ALCHM\'s AI emotional concierge designed with Jony Ive\'s philosophy and trauma-informed care.',
  robots: {
    index: false, // Don't index demo pages
    follow: false,
  },
};

export default function KheperaDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}