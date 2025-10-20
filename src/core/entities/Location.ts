// src/core/entities/Location.ts
export interface Location {
  id: string;
  name: string;
  code: string;
  floor: string;
  section: string;
  created_at: string;
  updated_at: string;
  inspection_count?: number;
  last_inspection?: string;
  average_score?: number;
}