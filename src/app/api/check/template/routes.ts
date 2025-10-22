// src/app/api/check/template/route.ts
// ============================================
// TEMPLATE CHECKER - Debug Tool
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';
import { DEFAULT_TOILET_COMPONENTS } from '@/lib/constants/inspection.constants';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking templates...');

    // 1. Get all templates
    const { data: allTemplates, error: allError } = await supabase
      .from('inspection_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) throw allError;

    // 2. Get default template
    const { data: defaultTemplate, error: defaultError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_default', true)
      .eq('is_active', true)
      .single();

    // 3. Get active templates
    const { data: activeTemplates, error: activeError } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true)
      .order('is_default', { ascending: false });

    const results = {
      success: true,
      summary: {
        totalTemplates: allTemplates?.length || 0,
        hasDefault: !!defaultTemplate,
        activeTemplates: activeTemplates?.length || 0,
      },
      defaultTemplate: defaultTemplate
        ? {
            id: defaultTemplate.id,
            name: defaultTemplate.name,
            is_active: defaultTemplate.is_active,
            is_default: defaultTemplate.is_default,
            componentsCount: defaultTemplate.fields?.['components']?.length || 0,
            hasComponents: defaultTemplate.fields?.['components']?.length > 0,
          }
        : null,
      allTemplates:
        allTemplates?.map((t) => ({
          id: t.id,
          name: t.name,
          is_active: t.is_active,
          is_default: t.is_default,
          componentsCount: t.fields?.['components']?.length || 0,
        })) || [],
      activeTemplates:
        activeTemplates?.map((t) => ({
          id: t.id,
          name: t.name,
          is_default: t.is_default,
          componentsCount: t.fields?.['components']?.length || 0,
        })) || [],
    };

    // Diagnosis
    const diagnosis: string[] = [];

    if (results.summary.totalTemplates === 0) {
      diagnosis.push('❌ NO TEMPLATES FOUND - Run seed script!');
    } else if (!results.summary.hasDefault) {
      diagnosis.push('⚠️ No default template - Set one as default or seed will create one');
    } else if (results.defaultTemplate && !results.defaultTemplate.hasComponents) {
      diagnosis.push('❌ Default template has no components!');
    } else {
      diagnosis.push('✅ Templates are configured correctly!');
    }

    return NextResponse.json({
      ...results,
      diagnosis,
      hint:
        diagnosis[0].includes('❌') || diagnosis[0].includes('⚠️')
          ? 'Run: npm run seed'
          : 'Everything looks good!',
    });
  } catch (error: any) {
    console.error('❌ Check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'Check Supabase connection and table structure',
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Auto-fix Templates
// ============================================

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Auto-fixing templates...');

    // 1. Check if any template exists
    const { data: existing, error: checkError } = await supabase
      .from('inspection_templates')
      .select('id, name')
      .limit(1)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // 2. If no templates, create default
    if (!existing) {
      console.log('📝 Creating default template...');

      const { data: newTemplate, error: insertError } = await supabase
        .from('inspection_templates')
        .insert({
          name: 'Standard Toilet Inspection',
          description: 'Template standar untuk inspeksi kebersihan toilet dengan 11 komponen',
          estimated_time: 10,
          is_active: true,
          is_default: true,
          fields: {
            components: DEFAULT_TOILET_COMPONENTS,
          },
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json({
        success: true,
        message: 'Default template created',
        data: newTemplate,
        action: 'created',
      });
    }

    // 3. Check if any template is default
    const { data: defaultTemplate } = await supabase
      .from('inspection_templates')
      .select('id')
      .eq('is_default', true)
      .single();

    if (!defaultTemplate) {
      console.log('🔧 Setting first template as default...');

      // Get first active template
      const { data: firstTemplate } = await supabase
        .from('inspection_templates')
        .select('id, name')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (firstTemplate) {
        // Set as default
        await supabase
          .from('inspection_templates')
          .update({ is_default: true })
          .eq('id', firstTemplate.id);

        return NextResponse.json({
          success: true,
          message: 'Set first template as default',
          data: firstTemplate,
          action: 'updated',
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Templates are already configured correctly',
      action: 'no_action_needed',
    });
  } catch (error: any) {
    console.error('❌ Auto-fix error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
