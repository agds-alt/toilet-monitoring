// src/app/api/locations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log('📍 GET /api/locations/[id] called, id:', id);
  
  try {
    const locationRepository = new SupabaseLocationRepository();
    const location = await locationRepository.findById(id);
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error('❌ Error fetching location:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
