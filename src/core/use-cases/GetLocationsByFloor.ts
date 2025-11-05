// ===================================
// 📁 src/core/use-cases/GetLocationsByFloor.ts
// ===================================
import { Location } from '@/domain/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocationsByFloor {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(floor: string): Promise<Location[]> {
    try {
      console.log('🔍 Fetching locations for floor:', floor);

      if (!floor) {
        throw new Error('Floor is required');
      }

      const locations = await this.locationRepository.findByFloor(floor);

      console.log(`✅ Found ${locations.length} locations`);
      return locations;
    } catch (error) {
      console.error('❌ Error in GetLocationsByFloor use case:', error);
      throw error;
    }
  }
}
