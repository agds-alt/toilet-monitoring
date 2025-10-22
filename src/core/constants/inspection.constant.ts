// src/core/constants/inspection.constants.ts
// ============================================
// INSPECTION CONSTANTS
// ============================================

import { RatingValue } from '@/core/types/inspection.types';

// ============================================
// STATUS & RATING
// ============================================

export const INSPECTION_STATUS = {
  CLEAN: 'clean',
  NEEDS_WORK: 'needs_work',
  DIRTY: 'dirty',
} as const;

export const RATING_VALUES: RatingValue[] = ['clean', 'needs_work', 'dirty'];

// ============================================
// UI LABELS & COLORS
// ============================================

export const RATING_LABELS: Record<RatingValue, string> = {
  clean: 'Bersih',
  needs_work: 'Perlu Perbaikan',
  dirty: 'Kotor',
};

export const RATING_EMOJIS: Record<RatingValue, string> = {
  clean: '😊',
  needs_work: '😐',
  dirty: '😞',
};

export const RATING_COLORS: Record<RatingValue, string> = {
  clean: '#10b981', // green-500
  needs_work: '#f59e0b', // amber-500
  dirty: '#ef4444', // red-500
};

export const RATING_STARS: Record<RatingValue, number> = {
  clean: 5,
  needs_work: 3,
  dirty: 1,
};

// ============================================
// VALIDATION RULES
// ============================================

export const VALIDATION_RULES = {
  minRatedComponents: 3,
  maxPhotosPerComponent: 5,
  maxTotalPhotos: 20,
  maxPhotoSize: 5 * 1024 * 1024, // 5MB
  maxNotesLength: 500,
  requiredFields: ['template_id', 'location_id', 'user_id'],
  minDurationSeconds: 10, // minimal 10 detik untuk prevent spam
} as const;

// ============================================
// UI MODE OPTIONS
// ============================================

export const UI_MODES = ['genz', 'professional'] as const;
export const PHOTO_MODES = ['solo', 'batch'] as const;
export const LOCATION_MODES = ['qr', 'gps', 'manual'] as const;

export const UI_MODE_LABELS = {
  genz: '🎨 Gen Z Mode',
  professional: '👔 Professional Mode',
} as const;

export const PHOTO_MODE_LABELS = {
  solo: '📷 Solo Photo',
  batch: '📸 Batch Photos',
} as const;

export const LOCATION_MODE_LABELS = {
  qr: '📱 Scan QR',
  gps: '📍 GPS Location',
  manual: '✍️ Manual Input',
} as const;

// ============================================
// COMPONENT ICONS (default)
// ============================================

export const DEFAULT_COMPONENT_ICONS: Record<string, string> = {
  toilet_bowl: '🚽',
  sink: '🚰',
  floor: '🧹',
  mirror: '🪞',
  door: '🚪',
  toilet_paper: '🧻',
  soap: '🧼',
  trash_bin: '🗑️',
  air_freshener: '💨',
  lighting: '💡',
  wall: '🧱',
  default: '✨',
};

// ============================================
// DEFAULT TEMPLATE COMPONENTS
// ============================================

export const DEFAULT_TEMPLATE_COMPONENTS = [
  {
    id: 'toilet_bowl',
    label: 'Toilet Bowl',
    label_id: 'Kloset',
    type: 'rating' as const,
    required: true,
    order: 1,
    icon: '🚽',
  },
  {
    id: 'sink',
    label: 'Sink',
    label_id: 'Wastafel',
    type: 'rating' as const,
    required: true,
    order: 2,
    icon: '🚰',
  },
  {
    id: 'floor',
    label: 'Floor',
    label_id: 'Lantai',
    type: 'rating' as const,
    required: true,
    order: 3,
    icon: '🧹',
  },
  {
    id: 'mirror',
    label: 'Mirror',
    label_id: 'Cermin',
    type: 'rating' as const,
    required: false,
    order: 4,
    icon: '🪞',
  },
  {
    id: 'door',
    label: 'Door',
    label_id: 'Pintu',
    type: 'rating' as const,
    required: false,
    order: 5,
    icon: '🚪',
  },
  {
    id: 'toilet_paper',
    label: 'Toilet Paper',
    label_id: 'Tissue',
    type: 'rating' as const,
    required: false,
    order: 6,
    icon: '🧻',
  },
  {
    id: 'soap',
    label: 'Soap Dispenser',
    label_id: 'Sabun',
    type: 'rating' as const,
    required: false,
    order: 7,
    icon: '🧼',
  },
  {
    id: 'trash_bin',
    label: 'Trash Bin',
    label_id: 'Tempat Sampah',
    type: 'rating' as const,
    required: false,
    order: 8,
    icon: '🗑️',
  },
  {
    id: 'air_freshener',
    label: 'Air Freshener',
    label_id: 'Pengharum',
    type: 'rating' as const,
    required: false,
    order: 9,
    icon: '💨',
  },
  {
    id: 'lighting',
    label: 'Lighting',
    label_id: 'Penerangan',
    type: 'rating' as const,
    required: false,
    order: 10,
    icon: '💡',
  },
  {
    id: 'wall',
    label: 'Wall Condition',
    label_id: 'Dinding',
    type: 'rating' as const,
    required: false,
    order: 11,
    icon: '🧱',
  },
];

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  TEMPLATE_NOT_FOUND: 'Template inspeksi tidak ditemukan',
  LOCATION_NOT_FOUND: 'Lokasi tidak ditemukan',
  INVALID_RATING: 'Rating tidak valid',
  MIN_COMPONENTS: `Minimal ${VALIDATION_RULES.minRatedComponents} komponen harus diisi`,
  MAX_PHOTOS: `Maksimal ${VALIDATION_RULES.maxTotalPhotos} foto`,
  PHOTO_SIZE: `Ukuran foto maksimal ${VALIDATION_RULES.maxPhotoSize / (1024 * 1024)}MB`,
  NOTES_LENGTH: `Catatan maksimal ${VALIDATION_RULES.maxNotesLength} karakter`,
  REQUIRED_FIELD: 'Field ini wajib diisi',
  SUBMISSION_FAILED: 'Gagal mengirim inspeksi',
  NETWORK_ERROR: 'Koneksi internet bermasalah',
} as const;
