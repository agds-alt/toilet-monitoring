// src/infrastructure/services/inspection.service.ts
import { supabase } from '@/infrastructure/database/supabase';
import {
  InspectionFormData,
  InspectionRecord,
  InspectionSubmitResponse,
  PhotoMetadata,
} from '@/core/types/inspection.types';
import { calculateOverallStatus } from '@/lib/utils/rating.utils';
import { 
  responsesToJson, 
  dbToInspectionRecord 
} from '@/lib/utils/type-helpers';

export class InspectionService {
  async submitInspection(
    data: InspectionFormData,
    photos: PhotoMetadata[]
  ): Promise<InspectionSubmitResponse> {
    try {
      console.log('📤 Submitting inspection...');

      const { data: inspection, error: inspectionError } = await supabase
        .from('inspection_records')
        .insert({
          template_id: data.template_id,
          location_id: data.location_id,
          user_id: data.user_id,
          inspection_date: data.inspection_date,
          inspection_time: data.inspection_time,
          overall_status: data.overall_status,
          responses: responsesToJson(data.responses),
          photo_urls: data.photo_urls,
          notes: data.notes || null,
          duration_seconds: data.duration_seconds,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (inspectionError) throw inspectionError;

      console.log('✅ Inspection record created:', inspection.id);

      if (photos.length > 0) {
        const photoRecords = photos.map((photo) => ({
          inspection_id: inspection.id,
          location_id: data.location_id,
          file_url: photo.file_url,
          file_name: photo.file_name,
          file_size: photo.file_size,
          mime_type: photo.mime_type,
          width: photo.width,
          height: photo.height,
          field_reference: photo.field_reference,
          caption: photo.caption || null,
          uploaded_by: data.user_id,
          uploaded_at: photo.uploaded_at || new Date().toISOString(),
          cloudinary_public_id: photo.cloudinary_public_id,
        }));

        const { error: photosError } = await supabase
          .from('photos')
          .insert(photoRecords);

        if (photosError) {
          console.error('⚠️ Photos insert error:', photosError);
        } else {
          console.log('✅ Photo metadata saved:', photoRecords.length);
        }
      }

      return {
        success: true,
        data: dbToInspectionRecord(inspection),
        message: 'Inspeksi berhasil dikirim! 🎉',
      };
    } catch (error: any) {
      console.error('❌ Submit inspection error:', error);
      return {
        success: false,
        error: error.message || 'Gagal mengirim inspeksi',
      };
    }
  }

  async getInspectionById(id: string): Promise<InspectionRecord | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return dbToInspectionRecord(data);
    } catch (error) {
      console.error('❌ Get inspection error:', error);
      return null;
    }
  }

  async getInspectionsByLocation(locationId: string, limit: number = 10): Promise<InspectionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('location_id', locationId)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data?.map(dbToInspectionRecord) || [];
    } catch (error) {
      console.error('❌ Get inspections by location error:', error);
      return [];
    }
  }
}

export const inspectionService = new InspectionService();
