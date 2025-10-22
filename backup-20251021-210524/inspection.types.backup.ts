// src/core/types/inspection.types.aligned.ts
// ============================================
// ALIGNED INSPECTION TYPES - Based on Supabase Schema
// ============================================

import {
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  Location,
  Photo,
} from '@/infrastructure/database/supabase';

// ============================================
// RE-EXPORT SUPABASE TYPES
// ============================================

export type {
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  Location,
  Photo,
};

// ============================================
// COMPONENT TYPES (From Template JSONB Fields)
// ============================================

export interface InspectionComponent {
  id: string;
  label: string;
  label_id?: string;
  description?: string;
  type: 'rating'; // Only rating for now
  required: boolean;
  order: number;
  icon?: string;
}

export interface InspectionTemplateFields {
  components: InspectionComponent[];
}

// ============================================
// RESPONSE TYPES
// ============================================

export type RatingValue = 'clean' | 'needs_work' | 'dirty';

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[]; // URLs after upload
}

export type InspectionResponses = Record<string, ComponentResponse>;

// ============================================
// UI STATE TYPES
// ============================================

export type UIMode = 'genz' | 'professional';
export type PhotoMode = 'solo' | 'batch';
export type LocationMode = 'qr' | 'gps' | 'manual';

export interface InspectionUIState {
  uiMode: UIMode;
  photoMode: PhotoMode;
  locationMode: LocationMode;
}

// ============================================
// PHOTO TYPES (Before Upload)
// ============================================

export interface PendingPhoto {
  file: File;
  preview: string; // Blob URL
  fieldReference: string; // Component ID
}

// ============================================
// GEOLOCATION TYPES
// ============================================

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// ============================================
// FORM STATE
// ============================================

export interface InspectionFormState {
  // Template & Location
  template: InspectionTemplate | null;
  location: Location | null;

  // Responses
  responses: InspectionResponses;
  notes: string;

  // Photos
  pendingPhotos: PendingPhoto[];

  // Geolocation
  geolocation: GeolocationData | null;

  // UI
  uiState: InspectionUIState;

  // Timer
  startTime: number | null;
  duration: number;
}

// ============================================
// VALIDATION
// ============================================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================
// SUBMISSION RESULT
// ============================================

export interface InspectionSubmitResult {
  success: boolean;
  data?: InspectionRecord;
  error?: string;
}

// ============================================
// DTO FOR API
// ============================================

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string; // YYYY-MM-DD
  inspection_time: string; // HH:MM:SS
  overall_status: 'clean' | 'needs_work' | 'dirty';
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
  geolocation?: GeolocationData | null;
}

// ============================================
// TEMPLATE WITH PARSED FIELDS
// ============================================

export interface InspectionTemplateWithComponents extends Omit<InspectionTemplate, 'fields'> {
  fields: InspectionTemplateFields;
}

// ============================================
// CONSTANTS
// ============================================

export const RATING_VALUES: RatingValue[] = ['clean', 'needs_work', 'dirty'];

export const RATING_LABELS = {
  clean: 'Bersih',
  needs_work: 'Perlu Perbaikan',
  dirty: 'Kotor',
} as const;

export const RATING_EMOJIS = {
  clean: '😊',
  needs_work: '😐',
  dirty: '😢',
} as const;

export const RATING_STARS = {
  clean: 5,
  needs_work: 3,
  dirty: 1,
} as const;

// ============================================
// TYPE GUARDS
// ============================================

export function isValidRating(value: any): value is RatingValue {
  return RATING_VALUES.includes(value);
}

export function hasRequiredFields(
  responses: InspectionResponses,
  components: InspectionComponent[]
): boolean {
  const requiredIds = components.filter((c) => c.required).map((c) => c.id);

  return requiredIds.every((id) => {
    const response = responses[id];
    return response && isValidRating(response.rating);
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateOverallStatus(
  responses: InspectionResponses
): 'clean' | 'needs_work' | 'dirty' {
  const ratings = Object.values(responses)
    .map((r) => r.rating)
    .filter(Boolean) as RatingValue[];

  if (ratings.length === 0) {
    return 'clean'; // Default
  }

  const dirtyCount = ratings.filter((r) => r === 'dirty').length;
  const needsWorkCount = ratings.filter((r) => r === 'needs_work').length;

  if (dirtyCount > 0) {
    return 'dirty';
  }

  if (needsWorkCount > 0) {
    return 'needs_work';
  }

  return 'clean';
}

export function calculateProgress(responses: InspectionResponses, totalComponents: number): number {
  if (totalComponents === 0) return 0;

  const completedCount = Object.values(responses).filter((r) => r.rating !== null).length;

  return Math.round((completedCount / totalComponents) * 100);
}

// ============================================
// PHOTO UPLOAD HELPERS
// ============================================

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

export async function uploadPhotoToCloudinary(
  file: File,
  cloudName: string,
  uploadPreset: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload photo');
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data.secure_url;
}

// ============================================
// VALIDATION HELPERS
// ============================================

export function validateInspectionForm(state: InspectionFormState): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check template
  if (!state.template) {
    errors.push({
      field: 'template',
      message: 'Template tidak ditemukan',
      severity: 'error',
    });
  }

  // Check location
  if (!state.location) {
    errors.push({
      field: 'location',
      message: 'Lokasi harus dipilih',
      severity: 'error',
    });
  }

  // Check required components
  if (state.template) {
    const fields = state.template.fields as any as InspectionTemplateFields;
    const requiredComponents = fields.components.filter((c) => c.required);

    for (const component of requiredComponents) {
      const response = state.responses[component.id];

      if (!response || !response.rating) {
        errors.push({
          field: component.id,
          message: `${component.label} harus diisi`,
          severity: 'error',
        });
      }
    }
  }

  // Warnings for missing photos
  const componentsWithoutPhotos = Object.entries(state.responses).filter(
    ([_, response]) => !response.photos || response.photos.length === 0
  ).length;

  if (componentsWithoutPhotos > 0 && state.pendingPhotos.length === 0) {
    warnings.push({
      field: 'photos',
      message: 'Tidak ada foto yang dilampirkan',
      severity: 'warning',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_INSPECTION_STATE: InspectionFormState = {
  template: null,
  location: null,
  responses: {},
  notes: '',
  pendingPhotos: [],
  geolocation: null,
  uiState: {
    uiMode: 'genz',
    photoMode: 'batch',
    locationMode: 'qr',
  },
  startTime: null,
  duration: 0,
};
