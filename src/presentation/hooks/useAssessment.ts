// src/presentation/hooks/useAssessment.ts
import { useState, useCallback } from 'react';
import { SubmitAssessmentUseCase } from '../../core/use-cases/SubmitAssessmentUseCase';
import { AssessmentRepository } from '../../infrastructure/database/repositories/AssessmentRepository';
import { Assessments } from '../../core/entities/Assessment';
import { AssessmentSubmission } from '../../core/types/assessment.types';

export interface UseAssessmentOptions {
  locationId: string;
  userId: string;
  onSuccess?: (inspectionId: string) => void;
  onError?: (error: string) => void;
}

export const useAssessment = ({ locationId, userId, onSuccess, onError }: UseAssessmentOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssessment = useCallback(async (assessments: Assessments, overallComment?: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const repository = new AssessmentRepository();
      const useCase = new SubmitAssessmentUseCase(repository);

      const submission: AssessmentSubmission = {
        locationId,
        userId,
        assessments,
        overallComment,
        status: 'completed'
      };

      const inspectionId = await useCase.execute(submission);
      
      onSuccess?.(inspectionId);
      return inspectionId;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal mengirim assessment';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [locationId, userId, onSuccess, onError]);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    submitAssessment,
    isSubmitting,
    error,
    resetError
  };
};