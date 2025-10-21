// src/core/types/interfaces.ts
import {
  UserRole,
  InspectionStatus,
  CleanlinessValue,
  AromaValue,
  AvailabilityValue,
} from './enums';

// ✅ Re-export enums agar bisa di-import dari interfaces
export { UserRole, InspectionStatus, CleanlinessValue, AromaValue, AvailabilityValue };

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

// ✅ GeoData interface - EXPORTED dan accuracy OPTIONAL
export interface GeoData {
  latitude: number;
  longitude: number;
  accuracy?: number; // Optional karena tidak selalu tersedia
}

export interface PhotoMetadata {
  timestamp: string;
  gps?: GeoData;
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

// ✅ CreateInspectionDTO menggunakan GeoData interface
export interface CreateInspectionDTO {
  userId: string;
  locationId: string;
  status: InspectionStatus;
  assessments: Assessments;
  overallComment?: string;
  photoData?: string;
  geoData?: GeoData; // Using the GeoData interface
}
