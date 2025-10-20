// src/core/use-cases/UpdateLocation.ts
import { ILocationRepository } from '../repositories/ILocationRepository';
import { Location, LocationFormData } from '../entities/Location';
// src/core/use-cases/UpdateLocation.ts

export class UpdateLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    return await this.locationRepository.update(id, locationData);
  }
}

