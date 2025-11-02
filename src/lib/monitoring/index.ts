import { log } from '@/lib/logger';
import { errorTracker } from '@/lib/sentry/error-tracker';

/**
 * Monitoring and Alerting Utilities
 * Track application metrics and send alerts
 */

interface Alert {
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: Date;
  tags?: Record<string, string>;
}

/**
 * Track custom performance metric
 */
export function trackMetric(metric: PerformanceMetric): void {
  log.info('Performance metric', {
    type: 'metric',
    name: metric.name,
    value: metric.value,
    unit: metric.unit,
    tags: metric.tags,
  });

  // Send to monitoring service (e.g., Datadog, New Relic)
  if (process.env.NODE_ENV === 'production') {
    // Integration point for external monitoring
    sendToMonitoringService(metric);
  }
}

/**
 * Send alert to monitoring system
 */
export function sendAlert(alert: Alert): void {
  log[alert.severity === 'critical' ? 'error' : 'warn'](alert.title, {
    type: 'alert',
    severity: alert.severity,
    message: alert.message,
    metadata: alert.metadata,
  });

  // Send to error tracking
  if (alert.severity === 'critical') {
    errorTracker.captureMessage(
      `[CRITICAL] ${alert.title}: ${alert.message}`,
      'error'
    );
  }

  // Integration point for external alerting (e.g., PagerDuty, Slack)
  if (process.env.NODE_ENV === 'production') {
    sendToAlertingService(alert);
  }
}

/**
 * Monitor database query performance
 */
export function monitorDatabaseQuery<T>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> {
  const start = Date.now();

  return query()
    .then((result) => {
      const duration = Date.now() - start;

      trackMetric({
        name: 'database_query_duration',
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
        tags: { query: queryName, status: 'success' },
      });

      // Alert on slow queries
      if (duration > 1000) {
        sendAlert({
          severity: 'warning',
          title: 'Slow database query',
          message: `Query ${queryName} took ${duration}ms`,
          metadata: { query: queryName, duration },
        });
      }

      return result;
    })
    .catch((error) => {
      const duration = Date.now() - start;

      trackMetric({
        name: 'database_query_duration',
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
        tags: { query: queryName, status: 'error' },
      });

      sendAlert({
        severity: 'critical',
        title: 'Database query failed',
        message: `Query ${queryName} failed: ${error.message}`,
        metadata: { query: queryName, error: error.message },
      });

      throw error;
    });
}

/**
 * Monitor API endpoint performance
 */
export function monitorEndpoint<T>(
  endpoint: string,
  handler: () => Promise<T>
): Promise<T> {
  const start = Date.now();

  return handler()
    .then((result) => {
      const duration = Date.now() - start;

      trackMetric({
        name: 'api_response_time',
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
        tags: { endpoint, status: 'success' },
      });

      // Alert on slow endpoints
      if (duration > 3000) {
        sendAlert({
          severity: 'warning',
          title: 'Slow API endpoint',
          message: `Endpoint ${endpoint} took ${duration}ms`,
          metadata: { endpoint, duration },
        });
      }

      return result;
    })
    .catch((error) => {
      const duration = Date.now() - start;

      trackMetric({
        name: 'api_response_time',
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
        tags: { endpoint, status: 'error' },
      });

      sendAlert({
        severity: 'critical',
        title: 'API endpoint failed',
        message: `Endpoint ${endpoint} failed: ${error.message}`,
        metadata: { endpoint, error: error.message },
      });

      throw error;
    });
}

/**
 * Check system resources and send alerts if thresholds exceeded
 */
export function checkResourceUsage(): void {
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapPercentage = Math.round((heapUsedMB / heapTotalMB) * 100);

  trackMetric({
    name: 'memory_usage',
    value: heapPercentage,
    unit: 'percentage',
    timestamp: new Date(),
  });

  // Alert on high memory usage
  if (heapPercentage > 90) {
    sendAlert({
      severity: 'critical',
      title: 'Critical memory usage',
      message: `Memory usage at ${heapPercentage}%`,
      metadata: { heapUsedMB, heapTotalMB, heapPercentage },
    });
  } else if (heapPercentage > 75) {
    sendAlert({
      severity: 'warning',
      title: 'High memory usage',
      message: `Memory usage at ${heapPercentage}%`,
      metadata: { heapUsedMB, heapTotalMB, heapPercentage },
    });
  }
}

/**
 * Track error rate
 */
const errorCounts = new Map<string, number>();
const errorTimestamps = new Map<string, number[]>();

export function trackError(errorType: string): void {
  const count = (errorCounts.get(errorType) || 0) + 1;
  errorCounts.set(errorType, count);

  const now = Date.now();
  const timestamps = errorTimestamps.get(errorType) || [];
  timestamps.push(now);

  // Keep only last hour of timestamps
  const oneHourAgo = now - 60 * 60 * 1000;
  const recentTimestamps = timestamps.filter((ts) => ts > oneHourAgo);
  errorTimestamps.set(errorType, recentTimestamps);

  trackMetric({
    name: 'error_count',
    value: count,
    unit: 'count',
    timestamp: new Date(),
    tags: { error_type: errorType },
  });

  // Alert on error spike (>10 errors in last hour)
  if (recentTimestamps.length > 10) {
    sendAlert({
      severity: 'critical',
      title: 'Error spike detected',
      message: `${recentTimestamps.length} ${errorType} errors in last hour`,
      metadata: { errorType, count: recentTimestamps.length },
    });
  }
}

/**
 * Integration point for external monitoring service
 */
function sendToMonitoringService(metric: PerformanceMetric): void {
  // Integration with Datadog, New Relic, etc.
  // Example: datadog.gauge(metric.name, metric.value, metric.tags);
  if (process.env.DATADOG_API_KEY) {
    // Send to Datadog
  }
}

/**
 * Integration point for external alerting service
 */
function sendToAlertingService(alert: Alert): void {
  // Integration with PagerDuty, Slack, etc.
  // Example: slack.sendMessage(alert.title, alert.message);
  if (process.env.SLACK_WEBHOOK_URL && alert.severity === 'critical') {
    // Send to Slack
    fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 ${alert.title}`,
        attachments: [
          {
            color: alert.severity === 'critical' ? 'danger' : 'warning',
            text: alert.message,
            fields: Object.entries(alert.metadata || {}).map(([key, value]) => ({
              title: key,
              value: String(value),
              short: true,
            })),
          },
        ],
      }),
    }).catch((error) => {
      log.error('Failed to send alert to Slack', error);
    });
  }
}

/**
 * Start resource monitoring (call this on app startup)
 */
export function startResourceMonitoring(intervalMs = 60000): NodeJS.Timeout {
  return setInterval(() => {
    checkResourceUsage();
  }, intervalMs);
}
