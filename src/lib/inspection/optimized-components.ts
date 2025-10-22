// Optimized Inspection Components - Modern & Professional
export interface InspectionComponent {
  id: string;
  name: string;
  type: 'radio' | 'checkbox' | 'slider' | 'rating' | 'photo' | 'text';
  required: boolean;
  order: number;
  options?: string[];
  description?: string;
  icon?: string;
}

export const OPTIMIZED_INSPECTION_COMPONENTS: InspectionComponent[] = [
  {
    id: 'overall_cleanliness',
    name: 'Kebersihan Umum',
    type: 'rating',
    required: true,
    order: 1,
    description: 'Kondisi kebersihan keseluruhan toilet',
    icon: '🧹'
  },
  {
    id: 'toilet_bowl',
    name: 'Toilet Bowl',
    type: 'radio',
    required: true,
    order: 2,
    options: ['Bersih', 'Kotor', 'Sangat Kotor', 'Rusak'],
    description: 'Kondisi toilet bowl',
    icon: '🚽'
  },
  {
    id: 'sink_condition',
    name: 'Wastafel',
    type: 'radio',
    required: true,
    order: 3,
    options: ['Bersih', 'Kotor', 'Tidak Berfungsi', 'Rusak'],
    description: 'Kondisi wastafel dan keran',
    icon: '🚰'
  },
  {
    id: 'soap_available',
    name: 'Sabun Tersedia',
    type: 'checkbox',
    required: true,
    order: 4,
    description: 'Ketersediaan sabun cuci tangan',
    icon: '🧼'
  },
  {
    id: 'tissue_available',
    name: 'Tissue Tersedia',
    type: 'checkbox',
    required: true,
    order: 5,
    description: 'Ketersediaan tissue toilet',
    icon: '🧻'
  },
  {
    id: 'lighting_condition',
    name: 'Pencahayaan',
    type: 'slider',
    required: true,
    order: 6,
    description: 'Kondisi pencahayaan (1-10)',
    icon: '💡'
  },
  {
    id: 'ventilation',
    name: 'Ventilasi',
    type: 'radio',
    required: true,
    order: 7,
    options: ['Baik', 'Cukup', 'Buruk', 'Tidak Ada'],
    description: 'Kondisi ventilasi udara',
    icon: '💨'
  },
  {
    id: 'door_lock',
    name: 'Pintu & Kunci',
    type: 'radio',
    required: true,
    order: 8,
    options: ['Berfungsi', 'Rusak', 'Tidak Ada'],
    description: 'Kondisi pintu dan kunci',
    icon: '🚪'
  },
  {
    id: 'floor_condition',
    name: 'Lantai',
    type: 'radio',
    required: true,
    order: 9,
    options: ['Bersih & Kering', 'Basah', 'Kotor', 'Licin'],
    description: 'Kondisi lantai toilet',
    icon: '🏠'
  },
  {
    id: 'smell_condition',
    name: 'Bau',
    type: 'slider',
    required: true,
    order: 10,
    description: 'Tingkat bau tidak sedap (1-10)',
    icon: '👃'
  },
  {
    id: 'maintenance_notes',
    name: 'Catatan Perbaikan',
    type: 'text',
    required: false,
    order: 11,
    description: 'Catatan khusus untuk perbaikan',
    icon: '📝'
  }
];

export interface InspectionResponse {
  componentId: string;
  value: string | number | boolean;
  notes?: string;
  photos?: string[];
}

export class InspectionOptimizer {
  static getComponents(): InspectionComponent[] {
    return OPTIMIZED_INSPECTION_COMPONENTS.sort((a, b) => a.order - b.order);
  }

  static calculateOverallScore(responses: InspectionResponse[]): {
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    color: string;
    icon: string;
  } {
    if (responses.length === 0) {
      return {
        score: 0,
        status: 'fair',
        color: '#F59E0B',
        icon: '⚠️'
      };
    }

    let totalScore = 0;
    let maxScore = 0;

    responses.forEach(response => {
      const component = OPTIMIZED_INSPECTION_COMPONENTS.find(c => c.id === response.componentId);
      if (!component) return;

      let score = 0;
      if (component.type === 'rating') {
        score = Number(response.value) || 0;
        maxScore += 5; // Max 5 stars
      } else if (component.type === 'slider') {
        score = Number(response.value) || 0;
        maxScore += 10; // Max 10
      } else if (component.type === 'radio') {
        const options = component.options || [];
        const valueIndex = options.indexOf(response.value as string);
        score = options.length - valueIndex; // Higher index = better
        maxScore += options.length;
      } else if (component.type === 'checkbox') {
        score = response.value ? 1 : 0;
        maxScore += 1;
      }

      totalScore += score;
    });

    const percentage = (totalScore / maxScore) * 100;

    if (percentage >= 90) {
      return { score: percentage, status: 'excellent', color: '#10B981', icon: '✅' };
    } else if (percentage >= 70) {
      return { score: percentage, status: 'good', color: '#3B82F6', icon: '👍' };
    } else if (percentage >= 50) {
      return { score: percentage, status: 'fair', color: '#F59E0B', icon: '⚠️' };
    } else if (percentage >= 30) {
      return { score: percentage, status: 'poor', color: '#EF4444', icon: '❌' };
    } else {
      return { score: percentage, status: 'critical', color: '#DC2626', icon: '🚨' };
    }
  }

  static getComponentIcon(componentId: string): string {
    const component = OPTIMIZED_INSPECTION_COMPONENTS.find(c => c.id === componentId);
    return component?.icon || '📋';
  }

  static getComponentDescription(componentId: string): string {
    const component = OPTIMIZED_INSPECTION_COMPONENTS.find(c => c.id === componentId);
    return component?.description || '';
  }
}
