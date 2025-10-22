// Domain Entity: Inspection (Toilet Checklist)
export interface Inspection {
  id: string;
  locationId: string;
  userId: string;
  templateId: string;
  inspectionDate: Date;
  inspectionTime: string;
  overallStatus: InspectionStatus;
  responses: InspectionResponse[];
  notes?: string;
  photoUrls: string[];
  durationSeconds?: number;
  submittedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
}

export type InspectionStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface InspectionResponse {
  fieldId: string;
  fieldName: string;
  value: string | number | boolean;
  notes?: string;
}

export class InspectionEntity implements Inspection {
  constructor(
    public readonly id: string,
    public readonly locationId: string,
    public readonly userId: string,
    public readonly templateId: string,
    public readonly inspectionDate: Date,
    public readonly inspectionTime: string,
    public readonly overallStatus: InspectionStatus,
    public readonly responses: InspectionResponse[],
    public readonly notes: string | undefined,
    public readonly photoUrls: string[],
    public readonly durationSeconds: number | undefined,
    public readonly submittedAt: Date | undefined,
    public readonly verifiedAt: Date | undefined,
    public readonly verifiedBy: string | undefined,
    public readonly verificationNotes: string | undefined
  ) {}

  static create(data: Omit<Inspection, 'id' | 'submittedAt' | 'verifiedAt' | 'verifiedBy' | 'verificationNotes'>): InspectionEntity {
    return new InspectionEntity(
      crypto.randomUUID(),
      data.locationId,
      data.userId,
      data.templateId,
      data.inspectionDate,
      data.inspectionTime,
      data.overallStatus,
      data.responses,
      data.notes,
      data.photoUrls,
      data.durationSeconds,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  submit(): InspectionEntity {
    return new InspectionEntity(
      this.id,
      this.locationId,
      this.userId,
      this.templateId,
      this.inspectionDate,
      this.inspectionTime,
      this.overallStatus,
      this.responses,
      this.notes,
      this.photoUrls,
      this.durationSeconds,
      new Date(),
      this.verifiedAt,
      this.verifiedBy,
      this.verificationNotes
    );
  }

  addPhoto(photoUrl: string): InspectionEntity {
    return new InspectionEntity(
      this.id,
      this.locationId,
      this.userId,
      this.templateId,
      this.inspectionDate,
      this.inspectionTime,
      this.overallStatus,
      this.responses,
      this.notes,
      [...this.photoUrls, photoUrl],
      this.durationSeconds,
      this.submittedAt,
      this.verifiedAt,
      this.verifiedBy,
      this.verificationNotes
    );
  }

  updateResponse(fieldId: string, value: string | number | boolean, notes?: string): InspectionEntity {
    const updatedResponses = this.responses.map(response => 
      response.fieldId === fieldId 
        ? { ...response, value, notes }
        : response
    );

    // If field doesn't exist, add it
    if (!updatedResponses.some(r => r.fieldId === fieldId)) {
      updatedResponses.push({ fieldId, fieldName: '', value, notes });
    }

    return new InspectionEntity(
      this.id,
      this.locationId,
      this.userId,
      this.templateId,
      this.inspectionDate,
      this.inspectionTime,
      this.overallStatus,
      updatedResponses,
      this.notes,
      this.photoUrls,
      this.durationSeconds,
      this.submittedAt,
      this.verifiedAt,
      this.verifiedBy,
      this.verificationNotes
    );
  }

  calculateOverallStatus(): InspectionStatus {
    // Simple logic to determine overall status based on responses
    const criticalCount = this.responses.filter(r => r.value === 'critical').length;
    const poorCount = this.responses.filter(r => r.value === 'poor').length;
    const fairCount = this.responses.filter(r => r.value === 'fair').length;
    const goodCount = this.responses.filter(r => r.value === 'good').length;
    const excellentCount = this.responses.filter(r => r.value === 'excellent').length;

    if (criticalCount > 0) return 'critical';
    if (poorCount > 2) return 'poor';
    if (fairCount > 3) return 'fair';
    if (goodCount > excellentCount) return 'good';
    return 'excellent';
  }

  isSubmitted(): boolean {
    return this.submittedAt !== undefined;
  }

  isVerified(): boolean {
    return this.verifiedAt !== undefined;
  }
}
