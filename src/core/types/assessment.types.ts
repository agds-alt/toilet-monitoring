// ===================================
// 📁 src/core/types/assessment.types.ts
// Assessment Types
// ===================================
export interface AssessmentItem {
  key: string;
  label: string;
  icon: string;
  weight: number;
}

export const ASSESSMENT_ITEMS: AssessmentItem[] = [
  { key: 'aroma', label: 'Aroma / Bau', icon: '👃', weight: 1.5 },
  { key: 'lantai', label: 'Kebersihan Lantai', icon: '🧹', weight: 1.2 },
  { key: 'dinding', label: 'Kebersihan Dinding', icon: '🧱', weight: 1.0 },
  { key: 'wastafel', label: 'Kebersihan Wastafel', icon: '🚰', weight: 1.2 },
  { key: 'cermin', label: 'Kebersihan Cermin', icon: '🪞', weight: 1.0 },
  { key: 'closet', label: 'Kebersihan Closet', icon: '🚽', weight: 1.5 },
  { key: 'urinoir', label: 'Kebersihan Urinoir', icon: '🚿', weight: 1.0 },
  { key: 'sabun', label: 'Ketersediaan Sabun', icon: '🧼', weight: 1.2 },
  { key: 'tissue', label: 'Ketersediaan Tissue', icon: '🧻', weight: 1.2 },
  { key: 'pewangi', label: 'Ketersediaan Pewangi', icon: '🌸', weight: 1.0 },
  { key: 'sampah', label: 'Kondisi Tempat Sampah', icon: '🗑️', weight: 1.0 },
];

export interface AssessmentValue {
  rawValue: string | number;
  normalizedValue: number; // 1-5
  inputMode: 'stars' | 'emoji' | 'checkbox';
  comment?: string;
}

export interface AssessmentData {
  [key: string]: AssessmentValue;
}
