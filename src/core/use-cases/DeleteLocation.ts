// ===================================
// 📁 src/core/use-cases/DeleteLocation.ts
// ===================================
import { ILocationRepository } from '@/core/repositories/ILocationRepository';

export class DeleteLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string): Promise<void> {
    try {
      console.log('🗑️ Deleting location:', id);

      // Validation
      if (!id) {
        throw new Error('Location ID is required');
      }

      // Check if location exists
      const location = await this.locationRepository.findById(id);
      if (!location) {
        throw new Error('Location not found');
      }

      // TODO: Check if location has inspections
      // If yes, maybe prevent deletion or soft delete only

      // Delete location (soft delete in repository)
      await this.locationRepository.delete(id);

      console.log('✅ Location deleted:', location.name);
    } catch (error) {
      console.error('❌ Error in DeleteLocation use case:', error);
      throw error;
    }
  }
}
