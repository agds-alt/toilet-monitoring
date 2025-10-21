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
