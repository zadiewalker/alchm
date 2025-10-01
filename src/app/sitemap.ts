import { MetadataRoute } from 'next';

// ALCHM Supported Locales
const SUPPORTED_LOCALES = [
  'en', 'es', 'pt', 'sw', 'ar', 'hi', 'zh', 'fr', 'yo', 'ko', 'de'
] as const;

// Public routes that should be indexed
const PUBLIC_ROUTES = [
  '',  // home page
  '/emergency',
  '/crisis',
  '/pricing',
  '/about',
  '/privacy',
  '/terms',
  '/contact'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alchmapp.web.app';
  const currentDate = new Date();
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route combination
  SUPPORTED_LOCALES.forEach(locale => {
    PUBLIC_ROUTES.forEach(route => {
      const url = `${baseUrl}/${locale}${route}`;
      
      sitemapEntries.push({
        url,
        lastModified: currentDate,
        changeFrequency: route === '' ? 'daily' : 
                        route.includes('/emergency') || route.includes('/crisis') ? 'weekly' :
                        route.includes('/pricing') ? 'monthly' : 'yearly',
        priority: route === '' ? 1.0 :
                 route.includes('/emergency') || route.includes('/crisis') ? 0.9 :
                 route.includes('/pricing') ? 0.8 : 0.6,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map(altLocale => [
              altLocale === 'en' ? 'x-default' : altLocale,
              `${baseUrl}/${altLocale}${route}`
            ])
          )
        }
      });
    });
  });

  // Add root URL redirect
  sitemapEntries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map(locale => [
          locale === 'en' ? 'x-default' : locale,
          `${baseUrl}/${locale}`
        ])
      )
    }
  });

  return sitemapEntries;
}