// src/scripts/direct-test.js
// Direct database test without TypeScript complications

const { createClient } = require('@supabase/supabase-js');

// Simple location mapping (hardcoded untuk testing)
const locations = {
  '550e8400-e29b-41d4-a716-446655440001': { name: 'Lobby - Toilet Pria & Wanita' },
  '550e8400-e29b-41d4-a716-446655440002': { name: 'Lt. 1 - Toilet Depan Pria & Wanita' },
  '550e8400-e29b-41d4-a716-446655440003': { name: 'Lt. 1 - Toilet Belakang Pria' },
  '550e8400-e29b-41d4-a716-446655440004': { name: 'Lt. 1 - Toilet Belakang Wanita' },
  '550e8400-e29b-41d4-a716-446655440005': { name: 'Lt. 2 - Toilet Depan Pria & Wanita' },
  '550e8400-e29b-41d4-a716-446655440006': { name: 'Lt. 2 - Toilet Belakang Pria' },
  '550e8400-e29b-41d4-a716-446655440007': { name: 'Lt. 2 - Toilet Belakang Wanita' },
  '550e8400-e29b-41d4-a716-446655440008': { name: 'Security - Toilet Pria' }
};

function getLocationById(id) {
  return locations[id] || null;
}

async function testConnection() {
  console.log('🧪 DIRECT DATABASE CONNECTION TEST...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables');
    console.log('   Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
    return;
  }

  console.log('✅ Supabase credentials found');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Test locations table
    console.log('\n1️⃣ Testing Locations Table...');
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('id, name, floor, building')
      .limit(5);

    if (locError) {
      console.error('❌ Locations error:', locError.message);
    } else {
      console.log(`✅ Found ${locations?.length || 0} locations`);
      locations?.forEach((loc, idx) => {
        console.log(`   ${idx + 1}. ${loc.name} (${loc.id.slice(-4)}) - ${loc.floor || 'N/A'}`);
      });
    }

    // 2. Test inspections table
    console.log('\n2️⃣ Testing Inspections Table...');
    const { data: inspections, error: inspError } = await supabase
      .from('inspections')
      .select('id, location_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (inspError) {
      console.error('❌ Inspections error:', inspError.message);
    } else {
      console.log(`✅ Found ${inspections?.length || 0} inspections`);
      inspections?.forEach((insp, idx) => {
        const location = getLocationById(insp.location_id);
        console.log(`   ${idx + 1}. ${location?.name || 'Unknown'} - ${insp.status} - ${new Date(insp.created_at).toLocaleDateString()}`);
      });
    }

    // 3. Test data consistency
    console.log('\n3️⃣ Testing Data Consistency...');
    const { data: allInspections, error: allError } = await supabase
      .from('inspections')
      .select('location_id');

    if (allError) {
      console.error('❌ Consistency check error:', allError.message);
    } else {
      const uniqueLocations = [...new Set(allInspections?.map(i => i.location_id))];
      let validCount = 0;
      let invalidCount = 0;
      
      uniqueLocations?.forEach(locationId => {
        if (getLocationById(locationId)) {
          validCount++;
        } else {
          invalidCount++;
          console.log(`⚠️  Invalid location_id: ${locationId}`);
        }
      });
      
      console.log(`✅ Valid locations: ${validCount}`);
      console.log(`❌ Invalid locations: ${invalidCount}`);
      console.log(`📊 Total inspections: ${allInspections?.length || 0}`);
      
      if (invalidCount > 0) {
        console.log('\n⚠️  ACTION REQUIRED: Some inspections have invalid location IDs');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }

  console.log('\n🎉 DATABASE TEST COMPLETED\n');
}

// Run the test
testConnection();
