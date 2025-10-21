// src/domain/inspection/services/cloudinary.service.ts
// ============================================
// CLOUDINARY SERVICE - Photo Upload with Watermark
// ============================================

interface WatermarkData {
  timestamp: string;
  location: string;
  gps: {
    latitude: number;
    longitude: number;
  } | null;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

    if (!this.cloudName || !this.uploadPreset) {
      console.warn('⚠️ Cloudinary credentials not configured');
    }
  }

  /**
   * Add watermark to image using canvas
   */
  async addWatermarkToImage(
    file: File,
    watermarkData: WatermarkData
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }

          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Configure watermark style
          const fontSize = Math.max(img.width / 40, 16); // Responsive font size
          const padding = fontSize / 2;
          const lineHeight = fontSize * 1.4;

          // Semi-transparent background for text
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          const textHeight = lineHeight * 3 + padding * 2;
          ctx.fillRect(0, img.height - textHeight, img.width, textHeight);

          // Text style
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `${fontSize}px Arial, sans-serif`;
          ctx.textBaseline = 'top';

          // Line 1: Timestamp
          const line1 = `📅 ${watermarkData.timestamp}`;
          ctx.fillText(line1, padding, img.height - textHeight + padding);

          // Line 2: Location
          const line2 = `📍 ${watermarkData.location}`;
          ctx.fillText(line2, padding, img.height - textHeight + padding + lineHeight);

          // Line 3: GPS Coordinates
          if (watermarkData.gps) {
            const line3 = `🌍 ${watermarkData.gps.latitude.toFixed(6)}, ${watermarkData.gps.longitude.toFixed(6)}`;
            ctx.fillText(line3, padding, img.height - textHeight + padding + lineHeight * 2);
          }

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            file.type,
            0.9 // Quality
          );
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    file: File,
    folder: string = 'inspections'
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);
      formData.append('timestamp', Date.now().toString());

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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
    }
  }

  /**
   * Complete upload flow: Watermark + Upload
   */
  async uploadWithWatermark(
    file: File,
    watermarkData: WatermarkData,
    folder?: string
  ): Promise<string> {
    try {
      // Step 1: Add watermark
      const watermarkedBlob = await this.addWatermarkToImage(file, watermarkData);

      // Convert blob to file
      const watermarkedFile = new File(
        [watermarkedBlob],
        file.name,
        { type: file.type }
      );

      // Step 2: Upload to Cloudinary
      const uploadResult = await this.uploadImage(watermarkedFile, folder);

      // Return secure URL
      return uploadResult.secure_url;
    } catch (error) {
      console.error('Upload with watermark error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images with watermark
   */
  async uploadMultipleWithWatermark(
    files: File[],
    watermarkData: WatermarkData,
    folder?: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await this.uploadWithWatermark(files[i], watermarkData, folder);
        urls.push(url);

        // Report progress
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      } catch (error) {
        console.error(`Failed to upload file ${i + 1}:`, error);
        // Continue with other files
      }
    }

    return urls;
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires signed requests (backend only)
    // This is a placeholder - implement backend endpoint for deletion
    console.warn('Image deletion should be handled by backend');
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();