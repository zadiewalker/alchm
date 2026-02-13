import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if we have a valid DSN
if (SENTRY_DSN && !SENTRY_DSN.includes('ADD_YOUR_SENTRY_DSN_HERE')) {
  Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Minimal configuration for edge runtime
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.5,
  
  beforeSend(event) {
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }
    return event;
  },
  
  initialScope: {
    tags: {
      component: 'edge',
      app: 'alchm',
    },
  },
  });
}