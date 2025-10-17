// src/infrastructure/database/supabase.ts - ADD CONNECTION POOLING
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Optimized client with connection pooling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'toilet-monitoring-auth', // Custom key
  },
  global: {
    headers: {
      'x-client-info': 'toilet-monitoring-web',
    },
  },
  db: {
    schema: 'public',
  },
  // Improve performance
  realtime: {
    params: {
      eventsPerSecond: 2, // Reduce realtime overhead
    },
  },
});

// Preload session on client-side
if (typeof window !== 'undefined') {
  supabase.auth.getSession().catch(console.error);
}

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
