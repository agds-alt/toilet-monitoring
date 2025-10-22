// src/lib/cloudinary.ts
// ============================================
// CLOUDINARY CONFIGURATION (Server-side)
// ============================================

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (for server-side operations)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export { cloudinary };

// ============================================
// CLIENT-SIDE CONFIG (for unsigned uploads)
// ============================================

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  apiUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCloudinaryUrl(publicId: string, transformations?: string): string {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`;
}

export function getThumbnailUrl(
  publicId: string,
  width: number = 200,
  height: number = 200
): string {
  return getCloudinaryUrl(publicId, `w_${width},h_${height},c_fill,q_auto,f_auto`);
}
