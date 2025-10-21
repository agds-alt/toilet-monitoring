// 📁 src/core/entities/Assessment.ts
import { Json } from '@/core/types/database.types';

export interface Assessment {
  inspection_id: string;
  location_id: string;
  template_id: string;
  user_id: string;
  responses: Json;
  overall_status: string;
  notes?: string | null;
  photo_urls?: string[] | null;
  duration_seconds?: number;
}