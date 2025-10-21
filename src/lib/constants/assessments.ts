// src/lib/constants/assessments.ts
export interface AssessmentCategory {
  id: string;
  name: string;
  label: string;
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  { id: 'toilet_bowl', name: 'Toilet Bowl', label: 'Kloset' },
  { id: 'floor', name: 'Floor', label: 'Lantai' },
  { id: 'wall', name: 'Wall', label: 'Dinding' },
  { id: 'sink', name: 'Sink', label: 'Wastafel' },
  { id: 'soap', name: 'Soap', label: 'Sabun' },
  { id: 'tissue', name: 'Tissue', label: 'Tisu' },
  { id: 'trash', name: 'Trash Bin', label: 'Tempat Sampah' },
  { id: 'door', name: 'Door', label: 'Pintu' },
  { id: 'ventilation', name: 'Ventilation', label: 'Ventilasi' },
  { id: 'lighting', name: 'Lighting', label: 'Pencahayaan' },
  { id: 'smell', name: 'Smell', label: 'Aroma' },
];

export const ASSESSMENT_CONFIGS = ASSESSMENT_CATEGORIES;

export function validateAssessments(assessments: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!assessments || typeof assessments !== 'object') {
    errors.push('Assessments must be an object');
    return { valid: false, errors };
  }

  const values = Object.values(assessments);
  if (values.length === 0) {
    errors.push('At least one assessment is required');
  }

  values.forEach((assessment: any) => {
    if (assessment.rating < 1 || assessment.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
