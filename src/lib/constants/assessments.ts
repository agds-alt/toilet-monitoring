import { AssessmentCategory } from '../../../core/types/assessment.types';

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    id: 'cleanliness',
    name: 'Kebersihan',
    description: 'Tingkat kebersihan keseluruhan toilet',
    weight: 3,
    criteria: [
      'Lantai bersih dan kering',
      'Toilet bowl bersih tanpa noda',
      'Tempat sampah tidak penuh',
      'Tidak ada bau tidak sedap',
      'Cermin dan wastafel bersih'
    ]
  },
  {
    id: 'supplies',
    name: 'Ketersediaan Supplies',
    description: 'Kelengkapan bahan habis pakai',
    weight: 2,
    criteria: [
      'Tissue toilet tersedia',
      'Sabun/handsanitizer tersedia',
      'Tissue wastafel tersedia',
      'Pengering tangan berfungsi',
      'Tempat sampah ada liner'
    ]
  },
  {
    id: 'functionality', 
    name: 'Fungsionalitas',
    description: 'Kondisi dan fungsi peralatan',
    weight: 2,
    criteria: [
      'Toilet flush berfungsi',
      'Kran air berfungsi normal',
      'Pintu bisa dikunci dengan baik',
      'Penerangan cukup',
      'Ventilasi berfungsi'
    ]
  },
  {
    id: 'safety',
    name: 'Keamanan',
    description: 'Faktor keamanan dan aksesibilitas',
    weight: 1,
    criteria: [
      'Lantai tidak licin',
      'Pegangan tangan tersedia (jika needed)',
      'Tanda kebersihan jelas',
      'Akses mudah untuk difabel',
      'Emergency call system (jika ada)'
    ]
  }
];

export const getCategoryById = (id: string): AssessmentCategory | undefined =>
  ASSESSMENT_CATEGORIES.find(category => category.id === id);

export const getCategoriesByWeight = (minWeight: number = 1): AssessmentCategory[] =>
  ASSESSMENT_CATEGORIES.filter(category => category.weight >= minWeight);
