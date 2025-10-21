// ============================================
// BARREL EXPORTS - Create these index.ts files
// ============================================

// 1. src/presentation/components/features/inspection/index.ts
// ============================================
export { InspectionForm } from './InspectionForm';
export { UIModeSwitcher } from './UIModeSwitcher';
export { PhotoModeSwitcher } from './PhotoModeSwitcher';
export { LocationModeSwitcher } from './LocationModeSwitcher';
export { ComponentRating } from './ComponentRating';
export { CommentModal } from './CommentModal';
export { PhotoCapture } from './PhotoCapture';
export { PhotoPreview } from './PhotoPreview';
export { QRScannerModal } from './QRSCannerModal';
export { SeedTemplateButton } from './SeedTemplateButton'






// ============================================
// UPDATED IMPORTS IN InspectionForm.tsx
// ============================================
// BEFORE (WRONG):
import { UIModeSwitcher } from './UIModeSwitcher';
import { PhotoModeSwitcher } from './PhotoModeSwitcher';
// ... etc

// AFTER (CORRECT):
