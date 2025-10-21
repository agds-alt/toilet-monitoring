// src/infrastructure/services/inspection.service.ts
// ============================================
// INSPECTION SUPABASE SERVICE
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import {
  InspectionFormData,
  InspectionRecord,
  InspectionSubmitResponse,
  PhotoMetadata,
} from '@/core/types/inspection.types';
import { calculateOverallStatus } from '@/lib/utils/rating.utils';

// ============================================
// INSPECTION SERVICE CLASS
// ============================================

export class InspectionService {
  // ============================================
  // SUBMIT INSPECTION
  // ============================================

  async submitInspection(
    data: InspectionFormData,
    photos: PhotoMetadata[]
  ): Promise<InspectionSubmitResponse> {
    try {
      console.log('📤 Submitting inspection...', {
        template_id: data.template_id,
        location_id: data.location_id,
        responses: Object.keys(data.responses).length,
        photos: photos.length,
      });

      // 1. Insert inspection record
      const { data: inspection, error: inspectionError } = await supabase
        .from('inspection_records')
        .insert({
          template_id: data.template_id,
          location_id: data.location_id,
          user_id: data.user_id,
          inspection_date: data.inspection_date,
          inspection_time: data.inspection_time,
          overall_status: data.overall_status,
          responses: data.responses,
          photo_urls: data.photo_urls,
          notes: data.notes || null,
          duration_seconds: data.duration_seconds,
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (inspectionError) {
        console.error('❌ Inspection insert error:', inspectionError);
        throw new Error(inspectionError.message);
      }

      console.log('✅ Inspection record created:', inspection.id);

      // 2. Insert photo metadata (if any)
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
          // Don't fail the whole submission for photo errors
        } else {
          console.log('✅ Photo metadata saved:', photoRecords.length);
        }
      }

      return {
        success: true,
        data: inspection as InspectionRecord,
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

  // ============================================
  // GET INSPECTION BY ID
  // ============================================

  async getInspectionById(id: string): Promise<InspectionRecord | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as InspectionRecord;
    } catch (error) {
      console.error('❌ Get inspection error:', error);
      return null;
    }
  }

  // ============================================
  // GET INSPECTIONS BY LOCATION
  // ============================================

  async getInspectionsByLocation(
    locationId: string,
    limit: number = 10
  ): Promise<InspectionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('location_id', locationId)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as InspectionRecord[]) || [];
    } catch (error) {
      console.error('❌ Get inspections by location error:', error);
      return [];
    }
  }

  // ============================================
  // GET INSPECTIONS BY USER
  // ============================================

  async getInspectionsByUser(
    userId: string,
    limit: number = 10
  ): Promise<InspectionRecord[]> {
    try {
      const { data, error } = await supabase
        .from('inspection_records')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data as InspectionRecord[]) || [];
    } catch (error) {
      console.error('❌ Get inspections by user error:', error);
      return [];
    }
  }

  // ============================================
  // GET INSPECTION PHOTOS
  // ============================================

  async getInspectionPhotos(inspectionId: string): Promise<PhotoMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('inspection_id', inspectionId)
        .eq('is_deleted', false)
        .order('uploaded_at', { ascending: true });

      if (error) throw error;

      return (data as PhotoMetadata[]) || [];
    } catch (error) {
      console.error('❌ Get inspection photos error:', error);
      return [];
    }
  }

  // ============================================
  // VERIFY INSPECTION
  // ============================================

  async verifyInspection(
    inspectionId: string,
    verifiedBy: string,
    verificationNotes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inspection_records')
        .update({
          verified_by: verifiedBy,
          verified_at: new Date().toISOString(),
          verification_notes: verificationNotes || null,
        })
        .eq('id', inspectionId);

      if (error) throw error;

      console.log('✅ Inspection verified:', inspectionId);
      return true;
    } catch (error) {
      console.error('❌ Verify inspection error:', error);
      return false;
    }
  }

  // ============================================
  // DELETE INSPECTION (soft delete - update status)
  // ============================================

  async deleteInspection(inspectionId: string): Promise<boolean> {
    try {
      // Soft delete by updating a flag or status
      // For now, we'll just mark photos as deleted
      const { error } = await supabase
        .from('photos')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('inspection_id', inspectionId);

      if (error) throw error;

      console.log('✅ Inspection deleted (soft):', inspectionId);
      return true;
    } catch (error) {
      console.error('❌ Delete inspection error:', error);
      return false;
    }
  }

  // ============================================
  // GET INSPECTION STATISTICS
  // ============================================

  async getInspectionStats(locationId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    avgRating: number;
  }> {
    try {
      let query = supabase.from('inspection_records').select('*');

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const records = (data as InspectionRecord[]) || [];

      // Calculate statistics
      const byStatus: Record<string, number> = {};
      let totalRating = 0;

      records.forEach((record) => {
        byStatus[record.overall_status] = (byStatus[record.overall_status] || 0) + 1;
        
        // Calculate average rating from responses
        const ratings = Object.values(record.responses).map((r) => r.rating);
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        totalRating += avg;
      });

      return {
        total: records.length,
        byStatus,
        avgRating: records.length > 0 ? totalRating / records.length : 0,
      };
    } catch (error) {
      console.error('❌ Get inspection stats error:', error);
      return {
        total: 0,
        byStatus: {},
        avgRating: 0,
      };
    }
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const inspectionService = new InspectionService();