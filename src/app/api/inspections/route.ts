// app/api/inspections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

export async function GET() {
  try {
    console.log('📋 GET /api/inspections called');
    
    const { data: inspections, error } = await supabase
      .from('inspections')
      .select(`
        *,
        locations:location_id (
          id,
          name,
          code,
          floor,
          section
        )
      `)
      .order('created_at', { ascending: false })
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
    const { locationId, locationName, items, notes } = await request.json();

    console.log('📍 POST /api/inspections called for location:', locationId);

    // Validate required fields
    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Calculate scores
    const totalScore = items.reduce((sum: number, item: any) => sum + (item.score || 0), 0);
    const maxScore = items.length * 5;
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Determine status
    let status = 'completed';
    if (percentage >= 80) status = 'all_good';
    else if (percentage >= 60) status = 'need_maintenance';
    else status = 'need_cleaning';

    // Prepare data
    const submissionData = {
      location_id: locationId,
      status: status,
      assessments: {
        locationId,
        locationName: locationName || 'Unknown Location',
        items: items.map(item => ({
          id: item.id,
          question: item.question,
          score: item.score,
          comment: item.comment || ''
        })),
        totalScore,
        maxScore,
        percentage,
        notes: notes || '',
        submittedAt: new Date().toISOString()
      },
      overall_comment: notes || ''
    };

    console.log('🗂️ Inserting data:', {
      locationId,
      totalScore,
      percentage,
      status
    });

    const { data, error } = await supabase
      .from('inspections')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw new Error(`Failed to save inspection: ${error.message}`);
    }

    console.log('✅ Inspection saved successfully:', data.id);
    
    return NextResponse.json({
      id: data.id,
      success: true,
      message: 'Inspeksi berhasil disimpan',
      data: {
        id: data.id,
        score: `${totalScore}/${maxScore} (${percentage}%)`,
        status: status
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ POST /api/inspections error:', error);
    return NextResponse.json(
      { 
        error: 'Gagal menyimpan inspeksi',
        details: error.message 
      },
      { status: 500 }
    );
  }
}