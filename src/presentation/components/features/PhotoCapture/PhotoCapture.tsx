// src/presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Card } from '../../ui/Card/Card';
import { Button } from '../../ui/Button/Button';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  onPhotoCapture: (photoData: string) => void;
  onSkip?: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onPhotoCapture,
  onSkip
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress image before upload (max 800kb)
  const compressImage = useCallback(async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
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
        
        // Compress to 0.7 quality (balance between size and quality)
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
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCompressing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      const photoData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Compress photo
      const compressedPhoto = await compressImage(photoData);
      
      setCapturedPhoto(compressedPhoto);
      stopCamera();
    } catch (error) {
      console.error('Capture error:', error);
      alert('Gagal mengambil foto. Silakan coba lagi.');
    } finally {
      setIsCompressing(false);
    }
  }, [stopCamera, compressImage]);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    setIsCompressing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoData = e.target?.result as string;
        
        // Compress photo
        const compressedPhoto = await compressImage(photoData);
        
        setCapturedPhoto(compressedPhoto);
        setIsCompressing(false);
      };
      reader.onerror = () => {
        alert('Gagal membaca file');
        setIsCompressing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      alert('Gagal membaca file. Silakan coba lagi.');
      setIsCompressing(false);
    }
  }, [compressImage]);

  const handleSubmit = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    // Don't auto-start camera, let user choose again
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h3 className={styles.title}>📸 Ambil Foto</h3>
        <p className={styles.description}>
          {isCompressing
            ? 'Memproses foto...'
            : capturedPhoto 
            ? 'Foto sudah diambil. Kirim atau ambil ulang.'
            : 'Foto diperlukan untuk dokumentasi'
          }
        </p>

        <div className={styles.photoArea}>
          {!capturedPhoto && !isCameraActive && !isCompressing && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📷</div>
              <p>Belum ada foto</p>
            </div>
          )}

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
            </div>
          )}

          {isCompressing && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Memproses foto...</p>
            </div>
          )}

          {capturedPhoto && !isCompressing && (
            <div className={styles.preview}>
              <img 
                src={capturedPhoto} 
                alt="Captured" 
                className={styles.previewImage}
              />
              <div className={styles.photoInfo}>
                <small>
                  Ukuran: {Math.round(capturedPhoto.length / 1024)} KB
                </small>
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {!capturedPhoto && !isCameraActive && !isCompressing && (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={startCamera}
                icon="📷"
              >
                Buka Kamera
              </Button>
              
              <Button
                variant="secondary"
                fullWidth
                onClick={() => fileInputRef.current?.click()}
                icon="📁"
              >
                Pilih dari Galeri
              </Button>
              
              {onSkip && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={onSkip}
                >
                  Lewati Foto
                </Button>
              )}
            </>
          )}

          {isCameraActive && !isCompressing && (
            <>
              <Button
                variant="success"
                fullWidth
                onClick={capturePhoto}
                icon="📸"
                disabled={isCompressing}
              >
                Ambil Foto
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={stopCamera}
                disabled={isCompressing}
              >
                Batal
              </Button>
            </>
          )}

          {capturedPhoto && !isCompressing && (
            <>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                icon="✅"
              >
                Lanjutkan
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleRetake}
              >
                Ambil Ulang
              </Button>
            </>
          )}
        </div>

        {/* File input for gallery - NO capture attribute */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Hidden camera input as fallback - WITH capture attribute */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Card>
    </div>
  );
};

// ============================================
// END COMPONENT EXPORTS
// ============================================

