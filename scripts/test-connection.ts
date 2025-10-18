// src/scripts/test-connection.ts
// Run: npx ts-node src/scripts/test-connection.ts

import { SupabaseInspectionRepository } from '../infrastructure/database/repositories/SupabaseInspectionRepository';
import { SupabaseUserRepository } from '../infrastructure/database/repositories/SupabaseUserRepository';
import { getLocationById } from '../lib/constants/locations';

async function testConnection() {
  console.log('🧪 TESTING DATABASE CONNECTION...\n');

  // 1. Test User Repository
  console.log('1️⃣ Testing User Repository...');
  try {
    const userRepo = new SupabaseUserRepository();
    const user = await userRepo.findById('578e5d2a-7c59-456d-be24-9b2c05a10255');
    
    if (user) {
      console.log('✅ User found:', user.fullName, '-', user.role);
    } else {
      console.log('❌ User not found');
    }
  } catch (error: any) {
    console.error('❌ User Repository Error:', error.message);
  }

  // 2. Test Location Mapping
  console.log('\n2️⃣ Testing Location Mapping...');
  const locationIds = [
    '550e8400-e29b-41d4-a716-446655440001', // Lobby
    '550e8400-e29b-41d4-a716-446655440002', // Lt1 Depan
    '550e8400-e29b-41d4-a716-446655440008', // Security
  ];

  locationIds.forEach(id => {
    const location = getLocationById(id);
    if (location) {
      console.log(`✅ ${id.slice(-4)} → ${location.name}`);
    } else {
      console.log(`❌ ${id.slice(-4)} → NOT FOUND`);
    }
  });

  // 3. Test Inspection Repository - Read
  console.log('\n3️⃣ Testing Inspection Repository (READ)...');
  try {
    const inspRepo = new SupabaseInspectionRepository();
    const inspections = await inspRepo.findMany({ limit: 5 });
    
    console.log(`✅ Found ${inspections.length} inspections`);
    inspections.forEach((insp, idx) => {
      const location = getLocationById(insp.locationId);
      console.log(`   ${idx + 1}. ${location?.name || 'Unknown'} - ${insp.status}`);
    });
  } catch (error: any) {
    console.error('❌ Inspection Repository Error:', error.message);
  }

  // 4. Test Data Consistency
  console.log('\n4️⃣ Testing Data Consistency...');
  try {
    const inspRepo = new SupabaseInspectionRepository();
    const allInspections = await inspRepo.findMany({});
    
    let validCount = 0;
    let invalidCount = 0;
    
    allInspections.forEach(insp => {
      const location = getLocationById(insp.locationId);
      if (location) {
        validCount++;
      } else {
        invalidCount++;
        console.log(`⚠️  Invalid location_id: ${insp.locationId}`);
      }
    });
    
    console.log(`✅ Valid inspections: ${validCount}`);
    console.log(`❌ Invalid inspections: ${invalidCount}`);
    
    if (invalidCount > 0) {
      console.log('\n⚠️  ACTION REQUIRED: Clean up invalid location_id in database');
    }
  } catch (error: any) {
    console.error('❌ Consistency Check Error:', error.message);
  }

  console.log('\n✅ TEST COMPLETED\n');
}

testConnection();
