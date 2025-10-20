// ===================================
// 📁 src/core/entities/Location.ts - UPDATED INTERFACE
// ===================================
export interface Location {
  id: string;
  name: string;
  code: string | null;
  floor: string | null;
  section: string | null;
  building: string | null;
  area: string | null;
  qr_code: string | null;
  description: string | null;
  photo_url: string | null;
  coordinates: { lat: number; lng: number } | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocationFormData {
  name: string;
  code?: string;
  floor?: string;
  section?: string;
  building?: string;
  area?: string;
  qr_code?: string;
  description?: string;
  photo_url?: string;
  coordinates?: { lat: number; lng: number } | null;
  is_active?: boolean;
}

export interface LocationWithDetails extends Location {
  inspection_count?: number;
  last_inspection?: string;
  average_score?: number;
}