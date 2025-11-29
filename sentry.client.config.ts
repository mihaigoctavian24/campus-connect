// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable replay in production only
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Mask all text content and block all media for privacy
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter out known non-issues
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Ignore network errors that are likely user-side issues
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return null;
    }

    // Ignore canceled requests
    if (error instanceof Error && error.name === 'AbortError') {
      return null;
    }

    return event;
  },

  // Environment tag
  environment: process.env.NODE_ENV,
});
