// core/repositories/ILocationRepository.ts
import { Location, LocationFormData, LocationWithDetails } from '@/core/entities/Location';

export interface ILocationRepository {
  // CRUD Operations
  create(location: LocationFormData): Promise<Location>;
  findById(id: string): Promise<Location | null>;
  findByIdWithDetails(id: string): Promise<LocationWithDetails | null>;
  findAll(): Promise<Location[]>;
  findAllWithDetails(): Promise<LocationWithDetails[]>;
  update(id: string, location: Partial<LocationFormData>): Promise<Location>;
  delete(id: string): Promise<void>;
  
  // Query Operations
  findByFloor(floor: string): Promise<Location[]>;
  findBySection(section: string): Promise<Location[]>;
  findByBuilding(building: string): Promise<Location[]>;
  search(query: string): Promise<Location[]>;
  getLocationWithStats(id: string): Promise<LocationWithDetails>;
}