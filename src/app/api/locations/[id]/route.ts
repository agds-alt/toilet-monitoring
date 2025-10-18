// app/api/locations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('📍 GET /api/locations/[id] called, id:', params.id);
  
  try {
    const locationRepository = new SupabaseLocationRepository();
    const location = await locationRepository.findById(params.id);
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(location);
  } catch (error: any) {
    console.error('❌ GET /api/locations/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch location' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('📍 PUT /api/locations/[id] called, id:', params.id);
  
  try {
    const data = await request.json();
    const locationRepository = new SupabaseLocationRepository();
    
    const location = await locationRepository.update(params.id, data);
    return NextResponse.json(location);
  } catch (error: any) {
    console.error('❌ PUT /api/locations/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update location' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('📍 DELETE /api/locations/[id] called, id:', params.id);
  
  try {
    const locationRepository = new SupabaseLocationRepository();
    await locationRepository.delete(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ DELETE /api/locations/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete location' },
      { status: 400 }
    );
  }
}