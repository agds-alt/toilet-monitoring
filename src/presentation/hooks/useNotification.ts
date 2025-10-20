// src/presentation/hooks/useNotification.ts
// ============================================
// NOTIFICATION HOOK
// ============================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import { notificationService, NotificationType } from '@/infrastructure/services/notification.service';

interface UseNotificationReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, body: string) => Promise<boolean>;
  showInApp: (type: NotificationType, message: string, duration?: number) => void;
  isSupported: boolean;
}

export function useNotification(): UseNotificationReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const showNotification = useCallback(
    async (title: string, body: string): Promise<boolean> => {
      return await notificationService.showNotification({
        title,
        body,
      });
    },
    []
  );

  const showInApp = useCallback(
    (type: NotificationType, message: string, duration: number = 3000) => {
      notificationService.showInAppNotification(type, message, duration);
    },
    []
  );

  return {
    permission,
    requestPermission,
    showNotification,
    showInApp,
    isSupported,
  };
}

// ============================================
// USAGE EXAMPLE
// ============================================

/*
// In your component:

import { useNotification } from '@/presentation/hooks/useNotification';

export function MyComponent() {
  const { permission, requestPermission, showNotification, showInApp, isSupported } = useNotification();

  const handleSuccess = async () => {
    // Request permission if not granted
    if (permission !== 'granted') {
      await requestPermission();
    }

    // Show push notification
    await showNotification(
      'Inspeksi Berhasil!',
      'Data inspeksi telah tersimpan'
    );

    // Show in-app notification (fallback)
    showInApp('success', 'Inspeksi berhasil disimpan!');
  };

  return (
    <button onClick={handleSuccess}>
      Complete Inspection
    </button>
  );
}
*/