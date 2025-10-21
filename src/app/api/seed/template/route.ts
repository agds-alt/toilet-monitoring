// src/app/api/seed/templates/route.ts
// ============================================
// SEED TEMPLATES API ROUTE
// ============================================

import { NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

export async function POST() {
  try {
    console.log('🌱 API: Seeding templates...');

    // Check if default template already exists
    const { data: existing } = await supabase
      .from('inspection_templates')
      .select('id, name')
      .eq('is_default', true)
      .single();

    if (existing) {
      console.log('✅ Template already exists:', existing.id);
      return NextResponse.json({
        success: true,
        message: 'Template already exists',
        data: existing,
      });
    }

    // Create default template
    const { data: template, error } = await supabase
      .from('inspection_templates')
      .insert({
        name: 'Standard Toilet Inspection',
        description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen penilaian',
        estimated_time: 10,
        is_active: true,
        is_default: true,
        fields: {
          components: DEFAULT_TOILET_COMPONENTS,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating template:', error);
      throw error;
    }

    console.log('✅ Template created:', template.id);

    return NextResponse.json({
      success: true,
      message: 'Template created successfully',
      data: template,
    });
  } catch (error: any) {
    console.error('❌ Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed templates',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verify templates
    const { data: templates, error } = await supabase
      .from('inspection_templates')
      .select('id, name, is_active, is_default')
      .eq('is_active', true);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      count: templates?.length || 0,
      data: templates || [],
    });
  } catch (error: any) {
    console.error('❌ Verify templates error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to verify templates',
      },
      { status: 500 }
    );
  }
}