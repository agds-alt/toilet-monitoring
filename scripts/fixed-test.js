// src/scripts/fixed-test.js
// Fixed database test matching actual schema

const { createClient } = require('@supabase/supabase-js');

// Load environment
const fs = require('fs');
const path = require('path');

try {
  const envPath = path.join(__dirname, '..', '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = envFile.split('\n')
      .filter(line => line && !line.startsWith('#') && line.includes('='))
      .reduce((acc, line) => {
        const [key, ...value] = line.split('=');
        acc[key] = value.join('=');
        return acc;
      }, {});
    
    process.env.NEXT_PUBLIC_SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
} catch (error) {
  console.log('⚠️  Could not load .env.local:', error.message);
}

// Location mapping based on actual database
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
  console.log('🧪 DATABASE TEST - ACTUAL SCHEMA\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials');
    return;
  }

  console.log('✅ Connected to:', supabaseUrl.replace('https://', '').split('.')[0]);
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Test locations table - get actual schema
    console.log('\n1️⃣ Testing Locations Table...');
    const { data: locations, error: locError } = await supabase
      .from('locations')
      .select('*')
      .limit(5);

    if (locError) {
      console.error('❌ Locations error:', locError.message);
      
      // Try to get column names
      const { data: sample } = await supabase
        .from('locations')
        .select('*')
        .limit(1);
      
      if (sample && sample[0]) {
        console.log('📍 Actual columns:', Object.keys(sample[0]).join(', '));
      }
    } else {
      console.log(`✅ Found ${locations?.length || 0} locations`);
      locations?.forEach((loc, idx) => {
        console.log(`   ${idx + 1}. ${loc.name} (${loc.id.slice(-4)})`);
        console.log(`      Floor: ${loc.floor || 'N/A'}, Created: ${loc.created_at ? new Date(loc.created_at).toLocaleDateString() : 'N/A'}`);
      });
    }

    // 2. Test inspections table
    console.log('\n2️⃣ Testing Inspections Table...');
    const { data: inspections, error: inspError } = await supabase
      .from('inspections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (inspError) {
      console.error('❌ Inspections error:', inspError.message);
    } else {
      console.log(`✅ Found ${inspections?.length || 0} inspections`);
      inspections?.forEach((insp, idx) => {
        const location = getLocationById(insp.location_id);
        const date = insp.created_at ? new Date(insp.created_at) : new Date();
        console.log(`   ${idx + 1}. ${location?.name || 'Unknown Location'} - ${insp.status}`);
        console.log(`      ID: ${insp.id.slice(-8)}, Date: ${date.toLocaleString()}`);
        
        // Show assessments if available
        if (insp.assessments) {
          const issues = Object.values(insp.assessments).filter(val => val === 'need_repair' || val === 'critical').length;
          console.log(`      Issues: ${issues}`);
        }
      });
    }

    // 3. Check actual location IDs in database
    console.log('\n3️⃣ Checking Actual Location IDs...');
    const { data: dbLocations, error: dbLocError } = await supabase
      .from('locations')
      .select('id, name');

    if (!dbLocError && dbLocations) {
      console.log(`📊 Database has ${dbLocations.length} locations:`);
      dbLocations.forEach(loc => {
        const inMapping = getLocationById(loc.id) ? '✅' : '❌';
        console.log(`   ${inMapping} ${loc.name} (${loc.id.slice(-4)})`);
      });
    }

    // 4. Data quality summary
    console.log('\n4️⃣ Data Quality Summary...');
    const { data: allInspections } = await supabase
      .from('inspections')
      .select('location_id, status');

    if (allInspections) {
      const statusCount = {};
      const locationCount = {};
      
      allInspections.forEach(insp => {
        statusCount[insp.status] = (statusCount[insp.status] || 0) + 1;
        locationCount[insp.location_id] = (locationCount[insp.location_id] || 0) + 1;
      });

      console.log(`📈 Total inspections: ${allInspections.length}`);
      console.log('📊 Status breakdown:');
      Object.entries(statusCount).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
      
      console.log('🏢 Inspections per location:');
      Object.entries(locationCount).forEach(([locId, count]) => {
        const location = getLocationById(locId);
        console.log(`   ${location?.name || 'Unknown'}: ${count} inspections`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }

  console.log('\n🎉 COMPREHENSIVE TEST COMPLETED\n');
}

testConnection();
