import { NextResponse } from 'next/server';

/**
 * Liveness Check Endpoint
 * Used by Kubernetes/container orchestrators to determine if app is alive
 * Returns 200 if alive, 503 if dead
 * This is a simple check - just verifies the process is running
 */

export async function GET() {
  return NextResponse.json(
    {
      alive: true,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
