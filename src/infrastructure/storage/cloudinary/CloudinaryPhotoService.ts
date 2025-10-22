// Infrastructure: CloudinaryPhotoService
import { PhotoEntity } from '../../../domain/entities/Photo';
import { IPhotoService } from '../../../application/interfaces/services/IPhotoService';
import { PhotoService } from '../../../domain/services/PhotoService';

export class CloudinaryPhotoService implements IPhotoService {
  private cloudinaryUrl: string;
  private uploadPreset: string;

  constructor() {
    this.cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL!;
    this.uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  }

  async uploadPhoto(file: File, options: {
    locationId?: string;
    inspectionId?: string;
    fieldReference?: string;
    uploadedBy: string;
    caption?: string;
  }): Promise<PhotoEntity> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    
    // Add folder structure
    const folder = options.inspectionId 
      ? `toilet-inspections/${options.inspectionId}`
      : options.locationId 
        ? `toilet-locations/${options.locationId}`
        : 'toilet-photos';
    
    formData.append('folder', folder);

    // Add metadata
    const metadata = {
      locationId: options.locationId || '',
      inspectionId: options.inspectionId || '',
      fieldReference: options.fieldReference || '',
      uploadedBy: options.uploadedBy,
      caption: options.caption || ''
    };
    formData.append('context', JSON.stringify(metadata));

    try {
      const response = await fetch(this.cloudinaryUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      return PhotoEntity.create({
        fileUrl: result.secure_url,
        fileName: result.original_filename,
        fileSize: result.bytes,
        mimeType: result.format,
        caption: options.caption,
        fieldReference: options.fieldReference,
        locationId: options.locationId,
        inspectionId: options.inspectionId,
        uploadedBy: options.uploadedBy
      });
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deletePhoto(photoId: string, deletedBy: string): Promise<void> {
    // In a real implementation, you would delete from Cloudinary
    // and update the database record
    console.log(`Deleting photo ${photoId} by ${deletedBy}`);
  }

  async getPhotoById(photoId: string): Promise<PhotoEntity | null> {
    // This would typically fetch from database
    // For now, return null as this is handled by repository
    return null;
  }

  async getPhotosByInspection(inspectionId: string): Promise<PhotoEntity[]> {
    // This would typically fetch from database
    // For now, return empty array as this is handled by repository
    return [];
  }

  async getPhotosByLocation(locationId: string): Promise<PhotoEntity[]> {
    // This would typically fetch from database
    // For now, return empty array as this is handled by repository
    return [];
  }

  async addWatermark(photoUrl: string, watermarkText: string): Promise<string> {
    // Cloudinary transformation to add watermark
    const baseUrl = photoUrl.split('/upload/')[0];
    const publicId = photoUrl.split('/upload/')[1];
    
    const watermarkUrl = `${baseUrl}/upload/w_auto,h_auto,c_fit,l_text:Arial_20_bold:${encodeURIComponent(watermarkText)},g_south_east,x_10,y_10,co_white,bo_2px_solid_black/${publicId}`;
    
    return watermarkUrl;
  }
}
