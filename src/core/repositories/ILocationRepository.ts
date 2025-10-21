// 📁 src/core/repositories/ILocationRepository.ts
import { Location, LocationFormData, LocationWithDetails } from '@/core/entities/Location';

export interface ILocationRepository {
  create(locationData: LocationFormData): Promise<Location>;
  findById(id: string): Promise<Location | null>;
  findByIdWithDetails(id: string): Promise<LocationWithDetails | null>;
  findAll(): Promise<Location[]>;
  findAllWithDetails(): Promise<LocationWithDetails[]>;
  update(id: string, locationData: Partial<LocationFormData>): Promise<Location>;
  delete(id: string): Promise<void>;
  findByFloor(floor: string): Promise<Location[]>;
  findBySection(section: string): Promise<Location[]>;
  findByBuilding(building: string): Promise<Location[]>;
  search(query: string): Promise<Location[]>;
  getLocationWithStats(id: string): Promise<LocationWithDetails>;
}