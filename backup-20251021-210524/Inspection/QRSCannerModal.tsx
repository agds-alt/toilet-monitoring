// src/presentation/components/features/inspection/QRScannerModal.tsx
// ============================================
// QR SCANNER MODAL - Integration with Inspection
// ============================================

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { locationService } from '@/infrastructure/services/location.service';
import styles from './QRScannerModal.module.css';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationFound: (locationId: string, locationName: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onLocationFound }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  }, []);

  // Start camera
  const startCamera = async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        scan();
      }
    } catch (err: any) {
      console.error('❌ Camera error:', err);

      if (err.name === 'NotAllowedError') {
        setError('Izin kamera ditolak. Silakan izinkan akses kamera.');
      } else if (err.name === 'NotFoundError') {
        setError('Kamera tidak ditemukan pada perangkat ini.');
      } else {
        setError('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
      }
    }
  };

  // Scan loop
  const scan = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      console.log('✅ QR Code detected:', code.data);
      handleQRDetected(code.data);
      return;
    }

    animationRef.current = requestAnimationFrame(scan);
  }, [isScanning]);

  // Handle QR detected
  const handleQRDetected = async (qrData: string) => {
    stopScanning();
    setDetectedCode(qrData);
    setLoading(true);
    setError(null);

    try {
      // Extract code from QR data
      let code = qrData.trim();

      // If URL, extract code from path
      if (qrData.includes('/scan/')) {
        const match = qrData.match(/\/scan\/([^/?]+)/);
        if (match) {
          code = match[1];
        }
      }

      console.log('🔍 Looking up location code:', code);

      // Fetch location by QR code
      const location = await locationService.getLocationByQR(code);

      if (location) {
        console.log('✅ Location found:', location.name);
        onLocationFound(location.id, location.name);
        onClose();
      } else {
        setError(`Lokasi dengan kode "${code}" tidak ditemukan`);
        setTimeout(() => {
          setDetectedCode(null);
          setLoading(false);
          startCamera();
        }, 2000);
      }
    } catch (err: any) {
      console.error('❌ Location lookup error:', err);
      setError(err.message || 'Gagal memuat data lokasi');
      setTimeout(() => {
        setDetectedCode(null);
        setLoading(false);
        startCamera();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopScanning();
      setError(null);
      setDetectedCode(null);
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>📷 Scan QR Code</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Scanner Area */}
        <div className={styles.scannerContainer}>
          <video ref={videoRef} className={styles.video} playsInline muted />
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Scan Frame */}
          {isScanning && !detectedCode && (
            <div className={styles.scanFrame}>
              <div className={styles.scanCorner} data-corner="tl" />
              <div className={styles.scanCorner} data-corner="tr" />
              <div className={styles.scanCorner} data-corner="bl" />
              <div className={styles.scanCorner} data-corner="br" />
              <div className={styles.scanLine} />
            </div>
          )}

          {/* Scanning Indicator */}
          {isScanning && !detectedCode && !error && (
            <div className={styles.scanningIndicator}>
              <p className={styles.scanningText}>Arahkan kamera ke QR code</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Memuat lokasi...</p>
            </div>
          )}

          {/* Success */}
          {detectedCode && !loading && !error && (
            <div className={styles.successOverlay}>
              <div className={styles.successIcon}>✓</div>
              <p className={styles.successText}>QR Code Terdeteksi!</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorOverlay}>
              <div className={styles.errorIcon}>⚠️</div>
              <p className={styles.errorText}>{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  startCamera();
                }}
                className={styles.retryButton}
              >
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!error && (
          <div className={styles.instructions}>
            <p className={styles.instructionText}>💡 Pastikan QR code terlihat jelas dalam frame</p>
          </div>
        )}
      </div>
    </div>
  );
}
