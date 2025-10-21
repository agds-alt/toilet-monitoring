// src/core/types/database.types.ts
import type { Database } from '@/supabase.types';

export type { Database };
export type Json = Database['public']['Tables']['inspection_records']['Row']['responses'];

// TABLE TYPES
export type InspectionRecord = Database['public']['Tables']['inspection_records']['Row'];
export type InspectionRecordInsert = Database['public']['Tables']['inspection_records']['Insert'];
export type InspectionRecordUpdate = Database['public']['Tables']['inspection_records']['Update'];

export type InspectionTemplate = Database['public']['Tables']['inspection_templates']['Row'];
export type InspectionTemplateInsert = Database['public']['Tables']['inspection_templates']['Insert'];
export type InspectionTemplateUpdate = Database['public']['Tables']['inspection_templates']['Update'];

export type Location = Database['public']['Tables']['locations']['Row'];
export type LocationInsert = Database['public']['Tables']['locations']['Insert'];
export type LocationUpdate = Database['public']['Tables']['locations']['Update'];

export type Photo = Database['public']['Tables']['photos']['Row'];
export type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
export type PhotoUpdate = Database['public']['Tables']['photos']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Role = Database['public']['Tables']['roles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

export type DailyInspectionSummary = Database['public']['Views']['daily_inspection_summary']['Row'];
