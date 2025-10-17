// src/infrastructure/storage/CloudinaryPhotoRepository.ts
import { IPhotoRepository, PhotoMetadata } from '@/core/repositories/IPhotoRepository';

export class CloudinaryPhotoRepository implements IPhotoRepository {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  }

  async upload(photoData: string, metadata: PhotoMetadata): Promise<string> {
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
      formData.append('quality', 'auto:good'); // Auto optimize quality
      
      // Add context metadata
      if (metadata.gps) {
        formData.append(
          'context', 
          `lat=${metadata.gps.latitude}|lon=${metadata.gps.longitude}`
        );
      }
      
      // Add tags for easy searching
      formData.append('tags', `toilet,${metadata.locationId},${metadata.userId}`);
      
      // Add timestamp to metadata
      formData.append('context', `timestamp=${metadata.timestamp}`);

      console.log('Uploading to Cloudinary...', {
        size: Math.round(blob.size / 1024) + 'KB',
        format: 'webp'
      });

      // Upload with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Cloudinary error:', errorText);
        throw new Error('Upload gagal: ' + uploadResponse.statusText);
      }

      const data = await uploadResponse.json();
      
      console.log('Upload success:', {
        url: data.secure_url,
        format: data.format,
        size: Math.round(data.bytes / 1024) + 'KB'
      });

      return data.secure_url;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout - koneksi terlalu lambat. Coba lagi.');
        }
        throw new Error(`Gagal upload foto: ${error.message}`);
      }
      throw new Error('Gagal upload foto. Periksa koneksi internet.');
    }
  }

  async delete(photoUrl: string): Promise<void> {
    const publicId = this.extractPublicId(photoUrl);
    
    const response = await fetch('/api/photos/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }
  }

  private async base64ToBlob(base64: string): Promise<Blob> {
    // More efficient than fetch for large images
    const base64Data = base64.split(',')[1];
    const mimeType = base64.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
    
    // Decode base64 to binary
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
// UPDATE handleFinalSubmit function:

const handleFinalSubmit = async (photo: string | null) => {
  if (!user || !assessmentData) return;

  console.log('📝 ============================================');
    console.log('📝 SUBMITTING INSPECTION');
    console.log('📝 User:', user.email);
    console.log('📝 Location:', location.name);
    console.log('📝 ============================================');
    
    setStep('submitting');
    try {
      await createInspection({
        userId: user.id,
        locationId: location.id,
        status: assessmentData.status,
        assessments: assessmentData.assessments,
        overallComment: assessmentData.overallComment,
        photoData: photo || undefined,
        geoData: geoData || undefined
      });
      
      console.log('✅ Submit successful!');
      setStep('success');
    } catch (error: any) {
      console.error('❌ Submit failed!');
      console.error('Error:', error);
      
      // Show detailed error to user
      const errorMsg = error.message || 'Unknown error';
      alert(
        `❌ GAGAL MENYIMPAN!\n\n` +
        `Error: ${errorMsg}\n\n` +
        `Cek console browser (F12) untuk detail lengkap.`
      );
      
      setStep('photo');
    }
};