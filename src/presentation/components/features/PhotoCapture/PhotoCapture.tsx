// ===================================
// 📁 src/presentation/components/features/inspection/PhotoCapture.tsx
// Photo Capture with Geolocation
// ===================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, MapPin } from 'lucide-react';
import styles from './PhotoCapture.module.css';

interface Props {
  onCapture: (photo: string, geoData: { lat: number; lng: number } | null) => void;
  onClose: () => void;
}

export default function PhotoCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    startCamera();
    getGeolocation();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Cannot access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const getGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeoData({ lat: latitude, lng: longitude });
        setGeoStatus('success');
        console.log('📍 Location:', { lat: latitude, lng: longitude });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setGeoStatus('error');
        // Continue without location
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Add timestamp overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, canvas.height - 60, 300, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(new Date().toLocaleString(), 20, canvas.height - 30);

    // Add GPS overlay if available
    if (geoData) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width - 310, canvas.height - 60, 300, 50);

      ctx.fillStyle = '#10B981';
      ctx.font = '14px Arial';
      ctx.fillText(
        `📍 ${geoData.lat.toFixed(6)}, ${geoData.lng.toFixed(6)}`,
        canvas.width - 300,
        canvas.height - 30
      );
    }

    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setPhoto(photoData);
    stopCamera();
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (photo) {
      onCapture(photo, geoData);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Camera size={20} />
            Take Photo
          </h3>
          <button onClick={onClose} className={styles.btnClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Geolocation Status */}
          <div className={styles.geoStatus} data-status={geoStatus}>
            <MapPin size={16} />
            {geoStatus === 'loading' && 'Getting location...'}
            {geoStatus === 'success' &&
              `Location: ${geoData?.lat.toFixed(4)}, ${geoData?.lng.toFixed(4)}`}
            {geoStatus === 'error' && 'Location unavailable'}
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          {/* Camera/Photo View */}
          <div className={styles.cameraContainer}>
            {photo ? (
              <img src={photo} alt="Captured" className={styles.photo} />
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
                <div className={styles.cameraOverlay}>
                  <div className={styles.frame} />
                </div>
              </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            {photo ? (
              <>
                <button onClick={retakePhoto} className={styles.btnRetake}>
                  <RotateCcw size={20} />
                  Retake
                </button>
                <button onClick={confirmPhoto} className={styles.btnConfirm}>
                  <Check size={20} />
                  Use Photo
                </button>
              </>
            ) : (
              <button onClick={capturePhoto} className={styles.btnCapture} disabled={!!error}>
                <Camera size={24} />
                Capture
              </button>
            )}
          </div>

          {/* Tips */}
          {!photo && (
            <div className={styles.tips}>
              <div className={styles.tip}>💡 Make sure the area is well-lit</div>
              <div className={styles.tip}>📸 Hold the camera steady</div>
              {geoStatus === 'success' && (
                <div className={styles.tip}>📍 Location data will be included</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
