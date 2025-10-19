// presentation/components/features/PhotoCapture/PhotoCapture.tsx
'use client';

import { useState, useRef } from 'react';
// HAPUS import yang error, atau perbaiki jadi:
// import { uploadToCloudinary } from '@/lib/utils/cloudinary.client'; // Jika perlu
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  onPhotoCapture: (file: File) => void;
  onClose: () => void;
  currentPhoto?: string | null;
}

export default function PhotoCapture({ 
  onPhotoCapture, 
  onClose, 
  currentPhoto 
}: PhotoCaptureProps) {
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhoto || null);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle file upload dari gallery
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validasi file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
        setMode('preview');
      };
      reader.readAsDataURL(file);
    }
  };

  // Start camera
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setMode('camera');
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Cannot access camera. Please check permissions.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Capture photo dari camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { 
              type: 'image/jpeg' 
            });
            
            const previewUrl = URL.createObjectURL(blob);
            setPhotoPreview(previewUrl);
            setMode('preview');
            
            // Stop camera stream
            stopCamera();
          }
        }, 'image/jpeg', 0.8); // 80% quality
      }
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Confirm photo
  const confirmPhoto = () => {
    if (photoPreview && photoPreview.startsWith('data:')) {
      // Convert dataURL to File
      fetch(photoPreview)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `inspection_photo_${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          onPhotoCapture(file);
          onClose();
        })
        .catch(error => {
          console.error('Error converting photo:', error);
          alert('Error processing photo. Please try again.');
        });
    } else {
      // Handle case where photo is already a URL (from existing photo)
      onClose();
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setPhotoPreview(null);
    setMode('select');
    
    // Cleanup preview URL
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
  };

  // Cancel dan cleanup
  const handleClose = () => {
    stopCamera();
    
    // Cleanup preview URL
    if (photoPreview && photoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Add Photo</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {/* Content berdasarkan mode */}
        <div className={styles.content}>
          
          {/* Mode Pilih: Upload atau Camera */}
          {mode === 'select' && (
            <div className={styles.selectMode}>
              <div className={styles.optionCard} onClick={startCamera}>
                <div className={styles.optionIcon}>📷</div>
                <h3 className={styles.optionTitle}>Take Photo</h3>
                <p className={styles.optionDescription}>
                  Use your camera to take a new photo
                </p>
                {isCapturing && (
                  <div className={styles.loading}>Starting camera...</div>
                )}
              </div>

              <div 
                className={styles.optionCard}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.optionIcon}>🖼️</div>
                <h3 className={styles.optionTitle}>Choose from Gallery</h3>
                <p className={styles.optionDescription}>
                  Select an existing photo from your device
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.hiddenInput}
              />
            </div>
          )}

          {/* Mode Camera */}
          {mode === 'camera' && (
            <div className={styles.cameraMode}>
              <div className={styles.cameraPreview}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles.video}
                />
                <div className={styles.cameraOverlay}>
                  <div className={styles.captureFrame} />
                </div>
              </div>
              
              <div className={styles.cameraControls}>
                <button 
                  onClick={capturePhoto}
                  className={styles.captureButton}
                >
                  📸
                </button>
                <button 
                  onClick={() => {
                    stopCamera();
                    setMode('select');
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Mode Preview */}
          {mode === 'preview' && photoPreview && (
            <div className={styles.previewMode}>
              <div className={styles.photoPreview}>
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className={styles.previewImage}
                />
              </div>
              
              <div className={styles.previewControls}>
                <button 
                  onClick={confirmPhoto}
                  className={styles.confirmButton}
                >
                  ✅ Use This Photo
                </button>
                <button 
                  onClick={retakePhoto}
                  className={styles.retakeButton}
                >
                  🔄 Retake
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Warning - Hanya 1 foto yang diperbolehkan */}
        <div className={styles.warning}>
          ⚠️ Only 1 photo allowed per inspection
        </div>
      </div>
    </div>
  );
}