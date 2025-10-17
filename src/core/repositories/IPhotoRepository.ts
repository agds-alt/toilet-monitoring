// src/core/repositories/IPhotoRepository.ts
export interface PhotoMetadata {
  locationId: string;
  userId: string;
  timestamp: string;
  gps?: {
    latitude: number;
    longitude: number;
  };
}

export interface IPhotoRepository {
  upload(photoData: string, metadata: PhotoMetadata): Promise<string>;
  delete(photoUrl: string): Promise<void>;
}
