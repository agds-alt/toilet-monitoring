// ===================================
// 📁 src/types/index.ts (BONUS - re-exports)
// ===================================

export type { Database } from './supabase';

// Re-export core types for convenience
export type {
  User,
  Location,
  Inspection,
  Assessments,
  AssessmentItem,
  CreateInspectionDTO,
  PhotoMetadata,
} from '@/core/types/interfaces';

export {
  UserRole,
  InspectionStatus,
  CleanlinessValue,
  AromaValue,
  AvailabilityValue,
} from '@/core/types/enums';
