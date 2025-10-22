// 📁 src/infrastructure/database/repositories/InspectionTemplateRepository.ts
import { supabase } from '@/infrastructure/database/supabase';
import { InspectionTemplate } from '@/core/entities/InspectionTemplate';
import { Json } from '@/core/types/database.types';

export class InspectionTemplateRepository {
  async findAll(): Promise<InspectionTemplate[]> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async findById(id: string): Promise<InspectionTemplate | null> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async findDefault(): Promise<InspectionTemplate | null> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  async create(templateData: {
    name: string;
    description?: string | null;
    fields: Json;
    estimated_time?: number | null;
    created_by?: string | null;
  }): Promise<InspectionTemplate> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: templateData.name,
        description: templateData.description,
        fields: templateData.fields,
        estimated_time: templateData.estimated_time,
        created_by: templateData.created_by,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, templateData: Partial<InspectionTemplate>): Promise<InspectionTemplate> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .update({
        ...templateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('inspection_templates')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;
  }

  async findByLocation(locationId: string): Promise<InspectionTemplate[]> {
    const { data, error } = await supabase
      .from('template_location_assignments')
      .select(
        `
        template:inspection_templates (*)
      `
      )
      .eq('location_id', locationId);

    if (error) throw error;

    return data?.map((item) => item.template) || [];
  }
}
