// src/presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import React, { useRef, useState } from 'react';
import NextImage from 'next/image';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import styles from './PhotoCapture.module.css';

interface GeoData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface PhotoCaptureProps {
  locationName={location.name}    // ✅ tambah ini
  onSubmit={handlePhotoComplete}   // ✅ ganti onCapture jadi onSubmit
  onSubmit: (data: { photoData: string; geoData?: GeoData }) => void;
  onSkip: () => void;
}

// ✅ FAST IMAGE COMPRESSION
const compressImage = async (file: File, maxWidth: number = 1200, quality: number = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }

        // ✅ WHITE BACKGROUND - Prevent black screen
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with quality
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
};

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  locationName,
  onSubmit,
  onSkip
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoData | undefined>(undefined);
  const [isCompressing, setIsCompressing] = useState(false);
  const [locationStatus, setLocationStatus] = useState('📍 Mengambil lokasi...');

  // ✅ GET GEOLOCATION
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationStatus('📍 Lokasi berhasil didapat');
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationStatus('📍 Lokasi tidak tersedia (opsional)');
        }
      );
    } else {
      setLocationStatus('📍 GPS tidak didukung');
    }
  }, []);

  // ✅ START CAMERA - Enhanced for mobile
  const startCamera = async () => {
    try {
      // ✅ Request camera with optimal settings for mobile
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // ✅ Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };

        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error: any) {
      console.error('❌ Camera error:', error);
      
      // ✅ Better error messages
      if (error.name === 'NotAllowedError') {
        alert('❌ Akses kamera ditolak. Izinkan akses kamera di pengaturan browser.');
      } else if (error.name === 'NotFoundError') {
        alert('❌ Kamera tidak ditemukan di perangkat ini.');
      } else {
        alert('❌ Gagal membuka kamera: ' + error.message);
      }
      
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  // ✅ STOP CAMERA
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // ✅ CAPTURE PHOTO
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ✅ WHITE BACKGROUND
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(video, 0, 0);

    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoData);

    // Stop camera
    stopCamera();
  };

  // ✅ FILE UPLOAD WITH FAST COMPRESSION
  const handleFileUpload = async (file: File) => {
    setIsCompressing(true);

    try {
      const compressed = await compressImage(file, 1200, 0.85);
      setCapturedPhoto(compressed);
    } catch (error) {
      console.error('❌ Compression error:', error);
      alert('❌ Gagal memproses gambar');
    } finally {
      setIsCompressing(false);
    }
  };

  // ✅ SUBMIT
  const handleSubmit = () => {
    if (!capturedPhoto) {
      alert('❌ Belum ada foto');
      return;
    }

    onSubmit({
      photoData: capturedPhoto,
      geoData: geoData
    });
  };

  // ✅ RETAKE
  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="md" className={styles.header}>
        <h2 className={styles.title}>📸 Foto Dokumentasi</h2>
        <p className={styles.subtitle}>Ambil foto kondisi toilet</p>
        <p className={styles.locationStatus}>{locationStatus}</p>
      </Card>

      <div className={styles.content}>
        {/* ✅ INITIAL OPTIONS */}
        {!isCameraActive && !capturedPhoto && (
          <div className={styles.options}>
            <Button
              variant="primary"
              size="lg"
              onClick={startCamera}
              fullWidth
              className={styles.optionButton}
            >
              📷 Buka Kamera
            </Button>

            <div className={styles.divider}>atau</div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              className={styles.optionButton}
              disabled={isCompressing}
            >
              {isCompressing ? '⏳ Memproses...' : '📁 Pilih dari Galeri'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />

            <div className={styles.skipSection}>
              <Button
                variant="secondary"
                size="md"
                onClick={onSkip}
                fullWidth
              >
                Lewati Foto →
              </Button>
            </div>
          </div>
        )}

        {/* ✅ CAMERA VIEW */}
        {isCameraActive && (
          <div className={styles.cameraView}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={styles.video}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className={styles.cameraControls}>
              <Button
                variant="secondary"
                onClick={stopCamera}
              >
                ✕ Batal
              </Button>
              <Button
                variant="primary"
                onClick={capturePhoto}
                size="lg"
                className={styles.captureButton}
              >
                📸 Ambil Foto
              </Button>
            </div>
          </div>
        )}

        {/* ✅ PREVIEW */}
        {capturedPhoto && (
          <div className={styles.preview}>
            <NextImage
              src={capturedPhoto}
              alt="Preview"
              width={800}
              height={600}
              className={styles.previewImage}
              unoptimized
            />
            
            <div className={styles.previewControls}>
              <Button
                variant="secondary"
                onClick={retakePhoto}
              >
                🔄 Foto Ulang
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                size="lg"
              >
                ✓ Lanjutkan
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card variant="outlined" padding="sm" className={styles.infoCard}>
        <p className={styles.infoText}>
          💡 <strong>Tips:</strong> Pastikan foto jelas dan cahaya cukup
        </p>
      </Card>
    </div>
  );
};