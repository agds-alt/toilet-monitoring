// =====================================================
// FILE 2: src/app/api/inspections/route.ts
// FIXED: Use inspection_records table
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

export async function GET() {
  try {
    console.log('📋 GET /api/inspections called');

    const { data: inspections, error } = await supabase
      .from('inspection_records') // ✅ FIXED
      .select(
        `
        *,
        locations:location_id (
          id,
          name,
          area,
          floor,
          building
        ),
        users:user_id (
          id,
          full_name,
          email
        )
      `
      )
      .order('submitted_at', { ascending: false }) // ✅ FIXED
      .limit(20);

    if (error) {
      console.error('❌ GET /api/inspections error:', error);
      throw new Error(`Failed to fetch inspections: ${error.message}`);
    }

    console.log('✅ GET /api/inspections successful:', inspections?.length || 0, 'items');
    return NextResponse.json(inspections || []);
  } catch (error: any) {
    console.error('❌ GET /api/inspections error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch inspections' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get default template
    const { data: template } = await supabase
      .from('inspection_templates')
      .select('id')
      .eq('is_default', true)
      .single();

    const now = new Date();
    const { data, error } = await supabase
      .from('inspection_records') // ✅ FIXED
      .insert({
        template_id: template?.id ?? "",
        location_id: body.locationId,
        user_id: body.userId,
        inspection_date: now.toISOString().split('T')[0],
        inspection_time: now.toTimeString().split(' ')[0],
        overall_status: body.status || 'Clean',
        responses: body.assessments || {}, // ✅ FIXED
        photo_urls: body.photoUrl ? [body.photoUrl] : [], // ✅ FIXED
        notes: body.notes || null, // ✅ FIXED
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create inspection: ${error.message}`);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create inspection' },
      { status: 500 }
    );
  }
}
