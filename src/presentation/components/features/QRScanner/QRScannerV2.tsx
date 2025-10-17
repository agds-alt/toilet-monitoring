'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import styles from './QRScanner.module.css';

interface QRScannerV2Props {
  onScan: (code: string) => void;
  onManualSelect: () => void;
}

export const QRScannerV2: React.FC<QRScannerV2Props> = ({
  onScan,
  onManualSelect
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const stopScanning = useCallback(() => {
    // Stop animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Stop video stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  }, []);

  const scan = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Wait for video to be ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scan);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert', // Faster scanning
    });

    if (code && code.data) {
      console.log('✅ QR Code detected:', code.data);
      setDetectedCode(code.data);
      
      // Stop scanning and return result
      stopScanning();
      onScan(code.data);
      return;
    }

    // Continue scanning
    animationRef.current = requestAnimationFrame(scan);
  }, [isScanning, onScan, stopScanning]);

  const startScanning = async () => {
    setError(null);
    setDetectedCode(null);

    try {
      console.log('📷 Starting camera...');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        console.log('✅ Camera started, scanning...');
        
        // Start scanning loop
        scan();
      }
    } catch (err) {
      console.error('❌ Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
      setIsScanning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h2 className={styles.title}>🧹 Smart Toilet Check</h2>
        <p className={styles.description}>
          Scan QR code di toilet atau pilih lokasi manual
        </p>

        <div className={styles.scannerArea}>
          {/* Video element */}
          <video
            ref={videoRef}
            className={styles.video}
            playsInline
            muted
            style={{ 
              display: isScanning ? 'block' : 'none',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '12px'
            }}
          />

          {/* Hidden canvas for processing */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />

          {/* Placeholder when not scanning */}
          {!isScanning && (
            <div className={styles.placeholder}>
              <div className={styles.qrIcon}>📱</div>
              <p>Scanner siap digunakan</p>
            </div>
          )}

          {/* Scanning indicator */}
          {isScanning && (
            <div className={styles.scanningOverlay}>
              <div className={styles.scanLine} />
              <p style={{ color: 'white', marginTop: '10px' }}>
                Arahkan kamera ke QR code...
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Success message */}
        {detectedCode && (
          <div className={styles.success}>
            ✅ QR Code terdeteksi: {detectedCode}
          </div>
        )}

        {/* Action buttons */}
        <div className={styles.actions}>
          {!isScanning ? (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={startScanning}
                icon="📷"
              >
                Scan QR Code
              </Button>
              <div className={styles.divider}>atau</div>
              <Button
                variant="secondary"
                fullWidth
                onClick={onManualSelect}
                icon="📍"
              >
                Pilih Lokasi Manual
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              fullWidth
              onClick={stopScanning}
            >
              Berhenti Scan
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
