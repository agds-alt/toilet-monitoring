// core/use-cases/GetLocations.ts
import { Location } from '@/core/entities/Location';
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class GetLocations {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(): Promise<Location[]> {
    return this.locationRepository.findAll();
  }
}