import { track } from '@vercel/analytics';
import { log } from '@/lib/logger';

/**
 * Analytics Event Tracking
 * Wrapper around Vercel Analytics with logging
 */

// Event types for type safety
export type AnalyticsEvent =
  | 'inspection_created'
  | 'inspection_completed'
  | 'location_added'
  | 'template_created'
  | 'photo_uploaded'
  | 'user_login'
  | 'user_logout'
  | 'error_occurred'
  | 'page_view'
  | 'button_click'
  | 'form_submit';

interface EventProperties {
  [key: string]: string | number | boolean | null;
}

/**
 * Track a custom analytics event
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: EventProperties
): void {
  try {
    // Send to Vercel Analytics
    track(event, properties);

    // Log to structured logs
    log.info(`Analytics: ${event}`, {
      type: 'analytics',
      event,
      properties,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Don't let analytics errors break the app
    log.error('Analytics tracking failed', error);
  }
}

/**
 * Track page view with custom properties
 */
export function trackPageView(page: string, properties?: EventProperties): void {
  trackEvent('page_view', {
    page,
    ...properties,
  });
}

/**
 * Track user action
 */
export function trackUserAction(
  action: string,
  category: string,
  properties?: EventProperties
): void {
  trackEvent('button_click', {
    action,
    category,
    ...properties,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(
  formName: string,
  success: boolean,
  properties?: EventProperties
): void {
  trackEvent('form_submit', {
    form: formName,
    success,
    ...properties,
  });
}

/**
 * Track error occurrence
 */
export function trackError(
  error: Error | string,
  context?: EventProperties
): void {
  const errorMessage = error instanceof Error ? error.message : error;

  trackEvent('error_occurred', {
    error: errorMessage,
    ...context,
  });
}

/**
 * Track inspection lifecycle
 */
export const inspectionAnalytics = {
  created: (locationId: string, templateId: string) => {
    trackEvent('inspection_created', {
      location_id: locationId,
      template_id: templateId,
    });
  },
  completed: (inspectionId: string, duration: number, status: string) => {
    trackEvent('inspection_completed', {
      inspection_id: inspectionId,
      duration_seconds: duration,
      status,
    });
  },
};

/**
 * Track authentication events
 */
export const authAnalytics = {
  login: (method: string) => {
    trackEvent('user_login', { method });
  },
  logout: () => {
    trackEvent('user_logout', {});
  },
};

/**
 * Track file uploads
 */
export const uploadAnalytics = {
  started: (fileType: string, fileSize: number) => {
    trackEvent('photo_uploaded', {
      file_type: fileType,
      file_size: fileSize,
      status: 'started',
    });
  },
  completed: (fileType: string, fileSize: number, duration: number) => {
    trackEvent('photo_uploaded', {
      file_type: fileType,
      file_size: fileSize,
      duration_ms: duration,
      status: 'completed',
    });
  },
  failed: (fileType: string, error: string) => {
    trackEvent('photo_uploaded', {
      file_type: fileType,
      error,
      status: 'failed',
    });
  },
};
