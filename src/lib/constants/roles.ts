// ===================================
// 8. CONSTANTS - ROLES
// ===================================

// src/lib/constants/roles.ts
import { UserRole } from '@/core/types/enums';

export const ROLE_PERMISSIONS = {
  [UserRole.STAFF]: {
    canCreateInspection: true,
    canViewOwnInspections: true,
    canViewAllInspections: false,
    canViewReports: false,
    canExportData: false,
  },
  [UserRole.MEDICAL]: {
    canCreateInspection: true,
    canViewOwnInspections: true,
    canViewAllInspections: true,
    canViewReports: true,
    canExportData: true,
  },
  [UserRole.CLEANER]: {
    canCreateInspection: true,
    canViewOwnInspections: true,
    canViewAllInspections: true,
    canViewReports: true,
    canExportData: true,
  },
  [UserRole.VISITOR]: {
    canCreateInspection: true,
    canViewOwnInspections: true,
    canViewAllInspections: false,
    canViewReports: false,
    canExportData: false,
  },
};

export const hasPermission = (
  role: UserRole,
  permission: keyof typeof ROLE_PERMISSIONS[UserRole.STAFF]
): boolean => {
  return ROLE_PERMISSIONS[role]?.[permission] || false;
};
