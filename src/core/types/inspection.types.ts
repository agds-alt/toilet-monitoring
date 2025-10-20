// src/core/types/inspection.types.ts
// ============================================
// TYPE DEFINITIONS FOR INSPECTION MODULE
// ============================================

export type UIMode = 'professional' | 'genz';
export type PhotoMode = 'solo' | 'batch';
export type LocationMode = 'gps' | 'qr';
export type RatingValue = 1 | 2 | 3 | 4 | 5;

// Overall Status Enum
export type InspectionStatus = 
  | 'Excellent'  // 4.5 - 5.0
  | 'Good'       // 3.5 - 4.4
  | 'Fair'       // 2.5 - 3.4
  | 'Poor'       // 1.5 - 2.4
  | 'Critical';  // 1.0 - 1.4

// ============================================
// COMPONENT TYPES
// ============================================

export interface InspectionComponent {
  id: string;
  label: string;
  label_id?: string; // Indonesian
  description?: string;
  type: 'rating';
  required: boolean;
  order: number;
  icon?: string;
}

export interface ComponentResponse {
  rating: RatingValue;
  comment?: string | null;
  photo_ids?: string[];
  timestamp?: string;
}

// ============================================
// TEMPLATE TYPES
// ============================================

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  estimated_time?: number; // in minutes
  is_active: boolean;
  is_default: boolean;
  fields: {
    components: InspectionComponent[];
  };
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// GEOLOCATION TYPES
// ============================================

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  formatted_address?: string;
  timestamp: string;
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  city?: string;
  postal_code?: string;
  floor?: string;
  building?: string;
  qr_code?: string;
}

// ============================================
// PHOTO TYPES
// ============================================

export interface PhotoMetadata {
  id: string;
  inspection_id?: string;
  location_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  field_reference: string;
  caption?: string;
  uploaded_by: string;
  uploaded_at?: string;
  cloudinary_public_id?: string;
}

export interface PhotoUploadItem {
  file: File;
  preview: string;
  fieldReference: string;
  locationId: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

// ============================================
// INSPECTION FORM TYPES
// ============================================

export interface InspectionFormData {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string; // YYYY-MM-DD
  inspection_time: string; // HH:MM:SS
  overall_status: InspectionStatus;
  responses: Record<string, ComponentResponse>;
  photo_urls: string[];
  notes?: string;
  duration_seconds: number;
  geolocation?: GeolocationData;
  submitted_at?: string;
}

export interface InspectionRecord extends InspectionFormData {
  id: string;
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface InspectionUIState {
  uiMode: UIMode;
  photoMode: PhotoMode;
  locationMode: LocationMode;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isDraft: boolean;
}

export interface InspectionFormState {
  template: InspectionTemplate | null;
  location: LocationData | null;
  responses: Record<string, ComponentResponse>;
  photos: PhotoMetadata[];
  pendingPhotos: PhotoUploadItem[];
  geolocation: GeolocationData | null;
  notes: string;
  startTime: number | null;
  uiState: InspectionUIState;
}

// ============================================
// VALIDATION TYPES
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
// DRAFT TYPES (for offline support)
// ============================================

export interface InspectionDraft {
  id: string;
  template_id: string;
  location_id: string;
  responses: Record<string, ComponentResponse>;
  photos: PhotoUploadItem[];
  notes: string;
  geolocation?: GeolocationData;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface InspectionSubmitResponse {
  success: boolean;
  data?: InspectionRecord;
  error?: string;
  message?: string;
}

export interface PhotoUploadResponse {
  success: boolean;
  data?: PhotoMetadata;
  error?: string;
}

// ============================================
// HOOK RETURN TYPES
// ============================================

export interface UseInspectionReturn {
  // State
  state: InspectionFormState;
  
  // Actions
  setUIMode: (mode: UIMode) => void;
  setPhotoMode: (mode: PhotoMode) => void;
  setLocationMode: (mode: LocationMode) => void;
  updateResponse: (componentId: string, response: Partial<ComponentResponse>) => void;
  addPhoto: (photo: PhotoUploadItem) => void;
  removePhoto: (photoId: string) => void;
  setNotes: (notes: string) => void;
  
  // Location
  fetchLocationFromQR: (qrData: string) => Promise<void>;
  getCurrentGeolocation: () => Promise<void>;
  
  // Submit
  saveDraft: () => void;
  loadDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;
  submit: () => Promise<InspectionSubmitResponse>;
  
  // Validation
  validate: () => ValidationResult;
  
  // Computed
  progress: number;
  duration: number;
  canSubmit: boolean;
}

// ============================================
// RATING EMOJI MAP
// ============================================

export const RATING_EMOJI_MAP: Record<RatingValue, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '🤩',
};

export const RATING_LABEL_MAP: Record<RatingValue, { en: string; id: string }> = {
  1: { en: 'Very Poor', id: 'Sangat Buruk' },
  2: { en: 'Poor', id: 'Kurang' },
  3: { en: 'Fair', id: 'Cukup' },
  4: { en: 'Good', id: 'Bagus' },
  5: { en: 'Excellent', id: 'Sangat Bagus' },
};