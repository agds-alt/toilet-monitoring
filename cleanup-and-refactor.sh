#!/bin/bash
# ============================================
# PHASE 1: CLEANUP & REFACTOR SCRIPT
# Toilet Monitoring - Clean Architecture
# ============================================

set -e  # Exit on error

echo "🚀 Starting Cleanup & Refactor..."
echo ""

# ============================================
# 1. BACKUP CURRENT STATE
# ============================================

echo "📦 Step 1: Creating backup..."

BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup files that will be deleted
cp src/core/types/inspection.types.backup.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/core/types/inspection.types.aligned.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/presentation/components/features/Inspection/InspectionForm.backup.tsx "$BACKUP_DIR/" 2>/dev/null || true
cp src/presentation/hooks/useInspection-fix.ts "$BACKUP_DIR/" 2>/dev/null || true
cp src/presentation/contexts/auth-types-fix.md "$BACKUP_DIR/" 2>/dev/null || true
cp src/core/types/user-role-fix.md "$BACKUP_DIR/" 2>/dev/null || true

echo "✅ Backup created in: $BACKUP_DIR"
echo ""

# ============================================
# 2. DELETE DUPLICATE & UNUSED FILES
# ============================================

echo "🗑️  Step 2: Removing duplicate/unused files..."

# Delete backup files
rm -f src/core/types/inspection.types.backup.ts
rm -f src/core/types/inspection.types.aligned.ts
rm -f src/presentation/components/features/Inspection/InspectionForm.backup.tsx
rm -f src/presentation/hooks/useInspection-fix.ts
rm -f src/presentation/contexts/auth-types-fix.md
rm -f src/core/types/user-role-fix.md

echo "✅ Removed 6 duplicate files"
echo ""

# ============================================
# 3. CREATE ALIGNED TYPES (Single Source of Truth)
# ============================================

echo "📝 Step 3: Creating aligned types..."

cat > src/core/types/database.types.ts << 'EOF'
// src/core/types/database.types.ts
// ============================================
// DATABASE TYPES - Aligned with Supabase
// Single source of truth for all database types
// ============================================

import { Database } from '@/supabase.types';

// Export main database type
export type { Database };

// ============================================
// TABLE TYPES (from Supabase)
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

echo "✅ Created database.types.ts"
echo ""

# ============================================
# 4. CREATE DOMAIN TYPES (Business Logic)
# ============================================

echo "📝 Step 4: Creating domain types..."

cat > src/core/types/inspection.types.ts << 'EOF'
// src/core/types/inspection.types.ts
// ============================================
// INSPECTION DOMAIN TYPES
// Business logic types for inspection module
// ============================================

import { 
  InspectionRecord, 
  InspectionRecordInsert,
  InspectionTemplate,
  Location,
  Photo 
} from './database.types';

// ============================================
// TEMPLATE STRUCTURE (from JSONB field)
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
// RATING & RESPONSE TYPES
// ============================================

export type RatingValue = 'clean' | 'needs_work' | 'dirty';
export type OverallStatus = RatingValue;

export interface ComponentResponse {
  rating: RatingValue | null;
  comment?: string;
  photos?: string[]; // URLs after upload
}

export type InspectionResponses = Record<string, ComponentResponse>;

// ============================================
// UI STATE TYPES
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
// PENDING PHOTO (before upload)
// ============================================

export interface PendingPhoto {
  file: File;
  preview: string; // Blob URL
  fieldReference: string; // Component ID
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
  // Core data
  templateId: string;
  locationId: string | null;
  userId: string;
  
  // Template & location info (loaded from DB)
  template: InspectionTemplate | null;
  location: Location | null;
  components: InspectionComponent[];
  
  // User input
  responses: InspectionResponses;
  notes: string;
  pendingPhotos: PendingPhoto[];
  
  // Metadata
  geolocation: GeolocationData | null;
  startTime: number;
  duration: number;
  
