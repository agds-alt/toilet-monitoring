// src/lib/seed/seedTemplates.ts
// ============================================
// SEED TEMPLATES TO DATABASE
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

export async function seedDefaultTemplate(userId?: string) {
  try {
    console.log('🌱 Seeding default toilet inspection template...');

    // Check if default template already exists
    const { data: existing } = await supabase
      .from('inspection_templates')
      .select('id')
      .eq('is_default', true)
      .single();

    if (existing) {
      console.log('✅ Default template already exists:', existing.id);
      return existing.id;
    }

    // Create default template
    const { data: template, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: 'Standard Toilet Inspection',
        description:
          'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
        estimated_time: 10,
        is_active: true,
        is_default: true,
        fields: {
          components: DEFAULT_TOILET_COMPONENTS,
        },
        created_by: userId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating template:', error);
      throw error;
    }

    console.log('✅ Default template created successfully:', template.id);
    return template.id;
  } catch (error) {
    console.error('❌ Seed template error:', error);
    throw error;
  }
}

// ============================================
// VERIFY TEMPLATES EXIST
// ============================================

export async function verifyTemplates() {
  try {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('id, name, is_active, is_default')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Error verifying templates:', error);
      throw error;
    }

    console.log(`📋 Found ${data?.length || 0} active templates`);
    return data || [];
  } catch (error) {
    console.error('❌ Verify templates error:', error);
    throw error;
  }
}

// ============================================
// INITIALIZE TEMPLATES (Run on app start)
// ============================================

export async function initializeTemplates(userId?: string) {
  try {
    const templates = await verifyTemplates();

    if (templates.length === 0) {
      console.log('⚠️ No templates found. Creating default template...');
      await seedDefaultTemplate(userId);
    } else {
      console.log('✅ Templates verified');
    }

    return true;
  } catch (error) {
    console.error('❌ Initialize templates error:', error);
    return false;
  }
}
