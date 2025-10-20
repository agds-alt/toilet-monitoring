// ===================================
// 📁 src/types/supabase.d.ts - UPDATED TO NEW SCHEMA
// ===================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {

      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          phone: string | null
          profile_photo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          email: string
          password_hash: string
          full_name: string
          phone?: string | null
          profile_photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          phone?: string | null
          profile_photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      
      // ===================================
      // ROLES TABLE (new)
      // ===================================
      roles: {
        Row: {
          id: string
          name: string
          display_name: string
          level: 'super_admin' | 'admin' | 'user'
          description: string | null
          color: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          level: 'super_admin' | 'admin' | 'user'
          description?: string | null
          color?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          display_name?: string
          level?: 'super_admin' | 'admin' | 'user'
          description?: string | null
          color?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      
      // ===================================
      // USER_ROLES TABLE (new)
      // ===================================
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: never
      }
      
      // ===================================
      // LOCATIONS TABLE (updated)
      // ===================================
      locations: {
        Row: {
          id: string
          name: string
          area: string | null
          floor: string | null
          building: string | null
          qr_code: string
          description: string | null
          photo_url: string | null
          coordinates: Json | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          area?: string | null
          floor?: string | null
          building?: string | null
          qr_code: string
          description?: string | null
          photo_url?: string | null
          coordinates?: Json | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          area?: string | null
          floor?: string | null
          building?: string | null
          qr_code?: string
          description?: string | null
          photo_url?: string | null
          coordinates?: Json | null
          is_active?: boolean
          updated_at?: string
        }
      }
      
      // ===================================
      // INSPECTION_TEMPLATES TABLE (new)
      // ===================================
      inspection_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          estimated_time: number | null
          is_active: boolean
          is_default: boolean
          fields: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          estimated_time?: number | null
          is_active?: boolean
          is_default?: boolean
          fields: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          estimated_time?: number | null
          is_active?: boolean
          is_default?: boolean
          fields?: Json
          updated_at?: string
        }
      }
      
      // ===================================
      // INSPECTION_RECORDS TABLE (was inspections)
      // ===================================
      inspection_records: {
        Row: {
          id: string
          template_id: string
          location_id: string
          user_id: string
          inspection_date: string
          inspection_time: string
          overall_status: 'Clean' | 'Needs Work' | 'Dirty'
          responses: Json
          photo_urls: string[]
          notes: string | null
          duration_seconds: number | null
          submitted_at: string
          verified_by: string | null
          verified_at: string | null
          verification_notes: string | null
        }
        Insert: {
          id?: string
          template_id: string
          location_id: string
          user_id: string
          inspection_date: string
          inspection_time: string
          overall_status: 'Clean' | 'Needs Work' | 'Dirty'
          responses: Json
          photo_urls?: string[]
          notes?: string | null
          duration_seconds?: number | null
          submitted_at?: string
          verified_by?: string | null
          verified_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          overall_status?: 'Clean' | 'Needs Work' | 'Dirty'
          responses?: Json
          photo_urls?: string[]
          notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          verification_notes?: string | null
        }
      }
      
      // ===================================
      // PHOTOS TABLE (new)
      // ===================================
      photos: {
        Row: {
          id: string
          inspection_id: string | null
          location_id: string | null
          file_url: string
          file_name: string | null
          file_size: number | null
          mime_type: string | null
          caption: string | null
          field_reference: string | null
          uploaded_by: string | null
          uploaded_at: string
          is_deleted: boolean
          deleted_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          inspection_id?: string | null
          location_id?: string | null
          file_url: string
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          caption?: string | null
          field_reference?: string | null
          uploaded_by?: string | null
          uploaded_at?: string
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
        }
        Update: {
          caption?: string | null
          is_deleted?: boolean
          deleted_by?: string | null
          deleted_at?: string | null
        }
      }
      
      // ===================================
      // NOTIFICATIONS TABLE (new)
      // ===================================
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          inspection_id: string | null
          location_id: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          inspection_id?: string | null
          location_id?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          is_read?: boolean
          read_at?: string | null
        }
      }
      
      // ===================================
      // AUDIT_LOGS TABLE (new)
      // ===================================
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: 'CREATE' | 'UPDATE' | 'DELETE'
          entity_type: string
          entity_id: string
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: 'CREATE' | 'UPDATE' | 'DELETE'
          entity_type: string
          entity_id: string
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: {
      // ===================================
      // DAILY_INSPECTION_SUMMARY VIEW (new)
      // ===================================
      daily_inspection_summary: {
        Row: {
          inspection_date: string
          location_id: string
          location_name: string
          total_inspections: number
          clean_count: number
          needs_work_count: number
          dirty_count: number
          avg_duration_seconds: number
          cleaners: string[]
        }
      }
    }
    Functions: {
      // ===================================
      // HELPER FUNCTIONS (new)
      // ===================================
      user_has_role_level: {
        Args: {
          required_level: string
        }
        Returns: boolean
      }
      user_has_any_role_level: {
        Args: {
          required_levels: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ===================================
// TYPE HELPERS
// ===================================

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updateable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// ===================================
// BACKWARD COMPATIBILITY (temporary)
// Keep old 'inspections' type for existing code
// TODO: Remove after full migration
// ===================================

export type Inspection = Tables<'inspection_records'>
export type InsertInspection = Insertable<'inspection_records'>
export type UpdateInspection = Updateable<'inspection_records'>

// ===================================
// END SUPABASE TYPES
// ===================================