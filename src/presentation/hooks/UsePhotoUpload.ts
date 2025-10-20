// src/presentation/hooks/usePhotoUpload.ts
// ============================================
// PHOTO UPLOAD HOOK
// ============================================

'use client';

import { useState, useCallback } from 'react';
import {
  PhotoUploadItem,
  PhotoMetadata,
  CloudinaryUploadResponse,
} from '@/core/types/inspection.types';
import { cloudinaryService } from '@/infrastructure/services/cloudinary.service';
import { validatePhotoFile } from '@/lib/utils/validation.utils';

interface UsePhotoUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadPhoto: (
    file: File,
    fieldReference: string,
    locationId: string,
    userId: string
  ) => Promise<PhotoMetadata | null>;
  uploadBatch: (
    items: PhotoUploadItem[],
    userId: string
  ) => Promise<PhotoMetadata[]>;
  compressAndUpload: (
    file: File,
    fieldReference: string,
    locationId: string,
    userId: string
  ) => Promise<PhotoMetadata | null>;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // UPLOAD SINGLE PHOTO
  // ============================================

  const uploadPhoto = useCallback(
    async (
      file: File,
      fieldReference: string,
      locationId: string,
      userId: string
    ): Promise<PhotoMetadata | null> => {
      try {
        setUploading(true);
        setError(null);
        setProgress(0);

        // Validate file
        const validation = validatePhotoFile(file);
        if (!validation.isValid) {
          throw new Error(validation.errors[0]?.message || 'Invalid file');
        }

        console.log('📤 Uploading photo...', {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)}KB`,
          field: fieldReference,
        });

        // Upload to Cloudinary
        const result: CloudinaryUploadResponse = await cloudinaryService.uploadPhoto(
          file,
          fieldReference,
          locationId
        );

        setProgress(100);

        // Convert to PhotoMetadata
        const photoMetadata: PhotoMetadata = {
          id: result.public_id,
          location_id: locationId,
          file_url: result.secure_url,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          width: result.width,
          height: result.height,
          field_reference: fieldReference,
          uploaded_by: userId,
          uploaded_at: new Date().toISOString(),
          cloudinary_public_id: result.public_id,
        };

        console.log('✅ Photo uploaded:', photoMetadata.file_url);
        return photoMetadata;
      } catch (err: any) {
        console.error('❌ Upload error:', err);
        setError(err.message || 'Upload gagal');
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  // ============================================
  // UPLOAD BATCH
  // ============================================

  const uploadBatch = useCallback(
    async (
      items: PhotoUploadItem[],
      userId: string
    ): Promise<PhotoMetadata[]> => {
      try {
        setUploading(true);
        setError(null);
        setProgress(0);

        console.log(`📤 Uploading ${items.length} photos...`);

        const results: PhotoMetadata[] = [];
        const totalItems = items.length;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          try {
            const metadata = await uploadPhoto(
              item.file,
              item.fieldReference,
              item.locationId,
              userId
            );

            if (metadata) {
              results.push(metadata);
            }

            // Update progress
            setProgress(Math.round(((i + 1) / totalItems) * 100));
          } catch (err) {
            console.error(`Failed to upload ${item.file.name}:`, err);
          }
        }

        console.log(`✅ Batch upload complete: ${results.length}/${totalItems}`);
        return results;
      } catch (err: any) {
        console.error('❌ Batch upload error:', err);
        setError(err.message || 'Batch upload gagal');
        return [];
      } finally {
        setUploading(false);
      }
    },
    [uploadPhoto]
  );

  // ============================================
  // COMPRESS AND UPLOAD
  // ============================================

  const compressAndUpload = useCallback(
    async (
      file: File,
      fieldReference: string,
      locationId: string,
      userId: string
    ): Promise<PhotoMetadata | null> => {
      try {
        setUploading(true);
        setError(null);

        console.log('🗜️ Compressing image...');

        // Compress image before upload
        const compressedFile = await cloudinaryService.compressImage(
          file,
          1920,
          1920,
          0.8
        );

        console.log('✅ Compression complete:', {
          original: `${(file.size / 1024).toFixed(0)}KB`,
          compressed: `${(compressedFile.size / 1024).toFixed(0)}KB`,
        });

        // Upload compressed file
        return await uploadPhoto(
          compressedFile,
          fieldReference,
          locationId,
          userId
        );
      } catch (err: any) {
        console.error('❌ Compress and upload error:', err);
        setError(err.message || 'Compress and upload gagal');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [uploadPhoto]
  );

  return {
    uploading,
    progress,
    error,
    uploadPhoto,
    uploadBatch,
    compressAndUpload,
  };
}