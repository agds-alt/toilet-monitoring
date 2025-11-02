import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Readiness Check Endpoint
 * Used by Kubernetes/container orchestrators to determine if app is ready to receive traffic
 * Returns 200 if ready, 503 if not ready
 */

export async function GET() {
  try {
    // Check if database is reachable
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from('locations')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { ready: false, reason: 'Database not reachable' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ready: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ready: false,
        reason: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
