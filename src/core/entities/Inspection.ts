// 📁 src/core/entities/Inspection.ts
import { Json } from '@/core/types/database.types';

export interface Inspection {
  id: string;
  inspection_date: string;
  inspection_time: string;
  location_id: string;
  template_id: string;
  user_id: string;
  overall_status: string;
  responses: Json;
  duration_seconds: number | null;
  notes: string | null;
  photo_urls: string[] | null;
  submitted_at: string | null;
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;
}

export interface InspectionWithDetails extends Inspection {
  location_name: string;
  user_name: string;
  template_name: string;
  verified_by_name: string | null;
}