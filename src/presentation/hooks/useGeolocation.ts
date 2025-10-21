// src/presentation/hooks/useGeolocation.ts
// ============================================
// GEOLOCATION HOOK
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { GeolocationData } from '@/core/types/inspection.types';
import { getCurrentPosition, checkGeolocationPermission } from '@/lib/utils/geolocation.utils';

interface UseGeolocationReturn {
  geolocation: GeolocationData | null;
  loading: boolean;
  error: string | null;
  permission: PermissionState | null;
  getLocation: () => Promise<GeolocationData | null>;
  checkPermission: () => Promise<PermissionState>;
  clearLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [geolocation, setGeolocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState | null>(null);

  // ============================================
  // GET CURRENT LOCATION
  // ============================================

  const getLocation = useCallback(async (): Promise<GeolocationData | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('📍 Getting current location...');

      const position = await getCurrentPosition();

      setGeolocation(position);
      console.log('✅ Location obtained:', {
        lat: position.latitude.toFixed(6),
        lng: position.longitude.toFixed(6),
        accuracy: `${position.accuracy.toFixed(0)}m`,
        address: position.formatted_address || 'No address',
      });

      return position;
    } catch (err: any) {
      console.error('❌ Geolocation error:', err);
      setError(err.message || 'Gagal mendapatkan lokasi');
      setGeolocation(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // CHECK PERMISSION
  // ============================================

  const checkPermission = useCallback(async (): Promise<PermissionState> => {
    try {
      const state = await checkGeolocationPermission();
      setPermission(state);
      console.log('🔐 Geolocation permission:', state);
      return state;
    } catch (err) {
      console.error('❌ Permission check error:', err);
      return 'prompt';
    }
  }, []);

  // ============================================
  // CLEAR LOCATION
  // ============================================

  const clearLocation = useCallback(() => {
    setGeolocation(null);
    setError(null);
    console.log('🗑️ Location cleared');
  }, []);

  return {
    geolocation,
    loading,
    error,
    permission,
    getLocation,
    checkPermission,
    clearLocation,
  };
}
