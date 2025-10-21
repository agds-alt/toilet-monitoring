// src/presentation/components/features/inspection/PhotoCapture.tsx
// ============================================
// PHOTO CAPTURE - Camera/Upload Component
// ============================================

'use client';

import React, { useRef, useState } from 'react';
import { PhotoUploadItem } from '@/core/types/inspection.types';
import { validatePhotoFile } from '@/lib/utils/validation.utils';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
  fieldReference: string;
  locationId: string;
  onCapture: (photo: PhotoUploadItem) => void;
  maxPhotos?: number;
  currentPhotoCount?: number;
  disabled?: boolean;
  className?: string;
}

export function PhotoCapture({
  fieldReference,
  onCapture,
  maxPhotos = 3,
  currentPhotoCount = 0,
  disabled = false,
  className = '',
}: PhotoCaptureProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const canAddMore = currentPhotoCount < maxPhotos;

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validatePhotoFile(file);
    if (!validation.isValid) {
      setError(validation.errors[0]?.message || 'File tidak valid');
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    const photoItem: PhotoUploadItem = {
      file,
      preview,
      fieldReference,
    };

    onCapture(photoItem);
    setShowOptions(false);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!canAddMore) {
    return (
      <div className={`${styles.maxReached} ${className}`}>
        <span className={styles.maxText}>📸 Maksimal {maxPhotos} foto</span>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Main Button */}
      <button
        type="button"
        onClick={() => setShowOptions(!showOptions)}
        disabled={disabled}
        className={styles.mainButton}
      >
        <span className={styles.buttonIcon}>📷</span>
        <span className={styles.buttonText}>Ambil Foto</span>
        <span className={styles.badge}>
          {currentPhotoCount}/{maxPhotos}
        </span>
      </button>

      {/* Options Menu */}
      {showOptions && (
        <div className={styles.optionsMenu}>
          <button type="button" onClick={openCamera} className={styles.option}>
            <span className={styles.optionIcon}>📷</span>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Kamera</span>
              <span className={styles.optionDesc}>Ambil foto langsung</span>
            </div>
          </button>

          <button type="button" onClick={openGallery} className={styles.option}>
            <span className={styles.optionIcon}>🖼️</span>
            <div className={styles.optionContent}>
              <span className={styles.optionTitle}>Galeri</span>
              <span className={styles.optionDesc}>Pilih dari galeri</span>
            </div>
          </button>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraCapture}
        className={styles.hiddenInput}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleGalleryUpload}
        className={styles.hiddenInput}
      />

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  );
}
