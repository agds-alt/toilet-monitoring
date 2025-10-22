// src/core/types/inspection.types.ts
import {
  InspectionRecord,
  InspectionRecordInsert,
  InspectionTemplate,
  Location,
  Photo,
} from './database.types';

export type { InspectionRecord, InspectionTemplate, Location, Photo };

// ============================================
// TEMPLATE STRUCTURE
// ============================================

export interface InspectionComponent {
  id: string;
  label: string;
  label_id?: string;
  type: 'rating';
  required: boolean;
  order: number;
  icon?: string;
  description?: string; // ← Added this
}

export interface InspectionTemplateFields {
  components: InspectionComponent[];
}

// ============================================
// RATING TYPES
// ============================================

export type RatingValue = 'clean' | 'needs_work' | 'dirty';
export type OverallStatus = RatingValue;

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[];
}

export type InspectionResponses = Record<string, ComponentResponse>;

// ============================================
// UI STATE
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
// PHOTO TYPES
// ============================================

export interface PendingPhoto {
  file: File;
  preview: string;
  fieldReference: string;
}

export interface PhotoUploadItem {
  file: File;
  preview: string;
  fieldReference: string;
}

export interface PhotoMetadata {
  inspectionId?: string;
  locationId?: string;
  componentId?: string;
  uploadedBy?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// ============================================
// GEOLOCATION
// ============================================

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  formatted_address?: string; // ← Added for useGeolocation
}

// ============================================
// FORM STATE
// ============================================

export interface InspectionFormState {
  templateId: string;
  locationId: string | null;
  userId: string;

  template: InspectionTemplate | null;
  location: Location | null;
  components: InspectionComponent[];

  responses: InspectionResponses;
  notes: string;
  pendingPhotos: PendingPhoto[];

  geolocation: GeolocationData | null;
  startTime: number;
  duration: number;

  uiState: InspectionUIState;
}

export type InspectionFormData = InspectionFormState;
export type InspectionDraft = Partial<InspectionFormState>;

// ============================================
// DTOs
// ============================================

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: OverallStatus;
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
  geolocation?: any;
}

export interface UpdateInspectionDTO {
  overall_status?: OverallStatus;
  responses?: InspectionResponses;
  photo_urls?: string[];
  notes?: string | null;
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
// API RESPONSES
// ============================================

export interface InspectionSubmitResult {
  success: boolean;
  data?: InspectionRecord;
  inspectionId?: string;
  error?: string;
}

// ============================================
// HOOKS
// ============================================

export interface UseInspectionReturn {
  state: InspectionFormState;
  updateResponse: (componentId: string, data: Partial<ComponentResponse>) => void;
  addPhoto: (file: File, componentId: string) => void;
  removePhoto: (photoId: string) => void;
  submit: () => Promise<InspectionSubmitResult>;
  reset: () => void;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// FILTERS
// ============================================

export interface InspectionFilters {
  locationId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: OverallStatus;
}
