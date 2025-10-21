// Dari: src/infrastructure/storage/CloudinaryPhotoRepository.ts
import { IPhotoRepository, PhotoMetadata } from '@/core/repositories/IPhotoRepository';

export class CloudinaryPhotoRepository implements IPhotoRepository {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  }

  async upload(photoData: string, metadata: PhotoMetadata): Promise<string> {
    return this.uploadWithRetry(photoData, metadata);
  }

  private async uploadWithRetry(
    photoData: string,
    metadata: PhotoMetadata,
    maxRetries = 3
  ): Promise<string> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📤 Upload attempt ${attempt}/${maxRetries}...`);
        return await this.uploadSingle(photoData, metadata);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          console.log(`⏳ Upload attempt ${attempt} failed, retrying in ${attempt}s...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw lastError!;
  }

  private async uploadSingle(photoData: string, metadata: PhotoMetadata): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();

      // Convert base64 to blob efficiently
      const blob = await this.base64ToBlob(photoData);
      formData.append('file', blob);
      formData.append('upload_preset', this.uploadPreset);

      // Custom filename with timestamp
      const filename = `toilet_${metadata.locationId}_${Date.now()}`;
      formData.append('public_id', filename);

      // Optimize: Use webp format for smaller size
      formData.append('format', 'webp');
      formData.append('quality', 'auto:good');

      // Combine all context metadata
      let context = `timestamp=${metadata.timestamp}`;
      if (metadata.gps) {
        context += `|lat=${metadata.gps.latitude}|lon=${metadata.gps.longitude}`;
      }
      formData.append('context', context);

      // Add tags for easy searching
      formData.append('tags', `toilet,${metadata.locationId},${metadata.userId}`);

      console.log('📤 Uploading to Cloudinary...', {
        size: Math.round(blob.size / 1024) + 'KB',
        format: 'webp',
        attempt: 'single',
      });

      // Upload with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('❌ Cloudinary error:', errorText);
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const data = await uploadResponse.json();

      console.log('✅ Upload success:', {
        url: data.secure_url,
        format: data.format,
        size: Math.round(data.bytes / 1024) + 'KB',
      });

      return data.secure_url;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout - connection too slow. Please try again.');
        }
        throw new Error(`Photo upload failed: ${error.message}`);
      }
      throw new Error('Photo upload failed. Check internet connection.');
    }
  }

  async delete(photoUrl: string): Promise<void> {
    const publicId = this.extractPublicId(photoUrl);

    const response = await fetch('/api/photos/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
  }

  private async base64ToBlob(base64: string): Promise<Blob> {
    const base64Data = base64.split(',')[1];
    const mimeType = base64.match(/data:([^;]+)/)?.[1] || 'image/jpeg';

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }

  private extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }
}
