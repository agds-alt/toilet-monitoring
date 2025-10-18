// app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';
import { CreateLocation } from '@/core/use-cases/CreateLocation';
import { GetLocations } from '@/core/use-cases/GetLocations';

export async function GET() {
  console.log('📍 GET /api/locations called');
  
  try {
    const locationRepository = new SupabaseLocationRepository();
    const getLocations = new GetLocations(locationRepository);
    
    const locations = await getLocations.execute();
    console.log('📍 Locations found:', locations.length);
    
    return NextResponse.json(locations);
  } catch (error: any) {
    console.error('❌ GET /api/locations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('📍 POST /api/locations called');
  
  try {
    const data = await request.json();
    console.log('📍 POST data:', data);
    
    const locationRepository = new SupabaseLocationRepository();
    const createLocation = new CreateLocation(locationRepository);
    
    const location = await createLocation.execute(data);
    return NextResponse.json(location, { status: 201 });
  } catch (error: any) {
    console.error('❌ POST /api/locations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create location' },
      { status: 400 }
    );
  }
}