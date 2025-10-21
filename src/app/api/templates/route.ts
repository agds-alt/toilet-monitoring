// src/app/api/templates/route.ts
// ============================================
// TEMPLATES API ROUTES - List & Default
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

// ============================================
// GET /api/templates - List All Templates
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultOnly = searchParams.get('default') === 'true';
    
    // Build query
    let query = supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    // Filter for default template if requested
    if (defaultOnly) {
      query = query.eq('is_default', true);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      );
    }
    
    // If default only and not found
    if (defaultOnly && (!data || data.length === 0)) {
      return NextResponse.json(
        { error: 'Default template not found' },
        { status: 404 }
      );
    }
    
    // Return templates
    return NextResponse.json({
      success: true,
      data: defaultOnly ? data[0] : data,
      count: data?.length || 0,
    });
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}