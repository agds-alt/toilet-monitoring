// src/lib/di.ts - Let me check if it includes everything
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';
import { GetLocations } from '@/core/use-cases/GetLocations';
import { CreateLocation } from '@/core/use-cases/CreateLocation';
import { UpdateLocation }  from '@/core/use-cases/UpdateLocation'; // ✅ Add this
import { DeleteLocation } from '@/core/use-cases/DeleteLocation'; // ✅ Add this
import { SubscribeToLocations } from '@/core/use-cases/SubscribeToLocations';
import { supabase } from '@/infrastructure/database/supabase';

// Repository instances
export const locationRepository = new SupabaseLocationRepository(supabase);

// Use case instances
export const getLocationsUseCase = new GetLocations(locationRepository);
export const createLocationUseCase = new CreateLocation(locationRepository);
export const updateLocationUseCase = new UpdateLocation(locationRepository); // ✅ Add this
export const deleteLocationUseCase = new DeleteLocation(locationRepository); // ✅ Add this
export const subscribeToLocationsUseCase = new SubscribeToLocations(locationRepository);