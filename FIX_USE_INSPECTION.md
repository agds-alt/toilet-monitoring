# useInspection.ts Manual Fixes

Apply these changes to `src/presentation/hooks/useInspection.ts`:

## 1. Line 47: Fix startTime
```typescript
// OLD:
startTime: null,

// NEW:
startTime: Date.now(),
```

## 2. Line 52: Remove currentStep
```typescript
// DELETE THIS LINE:
currentStep: 1,
```

## 3. Line 135: Remove isDraft check
```typescript
// OLD:
if (state.uiState.isDraft && Object.keys(state.responses).length > 0) {

// NEW:
if (Object.keys(state.responses).length > 0) {
```

## 4. Line 221, 334, 406: Change photos → pendingPhotos
```typescript
// OLD:
photos: prev.photos.filter((p) => p.id !== photoId),

// NEW:
pendingPhotos: prev.pendingPhotos.filter((p) => p.preview !== photoId),
```

## 5. Line 263, 289, 306: Remove id from drafts
Comment out or delete lines with `id:` in draft operations

## 6. Line 353: Fix notes
```typescript
// OLD:
notes: state.notes || undefined,

// NEW:
notes: state.notes || '',
```

## 7. Line 355: Fix geolocation
```typescript
// OLD:
geolocation: state.geolocation || undefined,

// NEW:
geolocation: state.geolocation || null,
```

## 8. Line 359: Use create instead of submitInspection
```typescript
// OLD:
const result = await inspectionService.submitInspection(formData, uploadedPhotos);

// NEW:
const result = await inspectionService.create(formData);
```

## 9. Line 402, 426: Change template_id → templateId
```typescript
// OLD:
template_id: state.template.id,

// NEW:
templateId: state.template?.id || '',
```

## 10. Line 445: Fix addPhoto signature
```typescript
// In UseInspectionReturn interface:
addPhoto: (file: File | PhotoUploadItem, componentId: string) => void;
```

## 11. Line 458: Remove isSubmitting
```typescript
// OLD:
isLoading: state.uiState.isSubmitting,

// NEW:
isLoading: loading,
```
