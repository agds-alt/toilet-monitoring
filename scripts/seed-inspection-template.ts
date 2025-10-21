// scripts/seed-inspection-template.ts
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const DEFAULT_TOILET_COMPONENTS = [
  {
    id: 'toilet_bowl',
    label: 'Toilet Bowl / Kloset',
    label_id: 'Kebersihan Kloset',
    description: 'Cleanliness and condition of the toilet bowl',
    type: 'rating',
    required: true,
    order: 1,
    icon: '🚽',
  },
  {
    id: 'floor_cleanliness',
    label: 'Floor Cleanliness',
    label_id: 'Kebersihan Lantai',
    description: 'Overall floor cleanliness and dryness',
    type: 'rating',
    required: true,
    order: 2,
    icon: '🧹',
  },
  {
    id: 'wall_cleanliness',
    label: 'Wall Cleanliness',
    label_id: 'Kebersihan Dinding',
    description: 'Walls, tiles, and surfaces condition',
    type: 'rating',
    required: true,
    order: 3,
    icon: '🧱',
  },
  {
    id: 'sink_wastafel',
    label: 'Sink / Wastafel',
    label_id: 'Wastafel',
    description: 'Sink cleanliness and water flow',
    type: 'rating',
    required: true,
    order: 4,
    icon: '🚰',
  },
  {
    id: 'soap_dispenser',
    label: 'Soap Dispenser',
    label_id: 'Sabun',
    description: 'Soap availability and dispenser condition',
    type: 'rating',
    required: true,
    order: 5,
    icon: '🧼',
  },
  {
    id: 'tissue_availability',
    label: 'Tissue / Paper Towel',
    label_id: 'Tisu / Handuk Kertas',
    description: 'Tissue availability and dispenser condition',
    type: 'rating',
    required: true,
    order: 6,
    icon: '🧻',
  },
  {
    id: 'trash_bin',
    label: 'Trash Bin',
    label_id: 'Tempat Sampah',
    description: 'Trash bin cleanliness and fullness',
    type: 'rating',
    required: true,
    order: 7,
    icon: '🗑️',
  },
  {
    id: 'door_lock',
    label: 'Door & Lock',
    label_id: 'Pintu & Kunci',
    description: 'Door condition and lock functionality',
    type: 'rating',
    required: true,
    order: 8,
    icon: '🚪',
  },
  {
    id: 'ventilation',
    label: 'Ventilation',
    label_id: 'Ventilasi',
    description: 'Air circulation and ventilation system',
    type: 'rating',
    required: true,
    order: 9,
    icon: '💨',
  },
  {
    id: 'lighting',
    label: 'Lighting',
    label_id: 'Pencahayaan',
    description: 'Light brightness and functionality',
    type: 'rating',
    required: true,
    order: 10,
    icon: '💡',
  },
  {
    id: 'overall_smell',
    label: 'Overall Smell / Aroma',
    label_id: 'Aroma Keseluruhan',
    description: 'Overall smell and air freshness',
    type: 'rating',
    required: true,
    order: 11,
    icon: '👃',
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedInspectionTemplate() {
  console.log('🚀 Starting template seed...\n');

  try {
    // Check existing
    console.log('🔍 Checking existing templates...');
    const { data: existing } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('name', 'Standard Toilet Inspection');

    if (existing && existing.length > 0) {
      console.log('⚠️  Template already exists! Updating...');
      const { error } = await supabase
        .from('inspection_templates')
        .update({
          fields: { components: DEFAULT_TOILET_COMPONENTS },
          is_default: true,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);

      if (error) throw error;
      console.log('✅ Template updated!');
      return;
    }

    // Create new
    console.log('📝 Creating new template...');
    const { data, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: 'Standard Toilet Inspection',
        description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen',
        estimated_time: 10,
        is_active: true,
        is_default: true,
        fields: { components: DEFAULT_TOILET_COMPONENTS },
      })
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Template created successfully!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Components: 11\n`);

    console.log('🎯 Component List:');
    DEFAULT_TOILET_COMPONENTS.forEach((comp, idx) => {
      console.log(`   ${idx + 1}. ${comp.icon} ${comp.label}`);
    });

    console.log('\n🎉 Seed completed!');
  } catch (error: any) {
    console.error('\n💥 Seed failed:', error.message);
    process.exit(1);
  }
}

seedInspectionTemplate();