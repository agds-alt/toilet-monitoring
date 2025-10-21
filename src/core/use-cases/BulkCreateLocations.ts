// ===================================
// 📁 src/core/use-cases/BulkCreateLocations.ts
// ===================================
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData } from '@/core/entities/Location';

interface BulkLocationConfig {
  building: string;
  startFloor: number;
  endFloor: number;
  genders: string[];
  sections: string[];
}

export class BulkCreateLocations {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(config: BulkLocationConfig): Promise<Location[]> {
    try {
      console.log('📦 Bulk creating locations...');
      console.log('Config:', config);

      // Validation
      if (!config.building) {
        throw new Error('Building is required');
      }
      if (config.genders.length === 0) {
        throw new Error('At least one gender type is required');
      }
      if (config.sections.length === 0) {
        throw new Error('At least one section is required');
      }

      // Get existing locations to check for duplicates
      console.log('🔍 Checking existing locations...');
      const existingLocations = await this.locationRepository.findAll();
      const existingCodes = new Set(existingLocations.map((loc) => loc.code));
      console.log(`Found ${existingCodes.size} existing location codes`);

      const locationsToCreate: LocationFormData[] = [];

      // Generate all combinations
      for (let floor = config.startFloor; floor <= config.endFloor; floor++) {
        for (const gender of config.genders) {
          for (const section of config.sections) {
            const genderPrefix = gender === 'male' ? 'M' : gender === 'female' ? 'F' : 'D';
            const baseCode = `${config.building.substring(0, 3).toUpperCase()}-${genderPrefix}${floor}-${section.toUpperCase()}`;
            const genderText =
              gender === 'male' ? 'Pria' : gender === 'female' ? 'Wanita' : 'Disabled';

            // Skip if code already exists
            if (existingCodes.has(baseCode)) {
              console.log(`⏭️ Skipping duplicate code: ${baseCode}`);
              continue;
            }

            locationsToCreate.push({
              name: `Lt. ${floor} - Toilet ${section.charAt(0).toUpperCase() + section.slice(1)} ${genderText}`,
              code: baseCode,
              floor: floor.toString(),
              section,
              building: config.building,
              area: gender,
              qr_code: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scan/${baseCode}`,
              description: `Auto-generated - ${genderText} toilet`,
              is_active: true,
            });
          }
        }
      }

      if (locationsToCreate.length === 0) {
        console.log('⚠️ No new locations to create (all codes already exist)');
        return [];
      }

      console.log(`📝 Creating ${locationsToCreate.length} new locations...`);

      // Create all locations
      const createdLocations: Location[] = [];
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const locationData of locationsToCreate) {
        try {
          const location = await this.locationRepository.create(locationData);
          createdLocations.push(location);
          successCount++;
          console.log(`✅ Created: ${locationData.code}`);
        } catch (error: any) {
          console.error(`❌ Failed to create location ${locationData.code}:`, error.message);
          errorCount++;
          errors.push(`${locationData.code}: ${error.message}`);
        }
      }

      console.log(`✅ Bulk create completed: ${successCount} success, ${errorCount} errors`);

      if (errorCount > 0) {
        console.warn('⚠️ Errors during bulk create:', errors);
        // Don't throw error, just warn - some might have succeeded
      }

      return createdLocations;
    } catch (error) {
      console.error('❌ Error in BulkCreateLocations use case:', error);
      throw error;
    }
  }
}
