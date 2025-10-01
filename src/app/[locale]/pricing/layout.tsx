import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | ALCHM - Choose Your Healing Journey',
  description: 'Transparent, trauma-informed pricing for your mental health journey. Start free with Sanctuary, or unlock advanced features with Deep Cut and Oracle plans. Every path is valid.',
  keywords: [
    'mental health pricing',
    'journaling app subscription',
    'trauma-informed therapy tools',
    'emotional wellness plans',
    'AI therapy assistant pricing',
    'mental health app costs'
  ],
  openGraph: {
    title: 'ALCHM Pricing - Choose Your Healing Journey',
    description: 'Transparent, supportive pricing designed around your healing needs. Start free, upgrade when ready.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALCHM Pricing - Choose Your Healing Journey',
    description: 'Transparent, supportive pricing designed around your healing needs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sanctuary-white">
      {children}
    </div>
  );
}