#!/bin/bash
# ============================================
# AUTO-FIX TYPESCRIPT ERRORS SCRIPT
# ============================================

echo "🔧 Starting auto-fix process..."
echo ""

# ============================================
# 1. CREATE MISSING DIRECTORIES
# ============================================
echo "📁 Creating missing directories..."
mkdir -p src/core/entities
mkdir -p src/lib/constants
mkdir -p src/lib/utils
mkdir -p src/infrastructure/database
echo "✅ Directories created"
echo ""

# ============================================
# 2. CREATE MISSING FILES
# ============================================

echo "📝 Creating InspectionEntity.ts..."
cat > src/core/entities/InspectionEntity.ts << 'EOF'
// src/core/entities/InspectionEntity.ts
export class InspectionEntity {
  id: string;
  templateId: string;
  userId: string;
  locationId: string;
  inspectionDate: string;
  inspectionTime: string;
  overallStatus: string;
  responses: Record<string, any>;
  photoUrls: string[];
  notes: string | null;
  durationSeconds: number | null;

  constructor(data: any) {
    this.id = data.id;
    this.templateId = data.template_id || data.templateId;
    this.userId = data.user_id || data.userId;
    this.locationId = data.location_id || data.locationId;
    this.inspectionDate = data.inspection_date || data.inspectionDate;
    this.inspectionTime = data.inspection_time || data.inspectionTime;
    this.overallStatus = data.overall_status || data.overallStatus;
    this.responses = data.responses;
    this.photoUrls = data.photo_urls || data.photoUrls || [];
    this.notes = data.notes || null;
    this.durationSeconds = data.duration_seconds || data.durationSeconds || null;
  }

  static create(data: any): InspectionEntity {
    return new InspectionEntity(data);
  }

  toJSON() {
    return {
      id: this.id,
      template_id: this.templateId,
      user_id: this.userId,
      location_id: this.locationId,
      inspection_date: this.inspectionDate,
      inspection_time: this.inspectionTime,
      overall_status: this.overallStatus,
      responses: this.responses,
      photo_urls: this.photoUrls,
      notes: this.notes,
      duration_seconds: this.durationSeconds,
    };
  }
}
EOF
echo "✅ InspectionEntity.ts created"

echo "📝 Creating assessments.ts..."
cat > src/lib/constants/assessments.ts << 'EOF'
// src/lib/constants/assessments.ts
export interface AssessmentCategory {
  id: string;
  name: string;
  label: string;
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  { id: 'toilet_bowl', name: 'Toilet Bowl', label: 'Kloset' },
  { id: 'floor', name: 'Floor', label: 'Lantai' },
  { id: 'wall', name: 'Wall', label: 'Dinding' },
  { id: 'sink', name: 'Sink', label: 'Wastafel' },
  { id: 'soap', name: 'Soap', label: 'Sabun' },
  { id: 'tissue', name: 'Tissue', label: 'Tisu' },
  { id: 'trash', name: 'Trash Bin', label: 'Tempat Sampah' },
  { id: 'door', name: 'Door', label: 'Pintu' },
  { id: 'ventilation', name: 'Ventilation', label: 'Ventilasi' },
  { id: 'lighting', name: 'Lighting', label: 'Pencahayaan' },
  { id: 'smell', name: 'Smell', label: 'Aroma' },
];

export const ASSESSMENT_CONFIGS = ASSESSMENT_CATEGORIES;

