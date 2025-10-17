// src/presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import styles from './PhotoCapture.module.css';

// ✅ FIX: Interface yang benar dengan accuracy
interface PhotoCaptureProps {
  onCapture: (data: { 
    photoData: string; 
    geoData?: { 
      latitude: number; 
      longitude: number; 
      accuracy: number;
    } 
  }) => void;
  onSkip: () => void;
}

interface LocationInfo {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;  // Untuk reverse geocoding
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onCapture,
  onSkip
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | undefined>();
  const [locationStatus, setLocationStatus] = useState<string>('Mendapatkan lokasi...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Get geolocation on mount with reverse geocoding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const geoData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          
          console.log('📍 Location acquired:', geoData);
          
          // Try to get address using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${geoData.latitude}&lon=${geoData.longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'ToiletMonitoring/1.0'
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = data.address;
              
              // Format: Desa/Kelurahan, Kecamatan, Kota
              const location = [
                address.village || address.suburb || address.neighbourhood,
                address.county || address.city_district,
                address.city || address.town
              ].filter(Boolean).join(', ');
              
              setLocationInfo({
                ...geoData,
                address: location || 'Lokasi tidak diketahui'
              });
              setLocationStatus(`📍 ${location || 'Lokasi terekam'}`);
            } else {
              setLocationInfo(geoData);
              setLocationStatus('📍 Lokasi terekam');
            }
          } catch (error) {
            console.warn('Reverse geocoding error:', error);
            setLocationInfo(geoData);
            setLocationStatus('📍 Lokasi terekam');
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          setLocationInfo(undefined);
          setLocationStatus('⚠️ Lokasi tidak tersedia');
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

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Compress image before upload (max 800kb)
  const compressImage = useCallback(async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Resize if too large (max 1920px)
        const maxSize = 1920;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to 0.7 quality
        let quality = 0.7;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // If still too large (>800kb), reduce quality more
        while (compressedDataUrl.length > 800 * 1024 && quality > 0.3) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        console.log('Original size:', Math.round(dataUrl.length / 1024), 'KB');
        console.log('Compressed size:', Math.round(compressedDataUrl.length / 1024), 'KB');
        console.log('Quality:', quality);
        
        resolve(compressedDataUrl);
      };
      img.src = dataUrl;
    });
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Tidak dapat mengakses kamera. Pastikan permission sudah diberikan.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    
    stopCamera();
    
    setIsCompressing(true);
    const compressedPhoto = await compressImage(photoDataUrl);
    setIsCompressing(false);
    
    setCapturedPhoto(compressedPhoto);
  }, [stopCamera, compressImage]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      
      setIsCompressing(true);
      const compressedPhoto = await compressImage(dataUrl);
      setIsCompressing(false);
      
      setCapturedPhoto(compressedPhoto);
    };
    reader.readAsDataURL(file);
  }, [compressImage]);

  const handleRetake = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const handleSubmit = useCallback(() => {
    if (!capturedPhoto) {
      alert('Silakan ambil foto terlebih dahulu');
      return;
    }
    
    // Pass data dengan accuracy
    const geoData = locationInfo ? {
      latitude: locationInfo.latitude,
      longitude: locationInfo.longitude,
      accuracy: locationInfo.accuracy
    } : undefined;
    
    onCapture({ 
      photoData: capturedPhoto,
      geoData
    });
  }, [capturedPhoto, locationInfo, onCapture]);

  // Format timestamp Indonesia
  const getFormattedTimestamp = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return now.toLocaleString('id-ID', options);
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h2 className={styles.title}>📸 Ambil Foto</h2>
        <p className={styles.description}>
          {capturedPhoto 
            ? 'Foto berhasil diambil' 
            : isCameraActive 
              ? 'Posisikan kamera dan tekan tombol capture'
              : 'Ambil foto kondisi toilet'
          }
        </p>

        {/* Photo Area */}
        <div className={styles.photoArea}>
          {isCompressing ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Mengkompresi foto...</p>
            </div>
          ) : capturedPhoto ? (
            <div className={styles.preview}>
              <img 
                src={capturedPhoto} 
                alt="Captured" 
                className={styles.previewImage}
              />
              <div className={styles.photoInfo}>
                {Math.round(capturedPhoto.length / 1024)} KB
              </div>
            </div>
          ) : isCameraActive ? (
            <div className={styles.cameraView}>
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={styles.video}
              />
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📷</div>
              <p>Siap mengambil foto</p>
            </div>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Metadata Info */}
        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <span className={styles.metadataIcon}>🕐</span>
            <span className={styles.metadataText}>{getFormattedTimestamp()}</span>
          </div>
          <div className={styles.metadataItem}>
            <span className={styles.metadataIcon}>📍</span>
            <span className={styles.metadataText}>
              {locationInfo?.address || locationStatus}
              {locationInfo && ` (±${Math.round(locationInfo.accuracy)}m)`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {capturedPhoto ? (
            <>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleRetake}
              >
                🔄 Ambil Ulang
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
              >
                ✅ Gunakan Foto Ini
              </Button>
            </>
          ) : isCameraActive ? (
            <>
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={capturePhoto}
              >
                📸 Capture
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={stopCamera}
              >
                ❌ Batal
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={startCamera}
              >
                📷 Buka Kamera
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => cameraInputRef.current?.click()}
              >
                📁 Pilih dari Galeri
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={onSkip}
              >
                ⏭️ Lewati Foto
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};