// src/lib/utils/scoring.ts
import { Assessments } from '@/core/types/interfaces';
import { CleanlinessValue, AromaValue, AvailabilityValue } from '@/core/types/enums';

export const calculateInspectionScore = (assessments: Assessments): number => {
  const weights = {
    aroma: 10,
    lantai: 12,
    dinding: 8,
    tempat_sampah: 10,
    cermin: 8,
    wastafel: 10,
    sabun: 12,
    closet: 15,
    tissue_roll: 10,
    urinoir: 5,
    hand_dryer: 5
  };

  let totalScore = 0;
  let totalWeight = 0;

  Object.entries(assessments).forEach(([key, assessment]) => {
    const weight = weights[key as keyof typeof weights] || 5;
    totalWeight += weight;

    let itemScore = 0;
    const value = assessment.value;

    // Scoring logic
    if (value === CleanlinessValue.CLEAN || 
        value === AromaValue.FRAGRANT || 
        value === AvailabilityValue.AVAILABLE) {
      itemScore = 100;
    } else if (value === CleanlinessValue.DIRTY || 
               value === AromaValue.SMELLY || 
               value === AvailabilityValue.EMPTY) {
      itemScore = 40;
    } else if (value === 'other') {
      itemScore = 60; // Partial score for "other"
    }

    totalScore += itemScore * weight;
  });

  return Math.round(totalScore / totalWeight);
};

export const getScoreGrade = (score: number): {
  grade: string;
  label: string;
  color: string;
  icon: string;
} => {
  if (score >= 95) {
    return { grade: 'A', label: 'Excellent', color: '#10b981', icon: '⭐' };
  } else if (score >= 85) {
    return { grade: 'B', label: 'Good', color: '#3b82f6', icon: '✅' };
  } else if (score >= 75) {
    return { grade: 'C', label: 'Fair', color: '#f59e0b', icon: '⚠️' };
  } else {
    return { grade: 'D', label: 'Poor', color: '#ef4444', icon: '❌' };
  }
};
// Example usage:
// const score = calculateInspectionScore(assessments);
// const gradeInfo = getScoreGrade(score);

// ============================================================================
// END UTILITIES
// ============================================================================