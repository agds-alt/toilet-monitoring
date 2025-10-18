// presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import { useRef, useState } from 'react';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  onCapture: (photo: string) => void;
  onCancel: () => void;
}

export default function PhotoCapture({ onCapture, onCancel }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Tidak dapat mengakses kamera');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const photoData = canvasRef.current.toDataURL('image/jpeg', 0.8);
        onCapture(photoData);
        stopCamera();
      }
    }
  };

  return (
    <div className={styles.container}>
      {!isCapturing ? (
        <div className={styles.placeholder}>
          <button onClick={startCamera} className={styles.startButton}>
            📷 Buka Kamera
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            Batal
          </button>
        </div>
      ) : (
        <div className={styles.cameraView}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={styles.video}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          <div className={styles.controls}>
            <button onClick={capturePhoto} className={styles.captureButton}>
              📸 Ambil Foto
            </button>
            <button onClick={stopCamera} className={styles.stopButton}>
              ❌ Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}