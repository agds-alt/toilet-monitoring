import { log } from '@/lib/logger';

/**
 * PWA Utilities
 * Service worker registration and offline support
 */

/**
 * Register service worker
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    log.debug('Service Worker not supported', { type: 'pwa' });
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      log.info('Service Worker registered successfully', { type: 'pwa' });

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available
              log.info('New version available', { type: 'pwa' });
              showUpdateNotification();
            }
          });
        }
      });
    } catch (error) {
      log.error('Service Worker registration failed', error);
    }
  });
}

/**
 * Unregister service worker (for development)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    log.info('Service Worker unregistered', { type: 'pwa' });
  }
}

/**
 * Check if app is running in standalone mode (installed as PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Check if app is installable
 */
export function isInstallable(): boolean {
  return typeof window !== 'undefined' && 'BeforeInstallPromptEvent' in window;
}

/**
 * Show update notification to user
 */
function showUpdateNotification(): void {
  // You can implement a custom UI for this
  if (typeof window !== 'undefined' && window.confirm) {
    const shouldReload = window.confirm(
      'A new version is available! Reload to update?'
    );

    if (shouldReload) {
      // Tell service worker to skip waiting
      navigator.serviceWorker.controller?.postMessage({
        type: 'SKIP_WAITING',
      });

      // Reload page
      window.location.reload();
    }
  }
}

/**
 * Install prompt handler
 */
let deferredPrompt: any = null;

export function setupInstallPrompt(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    log.info('PWA install prompt available', { type: 'pwa' });

    // Show custom install UI (you can implement this)
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    log.info('PWA installed successfully', { type: 'pwa' });
    deferredPrompt = null;
  });
}

/**
 * Trigger PWA install prompt
 */
export async function promptInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    log.warn('Install prompt not available', { type: 'pwa' });
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user's response
  const { outcome } = await deferredPrompt.userChoice;

  log.info('Install prompt result', { type: 'pwa', outcome });

  deferredPrompt = null;
  return outcome === 'accepted';
}

/**
 * Show custom install banner (placeholder)
 */
function showInstallBanner(): void {
  // Implement your custom UI here
  // This is just a placeholder
  log.debug('Install banner available', { type: 'pwa' });
}

/**
 * Get current online status
 * Note: For React components, create a custom hook in your component file
 */
export function getOnlineStatus(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    log.warn('Notifications not supported', { type: 'pwa' });
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  log.info('Notification permission', { type: 'pwa', permission });

  return permission === 'granted';
}

/**
 * Show local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    log.warn('Notification permission denied', { type: 'pwa' });
    return;
  }

  // If service worker is active, use it
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      ...options,
    });
  } else {
    // Fallback to regular notification
    new Notification(title, {
      icon: '/icon-192.png',
      ...options,
    });
  }

  log.info('Notification shown', { type: 'pwa', title });
}
