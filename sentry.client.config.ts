import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if we have a valid DSN
if (SENTRY_DSN && !SENTRY_DSN.includes('ADD_YOUR_SENTRY_DSN_HERE')) {
  Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE_ID || process.env.NEXT_PUBLIC_APP_VERSION,
  dist: process.env.NEXT_PUBLIC_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Error Filtering
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError' ||
          error?.value?.includes('Loading chunk')) {
        event.tags = {
          ...event.tags,
          alchm_issue: 'chunk_load_failure',
          online: typeof navigator === 'undefined' ? 'unknown' : String(navigator.onLine),
        };
      }
    }
    
    // Don't send errors in development unless explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }
    
    return event;
  },
  
  // Additional configuration for mental health app
  beforeSendTransaction(event) {
    // Remove sensitive URL parameters
    if (event.request?.url) {
      event.request.url = event.request.url.split('?')[0];
    }
    return event;
  },
  
  // Integration settings
  integrations: [
    Sentry.replayIntegration({
      // Privacy settings for mental health data
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
  
  // Custom tags for better filtering
  initialScope: {
    tags: {
      component: 'client',
      app: 'alchm',
      git_commit: process.env.NEXT_PUBLIC_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      deployment_target: process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET || 'unknown',
    },
  },
  });
}
