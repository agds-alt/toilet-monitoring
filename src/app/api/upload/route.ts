// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from '@/lib/utils/cloudinary.client';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'inspections';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('📤 Uploading to Cloudinary...', {
      folder,
      originalName: file.name,
      size: file.size,
      type: file.type,
    });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64String,
        {
          folder: `toilet-monitoring/${folder}`,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' }, // Optimize quality
            { fetch_format: 'auto' }, // Auto format (webp jika supported)
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    console.log('✅ Upload successful:', {
      public_id: (result as any).public_id,
      url: (result as any).secure_url,
      format: (result as any).format,
    });

    return NextResponse.json({
      success: true,
      data: {
        public_id: (result as any).public_id,
        url: (result as any).secure_url,
        format: (result as any).format,
        bytes: (result as any).bytes,
        width: (result as any).width,
        height: (result as any).height,
      },
    });
  } catch (error: any) {
    console.error('❌ Cloudinary upload error:', error);
    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
