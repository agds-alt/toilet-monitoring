// src/lib/supabase/client.ts
// ============================================
// BROWSER-SIDE SUPABASE CLIENT
// For React Components (Client Components)
// ============================================

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/supabase/server';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}