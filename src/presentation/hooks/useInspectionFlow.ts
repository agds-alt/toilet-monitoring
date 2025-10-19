// src/presentation/hooks/useInspectionFlow.ts
import { useState } from 'react';
import { InspectionStatus, Assessments } from '../../../core/types/interfaces';

export type InspectionStep = 'assessment' | 'photos' | 'review' | 'complete';

export interface InspectionData {
  locationId: string;
  assessments: Assessments;
  overallComment?: string;
  photoUrls: string[];
  status: InspectionStatus;
}

export const useInspectionFlow = (locationId: string) => {
  const [currentStep, setCurrentStep] = useState<InspectionStep>('assessment');
  const [inspectionData, setInspectionData] = useState<InspectionData>({
    locationId,
    assessments: {},
    photoUrls: [],
    status: 'in_progress'
  });

  const updateAssessments = (assessments: Assessments, overallComment?: string) => {
    setInspectionData(prev => ({
      ...prev,
      assessments,
      overallComment
    }));
    setCurrentStep('photos');
  };

  const updatePhotos = (photoUrls: string[]) => {
    setInspectionData(prev => ({
      ...prev,
      photoUrls
    }));
    setCurrentStep('review');
  };

  const goToStep = (step: InspectionStep) => {
    setCurrentStep(step);
  };

  const getStepProgress = () => {
    const steps: InspectionStep[] = ['assessment', 'photos', 'review', 'complete'];
    return {
      current: steps.indexOf(currentStep) + 1,
      total: steps.length
    };
  };

  return {
    currentStep,
    inspectionData,
    updateAssessments,
    updatePhotos,
    goToStep,
    getStepProgress
  };
};