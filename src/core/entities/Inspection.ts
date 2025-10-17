// ===================================
// FIX 9: src/core/entities/Inspection.ts
// FIX imports
// REPLACE line 1-3
// ===================================

import { InspectionStatus, CleanlinessValue, AromaValue, AvailabilityValue } from '@/core/types/enums';
import { Inspection, Assessments, CreateInspectionDTO, PhotoMetadata } from '@/core/types/interfaces';

export class InspectionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly locationId: string,
    public readonly status: InspectionStatus,
    public readonly assessments: Assessments,
    public readonly createdAt: Date,
    public readonly overallComment?: string,
    public readonly photoUrl?: string,
    public readonly photoMetadata?: PhotoMetadata,
    public readonly latitude?: number,
    public readonly longitude?: number
  ) {}

  static create(dto: CreateInspectionDTO): InspectionEntity {
    return new InspectionEntity(
      crypto.randomUUID(),
      dto.userId,
      dto.locationId,
      dto.status,
      dto.assessments,
      new Date(),
      dto.overallComment,
      undefined,
      dto.geoData ? {
        timestamp: new Date().toISOString(),
        gps: dto.geoData
      } : undefined,
      dto.geoData?.latitude,
      dto.geoData?.longitude
    );
  }

  hasIssues(): boolean {
    return this.status === InspectionStatus.HAS_ISSUES;
  }

  getIssueCount(): number {
    if (!this.hasIssues()) return 0;
    
    return Object.values(this.assessments).filter(
      (item) => item.value !== CleanlinessValue.CLEAN && 
                item.value !== AromaValue.FRAGRANT &&
                item.value !== AvailabilityValue.AVAILABLE
    ).length;
  }

  toJSON(): Inspection {
    return {
      id: this.id,
      userId: this.userId,
      locationId: this.locationId,
      status: this.status,
      assessments: this.assessments,
      overallComment: this.overallComment,
      photoUrl: this.photoUrl,
      photoMetadata: this.photoMetadata,
      latitude: this.latitude,
      longitude: this.longitude,
      createdAt: this.createdAt
    };
  }
}
// ===================================
// END FIX 9
// ===================================