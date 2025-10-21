// ===================================
// 📁 src/lib/di.ts
// Dependency Injection Container - Complete
// ===================================

import { supabase } from '@/infrastructure/database/supabase';

// ===================================
// REPOSITORIES
// ===================================
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';

// ===================================
// LOCATION USE CASES - ALL
// ===================================
import { GetLocations } from '@/core/use-cases/GetLocations';
import { GetLocationById } from '@/core/use-cases/GetLocationById';
import { GetLocationByCode } from '@/core/use-cases/GetLocationByCode';
import { CreateLocation } from '@/core/use-cases/CreateLocation';
import { UpdateLocation } from '@/core/use-cases/UpdateLocation';
import { DeleteLocation } from '@/core/use-cases/DeleteLocation';
import { GetLocationsByBuilding } from '@/core/use-cases/GetLocationsByBuilding';
import { GetLocationsByFloor } from '@/core/use-cases/GetLocationsByFloor';
import { SearchLocations } from '@/core/use-cases/SearchLocations';
import { BulkCreateLocations } from '@/core/use-cases/BulkCreateLocations';
import { SubscribeToLocations } from '@/core/use-cases/SubscribeToLocations';

// ===================================
// REPOSITORY INSTANCES
// ===================================
export const locationRepository = new SupabaseLocationRepository();

// ===================================
// USE CASE INSTANCES - LOCATIONS
// ===================================

// Read Operations
export const getLocationsUseCase = new GetLocations(locationRepository);
export const getLocationByIdUseCase = new GetLocationById(locationRepository);
export const getLocationByCodeUseCase = new GetLocationByCode(locationRepository);
export const getLocationsByBuildingUseCase = new GetLocationsByBuilding(locationRepository);
export const getLocationsByFloorUseCase = new GetLocationsByFloor(locationRepository);
export const searchLocationsUseCase = new SearchLocations(locationRepository);

// Write Operations
export const createLocationUseCase = new CreateLocation(locationRepository);
export const updateLocationUseCase = new UpdateLocation(locationRepository);
export const deleteLocationUseCase = new DeleteLocation(locationRepository);
export const bulkCreateLocationsUseCase = new BulkCreateLocations(locationRepository);

// Real-time
export const subscribeToLocationsUseCase = new SubscribeToLocations(locationRepository);

// ===================================
// GROUPED EXPORTS (Optional - for cleaner imports)
// ===================================
export const locationUseCases = {
  // Read
  getAll: getLocationsUseCase,
  getById: getLocationByIdUseCase,
  getByCode: getLocationByCodeUseCase,
  getByBuilding: getLocationsByBuildingUseCase,
  getByFloor: getLocationsByFloorUseCase,
  search: searchLocationsUseCase,

  // Write
  create: createLocationUseCase,
  update: updateLocationUseCase,
  delete: deleteLocationUseCase,
  bulkCreate: bulkCreateLocationsUseCase,

  // Real-time
  subscribe: subscribeToLocationsUseCase,
};

// ===================================
// DEFAULT EXPORT (Optional)
// ===================================
export default {
  locations: locationUseCases,
};

// ===================================
// USAGE EXAMPLES
// ===================================
/*
// Example 1: Get all locations
import { getLocationsUseCase } from '@/lib/di';
const locations = await getLocationsUseCase.execute();

// Example 2: Get by ID
import { getLocationByIdUseCase } from '@/lib/di';
const location = await getLocationByIdUseCase.execute('uuid-here');

// Example 3: Get by code (for QR scanner)
import { getLocationByCodeUseCase } from '@/lib/di';
const location = await getLocationByCodeUseCase.execute('TOW-M1-FRONT');

// Example 4: Search
import { searchLocationsUseCase } from '@/lib/di';
const results = await searchLocationsUseCase.execute('toilet');

// Example 5: Create location
import { createLocationUseCase } from '@/lib/di';
const newLocation = await createLocationUseCase.execute({
  name: 'Lt. 1 - Toilet Pria',
  floor: '1',
  building: 'Tower A',
  code: 'TOW-M1-FRONT', // Optional - auto-generated if not provided
});

// Example 6: Bulk create
import { bulkCreateLocationsUseCase } from '@/lib/di';
const locations = await bulkCreateLocationsUseCase.execute({
  building: 'Tower A',
  startFloor: 1,
  endFloor: 5,
  genders: ['male', 'female'],
  sections: ['front', 'back'],
});

// Example 7: Update location
import { updateLocationUseCase } from '@/lib/di';
await updateLocationUseCase.execute('uuid-here', {
  name: 'Updated Name',
});

// Example 8: Delete location (soft delete)
import { deleteLocationUseCase } from '@/lib/di';
await deleteLocationUseCase.execute('uuid-here');

// Example 9: Subscribe to changes
import { subscribeToLocationsUseCase } from '@/lib/di';
const unsubscribe = await subscribeToLocationsUseCase.execute((locations) => {
  console.log('Locations updated:', locations);
});
// Later: unsubscribe();

// Example 10: Using grouped exports
import { locationUseCases } from '@/lib/di';
const locations = await locationUseCases.getAll.execute();
const location = await locationUseCases.getById.execute('uuid');
await locationUseCases.create.execute({ ... });
*/
