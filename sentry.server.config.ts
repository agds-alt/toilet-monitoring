import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Enable debug mode in development
  debug: process.env.NODE_ENV !== 'production',

  // Trace propagation targets
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/.*\.supabase\.co/,
    /^https:\/\/.*\.vercel\.app/,
  ],

  // Integrations for server-side
  integrations: [
    Sentry.httpIntegration(),
  ],

  // Filtering
  beforeSend(event, hint) {
    // Don't send events for certain errors
    if (event.exception) {
      const error = hint.originalException;

      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message?: string }).message;
        // Ignore expected errors
        if (
          typeof message === 'string' &&
          (message.includes('NEXT_NOT_FOUND') || message.includes('ENOENT'))
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
