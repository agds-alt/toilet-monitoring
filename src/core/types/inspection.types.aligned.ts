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

export type {
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  Location,
  Photo,
};

export interface InspectionComponent {
  id: string;
  label: string;
  label_id?: string;
  type: 'rating';
  required: boolean;
  order: number;
  icon?: string;
}

export interface InspectionTemplateFields {
  components: InspectionComponent[];
}

export type RatingValue = 'clean' | 'needs_work' | 'dirty';

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[];
}

export type InspectionResponses = Record<string, ComponentResponse>;

export type UIMode = 'genz' | 'professional';
export type PhotoMode = 'solo' | 'batch';
export type LocationMode = 'qr' | 'gps' | 'manual';

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: 'clean' | 'needs_work' | 'dirty';
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
  geolocation?: any;
}
