// ===================================
// 📁 src/core/use-cases/GetLocations.ts
// ===================================
import { Location } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocations {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(): Promise<Location[]> {
    try {
      console.log('🔍 Fetching all locations...');
      const locations = await this.locationRepository.findAll();
      console.log(`✅ Found ${locations.length} locations`);
      return locations;
    } catch (error) {
      console.error('❌ Error in GetLocations use case:', error);
      throw error;
    }
  }
}
