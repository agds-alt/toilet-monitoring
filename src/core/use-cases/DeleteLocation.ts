// src/core/use-cases/DeleteLocation.ts
import { ILocationRepository } from '../repositories/ILocationRepository';

export class DeleteLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string): Promise<void> {
    return await this.locationRepository.delete(id);
  }
}