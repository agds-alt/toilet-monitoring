// ===================================
// 📁 src/core/use-cases/GetLocationByCode.ts
// ===================================
import { Location } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocationByCode {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(code: string): Promise<Location | null> {
    try {
      console.log('🔍 Fetching location by code:', code);

      if (!code) {
        throw new Error('Location code is required');
      }

      // Find all and filter by code
      const locations = await this.locationRepository.findAll();
      const location = locations.find((loc) => loc.code === code);

      if (!location) {
        console.log('⚠️ Location not found with code:', code);
        return null;
      }

      console.log('✅ Location found:', location.name);
      return location;
    } catch (error) {
      console.error('❌ Error in GetLocationByCode use case:', error);
      throw error;
    }
  }
}
