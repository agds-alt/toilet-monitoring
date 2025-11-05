// Minimal IPhotoRepository interface
export interface PhotoMetadata {
  locationId?: string;
  inspectionId?: string;
  uploadedBy: string;
  userId?: string;
  timestamp?: number;
  gps?: {
    latitude: number;
    longitude: number;
  };
  deviceInfo?: any;
}

export interface IPhotoRepository {
  uploadPhoto(file: File | Blob, metadata: PhotoMetadata): Promise<string>;
  deletePhoto(publicId: string): Promise<void>;
}
