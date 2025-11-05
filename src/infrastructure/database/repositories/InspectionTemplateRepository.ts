// 📁 src/infrastructure/database/repositories/InspectionTemplateRepository.ts
import { supabase } from '@/infrastructure/database/supabase';
import { InspectionTemplate } from '@/domain/services/InspectionService';
import { Json } from '@/core/types/supabase.types';

// Mapper to convert database format to domain format
function mapToTemplate(dbRecord: any): InspectionTemplate {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    fields: dbRecord.fields as any,
    estimatedTime: dbRecord.estimated_time || 0,
  };
}

export class InspectionTemplateRepository {
  async findAll(): Promise<InspectionTemplate[]> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data ? data.map(mapToTemplate) : [];
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

    return data ? mapToTemplate(data) : null;
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

    return data ? mapToTemplate(data) : null;
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
    return mapToTemplate(data);
  }

  async update(id: string, templateData: Partial<InspectionTemplate>): Promise<InspectionTemplate> {
    // Convert camelCase to snake_case for database
    const dbData: any = {};
    if (templateData.name) dbData.name = templateData.name;
    if (templateData.estimatedTime !== undefined) dbData.estimated_time = templateData.estimatedTime;
    if (templateData.fields) dbData.fields = templateData.fields;

    const { data, error } = await supabase
      .from('inspection_templates')
      .update({
        ...dbData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapToTemplate(data);
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
    // First, get template IDs for this location
    const assignmentQuery = await (supabase as any)
      .from('template_location_assignments')
      .select('template_id')
      .eq('location_id', locationId);

    const { data: assignments, error: assignmentError } = assignmentQuery;

    if (assignmentError) throw assignmentError;
    if (!assignments || assignments.length === 0) return [];

    // Then get the templates
    const templateIds = assignments.map((a: any) => a.template_id);
    const templateQuery = await (supabase as any)
      .from('inspection_templates')
      .select('*')
      .in('id', templateIds);

    const { data: templates, error: templatesError } = templateQuery;

    if (templatesError) throw templatesError;

    return templates?.map(mapToTemplate) || [];
  }
}
