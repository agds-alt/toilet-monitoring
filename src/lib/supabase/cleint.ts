// src/lib/supabase/client.ts
// ============================================
// BROWSER-SIDE SUPABASE CLIENT
// For React Components (Client Components)
// ============================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/core/types/supabase.types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