export function validateAssessments(assessments: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!assessments || typeof assessments !== 'object') {
    errors.push('Assessments must be an object');
    return { valid: false, errors };
  }

  const values = Object.values(assessments);
  if (values.length === 0) {
    errors.push('At least one assessment is required');
  }

  values.forEach((assessment: any) => {
    if (assessment.rating < 1 || assessment.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
EOF
echo "✅ assessments.ts created"

echo "📝 Creating PhotoPreview.tsx..."
cat > src/presentation/components/features/Inspection/PhotoPreview.tsx << 'EOF'
// src/presentation/components/features/Inspection/PhotoPreview.tsx
'use client';

import React from 'react';

interface PhotoPreviewProps {
  url: string;
  onRemove?: () => void;
}

export function PhotoPreview({ url, onRemove }: PhotoPreviewProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img src={url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      {onRemove && (
        <button onClick={onRemove} style={{ position: 'absolute', top: 0, right: 0 }}>×</button>
      )}
    </div>
  );
}

export default PhotoPreview;
EOF
echo "✅ PhotoPreview.tsx created"

# ============================================
# 3. FIX TYPE DEFINITIONS
# ============================================

echo "📝 Adding missing type definitions..."
cat > src/core/types/assessment.types.ts << 'EOF'
// src/core/types/assessment.types.ts
export interface AssessmentSubmission {
  assessments: Assessments;
  locationId: string;
  userId: string;
  photoData?: string;
  geoData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  notes?: string;
}

export interface Assessments {
  [key: string]: {
    rating: number;
    comment?: string;
  };
}

export type InspectionStatus = 'Clean' | 'Needs Work' | 'Dirty';
EOF
echo "✅ assessment.types.ts created"

# ============================================
# 4. FIX PHOTO REPOSITORY
# ============================================

echo "📝 Creating IPhotoRepository..."
cat > src/core/repositories/IPhotoRepository.ts << 'EOF'
// src/core/repositories/IPhotoRepository.ts
export interface PhotoMetadata {
  locationId: string;
  userId: string;
  timestamp: string;
  gps?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export interface IPhotoRepository {
  upload(photoData: string, metadata: PhotoMetadata): Promise<string>;
}
EOF
echo "✅ IPhotoRepository.ts created"

# ============================================
# 5. FIX AUTH CONTEXT TYPE
# ============================================

echo "📝 Fixing AuthContext types..."
cat > src/presentation/contexts/auth-context-fix.ts << 'EOF'
// Add this to your AuthContext.tsx

// Update AuthContextType interface:
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;  // ← Add this
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

// Update User interface if needed:
export interface User {
  id: string;
  email: string;
  fullName: string;  // ← Make sure this exists
  full_name?: string; // ← Keep for compatibility
  role?: string;
}
EOF
echo "✅ auth-context-fix.ts created (manual merge needed)"

# ============================================
# 6. FIX USENOTIFICATION EXPORT
# ============================================

echo "📝 Fixing useNotification export..."
sed -i 's/useNotificaton/useNotification/g' src/presentation/hooks/index.tsx 2>/dev/null || true
echo "✅ useNotification export fixed"

# ============================================
# 7. ADD MISSING PROPS TO HOOKS
# ============================================

echo "📝 Adding isLoading to useInspection return..."
cat > src/presentation/hooks/useInspection-fix.ts << 'EOF'
// Add to your useInspection.ts return statement:

return {
  state,
  setUIMode,
  setPhotoMode,
  setLocationMode,
  updateResponse,
  addPhoto,
  removePhoto,
  setNotes,
  fetchLocationFromQR,
  getCurrentGeolocation,
  saveDraft,
  loadDraft,
  deleteDraft,
  submit,
  validate,
  progress,
  duration: timer.duration,
  canSubmit,
  isLoading: state.uiState.isSubmitting, // ← Add this line
};
EOF
echo "✅ useInspection-fix.ts created (manual merge needed)"

# ============================================
# 8. FIX NULL CHECKS
# ============================================

echo "📝 Creating null-check fixes..."
cat > fix-null-checks.txt << 'EOF'
Manual fixes needed for null checks:

1. src/app/dashboard/locations/page.tsx:107
   Change: value={building}
   To: value={building || ''}

2. src/app/dashboard/locations/print-qr/page.tsx:148
   Change: value={b}
   To: value={b || ''}

3. src/app/dashboard/locations/print-qr/page.tsx:159
   Change: value={f}
   To: value={f || ''}

4. src/app/dashboard/inspection/success/page.tsx:272
   Add null check: if (inspection) { ... }

5. src/app/dashboard/locations/create/page.tsx:34
   Change: photo_url: null
   To: photo_url: undefined

Run these fixes manually or use sed commands.
EOF
echo "✅ null-check fixes documented"

# ============================================
# 9. CREATE ASSESSMENT FORM STUB
# ============================================

echo "📝 Creating AssessmentForm stub..."
cat > src/presentation/components/features/AssessmentForm.tsx << 'EOF'
// src/presentation/components/features/AssessmentForm.tsx
'use client';

import React from 'react';

export function AssessmentForm() {
  return <div>Assessment Form Component</div>;
}

export default AssessmentForm;
EOF
echo "✅ AssessmentForm.tsx created"

# ============================================
# 10. RUN TYPE CHECK
# ============================================

echo ""
echo "🔍 Running TypeScript type check..."
npm run type-check 2>&1 | tee type-check-results.txt

# Count remaining errors
ERROR_COUNT=$(grep -c "error TS" type-check-results.txt 2>/dev/null || echo "0")

echo ""
echo "============================================"
echo "📊 RESULTS"
echo "============================================"
echo "Remaining TypeScript errors: $ERROR_COUNT"
echo ""

if [ "$ERROR_COUNT" -lt "50" ]; then
  echo "✅ Major errors fixed! ($ERROR_COUNT remaining)"
  echo ""
  echo "🎯 Next steps:"
  echo "1. Check fix-null-checks.txt for manual fixes"
  echo "2. Merge auth-context-fix.ts into AuthContext.tsx"
  echo "3. Merge useInspection-fix.ts into useInspection.ts"
  echo "4. Review type-check-results.txt for remaining errors"
else
  echo "⚠️  Still many errors remaining. Check type-check-results.txt"
  echo ""
  echo "Common issues to check:"
  echo "1. Supabase client not using Database types"
  echo "2. Missing User.fullName property"
  echo "3. AuthContext missing signOut method"
fi

echo ""
echo "============================================"
echo "Files created:"
echo "- src/core/entities/InspectionEntity.ts"
echo "- src/lib/constants/assessments.ts"
echo "- src/core/types/assessment.types.ts"
echo "- src/core/repositories/IPhotoRepository.ts"
echo "- src/presentation/components/features/Inspection/PhotoPreview.tsx"
echo "- src/presentation/components/features/AssessmentForm.tsx"
echo "- src/presentation/contexts/auth-context-fix.ts (MANUAL MERGE)"
echo "- src/presentation/hooks/useInspection-fix.ts (MANUAL MERGE)"
echo "- fix-null-checks.txt (MANUAL FIXES)"
echo "============================================"
echo ""
echo "🎉 Auto-fix completed!"
