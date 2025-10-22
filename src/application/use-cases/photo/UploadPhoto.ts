// Use Case: UploadPhoto
import { PhotoEntity } from '../../../domain/entities/Photo';
import { IPhotoService } from '../../interfaces/services/IPhotoService';
import { PhotoService } from '../../../domain/services/PhotoService';

export interface UploadPhotoRequest {
  file: File;
  locationId?: string;
  inspectionId?: string;
  fieldReference?: string;
  uploadedBy: string;
  caption?: string;
  addWatermark?: boolean;
  watermarkOptions?: {
    locationName: string;
    date: Date;
    time: string;
    user: string;
  };
}

export interface UploadPhotoResponse {
  photo: PhotoEntity;
}

export class UploadPhoto {
  constructor(private photoService: IPhotoService) {}

  async execute(request: UploadPhotoRequest): Promise<UploadPhotoResponse> {
    // Validate file
    const validation = PhotoService.validateFile(request.file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Compress image if needed
    let fileToUpload = request.file;
    if (request.file.size > 2 * 1024 * 1024) { // If larger than 2MB
      fileToUpload = await PhotoService.compressImage(request.file, 0.8);
    }

    // Generate filename
    const fileName = PhotoService.generateFileName(
      request.watermarkOptions?.locationName || 'toilet',
      request.fieldReference
    );

    // Upload photo
    const photo = await this.photoService.uploadPhoto(fileToUpload, {
      locationId: request.locationId,
      inspectionId: request.inspectionId,
      fieldReference: request.fieldReference,
      uploadedBy: request.uploadedBy,
      caption: request.caption
    });

    // Add watermark if requested
    if (request.addWatermark && request.watermarkOptions) {
      const watermarkText = PhotoService.generateWatermarkText(request.watermarkOptions);
      await this.photoService.addWatermark(photo.fileUrl, watermarkText);
    }

    return {
      photo
    };
  }
}
