// 📁 src/core/use-cases/CreateLocation.ts
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import type { LocationFormData } from '@/core/repositories/ILocationRepository';
import { Location } from '@/domain/entities/Location';

export class CreateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(locationData: LocationFormData): Promise<Location> {
    // Validate required fields
    if (!locationData.name || !locationData.code) {
      throw new Error('Name and code are required');
    }

    // Check if location with same code already exists
    const existingLocations = await this.locationRepository.search(locationData.code);
    if (existingLocations.length > 0) {
      throw new Error('Location with this code already exists');
    }

    return await this.locationRepository.create(locationData);
  }
}
