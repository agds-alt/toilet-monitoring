// src/core/types/assessment.types.ts
export interface AssessmentSubmission {
  assessments: Assessments;
  locationId: string;
  userId: string;
  photoData?: string;
  geoData?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  notes?: string;
}

export interface Assessments {
  [key: string]: {
    rating: number;
    comment?: string;
  };
}

export type InspectionStatus = 'Clean' | 'Needs Work' | 'Dirty';
