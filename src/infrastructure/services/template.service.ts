// src/infrastructure/services/template.service.ts
import { supabase } from '@/infrastructure/database/supabase';
import { InspectionTemplate } from '@/domain/services/InspectionService';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';
import { componentsToJson, dbToInspectionTemplate } from '@/lib/utils/type-helpers';

export class TemplateService {
  async getActiveTemplates(): Promise<InspectionTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return (data?.map(dbToInspectionTemplate) || []) as any;
    } catch (error) {
      console.error('❌ Get active templates error:', error);
      return [];
    }
  }

  async getDefaultTemplate(): Promise<InspectionTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) {
        const templates = await this.getActiveTemplates();
        return templates[0] || null;
      }

      return dbToInspectionTemplate(data) as any;
    } catch (error) {
      console.error('❌ Get default template error:', error);
      return null;
    }
  }

  async getTemplateById(id: string): Promise<InspectionTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return dbToInspectionTemplate(data) as any;
    } catch (error) {
      console.error('❌ Get template by ID error:', error);
      return null;
    }
  }

  async createTemplate(
    template: Omit<InspectionTemplate, 'id' | 'created_at' | 'updated_at'>
  ): Promise<InspectionTemplate | null> {
    try {
      const templateData = template as any;
      const { data, error } = await supabase
        .from('inspection_templates')
        .insert({
          name: templateData.name,
          description: templateData.description || null,
          estimated_time: templateData.estimatedTime || null,
          is_active: templateData.is_active ?? true,
          is_default: templateData.is_default ?? false,
          fields: componentsToJson(templateData.fields.components || template.fields),
          created_by: templateData.created_by || null,
        })
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Template created:', data.id);
      return dbToInspectionTemplate(data) as any;
    } catch (error) {
      console.error('❌ Create template error:', error);
      return null;
    }
  }

  async updateTemplate(id: string, updates: Partial<InspectionTemplate>): Promise<boolean> {
    try {
      const updateData: any = { ...updates, updated_at: new Date().toISOString() };

      if (updates.fields) {
        updateData.fields = componentsToJson(updates.fields as any);
      }

      const { error } = await supabase.from('inspection_templates').update(updateData).eq('id', id);

      if (error) throw error;
      console.log('✅ Template updated:', id);
      return true;
    } catch (error) {
      console.error('❌ Update template error:', error);
      return false;
    }
  }

  async createDefaultToiletTemplate(createdBy?: string): Promise<InspectionTemplate | null> {
    return this.createTemplate({
      name: 'Standard Toilet Inspection',
      description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen',
      estimated_time: 10,
      is_active: true,
      is_default: true,
      fields: DEFAULT_TOILET_COMPONENTS as any,
      created_by: createdBy,
    } as any);
  }
}

export const templateService = new TemplateService();
