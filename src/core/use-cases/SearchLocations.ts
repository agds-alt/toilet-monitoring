// ===================================
// 📁 src/core/use-cases/SearchLocations.ts
// ===================================
import { Location } from '@/domain/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class SearchLocations {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(query: string): Promise<Location[]> {
    try {
      console.log('🔍 Searching locations with query:', query);

      if (!query || query.trim().length === 0) {
        // Return all if no query
        return await this.locationRepository.findAll();
      }

      const locations = await this.locationRepository.search(query.trim());

      console.log(`✅ Found ${locations.length} locations matching "${query}"`);
      return locations;
    } catch (error) {
      console.error('❌ Error in SearchLocations use case:', error);
      throw error;
    }
  }
}
