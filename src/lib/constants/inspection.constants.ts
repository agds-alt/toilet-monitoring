// src/lib/constants/inspection.constants.ts
// ============================================
// INSPECTION CONSTANTS - UPDATED
// ============================================

import { InspectionComponent } from '@/core/types/inspection.types';

// ============================================
// DEFAULT 11 TOILET COMPONENTS
// ============================================

export const DEFAULT_TOILET_COMPONENTS: InspectionComponent[] = [
  {
    id: 'toilet_bowl',
    label: 'Toilet Bowl / Kloset',
    label_id: 'Kebersihan Kloset',
    description: 'Cleanliness and condition of the toilet bowl',
    type: 'rating',
    required: true,
    order: 1,
    icon: '🚽',
  },
  {
    id: 'floor_cleanliness',
    label: 'Floor Cleanliness',
    label_id: 'Kebersihan Lantai',
    description: 'Overall floor cleanliness and dryness',
    type: 'rating',
    required: true,
    order: 2,
    icon: '🧹',
  },
  {
    id: 'wall_cleanliness',
    label: 'Wall Cleanliness',
    label_id: 'Kebersihan Dinding',
    description: 'Walls, tiles, and surfaces condition',
    type: 'rating',
    required: true,
    order: 3,
    icon: '🧱',
  },
  {
    id: 'sink_wastafel',
    label: 'Sink / Wastafel',
    label_id: 'Wastafel',
    description: 'Sink cleanliness and water flow',
    type: 'rating',
    required: true,
    order: 4,
    icon: '🚰',
  },
  {
    id: 'soap_dispenser',
    label: 'Soap Dispenser',
    label_id: 'Sabun',
    description: 'Soap availability and dispenser condition',
    type: 'rating',
    required: true,
    order: 5,
    icon: '🧼',
  },
  {
    id: 'tissue_availability',
    label: 'Tissue / Paper Towel',
    label_id: 'Tisu / Handuk Kertas',
    description: 'Tissue availability and dispenser condition',
    type: 'rating',
    required: true,
    order: 6,
    icon: '🧻',
  },
  {
    id: 'trash_bin',
    label: 'Trash Bin',
    label_id: 'Tempat Sampah',
    description: 'Trash bin cleanliness and fullness',
    type: 'rating',
    required: true,
    order: 7,
    icon: '🗑️',
  },
  {
    id: 'door_lock',
    label: 'Door & Lock',
    label_id: 'Pintu & Kunci',
    description: 'Door condition and lock functionality',
    type: 'rating',
    required: true,
    order: 8,
    icon: '🚪',
  },
  {
    id: 'ventilation',
    label: 'Ventilation',
    label_id: 'Ventilasi',
    description: 'Air circulation and ventilation system',
    type: 'rating',
    required: true,
    order: 9,
    icon: '💨',
  },
  {
    id: 'lighting',
    label: 'Lighting',
    label_id: 'Pencahayaan',
    description: 'Light brightness and functionality',
    type: 'rating',
    required: true,
    order: 10,
    icon: '💡',
  },
  {
    id: 'overall_smell',
    label: 'Overall Smell / Aroma',
    label_id: 'Aroma Keseluruhan',
    description: 'Overall smell and air freshness',
    type: 'rating',
    required: true,
    order: 11,
    icon: '👃',
  },
];

// ============================================
// STATUS THRESHOLDS
// ============================================

export const STATUS_THRESHOLDS = {
  EXCELLENT: 4.5,
  GOOD: 3.5,
  FAIR: 2.5,
  POOR: 1.5,
  CRITICAL: 1.0,
} as const;

export const STATUS_COLORS = {
  Excellent: {
    bg: '#10b981',
    text: '#ffffff',
    badge: 'bg-green-500',
  },
  Good: {
    bg: '#3b82f6',
    text: '#ffffff',
    badge: 'bg-blue-500',
  },
  Fair: {
    bg: '#f59e0b',
    text: '#ffffff',
    badge: 'bg-yellow-500',
  },
  Poor: {
    bg: '#ef4444',
    text: '#ffffff',
    badge: 'bg-red-500',
  },
  Critical: {
    bg: '#991b1b',
    text: '#ffffff',
    badge: 'bg-red-800',
  },
} as const;

// ============================================
// UI MODE SETTINGS
// ============================================

