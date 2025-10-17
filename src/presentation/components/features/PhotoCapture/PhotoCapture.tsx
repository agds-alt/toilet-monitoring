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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      alert('Tidak dapat mengakses kamera. Silakan gunakan upload file.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoData);
    stopCamera();
  }, [stopCamera]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const photoData = e.target?.result as string;
      setCapturedPhoto(photoData);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="lg">
        <h3 className={styles.title}>📸 Ambil Foto</h3>
        <p className={styles.description}>
          {capturedPhoto 
            ? 'Foto sudah diambil. Kirim atau ambil ulang.'
            : 'Foto diperlukan untuk dokumentasi'
          }
        </p>

        <div className={styles.photoArea}>
          {!capturedPhoto && !isCameraActive && (
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
                className={styles.video}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          )}

          {capturedPhoto && (
            <div className={styles.preview}>
              <img 
                src={capturedPhoto} 
                alt="Captured" 
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          {!capturedPhoto && !isCameraActive && (
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
                Upload File
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

          {isCameraActive && (
            <>
              <Button
                variant="success"
                fullWidth
                onClick={capturePhoto}
                icon="📸"
              >
                Ambil Foto
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={stopCamera}
              >
                Batal
              </Button>
            </>
          )}

          {capturedPhoto && (
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

        <input
          ref={fileInputRef}
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
