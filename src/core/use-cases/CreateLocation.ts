// 📁 src/core/use-cases/CreateLocation.ts
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { LocationFormData, Location } from '@/core/entities/Location';

export class CreateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(locationData: LocationFormData): Promise<Location> {
    // Validate required fields
    if (!locationData.name || !locationData.qr_code) {
      throw new Error('Name and QR code are required');
    }

    // Check if location with same QR code already exists
    const existingLocations = await this.locationRepository.search(locationData.qr_code);
    if (existingLocations.length > 0) {
      throw new Error('Location with this QR code already exists');
    }

    return await this.locationRepository.create(locationData);
  }
}