export const UI_MODE_CONFIG = {
  professional: {
    name: 'Professional',
    icon: '💼',
    theme: 'clean',
    primaryColor: '#1e40af',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  genz: {
    name: 'Gen Z',
    icon: '🎨',
    theme: 'vibrant',
    primaryColor: '#ec4899',
    fontFamily: 'Space Grotesk, system-ui, sans-serif',
  },
} as const;

// ============================================
// PHOTO SETTINGS - UPDATED! 📸
// ============================================

export const PHOTO_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  // ✅ UPDATED: Minimum 0 (optional), Maximum 3 per component
  minPhotosPerComponent: 0, // Optional - ga wajib
  maxPhotosPerComponent: 3, // Max 3 per component
  recommendedPhotosPerComponent: 1, // Recommended 1 for documentation
  compressionQuality: 0.8,
  maxWidth: 1920,
  maxHeight: 1920,
} as const;

// ============================================
// DRAFT SETTINGS
// ============================================

export const DRAFT_CONFIG = {
  storageKey: 'toilet-monitoring-draft',
  expiryHours: 24,
  maxDrafts: 5,
  autoSaveInterval: 30000, // 30 seconds
} as const;

// ============================================
// VALIDATION RULES - UPDATED! ✅
// ============================================

export const VALIDATION_RULES = {
  // Soft warning if less than 8 components rated
  minRatedComponents: 8,

  // ✅ UPDATED: Photos are OPTIONAL (not required)
  requirePhotos: false,

  // Comments are optional
  requireComments: false,

  // Max note length
  maxNoteLength: 1000,

  // ✅ NEW: Photo limits per component
  minPhotosPerComponent: 0, // No minimum (optional)
  maxPhotosPerComponent: 3, // Maximum 3 photos
} as const;

// ============================================
// GEOLOCATION SETTINGS
// ============================================

export const GEOLOCATION_CONFIG = {
  timeout: 10000, // 10 seconds
  maximumAge: 0,
  enableHighAccuracy: true,
  // Nominatim (OpenStreetMap) - FREE!
  reverseGeocodeUrl: 'https://nominatim.openstreetmap.org/reverse',
  userAgent: 'ToiletMonitoringApp/1.0',
} as const;

// ============================================
// CLOUDINARY SETTINGS (from .env)
// ============================================

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
  folder: 'toilet-monitoring/inspections',
  transformation: {
    quality: 'auto:good',
    fetch_format: 'auto',
  },
} as const;

// ============================================
// RATING MAPS (moved from types to constants)
// ============================================

export const RATING_EMOJI_MAP: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '🤩',
};

export const RATING_LABEL_MAP: Record<1 | 2 | 3 | 4 | 5, { en: string; id: string }> = {
  1: { en: 'Very Poor', id: 'Sangat Buruk' },
  2: { en: 'Poor', id: 'Kurang' },
  3: { en: 'Fair', id: 'Cukup' },
  4: { en: 'Good', id: 'Bagus' },
  5: { en: 'Excellent', id: 'Sangat Bagus' },
};

// ============================================
// TIME FORMAT
// ============================================

export const TIME_FORMAT = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss',
  display: 'DD MMM YYYY, HH:mm',
} as const;

// ============================================
// API ENDPOINTS (relative to /api)
// ============================================

export const API_ENDPOINTS = {
  inspection: {
    submit: '/api/inspections',
    draft: '/api/inspections/draft',
    verify: '/api/inspections/verify',
  },
  template: {
    list: '/api/templates',
    detail: '/api/templates',
  },
  location: {
    detail: '/api/locations',
    qr: '/api/locations/qr',
  },
  photo: {
    upload: '/api/upload',
    delete: '/api/photos',
  },
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  network: 'Koneksi internet bermasalah. Coba lagi nanti.',
  upload: 'Gagal upload foto. Periksa koneksi internet.',
  geolocation: 'Gagal mendapatkan lokasi. Pastikan GPS aktif.',
  permission: 'Izin lokasi diperlukan untuk fitur ini.',
  validation: 'Data belum lengkap. Periksa kembali.',
  submit: 'Gagal mengirim data. Coba lagi.',
  generic: 'Terjadi kesalahan. Coba lagi nanti.',
  photoLimit: `Maksimal ${PHOTO_CONFIG.maxPhotosPerComponent} foto per komponen`,
  photoSize: `Ukuran foto maksimal ${PHOTO_CONFIG.maxFileSize / 1024 / 1024}MB`,
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  submit: 'Inspeksi berhasil dikirim! 🎉',
  draft: 'Draft tersimpan otomatis',
  photo: 'Foto berhasil diupload',
  location: 'Lokasi berhasil didapatkan',
} as const;
