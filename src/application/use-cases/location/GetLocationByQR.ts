// Use Case: GetLocationByQR
import { LocationEntity } from '../../../domain/entities/Location';
import { ILocationRepository } from '../../interfaces/repositories/ILocationRepository';

export interface GetLocationByQRRequest {
  qrCode: string;
}

export interface GetLocationByQRResponse {
  location: LocationEntity;
}

export class GetLocationByQR {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(request: GetLocationByQRRequest): Promise<GetLocationByQRResponse> {
    const location = await this.locationRepository.findByQRCode(request.qrCode);
    
    if (!location) {
      throw new Error('Location not found');
    }

    if (!location.isActive) {
      throw new Error('Location is deactivated');
    }

    return {
      location
    };
  }
}
