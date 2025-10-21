// src/app/api/inspections/route.ts
// ============================================
// INSPECTION API ROUTES - Type-Safe Implementation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase, InspectionRecordInsert } from '@/infrastructure/database/supabase';
import { CreateInspectionDTO } from '@/core/types/inspection.types';

// ============================================
// POST /api/inspections - Create New Inspection
// ============================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request body
    const body: CreateInspectionDTO = await request.json();
    
    // 2. Validate required fields
    if (!body.template_id) {
      return NextResponse.json(
        { error: 'template_id is required' },
        { status: 400 }
      );
    }
    
    if (!body.location_id) {
      return NextResponse.json(
        { error: 'location_id is required' },
        { status: 400 }
      );
    }
    
    if (!body.user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }
    
    // 3. Prepare data for insertion (matching InspectionRecordInsert type)
    const inspectionData: InspectionRecordInsert = {
      template_id: body.template_id,
      location_id: body.location_id,
      user_id: body.user_id,
      inspection_date: body.inspection_date,
      inspection_time: body.inspection_time,
      overall_status: body.overall_status,
      responses: body.responses as any, // JSONB
      photo_urls: body.photo_urls || [],
      notes: body.notes || null,
      duration_seconds: body.duration_seconds,
      geolocation: body.geolocation as any || null, // JSONB
    };
    
    // 4. Insert into database
    const { data, error } = await supabase
      .from('inspection_records')
      .insert(inspectionData)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create inspection', details: error.message },
        { status: 500 }
      );
    }
    
    // 5. Return success
    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Inspection created successfully',
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// GET /api/inspections - List Inspections
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const locationId = searchParams.get('location_id');
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query = supabase
      .from('inspection_records')
      .select('*')
      .order('inspection_date', { ascending: false })
      .order('inspection_time', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters
    if (locationId) {
      query = query.eq('location_id', locationId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('overall_status', status);
    }
    
    if (dateFrom) {
      query = query.gte('inspection_date', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('inspection_date', dateTo);
    }
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch inspections', details: error.message },
        { status: 500 }
      );
    }
    
    // Return results
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
      },
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/inspections - Update Inspection (for verification)
// ============================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { id, verified_by, verification_notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }
    
    // Update inspection
    const { data, error } = await supabase
      .from('inspection_records')
      .update({
        verified_by,
        verified_at: new Date().toISOString(),
        verification_notes,
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update inspection', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Inspection verified successfully',
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}