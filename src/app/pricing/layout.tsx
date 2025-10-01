import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanctuary Investment | ALCHM - Invest in Your Healing',
  description: 'Not subscriptions, but investments in your healing sanctuary. Start with Essential Sanctuary, expand to Premium when ready. Every investment serves your growth.',
  keywords: [
    'healing sanctuary investment',
    'mental health sanctuary pricing',
    'trauma-informed journaling sanctuary',
    'emotional wellness investment',
    'AI wisdom companion pricing',
    'sanctuary expansion costs',
    'premium healing features'
  ],
  openGraph: {
    title: 'ALCHM Sanctuary Investment - Invest in Your Healing',
    description: 'Investment in healing, not payment for features. Transparent sanctuary pricing designed around your healing journey.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALCHM Sanctuary Investment - Invest in Your Healing',
    description: 'Investment in healing, not payment for features. Start with Essential Sanctuary, expand when ready.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SanctuaryInvestmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Sanctuary atmosphere backdrop */}
      <div className="fixed inset-0 bg-gradient-to-br from-sage-50/30 to-sanctuary-white/80 pointer-events-none" />
      <div className="relative">
        {children}
      </div>
    </div>
  );
}