// src/lib/utils/geolocation.utils.ts
// ============================================
// GEOLOCATION UTILITIES (GPS + Nominatim)
// ============================================

import { GeolocationData } from '@/core/types/inspection.types';
import { GEOLOCATION_CONFIG } from '@/lib/constants/inspection.constants';

// ============================================
// NOMINATIM RESPONSE TYPE
// ============================================

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    house_number?: string;
    neighbourhood?: string;
    village?: string;
    town?: string;
  };
  boundingbox: string[];
}

// ============================================
// GET CURRENT POSITION
// ============================================

export async function getCurrentPosition(): Promise<GeolocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          // Get address from Nominatim (FREE!)
          const addressData = await reverseGeocode(latitude, longitude);

          resolve({
            latitude,
            longitude,
            accuracy,
            ...addressData,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          // Return basic geolocation without address if reverse geocoding fails
          console.warn('Reverse geocoding failed:', error);
          resolve({
            latitude,
            longitude,
            accuracy,
            timestamp: new Date().toISOString(),
          });
        }
      },
      (error) => {
        reject(new Error(getGeolocationErrorMessage(error.code)));
      },
      {
        enableHighAccuracy: GEOLOCATION_CONFIG.enableHighAccuracy,
        timeout: GEOLOCATION_CONFIG.timeout,
        maximumAge: GEOLOCATION_CONFIG.maximumAge,
      }
    );
  });
}

// ============================================
// REVERSE GEOCODE (Nominatim - FREE!)
// ============================================

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Partial<GeolocationData>> {
  const url = new URL(GEOLOCATION_CONFIG.reverseGeocodeUrl);
  url.searchParams.append('lat', latitude.toString());
  url.searchParams.append('lon', longitude.toString());
  url.searchParams.append('format', 'json');
  url.searchParams.append('addressdetails', '1');
  url.searchParams.append('zoom', '18');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': GEOLOCATION_CONFIG.userAgent,
        'Accept-Language': 'id,en',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResponse = await response.json();

    // Format address Indonesian style
    const formattedAddress = formatIndonesianAddress(data);

    return {
      address: formattedAddress.street,
      city: formattedAddress.city,
      state: formattedAddress.state,
      country: formattedAddress.country,
      postal_code: formattedAddress.postalCode,
      formatted_address: formattedAddress.full,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}

// ============================================
// FORMAT INDONESIAN ADDRESS
// ============================================

function formatIndonesianAddress(data: NominatimResponse): {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  full: string;
} {
  const addr = data.address;

  // Build street address
  const streetParts: string[] = [];
  if (addr.road) streetParts.push(addr.road);
  if (addr.house_number) streetParts.push(`No. ${addr.house_number}`);
  const street = streetParts.join(' ') || 'Unknown Street';

  // Get city/town
  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.suburb ||
    addr.neighbourhood ||
    'Unknown City';

  // Get state/province
  const state = addr.state || 'Unknown State';

  // Country
  const country = addr.country || 'Indonesia';

  // Postal code
  const postalCode = addr.postcode || '';

  // Build full Indonesian-style address
  // Example: Jl. Amir Hamzah No. 21, Kelurahan Pegangsaan, Kec. Menteng, Kota Jakarta Pusat, DKI Jakarta 10320
  const fullParts: string[] = [street];
  if (addr.suburb) fullParts.push(`Kelurahan ${addr.suburb}`);
  if (addr.neighbourhood) fullParts.push(`Kec. ${addr.neighbourhood}`);
  fullParts.push(`Kota ${city}`);
  if (state !== city) fullParts.push(state);
  if (postalCode) fullParts.push(postalCode);

  const full = fullParts.join(', ');

  return {
    street,
    city,
    state,
    country,
    postalCode,
    full,
  };
}

// ============================================
// CHECK GEOLOCATION PERMISSION
// ============================================

export async function checkGeolocationPermission(): Promise<PermissionState> {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.warn('Permission query not supported:', error);
    return 'prompt';
  }
}

// ============================================
// GEOLOCATION ERROR MESSAGES
// ============================================

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'User denied geolocation permission';
    case 2:
      return 'Position unavailable';
    case 3:
      return 'Geolocation timeout';
    default:
      return 'Unknown geolocation error';
  }
}

// ============================================
// CALCULATE DISTANCE (Haversine Formula)
// ============================================

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// ============================================
// FORMAT DISTANCE
// ============================================

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// ============================================
// WATCH POSITION (for continuous tracking)
// ============================================

export function watchPosition(
  onUpdate: (position: GeolocationData) => void,
  onError?: (error: Error) => void
): number {
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported');
  }

  return navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      try {
        const addressData = await reverseGeocode(latitude, longitude);
        onUpdate({
          latitude,
          longitude,
          accuracy,
          ...addressData,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        onUpdate({
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toISOString(),
        });
      }
    },
    (error) => {
      if (onError) {
        onError(new Error(getGeolocationErrorMessage(error.code)));
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );
}

// ============================================
// CLEAR WATCH POSITION
// ============================================

export function clearWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}