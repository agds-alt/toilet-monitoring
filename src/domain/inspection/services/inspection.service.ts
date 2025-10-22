// src/domain/inspection/services/inspection.service.ts
// ============================================
// INSPECTION SERVICE - Business Logic Layer
// ============================================

import { createClient } from '@/lib/supabase/cleint';
import {
  CreateInspectionDTO,
  InspectionRecord,
  InspectionTemplate,
  Location,
} from '@/core/types/inspection.types';
import {
  validateInspectionForm,
  calculateOverallStatus,
} from '@/domain/inspection/utils/validation';

export class InspectionService {
  private supabase = createClient();

  // ============================================
  // TEMPLATE OPERATIONS
  // ============================================

  /**
   * Get active templates
   */
  async getActiveTemplates(): Promise<InspectionTemplate[]> {
    const { data, error } = await this.supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch templates: ${error.message}`);
    return data || [];
  }

  /**
   * Get default template
   */
  async getDefaultTemplate(): Promise<InspectionTemplate | null> {
    const { data, error } = await this.supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch default template: ${error.message}`);
    }

    return data;
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<InspectionTemplate | null> {
    const { data, error } = await this.supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return data;
  }

  // ============================================
  // LOCATION OPERATIONS
  // ============================================

  /**
   * Get active locations
   */
  async getActiveLocations(): Promise<Location[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to fetch locations: ${error.message}`);
    return data || [];
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await this.supabase.from('locations').select('*').eq('id', id).single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch location: ${error.message}`);
    }

    return data;
  }

  /**
   * Get location by QR code
   */
  async getLocationByQR(qrCode: string): Promise<Location | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select('*')
      .eq('qr_code', qrCode)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch location by QR: ${error.message}`);
    }

    return data;
  }

  // ============================================
  // INSPECTION OPERATIONS
  // ============================================

  /**
   * Create new inspection
   */
  async createInspection(dto: CreateInspectionDTO): Promise<InspectionRecord> {
    // Get template for validation
    const template = await this.getTemplateById(dto.template_id);
    if (!template) {
      throw new Error('Template not found');
    }

    // Extract required components
    const components = (template.fields as any)?.components || [];
    const requiredComponents = components.filter((c: any) => c.required).map((c: any) => c.id);

    // Validate
    const validation = validateInspectionForm(dto, requiredComponents);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map((e) => e.message).join(', ')}`);
    }

    // Calculate overall status if not provided
    const overallStatus = dto.overall_status || calculateOverallStatus(dto.responses);

    // Prepare insert data
    const insertData = {
      template_id: dto.template_id,
      location_id: dto.location_id,
      user_id: dto.user_id,
      inspection_date: dto.inspection_date,
      inspection_time: dto.inspection_time,
      overall_status: overallStatus,
      responses: dto.responses as any,
      photo_urls: dto.photo_urls,
      notes: dto.notes,
      duration_seconds: dto.duration_seconds,
      geolocation: dto.geolocation as any,
    };

    // Insert to database
    const { data, error } = await this.supabase
      .from('inspection_records')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create inspection: ${error.message}`);
    }

    return data;
  }

  /**
   * Get inspections by user
   */
  async getInspectionsByUser(userId: string, limit = 50): Promise<InspectionRecord[]> {
    const { data, error } = await this.supabase
      .from('inspection_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch inspections: ${error.message}`);
    return data || [];
  }

  /**
   * Get inspections by location
   */
  async getInspectionsByLocation(locationId: string, limit = 50): Promise<InspectionRecord[]> {
    const { data, error } = await this.supabase
      .from('inspection_records')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch inspections: ${error.message}`);
    return data || [];
  }

  /**
   * Get inspection statistics
   */
  async getInspectionStats(locationId?: string) {
    let query = this.supabase.from('inspection_records').select('overall_status');

    if (locationId) {
      query = query.eq('location_id', locationId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch stats: ${error.message}`);

    const stats = {
      total: data?.length || 0,
      clean: data?.filter((i) => i.overall_status === 'clean').length || 0,
      needs_work: data?.filter((i) => i.overall_status === 'needs_work').length || 0,
      dirty: data?.filter((i) => i.overall_status === 'dirty').length || 0,
    };

    return {
      ...stats,
      cleanPercentage: stats.total ? (stats.clean / stats.total) * 100 : 0,
    };
  }

  // ============================================
  // PHOTO OPERATIONS
  // ============================================

  /**
   * Upload photo to storage
   */
  async uploadPhoto(file: File, inspectionId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${inspectionId}/${Date.now()}.${fileExt}`;
    const filePath = `inspection-photos/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from('inspections')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data } = this.supabase.storage.from('inspections').getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Upload multiple photos
   */
  async uploadPhotos(files: File[], inspectionId: string): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadPhoto(file, inspectionId));
    return Promise.all(uploadPromises);
  }
}

// Export singleton instance
export const inspectionService = new InspectionService();
