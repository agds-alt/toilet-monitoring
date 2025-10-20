// src/app/api/templates/route.ts
// ============================================
// TEMPLATES API - Get all active templates
// ============================================

import { NextResponse } from 'next/server';
import { templateService } from '@/infrastructure/services/template.service';

export async function GET() {
  try {
    const templates = await templateService.getActiveTemplates();

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error: any) {
    console.error('❌ Get templates error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to get templates',
      },
      { status: 500 }
    );
  }
}