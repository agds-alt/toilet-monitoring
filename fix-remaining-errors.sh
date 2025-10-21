#!/bin/bash
# ============================================
# PHASE 3: FIX REMAINING TYPE ERRORS
# Handle specific type mismatches
# ============================================

set -e

echo "🔧 Phase 3: Fixing Remaining Errors..."
echo ""

# ============================================
# 1. FIX SUPABASE.TYPES PATH
# ============================================

echo "📝 Step 1: Fixing supabase.types path..."

cat > src/core/types/database.types.ts << 'EOF'
// src/core/types/database.types.ts
import type { Database } from '@/supabase.types';

export type { Database };
export type Json = Database['public']['Tables']['inspection_records']['Row']['responses'];

// TABLE TYPES
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

export type DailyInspectionSummary = Database['public']['Views']['daily_inspection_summary']['Row'];
EOF

cat > src/infrastructure/database/supabase.ts << 'EOF'
// src/infrastructure/database/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export type { Database };
export type * from '@/core/types/database.types';
EOF

echo "✅ Fixed supabase.types import"

# ============================================
# 2. FIX USER.TYPES - Remove duplicate exports
# ============================================

echo "📝 Step 2: Fixing user.types..."

cat > src/core/types/user.types.ts << 'EOF'
// src/core/types/user.types.ts
import { 
  User as DBUser, 
  UserInsert as DBUserInsert, 
  UserUpdate as DBUserUpdate, 
  Role,
  UserRole as DBUserRole
} from './database.types';

// Export renamed to avoid conflicts
export type { DBUserInsert as UserInsert, DBUserUpdate as UserUpdate, Role };

// Extended User type with role
export interface User extends DBUser {
  role?: string;
  roles?: Role[];
}

export type RoleLevel = 'super_admin' | 'admin' | 'supervisor' | 'team_leader' | 'cleaner';

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

echo "✅ Fixed user.types"

# ============================================
# 3. FIX INDEX.TS - Selective exports
# ============================================

echo "📝 Step 3: Fixing types/index.ts..."

cat > src/core/types/index.ts << 'EOF'
// src/core/types/index.ts
// Selective exports to avoid conflicts

// Database types
export type {
  Database,
  Json,
  InspectionRecord,
  InspectionRecordInsert,
  InspectionRecordUpdate,
  InspectionTemplate,
  InspectionTemplateInsert,
  InspectionTemplateUpdate,
  Location,
  LocationInsert,
  LocationUpdate,
  Photo,
  PhotoInsert,
  PhotoUpdate,
  Role,
  Notification,
  AuditLog,
  DailyInspectionSummary,
} from './database.types';

// User types (avoiding DBUser export to prevent conflict)
export type {
  User,
  UserInsert,
  UserUpdate,
  RoleLevel,
  UserWithRoles,
  AuthUser,
} from './user.types';

// Domain types
export * from './inspection.types';
export * from './location.types';

// Enums (if they don't conflict)
// export * from './enums';
EOF

echo "✅ Fixed types/index"

# ============================================
# 4. FIX INSPECTION.TYPES - Add description field
# ============================================

echo "📝 Step 4: Adding description to InspectionComponent..."

cat > src/core/types/inspection.types.ts << 'EOF'
// src/core/types/inspection.types.ts
import { 
  InspectionRecord, 
  InspectionRecordInsert,
  InspectionTemplate,
  Location,
  Photo 
} from './database.types';

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
  description?: string;  // ← Added this
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
  formatted_address?: string;  // ← Added for useGeolocation
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

echo "✅ Fixed inspection.types"

# ============================================
# 5. FIX GEOLOCATION.UTILS - timestamp
# ============================================

echo "📝 Step 5: Fixing geolocation.utils timestamp..."

sed -i 's/timestamp: new Date().toISOString()/timestamp: Date.now()/g' src/lib/utils/geolocation.utils.ts

# Remove 'address' field that doesn't exist
sed -i '/address: formattedAddress.street,/d' src/lib/utils/geolocation.utils.ts

echo "✅ Fixed geolocation.utils"

# ============================================
# 6. FIX VALIDATION.UTILS - property names
# ============================================

echo "📝 Step 6: Fixing validation.utils..."

sed -i 's/data.template_id/data.templateId/g' src/lib/utils/validation.utils.ts
sed -i 's/data.location_id/data.locationId/g' src/lib/utils/validation.utils.ts
sed -i 's/data.user_id/data.userId/g' src/lib/utils/validation.utils.ts
sed -i 's/data.photo_urls/data.pendingPhotos/g' src/lib/utils/validation.utils.ts

# Fix rating comparisons (remove number comparisons for string ratings)
sed -i 's/response.rating <= 2/response.rating === "dirty" || response.rating === "needs_work"/g' src/lib/utils/validation.utils.ts
sed -i 's/response.rating < 1 || response.rating > 5/false/g' src/lib/utils/validation.utils.ts

echo "✅ Fixed validation.utils"

# ============================================
# 7. CREATE COMPONENT RATING FIX
# ============================================

echo "📝 Step 7: Creating ComponentRating fix..."

cat > COMPONENT_RATING_FIX.md << 'EOF'
# ComponentRating.tsx Fix

Replace lines 122 and 160 in `src/presentation/components/features/Inspection/ComponentRating.tsx`:

