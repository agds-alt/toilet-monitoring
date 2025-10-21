// src/core/types/enums.ts
export enum UserRole {
  STAFF = 'Staff/Karyawan',
  MEDICAL = 'Perawat/Dokter',
  CLEANER = 'Cleaner/Team Leader/Spv',
  VISITOR = 'Pasien/Pengunjung',
}

export enum InspectionStatus {
  ALL_GOOD = 'all_good',
  HAS_ISSUES = 'has_issues',
}

export enum CleanlinessValue {
  CLEAN = 'bersih',
  DIRTY = 'kotor',
  OTHER = 'other',
}

export enum AromaValue {
  FRAGRANT = 'wangi',
  SMELLY = 'bau',
  OTHER = 'other',
}

export enum AvailabilityValue {
  AVAILABLE = 'terisi',
  EMPTY = 'kosong',
  OTHER = 'other',
}
