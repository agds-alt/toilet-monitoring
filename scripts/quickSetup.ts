// scripts/quickSetup.ts
// ============================================
// QUICK SETUP SCRIPT - Run once to setup inspection module
// ============================================

import { supabase } from '@/infrastructure/database/supabase';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

async function quickSetup() {
  console.log('🚀 Starting Quick Setup...\n');

  try {
    // ============================================
    // STEP 1: SEED TEMPLATE
    // ============================================
    console.log('📝 STEP 1: Creating Default Template...');
    
    // Check if template already exists
    const { data: existing } = await supabase
      .from('inspection_templates')
      .select('id, name')
      .eq('is_default', true)
      .single();

    if (existing) {
      console.log('✅ Template already exists:', existing.name);
      console.log('   ID:', existing.id);
    } else {
      // Create template
      const { data: template, error: templateError } = await supabase
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
        })
        .select()
        .single();

      if (templateError) {
        throw new Error(`Template creation failed: ${templateError.message}`);
      }

      console.log('✅ Template created successfully!');
      console.log('   ID:', template.id);
      console.log('   Name:', template.name);
      console.log('   Components:', template.fields.components.length);
    }

    console.log('');

    // ============================================
    // STEP 2: VERIFY
    // ============================================
    console.log('🔍 STEP 2: Verifying Setup...');

    // Verify templates
    const { data: templates, error: verifyError } = await supabase
      .from('inspection_templates')
      .select('id, name, is_default, is_active, fields')
      .eq('is_active', true);

    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }

    console.log('✅ Found', templates?.length || 0, 'active template(s)');
    
    templates?.forEach((t, idx) => {
      const componentCount = t.fields?.components?.length || 0;
      console.log(`   ${idx + 1}. ${t.name} (${componentCount} components)${t.is_default ? ' [DEFAULT]' : ''}`);
    });

    // Check default template components
    const defaultTemplate = templates?.find(t => t.is_default);
    if (defaultTemplate && defaultTemplate.fields?.components) {
      console.log('\n📋 Default Template Components:');
      defaultTemplate.fields.components.forEach((comp: any, idx: number) => {
        console.log(`   ${idx + 1}. ${comp.icon} ${comp.label}`);
      });
    }

    console.log('');

    // ============================================
    // STEP 3: READY
    // ============================================
    console.log('🎉 STEP 3: Setup Complete!');
    console.log('');
    console.log('✅ All checks passed!');
    console.log('✅ Inspection module is ready to use');
    console.log('');
    console.log('📍 Next steps:');
    console.log('   1. Navigate to /inspection');
    console.log('   2. Test the inspection form');
    console.log('   3. Create your first inspection!');
    console.log('');
    console.log('🔗 Useful links:');
    console.log('   - Inspection Form: http://localhost:3000/inspection');
    console.log('   - Supabase Dashboard:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('');

    return {
      success: true,
      message: 'Setup completed successfully',
      data: {
        templates: templates?.length || 0,
        defaultTemplate: defaultTemplate?.id || null,
        components: defaultTemplate?.fields?.components?.length || 0,
      },
    };

  } catch (error: any) {
    console.error('');
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Check your Supabase connection');
    console.error('   2. Verify .env variables');
    console.error('   3. Check database schema exists');
    console.error('   4. Check RLS policies');
    console.error('');

    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================
// RUN SCRIPT
// ============================================

// For direct execution
if (require.main === module) {
  quickSetup().then((result) => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

export default quickSetup;