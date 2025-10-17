// src/lib/constants/assessments.ts
import { CleanlinessValue, AromaValue, AvailabilityValue } from '@/core/types/enums';

export type AssessmentType = 'cleanliness' | 'aroma' | 'availability';

export interface AssessmentOption {
  value: CleanlinessValue | AromaValue | AvailabilityValue;
  label: string;
  icon: string;
  color: string;
}

export interface AssessmentConfig {
  id: keyof import('@/core/types/interfaces').Assessments;
  label: string;
  icon: string;
  type: AssessmentType;
  options: AssessmentOption[];
  required: boolean;
}

// Assessment configurations based on requirements
export const ASSESSMENT_CONFIGS: AssessmentConfig[] = [
  {
    id: 'aroma',
    label: 'Aroma',
    icon: '👃',
    type: 'aroma',
    required: true,
    options: [
      { value: AromaValue.FRAGRANT, label: 'Wangi', icon: '✨', color: 'success' },
      { value: AromaValue.SMELLY, label: 'Bau', icon: '🤢', color: 'danger' },
      { value: AromaValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'lantai',
    label: 'Lantai',
    icon: '🧹',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'dinding',
    label: 'Dinding',
    icon: '🧱',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'tempat_sampah',
    label: 'Tempat Sampah',
    icon: '🗑️',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'cermin',
    label: 'Cermin',
    icon: '🪞',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'wastafel',
    label: 'Wastafel',
    icon: '🚰',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'sabun',
    label: 'Sabun',
    icon: '🧼',
    type: 'availability',
    required: true,
    options: [
      { value: AvailabilityValue.AVAILABLE, label: 'Terisi', icon: '✅', color: 'success' },
      { value: AvailabilityValue.EMPTY, label: 'Kosong', icon: '❌', color: 'danger' },
      { value: AvailabilityValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'closet',
    label: 'Closet',
    icon: '🚽',
    type: 'cleanliness',
    required: true,
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'tissue_roll',
    label: 'Tissue Roll',
    icon: '🧻',
    type: 'availability',
    required: true,
    options: [
      { value: AvailabilityValue.AVAILABLE, label: 'Terisi', icon: '✅', color: 'success' },
      { value: AvailabilityValue.EMPTY, label: 'Kosong', icon: '❌', color: 'danger' },
      { value: AvailabilityValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'urinoir',
    label: 'Urinoir',
    icon: '🚹',
    type: 'cleanliness',
    required: false, // Not all toilets have urinals
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  },
  {
    id: 'hand_dryer',
    label: 'Hand Dryer',
    icon: '💨',
    type: 'cleanliness',
    required: false, // Not all toilets have hand dryers
    options: [
      { value: CleanlinessValue.CLEAN, label: 'Bersih', icon: '✅', color: 'success' },
      { value: CleanlinessValue.DIRTY, label: 'Kotor', icon: '❌', color: 'danger' },
      { value: CleanlinessValue.OTHER, label: 'Lainnya', icon: '❓', color: 'warning' }
    ]
  }
];
// Default values for all assessments (all good scenario)
export const getDefaultAssessments = (): import('@/core/types/interfaces').Assessments => ({
  aroma: { value: AromaValue.FRAGRANT, comment: null },
  lantai: { value: CleanlinessValue.CLEAN, comment: null },
  dinding: { value: CleanlinessValue.CLEAN, comment: null },
  tempat_sampah: { value: CleanlinessValue.CLEAN, comment: null },
  cermin: { value: CleanlinessValue.CLEAN, comment: null },
  wastafel: { value: CleanlinessValue.CLEAN, comment: null },
  sabun: { value: AvailabilityValue.AVAILABLE, comment: null },
  closet: { value: CleanlinessValue.CLEAN, comment: null },
  tissue_roll: { value: AvailabilityValue.AVAILABLE, comment: null },
  urinoir: { value: CleanlinessValue.CLEAN, comment: null },
  hand_dryer: { value: CleanlinessValue.CLEAN, comment: null }
});

// Helper to check if assessment has issues
export const hasAssessmentIssues = (
  assessments: import('@/core/types/interfaces').Assessments
): boolean => {
  return Object.values(assessments).some(
    (item) => 
      item.value === CleanlinessValue.DIRTY ||
      item.value === CleanlinessValue.OTHER ||
      item.value === AromaValue.SMELLY ||
      item.value === AromaValue.OTHER ||
      item.value === AvailabilityValue.EMPTY ||
      item.value === AvailabilityValue.OTHER
  );
};

// Get assessment config by id
export const getAssessmentConfig = (
  id: keyof import('@/core/types/interfaces').Assessments
): AssessmentConfig | undefined => {
  return ASSESSMENT_CONFIGS.find(config => config.id === id);
};

// Validate assessments
export const validateAssessments = (
  assessments: import('@/core/types/interfaces').Assessments
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  ASSESSMENT_CONFIGS.forEach(config => {
    if (!config.required) return;

    const assessment = assessments[config.id];
    if (!assessment || !assessment.value) {
      errors.push(`${config.label} wajib diisi`);
    }

    // If "other" is selected, comment is required
    if (assessment?.value === 'other' && !assessment.comment) {
      errors.push(`${config.label}: Komentar wajib diisi untuk pilihan "Lainnya"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};