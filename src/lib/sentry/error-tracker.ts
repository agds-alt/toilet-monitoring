import * as Sentry from '@sentry/nextjs';

/**
 * Error tracking utilities
 */

export const errorTracker = {
  /**
   * Capture an exception
   */
  captureException: (error: Error, context?: Record<string, any>) => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        extra: context,
      });
    } else {
      console.error('Error:', error, context);
    }
  },

  /**
   * Capture a message
   */
  captureMessage: (message: string, level: Sentry.SeverityLevel = 'info') => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureMessage(message, level);
    } else {
      console.log(`[${level}]`, message);
    }
  },

  /**
   * Set user context
   */
  setUser: (user: { id: string; email?: string; username?: string } | null) => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.setUser(user);
    }
  },

  /**
   * Set custom context
   */
  setContext: (name: string, context: Record<string, any>) => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.setContext(name, context);
    }
  },

  /**
   * Add breadcrumb
   */
  addBreadcrumb: (breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }) => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.addBreadcrumb(breadcrumb);
    }
  },

  /**
   * Start a transaction for performance monitoring
   */
  startTransaction: (name: string, op: string) => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return Sentry.startSpan({ name, op }, (span) => span);
    }
    return null;
  },

  /**
   * Wrap an async function with error tracking
   */
  wrapAsync: <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    options?: {
      name?: string;
      onError?: (error: Error) => void;
    }
  ): T => {
    return (async (...args: any[]) => {
      try {
        return await fn(...args);
      } catch (error) {
        if (error instanceof Error) {
          errorTracker.captureException(error, {
            function: options?.name || fn.name,
            args,
          });
          options?.onError?.(error);
        }
        throw error;
      }
    }) as T;
  },
};

/**
 * Performance monitoring helper
 */
export const withPerformanceMonitoring = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;

    errorTracker.addBreadcrumb({
      message: `${name} completed`,
      category: 'performance',
      level: 'info',
      data: { duration },
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    errorTracker.addBreadcrumb({
      message: `${name} failed`,
      category: 'performance',
      level: 'error',
      data: { duration },
    });

    throw error;
  }
};
