// src/presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { GeoData } from '@/core/types/interfaces';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  onCapture: (data: { 
    photoData: string; 
    geoData?: GeoData;
  }) => void;
  onSkip: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onCapture,
  onSkip
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [geoData, setGeoData] = useState<GeoData | undefined>();
  const [locationStatus, setLocationStatus] = useState<string>('Mendapatkan lokasi...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('📍 Mendapatkan lokasi...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const data: GeoData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          setGeoData(data);
          setLocationStatus(`✅ Lokasi didapat (±${Math.round(data.accuracy || 0)}m)`);
          console.log('📍 Location acquired:', data);
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          setLocationStatus('⚠️ Lokasi tidak tersedia');
          // Continue without geolocation
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationStatus('⚠️ GPS tidak didukung');
    }
  }, []);

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Camera error:', error);
      alert('Tidak dapat mengakses kamera. Silakan gunakan upload foto.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoData);
      stopCamera();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    setIsCompressing(true);

    try {
      const compressedData = await compressImage(file);
      setCapturedPhoto(compressedData);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Gagal memproses foto');
    } finally {
      setIsCompressing(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = () => {
    if (!capturedPhoto) {
      alert('Silakan ambil foto terlebih dahulu');
      return;
    }

    onCapture({
      photoData: capturedPhoto,
      geoData: geoData
    });
  };

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
              {isCompressing ? '⏳ Memproses...' : '📁 Upload Foto'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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

        {isCameraActive && (
          <div className={styles.cameraView}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
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