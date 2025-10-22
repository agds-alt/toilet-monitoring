// Domain Service: PhotoService
import { PhotoEntity } from '../entities/Photo';

export interface WatermarkOptions {
  locationName: string;
  date: Date;
  time: string;
  user: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  opacity?: number;
}

export class PhotoService {
  static generateFileName(locationName: string, fieldReference?: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cleanLocationName = locationName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const fieldSuffix = fieldReference ? `-${fieldReference}` : '';
    return `toilet-${cleanLocationName}${fieldSuffix}-${timestamp}.jpg`;
  }

  static generateWatermarkText(options: WatermarkOptions): string {
    const dateStr = options.date.toLocaleDateString('id-ID');
    const timeStr = options.time;
    return `${options.locationName} | ${dateStr} ${timeStr} | ${options.user}`;
  }

  static validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
    }

    return { isValid: true };
  }

  static compressImage(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920px width)
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static addWatermarkToCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options: WatermarkOptions
  ): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = Math.max(12, canvas.width / 50);
    const padding = 10;
    const opacity = options.opacity || 0.7;

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 2;

    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize + 4;

    let x: number, y: number;

    switch (options.position || 'bottom-right') {
      case 'bottom-right':
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'top-right':
        x = canvas.width - textWidth - padding;
        y = textHeight + padding;
        break;
      case 'top-left':
        x = padding;
        y = textHeight + padding;
        break;
      default:
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding;
    }

    // Draw text with stroke for better visibility
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }
}
