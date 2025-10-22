#!/bin/bash
# ============================================
# SETUP SCRIPT - Form Inspeksi Type-Safe
# ============================================

set -e  # Exit on error

echo "🚀 Starting Form Inspection Refactor Setup..."
echo ""

# ============================================
# 1. CREATE DIRECTORIES
# ============================================

echo "📁 Creating directories..."

mkdir -p src/core/types
mkdir -p src/app/api/inspections
mkdir -p src/app/api/templates

echo "✅ Directories created"
echo ""

# ============================================
# 2. BACKUP OLD FILES
# ============================================

echo "💾 Backing up old files..."

if [ -f "src/core/types/inspection.types.ts" ]; then
  cp src/core/types/inspection.types.ts src/core/types/inspection.types.backup.ts
  echo "✅ Backed up inspection.types.ts"
fi

if [ -f "src/presentation/components/features/Inspection/InspectionForm.tsx" ]; then
  cp src/presentation/components/features/Inspection/InspectionForm.tsx \
     src/presentation/components/features/Inspection/InspectionForm.backup.tsx
  echo "✅ Backed up InspectionForm.tsx"
fi

echo ""

# ============================================
# 3. CHECK SUPABASE TYPES
# ============================================

echo "🔍 Checking Supabase types..."

if [ ! -f "src/infrastructure/database/supabase.ts" ]; then
  echo "❌ ERROR: supabase.ts not found!"
  echo "   Please ensure you have generated types from Supabase CLI"
  exit 1
fi

if [ ! -f "src/core/types/database.types.ts" ]; then
  echo "⚠️  WARNING: database.types.ts not found"
  echo "   Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/core/types/database.types.ts"
fi

echo "✅ Supabase types found"
echo ""

# ============================================
# 4. CREATE NEW TYPE FILE
# ============================================

echo "📝 Creating inspection.types.aligned.ts..."

cat > src/core/types/inspection.types.aligned.ts << 'EOF'
// src/core/types/inspection.types.aligned.ts
// ============================================
// ALIGNED INSPECTION TYPES - Based on Supabase Schema
// ============================================

import { 
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  Location,
  Photo,
} from '@/infrastructure/database/supabase';

export type {
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  Location,
  Photo,
};

export interface InspectionComponent {
  id: string;
  label: string;
  label_id?: string;
  type: 'rating';
  required: boolean;
  order: number;
  icon?: string;
}

export interface InspectionTemplateFields {
  components: InspectionComponent[];
}

export type RatingValue = 'clean' | 'needs_work' | 'dirty';

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[];
}

export type InspectionResponses = Record<string, ComponentResponse>;

export type UIMode = 'genz' | 'professional';
export type PhotoMode = 'solo' | 'batch';
export type LocationMode = 'qr' | 'gps' | 'manual';

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: 'clean' | 'needs_work' | 'dirty';
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
  geolocation?: any;
}
EOF

echo "✅ Created inspection.types.aligned.ts"
echo ""

# ============================================
# 5. CREATE API ROUTES
# ============================================

echo "📝 Creating API routes..."

# Create inspections route
cat > src/app/api/inspections/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { supabase, InspectionRecordInsert } from '@/infrastructure/database/supabase';
import { CreateInspectionDTO } from '@/core/types/inspection.types.aligned';

export async function POST(request: NextRequest) {
  try {
    const body: CreateInspectionDTO = await request.json();
    
    const inspectionData: InspectionRecordInsert = {
      template_id: body.template_id,
      location_id: body.location_id,
      user_id: body.user_id,
      inspection_date: body.inspection_date,
      inspection_time: body.inspection_time,
      overall_status: body.overall_status,
      responses: body.responses as any,
      photo_urls: body.photo_urls || [],
      notes: body.notes || null,
      duration_seconds: body.duration_seconds,
      geolocation: body.geolocation || null,
    };
    
    const { data, error } = await supabase
      .from('inspection_records')
      .insert(inspectionData)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create inspection', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Created /api/inspections/route.ts"

# Create templates route
cat > src/app/api/templates/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultOnly = searchParams.get('default') === 'true';
    
    let query = supabase
      .from('inspection_templates')
      .select('*')
      .eq('is_active', true);
    
    if (defaultOnly) {
      query = query.eq('is_default', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch templates', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: defaultOnly ? data[0] : data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Created /api/templates/route.ts"

# Create template by ID route
mkdir -p src/app/api/templates/\[id\]
cat > src/app/api/templates/\[id\]/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/infrastructure/database/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('inspection_templates')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
EOF

echo "✅ Created /api/templates/[id]/route.ts"
echo ""

# ============================================
# 6. VERIFY SETUP
# ============================================

echo "🔍 Verifying setup..."

FILES=(
  "src/core/types/inspection.types.aligned.ts"
  "src/app/api/inspections/route.ts"
  "src/app/api/templates/route.ts"
  "src/app/api/templates/[id]/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file - NOT FOUND"
  fi
done

echo ""

# ============================================
# 7. NEXT STEPS
# ============================================

echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Update InspectionForm.tsx with refactored version"
echo "   (Copy from artifact: InspectionForm.refactored.tsx)"
echo ""
echo "2. Update imports in your components:"
echo "   import { ... } from '@/core/types/inspection.types.aligned';"
echo ""
echo "3. Test the form:"
echo "   npm run dev"
echo "   Visit: http://localhost:3000/inspection"
echo ""
echo "4. Verify database has default template:"
echo "   SELECT * FROM inspection_templates WHERE is_default = true;"
echo ""
echo "5. Check API endpoints work:"
echo "   curl http://localhost:3000/api/templates?default=true"
echo ""
echo "📖 See MIGRATION_GUIDE.md for full details"
echo ""
echo "🎉 Happy coding!"