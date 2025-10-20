// src/core/entities/Inspection.ts
export interface Inspection {
  id: string;
  templateId: string;
  locationId: string;
  userId: string;
  inspectionDate: Date;
  inspectionTime: string;
  overallStatus: 'Clean' | 'Needs Work' | 'Dirty';
  responses: Record<string, any>; // Dynamic based on template
  photoUrls: string[];
  notes?: string;
  durationSeconds?: number;
  submittedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
}