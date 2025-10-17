// ===================================
// 📁 src/types/supabase.d.ts (BONUS - untuk type safety)
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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          code: string
          floor: number | null
          section: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          floor?: number | null
          section?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          floor?: number | null
          section?: string | null
          created_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          user_id: string
          location_id: string
          status: string
          assessments: Json
          overall_comment: string | null
          photo_url: string | null
          photo_metadata: Json | null
          latitude: number | null
          longitude: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location_id: string
          status: string
          assessments: Json
          overall_comment?: string | null
          photo_url?: string | null
          photo_metadata?: Json | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location_id?: string
          status?: string
          assessments?: Json
          overall_comment?: string | null
          photo_url?: string | null
          photo_metadata?: Json | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
// ===================================
// END SUPABASE TYPES
// ===================================

// The following types are adapted from src/types/interfaces.ts and src/core/types/interfaces.ts
// to ensure type safety when interacting with Supabase.