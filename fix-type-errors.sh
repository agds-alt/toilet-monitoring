#!/bin/bash
# ============================================
# PHASE 2: FIX TYPE ERRORS
# Fix all TypeScript errors after cleanup
# ============================================

set -e

echo "🔧 Starting Type Error Fixes..."
echo ""

# ============================================
# 1. FIX DATABASE.TYPES.TS - Add Missing Exports
# ============================================

echo "📝 Step 1: Fixing database.types.ts..."

cat > src/core/types/database.types.ts << 'EOF'
// src/core/types/database.types.ts
// ============================================
// DATABASE TYPES - Aligned with Supabase
// ============================================

import { Database } from '../../supabase.types';

// Export main types
export type { Database };
export type Json = Database['public']['Tables']['inspection_records']['Row']['responses'];

// ============================================
// TABLE TYPES
// ============================================

export type InspectionRecord = Database['public']['Tables']['inspection_records']['Row'];
export type InspectionRecordInsert = Database['public']['Tables']['inspection_records']['Insert'];
export type InspectionRecordUpdate = Database['public']['Tables']['inspection_records']['Update'];

export type InspectionTemplate = Database['public']['Tables']['inspection_templates']['Row'];
export type InspectionTemplateInsert = Database['public']['Tables']['inspection_templates']['Insert'];
export type InspectionTemplateUpdate = Database['public']['Tables']['inspection_templates']['Update'];

export type Location = Database['public']['Tables']['locations']['Row'];
export type LocationInsert = Database['public']['Tables']['locations']['Insert'];
export type LocationUpdate = Database['public']['Tables']['locations']['Update'];

export type Photo = Database['public']['Tables']['photos']['Row'];
export type PhotoInsert = Database['public']['Tables']['photos']['Insert'];
export type PhotoUpdate = Database['public']['Tables']['photos']['Update'];

export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Role = Database['public']['Tables']['roles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];

// ============================================
// VIEW TYPES
// ============================================

export type DailyInspectionSummary = Database['public']['Views']['daily_inspection_summary']['Row'];
EOF

echo "✅ Fixed database.types.ts"
echo ""

# ============================================
# 2. FIX INSPECTION.TYPES.TS - Export All Types
# ============================================

echo "📝 Step 2: Fixing inspection.types.ts..."

cat > src/core/types/inspection.types.ts << 'EOF'
// src/core/types/inspection.types.ts
// ============================================
// INSPECTION DOMAIN TYPES
// ============================================

import { 
  InspectionRecord, 
  InspectionRecordInsert,
  InspectionTemplate,
  Location,
  Photo 
} from './database.types';

// Re-export for convenience
export type { InspectionRecord, InspectionTemplate, Location, Photo };

// ============================================
// TEMPLATE STRUCTURE
// ============================================

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

// ============================================
// RATING TYPES
// ============================================

export type RatingValue = 'clean' | 'needs_work' | 'dirty';
export type OverallStatus = RatingValue;

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[];
}

export type InspectionResponses = Record<string, ComponentResponse>;

// ============================================
// UI STATE
// ============================================

export type UIMode = 'genz' | 'professional';
export type PhotoMode = 'solo' | 'batch';
export type LocationMode = 'qr' | 'gps' | 'manual';

export interface InspectionUIState {
  uiMode: UIMode;
  photoMode: PhotoMode;
  locationMode: LocationMode;
}

// ============================================
// PHOTO TYPES
// ============================================

export interface PendingPhoto {
  file: File;
  preview: string;
  fieldReference: string;
}

export interface PhotoUploadItem {
  file: File;
  preview: string;
  fieldReference: string;
}

export interface PhotoMetadata {
  inspectionId?: string;
  locationId?: string;
  componentId?: string;
  uploadedBy?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

// ============================================
// GEOLOCATION
// ============================================

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// ============================================
// FORM STATE
// ============================================

export interface InspectionFormState {
  templateId: string;
  locationId: string | null;
  userId: string;
  
  template: InspectionTemplate | null;
  location: Location | null;
  components: InspectionComponent[];
  
  responses: InspectionResponses;
  notes: string;
  pendingPhotos: PendingPhoto[];
  
  geolocation: GeolocationData | null;
  startTime: number;
  duration: number;
  
