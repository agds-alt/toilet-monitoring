// src/infrastructure/database/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: string;
        };
        Update: {
          full_name?: string;
          role?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          code: string;
          floor?: number;
          section?: string;
          created_at: string;
        };
      };
      inspections: {
        Row: {
          id: string;
          user_id: string;
          location_id: string;
          status: string;
          assessments: any;
          overall_comment?: string;
          photo_url?: string;
          photo_metadata?: any;
          latitude?: number;
          longitude?: number;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          location_id: string;
          status: string;
          assessments: any;
          overall_comment?: string;
          photo_url?: string;
          photo_metadata?: any;
          latitude?: number;
          longitude?: number;
        };
      };
    };
  };
};
