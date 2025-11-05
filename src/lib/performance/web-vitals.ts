/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals and sends to analytics
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';
import { log } from '@/lib/logger';
import { errorTracker } from '@/lib/sentry/error-tracker';

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric) {
  // Log performance metric
  log.performance({
    name: metric.name,
    value: Math.round(metric.value),
    unit: 'ms',
    context: {
      id: metric.id,
      rating: metric.rating,
      navigationType: metric.navigationType,
    },
  });

  // Send to Sentry for performance monitoring
  if (metric.rating === 'poor') {
    errorTracker.captureMessage(
      `Poor ${metric.name}: ${Math.round(metric.value)}ms`,
      'warning'
    );
  }

  // Send to analytics (e.g., Google Analytics, Vercel Analytics)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    });
  }

  // Send to custom analytics endpoint (optional)
  sendToCustomAnalytics(metric);
}

/**
 * Send to custom analytics endpoint
 */
async function sendToCustomAnalytics(metric: Metric) {
  try {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      timestamp: Date.now(),
    });

    // Use sendBeacon if available (doesn't block page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', body);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      });
    }
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this in your app entry point (e.g., _app.tsx)
 *
 * @example
 * ```tsx
 * // In app/layout.tsx or _app.tsx
 * if (typeof window !== 'undefined') {
 *   reportWebVitals();
 * }
 * ```
 */
export function reportWebVitals() {
  try {
    // Cumulative Layout Shift - measures visual stability
    onCLS(sendToAnalytics);

    // First Contentful Paint - measures loading performance
    onFCP(sendToAnalytics);

    // First Input Delay - deprecated, replaced by INP
    // onFID(sendToAnalytics);

    // Interaction to Next Paint - measures responsiveness (replaces FID)
    onINP(sendToAnalytics);

    // Largest Contentful Paint - measures loading performance
    onLCP(sendToAnalytics);

    // Time to First Byte - measures server response time
    onTTFB(sendToAnalytics);

    log.info('Web Vitals monitoring initialized');
  } catch (error) {
    log.error('Failed to initialize Web Vitals', error as Error);
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (!navigation) return null;

  return {
    // Page load metrics
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // Resource timing
    resources: performance.getEntriesByType('resource').length,

    // Memory (if available)
    memory: (performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      : null,
  };
}

/**
 * Mark a custom performance measure
 *
 * @example
 * ```ts
 * measurePerformance('data-fetch-start');
 * // ... do work
 * measurePerformance('data-fetch-end');
 * const duration = getPerformanceMeasure('data-fetch', 'data-fetch-start', 'data-fetch-end');
 * ```
 */
export function measurePerformance(markName: string) {
  if (typeof window === 'undefined') return;

  try {
    performance.mark(markName);
  } catch (error) {
    // Silently fail
  }
}

/**
 * Get duration between two performance marks
 */
export function getPerformanceMeasure(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof window === 'undefined') return null;

  try {
    performance.measure(name, startMark, endMark);
    const measures = performance.getEntriesByName(name, 'measure');

    if (measures.length > 0) {
      const duration = measures[0].duration;

      // Log the measurement
      log.performance({
        name,
        value: Math.round(duration),
        unit: 'ms',
      });

      return duration;
    }
  } catch (error) {
    // Silently fail
  }

  return null;
}

/**
 * Clear all performance marks and measures
 */
export function clearPerformanceMetrics() {
  if (typeof window === 'undefined') return;

  try {
    performance.clearMarks();
    performance.clearMeasures();
  } catch (error) {
    // Silently fail
  }
}
