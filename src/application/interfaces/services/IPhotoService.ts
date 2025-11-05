// Service Interface: IPhotoService
import { PhotoEntity } from '../../../domain/entities/Photo';

export interface IPhotoService {
  uploadPhoto(file: File | Blob, options: {
    locationId?: string;
    inspectionId?: string;
    fieldReference?: string;
    uploadedBy: string;
    caption?: string;
  }): Promise<PhotoEntity>;
  
  deletePhoto(photoId: string, deletedBy: string): Promise<void>;
  
  getPhotoById(photoId: string): Promise<PhotoEntity | null>;
  
  getPhotosByInspection(inspectionId: string): Promise<PhotoEntity[]>;
  
  getPhotosByLocation(locationId: string): Promise<PhotoEntity[]>;
  
  addWatermark(photoUrl: string, watermarkText: string): Promise<string>;
}
