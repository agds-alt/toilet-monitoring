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
