// ===================================
// 5. VALIDATE ASSESSMENT USE CASE (yang ketinggalan)
// ===================================

// src/core/use-cases/ValidateAssessment.ts
import { Assessments } from '@/core/types/interfaces';
import { validateAssessments } from '@/lib/constants/assessments';

export class ValidateAssessmentUseCase {
  execute(assessments: Assessments): {
    valid: boolean;
    errors: string[];
    score: number;
  } {
    const validation = validateAssessments(assessments);
    
    // Calculate basic score
    const totalItems = Object.keys(assessments).length;
    const goodItems = Object.values(assessments).filter(
      item => 
        item.value === 'bersih' || 
        item.value === 'wangi' || 
        item.value === 'terisi'
    ).length;
    
    const score = Math.round((goodItems / totalItems) * 100);

    return {
      valid: validation.valid,
      errors: validation.errors,
      score
    };
  }
}