```typescript
// OLD (lines 122 & 160):
const ratings: RatingValue[] = [1, 2, 3, 4, 5];

// NEW:
const ratings: RatingValue[] = ['dirty', 'needs_work', 'clean'];
```

Or if you want to keep the 5-star system, change RatingValue type to numbers:
```typescript
// In inspection.types.ts:
export type RatingValue = 1 | 2 | 3 | 4 | 5;
```
EOF

echo "✅ Created ComponentRating fix guide"

# ============================================
# 8. FIX INSPECTION FORM - Quick patches
# ============================================

echo "📝 Step 8: Patching InspectionForm.tsx..."

# Fix locationName
sed -i 's/locationName={state.locationName}/locationName={state.locationName || undefined}/g' src/presentation/components/features/Inspection/InspectionForm.tsx

# Fix rating value
sed -i 's/value={response?.rating || null}/value={response?.rating || undefined}/g' src/presentation/components/features/Inspection/InspectionForm.tsx

# Fix componentLabel
sed -i 's/componentLabel=/componentName=/g' src/presentation/components/features/Inspection/InspectionForm.tsx

echo "✅ Patched InspectionForm.tsx"

# ============================================
# 9. FIX LOCATIONS CREATE PAGE
# ============================================

echo "📝 Step 9: Fixing locations create page..."

sed -i 's/value={formData.building}/value={formData.building || ""}/g' src/app/dashboard/locations/create/page.tsx
sed -i 's/value={formData.code}/value={formData.code || ""}/g' src/app/dashboard/locations/create/page.tsx
sed -i 's/value={formData.floor}/value={formData.floor || ""}/g' src/app/dashboard/locations/create/page.tsx

echo "✅ Fixed locations create page"

# ============================================
# 10. CREATE REMAINING MANUAL FIXES DOC
# ============================================

cat > MANUAL_FIXES_NEEDED.md << 'EOF'
# Manual Fixes Still Needed

## 1. rating.utils.ts - Rating System Decision

**Choose ONE approach:**

### Option A: Keep String Ratings (RECOMMENDED)
```typescript
// Use: 'clean', 'needs_work', 'dirty'
// No numeric operations needed
// Update all utility functions to use string checks
```

### Option B: Switch to Number Ratings
```typescript
// Change RatingValue to: 1 | 2 | 3 | 4 | 5
// Update all components to use numbers
// Requires more refactoring
```

**Affected files:**
- src/lib/utils/rating.utils.ts (lines 8, 32, 54, 75, 86, 106, 165)
- src/presentation/components/features/Inspection/ComponentRating.tsx

---

## 2. PhotoCapture.tsx - Remove locationId

Line 56: Remove `locationId` from PhotoUploadItem:
```typescript
// Remove this line:
locationId,
```

---

## 3. useInspection.ts - Fix state shape

Multiple issues:
- Line 47: startTime should be `Date.now()` not `null`
- Line 52: Remove `currentStep` (not in InspectionUIState)
- Line 135: Remove `isDraft` check
- Line 221: Use `pendingPhotos` not `photos`
- Lines 263, 289, 306: Remove `id` from draft operations
- Line 334: Use `pendingPhotos` not `photos`
- Line 359: Use `create` instead of `submitInspection`
- Line 402, 426: Use `templateId` not `template_id`

---

## 4. Entities - Create proper Entity classes

Missing exports in:
- src/core/entities/Inspection.ts (InspectionEntity)
- src/core/entities/User.ts (UserEntity)
- src/core/entities/Photo.ts (file doesn't exist)

Create these if needed for Clean Architecture, or use types directly.

---

## 5. Use Cases - Fix imports

- src/core/use-cases/GetInspectionHistory.ts (doesn't exist)
- src/core/use-cases/CreateLocation.ts (wrong export name)
- src/core/use-cases/UpdateLocation.ts (wrong export name)

---

## 6. PhotoPreview.tsx - Fix onRemove signature

Change from:
```typescript
onRemove?: () => void;
```

To:
```typescript
onRemove?: (preview: string) => void;
```

---

## Expected Final Result: ~40-50 errors remaining
Most are related to:
1. Rating system (string vs number)
2. useInspection hook refactoring
3. Missing entity classes
EOF

echo "✅ Created manual fixes guide"

# ============================================
# SUMMARY
# ============================================

echo ""
echo "════════════════════════════════════════════"
echo "✅ PHASE 3 COMPLETED!"
echo "════════════════════════════════════════════"
echo ""
echo "📊 Fixed Issues:"
echo "  ✅ Supabase types import path"
echo "  ✅ User types duplicate exports"
echo "  ✅ Types index selective exports"
echo "  ✅ Added description field to InspectionComponent"
echo "  ✅ Fixed geolocation timestamp (string → number)"
echo "  ✅ Fixed validation.utils property names"
echo "  ✅ Patched InspectionForm null → undefined"
echo "  ✅ Fixed locations create page null values"
echo ""
echo "📝 Check These Files:"
echo "  • COMPONENT_RATING_FIX.md"
echo "  • MANUAL_FIXES_NEEDED.md"
echo ""
echo "🎯 Next Step:"
echo "  Run: npm run type-check"
echo "  Expected: ~40-50 errors (mostly rating system & useInspection)"
echo ""
echo "════════════════════════════════════════════"
EOF

chmod +x fix-remaining-errors.sh