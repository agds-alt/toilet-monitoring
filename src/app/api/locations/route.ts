// app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';

// GET - Get all locations
export async function GET(request: NextRequest) {
  try {
    console.log('📍 GET /api/locations - Fetching all locations');

    const { searchParams } = new URL(request.url);
    const floor = searchParams.get('floor');
    const section = searchParams.get('section');
    const includeStats = searchParams.get('includeStats') === 'true';

    const repository = new SupabaseLocationRepository();
    let locations = await repository.findAll();

    // Apply filters if provided
    if (floor) {
      locations = locations.filter((loc) => loc.floor === floor);
    }

    if (section) {
      locations = locations.filter((loc) => loc.section === section);
    }

    console.log(`✅ Returning ${locations.length} locations`);

    return NextResponse.json({
      success: true,
      data: locations,
      meta: {
        total: locations.length,
        filters: {
          floor: floor || 'all',
          section: section || 'all',
          includeStats,
        },
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching locations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new location
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📍 POST /api/locations - Creating location:', body);

    const repository = new SupabaseLocationRepository();
    const newLocation = await repository.create(body);

    console.log('✅ Location created successfully:', newLocation.id);

    return NextResponse.json(
      {
        success: true,
        data: newLocation,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating location:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
