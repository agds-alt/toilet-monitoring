// src/core/use-cases/SubscribeToLocations.ts
import { ILocationRepository } from "../repositories/ILocationRepository";

export class SubscribeToLocations {
  constructor(private locationRepository: ILocationRepository) {}

  execute(callback: (payload: any) => void): void {
    this.locationRepository.subscribeToChanges(callback);
  }

  unsubscribe(): void {
    this.locationRepository.unsubscribe();
  }
}