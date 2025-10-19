// src/presentation/hooks/usePhotoCapture.ts
import { useState } from 'react';
import { CloudinaryPhotoRepository } from '../../../infrastructure/storage/CloudinaryPhotoRepository';

export interface UsePhotoCaptureProps {
  locationId: string;
  userId: string;
  onPhotosUploaded: (photoUrls: string[]) => void;
  onSkip?: () => void;
}

export const usePhotoCapture = ({ 
  locationId, 
  userId, 
  onPhotosUploaded, 
  onSkip 
}: UsePhotoCaptureProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const photoRepository = new CloudinaryPhotoRepository();

  const capturePhoto = (photoData: string) => {
    setPhotos(prev => [...prev, photoData]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async () => {
    if (photos.length === 0) {
      onPhotosUploaded([]);
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = photos.map((photoData, index) => 
        photoRepository.upload(photoData, {
          userId,
          locationId,
          timestamp: new Date().toISOString(),
          deviceInfo: navigator.userAgent
        })
      );

      const uploadedUrls = await Promise.all(uploadPromises);
      onPhotosUploaded(uploadedUrls);
    } catch (error) {
      console.error('Photo upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return {
    photos,
    capturePhoto,
    removePhoto,
    uploadPhotos,
    handleSkip,
    isUploading,
    hasPhotos: photos.length > 0
  };
};