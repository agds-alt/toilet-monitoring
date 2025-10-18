// app/dashboard/scan/page.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import styles from './page.module.css';

// Optimized scanner configuration
const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
  supportedScanTypes: []
};

export default function ScanPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasCamera, setHasCamera] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check camera availability
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
          setHasCamera(true);
        })
        .catch(() => {
          setHasCamera(false);
          setError('Kamera tidak dapat diakses. Pastikan izin kamera diberikan.');
        });
    } else {
      setHasCamera(false);
      setError('Browser tidak mendukung akses kamera.');
    }

    return () => {
      // Cleanup
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleScan = useCallback((decodedText: string) => {
    console.log('✅ QR Scanned:', decodedText);
    
    try {
      let locationId = decodedText.trim();
      
      // Try parse JSON
      if (decodedText.startsWith('{')) {
        try {
          const data = JSON.parse(decodedText);
          locationId = data.locationId || data.id || data.uuid;
        } catch {
          // Not JSON, use as plain text
        }
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(locationId)) {
        console.log('📍 Redirecting to location:', locationId);
        stopScanner();
        router.push(`/dashboard/inspect/${locationId}`);
      } else {
        throw new Error('Format QR code tidak valid');
      }
    } catch (err) {
      console.error('❌ QR Parse error:', err);
      setError('QR code tidak valid. Pastikan scan QR code lokasi yang benar.');
    }
  }, [router]);

  const startScanner = async () => {
    setError('');
    
    try {
      scannerRef.current = new Html5Qrcode('scanner-container');
      
      await scannerRef.current.start(
        { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        SCANNER_CONFIG,
        handleScan,
        () => {
          // Quiet logging for continuous scanning
        }
      );
      
      setIsScanning(true);
    } catch (error: any) {
      console.error('❌ Scanner start error:', error);
      
      if (error?.message?.includes('Permission')) {
        setError('Izin kamera ditolak. Silakan izinkan akses kamera di browser settings.');
      } else if (error?.message?.includes('found')) {
        setError('Kamera tidak ditemukan.');
        setHasCamera(false);
      } else {
        setError('Gagal memulai scanner: ' + error?.message);
      }
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
      }
      setIsScanning(false);
      setError('');
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  const testWithLocationId = (locationId: string) => {
    router.push(`/dashboard/inspect/${locationId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Scan QR Code</h1>
        <p className={styles.subtitle}>
          Scan QR code pada lokasi untuk memulai inspeksi
        </p>
      </div>

      <div className={styles.scanArea}>
        {!isScanning ? (
          <div className={styles.scannerPlaceholder}>
            <div className={styles.scannerFrame}>
              <div className={styles.qrIcon}>📷</div>
              {!hasCamera && <div className={styles.noCamera}>❌</div>}
            </div>
            
            <p className={styles.scannerText}>
              {hasCamera 
                ? "Klik tombol di bawah untuk mulai scan" 
                : "Kamera tidak tersedia"
              }
            </p>

            <div className={styles.buttonGroup}>
              {hasCamera && (
                <button 
                  onClick={startScanner}
                  className={styles.primaryButton}
                  disabled={isScanning}
                >
                  {isScanning ? 'Memulai...' : 'Mulai QR Scanner'}
                </button>
              )}
              
              <div className={styles.testButtons}>
                <button 
                  onClick={() => testWithLocationId('550e8400-e29b-41d4-a716-446655440001')}
                  className={styles.secondaryButton}
                >
                  Test Lt. 1 Depan
                </button>
                <button 
                  onClick={() => testWithLocationId('550e8400-e29b-41d4-a716-446655440002')}
                  className={styles.secondaryButton}
                >
                  Test Lt. 1 Belakang
                </button>
              </div>

              <button 
                onClick={() => router.push('/dashboard/inspect')}
                className={styles.fallbackButton}
              >
                Pilih Lokasi Manual
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.scannerActive}>
            <div className={styles.scannerWrapper}>
              <div 
                id="scanner-container"
                className={styles.scannerContainer}
              />
              <div className={styles.scannerOverlay}>
                <div className={styles.scanFrame}></div>
                <p className={styles.scanInstruction}>
                  Arahkan kamera ke QR code
                </p>
              </div>
            </div>
            
            <button 
              onClick={stopScanner}
              className={styles.stopButton}
            >
              Berhenti Scan
            </button>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
            <button 
              onClick={() => setError('')}
              className={styles.dismissError}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className={styles.tips}>
        <h3>Tips Scanning:</h3>
        <div className={styles.tipGrid}>
          <div className={styles.tipItem}>
            <span>🔍</span>
            <p>Pastikan QR code bersih dan terang</p>
          </div>
          <div className={styles.tipItem}>
            <span>📏</span>
            <p>Jaga jarak 15-30 cm</p>
          </div>
          <div className={styles.tipItem}>
            <span>⚡</span>
            <p>Hindari guncangan kamera</p>
          </div>
          <div className={styles.tipItem}>
            <span>🔄</span>
            <p>Ganti lokasi manual jika perlu</p>
          </div>
        </div>
      </div>
    </div>
  );
}