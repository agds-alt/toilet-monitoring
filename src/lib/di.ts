// src/lib/di.ts
// ============================================
// DEPENDENCY INJECTION CONTAINER
// ============================================

import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';
import { SupabaseUserRepository } from '@/infrastructure/database/repositories/SupabaseUserRepository';
import { CloudinaryPhotoRepository } from '@/infrastructure/storage/CloudinaryPhotoRepository';

import { GetLocations } from '@/core/use-cases/GetLocations';
import { GetLocationById } from '@/core/use-cases/GetLocationById';
import { GetLocationByCode } from '@/core/use-cases/GetLocationByCode';
import { GetLocationsByBuilding } from '@/core/use-cases/GetLocationsByBuilding';
import { GetLocationsByFloor } from '@/core/use-cases/GetLocationsByFloor';
import { SearchLocations } from '@/core/use-cases/SearchLocations';
// import { CreateLocation } from '@/core/use-cases/CreateLocation';
// import { UpdateLocation } from '@/core/use-cases/UpdateLocation';
import { DeleteLocation } from '@/core/use-cases/DeleteLocation';
import { BulkCreateLocations } from '@/core/use-cases/BulkCreateLocations';
import { SubscribeToLocations } from '@/core/use-cases/SubscribeToLocations';
import { UploadPhoto } from '@/core/use-cases/UploadPhoto';
import { GetCurrentUserUseCase } from '@/core/use-cases/GetCurrentUserUseCase';

// ============================================
// REPOSITORIES
// ============================================

export const locationRepository = new SupabaseLocationRepository();
export const userRepository = new SupabaseUserRepository();
export const photoRepository = new CloudinaryPhotoRepository();

// ============================================
// USE CASES - Locations
// ============================================

export const getLocationsUseCase = new GetLocations(locationRepository);
export const getLocationByIdUseCase = new GetLocationById(locationRepository);
export const getLocationByCodeUseCase = new GetLocationByCode(locationRepository);
export const getLocationsByBuildingUseCase = new GetLocationsByBuilding(locationRepository);
export const getLocationsByFloorUseCase = new GetLocationsByFloor(locationRepository);
export const searchLocationsUseCase = new SearchLocations(locationRepository);

// Temporarily disabled - need to fix use case exports
// export const createLocationUseCase = new CreateLocation(locationRepository);
// export const updateLocationUseCase = new UpdateLocation(locationRepository);

export const deleteLocationUseCase = new DeleteLocation(locationRepository);
export const bulkCreateLocationsUseCase = new BulkCreateLocations(locationRepository);
export const subscribeToLocationsUseCase = new SubscribeToLocations(locationRepository);

// ============================================
// USE CASES - Photos
// ============================================

export const uploadPhotoUseCase = new UploadPhoto(photoRepository);

// ============================================
// USE CASES - Users
// ============================================

export const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================

export const container = {
  locationRepository,
  userRepository,
  photoRepository,

  getLocationsUseCase,
  getLocationByIdUseCase,
  getLocationByCodeUseCase,
  getLocationsByBuildingUseCase,
  getLocationsByFloorUseCase,
  searchLocationsUseCase,
  deleteLocationUseCase,
  bulkCreateLocationsUseCase,
  subscribeToLocationsUseCase,
  uploadPhotoUseCase,
  getCurrentUserUseCase,
};

export default container;
