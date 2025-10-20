
// ===================================
// 📁 src/core/use-cases/GetLocationsByBuilding.ts
// ===================================
import { Location } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocationsByBuilding {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(building: string): Promise<Location[]> {
    try {
      console.log('🔍 Fetching locations for building:', building);
      
      if (!building) {
        throw new Error('Building name is required');
      }

      const locations = await this.locationRepository.findByBuilding(building);
      
      console.log(`✅ Found ${locations.length} locations`);
      return locations;
    } catch (error) {
      console.error('❌ Error in GetLocationsByBuilding use case:', error);
      throw error;
    }
  }
}