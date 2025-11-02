import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Enable debug mode in development
  debug: process.env.NODE_ENV !== 'production',

  // Integrations for server-side
  integrations: [
    Sentry.httpIntegration({
      tracing: {
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/.*\.supabase\.co/,
          /^https:\/\/.*\.vercel\.app/,
        ],
      },
    }),
  ],

  // Filtering
  beforeSend(event, hint) {
    // Don't send events for certain errors
    if (event.exception) {
      const error = hint.originalException;

      if (error && typeof error === 'object' && 'message' in error) {
        // Ignore expected errors
        if (
          error.message?.includes('NEXT_NOT_FOUND') ||
          error.message?.includes('ENOENT')
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
      'runtime': 'server',
    },
  },
});