  uiState: InspectionUIState;
}

// Alias for backward compatibility
export type InspectionFormData = InspectionFormState;
export type InspectionDraft = Partial<InspectionFormState>;

// ============================================
// DTOs
// ============================================

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string;
  inspection_time: string;
  overall_status: OverallStatus;
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
  geolocation?: any;
}

export interface UpdateInspectionDTO {
  overall_status?: OverallStatus;
  responses?: InspectionResponses;
  photo_urls?: string[];
  notes?: string | null;
}

// ============================================
// VALIDATION
// ============================================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================
// API RESPONSES
// ============================================

export interface InspectionSubmitResult {
  success: boolean;
  data?: InspectionRecord;
  inspectionId?: string;
  error?: string;
}

// ============================================
// HOOKS
// ============================================

export interface UseInspectionReturn {
  state: InspectionFormState;
  updateResponse: (componentId: string, data: Partial<ComponentResponse>) => void;
  addPhoto: (file: File, componentId: string) => void;
  removePhoto: (photoId: string) => void;
  submit: () => Promise<InspectionSubmitResult>;
  reset: () => void;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// FILTERS
// ============================================

export interface InspectionFilters {
  locationId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: OverallStatus;
}
EOF

echo "✅ Fixed inspection.types.ts"
echo ""

# ============================================
# 3. FIX USER.TYPES.TS - Add role field
# ============================================

echo "📝 Step 3: Fixing user.types.ts..."

cat > src/core/types/user.types.ts << 'EOF'
// src/core/types/user.types.ts
// ============================================
// USER DOMAIN TYPES
// ============================================

import { User as DBUser, UserInsert, UserUpdate, Role, UserRole as DBUserRole } from './database.types';

export type { UserInsert, UserUpdate, Role };

// Extended User type with role
export interface User extends DBUser {
  role?: string;
  roles?: Role[];
}

export type UserRole = 'super_admin' | 'admin' | 'supervisor' | 'team_leader' | 'cleaner';

export interface UserWithRoles extends User {
  primaryRole?: Role;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  phone?: string | null;
  profilePhotoUrl?: string | null;
}
EOF

echo "✅ Fixed user.types.ts"
echo ""

# ============================================
# 4. FIX SUPABASE.TS - Export all types
# ============================================

echo "📝 Step 4: Fixing supabase.ts..."

cat > src/infrastructure/database/supabase.ts << 'EOF'
// src/infrastructure/database/supabase.ts
// ============================================
// SUPABASE CLIENT
// ============================================

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export all database types for convenience
export type { Database };
export type * from '@/core/types/database.types';
EOF

echo "✅ Fixed supabase.ts"
echo ""

# ============================================
# 5. FIX LOCATION.SERVICE.TS - Make it a proper module
# ============================================

echo "📝 Step 5: Fixing location.service.ts..."

cat > src/infrastructure/services/location.service.ts << 'EOF'
// src/infrastructure/services/location.service.ts
// ============================================
// LOCATION SERVICE
// ============================================

import { supabase } from '../database/supabase';
import { Location } from '@/core/types/database.types';

export const locationService = {
  async getLocationByQR(qrCode: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('qr_code', qrCode)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data;
  },

  async getLocationById(id: string): Promise<Location | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching location:', error);
      return null;
    }

    return data;
  },

  async getAllLocations(): Promise<Location[]> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }

    return data || [];
  },
};
EOF

echo "✅ Fixed location.service.ts"
echo ""

# ============================================
# 6. FIX INSPECTION.SERVICE.TS - Export proper service
# ============================================

echo "📝 Step 6: Fixing inspection.service.ts..."

cat > src/infrastructure/services/inspection.service.ts << 'EOF'
// src/infrastructure/services/inspection.service.ts
// ============================================
// INSPECTION SERVICE
// ============================================

import { supabase } from '../database/supabase';
import { CreateInspectionDTO, InspectionRecord } from '@/core/types/inspection.types';

