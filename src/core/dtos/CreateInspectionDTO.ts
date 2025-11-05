// 📁 src/core/dtos/CreateInspectionDTO.ts
import { Json } from '@/core/types/supabase.types';

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: string; // Sesuai database: string (bukan enum terbatas)
  responses: Json; // Sesuai database: Json
  duration_seconds?: number | null;
  notes?: string | null;
  photo_urls?: string[] | null;
  // Tidak ada geolocation di database
}
