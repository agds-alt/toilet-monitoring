'use client';

import { useState, useEffect } from 'react';
import { log } from '@/lib/logger';

/**
 * React hook to track online/offline status
 * @returns boolean indicating if the user is online
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      log.info('Network: Online', { type: 'pwa' });
    };

    const handleOffline = () => {
      setIsOnline(false);
      log.warn('Network: Offline', { type: 'pwa' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
