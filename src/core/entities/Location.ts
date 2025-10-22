import { Json } from '@/core/types/database.types';

export interface Location {
  // Sesuai database.types.ts locations.Row
  id: string;
  name: string;
  code: string | null;
  floor: string | null;
  section: string | null;
  building: string | null;
  area: string | null;
  qr_code: string;
  description: string | null;
  coordinates: Json | null;
  photo_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
  created_by: string | null;
  updated_at: string | null;
}

export interface LocationFormData {
  name: string;
  code?: string | null;
  floor?: string | null;
  section?: string | null;
  building?: string | null;
  area?: string | null;
  qr_code: string;
  description?: string | null;
  coordinates?: Json | null;
  photo_url?: string | null;
  is_active?: boolean;
  created_by?: string | null;
}

export interface LocationWithDetails extends Location {
  inspection_stats?: {
    total_inspections: number;
    clean_count: number;
    dirty_count: number;
    needs_work_count: number;
  };
}
