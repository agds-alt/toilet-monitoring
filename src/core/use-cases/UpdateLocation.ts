// 📁 src/core/use-cases/UpdateLocation.ts
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import type { LocationFormData } from '@/core/repositories/ILocationRepository';
import { Location } from '@/domain/entities/Location';

export class UpdateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    const existingLocation = await this.locationRepository.findById(id);
    if (!existingLocation) {
      throw new Error('Location not found');
    }

    return await this.locationRepository.update(id, locationData);
  }
}
