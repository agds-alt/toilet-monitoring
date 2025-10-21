// src/app/dashboard/scan/page.tsx
// ============================================
// QR SCANNER PAGE - Integration with Inspection
// ============================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { locationService } from '@/infrastructure/services/location.service';
import { LocationData } from '@/core/types/inspection.types';
import styles from './page.module.css';

export default function QRScanPage() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedLocation, setScannedLocation] = useState<LocationData | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>(
    'prompt'
  );
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    checkCameraPermission();

    return () => {
      mountedRef.current = false;
      stopScanning();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(result.state);

      result.addEventListener('change', () => {
        setCameraPermission(result.state);
      });
    } catch (err) {
      console.log('Permission API not supported');
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      // Initialize scanner
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      // Start scanning
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (err: any) {
      console.error('Start scanning error:', err);
      setError(err.message || 'Gagal membuka kamera');
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current && scanning) {
        await scannerRef.current.stop();
        await scannerRef.current.stop();
        scannerRef.current = null;
      }
      setScanning(false);
    } catch (err) {
      console.error('Stop scanning error:', err);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('✅ QR Scanned:', decodedText);

    // Stop scanner immediately
    await stopScanning();

    // Fetch location data
    try {
      const location = await locationService.getLocationByQR(decodedText);

      if (!mountedRef.current) return;

      if (location) {
        setScannedLocation(location);

        // Auto redirect after 2 seconds
        setTimeout(() => {
          if (mountedRef.current) {
            router.push(`/dashboard/inspection?location_id=${location.id}`);
          }
        }, 2000);
      } else {
        setError('Lokasi tidak ditemukan. Pastikan QR code valid.');
      }
    } catch (err: any) {
      console.error('Fetch location error:', err);
      setError('Gagal memuat data lokasi');
    }
  };

  const onScanFailure = (errorMessage: string) => {
    // Ignore continuous scan failures (too noisy)
    if (!errorMessage.includes('NotFoundException')) {
      console.log('Scan failure:', errorMessage);
    }
  };

  const handleManualInput = () => {
    router.push('/dashboard/locations');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button
          onClick={() => router.push('/dashboard')}
          className={styles.backButton}
          aria-label="Kembali"
        >
          ← Kembali
        </button>
        <h1 className={styles.title}>Scan QR Code</h1>
      </header>

      {/* Scanner Area */}
      <div className={styles.content}>
        {!scanning && !scannedLocation && (
          <div className={styles.startSection}>
            <div className={styles.iconLarge}>📷</div>
            <h2 className={styles.startTitle}>Siap Scan QR Code</h2>
            <p className={styles.startDesc}>
              Arahkan kamera ke QR code yang tertera di lokasi toilet
            </p>

            {cameraPermission === 'denied' && (
              <div className={styles.permissionError}>
                <span className={styles.errorIcon}>⚠️</span>
                <p>Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser Anda.</p>
              </div>
            )}

            <button
              onClick={startScanning}
              disabled={cameraPermission === 'denied'}
              className={styles.startButton}
            >
              <span>📷</span>
              <span>Mulai Scan</span>
            </button>

            <button onClick={handleManualInput} className={styles.manualButton}>
              atau Pilih Lokasi Manual
            </button>
          </div>
        )}

        {scanning && (
          <div className={styles.scannerSection}>
            <div className={styles.scannerWrapper}>
              <div id="qr-reader" className={styles.scanner} />
              <div className={styles.scannerOverlay}>
                <div className={styles.scannerCorners}>
                  <div className={styles.cornerTL} />
                  <div className={styles.cornerTR} />
                  <div className={styles.cornerBL} />
                  <div className={styles.cornerBR} />
                </div>
              </div>
            </div>

            <div className={styles.scannerHint}>
              <p>Arahkan kamera ke QR code</p>
              <div className={styles.scannerDots}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            </div>

            <button onClick={stopScanning} className={styles.stopButton}>
              Batal
            </button>
          </div>
        )}

        {scannedLocation && (
          <div className={styles.successSection}>
            <div className={styles.successAnimation}>
              <div className={styles.checkmark}>✓</div>
            </div>

            <h2 className={styles.successTitle}>Lokasi Ditemukan!</h2>

            <div className={styles.locationCard}>
              <div className={styles.locationIcon}>📍</div>
              <div className={styles.locationInfo}>
                <h3 className={styles.locationName}>{scannedLocation.name}</h3>
                <p className={styles.locationAddress}>{scannedLocation.address}</p>
                {scannedLocation.building && (
                  <span className={styles.locationBuilding}>
                    🏢 {scannedLocation.building}
                    {scannedLocation.floor && ` - Lantai ${scannedLocation.floor}`}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.redirect}>
              <div className={styles.redirectSpinner} />
              <p>Mengarahkan ke form inspeksi...</p>
            </div>

            <button
              onClick={() => router.push(`/dashboard/inspection?location_id=${scannedLocation.id}`)}
              className={styles.continueButton}
            >
              Lanjutkan Inspeksi →
            </button>
          </div>
        )}

        {error && !scanning && !scannedLocation && (
          <div className={styles.errorSection}>
            <div className={styles.errorIcon}>❌</div>
            <h2 className={styles.errorTitle}>Oops!</h2>
            <p className={styles.errorMessage}>{error}</p>

            <div className={styles.errorActions}>
              <button onClick={startScanning} className={styles.retryButton}>
                🔄 Coba Lagi
              </button>
              <button onClick={handleManualInput} className={styles.manualButton}>
                Pilih Manual
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!scanning && !scannedLocation && (
        <div className={styles.instructions}>
          <h3 className={styles.instructionsTitle}>Tips Scan QR:</h3>
          <ul className={styles.instructionsList}>
            <li>✓ Pastikan cahaya cukup terang</li>
            <li>✓ Jaga jarak 15-30 cm dari QR code</li>
            <li>✓ Pegang kamera dengan stabil</li>
            <li>✓ Pastikan QR code tidak buram atau rusak</li>
          </ul>
        </div>
      )}
    </div>
  );
}
