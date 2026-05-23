import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if we have a valid DSN
if (SENTRY_DSN && !SENTRY_DSN.includes('ADD_YOUR_SENTRY_DSN_HERE')) {
  Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE_ID || process.env.NEXT_PUBLIC_APP_VERSION,
  dist: process.env.NEXT_PUBLIC_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Performance Monitoring for server
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Server-specific configuration
  beforeSend(event) {
    // Filter out non-critical server errors
    if (event.exception) {
      const error = event.exception.values?.[0];
      
      // Don't report common connection errors
      if (error?.type === 'ECONNRESET' || 
          error?.type === 'ETIMEDOUT' ||
          error?.value?.includes('socket hang up')) {
        return null;
      }
    }
    
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
      return null;
    }
    
    return event;
  },
  
  beforeSendTransaction(event) {
    // Remove sensitive data from server transactions
    if (event.contexts?.trace?.data) {
      delete event.contexts.trace.data['openai.api_key'];
      delete event.contexts.trace.data['stripe.secret_key'];
    }
    return event;
  },
  
  // Custom tags
  initialScope: {
    tags: {
      component: 'server',
      app: 'alchm',
      git_commit: process.env.NEXT_PUBLIC_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
      deployment_target: process.env.NEXT_PUBLIC_DEPLOYMENT_TARGET || 'unknown',
    },
  },
  });
}
