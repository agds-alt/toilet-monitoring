// src/infrastructure/database/supabase.ts
// ENHANCED VERSION with debugging and better config

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const isDebug = process.env.NEXT_PUBLIC_SUPABASE_AUTH_DEBUG === 'true';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!');
}

// Log configuration in development
if (process.env.NODE_ENV === 'development' && isDebug) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'toilet-monitoring-auth',
    flowType: 'pkce', // More secure
    debug: isDebug,
  },
  global: {
    headers: {
      'x-client-info': 'toilet-monitoring-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Add global error handler
if (typeof window !== 'undefined' && isDebug) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 [Supabase] Auth State Change:', event);
    if (session) {
      console.log('   User:', session.user.email);
      console.log('   Expires:', new Date(session.expires_at! * 1000).toLocaleString());
    }
  });
}

// Preload session on client
if (typeof window !== 'undefined') {
  supabase.auth.getSession()
    .then(({ data, error }) => {
      if (isDebug) {
        console.log('🔐 [Supabase] Initial session check:', 
          data.session ? '✅ Active' : '❌ None', 
          error ? `Error: ${error.message}` : ''
        );
      }
    })
    .catch(err => {
      console.error('🔐 [Supabase] Session check failed:', err);
    });
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