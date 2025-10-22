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
