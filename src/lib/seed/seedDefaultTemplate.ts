// src/lib/seed/seedDefaultTemplate.ts
// ============================================
// SEED DEFAULT TEMPLATE - Run once to create default template
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

export async function seedDefaultTemplate(userId?: string) {
  try {
    console.log('🌱 Seeding default template...');

    // Check if default template already exists
    const { data: existing } = await supabase
      .from('inspection_templates')
      .select('id')
      .eq('is_default', true)
      .single();

    if (existing) {
      console.log('✅ Default template already exists:', existing.id);
      return existing;
    }

    // Create default template
    const { data, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: 'Standard Toilet Inspection',
        description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
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
      console.error('❌ Error creating default template:', error);
      throw error;
    }

    console.log('✅ Default template created successfully:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Seed default template failed:', error);
    throw error;
  }
}

// ============================================
// USAGE: Run this once in your app
// ============================================

// Option 1: Run in a page component (one-time)
// useEffect(() => {
//   seedDefaultTemplate(user?.id);
// }, []);

// Option 2: Create an API route
// POST /api/seed/template
// await seedDefaultTemplate(userId);

// Option 3: Run directly in browser console
// import { seedDefaultTemplate } from '@/lib/seed/seedDefaultTemplate';
// seedDefaultTemplate();