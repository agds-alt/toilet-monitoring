// ============================================
// FIX 4: src/presentation/components/features/PhotoCapture/PhotoCapture.tsx
// Change to default export and fix props
// ============================================
'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../../ui/Button/Button';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  onCapture: (data: { 
    photoData: string; 
    geoData?: { latitude: number; longitude: number } 
  }) => void;
  onSkip: () => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onCapture,
  onSkip
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<{ latitude: number; longitude: number } | undefined>();
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    getLocation();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera');
    }
  };

  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      );
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoData(data);

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const retakePhoto = () => {
    setPhotoData(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (photoData) {
      onCapture({ photoData, geoData });
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <p>{error}</p>
        <Button onClick={onSkip}>Lewati Foto</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cameraContainer}>
        {!photoData ? (
          <>
            <video ref={videoRef} autoPlay playsInline className={styles.video} />
            <canvas ref={canvasRef} className={styles.canvas} />
          </>
        ) : (
          <img src={photoData} alt="Captured" className={styles.preview} />
        )}
      </div>

      <div className={styles.controls}>
        {!photoData ? (
          <>
            <Button onClick={capturePhoto} variant="primary">
              📸 Ambil Foto
            </Button>
            <Button onClick={onSkip} variant="secondary">
              Lewati
            </Button>
          </>
        ) : (
          <>
            <Button onClick={confirmPhoto} variant="primary">
              ✓ Gunakan Foto
            </Button>
            <Button onClick={retakePhoto} variant="secondary">
              🔄 Ambil Ulang
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoCapture;
