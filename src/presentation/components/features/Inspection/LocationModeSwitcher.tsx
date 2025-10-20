// src/presentation/components/features/inspection/LocationModeSwitcher.tsx
// ============================================
// LOCATION MODE SWITCHER - GPS ↔️ QR
// ============================================

'use client';

import React from 'react';
import { LocationMode } from '@/core/types/inspection.types';
import styles from './LocationModeSwitcher.module.css';

interface LocationModeSwitcherProps {
  mode: LocationMode;
  onChange: (mode: LocationMode) => void;
  onGetLocation?: () => void;
  onScanQR?: () => void;
  loading?: boolean;
  locationName?: string;
  className?: string;
}

export function LocationModeSwitcher({
  mode,
  onChange,
  onGetLocation,
  onScanQR,
  loading = false,
  locationName,
  className = '',
}: LocationModeSwitcherProps) {
  const isGPS = mode === 'gps';

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <span className={styles.label}>📍 Location Method</span>
        {locationName && (
          <span className={styles.locationBadge}>
            ✓ {locationName}
          </span>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          onClick={() => onChange('gps')}
          className={`${styles.tab} ${isGPS ? styles.active : ''}`}
          disabled={loading}
        >
          <span className={styles.tabIcon}>🌐</span>
          <span className={styles.tabText}>GPS</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('qr')}
          className={`${styles.tab} ${!isGPS ? styles.active : ''}`}
          disabled={loading}
        >
          <span className={styles.tabIcon}>📱</span>
          <span className={styles.tabText}>QR Scanner</span>
        </button>
      </div>

      <div className={styles.content}>
        {isGPS ? (
          <div className={styles.gpsPanel}>
            <p className={styles.description}>
              Izinkan akses lokasi untuk mendapatkan alamat otomatis
            </p>
            {onGetLocation && (
              <button
                type="button"
                onClick={onGetLocation}
                disabled={loading}
                className={styles.actionButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    <span>Mendapatkan lokasi...</span>
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    <span>Dapatkan Lokasi Saya</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className={styles.qrPanel}>
            <p className={styles.description}>
              Scan QR code yang ada di toilet untuk identifikasi lokasi
            </p>
            {onScanQR && (
              <button
                type="button"
                onClick={onScanQR}
                disabled={loading}
                className={styles.actionButton}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} />
                    <span>Membuka scanner...</span>
                  </>
                ) : (
                  <>
                    <span>📷</span>
                    <span>Scan QR Code</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles.info}>
        {isGPS ? (
          <p className={styles.infoText}>
            ℹ️ GPS memerlukan izin akses lokasi dari browser Anda
          </p>
        ) : (
          <p className={styles.infoText}>
            ℹ️ Pastikan QR code terlihat jelas untuk hasil scan terbaik
          </p>
        )}
      </div>
    </div>
  );
}