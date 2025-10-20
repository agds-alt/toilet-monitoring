
// ===================================
// 📁 src/core/use-cases/CreateLocation.ts
// ===================================
import { ILocationRepository } from '@/core/repositories/ILocationRepository';
import { Location, LocationFormData } from '@/core/entities/Location';

export class CreateLocation {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(locationData: LocationFormData, skipDuplicateCheck = false): Promise<Location> {
    try {
      console.log('📝 Creating location:', locationData.name);

      // Validation
      if (!locationData.name) {
        throw new Error('Location name is required');
      }

      // Auto-generate code if not provided
      if (!locationData.code) {
        locationData.code = this.generateCode(locationData);
        console.log('🔧 Auto-generated code:', locationData.code);
      }

      // Auto-generate QR code URL if not provided
      if (!locationData.qr_code && locationData.code) {
        locationData.qr_code = this.generateQRCode(locationData.code);
        console.log('🔧 Auto-generated QR:', locationData.qr_code);
      }

      // Check if code already exists (unless skipped)
      if (!skipDuplicateCheck) {
        const locations = await this.locationRepository.findAll();
        const codeExists = locations.some(loc => loc.code === locationData.code);
        
        if (codeExists) {
          throw new Error(`Location code "${locationData.code}" already exists`);
        }
      }

      // Create location
      const location = await this.locationRepository.create(locationData);
      
      console.log('✅ Location created:', location.id);
      return location;
    } catch (error) {
      console.error('❌ Error in CreateLocation use case:', error);
      throw error;
    }
  }

  private generateCode(data: LocationFormData): string {
    const buildingPrefix = data.building?.substring(0, 3).toUpperCase() || 'LOC';
    const floorNum = data.floor || '0';
    const sectionSuffix = data.section ? `-${data.section.toUpperCase()}` : '';
    const timestamp = Date.now().toString().slice(-4);
    
    return `${buildingPrefix}-${floorNum}${sectionSuffix}-${timestamp}`;
  }

  private generateQRCode(code: string): string {
    // Generate QR code URL
    // This will be used by QR scanner to navigate
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/scan/${code}`;
  }
}
