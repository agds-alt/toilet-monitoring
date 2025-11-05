// src/lib/constants/assessments.ts
// Assessment configuration constants

export const ASSESSMENT_CONFIGS = {
  scoring: {
    excellent: { min: 90, label: 'Excellent', color: 'green' },
    good: { min: 80, label: 'Good', color: 'blue' },
    fair: { min: 70, label: 'Fair', color: 'yellow' },
    poor: { min: 60, label: 'Poor', color: 'orange' },
    fail: { min: 0, label: 'Fail', color: 'red' },
  },
  passingScore: 70,
  maxScore: 100,
};
