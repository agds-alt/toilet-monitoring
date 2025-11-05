// ============================================
// FILE 1: src/lib/supabase/client.ts
// Browser client (use in React components)
// ============================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database as DB } from '@/core/types/supabase.types';

export function createClient() {
  return createBrowserClient<DB>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ============================================
// FILE 2: src/lib/supabase/server.ts
// Server client (use in API routes & Server Components)
// ============================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database as DB2 } from '@/core/types/supabase.types';

export function createServerClient2() {
  const cookieStore = cookies();

  return createServerClient<DB2>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie setting errors in middleware
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie removal errors in middleware
          }
        },
      },
    }
  );
}

// ============================================
// FILE 3: src/lib/supabase/middleware.ts
// Middleware client (use in middleware.ts)
// ============================================

import { NextResponse, type NextRequest } from 'next/server';
import type { Database as DB3 } from '@/core/types/supabase.types';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<DB3>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}
