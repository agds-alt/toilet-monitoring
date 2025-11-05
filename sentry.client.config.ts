import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev

  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Enable debug mode in development
  debug: process.env.NODE_ENV !== 'production',

  // Trace propagation targets
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/.*\.vercel\.app/,
    process.env.NEXT_PUBLIC_APP_URL || '',
  ],

  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filtering
  beforeSend(event, hint) {
    // Filter out certain errors
    if (event.exception) {
      const error = hint.originalException;

      // Ignore network errors
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: string }).message;
        if (
          typeof message === 'string' &&
          (message.includes('NetworkError') || message.includes('Failed to fetch'))
        ) {
          return null;
        }
      }
    }

    return event;
  },

  // Custom tags
  initialScope: {
    tags: {
      'app.version': process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
    },
  },
});
