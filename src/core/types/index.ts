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
