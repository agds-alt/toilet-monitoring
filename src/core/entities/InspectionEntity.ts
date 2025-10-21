// src/core/entities/InspectionEntity.ts
export class InspectionEntity {
  id: string;
  templateId: string;
  userId: string;
  locationId: string;
  inspectionDate: string;
  inspectionTime: string;
  overallStatus: string;
  responses: Record<string, any>;
  photoUrls: string[];
  notes: string | null;
  durationSeconds: number | null;

  constructor(data: any) {
    this.id = data.id;
    this.templateId = data.template_id || data.templateId;
    this.userId = data.user_id || data.userId;
    this.locationId = data.location_id || data.locationId;
    this.inspectionDate = data.inspection_date || data.inspectionDate;
    this.inspectionTime = data.inspection_time || data.inspectionTime;
    this.overallStatus = data.overall_status || data.overallStatus;
    this.responses = data.responses;
    this.photoUrls = data.photo_urls || data.photoUrls || [];
    this.notes = data.notes || null;
    this.durationSeconds = data.duration_seconds || data.durationSeconds || null;
  }

  static create(data: any): InspectionEntity {
    return new InspectionEntity(data);
  }

  toJSON() {
    return {
      id: this.id,
      template_id: this.templateId,
      user_id: this.userId,
      location_id: this.locationId,
      inspection_date: this.inspectionDate,
      inspection_time: this.inspectionTime,
      overall_status: this.overallStatus,
      responses: this.responses,
      photo_urls: this.photoUrls,
      notes: this.notes,
      duration_seconds: this.durationSeconds,
    };
  }
}
