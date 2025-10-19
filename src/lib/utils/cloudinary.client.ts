// lib/utils/cloudinary.client.ts
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = 'toilet-monitoring_unsigned'; // Sesuai preset yang kamu buat

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  faces?: number[][];
  colors?: string[];
  phash?: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult | null> => {
  // Validasi environment variables
  if (!CLOUDINARY_CLOUD_NAME) {
    console.error('❌ CLOUDINARY_CLOUD_NAME is not defined');
    throw new Error('Cloudinary configuration error');
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    console.error('❌ CLOUDINARY_UPLOAD_PRESET is not defined');
    throw new Error('Cloudinary upload preset is not configured');
  }

  try {
    console.log('📤 Starting Cloudinary upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET
    });

    // Create form data untuk unsigned upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // Optional: Tambahkan tags untuk organisasi
    formData.append('tags', 'toilet_monitoring,inspection');
    
    // Optional: Tambahkan context untuk metadata
    formData.append('context', `filename=${file.name}|uploaded_from=web_app`);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    console.log('🔄 Uploading to:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result: CloudinaryUploadResult = await response.json();
    
    console.log('✅ Cloudinary upload successful:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      faces: result.faces,
      colors: result.colors
    });

    return result;

  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// Utility function untuk generate Cloudinary URL dengan transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations: string[] = []
): string => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not defined');
  }

  const transformationString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
};

// Utility function untuk delete image (jika diperlukan)
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  // Note: Untuk unsigned upload, delete biasanya membutuhkan authentication
  // Jadi kita skip dulu atau implement later dengan server-side API
  console.warn('Delete functionality requires server-side implementation');
  return false;
};

// Utility function untuk check jika file adalah image
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please select JPEG, PNG, or WebP image.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 10MB.');
  }

  return true;
};