// src/core/use-cases/UploadPhoto.ts
import { IPhotoRepository } from '@/core/repositories/IPhotoRepository';

export interface UploadPhotoDTO {
  photoData: string; // base64
  metadata: {
    locationId: string;
    userId: string;
    timestamp: string;
    gps?: {
      latitude: number;
      longitude: number;
    };
  };
}

export class UploadPhotoUseCase {
  constructor(private photoRepository: IPhotoRepository) {}

  async execute(dto: UploadPhotoDTO): Promise<string> {
    // Validate photo data
    if (!dto.photoData) {
      throw new Error('Photo data is required');
    }

    if (!dto.photoData.startsWith('data:image/')) {
      throw new Error('Invalid photo format');
    }

    // Upload photo
    const photoUrl = await this.photoRepository.upload(dto.photoData, dto.metadata);

    return photoUrl;
  }
}
