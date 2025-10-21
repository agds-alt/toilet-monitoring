// src/infrastructure/database/supabase.ts
// ============================================
// SUPABASE CLIENT - COMPLETE TYPE EXPORTS
// ============================================

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/core/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// ✅ CREATE CLIENT WITH DATABASE TYPES
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'toilet-monitoring-auth',
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
});

// ✅ EXPORT TYPE HELPERS
export type SupabaseClient = typeof supabase;

// ✅ COMPLETE TABLE TYPES
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];
export type AuditLogUpdate = Database['public']['Tables']['audit_logs']['Update'];

export type InspectionRecord = Database['public']['Tables']['inspection_records']['Row'];
export type InspectionRecordInsert = Database['public']['Tables']['inspection_records']['Insert'];
export type InspectionRecordUpdate = Database['public']['Tables']['inspection_records']['Update'];

export type InspectionTemplate = Database['public']['Tables']['inspection_templates']['Row'];
export type InspectionTemplateInsert = Database['public']['Tables']['inspection_templates']['Insert'];
export type InspectionTemplateUpdate = Database['public']['Tables']['inspection_templates']['Update'];

export type Location = Database['public']['Tables']['locations']['Row'];
export type LocationInsert = Database['public']['Tables']['locations']['Insert'];
export type LocationUpdate = Database['public']['Tables']['locations']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

export type Photo = Database['public']['Tables']['photos']['Row'];
export type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
export type PhotoUpdate = Database['public']['Tables']['photos']['Update'];

export type Role = Database['public']['Tables']['roles']['Row'];
export type RoleInsert = Database['public']['Tables']['roles']['Insert'];
export type RoleUpdate = Database['public']['Tables']['roles']['Update'];

export type TemplateLocationAssignment = Database['public']['Tables']['template_location_assignments']['Row'];
export type TemplateLocationAssignmentInsert = Database['public']['Tables']['template_location_assignments']['Insert'];
export type TemplateLocationAssignmentUpdate = Database['public']['Tables']['template_location_assignments']['Update'];

export type TemplateRoleAssignment = Database['public']['Tables']['template_role_assignments']['Row'];
export type TemplateRoleAssignmentInsert = Database['public']['Tables']['template_role_assignments']['Insert'];
export type TemplateRoleAssignmentUpdate = Database['public']['Tables']['template_role_assignments']['Update'];

export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert'];
export type UserRoleUpdate = Database['public']['Tables']['user_roles']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// ✅ VIEW TYPES
export type DailyInspectionSummary = Database['public']['Views']['daily_inspection_summary']['Row'];

// ✅ FUNCTION TYPES
export type UserHasRoleLevelFunction = Database['public']['Functions']['user_has_role_level'];
export type UserHasAnyRoleLevelFunction = Database['public']['Functions']['user_has_any_role_level'];

// ✅ JSON TYPE
export type { Json } from '@/core/types/database.types';