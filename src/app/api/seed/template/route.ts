// src/app/api/seed/template/route.ts
// ============================================
// API ROUTE TO SEED DEFAULT TEMPLATE
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { seedDefaultTemplate } from '@/lib/seed/seedDefaultTemplate';

export async function POST(request: NextRequest) {
  try {
    // Optional: Get userId from request body
    const body = await request.json().catch(() => ({}));
    const userId = body.userId;

    const template = await seedDefaultTemplate(userId);

    return NextResponse.json({
      success: true,
      message: 'Default template created successfully',
      data: template,
    });
  } catch (error: any) {
    console.error('❌ Seed template API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed template',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to seed default template',
    usage: {
      method: 'POST',
      body: {
        userId: 'optional-user-id',
      },
    },
  });
}