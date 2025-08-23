// SEO utilities and metadata generation for ALCHM
import { Metadata } from 'next';

export const siteConfig = {
  name: 'ALCHM',
  description: 'Trauma-informed, AI-powered journaling OS for mental health and self-discovery',
  url: 'https://alchm-digital-sanctuary.web.app',
  ogImage: '/og-image.png',
  creator: 'Zadie Walker',
  keywords: [
    'mental health',
    'journaling',
    'AI therapy',
    'trauma-informed',
    'self-care',
    'mindfulness',
    'emotional wellness',
    'digital sanctuary',
    'personal growth',
    'therapy tools'
  ],
} as const;

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
}: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [...siteConfig.keywords],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    
    // Open Graph
    openGraph: {
      type,
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      siteName: siteConfig.name,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@alchm_app',
    },
    
    // Additional meta tags
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    
    // Alternate languages (if supported)
    alternates: {
      canonical: metaUrl,
      languages: {
        'en-US': metaUrl,
      },
    },
    
    // App-specific
    applicationName: siteConfig.name,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteConfig.name,
    },
    
    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    
    // Manifest
    manifest: '/manifest.json',
  };
}

// Structured data for schema.org
export function generateStructuredData({
  type = 'WebApplication',
  name = siteConfig.name,
  description = siteConfig.description,
  url = siteConfig.url,
}: {
  type?: 'WebApplication' | 'Article' | 'Organization';
  name?: string;
  description?: string;
  url?: string;
} = {}) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
  };

  if (type === 'WebApplication') {
    return {
      ...baseData,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      creator: {
        '@type': 'Person',
        name: siteConfig.creator,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };
  }

  if (type === 'Organization') {
    return {
      ...baseData,
      '@type': 'Organization',
      founder: {
        '@type': 'Person',
        name: siteConfig.creator,
      },
      industry: 'Mental Health Technology',
    };
  }

  return baseData;
}

// SEO-friendly URL generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .trim();
}