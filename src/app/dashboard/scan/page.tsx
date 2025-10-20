// ===================================
// 📁 src/app/dashboard/scan/page.tsx
// QR Scanner Page
// ===================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, ArrowLeft, X, MapPin } from 'lucide-react';
import styles from './scanner.module.css';

const SCANNER_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
};

export default function QRScannerPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState('');
  const [scannedCode, setScannedCode] = useState('');
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
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleScan = (decodedText: string) => {
    console.log('✅ QR Scanned:', decodedText);
    setScannedCode(decodedText);
    stopScanner();
    
    // Parse QR code
    try {
      let code = decodedText.trim();
      
      // If URL, extract code from path
      if (decodedText.includes('/scan/')) {
        const match = decodedText.match(/\/scan\/([^/?]+)/);
        if (match) {
          code = match[1];
        }
      }
      
      // Redirect to scan route
      router.push(`/scan/${code}`);
    } catch (err) {
      console.error('❌ QR Parse error:', err);
      setError('QR code tidak valid');
    }
  };

  const startScanner = async () => {
    setError('');
    
    try {
      scannerRef.current = new Html5Qrcode('scanner-container');
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        SCANNER_CONFIG,
        handleScan,
        () => {} // Quiet error logging
      );
      
      setIsScanning(true);
    } catch (error: any) {
      console.error('❌ Scanner start error:', error);
      
      if (error?.message?.includes('Permission')) {
        setError('Izin kamera ditolak. Silakan izinkan akses kamera di browser settings.');
      } else if (error?.message?.includes('NotFoundError')) {
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.btnBack}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>Scan QR Code</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.scanArea}>
          {!isScanning ? (
            <div className={styles.placeholderContainer}>
              <div className={styles.placeholder}>
                <div className={styles.scanFrame}>
                  <Camera size={64} className={styles.cameraIcon} />
                </div>
                
                <p className={styles.instruction}>
                  {hasCamera 
                    ? "Klik tombol di bawah untuk mulai scan QR code" 
                    : "Kamera tidak tersedia"
                  }
                </p>

                <div className={styles.actions}>
                  {hasCamera && (
                    <button 
                      onClick={startScanner}
                      className={styles.btnStart}
                    >
                      <Camera size={20} />
                      Mulai Scanner
                    </button>
                  )}
                  
                  <button 
                    onClick={() => router.push('/dashboard/locations')}
                    className={styles.btnManual}
                  >
                    <MapPin size={20} />
                    Pilih Lokasi Manual
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.scannerActive}>
              <div 
                id="scanner-container"
                className={styles.scannerContainer}
              />
              
              <div className={styles.scanOverlay}>
                <div className={styles.scanFrame}>
                  <div className={styles.corner} />
                  <div className={styles.corner} />
                  <div className={styles.corner} />
                  <div className={styles.corner} />
                </div>
                <p className={styles.scanText}>Arahkan kamera ke QR code</p>
              </div>

              <button 
                onClick={stopScanner}
                className={styles.btnStop}
              >
                <X size={20} />
                Berhenti Scan
              </button>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              ⚠️ {error}
              <button 
                onClick={() => setError('')}
                className={styles.btnDismiss}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className={styles.tips}>
          <h3>💡 Tips Scanning:</h3>
          <div className={styles.tipGrid}>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>📱</span>
              <p>Pastikan QR code bersih dan terang</p>
            </div>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>📏</span>
              <p>Jaga jarak 15-30 cm dari QR code</p>
            </div>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>💡</span>
              <p>Pastikan pencahayaan cukup</p>
            </div>
            <div className={styles.tipItem}>
              <span className={styles.tipIcon}>🎯</span>
              <p>Tahan kamera stabil</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}