/**
 * Inspection Constants
 * Default values and configurations for toilet inspections
 */

export const DEFAULT_TOILET_COMPONENTS = [
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

/**
 * Cloudinary Configuration
 */
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: 'toilet-inspections',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
};

/**
 * Rating Emoji Mapping
 */
export const RATING_EMOJI_MAP: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😀',
};

/**
 * Rating Label Mapping
 */
export const RATING_LABEL_MAP: Record<number, string> = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
};

/**
 * Inspection Status
 */
export const INSPECTION_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

/**
 * Overall Status Labels
 */
export const OVERALL_STATUS_LABELS = {
  pass: 'Lulus',
  fail: 'Tidak Lulus',
  needs_attention: 'Perlu Perhatian',
} as const;

/**
 * Priority Levels
 */
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Rating Values
 */
export const RATING_VALUES = [1, 2, 3, 4, 5] as const;

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  REQUIRED_FIELDS: ['template_id', 'location_id', 'user_id'],
  requiredFields: ['template_id', 'location_id', 'user_id'], // camelCase alias
  MAX_NOTES_LENGTH: 500,
  maxNotesLength: 500, // camelCase alias
  MAX_PHOTOS: 10,
  maxTotalPhotos: 10, // Alias for MAX_PHOTOS
  maxPhotoSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  minRatedComponents: 3,
  minDurationSeconds: 30, // Minimum inspection duration in seconds
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  MISSING_REQUIRED_FIELD: 'This field is required',
  REQUIRED_FIELD: 'This field is required', // Alias for compatibility
  INVALID_RATING: 'Rating must be between 1 and 5',
  NOTES_TOO_LONG: `Notes cannot exceed ${VALIDATION_RULES.MAX_NOTES_LENGTH} characters`,
  NOTES_LENGTH: `Notes cannot exceed ${VALIDATION_RULES.MAX_NOTES_LENGTH} characters`, // Alias
  TOO_MANY_PHOTOS: `Maximum ${VALIDATION_RULES.MAX_PHOTOS} photos allowed`,
  MAX_PHOTOS: `Maximum ${VALIDATION_RULES.MAX_PHOTOS} photos allowed`, // Alias
  INVALID_TEMPLATE: 'Invalid inspection template',
  INVALID_LOCATION: 'Invalid location',
  PHOTO_SIZE: `Photo size cannot exceed ${VALIDATION_RULES.maxPhotoSize / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
  MIN_COMPONENTS: `At least ${VALIDATION_RULES.minRatedComponents} components must be rated`,
};
