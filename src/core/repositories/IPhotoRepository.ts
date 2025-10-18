// src/core/repositories/IPhotoRepository.ts

export interface GPSData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface PhotoMetadata {
  userId: string;
  locationId: string;
  timestamp: string;
  gps?: GPSData;
  deviceInfo?: string;
}

export interface IPhotoRepository {
  /**
   * Upload photo to cloud storage
   * @param photoData Base64 encoded image data
   * @param metadata Photo metadata including GPS and user info
   * @returns Promise resolving to photo URL
   */
  upload(photoData: string, metadata: PhotoMetadata): Promise<string>;

  /**
   * Delete photo from cloud storage
   * @param photoUrl URL of the photo to delete
   */
  delete(photoUrl: string): Promise<void>;
}