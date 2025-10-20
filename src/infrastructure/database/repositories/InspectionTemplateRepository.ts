// src/infrastructure/repositories/InspectionTemplateRepository.ts
import { supabase } from '../database/supabase';
import { InspectionTemplate } from '@/core/entities/InspectionTemplate';

export class InspectionTemplateRepository {
  async getAll(activeOnly: boolean = true): Promise<InspectionTemplate[]> {
    let query = supabase
      .from('inspection_templates')
      .select('*');
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(this.mapToEntity);
  }

  async getById(id: string): Promise<InspectionTemplate | null> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(template: Omit<InspectionTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<InspectionTemplate> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: template.name,
        description: template.description || null,
        estimated_time: template.estimatedTime || null,
        is_active: template.isActive,
        is_default: template.isDefault,
        fields: template.fields as any,
        created_by: template.createdBy || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async update(id: string, updates: Partial<InspectionTemplate>): Promise<InspectionTemplate> {
    const { data, error } = await supabase
      .from('inspection_templates')
      .update({
        name: updates.name,
        description: updates.description,
        estimated_time: updates.estimatedTime,
        is_active: updates.isActive,
        is_default: updates.isDefault,
        fields: updates.fields as any,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('inspection_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async assignToLocation(templateId: string, locationId: string, assignedBy: string): Promise<void> {
    const { error } = await supabase
      .from('template_location_assignments')
      .insert({
        template_id: templateId,
        location_id: locationId,
        assigned_by: assignedBy,
      });
    
    if (error) throw error;
  }

  async assignToRole(templateId: string, roleId: string, assignedBy: string): Promise<void> {
    const { error } = await supabase
      .from('template_role_assignments')
      .insert({
        template_id: templateId,
        role_id: roleId,
        assigned_by: assignedBy,
      });
    
    if (error) throw error;
  }

  private mapToEntity(data: any): InspectionTemplate {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      estimatedTime: data.estimated_time,
      isActive: data.is_active,
      isDefault: data.is_default,
      fields: data.fields,
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}