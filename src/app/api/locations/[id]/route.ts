// app/api/locations/[id]/route.ts - PUT
import { NextRequest, NextResponse } from 'next/server';
import { SupabaseLocationRepository } from '@/infrastructure/database/repositories/SupabaseLocationRepository';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await request.json();

    console.log(`📍 PUT /api/locations/${id} - Updating location:`, body);

    const repository = new SupabaseLocationRepository();
    const updatedLocation = await repository.update(id, body);

    console.log('✅ Location updated successfully:', id);

    return NextResponse.json({
      success: true,
      data: updatedLocation,
    });
  } catch (error: any) {
    console.error('❌ Error updating location:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    console.log(`📍 DELETE /api/locations/${id} - Deleting location`);

    const repository = new SupabaseLocationRepository();
    await repository.delete(id);

    console.log('✅ Location deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Location deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ Error deleting location:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