  // UI preferences
  uiState: InspectionUIState;
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateInspectionDTO {
  template_id: string;
  location_id: string;
  user_id: string;
  inspection_date: string; // YYYY-MM-DD
  inspection_time: string; // HH:MM:SS
  overall_status: OverallStatus;
  responses: InspectionResponses;
  photo_urls: string[];
  notes?: string | null;
  duration_seconds: number;
}

export interface UpdateInspectionDTO {
  overall_status?: OverallStatus;
  responses?: InspectionResponses;
  photo_urls?: string[];
  notes?: string | null;
  verification_notes?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
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

export interface TemplateLoadResult {
  success: boolean;
  data?: InspectionTemplate;
  error?: string;
}

// ============================================
// FILTERS & QUERIES
// ============================================

export interface InspectionFilters {
  locationId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: OverallStatus;
  verified?: boolean;
}

export interface InspectionHistoryQuery extends InspectionFilters {
  limit?: number;
  offset?: number;
  orderBy?: 'inspection_date' | 'submitted_at' | 'overall_status';
  orderDirection?: 'asc' | 'desc';
}
EOF

echo "✅ Created inspection.types.ts"
echo ""

# ============================================
# 5. CREATE LOCATION TYPES
# ============================================

cat > src/core/types/location.types.ts << 'EOF'
// src/core/types/location.types.ts
// ============================================
// LOCATION DOMAIN TYPES
// ============================================

import { Location, LocationInsert, LocationUpdate } from './database.types';

export type { Location, LocationInsert, LocationUpdate };

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationFilters {
  building?: string;
  floor?: string;
  area?: string;
  section?: string;
  isActive?: boolean;
  searchTerm?: string;
}

export interface BulkLocationData {
  name: string;
  code?: string;
  building?: string;
  floor?: string;
  area?: string;
  section?: string;
  description?: string;
}

export interface LocationStats {
  totalInspections: number;
  cleanCount: number;
  needsWorkCount: number;
  dirtyCount: number;
  averageScore: number;
  lastInspectionDate: string | null;
}
EOF

echo "✅ Created location.types.ts"
echo ""

# ============================================
# 6. CREATE USER TYPES
# ============================================

cat > src/core/types/user.types.ts << 'EOF'
// src/core/types/user.types.ts
// ============================================
// USER DOMAIN TYPES
// ============================================

import { User, UserInsert, UserUpdate, Role, UserRole } from './database.types';

export type { User, UserInsert, UserUpdate, Role, UserRole };

export type RoleLevel = 'super_admin' | 'admin' | 'supervisor' | 'team_leader' | 'cleaner';

export interface UserWithRoles extends User {
  roles: Role[];
  primaryRole?: Role;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role?: string;
  roleLevel?: RoleLevel;
  phone?: string | null;
  profilePhotoUrl?: string | null;
}
EOF

echo "✅ Created user.types.ts"
echo ""

# ============================================
# 7. UPDATE INDEX (Barrel Export)
# ============================================

cat > src/core/types/index.ts << 'EOF'
// src/core/types/index.ts
// ============================================
// CENTRALIZED TYPE EXPORTS
// ============================================

// Database types (from Supabase)
export * from './database.types';

// Domain types
export * from './inspection.types';
export * from './location.types';
export * from './user.types';

// Keep existing enums
export * from './enums';
EOF

echo "✅ Updated types/index.ts"
echo ""

# ============================================
# 8. UPDATE SUPABASE CLIENT
# ============================================

cat > src/infrastructure/database/supabase.ts << 'EOF'
// src/infrastructure/database/supabase.ts
// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create typed client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export types for convenience
export type { Database };
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update'];
EOF

echo "✅ Updated supabase.ts"
echo ""

# ============================================
# 9. CREATE FOLDER STRUCTURE FOR DDD
# ============================================

echo "📁 Step 5: Organizing folder structure..."

# Create domain folders if not exist
mkdir -p src/domain/inspection
mkdir -p src/domain/location
mkdir -p src/domain/user
mkdir -p src/domain/shared

echo "✅ Domain folders created"
echo ""

# ============================================
# 10. CREATE CONSTANTS
# ============================================

cat > src/core/constants/inspection.ts << 'EOF'
// src/core/constants/inspection.ts
// ============================================
// INSPECTION CONSTANTS
// ============================================

export const INSPECTION_STATUS = {
  CLEAN: 'clean',
  NEEDS_WORK: 'needs_work',
  DIRTY: 'dirty',
} as const;

export const RATING_VALUES = ['clean', 'needs_work', 'dirty'] as const;

export const RATING_LABELS = {
  clean: 'Bersih',
  needs_work: 'Perlu Perbaikan',
  dirty: 'Kotor',
} as const;

export const RATING_EMOJIS = {
  clean: '😊',
  needs_work: '😐',
  dirty: '😞',
} as const;

export const RATING_COLORS = {
  clean: '#10b981',
  needs_work: '#f59e0b',
  dirty: '#ef4444',
} as const;

export const VALIDATION_RULES = {
  minRatedComponents: 3,
  maxPhotosPerComponent: 5,
  maxTotalPhotos: 20,
  maxPhotoSize: 5 * 1024 * 1024, // 5MB
  maxNotesLength: 500,
  requiredFields: ['template_id', 'location_id', 'user_id'],
} as const;

export const UI_MODES = ['genz', 'professional'] as const;
export const PHOTO_MODES = ['solo', 'batch'] as const;
export const LOCATION_MODES = ['qr', 'gps', 'manual'] as const;
EOF

echo "✅ Created inspection constants"
echo ""

# ============================================
# 11. GENERATE SUMMARY
# ============================================

echo ""
echo "════════════════════════════════════════════"
echo "✅ CLEANUP & REFACTOR COMPLETED!"
echo "════════════════════════════════════════════"
echo ""
echo "📊 Summary:"
echo "  ✅ Deleted 6 duplicate/unused files"
echo "  ✅ Created 4 aligned type files"
echo "  ✅ Updated supabase client"
echo "  ✅ Organized domain structure"
echo "  ✅ Created constants"
echo ""
echo "📁 New Type Structure:"
echo "  src/core/types/"
echo "    ├── database.types.ts      (Supabase types)"
echo "    ├── inspection.types.ts    (Inspection domain)"
echo "    ├── location.types.ts      (Location domain)"
echo "    ├── user.types.ts          (User domain)"
echo "    └── index.ts               (Barrel exports)"
echo ""
echo "🔄 Next Steps:"
echo "  1. Run type check: npm run type-check"
echo "  2. Fix any import errors in existing files"
echo "  3. Ready for Phase 2: Inspection Form refactor"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo ""
echo "════════════════════════════════════════════"
EOF

chmod +x cleanup-and-refactor.sh
echo "✅ Script created: cleanup-and-refactor.sh"