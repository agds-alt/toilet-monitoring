// src/app/api/templates/route.ts
// ============================================
// TEMPLATES API - List all templates
// ============================================

import { NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('📋 [API] Fetching all templates...');

    const { data, error, count } = await supabase
      .from('inspection_templates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [API] Fetch templates error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          data: [],
          count: 0,
        },
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`✅ [API] Found ${count} template(s)`);

    return NextResponse.json(
      {
        success: true,
        data: data || [],
        count: count || 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ [API] Templates API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch templates',
        data: [],
        count: 0,
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
