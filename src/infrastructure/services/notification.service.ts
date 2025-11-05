// src/infrastructure/services/notification.service.ts
// ============================================
// PUSH NOTIFICATION SERVICE
// ============================================

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: any[];
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ============================================
  // CHECK PERMISSION
  // ============================================

  async checkPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    return Notification.permission;
  }

  // ============================================
  // REQUEST PERMISSION
  // ============================================

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // ============================================
  // SHOW NOTIFICATION
  // ============================================

  async showNotification(options: NotificationOptions): Promise<boolean> {
    try {
      const permission = await this.checkPermission();

      if (permission !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Check if service worker is available
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Use service worker notification (better for PWA)
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          badge: options.badge || '/icons/badge-72x72.png',
          tag: options.tag,
          requireInteraction: options.requireInteraction || false,
          actions: options.actions || [],
          data: options.data,
        } as any);
      } else {
        // Fallback to regular notification
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icons/icon-192x192.png',
          tag: options.tag,
          data: options.data,
        });
      }

      console.log('✅ Notification shown');
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  // ============================================
  // INSPECTION SUCCESS NOTIFICATION
  // ============================================

  async notifyInspectionSuccess(data: {
    locationName: string;
    score: number;
    status: string;
    inspectionId: string;
  }): Promise<boolean> {
    return this.showNotification({
      title: '✅ Inspeksi Berhasil!',
      body: `${data.locationName}\nSkor: ${data.score}% - ${data.status}`,
      icon: '/icons/icon-success.png',
      tag: 'inspection-success',
      requireInteraction: false,
      actions: [
        {
          action: 'view',
          title: 'Lihat Detail',
        },
        {
          action: 'close',
          title: 'Tutup',
        },
      ],
      data: {
        type: 'inspection-success',
        inspectionId: data.inspectionId,
        url: `/dashboard/inspection/success?id=${data.inspectionId}`,
      },
    });
  }

  // ============================================
  // INSPECTION REMINDER NOTIFICATION
  // ============================================

  async notifyInspectionReminder(data: {
    locationName: string;
    dueTime: string;
  }): Promise<boolean> {
    return this.showNotification({
      title: '⏰ Waktunya Inspeksi',
      body: `Jangan lupa inspeksi ${data.locationName}\nJadwal: ${data.dueTime}`,
      icon: '/icons/icon-reminder.png',
      tag: 'inspection-reminder',
      requireInteraction: true,
      actions: [
        {
          action: 'start',
          title: 'Mulai Inspeksi',
        },
        {
          action: 'snooze',
          title: 'Ingatkan Nanti',
        },
      ],
      data: {
        type: 'inspection-reminder',
        locationName: data.locationName,
      },
    });
  }

  // ============================================
  // LOW SCORE ALERT NOTIFICATION
  // ============================================

  async notifyLowScore(data: {
    locationName: string;
    score: number;
    issues: string[];
  }): Promise<boolean> {
    return this.showNotification({
      title: '⚠️ Perhatian Diperlukan',
      body: `${data.locationName}\nSkor rendah: ${data.score}%\n${data.issues.join(', ')}`,
      icon: '/icons/icon-warning.png',
      tag: 'low-score-alert',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Lihat Detail',
        },
        {
          action: 'acknowledge',
          title: 'Sudah Tahu',
        },
      ],
      data: {
        type: 'low-score-alert',
        locationName: data.locationName,
        score: data.score,
      },
    });
  }

  // ============================================
  // IN-APP NOTIFICATION (Fallback)
  // ============================================

  showInAppNotification(type: NotificationType, message: string, duration: number = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `in-app-notification ${type}`;
    notification.textContent = message;

    // Styling
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '10000',
      fontWeight: '600',
      fontSize: '14px',
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease',
      backgroundColor: this.getNotificationColor(type),
      color: 'white',
    });

    document.body.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, duration);
  }

  private getNotificationColor(type: NotificationType): string {
    const colors = {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    };
    return colors[type];
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const notificationService = NotificationService.getInstance();

// ============================================
// CSS ANIMATIONS (Add to global CSS)
// ============================================

/*
@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}
*/
