// 📁 src/core/entities/InspectionTemplate.ts
import { Json } from '@/core/types/database.types';

export interface InspectionTemplate {
  id: string;
  name: string;
  description: string | null;
  fields: Json;
  estimated_time: number | null;
  is_active: boolean | null;
  is_default: boolean | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}