export const inspectionService = {
  async create(dto: CreateInspectionDTO): Promise<InspectionRecord> {
    const { data, error } = await supabase
      .from('inspection_records')
      .insert({
        template_id: dto.template_id,
        location_id: dto.location_id,
        user_id: dto.user_id,
        inspection_date: dto.inspection_date,
        inspection_time: dto.inspection_time,
        overall_status: dto.overall_status,
        responses: dto.responses as any,
        photo_urls: dto.photo_urls,
        notes: dto.notes,
        duration_seconds: dto.duration_seconds,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<InspectionRecord | null> {
    const { data, error } = await supabase
      .from('inspection_records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },
};

// Alias for backward compatibility
export const typedInspectionService = inspectionService;
EOF

echo "✅ Fixed inspection.service.ts"
echo ""

# ============================================
# 7. FIX INDEX EXPORTS
# ============================================

echo "📝 Step 7: Fixing service index exports..."

cat > src/infrastructure/services/index.ts << 'EOF'
// src/infrastructure/services/index.ts

export { inspectionService, typedInspectionService } from './inspection.service';
export { locationService } from './location.service';
export { templateService } from './template.service';
export { notificationService } from './notification.service';
export { cloudinaryService } from './cloudinary.service';
EOF

echo "✅ Fixed service exports"
echo ""

# ============================================
# 8. EXCLUDE BACKUP FROM TYPECHECK
# ============================================

echo "📝 Step 8: Updating tsconfig.json to exclude backup..."

# Add backup folder to exclude
if ! grep -q '"backup-*"' tsconfig.json; then
  # Update tsconfig.json using sed
  sed -i 's/"exclude": \[/"exclude": [\n    "backup-*",/' tsconfig.json
fi

echo "✅ Updated tsconfig.json"
echo ""

# ============================================
# 9. CREATE QUICK FIX FOR REMAINING ERRORS
# ============================================

echo "📝 Step 9: Creating quick fixes document..."

cat > REMAINING_FIXES.md << 'EOF'
# Remaining Type Fixes

## Manual fixes needed in these files:

### 1. src/presentation/components/features/Inspection/InspectionForm.tsx
```typescript
// Line 9: Change imports
import { 
  InspectionRecordInsert, 
  InspectionTemplateInsert, 
  LocationInsert 
} from '@/core/types/database.types';  // ← Changed path

// Line 473: Fix locationName
locationName={state.locationName || undefined}  // ← Add || undefined

// Line 497: Fix rating value
value={response?.rating || undefined}  // ← Change null to undefined

// Line 533: Fix onRemove signature in PhotoPreview component
onRemove={() => removePhoto(photo.preview)}  // ← Wrap in arrow function
```

### 2. src/presentation/components/features/Inspection/ComponentRating.tsx
```typescript
// Line 122 & 160: RatingValue is string, not number
// Remove these lines or change to:
const ratings: RatingValue[] = ['clean', 'needs_work', 'dirty'];
```

### 3. src/app/dashboard/locations/create/page.tsx
```typescript
// Lines 127, 157, 168: Add || '' to handle null
value={formData.building || ''}
value={formData.code || ''}
value={formData.floor || ''}
```

### 4. src/lib/utils/geolocation.utils.ts
```typescript
// Lines 61, 70, 275, 282: timestamp should be number, not string
timestamp: Date.now(),  // ← Use Date.now() instead of toISOString()
```

### 5. Files using old rating system (1-5 instead of clean/needs_work/dirty)
These need manual review:
- src/lib/utils/rating.utils.ts
- src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx

Choose one approach:
A) Keep string ratings ('clean', 'needs_work', 'dirty')
B) Change to number ratings (1-5) everywhere
EOF

echo "✅ Created REMAINING_FIXES.md"
echo ""

# ============================================
# SUMMARY
# ============================================

echo ""
echo "════════════════════════════════════════════"
echo "✅ TYPE ERROR FIXES COMPLETED!"
echo "════════════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "  ✅ Fixed database.types.ts (added Json export)"
echo "  ✅ Fixed inspection.types.ts (exported all types)"
echo "  ✅ Fixed user.types.ts (added role field)"
echo "  ✅ Fixed supabase.ts (proper type exports)"
echo "  ✅ Fixed location.service.ts (made it a module)"
echo "  ✅ Fixed inspection.service.ts (proper exports)"
echo "  ✅ Updated tsconfig.json (exclude backup)"
echo ""
echo "📝 Next Steps:"
echo "  1. Run: npm run type-check"
echo "  2. Check REMAINING_FIXES.md for manual fixes"
echo "  3. Expected ~30-40 errors remaining (down from 167!)"
echo ""
echo "🎯 Focus Areas for Manual Fix:"
echo "  - InspectionForm.tsx (8 errors)"
echo "  - Rating system alignment (number vs string)"
echo "  - Null vs undefined in forms"
echo ""
echo "════════════════════════════════════════════"
EOF

chmod +x fix-type-errors.sh
echo "✅ Script created: fix-type-errors.sh"