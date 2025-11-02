import pino from 'pino';

/**
 * Structured logging with Pino
 * Provides consistent logging across the application
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Create the logger
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Base configuration
  base: {
    env: process.env.NODE_ENV,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  },

  // Development pretty printing
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      }
    : undefined,

  // Production structured JSON
  formatters: isProduction
    ? {
        level: (label) => {
          return { level: label };
        },
      }
    : undefined,
});

/**
 * Log helper functions
 */

export const log = {
  /**
   * Debug level log
   */
  debug: (message: string, context?: object) => {
    logger.debug(context || {}, message);
  },

  /**
   * Info level log
   */
  info: (message: string, context?: object) => {
    logger.info(context || {}, message);
  },

  /**
   * Warning level log
   */
  warn: (message: string, context?: object) => {
    logger.warn(context || {}, message);
  },

  /**
   * Error level log
   */
  error: (message: string, error?: Error | unknown, context?: object) => {
    if (error instanceof Error) {
      logger.error(
        {
          ...context,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
        message
      );
    } else {
      logger.error({ ...context, error }, message);
    }
  },

  /**
   * Fatal level log
   */
  fatal: (message: string, error?: Error | unknown, context?: object) => {
    if (error instanceof Error) {
      logger.fatal(
        {
          ...context,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
        message
      );
    } else {
      logger.fatal({ ...context, error }, message);
    }
  },

  /**
   * HTTP request log
   */
  http: (req: {
    method: string;
    url: string;
    statusCode?: number;
    duration?: number;
    userId?: string;
  }) => {
    logger.info({
      type: 'http',
      method: req.method,
      url: req.url,
      statusCode: req.statusCode,
      duration: req.duration,
      userId: req.userId,
    }, `${req.method} ${req.url}`);
  },

  /**
   * Database query log
   */
  db: (query: {
    table: string;
    operation: string;
    duration?: number;
    rowCount?: number;
  }) => {
    logger.debug({
      type: 'database',
      table: query.table,
      operation: query.operation,
      duration: query.duration,
      rowCount: query.rowCount,
    }, `DB: ${query.operation} on ${query.table}`);
  },

  /**
   * tRPC procedure log
   */
  trpc: (procedure: {
    path: string;
    type: 'query' | 'mutation';
    duration?: number;
    success: boolean;
    userId?: string;
  }) => {
    logger.info({
      type: 'trpc',
      path: procedure.path,
      procedureType: procedure.type,
      duration: procedure.duration,
      success: procedure.success,
      userId: procedure.userId,
    }, `tRPC: ${procedure.type} ${procedure.path}`);
  },

  /**
   * Performance log
   */
  performance: (metric: {
    name: string;
    value: number;
    unit: 'ms' | 's' | 'bytes' | 'count';
    context?: object;
  }) => {
    logger.debug({
      type: 'performance',
      metric: metric.name,
      value: metric.value,
      unit: metric.unit,
      ...metric.context,
    }, `Performance: ${metric.name} = ${metric.value}${metric.unit}`);
  },

  /**
   * Security log
   */
  security: (event: {
    type: 'auth' | 'authorization' | 'suspicious';
    action: string;
    userId?: string;
    success: boolean;
    context?: object;
  }) => {
    logger.warn({
      type: 'security',
      securityEventType: event.type,
      action: event.action,
      userId: event.userId,
      success: event.success,
      ...event.context,
    }, `Security: ${event.type} - ${event.action}`);
  },
};

/**
 * Create a child logger with additional context
 */
export const createLogger = (context: object) => {
  return logger.child(context);
};

/**
 * Log performance timing
 */
export const withTiming = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - start;

    log.performance({
      name,
      value: duration,
      unit: 'ms',
    });

    return result;
  } catch (error) {
    const duration = Date.now() - start;

    log.performance({
      name: `${name} (failed)`,
      value: duration,
      unit: 'ms',
    });

    throw error;
  }
};
