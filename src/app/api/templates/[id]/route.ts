// src/app/api/templates/[id]/route.ts
// ============================================
// TEMPLATE API ROUTE - Get Single Template
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

interface RouteParams {
  params: {
    id: string;
  };
}

// ============================================
// GET /api/templates/:id - Get Template by ID
// ============================================

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Fetch template
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Database error:', error);

      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      return NextResponse.json(
        { error: 'Failed to fetch template', details: error.message },
        { status: 500 }
      );
    }

    // Return template
    return NextResponse.json({
      success: true,
      data,
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
// Alternative: Get default template
// ============================================
// GET /api/templates/default

export async function getDefaultTemplate() {
  const { data, error } = await supabase
    .from('inspection_templates')
    .select('*')
    .eq('is_default', true)
    .eq('is_active', true)
    .single();

  if (error) {
    throw new Error(`Failed to fetch default template: ${error.message}`);
  }

  return data;
}
