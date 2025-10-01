import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/en',
          '/es',
          '/pt',
          '/sw',
          '/ar',
          '/hi',
          '/zh',
          '/fr',
          '/yo',
          '/ko',
          '/de',
          '/emergency',
          '/crisis',
          '/pricing',
          '/about',
          '/privacy',
          '/terms',
          '/contact'
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/journals/',
          '/journal/',
          '/auth/',
          '/admin/',
          '/_next/',
          '/private/',
          '/user/',
          '/settings/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/en',
          '/es',
          '/pt',
          '/emergency',
          '/crisis',
          '/pricing'
        ],
        disallow: [
          '/api/',
          '/dashboard/',
          '/journals/',
          '/journal/',
          '/auth/',
          '/admin/'
        ],
        crawlDelay: 1,
      }
    ],
    sitemap: 'https://alchmapp.web.app/sitemap.xml',
    host: 'https://alchmapp.web.app'
  };
}