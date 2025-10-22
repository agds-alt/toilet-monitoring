// Page: ScanPage (QR Scanner)
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, ArrowLeft, Flashlight, FlashlightOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BottomNav } from '../components/layout/BottomNav';
import styles from './ScanPage.module.css';

interface ScanPageProps {
  onLocationFound?: (locationId: string) => void;
}

const ScanPage: React.FC<ScanPageProps> = ({ onLocationFound }) => {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleFlashlight = () => {
    setFlashlightOn(!flashlightOn);
    // In a real implementation, you would control the flashlight
    // This is a placeholder for the flashlight functionality
  };

  const handleQRCodeDetected = (qrData: string) => {
    // Extract location ID from QR data
    // Assuming QR contains URL like: /scan/TOILET-123456-ABC
    const locationId = qrData.split('/').pop();
    
    if (locationId && onLocationFound) {
      onLocationFound(locationId);
    } else {
      // Navigate to inspection page with location ID
      router.push(`/inspection/${locationId}`);
    }
    
    stopScanning();
  };

  const handleBack = () => {
    stopScanning();
    router.back();
  };

  if (hasPermission === false) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Kembali
          </button>
          <h1 className={styles.title}>Scan QR Code</h1>
        </header>

        <main className={styles.main}>
          <div className={styles.errorState}>
            <QrCode size={64} className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Akses Kamera Ditolak</h2>
            <p className={styles.errorDescription}>
              Untuk dapat scan QR code, aplikasi memerlukan akses kamera.
              Silakan aktifkan izin kamera di pengaturan browser.
            </p>
            <Button onClick={handleBack} variant="primary">
              Kembali ke Dashboard
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Kembali
        </button>
        <h1 className={styles.title}>Scan QR Code</h1>
        <button 
          onClick={toggleFlashlight} 
          className={styles.flashlightButton}
          disabled={!isScanning}
        >
          {flashlightOn ? <FlashlightOff size={20} /> : <Flashlight size={20} />}
        </button>
      </header>

      <main className={styles.main}>
        {!isScanning ? (
          <div className={styles.scanPrompt}>
            <div className={styles.scanIcon}>
              <QrCode size={80} />
            </div>
            <h2 className={styles.scanTitle}>Scan QR Code Toilet</h2>
            <p className={styles.scanDescription}>
              Arahkan kamera ke QR code yang ada di lokasi toilet untuk mulai inspeksi
            </p>
            <Button 
              onClick={startScanning} 
              variant="primary" 
              size="lg"
              fullWidth
            >
              Mulai Scan
            </Button>
          </div>
        ) : (
          <div className={styles.scannerContainer}>
            <video
              ref={videoRef}
              className={styles.scannerVideo}
              autoPlay
              playsInline
              muted
            />
            <div className={styles.scannerOverlay}>
              <div className={styles.scannerFrame} />
              <div className={styles.scannerInstructions}>
                <p>Posisikan QR code dalam bingkai</p>
              </div>
            </div>
            <div className={styles.scannerControls}>
              <Button 
                onClick={stopScanning} 
                variant="outline"
                size="lg"
              >
                Stop Scan
              </Button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ScanPage;
