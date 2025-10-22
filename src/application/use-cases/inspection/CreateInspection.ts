// Use Case: CreateInspection
import { InspectionEntity, InspectionResponse } from '../../../domain/entities/Inspection';
import { IInspectionRepository } from '../../interfaces/repositories/IInspectionRepository';
import { ILocationRepository } from '../../interfaces/repositories/ILocationRepository';
import { InspectionService } from '../../../domain/services/InspectionService';

export interface CreateInspectionRequest {
  locationId: string;
  userId: string;
  templateId: string;
  inspectionDate: Date;
  inspectionTime: string;
  responses: InspectionResponse[];
  notes?: string;
}

export interface CreateInspectionResponse {
  inspection: InspectionEntity;
}

export class CreateInspection {
  constructor(
    private inspectionRepository: IInspectionRepository,
    private locationRepository: ILocationRepository
  ) {}

  async execute(request: CreateInspectionRequest): Promise<CreateInspectionResponse> {
    // Validate location exists
    const location = await this.locationRepository.findById(request.locationId);
    if (!location) {
      throw new Error('Location not found');
    }

    if (!location.isActive) {
      throw new Error('Location is deactivated');
    }

    // Calculate overall status
    const overallStatus = InspectionService.calculateOverallStatus(request.responses);

    // Create inspection entity
    const inspection = InspectionEntity.create({
      locationId: request.locationId,
      userId: request.userId,
      templateId: request.templateId,
      inspectionDate: request.inspectionDate,
      inspectionTime: request.inspectionTime,
      overallStatus,
      responses: request.responses,
      notes: request.notes,
      photoUrls: [],
      durationSeconds: undefined
    });

    // Save to repository
    const savedInspection = await this.inspectionRepository.create(inspection);

    return {
      inspection: savedInspection
    };
  }
}
