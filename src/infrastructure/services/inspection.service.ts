// src/infrastructure/services/inspection.service.ts
import { supabase } from '../database/supabase';
import { CreateInspectionDTO, InspectionRecord } from '@/core/types/inspection.types';

export const inspectionService = {
  async create(dto: CreateInspectionDTO): Promise<InspectionRecord> {
    const { data, error } = await supabase
      .from('inspection_records')
      .insert({
        template_id: dto.template_id,
        location_id: dto.location_id,
        user_id: dto.user_id,
        inspection_date: dto.inspection_date,
        inspection_time: dto.inspection_time,
        overall_status: dto.overall_status,
        responses: dto.responses as any,
        photo_urls: dto.photo_urls,
        notes: dto.notes,
        duration_seconds: dto.duration_seconds,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<InspectionRecord | null> {
    const { data, error } = await supabase
      .from('inspection_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  // Alias for backward compatibility
  async getInspectionById(id: string): Promise<InspectionRecord | null> {
    return this.getById(id);
  },
};

export const typedInspectionService = inspectionService;
