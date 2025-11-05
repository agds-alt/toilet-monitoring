// Minimal inspection types for build compatibility

export type RatingValue = 1 | 2 | 3 | 4 | 5;

// Re-export CreateInspectionDTO from its actual location
export type { CreateInspectionDTO } from '@/core/dtos/CreateInspectionDTO';

export type InspectionResponses = Array<InspectionResponse>;

export interface InspectionComponent {
  id: string;
  label: string;
  type: 'rating' | 'checkbox' | 'text';
  required?: boolean;
  order?: number;
}

export interface InspectionResponse {
  componentId: string;
  value?: RatingValue | boolean | string;
  rating?: RatingValue | null;
  notes?: string;
}

export interface InspectionValidation {
  isValid: boolean;
  errors: { field: string; message: string }[];
  warnings: { field: string; message: string }[];
}

export interface PhotoUploadItem {
  fieldReference: string;
  file: File | Blob;
}

export interface PhotoMetadata {
  locationId?: string;
  inspectionId?: string;
  uploadedBy: string;
}

export interface CloudinaryUploadResponse {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

// Additional types for type-helpers
export type ComponentResponse = InspectionResponse;

export interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  estimatedTime: number;  // camelCase - required by domain service
  estimated_time?: number; // snake_case for DB compatibility
  is_active?: boolean;
  is_default?: boolean;
  fields: { components: InspectionComponent[] } | InspectionComponent[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InspectionRecord {
  id: string;
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: 'pass' | 'fail' | 'needs_attention';
  responses: Record<string, ComponentResponse>;
  photo_urls: string[];
  notes?: string;
  duration_seconds?: number;
  submitted_at?: string;
  verified_by?: string;
  verified_at?: string;
  verification_notes?: string;
}
