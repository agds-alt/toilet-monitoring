// scripts/fix-template.ts
// ============================================
// AUTO-FIX TEMPLATE SCRIPT
// ============================================

import { createClient } from '@supabase/supabase-js';
import { DEFAULT_TOILET_COMPONENTS } from '../src/lib/constants/inspection.constants';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// LOAD .env OR .env.local
// ============================================

function loadEnv() {
  const envFiles = ['.env.local', '.env'];

  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);

    if (fs.existsSync(filePath)) {
      console.log(`📄 Loading environment from: ${file}`);
      const envContent = fs.readFileSync(filePath, 'utf8');

      envContent.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      });

      return true;
    }
  }

  return false;
}

// Load environment
if (!loadEnv()) {
  console.error('❌ No .env or .env.local file found!');
  console.log('\n💡 Create .env.local with:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key\n');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  console.log('\n💡 Add to .env.local:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTemplate() {
  console.log('🔧 Auto-fixing templates...\n');
  console.log('━'.repeat(50));

  try {
    // 1. Check existing templates
    console.log('\n📊 Checking current state...');

    const { data: allTemplates, error: allError } = await supabase
      .from('inspection_templates')
      .select('*');

    if (allError) throw allError;

    console.log(`   Found ${allTemplates?.length || 0} templates`);

    // 2. Check for default
    const { data: defaultTemplate, error: defaultError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_default', true)
      .single();

    if (defaultError && defaultError.code !== 'PGRST116') {
      throw defaultError;
    }

    console.log(`   Default template: ${defaultTemplate ? '✅ Found' : '❌ Missing'}`);

    // 3. Fix strategy
    if (!allTemplates || allTemplates.length === 0) {
      // No templates at all - create new
      console.log('\n📝 Creating new default template...');

      const { data: newTemplate, error: insertError } = await supabase
        .from('inspection_templates')
        .insert({
          name: 'Standard Toilet Inspection',
          description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen',
          estimated_time: 10,
          is_active: true,
          is_default: true,
          fields: {
            components: DEFAULT_TOILET_COMPONENTS,
          },
        })
        .select()
        .single();

      if (insertError) {
        // Check if name already exists
        if (insertError.code === '23505') {
          console.log('   ⚠️  Template name already exists, fetching it...');

          const { data: existing } = await supabase
            .from('inspection_templates')
            .select('*')
            .eq('name', 'Standard Toilet Inspection')
            .single();

          if (existing) {
            // Update to be default
            await supabase
              .from('inspection_templates')
              .update({ is_default: true, is_active: true })
              .eq('id', existing.id);

            console.log('   ✅ Set existing template as default');
            console.log(`   ID: ${existing.id}`);
          }
        } else {
          throw insertError;
        }
      } else {
        console.log('   ✅ Template created successfully!');
        console.log(`   ID: ${newTemplate.id}`);
        console.log(`   Name: ${newTemplate.name}`);
        console.log(`   Components: ${newTemplate.fields.components.length}`);
      }
    } else if (!defaultTemplate) {
      // Templates exist but no default
      console.log('\n🔧 Setting first active template as default...');

      // Unset all defaults first
      await supabase.from('inspection_templates').update({ is_default: false });

      // Set first active as default
      const firstActive = allTemplates.find((t) => t.is_active);
      if (firstActive) {
        await supabase
          .from('inspection_templates')
          .update({ is_default: true })
          .eq('id', firstActive.id);

        console.log(`   ✅ Set "${firstActive.name}" as default`);
      } else {
        // No active templates, activate first one
        await supabase
          .from('inspection_templates')
          .update({ is_active: true, is_default: true })
          .eq('id', allTemplates[0].id);

        console.log(`   ✅ Activated and set "${allTemplates[0].name}" as default`);
      }
    } else {
      console.log('\n✅ Templates are configured correctly!');
      console.log(`   Default: ${defaultTemplate.name}`);
      console.log(`   Components: ${defaultTemplate.fields?.components?.length || 0}`);
    }

    // 4. Verify fix
    console.log('\n🔍 Verifying...');

    const { data: verifyTemplate, error: verifyError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    if (verifyError) throw verifyError;

    if (verifyTemplate && verifyTemplate.fields?.components?.length > 0) {
      console.log('   ✅ Verification passed!');
      console.log(`   Template: ${verifyTemplate.name}`);
      console.log(`   Components: ${verifyTemplate.fields.components.length}`);
      console.log(`   Status: ${verifyTemplate.is_active ? 'Active' : 'Inactive'}`);
      console.log(`   Default: ${verifyTemplate.is_default ? 'Yes' : 'No'}`);

      console.log('\n━'.repeat(50));
      console.log('✅ Template fix completed successfully!');
      console.log('\n💡 Next step: Restart dev server or refresh browser\n');
      process.exit(0);
    } else {
      throw new Error('Verification failed - template has no components');
    }
  } catch (error: any) {
    console.log('\n━'.repeat(50));
    console.error('❌ Fix failed:', error.message);
    console.log('\n💡 Try manual steps:');
    console.log('   1. Check Supabase connection');
    console.log('   2. Verify table "inspection_templates" exists');
    console.log('   3. Check .env variables');
    console.log('   4. Run: npm run db:reset\n');
    process.exit(1);
  }
}

// Run
fixTemplate();
