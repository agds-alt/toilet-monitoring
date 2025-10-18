// core/use-cases/CreateLocation.ts
import { Location, LocationFormData } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class CreateLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(data: LocationFormData): Promise<Location> {
    // Validation
    if (!data.name || !data.code) {
      throw new Error('Name and code are required');
    }

    if (data.floor < 0) {
      throw new Error('Floor cannot be negative');
    }

    // Check if code already exists
    const existingLocations = await this.locationRepository.findAll();
    const codeExists = existingLocations.some(loc => loc.code === data.code);
    
    if (codeExists) {
      throw new Error('Location code already exists');
    }

    return this.locationRepository.create(data);
  }
}