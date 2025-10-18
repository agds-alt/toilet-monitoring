"use strict";
// src/infrastructure/database/supabase.ts
// ENHANCED VERSION with debugging and better config
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
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
    exports.supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 [Supabase] Auth State Change:', event);
        if (session) {
            console.log('   User:', session.user.email);
            console.log('   Expires:', new Date(session.expires_at * 1000).toLocaleString());
        }
    });
}
// Preload session on client
if (typeof window !== 'undefined') {
    exports.supabase.auth.getSession()
        .then(({ data, error }) => {
        if (isDebug) {
            console.log('🔐 [Supabase] Initial session check:', data.session ? '✅ Active' : '❌ None', error ? `Error: ${error.message}` : '');
        }
    })
        .catch(err => {
        console.error('🔐 [Supabase] Session check failed:', err);
    });
}
