// ===================================
// FIX 8: src/core/types/interfaces.ts
// FIX imports - add enum imports
// REPLACE line 1-4
// ===================================

import { UserRole, InspectionStatus, CleanlinessValue, AromaValue, AvailabilityValue } from './enums';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  floor?: number;
  section?: string;
}

export interface AssessmentItem {
  value: CleanlinessValue | AromaValue | AvailabilityValue;
  comment?: string | null;
}

export interface Assessments {
  aroma: AssessmentItem;
  lantai: AssessmentItem;
  dinding: AssessmentItem;
  tempat_sampah: AssessmentItem;
  cermin: AssessmentItem;
  wastafel: AssessmentItem;
  sabun: AssessmentItem;
  closet: AssessmentItem;
  tissue_roll: AssessmentItem;
  urinoir: AssessmentItem;
  hand_dryer: AssessmentItem;
}

export interface PhotoMetadata {
  timestamp: string;
  gps?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };
}

export interface Inspection {
  id: string;
  userId: string;
  locationId: string;
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoUrl?: string;
  photoMetadata?: PhotoMetadata;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
}

export interface CreateInspectionDTO {
  userId: string;
  locationId: string;
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoData?: string;
  geoData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}