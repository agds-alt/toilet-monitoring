// src/infrastructure/services/template.service.ts
// ============================================
// TEMPLATE SERVICE
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import { InspectionTemplate } from '@/core/types/inspection.types';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

// ============================================
// TEMPLATE SERVICE CLASS
// ============================================

export class TemplateService {
  // ============================================
  // GET ACTIVE TEMPLATES
  // ============================================

  async getActiveTemplates(): Promise<InspectionTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;

      return (data as InspectionTemplate[]) || [];
    } catch (error) {
      console.error('❌ Get active templates error:', error);
      return [];
    }
  }

  // ============================================
  // GET DEFAULT TEMPLATE
  // ============================================

  async getDefaultTemplate(): Promise<InspectionTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (error) {
        // If no default template, return first active template
        const templates = await this.getActiveTemplates();
        return templates[0] || null;
      }

      return data as InspectionTemplate;
    } catch (error) {
      console.error('❌ Get default template error:', error);
      return null;
    }
  }

  // ============================================
  // GET TEMPLATE BY ID
  // ============================================

  async getTemplateById(id: string): Promise<InspectionTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data as InspectionTemplate;
    } catch (error) {
      console.error('❌ Get template by ID error:', error);
      return null;
    }
  }

  // ============================================
  // CREATE TEMPLATE
  // ============================================

  async createTemplate(
    template: Omit<InspectionTemplate, 'id' | 'created_at' | 'updated_at'>
  ): Promise<InspectionTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('inspection_templates')
        .insert({
          name: template.name,
          description: template.description || null,
          estimated_time: template.estimated_time || null,
          is_active: template.is_active,
          is_default: template.is_default,
          fields: template.fields,
          created_by: template.created_by || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Template created:', data.id);
      return data as InspectionTemplate;
    } catch (error) {
      console.error('❌ Create template error:', error);
      return null;
    }
  }

  // ============================================
  // UPDATE TEMPLATE
  // ============================================

  async updateTemplate(
    id: string,
    updates: Partial<InspectionTemplate>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inspection_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Template updated:', id);
      return true;
    } catch (error) {
      console.error('❌ Update template error:', error);
      return false;
    }
  }

  // ============================================
  // DELETE TEMPLATE (soft delete - set inactive)
  // ============================================

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inspection_templates')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Template deleted (soft):', id);
      return true;
    } catch (error) {
      console.error('❌ Delete template error:', error);
      return false;
    }
  }

  // ============================================
  // SET DEFAULT TEMPLATE
  // ============================================

  async setDefaultTemplate(id: string): Promise<boolean> {
    try {
      // First, unset all defaults
      await supabase
        .from('inspection_templates')
        .update({ is_default: false });

      // Then set the new default
      const { error } = await supabase
        .from('inspection_templates')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      console.log('✅ Default template set:', id);
      return true;
    } catch (error) {
      console.error('❌ Set default template error:', error);
      return false;
    }
  }

  // ============================================
  // CREATE DEFAULT TOILET TEMPLATE
  // ============================================

  async createDefaultToiletTemplate(createdBy?: string): Promise<InspectionTemplate | null> {
    // Generate unique name with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uniqueName = `Standard Toilet Inspection - ${timestamp}`;

    return this.createTemplate({
      name: uniqueName,
      description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen',
      estimated_time: 10, // minutes
      is_active: true,
      is_default: true,
      fields: {
        components: DEFAULT_TOILET_COMPONENTS,
      },
      created_by: createdBy,
    });
  }

  // ============================================
  // DUPLICATE TEMPLATE
  // ============================================

  async duplicateTemplate(
    templateId: string,
    newName: string,
    createdBy?: string
  ): Promise<InspectionTemplate | null> {
    try {
      const original = await this.getTemplateById(templateId);
      if (!original) throw new Error('Template not found');

      return this.createTemplate({
        name: newName,
        description: `${original.description || ''} (Copy)`,
        estimated_time: original.estimated_time,
        is_active: true,
        is_default: false,
        fields: original.fields,
        created_by: createdBy,
      });
    } catch (error) {
      console.error('❌ Duplicate template error:', error);
      return null;
    }
  }

  // ============================================
  // VALIDATE TEMPLATE FIELDS
  // ============================================

  validateTemplate(template: InspectionTemplate): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!template.name || template.name.trim() === '') {
      errors.push('Template name is required');
    }

    if (!template.fields || !template.fields.components) {
      errors.push('Template must have components');
    }

    if (template.fields?.components?.length === 0) {
      errors.push('Template must have at least one component');
    }

    // Validate each component
    template.fields?.components?.forEach((component, index) => {
      if (!component.id) {
        errors.push(`Component ${index + 1}: ID is required`);
      }
      if (!component.label) {
        errors.push(`Component ${index + 1}: Label is required`);
      }
      if (component.order === undefined) {
        errors.push(`Component ${index + 1}: Order is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

export const templateService = new TemplateService();