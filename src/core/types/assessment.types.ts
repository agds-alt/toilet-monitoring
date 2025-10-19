export interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  weight: number;
}

export interface AssessmentFormData {
  assessments: Record<string, {
    value: number;
    notes: string;
    timestamp: string;
  }>;
  overallComment?: string;
}

export interface AssessmentSubmission {
  locationId: string;
  userId: string;
  assessments: Record<string, {
    value: number;
    notes: string;
    timestamp: string;
  }>;
  overallComment?: string;
  status: 'completed' | 'in_progress';
}

export const ASSESSMENT_STANDARDS = {
  CLEANLINESS: {
    EXCELLENT: 5,
    GOOD: 4,
    FAIR: 3,  
    POOR: 2,
    VERY_POOR: 1
  },
  SUPPLIES: {
    COMPLETE: 5,
    ADEQUATE: 4,
    LIMITED: 3,
    LOW: 2,
    EMPTY: 1
  },
  FUNCTIONALITY: {
    PERFECT: 5,
    GOOD: 4,
    FAIR: 3,
    POOR: 2,
    BROKEN: 1
  }
} as const;
