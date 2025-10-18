// src/scripts/test-connection.mjs
// Run: node src/scripts/test-connection.mjs

import { SupabaseInspectionRepository } from '../infrastructure/database/repositories/SupabaseInspectionRepository.js';
import { SupabaseUserRepository } from '../infrastructure/database/repositories/SupabaseUserRepository.js';
import { getLocationById } from '../lib/constants/locations.js';

async function testConnection() {
  console.log('🧪 TESTING DATABASE CONNECTION...\n');

  // 1. Test Location Mapping
  console.log('1️⃣ Testing Location Mapping...');
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

  console.log('\n✅ BASIC TEST COMPLETED\n');
}

testConnection();
