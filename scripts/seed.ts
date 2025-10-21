// scripts/seed.ts
// ============================================
// DATABASE SEEDER CLI
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// SEED TEMPLATES
// ============================================

async function seedTemplates() {
  console.log('\n📝 Seeding inspection templates...');

  const templateName = 'Standard Toilet Inspection';

  // Check if exists
  const { data: existing } = await supabase
    .from('inspection_templates')
    .select('id, name')
    .eq('name', templateName)
    .single();

  if (existing) {
    console.log('✅ Template already exists:', existing.name);
    console.log('   ID:', existing.id);
    return existing;
  }

  // Create new
  const { data: newTemplate, error } = await supabase
    .from('inspection_templates')
    .insert({
      name: templateName,
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

  if (error) {
    console.error('❌ Error creating template:', error.message);
    throw error;
  }

  console.log('✅ Template created:', newTemplate.name);
  console.log('   ID:', newTemplate.id);
  return newTemplate;
}

// ============================================
// SEED SAMPLE LOCATIONS (Optional)
// ============================================

async function seedLocations() {
  console.log('\n📍 Seeding sample locations...');

  const locations = [
    {
      name: 'Toilet Lantai 1 - Lobby',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      postal_code: '10220',
      floor: '1',
      building: 'Gedung A',
      qr_code: 'LOC-A001-F01',
      is_active: true,
    },
    {
      name: 'Toilet Lantai 2 - Office',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      postal_code: '10220',
      floor: '2',
      building: 'Gedung A',
      qr_code: 'LOC-A002-F02',
      is_active: true,
    },
    {
      name: 'Toilet Lantai 3 - Cafeteria',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      postal_code: '10220',
      floor: '3',
      building: 'Gedung A',
      qr_code: 'LOC-A003-F03',
      is_active: true,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const location of locations) {
    // Check if exists
    const { data: existing } = await supabase
      .from('locations')
      .select('id, name')
      .eq('qr_code', location.qr_code)
      .single();

    if (existing) {
      console.log('   ⏭️  Skipped:', location.name);
      skipped++;
      continue;
    }

    // Create new
    const { error } = await supabase
      .from('locations')
      .insert(location);

    if (error) {
      console.error('   ❌ Error:', location.name, error.message);
      continue;
    }

    console.log('   ✅ Created:', location.name);
    created++;
  }

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
}

// ============================================
// MAIN SEED FUNCTION
// ============================================

async function main() {
  console.log('🌱 Starting database seeding...\n');
  console.log('━'.repeat(50));

  try {
    // Seed templates
    await seedTemplates();

    // Seed locations
    await seedLocations();

    console.log('\n━'.repeat(50));
    console.log('✅ Seeding completed successfully!\n');
    process.exit(0);
  } catch (error: any) {
    console.log('\n━'.repeat(50));
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// ============================================
// RESET FUNCTION (Dev only)
// ============================================

async function reset() {
  console.log('🗑️  Resetting database...\n');
  console.log('⚠️  WARNING: This will delete all data!');
  console.log('━'.repeat(50));

  // Delete all inspection records
  const { error: inspectionError } = await supabase
    .from('inspection_records')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (inspectionError) {
    console.error('❌ Error deleting inspections:', inspectionError.message);
  } else {
    console.log('✅ Deleted all inspection records');
  }

  // Delete all photos
  const { error: photoError } = await supabase
    .from('photos')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (photoError) {
    console.error('❌ Error deleting photos:', photoError.message);
  } else {
    console.log('✅ Deleted all photos');
  }

  // Delete all templates
  const { error: templateError } = await supabase
    .from('inspection_templates')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (templateError) {
    console.error('❌ Error deleting templates:', templateError.message);
  } else {
    console.log('✅ Deleted all templates');
  }

  // Delete all locations
  const { error: locationError } = await supabase
    .from('locations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (locationError) {
    console.error('❌ Error deleting locations:', locationError.message);
  } else {
    console.log('✅ Deleted all locations');
  }

  console.log('\n━'.repeat(50));
  console.log('✅ Reset completed!\n');
}

// ============================================
// CLI
// ============================================

const args = process.argv.slice(2);
const command = args[0];

if (command === 'reset') {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Reset is not allowed in production!');
    process.exit(1);
  }
  reset();
} else {
  main();
}