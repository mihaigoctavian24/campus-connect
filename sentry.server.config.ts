// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Filter out known non-issues
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Ignore rate limit errors (expected behavior)
    if (error instanceof Error && error.message.includes('rate limit')) {
      return null;
    }

    // Ignore auth-related 401 errors (expected for unauthenticated users)
    if (event.contexts?.response?.status_code === 401) {
      return null;
    }

    return event;
  },

  // Environment tag
  environment: process.env.NODE_ENV,
});
