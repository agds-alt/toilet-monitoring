// 📁 src/infrastructure/services/location.service.ts
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';
import { CreateLocationUseCase, UpdateLocationUseCase, GetLocationByIdUseCase, GetLocationsUseCase } from '@/core/use-cases';
import { LocationFormData, Location } from '@/core/entities/Location';

export class LocationService {
  private locationRepository: SupabaseLocationRepository;
  private createLocationUseCase: CreateLocationUseCase;
  private updateLocationUseCase: UpdateLocationUseCase;
  private getLocationByIdUseCase: GetLocationByIdUseCase;
  private getLocationsUseCase: GetLocationsUseCase;

  constructor() {
    this.locationRepository = new SupabaseLocationRepository();
    this.createLocationUseCase = new CreateLocationUseCase(this.locationRepository);
    this.updateLocationUseCase = new UpdateLocationUseCase(this.locationRepository);
    this.getLocationByIdUseCase = new GetLocationByIdUseCase(this.locationRepository);
    this.getLocationsUseCase = new GetLocationsUseCase(this.locationRepository);
  }

  async createLocation(locationData: LocationFormData): Promise<Location> {
    return await this.createLocationUseCase.execute(locationData);
  }

  async updateLocation(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    return await this.updateLocationUseCase.execute(id, locationData);
  }

  async getLocationById(id: string) {
    return await this.getLocationByIdUseCase.execute(id);
  }

  async getAllLocations() {
    return await this.getLocationsUseCase.execute();
  }

  async searchLocations(query: string) {
    return await this.locationRepository.search(query);
  }

  async getLocationsByBuilding(building: string) {
    return await this.locationRepository.findByBuilding(building);
  }

  async getLocationsByFloor(floor: string) {
    return await this.locationRepository.findByFloor(floor);
  }
}