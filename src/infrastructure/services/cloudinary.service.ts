// src/infrastructure/services/cloudinary.service.ts
// ============================================
// CLOUDINARY UPLOAD SERVICE
// ============================================

import {
  CloudinaryUploadResponse,
  PhotoUploadItem,
  PhotoMetadata,
} from '@/core/types/inspection.types';
import { CLOUDINARY_CONFIG } from '@/lib/constants/inspection.constants';

// ============================================
// CLOUDINARY SERVICE CLASS
// ============================================

export class CloudinaryService {
  private cloudName = CLOUDINARY_CONFIG.cloudName;
  private uploadPreset = CLOUDINARY_CONFIG.uploadPreset;
  private baseFolder = CLOUDINARY_CONFIG.folder;

  // ============================================
  // UPLOAD SINGLE PHOTO
  // ============================================

  async uploadPhoto(
    file: File | Blob,
    fieldReference: string,
    locationId: string = 'default'
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', `${this.baseFolder}/${locationId}`);

      // Add context for easier searching
      formData.append('context', `field=${fieldReference}|location=${locationId}`);

      // Add tags
      formData.append('tags', `inspection,${fieldReference},${locationId}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const data: CloudinaryUploadResponse = await response.json();

      console.log('✅ Cloudinary upload success:', {
        publicId: data.publicId,
        url: data.secureUrl,
      });

      return data;
    } catch (error) {
      console.error('❌ Cloudinary upload error:', error);
      throw error;
    }
  }

  // ============================================
  // UPLOAD MULTIPLE PHOTOS (BATCH)
  // ============================================

  async uploadBatch(items: PhotoUploadItem[]): Promise<CloudinaryUploadResponse[]> {
    console.log(`📤 Uploading ${items.length} photos...`);

    const results = await Promise.allSettled(
      items.map((item) => this.uploadPhoto(item.file, item.fieldReference))
    );

    const successful: CloudinaryUploadResponse[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        const fileName = items[index].file instanceof File ? items[index].file.name : `file-${index}`;
        failed.push(fileName);
        console.error(`Failed to upload ${fileName}:`, result.reason);
      }
    });

    console.log(`✅ Upload complete: ${successful.length}/${items.length} successful`);

    if (failed.length > 0) {
      console.warn('⚠️ Failed uploads:', failed);
    }

    return successful;
  }

  // ============================================
  // UPLOAD WITH PROGRESS (for large files)
  // ============================================

  async uploadWithProgress(
    file: File,
    fieldReference: string,
    locationId: string,
    onProgress?: (progress: number) => void
  ): Promise<CloudinaryUploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', `${this.baseFolder}/${locationId}`);
      formData.append('context', `field=${fieldReference}|location=${locationId}`);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`);
      xhr.send(formData);
    });
  }

  // ============================================
  // DELETE PHOTO
  // ============================================

  async deletePhoto(publicId: string): Promise<boolean> {
    try {
      // Note: This requires server-side signature
      // For client-side deletion, you need to use the API route
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      console.log('✅ Photo deleted:', publicId);
      return true;
    } catch (error) {
      console.error('❌ Delete error:', error);
      return false;
    }
  }

  // ============================================
  // COMPRESS IMAGE BEFORE UPLOAD
  // ============================================

  async compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1920,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Draw compressed image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              // Create new file
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });

              console.log('🗜️ Compressed:', {
                original: `${(file.size / 1024).toFixed(0)}KB`,
                compressed: `${(compressedFile.size / 1024).toFixed(0)}KB`,
                reduction: `${(((file.size - compressedFile.size) / file.size) * 100).toFixed(0)}%`,
              });

              resolve(compressedFile);
            },
            file.type,
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // ============================================
  // GET OPTIMIZED URL
  // ============================================

  getOptimizedUrl(
    publicId: string,
    options?: {
      width?: number;
      height?: number;
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
  ): string {
    const transformations: string[] = [];

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    if (options?.format) transformations.push(`f_${options.format}`);

    const transformation = transformations.join(',');

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  // ============================================
  // GET THUMBNAIL URL
  // ============================================

  getThumbnailUrl(publicId: string, size: number = 200): string {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      quality: 'auto',
      format: 'auto',
    });
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const cloudinaryService = new CloudinaryService();
