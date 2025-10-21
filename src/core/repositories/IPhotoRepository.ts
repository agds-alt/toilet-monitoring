// 📁 src/core/repositories/IPhotoRepository.ts
// import { Photo } from '@/core/entities/Photo';

export interface IPhotoRepository {
  upload(photoData: {
    file_url: string;
    file_name?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    caption?: string | null;
    inspection_id?: string | null;
    location_id?: string | null;
    uploaded_by?: string | null;
    field_reference?: string | null;
  }): Promise<Photo>;
  
  findByInspection(inspectionId: string): Promise<Photo[]>;
  findByLocation(locationId: string): Promise<Photo[]>;
  delete(id: string, deletedBy: string): Promise<void>;
}