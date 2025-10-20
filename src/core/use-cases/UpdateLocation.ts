// ===================================
// 📁 src/core/use-cases/UpdateLocation.ts
// ===================================
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData } from '@/core/entities/Location';

export class UpdateLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string, locationData: Partial<LocationFormData>): Promise<Location> {
    try {
      console.log('✏️ Updating location:', id);

      // Validation
      if (!id) {
        throw new Error('Location ID is required');
      }

      // Check if location exists
      const existingLocation = await this.locationRepository.findById(id);
      if (!existingLocation) {
        throw new Error('Location not found');
      }

      // If code is being updated, check for duplicates
      if (locationData.code && locationData.code !== existingLocation.code) {
        const locations = await this.locationRepository.findAll();
        const codeExists = locations.some(loc => loc.code === locationData.code && loc.id !== id);
        
        if (codeExists) {
          throw new Error(`Location code "${locationData.code}" already exists`);
        }
      }

      // Update location
      const updatedLocation = await this.locationRepository.update(id, locationData);
      
      console.log('✅ Location updated:', updatedLocation.name);
      return updatedLocation;
    } catch (error) {
      console.error('❌ Error in UpdateLocation use case:', error);
      throw error;
    }
  }
}