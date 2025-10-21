// app/api/locations/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Locations API is working!',
    timestamp: new Date().toISOString(),
  });
}
