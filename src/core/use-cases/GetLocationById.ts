// ===================================
// 📁 src/core/use-cases/GetLocationById.ts
// ===================================
import { Location } from '@/domain/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocationById {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string): Promise<Location | null> {
    try {
      console.log('🔍 Fetching location by ID:', id);

      if (!id) {
        throw new Error('Location ID is required');
      }

      const location = await this.locationRepository.findById(id);

      if (!location) {
        console.log('⚠️ Location not found');
        return null;
      }

      console.log('✅ Location found:', location.name);
      return location;
    } catch (error) {
      console.error('❌ Error in GetLocationById use case:', error);
      throw error;
    }
  }
}
